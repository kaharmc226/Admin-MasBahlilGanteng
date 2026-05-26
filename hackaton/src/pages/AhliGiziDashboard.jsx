import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  CheckCircle2, 
  ChevronRight,
  ClipboardList,
  Activity,
  Zap,
  FileText,
  Search,
  CheckCircle,
  Plus,
  Apple,
  Carrot,
  Leaf,
  X,
  Loader2,
  Download,
  AlertTriangle,
  RefreshCw,
  Clock,
  Edit3,
  Save,
  MessageCircle,
  LayoutDashboard,
  ShieldCheck,
  Microscope,
  Utensils,
  AlertCircle,
  BookOpen,
  Coffee
} from 'lucide-react'

const NUTRITION_DATABASE = {
  makanan_pokok: [
    { nama: 'Nasi putih', satuan: '100 gram', energi: '175 kkal' },
    { nama: 'Nasi merah', satuan: '100 gram', energi: '110 kkal' },
    { nama: 'Kentang rebus', satuan: '100 gram', energi: '87 kkal' },
    { nama: 'Ubi jalar', satuan: '100 gram', energi: '86 kkal' },
    { nama: 'Singkong', satuan: '100 gram', energi: '160 kkal' },
    { nama: 'Roti putih', satuan: '1 iris', energi: '66 kkal' },
    { nama: 'Roti gandum', satuan: '1 iris', energi: '67 kkal' },
    { nama: 'Mi goreng instan', satuan: '80 gram', energi: '350 kkal' },
  ],
  lauk_sayur: [
    { nama: 'Dada ayam (kulit)', satuan: '100 gram', energi: '216 kkal' },
    { nama: 'Dada ayam (no kulit)', satuan: '100 gram', energi: '184 kkal' },
    { nama: 'Bebek goreng', satuan: '100 gram', energi: '286 kkal' },
    { nama: 'Ikan kembung', satuan: '100 gram', energi: '167 kkal' },
    { nama: 'Udang goreng', satuan: '100 gram', energi: '150 kkal' },
    { nama: 'Bakso sapi', satuan: '100 gram', energi: '202 kkal' },
    { nama: 'Chicken nugget', satuan: '100 gram', energi: '297 kkal' },
    { nama: 'Telur dadar', satuan: '1 btr besar', energi: '93 kkal' },
    { nama: 'Tempe goreng', satuan: '1 porsi', energi: '118 kkal' },
    { nama: 'Tahu isi', satuan: '1 porsi', energi: '124 kkal' },
    { nama: 'Tumis kangkung', satuan: '85 gram', energi: '155 kkal' },
    { nama: 'Perkedel kentang', satuan: '75 gram', energi: '117 kkal' },
  ],
  buah: [
    { nama: 'Apel', satuan: '1 buah sedang', energi: '72 kkal' },
    { nama: 'Pisang', satuan: '1 buah sedang', energi: '105 kkal' },
    { nama: 'Jambu biji', satuan: '1 buah', energi: '37 kkal' },
    { nama: 'Jambu air', satuan: '1 buah', energi: '55 kkal' },
    { nama: 'Alpukat', satuan: '100 gram', energi: '322 kkal' },
    { nama: 'Jeruk', satuan: '1 buah', energi: '62 kkal' },
    { nama: 'Buah naga', satuan: '1 buah sedang', energi: '50 kkal' },
    { nama: 'Pepaya', satuan: '100 gram', energi: '39 kkal' },
  ]
}
import { motion, AnimatePresence } from 'framer-motion'
import { mockData } from '../data/mockData'
import Sidebar from '../components/Sidebar'

// --- Sub-components (Moved Outside to prevent re-mounting issues) ---

