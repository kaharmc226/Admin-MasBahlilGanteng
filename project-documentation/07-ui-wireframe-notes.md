# Catatan Wireframe UI/UX

## Halaman Utama yang Perlu Dibuat Wireframe

- Landing page
- Login
- Registrasi vendor
- Dashboard vendor
- Halaman menu vendor
- Halaman stok vendor
- Halaman produksi vendor
- Halaman distribusi vendor
- Dashboard ahli gizi
- Halaman validasi menu
- Halaman standar gizi
- Dashboard sekolah
- Halaman konfirmasi sekolah
- Halaman feedback sekolah
- Dashboard pemerintah
- Halaman monitoring vendor
- Halaman mapping dapur-sekolah
- Halaman statistik
- Halaman alert

## Struktur Dasar Layout

- Sidebar kiri untuk navigasi role
- Topbar untuk breadcrumb, notifikasi, dan switch role
- Main content untuk dashboard atau form
- Modal atau side panel untuk tambah/edit data

## Komponen UI Penting

- Card statistik
- Tabel data
- Badge status
- Form input
- Modal tambah/edit
- Upload file/image
- Chart statistik
- Map/peta distribusi
- Timeline status produksi/distribusi

## Prioritas Wireframe per Role

### Vendor

- Dashboard ringkasan
- Form tambah dapur
- Form tambah stok
- Form tambah menu
- Tabel produksi
- Tabel distribusi
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
- Form konfirmasi kedatangan
- Upload bukti foto
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
| Card Stok         | Card Produksi     | Card Distribusi   |
+-----------------------------------------------------------+
| Feed Logistik Terkini                                    |
+-----------------------------------------------------------+
| Tabel tiket produksi / aktivitas                         |
+-----------------------------------------------------------+
```

### Halaman Validasi Menu Ahli Gizi

```text
+-----------------------------------------------------------+
| Sidebar | Topbar                                          |
+-----------------------------------------------------------+
| Statistik pending | revisi | approved                     |
+-----------------------------------------------------------+
| List Menu | Detail Menu | Hasil Audit Gizi                |
+-----------------------------------------------------------+
| Tombol Approve | Reject | Generate Report                 |
+-----------------------------------------------------------+
```

### Halaman Konfirmasi Sekolah

```text
+-----------------------------------------------------------+
| Sidebar | Topbar                                          |
+-----------------------------------------------------------+
| Card Distribusi Aktif                                     |
+-----------------------------+-----------------------------+
| Upload Bukti Foto           | Riwayat Konfirmasi          |
+-----------------------------+-----------------------------+
| Tombol Konfirmasi Sesuai    | Tombol Lapor Selisih        |
+-----------------------------------------------------------+
```

### Dashboard Pemerintah

```text
+-----------------------------------------------------------+
| Sidebar | Topbar                                          |
+-----------------------------------------------------------+
| Card Vendor | Card Sekolah | Card Alert | Card Distribusi |
+-----------------------------------------------------------+
| Tabel Registrasi Vendor                                     |
+-----------------------------------------------------------+
| Tabel Vendor Aktif / Statistik / Alert                      |
+-----------------------------------------------------------+
```

## Saran UX

- Bedakan warna per role agar mudah dikenali.
- Gunakan status badge yang konsisten.
- Jaga alur input tetap pendek untuk vendor dan sekolah.
- Prioritaskan informasi status real-time di dashboard.
