#!/usr/bin/env node

import readline from 'readline'
import { dbConfig } from '../server/dbConfig.js'
import {
  createAdminConnection,
  databaseState,
  formatDbTarget,
  formatRowCounts,
  initializeDemoDatabase,
  initializeMinimalDatabase,
} from './db-utils.js'

const args = process.argv.slice(2)
const helpRequested = args.includes('--help') || args.includes('-h')
const yesMode = args.includes('--yes')
const mergeMode = args.includes('--merge')
const overwriteMode = args.includes('--overwrite') || args.includes('--reset')

if (helpRequested) {
  console.log(`
TRAKSI demo seeder

Usage:
  npm run seed:demo
  npm run seed:demo -- --merge
  npm run seed:demo -- --overwrite
  npm run seed:demo -- --overwrite --yes

Modes:
  --merge       Add or refresh optional demo data on top of schema + baseline data
  --overwrite   Rebuild schema, baseline data, and full demo data
  --yes         Skip confirmation prompts
  --help        Show this help
`)
  process.exit(0)
}

if (mergeMode && overwriteMode) {
  console.error('Use only one mode: --merge or --overwrite.')
  process.exit(1)
}

function formatError(err) {
  return err?.cause?.message || err?.message || err?.code || String(err)
}

function createPrompt() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
}

function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()))
  })
}

async function chooseMode(state) {
  if (overwriteMode) return 'overwrite'
  if (mergeMode) return 'merge'
  if (yesMode) return 'merge'

  if (!state.exists || !state.hasTables || state.totalRows === 0) {
    return 'merge'
  }

  const rl = createPrompt()
  try {
    console.log(`Existing data detected in "${dbConfig.database}".`)
    console.log(formatRowCounts(state.rowCounts))
    const answer = (await askQuestion(
      rl,
      'Choose action: [M]erge demo data, [O]verwrite database, [C]ancel: '
    )).toLowerCase()

    if (answer === 'o' || answer === 'overwrite') return 'overwrite'
    if (answer === 'm' || answer === 'merge') return 'merge'
    return 'cancel'
  } finally {
    rl.close()
  }
}

async function ensureBaseSchema(connection) {
  const state = await databaseState(connection, dbConfig)
  if (!state.exists || !state.hasTables) {
    console.log(`Initializing schema and minimal baseline for "${dbConfig.database}"...`)
    await initializeMinimalDatabase(connection, { config: dbConfig })
  }
  await connection.query(`USE \`${dbConfig.database}\``)
}

function stringify(value) {
  return value == null ? null : JSON.stringify(value)
}

async function upsertUsers(connection) {
  const users = [
    [1, 'Vendor Jakarta Timur', 'v.jaktim@traksi.id', 'vendor123', 'vendor', 'active'],
    [2, 'Gov DKI Jakarta', 'gov.dki@traksi.id', 'gov123', 'pemerintah', 'active'],
    [3, 'Ahli Gizi Jakarta Timur', 'nutri.jaktim@traksi.id', 'nutri123', 'ahli_gizi', 'active'],
    [4, 'Admin SDN 06 Baru', 'sdn06@sekolah.traksi.id', 'sekolah123', 'sekolah', 'active'],
    [5, 'Vendor Jakarta Selatan', 'v.jaksel@traksi.id', 'vendor123', 'vendor', 'active'],
    [6, 'Admin SMPN 217 Jakarta', 'smpn217@sekolah.traksi.id', 'sekolah123', 'sekolah', 'active'],
    [7, 'Ahli Gizi Jakarta Selatan', 'nutri.jaksel@traksi.id', 'nutri123', 'ahli_gizi', 'active'],
  ]

  for (const row of users) {
    await connection.query(
      `INSERT INTO users (id_user, name, email, password, role, status)
       VALUES (?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         email = VALUES(email),
         password = VALUES(password),
         role = VALUES(role),
         status = VALUES(status)`,
      row
    )
  }
}

