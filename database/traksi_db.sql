-- ============================================
-- TRAKSI Database — MySQL Dump
-- Transparansi Gizi Nasional
-- Generated: 2026-06-05
-- Import: mysql -u root -p < traksi_db.sql
-- ============================================

DROP DATABASE IF EXISTS traksi_db;
CREATE DATABASE traksi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE traksi_db;

-- ============================================
-- 1. USERS
-- ============================================
CREATE TABLE users (
  id_user INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('vendor','ahli_gizi','sekolah','pemerintah') NOT NULL,
  status ENUM('active','inactive','suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (id_user, name, email, password, role, status) VALUES
(1, 'Vendor Jakarta Timur', 'v.jaktim@traksi.id', 'vendor123', 'vendor', 'active'),
(2, 'Gov DKI Jakarta', 'gov.dki@traksi.id', 'gov123', 'pemerintah', 'active'),
(3, 'Ahli Gizi Jakarta Timur', 'nutri.jaktim@traksi.id', 'nutri123', 'ahli_gizi', 'active'),
(4, 'Admin SDN 06 Baru', 'sdn06@sekolah.traksi.id', 'sekolah123', 'sekolah', 'active');

-- ============================================
-- 2. SEKOLAH (Schools)
-- ============================================
CREATE TABLE sekolah (
  id_sekolah INT PRIMARY KEY AUTO_INCREMENT,
  nama_sekolah VARCHAR(150) NOT NULL,
  alamat TEXT NOT NULL,
  jenjang ENUM('SD','SMP','SMA','SMK','TK') NOT NULL,
  jumlah_siswa INT NOT NULL DEFAULT 0,
  alergi_count INT DEFAULT 0,
  intoleran_count INT DEFAULT 0,
  id_user INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE SET NULL
);

INSERT INTO sekolah (id_sekolah, nama_sekolah, alamat, jenjang, jumlah_siswa, alergi_count, intoleran_count, id_user) VALUES
(1, 'SDN 1 Banda Aceh', 'Banda Aceh, Aceh', 'SD', 350, 5, 2, NULL),
(2, 'SMPN 1 Sabang', 'Sabang, Aceh', 'SMP', 420, 8, 3, NULL),
(3, 'SDN 06 Baru', 'Kec. Pasar Rebo, Jaktim', 'SD', 404, 12, 4, 4),
(4, 'SMPN 217 Jakarta', 'Kec. Pasar Rebo, Jaktim', 'SMP', 713, 18, 6, NULL),
(5, 'SDN 1 Jayapura', 'Jayapura, Papua', 'SD', 320, 5, 2, NULL),
(6, 'SMPN 1 Merauke', 'Merauke, Papua Selatan', 'SMP', 550, 10, 4, NULL);

-- ============================================
-- 3. VENDORS
-- ============================================
CREATE TABLE vendors (
  id_vendor INT PRIMARY KEY AUTO_INCREMENT,
  nama_vendor VARCHAR(150) NOT NULL,
  region VARCHAR(100) NOT NULL,
  status_verifikasi ENUM('pending','approved','rejected','suspended') DEFAULT 'pending',
  izin_usaha VARCHAR(50) NOT NULL,
  id_user INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE SET NULL
);

INSERT INTO vendors (id_vendor, nama_vendor, region, status_verifikasi, izin_usaha, id_user) VALUES
(1, 'Dapur Sehat Nusantara', 'DKI Jakarta', 'approved', 'B-992/MBG/2026', 1);

CREATE TABLE vendor_registrations (
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
);

-- ============================================
-- 4. DAPUR (Kitchens)
-- ============================================
CREATE TABLE dapur (
  id_dapur INT PRIMARY KEY AUTO_INCREMENT,
  id_vendor INT NOT NULL,
  lokasi VARCHAR(150) NOT NULL,
  kapasitas_produksi INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_vendor) REFERENCES vendors(id_vendor) ON DELETE CASCADE
);

INSERT INTO dapur (id_dapur, id_vendor, lokasi, kapasitas_produksi) VALUES
(1, 1, 'Jakarta Timur', 5000);

-- ============================================
-- 4b. DAPUR STOK (Kitchen inventory)
-- ============================================
CREATE TABLE dapur_stok (
  id_stok INT PRIMARY KEY AUTO_INCREMENT,
  id_dapur INT NOT NULL,
  nama_bahan VARCHAR(150) NOT NULL,
  jumlah DECIMAL(10,2) NOT NULL DEFAULT 0,
  satuan VARCHAR(20) NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_dapur) REFERENCES dapur(id_dapur) ON DELETE CASCADE,
  UNIQUE KEY unique_stok (id_dapur, nama_bahan)
);

