import { dbConfig } from '../server/dbConfig.js'

const nutrientKeys = ['energi', 'protein', 'lemak', 'karbohidrat', 'serat', 'natrium']

export const defaultSeedProfile = 'kendari-clean'

export const seedProfileAliases = Object.freeze({
  clean: 'kendari-clean',
  demo: 'kendari-demo',
})

const seedProfileLabels = Object.freeze({
  'kendari-clean': 'Kendari clean baseline',
  'kendari-demo': 'Kendari demo baseline',
})

const baseNutritionItems = [
  { id: 1, kategori: 'makanan_pokok', nama: 'Nasi putih', satuan: '100 gram', energi: 175, protein: 3.2, lemak: 0.3, karbohidrat: 40.6, serat: 0.2, natrium: 1 },
  { id: 2, kategori: 'makanan_pokok', nama: 'Nasi merah', satuan: '100 gram', energi: 110, protein: 2.6, lemak: 0.9, karbohidrat: 23.5, serat: 1.8, natrium: 5 },
  { id: 3, kategori: 'makanan_pokok', nama: 'Kentang rebus', satuan: '100 gram', energi: 87, protein: 1.9, lemak: 0.1, karbohidrat: 20.1, serat: 1.8, natrium: 6 },
  { id: 4, kategori: 'lauk_sayur', nama: 'Dada ayam (no kulit)', satuan: '100 gram', energi: 184, protein: 31.0, lemak: 4.0, karbohidrat: 0.0, serat: 0.0, natrium: 74 },
  { id: 5, kategori: 'lauk_sayur', nama: 'Ikan kembung', satuan: '100 gram', energi: 167, protein: 22.0, lemak: 8.0, karbohidrat: 0.0, serat: 0.0, natrium: 90 },
  { id: 6, kategori: 'lauk_sayur', nama: 'Tempe goreng', satuan: '100 gram', energi: 118, protein: 11.0, lemak: 8.0, karbohidrat: 8.0, serat: 1.4, natrium: 9 },
  { id: 7, kategori: 'lauk_sayur', nama: 'Tumis kangkung', satuan: '100 gram', energi: 78, protein: 3.2, lemak: 4.5, karbohidrat: 8.6, serat: 2.8, natrium: 120 },
  { id: 8, kategori: 'buah', nama: 'Jeruk', satuan: '100 gram', energi: 47, protein: 0.9, lemak: 0.1, karbohidrat: 11.8, serat: 2.4, natrium: 0 },
  { id: 9, kategori: 'buah', nama: 'Pisang', satuan: '100 gram', energi: 105, protein: 1.3, lemak: 0.4, karbohidrat: 27.0, serat: 3.1, natrium: 1 },
  { id: 10, kategori: 'buah', nama: 'Pepaya', satuan: '100 gram', energi: 39, protein: 0.6, lemak: 0.1, karbohidrat: 10.0, serat: 1.8, natrium: 4 },
]

const cleanMenuDefinitions = [
  {
    id_menu: 1,
    id_vendor: 1,
    nama_menu: 'Menu Ayam Tempe Mandonga',
    status_validasi: 'approved',
    tanggal: '2026-06-21',
    notes: ['Menu referensi untuk distribusi reguler sekolah binaan Kota Kendari.'],
    ingredients: [
      { id_nutrition: 1, jumlah: 150 },
      { id_nutrition: 4, jumlah: 50 },
      { id_nutrition: 6, jumlah: 60 },
      { id_nutrition: 7, jumlah: 100 },
      { id_nutrition: 8, jumlah: 100 },
    ],
  },
  {
    id_menu: 2,
    id_vendor: 1,
    nama_menu: 'Menu Ikan Buah Poasia',
    status_validasi: 'pending',
    tanggal: '2026-06-22',
    notes: ['Menunggu review ahli gizi untuk peningkatan protein dan lemak sehat.'],
    ingredients: [
      { id_nutrition: 1, jumlah: 180 },
      { id_nutrition: 5, jumlah: 40 },
      { id_nutrition: 7, jumlah: 80 },
      { id_nutrition: 9, jumlah: 100 },
      { id_nutrition: 10, jumlah: 100 },
    ],
  },
]

