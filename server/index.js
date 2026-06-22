import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import pool from './db.js'

function parseBahanList(rawBahan) {
  if (!rawBahan) return []
  return typeof rawBahan === 'string' ? JSON.parse(rawBahan) : rawBahan
}

function parseRequirementBounds(requirement) {
  const numbers = String(requirement || '').match(/\d+(\.\d+)?/g)?.map(Number) || []
  return {
    min: numbers[0] ?? null,
    max: numbers[1] ?? null
  }
}

function getStandardNutrientKey(title) {
  const lowerTitle = String(title || '').toLowerCase()
  if (lowerTitle.includes('kalori') || lowerTitle.includes('energi')) return 'energi'
  if (lowerTitle.includes('protein')) return 'protein'
  if (lowerTitle.includes('lemak')) return 'lemak'
  if (lowerTitle.includes('karbo')) return 'karbohidrat'
  if (lowerTitle.includes('serat')) return 'serat'
  if (lowerTitle.includes('natrium') || lowerTitle.includes('sodium')) return 'natrium'
  return null
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
const vendorDocumentDir = path.join(uploadRoot, 'vendor-documents')
const confirmationPhotoDir = path.join(uploadRoot, 'confirmation-photos')
fs.mkdirSync(menuPhotoDir, { recursive: true })
fs.mkdirSync(vendorDocumentDir, { recursive: true })
fs.mkdirSync(confirmationPhotoDir, { recursive: true })

function saveUploadFromDataUrl({ imageData, fileName, targetDir, publicPath, allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'], maxBytes = 8 * 1024 * 1024 }) {
  const match = /^data:([^;]+);base64,([A-Za-z0-9+/=]+)$/.exec(imageData || '')
  if (!match || !allowedTypes.includes(match[1])) {
    throw new Error('Format file tidak didukung.')
  }

  const extensionMap = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'application/pdf': 'pdf'
  }
  const buffer = Buffer.from(match[2], 'base64')
  if (buffer.length > maxBytes) throw new Error('Ukuran file terlalu besar.')

  const safeBaseName = path.basename(fileName || 'upload').replace(/\.[^.]+$/, '').replace(/[^a-z0-9-]+/gi, '-').slice(0, 50) || 'upload'
  const storedName = `${Date.now()}-${safeBaseName}.${extensionMap[match[1]]}`
  fs.writeFileSync(path.join(targetDir, storedName), buffer)
  return `${publicPath}/${storedName}`
}

const produksiStatusFlow = ['pending', 'persiapan', 'memasak', 'siap_kirim', 'selesai']

function getDistribusiStatusForProduksi(status, currentDistribusiStatus) {
  if (status === 'siap_kirim') return 'DISTRIBUSI'
  if (status === 'selesai') return currentDistribusiStatus === 'SELESAI' ? 'SELESAI' : 'TIBA'
  return 'DIJADWALKAN'
}

async function getDapurStatusRecord(executor, idDapur) {
  const [rows] = await executor.query(
    'SELECT id_dapur, status_verifikasi, review_note FROM dapur WHERE id_dapur = ? LIMIT 1',
    [idDapur]
  )
  return rows[0] || null
}

async function assertDapurApproved(executor, idDapur) {
  const dapur = await getDapurStatusRecord(executor, idDapur)
  if (!dapur) {
    throw new Error('Dapur tidak ditemukan.')
  }
  if (dapur.status_verifikasi !== 'approved') {
    throw new Error(`Dapur ini belum disetujui Pemerintah dan belum bisa beroperasi. Status saat ini: ${dapur.status_verifikasi}.`)
  }
  return dapur
}

function getOperationalErrorStatus(message = '') {
  if (message.includes('tidak ditemukan')) return 404
  if (
    message.includes('belum disetujui Pemerintah') ||
    message.includes('nonaktif') ||
    message.includes('tidak mencukupi') ||
    message.includes('belum terdaftar') ||
    message.includes('wajib diisi') ||
    message.includes('sudah digunakan') ||
    message.includes('wajib diatur')
  ) {
    return 400
  }
  return 500
}

async function ensureEmailAvailable(executor, email, exceptUserId = null) {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  if (!normalizedEmail) throw new Error('Email wajib diisi.')
  const [rows] = await executor.query(
    'SELECT id_user FROM users WHERE email = ? LIMIT 1',
    [normalizedEmail]
  )
  if (rows.length > 0 && Number(rows[0].id_user) !== Number(exceptUserId || 0)) {
    throw new Error('Email sudah digunakan oleh akun lain.')
  }
  return normalizedEmail
}

async function getActiveAhliGizi(executor) {
  const [rows] = await executor.query(
    'SELECT id_user, name, email, status FROM users WHERE role = "ahli_gizi" AND status = "active" ORDER BY id_user ASC LIMIT 1'
  )
  return rows[0] || null
}

async function createUserAccount(executor, { name, email, password, role, status = 'active' }) {
  const normalizedName = String(name || '').trim()
  const normalizedPassword = String(password || '').trim()
  if (!normalizedName) throw new Error('Nama akun wajib diisi.')
  if (!normalizedPassword) throw new Error('Password wajib diisi.')
  const normalizedEmail = await ensureEmailAvailable(executor, email)
  const [result] = await executor.query(
    'INSERT INTO users (name, email, password, role, status) VALUES (?,?,?,?,?)',
    [normalizedName, normalizedEmail, normalizedPassword, role, status]
  )
  return {
    id_user: result.insertId,
    name: normalizedName,
    email: normalizedEmail,
    role,
    status
  }
}

async function updateUserStatusForVendor(executor, vendorId, status) {
  await executor.query(
    `UPDATE users u
     JOIN vendors v ON v.id_user = u.id_user
     SET u.status = ?
     WHERE v.id_vendor = ?`,
    [status, vendorId]
  )
}

async function updateUserStatusForSchool(executor, schoolId, status) {
  await executor.query(
    `UPDATE users u
     JOIN sekolah s ON s.id_user = u.id_user
     SET u.status = ?
     WHERE s.id_sekolah = ?`,
    [status, schoolId]
  )
}

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
  return pool.query('SHOW COLUMNS FROM dapur')
}).then(([columns]) => {
  const existing = new Set(columns.map(col => col.Field))
  const migrations = []
  if (!existing.has('status_verifikasi')) {
    migrations.push(pool.query(`ALTER TABLE dapur ADD COLUMN status_verifikasi ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending' AFTER kapasitas_produksi`))
  }
  if (!existing.has('review_note')) {
    migrations.push(pool.query('ALTER TABLE dapur ADD COLUMN review_note TEXT NULL AFTER status_verifikasi'))
  }
  if (!existing.has('reviewed_by')) {
    migrations.push(pool.query('ALTER TABLE dapur ADD COLUMN reviewed_by INT NULL AFTER review_note'))
  }
  if (!existing.has('reviewed_at')) {
    migrations.push(pool.query('ALTER TABLE dapur ADD COLUMN reviewed_at DATETIME NULL AFTER reviewed_by'))
  }
  return Promise.all(migrations)
}).then(() => {
  return pool.query('SHOW INDEX FROM dapur WHERE Key_name = "idx_dapur_reviewed_by"')
}).then(([rows]) => {
  if (rows.length > 0) return null
  return pool.query('ALTER TABLE dapur ADD INDEX idx_dapur_reviewed_by (reviewed_by)')
}).then(() => {
  return pool.query('SHOW CREATE TABLE dapur')
}).then(async ([rows]) => {
  const createSql = rows?.[0]?.['Create Table'] || ''
  if (!createSql.includes('FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id_user`)')) {
    try {
      await pool.query('ALTER TABLE dapur ADD CONSTRAINT fk_dapur_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES users(id_user) ON DELETE SET NULL')
    } catch (err) {
      if (!String(err.message || '').includes('Duplicate foreign key constraint name')) throw err
    }
  }
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
  return pool.query(`
    ALTER TABLE vendors MODIFY COLUMN status_verifikasi ENUM('pending','approved','rejected','suspended') DEFAULT 'pending'
  `)
}).then(() => {
  return pool.query('SHOW COLUMNS FROM vendors')
}).then(([columns]) => {
  const existing = new Set(columns.map(col => col.Field))
  if (existing.has('id_ahli_gizi_pengawas')) return null
  return pool.query('ALTER TABLE vendors ADD COLUMN id_ahli_gizi_pengawas INT NULL AFTER id_user')
}).then(async () => {
  try {
    await pool.query('ALTER TABLE vendors ADD CONSTRAINT fk_vendors_ahli_gizi_pengawas FOREIGN KEY (id_ahli_gizi_pengawas) REFERENCES users(id_user) ON DELETE SET NULL')
  } catch (err) {
    if (!String(err.message || '').includes('Duplicate foreign key constraint name')) throw err
  }
  try {
    await pool.query('ALTER TABLE vendors ADD INDEX idx_vendors_ahli_gizi_pengawas (id_ahli_gizi_pengawas)')
  } catch (err) {
    if (!String(err.message || '').includes('Duplicate key name')) throw err
  }
}).then(() => {
  return pool.query(`
    CREATE TABLE IF NOT EXISTS vendor_registrations (
      id_registration INT PRIMARY KEY AUTO_INCREMENT,
      nama_vendor VARCHAR(150) NOT NULL,
      alamat TEXT NULL,
      region VARCHAR(100) NULL,
      kontak VARCHAR(100) NULL,
      email VARCHAR(150) NULL,
      izin_usaha VARCHAR(100) NULL,
      status ENUM('pending','approved','rejected','revision') NOT NULL DEFAULT 'pending',
      review_note TEXT NULL,
      reviewed_by INT NULL,
      reviewed_at DATETIME NULL,
      id_vendor INT NULL,
      documents JSON NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (reviewed_by) REFERENCES users(id_user) ON DELETE SET NULL,
      FOREIGN KEY (id_vendor) REFERENCES vendors(id_vendor) ON DELETE SET NULL
    )
  `)
}).then(() => {
  return pool.query('SHOW COLUMNS FROM dokumen_vendor')
}).then(([columns]) => {
  const existing = new Set(columns.map(col => col.Field))
  const migrations = []
  if (!existing.has('is_archived')) migrations.push(pool.query('ALTER TABLE dokumen_vendor ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT FALSE AFTER status'))
  if (!existing.has('review_note')) migrations.push(pool.query('ALTER TABLE dokumen_vendor ADD COLUMN review_note TEXT NULL AFTER status'))
  return Promise.all(migrations)
}).then(() => {
  return pool.query('SHOW COLUMNS FROM alerts')
}).then(([columns]) => {
  const existing = new Set(columns.map(col => col.Field))
  const migrations = []
  if (!existing.has('is_archived')) migrations.push(pool.query('ALTER TABLE alerts ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT FALSE AFTER is_resolved'))
  return Promise.all(migrations)
}).then(() => {
  return pool.query('SHOW COLUMNS FROM sekolah')
}).then(([columns]) => {
  const existing = new Set(columns.map(col => col.Field))
  if (existing.has('status')) return null
  return pool.query('ALTER TABLE sekolah ADD COLUMN status ENUM("active","inactive") NOT NULL DEFAULT "active" AFTER id_user')
}).then(() => {
  console.log('Vendor registration, document, alert, and school workflow tables are ready.')
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
    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Akun ini belum aktif atau sedang dinonaktifkan.' })
    }
    delete user.password
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/auth/accounts', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        u.id_user,
        u.name,
        u.email,
        u.password,
        u.role,
        u.status,
        CASE
          WHEN u.role = 'vendor' THEN v.id_vendor
          WHEN u.role = 'sekolah' THEN s.id_sekolah
          ELSE NULL
        END AS entityId,
        CASE
          WHEN u.role = 'vendor' THEN v.nama_vendor
          WHEN u.role = 'sekolah' THEN s.nama_sekolah
          ELSE u.name
        END AS entityName
      FROM users u
      LEFT JOIN vendors v ON u.id_user = v.id_user
      LEFT JOIN sekolah s ON u.id_user = s.id_user
      WHERE u.status = 'active'
        AND (
          u.role IN ('pemerintah', 'ahli_gizi')
          OR (u.role = 'vendor' AND v.status_verifikasi = 'approved')
          OR (u.role = 'sekolah' AND s.status = 'active')
        )
      ORDER BY FIELD(u.role, 'pemerintah', 'ahli_gizi', 'vendor', 'sekolah'), entityName, u.name
    `)
    const roleOrder = ['pemerintah', 'ahli_gizi', 'vendor', 'sekolah']
    const labelMap = {
      pemerintah: 'Pemerintah',
      ahli_gizi: 'Ahli Gizi',
      vendor: 'Vendor',
      sekolah: 'Sekolah'
    }
    const grouped = roleOrder.map((role) => ({
      role,
      label: labelMap[role],
      accounts: rows
        .filter((item) => item.role === role)
        .map(({ id_user, name, email, password, status, entityId, entityName }) => ({ id_user, name, email, password, status, entityId, entityName }))
    }))
    res.json(grouped)
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
    const includeInactive = req.query.includeInactive === 'true'
    const [rows] = await pool.query(
      `SELECT s.*, u.name AS account_name, u.email, u.status AS account_status
       FROM sekolah s
       LEFT JOIN users u ON s.id_user = u.id_user
       ${includeInactive ? '' : 'WHERE s.status = "active"'}
       ORDER BY s.nama_sekolah`
    )
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/sekolah/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, u.name AS account_name, u.email, u.status AS account_status
       FROM sekolah s
       LEFT JOIN users u ON s.id_user = u.id_user
       WHERE s.id_sekolah = ?`,
      [req.params.id]
    )
    if (rows.length === 0) return res.status(404).json({ error: 'Sekolah tidak ditemukan' })
    res.json(rows[0])
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/sekolah/by-user/:userId', async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true'
    const [rows] = await pool.query(
      `SELECT s.*, u.name AS account_name, u.email, u.status AS account_status
       FROM sekolah s
       LEFT JOIN users u ON s.id_user = u.id_user
       WHERE s.id_user = ? ${includeInactive ? '' : 'AND s.status = "active"'} LIMIT 1`,
      [req.params.userId]
    )
    if (rows.length === 0) return res.status(404).json({ error: 'Sekolah untuk user ini tidak ditemukan' })
    res.json(rows[0])
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/sekolah', async (req, res) => {
  let connection
  try {
    const { nama_sekolah, alamat, jenjang, jumlah_siswa, alergi_count, intoleran_count, status, account_name, email, password } = req.body
    connection = await pool.getConnection()
    await connection.beginTransaction()
    let userAccount = null
    if (email || password || account_name) {
      userAccount = await createUserAccount(connection, {
        name: account_name || `Admin ${nama_sekolah}`,
        email,
        password,
        role: 'sekolah',
        status: status === 'inactive' ? 'inactive' : 'active'
      })
    }
    const [result] = await connection.query(
      'INSERT INTO sekolah (nama_sekolah, alamat, jenjang, jumlah_siswa, alergi_count, intoleran_count, id_user, status) VALUES (?,?,?,?,?,?,?,?)',
      [nama_sekolah, alamat, jenjang, jumlah_siswa || 0, alergi_count || 0, intoleran_count || 0, userAccount?.id_user || null, status || 'active']
    )
    await connection.commit()
    res.status(201).json({ id_sekolah: result.insertId, id_user: userAccount?.id_user || null, status: status || 'active', ...req.body })
  } catch (err) {
    if (connection) await connection.rollback()
    res.status(getOperationalErrorStatus(err.message)).json({ error: err.message })
  } finally {
    if (connection) connection.release()
  }
})

