# Ringkasan Proyek TRAKSI

## Nama Proyek

TRAKSI (Transparansi Gizi Nasional)

## Gambaran Singkat

TRAKSI adalah aplikasi web operasional MBG yang menghubungkan empat aktor utama:

- Vendor
- Ahli Gizi
- Sekolah
- Pemerintah

Implementasi saat ini berfokus pada alur registrasi vendor, pengelolaan dapur dan stok, validasi menu, produksi, distribusi, penyelesaian distribusi oleh sekolah, feedback, dan monitoring pemerintah.

## Tujuan Sistem

- Membantu vendor mengelola dapur operasional, stok bahan, menu, produksi, dan dokumen vendor.
- Membantu ahli gizi memvalidasi menu serta menjaga standar gizi dan referensi nutrisi.
- Membantu sekolah memantau tiket distribusi, menyelesaikan penerimaan, memberi feedback, dan melapor kendala.
- Membantu pemerintah mereview vendor, mengelola sekolah dan mapping, memantau statistik, dan menangani alert operasional.

## Arsitektur Singkat

- Frontend: React + Vite
- Backend: Express.js
- Database: MySQL
- Komunikasi data: REST API

## Route dan Area Sistem

Route publik:

- `/` landing page
- `/login` login
- `/registrasi-vendor` registrasi vendor

Route terlindungi:

- `/vendor/*`
- `/ahli-gizi/*`
- `/sekolah/*`
- `/pemerintah/*`

Catatan implementasi route:

- Area vendor dibagi ke dashboard, submenu manajemen vendor, dan status produksi.
- Area sekolah memusatkan pemantauan distribusi dan penyelesaian tiket pada dashboard/status distribusi.
- Tidak ada halaman distribusi vendor yang berdiri sendiri dalam praktik UI saat ini.

## Alur Bisnis Utama

1. Calon vendor mengisi form registrasi dan mengunggah dokumen awal.
2. Pemerintah meninjau pendaftaran vendor dan dapat menyetujui, meminta revisi, atau menolak.
3. Vendor resmi mengelola dapur, tetapi dapur harus disetujui pemerintah sebelum bisa dipakai untuk stok dan produksi.
4. Vendor menyusun menu dari bahan yang terhubung ke database nutrisi.
5. Ahli Gizi memvalidasi menu dan hanya menu `approved` yang bisa masuk ke produksi.
6. Vendor membuat tiket produksi untuk dapur approved dan stok dipotong sesuai aturan backend.
7. Distribusi mengikuti status berurutan `DIJADWALKAN -> DISTRIBUSI -> TIBA -> SELESAI`.
8. Sekolah melihat tiket distribusi yang ditugaskan ke sekolahnya.
9. Sekolah hanya dapat menyelesaikan distribusi setelah status `TIBA`; foto bukti bersifat opsional.
10. Sekolah dapat memberi feedback dan membuat alert kendala.
11. Pemerintah memonitor vendor, dokumen, mapping, statistik, sekolah aktif/nonaktif, dan alert.

## Aktor dan Fokus Fitur

### 1. Vendor

- Dashboard operasional vendor
- Registrasi dan pengelolaan dapur
- Stok bahan dan histori mutasi stok
- Katalog menu dan upload foto menu
- Dokumen vendor dan upload dokumen
- Tiket produksi dan status produksi
- Distribusi yang terkait dengan tiket produksi

### 2. Ahli Gizi

- Dashboard validasi
- Validasi menu vendor
- Standar gizi
- Database nutrisi
- Persetujuan atau penolakan permintaan bahan dari vendor
- Laporan review menu dalam format JSON

### 3. Sekolah

- Dashboard status distribusi
- Pemantauan tiket distribusi berdasarkan akun sekolah
- Penyelesaian distribusi setelah status `TIBA`
- Upload foto bukti opsional
- Feedback makanan
- Pelaporan kendala distribusi

### 4. Pemerintah

- Dashboard monitoring nasional
- Review pendaftaran vendor
- Audit vendor dan review dokumen vendor
- Approve/reject dapur
- Suspend atau aktifkan kembali vendor
- Nonaktifkan atau aktifkan kembali sekolah
- Mapping dapur ke sekolah
- Statistik penerima manfaat
- Alert operasional

## Modul Sistem yang Benar-Benar Tercermin di Kode

- Login berbasis role
- Registrasi vendor
- Manajemen vendor
- Manajemen sekolah
- Manajemen dapur
- Manajemen stok
- Mapping dapur-sekolah
- Manajemen menu
- Validasi menu
- Standar gizi
- Database nutrisi
- Permintaan bahan nutrisi
- Produksi
- Distribusi
- Konfirmasi penyelesaian distribusi
- Feedback
- Alert
- Statistik pemerintah

## Kelebihan untuk Presentasi

- Sudah memiliki 4 dashboard berdasarkan role.
- Sudah ada alur kerja dari registrasi vendor sampai monitoring pemerintah.
- Sudah terhubung frontend, backend, dan database.
- Sudah ada data demo dan akun demo untuk presentasi.

## Catatan Implementasi

- Dokumentasi ini mengikuti perilaku kode saat ini, bukan aspirasi copy pemasaran.
- Beberapa teks UI menyebut blockchain, AES-256, MFA, microservices, atau AI. Istilah tersebut tidak boleh otomatis dibaca sebagai arsitektur backend yang benar-benar terimplementasi tanpa verifikasi kode lanjutan.