function round1(value) {
  return Number(value.toFixed(1))
}

function formatNutritionTotals(totals) {
  return {
    energi: `${Math.round(totals.energi)} kkal`,
    protein: `${totals.protein.toFixed(1)} g`,
    lemak: `${totals.lemak.toFixed(1)} g`,
    karbohidrat: `${totals.karbohidrat.toFixed(1)} g`,
    serat: `${totals.serat.toFixed(1)} g`,
    natrium: `${Math.round(totals.natrium)} mg`,
    calculated: true,
  }
}

function buildMenuRecord(definition, nutritionMap) {
  const totals = nutrientKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
  const bahan = definition.ingredients.map((item) => {
    const nutritionItem = nutritionMap.get(item.id_nutrition)
    if (!nutritionItem) {
      throw new Error(`Seed menu "${definition.nama_menu}" references unknown nutrition item ${item.id_nutrition}.`)
    }
    const factor = item.jumlah / 100
    totals.energi += nutritionItem.energi * factor
    totals.protein += nutritionItem.protein * factor
    totals.lemak += nutritionItem.lemak * factor
    totals.karbohidrat += nutritionItem.karbohidrat * factor
    totals.serat += nutritionItem.serat * factor
    totals.natrium += nutritionItem.natrium * factor
    return {
      id_nutrition: nutritionItem.id,
      nama: nutritionItem.nama,
      jumlah: item.jumlah,
      satuan: 'gram',
      takaran: `~${item.jumlah} g`,
    }
  })

  return {
    id_menu: definition.id_menu,
    id_vendor: definition.id_vendor,
    nama_menu: definition.nama_menu,
    bahan: JSON.stringify(bahan),
    nilai_gizi: JSON.stringify(formatNutritionTotals(totals)),
    foto_url: null,
    notes: definition.notes?.length ? JSON.stringify(definition.notes) : null,
    status_validasi: definition.status_validasi,
    tanggal: definition.tanggal,
  }
}

function toNutritionRow(item) {
  return {
    id: item.id,
    kategori: item.kategori,
    nama: item.nama,
    satuan: item.satuan,
    energi: `${Math.round(item.energi)} kkal`,
    protein: round1(item.protein),
    lemak: round1(item.lemak),
    karbohidrat: round1(item.karbohidrat),
    serat: round1(item.serat),
    natrium: round1(item.natrium),
    status: 'active',
  }
}