INSERT INTO dapur_stok (id_stok, id_dapur, nama_bahan, jumlah, satuan) VALUES
(1, 1, 'Beras Putih', 250.00, 'kg'),
(2, 1, 'Daging Ayam', 100.00, 'kg'),
(3, 1, 'Sayur Bayam', 50.00, 'ikat');

-- ============================================
-- 5. MAPPING DAPUR-SEKOLAH
-- ============================================
CREATE TABLE mapping_dapur_sekolah (
  id_mapping INT PRIMARY KEY AUTO_INCREMENT,
  id_dapur INT NOT NULL,
  id_sekolah INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_dapur) REFERENCES dapur(id_dapur) ON DELETE CASCADE,
  FOREIGN KEY (id_sekolah) REFERENCES sekolah(id_sekolah) ON DELETE CASCADE,
  UNIQUE KEY unique_mapping (id_dapur, id_sekolah)
);

INSERT INTO mapping_dapur_sekolah (id_mapping, id_dapur, id_sekolah) VALUES
(1, 1, 3);

-- ============================================
-- 6. MENUS
-- ============================================
CREATE TABLE menus (
  id_menu INT PRIMARY KEY AUTO_INCREMENT,
  id_vendor INT NOT NULL,
  nama_menu VARCHAR(200) NOT NULL,
  bahan JSON NOT NULL COMMENT 'Array of {nama, takaran}',
  nilai_gizi JSON NOT NULL COMMENT '{energi, protein, lemak, karbohidrat, serat, natrium}',
  foto_url VARCHAR(255) NULL,
  notes JSON NULL COMMENT 'Array of reviewer notes',
  status_validasi ENUM('pending','approved','rejected') DEFAULT 'pending',
  tanggal DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_vendor) REFERENCES vendors(id_vendor) ON DELETE CASCADE
);

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

-- ============================================
-- 7. PRODUKSI (Production batches)
-- ============================================
CREATE TABLE produksi (
  id_produksi INT PRIMARY KEY AUTO_INCREMENT,
  id_dapur INT NOT NULL,
  id_menu INT NOT NULL,
  status ENUM('pending','persiapan','memasak','siap_kirim','selesai') DEFAULT 'pending',
  jumlah_porsi INT NOT NULL DEFAULT 0,
  waktu_mulai DATETIME NULL,
  waktu_selesai DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_dapur) REFERENCES dapur(id_dapur) ON DELETE CASCADE,
  FOREIGN KEY (id_menu) REFERENCES menus(id_menu) ON DELETE CASCADE
);

INSERT INTO produksi (id_produksi, id_dapur, id_menu, status, jumlah_porsi, waktu_mulai) VALUES
(1, 1, 101, 'siap_kirim', 404, '2026-03-14 06:00:00');

-- ============================================
-- 8. DISTRIBUSI (Distribution / delivery)
-- ============================================
CREATE TABLE distribusi (
  id_distribusi INT PRIMARY KEY AUTO_INCREMENT,
  kode_transaksi VARCHAR(20) NOT NULL UNIQUE,
  id_produksi INT NOT NULL,
  id_sekolah INT NOT NULL,
  jumlah_porsi INT NOT NULL,
  waktu_kirim DATETIME NULL,
  waktu_tiba DATETIME NULL,
  status ENUM('DIJADWALKAN','DISTRIBUSI','TIBA','SELESAI','GAGAL') DEFAULT 'DIJADWALKAN',
  blockchain_hash VARCHAR(66) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_produksi) REFERENCES produksi(id_produksi) ON DELETE CASCADE,
  FOREIGN KEY (id_sekolah) REFERENCES sekolah(id_sekolah) ON DELETE CASCADE
);

INSERT INTO distribusi (id_distribusi, kode_transaksi, id_produksi, id_sekolah, jumlah_porsi, waktu_kirim, status, blockchain_hash) VALUES
(1, 'TX-001', 1, 3, 404, '2026-03-14 11:00:00', 'DISTRIBUSI', '0xabc123def456');

