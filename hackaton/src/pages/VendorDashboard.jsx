import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  Building, 
  ChefHat, 
  Utensils, 
  Truck, 
  Clock, 
  CheckCircle2, 
  BarChart, 
  Plus,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  AlertCircle,
  Zap,
  Apple,
  Carrot,
  Leaf,
  FileText,
  Layout,
  FileCheck,
  X,
  Upload
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockData } from '../data/mockData'

// --- Sub-components (Moved Outside) ---

const Motif = ({ icon: Icon, top, right, bottom, left, color }) => (
  <div style={{ position: 'absolute', top, right, bottom, left, opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}>
    <Icon size={120} color={color} />
  </div>
)

const Header = ({ title, showAdd = false, onAdd, isDapur, isMenu, isDokumen }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
    <div>
      <h1 style={{ fontSize: '2.8rem', fontWeight: '950', letterSpacing: '-2px' }}>{title}</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: '600' }}>Manajemen Operasional MBG (Makanan Bergizi Gratis)</p>
    </div>
    {showAdd && (
      <button onClick={onAdd} className="btn-primary" style={{ padding: '1rem 2rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', color: 'white', fontWeight: '800' }}>
        <Plus size={20} /> Tambah {isDapur ? 'Dapur' : isMenu ? 'Menu' : isDokumen ? 'Dokumen' : 'Data'}
      </button>
    )}
  </div>
)

