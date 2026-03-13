import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  School, 
  Utensils, 
  Truck, 
  CheckCircle2, 
  Star, 
  MessageSquare, 
  Clock, 
  MapPin,
  Fingerprint,
  Users,
  AlertTriangle,
  History,
  Info,
  ChevronRight,
  Camera,
  Apple,
  Leaf,
  Carrot,
  Plus,
  X,
  User
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockData } from '../data/mockData'

// --- Sub-components (Moved Outside) ---

const Motif = ({ icon: Icon, top, right, bottom, left, color }) => (
  <div style={{ position: 'absolute', top, right, bottom, left, opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}>
    <Icon size={120} color={color} />
  </div>
)

const Header = ({ title, subtitle, showAdd = false, onAdd, isFeedback }) => (
  <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '950', letterSpacing: '-2px' }}>{title}</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '600' }}>{subtitle}</p>
    </div>
    {showAdd && (
      <button onClick={onAdd} className="btn-primary" style={{ padding: '1rem 2rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', color: 'white', fontWeight: '800' }}>
        <Plus size={20} /> {isFeedback ? 'Tulis Feedback' : 'Tambah Laporan'}
      </button>
    )}
  </div>
)

const AddFormModal = ({ onClose, isFeedback }) => {
  const getFields = () => {
    if (isFeedback) return (
      <>
        <div>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Nama Siswa / Kelas</label>
          <input placeholder="Contoh: Budi - Kelas 4A" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Rating Rasa (1-5)</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[1,2,3,4,5].map(s => <Star key={s} size={32} color="var(--banana)" fill={s <= 4 ? "var(--banana)" : "none"} style={{ cursor: 'pointer' }} />)}
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Pesan / Kesan</label>
          <textarea placeholder="Makanannya enak sekali!" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)', height: '100px' }} />
        </div>
      </>
    )
    return (
      <>
        <div>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Judul Kendala</label>
          <input placeholder="Contoh: Keterlambatan Pengiriman" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Tingkat Urgensi</label>
          <select style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }}>
            <option>Rendah</option>
            <option>Sedang</option>
            <option>Tinggi (Segera)</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px' }}>Deskripsi Detail</label>
          <textarea placeholder="Jelaskan detail kendala..." style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)', height: '100px' }} />
        </div>
      </>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'grid', placeItems: 'center', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="card" style={{ width: '90%', maxWidth: '550px', padding: '3.5rem', borderRadius: '45px', position: 'relative' }}>
         <button onClick={onClose} style={{ position: 'absolute', top: '25px', right: '25px', background: 'var(--bg)', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><X size={20}/></button>
         <h2 style={{ marginBottom: '2.5rem', fontWeight: '950', fontSize: '2.4rem', letterSpacing: '-1.5px' }}>{isFeedback ? 'Beri Feedback' : 'Lapor Kendala'}</h2>
         <div style={{ display: 'grid', gap: '1.5rem' }}>
            {getFields()}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
               <button onClick={onClose} className="btn-outline" style={{ flex: 1, borderRadius: '50px', padding: '1.2rem', fontWeight: '800' }}>Batal</button>
               <button onClick={onClose} className="btn-primary" style={{ flex: 1, borderRadius: '50px', border: 'none', color: 'white', fontWeight: '900', background: 'linear-gradient(to right, var(--primary), var(--secondary))' }}>Kirim</button>
            </div>
         </div>
      </motion.div>
    </motion.div>
  )
}

