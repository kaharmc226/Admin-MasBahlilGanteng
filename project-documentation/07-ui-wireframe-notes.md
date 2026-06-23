# Catatan Wireframe UI/UX

## Halaman Utama yang Perlu Dibuat Wireframe

- Landing page
- Login
- Registrasi vendor
- Dashboard vendor
- Halaman informasi vendor dan dapur
- Halaman menu vendor
- Halaman stok vendor
- Halaman status produksi vendor
- Dashboard ahli gizi
- Halaman validasi menu
- Halaman standar gizi
- Dashboard sekolah
- Halaman status distribusi dan penyelesaian sekolah
- Halaman feedback sekolah
- Dashboard pemerintah
- Halaman monitoring vendor
- Halaman mapping dapur-sekolah
- Halaman statistik
- Halaman alert

## Struktur Dasar Layout

- Sidebar kiri untuk navigasi role
- Topbar untuk breadcrumb, notifikasi, dan switch role
- Main content untuk dashboard, tabel, dan form
- Modal atau side panel untuk tambah/edit data

## Komponen UI Penting

- Card statistik
- Tabel data
- Badge status
- Form input
- Modal tambah/edit
- Upload file/image
- Chart statistik
- Timeline status produksi/distribusi
- Viewer dokumen atau preview aset upload

## Prioritas Wireframe per Role

### Vendor

- Dashboard ringkasan
- Form tambah dapur
- Form tambah stok
- Form tambah menu
- Tabel produksi dengan status lifecycle
- Panel distribusi yang menyatu dengan tiket produksi
- Viewer dokumen vendor

### Ahli Gizi

- Dashboard ringkasan validasi
- Tabel daftar menu
- Panel detail menu
- Form standar gizi
- Tabel database nutrisi
- Panel review permintaan bahan

### Sekolah

- Dashboard distribusi aktif
- Form penyelesaian distribusi
- Upload bukti foto opsional
- Form feedback
- Form laporan kendala

### Pemerintah

- Dashboard monitoring
- Tabel antrian vendor
- Tabel vendor aktif
- Modal audit vendor
- Halaman mapping
- Halaman statistik chart
- Halaman alert operasional

## Contoh Low-Fidelity Wireframe Teks

### Dashboard Vendor

```text
+-----------------------------------------------------------+
| Sidebar | Topbar                                          |
+-----------------------------------------------------------+
| Welcome Banner                                            |
+-------------------+-------------------+-------------------+
| Card Stok         | Card Produksi     | Card Menu         |
+-----------------------------------------------------------+
| Daftar dapur approved / pending review                    |
+-----------------------------------------------------------+
| Tabel tiket produksi dan distribusi terkait               |
+-----------------------------------------------------------+
```

### Halaman Validasi Menu Ahli Gizi

```text
+-----------------------------------------------------------+
| Sidebar | Topbar                                          |
+-----------------------------------------------------------+
| Statistik pending | revisi | approved                     |
+-----------------------------------------------------------+
| List Menu | Detail Menu | Hasil Review Gizi              |
+-----------------------------------------------------------+
| Tombol Approve | Reject | Generate Report JSON           |
+-----------------------------------------------------------+
```

### Halaman Status Distribusi Sekolah

```text
+-----------------------------------------------------------+
| Sidebar | Topbar                                          |
+-----------------------------------------------------------+
| Card Distribusi Aktif                                     |
+-----------------------------+-----------------------------+
| Timeline Distribusi         | Riwayat Konfirmasi          |
+-----------------------------+-----------------------------+
| Form Selesaikan Distribusi  | Tombol Feedback / Kendala   |
+-----------------------------------------------------------+
```

### Dashboard Pemerintah

```text
+-----------------------------------------------------------+
| Sidebar | Topbar                                          |
+-----------------------------------------------------------+
| Card Vendor | Card Sekolah | Card Alert | Card Statistik  |
+-----------------------------------------------------------+
| Tabel Registrasi Vendor                                   |
+-----------------------------------------------------------+
| Tabel Vendor Aktif / Mapping / Alert                      |
+-----------------------------------------------------------+
```

## Saran UX

- Bedakan warna per role agar mudah dikenali.
- Gunakan status badge yang konsisten.
- Jaga alur input tetap pendek untuk vendor dan sekolah.
- Prioritaskan informasi status real-time di dashboard.
- Dokumentasikan vendor distribution sebagai bagian dari lifecycle produksi, bukan halaman terpisah.