function buildBaseDataset() {
  const nutritionMap = new Map(baseNutritionItems.map((item) => [item.id, item]))

  return {
    users: [
      { id_user: 1, name: 'Vendor Mandonga Kendari', email: 'vendor.mandonga@traksi.id', password: 'vendor123', role: 'vendor', status: 'active' },
      { id_user: 2, name: 'Pemerintah Kota Kendari', email: 'pemkot.kendari@traksi.id', password: 'gov123', role: 'pemerintah', status: 'active' },
      { id_user: 3, name: 'Ahli Gizi Kota Kendari', email: 'gizi.kendari@traksi.id', password: 'nutri123', role: 'ahli_gizi', status: 'active' },
      { id_user: 4, name: 'Admin SDN 02 Mandonga', email: 'sdn02.mandonga@sekolah.traksi.id', password: 'sekolah123', role: 'sekolah', status: 'active' },
    ],
    sekolah: [
      { id_sekolah: 1, nama_sekolah: 'SDN 02 Mandonga', alamat: 'Kel. Wawombalata, Kec. Mandonga, Kota Kendari', jenjang: 'SD', jumlah_siswa: 360, alergi_count: 8, intoleran_count: 3, id_user: 4, status: 'active' },
      { id_sekolah: 2, nama_sekolah: 'SMPN 05 Kendari', alamat: 'Kel. Rahandouna, Kec. Poasia, Kota Kendari', jenjang: 'SMP', jumlah_siswa: 420, alergi_count: 11, intoleran_count: 5, id_user: null, status: 'active' },
    ],
    vendors: [
      { id_vendor: 1, nama_vendor: 'Dapur Sehat Mandonga', region: 'Kota Kendari', status_verifikasi: 'approved', izin_usaha: 'MBG-KDI-2026-001', id_user: 1, id_ahli_gizi_pengawas: 3 },
    ],
    vendor_registrations: [],
    dapur: [
      { id_dapur: 1, id_vendor: 1, lokasi: 'Kel. Wawombalata, Kec. Mandonga, Kota Kendari', kapasitas_produksi: 2500, status_verifikasi: 'approved', review_note: null, reviewed_by: 2, reviewed_at: '2026-06-20 09:00:00' },
    ],
    dapur_stok: [
      { id_stok: 1, id_dapur: 1, nama_bahan: 'Nasi putih', jumlah: 1800, satuan: 'kg' },
      { id_stok: 2, id_dapur: 1, nama_bahan: 'Dada ayam (no kulit)', jumlah: 450, satuan: 'kg' },
      { id_stok: 3, id_dapur: 1, nama_bahan: 'Tempe goreng', jumlah: 260, satuan: 'kg' },
      { id_stok: 4, id_dapur: 1, nama_bahan: 'Tumis kangkung', jumlah: 200, satuan: 'kg' },
      { id_stok: 5, id_dapur: 1, nama_bahan: 'Jeruk', jumlah: 180, satuan: 'kg' },
      { id_stok: 6, id_dapur: 1, nama_bahan: 'Ikan kembung', jumlah: 220, satuan: 'kg' },
      { id_stok: 7, id_dapur: 1, nama_bahan: 'Pisang', jumlah: 140, satuan: 'kg' },
      { id_stok: 8, id_dapur: 1, nama_bahan: 'Pepaya', jumlah: 150, satuan: 'kg' },
      { id_stok: 9, id_dapur: 1, nama_bahan: 'Nasi merah', jumlah: 300, satuan: 'kg' },
      { id_stok: 10, id_dapur: 1, nama_bahan: 'Kentang rebus', jumlah: 120, satuan: 'kg' },
    ],
    dapur_stok_history: [],
    mapping_dapur_sekolah: [
      { id_mapping: 1, id_dapur: 1, id_sekolah: 1 },
      { id_mapping: 2, id_dapur: 1, id_sekolah: 2 },
    ],
    nutrition_database: baseNutritionItems.map(toNutritionRow),
    nutrition_requests: [],
    menus: cleanMenuDefinitions.map((item) => buildMenuRecord(item, nutritionMap)),
    produksi: [],
    distribusi: [],
    standar_gizi: [
      { id_standar: 1, title: 'Protein', requirement: '20g - 35g', color: 'var(--primary)', deskripsi: 'Mendukung pertumbuhan otot, jaringan, dan pemulihan anak usia sekolah.', detail: 'Utamakan kombinasi protein hewani dan nabati dalam satu porsi makan.', id_user_pembuat: 3 },
      { id_standar: 2, title: 'Kalori', requirement: '500kcal - 750kcal', color: 'var(--carrot)', deskripsi: 'Menjaga kecukupan energi untuk aktivitas belajar dan bermain.', detail: 'Sumber energi disusun dari karbohidrat utama, lauk, sayur, dan buah.', id_user_pembuat: 3 },
      { id_standar: 3, title: 'Lemak Sehat', requirement: '10g - 25g', color: 'var(--secondary)', deskripsi: 'Membantu fungsi otak dan penyerapan vitamin larut lemak.', detail: 'Gunakan lauk dan metode olah dengan lemak yang masih terkendali.', id_user_pembuat: 3 },
      { id_standar: 4, title: 'Serat', requirement: '4g - 12g', color: 'var(--banana)', deskripsi: 'Membantu kesehatan pencernaan dan rasa kenyang lebih stabil.', detail: 'Perkuat sayur dan buah agar serat menu harian tidak terlalu rendah.', id_user_pembuat: 3 },
    ],
    validasi_log: [],
    konfirmasi_kedatangan: [],
    feedback: [],
    alerts: [],
    wilayah_data: [
      { id_wilayah: 1, wilayah: 'Kota Kendari', total_jml: 780, total_n: 390, total_s: 390, tk_jml: 80, tk_n: 40, tk_s: 40, kb_jml: 0, kb_n: 0, kb_s: 0, sd_jml: 360, sd_n: 180, sd_s: 180, smp_jml: 220, smp_n: 110, smp_s: 110, sma_jml: 70, sma_n: 35, sma_s: 35, smk_jml: 40, smk_n: 20, smk_s: 20, slb_jml: 10, slb_n: 5, slb_s: 5 },
      { id_wilayah: 2, wilayah: 'Kecamatan Mandonga', total_jml: 250, total_n: 125, total_s: 125, tk_jml: 20, tk_n: 10, tk_s: 10, kb_jml: 0, kb_n: 0, kb_s: 0, sd_jml: 120, sd_n: 60, sd_s: 60, smp_jml: 70, smp_n: 35, smp_s: 35, sma_jml: 25, sma_n: 13, sma_s: 12, smk_jml: 10, smk_n: 5, smk_s: 5, slb_jml: 5, slb_n: 2, slb_s: 3 },
      { id_wilayah: 3, wilayah: 'Kecamatan Kadia', total_jml: 210, total_n: 105, total_s: 105, tk_jml: 25, tk_n: 12, tk_s: 13, kb_jml: 0, kb_n: 0, kb_s: 0, sd_jml: 95, sd_n: 48, sd_s: 47, smp_jml: 60, smp_n: 30, smp_s: 30, sma_jml: 20, sma_n: 10, sma_s: 10, smk_jml: 8, smk_n: 4, smk_s: 4, slb_jml: 2, slb_n: 1, slb_s: 1 },
      { id_wilayah: 4, wilayah: 'Kecamatan Poasia', total_jml: 320, total_n: 160, total_s: 160, tk_jml: 35, tk_n: 18, tk_s: 17, kb_jml: 0, kb_n: 0, kb_s: 0, sd_jml: 145, sd_n: 72, sd_s: 73, smp_jml: 90, smp_n: 45, smp_s: 45, sma_jml: 25, sma_n: 12, sma_s: 13, smk_jml: 22, smk_n: 11, smk_s: 11, slb_jml: 3, slb_n: 2, slb_s: 1 },
    ],
    dokumen_vendor: [
      { id_dokumen: 1, id_vendor: 1, nama_dokumen: 'Izin Operasional MBG Mandonga', jenis: 'izin_usaha', file_path: null, status: 'valid', is_archived: 0, review_note: null, tanggal_berlaku: '2026-01-15', tanggal_kadaluarsa: '2027-01-15' },
      { id_dokumen: 2, id_vendor: 1, nama_dokumen: 'Sertifikat Halal Dapur Sehat Mandonga', jenis: 'sertifikat_halal', file_path: null, status: 'valid', is_archived: 0, review_note: null, tanggal_berlaku: '2026-02-01', tanggal_kadaluarsa: '2028-02-01' },
    ],
  }
}

