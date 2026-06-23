# Inventaris Fitur Website

## Fitur Umum

- Login berbasis role
- Protected route per role
- Switch role demo dari dashboard
- Integrasi frontend ke backend melalui REST API
- Penyimpanan aset upload untuk foto menu, dokumen vendor, dan foto konfirmasi sekolah

## Fitur Vendor

- Melihat dashboard operasional vendor
- Mengelola dapur operasional
- Menunggu approval dapur dari pemerintah sebelum dapur bisa dipakai untuk stok dan produksi
- Mengelola stok bahan baku per dapur approved
- Melihat histori mutasi stok
- Mengelola katalog menu
- Upload foto menu
- Menyusun menu dari bahan yang terhubung ke database nutrisi
- Mengajukan menu untuk validasi Ahli Gizi
- Mengelola dokumen vendor
- Upload dokumen vendor
- Membuat tiket produksi hanya untuk menu approved
- Mengubah status produksi:
  `pending -> persiapan -> memasak -> siap_kirim -> selesai`
- Pengurangan stok otomatis saat produksi mulai atau saat status produksi bergerak sesuai aturan backend
- Melihat distribusi yang terkait dengan tiket produksi
- Mengajukan permintaan bahan baru ke database nutrisi

## Fitur Ahli Gizi

- Melihat dashboard validasi gizi
- Meninjau menu vendor
- Menyetujui atau menolak menu
- Menulis catatan validasi
- Mengelola standar gizi
- Menghasilkan laporan review menu dalam format JSON
- Mengelola database bahan nutrisi
- Menonaktifkan bahan nutrisi
- Meninjau permintaan bahan dari vendor
- Menyetujui atau menolak permintaan bahan vendor

## Fitur Sekolah

- Melihat dashboard distribusi berdasarkan akun sekolah
- Melihat tiket distribusi aktif dan riwayat terkait
- Menyelesaikan distribusi hanya setelah status vendor `TIBA`
- Upload foto bukti bersifat opsional saat penyelesaian distribusi
- Menyimpan riwayat konfirmasi distribusi
- Memberikan rating dan feedback
- Melaporkan kendala distribusi melalui alert
- Status sekolah bisa diaktifkan atau dinonaktifkan oleh pemerintah

## Fitur Pemerintah

- Melihat dashboard monitoring nasional
- Melihat daftar vendor aktif dan vendor suspended
- Melihat antrian registrasi vendor
- Menyetujui, meminta revisi, atau menolak pendaftaran vendor
- Audit vendor
- Audit dokumen vendor
- Approve atau reject dapur
- Suspend atau aktifkan kembali vendor
- Mengelola mapping dapur ke sekolah
- Menambah sekolah baru dan langsung membuat mapping
- Menonaktifkan atau mengaktifkan kembali sekolah
- Melihat statistik penerima manfaat
- Melihat alert operasional
- Menandai alert selesai
- Mengarsipkan alert

## Fitur Data dan Operasional

- CRUD vendor
- CRUD sekolah
- CRUD dapur
- CRUD stok
- CRUD mapping
- CRUD menu
- CRUD produksi
- CRUD distribusi
- CRUD standar gizi
- CRUD feedback
- CRUD alert
- CRUD dokumen vendor
- CRUD database nutrisi
- CRUD permintaan nutrisi
- CRUD vendor registrations pada sisi backend

## Fitur Upload

- Upload foto menu
- Upload dokumen vendor
- Upload foto konfirmasi sekolah

## Fitur Data Demo

- Quick start untuk bootstrap database dan server lokal
- Seeder berbasis profil `kendari-clean` dan `kendari-demo`
- Akun demo per role dari database seed

## Catatan Implementasi

- Backend menyediakan endpoint lengkap untuk kebutuhan diagram sistem dan demo operasional lokal.
- Tidak ada halaman distribusi vendor yang benar-benar berdiri sendiri; distribusi muncul sebagai bagian dari area produksi vendor.
- Beberapa narasi visual pada UI bersifat demo/presentasi dan tidak otomatis identik dengan implementasi teknis backend.
