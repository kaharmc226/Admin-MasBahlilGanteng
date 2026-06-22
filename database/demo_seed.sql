-- ============================================
-- TRAKSI Optional Demo Seed
-- Richer sample data for presentations and fuller walkthroughs.
-- ============================================

USE traksi_db;

INSERT INTO users (id_user, name, email, password, role, status) VALUES
(5, 'Vendor Jakarta Selatan', 'v.jaksel@traksi.id', 'vendor123', 'vendor', 'active'),
(6, 'Admin SMPN 217 Jakarta', 'smpn217@sekolah.traksi.id', 'sekolah123', 'sekolah', 'active'),
(7, 'Ahli Gizi Jakarta Selatan', 'nutri.jaksel@traksi.id', 'nutri123', 'ahli_gizi', 'active');

UPDATE sekolah SET id_user = 6 WHERE id_sekolah = 4;

INSERT INTO vendors (id_vendor, nama_vendor, region, status_verifikasi, izin_usaha, id_user) VALUES
(2, 'PT Pangan Nusantara Lestari', 'Jakarta Selatan', 'approved', 'B-1054/MBG/2026', 5),
(3, 'CV Berkah Gizi Mandiri', 'Banda Aceh', 'pending', 'B-2011/MBG/2026', NULL);

INSERT INTO dapur (id_dapur, id_vendor, lokasi, kapasitas_produksi) VALUES
(2, 2, 'Pasar Minggu, Jakarta Selatan', 3500),
(3, 1, 'Pulo Gadung, Jakarta Timur', 4000);

INSERT INTO mapping_dapur_sekolah (id_mapping, id_dapur, id_sekolah) VALUES
(2, 2, 4),
(3, 3, 3);

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
  '["Ganti kecap dengan opsi rendah natrium.", "Pastikan daging dimasak hingga benar-benar empuk agar mudah dikunyah anak SD."]',
  'approved', '2026-03-12'),
(106, 2, 'Sate Lilit Ayam Gizi Tinggi',
  '[{"nama":"Ayam Cincang","takaran":"~80 g"},{"nama":"Santan Kelapa","takaran":"~15 ml"},{"nama":"Nasi Merah","takaran":"~100 g"},{"nama":"Urap Sayuran","takaran":"~60 g"}]',
  '{"energi":"580 kkal","protein":"22 g","lemak":"20 g","karbohidrat":"64 g","serat":"5.2 g","natrium":"410 mg"}',
  NULL,
  'pending', '2026-03-17');

INSERT INTO produksi (id_produksi, id_dapur, id_menu, status, jumlah_porsi, waktu_mulai, waktu_selesai) VALUES
(2, 2, 104, 'selesai', 713, '2026-03-13 05:00:00', '2026-03-13 09:30:00'),
(3, 2, 105, 'selesai', 713, '2026-03-12 05:00:00', '2026-03-12 09:15:00'),
(4, 1, 103, 'persiapan', 404, '2026-03-16 06:00:00', NULL);

INSERT INTO distribusi (id_distribusi, kode_transaksi, id_produksi, id_sekolah, jumlah_porsi, waktu_kirim, waktu_tiba, status, blockchain_hash) VALUES
(2, 'TX-002', 2, 4, 713, '2026-03-13 10:15:00', '2026-03-13 11:35:00', 'SELESAI', '0x789defabc0123456'),
(3, 'TX-003', 3, 4, 713, '2026-03-12 10:00:00', '2026-03-12 11:20:00', 'SELESAI', '0x456def789abc0123'),
(4, 'TX-004', 4, 3, 404, NULL, NULL, 'DIJADWALKAN', NULL);

INSERT INTO feedback (id_sekolah, id_user, id_menu, rating, komentar, kategori) VALUES
(4, 6, 104, 5, 'Nasi kuning harum sekali, porsi lauk pas dan sangat digemari siswa SMP.', 'kualitas'),
(4, 6, 105, 4, 'Daging empuk dan rasa lada hitamnya disesuaikan sehingga tidak terlalu pedas untuk anak-anak.', 'kualitas'),
(3, 4, 103, 5, 'Uji coba menu sup ayam jamur sangat disukai oleh anak-anak kelas 1-3.', 'saran');

INSERT INTO dokumen_vendor (id_vendor, nama_dokumen, jenis, status, tanggal_berlaku, tanggal_kadaluarsa) VALUES
(2, 'Izin Usaha PT PNL', 'izin_usaha', 'valid', '2026-01-10', '2028-01-10'),
(2, 'Sertifikat Halal PT PNL', 'sertifikat_halal', 'valid', '2025-08-01', '2027-08-01');

