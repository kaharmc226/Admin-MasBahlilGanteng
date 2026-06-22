# Data Flow Diagram

## DFD Level 0

```mermaid
flowchart LR
    V[Vendor]
    A[Ahli Gizi]
    S[Sekolah]
    P[Pemerintah]
    T((0. TRAKSI))

    V --> T
    A --> T
    S --> T
    P --> T
    T --> V
    T --> A
    T --> S
    T --> P
```

## DFD Level 1

```mermaid
flowchart TD
    V[Vendor]
    A[Ahli Gizi]
    S[Sekolah]
    P[Pemerintah]

    P1((1.0 Kelola Vendor dan Dapur))
    P2((2.0 Kelola Menu dan Validasi))
    P3((3.0 Kelola Produksi dan Distribusi))
    P4((4.0 Kelola Konfirmasi dan Feedback))
    P5((5.0 Monitoring Pemerintah))

    D1[(Data Vendor)]
    D2[(Data Dapur dan Stok)]
    D3[(Data Menu)]
    D4[(Standar Gizi dan Nutrisi)]
    D5[(Data Produksi)]
    D6[(Data Distribusi)]
    D7[(Konfirmasi dan Feedback)]
    D8[(Alert dan Statistik)]
    D9[(Data Sekolah dan Mapping)]

    V --> P1
    V --> P2
    V --> P3

    A --> P2
    S --> P4
    P --> P5

    P1 --> D1
    P1 --> D2
    P1 --> D9

    P2 --> D3
    P2 --> D4

    P3 --> D5
    P3 --> D6
    P3 --> D2

    P4 --> D7
    P4 --> D6

    P5 --> D1
    P5 --> D6
    P5 --> D7
    P5 --> D8
    P5 --> D9

    D3 --> P2
    D4 --> P2
    D6 --> P4
    D1 --> P5
    D6 --> P5
    D7 --> P5
    D8 --> P5
    D9 --> P5
```

## Penjelasan Proses

### 1.0 Kelola Vendor dan Dapur

- Mengelola data vendor
- Mengelola registrasi vendor
- Mengelola dapur
- Mengelola stok
- Mengelola dokumen vendor

### 2.0 Kelola Menu dan Validasi

- Vendor membuat menu
- Ahli gizi memvalidasi menu
- Ahli gizi mengelola standar gizi
- Ahli gizi mengelola database nutrisi

### 3.0 Kelola Produksi dan Distribusi

- Vendor membuat batch produksi
- Sistem memperbarui status produksi
- Sistem mengelola distribusi ke sekolah

### 4.0 Kelola Konfirmasi dan Feedback

- Sekolah mengonfirmasi makanan yang tiba
- Sekolah mengirim feedback
- Sekolah mengirim alert kendala

### 5.0 Monitoring Pemerintah

- Pemerintah memantau vendor, sekolah, mapping, statistik, dan alert

## Saran DFD untuk Laporan

- Untuk laporan akademik, ubah nama data store menjadi kode formal seperti:
  `D1 Users`, `D2 Vendors`, `D3 Menus`, dan seterusnya.
- Jika diminta lebih detail, buat DFD Level 2 untuk:
  proses validasi menu, proses produksi, dan proses konfirmasi sekolah.