function buildDemoDataset() {
  const base = buildBaseDataset()
  return {
    ...base,
    vendor_registrations: [
      { id_registration: 1, nama_vendor: 'CV Pangan Rahandouna', alamat: 'Kel. Rahandouna, Kec. Poasia, Kota Kendari', region: 'Kota Kendari', kontak: '0812-0000-0001', email: 'registrasi.poasia@vendor.traksi.id', izin_usaha: 'MBG-KDI-2026-REG-01', status: 'pending', review_note: null, reviewed_by: null, reviewed_at: null, id_vendor: null, documents: JSON.stringify([{ nama: 'Izin Usaha', status: 'uploaded' }]) },
    ],
    dapur: [
      ...base.dapur,
      { id_dapur: 2, id_vendor: 1, lokasi: 'Kel. Rahandouna, Kec. Poasia, Kota Kendari', kapasitas_produksi: 1800, status_verifikasi: 'pending', review_note: null, reviewed_by: null, reviewed_at: null },
    ],
    dapur_stok_history: [
      { id_log: 1, id_dapur: 1, nama_bahan: 'Nasi putih', tipe: 'CREDIT', jumlah: 1800, satuan: 'kg', keterangan: 'Stok awal baseline demo Kendari' },
      { id_log: 2, id_dapur: 1, nama_bahan: 'Dada ayam (no kulit)', tipe: 'DEBIT', jumlah: 18, satuan: 'kg', keterangan: 'Pemakaian batch demo distribusi Mandonga' },
    ],
    produksi: [
      { id_produksi: 1, id_dapur: 1, id_menu: 1, status: 'selesai', jumlah_porsi: 360, waktu_mulai: '2026-06-21 04:30:00', waktu_selesai: '2026-06-21 07:30:00' },
    ],
    distribusi: [
      { id_distribusi: 1, kode_transaksi: 'TX-KDI-001', id_produksi: 1, id_sekolah: 1, jumlah_porsi: 360, waktu_kirim: '2026-06-21 08:00:00', waktu_tiba: '2026-06-21 08:35:00', status: 'SELESAI', blockchain_hash: '0x7ac91f5b2cdd' },
    ],
    validasi_log: [
      { id_validasi: 1, id_menu: 1, id_user: 3, aksi: 'approved', catatan: 'Menu referensi Kendari lolos validasi otomatis dan siap dipakai untuk distribusi reguler.' },
    ],
    konfirmasi_kedatangan: [
      { id_konfirmasi: 1, id_distribusi: 1, id_user: 4, waktu_konfirmasi: '2026-06-21 08:40:00', kondisi_makanan: 'baik', jumlah_diterima: 360, foto_bukti: null, catatan: 'Distribusi tiba tepat waktu dan makanan masih hangat.' },
    ],
    feedback: [
      { id_feedback: 1, id_sekolah: 1, id_user: 4, id_menu: 1, rating: 5, komentar: 'Menu ayam tempe disukai siswa dan porsi cukup untuk makan siang sekolah.', kategori: 'kualitas' },
    ],
    alerts: [
      { id_alert: 1, judul: 'Pemantauan Distribusi Mandonga', deskripsi: 'Distribusi batch pagi ke SDN 02 Mandonga selesai tepat waktu dan tanpa kendala.', severity: 'info', wilayah: 'Kota Kendari', is_resolved: 0, is_archived: 0, resolved_by: null, resolved_at: null },
    ],
    nutrition_requests: [
      { id_request: 1, id_vendor: 1, requested_by: 1, nama: 'Tahu kukus', kategori: 'lauk_sayur', catatan: 'Usulan bahan alternatif rendah minyak untuk siklus menu pekanan.', status: 'pending', reviewed_by: null, id_nutrition: null, review_note: null, reviewed_at: null },
    ],
  }
}

