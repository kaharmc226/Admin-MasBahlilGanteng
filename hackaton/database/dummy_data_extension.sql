-- ============================================
-- TRAKSI Database — Additional Dummy Data Extension
-- Run this after importing the base traksi_db.sql schema
-- mysql -u root -p traksi_db < dummy_data_extension.sql
-- ============================================

USE traksi_db;

-- 1. ADD ADDITIONAL USERS
INSERT INTO users (id_user, name, email, password, role, status) VALUES
(5, 'Vendor Jakarta Selatan', 'v.jaksel@traksi.id', 'vendor123', 'vendor', 'active'),
(6, 'Admin SMPN 217 Jakarta', 'smpn217@sekolah.traksi.id', 'sekolah123', 'sekolah', 'active'),
(7, 'Ahli Gizi Jakarta Selatan', 'nutri.jaksel@traksi.id', 'nutri123', 'ahli_gizi', 'active');

-- 2. UPDATE EXISTING SCHOOL USERS (Map new users to schools)
UPDATE sekolah SET id_user = 6 WHERE id_sekolah = 4;

-- 3. ADD ADDITIONAL VENDORS
INSERT INTO vendors (id_vendor, nama_vendor, region, status_verifikasi, izin_usaha, id_user) VALUES
(2, 'PT Pangan Nusantara Lestari', 'Jakarta Selatan', 'approved', 'B-1054/MBG/2026', 5),
(3, 'CV Berkah Gizi Mandiri', 'Banda Aceh', 'pending', 'B-2011/MBG/2026', NULL);

-- 4. ADD ADDITIONAL DAPUR (KITCHENS)
INSERT INTO dapur (id_dapur, id_vendor, lokasi, kapasitas_produksi) VALUES
(2, 2, 'Pasar Minggu, Jakarta Selatan', 3500),
(3, 1, 'Pulo Gadung, Jakarta Timur', 4000);

-- 5. ADD ADDITIONAL MAPPING DAPUR-SEKOLAH
INSERT INTO mapping_dapur_sekolah (id_dapur, id_sekolah) VALUES
(2, 4), -- Dapur Jaksel melayani SMPN 217 Jakarta
(3, 3); -- Dapur Pulo Gadung melayani SDN 06 Baru

-- 6. ADD ADDITIONAL MENUS
INSERT INTO menus (id_menu, id_vendor, nama_menu, bahan, nilai_gizi, notes, status_validasi, tanggal) VALUES
(103, 1, 'Sup Ayam Jamur Spesial',
  '[{"nama":"Ayam Fillet","takaran":"~60 g"},{"nama":"Jamur Kuping","takaran":"~20 g"},{"nama":"Nasi Putih","takaran":"~100 g"},{"nama":"Brokoli","takaran":"~40 g"},{"nama":"Apel","takaran":"~50 g"}]',
  '{"energi":"520 kkal","protein":"24 g","lemak":"14 g","karbohidrat":"70 g","serat":"4.5 g","natrium":"490 mg"}',
  NULL,
  'approved', '2026-03-16'),
(104, 2, 'Nasi Kuning Tumpeng Sehat',
  '[{"nama":"Nasi Kuning","takaran":"~120 g"},{"nama":"Ayam Suwir","takaran":"~50 g"},{"nama":"Telur Dadar Iris","takaran":"~25 g"},{"nama":"Timun & Tomat","takaran":"~30 g"}]',
  '{"energi":"550 kkal","protein":"18 g","lemak":"16 g","karbohidrat":"78 g","serat":"3.2 g","natrium":"510 mg"}',
  NULL,
  'approved', '2026-03-13'),
