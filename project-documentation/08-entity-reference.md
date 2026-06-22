# Referensi Entitas Data

## Entitas Utama

### users

- `id_user`
- `name`
- `email`
- `password`
- `role`
- `status`

### vendors

- `id_vendor`
- `nama_vendor`
- `region`
- `status_verifikasi`
- `izin_usaha`
- `id_user`

### vendor_registrations

- `id_registration`
- `nama_vendor`
- `alamat`
- `region`
- `kontak`
- `email`
- `izin_usaha`
- `status`
- `documents`
- `reviewed_by`
- `id_vendor`

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

### dapur_stok

- `id_stok`
- `id_dapur`
- `nama_bahan`
- `jumlah`
- `satuan`

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

## Relasi Inti

- Satu `user` dapat terhubung ke satu `vendor` atau satu `sekolah`.
- Satu `vendor` dapat memiliki banyak `dapur`.
- Satu `dapur` dapat memiliki banyak `stok`.
- Satu `dapur` dapat melayani banyak `sekolah` melalui `mapping_dapur_sekolah`.
- Satu `vendor` dapat memiliki banyak `menu`.
- Satu `menu` dapat memiliki banyak catatan validasi.
- Satu `dapur` dapat memiliki banyak `produksi`.
- Satu `produksi` dapat menghasilkan banyak `distribusi`.
- Satu `distribusi` dapat memiliki satu atau lebih catatan konfirmasi tergantung kebutuhan bisnis, tetapi implementasi saat ini dipakai sebagai konfirmasi penerimaan.

## Kandidat untuk UML Class Diagram

- User
- Vendor
- Sekolah
- Dapur
- Stok
- Menu
- Produksi
- Distribusi
- KonfirmasiKedatangan
- Feedback
- StandarGizi
- NutritionItem
- Alert
- DokumenVendor