async function upsertSekolah(connection) {
  const sekolah = [
    [1, 'SDN 1 Banda Aceh', 'Banda Aceh, Aceh', 'SD', 350, 5, 2, null],
    [2, 'SMPN 1 Sabang', 'Sabang, Aceh', 'SMP', 420, 8, 3, null],
    [3, 'SDN 06 Baru', 'Kec. Pasar Rebo, Jaktim', 'SD', 404, 12, 4, 4],
    [4, 'SMPN 217 Jakarta', 'Kec. Pasar Rebo, Jaktim', 'SMP', 713, 18, 6, 6],
    [5, 'SDN 1 Jayapura', 'Jayapura, Papua', 'SD', 320, 5, 2, null],
    [6, 'SMPN 1 Merauke', 'Merauke, Papua Selatan', 'SMP', 550, 10, 4, null],
  ]

  for (const row of sekolah) {
    await connection.query(
      `INSERT INTO sekolah (id_sekolah, nama_sekolah, alamat, jenjang, jumlah_siswa, alergi_count, intoleran_count, id_user)
       VALUES (?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         nama_sekolah = VALUES(nama_sekolah),
         alamat = VALUES(alamat),
         jenjang = VALUES(jenjang),
         jumlah_siswa = VALUES(jumlah_siswa),
         alergi_count = VALUES(alergi_count),
         intoleran_count = VALUES(intoleran_count),
         id_user = VALUES(id_user)`,
      row
    )
  }
}

async function upsertVendors(connection) {
  const vendors = [
    [1, 'Dapur Sehat Nusantara', 'DKI Jakarta', 'approved', 'B-992/MBG/2026', 1],
    [2, 'PT Pangan Nusantara Lestari', 'Jakarta Selatan', 'approved', 'B-1054/MBG/2026', 5],
    [3, 'CV Berkah Gizi Mandiri', 'Banda Aceh', 'pending', 'B-2011/MBG/2026', null],
  ]

  for (const row of vendors) {
    await connection.query(
      `INSERT INTO vendors (id_vendor, nama_vendor, region, status_verifikasi, izin_usaha, id_user)
       VALUES (?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         nama_vendor = VALUES(nama_vendor),
         region = VALUES(region),
         status_verifikasi = VALUES(status_verifikasi),
         izin_usaha = VALUES(izin_usaha),
         id_user = VALUES(id_user)`,
      row
    )
  }
}

async function upsertDapur(connection) {
  const dapur = [
    [1, 1, 'Jakarta Timur', 5000],
    [2, 2, 'Pasar Minggu, Jakarta Selatan', 3500],
    [3, 1, 'Pulo Gadung, Jakarta Timur', 4000],
  ]

  for (const row of dapur) {
    await connection.query(
      `INSERT INTO dapur (id_dapur, id_vendor, lokasi, kapasitas_produksi)
       VALUES (?,?,?,?)
       ON DUPLICATE KEY UPDATE
         id_vendor = VALUES(id_vendor),
         lokasi = VALUES(lokasi),
         kapasitas_produksi = VALUES(kapasitas_produksi)`,
      row
    )
  }
}

async function upsertMappings(connection) {
  const mappings = [
    [1, 1, 3],
    [2, 2, 4],
    [3, 3, 3],
  ]

  for (const row of mappings) {
    await connection.query(
      `INSERT INTO mapping_dapur_sekolah (id_mapping, id_dapur, id_sekolah)
       VALUES (?,?,?)
       ON DUPLICATE KEY UPDATE
         id_dapur = VALUES(id_dapur),
         id_sekolah = VALUES(id_sekolah)`,
      row
    )
  }
}

