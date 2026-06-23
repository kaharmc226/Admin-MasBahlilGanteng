# Flowmap Sistem

## Flowmap Proses Bisnis Utama

```mermaid
flowchart TD
    A[Vendor Login] --> B[Kelola Dapur]
    B --> C[Review Dapur oleh Pemerintah]
    C -->|Approved| D[Kelola Stok Bahan]
    C -->|Rejected atau Pending| Z[Dapur Belum Operasional]
    D --> E[Buat atau Edit Menu]
    E --> F[Ajukan Menu untuk Validasi]
    F --> G[Ahli Gizi Review Menu]
    G -->|Disetujui| H[Menu Approved]
    G -->|Ditolak| I[Revisi Menu oleh Vendor]
    I --> E
    H --> J[Buat Tiket Produksi]
    J --> K[Status Produksi Berjalan]
    K --> L[Stok Berkurang Sesuai Aturan Backend]
    L --> M[Distribusi Dijadwalkan]
    M --> N[Vendor Ubah Status ke DISTRIBUSI]
    N --> O[Vendor Ubah Status ke TIBA]
    O --> P[Sekolah Selesaikan Distribusi]
    P --> Q[Feedback atau Laporan Kendala]
    Q --> R[Pemerintah Monitoring]
    G --> R
    P --> R
```

## Flowmap Registrasi Vendor

```mermaid
flowchart TD
    A[Calon Vendor Isi Form Registrasi] --> B[Upload Dokumen Awal]
    B --> C[Data Masuk ke vendor_registrations]
    C --> D[Pemerintah Review]
    D -->|Approve| E[Buat Akun Vendor dan Data Vendor]
    E --> F[Dokumen Masuk ke Review Dokumen Vendor]
    D -->|Revision| G[Status Registrasi Menjadi revision]
    D -->|Reject| H[Status Registrasi Menjadi rejected]
```

## Flowmap Penyelesaian Distribusi Sekolah

```mermaid
flowchart TD
    A[Tiket Distribusi Aktif] --> B[Sekolah Buka Dashboard Distribusi]
    B --> C{Status Sudah TIBA?}
    C -->|Belum| D[Sekolah Hanya Memantau Status]
    C -->|Ya| E[Isi Catatan Penyelesaian]
    E --> F[Upload Foto Bukti Opsional]
    F --> G[Simpan Konfirmasi]
    G --> H[Status Distribusi Menjadi SELESAI]
    H --> I[Riwayat Konfirmasi Tersimpan]
```

## Catatan untuk Flowmap Final

- Flowmap utama yang paling aman untuk presentasi adalah:
  `Vendor -> Ahli Gizi -> Produksi -> Distribusi -> Sekolah -> Pemerintah`
- Jika dosen meminta flowmap per aktor, pisahkan menjadi:
  vendor flow, ahli gizi flow, sekolah flow, dan pemerintah flow.
- Status `revision` pada registrasi vendor memang ada di backend, tetapi tindak lanjut revisi tidak dibangun sebagai portal self-service terpisah pada implementasi saat ini.
