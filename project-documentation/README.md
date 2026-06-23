# Project Documentation

Folder ini disiapkan sebagai tempat dokumentasi analisis untuk proyek TRAKSI.

## Isi Folder

- `01-project-summary.md`
  Ringkasan website, tujuan sistem, arsitektur, route, dan aktor utama.
- `02-feature-inventory.md`
  Daftar fitur yang terlihat dari frontend, backend, dan database.
- `03-flowmap.md`
  Flowmap proses bisnis utama dari vendor sampai sekolah dan pemerintah.
- `04-context-diagram.md`
  Draft context diagram level sistem.
- `05-data-flow-diagram.md`
  Draft DFD level 0 dan level 1.
- `06-uml-use-case.md`
  Use case utama per aktor.
- `07-ui-wireframe-notes.md`
  Catatan halaman, struktur UI, dan prioritas wireframe.
- `08-entity-reference.md`
  Entitas data utama untuk UML class diagram atau ERD lanjutan.

## Cara Pakai

1. Gunakan `01-project-summary.md` untuk deskripsi umum proyek.
2. Gunakan `02-feature-inventory.md` saat menyusun bab fitur sistem.
3. Gunakan `03` sampai `06` sebagai dasar diagram di draw.io, Figma, Visio, atau Mermaid.
4. Gunakan `07-ui-wireframe-notes.md` saat membuat wireframe per role.
5. Gunakan `08-entity-reference.md` untuk menurunkan ERD, class diagram, atau data dictionary.

## Catatan

- Isi dokumen ini disusun dari kode yang ada di `src/`, `server/`, `database/`, dan `README.md`.
- Dokumen dalam folder ini bersifat implementation-first dan mengikuti perilaku kode yang benar-benar ada.
- Beberapa istilah visual seperti "blockchain", "AES-256", "MFA", "microservices", atau "AI" muncul di copy UI untuk kebutuhan demo/presentasi.
- Istilah-istilah tersebut tidak boleh langsung dianggap sebagai arsitektur backend atau kontrol keamanan yang sudah terimplementasi penuh kecuali ada bukti eksplisit di kode server, konfigurasi, atau infrastruktur proyek.