app.put('/api/sekolah/:id', async (req, res) => {
  try {
    const { nama_sekolah, alamat, jenjang, jumlah_siswa, alergi_count, intoleran_count, status } = req.body
    await pool.query(
      'UPDATE sekolah SET nama_sekolah=?, alamat=?, jenjang=?, jumlah_siswa=?, alergi_count=?, intoleran_count=?, status=? WHERE id_sekolah=?',
      [nama_sekolah, alamat, jenjang, jumlah_siswa, alergi_count, intoleran_count, status || 'active', req.params.id]
    )
    if (status === 'inactive' || status === 'active') {
      await updateUserStatusForSchool(pool, req.params.id, status === 'inactive' ? 'inactive' : 'active')
    }
    res.json({ message: 'Updated' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.delete('/api/sekolah/:id', async (req, res) => {
  try {
    await pool.query('UPDATE sekolah SET status="inactive" WHERE id_sekolah = ?', [req.params.id])
    await updateUserStatusForSchool(pool, req.params.id, 'inactive')
    res.json({ message: 'Deactivated' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/sekolah/:id/reactivate', async (req, res) => {
  try {
    await pool.query('UPDATE sekolah SET status="active" WHERE id_sekolah = ?', [req.params.id])
    await updateUserStatusForSchool(pool, req.params.id, 'active')
    res.json({ message: 'Reactivated' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// VENDORS
// ============================================
app.get('/api/vendors', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT v.*, u.name AS account_name, u.email AS account_email, u.status AS account_status, ag.name AS ahli_gizi_pengawas_name, ag.email AS ahli_gizi_pengawas_email
      FROM vendors v
      LEFT JOIN users u ON v.id_user = u.id_user
      LEFT JOIN users ag ON v.id_ahli_gizi_pengawas = ag.id_user
      ORDER BY v.nama_vendor
    `)
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/vendors/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT v.*, u.name AS account_name, u.email AS account_email, u.status AS account_status, ag.name AS ahli_gizi_pengawas_name, ag.email AS ahli_gizi_pengawas_email
      FROM vendors v
      LEFT JOIN users u ON v.id_user = u.id_user
      LEFT JOIN users ag ON v.id_ahli_gizi_pengawas = ag.id_user
      WHERE v.id_vendor = ?
    `, [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: 'Vendor tidak ditemukan' })
    res.json(rows[0])
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/vendors/by-user/:userId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT v.*, u.name AS account_name, u.email AS account_email, u.status AS account_status, ag.name AS ahli_gizi_pengawas_name, ag.email AS ahli_gizi_pengawas_email
      FROM vendors v
      LEFT JOIN users u ON v.id_user = u.id_user
      LEFT JOIN users ag ON v.id_ahli_gizi_pengawas = ag.id_user
      WHERE v.id_user = ?
      LIMIT 1
    `, [req.params.userId])
    if (rows.length === 0) return res.status(404).json({ error: 'Vendor untuk user ini tidak ditemukan' })
    res.json(rows[0])
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/vendors', async (req, res) => {
  let connection
  try {
    const { nama_vendor, region, izin_usaha, status_verifikasi, account_name, email, password } = req.body
    connection = await pool.getConnection()
    await connection.beginTransaction()
    const ahliGizi = await getActiveAhliGizi(connection)
    if (!ahliGizi) throw new Error('Akun Ahli Gizi aktif wajib diatur sebelum menambah vendor baru.')
    const userAccount = await createUserAccount(connection, {
      name: account_name || nama_vendor,
      email,
      password,
      role: 'vendor',
      status: status_verifikasi === 'suspended' ? 'suspended' : 'active'
    })
    const [result] = await connection.query(
      'INSERT INTO vendors (nama_vendor, region, izin_usaha, status_verifikasi, id_user, id_ahli_gizi_pengawas) VALUES (?,?,?,?,?,?)',
      [nama_vendor, region, izin_usaha, status_verifikasi || 'pending', userAccount.id_user, ahliGizi.id_user]
    )
    await connection.commit()
    res.status(201).json({ id_vendor: result.insertId, id_user: userAccount.id_user, id_ahli_gizi_pengawas: ahliGizi.id_user, ahli_gizi_pengawas_name: ahliGizi.name, ...req.body })
  } catch (err) {
    if (connection) await connection.rollback()
    res.status(getOperationalErrorStatus(err.message)).json({ error: err.message })
  } finally {
    if (connection) connection.release()
  }
})

app.put('/api/vendors/:id', async (req, res) => {
  try {
    const { nama_vendor, region, izin_usaha, status_verifikasi } = req.body
    await pool.query(
      'UPDATE vendors SET nama_vendor=?, region=?, izin_usaha=?, status_verifikasi=? WHERE id_vendor=?',
      [nama_vendor, region, izin_usaha, status_verifikasi, req.params.id]
    )
    if (status_verifikasi === 'approved') {
      await updateUserStatusForVendor(pool, req.params.id, 'active')
    }
    if (status_verifikasi === 'suspended') {
      await updateUserStatusForVendor(pool, req.params.id, 'suspended')
    }
    res.json({ message: 'Updated' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.delete('/api/vendors/:id', async (req, res) => {
  try {
    await pool.query("UPDATE vendors SET status_verifikasi='suspended' WHERE id_vendor = ?", [req.params.id])
    await updateUserStatusForVendor(pool, req.params.id, 'suspended')
    res.json({ message: 'Suspended' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/vendor-registrations', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, reviewer.name AS reviewer_name
      FROM vendor_registrations r
      LEFT JOIN users reviewer ON r.reviewed_by = reviewer.id_user
      ORDER BY FIELD(r.status, 'pending', 'revision', 'approved', 'rejected'), r.created_at DESC
    `)
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/vendor-registrations', async (req, res) => {
  try {
    const { nama_vendor, alamat, region, kontak, email, izin_usaha, documents } = req.body
    if (!nama_vendor || !alamat) return res.status(400).json({ error: 'Nama vendor dan alamat wajib diisi.' })
    const [result] = await pool.query(
      'INSERT INTO vendor_registrations (nama_vendor, alamat, region, kontak, email, izin_usaha, documents) VALUES (?,?,?,?,?,?,?)',
      [nama_vendor, alamat, region || null, kontak || null, email || null, izin_usaha || `REG-${Date.now()}`, JSON.stringify(documents || [])]
    )
    res.status(201).json({ id_registration: result.insertId, status: 'pending', ...req.body })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/vendor-registrations/:id/approve', async (req, res) => {
  let connection
  try {
    const { reviewed_by, review_note, email, password, account_name } = req.body
    connection = await pool.getConnection()
    await connection.beginTransaction()
    const [regs] = await connection.query('SELECT * FROM vendor_registrations WHERE id_registration=?', [req.params.id])
    if (regs.length === 0) {
      await connection.rollback()
      return res.status(404).json({ error: 'Registrasi vendor tidak ditemukan.' })
    }
    const reg = regs[0]
    const ahliGizi = await getActiveAhliGizi(connection)
    if (!ahliGizi) {
      await connection.rollback()
      return res.status(400).json({ error: 'Akun Ahli Gizi aktif wajib diatur sebelum menyetujui vendor.' })
    }
    const userAccount = await createUserAccount(connection, {
      name: account_name || reg.nama_vendor,
      email: email || reg.email,
      password,
      role: 'vendor',
      status: 'active'
    })
    const [vendorResult] = await connection.query(
      'INSERT INTO vendors (nama_vendor, region, status_verifikasi, izin_usaha, id_user, id_ahli_gizi_pengawas) VALUES (?,?,?,?,?,?)',
      [reg.nama_vendor, reg.region || 'Belum ditentukan', 'approved', reg.izin_usaha || `REG-${reg.id_registration}`, userAccount.id_user, ahliGizi.id_user]
    )
    const idVendor = vendorResult.insertId
    const docs = typeof reg.documents === 'string' ? JSON.parse(reg.documents || '[]') : (reg.documents || [])
    for (const doc of docs) {
      await connection.query(
        'INSERT INTO dokumen_vendor (id_vendor, nama_dokumen, jenis, file_path, status) VALUES (?,?,?,?,?)',
        [idVendor, doc.nama_dokumen || doc.label || 'Dokumen Vendor', doc.jenis || 'lainnya', doc.file_path || null, 'pending_review']
      )
    }
    await connection.query(
      'UPDATE vendor_registrations SET status="approved", reviewed_by=?, review_note=?, reviewed_at=NOW(), id_vendor=? WHERE id_registration=?',
      [reviewed_by || null, review_note || null, idVendor, req.params.id]
    )
    await connection.commit()
    res.json({ message: 'Approved', id_vendor: idVendor, id_user: userAccount.id_user, id_ahli_gizi_pengawas: ahliGizi.id_user })
  } catch (err) {
    if (connection) await connection.rollback()
    res.status(getOperationalErrorStatus(err.message)).json({ error: err.message })
  } finally {
    if (connection) connection.release()
  }
})

app.put('/api/vendor-registrations/:id/reject', async (req, res) => {
  try {
    const { reviewed_by, review_note, revision = false } = req.body
    await pool.query(
      'UPDATE vendor_registrations SET status=?, reviewed_by=?, review_note=?, reviewed_at=NOW() WHERE id_registration=?',
      [revision ? 'revision' : 'rejected', reviewed_by || null, review_note || null, req.params.id]
    )
    res.json({ message: revision ? 'Revision requested' : 'Rejected' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// DAPUR (Kitchens)
// ============================================
app.get('/api/dapur', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, v.nama_vendor, reviewer.name AS reviewed_by_name
      FROM dapur d 
      JOIN vendors v ON d.id_vendor = v.id_vendor 
      LEFT JOIN users reviewer ON d.reviewed_by = reviewer.id_user
      ORDER BY d.lokasi
    `)
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/dapur', async (req, res) => {
  try {
    const { id_vendor, lokasi, kapasitas_produksi } = req.body
    const [result] = await pool.query(
      'INSERT INTO dapur (id_vendor, lokasi, kapasitas_produksi, status_verifikasi, review_note, reviewed_by, reviewed_at) VALUES (?,?,?,?,?,?,?)',
      [id_vendor, lokasi, kapasitas_produksi || 0, 'pending', null, null, null]
    )
    res.status(201).json({ id_dapur: result.insertId, ...req.body, status_verifikasi: 'pending', review_note: null, reviewed_by: null, reviewed_at: null })
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

app.put('/api/dapur/:id/approve', async (req, res) => {
  try {
    const { reviewed_by, review_note } = req.body
    await pool.query(
      'UPDATE dapur SET status_verifikasi="approved", review_note=?, reviewed_by=?, reviewed_at=NOW() WHERE id_dapur=?',
      [typeof review_note === 'string' && review_note.trim() ? review_note.trim() : null, reviewed_by || null, req.params.id]
    )
    res.json({ message: 'Approved' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/dapur/:id/reject', async (req, res) => {
  try {
    const { reviewed_by, review_note } = req.body
    const normalizedNote = typeof review_note === 'string' ? review_note.trim() : ''
    if (!normalizedNote) {
      return res.status(400).json({ error: 'Catatan penolakan dapur wajib diisi.' })
    }
    await pool.query(
      'UPDATE dapur SET status_verifikasi="rejected", review_note=?, reviewed_by=?, reviewed_at=NOW() WHERE id_dapur=?',
      [normalizedNote, reviewed_by || null, req.params.id]
    )
    res.json({ message: 'Rejected' })
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
    await assertDapurApproved(pool, id_dapur)
    const [schoolRows] = await pool.query('SELECT status FROM sekolah WHERE id_sekolah = ? LIMIT 1', [id_sekolah])
    if (schoolRows.length === 0) return res.status(404).json({ error: 'Sekolah tidak ditemukan.' })
    if (schoolRows[0].status !== 'active') return res.status(400).json({ error: 'Sekolah nonaktif tidak dapat dipetakan ke dapur.' })
    const [result] = await pool.query(
      'INSERT INTO mapping_dapur_sekolah (id_dapur, id_sekolah) VALUES (?,?)',
      [id_dapur, id_sekolah]
    )
    res.status(201).json({ id_mapping: result.insertId, ...req.body })
  } catch (err) { res.status(getOperationalErrorStatus(err.message)).json({ error: err.message }) }
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
    const file_path = saveUploadFromDataUrl({
      ...req.body,
      targetDir: menuPhotoDir,
      publicPath: '/uploads/menu-photos',
      allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
      maxBytes: 5 * 1024 * 1024
    })
    res.status(201).json({ foto_url: file_path })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.post('/api/uploads/vendor-document', async (req, res) => {
  try {
    const file_path = saveUploadFromDataUrl({
      ...req.body,
      targetDir: vendorDocumentDir,
      publicPath: '/uploads/vendor-documents'
    })
    res.status(201).json({ file_path })
  } catch (err) { res.status(400).json({ error: err.message }) }
})

app.post('/api/uploads/confirmation-photo', async (req, res) => {
  try {
    const foto_bukti = saveUploadFromDataUrl({
      ...req.body,
      targetDir: confirmationPhotoDir,
      publicPath: '/uploads/confirmation-photos',
      allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
      maxBytes: 5 * 1024 * 1024
    })
    res.status(201).json({ foto_bukti })
  } catch (err) { res.status(400).json({ error: err.message }) }
})

app.get('/api/menus', async (req, res) => {
  try {
    const { ahliGiziUserId } = req.query
    const [rows] = await pool.query(`
      SELECT m.*, v.nama_vendor, v.id_ahli_gizi_pengawas
      FROM menus m
      JOIN vendors v ON m.id_vendor = v.id_vendor
      ${ahliGiziUserId ? 'WHERE v.id_ahli_gizi_pengawas = ?' : ''}
      ORDER BY m.tanggal DESC
    `, ahliGiziUserId ? [ahliGiziUserId] : [])
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
    const { id_vendor, nama_menu, bahan, tanggal, foto_url, notes } = req.body
    const calculatedMenu = await calculateMenuNutrition(bahan)
    const normalizedNotes = Array.isArray(notes)
      ? notes.map((item) => String(item || '').trim()).filter(Boolean)
      : []

    // Auto-register missing ingredients to all vendor's kitchens
    const [dapurs] = await pool.query('SELECT id_dapur FROM dapur WHERE id_vendor = ? AND status_verifikasi = "approved"', [id_vendor])
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
      'INSERT INTO menus (id_vendor, nama_menu, bahan, nilai_gizi, foto_url, notes, tanggal) VALUES (?,?,?,?,?,?,?)',
      [id_vendor, nama_menu, JSON.stringify(calculatedMenu.bahan), JSON.stringify(calculatedMenu.nilai_gizi), foto_url || null, JSON.stringify(normalizedNotes), tanggal]
    )
    res.status(201).json({ id_menu: result.insertId, ...req.body, ...calculatedMenu })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/menus/:id', async (req, res) => {
  try {
    const { nama_menu, bahan, nilai_gizi, foto_url, status_validasi, notes, tanggal } = req.body
    const fields = [], values = []
    const normalizedNotes = Array.isArray(notes)
      ? notes.map((item) => String(item || '').trim()).filter(Boolean)
      : undefined
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
    if (notes !== undefined) { fields.push('notes=?'); values.push(JSON.stringify(normalizedNotes || [])) }
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
      SELECT p.*, d.lokasi AS dapur_lokasi, m.nama_menu, m.bahan, m.nilai_gizi, s.nama_sekolah AS target_sekolah, dis.kode_transaksi, dis.status AS distribusi_status
      FROM produksi p
      JOIN dapur d ON p.id_dapur = d.id_dapur
      JOIN menus m ON p.id_menu = m.id_menu
      LEFT JOIN (
        SELECT d1.*
        FROM distribusi d1
        JOIN (
          SELECT id_produksi, MAX(id_distribusi) AS latest_id_distribusi
          FROM distribusi
          GROUP BY id_produksi
        ) latest ON latest.latest_id_distribusi = d1.id_distribusi
      ) dis ON p.id_produksi = dis.id_produksi
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

    await assertDapurApproved(connection, id_dapur)

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
    const statusCode = err.message.includes('Menu tidak ditemukan.')
      ? 400
      : getOperationalErrorStatus(err.message)
    res.status(statusCode).json({ error: err.message })
  } finally {
    if (connection) connection.release()
  }
})

app.put('/api/produksi/:id', async (req, res) => {
  let connection
  try {
    const { status } = req.body
    if (!produksiStatusFlow.includes(status)) {
      return res.status(400).json({ error: 'Status produksi tidak valid.' })
    }
    connection = await pool.getConnection()
    await connection.beginTransaction()

    const [prodRows] = await connection.query('SELECT * FROM produksi WHERE id_produksi = ?', [req.params.id])
    if (prodRows.length === 0) {
      await connection.rollback()
      return res.status(404).json({ error: 'Not found' })
    }
    const p = prodRows[0]
    const currentIndex = produksiStatusFlow.indexOf(p.status)
    const nextIndex = produksiStatusFlow.indexOf(status)
    if (currentIndex === -1 || nextIndex === -1 || nextIndex < currentIndex || nextIndex - currentIndex > 1) {
      await connection.rollback()
      return res.status(400).json({ error: `Transisi status tidak valid dari ${p.status} ke ${status}.` })
    }

    let stockPreparation = null
    if (status === 'persiapan' && p.status === 'pending') {
      stockPreparation = await prepareStockDeductions(connection, {
        idDapur: p.id_dapur,
        idMenu: p.id_menu,
        jumlahPorsi: p.jumlah_porsi,
      })
    }

    let extra = ''
    if (status === 'persiapan' || status === 'memasak') {
      extra = ', waktu_mulai=COALESCE(waktu_mulai, NOW())'
    } else if (status === 'selesai') {
      extra = ', waktu_selesai=NOW()'
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

    const [deliveryRows] = await connection.query(
      'SELECT id_distribusi, status FROM distribusi WHERE id_produksi=? ORDER BY id_distribusi DESC',
      [req.params.id]
    )
    for (const delivery of deliveryRows) {
      const syncedStatus = getDistribusiStatusForProduksi(status, delivery.status)
      let deliveryExtra = ''
      if (syncedStatus === 'DISTRIBUSI') {
        deliveryExtra = ', waktu_kirim=COALESCE(waktu_kirim, NOW())'
      } else if (syncedStatus === 'TIBA') {
        deliveryExtra = ', waktu_kirim=COALESCE(waktu_kirim, NOW()), waktu_tiba=COALESCE(waktu_tiba, NOW())'
      } else if (syncedStatus === 'DIJADWALKAN') {
        deliveryExtra = ', waktu_kirim=NULL, waktu_tiba=NULL'
      }
      await connection.query(
        `UPDATE distribusi SET status=?${deliveryExtra} WHERE id_distribusi=?`,
        [syncedStatus, delivery.id_distribusi]
      )
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
    let extra = ''
    if (status === 'DISTRIBUSI') {
      extra = ', waktu_kirim=COALESCE(waktu_kirim, NOW())'
    } else if (status === 'TIBA' || status === 'SELESAI') {
      extra = ', waktu_kirim=COALESCE(waktu_kirim, NOW()), waktu_tiba=COALESCE(waktu_tiba, NOW())'
    }
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
    const { id_menu, id_user, aksi, catatan, force_override } = req.body
    const normalizedNote = typeof catatan === 'string' ? catatan.trim() : ''
    if (aksi === 'approved') {
      const [menuRows] = await pool.query('SELECT bahan, nilai_gizi FROM menus WHERE id_menu=?', [id_menu])
      if (menuRows.length === 0) return res.status(404).json({ error: 'Menu tidak ditemukan.' })
      const bahan = parseBahanList(menuRows[0].bahan)
      const nilaiGizi = typeof menuRows[0].nilai_gizi === 'string' ? JSON.parse(menuRows[0].nilai_gizi) : menuRows[0].nilai_gizi
      const isCalculated = !!nilaiGizi?.calculated
      const hasLinkedIngredients = Array.isArray(bahan) && bahan.length > 0 && bahan.every(item => item.id_nutrition)
      if ((!isCalculated || !hasLinkedIngredients) && !force_override) {
        return res.status(400).json({ error: 'Menu belum memiliki data nutrisi terhitung dari bahan terverifikasi.' })
      }
    }
    if (aksi === 'rejected' && !normalizedNote) {
      return res.status(400).json({ error: 'Catatan revisi Ahli Gizi wajib diisi sebelum mengirim permintaan revisi.' })
    }
    const finalNote = force_override && aksi === 'approved'
      ? `[OVERRIDE APPROVAL] ${normalizedNote || 'Menu disahkan melalui override ahli gizi setelah konfirmasi manual.'}`
      : (normalizedNote || null)
    // Also update menu status
    await pool.query('UPDATE menus SET status_validasi=? WHERE id_menu=?', [aksi, id_menu])
    const [result] = await pool.query(
      'INSERT INTO validasi_log (id_menu, id_user, aksi, catatan) VALUES (?,?,?,?)',
      [id_menu, id_user, aksi, finalNote]
    )
    res.status(201).json({ id_validasi: result.insertId })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/reports/ahli-gizi/menu-review', async (req, res) => {
  try {
    const { id_menu, id_user, notes } = req.body
    if (!id_menu || !id_user) return res.status(400).json({ error: 'id_menu dan id_user wajib diisi.' })

    const [[menuRows], [standardsRows], [reviewerRows], [logRows]] = await Promise.all([
      pool.query(`
        SELECT m.*, v.id_vendor, v.nama_vendor, v.region
        FROM menus m
        LEFT JOIN vendors v ON m.id_vendor = v.id_vendor
        WHERE m.id_menu = ?
        LIMIT 1
      `, [id_menu]),
      pool.query('SELECT * FROM standar_gizi ORDER BY id_standar'),
      pool.query('SELECT id_user, name, role, email FROM users WHERE id_user = ? LIMIT 1', [id_user]),
      pool.query('SELECT aksi, catatan, created_at FROM validasi_log WHERE id_menu = ? ORDER BY created_at DESC LIMIT 5', [id_menu])
    ])

    if (menuRows.length === 0) return res.status(404).json({ error: 'Menu tidak ditemukan.' })
    if (reviewerRows.length === 0) return res.status(404).json({ error: 'Reviewer tidak ditemukan.' })

    const menu = menuRows[0]
    if (!menu.nilai_gizi) {
      return res.status(400).json({ error: 'Menu belum memiliki nilai gizi terhitung.' })
    }

    const nilaiGizi = typeof menu.nilai_gizi === 'string' ? JSON.parse(menu.nilai_gizi) : menu.nilai_gizi
    const bahan = parseBahanList(menu.bahan)
    const standards = standardsRows.map((standard) => {
      const nutrientKey = getStandardNutrientKey(standard.title)
      if (!nutrientKey) return null
      const { min, max } = parseRequirementBounds(standard.requirement)
      const actualValue = parseNutritionNumber(nilaiGizi?.[nutrientKey])
      const pass = (min === null || actualValue >= min) && (max === null || actualValue <= max)
      return {
        id_standar: standard.id_standar,
        title: standard.title,
        requirement: standard.requirement,
        nutrient_key: nutrientKey,
        actual_value: actualValue,
        min,
        max,
        pass
      }
    }).filter(Boolean)

    const payload = {
      report_type: 'ahli_gizi_menu_review',
      generated_at: new Date().toISOString(),
      menu: {
        id_menu: menu.id_menu,
        nama_menu: menu.nama_menu,
        tanggal: menu.tanggal,
        status_validasi: menu.status_validasi,
        bahan,
        nilai_gizi: nilaiGizi,
        vendor: {
          id_vendor: menu.id_vendor,
          nama_vendor: menu.nama_vendor,
          region: menu.region
        }
      },
      standards_comparison: standards,
      summary: {
        total_standards_checked: standards.length,
        passed_standards: standards.filter((item) => item.pass).length,
        failed_standards: standards.filter((item) => !item.pass).length
      },
      reviewer: reviewerRows[0],
      notes: {
        request_note: notes || null,
        latest_menu_notes: typeof menu.notes === 'string' ? JSON.parse(menu.notes || '[]') : (menu.notes || []),
        validation_log: logRows.map((item) => ({
          aksi: item.aksi,
          catatan: item.catatan,
          created_at: item.created_at
        }))
      }
    }

    res.json(payload)
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
      SELECT k.*, d.kode_transaksi, d.id_sekolah, p.id_menu, m.nama_menu, s.nama_sekolah
      FROM konfirmasi_kedatangan k
      JOIN distribusi d ON k.id_distribusi = d.id_distribusi
      JOIN produksi p ON d.id_produksi = p.id_produksi
      JOIN menus m ON p.id_menu = m.id_menu
      JOIN sekolah s ON d.id_sekolah = s.id_sekolah
      ORDER BY k.created_at DESC
    `)
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/konfirmasi', async (req, res) => {
  try {
    const { id_distribusi, id_user, kondisi_makanan, jumlah_diterima, catatan, foto_bukti } = req.body
    const [result] = await pool.query(
      'INSERT INTO konfirmasi_kedatangan (id_distribusi, id_user, waktu_konfirmasi, kondisi_makanan, jumlah_diterima, catatan, foto_bukti) VALUES (?,?,NOW(),?,?,?,?)',
      [id_distribusi, id_user, kondisi_makanan || 'baik', jumlah_diterima, catatan, foto_bukti || null]
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
    const [rows] = await pool.query('SELECT * FROM alerts WHERE is_archived = FALSE ORDER BY created_at DESC')
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

app.put('/api/alerts/:id', async (req, res) => {
  try {
    const { judul, deskripsi, severity, wilayah, is_resolved } = req.body
    await pool.query(
      'UPDATE alerts SET judul=?, deskripsi=?, severity=?, wilayah=?, is_resolved=? WHERE id_alert=?',
      [judul, deskripsi, severity || 'info', wilayah || null, !!is_resolved, req.params.id]
    )
    res.json({ message: 'Updated' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.delete('/api/alerts/:id', async (req, res) => {
  try {
    await pool.query('UPDATE alerts SET is_archived=TRUE WHERE id_alert=?', [req.params.id])
    res.json({ message: 'Archived' })
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
    const [rows] = await pool.query('SELECT * FROM dokumen_vendor WHERE id_vendor = ? AND is_archived = FALSE', [req.params.vendorId])
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/dokumen', async (req, res) => {
  try {
    const { id_vendor, nama_dokumen, jenis, status, tanggal_berlaku, tanggal_kadaluarsa, file_path, review_note } = req.body
    const [result] = await pool.query(
      'INSERT INTO dokumen_vendor (id_vendor, nama_dokumen, jenis, status, tanggal_berlaku, tanggal_kadaluarsa, file_path, review_note) VALUES (?,?,?,?,?,?,?,?)',
      [id_vendor, nama_dokumen, jenis, status || 'pending_review', tanggal_berlaku, tanggal_kadaluarsa, file_path || null, review_note || null]
    )
    res.status(201).json({ id_dokumen: result.insertId, ...req.body })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/dokumen/:id', async (req, res) => {
  try {
    const { nama_dokumen, jenis, status, tanggal_berlaku, tanggal_kadaluarsa, file_path, review_note } = req.body
    await pool.query(
      'UPDATE dokumen_vendor SET nama_dokumen=?, jenis=?, status=?, tanggal_berlaku=?, tanggal_kadaluarsa=?, file_path=?, review_note=? WHERE id_dokumen=?',
      [nama_dokumen, jenis, status || 'pending_review', tanggal_berlaku || null, tanggal_kadaluarsa || null, file_path || null, review_note || null, req.params.id]
    )
    res.json({ message: 'Updated' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/dokumen/:id/status', async (req, res) => {
  try {
    const { status, review_note } = req.body
    await pool.query('UPDATE dokumen_vendor SET status=?, review_note=? WHERE id_dokumen=?', [status, review_note || null, req.params.id])
    res.json({ message: 'Status updated' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.delete('/api/dokumen/:id', async (req, res) => {
  try {
    await pool.query('UPDATE dokumen_vendor SET is_archived=TRUE WHERE id_dokumen=?', [req.params.id])
    res.json({ message: 'Archived' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// MANAJEMEN STOK DAPUR
// ============================================
app.get('/api/stok/:id_dapur', async (req, res) => {
  try {
    await assertDapurApproved(pool, req.params.id_dapur)
    const [rows] = await pool.query('SELECT * FROM dapur_stok WHERE id_dapur = ? ORDER BY nama_bahan', [req.params.id_dapur])
    res.json(rows)
  } catch (err) { res.status(getOperationalErrorStatus(err.message)).json({ error: err.message }) }
})

app.post('/api/stok', async (req, res) => {
  try {
    const { id_dapur, nama_bahan, jumlah, satuan } = req.body
    await assertDapurApproved(pool, id_dapur)
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
  } catch (err) { res.status(getOperationalErrorStatus(err.message)).json({ error: err.message }) }
})

app.put('/api/stok/:id_stok', async (req, res) => {
  try {
    const { jumlah } = req.body
    const [oldRows] = await pool.query('SELECT id_dapur, nama_bahan, jumlah, satuan FROM dapur_stok WHERE id_stok = ?', [req.params.id_stok])
    if (oldRows.length === 0) return res.status(404).json({ error: 'Item not found' })
    const old = oldRows[0]
    await assertDapurApproved(pool, old.id_dapur)

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
  } catch (err) { res.status(getOperationalErrorStatus(err.message)).json({ error: err.message }) }
})

app.delete('/api/stok/:id_stok', async (req, res) => {
  try {
    const [oldRows] = await pool.query('SELECT id_dapur, nama_bahan, jumlah, satuan FROM dapur_stok WHERE id_stok = ?', [req.params.id_stok])
    if (oldRows.length > 0) {
      const old = oldRows[0]
      await assertDapurApproved(pool, old.id_dapur)
      await pool.query(
        'INSERT INTO dapur_stok_history (id_dapur, nama_bahan, tipe, jumlah, satuan, keterangan) VALUES (?,?,?,?,?,?)',
        [old.id_dapur, old.nama_bahan, 'DEBIT', old.jumlah, old.satuan, 'Item Dihapus']
      )
    }
    await pool.query('DELETE FROM dapur_stok WHERE id_stok = ?', [req.params.id_stok])
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(getOperationalErrorStatus(err.message)).json({ error: err.message }) }
})

app.get('/api/stok/history/:id_dapur', async (req, res) => {
  try {
    await assertDapurApproved(pool, req.params.id_dapur)
    const [rows] = await pool.query(
      'SELECT * FROM dapur_stok_history WHERE id_dapur = ? ORDER BY created_at DESC',
      [req.params.id_dapur]
    )
    res.json(rows)
  } catch (err) { res.status(getOperationalErrorStatus(err.message)).json({ error: err.message }) }
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
