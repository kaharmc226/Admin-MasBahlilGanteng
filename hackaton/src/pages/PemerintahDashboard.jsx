import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  Building, 
  ChefHat, 
  Users, 
  Truck, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  BarChart as BarChartIcon, 
  Activity,
  ArrowUpRight,
  Map as MapIcon,
  BadgeAlert,
  Zap,
  Globe,
  Fingerprint,
  PieChart as PieChartIcon,
  MapPin,
  Lock,
  ChevronRight,
  Filter,
  Download,
  Apple,
  Carrot,
  Leaf,
  Link2,
  Plus,
  Search,
  FileText,
  X
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { mockData } from '../data/mockData'
import Sidebar from '../components/Sidebar'

// --- Sub-components (Moved Outside) ---

const Motif = ({ icon: Icon, top, right, bottom, left, color }) => (
  <div style={{ position: 'absolute', top, right, bottom, left, opacity: 0.04, pointerEvents: 'none', zIndex: 0 }}>
    <Icon size={120} color={color} />
  </div>
)

const Header = ({ title, subtitle, showAdd = false, onAdd, isVendor, isMapping }) => (
  <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
    <div>
      <h1 style={{ fontSize: '2.8rem', fontWeight: '950', letterSpacing: '-2px' }}>{title}</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: '600' }}>{subtitle}</p>
    </div>
    {showAdd && (
      <button onClick={onAdd} className="btn-primary" style={{ padding: '1rem 2rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', color: 'white', fontWeight: '800' }}>
        <Plus size={20} /> Tambah {isVendor ? 'Vendor' : isMapping ? 'Sekolah' : 'Target'}
      </button>
    )}
  </div>
)

const AddFormModal = ({ onClose, onSave, isVendor, isMapping }) => {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      onSave(isVendor ? 'Vendor' : isMapping ? 'Sekolah' : 'Target')
    }, 1200)
  }

  const getFields = () => {
    if (isVendor) return (
      <>
        <div>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Nama Vendor</label>
          <input placeholder="Contoh: PT. Pangan Sejahtera" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Nomor Izin Usaha</label>
          <input placeholder="B-9988/2026/MBG" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Wilayah Operasional</label>
          <input placeholder="Contoh: Jakarta Selatan" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }} />
        </div>
      </>
    )
    if (isMapping) return (
      <>
        <div>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Nama Sekolah Baru</label>
          <input placeholder="Contoh: SDN 05 Menteng" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Jumlah Siswa</label>
          <input type="number" placeholder="450" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Alamat Lengkap</label>
          <textarea placeholder="Jl. Merdeka No. 10..." style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)', height: '80px' }} />
        </div>
      </>
    )
    return (
      <div>
        <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Input Target Capex/Opex</label>
        <input placeholder="Masukkan nilai anggaran..." style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }} />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'grid', placeItems: 'center', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="card" style={{ width: '90%', maxWidth: '550px', padding: '3.5rem', borderRadius: '45px', position: 'relative' }}>
         <button onClick={onClose} style={{ position: 'absolute', top: '25px', right: '25px', background: 'var(--bg)', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><X size={20}/></button>
         <h2 style={{ marginBottom: '2.5rem', fontWeight: '950', fontSize: '2rem', letterSpacing: '-1px' }}>Tambah {isVendor ? 'Vendor' : isMapping ? 'Sekolah' : 'Target'}</h2>
         <div style={{ display: 'grid', gap: '1.5rem' }}>
            {getFields()}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
               <button onClick={onClose} className="btn-outline" style={{ flex: 1, borderRadius: '50px', padding: '1.2rem', fontWeight: '800' }}>Batal</button>
               <button onClick={handleSave} className="btn-primary" style={{ flex: 1, borderRadius: '50px', border: 'none', color: 'white', fontWeight: '900', background: 'linear-gradient(to right, var(--primary), var(--secondary))' }}>
                 {isSaving ? 'Menyimpan...' : 'Simpan Data'}
               </button>
            </div>
         </div>
      </motion.div>
    </motion.div>
  )
}

