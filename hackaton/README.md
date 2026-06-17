# TRAKSI (Transparansi Gizi Nasional)

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2.2-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5.2.1-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1.svg)](https://www.mysql.com/)

**TRAKSI** adalah platform pelacakan dan transparansi gizi makanan yang dirancang untuk mendukung program Makanan Bergizi Gratis (MBG) di Indonesia. Sistem ini menyediakan ekosistem terpadu untuk empat peran utama:

1. 🧑‍🍳 **Vendor**: Produsen makanan dan dapur umum yang mengelola stok dan produksi.
2. 👩‍⚕️ **Ahli Gizi**: Ahli gizi yang memastikan kualitas makanan dan standar gizi terpenuhi.
3. 🏫 **Sekolah**: Pihak sekolah yang menerima dan mendistribusikan makanan kepada siswa.
4. 🏛️ **Pemerintah**: Pejabat pemerintah yang mengawasi pelaksanaan program di seluruh negeri.

---

## 🎯 Fitur Utama

*   **Dashboard Berbasis Peran:** Antarmuka khusus untuk Vendor, Ahli Gizi, Sekolah, dan Pemerintah.
*   **Pelacakan Produksi:** Alur kerja (workflow) end-to-end dari pemotongan stok bahan baku hingga pengiriman makanan.
*   **UI/UX Modern:** Desain yang bersih dan responsif, didukung oleh Tailwind CSS v4, Framer Motion, dan Lucide React.
*   **Visualisasi Data:** Grafik interaktif menggunakan Recharts dan Chart.js.
*   **Tata Letak Responsif:** Berjalan dengan optimal di perangkat desktop maupun seluler.

---

## 🚀 Mulai Cepat

Untuk menjalankan TRAKSI secara lokal di komputer Anda, ikuti langkah-langkah berikut:

### Prasyarat

*   **Node.js** (direkomendasikan versi 18+)
*   Database **MySQL** (melalui Laragon, XAMPP, atau instalasi native)

### Konfigurasi Database Lokal

1. Buat database MySQL baru dengan nama `traksi_db`.
2. Impor skema dan data awal (seed data) yang disediakan dari file `database/traksi_db.sql`.
3. Backend akan membaca koneksi MySQL lokal dengan konfigurasi:
   *   Host: `localhost`
   *   Port: `3306`
   *   User: `root`
   *   Password: *(kosong)*

### Instalasi

Clone repositori ini dan instal semua dependensi:

```bash
cd hackaton
npm install
```

### Menjalankan Aplikasi

Anda perlu menjalankan server frontend dan backend secara bersamaan.

**1. Jalankan Server API Backend:**
```bash
npm run server
```
*API akan berjalan di `http://localhost:3001`*

**2. Jalankan Server Dev Frontend (di terminal baru):**
```bash
npm run dev
```
*Aplikasi web akan berjalan di `http://localhost:5173`*

---

## 🔐 Akun Pengujian (Testing)

Gunakan kredensial berikut untuk mencoba masuk ke dashboard dari masing-masing peran:

| Peran (Role) | Email | Password |
| :--- | :--- | :--- |
| **Vendor** | `v.jaktim@traksi.id` | `vendor123` |
| **Pemerintah** | `gov.dki@traksi.id` | `gov123` |
| **Ahli Gizi** | `nutri.jaktim@traksi.id` | `nutri123` |
| **Sekolah** | `sdn06@sekolah.traksi.id` | `sekolah123` |

---

## 🛠️ Tech Stack

*   **Ekosistem Frontend:** React (Vite), React Router v6
*   **Styling & UI:** Tailwind CSS v4.0, clsx, tailwind-merge
*   **Animasi & Ikon:** Framer Motion, Lucide React
*   **Grafik (Charts):** Recharts, react-chartjs-2
*   **Backend:** Node.js, Express.js (v5)
*   **Database:** MySQL (via klien `mysql2`)

---

## 📂 Struktur Proyek

```text
hackaton/
├── database/        # Dump database MySQL dan skema tabel
├── public/          # Aset statis
├── server/          # API backend berbasis Express.js
│   └── index.js     # Entry point utama untuk backend
├── src/             # Kode sumber (source code) React frontend
│   ├── api.js       # Klien API untuk frontend
│   ├── components/  # Komponen UI & tata letak yang dapat digunakan ulang
│   ├── pages/       # Halaman dashboard berbasis peran
│   └── App.jsx      # Routing utama aplikasi
├── package.json     # Metadata proyek dan dependensi
└── tailwind.config.js # Konfigurasi Tailwind CSS
```

---

## 🚧 Status Pengembangan

### Telah Selesai
*   Refactoring UI/UX dengan standar spasi (spacing) dan tata letak yang rapi.
*   Integrasi dengan Tailwind CSS v4.
*   Tata letak dashboard berbasis peran dengan sidebar yang dapat dilipat dan peralihan konteks antar peran.
*   Komponen inti UI yang dapat digunakan ulang (`Button`, `Card`, `Input`, `Modal`, `Table`).
*   Fitur Dashboard Vendor (Manajemen Stok Bahan Baku, Tiket Produksi).
*   Integrasi MySQL dengan endpoint API backend (CRUD lengkap).

### Tahap Selanjutnya (Upcoming)
*   Mengganti penggunaan data *mock* di frontend dengan pemanggilan API backend secara real (`src/api.js`).
*   Mengintegrasikan autentikasi otentik pada `Login.jsx` untuk menggantikan pencocokan data statis (hardcoded).
*   Penyederhanaan UI sepenuhnya pada formulir (form) untuk Ahli Gizi, Sekolah, dan Pemerintah (dengan panel *slide-in*).
