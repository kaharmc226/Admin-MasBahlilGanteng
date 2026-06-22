-- ============================================
-- TRAKSI Database Schema
-- Base schema only. No demo inserts.
-- ============================================

CREATE DATABASE IF NOT EXISTS traksi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE traksi_db;

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

CREATE TABLE sekolah (
  id_sekolah INT PRIMARY KEY AUTO_INCREMENT,
  nama_sekolah VARCHAR(150) NOT NULL,
  alamat TEXT NOT NULL,
  jenjang ENUM('SD','SMP','SMA','SMK','TK') NOT NULL,
  jumlah_siswa INT NOT NULL DEFAULT 0,
  alergi_count INT DEFAULT 0,
  intoleran_count INT DEFAULT 0,
  id_user INT NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE SET NULL
);

CREATE TABLE vendors (
  id_vendor INT PRIMARY KEY AUTO_INCREMENT,
  nama_vendor VARCHAR(150) NOT NULL,
  region VARCHAR(100) NOT NULL,
  status_verifikasi ENUM('pending','approved','rejected','suspended') DEFAULT 'pending',
  izin_usaha VARCHAR(50) NOT NULL,
  id_user INT NULL,
  id_ahli_gizi_pengawas INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE SET NULL,
  FOREIGN KEY (id_ahli_gizi_pengawas) REFERENCES users(id_user) ON DELETE SET NULL
);

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

CREATE TABLE dapur (
  id_dapur INT PRIMARY KEY AUTO_INCREMENT,
  id_vendor INT NOT NULL,
  lokasi VARCHAR(150) NOT NULL,
  kapasitas_produksi INT NOT NULL DEFAULT 0,
  status_verifikasi ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  review_note TEXT NULL,
  reviewed_by INT NULL,
  reviewed_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_vendor) REFERENCES vendors(id_vendor) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id_user) ON DELETE SET NULL
);

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

CREATE TABLE dapur_stok_history (
  id_log INT PRIMARY KEY AUTO_INCREMENT,
  id_dapur INT NOT NULL,
  nama_bahan VARCHAR(150) NOT NULL,
  tipe ENUM('CREDIT', 'DEBIT', 'KOREKSI') NOT NULL,
  jumlah DECIMAL(10,2) NOT NULL,
  satuan VARCHAR(20) NOT NULL,
  keterangan VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_dapur) REFERENCES dapur(id_dapur) ON DELETE CASCADE
);

CREATE TABLE mapping_dapur_sekolah (
  id_mapping INT PRIMARY KEY AUTO_INCREMENT,
  id_dapur INT NOT NULL,
  id_sekolah INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_dapur) REFERENCES dapur(id_dapur) ON DELETE CASCADE,
  FOREIGN KEY (id_sekolah) REFERENCES sekolah(id_sekolah) ON DELETE CASCADE
);

CREATE TABLE menus (
  id_menu INT PRIMARY KEY AUTO_INCREMENT,
  id_vendor INT NOT NULL,
  nama_menu VARCHAR(150) NOT NULL,
  bahan JSON NOT NULL,
  nilai_gizi JSON NOT NULL,
  foto_url VARCHAR(255) NULL,
  notes JSON NULL,
  status_validasi ENUM('pending','approved','rejected') DEFAULT 'pending',
  tanggal DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_vendor) REFERENCES vendors(id_vendor) ON DELETE CASCADE
);

CREATE TABLE produksi (
  id_produksi INT PRIMARY KEY AUTO_INCREMENT,
  id_dapur INT NOT NULL,
  id_menu INT NOT NULL,
  status ENUM('pending','persiapan','memasak','siap_kirim','selesai') DEFAULT 'pending',
  jumlah_porsi INT NOT NULL,
  waktu_mulai DATETIME NULL,
  waktu_selesai DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_dapur) REFERENCES dapur(id_dapur) ON DELETE CASCADE,
  FOREIGN KEY (id_menu) REFERENCES menus(id_menu) ON DELETE CASCADE
);

CREATE TABLE distribusi (
  id_distribusi INT PRIMARY KEY AUTO_INCREMENT,
  kode_transaksi VARCHAR(30) NOT NULL UNIQUE,
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

CREATE TABLE validasi_log (
  id_validasi INT PRIMARY KEY AUTO_INCREMENT,
  id_menu INT NOT NULL,
  id_user INT NOT NULL,
  aksi ENUM('approved','rejected') NOT NULL,
  catatan TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_menu) REFERENCES menus(id_menu) ON DELETE CASCADE,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE TABLE konfirmasi_kedatangan (
  id_konfirmasi INT PRIMARY KEY AUTO_INCREMENT,
  id_distribusi INT NOT NULL,
  id_user INT NOT NULL,
  waktu_konfirmasi DATETIME NOT NULL,
  kondisi_makanan ENUM('baik','cukup','kurang') DEFAULT 'baik',
  jumlah_diterima INT NOT NULL,
  foto_bukti VARCHAR(255) NULL,
  catatan TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_distribusi) REFERENCES distribusi(id_distribusi) ON DELETE CASCADE,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

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

CREATE TABLE wilayah_data (
  id_wilayah INT PRIMARY KEY AUTO_INCREMENT,
  wilayah VARCHAR(100) NOT NULL,
  total_jml INT,
  total_n INT,
  total_s INT,
  tk_jml INT,
  tk_n INT,
  tk_s INT,
  kb_jml INT,
  kb_n INT,
  kb_s INT,
  sd_jml INT,
  sd_n INT,
  sd_s INT,
  smp_jml INT,
  smp_n INT,
  smp_s INT,
  sma_jml INT,
  sma_n INT,
  sma_s INT,
  smk_jml INT,
  smk_n INT,
  smk_s INT,
  slb_jml INT,
  slb_n INT,
  slb_s INT
);

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

CREATE INDEX idx_menus_vendor ON menus(id_vendor);
CREATE INDEX idx_menus_status ON menus(status_validasi);
CREATE INDEX idx_produksi_dapur ON produksi(id_dapur);
CREATE INDEX idx_distribusi_sekolah ON distribusi(id_sekolah);
CREATE INDEX idx_distribusi_status ON distribusi(status);
CREATE INDEX idx_feedback_sekolah ON feedback(id_sekolah);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_resolved ON alerts(is_resolved);
