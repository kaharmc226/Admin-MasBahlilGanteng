-- ============================================
-- TRAKSI Minimal Bootstrap Data
-- Required baseline for first-run login and dashboard access.
-- ============================================

USE traksi_db;

INSERT INTO users (id_user, name, email, password, role, status) VALUES
(1, 'Vendor Jakarta Timur', 'v.jaktim@traksi.id', 'vendor123', 'vendor', 'active'),
(2, 'Gov DKI Jakarta', 'gov.dki@traksi.id', 'gov123', 'pemerintah', 'active'),
(3, 'Ahli Gizi Jakarta Timur', 'nutri.jaktim@traksi.id', 'nutri123', 'ahli_gizi', 'active'),
(4, 'Admin SDN 06 Baru', 'sdn06@sekolah.traksi.id', 'sekolah123', 'sekolah', 'active');

INSERT INTO sekolah (id_sekolah, nama_sekolah, alamat, jenjang, jumlah_siswa, alergi_count, intoleran_count, id_user, status) VALUES
(1, 'SDN 1 Banda Aceh', 'Banda Aceh, Aceh', 'SD', 350, 5, 2, NULL, 'active'),
(2, 'SMPN 1 Sabang', 'Sabang, Aceh', 'SMP', 420, 8, 3, NULL, 'active'),
(3, 'SDN 06 Baru', 'Kec. Pasar Rebo, Jaktim', 'SD', 404, 12, 4, 4, 'active'),
(4, 'SMPN 217 Jakarta', 'Kec. Pasar Rebo, Jaktim', 'SMP', 713, 18, 6, NULL, 'active'),
(5, 'SDN 1 Jayapura', 'Jayapura, Papua', 'SD', 320, 5, 2, NULL, 'active'),
(6, 'SMPN 1 Merauke', 'Merauke, Papua Selatan', 'SMP', 550, 10, 4, NULL, 'active');

INSERT INTO vendors (id_vendor, nama_vendor, region, status_verifikasi, izin_usaha, id_user) VALUES
(1, 'Dapur Sehat Nusantara', 'DKI Jakarta', 'approved', 'B-992/MBG/2026', 1);

INSERT INTO dapur (id_dapur, id_vendor, lokasi, kapasitas_produksi) VALUES
(1, 1, 'Jakarta Timur', 5000);

INSERT INTO dapur_stok (id_stok, id_dapur, nama_bahan, jumlah, satuan) VALUES
(1, 1, 'Beras Putih', 250.00, 'kg'),
(2, 1, 'Daging Ayam', 100.00, 'kg'),
(3, 1, 'Sayur Bayam', 50.00, 'ikat');

INSERT INTO mapping_dapur_sekolah (id_mapping, id_dapur, id_sekolah) VALUES
(1, 1, 3);

INSERT INTO menus (id_menu, id_vendor, nama_menu, bahan, nilai_gizi, notes, status_validasi, tanggal) VALUES
(101, 1, 'Menu MBG Makanan Bergizi Gratis',
  '[{"nama":"Tahu Goreng","takaran":"~30 g"},{"nama":"Nasi Putih","takaran":"~100 g"},{"nama":"Chicken Wings","takaran":"~48 g"},{"nama":"Pisang","takaran":"~50 g"},{"nama":"Tumis Buncis + Jagung","takaran":"~50 g"}]',
  '{"energi":"503 kkal","protein":"15.9 g","lemak":"21.3 g","karbohidrat":"61.4 g","serat":"3.6 g","natrium":"558 mg"}',
  '["Kandungan gizi menu ini cukup untuk memenuhi kebutuhan makan siang anak sekolah, tetapi kebutuhan seratnya masih kurang.","Metode pengolahan bisa lebih bervariasi, tidak hanya digoreng."]',
  'rejected', '2026-03-14'),
(102, 1, 'Nasi Ikan Bandeng Presto',
  '[{"nama":"Ikan Bandeng","takaran":"~80 g"},{"nama":"Nasi Merah","takaran":"~120 g"},{"nama":"Sayur Lodeh","takaran":"~60 g"}]',
  '{"energi":"480 kkal","protein":"22 g","lemak":"12 g","karbohidrat":"65 g","serat":"5 g","natrium":"450 mg"}',
  NULL,
  'pending', '2026-03-15');

INSERT INTO produksi (id_produksi, id_dapur, id_menu, status, jumlah_porsi, waktu_mulai, waktu_selesai) VALUES
(1, 1, 101, 'siap_kirim', 404, '2026-03-14 06:00:00', NULL);

INSERT INTO distribusi (id_distribusi, kode_transaksi, id_produksi, id_sekolah, jumlah_porsi, waktu_kirim, status, blockchain_hash) VALUES
(1, 'TX-001', 1, 3, 404, '2026-03-14 11:00:00', 'DISTRIBUSI', '0xabc123def456');

INSERT INTO standar_gizi (id_standar, title, requirement, color, deskripsi, detail, id_user_pembuat) VALUES
(1, 'Protein', '20g - 35g', 'var(--primary)', 'Esensial untuk pertumbuhan otot dan jaringan anak.', 'Sumber utama: Daging sapi rendah lemak, ayam tanpa kulit, telur, dan tempe.', 3),
(2, 'Kalori', '500kcal - 750kcal', 'var(--carrot)', 'Energi harian optimal untuk aktivitas belajar.', 'Keseimbangan karbohidrat kompleks (nasi merah/putih) dan serat sayuran.', 3),
(3, 'Lemak Sehat', '10g - 25g', 'var(--secondary)', 'Mendukung fungsi otak dan penyerapan vitamin.', 'Gunakan minyak zaitun atau minyak kelapa sawit bersertifikat fortifikasi.', 3);

