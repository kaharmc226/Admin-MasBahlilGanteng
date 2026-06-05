import express from 'express'
import cors from 'cors'
import pool from './db.js'

const app = express()
app.use(cors())
app.use(express.json())

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
    const { id_vendor, nama_menu, bahan, nilai_gizi, tanggal } = req.body
    const [result] = await pool.query(
      'INSERT INTO menus (id_vendor, nama_menu, bahan, nilai_gizi, tanggal) VALUES (?,?,?,?,?)',
      [id_vendor, nama_menu, JSON.stringify(bahan), JSON.stringify(nilai_gizi), tanggal]
    )
    res.status(201).json({ id_menu: result.insertId, ...req.body })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/menus/:id', async (req, res) => {
  try {
    const { nama_menu, bahan, nilai_gizi, status_validasi, notes, tanggal } = req.body
    const fields = [], values = []
    if (nama_menu !== undefined) { fields.push('nama_menu=?'); values.push(nama_menu) }
    if (bahan !== undefined) { fields.push('bahan=?'); values.push(JSON.stringify(bahan)) }
    if (nilai_gizi !== undefined) { fields.push('nilai_gizi=?'); values.push(JSON.stringify(nilai_gizi)) }
    if (status_validasi !== undefined) { fields.push('status_validasi=?'); values.push(status_validasi) }
    if (notes !== undefined) { fields.push('notes=?'); values.push(JSON.stringify(notes)) }
    if (tanggal !== undefined) { fields.push('tanggal=?'); values.push(tanggal) }
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
      SELECT p.*, d.lokasi AS dapur_lokasi, m.nama_menu
      FROM produksi p
      JOIN dapur d ON p.id_dapur = d.id_dapur
      JOIN menus m ON p.id_menu = m.id_menu
      ORDER BY p.created_at DESC
    `)
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/produksi', async (req, res) => {
  try {
    const { id_dapur, id_menu, status, jumlah_porsi } = req.body
    const [result] = await pool.query(
      'INSERT INTO produksi (id_dapur, id_menu, status, jumlah_porsi, waktu_mulai) VALUES (?,?,?,?,NOW())',
      [id_dapur, id_menu, status || 'persiapan', jumlah_porsi || 0]
    )
    res.status(201).json({ id_produksi: result.insertId, ...req.body })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.put('/api/produksi/:id', async (req, res) => {
  try {
    const { status } = req.body
    const extra = status === 'selesai' ? ', waktu_selesai=NOW()' : ''
    await pool.query(`UPDATE produksi SET status=?${extra} WHERE id_produksi=?`, [status, req.params.id])
    res.json({ message: 'Updated' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ============================================
// DISTRIBUSI
// ============================================
app.get('/api/distribusi', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, s.nama_sekolah, m.nama_menu
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
