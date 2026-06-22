# TRAKSI (Transparansi Gizi Nasional)

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2.2-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5.2.1-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1.svg)](https://www.mysql.com/)

TRAKSI adalah platform pelacakan dan transparansi distribusi makanan bergizi untuk mendukung program MBG. Aplikasi ini menghubungkan empat peran utama dalam satu alur kerja:

1. **Vendor**: mengelola dapur, stok bahan, menu, produksi, dan dokumen vendor.
2. **Ahli Gizi**: memvalidasi menu, memantau standar gizi, dan menjaga referensi nutrisi.
3. **Sekolah**: menerima distribusi, mengonfirmasi kedatangan, dan memberi feedback.
4. **Pemerintah**: memantau vendor, sekolah, alert operasional, dan cakupan distribusi.

## Fitur Utama

- Dashboard berbasis peran untuk Vendor, Ahli Gizi, Sekolah, dan Pemerintah.
- Alur operasional dari stok bahan -> produksi -> distribusi -> konfirmasi sekolah -> feedback.
- Integrasi frontend React dengan backend Express dan database MySQL.
- Seeder database kanonis berbasis profil untuk baseline Kendari clean dan demo.
- Quick start lokal untuk menjalankan frontend dan backend sekaligus.

## Tech Stack

- Frontend: React, Vite, React Router
- Styling: Tailwind CSS v4, clsx, tailwind-merge
- Visual: Framer Motion, Lucide React, Recharts, Chart.js
- Backend: Node.js, Express
- Database: MySQL (`mysql2`)

## Struktur Proyek

```text
.
|-- database/               # SQL schema dan arsip seed SQL lama yang sudah dipensiunkan
|-- public/                 # Aset statis
|-- scripts/                # Script utilitas terminal
|-- server/                 # Backend Express + koneksi MySQL
|-- src/                    # Frontend React
|   |-- api.js              # API client
|   |-- components/         # Komponen UI reusable
|   |-- pages/              # Halaman dashboard per role
|   `-- App.jsx             # Routing aplikasi
|-- quick-start.js          # Menjalankan setup DB + frontend + backend
`-- package.json
```

## Prasyarat

- Node.js 18 atau lebih baru
- MySQL lokal
- MySQL atau MariaDB lokal yang sudah berjalan
- Laragon/XAMPP opsional bila Anda memakainya untuk menyediakan service MySQL

## Konfigurasi Database

Secara default backend membaca konfigurasi berikut dari [server/dbConfig.js](C:/Users/Administrator/Documents/GitHub/Admin-MasBahlilGanteng/server/dbConfig.js:1):

- Host: `localhost`
- Port: `3306`
- User: `root`
- Password: kosong
- Database: `traksi_db`

Jika Anda ingin memakai kredensial lain, ubah file `server/dbConfig.js` terlebih dahulu.

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
- menanam baseline `kendari-clean` dari canonical seed di `scripts/seed-data.js`,
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

Seeder database sekarang memakai satu sumber data kanonis dengan dua profil yang saling konsisten.

```bash
npm run seed:db -- --profile=kendari-clean --reset
```

Untuk baseline demo presentasi yang tetap memakai graph data yang sama:

```bash
npm run seed:db -- --profile=kendari-demo --reset
```

Alias kompatibilitas tetap tersedia:

```bash
npm run seed:demo
```

Perilaku seeder:

- `--reset`: drop dan bangun ulang database secara otoritatif dari schema + seed profile terpilih.
- tanpa `--reset`, command hanya akan jalan jika database masih kosong; jika sudah berisi data, command akan berhenti dan meminta reset eksplisit.
- `npm run seed:demo` sekarang memetakan ke profil `kendari-demo` dengan reset penuh.

Catatan:

- `npm start` cocok untuk bootstrap cepat setelah service MySQL lokal aktif.
- `npm run seed:db -- --profile=kendari-clean --reset` adalah cara paling aman untuk mulai fresh tanpa data yatim.
- `npm run seed:db -- --profile=kendari-demo --reset` menambah histori demo di atas master data Kendari yang sama.
- `npm run server` saja tidak melakukan bootstrap database.

## Akun Demo

| Role | Email | Password |
| :--- | :--- | :--- |
| Vendor | `vendor.mandonga@traksi.id` | `vendor123` |
| Pemerintah | `pemkot.kendari@traksi.id` | `gov123` |
| Ahli Gizi | `gizi.kendari@traksi.id` | `nutri123` |
| Sekolah | `sdn02.mandonga@sekolah.traksi.id` | `sekolah123` |

## Alur Demo yang Disarankan

Untuk presentasi finals, alur ini paling aman dan mudah dijelaskan:

1. Login sebagai **Vendor** lalu tunjukkan stok, dapur, menu, dan tiket produksi.
2. Login sebagai **Ahli Gizi** lalu validasi menu dan lihat standar gizi.
3. Login sebagai **Sekolah** lalu tunjukkan distribusi aktif, konfirmasi kedatangan, dan feedback.
4. Login sebagai **Pemerintah** lalu buka audit vendor, alert, dan pemetaan distribusi.

## Status Implementasi

Yang sudah berjalan dengan baik untuk demo:

- Dashboard empat role sudah terhubung ke backend.
- Vendor bisa bekerja dengan dapur, menu, produksi, distribusi terkait, dan dokumen vendor.
- Ahli Gizi bisa memvalidasi menu, membuat standar gizi, dan mengunduh data nutrisi.
- Sekolah memakai data distribusi yang terkait dengan user sekolah yang login.
- Pemerintah bisa memonitor vendor, melihat dokumen, memproses alert, dan melihat mapping dapur-sekolah.
- Produksi backend memakai transaksi database agar stok tidak terpotong parsial saat validasi gagal.

Keterbatasan yang masih wajar untuk proyek finals:

- Autentikasi masih sederhana dan belum dirancang sebagai sistem produksi.
- Upload file, kamera, dan fitur komunikasi masih bersifat demo-level.
- Beberapa area masih mengutamakan alur presentasi dan konsistensi data, bukan hardening produksi.

## Build

```bash
npm run build
```

Jika build berhasil, frontend siap dipakai untuk preview atau presentasi lokal.
