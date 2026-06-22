# UML Use Case

## Aktor

- Vendor
- Ahli Gizi
- Sekolah
- Pemerintah

## Daftar Use Case per Aktor

### Vendor

- Login
- Kelola dapur
- Kelola stok bahan
- Lihat histori stok
- Kelola menu
- Upload foto menu
- Kelola dokumen vendor
- Upload dokumen vendor
- Buat produksi
- Ubah status produksi
- Kelola distribusi
- Lihat status validasi menu

### Ahli Gizi

- Login
- Lihat daftar menu
- Validasi menu
- Tulis catatan validasi
- Kelola standar gizi
- Kelola database nutrisi
- Tinjau permintaan bahan
- Generate laporan review

### Sekolah

- Login
- Lihat distribusi
- Konfirmasi kedatangan
- Upload bukti foto
- Kirim feedback
- Laporkan kendala
- Lihat riwayat konfirmasi

### Pemerintah

- Login
- Review registrasi vendor
- Approve/revisi/tolak vendor
- Audit vendor
- Audit dokumen vendor
- Suspend atau aktifkan vendor
- Kelola mapping dapur-sekolah
- Kelola sekolah
- Lihat statistik
- Kelola alert

## Draft Use Case Diagram

```mermaid
flowchart LR
    V[Vendor]
    A[Ahli Gizi]
    S[Sekolah]
    P[Pemerintah]

    UC1((Login))
    UC2((Kelola Dapur dan Stok))
    UC3((Kelola Menu))
    UC4((Kelola Produksi dan Distribusi))
    UC5((Kelola Dokumen Vendor))
    UC6((Validasi Menu))
    UC7((Kelola Standar Gizi))
    UC8((Kelola Database Nutrisi))
    UC9((Konfirmasi Kedatangan))
    UC10((Kirim Feedback))
    UC11((Lapor Kendala))
    UC12((Review Registrasi Vendor))
    UC13((Audit Vendor dan Dokumen))
    UC14((Kelola Mapping dan Sekolah))
    UC15((Lihat Statistik dan Alert))

    V --> UC1
    V --> UC2
    V --> UC3
    V --> UC4
    V --> UC5

    A --> UC1
    A --> UC6
    A --> UC7
    A --> UC8

    S --> UC1
    S --> UC9
    S --> UC10
    S --> UC11

    P --> UC1
    P --> UC12
    P --> UC13
    P --> UC14
    P --> UC15
```

## Saran UML Lanjutan

- Jika Anda juga perlu class diagram, lanjutkan dari file `08-entity-reference.md`.
- Jika dosen meminta activity diagram, use case berikut paling cocok:
  validasi menu, proses distribusi, dan konfirmasi kedatangan.
