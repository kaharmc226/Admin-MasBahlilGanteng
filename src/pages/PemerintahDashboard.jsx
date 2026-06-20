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
  <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
    <div>
      <h1 style={{ fontSize: '2.8rem', fontWeight: '950', letterSpacing: '-2px' }}>{title}</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: '600' }}>{subtitle}</p>
    </div>
    {showAdd && (
      <button onClick={onAdd} className="btn-primary" style={{ padding: '1rem 2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', color: 'white', fontWeight: '800' }}>
        <Plus size={20} /> Tambah {isVendor ? 'Vendor' : isMapping ? 'Sekolah' : 'Target'}
      </button>
    )}
  </div>
)

const AddFormModal = ({ onClose, onSave, isVendor, isMapping }) => {
  const [isSaving, setIsSaving] = useState(false)
  const [fields, setFields] = useState({
    nama_vendor: '',
    region: '',
    izin_usaha: '',
    nama_sekolah: '',
    jumlah_siswa: '',
    alamat: ''
  })

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      onSave(isVendor ? 'Vendor' : isMapping ? 'Sekolah' : 'Target', fields)
    }, 1200)
  }

  const getFields = () => {
    if (isVendor) return (
      <>
        <div>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>NAMA VENDOR</label>
          <input required value={fields.nama_vendor} onChange={(e) => setFields({ ...fields, nama_vendor: e.target.value })} placeholder="Contoh: PT. Pangan Sejahtera" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>NOMOR IZIN USAHA</label>
          <input required value={fields.izin_usaha} onChange={(e) => setFields({ ...fields, izin_usaha: e.target.value })} placeholder="B-9988/2026/MBG" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>WILAYAH OPERASIONAL</label>
          <input required value={fields.region} onChange={(e) => setFields({ ...fields, region: e.target.value })} placeholder="Contoh: Jakarta Selatan" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
        </div>
      </>
    )
    if (isMapping) return (
      <>
        <div>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>NAMA SEKOLAH BARU</label>
          <input required value={fields.nama_sekolah} onChange={(e) => setFields({ ...fields, nama_sekolah: e.target.value })} placeholder="Contoh: SDN 05 Menteng" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>JUMLAH SISWA</label>
          <input required type="number" value={fields.jumlah_siswa} onChange={(e) => setFields({ ...fields, jumlah_siswa: e.target.value })} placeholder="450" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>ALAMAT LENGKAP SEKOLAH</label>
          <textarea required value={fields.alamat} onChange={(e) => setFields({ ...fields, alamat: e.target.value })} placeholder="Jl. Merdeka No. 10..." style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700', minHeight: '100px', fontFamily: 'inherit' }} />
        </div>
      </>
    )
    return (
      <div>
        <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>ANGGARAN TARGET (CAPEX/OPEX)</label>
        <input placeholder="Masukkan nilai anggaran..." style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
      </div>
    )
  }

  return (
    <div 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        background: 'rgba(15, 23, 42, 0.4)', 
        backdropFilter: 'blur(8px)', 
        zIndex: 9999, 
        display: 'flex', 
        justifyContent: 'flex-end' 
      }}
      onClick={onClose}
    >
      <motion.div 
        initial={{ x: '100%' }} 
        animate={{ x: 0 }} 
        exit={{ x: '100%' }} 
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
          height: '100%', 
          background: 'white', 
          boxShadow: '-10px 0 40px rgba(0,0,0,0.1)', 
          padding: '1.5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex justify-between" style={{ marginBottom: '1.5rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontWeight: '950', fontSize: '1.8rem', color: '#0f172a', letterSpacing: '-0.5px' }}>Tambah {isVendor ? 'Vendor' : isMapping ? 'Sekolah' : 'Target'}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', marginTop: '4px' }}>Input data administrasi ke dalam ekosistem pemerintah.</p>
            </div>
            <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
              <X size={20} color="#64748b" />
            </button>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {getFields()}
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="btn-primary" 
          style={{ width: '100%', padding: '1.2rem', borderRadius: '24px', border: 'none', color: 'white', fontWeight: '950', fontSize: '1.1rem', marginTop: '2rem', cursor: 'pointer' }}
        >
          {isSaving ? 'Menyimpan ke Ledger...' : 'Simpan Data'}
        </button>
      </motion.div>
    </div>
  )
}