async function upsertMenus(connection) {
  const menus = [
    [
      101,
      1,
      'Menu MBG Makanan Bergizi Gratis',
      stringify([
        { nama: 'Tahu Goreng', takaran: '~30 g' },
        { nama: 'Nasi Putih', takaran: '~100 g' },
        { nama: 'Chicken Wings', takaran: '~48 g' },
        { nama: 'Pisang', takaran: '~50 g' },
        { nama: 'Tumis Buncis + Jagung', takaran: '~50 g' },
      ]),
      stringify({
        energi: '503 kkal',
        protein: '15.9 g',
        lemak: '21.3 g',
        karbohidrat: '61.4 g',
        serat: '3.6 g',
        natrium: '558 mg',
      }),
      stringify([
        'Kandungan gizi menu ini cukup untuk memenuhi kebutuhan makan siang anak sekolah, tetapi kebutuhan seratnya masih kurang.',
        'Metode pengolahan bisa lebih bervariasi, tidak hanya digoreng.',
      ]),
      'rejected',
      '2026-03-14',
    ],
    [
      102,
      1,
      'Nasi Ikan Bandeng Presto',
      stringify([
        { nama: 'Ikan Bandeng', takaran: '~80 g' },
        { nama: 'Nasi Merah', takaran: '~120 g' },
        { nama: 'Sayur Lodeh', takaran: '~60 g' },
      ]),
      stringify({
        energi: '480 kkal',
        protein: '22 g',
        lemak: '12 g',
        karbohidrat: '65 g',
        serat: '5 g',
        natrium: '450 mg',
      }),
      null,
      'pending',
      '2026-03-15',
    ],
    [
      103,
      1,
      'Sup Ayam Jamur Spesial',
      stringify([
        { nama: 'Ayam Fillet', takaran: '~60 g' },
        { nama: 'Jamur Kuping', takaran: '~20 g' },
        { nama: 'Nasi Putih', takaran: '~100 g' },
        { nama: 'Brokoli', takaran: '~40 g' },
        { nama: 'Apel', takaran: '~50 g' },
      ]),
      stringify({
        energi: '520 kkal',
        protein: '24 g',
        lemak: '14 g',
        karbohidrat: '70 g',
        serat: '4.5 g',
        natrium: '490 mg',
      }),
      null,
      'approved',
      '2026-03-16',
    ],
    [
      104,
      2,
      'Nasi Kuning Tumpeng Sehat',
      stringify([
        { nama: 'Nasi Kuning', takaran: '~120 g' },
        { nama: 'Ayam Suwir', takaran: '~50 g' },
        { nama: 'Telur Dadar Iris', takaran: '~25 g' },
        { nama: 'Timun & Tomat', takaran: '~30 g' },
      ]),
      stringify({
        energi: '550 kkal',
        protein: '18 g',
        lemak: '16 g',
        karbohidrat: '78 g',
        serat: '3.2 g',
        natrium: '510 mg',
      }),
      null,
      'approved',
      '2026-03-13',
    ],
    [
      105,
      2,
      'Daging Sapi Lada Hitam Madu',
      stringify([
        { nama: 'Daging Sapi', takaran: '~70 g' },
        { nama: 'Paprika & Bawang Bombay', takaran: '~30 g' },
        { nama: 'Nasi Putih', takaran: '~100 g' },
        { nama: 'Melon', takaran: '~60 g' },
      ]),
      stringify({
        energi: '610 kkal',
        protein: '26 g',
        lemak: '18 g',
        karbohidrat: '68 g',
        serat: '3.8 g',
        natrium: '590 mg',
      }),
      stringify([
        'Ganti kecap dengan opsi rendah natrium.',
        'Pastikan daging dimasak hingga benar-benar empuk agar mudah dikunyah anak SD.',
      ]),
      'approved',
      '2026-03-12',
    ],
    [
      106,
      2,
      'Sate Lilit Ayam Gizi Tinggi',
      stringify([
        { nama: 'Ayam Cincang', takaran: '~80 g' },
        { nama: 'Santan Kelapa', takaran: '~15 ml' },
        { nama: 'Nasi Merah', takaran: '~100 g' },
        { nama: 'Urap Sayuran', takaran: '~60 g' },
      ]),
      stringify({
        energi: '580 kkal',
        protein: '22 g',
        lemak: '20 g',
        karbohidrat: '64 g',
        serat: '5.2 g',
        natrium: '410 mg',
      }),
      null,
      'pending',
      '2026-03-17',
    ],
  ]

  for (const row of menus) {
    await connection.query(
      `INSERT INTO menus (id_menu, id_vendor, nama_menu, bahan, nilai_gizi, notes, status_validasi, tanggal)
       VALUES (?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         id_vendor = VALUES(id_vendor),
         nama_menu = VALUES(nama_menu),
         bahan = VALUES(bahan),
         nilai_gizi = VALUES(nilai_gizi),
         notes = VALUES(notes),
         status_validasi = VALUES(status_validasi),
         tanggal = VALUES(tanggal)`,
      row
    )
  }
}