const AddFormModal = ({ onClose, isDapur, isMenu, isDokumen, isProduksi, onSave }) => {
  const [formData, setFormData] = useState({});

  const getFields = () => {
    if (isDapur) return (
      <>
        <div>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Lokasi Dapur</label>
          <input onChange={(e) => setFormData({...formData, lokasi: e.target.value})} placeholder="Contoh: Menteng, Jakarta Pusat" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Kapasitas (Porsi/Hari)</label>
          <input type="number" onChange={(e) => setFormData({...formData, kapasitas: e.target.value})} placeholder="500" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }} />
        </div>
      </>
    )
    if (isMenu) return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Nama Menu</label>
            <input onChange={(e) => setFormData({...formData, nama: e.target.value})} placeholder="Nasi Liwet Ayam Suwir" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Tanggal Menu</label>
            <input type="date" onChange={(e) => setFormData({...formData, date: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Kalori</label>
            <input type="number" onChange={(e) => setFormData({...formData, cal: e.target.value})} placeholder="650" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Protein</label>
            <input type="number" onChange={(e) => setFormData({...formData, prot: e.target.value})} placeholder="25" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }} />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Komposisi Bahan</label>
          <textarea onChange={(e) => setFormData({...formData, komposisi: e.target.value})} placeholder="Beras, Ayam..." style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)', height: '80px' }} />
        </div>
      </>
    )
    if (isProduksi) return (
      <>
        <div>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Pilih Menu untuk Dimasak</label>
          <select onChange={(e) => setFormData({...formData, menuId: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }}>
             <option value="">Pilih Menu...</option>
             {mockData.menus.map(m => (
               <option key={m.id} value={m.id}>{m.nama_menu} ({m.status_validasi})</option>
             ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Tujuan Sekolah</label>
          <select onChange={(e) => setFormData({...formData, school: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }}>
             <option value="">Pilih Sekolah...</option>
             {mockData.mappings.map(map => (
               <option key={map.id_sekolah} value={map.schoolName}>{map.schoolName}</option>
             ))}
          </select>
        </div>
      </>
    )
    return <div>Field tidak ditemukan</div>
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'grid', placeItems: 'center', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="card" style={{ width: '90%', maxWidth: '550px', padding: '3.5rem', borderRadius: '45px', position: 'relative' }}>
         <button onClick={onClose} style={{ position: 'absolute', top: '25px', right: '25px', background: 'var(--bg)', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><X size={20}/></button>
         <h2 style={{ marginBottom: '2.5rem', fontWeight: '950', fontSize: '2rem', letterSpacing: '-1px' }}>{isProduksi ? 'Mulai Produksi Baru' : 'Tambah Data'}</h2>
         <div style={{ display: 'grid', gap: '1.5rem' }}>
            {getFields()}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
               <button onClick={onClose} className="btn-outline" style={{ flex: 1, borderRadius: '50px', padding: '1.2rem', fontWeight: '800' }}>Batal</button>
               <button onClick={() => onSave(formData)} className="btn-primary" style={{ flex: 1, borderRadius: '50px', border: 'none', color: 'white', fontWeight: '900', background: 'linear-gradient(to right, var(--primary), var(--secondary))' }}>Simpan & Aktifkan</button>
            </div>
         </div>
      </motion.div>
    </motion.div>
  )
}

const VendorDashboard = () => {
  const location = useLocation()
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeTracking, setActiveTracking] = useState(null)
  
  // 1. Persisten State Status Produksi
  const [prodList, setProdList] = useState(() => {
    const saved = localStorage.getItem('traksi_v_production')
    return saved ? JSON.parse(saved) : [
      { id: 101, menuId: 101, menuName: 'Nasi Kuning Gizi + Ayam Fillet', status: 'MEMASAK', progress: 75, school: 'SDN 01 Menteng', time: '10:30 WIB' }
    ]
  })

  // 2. Persisten Menus
  const [menuList, setMenuList] = useState(() => {
     const saved = localStorage.getItem('traksi_v_menus')
     return saved ? JSON.parse(saved) : mockData.menus
  })

  // 3. Persisten Dapurs
  const [dapurList, setDapurList] = useState(() => {
     const saved = localStorage.getItem('traksi_v_dapurs')
     return saved ? JSON.parse(saved) : mockData.dapurs
  })

  const path = location.pathname.replace(/\/$/, '')
  const isMain = path === '/vendor'
  const isDapur = path === '/vendor/dapur'
  const isMenu = path === '/vendor/menu'
  const isProduksi = path === '/vendor/produksi'
  const isDistribusi = path === '/vendor/distribusi'
  const isDokumen = path === '/vendor/dokumen'

  const handleMulaiKirim = (id) => {
    const newList = prodList.map(p => p.id === id ? { ...p, status: 'DISTRIBUSI', progress: 100, time: 'Saat ini' } : p)
    setProdList(newList)
    localStorage.setItem('traksi_v_production', JSON.stringify(newList))
    alert("🚚 Status Driver: Mulai Pengantaran! Dashboard Sekolah & Pemerintah akan menerima update real-time.")
  }

  const handleSaveData = (data) => {
    if (isProduksi) {
      const menu = menuList.find(m => m.id == data.menuId)
      if (menu?.status_validasi !== 'approved') {
        alert("⚠️ Maaf, menu ini belum disahkan oleh Ahli Gizi. Tidak bisa dimasak.")
        return
      }
      const newItem = {
        id: Date.now(),
        menuId: data.menuId,
        menuName: menu.nama_menu,
        status: 'MEMASAK',
        progress: 0,
        school: data.school,
        time: 'Baru saja'
      }
      const newList = [newItem, ...prodList]
      setProdList(newList)
      localStorage.setItem('traksi_v_production', JSON.stringify(newList))
    }
    
    if (isMenu) {
      const newMenu = {
        id: Date.now(),
        id_vendor: 1,
        nama_menu: data.nama,
        komposisi: data.komposisi,
        nilai_gizi: { calories: data.cal, protein: `${data.prot}g` },
        status_validasi: 'pending',
        date: data.date ? new Date(data.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Tanggal tidak set'
      }
      const newList = [newMenu, ...menuList]
      setMenuList(newList)
      localStorage.setItem('traksi_v_menus', JSON.stringify(newList))
    }

    if (isDapur) {
      const newDapur = {
        id_dapur: Date.now(),
        id_vendor: 1,
        lokasi: data.lokasi,
        kapasitas_production: data.kapasitas,
        produksi_per_hari: 0
      }
      const newList = [...dapurList, newDapur]
      setDapurList(newList)
      localStorage.setItem('traksi_v_dapurs', JSON.stringify(newList))
    }
    
    setShowAddForm(false)
  }

  // --- Statistics Calculation ---
  const totalSekolah = mockData.mappings.length
  const totalDapur = dapurList.length
  const totalProduksi = prodList.length * 400

  const stats = [
    { title: 'Vendor ID', value: 'MBG-2032', icon: <Building size={24}/>, color: 'var(--primary)' },
    { title: 'Dapur Terdaftar', value: totalDapur, icon: <ChefHat size={24}/>, color: 'var(--carrot)' },
    { title: 'Sekolah Dilayani', value: totalSekolah, icon: <MapPin size={24}/>, color: 'var(--banana)' },
    { title: 'Produksi Hari Ini', value: `${totalProduksi.toLocaleString()} porsi`, icon: <Utensils size={24}/>, color: 'var(--secondary)' }
  ]

  const renderContent = () => {
    if (isDapur) return (
      <div className="grid">
        <Header title="Registrasi Dapur Produksi" showAdd onAdd={() => setShowAddForm(true)} isDapur />
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--primary-light)', borderRadius: '20px', border: '1px solid var(--primary)' }}>
           <p style={{ fontWeight: '800', color: 'var(--primary)' }}>📍 Info Terkoneksi:</p>
           <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Dapur Anda terhubung otomatis dengan sistem logistik daerah untuk melayani <b>{totalSekolah} Sekolah</b>.</p>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {dapurList.map((d, i) => (
            <div key={i} className="card" style={{ padding: '2.5rem', borderRadius: '35px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1.5rem' }}>{d.lokasi}</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                 <div className="flex justify-between"><span style={{ fontWeight: '700' }}>Kapasitas Maks</span> <span style={{ fontWeight: '900' }}>{d.kapasitas_production} Porsi</span></div>
                 <div className="flex justify-between"><span style={{ fontWeight: '700' }}>Status</span> <span style={{ fontWeight: '900', color: 'var(--primary)' }}>AKTIF</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
    if (isMenu) return (
      <div className="grid">
        <Header title="Input Menu & Validasi Ahli Gizi" showAdd onAdd={() => setShowAddForm(true)} isMenu />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2.5rem' }}>
          {menuList.map((m, i) => (
            <div key={i} className="card" style={{ padding: '2.5rem', borderRadius: '40px', borderBottom: `8px solid ${m.status_validasi === 'approved' ? 'var(--primary)' : 'var(--carrot)'}` }}>
              <div className="flex justify-between" style={{ marginBottom: '1.5rem' }}>
                 <span className="badge" style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontWeight: '800' }}>{m.date}</span>
                 <span className={`badge ${m.status_validasi === 'approved' ? 'badge-success' : 'badge-warning'}`} style={{ fontWeight: '900' }}>{m.status_validasi?.toUpperCase()}</span>
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '900', marginBottom: '1.5rem' }}>{m.nama_menu}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.5', minHeight: '60px' }}>{m.komposisi}</p>
              <div style={{ padding: '1.5rem', background: 'var(--bg)', borderRadius: '25px', display: 'flex', gap: '20px' }}>
                 <div style={{ textAlign: 'center', flex: 1 }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>KALORI</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--carrot)' }}>{m.nilai_gizi.calories}</p>
                 </div>
                 <div style={{ textAlign: 'center', flex: 1 }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>PROTEIN</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)' }}>{m.nilai_gizi.protein}</p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
    if (isProduksi) return (
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header title="Status Produksi Real-time" showAdd onAdd={() => setShowAddForm(true)} isProduksi />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2.5rem' }}>
          {prodList.map((p, i) => (
            <div key={i} className="card" style={{ padding: '2.5rem', borderRadius: '40px', borderTop: `6px solid ${p.status === 'DISTRIBUSI' ? 'var(--secondary)' : 'var(--primary)'}` }}>
              <div className="flex justify-between" style={{ marginBottom: '1rem' }}>
                 <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '900' }}>{p.menuName}</h3>
                    <p style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.85rem' }}>📍 Tujuan: {p.school}</p>
                 </div>
                 <span className={`badge ${p.status === 'DISTRIBUSI' ? 'badge-info' : 'badge-success'}`} style={{ fontWeight: '900', height: 'fit-content' }}>{p.status}</span>
              </div>
              
              {/* Info Kondisi Khusus (Official Portal Alignment) */}
              <div style={{ marginBottom: '1.5rem', padding: '0.8rem 1.2rem', background: '#FEF2F2', borderRadius: '15px', border: '1px solid #FEE2E2', display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <AlertCircle size={18} color="#DC2626" />
                 <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#991B1B' }}>PERINGATAN KESEHATAN</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#B91C1C' }}>Ada 12 siswa alergi & 5 intoleran di sekolah ini.</p>
                 </div>
              </div>

              <div style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '25px', marginBottom: '1.5rem' }}>
                 <div className="flex justify-between" style={{ marginBottom: '10px' }}>
                    <span style={{ fontWeight: '700' }}>Progres Dapur</span>
                    <span style={{ fontWeight: '900', color: 'var(--primary)' }}>{p.progress}%</span>
                 </div>
                 <div style={{ height: '8px', background: 'var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ duration: 1.5 }} style={{ height: '100%', background: p.status === 'DISTRIBUSI' ? 'var(--secondary)' : 'var(--primary)' }} />
                 </div>
              </div>
              <div className="flex justify-between items-center">
                 <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}><Clock size={16} /> Update: {p.time}</p>
                 {p.status === 'MEMASAK' && (
                   <button onClick={() => handleMulaiKirim(p.id)} className="btn-primary" style={{ padding: '10px 20px', borderRadius: '15px', border: 'none', color: 'white', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <Truck size={16} /> Mulai Kirim
                   </button>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
    if (isDistribusi) return (
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header title="Logistik & Distribusi" />
        <div className="card" style={{ padding: '2rem', borderRadius: '35px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 1rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontWeight: '900', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th>ID TRANS</th>
                <th>MENU</th>
                <th>TUJUAN SEKOLAH</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {prodList.map((d, i) => (
                <tr key={i} style={{ background: 'var(--bg)' }}>
                  <td style={{ padding: '1.5rem', fontWeight: '900', borderRadius: '20px 0 0 20px' }}>TX-{d.id.toString().slice(-4)}</td>
                  <td style={{ padding: '1.5rem', fontWeight: '800' }}>{d.menuName}</td>
                  <td style={{ padding: '1.5rem', fontWeight: '700' }}>{d.school}</td>
                  <td style={{ padding: '1.5rem' }}>
                     <span className="badge" style={{ background: 'white', color: d.status === 'DISTRIBUSI' ? 'var(--secondary)' : 'var(--primary)', fontWeight: '900', border: '1px solid currentColor' }}>{d.status === 'DISTRIBUSI' ? 'ON DELIVERY' : d.status}</span>
                  </td>
                  <td style={{ padding: '1.5rem', borderRadius: '0 20px 20px 0' }}>
                     <button onClick={() => setActiveTracking(d)} style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: '900', cursor: 'pointer', textDecoration: 'underline' }}>Live Tracking</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AnimatePresence>
          {activeTracking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'grid', placeItems: 'center', backdropFilter: 'blur(10px)' }}>
               <div className="card" style={{ width: '90%', maxWidth: '600px', padding: '3rem', borderRadius: '40px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '950', marginBottom: '1.5rem' }}>🛰️ Tracking Real-time</h3>
                  <div style={{ height: '300px', background: 'var(--bg)', borderRadius: '30px', margin: '2rem 0', overflow: 'hidden', position: 'relative', display: 'grid', placeItems: 'center' }}>
                     <div style={{ textAlign: 'center' }}>
                        <Truck size={64} color="var(--primary)" className="animate-bounce" />
                        <p style={{ fontWeight: '900', marginTop: '1rem', color: 'var(--primary)' }}>KENDARAAN DALAM PERJALANAN</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Ke: {activeTracking.school}</p>
                     </div>
                  </div>
                  <button onClick={() => setActiveTracking(null)} className="btn-primary" style={{ width: '100%', padding: '1.2rem', borderRadius: '50px', border: 'none', fontWeight: '950', background: 'var(--text-main)', color: 'white' }}>Tutup Map</button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
    if (isDokumen) return (
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header title="Dokumen Legalitas & Izin" showAdd onAdd={() => setShowAddForm(true)} isDokumen />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {[
            { title: 'Izin Usaha MBG', status: 'Approved', icon: <FileCheck color="var(--primary)" /> },
            { title: 'Sertifikasi Dapur A', status: 'Approved', icon: <FileCheck color="var(--primary)" /> },
            { title: 'Ahli Gizi Certificate', status: 'Approved', icon: <FileCheck color="var(--primary)" /> }
          ].map((doc, i) => (
            <div key={i} className="card" style={{ padding: '2rem', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ background: 'var(--bg)', padding: '15px', borderRadius: '15px' }}>{doc.icon}</div>
              <div>
                <h4 style={{ fontWeight: '800' }}>{doc.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '800' }}>{doc.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
    return <div style={{ textAlign: 'center', padding: '5rem' }}>Pilih Menu</div>
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <AnimatePresence>
        {showAddForm && (
          <AddFormModal 
            onClose={() => setShowAddForm(false)} 
            isDapur={isDapur} isMenu={isMenu} isDokumen={isDokumen} isProduksi={isProduksi}
            onSave={handleSaveData}
          />
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
         {isMain ? (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <Header title="DASHBOARD VENDOR" />
             <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
               {stats.map((stat, i) => (
                 <div key={i} className="card" style={{ padding: '2rem', borderRadius: '32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                   <div style={{ background: `${stat.color}15`, color: stat.color, padding: '18px', borderRadius: '20px' }}>{stat.icon}</div>
                   <div>
                     <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '800' }}>{stat.title}</p>
                     <h2 style={{ fontSize: '1.8rem', fontWeight: '950' }}>{stat.value}</h2>
                   </div>
                 </div>
               ))}
             </div>
             <div className="card" style={{ padding: '3rem', borderRadius: '40px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '950', marginBottom: '2rem' }}><Truck color="var(--primary)" /> Aktivitas Pengiriman Terakhir</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                   {prodList.slice(0,3).map((d, i) => (
                     <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', background: 'var(--bg)', borderRadius: '20px' }}>
                        <div>
                           <p style={{ fontWeight: '900' }}>{d.school}</p>
                           <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.menuName}</p>
                        </div>
                        <span className="badge" style={{ background: 'white', color: d.status === 'DISTRIBUSI' ? 'var(--secondary)' : 'var(--primary)', border: '1px solid currentColor', fontWeight: '900' }}>{d.status}</span>
                     </div>
                   ))}
                </div>
             </div>
           </motion.div>
         ) : renderContent()}
      </div>
    </div>
  )
}

export default VendorDashboard
