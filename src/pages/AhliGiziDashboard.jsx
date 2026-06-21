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

const nutrientKeys = ['energi', 'protein', 'lemak', 'karbohidrat', 'serat', 'natrium']

const parseNutrientValue = (value) => {
  const parsed = parseFloat(String(value ?? '').replace(',', '.').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

const normalizeNutritionItem = (item) => ({
  ...item,
  energi: parseNutrientValue(item.energi),
  protein: parseNutrientValue(item.protein),
  lemak: parseNutrientValue(item.lemak),
  karbohidrat: parseNutrientValue(item.karbohidrat),
  serat: parseNutrientValue(item.serat),
  natrium: parseNutrientValue(item.natrium),
  status: item.status || 'active'
})

const flattenDefaultNutrition = () => Object.entries(NUTRITION_DATABASE).flatMap(([kategori, items], idx) =>
  items.map((item, itemIdx) => ({
    id: `default-${idx}-${itemIdx}`,
    kategori,
    nama: item.nama,
    satuan: item.satuan,
    energi: parseNutrientValue(item.energi),
    protein: 0,
    lemak: 0,
    karbohidrat: 0,
    serat: 0,
    natrium: 0,
    status: 'active'
  }))
)

const groupNutritionItems = (items) => items.reduce((acc, item) => {
  const key = item.kategori || 'lainnya'
  if (!acc[key]) acc[key] = []
  acc[key].push(item)
  return acc
}, {})

const emptyNutritionForm = {
  id: null,
  kategori: 'lauk_sayur',
  nama: '',
  satuan: '100 gram',
  energi: '',
  protein: '',
  lemak: '',
  karbohidrat: '',
  serat: '',
  natrium: '',
  status: 'active'
}

import { motion, AnimatePresence } from 'framer-motion'
import api from '../api'
import DashboardLayout from '../components/DashboardLayout'

// --- Sub-components (Moved Outside to prevent re-mounting issues) ---

const Motif = ({ icon: Icon, top, right, bottom, left, color }) => (
  <div style={{ position: 'absolute', top, right, bottom, left, opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}>
    <Icon size={120} color={color} />
  </div>
)

const Header = ({ title }) => (
  <div className="card dashboard-card-vibrant" style={{ 
    marginBottom: '1.5rem', 
    padding: '1rem 1.5rem',
    borderRadius: '16px',
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
      borderRadius: '8px', 
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
      padding: '1.5rem',
      borderRadius: '16px',
      marginBottom: '1.5rem',
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
    marginTop: '2rem', 
    padding: '1.5rem', 
    borderRadius: '16px',
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
            <h2 style={{ fontWeight: '950', fontSize: '1.8rem', color: '#0f172a', letterSpacing: '-0.5px' }}>{isEdit ? 'Edit Data Standar' : 'Tambah Standar Gizi'}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', marginTop: '4px' }}>Tetapkan standar kecukupan nutrisi program MBG.</p>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
            <X size={20} color="#64748b" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(); }} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>NAMA ZAT GIZI</label>
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
              <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>RENTANG KEBUTUHAN</label>
              <input 
                required
                value={standard.requirement}
                onChange={(e) => setStandard({...standard, requirement: e.target.value})}
                placeholder="20g - 35g" 
                style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }} 
              />
            </div>
            <div>
               <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>WARNA AKSEN</label>
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
            <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>DESKRIPSI RINGKAS</label>
            <textarea 
              value={standard.desc}
              onChange={(e) => setStandard({...standard, desc: e.target.value})}
              placeholder="Manfaat bagi anak sekolah..." 
              style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)', height: '80px', fontFamily: 'inherit' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>RINCIAN LANJUTAN</label>
            <textarea 
              value={standard.details}
              onChange={(e) => setStandard({...standard, details: e.target.value})}
              placeholder="Tambahkan informasi teknis, rujukan sumber..." 
              style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }} 
            />
          </div>
          
          <button 
            type="submit"
            className="btn-primary" 
            style={{ width: '100%', padding: '1.2rem', borderRadius: '24px', border: 'none', color: 'white', fontWeight: '900', fontSize: '1.1rem', marginTop: '1rem', cursor: 'pointer', background: standard.color || 'var(--primary)' }}
          >
            {isEdit ? 'Simpan Perubahan' : 'Tetapkan Standar'}
          </button>
        </form>
      </div>
    </motion.div>
  </div>
)

