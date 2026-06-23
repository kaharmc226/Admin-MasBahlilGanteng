# Referensi Entitas Data

## Entitas Utama

### users

- `id_user`
- `name`
- `email`
- `password`
- `role`
- `status`
- `created_at`

### vendors

- `id_vendor`
- `nama_vendor`
- `region`
- `status_verifikasi`
- `izin_usaha`
- `id_user`
- `id_ahli_gizi_pengawas`

### vendor_registrations

- `id_registration`
- `nama_vendor`
- `alamat`
- `region`
- `kontak`
- `email`
- `izin_usaha`
- `status`
- `review_note`
- `reviewed_by`
- `reviewed_at`
- `id_vendor`
- `documents`
- `created_at`
- `updated_at`

### sekolah

- `id_sekolah`
- `nama_sekolah`
- `alamat`
- `jenjang`
- `jumlah_siswa`
- `alergi_count`
- `intoleran_count`
- `id_user`
- `status`

### dapur

- `id_dapur`
- `id_vendor`
- `lokasi`
- `kapasitas_produksi`
- `status_verifikasi`
- `review_note`
- `reviewed_by`
- `reviewed_at`

### dapur_stok

- `id_stok`
- `id_dapur`
- `nama_bahan`
- `jumlah`
- `satuan`

### dapur_stok_history

- `id_log`
- `id_dapur`
- `nama_bahan`
- `tipe`
- `jumlah`
- `satuan`
- `keterangan`
- `created_at`

### mapping_dapur_sekolah

- `id_mapping`
- `id_dapur`
- `id_sekolah`

### menus

- `id_menu`
- `id_vendor`
- `nama_menu`
- `bahan`
- `nilai_gizi`
- `foto_url`
- `notes`
- `status_validasi`
- `tanggal`

### produksi

- `id_produksi`
- `id_dapur`
- `id_menu`
- `status`
- `jumlah_porsi`
- `waktu_mulai`
- `waktu_selesai`

### distribusi

- `id_distribusi`
- `kode_transaksi`
- `id_produksi`
- `id_sekolah`
- `jumlah_porsi`
- `waktu_kirim`
- `waktu_tiba`
- `status`
- `blockchain_hash`

### standar_gizi

- `id_standar`
- `title`
- `requirement`
- `color`
- `deskripsi`
- `detail`
- `id_user_pembuat`

### validasi_log

- `id_validasi`
- `id_menu`
- `id_user`
- `aksi`
- `catatan`
- `created_at`

### konfirmasi_kedatangan

- `id_konfirmasi`
- `id_distribusi`
- `id_user`
- `waktu_konfirmasi`
- `kondisi_makanan`
- `jumlah_diterima`
- `catatan`
- `foto_bukti`

### feedback

- `id_feedback`
- `id_sekolah`
- `id_user`
- `id_menu`
- `rating`
- `komentar`
- `kategori`

### alerts

- `id_alert`
- `judul`
- `deskripsi`
- `severity`
- `wilayah`
- `is_resolved`
- `resolved_by`
- `resolved_at`
- `is_archived`
- `created_at`

### dokumen_vendor

- `id_dokumen`
- `id_vendor`
- `nama_dokumen`
- `jenis`
- `status`
- `tanggal_berlaku`
- `tanggal_kadaluarsa`
- `file_path`
- `review_note`
- `reviewed_by`
- `is_archived`

### nutrition_database

- `id`
- `kategori`
- `nama`
- `satuan`
- `energi`
- `protein`
- `lemak`
- `karbohidrat`
- `serat`
- `natrium`
- `status`
- `created_at`
- `updated_at`

### nutrition_requests

- `id_request`
- `id_vendor`
- `requested_by`
- `nama`
- `kategori`
- `catatan`
- `status`
- `reviewed_by`
- `id_nutrition`
- `review_note`
- `created_at`
- `reviewed_at`

## Relasi Inti

- Satu `user` dapat terhubung ke satu `vendor` atau satu `sekolah`.
- Satu `vendor` dapat memiliki banyak `dapur`.
- Satu `vendor` dapat memiliki satu pengawas ahli gizi aktif melalui `id_ahli_gizi_pengawas`.
- Satu `dapur` dapat memiliki banyak `stok`.
- Satu `dapur` dapat memiliki banyak log mutasi stok.
- Satu `dapur` dapat melayani banyak `sekolah` melalui `mapping_dapur_sekolah`.
- Satu `vendor` dapat memiliki banyak `menu`.
- Satu `menu` dapat memiliki banyak catatan validasi.
- Satu `dapur` dapat memiliki banyak `produksi`.
- Satu `produksi` dapat menghasilkan satu atau lebih `distribusi`.
- Satu `distribusi` dipakai sebagai dasar satu alur penyelesaian sekolah pada implementasi saat ini.
- Satu `vendor_registration` dapat berubah menjadi `vendor` resmi setelah approval pemerintah.
- Satu `nutrition_request` dapat menghasilkan satu data baru pada `nutrition_database`.

## Kandidat untuk UML Class Diagram

- User
- Vendor
- VendorRegistration
- Sekolah
- Dapur
- DapurStok
- DapurStokHistory
- MappingDapurSekolah
- Menu
- Produksi
- Distribusi
- KonfirmasiKedatangan
- Feedback
- StandarGizi
- NutritionItem
- NutritionRequest
- Alert
- DokumenVendor