async function upsertProduksi(connection) {
  const produksi = [
    [1, 1, 101, 'siap_kirim', 404, '2026-03-14 06:00:00', null],
    [2, 2, 104, 'selesai', 713, '2026-03-13 05:00:00', '2026-03-13 09:30:00'],
    [3, 2, 105, 'selesai', 713, '2026-03-12 05:00:00', '2026-03-12 09:15:00'],
    [4, 1, 103, 'persiapan', 404, '2026-03-16 06:00:00', null],
  ]

  for (const row of produksi) {
    await connection.query(
      `INSERT INTO produksi (id_produksi, id_dapur, id_menu, status, jumlah_porsi, waktu_mulai, waktu_selesai)
       VALUES (?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         id_dapur = VALUES(id_dapur),
         id_menu = VALUES(id_menu),
         status = VALUES(status),
         jumlah_porsi = VALUES(jumlah_porsi),
         waktu_mulai = VALUES(waktu_mulai),
         waktu_selesai = VALUES(waktu_selesai)`,
      row
    )
  }
}

async function upsertDistribusi(connection) {
  const distribusi = [
    [1, 'TX-001', 1, 3, 404, '2026-03-14 11:00:00', null, 'DISTRIBUSI', '0xabc123def456'],
    [2, 'TX-002', 2, 4, 713, '2026-03-13 10:15:00', '2026-03-13 11:35:00', 'SELESAI', '0x789defabc0123456'],
    [3, 'TX-003', 3, 4, 713, '2026-03-12 10:00:00', '2026-03-12 11:20:00', 'SELESAI', '0x456def789abc0123'],
    [4, 'TX-004', 4, 3, 404, null, null, 'DIJADWALKAN', null],
  ]

  for (const row of distribusi) {
    await connection.query(
      `INSERT INTO distribusi (id_distribusi, kode_transaksi, id_produksi, id_sekolah, jumlah_porsi, waktu_kirim, waktu_tiba, status, blockchain_hash)
       VALUES (?,?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         kode_transaksi = VALUES(kode_transaksi),
         id_produksi = VALUES(id_produksi),
         id_sekolah = VALUES(id_sekolah),
         jumlah_porsi = VALUES(jumlah_porsi),
         waktu_kirim = VALUES(waktu_kirim),
         waktu_tiba = VALUES(waktu_tiba),
         status = VALUES(status),
         blockchain_hash = VALUES(blockchain_hash)`,
      row
    )
  }
}

async function upsertStandarGizi(connection) {
  const standar = [
    [1, 'Protein', '20g - 35g', 'var(--primary)', 'Esensial untuk pertumbuhan otot dan jaringan anak.', 'Sumber utama: Daging sapi rendah lemak, ayam tanpa kulit, telur, dan tempe.', 3],
    [2, 'Kalori', '500kcal - 750kcal', 'var(--carrot)', 'Energi harian optimal untuk aktivitas belajar.', 'Keseimbangan karbohidrat kompleks (nasi merah/putih) dan serat sayuran.', 3],
    [3, 'Lemak Sehat', '10g - 25g', 'var(--secondary)', 'Mendukung fungsi otak dan penyerapan vitamin.', 'Gunakan minyak zaitun atau minyak kelapa sawit bersertifikat fortifikasi.', 3],
  ]

  for (const row of standar) {
    await connection.query(
      `INSERT INTO standar_gizi (id_standar, title, requirement, color, deskripsi, detail, id_user_pembuat)
       VALUES (?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         requirement = VALUES(requirement),
         color = VALUES(color),
         deskripsi = VALUES(deskripsi),
         detail = VALUES(detail),
         id_user_pembuat = VALUES(id_user_pembuat)`,
      row
    )
  }
}

async function upsertValidasiLog(connection) {
  const logs = [
    [1, 101, 3, 'rejected', 'Kebutuhan serat masih kurang. Metode pengolahan terlalu banyak digoreng.'],
    [2, 103, 3, 'approved', 'Menu seimbang dengan protein tinggi dan serat brokoli yang baik. Disetujui.'],
    [3, 104, 3, 'approved', 'Komposisi karbohidrat dan lemak seimbang. Sesuai standar nasional.'],
    [4, 105, 3, 'approved', 'Telah disesuaikan dengan opsi kecap rendah natrium.'],
  ]

  for (const row of logs) {
    await connection.query(
      `INSERT INTO validasi_log (id_validasi, id_menu, id_user, aksi, catatan)
       VALUES (?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         id_menu = VALUES(id_menu),
         id_user = VALUES(id_user),
         aksi = VALUES(aksi),
         catatan = VALUES(catatan)`,
      row
    )
  }
}

