export const mockData = {
  // 1️⃣ Summary Nasional - MATCHING PORTAL KEMENDIKDASMEN 100%
  summary_nasional: [
    { jenjang: 'PAUD', satuan: 4977, negeri: 298, swasta: 4679, penerima: 173950, kondisi_khusus: 7934 },
    { jenjang: 'SD', satuan: 7071, negeri: 6476, swasta: 595, penerima: 1149494, kondisi_khusus: 31920 },
    { jenjang: 'SMP', satuan: 2037, negeri: 1448, swasta: 589, penerima: 798178, kondisi_khusus: 28877 },
    { jenjang: 'SMA', satuan: 726, negeri: 544, swasta: 182, penerima: 272100, kondisi_khusus: 17339 },
    { jenjang: 'SMK', satuan: 536, negeri: 224, swasta: 312, penerima: 220454, kondisi_khusus: 6115 },
    { jenjang: 'SLB', satuan: 99, negeri: 48, swasta: 51, penerima: 8628, kondisi_khusus: 243 },
    { jenjang: 'PKBM', satuan: 14, negeri: 0, swasta: 14, penerima: 2260, kondisi_khusus: 481 },
    { jenjang: 'SKB', satuan: 10, negeri: 10, swasta: 0, penerima: 6842, kondisi_khusus: 10 }
  ],

  // 2️⃣ Wilayah (38 Provinsi - Sabang sampai Merauke)
  provinces: [
    'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi', 'Bengkulu', 'Sumatera Selatan', 
    'Kepulauan Bangka Belitung', 'Lampung', 'Banten', 'Jawa Barat', 'DKI Jakarta', 'Jawa Tengah', 'DI Yogyakarta', 
    'Jawa Timur', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat', 'Kalimantan Tengah', 
    'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara', 'Gorontalo', 'Sulawesi Tengah', 
    'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara', 'Maluku', 'Maluku Utara', 'Papua Barat', 'Papua', 
    'Papua Tengah', 'Papua Pegunungan', 'Papua Selatan', 'Papua Barat Daya'
  ],

  // 3️⃣ Users
  users: [
    { id_user: 1, nama: 'Vendor Jakarta Timur', email: 'v.jaktim@traksi.id', role: 'vendor', status: 'active' },
    { id_user: 2, nama: 'Gov DKI Jakarta', email: 'gov.dki@traksi.id', role: 'pemerintah', status: 'active' },
    { id_user: 3, nama: 'Ahli Gizi Jakarta Timur', email: 'nutri.jaktim@traksi.id', role: 'ahli_gizi', status: 'active' },
    { id_user: 4, nama: 'Admin SDN 06 Baru', email: 'sdn06@sekolah.traksi.id', role: 'sekolah', status: 'active' }
  ],

  // 4️⃣ Sekolah (Sabang sampai Merauke)
  sekolah: [
    { id_sekolah: 3, id: 3, nama_sekolah: 'SDN 06 Baru', alamat: 'Kec. Pasar Rebo, Jaktim', jenjang: 'SD', jumlah_siswa: 404, kondisi_khusus: { alergi: 12, intoleran: 4 } },
    { id_sekolah: 1, id: 1, nama_sekolah: 'SDN 1 Banda Aceh', alamat: 'Banda Aceh, Aceh', jenjang: 'SD', jumlah_siswa: 350, kondisi_khusus: { alergi: 5, intoleran: 2 } },
    { id_sekolah: 2, id: 2, nama_sekolah: 'SMPN 1 Sabang', alamat: 'Sabang, Aceh', jenjang: 'SMP', jumlah_siswa: 420, kondisi_khusus: { alergi: 8, intoleran: 3 } },
    { id_sekolah: 4, id: 4, nama_sekolah: 'SMPN 217 Jakarta', alamat: 'Kec. Pasar Rebo, Jaktim', jenjang: 'SMP', jumlah_siswa: 713, kondisi_khusus: { alergi: 18, intoleran: 6 } },
    { id_sekolah: 14, id: 14, nama_sekolah: 'SDN 1 Jayapura', alamat: 'Jayapura, Papua', jenjang: 'SD', jumlah_siswa: 320, kondisi_khusus: { alergi: 5, intoleran: 2 } },
    { id_sekolah: 15, id: 15, nama_sekolah: 'SMPN 1 Merauke', alamat: 'Merauke, Papua Selatan', jenjang: 'SMP', jumlah_siswa: 550, kondisi_khusus: { alergi: 10, intoleran: 4 } }
  ],

  // 5️⃣ Vendors
  vendors: [
    { id_vendor: 1, nama_vendor: 'Dapur Sehat Nusantara', region: 'DKI Jakarta', status_verifikasi: 'approved', izin_usaha: 'B-992/MBG/2026' }
  ],

  // 6️⃣ Dapurs
  dapurs: [
    { id: 1, id_vendor: 1, lokasi: 'Jakarta Timur', kapasitas_produksi: 5000, kapasitas_production: 5000 }
  ],

  // 7️⃣ Mappings
  mappings: [
    { id_mapping: 1, id_dapur: 1, id_sekolah: 3, schoolName: 'SDN 06 Baru' }
  ],

  // 8️⃣ Menus
  menus: [
    { 
      id: 101, 
      id_vendor: 1, 
      nama_menu: 'Nasi Kuning Gizi + Ayam Fillet', 
      komposisi: 'Beras kuning, Ayam fillet, Telur, Kacang panjang', 
      nilai_gizi: { calories: 520, protein: '28', fat: '15' },
      status_validasi: 'approved',
      date: '2026-03-16'
    }
  ],

  // 9️⃣ Produksi
  production: [
    { id_produksi: 1, id: 101, id_dapur: 1, id_menu: 101, status: 'siap_kirim', update_time: '10:30 WIB' }
  ],

  // 🔟 Distribusi
  distribution: [
     { id: 'TX-001', id_produksi: 1, id_sekolah: 3, waktu_kirim: '11:00 WIB', jumlah_porsi: 404, hash: '0xabc123', status: 'DISTRIBUSI', delivery_time: '11:00 WIB' }
  ]
};

// Aliases for compatibility with different dashboard naming conventions
mockData.schools = mockData.sekolah;
mockData.sekolah_list = mockData.sekolah;
mockData.dapur = mockData.dapurs;
