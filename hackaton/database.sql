-- Database TRAKSI (Tracking Distribusi Gizi Nasional) - Final Core Architecture
-- Optimized for XAMPP (MySQL/MariaDB)

CREATE DATABASE IF NOT EXISTS traksi_db;
USE traksi_db;

-- 1️⃣ Tabel users
CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(150),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role ENUM('vendor', 'pemerintah', 'sekolah', 'ahli_gizi'),
    status ENUM('active', 'inactive') DEFAULT 'active'
);

-- 2️⃣ Tabel vendor
CREATE TABLE vendor (
    id_vendor INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT,
    nama_vendor VARCHAR(200),
    izin_usaha VARCHAR(255), -- File path
    status_verifikasi ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    tanggal_verifikasi DATE,
    FOREIGN KEY (id_user) REFERENCES users(id_user)
);

-- 3️⃣ Tabel dapur
CREATE TABLE dapur (
    id_dapur INT AUTO_INCREMENT PRIMARY KEY,
    id_vendor INT,
    lokasi VARCHAR(255),
    kapasitas_production INT,
    produksi_per_hari INT DEFAULT 0,
    FOREIGN KEY (id_vendor) REFERENCES vendor(id_vendor)
);

-- 4️⃣ Tabel sekolah
CREATE TABLE sekolah (
    id_sekolah INT AUTO_INCREMENT PRIMARY KEY,
    nama_sekolah VARCHAR(255),
    alamat TEXT,
    jumlah_siswa INT
);

-- 5️⃣ Tabel distribusi_mapping (Relasi Dapur ke Sekolah - Pemerintah)
CREATE TABLE distribusi_mapping (
    id_mapping INT AUTO_INCREMENT PRIMARY KEY,
    id_dapur INT,
    id_sekolah INT,
    FOREIGN KEY (id_dapur) REFERENCES dapur(id_dapur),
    FOREIGN KEY (id_sekolah) REFERENCES sekolah(id_sekolah)
);

-- 6️⃣ Tabel menu
CREATE TABLE menu (
    id_menu INT AUTO_INCREMENT PRIMARY KEY,
    id_vendor INT,
    nama_menu VARCHAR(255),
    komposisi TEXT,
    nilai_gizi JSON, -- Kalori, Protein, dsb
    jumlah_porsi INT,
    status_validasi ENUM('pending', 'approved') DEFAULT 'pending',
    FOREIGN KEY (id_vendor) REFERENCES vendor(id_vendor)
);

-- 7️⃣ Tabel produksi
CREATE TABLE produksi (
    id_produksi INT AUTO_INCREMENT PRIMARY KEY,
    id_dapur INT,
    id_menu INT,
    status ENUM('memasak', 'siap_kirim') DEFAULT 'memasak',
    waktu_update DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_dapur) REFERENCES dapur(id_dapur),
    FOREIGN KEY (id_menu) REFERENCES menu(id_menu)
);

-- 8️⃣ Tabel distribusi
CREATE TABLE distribusi (
    id_distribusi INT AUTO_INCREMENT PRIMARY KEY,
    id_produksi INT,
    id_sekolah INT,
    waktu_kirim DATETIME,
    jumlah_porsi INT,
    FOREIGN KEY (id_produksi) REFERENCES produksi(id_produksi),
    FOREIGN KEY (id_sekolah) REFERENCES sekolah(id_sekolah)
);

-- 9️⃣ Tabel feedback
CREATE TABLE feedback (
    id_feedback INT AUTO_INCREMENT PRIMARY KEY,
    id_sekolah INT,
    id_distribusi INT,
    kualitas INT, -- Rating 1-5
    catatan TEXT,
    FOREIGN KEY (id_sekolah) REFERENCES sekolah(id_sekolah),
    FOREIGN KEY (id_distribusi) REFERENCES distribusi(id_distribusi)
);

-- SEEDING DATA AWAL (REAL DATA DARI PORTAL MBG)
-- 1 Vendor per PROVINSI (DKI Jakarta)
-- 1 Ahli Gizi per KOTA (Jakarta Timur)
-- Daftar Sekolah Real Area Halim & Susukan

INSERT INTO users (nama, email, password, role, status) VALUES 
('Vendor Jakarta Timur', 'v.jaktim@traksi.id', 'pass123', 'vendor', 'active'),
('Gov DKI Jakarta', 'gov.dki@traksi.id', 'pass123', 'pemerintah', 'active'),
('Ahli Gizi Jakarta Timur', 'nutri.jaktim@traksi.id', 'pass123', 'ahli_gizi', 'active');

INSERT INTO vendor (id_user, nama_vendor, status_verifikasi) VALUES (1, 'Dapur Sehat Nusantara', 'approved');

-- Sample Sekolah Real (100% Data Riil SPPG Kelurahan Baru, Kec. Pasar Rebo)
INSERT INTO sekolah (nama_sekolah, alamat, jumlah_siswa) VALUES 
('SDN 06 Baru', 'Kec. Pasar Rebo, Jaktim', 404),
('SMPN 217 Jakarta', 'Kec. Pasar Rebo, Jaktim', 713),
('SD 05 Cijantung', 'Kec. Pasar Rebo, Jaktim', 477),
('SDIT Insan Mandiri', 'Kec. Pasar Rebo, Jaktim', 301),
('MI Al Inayah', 'Kec. Pasar Rebo, Jaktim', 256),
('MI Miftahul Jannah', 'Kec. Pasar Rebo, Jaktim', 209),
('SMP Insan Mandiri', 'Kec. Pasar Rebo, Jaktim', 98),
('RA Qurrotal A\'yun', 'Kec. Pasar Rebo, Jaktim', 40),
('RA Uswatun Hasanah', 'Kec. Pasar Rebo, Jaktim', 47),
('TK Ammar Ma\'ruf', 'Kec. Pasar Rebo, Jaktim', 71),
('PAUD Mawar Cijantung', 'Kec. Pasar Rebo, Jaktim', 69),
('PAUD Al Jadid', 'Kec. Pasar Rebo, Jaktim', 47);