const Motif = ({ icon: Icon, top, right, bottom, left, color }) => (
  <div style={{ position: 'absolute', top, right, bottom, left, opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}>
    <Icon size={120} color={color} />
  </div>
)

const Header = ({ title }) => (
  <div className="card dashboard-card-vibrant" style={{ 
    marginBottom: "3.5rem", 
    padding: '1.5rem 2.5rem',
    borderRadius: '35px',
    background: 'white',
    border: '1px solid white',
    boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    position: 'relative',
    zIndex: 10
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={{ width: '55px', height: '55px', background: 'var(--primary-light)', borderRadius: '18px', display: 'grid', placeItems: 'center', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.1)' }}>
        <LayoutDashboard color="var(--primary)" size={28} />
      </div>
      <div>
        <h1 style={{ fontSize: "2.1rem", fontWeight: "950", letterSpacing: "-1.5px", color: 'var(--text-main)', lineHeight: '1.2' }}>{title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <div style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
          <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>National Audit Center • Live Inspection</p>
        </div>
      </div>
    </div>
    
    <div style={{ 
      padding: '0.6rem 1.4rem', 
      borderRadius: '20px', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '15px',
      background: 'var(--bg)',
      border: '1px solid var(--border)'
    }}>
       <div style={{ textAlign: 'right', borderRight: '1.5px solid var(--border)', paddingRight: '15px' }}>
          <p style={{ fontWeight: '950', fontSize: '1rem', color: 'var(--text-main)', margin: 0 }}>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '900', margin: 0 }}>{new Date().toLocaleDateString('id-ID', { weekday: 'long' }).toUpperCase()}</p>
       </div>
       <div className="flex" style={{ gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '38px', height: '38px', background: 'white', borderRadius: '12px', display: 'grid', placeItems: 'center', boxShadow: '0 5px 10px rgba(0,0,0,0.05)' }}>
              <Activity size={18} color="var(--primary)" />
            </div>
            <motion.div 
               animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
               transition={{ duration: 2, repeat: Infinity }}
               style={{ position: 'absolute', inset: 0, background: 'var(--primary)', borderRadius: '12px', zIndex: -1 }}
            />
          </div>
          <div>
            <p style={{ fontSize: '0.6rem', fontWeight: '900', color: 'var(--text-muted)', marginBottom: '1px' }}>SISTEM STATUS</p>
            <p style={{ fontSize: '0.8rem', fontWeight: '950', color: 'var(--primary)' }}>SINKRON</p>
          </div>
       </div>
    </div>
  </div>
)

const WelcomeBanner = ({ name }) => (
  <motion.div 
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    style={{ 
      background: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)',
      padding: '3rem',
      borderRadius: '40px',
      marginBottom: '3rem',
      position: 'relative',
      overflow: 'hidden',
      color: 'white',
      boxShadow: '0 30px 60px -15px rgba(6, 78, 59, 0.4)'
    }}
  >
    <div style={{ position: 'relative', zIndex: 2 }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '950', color: 'white', marginBottom: '10px' }}>Halo Selamat Siang, {name}! 🔬</h2>
      <p style={{ fontSize: '1.1rem', fontWeight: '600', opacity: 0.9, maxWidth: '600px', lineHeight: '1.6' }}>Satu menu baru sedang menunggu audit Anda. Pastikan standar gizi nasional terpenuhi untuk generasi emas Indonesia.</p>
      
      <div style={{ display: 'flex', gap: '15px', marginTop: '2.5rem' }}>
        <button style={{ background: 'white', color: 'var(--text-main)', padding: '0.8rem 1.8rem', border: 'none', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Mulai Validasi <ChevronRight size={20} />
        </button>
        <button style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.8rem 1.8rem', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
          Update Regulasi
        </button>
      </div>
    </div>

    {/* Decorative Elements inside banner */}
    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '250px', height: '250px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }}></div>
    <div style={{ position: 'absolute', bottom: '-20px', right: '50px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%', pointerEvents: 'none' }}></div>
    <Microscope style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%) rotate(15deg)', opacity: 0.1, color: 'white' }} size={200} />
  </motion.div>
)

const Footer = () => (
  <div className="card dashboard-card-vibrant" style={{ 
    marginTop: '5rem', 
    padding: '2rem 3rem', 
    borderRadius: '35px',
    background: 'white',
    border: '1px solid white',
    boxShadow: '0 -10px 40px rgba(0,0,0,0.02)',
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    position: 'relative',
    zIndex: 2
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={{ background: 'var(--primary)', color: 'white', width: '45px', height: '45px', borderRadius: '14px', display: 'grid', placeItems: 'center', fontWeight: '950', fontSize: '1.2rem', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' }}>A</div>
      <div>
        <h4 style={{ fontWeight: '950', fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '2px', letterSpacing: '-0.5px' }}>TRAKSI National Ecosystem</h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>Platform Transparansi & Gizi Nasional • Versi 4.2.0-Production</p>
      </div>
    </div>
    <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
       <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '900', marginBottom: '8px', letterSpacing: '1px' }}>KONEKSI ENKRIPSI</p>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
             {[1,2,3,4,5,6].map(i => <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} style={{ width: '12px', height: '6px', background: 'var(--primary)', borderRadius: '10px' }}></motion.div>)}
          </div>
       </div>
       <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ width: '45px', height: '45px', background: 'var(--bg)', border: 'none', borderRadius: '14px', display: 'grid', placeItems: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}><MessageCircle size={20} /></button>
          <button style={{ width: '45px', height: '45px', background: 'var(--bg)', border: 'none', borderRadius: '14px', display: 'grid', placeItems: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}><ShieldCheck size={20} /></button>
       </div>
    </div>
  </div>
)

const FloatingShape = ({ initial, animate, duration, color, size }) => (
  <motion.div 
    initial={initial}
    animate={animate}
    transition={{ duration, repeat: Infinity, ease: "linear" }}
    style={{ 
      position: 'absolute', 
      width: size, 
      height: size, 
      borderRadius: '50%', 
      background: color, 
      filter: 'blur(100px)', 
      opacity: 0.25,
      zIndex: 0,
      pointerEvents: 'none'
    }}
  />
)

const FoodItem3D = ({ src, top, left, right, bottom, size = 120, delay = 0, rotate = 0 }) => (
  <motion.div
    initial={{ y: 0, opacity: 0, scale: 0.5, rotate }}
    animate={{ 
      y: [0, -40, 0],
      rotate: [rotate, rotate + 15, rotate - 15, rotate],
      opacity: 0.25,
      scale: 1
    }}
    transition={{ 
      duration: 5 + Math.random() * 3, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay
    }}
    style={{ 
      position: 'absolute', 
      top, left, right, bottom, 
      zIndex: 0,
      pointerEvents: 'none' 
    }}
  >
    <img 
      src={src} 
      alt="Food Decoration" 
      style={{ 
        width: size, 
        height: size, 
        objectFit: 'cover', 
        borderRadius: '50%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        filter: 'contrast(1.1) brightness(1.1)'
      }} 
    />
  </motion.div>
)

const StandardModal = ({ onClose, onSave, standard, setStandard, isEdit = false }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'grid', placeItems: 'center', backdropFilter: 'blur(8px)' }}>
    <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="card" style={{ width: '90%', maxWidth: '550px', padding: '3.5rem', borderRadius: '45px', position: 'relative' }}>
       <button onClick={onClose} style={{ position: 'absolute', top: '25px', right: '25px', background: 'var(--bg)', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><X size={20}/></button>
       <h2 style={{ marginBottom: '2.5rem', fontWeight: '950', fontSize: '2.4rem', letterSpacing: '-1.5px' }}>{isEdit ? 'Edit Data Standar' : 'Tambah Standar Gizi'}</h2>
       <form onSubmit={(e) => { e.preventDefault(); onSave(); }} style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Nama Zat Gizi</label>
            <input 
              required
              value={standard.title}
              onChange={(e) => setStandard({...standard, title: e.target.value})}
              placeholder="Contoh: Vitamin D / Kalsium" 
              style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }} 
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Rentang Kebutuhan (Min - Max)</label>
              <input 
                required
                value={standard.requirement}
                onChange={(e) => setStandard({...standard, requirement: e.target.value})}
                placeholder="20g - 35g" 
                style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }} 
              />
            </div>
            <div>
               <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Pilih Warna Aksen</label>
               <select 
                 value={standard.color} 
                 onChange={(e) => setStandard({...standard, color: e.target.value})}
                 style={{ width: '100%', padding: '1.1rem', borderRadius: '15px', border: '1.5px solid var(--border)', background: 'white' }}
               >
                 <option value="var(--primary)">Hijau (Primary)</option>
                 <option value="var(--carrot)">Oranye (Carrot)</option>
                 <option value="var(--secondary)">Biru (Secondary)</option>
                 <option value="var(--error)">Merah (Error)</option>
               </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Deskripsi Ringkas</label>
            <textarea 
              value={standard.desc}
              onChange={(e) => setStandard({...standard, desc: e.target.value})}
              placeholder="Manfaat bagi anak sekolah..." 
              style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)', height: '80px' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Detail Sumber & Catatan</label>
            <textarea 
              value={standard.details}
              onChange={(e) => setStandard({...standard, details: e.target.value})}
              placeholder="Contoh: Sumber dari protein hewani..." 
              style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)', height: '80px' }} 
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
             <button type="button" onClick={onClose} className="btn-outline" style={{ flex: 1, borderRadius: '50px', padding: '1.2rem', fontWeight: '800' }}>Batal</button>
             <button type="submit" className="btn-primary" style={{ flex: 1, borderRadius: '50px', border: 'none', color: 'white', fontWeight: '900', background: 'linear-gradient(to right, var(--primary), var(--secondary))' }}>
               {isEdit ? 'Simpan Perubahan' : 'Terbitkan Standar'}
             </button>
          </div>
       </form>
    </motion.div>
  </motion.div>
)