const tableDefinitions = [
  ['users', ['id_user', 'name', 'email', 'password', 'role', 'status']],
  ['sekolah', ['id_sekolah', 'nama_sekolah', 'alamat', 'jenjang', 'jumlah_siswa', 'alergi_count', 'intoleran_count', 'id_user', 'status']],
  ['vendors', ['id_vendor', 'nama_vendor', 'region', 'status_verifikasi', 'izin_usaha', 'id_user', 'id_ahli_gizi_pengawas']],
  ['vendor_registrations', ['id_registration', 'nama_vendor', 'alamat', 'region', 'kontak', 'email', 'izin_usaha', 'status', 'review_note', 'reviewed_by', 'reviewed_at', 'id_vendor', 'documents']],
  ['dapur', ['id_dapur', 'id_vendor', 'lokasi', 'kapasitas_produksi', 'status_verifikasi', 'review_note', 'reviewed_by', 'reviewed_at']],
  ['dapur_stok', ['id_stok', 'id_dapur', 'nama_bahan', 'jumlah', 'satuan']],
  ['dapur_stok_history', ['id_log', 'id_dapur', 'nama_bahan', 'tipe', 'jumlah', 'satuan', 'keterangan']],
  ['mapping_dapur_sekolah', ['id_mapping', 'id_dapur', 'id_sekolah']],
  ['nutrition_database', ['id', 'kategori', 'nama', 'satuan', 'energi', 'protein', 'lemak', 'karbohidrat', 'serat', 'natrium', 'status']],
  ['nutrition_requests', ['id_request', 'id_vendor', 'requested_by', 'nama', 'kategori', 'catatan', 'status', 'reviewed_by', 'id_nutrition', 'review_note', 'reviewed_at']],
  ['menus', ['id_menu', 'id_vendor', 'nama_menu', 'bahan', 'nilai_gizi', 'foto_url', 'notes', 'status_validasi', 'tanggal']],
  ['produksi', ['id_produksi', 'id_dapur', 'id_menu', 'status', 'jumlah_porsi', 'waktu_mulai', 'waktu_selesai']],
  ['distribusi', ['id_distribusi', 'kode_transaksi', 'id_produksi', 'id_sekolah', 'jumlah_porsi', 'waktu_kirim', 'waktu_tiba', 'status', 'blockchain_hash']],
  ['standar_gizi', ['id_standar', 'title', 'requirement', 'color', 'deskripsi', 'detail', 'id_user_pembuat']],
  ['validasi_log', ['id_validasi', 'id_menu', 'id_user', 'aksi', 'catatan']],
  ['konfirmasi_kedatangan', ['id_konfirmasi', 'id_distribusi', 'id_user', 'waktu_konfirmasi', 'kondisi_makanan', 'jumlah_diterima', 'foto_bukti', 'catatan']],
  ['feedback', ['id_feedback', 'id_sekolah', 'id_user', 'id_menu', 'rating', 'komentar', 'kategori']],
  ['alerts', ['id_alert', 'judul', 'deskripsi', 'severity', 'wilayah', 'is_resolved', 'is_archived', 'resolved_by', 'resolved_at']],
  ['wilayah_data', ['id_wilayah', 'wilayah', 'total_jml', 'total_n', 'total_s', 'tk_jml', 'tk_n', 'tk_s', 'kb_jml', 'kb_n', 'kb_s', 'sd_jml', 'sd_n', 'sd_s', 'smp_jml', 'smp_n', 'smp_s', 'sma_jml', 'sma_n', 'sma_s', 'smk_jml', 'smk_n', 'smk_s', 'slb_jml', 'slb_n', 'slb_s']],
  ['dokumen_vendor', ['id_dokumen', 'id_vendor', 'nama_dokumen', 'jenis', 'file_path', 'status', 'is_archived', 'review_note', 'tanggal_berlaku', 'tanggal_kadaluarsa']],
]

