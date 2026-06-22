# Inventaris Fitur Website

## Fitur Umum

- Login berbasis role
- Protected route per role
- Switch role demo dari dashboard
- Integrasi frontend ke backend melalui REST API
- Penyimpanan aset upload untuk foto menu, dokumen vendor, dan foto konfirmasi

## Fitur Vendor

- Melihat dashboard operasional vendor
- Mengelola dapur operasional
- Mengelola stok bahan baku
- Melihat histori stok
- Mengelola katalog menu
- Upload foto menu
- Menyusun bahan menu dan nilai gizi
- Mengelola dokumen vendor
- Upload dokumen vendor
- Membuat tiket produksi
- Mengubah status produksi:
  `pending -> persiapan -> memasak -> siap_kirim -> selesai`
- Pengurangan stok otomatis saat produksi mulai
- Melihat distribusi ke sekolah

## Fitur Ahli Gizi

- Melihat dashboard validasi gizi
- Meninjau menu vendor
- Menyetujui atau menolak menu
- Menulis catatan validasi
- Mengelola standar gizi
- Menghasilkan laporan review menu
- Mengelola database bahan nutrisi
- Menonaktifkan bahan nutrisi
- Meninjau permintaan bahan dari vendor
- Menyetujui atau menolak permintaan bahan

## Fitur Sekolah

- Melihat dashboard penerimaan makanan
- Melihat distribusi aktif berdasarkan akun sekolah
- Konfirmasi kedatangan makanan
- Upload foto bukti serah terima
- Menyimpan riwayat konfirmasi
- Memberikan rating dan feedback
- Melaporkan kendala distribusi
- Status sekolah bisa diaktifkan atau dinonaktifkan

## Fitur Pemerintah

- Melihat dashboard monitoring nasional
- Melihat daftar vendor aktif
- Melihat antrian registrasi vendor
- Menyetujui, merevisi, atau menolak pendaftaran vendor
- Audit vendor
- Audit dokumen vendor
- Suspend atau aktifkan kembali vendor
- Mengelola mapping dapur ke sekolah
- Menambah sekolah baru dan langsung membuat mapping
- Menonaktifkan atau mengaktifkan sekolah
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

## Fitur Upload

- Upload foto menu
- Upload dokumen vendor
- Upload foto konfirmasi sekolah

## Fitur Data Demo

- Seeder demo
- SQL schema dan dummy data
- Quick start untuk bootstrap database dan server lokal

## Catatan Implementasi

- Backend menyediakan endpoint yang cukup lengkap untuk kebutuhan diagram sistem.
- Beberapa narasi visual pada UI bersifat demo/presentasi dan tidak selalu identik dengan implementasi teknis backend.