(105, 2, 'Daging Sapi Lada Hitam Madu',
  '[{"nama":"Daging Sapi","takaran":"~70 g"},{"nama":"Paprika & Bawang Bombay","takaran":"~30 g"},{"nama":"Nasi Putih","takaran":"~100 g"},{"nama":"Melon","takaran":"~60 g"}]',
  '{"energi":"610 kkal","protein":"26 g","lemak":"18 g","karbohidrat":"68 g","serat":"3.8 g","natrium":"590 mg"}',
  '["Ganti kecap dengan opsi rendah natrium.", "Pastikan daging dimasak hingga benar-benar empuk agar mudah dikunyah anak SD."] ',
  'approved', '2026-03-12'),
(106, 2, 'Sate Lilit Ayam Gizi Tinggi',
  '[{"nama":"Ayam Cincang","takaran":"~80 g"},{"nama":"Santan Kelapa","takaran":"~15 ml"},{"nama":"Nasi Merah","takaran":"~100 g"},{"nama":"Urap Sayuran","takaran":"~60 g"}]',
  '{"energi":"580 kkal","protein":"22 g","lemak":"20 g","karbohidrat":"64 g","serat":"5.2 g","natrium":"410 mg"}',
  NULL,
  'pending', '2026-03-17');

-- 7. ADD ADDITIONAL PRODUKSI BATCHES
INSERT INTO produksi (id_produksi, id_dapur, id_menu, status, jumlah_porsi, waktu_mulai, waktu_selesai) VALUES
(2, 2, 104, 'selesai', 713, '2026-03-13 05:00:00', '2026-03-13 09:30:00'),
(3, 2, 105, 'selesai', 713, '2026-03-12 05:00:00', '2026-03-12 09:15:00'),
(4, 1, 103, 'persiapan', 404, '2026-03-16 06:00:00', NULL);

-- 8. ADD ADDITIONAL DISTRIBUSI LOGS (RIWAYAT)
INSERT INTO distribusi (id_distribusi, kode_transaksi, id_produksi, id_sekolah, jumlah_porsi, waktu_kirim, waktu_tiba, status, blockchain_hash) VALUES
(2, 'TX-002', 2, 4, 713, '2026-03-13 10:15:00', '2026-03-13 11:35:00', 'SELESAI', '0x789defabc0123456'),
(3, 'TX-003', 3, 4, 713, '2026-03-12 10:00:00', '2026-03-12 11:20:00', 'SELESAI', '0x456def789abc0123'),
(4, 'TX-004', 4, 3, 404, NULL, NULL, 'DIJADWALKAN', NULL);

-- 9. ADD ADDITIONAL FEEDBACK
INSERT INTO feedback (id_sekolah, id_user, id_menu, rating, komentar, kategori) VALUES
(4, 6, 104, 5, 'Nasi kuning harum sekali, porsi lauk pas dan sangat digemari siswa SMP.', 'kualitas'),
(4, 6, 105, 4, 'Daging empuk dan rasa lada hitamnya disesuaikan sehingga tidak terlalu pedas untuk anak-anak.', 'kualitas'),
(3, 4, 103, 5, 'Uji coba menu sup ayam jamur sangat disukai oleh anak-anak kelas 1-3.', 'saran');

-- 10. ADD ADDITIONAL DOKUMEN VENDOR FOR PT PANGAN
INSERT INTO dokumen_vendor (id_vendor, nama_dokumen, jenis, status, tanggal_berlaku, tanggal_kadaluarsa) VALUES
(2, 'Izin Usaha PT PNL', 'izin_usaha', 'valid', '2026-01-10', '2028-01-10'),
(2, 'Sertifikat Halal PT PNL', 'sertifikat_halal', 'valid', '2025-08-01', '2027-08-01');

-- 11. ADD VALIDASI LOGS
INSERT INTO validasi_log (id_menu, id_user, aksi, catatan) VALUES
(103, 3, 'approved', 'Menu seimbang dengan protein tinggi dan serat brokoli yang baik. Disetujui.'),
(104, 3, 'approved', 'Komposisi karbohidrat dan lemak seimbang. Sesuai standar nasional.'),
(105, 3, 'approved', 'Telah disesuaikan dengan opsi kecap rendah natrium.');