-- ============================================
-- 9. STANDAR GIZI (Nutrition standards)
-- ============================================
CREATE TABLE standar_gizi (
  id_standar INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  requirement VARCHAR(100) NOT NULL,
  color VARCHAR(30) DEFAULT 'var(--primary)',
  deskripsi TEXT NULL,
  detail TEXT NULL,
  id_user_pembuat INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user_pembuat) REFERENCES users(id_user) ON DELETE SET NULL
);

INSERT INTO standar_gizi (id_standar, title, requirement, color, deskripsi, detail, id_user_pembuat) VALUES
(1, 'Protein', '20g - 35g', 'var(--primary)', 'Esensial untuk pertumbuhan otot dan jaringan anak.', 'Sumber utama: Daging sapi rendah lemak, ayam tanpa kulit, telur, dan tempe.', 3),
(2, 'Kalori', '500kcal - 750kcal', 'var(--carrot)', 'Energi harian optimal untuk aktivitas belajar.', 'Keseimbangan karbohidrat kompleks (nasi merah/putih) dan serat sayuran.', 3),
(3, 'Lemak Sehat', '10g - 25g', 'var(--secondary)', 'Mendukung fungsi otak dan penyerapan vitamin.', 'Gunakan minyak zaitun atau minyak kelapa sawit bersertifikat fortifikasi.', 3);

-- ============================================
-- 10. VALIDASI LOG (Menu validation audit trail)
-- ============================================
CREATE TABLE validasi_log (
  id_validasi INT PRIMARY KEY AUTO_INCREMENT,
  id_menu INT NOT NULL,
  id_user INT NOT NULL COMMENT 'Ahli gizi who validated',
  aksi ENUM('approved','rejected') NOT NULL,
  catatan TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_menu) REFERENCES menus(id_menu) ON DELETE CASCADE,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

INSERT INTO validasi_log (id_menu, id_user, aksi, catatan) VALUES
(101, 3, 'rejected', 'Kebutuhan serat masih kurang. Metode pengolahan terlalu banyak digoreng.');

-- ============================================
-- 11. KONFIRMASI KEDATANGAN (School delivery confirmation)
-- ============================================
CREATE TABLE konfirmasi_kedatangan (
  id_konfirmasi INT PRIMARY KEY AUTO_INCREMENT,
  id_distribusi INT NOT NULL,
  id_user INT NOT NULL COMMENT 'School admin who confirmed',
  waktu_konfirmasi DATETIME NOT NULL,
  kondisi_makanan ENUM('baik','cukup','kurang') DEFAULT 'baik',
  jumlah_diterima INT NOT NULL,
  foto_bukti VARCHAR(255) NULL,
  catatan TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_distribusi) REFERENCES distribusi(id_distribusi) ON DELETE CASCADE,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

-- ============================================
-- 12. FEEDBACK SEKOLAH
-- ============================================
CREATE TABLE feedback (
  id_feedback INT PRIMARY KEY AUTO_INCREMENT,
  id_sekolah INT NOT NULL,
  id_user INT NOT NULL,
  id_menu INT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  komentar TEXT NULL,
  kategori ENUM('kualitas','kuantitas','ketepatan_waktu','saran','keluhan') DEFAULT 'kualitas',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_sekolah) REFERENCES sekolah(id_sekolah) ON DELETE CASCADE,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
  FOREIGN KEY (id_menu) REFERENCES menus(id_menu) ON DELETE SET NULL
);

INSERT INTO feedback (id_sekolah, id_user, id_menu, rating, komentar, kategori) VALUES
(3, 4, 101, 4, 'Makanan sampai tepat waktu dan masih hangat. Anak-anak menyukai menu chicken wings.', 'kualitas'),
(3, 4, 101, 3, 'Porsi sayur terlalu sedikit. Mohon ditambah untuk keseimbangan gizi.', 'kuantitas');

-- ============================================
-- 13. SISTEM ALERT (Government alerts)
-- ============================================
CREATE TABLE alerts (
  id_alert INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(200) NOT NULL,
  deskripsi TEXT NOT NULL,
  severity ENUM('info','warning','critical') DEFAULT 'info',
  wilayah VARCHAR(100) NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_by INT NULL,
  resolved_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resolved_by) REFERENCES users(id_user) ON DELETE SET NULL
);

