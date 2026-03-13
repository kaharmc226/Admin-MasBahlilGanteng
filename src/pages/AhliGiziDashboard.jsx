import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  ShieldCheck, 
  Microscope, 
  Utensils, 
  AlertCircle, 
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
  MessageCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockData } from '../data/mockData'

// --- Sub-components (Moved Outside to prevent re-mounting issues) ---

const Motif = ({ icon: Icon, top, right, bottom, left, color }) => (
  <div style={{ position: 'absolute', top, right, bottom, left, opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}>
    <Icon size={120} color={color} />
  </div>
)

const Header = ({ title, subtitle, showAdd = false, onAdd }) => (
  <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '950', letterSpacing: '-2px' }}>{title}</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '600' }}>{subtitle}</p>
    </div>
    {showAdd && (
      <button onClick={onAdd} className="btn-primary" style={{ padding: '1rem 2rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', color: 'white', fontWeight: '800' }}>
        <Plus size={20} /> Tambah Standar
      </button>
    )}
  </div>
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

const AhliGiziDashboard = () => {
  const location = useLocation()
  const [showModal, setShowModal] = useState({ show: false, mode: 'add', index: -1 })
  const [selectedMenuIdx, setSelectedMenuIdx] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showToast, setShowToast] = useState({ show: false, message: '', type: 'success' })
  const [validationStatus, setValidationStatus] = useState({})
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

  const menus = mockData.menus
  const selectedMenu = menus[selectedMenuIdx] || menus[0]

  useEffect(() => {
    // Audit AI Real-time dari Python Backend
    const fetchAiAudit = async () => {
      setIsAiLoading(true)
      try {
        const response = await fetch('http://localhost:8000/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ komposisi: selectedMenu.komposisi })
        })
        const data = await response.json()
        if (data.error) throw new Error(data.error)
        
        // Menambahkan Jeda Buatan (UX Delay) agar animasi "Analyzing" terlihat
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setAiResult(data)
      } catch (err) {
        console.warn("AI Server Offline, menggunakan data simulasi.")
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAiResult({
          calories: selectedMenu.nilai_gizi.calories,
          protein: String(selectedMenu.nilai_gizi.protein).replace('g', ''),
          fat: String(selectedMenu.nilai_gizi.fat).replace('g', ''),
          algorithm: "Simulation Mode (Static)"
        })
      } finally {
        setIsAiLoading(false)
      }
    }

    fetchAiAudit()
    setAhliSuggestion('')
  }, [selectedMenuIdx, selectedMenu.komposisi])

  const triggerToast = (message, type = 'success') => {
    setShowToast({ show: true, message, type })
    setTimeout(() => setShowToast({ show: false, message: '', type: 'success' }), 4000)
  }

  const handleGenerateReport = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      triggerToast('Laporan Gizi Nasional Berhasil Dibuat & Diunduh!', 'success')
    }, 3000)
  }

  const handleApprove = (id) => {
    setValidationStatus(prev => ({ ...prev, [id]: 'approved' }))
    triggerToast('Menu berhasil disahkan untuk distribusi nasional.')
    if (ahliSuggestion) {
      console.log(`Catatan Internal Ahli Gizi untuk menu ${id}: ${ahliSuggestion}`)
    }
  }

  const handleReject = (id) => {
    setValidationStatus(prev => ({ ...prev, [id]: 'rejected' }))
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
                <span style={{ fontSize: '0.7rem', fontWeight: '900', color: selectedMenuIdx === idx ? 'var(--primary)' : 'var(--text-muted)', textTransform: 'uppercase' }}>Vendor #{m.id_vendor}</span>
                {validationStatus[m.id] === 'approved' ? (
                  <CheckCircle size={18} color="var(--primary)" />
                ) : validationStatus[m.id] === 'rejected' ? (
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
            className="card" 
            style={{ padding: '3.5rem', borderRadius: '45px', background: 'white', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '10px', background: 'linear-gradient(to right, var(--primary), var(--secondary))' }} />
            
            <div className="flex justify-between" style={{ marginBottom: '3rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '2.8rem', fontWeight: '950', letterSpacing: '-1.5px', color: 'var(--text-main)' }}>{selectedMenu.nama_menu}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '600', marginTop: '5px' }}>Audit Komposisi & Kelayakan Gizi Program MBG</p>
              </div>
              <div style={{ marginLeft: '20px' }}>
                 {validationStatus[selectedMenu.id] === 'approved' ? (
                   <div style={{ background: 'var(--primary-light)', padding: '12px 25px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '10px', border: '2px solid var(--primary)' }}>
                      <CheckCircle2 color="var(--primary)" size={20} />
                      <span style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '0.9rem' }}>MENU DISAHKAN</span>
                   </div>
                 ) : validationStatus[selectedMenu.id] === 'rejected' ? (
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

            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '4rem' }}>
               <div style={{ padding: '2.5rem', background: 'var(--bg)', borderRadius: '35px', border: '1.5px solid var(--border)' }}>
                  <h4 style={{ fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                    <Activity color="var(--primary)" /> Hasil Prediksi Audit AI
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: '600' }}>Sistem AI memindai nutrisi berdasarkan bahan baku. Harap verifikasi akurasi data di bawah:</p>
                  
                  <div style={{ display: 'grid', gap: '1.2rem' }}>
                     {/* Helper function to determine color based on standards */}
                     {(() => {
                        const getStatusColor = (val, reqStr) => {
                           if (isAiLoading || !val) return 'var(--text-main)';
                           // Extract numbers from something like "20g - 35g"
                           const numbers = reqStr.match(/\d+(\.\d+)?/g);
                           if (!numbers) return 'var(--text-main)';
                           const min = parseFloat(numbers[0]);
                           const value = parseFloat(val);
                           return value < min ? 'var(--error)' : 'var(--primary)';
                        };

                        return (
                           <>
                              <div className="flex justify-between" style={{ paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ fontWeight: '700' }}>Estimasi Kalori</span> 
                                <span style={{ fontWeight: '950', color: getStatusColor(aiResult?.calories, standards[1].requirement), fontSize: '1.1rem' }}>
                                  {isAiLoading ? 'Analyzing...' : `${aiResult?.calories} kcal`}
                                </span>
                              </div>
                              <div className="flex justify-between" style={{ paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ fontWeight: '700' }}>Estimasi Protein</span> 
                                <span style={{ fontWeight: '950', color: getStatusColor(aiResult?.protein, standards[0].requirement), fontSize: '1.1rem' }}>
                                  {isAiLoading ? 'Analyzing...' : `${aiResult?.protein}g`}
                                </span>
                              </div>
                              <div className="flex justify-between" style={{ paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ fontWeight: '700' }}>Estimasi Lemak</span> 
                                <span style={{ fontWeight: '950', color: getStatusColor(aiResult?.fat, standards[2].requirement), fontSize: '1.1rem' }}>
                                  {isAiLoading ? 'Analyzing...' : `${aiResult?.fat}g`}
                                </span>
                              </div>
                           </>
                        );
                     })()}
                     <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'var(--primary-light)', borderRadius: '20px', border: '2px dashed var(--primary)' }}>
                        <p style={{ fontSize: '0.95rem', color: 'var(--primary)', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ShieldCheck size={20}/> {isAiLoading ? 'Processing...' : `AI: ${aiResult?.algorithm}`}
                        </p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '8px', fontWeight: '600' }}>
                          {isAiLoading ? 'Machine learning model sedang membedah komposisi...' : 'Kandungan nutrisi diprediksi sesuai dengan standar Nasional MBG.'}
                        </p>
                     </motion.div>
                  </div>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div>
                    <h4 style={{ fontWeight: '900', marginBottom: '1rem', fontSize: '1.2rem' }}>Komposisi & Bahan Baku</h4>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: '1.6', fontWeight: '600', background: 'var(--bg)', padding: '2rem', borderRadius: '30px', border: '1px solid var(--border)' }}>
                      <p style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '900', marginBottom: '8px', textTransform: 'uppercase' }}>Detail Bahan - {selectedMenu.nama_menu}</p>
                      {selectedMenu.komposisi}
                    </div>
                  </div>

                  <div>
                     <h4 style={{ fontWeight: '900', marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <MessageCircle size={20} color="var(--secondary)" /> Berikan Rekomendasi Anda
                     </h4>
                     <textarea 
                       value={ahliSuggestion}
                       onChange={(e) => setAhliSuggestion(e.target.value)}
                       placeholder="Ketik saran atau catatan audit gizi di sini (misal: kurangi penggunaan garam, tambahkan buah jeruk)..."
                       style={{ 
                         width: '100%', height: '120px', padding: '1.5rem', borderRadius: '25px', 
                         border: '2px solid var(--border)', background: 'var(--secondary-light)', 
                         outline: 'none', fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)',
                         transition: 'all 0.3s'
                       }}
                       onFocus={(e) => e.target.style.borderColor = 'var(--secondary)'}
                       onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                     />
                  </div>
               </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleApprove(selectedMenu.id)} 
                className="btn-primary" 
                style={{ flex: 1.8, padding: '1.8rem', borderRadius: '50px', background: 'linear-gradient(to right, var(--primary), var(--secondary))', border: 'none', color: 'white', fontWeight: '950', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 15px 40px rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
              >
                <CheckCircle2 size={24} /> Sahkan (Approve Menu)
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleReject(selectedMenu.id)} 
                className="btn-outline" 
                style={{ flex: 1, padding: '1.8rem', borderRadius: '50px', fontWeight: '900', fontSize: '1.2rem', color: 'var(--error)', borderColor: 'var(--error)' }}
              >
                Minta Revisi
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    )

    if (isStandar) return (
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header 
          title="Standar Nutrisi Nasional" 
          subtitle="Manajemen dan edit aturan baku kandungan gizi MBG." 
          showAdd 
          onAdd={() => {
            setFormStandard({ title: '', requirement: '', color: 'var(--primary)', desc: '', details: '' });
            setShowModal({ show: true, mode: 'add', index: -1 });
          }} 
        />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
          {standards.map((s, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -12 }} 
              key={i} 
              className="card" 
              style={{ padding: '3.5rem', borderRadius: '45px', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.03)' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: s.color }} />
              <div style={{ background: `${s.color}15`, width: '100px', height: '100px', borderRadius: '30px', display: 'grid', placeItems: 'center', margin: '0 auto 2.5rem' }}>
                 <ShieldCheck color={s.color} size={48} />
              </div>
              <h4 style={{ fontSize: '2rem', fontWeight: '950', marginBottom: '12px', letterSpacing: '-0.5px' }}>{s.title}</h4>
              <div style={{ display: 'inline-block', padding: '10px 25px', background: 'var(--bg)', borderRadius: '50px', fontWeight: '950', color: s.color, marginBottom: '2rem', fontSize: '1.1rem', border: `1.5px solid ${s.color}30` }}>{s.requirement}</div>
              <p style={{ color: 'var(--text-main)', fontWeight: '700', lineHeight: '1.6', marginBottom: '1.5rem', minHeight: '50px' }}>{s.desc}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500', lineHeight: '1.6', background: 'var(--bg)', padding: '1.5rem', borderRadius: '20px', textAlign: 'left' }}>{s.details}</p>
              
              <button 
                onClick={() => openEditModal(i)}
                style={{ marginTop: '2.5rem', width: '100%', background: 'none', border: `1.5px solid var(--border)`, padding: '1.2rem', borderRadius: '50px', fontWeight: '900', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s' }} 
                onMouseEnter={(e) => {e.currentTarget.style.borderColor = s.color; e.currentTarget.style.color = s.color}} 
                onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-main)'}}
              >
                <Edit3 size={18} /> Edit Data Standar
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    )

    return (
      <div style={{ textAlign: 'center', padding: '5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-muted)' }}>Silahkan Pilih Menu di Samping</h2>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
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
        {isMain ? (
          <motion.div 
            key="ahligizi-main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
               <div>
                  <h1 style={{ fontSize: '3rem', fontWeight: '950', letterSpacing: '-2.5px' }}>Dashboard Ahli Gizi</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: '600' }}>Pusat Audit & Standarisasi Gizi Nasional MBG.</p>
               </div>
               <div style={{ padding: '15px 35px', background: 'var(--primary-light)', borderRadius: '25px', border: '1px solid var(--primary)', display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <Activity size={32} color="var(--primary)" />
                  <div>
                     <p style={{ fontWeight: '950', fontSize: '1.5rem' }}>OVERSIGHT</p>
                     <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px' }}>SYSTEM ACTIVE</p>
                  </div>
               </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', marginBottom: '4rem' }}>
              <div className="card" style={{ borderRadius: '40px', textAlign: 'center', padding: '3.5rem', background: 'white' }}>
                 <div style={{ background: 'var(--primary-light)', width: '70px', height: '70px', borderRadius: '22px', display: 'grid', placeItems: 'center', margin: '0 auto 1.5rem' }}><Utensils color="var(--primary)" size={32} /></div>
                 <h1 style={{ fontSize: '3.5rem', fontWeight: '950', marginBottom: '8px', color: 'var(--text-main)' }}>{menus.length}</h1>
                 <p style={{ fontWeight: '800', color: 'var(--text-muted)', fontSize: '1rem' }}>Menu Antre Validasi</p>
              </div>
              <div className="card" style={{ borderRadius: '40px', textAlign: 'center', padding: '3.5rem', background: 'white' }}>
                 <div style={{ background: 'var(--carrot-light)', width: '70px', height: '70px', borderRadius: '22px', display: 'grid', placeItems: 'center', margin: '0 auto 1.5rem' }}><AlertTriangle color="var(--carrot)" size={32} /></div>
                 <h1 style={{ fontSize: '3.5rem', fontWeight: '950', marginBottom: '8px', color: 'var(--carrot)' }}>1</h1>
                 <p style={{ fontWeight: '800', color: 'var(--carrot)', fontSize: '1rem' }}>Peringatan Kandungan</p>
              </div>
              <div className="card" style={{ borderRadius: '40px', textAlign: 'center', padding: '3.5rem', background: 'white' }}>
                 <div style={{ background: 'var(--banana-light)', width: '70px', height: '70px', borderRadius: '22px', display: 'grid', placeItems: 'center', margin: '0 auto 1.5rem' }}><ShieldCheck color="var(--banana)" size={32} /></div>
                 <h1 style={{ fontSize: '3.5rem', fontWeight: '950', marginBottom: '8px', color: 'var(--text-main)' }}>99.7%</h1>
                 <p style={{ fontWeight: '800', color: 'var(--text-muted)', fontSize: '1rem' }}>Kepatuhan Gizi</p>
              </div>
            </div>

            <div className="card" style={{ borderRadius: '50px', padding: '4.5rem', background: 'white', display: 'flex', gap: '5rem', alignItems: 'center', border: '1.5px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
               <div style={{ position: 'absolute', top: '-50px', right: '-50px', opacity: 0.05 }}><FileText size={400} /></div>
               <div style={{ flex: 1.5, position: 'relative', zIndex: 1 }}>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: '950', marginBottom: '1.5rem', letterSpacing: '-1.5px' }}>Otomatisasi Laporan Gizi (AI)</h3>
                  <p style={{ fontSize: '1.3rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '3rem', fontWeight: '500' }}>
                    Sistem kami menganalisis ribuan data menu harian untuk menyusun laporan kesehatan nasional secara otomatis. Berikan hasil audit Anda langsung ke pusat data pemerintah.
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
                        Membangun Laporan...
                      </>
                    ) : (
                      <>
                        <Zap size={24} fill="white" />
                        Generate Health Report
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
          </motion.div>
        ) : (
          <motion.div 
            key={isValidasi ? 'validasi' : isStandar ? 'standar' : 'sub'}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AhliGiziDashboard