async function upsertFeedback(connection) {
  const feedback = [
    [1, 3, 4, 101, 4, 'Makanan sampai tepat waktu dan masih hangat. Anak-anak menyukai menu chicken wings.', 'kualitas'],
    [2, 3, 4, 101, 3, 'Porsi sayur terlalu sedikit. Mohon ditambah untuk keseimbangan gizi.', 'kuantitas'],
    [3, 4, 6, 104, 5, 'Nasi kuning harum sekali, porsi lauk pas dan sangat digemari siswa SMP.', 'kualitas'],
    [4, 4, 6, 105, 4, 'Daging empuk dan rasa lada hitamnya disesuaikan sehingga tidak terlalu pedas untuk anak-anak.', 'kualitas'],
    [5, 3, 4, 103, 5, 'Uji coba menu sup ayam jamur sangat disukai oleh anak-anak kelas 1-3.', 'saran'],
  ]

  for (const row of feedback) {
    await connection.query(
      `INSERT INTO feedback (id_feedback, id_sekolah, id_user, id_menu, rating, komentar, kategori)
       VALUES (?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         id_sekolah = VALUES(id_sekolah),
         id_user = VALUES(id_user),
         id_menu = VALUES(id_menu),
         rating = VALUES(rating),
         komentar = VALUES(komentar),
         kategori = VALUES(kategori)`,
      row
    )
  }
}

async function upsertAlerts(connection) {
  const alerts = [
    [1, 'Keterlambatan Distribusi', 'Distribusi ke SDN 1 Banda Aceh terlambat 45 menit dari jadwal.', 'warning', 'Aceh', 0, null, null],
    [2, 'Stok Bahan Baku Rendah', 'Vendor Dapur Sehat Nusantara melaporkan stok ayam tersisa 20%.', 'critical', 'DKI Jakarta', 0, null, null],
    [3, 'Feedback Positif Meningkat', 'Rata-rata feedback sekolah wilayah Jakarta Timur naik 15% bulan ini.', 'info', 'DKI Jakarta', 0, null, null],
  ]

  for (const row of alerts) {
    await connection.query(
      `INSERT INTO alerts (id_alert, judul, deskripsi, severity, wilayah, is_resolved, resolved_by, resolved_at)
       VALUES (?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         judul = VALUES(judul),
         deskripsi = VALUES(deskripsi),
         severity = VALUES(severity),
         wilayah = VALUES(wilayah),
         is_resolved = VALUES(is_resolved),
         resolved_by = VALUES(resolved_by),
         resolved_at = VALUES(resolved_at)`,
      row
    )
  }
}

async function upsertWilayahData(connection) {
  const wilayah = [
    [1, 'Kab. Konawe Selatan', 737, 476, 261, 227, 43, 184, 31, 0, 31, 316, 312, 4, 85, 79, 6, 30, 26, 4, 11, 10, 1, 5, 1, 4],
    [2, 'Kab. Muna', 726, 357, 369, 213, 54, 159, 92, 0, 92, 220, 208, 12, 82, 64, 18, 37, 22, 15, 27, 7, 20, 24, 1, 23],
    [3, 'Kota Kendari', 461, 171, 290, 146, 16, 130, 46, 0, 46, 136, 107, 29, 46, 25, 21, 29, 13, 16, 22, 7, 15, 9, 2, 7],
  ]

  for (const row of wilayah) {
    await connection.query(
      `INSERT INTO wilayah_data (id_wilayah, wilayah, total_jml, total_n, total_s, tk_jml, tk_n, tk_s, kb_jml, kb_n, kb_s, sd_jml, sd_n, sd_s, smp_jml, smp_n, smp_s, sma_jml, sma_n, sma_s, smk_jml, smk_n, smk_s, slb_jml, slb_n, slb_s)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         wilayah = VALUES(wilayah),
         total_jml = VALUES(total_jml),
         total_n = VALUES(total_n),
         total_s = VALUES(total_s),
         tk_jml = VALUES(tk_jml),
         tk_n = VALUES(tk_n),
         tk_s = VALUES(tk_s),
         kb_jml = VALUES(kb_jml),
         kb_n = VALUES(kb_n),
         kb_s = VALUES(kb_s),
         sd_jml = VALUES(sd_jml),
         sd_n = VALUES(sd_n),
         sd_s = VALUES(sd_s),
         smp_jml = VALUES(smp_jml),
         smp_n = VALUES(smp_n),
         smp_s = VALUES(smp_s),
         sma_jml = VALUES(sma_jml),
         sma_n = VALUES(sma_n),
         sma_s = VALUES(sma_s),
         smk_jml = VALUES(smk_jml),
         smk_n = VALUES(smk_n),
         smk_s = VALUES(smk_s),
         slb_jml = VALUES(slb_jml),
         slb_n = VALUES(slb_n),
         slb_s = VALUES(slb_s)`,
      row
    )
  }
}