function buildProfileDataset(profileName) {
  if (profileName === 'kendari-demo') return buildDemoDataset()
  if (profileName === 'kendari-clean') return buildBaseDataset()
  throw new Error(`Unknown seed profile: ${profileName}`)
}

async function insertRows(connection, tableName, columns, rows) {
  if (!rows || rows.length === 0) return
  const placeholders = columns.map(() => '?').join(', ')
  const sql = `INSERT INTO \`${tableName}\` (${columns.map((column) => `\`${column}\``).join(', ')}) VALUES (${placeholders})`
  for (const row of rows) {
    await connection.query(sql, columns.map((column) => row[column] ?? null))
  }
}

export function listSeedProfiles() {
  return Object.keys(seedProfileLabels)
}

export function resolveSeedProfileName(input = defaultSeedProfile) {
  const trimmed = String(input || '').trim()
  if (!trimmed) return defaultSeedProfile
  return seedProfileAliases[trimmed] || trimmed
}

export function getSeedProfileLabel(profileName) {
  return seedProfileLabels[resolveSeedProfileName(profileName)] || profileName
}

export async function applySeedProfile(connection, profileName = defaultSeedProfile) {
  const resolvedProfile = resolveSeedProfileName(profileName)
  const dataset = buildProfileDataset(resolvedProfile)
  await connection.query(`USE \`${dbConfig.database}\``)
  await connection.beginTransaction()
  try {
    for (const [tableName, columns] of tableDefinitions) {
      await insertRows(connection, tableName, columns, dataset[tableName] || [])
    }
    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  }
}
