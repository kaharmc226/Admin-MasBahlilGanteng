import React, { useState, useEffect } from 'react'
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
import api from '../data/../api'
import DashboardLayout from '../components/DashboardLayout'

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
    <motion.div 
      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
      style={{ overflow: 'hidden', marginBottom: '2rem' }}
    >
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', width: '100%', border: '1.5px solid var(--border)' }}>
         <h2 style={{ marginBottom: '2.5rem', fontWeight: '950', fontSize: '2rem', letterSpacing: '-1px' }}>Tambah {isVendor ? 'Vendor' : isMapping ? 'Sekolah' : 'Target'}</h2>
         <div style={{ display: 'grid', gap: '1.5rem' }}>
            {getFields()}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
               <button onClick={onClose} style={{ flex: 1, padding: '1.2rem', borderRadius: '50px', border: '2px solid var(--border)', background: 'transparent', color: 'var(--text-main)', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer' }}>Batal</button>
               <button onClick={handleSave} className="btn-primary" style={{ flex: 1, borderRadius: '50px', border: 'none', color: 'white', fontWeight: '900', background: 'var(--primary)', cursor: 'pointer' }}>
                 {isSaving ? 'Menyimpan...' : 'Simpan Data'}
               </button>
            </div>
         </div>
      </div>
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

  // API-driven state
  const [activeVendors, setActiveVendors] = useState([])
  const [regQueue, setRegQueue] = useState([])
  const [wilayahData, setWilayahData] = useState([])
  const [alerts, setAlerts] = useState([])
  const [mappingData, setMappingData] = useState([])
  const [sekolahList, setSekolahList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [v, w, a, m, s] = await Promise.all([
          api.getVendors(),
          api.getWilayah(),
          api.getAlerts(),
          api.getMapping(),
          api.getSekolah()
        ])
        setActiveVendors(v.filter(x => x.status_verifikasi === 'approved'))
        setRegQueue(v.filter(x => x.status_verifikasi === 'pending'))
        setWilayahData(w)
        setAlerts(a)
        setMappingData(m)
        setSekolahList(s)
      } catch (err) { console.error('Failed to fetch:', err) }
    }
    fetchData()
  }, [])

  const handleApproveVendor = async (vendor) => {
    const isConfirm = window.confirm(`Sahkan ${vendor.nama_vendor} sebagai Vendor MBG Resmi?`);
    if (isConfirm) {
      try {
        await api.updateVendor(vendor.id_vendor, { ...vendor, status_verifikasi: 'approved' })
        setActiveVendors(prev => [{ ...vendor, status_verifikasi: 'approved' }, ...prev])
        setRegQueue(prev => prev.filter(v => v.id_vendor !== vendor.id_vendor))
        triggerToast(`${vendor.nama_vendor} telah resmi disahkan oleh Pemerintah!`)
      } catch (err) { console.error(err) }
    }
  }

  // Chart data derived from wilayah
  const wilayahKeys = ['tk', 'kb', 'sd', 'smp', 'sma', 'smk', 'slb'];
  const genderData = wilayahKeys.map(key => {
    const total = wilayahData.reduce((sum, w) => sum + (w[`${key}_jml`] || 0), 0)
    return { name: key.toUpperCase(), LakiLaki: Math.round(total * 0.51), Perempuan: Math.round(total * 0.49) }
  })

  const characteristicData = wilayahKeys.map(key => {
    const total = wilayahData.reduce((sum, w) => sum + (w[`${key}_jml`] || 0), 0)
    return { name: key.toUpperCase(), Alergi: Math.round(total * 0.05), Fobia: Math.round(total * 0.01), Intoleran: Math.round(total * 0.02) }
  })

  const renderContent = () => {
    if (isVendor) return (
      <div className="grid">
        <Header title="Audit Vendor Nasional" subtitle="Verifikasi izin usaha dan standar operasional MBG." showAdd onAdd={() => setShowAddForm(true)} isVendor={isVendor} />
        <AnimatePresence>
          {showAddForm && (
            <AddFormModal 
              onClose={() => setShowAddForm(false)} 
              onSave={handleModalSave}
              isVendor={isVendor} 
            />
          )}
        </AnimatePresence>
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
        <AnimatePresence>
          {showAddForm && (
            <AddFormModal 
              onClose={() => setShowAddForm(false)} 
              onSave={handleModalSave}
              isMapping={isMapping} 
            />
          )}
        </AnimatePresence>
        <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
          <div className="card" style={{ borderRadius: '32px', background: 'white', padding: '2.5rem' }}>
             <h3 style={{ marginBottom: '2rem', fontWeight: '900' }}>Daftar Mapping Aktif</h3>
             <div style={{ display: 'grid', gap: '1rem' }}>
               {mappingData.map((m, i) => {
                 return (
                   <div key={i} style={{ padding: '1.5rem', background: 'var(--bg)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                         <div style={{ background: 'white', padding: '10px', borderRadius: '12px' }}><ChefHat color="var(--primary)" size={18} /></div>
                         <div>
                            <p style={{ fontWeight: '800' }}>Dapur Vendor</p>
                         </div>
                      </div>
                      <Link2 color="var(--text-muted)" />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', textAlign: 'right' }}>
                         <div>
                            <p style={{ fontWeight: '800' }}>Sekolah</p>
                         </div>
                         <div style={{ background: 'white', padding: '10px', borderRadius: '12px' }}><Users color="var(--carrot)" size={18} /></div>
                      </div>
                   </div>
                 )
               })}
             </div>
          </div>
        </div>
      </div>
    )

    const chartData = [
      { jenjang: 'PAUD', penerima: 1500, kondisi_khusus: 45 },
      { jenjang: 'SD', penerima: 4200, kondisi_khusus: 120 },
      { jenjang: 'SMP', penerima: 2800, kondisi_khusus: 85 },
      { jenjang: 'SMA/SMK', penerima: 2100, kondisi_khusus: 50 },
      { jenjang: 'SLB', penerima: 800, kondisi_khusus: 800 }
    ]

    if (isStatistik) return (
      <div className="grid">
        <Header title="Laporan & Statistik" subtitle="Analisis pertumbuhan dan efektivitas distribusi gizi." />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '2.5rem' }}>
          <div className="card" style={{ padding: '2.5rem', borderRadius: '40px', background: 'white' }}>
             <h3 style={{ fontWeight: '900', marginBottom: '2rem' }}>Penerima Manfaat per Jenjang</h3>
             <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
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
                <AreaChart data={chartData}>
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
          {alerts.map((a, i) => (
            <div key={i} className="card" style={{ padding: '2rem', borderRadius: '30px', display: 'flex', gap: '25px', alignItems: 'center', background: 'white' }}>
              <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: '20px' }}><AlertTriangle color="#EF4444" /></div>
              <div style={{ flex: 1 }}>
                <div className="flex justify-between" style={{ marginBottom: '5px' }}>
                  <h4 style={{ fontWeight: '900', fontSize: '1.2rem' }}>{a.title}</h4>
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
      </motion.div>
    )
    
    return (
      <div style={{ textAlign: 'center', padding: '5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-muted)' }}>Silahkan Pilih Menu di Samping</h2>
      </div>
    )
  }

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <AnimatePresence>
        {showToast.show && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }} 
            animate={{ opacity: 1, y: 20, x: '-50%' }} 
            exit={{ opacity: 0, y: -50, x: '-50%' }} 
            style={{ 
              position: 'fixed', top: 0, left: '50%', zIndex: 3000, 
              background: 'var(--role-primary)', 
              color: 'white', padding: '0.9rem 2rem', borderRadius: '50px', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '10px' 
            }}
          >
            <ShieldCheck size={20} />
            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{showToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {renderContent()}
    </DashboardLayout>
  )
}

export default PemerintahDashboard