const SekolahDashboard = () => {
  const location = useLocation()
  const [showAddForm, setShowAddForm] = useState(false)
  
  const path = location.pathname.replace(/\/$/, '')
  const isMain = path === '/sekolah'
  const isKonfirmasi = path === '/sekolah/konfirmasi'
  const isFeedback = path === '/sekolah/feedback'

  const deliveryStatus = {
    id: mockData.distribution[0].id,
    vendor: 'Dapur Berkah Jaya',
    status: 'Dalam Perjalanan',
    estimatedTime: '11:45 WIB',
    portions: 350,
    menu: mockData.menus[0].nama_menu
  }

  const renderContent = () => {
    if (isKonfirmasi) return (
      <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '2rem', position: 'relative', zIndex: 1, width: '100%' }}>
        <div className="card" style={{ padding: '3.5rem', borderRadius: '40px', background: 'white' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-1px' }}>Penerimaan Menu</h2>
          <div style={{ marginBottom: '3rem', padding: '2rem', background: 'var(--primary-light)', borderRadius: '24px', border: '1px solid var(--primary)' }}>
             <p style={{ fontWeight: '900', fontSize: '1.4rem', marginBottom: '8px' }}>{deliveryStatus.menu}</p>
             <p style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '800' }}>📦 Estimasi Tiba: {deliveryStatus.estimatedTime} | 350 Porsi</p>
          </div>
          
          <div style={{ padding: '3rem', border: '2px dashed var(--carrot)', borderRadius: '32px', textAlign: 'center', background: 'var(--carrot-light)' }}>
             <Camera size={54} color="var(--carrot)" style={{ marginBottom: '1.5rem', opacity: 0.6 }} />
             <p style={{ fontWeight: '900', fontSize: '1.3rem', color: 'var(--carrot)' }}>Ambil Foto Bukti Serah Terima</p>
             <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontWeight: '600' }}>Wajib melampirkan foto makanan yang diterima di lokasi sekolah.</p>
             <button className="btn-primary" style={{ padding: '1.2rem 3.5rem', borderRadius: '50px', background: 'var(--carrot)', border: 'none', color: 'white', fontWeight: '800' }}>Aktifkan Kamera</button>
          </div>
          <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem' }}>
             <button className="btn-primary" style={{ flex: 1, padding: '1.4rem', borderRadius: '22px', background: 'var(--secondary)', border: 'none', color: 'white', fontWeight: '900', fontSize: '1.1rem', boxShadow: '0 10px 25px rgba(34, 197, 94, 0.2)' }}>Konfirmasi Sesuai (350 Porsi)</button>
             <button className="btn-outline" style={{ flex: 1, padding: '1.4rem', borderRadius: '22px', color: 'var(--error)', borderColor: 'var(--error)', fontWeight: '900', fontSize: '1.1rem' }}>Lapor Selisih Porsi</button>
          </div>
        </div>
        <div className="card" style={{ padding: '2.5rem', borderRadius: '32px' }}>
          <h3 style={{ marginBottom: '2rem', fontWeight: '900', fontSize: '1.4rem' }}>Riwayat Distribusi</h3>
          <div style={{ display: 'grid', gap: '1.2rem' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ padding: '1.5rem', background: 'var(--bg)', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                    <p style={{ fontWeight: '900' }}>Selasa, 11 Maret</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Status: Tiba Tepat Waktu</p>
                 </div>
                 <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px' }}><CheckCircle2 color="white" size={20} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
    if (isFeedback) return (
      <div className="grid" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div className="card" style={{ padding: '4.5rem', borderRadius: '45px', maxWidth: '850px', margin: '0 auto', boxShadow: '0 40px 80px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '950', marginBottom: '1rem', letterSpacing: '-2px' }}>Suara Siswa</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3.5rem', fontSize: '1.2rem', fontWeight: '500' }}>Feedback ini langsung terhubung ke dashboard ahli gizi nasional.</p>
          
          <div style={{ marginBottom: '4rem' }}>
            <p style={{ fontWeight: '950', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Bagaimana rasa "{deliveryStatus.menu}" hari ini?</p>
            <div style={{ display: 'flex', gap: '20px' }}>
               {[1,2,3,4,5].map(s => <motion.div whileHover={{ scale: 1.2 }} key={s}><Star size={54} fill={s <= 4 ? "var(--banana)" : "none"} color="var(--banana)" style={{ cursor: 'pointer' }} /></motion.div>)}
            </div>
          </div>
          
          <div style={{ marginBottom: '4rem' }}>
             <p style={{ fontWeight: '950', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Catatan Tambahan dari Sekolah</p>
             <textarea placeholder="Contoh: Sayurnya sangat segar, anak-anak suka!" style={{ width: '100%', height: '180px', padding: '2rem', borderRadius: '30px', border: '2px solid var(--border)', background: 'var(--bg)', outline: 'none', fontSize: '1.1rem', fontWeight: '500', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
          </div>
          
          <button onClick={() => setShowAddForm(true)} className="btn-primary" style={{ width: '100%', borderRadius: '60px', padding: '1.5rem', fontSize: '1.2rem', fontWeight: '900', background: 'linear-gradient(to right, var(--primary), var(--secondary))', border: 'none', color: 'white', boxShadow: '0 15px 30px rgba(16, 185, 129, 0.2)' }}>Tulis Feedback Baru</button>
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
        {showAddForm && <AddFormModal onClose={() => setShowAddForm(false)} isFeedback={isFeedback} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isMain ? (
          <motion.div 
            key="sekolah-main"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
              <div>
                 <h1 style={{ fontSize: '3rem', fontWeight: '950', letterSpacing: '-2.5px', color: 'var(--text-main)' }}>{mockData.schools[0].nama_sekolah}</h1>
                 <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: '600' }}>Pusat Penerimaan Gizi Nasional Wilayah Indonesia.</p>
              </div>
              <div style={{ padding: '20px 35px', background: 'var(--banana-light)', borderRadius: '25px', display: 'flex', gap: '20px', alignItems: 'center', border: '1px solid var(--banana)' }}>
                 <div style={{ background: 'white', padding: '12px', borderRadius: '15px', boxShadow: '0 8px 15px rgba(234, 179, 8, 0.1)' }}><Users size={32} color="var(--banana)" /></div>
                 <div>
                    <p style={{ fontWeight: '950', fontSize: '1.6rem', lineHeight: '1' }}>{mockData.schools[0].jumlah_siswa}</p>
                    <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--banana)', letterSpacing: '1px' }}>SISWA TERDATA</p>
                 </div>
              </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', gap: '3rem' }}>
              <div className="card" style={{ background: 'var(--primary)', color: 'white', padding: '4rem', borderRadius: '50px', border: 'none', boxShadow: '0 35px 70px rgba(16, 185, 129, 0.25)', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}><Apple size={200} color="white" /></div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <span style={{ background: 'rgba(255,255,255,0.25)', padding: '10px 25px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '900', backdropFilter: 'blur(10px)' }}>BATCH: {deliveryStatus.id}</span>
                  <p style={{ fontSize: '1.2rem', fontWeight: '700', marginTop: '2.5rem', opacity: 0.9 }}>MENU UTAMA HARI INI:</p>
                  <h2 style={{ fontSize: '3.8rem', fontWeight: '950', marginTop: '1rem', letterSpacing: '-2px' }}>{deliveryStatus.menu}</h2>
                  
                  <div style={{ marginTop: '4rem', display: 'flex', gap: '3rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '2.5rem' }}>
                    <div>
                       <p style={{ fontSize: '0.8rem', fontWeight: '900', opacity: 0.7, textTransform: 'uppercase' }}>Estimasi Tiba</p>
                       <p style={{ fontSize: '1.4rem', fontWeight: '900' }}>{deliveryStatus.estimatedTime}</p>
                    </div>
                    <div>
                       <p style={{ fontSize: '0.8rem', fontWeight: '900', opacity: 0.7, textTransform: 'uppercase' }}>Status</p>
                       <p style={{ fontSize: '1.4rem', fontWeight: '900' }}>{deliveryStatus.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '2rem' }}>
                <div className="card" style={{ borderRadius: '35px', padding: '2.5rem', background: 'var(--carrot)', color: 'white', border: 'none', boxShadow: '0 20px 40px rgba(249, 115, 22, 0.2)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <p style={{ fontWeight: '900', fontSize: '1.1rem' }}>Saran Penyajian</p>
                      <Info size={24} />
                   </div>
                   <p style={{ fontSize: '1.1rem', lineHeight: '1.6', fontWeight: '700' }}>Pastikan makanan disajikan dalam keadaan hangat sesuai protokol standar gizi MBG.</p>
                </div>
                
                <div className="card" style={{ borderRadius: '35px', padding: '2.5rem', border: '1px solid var(--border)' }}>
                   <h3 style={{ fontWeight: '900', marginBottom: '1.5rem' }}>Bantuan Cepat</h3>
                   <div style={{ display: 'grid', gap: '1rem' }}>
                      <button style={{ width: '100%', textAlign: 'left', padding: '1.2rem', borderRadius: '18px', background: 'var(--bg)', border: 'none', color: 'var(--text-main)', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                         Hubungi Vendor <ChevronRight size={18} />
                      </button>
                      <button onClick={() => setShowAddForm(true)} style={{ width: '100%', textAlign: 'left', padding: '1.2rem', borderRadius: '18px', background: 'var(--bg)', border: 'none', color: 'var(--text-main)', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                         Laporkan Kendala <ChevronRight size={18} />
                      </button>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key={path} 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            {isKonfirmasi && <Header title="Konfirmasi Kedatangan" subtitle="Manajemen bukti serah terima logistik gizi nasional." showAdd onAdd={() => setShowAddForm(true)} />}
            {isFeedback && <Header title="Pusat Feedback Sekolah" subtitle="Suara institusi untuk standar gizi masa depan." />}
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SekolahDashboard
