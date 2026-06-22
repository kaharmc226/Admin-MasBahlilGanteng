# Ringkasan Proyek TRAKSI

## Nama Proyek

TRAKSI (Transparansi Gizi Nasional)

## Gambaran Singkat

TRAKSI adalah website manajemen dan monitoring distribusi makanan bergizi untuk mendukung alur program MBG. Sistem ini menghubungkan empat aktor utama:

- Vendor
- Ahli Gizi
- Sekolah
- Pemerintah

Website memfasilitasi proses dari perencanaan menu, validasi gizi, produksi makanan, distribusi ke sekolah, konfirmasi penerimaan, feedback sekolah, sampai monitoring pemerintah.

## Tujuan Sistem

- Membantu vendor mengelola dapur, stok, menu, produksi, distribusi, dan dokumen.
- Membantu ahli gizi memvalidasi menu dan mengelola referensi nutrisi.
- Membantu sekolah menerima distribusi, mengonfirmasi kedatangan, dan memberi feedback.
- Membantu pemerintah memantau vendor, sekolah, mapping distribusi, statistik, dan alert operasional.

## Arsitektur Singkat

- Frontend: React + Vite
- Backend: Express.js
- Database: MySQL
- Komunikasi data: REST API

## Alur Bisnis Utama

1. Vendor membuat atau mengelola dapur dan stok bahan.
2. Vendor menyusun menu berdasarkan bahan dan kebutuhan operasional.
3. Ahli gizi meninjau menu dan memvalidasi kandungan gizi.
4. Vendor membuat tiket produksi untuk menu yang diproses.
5. Sistem memotong stok bahan saat produksi dimulai.
6. Vendor mengelola distribusi ke sekolah yang terhubung melalui mapping dapur-sekolah.
7. Sekolah menerima makanan dan mengunggah bukti konfirmasi.
8. Sekolah memberikan feedback atau melapor kendala.
9. Pemerintah memantau vendor, sekolah, statistik distribusi, dan alert.

## Aktor dan Fokus Fitur

### 1. Vendor

- Dashboard operasional
- Manajemen dapur
- Manajemen stok
- Katalog menu
- Status produksi
- Distribusi
- Dokumen vendor

### 2. Ahli Gizi

- Dashboard validasi
- Validasi menu
- Standar gizi
- Database nutrisi
- Persetujuan permintaan bahan
- Laporan review gizi

### 3. Sekolah

- Dashboard penerimaan
- Konfirmasi kedatangan
- Upload bukti foto
- Feedback makanan
- Pelaporan kendala distribusi

### 4. Pemerintah

- Dashboard monitoring nasional
- Persetujuan pendaftaran vendor
- Audit vendor dan dokumen
- Mapping dapur ke sekolah
- Statistik penerima
- Alert dan log operasional

## Modul Sistem

- Autentikasi login
- Manajemen user
- Manajemen vendor
- Registrasi vendor
- Manajemen sekolah
- Manajemen dapur
- Manajemen stok
- Mapping dapur-sekolah
- Manajemen menu
- Validasi menu
- Manajemen standar gizi
- Database nutrisi
- Produksi
- Distribusi
- Konfirmasi kedatangan
- Feedback
- Alert
- Statistik pemerintah

## Kelebihan untuk Presentasi

- Sudah punya 4 dashboard berdasarkan role.
- Sudah ada alur end-to-end dari menu sampai distribusi dan feedback.
- Sudah terhubung frontend, backend, dan database.
- Sudah ada data demo dan akun demo untuk sidang atau presentasi.