async function upsertDokumenVendor(connection) {
  const docs = [
    [1, 1, 'Izin Usaha MBG B-992', 'izin_usaha', 'valid', '2026-01-01', '2027-01-01'],
    [2, 1, 'Sertifikat Halal MUI', 'sertifikat_halal', 'valid', '2025-06-15', '2027-06-15'],
    [3, 1, 'Sertifikat Laik Hygiene', 'sertifikat_laik_hygiene', 'valid', '2026-02-01', '2027-02-01'],
    [4, 2, 'Izin Usaha PT PNL', 'izin_usaha', 'valid', '2026-01-10', '2028-01-10'],
    [5, 2, 'Sertifikat Halal PT PNL', 'sertifikat_halal', 'valid', '2025-08-01', '2027-08-01'],
  ]

  for (const row of docs) {
    await connection.query(
      `INSERT INTO dokumen_vendor (id_dokumen, id_vendor, nama_dokumen, jenis, status, tanggal_berlaku, tanggal_kadaluarsa)
       VALUES (?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         id_vendor = VALUES(id_vendor),
         nama_dokumen = VALUES(nama_dokumen),
         jenis = VALUES(jenis),
         status = VALUES(status),
         tanggal_berlaku = VALUES(tanggal_berlaku),
         tanggal_kadaluarsa = VALUES(tanggal_kadaluarsa)`,
      row
    )
  }
}

async function upsertDapurStok(connection) {
  const stok = [
    [1, 'Beras Putih', 250, 'kg'],
    [1, 'Daging Ayam', 100, 'kg'],
    [1, 'Sayur Bayam', 50, 'ikat'],
    [1, 'Ayam Fillet', 850, 'kg'],
    [1, 'Jamur Kuping', 150, 'kg'],
    [1, 'Nasi Putih', 1200, 'kg'],
    [1, 'Brokoli', 450, 'kg'],
    [1, 'Apel', 500, 'kg'],
    [1, 'Tahu Goreng', 400, 'pcs'],
    [1, 'Chicken Wings', 600, 'pcs'],
    [1, 'Pisang', 800, 'pcs'],
    [1, 'Tumis Buncis + Jagung', 350, 'kg'],
    [2, 'Nasi Kuning', 900, 'kg'],
    [2, 'Ayam Suwir', 500, 'kg'],
    [2, 'Telur Dadar Iris', 300, 'kg'],
    [2, 'Timun & Tomat', 250, 'kg'],
    [2, 'Daging Sapi', 600, 'kg'],
    [2, 'Paprika & Bawang Bombay', 200, 'kg'],
    [2, 'Melon', 400, 'kg'],
  ]

  for (const row of stok) {
    await connection.query(
      `INSERT INTO dapur_stok (id_dapur, nama_bahan, jumlah, satuan)
       VALUES (?,?,?,?)
       ON DUPLICATE KEY UPDATE
         jumlah = VALUES(jumlah),
         satuan = VALUES(satuan)`,
      row
    )
  }
}