const VendorAuditModal = ({ vendor, docs, dapurs, onClose }) => {
  if (!vendor) return null

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'grid', placeItems: 'center', padding: '1rem' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        style={{ width: '100%', maxWidth: '820px', background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 30px 80px rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between" style={{ alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontWeight: '950', fontSize: '2rem', marginBottom: '0.25rem' }}>{vendor.nama_vendor}</h2>
            <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{vendor.region} • {vendor.izin_usaha}</p>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '999px', width: '42px', height: '42px', cursor: 'pointer', fontWeight: '900' }}>×</button>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="card" style={{ padding: '1rem', borderRadius: '16px', background: 'var(--bg)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>STATUS</p>
            <h3 style={{ fontWeight: '950', marginTop: '0.35rem' }}>{vendor.status_verifikasi?.toUpperCase()}</h3>
          </div>
          <div className="card" style={{ padding: '1rem', borderRadius: '16px', background: 'var(--bg)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>DAPUR AKTIF</p>
            <h3 style={{ fontWeight: '950', marginTop: '0.35rem' }}>{dapurs.length}</h3>
          </div>
          <div className="card" style={{ padding: '1rem', borderRadius: '16px', background: 'var(--bg)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>DOKUMEN</p>
            <h3 style={{ fontWeight: '950', marginTop: '0.35rem' }}>{docs.length}</h3>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="card" style={{ padding: '1rem', borderRadius: '16px' }}>
            <h3 style={{ fontWeight: '900', marginBottom: '0.75rem' }}>Dapur Vendor</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {dapurs.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Belum ada dapur terdaftar.</p>
              ) : dapurs.map((d) => (
                <div key={d.id_dapur} style={{ padding: '0.9rem', borderRadius: '12px', background: 'var(--bg)' }}>
                  <p style={{ fontWeight: '800' }}>{d.lokasi}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Kapasitas {d.kapasitas_produksi} porsi/hari</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: '1rem', borderRadius: '16px' }}>
            <h3 style={{ fontWeight: '900', marginBottom: '0.75rem' }}>Dokumen Vendor</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {docs.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Belum ada dokumen vendor.</p>
              ) : docs.map((doc) => (
                <div key={doc.id_dokumen} style={{ padding: '0.9rem', borderRadius: '12px', background: 'var(--bg)' }}>
                  <p style={{ fontWeight: '800' }}>{doc.nama_dokumen}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>{doc.status} • {doc.jenis}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const PemerintahDashboard = ({ user, onLogout }) => {
  const location = useLocation()
  const [showAddForm, setShowAddForm] = useState(false)
  const [showToast, setShowToast] = useState({ show: false, message: '' })
  const [selectedVendorAudit, setSelectedVendorAudit] = useState(null)
  const [selectedVendorDocs, setSelectedVendorDocs] = useState([])
  
  const triggerToast = (msg) => {
    setShowToast({ show: true, message: msg })
    setTimeout(() => setShowToast({ show: false, message: '' }), 3000)
  }

  const handleModalSave = async (type, data) => {
    try {
      if (type === 'Vendor') {
        const created = await api.createVendor({
          nama_vendor: data.nama_vendor,
          izin_usaha: data.izin_usaha,
          region: data.region,
          status_verifikasi: 'approved',
          date_pendaftaran: new Date().toISOString().split('T')[0]
        })
        setActiveVendors(prev => [created, ...prev])
      } else if (type === 'Sekolah') {
        const createdSekolah = await api.createSekolah({
          nama_sekolah: data.nama_sekolah,
          jumlah_siswa: parseInt(data.jumlah_siswa) || 0,
          alamat: data.alamat,
          jenjang: 'SD',
          alergi_count: 0,
          intoleran_count: 0
        })
        setSekolahList(prev => [...prev, createdSekolah])
        const targetDapur = dapurs[0]
        if (!targetDapur) {
          throw new Error('Belum ada dapur aktif untuk dipetakan ke sekolah baru.')
        }

        await api.createMapping({
          id_dapur: targetDapur.id_dapur,
          id_sekolah: createdSekolah.id_sekolah
        })
        const m = await api.getMapping()
        setMappingData(m)
      }
      setShowAddForm(false)
      triggerToast(`Data ${type} baru berhasil ditambahkan!`)
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan data: ' + err.message)
    }
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
  const [dapurs, setDapurs] = useState([])
  const [chartData, setChartData] = useState([
    { jenjang: 'PAUD', penerima: 1500, kondisi_khusus: 45 },
    { jenjang: 'SD', penerima: 4200, kondisi_khusus: 120 },
    { jenjang: 'SMP', penerima: 2800, kondisi_khusus: 85 },
    { jenjang: 'SMA/SMK', penerima: 2100, kondisi_khusus: 50 },
    { jenjang: 'SLB', penerima: 800, kondisi_khusus: 8 }
  ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [v, w, a, m, s, stats, d] = await Promise.all([
          api.getVendors(),
          api.getWilayah(),
          api.getAlerts(),
          api.getMapping(),
          api.getSekolah(),
          api.getPemerintahStats(),
          api.getDapur()
        ])
        setActiveVendors(v.filter(x => x.status_verifikasi === 'approved'))
        setRegQueue(v.filter(x => x.status_verifikasi === 'pending'))
        setWilayahData(w)
        setAlerts(a)
        setMappingData(m)
        setSekolahList(s)
        setDapurs(d)
        if (stats && stats.length > 0) {
          setChartData(stats)
        }
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

  const handleResolveAlert = async (alertId) => {
    try {
      await api.resolveAlert(alertId, user.id_user)
      setAlerts(prev => prev.map(item => (
        item.id_alert === alertId
          ? { ...item, is_resolved: true, resolved_by: user.id_user, resolved_at: new Date().toISOString() }
          : item
      )))
      triggerToast('Alert berhasil ditandai selesai.')
    } catch (err) {
      console.error(err)
      alert('Gagal menyelesaikan alert: ' + err.message)
    }
  }

  const handleOpenVendorAudit = async (vendor) => {
    try {
      const docs = await api.getDokumen(vendor.id_vendor)
      setSelectedVendorDocs(docs)
      setSelectedVendorAudit(vendor)
    } catch (err) {
      console.error(err)
      alert('Gagal memuat detail audit vendor: ' + err.message)
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
        <div className="card dashboard-card-vibrant" style={{ borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: '950', color: 'var(--primary)' }}>Menunggu Verifikasi (Queue)</h3>
          {regQueue.length === 0 ? (
            <p style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '700', background: 'var(--bg)', borderRadius: '8px' }}>Tidak ada antrian pendaftaran vendor baru.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.8rem', marginBottom: '1.5rem' }}>
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

          <h3 style={{ marginBottom: '1rem', fontWeight: '950', marginTop: '2rem' }}>Daftar Vendor Aktif</h3>
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
                     <button onClick={() => handleOpenVendorAudit(v)} style={{ color: 'var(--primary)', background: 'var(--primary-light)', border: 'none', fontWeight: '900', padding: '8px 16px', borderRadius: '15px', cursor: 'pointer' }}>Detail Audit</button>
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
        <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
          <div className="card" style={{ borderRadius: '16px', background: 'white', padding: '1.5rem' }}>
             <h3 style={{ marginBottom: '1rem', fontWeight: '900' }}>Daftar Mapping Aktif</h3>
             <div style={{ display: 'grid', gap: '1rem' }}>
               {mappingData.map((m, i) => {
                 return (
                   <div key={i} style={{ padding: '1.5rem', background: 'var(--bg)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                         <div style={{ background: 'white', padding: '10px', borderRadius: '12px' }}><ChefHat color="var(--primary)" size={18} /></div>
                         <div>
                            <p style={{ fontWeight: '800' }}>Dapur {m.dapur_lokasi || 'Vendor'}</p>
                         </div>
                      </div>
                      <Link2 color="var(--text-muted)" />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', textAlign: 'right' }}>
                         <div>
                            <p style={{ fontWeight: '800' }}>{m.nama_sekolah || 'Sekolah'}</p>
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

    if (isStatistik) return (
      <div className="grid">
        <Header title="Laporan & Statistik" subtitle="Analisis pertumbuhan dan efektivitas distribusi gizi." />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '2.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'white' }}>
             <h3 style={{ fontWeight: '900', marginBottom: '1rem' }}>Penerima Manfaat per Jenjang</h3>
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
          <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'white' }}>
             <h3 style={{ fontWeight: '900', marginBottom: '1rem' }}>Audit Gizi (Kondisi Khusus)</h3>
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
        <div className="grid" style={{ gap: '1rem' }}>
          {alerts.map((a, i) => (
            <div key={i} className="card" style={{ padding: '1rem', borderRadius: '12px', display: 'flex', gap: '25px', alignItems: 'center', background: 'white' }}>
              <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: '8px' }}><AlertTriangle color="#EF4444" /></div>
              <div style={{ flex: 1 }}>
                <div className="flex justify-between" style={{ marginBottom: '5px' }}>
                  <h4 style={{ fontWeight: '900', fontSize: '1.2rem' }}>{a.judul}</h4>
                  <span className="badge" style={{
                    background: a.is_resolved ? 'var(--primary-light)' : 'var(--banana-light)',
                    color: a.is_resolved ? 'var(--primary)' : 'var(--banana)',
                    fontWeight: '900'
                  }}>
                    {a.is_resolved ? 'SELESAI' : 'TERBUKA'}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{a.deskripsi}</p>
                <p style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.8rem', marginTop: '0.75rem' }}>
                  Wilayah: {a.wilayah || 'Tidak ditentukan'}
                </p>
              </div>
              {!a.is_resolved && (
                <button
                  onClick={() => handleResolveAlert(a.id_alert)}
                  className="btn-primary"
                  style={{ padding: '0.8rem 1rem', borderRadius: '12px', border: 'none', color: 'white', fontWeight: '800', cursor: 'pointer' }}
                >
                  Tandai Selesai
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    )

    if (isPeta) return (
      <div className="grid">
        <Header title="Peta Distribusi Real-time" subtitle="Visualisasi sebaran dapur dan sekolah di seluruh Nusantara." />
        <div className="card" style={{ minHeight: '600px', background: 'var(--bg)', borderRadius: '16px', padding: '1.5rem', position: 'relative' }}>
           <div style={{ display: 'grid', gap: '1rem' }}>
             {mappingData.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                 <Globe size={100} color="var(--primary)" style={{ opacity: 0.1 }} />
                 <p style={{ color: 'var(--text-muted)', fontWeight: '700' }}>Belum ada pemetaan dapur dan sekolah.</p>
               </div>
             ) : mappingData.map((m) => (
               <div key={m.id_mapping} style={{ padding: '1.1rem', borderRadius: '14px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                   <p style={{ fontWeight: '900' }}>{m.dapur_lokasi}</p>
                   <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>Dapur Aktif</p>
                 </div>
                 <ChevronRight color="var(--primary)" />
                 <div style={{ textAlign: 'right' }}>
                   <p style={{ fontWeight: '900' }}>{m.nama_sekolah}</p>
                   <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>Sekolah Terlayani</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    )

    if (isMain) return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1 }}>
        <Header title="Monitoring Gizi Nasional" subtitle="Portal Transparansi Program Makan Bergizi Gratis (MBG)." />
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
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
        {selectedVendorAudit && (
          <VendorAuditModal
            vendor={selectedVendorAudit}
            docs={selectedVendorDocs}
            dapurs={dapurs.filter((d) => d.id_vendor === selectedVendorAudit.id_vendor)}
            onClose={() => {
              setSelectedVendorAudit(null)
              setSelectedVendorDocs([])
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showToast.show && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }} 
            animate={{ opacity: 1, y: 20, x: '-50%' }} 
            exit={{ opacity: 0, y: -50, x: '-50%' }} 
            style={{ 
              position: 'fixed', top: 0, left: '50%', zIndex: 3000, 
              background: 'var(--role-primary)', 
              color: 'white', padding: '0.9rem 2rem', borderRadius: '24px', 
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
