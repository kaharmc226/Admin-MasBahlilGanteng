# Flowmap Sistem

## Flowmap Proses Bisnis Utama

```mermaid
flowchart TD
    A[Vendor Login] --> B[Kelola Dapur]
    B --> C[Kelola Stok Bahan]
    C --> D[Buat atau Edit Menu]
    D --> E[Ajukan Menu untuk Validasi]
    E --> F[Ahli Gizi Review Menu]
    F -->|Disetujui| G[Menu Approved]
    F -->|Ditolak| H[Revisi Menu oleh Vendor]
    H --> D
    G --> I[Buat Tiket Produksi]
    I --> J[Status Produksi Berjalan]
    J --> K[Stok Berkurang Otomatis]
    K --> L[Siapkan Distribusi]
    L --> M[Kirim ke Sekolah]
    M --> N[Sekolah Konfirmasi Kedatangan]
    N --> O[Upload Bukti Foto]
    O --> P[Sekolah Beri Feedback]
    P --> Q[Pemerintah Monitoring]
    M --> Q
    F --> Q
    N --> Q
```

## Flowmap Registrasi Vendor

```mermaid
flowchart TD
    A[Calon Vendor Isi Form Registrasi] --> B[Upload Dokumen]
    B --> C[Data Masuk ke Vendor Registrations]
    C --> D[Pemerintah Review]
    D -->|Approve| E[Vendor Resmi Dibuat]
    D -->|Revision| F[Vendor Perbaiki Data]
    D -->|Reject| G[Registrasi Ditolak]
    F --> C
```

## Flowmap Konfirmasi Sekolah

```mermaid
flowchart TD
    A[Distribusi Aktif] --> B[Sekolah Buka Halaman Konfirmasi]
    B --> C[Upload Foto Bukti]
    C --> D[Isi Kondisi dan Jumlah Diterima]
    D --> E[Simpan Konfirmasi]
    E --> F[Status Distribusi Menjadi SELESAI]
    F --> G[Riwayat Konfirmasi Tersimpan]
```

## Catatan untuk Flowmap Final

- Flowmap utama yang paling kuat untuk presentasi adalah:
  `Vendor -> Ahli Gizi -> Produksi -> Distribusi -> Sekolah -> Pemerintah`
- Jika dosen meminta flowmap per aktor, pisahkan menjadi:
  vendor flow, ahli gizi flow, sekolah flow, dan pemerintah flow.
