# Context Diagram

## Konsep

Context diagram menempatkan TRAKSI sebagai satu proses besar, lalu menunjukkan hubungan data dengan entitas luar.

## Entitas Eksternal

- Vendor
- Ahli Gizi
- Sekolah
- Pemerintah

## Draft Context Diagram

```mermaid
flowchart LR
    V[Vendor]
    A[Ahli Gizi]
    S[Sekolah]
    P[Pemerintah]
    T((Sistem TRAKSI))

    V -->|Data dapur, stok, menu, produksi, distribusi, dokumen| T
    T -->|Status menu, status produksi, data distribusi, status dokumen| V

    A -->|Validasi menu, standar gizi, data nutrisi, review bahan| T
    T -->|Daftar menu, data nutrisi, laporan review| A

    S -->|Konfirmasi kedatangan, feedback, laporan kendala| T
    T -->|Data distribusi, status pengiriman, riwayat penerimaan| S

    P -->|Persetujuan vendor, mapping, pengelolaan alert| T
    T -->|Statistik, monitoring vendor, data sekolah, alert operasional| P
```

## Narasi Context Diagram

- Vendor mengirimkan data operasional ke sistem dan menerima status operasional.
- Ahli gizi berinteraksi dengan sistem untuk validasi menu dan pengelolaan standar gizi.
- Sekolah menerima data distribusi dari sistem dan mengirimkan bukti penerimaan serta feedback.
- Pemerintah menggunakan sistem untuk monitoring, validasi administratif, dan pengawasan distribusi.