const AhliGiziDashboard = ({ user, onLogout }) => {
  const location = useLocation()
  const [showModal, setShowModal] = useState({ show: false, mode: 'add', index: -1 })
  const [selectedMenuIdx, setSelectedMenuIdx] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showToast, setShowToast] = useState({ show: false, message: '', type: 'success' })
  const [aiResult, setAiResult] = useState(null)
  const [isAiLoading, setIsAiLoading] = useState(false)
  
  const [standards, setStandards] = useState([
    { title: 'Protein', requirement: '20g - 35g', color: 'var(--primary)', desc: 'Esensial untuk pertumbuhan otot dan jaringan anak.', details: 'Sumber utama: Daging sapi rendah lemak, ayam tanpa kulit, telur, dan tempe.' },
    { title: 'Kalori', requirement: '500kcal - 750kcal', color: 'var(--carrot)', desc: 'Energi harian optimal untuk aktivitas belajar.', details: 'Keseimbangan karbohidrat kompleks (nasi merah/putih) dan serat sayuran.' },
    { title: 'Lemak Sehat', requirement: '10g - 25g', color: 'var(--secondary)', desc: 'Mendukung fungsi otak dan penyerapan vitamin.', details: 'Gunakan minyak zaitun atau minyak kelapa sawit bersertifikat fortifikasi.' }
  ])

  const [formStandard, setFormStandard] = useState({ title: '', requirement: '', color: 'var(--primary)', desc: '', details: '' })
  const [ahliSuggestion, setAhliSuggestion] = useState('')

  const path = location.pathname.replace(/\/$/, '') 
  const isMain = path === '/ahli-gizi'
  const isValidasi = path === '/ahli-gizi/validasi'
  const isStandar = path === '/ahli-gizi/standar'

  const [menus, setMenus] = useState(() => {
    const saved = localStorage.getItem('traksi_v_menus')
    return saved ? JSON.parse(saved) : mockData.menus
  })
  const selectedMenu = menus[selectedMenuIdx] || menus[0]

  useEffect(() => {
    // Validasi Node Blockchain - Simulating new format
    const fetchNutritionProof = async () => {
      setIsAiLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAiResult({
        energi: selectedMenu.nilai_gizi?.energi || '-',
        protein: selectedMenu.nilai_gizi?.protein || '-',
        lemak: selectedMenu.nilai_gizi?.lemak || '-',
        karbohidrat: selectedMenu.nilai_gizi?.karbohidrat || '-',
        serat: selectedMenu.nilai_gizi?.serat || '-',
        natrium: selectedMenu.nilai_gizi?.natrium || '-',
        algorithm: "Blockchain Node Verified (AES-256)"
      })
      setIsAiLoading(false)
    }

    fetchNutritionProof()
    setAhliSuggestion('')
  }, [selectedMenuIdx, selectedMenu.bahan])

  const triggerToast = (message, type = 'success') => {
    setShowToast({ show: true, message, type })
    setTimeout(() => setShowToast({ show: false, message: '', type: 'success' }), 4000)
  }

  const handleGenerateReport = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      triggerToast('Laporan Gizi Tersimpan Secara Immutable di Jaringan Blockchain!', 'success')
    }, 3000)
  }

  const handleApprove = (id) => {
    const newMenus = menus.map(m => m.id === id ? { ...m, status_validasi: 'approved', notes: ahliSuggestion ? [...(m.notes || []), `Ahli Gizi: ${ahliSuggestion}`] : m.notes } : m)
    setMenus(newMenus)
    localStorage.setItem('traksi_v_menus', JSON.stringify(newMenus))
    triggerToast('Menu berhasil disahkan untuk distribusi nasional.')
  }

  const handleReject = (id) => {
    const newMenus = menus.map(m => m.id === id ? { ...m, status_validasi: 'rejected', notes: ahliSuggestion ? [...(m.notes || []), `Ahli Gizi Revisi: ${ahliSuggestion}`] : m.notes } : m)
    setMenus(newMenus)
    localStorage.setItem('traksi_v_menus', JSON.stringify(newMenus))
    triggerToast('Permintaan revisi dikirim ke vendor.', 'warning')
  }

  const handleSaveStandard = () => {
    if (showModal.mode === 'add') {
      setStandards([...standards, formStandard])
      triggerToast('Standar gizi baru berhasil ditambahkan.')
    } else {
      const updated = [...standards]
      updated[showModal.index] = formStandard
      setStandards(updated)
      triggerToast('Data standar berhasil diperbarui.')
    }
    setShowModal({ show: false, mode: 'add', index: -1 })
    setFormStandard({ title: '', requirement: '', color: 'var(--primary)', desc: '', details: '' })
  }

  const openEditModal = (idx) => {
    setFormStandard(standards[idx])
    setShowModal({ show: true, mode: 'edit', index: idx })
  }

  const renderContent = () => {
    if (isValidasi) return (
      <div className="grid" style={{ gap: '2rem' }}>
        <Header title="Validasi & Audit Menu Nasional" />
        <div className="grid" style={{ gridTemplateColumns: '1fr 2.2fr', gap: '2.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-1px' }}>
            <ClipboardList size={26} color="var(--primary)" /> Antrian Validasi
          </h3>
          <div style={{ padding: '1.25rem', background: 'white', border: '1.5px solid var(--border)', borderRadius: '20px', display: 'flex', gap: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.02)' }}>
            <Search size={20} color="var(--text-muted)" />
            <input placeholder="Cari Vendor atau Menu..." style={{ border: 'none', width: '100%', outline: 'none', fontWeight: '600', fontSize: '1rem' }} />
          </div>
          {menus.map((m, idx) => (
            <motion.div 
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              key={idx} 
              onClick={() => setSelectedMenuIdx(idx)}
              className="card" 
              style={{ 
                padding: '1.75rem', 
                cursor: 'pointer', 
                borderRadius: '26px',
                border: selectedMenuIdx === idx ? '3px solid var(--primary)' : '1.5px solid var(--border)', 
                background: selectedMenuIdx === idx ? 'var(--primary-light)' : 'white',
                boxShadow: selectedMenuIdx === idx ? '0 15px 40px rgba(16, 185, 129, 0.15)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="flex justify-between" style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '900', color: selectedMenuIdx === idx ? 'var(--primary)' : 'var(--text-muted)', textTransform: 'uppercase' }}>Vendor #1</span>
                {m.status_validasi === 'approved' ? (
                  <CheckCircle size={18} color="var(--primary)" />
                ) : m.status_validasi === 'rejected' ? (
                  <AlertCircle size={18} color="var(--error)" />
                ) : null}
              </div>
              <h4 style={{ fontWeight: '900', fontSize: '1.1rem' }}>{m.nama_menu}</h4>
              <div className="flex justify-between" style={{ marginTop: '12px', alignItems: 'center' }}>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Input: {m.date}</p>
                 <ChevronRight size={16} color={selectedMenuIdx === idx ? 'var(--primary)' : 'var(--text-muted)'} />
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedMenuIdx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="dashboard-card-vibrant" 
            style={{ padding: '3.5rem', borderRadius: '45px', background: 'white', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '10px', background: 'linear-gradient(to right, var(--primary), var(--secondary))' }} />
            
            <div className="flex justify-between" style={{ marginBottom: '3rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '2.8rem', fontWeight: '950', letterSpacing: '-1px', color: 'var(--text-main)' }}>{selectedMenu.nama_menu}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '600', marginTop: '5px' }}>Audit Komposisi & Kelayakan Gizi Program MBG</p>
              </div>
              <div style={{ marginLeft: '20px' }}>
                 {selectedMenu?.status_validasi === 'approved' ? (
                   <div style={{ background: 'var(--primary-light)', padding: '12px 25px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '10px', border: '2px solid var(--primary)' }}>
                      <CheckCircle2 color="var(--primary)" size={20} />
                      <span style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '0.9rem' }}>MENU DISAHKAN</span>
                   </div>
                 ) : selectedMenu?.status_validasi === 'rejected' ? (
                   <div style={{ background: 'var(--error-light)', padding: '12px 25px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '10px', border: '2px solid var(--error)' }}>
                      <AlertTriangle color="var(--error)" size={20} />
                      <span style={{ color: 'var(--error)', fontWeight: '900', fontSize: '0.9rem' }}>BUTUH REVISI</span>
                   </div>
                 ) : (
                   <div style={{ background: 'var(--banana-light)', padding: '12px 25px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '10px', border: '2px solid var(--banana)' }}>
                      <Clock color="var(--banana)" size={20} />
                      <span style={{ color: 'var(--banana)', fontWeight: '900', fontSize: '0.9rem' }}>PENDING REVIEW</span>
                   </div>
                 )}
              </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem', marginBottom: '2rem' }}>
               {/* Left Section: Visual Feedback Report Preview */}
               <div className="card shadow-md" style={{ background: 'white', borderRadius: '40px', padding: '3rem', border: '1.5px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 60%)' }}></div>
                  
                  <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                     <h2 style={{ fontSize: '2.2rem', fontWeight: '950', color: 'var(--text-main)', marginBottom: '8px' }}>Informasi Nilai Gizi</h2>
                     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontWeight: '900', fontSize: '1.4rem', color: '#1e293b' }}>Menu MBG</span>
                        <div style={{ background: '#E11D48', color: 'white', padding: '8px 25px', borderRadius: '12px', fontWeight: '950', fontSize: '1.4rem' }}>Makanan Bergizi Gratis</div>
                     </div>
                  </div>

                  {/* Tray Visual Section */}
                  <div style={{ position: 'relative', height: '350px', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}>
                     {/* Annotations Left */}
                     <div style={{ position: 'absolute', left: '0', top: '10%', zIndex: 10 }}>
                        {[{n: 'Tahu Goreng', t: '~30 g'}, {n: 'Nasi Putih', t: '~100 g'}, {n: 'Chicken Wings', t: '~48 g'}].map((b, i) => (
                          <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} style={{ textAlign: 'right', marginBottom: '30px', position: 'relative' }}>
                             <p style={{ fontWeight: '950', color: '#dc2626', fontSize: '1.1rem', margin: 0, lineHeight: '1.1' }}>{b.n}</p>
                             <p style={{ fontWeight: '800', color: '#1e293b', fontSize: '1rem', margin: 0 }}>{b.t}</p>
                             <div style={{ width: '35px', height: '2.5px', background: '#334155', position: 'relative', marginTop: '6px', marginLeft: 'auto', opacity: 0.6 }}>
                                <div style={{ position: 'absolute', left: '100%', top: '-4px', borderLeft: '10px solid #334155', borderTop: '5px solid transparent', borderBottom: '5px solid transparent' }}></div>
                             </div>
                          </motion.div>
                        ))}
                     </div>

                     {/* Main Tray Image Container */}
                     <div style={{ position: 'relative', width: '350px', height: '300px', display: 'grid', placeItems: 'center' }}>
                        <div style={{ width: '100%', height: '100%', border: '12px solid #cbd5e1', borderRadius: '40px', background: '#f1f5f9', overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.25)', position: 'relative' }}>
                           <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600" alt="Menu Tray" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                     </div>

                     {/* Annotations Right */}
                     <div style={{ position: 'absolute', right: '0', top: '15%', zIndex: 10 }}>
                        {[{n: 'Pisang', t: '~50 g'}, {n: 'Tumis Buncis+Jagung', t: '~50 g'}].map((b, i) => (
                          <motion.div key={i} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: (i+3) * 0.1 }} style={{ textAlign: 'left', marginBottom: '35px' }}>
                             <p style={{ fontWeight: '950', color: '#dc2626', fontSize: '1.1rem', margin: 0, lineHeight: '1.1' }}>{b.n}</p>
                             <p style={{ fontWeight: '800', color: '#1e293b', fontSize: '1rem', margin: 0 }}>{b.t}</p>
                             <div style={{ width: '35px', height: '2.5px', background: '#334155', position: 'relative', marginTop: '6px', opacity: 0.6 }}>
                                <div style={{ position: 'absolute', right: '100%', top: '-4px', borderRight: '10px solid #334155', borderTop: '5px solid transparent', borderBottom: '5px solid transparent' }}></div>
                             </div>
                          </motion.div>
                        ))}
                     </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', marginBottom: '3rem', fontWeight: '700' }}>
                     Menu MBG SD GIT Manumuti, Kabupaten Kupang, NTT<br/>
                     <span style={{ fontWeight: '600', opacity: 0.8 }}>Sumber: traksi.go.id</span>
                  </div>

                  {/* Bottom Grid: Notes & Table Side-by-side */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 250px', gap: '2rem', alignItems: 'start' }}>
                     {/* Notes Box */}
                     <div style={{ border: '2.5px solid #ef4444', borderRadius: '25px', padding: '1.5rem', background: 'white', position: 'relative' }}>
                        <p style={{ fontWeight: '950', color: '#ef4444', fontSize: '1.2rem', marginBottom: '12px', marginTop: '-5px' }}>*Notes</p>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#334155', fontWeight: '750', fontSize: '0.95rem', lineHeight: '1.6' }}>
                           <li>Kandungan gizi menu ini <span style={{color: '#dc2626'}}>cukup</span> untuk memenuhi kebutuhan makan siang anak sekolah, tetapi kebutuhan <span style={{color: '#dc2626'}}>seratnya</span> masih kurang.</li>
                           <li>Metode pengolahan bisa lebih <span style={{color: '#dc2626'}}>bervariasi</span>, tidak hanya digoreng.</li>
                        </ul>
                     </div>

                     {/* Nutrition Table Box */}
                     <div style={{ border: '2.5px solid #1e293b', borderRadius: '25px', overflow: 'hidden', background: 'white' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                           <tbody>
                              {[
                                { l: 'Energi', v: '503 kkal' },
                                { l: 'Protein', v: '15.9 g' },
                                { l: 'Lemak', v: '21.3 g' },
                                { l: 'Karbohidrat', v: '61.4 g' },
                                { l: 'Serat', v: '3.6 g' },
                                { l: 'Natrium', v: '558 mg' }
                              ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: i === 5 ? 'none' : '1px solid #e2e8f0' }}>
                                   <td style={{ padding: '10px 15px', fontWeight: '850', color: '#475569', fontSize: '0.95rem' }}>{row.l}</td>
                                   <td style={{ padding: '10px 15px', fontWeight: '950', color: '#1e293b', textAlign: 'right', fontSize: '1.05rem' }}>{row.v}</td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>

               {/* Right Section: Ahli Gizi Input */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div className="card shadow-sm" style={{ padding: '2.5rem', borderRadius: '40px', border: '1.5px solid var(--border)', background: 'white' }}>
                     <h4 style={{ fontWeight: '950', marginBottom: '1.5rem', fontSize: '1.2rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div style={{ background: 'var(--secondary-light)', width: '40px', height: '40px', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                         <MessageCircle size={22} color="var(--secondary)" />
                       </div>
                       Rekomendasi Ahli Gizi
                     </h4>
                     <textarea 
                       value={ahliSuggestion}
                       onChange={(e) => setAhliSuggestion(e.target.value)}
                       placeholder="Contoh: Tambah porsi serat, kurangi penggunaan minyak goreng berlebih..."
                       style={{ 
                         width: '100%', height: '220px', padding: '1.5rem', borderRadius: '25px', 
                         border: '1.5px solid #e2e8f0', background: '#f8fafc', 
                         outline: 'none', fontSize: '1.05rem', fontWeight: '700', color: '#334155',
                         transition: 'all 0.3s', resize: 'none', lineHeight: '1.6'
                       }}
                     />
                     
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '2.5rem' }}>
                        <motion.button 
                          whileHover={{ scale: 1.02, translateY: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleApprove(selectedMenu.id)} 
                          style={{ width: '100%', padding: '1.4rem', borderRadius: '50px', background: 'var(--primary)', border: 'none', color: 'white', fontWeight: '950', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 15px 35px rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                        >
                          <CheckCircle2 size={24} /> Sahkan Menu
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.02, translateY: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleReject(selectedMenu.id)} 
                          style={{ width: '100%', padding: '1.4rem', borderRadius: '50px', background: 'white', border: '2.5px solid var(--error)', color: 'var(--error)', fontWeight: '950', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                        >
                          <AlertTriangle size={24} /> Minta Revisi
                        </motion.button>
                     </div>
                  </div>

                  <div className="card" style={{ padding: '2rem', borderRadius: '35px', background: '#f8fafc', border: '1.5px dashed #cbd5e1', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
                       <Activity size={24} color="#64748b" />
                       <ShieldCheck size={24} color="#64748b" />
                    </div>
                    <p style={{ fontWeight: '800', color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5' }}>
                      Audit gizi diverifikasi secara otomatis menggunakan AI & dijamin integritasnya oleh sistem Blockchain TRAKSI.
                    </p>
                  </div>
               </div>
            </div>
          </motion.div>
        </AnimatePresence>
        </div>
      </div>
    )


    if (isStandar) return (
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header title="Standar Nutrisi Nasional" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
          <button onClick={() => {
            setFormStandard({ title: '', requirement: '', color: 'var(--primary)', desc: '', details: '' });
            setShowModal({ show: true, mode: 'add', index: -1 });
          }} className="btn-primary" style={{ padding: '1rem 2rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', color: 'white', fontWeight: '800' }}>
            <Plus size={20} /> Tambah Standar
          </button>
        </div>
        <div className="card shadow-sm" style={{ padding: '0', borderRadius: '30px', overflow: 'hidden', border: '1.5px solid var(--border)', background: 'white', marginBottom: '5rem', position: 'relative', zIndex: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '1.2rem 2rem', textAlign: 'left', fontWeight: '900', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Kategori Zat Gizi</th>
                <th style={{ padding: '1.2rem 2rem', textAlign: 'left', fontWeight: '900', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Target Gizi</th>
                <th style={{ padding: '1.2rem 2rem', textAlign: 'left', fontWeight: '900', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Manfaat Utama</th>
                <th style={{ padding: '1.2rem 2rem', textAlign: 'left', fontWeight: '900', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Rujukan Sumber</th>
                <th style={{ padding: '1.2rem 2rem', textAlign: 'center', fontWeight: '900', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {standards.map((s, i) => (
                <tr key={i} style={{ borderBottom: i === standards.length - 1 ? 'none' : '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1.5rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ background: `${s.color}15`, width: '40px', height: '40px', borderRadius: '10px', display: 'grid', placeItems: 'center' }}>
                        <ShieldCheck color={s.color} size={20} />
                      </div>
                      <span style={{ fontWeight: '900', fontSize: '1.1rem', color: 'var(--text-main)' }}>{s.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem 2rem' }}>
                    <span style={{ fontWeight: '950', color: s.color, fontSize: '0.95rem', background: `${s.color}10`, padding: '6px 15px', borderRadius: '50px', border: `1px solid ${s.color}20` }}>
                      {s.requirement}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem 2rem', maxWidth: '300px' }}>
                    <p style={{ margin: 0, fontWeight: '700', color: '#334155', lineHeight: '1.5', fontSize: '0.95rem' }}>{s.desc}</p>
                  </td>
                  <td style={{ padding: '1.5rem 2rem', maxWidth: '350px' }}>
                    <p style={{ margin: 0, fontWeight: '600', color: '#64748b', lineHeight: '1.5', fontSize: '0.85rem' }}>{s.details}</p>
                  </td>
                  <td style={{ padding: '1.5rem 2rem', textAlign: 'center' }}>
                    <button 
                      onClick={() => openEditModal(i)}
                      style={{ background: 'white', border: '1.5px solid #e2e8f0', padding: '10px 20px', borderRadius: '50px', fontWeight: '800', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto', fontSize: '0.85rem' }}
                    >
                      <Edit3 size={14} /> Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '5rem', marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
          <h3 style={{ fontSize: '2.2rem', fontWeight: '950', marginBottom: '1rem', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
            <BookOpen size={32} color="var(--primary)" /> Database Referensi Nutrisi (Real-time)
          </h3>
          <p style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: '600', maxWidth: '800px', lineHeight: '1.6' }}>
            Data standar energi per satuan takaran untuk audit akurasi menu vendor nasional.
          </p>
        </div>

        <div className="card shadow-sm" style={{ padding: '0', borderRadius: '35px', overflow: 'hidden', border: '1.5px solid #eef2f6', background: 'white', marginBottom: '5rem', position: 'relative', zIndex: 1, boxShadow: '0 25px 60px -15px rgba(0,0,0,0.03)' }}>
          <div style={{ padding: '1.5rem 2.5rem', background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div>
              <span style={{ fontWeight: '900', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Database Terverifikasi • 2026 Revision</span>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
               <div style={{ padding: '6px 15px', background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Search size={14} color="#94a3b8" />
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>Cari bahan...</span>
               </div>
               <div style={{ padding: '6px 15px', background: 'var(--primary-light)', borderRadius: '10px', color: 'var(--primary)', fontWeight: '900', fontSize: '0.75rem' }}>
                  DOWNLOAD PDF
               </div>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'white', borderBottom: '2.2px solid #f1f5f9' }}>
                <th style={{ padding: '1.4rem 2.5rem', textAlign: 'left', fontWeight: '950', color: '#1e293b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', width: '220px' }}>Kelompok</th>
                <th style={{ padding: '1.4rem 2rem', textAlign: 'left', fontWeight: '950', color: '#1e293b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Item Nutrisi</th>
                <th style={{ padding: '1.4rem 2rem', textAlign: 'left', fontWeight: '950', color: '#1e293b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ukuran Porsi</th>
                <th style={{ padding: '1.4rem 2rem', textAlign: 'right', fontWeight: '950', color: '#1e293b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kalori</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(NUTRITION_DATABASE).map(([key, items], catIdx) => (
                <React.Fragment key={key}>
                  {items.map((item, i) => (
                    <tr key={`${key}-${i}`} style={{ 
                      background: i % 2 === 0 ? 'white' : '#fafbfc',
                      borderBottom: (catIdx === 2 && i === items.length - 1) ? 'none' : '1px solid #f1f5f9' 
                    }}>
                      {i === 0 && (
                        <td rowSpan={items.length} style={{ 
                          padding: '2.5rem', 
                          verticalAlign: 'middle',
                          textAlign: 'center',
                          background: key === 'buah' ? '#f0fdf4' : key === 'makanan_pokok' ? '#fffaf5' : '#f0f9ff',
                          borderRight: '1px solid #f1f5f9',
                          width: '200px'
                        }}>
                          <div style={{ color: key === 'buah' ? '#16a34a' : key === 'makanan_pokok' ? '#f97316' : '#0ea5e9', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                             <div style={{ width: '55px', height: '55px', background: 'white', borderRadius: '18px', display: 'grid', placeItems: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.04)' }}>
                                {key === 'buah' ? <Apple size={28} /> : key === 'makanan_pokok' ? <Coffee size={28} /> : <Utensils size={28} />}
                             </div>
                             <span style={{ fontWeight: '950', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                               {key.replace('_', ' ')}
                             </span>
                          </div>
                        </td>
                      )}
                      <td style={{ padding: '1.4rem 2rem', fontWeight: '800', fontSize: '1.1rem', color: '#334155' }}>{item.nama}</td>
                      <td style={{ padding: '1.4rem 2rem', fontWeight: '600', fontSize: '1rem', color: '#64748b' }}>{item.satuan}</td>
                      <td style={{ padding: '1.4rem 2rem', textAlign: 'right' }}>
                         <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: '950', fontSize: '1.1rem', color: 'var(--primary)' }}>
                               {item.energi.split(' ')[0]}
                            </span>
                            <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#94a3b8' }}>KKAL</span>
                         </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )

    return (
      <div style={{ textAlign: 'center', padding: '10rem 5rem' }}>
        <div style={{ marginBottom: '2rem', opacity: 0.5 }}>
          <LayoutDashboard size={80} color="var(--primary)" />
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '950', color: 'var(--text-main)', letterSpacing: '-1.5px' }}>Silahkan Pilih Menu di Samping</h2>
        <p style={{ color: 'var(--text-muted)', fontWeight: '600', marginTop: '1rem' }}>Pilih menu untuk melihat detail validasi atau pengaturan standar gizi.</p>
      </div>
    )
  }

  return (
    <div className="layout-wrapper premium-mesh mesh-ahligizi" style={{ minHeight: '100vh', display: 'flex' }}>
      <div style={{ width: '280px', flexShrink: 0 }}>
        <Sidebar user={user} onLogout={onLogout} />
      </div>

      {/* Decorative Food Elements - Fixed and more diverse */}
      <FoodItem3D top="5%" left="320px" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200" size={180} delay={0} rotate={15} />
      <FoodItem3D bottom="10%" right="5%" src="https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?auto=format&fit=crop&q=80&w=150" size={150} delay={2} rotate={-20} />
      <FoodItem3D top="45%" right="2%" src="https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80&w=180" size={170} delay={4} rotate={45} />
      <FoodItem3D bottom="25%" left="350px" src="https://images.unsplash.com/photo-1518635017498-87f514b751ba?auto=format&fit=crop&q=80&w=150" size={140} delay={1} rotate={-10} />
      <FoodItem3D top="65%" left="420px" src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=160" size={160} delay={3} rotate={30} />
      <FoodItem3D top="2%" right="20%" src="https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&q=80&w=140" size={130} delay={5} rotate={-5} />
      <FoodItem3D bottom="5%" right="30%" src="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=130" size={120} delay={6} rotate={10} />

      {/* Enhanced Multi-color Background Orbs */}
      <FloatingShape initial={{ top: '5%', right: '10%' }} animate={{ y: [0, 100, 0], x: [0, 50, 0] }} duration={25} color="rgba(59, 130, 246, 0.2)" size="700px" />
      <FloatingShape initial={{ bottom: '5%', left: '300px' }} animate={{ y: [0, -120, 0], scale: [1, 1.2, 1] }} duration={22} color="rgba(249, 115, 22, 0.15)" size="600px" />
      <FloatingShape initial={{ top: '40%', left: '50%' }} animate={{ opacity: [0.1, 0.2, 0.1], x: [-50, 50, -50] }} duration={30} color="rgba(234, 179, 8, 0.15)" size="500px" />

      <div className="main-content" style={{ 
        flex: 1, 
        padding: "3.5rem", 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        zIndex: 1,
        overflowX: 'hidden',
        background: 'transparent'
      }}>
        {/* Decorative Grid Overlay for texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 0 }}></div>
        
        <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Motif icon={Apple} top="50px" right="50px" color="var(--primary)" />
          <Motif icon={Carrot} bottom="100px" left="50px" color="var(--carrot)" />
          <Motif icon={Leaf} top="400px" right="100px" color="var(--secondary)" />

          <AnimatePresence>
            {showToast.show && (
              <motion.div 
                initial={{ opacity: 0, y: -50, x: '-50%' }} 
                animate={{ opacity: 1, y: 20, x: '-50%' }} 
                exit={{ opacity: 0, y: -50, x: '-50%' }} 
                style={{ 
                  position: 'fixed', top: 0, left: '50%', zIndex: 3000, 
                  background: showToast.type === 'info' ? 'var(--secondary)' : showToast.type === 'warning' ? 'var(--carrot)' : 'var(--primary)', 
                  color: 'white', padding: '1.2rem 2.5rem', borderRadius: '50px', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '15px' 
                }}
              >
                {showToast.type === 'warning' ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
                <span style={{ fontWeight: '900' }}>{showToast.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showModal.show && (
              <StandardModal 
                onClose={() => setShowModal({ show: false, mode: 'add', index: -1 })} 
                onSave={handleSaveStandard}
                standard={formStandard}
                setStandard={setFormStandard}
                isEdit={showModal.mode === 'edit'}
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
              style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              {isMain ? (
                <>
                  <Header title="AUDIT & STANDARDIZASI" />
                  <WelcomeBanner name="Ahli Gizi Jakarta Timur" />

                  <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', marginBottom: '4rem' }}>
                    <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.1 }} className="card dashboard-card-vibrant" style={{ borderRadius: '40px', textAlign: 'center', padding: '3.5rem' }}>
                      <div style={{ background: 'var(--primary-light)', width: '70px', height: '70px', borderRadius: '22px', display: 'grid', placeItems: 'center', margin: '0 auto 1.5rem' }}><Utensils color="var(--primary)" size={32} /></div>
                      <h1 style={{ fontSize: '3.5rem', fontWeight: '950', marginBottom: '8px', color: 'var(--text-main)' }}>{menus.filter(m => m.status_validasi === 'pending').length}</h1>
                      <p style={{ fontWeight: '800', color: 'var(--text-muted)', fontSize: '1rem' }}>Menu Antre Validasi</p>
                    </motion.div>
                    <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.2 }} className="card dashboard-card-vibrant animate-pulse-glow" style={{ borderRadius: '40px', textAlign: 'center', padding: '3.5rem', borderColor: 'var(--carrot)' }}>
                      <div style={{ background: 'var(--carrot-light)', width: '70px', height: '70px', borderRadius: '22px', display: 'grid', placeItems: 'center', margin: '0 auto 1.5rem' }}><AlertTriangle color="var(--carrot)" size={32} /></div>
                      <h1 style={{ fontSize: '3.5rem', fontWeight: '950', marginBottom: '8px', color: 'var(--carrot)' }}>{menus.filter(m => m.status_validasi === 'rejected').length}</h1>
                      <p style={{ fontWeight: '800', color: 'var(--carrot)', fontSize: '1rem' }}>Revisi Menu Menunggu</p>
                    </motion.div>
                    <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.3 }} className="card dashboard-card-vibrant" style={{ borderRadius: '40px', textAlign: 'center', padding: '3.5rem' }}>
                      <div style={{ background: 'var(--banana-light)', width: '70px', height: '70px', borderRadius: '22px', display: 'grid', placeItems: 'center', margin: '0 auto 1.5rem' }}><ShieldCheck color="var(--banana)" size={32} /></div>
                      <h1 style={{ fontSize: '3.5rem', fontWeight: '950', marginBottom: '8px', color: 'var(--text-main)' }}>{menus.filter(m => m.status_validasi === 'approved').length}</h1>
                      <p style={{ fontWeight: '800', color: 'var(--text-muted)', fontSize: '1rem' }}>Menu Disetujui</p>
                    </motion.div>
                  </div>

                  <div className="card dashboard-card-vibrant" style={{ borderRadius: '50px', padding: '4.5rem', display: 'flex', gap: '5rem', alignItems: 'center', border: '1.5px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', opacity: 0.05 }}><FileText size={400} /></div>
                    <div style={{ flex: 1.5, position: 'relative', zIndex: 1 }}>
                      <h3 style={{ fontSize: '2.5rem', fontWeight: '950', marginBottom: '1.5rem', letterSpacing: '-1.5px' }}>Pencatatan Gizi ke Ledger</h3>
                      <p style={{ fontSize: '1.3rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '3rem', fontWeight: '500' }}>
                        Sistem <strong>Blockchain</strong> mencatat setiap validasi harian Anda ke dalam <em>Smart Contract</em> yang <em>immutable</em>. Data terenkripsi dengan AES-256 dan memastikan laporan kesehatan nasional terhindar dari manipulasi.
                      </p>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleGenerateReport}
                        disabled={isGenerating}
                        className="btn-primary" 
                        style={{ padding: '1.5rem 4rem', borderRadius: '60px', background: 'linear-gradient(to right, var(--primary), var(--secondary))', border: 'none', color: 'white', fontWeight: '950', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.25)', minWidth: '300px', justifyContent: 'center' }}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="animate-spin" size={24} /> 
                            Mencatat Transaksi...
                          </>
                        ) : (
                          <>
                            <Zap size={24} fill="white" />
                            Simpan ke Blockchain
                          </>
                        )}
                      </motion.button>
                    </div>
                    <div style={{ flex: 1, position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}>
                      <div style={{ width: '400px', height: '400px', background: 'var(--bg)', borderRadius: '60px', display: 'grid', placeItems: 'center', border: '25px solid var(--primary-light)', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.02)' }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}>
                          <Microscope size={180} color="var(--primary)" strokeWidth={1} />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                renderContent()
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default AhliGiziDashboard