const PemerintahDashboard = ({ user, onLogout }) => {
  const location = useLocation()
  const [showAddForm, setShowAddForm] = useState(false)
  const [showToast, setShowToast] = useState({ show: false, message: '' })
  
  const triggerToast = (msg) => {
    setShowToast({ show: true, message: msg })
    setTimeout(() => setShowToast({ show: false, message: '' }), 3000)
  }

  const handleModalSave = (type) => {
    setShowAddForm(false)
    triggerToast(`Data ${type} baru berhasil ditambahkan!`)
  }

  const path = location.pathname.replace(/\/$/, '')
  const isMain = path === '/pemerintah'
  const isVendor = path === '/pemerintah/vendor'
  const isPeta = path === '/pemerintah/peta'
  const isMapping = path === '/pemerintah/mapping'
  const isStatistik = path === '/pemerintah/statistik'
  const isAlert = path === '/pemerintah/alert'

  // 1. Queue Pendaftaran dari LocalStorage (Simulasi Registrasi Baru)
  const [regQueue, setRegQueue] = useState(() => {
    return JSON.parse(localStorage.getItem('traksi_v_reg_queue') || '[]');
  });

  const [activeVendors, setActiveVendors] = useState(() => {
    const saved = localStorage.getItem('traksi_v_active_vendors');
    return saved ? JSON.parse(saved) : mockData.vendors;
  });

  const handleApproveVendor = (vendor) => {
    const isConfirm = window.confirm(`Sahkan ${vendor.nama_vendor} sebagai Vendor MBG Resmi?`);
    if (isConfirm) {
      const newActive = [ { ...vendor, status_verifikasi: 'approved' }, ...activeVendors ];
      setActiveVendors(newActive);
      localStorage.setItem('traksi_v_active_vendors', JSON.stringify(newActive));
      
      const newQueue = regQueue.filter(v => v.izin_usaha !== vendor.izin_usaha);
      setRegQueue(newQueue);
      localStorage.setItem('traksi_v_reg_queue', JSON.stringify(newQueue));
      
      triggerToast(`${vendor.nama_vendor} telah resmi disahkan oleh Pemerintah!`);
    }
  }

  // Data Matching Portal Screenshots (Adapted for new territory data)
  const wilayahKeys = ['tk', 'kb', 'tpa', 'sps', 'pkbm', 'skb', 'sd', 'smp', 'sma', 'smk', 'slb'];
  const genderData = wilayahKeys.map(key => ({
    name: key.toUpperCase(),
    LakiLaki: Math.round(mockData.wilayahTotals[key].jml * 0.51),
    Perempuan: Math.round(mockData.wilayahTotals[key].jml * 0.49)
  }))

  const characteristicData = wilayahKeys.map(key => ({
    name: key.toUpperCase(),
    Alergi: Math.round(mockData.wilayahTotals[key].jml * 0.05),
    Fobia: Math.round(mockData.wilayahTotals[key].jml * 0.01),
    Intoleran: Math.round(mockData.wilayahTotals[key].jml * 0.02)
  }))

  const renderContent = () => {
    if (isVendor) return (
      <div className="grid">
        <Header title="Audit Vendor Nasional" subtitle="Verifikasi izin usaha dan standar operasional MBG." showAdd onAdd={() => setShowAddForm(true)} isVendor={isVendor} />
        <div className="card dashboard-card-vibrant" style={{ borderRadius: '32px', padding: '2.5rem' }}>
          <h3 style={{ marginBottom: '2rem', fontWeight: '950', color: 'var(--primary)' }}>Menunggu Verifikasi (Queue)</h3>
          {regQueue.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '700', background: 'var(--bg)', borderRadius: '20px' }}>Tidak ada antrian pendaftaran vendor baru.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.8rem', marginBottom: '3rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '900' }}>
                  <th>NAMA VENDOR</th>
                  <th>IZIN REG</th>
                  <th>TANGGAL DAFTAR</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {regQueue.map((v, i) => (
                  <tr key={i} style={{ background: 'var(--bg)' }}>
                    <td style={{ padding: '1.5rem', fontWeight: '900', borderRadius: '20px 0 0 20px' }}>{v.nama_vendor}</td>
                    <td style={{ padding: '1.5rem', fontWeight: '700' }}>{v.izin_usaha}</td>
                    <td style={{ padding: '1.5rem', fontWeight: '700' }}>{v.date_pendaftaran}</td>
                    <td style={{ padding: '1.5rem' }}><span className="badge badge-warning" style={{ fontWeight: '900' }}>PENDING REVIEW</span></td>
                    <td style={{ padding: '1.5rem', borderRadius: '0 20px 20px 0' }}>
                       <button onClick={() => handleApproveVendor(v)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '15px', border: 'none', fontWeight: '900', color: 'white', cursor: 'pointer' }}>SAHKAN VENDOR</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h3 style={{ marginBottom: '2rem', fontWeight: '950', marginTop: '2rem' }}>Daftar Vendor Aktif</h3>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.8rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '900' }}>
                <th>NAMA VENDOR</th>
                <th>IZIN USAHA</th>
                <th>REGION</th>
                <th>STATUS AKUN</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {activeVendors.map((v, i) => (
                <tr key={i} style={{ background: 'var(--bg)' }}>
                  <td style={{ padding: '1.5rem', fontWeight: '900', borderRadius: '20px 0 0 20px' }}>{v.nama_vendor}</td>
                  <td style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: '700' }}>{v.izin_usaha}</td>
                  <td style={{ padding: '1.5rem', fontWeight: '700' }}>{v.region}</td>
                  <td style={{ padding: '1.5rem' }}>
                     <span className="badge" style={{ 
                       background: v.status_verifikasi === 'approved' ? 'var(--primary-light)' : 'var(--banana-light)',
                       color: v.status_verifikasi === 'approved' ? 'var(--primary)' : 'var(--banana)',
                       fontWeight: '900'
                     }}>
                       {v.status_verifikasi.toUpperCase()}
                     </span>
                  </td>
                  <td style={{ padding: '1.5rem', borderRadius: '0 20px 20px 0' }}>
                     <button onClick={() => triggerToast(`Memuat detail audit untuk ${v.nama_vendor}...`)} style={{ color: 'var(--primary)', background: 'var(--primary-light)', border: 'none', fontWeight: '900', padding: '8px 16px', borderRadius: '15px', cursor: 'pointer' }}>Detail Audit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )

    if (isMapping) return (
      <div className="grid">
        <Header title="Hubungkan Dapur ↔ Sekolah" subtitle="Tentukan cakupan wilayah pelayanan dapur ke institusi pendidikan." showAdd onAdd={() => setShowAddForm(true)} isMapping={isMapping} />
        <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
          <div className="card" style={{ borderRadius: '32px', background: 'white', padding: '2.5rem' }}>
             <h3 style={{ marginBottom: '2rem', fontWeight: '900' }}>Daftar Mapping Aktif</h3>
             <div style={{ display: 'grid', gap: '1rem' }}>
               {mockData.mappings.map((m, i) => {
                 const dapur = mockData.dapurs.find(d => d.id === m.id_dapur);
                 const school = mockData.sekolah.find(s => s.id_sekolah === m.id_sekolah);
                 return (
                   <div key={i} style={{ padding: '1.5rem', background: 'var(--bg)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                         <div style={{ background: 'white', padding: '10px', borderRadius: '12px' }}><ChefHat color="var(--primary)" size={18} /></div>
                         <div>
                            <p style={{ fontWeight: '800' }}>{dapur?.lokasi}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kapasitas: {dapur?.kapasitas_produksi}</p>
                         </div>
                      </div>
                      <Link2 color="var(--text-muted)" />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', textAlign: 'right' }}>
                         <div>
                            <p style={{ fontWeight: '800' }}>{school?.nama_sekolah}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{school?.jumlah_siswa} Siswa</p>
                         </div>
                         <div style={{ background: 'white', padding: '10px', borderRadius: '12px' }}><Users color="var(--carrot)" size={18} /></div>
                      </div>
                   </div>
                 )
               })}
             </div>
          </div>
          <div className="card" style={{ borderRadius: '32px', background: 'var(--primary-light)', borderColor: 'var(--primary)', padding: '2.5rem' }}>
             <h3 style={{ marginBottom: '1.5rem', fontWeight: '900' }}>Buat Hubungan Baru</h3>
             <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                   <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Pilih Dapur</label>
                   <select style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '1.5px solid var(--border)' }}>
                      {mockData.dapurs.map(d => <option key={d.id}>{d.lokasi} (Vendor {d.id_vendor})</option>)}
                   </select>
                </div>
                <div>
                   <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Pilih Sekolah</label>
                   <select style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '1.5px solid var(--border)' }}>
                      {mockData.sekolah.map(s => <option key={s.id_sekolah}>{s.nama_sekolah}</option>)}
                   </select>
                </div>
                <button onClick={() => triggerToast('Hubungan mapping dapur dan sekolah berhasil disahkan!')} className="btn-primary" style={{ padding: '1.2rem', borderRadius: '50px', border: 'none', color: 'white', fontWeight: '900', marginTop: '1rem', cursor: 'pointer' }}>Sahkan Hubungan Mapping</button>
             </div>
          </div>
        </div>
      </div>
    )

    if (isStatistik) return (
      <div className="grid">
        <Header title="Laporan & Statistik" subtitle="Analisis pertumbuhan dan efektivitas distribusi gizi." />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '2.5rem' }}>
          <div className="card" style={{ padding: '2.5rem', borderRadius: '40px', background: 'white' }}>
             <h3 style={{ fontWeight: '900', marginBottom: '2rem' }}>Penerima Manfaat per Jenjang</h3>
             <ResponsiveContainer width="100%" height={300}>
                <BarChart data={wilayahKeys.map(k => ({ jenjang: k.toUpperCase(), penerima: mockData.wilayahTotals[k].jml }))}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="jenjang" />
                   <YAxis />
                   <Tooltip />
                   <Bar dataKey="penerima" fill="var(--primary)" radius={[10,10,0,0]} />
                </BarChart>
             </ResponsiveContainer>
          </div>
          <div className="card" style={{ padding: '2.5rem', borderRadius: '40px', background: 'white' }}>
             <h3 style={{ fontWeight: '900', marginBottom: '2rem' }}>Audit Gizi (Kondisi Khusus)</h3>
             <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={wilayahKeys.map(k => ({ jenjang: k.toUpperCase(), kondisi_khusus: Math.round(mockData.wilayahTotals[k].jml * 0.08) }))}>
                   <XAxis dataKey="jenjang" />
                   <YAxis />
                   <Tooltip />
                   <Area type="monotone" dataKey="kondisi_khusus" stroke="#EF4444" fill="#FEE2E2" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    )

    if (isAlert) return (
      <div className="grid">
        <Header title="Sistem Alert & Log" subtitle="Deteksi dini kendala distribusi dan kualitas di lapangan." />
        <div className="grid" style={{ gap: '1.5rem' }}>
          {[
            { icon: <AlertTriangle color="#EF4444" />, title: 'Keterlambatan Dapur Jaktim', detail: 'SDN 06 Baru belum menerima drop 404 porsi hingga 12:30 WIB.', time: '10 Menit Lalu' },
            { icon: <BadgeAlert color="var(--carrot)" />, title: 'Keluhan Feedback Tinggi', detail: 'Vendor Dapur Nusantara mendapatkan rating rendah di area Pasar Rebo.', time: '1 Jam Lalu' },
            { icon: <ShieldCheck color="var(--primary)" />, title: 'Smart Contract Audit Valid', detail: 'Validasi harian gizi 12 sekolah Jakarta Timur telah diverifikasi di Blockchain.', time: '3 Jam Lalu' }
          ].map((a, i) => (
            <div key={i} className="card" style={{ padding: '2rem', borderRadius: '30px', display: 'flex', gap: '25px', alignItems: 'center', background: 'white' }}>
              <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: '20px' }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div className="flex justify-between" style={{ marginBottom: '5px' }}>
                  <h4 style={{ fontWeight: '900', fontSize: '1.2rem' }}>{a.title}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>{a.time}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{a.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )

    if (isPeta) return (
      <div className="grid">
        <Header title="Peta Distribusi Real-time" subtitle="Visualisasi sebaran dapur dan sekolah di seluruh Nusantara." />
        <div className="card" style={{ height: '600px', background: 'var(--bg)', borderRadius: '40px', display: 'grid', placeItems: 'center', position: 'relative' }}>
           <Globe size={100} color="var(--primary)" style={{ opacity: 0.1 }} />
           <p style={{ color: 'var(--text-muted)', fontWeight: '700' }}>Live Map Monitoring (Sabang s/d Merauke)...</p>
           {mockData.sekolah.slice(0, 5).map((s, i) => (
             <motion.div key={i} animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }} style={{ 
               position: 'absolute', 
               top: `${20 + i * 15}%`, 
               left: `${10 + i * 15}%`, 
               width: '12px', height: '12px', 
               background: i % 2 === 0 ? 'var(--primary)' : 'var(--carrot)', 
               borderRadius: '50%', 
               boxShadow: '0 0 15px rgba(0,0,0,0.1)' 
             }} />
           ))}
        </div>
      </div>
    )

    if (isMain) return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1 }}>
        <Header title="Monitoring Gizi Nasional" subtitle="Portal Transparansi Program Makan Bergizi Gratis (MBG)." />
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
           <div className="badge" style={{ background: '#064E3B', color: '#34D399', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
             <Fingerprint size={16} /> Admin Autentikasi MFA Aktif
           </div>
           <div className="badge" style={{ background: '#1E3A8A', color: '#93C5FD', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
             <Lock size={16} /> AES-256 Terenkripsi E2E
           </div>
           <div className="badge" style={{ background: '#701A75', color: '#F0ABFC', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
             <Globe size={16} /> Jaringan Blockchain Tersinkron
           </div>
        </div>

        {/* 1. Portal Summary Table (Matching Official UI) */}
        <div className="card" style={{ borderRadius: '40px', padding: '2.5rem', marginBottom: '3rem', overflow: 'hidden' }}>
          <h3 style={{ marginBottom: '2rem', fontWeight: '950', fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText color="var(--primary)" /> Rekapitulasi Nasional Satuan Pendidikan 2026
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: '1500px', width: '100%', borderCollapse: 'collapse', borderRadius: '15px', overflow: 'hidden', textAlign: 'center' }}>
              <thead>
                <tr style={{ background: '#22D3EE', color: 'white' }}>
                  <th rowSpan={2} style={{ padding: '1rem', fontWeight: '900', borderRight: '1px solid rgba(255,255,255,0.2)' }}>No</th>
                  <th rowSpan={2} style={{ padding: '1rem', fontWeight: '900', borderRight: '1px solid rgba(255,255,255,0.2)', textAlign: 'left' }}>Wilayah</th>
                  {['Total', 'TK', 'KB', 'TPA', 'SPS', 'PKBM', 'SKB', 'SD', 'SMP', 'SMA', 'SMK', 'SLB'].map((col, idx) => (
                    <th key={idx} colSpan={3} style={{ padding: '0.8rem', fontWeight: '900', borderRight: '1px solid rgba(255,255,255,0.2)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>{col}</th>
                  ))}
                </tr>
                <tr style={{ background: '#06B6D4', color: 'white', fontSize: '0.8rem' }}>
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <React.Fragment key={idx}>
                      <th style={{ padding: '0.5rem', fontWeight: '800', borderRight: '1px solid rgba(255,255,255,0.2)' }}>Jml</th>
                      <th style={{ padding: '0.5rem', fontWeight: '800', borderRight: '1px solid rgba(255,255,255,0.2)' }}>N</th>
                      <th style={{ padding: '0.5rem', fontWeight: '800', borderRight: '1px solid rgba(255,255,255,0.2)' }}>S</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockData.wilayahData.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #E5E7EB', fontWeight: '700', color: '#4B5563', fontSize: '0.85rem' }}>
                    <td style={{ padding: '0.8rem' }}>{i + 1}</td>
                    <td style={{ padding: '0.8rem', textAlign: 'left', fontWeight: '800', color: 'var(--text-main)' }}>{row.wilayah}</td>
                    {['total', 'tk', 'kb', 'tpa', 'sps', 'pkbm', 'skb', 'sd', 'smp', 'sma', 'smk', 'slb'].map((k, idx) => (
                      <React.Fragment key={idx}>
                        <td style={{ padding: '0.8rem', background: '#F9FAFB' }}>{row[k].jml}</td>
                        <td style={{ padding: '0.8rem' }}>{row[k].n}</td>
                        <td style={{ padding: '0.8rem' }}>{row[k].s}</td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
                {/* Total Row */}
                <tr style={{ background: '#ECFEFF', fontWeight: '950', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                  <td colSpan={2} style={{ padding: '1rem', textAlign: 'center' }}>TOTAL</td>
                  {['total', 'tk', 'kb', 'tpa', 'sps', 'pkbm', 'skb', 'sd', 'smp', 'sma', 'smk', 'slb'].map((k, idx) => (
                    <React.Fragment key={idx}>
                      <td style={{ padding: '1rem', color: 'var(--primary)', background: 'rgba(34,211,238,0.1)' }}>{mockData.wilayahTotals[k].jml}</td>
                      <td style={{ padding: '1rem' }}>{mockData.wilayahTotals[k].n}</td>
                      <td style={{ padding: '1rem' }}>{mockData.wilayahTotals[k].s}</td>
                    </React.Fragment>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Characteristics Graphs (Matching Official UI) */}
        <div style={{ background: '#059669', padding: '1rem 2rem', borderRadius: '15px 15px 0 0', color: 'white', fontWeight: '800' }}>
            Karakteristik Peserta Didik
        </div>
        <div className="card" style={{ borderRadius: '0 0 40px 40px', padding: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', background: '#ECFDF5', border: 'none' }}>
            
            {/* Gender Chart */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
               <h4 style={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: '900', color: 'var(--text-muted)' }}>Grafik Jenis Kelamin</h4>
               <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={genderData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#F3F4F6'}} />
                    <Legend iconType="rect" align="center" />
                    <Bar dataKey="LakiLaki" name="LAKI-LAKI" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Perempuan" name="PEREMPUAN" fill="#EC4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>

            {/* Health Characteristic Chart */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
               <h4 style={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: '900', color: 'var(--text-muted)' }}>Grafik Karakteristik Kesehatan</h4>
               <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={characteristicData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#F3F4F6'}} />
                    <Legend iconType="circle" />
                    <Bar dataKey="Alergi" name="ALERGI" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Fobia" name="FOBIA" fill="#22D3EE" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Intoleran" name="INTOLERAN" fill="#E11D48" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>

        </div>
      </motion.div>
    )
    
    return (
      <div style={{ textAlign: 'center', padding: '5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-muted)' }}>Silahkan Pilih Menu di Samping</h2>
      </div>
    )
  }

  return (
    <div className="layout-wrapper premium-mesh mesh-pemerintah">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="main-content" style={{ position: 'relative', zIndex: 1, padding: '3rem' }}>
        <Motif icon={Apple} top="50px" right="50px" color="var(--primary)" />
        <Motif icon={Carrot} bottom="100px" left="50px" color="var(--carrot)" />
      <AnimatePresence>
        {showToast.show && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }} 
            animate={{ opacity: 1, y: 20, x: '-50%' }} 
            exit={{ opacity: 0, y: -50, x: '-50%' }} 
            style={{ 
              position: 'fixed', top: 0, left: '50%', zIndex: 3000, 
              background: 'var(--primary)', 
              color: 'white', padding: '1.2rem 2.5rem', borderRadius: '50px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '15px' 
            }}
          >
            <ShieldCheck size={24} />
            <span style={{ fontWeight: '900' }}>{showToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddForm && (
          <AddFormModal 
            onClose={() => setShowAddForm(false)} 
            onSave={handleModalSave}
            isVendor={isVendor} 
            isMapping={isMapping} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div 
          key={location.pathname}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
  )
}

export default PemerintahDashboard