INSERT INTO validasi_log (id_menu, id_user, aksi, catatan) VALUES
(101, 3, 'rejected', 'Kebutuhan serat masih kurang. Metode pengolahan terlalu banyak digoreng.');

INSERT INTO feedback (id_sekolah, id_user, id_menu, rating, komentar, kategori) VALUES
(3, 4, 101, 4, 'Makanan sampai tepat waktu dan masih hangat. Anak-anak menyukai menu chicken wings.', 'kualitas'),
(3, 4, 101, 3, 'Porsi sayur terlalu sedikit. Mohon ditambah untuk keseimbangan gizi.', 'kuantitas');

INSERT INTO alerts (judul, deskripsi, severity, wilayah) VALUES
('Keterlambatan Distribusi', 'Distribusi ke SDN 1 Banda Aceh terlambat 45 menit dari jadwal.', 'warning', 'Aceh'),
('Stok Bahan Baku Rendah', 'Vendor Dapur Sehat Nusantara melaporkan stok ayam tersisa 20%.', 'critical', 'DKI Jakarta'),
('Feedback Positif Meningkat', 'Rata-rata feedback sekolah wilayah Jakarta Timur naik 15% bulan ini.', 'info', 'DKI Jakarta');

INSERT INTO wilayah_data (wilayah, total_jml, total_n, total_s, tk_jml, tk_n, tk_s, kb_jml, kb_n, kb_s, sd_jml, sd_n, sd_s, smp_jml, smp_n, smp_s, sma_jml, sma_n, sma_s, smk_jml, smk_n, smk_s, slb_jml, slb_n, slb_s) VALUES
('Kab. Konawe Selatan', 737, 476, 261, 227, 43, 184, 31, 0, 31, 316, 312, 4, 85, 79, 6, 30, 26, 4, 11, 10, 1, 5, 1, 4),
('Kab. Muna', 726, 357, 369, 213, 54, 159, 92, 0, 92, 220, 208, 12, 82, 64, 18, 37, 22, 15, 27, 7, 20, 24, 1, 23),
('Kab. Konawe', 684, 392, 292, 187, 27, 160, 64, 0, 64, 277, 270, 7, 67, 62, 5, 29, 24, 5, 11, 6, 5, 8, 2, 6),
('Kab. Bombana', 505, 267, 238, 163, 31, 132, 8, 0, 8, 171, 157, 14, 62, 49, 13, 27, 19, 8, 11, 9, 2, 2, 1, 1),
('Kab. Kolaka', 466, 263, 203, 154, 15, 139, 18, 0, 18, 184, 176, 8, 53, 45, 8, 17, 10, 7, 15, 12, 3, 10, 4, 6),
('Kota Kendari', 461, 171, 290, 146, 16, 130, 46, 0, 46, 136, 107, 29, 46, 25, 21, 29, 13, 16, 22, 7, 15, 9, 2, 7),
('Kab. Buton', 365, 242, 123, 120, 38, 82, 18, 0, 18, 122, 120, 2, 55, 52, 3, 24, 23, 1, 11, 8, 3, 2, 0, 2),
('Kab. Kolaka Timur', 337, 217, 120, 111, 13, 98, 13, 0, 13, 141, 140, 1, 43, 41, 2, 14, 14, 0, 9, 7, 2, 1, 1, 0),
('Kab. Wakatobi', 332, 189, 143, 96, 19, 77, 46, 0, 46, 111, 109, 2, 43, 40, 3, 20, 17, 3, 6, 2, 4, 1, 1, 0),
('Kab. Muna Barat', 321, 155, 166, 106, 4, 102, 27, 0, 27, 101, 96, 5, 42, 37, 5, 13, 12, 1, 8, 4, 4, 8, 1, 7),
('Kab. Kolaka Utara', 314, 170, 144, 125, 13, 112, 2, 0, 2, 112, 110, 2, 37, 32, 5, 12, 9, 3, 5, 5, 0, 1, 0, 1),
('Kab. Konawe Utara', 300, 186, 114, 93, 32, 61, 32, 0, 32, 104, 104, 0, 36, 35, 1, 11, 11, 0, 5, 3, 2, 2, 0, 2),
('Kab. Buton Tengah', 274, 191, 83, 87, 38, 49, 0, 0, 0, 97, 92, 5, 41, 36, 5, 19, 18, 1, 11, 6, 5, 2, 0, 2),
('Kab. Buton Utara', 264, 160, 104, 93, 29, 64, 15, 0, 15, 79, 78, 1, 36, 35, 1, 11, 11, 0, 6, 5, 1, 2, 1, 1),
('Kota Bau Bau', 244, 112, 132, 81, 11, 70, 21, 0, 21, 69, 65, 4, 30, 20, 10, 12, 7, 5, 9, 6, 3, 6, 2, 4),
('Kab. Buton Selatan', 227, 163, 64, 72, 36, 36, 20, 0, 20, 74, 74, 0, 32, 32, 0, 18, 18, 0, 5, 3, 2, 1, 0, 1),
('Kab. Konawe Kepulauan', 150, 83, 67, 43, 5, 38, 16, 0, 16, 50, 50, 0, 18, 18, 0, 6, 6, 0, 4, 3, 1, 1, 0, 1);

INSERT INTO dokumen_vendor (id_vendor, nama_dokumen, jenis, status, tanggal_berlaku, tanggal_kadaluarsa) VALUES
(1, 'Izin Usaha MBG B-992', 'izin_usaha', 'valid', '2026-01-01', '2027-01-01'),
(1, 'Sertifikat Halal MUI', 'sertifikat_halal', 'valid', '2025-06-15', '2027-06-15'),
(1, 'Sertifikat Laik Hygiene', 'sertifikat_laik_hygiene', 'valid', '2026-02-01', '2027-02-01');
