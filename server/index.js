import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import pool from './db.js'

function parseBahanList(rawBahan) {
  if (!rawBahan) return []
  return typeof rawBahan === 'string' ? JSON.parse(rawBahan) : rawBahan
}

const nutrientKeys = ['energi', 'protein', 'lemak', 'karbohidrat', 'serat', 'natrium']

function parseNutritionNumber(value) {
  const parsed = parseFloat(String(value ?? '').replace(',', '.').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

function formatNutritionTotals(totals) {
  return {
    energi: `${Math.round(totals.energi)} kkal`,
    protein: `${totals.protein.toFixed(1)} g`,
    lemak: `${totals.lemak.toFixed(1)} g`,
    karbohidrat: `${totals.karbohidrat.toFixed(1)} g`,
    serat: `${totals.serat.toFixed(1)} g`,
    natrium: `${Math.round(totals.natrium)} mg`,
    calculated: true
  }
}

function normalizeMenuIngredient(row, input) {
  const jumlah = parseNutritionNumber(input.jumlah ?? input.berat ?? input.takaran)
  return {
    id_nutrition: row.id,
    nama: row.nama,
    jumlah,
    satuan: 'gram',
    takaran: `~${jumlah} g`
  }
}

async function calculateMenuNutrition(bahan = []) {
  if (!Array.isArray(bahan) || bahan.length === 0) {
    throw new Error('Menu harus memiliki minimal satu bahan dari database nutrisi.')
  }

  const totals = nutrientKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
  const normalizedBahan = []

  for (const item of bahan) {
    const idNutrition = item.id_nutrition || item.id
    if (!idNutrition) {
      throw new Error(`Bahan ${item.nama || ''} belum terhubung ke database nutrisi.`)
    }

    const [rows] = await pool.query(
      'SELECT * FROM nutrition_database WHERE id = ? AND status = "active" LIMIT 1',
      [idNutrition]
    )
    if (rows.length === 0) {
      throw new Error(`Bahan ${item.nama || idNutrition} belum tersedia atau belum disetujui Ahli Gizi.`)
    }

    const row = rows[0]
    const normalized = normalizeMenuIngredient(row, item)
    if (!normalized.jumlah || normalized.jumlah <= 0) {
      throw new Error(`Jumlah bahan ${row.nama} harus lebih dari 0 gram per porsi.`)
    }

    const factor = normalized.jumlah / 100
    totals.energi += parseNutritionNumber(row.energi) * factor
    totals.protein += parseNutritionNumber(row.protein) * factor
    totals.lemak += parseNutritionNumber(row.lemak) * factor
    totals.karbohidrat += parseNutritionNumber(row.karbohidrat) * factor
    totals.serat += parseNutritionNumber(row.serat) * factor
    totals.natrium += parseNutritionNumber(row.natrium) * factor
    normalizedBahan.push(normalized)
  }

  return {
    bahan: normalizedBahan,
    nilai_gizi: formatNutritionTotals(totals)
  }
}

async function prepareStockDeductions(connection, { idDapur, idMenu, jumlahPorsi }) {
  const [menus] = await connection.query('SELECT nama_menu, bahan FROM menus WHERE id_menu = ?', [idMenu])
  if (menus.length === 0) {
    throw new Error('Menu tidak ditemukan.')
  }

  const menuName = menus[0].nama_menu
  const bahanList = parseBahanList(menus[0].bahan)
  const [stokRows] = await connection.query(
    'SELECT id_stok, nama_bahan, jumlah, satuan FROM dapur_stok WHERE id_dapur = ?',
    [idDapur]
  )

  const deductions = []
  for (const b of bahanList) {
    const reqNama = (b.nama || '').toLowerCase()
    let reqQty = parseFloat((b.takaran || '').replace(/[^0-9.]/g, ''))
    if (isNaN(reqQty)) reqQty = 0
    const takaran = (b.takaran || '').toLowerCase()
    const isGram = takaran.includes('g') && !takaran.includes('kg')

    const match = stokRows.find((s) => s.nama_bahan.toLowerCase() === reqNama)
    if (!match) {
      throw new Error(`Bahan ${b.nama} belum terdaftar di stok dapur ini.`)
    }

    let needed = reqQty * (jumlahPorsi || 0)
    if (isGram && match.satuan.toLowerCase() === 'kg') {
      needed = needed / 1000
    }

    if (match.jumlah < needed) {
      throw new Error(`Stok ${b.nama} tidak mencukupi (Tersedia: ${match.jumlah} ${match.satuan}, Butuh: ${needed} ${match.satuan}).`)
    }

    deductions.push({
      id_stok: match.id_stok,
      nama_bahan: match.nama_bahan,
      needed,
      satuan: match.satuan,
      new_jumlah: match.jumlah - needed,
    })
  }

  return { menuName, deductions }
}

async function applyStockDeductions(connection, { idDapur, menuName, jumlahPorsi, deductions }) {
  for (const d of deductions) {
    await connection.query('UPDATE dapur_stok SET jumlah = ? WHERE id_stok = ?', [d.new_jumlah, d.id_stok])
    await connection.query(
      'INSERT INTO dapur_stok_history (id_dapur, nama_bahan, tipe, jumlah, satuan, keterangan) VALUES (?,?,?,?,?,?)',
      [idDapur, d.nama_bahan, 'DEBIT', d.needed, d.satuan, `Masak ${menuName} (${jumlahPorsi || 0} Porsi)`]
    )
  }
}

const uploadRoot = path.resolve(process.cwd(), 'public', 'uploads')
const menuPhotoDir = path.join(uploadRoot, 'menu-photos')
fs.mkdirSync(menuPhotoDir, { recursive: true })

// Auto-migrate: create dapur_stok_history table
pool.query(`
  CREATE TABLE IF NOT EXISTS dapur_stok_history (
    id_log INT PRIMARY KEY AUTO_INCREMENT,
    id_dapur INT NOT NULL,
    nama_bahan VARCHAR(150) NOT NULL,
    tipe ENUM('CREDIT', 'DEBIT', 'KOREKSI') NOT NULL,
    jumlah DECIMAL(10,2) NOT NULL,
    satuan VARCHAR(20) NOT NULL,
    keterangan VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_dapur) REFERENCES dapur(id_dapur) ON DELETE CASCADE
  )
`).then(() => {
  console.log('✅ Table dapur_stok_history is ready.')
  return pool.query(`
    ALTER TABLE produksi MODIFY COLUMN status ENUM('pending','persiapan','memasak','siap_kirim','selesai') DEFAULT 'pending'
  `)
}).then(() => {
  console.log('✅ Table produksi status column updated to include pending.')
  return pool.query('SHOW COLUMNS FROM menus LIKE "foto_url"')
}).then(([columns]) => {
  if (columns.length > 0) return null
  return pool.query('ALTER TABLE menus ADD COLUMN foto_url VARCHAR(255) NULL AFTER nilai_gizi')
}).then(() => {
  console.log('Table menus foto_url column is ready.')
  return pool.query('SHOW COLUMNS FROM nutrition_database')
}).then(([columns]) => {
  const existing = new Set(columns.map(col => col.Field))
  const migrations = []
  const numericColumns = ['protein', 'lemak', 'karbohidrat', 'serat', 'natrium']
  for (const column of numericColumns) {
    if (!existing.has(column)) {
      migrations.push(pool.query(`ALTER TABLE nutrition_database ADD COLUMN ${column} DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER energi`))
    }
  }
  if (!existing.has('status')) {
    migrations.push(pool.query('ALTER TABLE nutrition_database ADD COLUMN status ENUM("active","retired") NOT NULL DEFAULT "active" AFTER natrium'))
  }
  if (!existing.has('updated_at')) {
    migrations.push(pool.query('ALTER TABLE nutrition_database ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at'))
  }
  return Promise.all(migrations)
}).then(() => {
  return pool.query(`
    CREATE TABLE IF NOT EXISTS nutrition_requests (
      id_request INT PRIMARY KEY AUTO_INCREMENT,
      id_vendor INT NULL,
      requested_by INT NULL,
      nama VARCHAR(150) NOT NULL,
      kategori VARCHAR(50) NULL,
      catatan TEXT NULL,
      status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
      reviewed_by INT NULL,
      id_nutrition INT NULL,
      review_note TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      reviewed_at DATETIME NULL,
      FOREIGN KEY (id_vendor) REFERENCES vendors(id_vendor) ON DELETE SET NULL,
      FOREIGN KEY (requested_by) REFERENCES users(id_user) ON DELETE SET NULL,
      FOREIGN KEY (reviewed_by) REFERENCES users(id_user) ON DELETE SET NULL,
      FOREIGN KEY (id_nutrition) REFERENCES nutrition_database(id) ON DELETE SET NULL
    )
  `)
}).then(() => {
  console.log('Table nutrition database and requests are ready.')
}).catch(err => {
  console.error('❌ Failed to run auto-migrations:', err.message)
})

const app = express()
app.use(cors())
app.use(express.json({ limit: '8mb' }))
app.use('/uploads', express.static(uploadRoot))

// ============================================
// AUTH
// ============================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password])
    if (rows.length === 0) return res.status(401).json({ error: 'Email atau password salah' })
    const user = rows[0]
    delete user.password
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ============================================
// USERS
// ============================================
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id_user, name, email, role, status, created_at FROM users')
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// SEKOLAH
// ============================================
app.get('/api/sekolah', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sekolah ORDER BY nama_sekolah')
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/sekolah/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sekolah WHERE id_sekolah = ?', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: 'Sekolah tidak ditemukan' })
    res.json(rows[0])
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/sekolah/by-user/:userId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sekolah WHERE id_user = ? LIMIT 1', [req.params.userId])
    if (rows.length === 0) return res.status(404).json({ error: 'Sekolah untuk user ini tidak ditemukan' })
    res.json(rows[0])
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/sekolah', async (req, res) => {
  try {
    const { nama_sekolah, alamat, jenjang, jumlah_siswa, alergi_count, intoleran_count } = req.body
    const [result] = await pool.query(
      'INSERT INTO sekolah (nama_sekolah, alamat, jenjang, jumlah_siswa, alergi_count, intoleran_count) VALUES (?,?,?,?,?,?)',
      [nama_sekolah, alamat, jenjang, jumlah_siswa || 0, alergi_count || 0, intoleran_count || 0]
    )
    res.status(201).json({ id_sekolah: result.insertId, ...req.body })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/sekolah/:id', async (req, res) => {
  try {
    const { nama_sekolah, alamat, jenjang, jumlah_siswa, alergi_count, intoleran_count } = req.body
    await pool.query(
      'UPDATE sekolah SET nama_sekolah=?, alamat=?, jenjang=?, jumlah_siswa=?, alergi_count=?, intoleran_count=? WHERE id_sekolah=?',
      [nama_sekolah, alamat, jenjang, jumlah_siswa, alergi_count, intoleran_count, req.params.id]
    )
    res.json({ message: 'Updated' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.delete('/api/sekolah/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM sekolah WHERE id_sekolah = ?', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// VENDORS
// ============================================
app.get('/api/vendors', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vendors ORDER BY nama_vendor')
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/vendors/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vendors WHERE id_vendor = ?', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: 'Vendor tidak ditemukan' })
    res.json(rows[0])
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/vendors/by-user/:userId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vendors WHERE id_user = ? LIMIT 1', [req.params.userId])
    if (rows.length === 0) return res.status(404).json({ error: 'Vendor untuk user ini tidak ditemukan' })
    res.json(rows[0])
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/vendors', async (req, res) => {
  try {
    const { nama_vendor, region, izin_usaha, status_verifikasi } = req.body
    const [result] = await pool.query(
      'INSERT INTO vendors (nama_vendor, region, izin_usaha, status_verifikasi) VALUES (?,?,?,?)',
      [nama_vendor, region, izin_usaha, status_verifikasi || 'pending']
    )
    res.status(201).json({ id_vendor: result.insertId, ...req.body })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/vendors/:id', async (req, res) => {
  try {
    const { nama_vendor, region, izin_usaha, status_verifikasi } = req.body
    await pool.query(
      'UPDATE vendors SET nama_vendor=?, region=?, izin_usaha=?, status_verifikasi=? WHERE id_vendor=?',
      [nama_vendor, region, izin_usaha, status_verifikasi, req.params.id]
    )
    res.json({ message: 'Updated' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.delete('/api/vendors/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM vendors WHERE id_vendor = ?', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// DAPUR (Kitchens)
// ============================================
app.get('/api/dapur', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, v.nama_vendor 
      FROM dapur d 
      JOIN vendors v ON d.id_vendor = v.id_vendor 
      ORDER BY d.lokasi
    `)
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/dapur', async (req, res) => {
  try {
    const { id_vendor, lokasi, kapasitas_produksi } = req.body
    const [result] = await pool.query(
      'INSERT INTO dapur (id_vendor, lokasi, kapasitas_produksi) VALUES (?,?,?)',
      [id_vendor, lokasi, kapasitas_produksi || 0]
    )
    res.status(201).json({ id_dapur: result.insertId, ...req.body })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/dapur/:id', async (req, res) => {
  try {
    const { id_vendor, lokasi, kapasitas_produksi } = req.body
    await pool.query(
      'UPDATE dapur SET id_vendor=?, lokasi=?, kapasitas_produksi=? WHERE id_dapur=?',
      [id_vendor, lokasi, kapasitas_produksi, req.params.id]
    )
    res.json({ message: 'Updated' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.delete('/api/dapur/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM dapur WHERE id_dapur = ?', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// MAPPING DAPUR-SEKOLAH
// ============================================
app.get('/api/mapping', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.*, d.lokasi AS dapur_lokasi, s.nama_sekolah 
      FROM mapping_dapur_sekolah m
      JOIN dapur d ON m.id_dapur = d.id_dapur
      JOIN sekolah s ON m.id_sekolah = s.id_sekolah
    `)
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/mapping', async (req, res) => {
  try {
    const { id_dapur, id_sekolah } = req.body
    const [result] = await pool.query(
      'INSERT INTO mapping_dapur_sekolah (id_dapur, id_sekolah) VALUES (?,?)',
      [id_dapur, id_sekolah]
    )
    res.status(201).json({ id_mapping: result.insertId, ...req.body })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.delete('/api/mapping/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM mapping_dapur_sekolah WHERE id_mapping = ?', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// MENUS
// ============================================
app.post('/api/uploads/menu-photo', async (req, res) => {
  try {
    const { imageData, fileName } = req.body
    const match = /^data:(image\/(?:png|jpe?g|webp));base64,([A-Za-z0-9+/=]+)$/.exec(imageData || '')
    if (!match) return res.status(400).json({ error: 'Format foto harus PNG, JPG, atau WebP.' })

    const extensionMap = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/webp': 'webp'
    }
    const extension = extensionMap[match[1]]
    const buffer = Buffer.from(match[2], 'base64')
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'Ukuran foto maksimal 5MB.' })
    }

    const safeBaseName = path.basename(fileName || 'menu').replace(/\.[^.]+$/, '').replace(/[^a-z0-9-]+/gi, '-').slice(0, 40) || 'menu'
    const storedName = `${Date.now()}-${safeBaseName}.${extension}`
    fs.writeFileSync(path.join(menuPhotoDir, storedName), buffer)

    res.status(201).json({ foto_url: `/uploads/menu-photos/${storedName}` })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/menus', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.*, v.nama_vendor 
      FROM menus m 
      JOIN vendors v ON m.id_vendor = v.id_vendor 
      ORDER BY m.tanggal DESC
    `)
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/menus/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM menus WHERE id_menu = ?', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: 'Menu tidak ditemukan' })
    res.json(rows[0])
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/menus', async (req, res) => {
  try {
    const { id_vendor, nama_menu, bahan, tanggal, foto_url } = req.body
    const calculatedMenu = await calculateMenuNutrition(bahan)

    // Auto-register missing ingredients to all vendor's kitchens
    const [dapurs] = await pool.query('SELECT id_dapur FROM dapur WHERE id_vendor = ?', [id_vendor])
    if (dapurs.length > 0 && calculatedMenu.bahan && Array.isArray(calculatedMenu.bahan)) {
      for (let d of dapurs) {
        const [stokRows] = await pool.query('SELECT nama_bahan FROM dapur_stok WHERE id_dapur = ?', [d.id_dapur])
        const existingNames = stokRows.map(s => s.nama_bahan.toLowerCase())
        
        for (let b of calculatedMenu.bahan) {
          if (b.nama && !existingNames.includes(b.nama.toLowerCase())) {
            let reqQtyStr = b.takaran ? b.takaran.toLowerCase() : ''
            let isKg = reqQtyStr.includes('kg')
            let isL = reqQtyStr.includes('liter') || reqQtyStr.includes(' l')
            let satuanDef = isKg ? 'kg' : (isL ? 'liter' : (reqQtyStr.includes('g') ? 'kg' : 'pcs'))
            
            await pool.query(
              'INSERT INTO dapur_stok (id_dapur, nama_bahan, jumlah, satuan) VALUES (?,?,?,?)',
              [d.id_dapur, b.nama, 0, satuanDef]
            )
            existingNames.push(b.nama.toLowerCase())
          }
        }
      }
    }

    const [result] = await pool.query(
      'INSERT INTO menus (id_vendor, nama_menu, bahan, nilai_gizi, foto_url, tanggal) VALUES (?,?,?,?,?,?)',
      [id_vendor, nama_menu, JSON.stringify(calculatedMenu.bahan), JSON.stringify(calculatedMenu.nilai_gizi), foto_url || null, tanggal]
    )
    res.status(201).json({ id_menu: result.insertId, ...req.body, ...calculatedMenu })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/menus/:id', async (req, res) => {
  try {
    const { nama_menu, bahan, nilai_gizi, foto_url, status_validasi, notes, tanggal } = req.body
    const fields = [], values = []
    if (nama_menu !== undefined) { fields.push('nama_menu=?'); values.push(nama_menu) }
    if (bahan !== undefined) {
      const calculatedMenu = await calculateMenuNutrition(bahan)
      fields.push('bahan=?'); values.push(JSON.stringify(calculatedMenu.bahan))
      fields.push('nilai_gizi=?'); values.push(JSON.stringify(calculatedMenu.nilai_gizi))
    } else if (nilai_gizi !== undefined) {
      fields.push('nilai_gizi=?'); values.push(JSON.stringify(nilai_gizi))
    }
    if (foto_url !== undefined) { fields.push('foto_url=?'); values.push(foto_url || null) }
    if (status_validasi !== undefined) { fields.push('status_validasi=?'); values.push(status_validasi) }
    if (notes !== undefined) { fields.push('notes=?'); values.push(JSON.stringify(notes)) }
    if (tanggal !== undefined) { fields.push('tanggal=?'); values.push(tanggal) }
    if (fields.length === 0) return res.status(400).json({ error: 'Tidak ada data menu untuk diperbarui.' })
    values.push(req.params.id)
    await pool.query(`UPDATE menus SET ${fields.join(', ')} WHERE id_menu=?`, values)
    res.json({ message: 'Updated' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.delete('/api/menus/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM menus WHERE id_menu = ?', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// PRODUKSI
// ============================================
app.get('/api/produksi', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, d.lokasi AS dapur_lokasi, m.nama_menu, m.bahan, m.nilai_gizi, s.nama_sekolah AS target_sekolah, dis.kode_transaksi
      FROM produksi p
      JOIN dapur d ON p.id_dapur = d.id_dapur
      JOIN menus m ON p.id_menu = m.id_menu
      LEFT JOIN distribusi dis ON p.id_produksi = dis.id_produksi
      LEFT JOIN sekolah s ON dis.id_sekolah = s.id_sekolah
      ORDER BY p.created_at DESC
    `)
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/produksi', async (req, res) => {
  let connection
  try {
    const { id_dapur, id_menu, status, jumlah_porsi, id_sekolah } = req.body
    connection = await pool.getConnection()
    await connection.beginTransaction()

    const [menuRows] = await connection.query('SELECT status_validasi FROM menus WHERE id_menu = ?', [id_menu])
    if (menuRows.length === 0) {
      await connection.rollback()
      return res.status(400).json({ error: 'Menu tidak ditemukan.' })
    }
    if (menuRows[0].status_validasi !== 'approved') {
      await connection.rollback()
      return res.status(400).json({ error: 'Menu belum diverifikasi (approved) oleh Ahli Gizi' })
    }

    let stockPreparation = null
    if (status === 'persiapan') {
      stockPreparation = await prepareStockDeductions(connection, {
        idDapur: id_dapur,
        idMenu: id_menu,
        jumlahPorsi: jumlah_porsi,
      })
    }

    const [result] = await connection.query(
      'INSERT INTO produksi (id_dapur, id_menu, status, jumlah_porsi, waktu_mulai) VALUES (?,?,?,?,NOW())',
      [id_dapur, id_menu, status || 'pending', jumlah_porsi || 0]
    )
    const id_produksi = result.insertId

    if (id_sekolah) {
      const kode = `TX-${String(Date.now()).slice(-6)}`
      const hash = '0x' + [...Array(12)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
      await connection.query(
        'INSERT INTO distribusi (kode_transaksi, id_produksi, id_sekolah, jumlah_porsi, status, blockchain_hash) VALUES (?,?,?,?,?,?)',
        [kode, id_produksi, id_sekolah, jumlah_porsi, 'DIJADWALKAN', hash]
      )
    }

    if (stockPreparation) {
      await applyStockDeductions(connection, {
        idDapur: id_dapur,
        menuName: stockPreparation.menuName,
        jumlahPorsi: jumlah_porsi,
        deductions: stockPreparation.deductions,
      })
    }

    await connection.commit()
    res.status(201).json({ id_produksi, ...req.body })
  } catch (err) {
    if (connection) await connection.rollback()
    const statusCode = err.message.includes('tidak mencukupi') || err.message.includes('belum terdaftar') || err.message.includes('Menu tidak ditemukan.')
      ? 400
      : 500
    res.status(statusCode).json({ error: err.message })
  } finally {
    if (connection) connection.release()
  }
})

app.put('/api/produksi/:id', async (req, res) => {
  let connection
  try {
    const { status } = req.body
    connection = await pool.getConnection()
    await connection.beginTransaction()

    const [prodRows] = await connection.query('SELECT * FROM produksi WHERE id_produksi = ?', [req.params.id])
    if (prodRows.length === 0) {
      await connection.rollback()
      return res.status(404).json({ error: 'Not found' })
    }
    const p = prodRows[0]

    let stockPreparation = null
    if (status === 'persiapan' && p.status === 'pending') {
      stockPreparation = await prepareStockDeductions(connection, {
        idDapur: p.id_dapur,
        idMenu: p.id_menu,
        jumlahPorsi: p.jumlah_porsi,
      })
    }

    let extra = ''
    if (status === 'selesai') {
      extra = ', waktu_selesai=NOW()'
    } else if (status === 'memasak') {
      extra = ', waktu_mulai=NOW()'
    }
    await connection.query(`UPDATE produksi SET status=?${extra} WHERE id_produksi=?`, [status, req.params.id])

    if (stockPreparation) {
      await applyStockDeductions(connection, {
        idDapur: p.id_dapur,
        menuName: stockPreparation.menuName,
        jumlahPorsi: p.jumlah_porsi,
        deductions: stockPreparation.deductions,
      })
    }

    if (status === 'selesai') {
      await connection.query("UPDATE distribusi SET status='DISTRIBUSI', waktu_kirim=NOW() WHERE id_produksi=? AND status='DIJADWALKAN'", [req.params.id])
    }

    await connection.commit()
    res.json({ message: 'Updated' })
  } catch (err) {
    if (connection) await connection.rollback()
    const statusCode = err.message.includes('tidak mencukupi') || err.message.includes('belum terdaftar')
      ? 400
      : 500
    res.status(statusCode).json({ error: err.message })
  } finally {
    if (connection) connection.release()
  }
})

// ============================================
// DISTRIBUSI
// ============================================
app.get('/api/distribusi', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, s.nama_sekolah, m.nama_menu, p.id_menu
      FROM distribusi d
      JOIN sekolah s ON d.id_sekolah = s.id_sekolah
      JOIN produksi p ON d.id_produksi = p.id_produksi
      JOIN menus m ON p.id_menu = m.id_menu
      ORDER BY d.created_at DESC
    `)
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/distribusi', async (req, res) => {
  try {
    const { id_produksi, id_sekolah, jumlah_porsi } = req.body
    const kode = `TX-${String(Date.now()).slice(-6)}`
    const hash = '0x' + [...Array(12)].map(() => Math.floor(Math.random()*16).toString(16)).join('')
    const [result] = await pool.query(
      'INSERT INTO distribusi (kode_transaksi, id_produksi, id_sekolah, jumlah_porsi, waktu_kirim, status, blockchain_hash) VALUES (?,?,?,?,NOW(),?,?)',
      [kode, id_produksi, id_sekolah, jumlah_porsi, 'DIJADWALKAN', hash]
    )
    res.status(201).json({ id_distribusi: result.insertId, kode_transaksi: kode })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/distribusi/:id', async (req, res) => {
  try {
    const { status } = req.body
    const extra = status === 'TIBA' ? ', waktu_tiba=NOW()' : ''
    await pool.query(`UPDATE distribusi SET status=?${extra} WHERE id_distribusi=?`, [status, req.params.id])
    res.json({ message: 'Updated' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// STANDAR GIZI
// ============================================
app.get('/api/standar-gizi', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM standar_gizi ORDER BY id_standar')
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/standar-gizi', async (req, res) => {
  try {
    const { title, requirement, color, deskripsi, detail, id_user_pembuat } = req.body
    const [result] = await pool.query(
      'INSERT INTO standar_gizi (title, requirement, color, deskripsi, detail, id_user_pembuat) VALUES (?,?,?,?,?,?)',
      [title, requirement, color || 'var(--primary)', deskripsi, detail, id_user_pembuat]
    )
    res.status(201).json({ id_standar: result.insertId, ...req.body })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/standar-gizi/:id', async (req, res) => {
  try {
    const { title, requirement, color, deskripsi, detail } = req.body
    await pool.query(
      'UPDATE standar_gizi SET title=?, requirement=?, color=?, deskripsi=?, detail=? WHERE id_standar=?',
      [title, requirement, color, deskripsi, detail, req.params.id]
    )
    res.json({ message: 'Updated' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.delete('/api/standar-gizi/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM standar_gizi WHERE id_standar = ?', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// VALIDASI LOG
// ============================================
app.get('/api/validasi-log', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT v.*, m.nama_menu, u.name AS validator_name
      FROM validasi_log v
      JOIN menus m ON v.id_menu = m.id_menu
      JOIN users u ON v.id_user = u.id_user
      ORDER BY v.created_at DESC
    `)
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/validasi-log', async (req, res) => {
  try {
    const { id_menu, id_user, aksi, catatan } = req.body
    if (aksi === 'approved') {
      const [menuRows] = await pool.query('SELECT bahan, nilai_gizi FROM menus WHERE id_menu=?', [id_menu])
      if (menuRows.length === 0) return res.status(404).json({ error: 'Menu tidak ditemukan.' })
      const bahan = parseBahanList(menuRows[0].bahan)
      const nilaiGizi = typeof menuRows[0].nilai_gizi === 'string' ? JSON.parse(menuRows[0].nilai_gizi) : menuRows[0].nilai_gizi
      const isCalculated = !!nilaiGizi?.calculated
      const hasLinkedIngredients = Array.isArray(bahan) && bahan.length > 0 && bahan.every(item => item.id_nutrition)
      if (!isCalculated || !hasLinkedIngredients) {
        return res.status(400).json({ error: 'Menu belum memiliki data nutrisi terhitung dari bahan terverifikasi.' })
      }
    }
    // Also update menu status
    await pool.query('UPDATE menus SET status_validasi=? WHERE id_menu=?', [aksi, id_menu])
    const [result] = await pool.query(
      'INSERT INTO validasi_log (id_menu, id_user, aksi, catatan) VALUES (?,?,?,?)',
      [id_menu, id_user, aksi, catatan]
    )
    res.status(201).json({ id_validasi: result.insertId })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// FEEDBACK
// ============================================
app.get('/api/feedback', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT f.*, s.nama_sekolah, u.name AS user_name
      FROM feedback f
      JOIN sekolah s ON f.id_sekolah = s.id_sekolah
      JOIN users u ON f.id_user = u.id_user
      ORDER BY f.created_at DESC
    `)
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/feedback', async (req, res) => {
  try {
    const { id_sekolah, id_user, id_menu, rating, komentar, kategori } = req.body
    const [result] = await pool.query(
      'INSERT INTO feedback (id_sekolah, id_user, id_menu, rating, komentar, kategori) VALUES (?,?,?,?,?,?)',
      [id_sekolah, id_user, id_menu, rating, komentar, kategori || 'kualitas']
    )
    res.status(201).json({ id_feedback: result.insertId, ...req.body })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// KONFIRMASI KEDATANGAN
// ============================================
app.get('/api/konfirmasi', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT k.*, d.kode_transaksi, s.nama_sekolah
      FROM konfirmasi_kedatangan k
      JOIN distribusi d ON k.id_distribusi = d.id_distribusi
      JOIN sekolah s ON d.id_sekolah = s.id_sekolah
      ORDER BY k.created_at DESC
    `)
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/konfirmasi', async (req, res) => {
  try {
    const { id_distribusi, id_user, kondisi_makanan, jumlah_diterima, catatan } = req.body
    const [result] = await pool.query(
      'INSERT INTO konfirmasi_kedatangan (id_distribusi, id_user, waktu_konfirmasi, kondisi_makanan, jumlah_diterima, catatan) VALUES (?,?,NOW(),?,?,?)',
      [id_distribusi, id_user, kondisi_makanan || 'baik', jumlah_diterima, catatan]
    )
    // Update distribution status
    await pool.query('UPDATE distribusi SET status="SELESAI" WHERE id_distribusi=?', [id_distribusi])
    res.status(201).json({ id_konfirmasi: result.insertId })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// ALERTS
// ============================================
app.get('/api/alerts', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM alerts ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/alerts', async (req, res) => {
  try {
    const { judul, deskripsi, severity, wilayah } = req.body
    const [result] = await pool.query(
      'INSERT INTO alerts (judul, deskripsi, severity, wilayah) VALUES (?,?,?,?)',
      [judul, deskripsi, severity || 'info', wilayah]
    )
    res.status(201).json({ id_alert: result.insertId, ...req.body })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/alerts/:id/resolve', async (req, res) => {
  try {
    const { resolved_by } = req.body
    await pool.query(
      'UPDATE alerts SET is_resolved=TRUE, resolved_by=?, resolved_at=NOW() WHERE id_alert=?',
      [resolved_by, req.params.id]
    )
    res.json({ message: 'Resolved' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// WILAYAH DATA
// ============================================
app.get('/api/wilayah', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM wilayah_data ORDER BY total_jml DESC')
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// DOKUMEN VENDOR
// ============================================
app.get('/api/dokumen/:vendorId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM dokumen_vendor WHERE id_vendor = ?', [req.params.vendorId])
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/dokumen', async (req, res) => {
  try {
    const { id_vendor, nama_dokumen, jenis, status, tanggal_berlaku, tanggal_kadaluarsa } = req.body
    const [result] = await pool.query(
      'INSERT INTO dokumen_vendor (id_vendor, nama_dokumen, jenis, status, tanggal_berlaku, tanggal_kadaluarsa) VALUES (?,?,?,?,?,?)',
      [id_vendor, nama_dokumen, jenis, status || 'pending_review', tanggal_berlaku, tanggal_kadaluarsa]
    )
    res.status(201).json({ id_dokumen: result.insertId, ...req.body })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// MANAJEMEN STOK DAPUR
// ============================================
app.get('/api/stok/:id_dapur', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM dapur_stok WHERE id_dapur = ? ORDER BY nama_bahan', [req.params.id_dapur])
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/stok', async (req, res) => {
  try {
    const { id_dapur, nama_bahan, jumlah, satuan } = req.body
    const trimmed = (nama_bahan || '').trim()
    if (!trimmed) {
      return res.status(400).json({ error: 'Nama bahan baku tidak boleh kosong' })
    }
    const formattedName = trimmed
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')

    const [result] = await pool.query(
      'INSERT INTO dapur_stok (id_dapur, nama_bahan, jumlah, satuan) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE jumlah = jumlah + VALUES(jumlah)',
      [id_dapur, formattedName, jumlah || 0, satuan]
    )
    
    await pool.query(
      'INSERT INTO dapur_stok_history (id_dapur, nama_bahan, tipe, jumlah, satuan, keterangan) VALUES (?,?,?,?,?,?)',
      [id_dapur, formattedName, 'CREDIT', jumlah || 0, satuan, 'Penerimaan Stok']
    )
    
    res.status(201).json({ id_stok: result.insertId, ...req.body, nama_bahan: formattedName })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/stok/:id_stok', async (req, res) => {
  try {
    const { jumlah } = req.body
    const [oldRows] = await pool.query('SELECT id_dapur, nama_bahan, jumlah, satuan FROM dapur_stok WHERE id_stok = ?', [req.params.id_stok])
    if (oldRows.length === 0) return res.status(404).json({ error: 'Item not found' })
    const old = oldRows[0]

    await pool.query(
      'UPDATE dapur_stok SET jumlah = ? WHERE id_stok = ?',
      [jumlah, req.params.id_stok]
    )

    const diff = parseFloat(jumlah) - parseFloat(old.jumlah)
    if (diff !== 0) {
      const tipe = diff > 0 ? 'CREDIT' : 'DEBIT'
      const absDiff = Math.abs(diff)
      await pool.query(
        'INSERT INTO dapur_stok_history (id_dapur, nama_bahan, tipe, jumlah, satuan, keterangan) VALUES (?,?,?,?,?,?)',
        [old.id_dapur, old.nama_bahan, tipe, absDiff, old.satuan, 'Penyesuaian Manual']
      )
    }

    res.json({ message: 'Updated' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.delete('/api/stok/:id_stok', async (req, res) => {
  try {
    const [oldRows] = await pool.query('SELECT id_dapur, nama_bahan, jumlah, satuan FROM dapur_stok WHERE id_stok = ?', [req.params.id_stok])
    if (oldRows.length > 0) {
      const old = oldRows[0]
      await pool.query(
        'INSERT INTO dapur_stok_history (id_dapur, nama_bahan, tipe, jumlah, satuan, keterangan) VALUES (?,?,?,?,?,?)',
        [old.id_dapur, old.nama_bahan, 'DEBIT', old.jumlah, old.satuan, 'Item Dihapus']
      )
    }
    await pool.query('DELETE FROM dapur_stok WHERE id_stok = ?', [req.params.id_stok])
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/stok/history/:id_dapur', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM dapur_stok_history WHERE id_dapur = ? ORDER BY created_at DESC',
      [req.params.id_dapur]
    )
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// NUTRITION DATABASE ENDPOINTS
// ============================================
app.get('/api/nutrition', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM nutrition_database ORDER BY status, kategori, nama')
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/nutrition', async (req, res) => {
  try {
    const { kategori, nama, satuan, energi, protein, lemak, karbohidrat, serat, natrium, status } = req.body
    if (!nama || !kategori) return res.status(400).json({ error: 'Nama dan kategori bahan wajib diisi.' })
    const [result] = await pool.query(
      'INSERT INTO nutrition_database (kategori, nama, satuan, energi, protein, lemak, karbohidrat, serat, natrium, status) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [
        kategori,
        nama.trim(),
        satuan || '100 gram',
        parseNutritionNumber(energi),
        parseNutritionNumber(protein),
        parseNutritionNumber(lemak),
        parseNutritionNumber(karbohidrat),
        parseNutritionNumber(serat),
        parseNutritionNumber(natrium),
        status || 'active'
      ]
    )
    res.status(201).json({ id: result.insertId, ...req.body, status: status || 'active' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/nutrition/:id', async (req, res) => {
  try {
    const { kategori, nama, satuan, energi, protein, lemak, karbohidrat, serat, natrium, status } = req.body
    await pool.query(
      'UPDATE nutrition_database SET kategori=?, nama=?, satuan=?, energi=?, protein=?, lemak=?, karbohidrat=?, serat=?, natrium=?, status=? WHERE id=?',
      [
        kategori,
        nama,
        satuan || '100 gram',
        parseNutritionNumber(energi),
        parseNutritionNumber(protein),
        parseNutritionNumber(lemak),
        parseNutritionNumber(karbohidrat),
        parseNutritionNumber(serat),
        parseNutritionNumber(natrium),
        status || 'active',
        req.params.id
      ]
    )
    res.json({ message: 'Updated' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.delete('/api/nutrition/:id', async (req, res) => {
  try {
    await pool.query('UPDATE nutrition_database SET status="retired" WHERE id=?', [req.params.id])
    res.json({ message: 'Retired' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/nutrition-requests', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, v.nama_vendor, u.name AS requester_name, reviewer.name AS reviewer_name
      FROM nutrition_requests r
      LEFT JOIN vendors v ON r.id_vendor = v.id_vendor
      LEFT JOIN users u ON r.requested_by = u.id_user
      LEFT JOIN users reviewer ON r.reviewed_by = reviewer.id_user
      ORDER BY FIELD(r.status, 'pending', 'approved', 'rejected'), r.created_at DESC
    `)
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/nutrition-requests', async (req, res) => {
  try {
    const { id_vendor, requested_by, nama, kategori, catatan } = req.body
    if (!nama) return res.status(400).json({ error: 'Nama bahan yang diminta wajib diisi.' })
    const [result] = await pool.query(
      'INSERT INTO nutrition_requests (id_vendor, requested_by, nama, kategori, catatan) VALUES (?,?,?,?,?)',
      [id_vendor || null, requested_by || null, nama.trim(), kategori || null, catatan || null]
    )
    res.status(201).json({ id_request: result.insertId, ...req.body, status: 'pending' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/nutrition-requests/:id/approve', async (req, res) => {
  try {
    const { reviewed_by, review_note, kategori, nama, satuan, energi, protein, lemak, karbohidrat, serat, natrium } = req.body
    const [requestRows] = await pool.query('SELECT * FROM nutrition_requests WHERE id_request=?', [req.params.id])
    if (requestRows.length === 0) return res.status(404).json({ error: 'Permintaan bahan tidak ditemukan.' })
    const request = requestRows[0]
    const [result] = await pool.query(
      'INSERT INTO nutrition_database (kategori, nama, satuan, energi, protein, lemak, karbohidrat, serat, natrium, status) VALUES (?,?,?,?,?,?,?,?,?,"active")',
      [
        kategori || request.kategori || 'lainnya',
        (nama || request.nama).trim(),
        satuan || '100 gram',
        parseNutritionNumber(energi),
        parseNutritionNumber(protein),
        parseNutritionNumber(lemak),
        parseNutritionNumber(karbohidrat),
        parseNutritionNumber(serat),
        parseNutritionNumber(natrium)
      ]
    )
    await pool.query(
      'UPDATE nutrition_requests SET status="approved", reviewed_by=?, id_nutrition=?, review_note=?, reviewed_at=NOW() WHERE id_request=?',
      [reviewed_by || null, result.insertId, review_note || null, req.params.id]
    )
    res.json({ id_nutrition: result.insertId, message: 'Approved' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/nutrition-requests/:id/reject', async (req, res) => {
  try {
    const { reviewed_by, review_note } = req.body
    await pool.query(
      'UPDATE nutrition_requests SET status="rejected", reviewed_by=?, review_note=?, reviewed_at=NOW() WHERE id_request=?',
      [reviewed_by || null, review_note || null, req.params.id]
    )
    res.json({ message: 'Rejected' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// GOVERNMENT STATISTICS ENDPOINTS
// ============================================
app.get('/api/pemerintah/stats', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        CASE 
          WHEN jenjang = 'TK' THEN 'PAUD'
          WHEN jenjang = 'SD' THEN 'SD'
          WHEN jenjang = 'SMP' THEN 'SMP'
          WHEN jenjang IN ('SMA', 'SMK') THEN 'SMA/SMK'
          ELSE 'Lainnya'
        END AS jenjang_group,
        SUM(jumlah_siswa) AS total_penerima,
        SUM(alergi_count + intoleran_count) AS total_kondisi_khusus
      FROM sekolah
      GROUP BY jenjang_group
    `)
    
    const defaultData = {
      'PAUD': 0,
      'SD': 0,
      'SMP': 0,
      'SMA/SMK': 0,
      'SLB': 0
    }
    
    const chartMap = { ...defaultData }
    const conditionMap = { ...defaultData }
    
    rows.forEach(r => {
      chartMap[r.jenjang_group] = parseInt(r.total_penerima) || 0
      conditionMap[r.jenjang_group] = parseInt(r.total_kondisi_khusus) || 0
    })
    
    const chartData = Object.keys(defaultData).map(k => ({
      jenjang: k,
      penerima: chartMap[k] || (k === 'PAUD' ? 1500 : k === 'SD' ? 4200 : k === 'SMP' ? 2800 : k === 'SMA/SMK' ? 2100 : 800),
      kondisi_khusus: conditionMap[k] || (k === 'PAUD' ? 45 : k === 'SD' ? 120 : k === 'SMP' ? 85 : k === 'SMA/SMK' ? 50 : 8)
    }))
    
    res.json(chartData)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() })
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: err.message })
  }
})

// ============================================
// START SERVER
// ============================================
const PORT = 3001
app.listen(PORT, () => {
  console.log(`\n🚀 TRAKSI API running at http://localhost:${PORT}`)
  console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`)
})