INSERT INTO validasi_log (id_menu, id_user, aksi, catatan) VALUES
(103, 3, 'approved', 'Menu seimbang dengan protein tinggi dan serat brokoli yang baik. Disetujui.'),
(104, 3, 'approved', 'Komposisi karbohidrat dan lemak seimbang. Sesuai standar nasional.'),
(105, 3, 'approved', 'Telah disesuaikan dengan opsi kecap rendah natrium.');

INSERT INTO dapur_stok (id_dapur, nama_bahan, jumlah, satuan) VALUES
(1, 'Ayam Fillet', 850.00, 'kg'),
(1, 'Jamur Kuping', 150.00, 'kg'),
(1, 'Nasi Putih', 1200.00, 'kg'),
(1, 'Brokoli', 450.00, 'kg'),
(1, 'Apel', 500.00, 'kg'),
(1, 'Tahu Goreng', 400.00, 'pcs'),
(1, 'Chicken Wings', 600.00, 'pcs'),
(1, 'Pisang', 800.00, 'pcs'),
(1, 'Tumis Buncis + Jagung', 350.00, 'kg'),
(2, 'Nasi Kuning', 900.00, 'kg'),
(2, 'Ayam Suwir', 500.00, 'kg'),
(2, 'Telur Dadar Iris', 300.00, 'kg'),
(2, 'Timun & Tomat', 250.00, 'kg'),
(2, 'Daging Sapi', 600.00, 'kg'),
(2, 'Paprika & Bawang Bombay', 200.00, 'kg'),
(2, 'Melon', 400.00, 'kg');

INSERT INTO nutrition_database (id, kategori, nama, satuan, energi) VALUES
(1, 'makanan_pokok', 'Nasi putih', '100 gram', '175 kkal'),
(2, 'makanan_pokok', 'Nasi merah', '100 gram', '110 kkal'),
(3, 'makanan_pokok', 'Kentang rebus', '100 gram', '87 kkal'),
(4, 'makanan_pokok', 'Ubi jalar', '100 gram', '86 kkal'),
(5, 'makanan_pokok', 'Singkong', '100 gram', '160 kkal'),
(6, 'makanan_pokok', 'Roti putih', '1 iris', '66 kkal'),
(7, 'makanan_pokok', 'Roti gandum', '1 iris', '67 kkal'),
(8, 'makanan_pokok', 'Mi goreng instan', '80 gram', '350 kkal'),
(9, 'lauk_sayur', 'Dada ayam (kulit)', '100 gram', '216 kkal'),
(10, 'lauk_sayur', 'Dada ayam (no kulit)', '100 gram', '184 kkal'),
(11, 'lauk_sayur', 'Bebek goreng', '100 gram', '286 kkal'),
(12, 'lauk_sayur', 'Ikan kembung', '100 gram', '167 kkal'),
(13, 'lauk_sayur', 'Udang goreng', '100 gram', '150 kkal'),
(14, 'lauk_sayur', 'Bakso sapi', '100 gram', '202 kkal'),
(15, 'lauk_sayur', 'Chicken nugget', '100 gram', '297 kkal'),
(16, 'lauk_sayur', 'Telur dadar', '1 btr besar', '93 kkal'),
(17, 'lauk_sayur', 'Tempe goreng', '1 porsi', '118 kkal'),
(18, 'lauk_sayur', 'Tahu isi', '1 porsi', '124 kkal'),
(19, 'lauk_sayur', 'Tumis kangkung', '85 gram', '155 kkal'),
(20, 'lauk_sayur', 'Perkedel kentang', '75 gram', '117 kkal'),
(21, 'buah', 'Apel', '1 buah sedang', '72 kkal'),
(22, 'buah', 'Pisang', '1 buah sedang', '105 kkal'),
(23, 'buah', 'Jambu biji', '1 buah', '37 kkal'),
(24, 'buah', 'Jambu air', '1 buah', '55 kkal'),
(25, 'buah', 'Alpukat', '100 gram', '322 kkal'),
(26, 'buah', 'Jeruk', '1 buah', '62 kkal'),
(27, 'buah', 'Buah naga', '1 buah sedang', '50 kkal'),
(28, 'buah', 'Pepaya', '100 gram', '39 kkal');