async function upsertNutritionDatabase(connection) {
  const nutrition = [
    [1, 'makanan_pokok', 'Nasi putih', '100 gram', '175 kkal'],
    [2, 'makanan_pokok', 'Nasi merah', '100 gram', '110 kkal'],
    [3, 'makanan_pokok', 'Kentang rebus', '100 gram', '87 kkal'],
    [4, 'makanan_pokok', 'Ubi jalar', '100 gram', '86 kkal'],
    [5, 'makanan_pokok', 'Singkong', '100 gram', '160 kkal'],
    [6, 'makanan_pokok', 'Roti putih', '1 iris', '66 kkal'],
    [7, 'makanan_pokok', 'Roti gandum', '1 iris', '67 kkal'],
    [8, 'makanan_pokok', 'Mi goreng instan', '80 gram', '350 kkal'],
    [9, 'lauk_sayur', 'Dada ayam (kulit)', '100 gram', '216 kkal'],
    [10, 'lauk_sayur', 'Dada ayam (no kulit)', '100 gram', '184 kkal'],
    [11, 'lauk_sayur', 'Bebek goreng', '100 gram', '286 kkal'],
    [12, 'lauk_sayur', 'Ikan kembung', '100 gram', '167 kkal'],
    [13, 'lauk_sayur', 'Udang goreng', '100 gram', '150 kkal'],
    [14, 'lauk_sayur', 'Bakso sapi', '100 gram', '202 kkal'],
    [15, 'lauk_sayur', 'Chicken nugget', '100 gram', '297 kkal'],
    [16, 'lauk_sayur', 'Telur dadar', '1 btr besar', '93 kkal'],
    [17, 'lauk_sayur', 'Tempe goreng', '1 porsi', '118 kkal'],
    [18, 'lauk_sayur', 'Tahu isi', '1 porsi', '124 kkal'],
    [19, 'lauk_sayur', 'Tumis kangkung', '85 gram', '155 kkal'],
    [20, 'lauk_sayur', 'Perkedel kentang', '75 gram', '117 kkal'],
    [21, 'buah', 'Apel', '1 buah sedang', '72 kkal'],
    [22, 'buah', 'Pisang', '1 buah sedang', '105 kkal'],
    [23, 'buah', 'Jambu biji', '1 buah', '37 kkal'],
    [24, 'buah', 'Jambu air', '1 buah', '55 kkal'],
    [25, 'buah', 'Alpukat', '100 gram', '322 kkal'],
    [26, 'buah', 'Jeruk', '1 buah', '62 kkal'],
    [27, 'buah', 'Buah naga', '1 buah sedang', '50 kkal'],
    [28, 'buah', 'Pepaya', '100 gram', '39 kkal'],
  ]

  for (const row of nutrition) {
    await connection.query(
      `INSERT INTO nutrition_database (id, kategori, nama, satuan, energi)
       VALUES (?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         kategori = VALUES(kategori),
         nama = VALUES(nama),
         satuan = VALUES(satuan),
         energi = VALUES(energi)`,
      row
    )
  }
}

async function runMergeSeed(connection) {
  await ensureBaseSchema(connection)
  await connection.beginTransaction()
  try {
    await upsertUsers(connection)
    await upsertSekolah(connection)
    await upsertVendors(connection)
    await upsertDapur(connection)
    await upsertMappings(connection)
    await upsertMenus(connection)
    await upsertProduksi(connection)
    await upsertDistribusi(connection)
    await upsertStandarGizi(connection)
    await upsertValidasiLog(connection)
    await upsertFeedback(connection)
    await upsertAlerts(connection)
    await upsertWilayahData(connection)
    await upsertDokumenVendor(connection)
    await upsertDapurStok(connection)
    await upsertNutritionDatabase(connection)
    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  }
}

async function runOverwriteSeed(connection) {
  console.log(`Rebuilding "${dbConfig.database}" with schema, baseline, and full demo data...`)
  await initializeDemoDatabase(connection, { reset: true, config: dbConfig })
}

async function confirmOverwrite() {
  if (yesMode) return true

  const rl = createPrompt()
  try {
    const answer = (await askQuestion(
      rl,
      `Overwrite will replace current data in "${dbConfig.database}". Continue? [y/N]: `
    )).toLowerCase()
    return answer === 'y' || answer === 'yes'
  } finally {
    rl.close()
  }
}

;(async () => {
  let connection
  try {
    connection = await createAdminConnection()
    const state = await databaseState(connection, dbConfig)
    const mode = await chooseMode(state)

    if (mode === 'cancel') {
      console.log('Seeding cancelled.')
      process.exit(0)
    }

    if (mode === 'overwrite') {
      const allowed = state.totalRows === 0 ? true : await confirmOverwrite()
      if (!allowed) {
        console.log('Seeding cancelled.')
        process.exit(0)
      }
      await runOverwriteSeed(connection)
    } else {
      console.log(`Merging demo data into "${dbConfig.database}"...`)
      await runMergeSeed(connection)
    }

    const finalState = await databaseState(connection, dbConfig)
    console.log('Demo data ready.')
    console.log(formatRowCounts(finalState.rowCounts))
  } catch (error) {
    console.error(`Demo seeding failed for ${formatDbTarget()}:`, formatError(error))
    process.exitCode = 1
  } finally {
    if (connection) {
      await connection.end()
    }
  }
})()