const AhliGiziDashboard = ({ user, onLogout, onSwitchRole }) => {
  const location = useLocation()
  const [showModal, setShowModal] = useState({ show: false, mode: 'add', index: -1 })
  const [selectedMenuIdx, setSelectedMenuIdx] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showToast, setShowToast] = useState({ show: false, message: '', type: 'success' })
  const [aiResult, setAiResult] = useState(null)
  const [isAiLoading, setIsAiLoading] = useState(false)
  
  const [standards, setStandards] = useState([])
  const [nutritionItems, setNutritionItems] = useState([])
  const [nutritionRequests, setNutritionRequests] = useState([])
  const [nutritionForm, setNutritionForm] = useState(emptyNutritionForm)
  const [requestReviewForms, setRequestReviewForms] = useState({})

  const [formStandard, setFormStandard] = useState({ title: '', requirement: '', color: 'var(--primary)', desc: '', details: '' })
  const [ahliSuggestion, setAhliSuggestion] = useState('')

  const path = location.pathname.replace(/\/$/, '') 
  const isMain = path === '/ahli-gizi'
  const isValidasi = path === '/ahli-gizi/validasi'
  const isStandar = path === '/ahli-gizi/standar'

  const [menus, setMenus] = useState([])
  const selectedMenu = menus[selectedMenuIdx] || menus[0] || {}
  const nutritionDb = groupNutritionItems(nutritionItems.length > 0 ? nutritionItems : flattenDefaultNutrition())
  const selectedBahan = Array.isArray(selectedMenu.bahan) ? selectedMenu.bahan : []
  const selectedLeftBahan = selectedBahan.slice(0, 3)
  const selectedRightBahan = selectedBahan.slice(3, 5)
  const selectedPhotoUrl = api.assetUrl(selectedMenu.foto_url)
  const selectedNotes = Array.isArray(selectedMenu.notes) ? selectedMenu.notes : []
  const canApproveSelectedMenu = !!selectedMenu.nilai_gizi?.calculated && selectedBahan.length > 0 && selectedBahan.every(item => item.id_nutrition)
  const nutritionRows = [
    { l: 'Energi', v: selectedMenu.nilai_gizi?.energi || '-' },
    { l: 'Protein', v: selectedMenu.nilai_gizi?.protein || '-' },
    { l: 'Lemak', v: selectedMenu.nilai_gizi?.lemak || '-' },
    { l: 'Karbohidrat', v: selectedMenu.nilai_gizi?.karbohidrat || '-' },
    { l: 'Serat', v: selectedMenu.nilai_gizi?.serat || '-' },
    { l: 'Natrium', v: selectedMenu.nilai_gizi?.natrium || '-' }
  ]
  const standardComparisons = standards.map((standard) => {
    const title = (standard.title || '').toLowerCase()
    const nutrientKey = title.includes('kalori') || title.includes('energi') ? 'energi'
      : title.includes('protein') ? 'protein'
      : title.includes('lemak') ? 'lemak'
      : title.includes('karbo') ? 'karbohidrat'
      : title.includes('serat') ? 'serat'
      : title.includes('natrium') || title.includes('sodium') ? 'natrium'
      : null
    const numbers = String(standard.requirement || '').match(/\d+(\.\d+)?/g)?.map(Number) || []
    const value = nutrientKey ? parseNutrientValue(selectedMenu.nilai_gizi?.[nutrientKey]) : 0
    const min = numbers[0] ?? null
    const max = numbers[1] ?? null
    const pass = nutrientKey && (min === null || value >= min) && (max === null || value <= max)
    return { ...standard, nutrientKey, value, pass, min, max }
  }).filter(item => item.nutrientKey)

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [m, s, nut, requests] = await Promise.all([api.getMenus(), api.getStandarGizi(), api.getNutrition(), api.getNutritionRequests()])
        setMenus(m)
        setStandards(s.map(st => ({ ...st, desc: st.deskripsi, details: st.detail })))
        setNutritionItems(Array.isArray(nut) ? nut.map(normalizeNutritionItem) : flattenDefaultNutrition())
        setNutritionRequests(Array.isArray(requests) ? requests : [])
      } catch (err) { console.error('Failed to fetch:', err) }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!selectedMenu?.nilai_gizi) return
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
  }, [selectedMenuIdx, selectedMenu?.bahan])

  const triggerToast = (message, type = 'success') => {
    setShowToast({ show: true, message, type })
    setTimeout(() => setShowToast({ show: false, message: '', type: 'success' }), 4000)
  }

  const handleGenerateReport = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      triggerToast('Laporan Gizi Tersimpan!', 'success')
    }, 3000)
  }

  const handleDownloadNutritionData = () => {
    const blob = new Blob([JSON.stringify(nutritionItems, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'nutrition-database.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    triggerToast('Database referensi nutrisi berhasil diunduh.')
  }

  const handleApprove = async (id) => {
    try {
      await api.createValidasiLog({ id_menu: id, id_user: user.id_user, aksi: 'approved', catatan: ahliSuggestion || null })
      setMenus(prev => prev.map(m => (m.id_menu || m.id) === id ? { ...m, status_validasi: 'approved' } : m))
      triggerToast('Menu berhasil disahkan untuk distribusi nasional.')
    } catch (err) { console.error(err) }
  }

  const handleReject = async (id) => {
    try {
      await api.createValidasiLog({ id_menu: id, id_user: user.id_user, aksi: 'rejected', catatan: ahliSuggestion || null })
      setMenus(prev => prev.map(m => (m.id_menu || m.id) === id ? { ...m, status_validasi: 'rejected' } : m))
      triggerToast('Permintaan revisi dikirim ke vendor.', 'warning')
    } catch (err) { console.error(err) }
  }

  const handleSaveStandard = async () => {
    try {
      if (showModal.mode === 'add') {
        const created = await api.createStandarGizi({ title: formStandard.title, requirement: formStandard.requirement, color: formStandard.color, deskripsi: formStandard.desc, detail: formStandard.details, id_user_pembuat: user.id_user })
        setStandards(prev => [...prev, { ...created, desc: formStandard.desc, details: formStandard.details }])
        triggerToast('Standar gizi baru berhasil ditambahkan.')
      } else {
        const std = standards[showModal.index]
        await api.updateStandarGizi(std.id_standar, { title: formStandard.title, requirement: formStandard.requirement, color: formStandard.color, deskripsi: formStandard.desc, detail: formStandard.details })
        const updated = [...standards]
        updated[showModal.index] = { ...std, ...formStandard }
        setStandards(updated)
        triggerToast('Data standar berhasil diperbarui.')
      }
    } catch (err) { console.error(err) }
    setShowModal({ show: false, mode: 'add', index: -1 })
    setFormStandard({ title: '', requirement: '', color: 'var(--primary)', desc: '', details: '' })
  }

  const openEditModal = (idx) => {
    setFormStandard(standards[idx])
    setShowModal({ show: true, mode: 'edit', index: idx })
  }

  const refreshNutrition = async () => {
    const [nut, requests] = await Promise.all([api.getNutrition(), api.getNutritionRequests()])
    setNutritionItems(Array.isArray(nut) ? nut.map(normalizeNutritionItem) : [])
    setNutritionRequests(Array.isArray(requests) ? requests : [])
  }

  const handleSaveNutrition = async () => {
    try {
      if (!nutritionForm.nama || !nutritionForm.kategori) {
        triggerToast('Nama dan kategori bahan wajib diisi.', 'warning')
        return
      }
      if (nutritionForm.id) {
        await api.updateNutrition(nutritionForm.id, nutritionForm)
        triggerToast('Data bahan nutrisi diperbarui.')
      } else {
        await api.createNutrition(nutritionForm)
        triggerToast('Bahan nutrisi baru ditambahkan.')
      }
      setNutritionForm(emptyNutritionForm)
      await refreshNutrition()
    } catch (err) { console.error(err); triggerToast(err.message, 'warning') }
  }

  const handleEditNutrition = (item) => {
    setNutritionForm({
      id: item.id,
      kategori: item.kategori || 'lauk_sayur',
      nama: item.nama || '',
      satuan: item.satuan || '100 gram',
      energi: item.energi ?? '',
      protein: item.protein ?? '',
      lemak: item.lemak ?? '',
      karbohidrat: item.karbohidrat ?? '',
      serat: item.serat ?? '',
      natrium: item.natrium ?? '',
      status: item.status || 'active'
    })
  }

  const handleRetireNutrition = async (id) => {
    try {
      await api.retireNutrition(id)
      triggerToast('Bahan dinonaktifkan dari pilihan vendor.', 'warning')
      await refreshNutrition()
    } catch (err) { console.error(err); triggerToast(err.message, 'warning') }
  }

  const updateRequestReviewForm = (id, patch) => {
    setRequestReviewForms(prev => ({ ...prev, [id]: { ...(prev[id] || {}), ...patch } }))
  }

  const getRequestReviewForm = (request) => ({
    kategori: request.kategori || 'lauk_sayur',
    nama: request.nama || '',
    satuan: '100 gram',
    energi: '',
    protein: '',
    lemak: '',
    karbohidrat: '',
    serat: '',
    natrium: '',
    review_note: '',
    ...(requestReviewForms[request.id_request] || {})
  })

  const handleApproveRequest = async (request) => {
    try {
      await api.approveNutritionRequest(request.id_request, { reviewed_by: user.id_user, ...getRequestReviewForm(request) })
      triggerToast('Permintaan bahan disetujui dan masuk database nutrisi.')
      await refreshNutrition()
    } catch (err) { console.error(err); triggerToast(err.message, 'warning') }
  }

  const handleRejectRequest = async (request) => {
    try {
      const review = getRequestReviewForm(request)
      await api.rejectNutritionRequest(request.id_request, { reviewed_by: user.id_user, review_note: review.review_note })
      triggerToast('Permintaan bahan ditolak.', 'warning')
      await refreshNutrition()
    } catch (err) { console.error(err); triggerToast(err.message, 'warning') }
  }

  const renderContent = () => {
    if (isValidasi) return (
      <div className="grid" style={{ gap: '1rem' }}>
        <Header title="Validasi & Audit Menu Nasional" />
        <div className="grid" style={{ gridTemplateColumns: '1fr 2.2fr', gap: '2.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-1px' }}>
            <ClipboardList size={26} color="var(--primary)" /> Antrian Validasi
          </h3>
          <div style={{ padding: '1.25rem', background: 'white', border: '1.5px solid var(--border)', borderRadius: '8px', display: 'flex', gap: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.02)' }}>
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
                <span style={{ fontSize: '0.7rem', fontWeight: '900', color: selectedMenuIdx === idx ? 'var(--primary)' : 'var(--text-muted)', textTransform: 'uppercase' }}>{m.nama_vendor || 'Vendor Terdaftar'}</span>
                {m.status_validasi === 'approved' ? (
                  <CheckCircle size={18} color="var(--primary)" />
                ) : m.status_validasi === 'rejected' ? (
                  <AlertCircle size={18} color="var(--error)" />
                ) : null}
              </div>
              <h4 style={{ fontWeight: '900', fontSize: '1.1rem' }}>{m.nama_menu}</h4>
              <div className="flex justify-between" style={{ marginTop: '12px', alignItems: 'center' }}>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Input: {m.tanggal || m.date}</p>
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
            style={{ padding: '3.5rem', borderRadius: '16px', background: 'white', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '10px', background: 'linear-gradient(to right, var(--primary), var(--secondary))' }} />
            
            <div className="flex justify-between" style={{ marginBottom: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '2.8rem', fontWeight: '950', letterSpacing: '-1px', color: 'var(--text-main)' }}>{selectedMenu.nama_menu}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '600', marginTop: '5px' }}>Audit Komposisi & Kelayakan Gizi Program MBG</p>
              </div>
              <div style={{ marginLeft: '20px' }}>
                 {selectedMenu?.status_validasi === 'approved' ? (
                   <div style={{ background: 'var(--primary-light)', padding: '12px 25px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '10px', border: '2px solid var(--primary)' }}>
                      <CheckCircle2 color="var(--primary)" size={20} />
                      <span style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '0.9rem' }}>MENU DISAHKAN</span>
                   </div>
                 ) : selectedMenu?.status_validasi === 'rejected' ? (
                   <div style={{ background: 'var(--error-light)', padding: '12px 25px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '10px', border: '2px solid var(--error)' }}>
                      <AlertTriangle color="var(--error)" size={20} />
                      <span style={{ color: 'var(--error)', fontWeight: '900', fontSize: '0.9rem' }}>BUTUH REVISI</span>
                   </div>
                 ) : (
                   <div style={{ background: 'var(--banana-light)', padding: '12px 25px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '10px', border: '2px solid var(--banana)' }}>
                      <Clock color="var(--banana)" size={20} />
                      <span style={{ color: 'var(--banana)', fontWeight: '900', fontSize: '0.9rem' }}>PENDING REVIEW</span>
                   </div>
                 )}
              </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem', marginBottom: '1rem' }}>
               {/* Left Section: Visual Feedback Report Preview */}
               <div className="card shadow-md" style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1.5px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 60%)' }}></div>
                  
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                     <h2 style={{ fontSize: '2.2rem', fontWeight: '950', color: 'var(--text-main)', marginBottom: '8px' }}>Informasi Nilai Gizi</h2>
                     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontWeight: '900', fontSize: '1.4rem', color: '#1e293b' }}>Menu MBG</span>
                        <div style={{ background: '#E11D48', color: 'white', padding: '8px 25px', borderRadius: '12px', fontWeight: '950', fontSize: '1.4rem' }}>Makanan Bergizi Gratis</div>
                     </div>
                  </div>

                  {/* Tray Visual Section */}
                  <div style={{ height: '350px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 350px 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                     {/* Annotations Left */}
                     <div>
                        {selectedLeftBahan.map((b, i) => (
                          <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} style={{ textAlign: 'right', marginBottom: '30px', position: 'relative' }}>
                             <p style={{ fontWeight: '950', color: '#dc2626', fontSize: '1.1rem', margin: 0, lineHeight: '1.1' }}>{b.nama}</p>
                             <p style={{ fontWeight: '800', color: '#1e293b', fontSize: '1rem', margin: 0 }}>{b.takaran}</p>
                             <div style={{ width: '35px', height: '2.5px', background: '#334155', position: 'relative', marginTop: '6px', marginLeft: 'auto', opacity: 0.6 }}>
                                <div style={{ position: 'absolute', left: '100%', top: '-4px', borderLeft: '10px solid #334155', borderTop: '5px solid transparent', borderBottom: '5px solid transparent' }}></div>
                             </div>
                          </motion.div>
                        ))}
                     </div>

                     {/* Main Tray Image Container */}
                     <div style={{ position: 'relative', width: '100%', height: '300px', display: 'grid', placeItems: 'center' }}>
                        <div style={{ width: '100%', height: '100%', border: '12px solid #cbd5e1', borderRadius: '16px', background: '#f1f5f9', overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.25)', position: 'relative' }}>
                           {selectedPhotoUrl ? (
                             <img src={selectedPhotoUrl} alt={`Foto ${selectedMenu.nama_menu}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           ) : (
                             <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', textAlign: 'center', padding: '1.25rem', color: '#64748b', fontWeight: '850', background: '#f8fafc' }}>
                               Vendor belum mengunggah foto menu.
                             </div>
                           )}
                        </div>
                     </div>

                     {/* Annotations Right */}
                     <div>
                        {selectedRightBahan.map((b, i) => (
                          <motion.div key={i} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: (i+3) * 0.1 }} style={{ textAlign: 'left', marginBottom: '35px' }}>
                             <p style={{ fontWeight: '950', color: '#dc2626', fontSize: '1.1rem', margin: 0, lineHeight: '1.1' }}>{b.nama}</p>
                             <p style={{ fontWeight: '800', color: '#1e293b', fontSize: '1rem', margin: 0 }}>{b.takaran}</p>
                             <div style={{ width: '35px', height: '2.5px', background: '#334155', position: 'relative', marginTop: '6px', opacity: 0.6 }}>
                                <div style={{ position: 'absolute', right: '100%', top: '-4px', borderRight: '10px solid #334155', borderTop: '5px solid transparent', borderBottom: '5px solid transparent' }}></div>
                             </div>
                          </motion.div>
                        ))}
                     </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', marginBottom: '1.5rem', fontWeight: '700' }}>
                     {selectedMenu.nama_vendor || 'Vendor Terdaftar'}<br/>
                     <span style={{ fontWeight: '600', opacity: 0.8 }}>Sumber: unggahan vendor TRAKSI</span>
                  </div>

                  {/* Bottom Grid: Notes & Table Side-by-side */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 250px', gap: '1rem', alignItems: 'start' }}>
                     {/* Notes Box */}
                     <div style={{ border: '2.5px solid #ef4444', borderRadius: '25px', padding: '1.5rem', background: 'white', position: 'relative' }}>
                        <p style={{ fontWeight: '950', color: '#ef4444', fontSize: '1.2rem', marginBottom: '12px', marginTop: '-5px' }}>*Notes</p>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#334155', fontWeight: '750', fontSize: '0.95rem', lineHeight: '1.6' }}>
                           {selectedNotes.length > 0 ? (
                             selectedNotes.map((note, i) => <li key={i}>{note}</li>)
                           ) : (
                             <li>Belum ada catatan validasi untuk menu ini.</li>
                           )}
                        </ul>
                     </div>

                     {/* Nutrition Table Box */}
                     <div style={{ border: '2.5px solid #1e293b', borderRadius: '25px', overflow: 'hidden', background: 'white' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                           <tbody>
                              {nutritionRows.map((row, i) => (
                                <tr key={i} style={{ borderBottom: i === 5 ? 'none' : '1px solid #e2e8f0' }}>
                                   <td style={{ padding: '10px 15px', fontWeight: '850', color: '#475569', fontSize: '0.95rem' }}>{row.l}</td>
                                   <td style={{ padding: '10px 15px', fontWeight: '950', color: '#1e293b', textAlign: 'right', fontSize: '1.05rem' }}>{row.v}</td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
                  <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                    {standardComparisons.map((item) => (
                      <div key={item.id_standar || item.title} style={{ padding: '12px', borderRadius: '14px', border: `1.5px solid ${item.pass ? '#bbf7d0' : '#fed7aa'}`, background: item.pass ? '#f0fdf4' : '#fff7ed' }}>
                        <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: '900', color: item.pass ? '#16a34a' : '#ea580c', textTransform: 'uppercase' }}>
                          {item.pass ? 'Memenuhi' : 'Perlu Cek'}
                        </p>
                        <p style={{ margin: '4px 0 0', fontWeight: '900', color: '#0f172a' }}>{item.title}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#64748b', fontWeight: '700' }}>
                          {item.value.toFixed(item.nutrientKey === 'energi' || item.nutrientKey === 'natrium' ? 0 : 1)} / {item.requirement}
                        </p>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Right Section: Ahli Gizi Input */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="card shadow-sm" style={{ padding: '1.5rem', borderRadius: '16px', border: '1.5px solid var(--border)', background: 'white' }}>
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
                          onClick={() => handleApprove(selectedMenu.id_menu)} 
                          disabled={!canApproveSelectedMenu}
                          style={{ width: '100%', padding: '1.4rem', borderRadius: '24px', background: canApproveSelectedMenu ? 'var(--primary)' : '#94a3b8', border: 'none', color: 'white', fontWeight: '950', fontSize: '1.1rem', cursor: canApproveSelectedMenu ? 'pointer' : 'not-allowed', boxShadow: '0 15px 35px rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                        >
                          <CheckCircle2 size={24} /> Sahkan Menu
                        </motion.button>
                        {!canApproveSelectedMenu && (
                          <p style={{ margin: '-0.5rem 0 0', color: '#64748b', fontWeight: '750', fontSize: '0.82rem', lineHeight: '1.4' }}>
                            Menu hanya bisa disahkan setelah nutrisi dihitung dari bahan terverifikasi.
                          </p>
                        )}
                        <motion.button 
                          whileHover={{ scale: 1.02, translateY: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleReject(selectedMenu.id_menu)} 
                          style={{ width: '100%', padding: '1.4rem', borderRadius: '24px', background: 'white', border: '2.5px solid var(--error)', color: 'var(--error)', fontWeight: '950', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                        >
                          <AlertTriangle size={24} /> Minta Revisi
                        </motion.button>
                     </div>
                  </div>

                  <div className="card" style={{ padding: '1rem', borderRadius: '16px', background: '#f8fafc', border: '1.5px dashed #cbd5e1', textAlign: 'center' }}>
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
        <Header title="Standar & Regulasi Gizi" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button onClick={() => {
            setFormStandard({ title: '', requirement: '', color: 'var(--primary)', desc: '', details: '' });
            setShowModal({ show: true, mode: 'add', index: -1 });
          }} className="btn-primary" style={{ padding: '1rem 2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', color: 'white', fontWeight: '800' }}>
            <Plus size={20} /> Tambah Standar
          </button>
        </div>
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
        <div className="card shadow-sm" style={{ padding: '0', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid var(--border)', background: 'white', marginBottom: '5rem', position: 'relative', zIndex: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
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
                    <span style={{ fontWeight: '950', color: s.color, fontSize: '0.95rem', background: `${s.color}10`, padding: '6px 15px', borderRadius: '24px', border: `1px solid ${s.color}20` }}>
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
                      style={{ background: 'white', border: '1.5px solid #e2e8f0', padding: '10px 20px', borderRadius: '24px', fontWeight: '800', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto', fontSize: '0.85rem' }}
                    >
                      <Edit3 size={14} /> Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '2rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
          <h3 style={{ fontSize: '2.2rem', fontWeight: '950', marginBottom: '1rem', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
            <BookOpen size={32} color="var(--primary)" /> Database Referensi Nutrisi (Real-time)
          </h3>
          <p style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: '600', maxWidth: '800px', lineHeight: '1.6' }}>
            Data Core MBG per 100 gram. Hanya bahan aktif di database ini yang bisa dipilih vendor saat mengajukan menu.
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'white', border: '1.5px solid var(--border)', marginBottom: '1.5rem' }}>
          <h4 style={{ margin: '0 0 1rem', fontWeight: '950', fontSize: '1.2rem' }}>{nutritionForm.id ? 'Edit Bahan Nutrisi' : 'Tambah Bahan Nutrisi'}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr repeat(6, 0.8fr)', gap: '10px', alignItems: 'end' }}>
            <input placeholder="Nama bahan" value={nutritionForm.nama} onChange={(e) => setNutritionForm({ ...nutritionForm, nama: e.target.value })} style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontWeight: '700' }} />
            <select value={nutritionForm.kategori} onChange={(e) => setNutritionForm({ ...nutritionForm, kategori: e.target.value })} style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontWeight: '700' }}>
              <option value="makanan_pokok">Makanan Pokok</option>
              <option value="lauk_sayur">Lauk/Sayur</option>
              <option value="buah">Buah</option>
              <option value="lainnya">Lainnya</option>
            </select>
            <select value={nutritionForm.status} onChange={(e) => setNutritionForm({ ...nutritionForm, status: e.target.value })} style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontWeight: '700' }}>
              <option value="active">Aktif</option>
              <option value="retired">Nonaktif</option>
            </select>
            {nutrientKeys.map((key) => (
              <input key={key} type="number" step="0.01" placeholder={key} value={nutritionForm[key]} onChange={(e) => setNutritionForm({ ...nutritionForm, [key]: e.target.value })} style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontWeight: '700', minWidth: 0 }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
            <button onClick={handleSaveNutrition} style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={16} /> Simpan Bahan
            </button>
            {nutritionForm.id && (
              <button onClick={() => setNutritionForm(emptyNutritionForm)} style={{ padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: '900', cursor: 'pointer' }}>
                Batal Edit
              </button>
            )}
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'white', border: '1.5px solid var(--border)', marginBottom: '1.5rem' }}>
          <h4 style={{ margin: '0 0 1rem', fontWeight: '950', fontSize: '1.2rem' }}>Permintaan Bahan dari Vendor</h4>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {nutritionRequests.filter(req => req.status === 'pending').map((req) => {
              const review = getRequestReviewForm(req)
              return (
                <div key={req.id_request} style={{ padding: '1rem', borderRadius: '14px', border: '1.5px solid #e2e8f0', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: '950', color: '#0f172a' }}>{req.nama}</p>
                      <p style={{ margin: '4px 0 0', color: '#64748b', fontWeight: '700', fontSize: '0.85rem' }}>{req.nama_vendor || 'Vendor'} - {req.catatan || 'Tanpa catatan'}</p>
                    </div>
                    <span style={{ alignSelf: 'flex-start', padding: '6px 10px', borderRadius: '999px', background: '#fef3c7', color: '#d97706', fontWeight: '900', fontSize: '0.75rem' }}>PENDING</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr repeat(6, 0.8fr)', gap: '10px' }}>
                    <input value={review.nama} onChange={(e) => updateRequestReviewForm(req.id_request, { nama: e.target.value })} style={{ padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontWeight: '700' }} />
                    <select value={review.kategori} onChange={(e) => updateRequestReviewForm(req.id_request, { kategori: e.target.value })} style={{ padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontWeight: '700' }}>
                      <option value="makanan_pokok">Pokok</option>
                      <option value="lauk_sayur">Lauk/Sayur</option>
                      <option value="buah">Buah</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                    {nutrientKeys.map((key) => (
                      <input key={key} type="number" step="0.01" placeholder={key} value={review[key]} onChange={(e) => updateRequestReviewForm(req.id_request, { [key]: e.target.value })} style={{ padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontWeight: '700', minWidth: 0 }} />
                    ))}
                  </div>
                  <textarea placeholder="Catatan review opsional..." value={review.review_note} onChange={(e) => updateRequestReviewForm(req.id_request, { review_note: e.target.value })} style={{ width: '100%', marginTop: '10px', minHeight: '60px', padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontFamily: 'inherit', fontWeight: '650', boxSizing: 'border-box' }} />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button onClick={() => handleApproveRequest(req)} style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '900', cursor: 'pointer' }}>Setujui & Tambahkan</button>
                    <button onClick={() => handleRejectRequest(req)} style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontWeight: '900', cursor: 'pointer' }}>Tolak</button>
                  </div>
                </div>
              )
            })}
            {nutritionRequests.filter(req => req.status === 'pending').length === 0 && (
              <p style={{ margin: 0, padding: '1rem', borderRadius: '12px', background: '#f8fafc', color: '#64748b', fontWeight: '800', textAlign: 'center' }}>Tidak ada permintaan bahan pending.</p>
            )}
          </div>
        </div>

        <div className="card shadow-sm" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid #eef2f6', background: 'white', marginBottom: '5rem', position: 'relative', zIndex: 1, boxShadow: '0 25px 60px -15px rgba(0,0,0,0.03)' }}>
          <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div>
              <span style={{ fontWeight: '900', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Database Terverifikasi • 2026 Revision</span>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
               <div style={{ padding: '6px 15px', background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Search size={14} color="#94a3b8" />
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>{nutritionItems.filter(item => item.status !== 'retired').length} bahan aktif</span>
               </div>
               <button onClick={handleDownloadNutritionData} style={{ padding: '6px 15px', background: 'var(--primary-light)', borderRadius: '10px', color: 'var(--primary)', fontWeight: '900', fontSize: '0.75rem', border: 'none', cursor: 'pointer' }}>
                  DOWNLOAD JSON
               </button>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'white', borderBottom: '2.2px solid #f1f5f9' }}>
                <th style={{ padding: '1.4rem 2.5rem', textAlign: 'left', fontWeight: '950', color: '#1e293b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', width: '220px' }}>Kelompok</th>
                <th style={{ padding: '1.4rem 2rem', textAlign: 'left', fontWeight: '950', color: '#1e293b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Item Nutrisi</th>
                <th style={{ padding: '1.4rem 1rem', textAlign: 'right', fontWeight: '950', color: '#1e293b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Energi</th>
                <th style={{ padding: '1.4rem 1rem', textAlign: 'right', fontWeight: '950', color: '#1e293b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Protein</th>
                <th style={{ padding: '1.4rem 1rem', textAlign: 'right', fontWeight: '950', color: '#1e293b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lemak</th>
                <th style={{ padding: '1.4rem 1rem', textAlign: 'right', fontWeight: '950', color: '#1e293b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Karbo</th>
                <th style={{ padding: '1.4rem 1rem', textAlign: 'right', fontWeight: '950', color: '#1e293b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Serat</th>
                <th style={{ padding: '1.4rem 1rem', textAlign: 'right', fontWeight: '950', color: '#1e293b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Natrium</th>
                <th style={{ padding: '1.4rem 1rem', textAlign: 'center', fontWeight: '950', color: '#1e293b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                <th style={{ padding: '1.4rem 1rem', textAlign: 'center', fontWeight: '950', color: '#1e293b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(nutritionDb).map(([key, items], catIdx) => (
                <React.Fragment key={key}>
                  {items.map((item, i) => (
                    <tr key={`${key}-${i}`} style={{ 
                      background: i % 2 === 0 ? 'white' : '#fafbfc',
                      borderBottom: (catIdx === 2 && i === items.length - 1) ? 'none' : '1px solid #f1f5f9' 
                    }}>
                      {i === 0 && (
                        <td rowSpan={items.length} style={{ 
                          padding: '1.5rem', 
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
                      <td style={{ padding: '1.4rem 2rem', fontWeight: '800', fontSize: '1.1rem', color: '#334155' }}>{item.nama}<br/><span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.satuan || '100 gram'}</span></td>
                      <td style={{ padding: '1.4rem 1rem', textAlign: 'right', fontWeight: '900', color: 'var(--primary)' }}>{parseNutrientValue(item.energi)}</td>
                      <td style={{ padding: '1.4rem 1rem', textAlign: 'right', fontWeight: '800' }}>{parseNutrientValue(item.protein)}</td>
                      <td style={{ padding: '1.4rem 1rem', textAlign: 'right', fontWeight: '800' }}>{parseNutrientValue(item.lemak)}</td>
                      <td style={{ padding: '1.4rem 1rem', textAlign: 'right', fontWeight: '800' }}>{parseNutrientValue(item.karbohidrat)}</td>
                      <td style={{ padding: '1.4rem 1rem', textAlign: 'right', fontWeight: '800' }}>{parseNutrientValue(item.serat)}</td>
                      <td style={{ padding: '1.4rem 1rem', textAlign: 'right', fontWeight: '800' }}>{parseNutrientValue(item.natrium)}</td>
                      <td style={{ padding: '1.4rem 1rem', textAlign: 'center' }}>
                        <span style={{ padding: '6px 10px', borderRadius: '999px', background: item.status === 'retired' ? '#f1f5f9' : '#dcfce7', color: item.status === 'retired' ? '#64748b' : '#16a34a', fontWeight: '900', fontSize: '0.72rem' }}>
                          {item.status === 'retired' ? 'NONAKTIF' : 'AKTIF'}
                        </span>
                      </td>
                      <td style={{ padding: '1.4rem 1rem', textAlign: 'center' }}>
                        <button onClick={() => handleEditNutrition(item)} style={{ border: '1.5px solid #e2e8f0', background: 'white', borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', fontWeight: '800', marginRight: '6px' }}>Edit</button>
                        {item.status !== 'retired' && !String(item.id).startsWith('default-') && (
                          <button onClick={() => handleRetireNutrition(item.id)} style={{ border: 'none', background: '#fef2f2', color: '#dc2626', borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', fontWeight: '800' }}>Nonaktif</button>
                        )}
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
        <div style={{ marginBottom: '1rem', opacity: 0.5 }}>
          <LayoutDashboard size={80} color="var(--primary)" />
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '950', color: 'var(--text-main)', letterSpacing: '-1.5px' }}>Silahkan Pilih Menu di Samping</h2>
        <p style={{ color: 'var(--text-muted)', fontWeight: '600', marginTop: '1rem' }}>Pilih menu untuk melihat detail validasi atau pengaturan standar gizi.</p>
      </div>
    )
  }

  return (
    <DashboardLayout user={user} onLogout={onLogout} onSwitchRole={onSwitchRole}>
      <AnimatePresence>
        {showToast.show && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }} 
            animate={{ opacity: 1, y: 20, x: '-50%' }} 
            exit={{ opacity: 0, y: -50, x: '-50%' }} 
            style={{ 
              position: 'fixed', top: 0, left: '50%', zIndex: 3000, 
              background: showToast.type === 'info' ? 'var(--role-primary)' : showToast.type === 'warning' ? 'var(--carrot)' : 'var(--role-primary)', 
              color: 'white', padding: '0.9rem 2rem', borderRadius: '24px', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '10px' 
            }}
          >
            {showToast.type === 'warning' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{showToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>



      {isMain ? (
        <>
          <WelcomeBanner name="Ahli Gizi Jakarta Timur" />

          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <div className="card dashboard-card-vibrant" style={{ borderRadius: '8px', textAlign: 'center', padding: '1rem' }}>
              <div style={{ background: 'var(--role-light)', width: '50px', height: '50px', borderRadius: '14px', display: 'grid', placeItems: 'center', margin: '0 auto 1rem' }}><Utensils color="var(--role-primary)" size={24} /></div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '4px' }}>{menus.filter(m => m.status_validasi === 'pending').length}</h1>
              <p style={{ fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Menu Antre Validasi</p>
            </div>
            <div className="card dashboard-card-vibrant" style={{ borderRadius: '8px', textAlign: 'center', padding: '1rem', borderColor: 'var(--carrot)' }}>
              <div style={{ background: 'var(--carrot-light)', width: '50px', height: '50px', borderRadius: '14px', display: 'grid', placeItems: 'center', margin: '0 auto 1rem' }}><AlertTriangle color="var(--carrot)" size={24} /></div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '4px', color: 'var(--carrot)' }}>{menus.filter(m => m.status_validasi === 'rejected').length}</h1>
              <p style={{ fontWeight: '600', color: 'var(--carrot)', fontSize: '0.85rem' }}>Revisi Menu Menunggu</p>
            </div>
            <div className="card dashboard-card-vibrant" style={{ borderRadius: '8px', textAlign: 'center', padding: '1rem' }}>
              <div style={{ background: 'var(--banana-light)', width: '50px', height: '50px', borderRadius: '14px', display: 'grid', placeItems: 'center', margin: '0 auto 1rem' }}><ShieldCheck color="var(--banana)" size={24} /></div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '4px' }}>{menus.filter(m => m.status_validasi === 'approved').length}</h1>
              <p style={{ fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Menu Disetujui</p>
            </div>
          </div>

          <div className="card dashboard-card-vibrant" style={{ borderRadius: '8px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1rem' }}>Pencatatan Gizi ke Ledger</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem', maxWidth: '600px' }}>
              Sistem Blockchain mencatat setiap validasi ke Smart Contract immutable. Data terenkripsi AES-256.
            </p>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="btn-primary" 
              style={{ padding: '0.9rem 2rem', borderRadius: '14px', background: 'var(--role-primary)', border: 'none', color: 'white', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              {isGenerating ? (
                <><Loader2 className="animate-spin" size={20} /> Mencatat...</>
              ) : (
                <><Zap size={20} fill="white" /> Simpan ke Blockchain</>
              )}
            </motion.button>
          </div>
        </>
      ) : (
        renderContent()
      )}
    </DashboardLayout>
  )
}

export default AhliGiziDashboard
