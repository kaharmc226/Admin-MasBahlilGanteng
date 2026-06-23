# TRAKSI (Transparansi Gizi Nasional)

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2.2-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5.2.1-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1.svg)](https://www.mysql.com/)

TRAKSI adalah aplikasi web monitoring operasional MBG yang menghubungkan vendor, ahli gizi, sekolah, dan pemerintah dalam satu alur kerja berbasis dashboard. Implementasi saat ini berfokus pada pengelolaan dapur dan stok, validasi menu, produksi dan distribusi, penyelesaian tiket oleh sekolah, review vendor oleh pemerintah, serta referensi nutrisi berbasis database.

## Peran Utama

1. **Vendor**
   Mengelola dapur, stok, menu, dokumen vendor, dan tiket produksi yang terhubung ke distribusi sekolah.
2. **Ahli Gizi**
   Memvalidasi menu, mengelola standar gizi, mengelola database nutrisi, dan memproses permintaan bahan dari vendor.
3. **Sekolah**
   Memantau tiket distribusi yang ditugaskan, menyelesaikan distribusi setelah status `TIBA`, mengirim feedback, dan melaporkan kendala.
4. **Pemerintah**
   Meninjau pendaftaran vendor, mengaudit vendor dan dokumen, mengelola mapping dapur-sekolah, memonitor statistik, dan mengarsipkan alert.

## Fitur Utama

- Dashboard berbasis role untuk Vendor, Ahli Gizi, Sekolah, dan Pemerintah.
- Registrasi vendor publik melalui `/registrasi-vendor` dengan antrian review pemerintah.
- Gate operasional dapur: stok dan produksi hanya berjalan pada dapur berstatus `approved`.
- Validasi menu oleh Ahli Gizi sebelum menu bisa masuk ke produksi.
- Status produksi berurutan: `pending -> persiapan -> memasak -> siap_kirim -> selesai`.
- Status distribusi berurutan: `DIJADWALKAN -> DISTRIBUSI -> TIBA -> SELESAI`.
- Sekolah hanya dapat menutup distribusi setelah vendor menandai tiket sebagai `TIBA`.
- Upload aset untuk foto menu, dokumen vendor, dan foto bukti sekolah.
- Database nutrisi dan permintaan bahan vendor yang diproses oleh Ahli Gizi.
- Quick start lokal untuk bootstrap database dan menjalankan frontend + backend.

## Route Aplikasi

Route publik:

- `/` landing page
- `/login` login multi-role
- `/registrasi-vendor` form registrasi vendor

Route terlindungi:

- `/vendor/*`
- `/ahli-gizi/*`
- `/sekolah/*`
- `/pemerintah/*`

Catatan navigasi:

- Area vendor dibagi ke dashboard, submenu manajemen vendor, dan status produksi.
- Tidak ada halaman distribusi vendor yang berdiri sendiri dalam praktik; distribusi ditampilkan sebagai bagian dari lifecycle produksi.

## Tech Stack

- Frontend: React, Vite, React Router
- Styling: Tailwind CSS v4, clsx, tailwind-merge
- Visual: Framer Motion, Lucide React, Recharts, Chart.js
- Backend: Node.js, Express
- Database: MySQL (`mysql2`)

## Struktur Proyek

```text
.
|-- database/               # Schema SQL dan arsip seed SQL lama
|-- public/                 # Aset statis dan uploads saat aplikasi berjalan
|-- scripts/                # Script bootstrap dan seeder database
|-- server/                 # Backend Express + koneksi MySQL
|-- src/                    # Frontend React
|   |-- api.js              # API client
|   |-- components/         # Komponen UI reusable
|   |-- pages/              # Halaman per role
|   `-- App.jsx             # Routing aplikasi
|-- quick-start.js          # Startup frontend, backend, dan bootstrap DB
`-- package.json
```

## Prasyarat

- Node.js 18 atau lebih baru
- MySQL atau MariaDB lokal yang sudah berjalan
- Laragon/XAMPP opsional bila dipakai untuk menyediakan service MySQL

## Konfigurasi Database

Secara default backend membaca konfigurasi berikut dari `server/dbConfig.js`:

- Host: `localhost`
- Port: `3306`
- User: `root`
- Password: kosong
- Database: `traksi_db`

Jika ingin memakai kredensial lain, ubah file `server/dbConfig.js` terlebih dahulu.

## Instalasi

```bash
npm install
```

## Menjalankan Aplikasi

### Opsi 1: Quick Start

```bash
npm start
```

Perintah ini akan:

- memeriksa koneksi MySQL,
- gagal cepat bila MySQL belum berjalan,
- membuat atau menginisialisasi `traksi_db` bila database kosong,
- mengimpor schema dari `database/schema.sql`,
- menanam baseline `kendari-clean` dari canonical seed,
- menampilkan instruksi demo opsional `npm run seed:db -- --profile=kendari-demo --reset`,
- menjalankan backend dan frontend secara bersamaan.

Untuk reset schema + baseline clean:

```bash
npm start -- --reset
```

### Opsi 2: Jalankan Manual

Backend:

```bash
npm run server
```

Frontend:

```bash
npm run dev
```

Default URL:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

## Seeder Database

Seeder database memakai satu sumber data kanonis dengan dua profil yang konsisten.

Baseline clean:

```bash
npm run seed:db -- --profile=kendari-clean --reset
```

Baseline demo presentasi:

```bash
npm run seed:db -- --profile=kendari-demo --reset
```

Alias kompatibilitas:

```bash
npm run seed:demo
```

Perilaku seeder:

- `--reset`: drop dan bangun ulang database dari schema + seed profile terpilih.
- tanpa `--reset`, command hanya jalan bila database masih kosong.
- `npm run seed:demo` memetakan ke profil `kendari-demo` dengan reset penuh.

Catatan:

- `npm start` cocok untuk bootstrap cepat setelah service MySQL aktif.
- `npm run seed:db -- --profile=kendari-clean --reset` adalah cara paling aman untuk mulai bersih.
- `npm run server` saja tidak melakukan bootstrap database.

## Akun Demo

| Role | Email | Password |
| :--- | :--- | :--- |
| Vendor | `vendor.mandonga@traksi.id` | `vendor123` |
| Pemerintah | `pemkot.kendari@traksi.id` | `gov123` |
| Ahli Gizi | `gizi.kendari@traksi.id` | `nutri123` |
| Sekolah | `sdn02.mandonga@sekolah.traksi.id` | `sekolah123` |

## Alur Demo yang Disarankan

1. Login sebagai **Vendor** lalu tunjukkan dapur approved, stok, menu, dokumen, dan tiket produksi.
2. Login sebagai **Ahli Gizi** lalu validasi menu, cek standar gizi, dan tampilkan database nutrisi serta permintaan bahan.
3. Login sebagai **Sekolah** lalu tunjukkan tiket distribusi aktif, penyelesaian distribusi setelah `TIBA`, feedback, dan laporan kendala.
4. Login sebagai **Pemerintah** lalu buka antrian registrasi vendor, audit dokumen vendor, mapping dapur-sekolah, statistik, dan alert.

## Status Implementasi

Yang sudah berjalan saat ini:

- Frontend empat role sudah terhubung ke backend Express dan MySQL.
- Vendor registration publik menyimpan data ke `vendor_registrations` untuk direview pemerintah.
- Pemerintah dapat menyetujui, meminta revisi, atau menolak pendaftaran vendor.
- Vendor dapat mengelola dapur, tetapi stok dan produksi hanya berjalan pada dapur yang sudah `approved`.
- Menu vendor harus berstatus `approved` sebelum tiket produksi dapat dibuat.
- Produksi dan distribusi memiliki aturan transisi status yang tervalidasi di backend.
- Sekolah melihat distribusi berdasarkan akun sekolah yang login dan hanya dapat menutup tiket setelah status `TIBA`.
- Foto bukti sekolah bersifat opsional saat penyelesaian distribusi.
- Ahli Gizi dapat mengelola standar gizi, database nutrisi, validasi menu, dan permintaan bahan vendor.
- Pemerintah dapat suspend atau mengaktifkan kembali vendor, menonaktifkan atau mengaktifkan kembali sekolah, serta mengarsipkan alert.
- Upload file berjalan untuk foto menu, dokumen vendor, dan foto bukti sekolah.

Keterbatasan yang masih perlu dicatat:

- Autentikasi masih sederhana dan belum dirancang sebagai sistem produksi.
- Beberapa copy visual di landing page atau dashboard menyebut blockchain, AES-256, MFA, microservices, atau AI; narasi ini tidak boleh dianggap sebagai bukti implementasi backend tanpa verifikasi kode tambahan.
- Fitur upload, kamera, dan beberapa interaksi presentasi masih berada pada tingkat demo operasional lokal.

## Catatan Dokumentasi

- Dokumentasi ini bersifat implementation-first dan mengikuti perilaku kode saat ini.
- Keberadaan field seperti `blockchain_hash` pada data distribusi tidak otomatis berarti seluruh arsitektur blockchain sudah diimplementasikan.
- Narasi "AI" pada area Ahli Gizi saat ini sebaiknya dipahami sebagai copy presentasi sampai ada bukti logika backend yang benar-benar menjalankan analisis AI.

## Build

```bash
npm run build
```

Jika build berhasil, frontend siap dipakai untuk preview atau presentasi lokal.