INSERT INTO alerts (judul, deskripsi, severity, wilayah) VALUES
('Keterlambatan Distribusi', 'Distribusi ke SDN 1 Banda Aceh terlambat 45 menit dari jadwal.', 'warning', 'Aceh'),
('Stok Bahan Baku Rendah', 'Vendor Dapur Sehat Nusantara melaporkan stok ayam tersisa 20%.', 'critical', 'DKI Jakarta'),
('Feedback Positif Meningkat', 'Rata-rata feedback sekolah wilayah Jakarta Timur naik 15% bulan ini.', 'info', 'DKI Jakarta');

-- ============================================
-- 14. WILAYAH DATA (Regional education statistics)
-- ============================================
CREATE TABLE wilayah_data (
  id_wilayah INT PRIMARY KEY AUTO_INCREMENT,
  wilayah VARCHAR(100) NOT NULL,
  total_jml INT, total_n INT, total_s INT,
  tk_jml INT, tk_n INT, tk_s INT,
  kb_jml INT, kb_n INT, kb_s INT,
  sd_jml INT, sd_n INT, sd_s INT,
  smp_jml INT, smp_n INT, smp_s INT,
  sma_jml INT, sma_n INT, sma_s INT,
  smk_jml INT, smk_n INT, smk_s INT,
  slb_jml INT, slb_n INT, slb_s INT
);

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

-- ============================================
-- 15. DOKUMEN VENDOR (Vendor documents/permits)
-- ============================================
CREATE TABLE dokumen_vendor (
  id_dokumen INT PRIMARY KEY AUTO_INCREMENT,
  id_vendor INT NOT NULL,
  nama_dokumen VARCHAR(200) NOT NULL,
  jenis ENUM('izin_usaha','sertifikat_halal','sertifikat_laik_hygiene','npwp','siup','lainnya') NOT NULL,
  file_path VARCHAR(500) NULL,
  status ENUM('valid','expired','pending_review') DEFAULT 'pending_review',
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  review_note TEXT NULL,
  tanggal_berlaku DATE NULL,
  tanggal_kadaluarsa DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_vendor) REFERENCES vendors(id_vendor) ON DELETE CASCADE
);

INSERT INTO dokumen_vendor (id_vendor, nama_dokumen, jenis, status, tanggal_berlaku, tanggal_kadaluarsa) VALUES
(1, 'Izin Usaha MBG B-992', 'izin_usaha', 'valid', '2026-01-01', '2027-01-01'),
(1, 'Sertifikat Halal MUI', 'sertifikat_halal', 'valid', '2025-06-15', '2027-06-15'),
(1, 'Sertifikat Laik Hygiene', 'sertifikat_laik_hygiene', 'valid', '2026-02-01', '2027-02-01');

-- ============================================
-- 16. NUTRITION DATABASE (Nutrition reference facts)
-- ============================================
CREATE TABLE nutrition_database (
  id INT PRIMARY KEY AUTO_INCREMENT,
  kategori VARCHAR(50) NOT NULL,
  nama VARCHAR(150) NOT NULL,
  satuan VARCHAR(50) NOT NULL,
  energi VARCHAR(50) NOT NULL,
  protein DECIMAL(10,2) NOT NULL DEFAULT 0,
  lemak DECIMAL(10,2) NOT NULL DEFAULT 0,
  karbohidrat DECIMAL(10,2) NOT NULL DEFAULT 0,
  serat DECIMAL(10,2) NOT NULL DEFAULT 0,
  natrium DECIMAL(10,2) NOT NULL DEFAULT 0,
  status ENUM('active','retired') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE nutrition_requests (
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
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_menus_vendor ON menus(id_vendor);
CREATE INDEX idx_menus_status ON menus(status_validasi);
CREATE INDEX idx_produksi_dapur ON produksi(id_dapur);
CREATE INDEX idx_distribusi_sekolah ON distribusi(id_sekolah);
CREATE INDEX idx_distribusi_status ON distribusi(status);
CREATE INDEX idx_feedback_sekolah ON feedback(id_sekolah);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_resolved ON alerts(is_resolved);

-- ============================================
-- Done! Database ready.
-- ============================================
