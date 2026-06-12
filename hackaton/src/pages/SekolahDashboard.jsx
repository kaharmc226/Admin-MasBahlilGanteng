import React, { useState, useEffect } from 'react'
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
  User,
  ShieldCheck,
  Zap,
  HardDrive
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockData } from '../data/mockData'
import api from '../api'
import DashboardLayout from '../components/DashboardLayout'

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
  const [rating, setRating] = useState(4);
  
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
            {[1,2,3,4,5].map(s => <Star key={s} size={32} color="var(--banana)" fill={s <= rating ? "var(--banana)" : "none"} style={{ cursor: 'pointer' }} onClick={() => setRating(s)} />)}
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
    <motion.div 
      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
      style={{ overflow: 'hidden', marginBottom: '2rem' }}
    >
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', width: '100%', border: '1.5px solid var(--border)' }}>
         <h2 style={{ marginBottom: '2.5rem', fontWeight: '950', fontSize: '2rem', letterSpacing: '-1px' }}>{isFeedback ? 'Beri Feedback' : 'Lapor Kendala'}</h2>
         <div style={{ display: 'grid', gap: '1.5rem' }}>
            {getFields()}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
               <button onClick={onClose} style={{ flex: 1, padding: '1.2rem', borderRadius: '50px', border: '2px solid var(--border)', background: 'transparent', color: 'var(--text-main)', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer' }}>Batal</button>
               <button onClick={() => {
                 alert(isFeedback ? "✅ Feedback berhasil dikirm ke Ahli Gizi Pusat!" : "⚠️ Kendala berhasil dilaporkan ke Vendor & Pemerintah!");
                 onClose();
               }} className="btn-primary" style={{ flex: 1, padding: '1.2rem', borderRadius: '50px', border: 'none', color: 'white', fontWeight: '900', fontSize: '1.1rem', background: 'var(--primary)', cursor: 'pointer' }}>Kirim</button>
            </div>
         </div>
      </div>
    </motion.div>
  )
}

const SekolahDashboard = ({ user, onLogout }) => {
  const location = useLocation()
  const [showAddForm, setShowAddForm] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState(4)
  
  const path = location.pathname.replace(/\/$/, '')
  const isMain = path === '/sekolah'
  const isKonfirmasi = path === '/sekolah/konfirmasi'
  const isFeedback = path === '/sekolah/feedback'

  const [distribusi, setDistribusi] = useState([])
  const [feedback, setFeedback] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dist, fb] = await Promise.all([api.getDistribusi(), api.getFeedback()])
        setDistribusi(dist)
        setFeedback(fb)
      } catch (err) { console.error('Failed to fetch:', err) }
    }
    fetchData()
  }, [])

  const activeDelivery = distribusi[0] ? {
    id: distribusi[0].kode_transaksi,
    vendor: 'Dapur Sehat Nusantara',
    status: distribusi[0].status,
    time: distribusi[0].waktu_kirim ? new Date(distribusi[0].waktu_kirim).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : '-',
    menuName: distribusi[0].nama_menu || 'Menu Hari Ini',
    progress: distribusi[0].status === 'SELESAI' ? 100 : 50
  } : {
    id: 'TX-0000',
    vendor: 'Menunggu Vendor...',
    status: 'Sistem Standby',
    time: '-',
    menuName: 'Belum ada jadwal',
    progress: 0
  }

  const renderContent = () => {
    if (isKonfirmasi) return (
      <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '2rem', position: 'relative', zIndex: 1, width: '100%' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <AnimatePresence>
            {showAddForm && <AddFormModal onClose={() => setShowAddForm(false)} isFeedback={false} />}
          </AnimatePresence>
        </div>
        <div className="card dashboard-card-vibrant" style={{ padding: '3.5rem', borderRadius: '40px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-1px' }}>Logistik Tiba</h2>
          <div className="animate-pulse-glow" style={{ marginBottom: '3rem', padding: '2.5rem', background: 'var(--primary-light)', borderRadius: '24px', border: '2px solid var(--primary)' }}>
             <p style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '0.9rem', marginBottom: '10px', textTransform: 'uppercase' }}>Kedatangan Hari Ini</p>
             <h3 style={{ fontWeight: '950', fontSize: '2rem', marginBottom: '8px' }}>{activeDelivery.menuName}</h3>
             <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: '700' }}>📦 Status: {activeDelivery.status} | Estimasi: {activeDelivery.time}</p>
          </div>
          
          <div style={{ padding: '3rem', border: '3px dashed var(--border)', borderRadius: '32px', textAlign: 'center', background: 'var(--bg)', marginBottom: '2.5rem' }}>
             <Camera size={64} color="var(--primary)" style={{ marginBottom: '1.5rem', opacity: 0.4 }} />
             <p style={{ fontWeight: '950', fontSize: '1.4rem', color: 'var(--text-main)' }}>Bukti Serah Terima</p>
             <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontWeight: '600', maxWidth: '400px', margin: '0 auto 2.5rem' }}>Ambil foto makanan yang diterima untuk validasi transparansi blockchain.</p>
             <button onClick={() => alert("📸 Membuka Kamera Perangkat... Audit GPS Aktif.")} className="btn-primary" style={{ padding: '1.5rem 3.5rem', borderRadius: '60px', border: 'none', color: 'white', fontWeight: '900', cursor: 'pointer', fontSize: '1.1rem' }}>Aktifkan Kamera</button>
          </div>
          
          <div style={{ display: 'flex', gap: '2rem' }}>
             <button onClick={() => alert("✅ Konfirmasi Berhasil! Data dikunci ke Ledger Nasional.")} className="btn-primary" style={{ flex: 1.5, padding: '1.5rem', borderRadius: '30px', border: 'none', color: 'white', fontWeight: '950', fontSize: '1.2rem', cursor: 'pointer' }}>Konfirmasi Sesuai</button>
             <button onClick={() => setShowAddForm(true)} className="btn-outline" style={{ flex: 1, padding: '1.5rem', borderRadius: '30px', color: 'var(--error)', borderColor: 'var(--error)', fontWeight: '900', cursor: 'pointer' }}>Lapor Selisih</button>
          </div>
        </div>
        
        <div className="grid" style={{ alignContent: 'start', gap: '2rem' }}>
          <div className="card dashboard-card-vibrant" style={{ padding: '2.5rem', borderRadius: '35px' }}>
            <h3 style={{ marginBottom: '2rem', fontWeight: '950', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}><History color="var(--primary)" /> Riwayat 3 Hari</h3>
            <div style={{ display: 'grid', gap: '1.2rem' }}>
              {[
                { date: '13 Mar 2026', menu: 'Nasi Kuning Special', status: 'Selesai' },
                { date: '12 Mar 2026', menu: 'Ayam Kecap Madu', status: 'Selesai' },
                { date: '11 Mar 2026', menu: 'Sup Bakso Sehat', status: 'Selesai' }
              ].map((h, i) => (
                <div key={i} style={{ padding: '1.5rem', background: 'var(--bg)', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                      <p style={{ fontWeight: '900', fontSize: '1rem' }}>{h.date}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>{h.menu}</p>
                   </div>
                   <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px' }}><CheckCircle2 color="white" size={20} /></div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card dashboard-card-vibrant" style={{ padding: '2.5rem', borderRadius: '35px', background: 'var(--carrot)', color: 'white', border: 'none' }}>
             <h4 style={{ fontWeight: '950', marginBottom: '1rem', fontSize: '1.3rem' }}>Bantuan Logistik</h4>
             <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.6', fontWeight: '600' }}>Jika armada pengiriman terlambat lebih dari 30 menit dari estimasi, segera hubungi satgas wilayah.</p>
             <button style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', borderRadius: '15px', background: 'white', color: 'var(--carrot)', border: 'none', fontWeight: '900' }}>Hubungi Satgas</button>
          </div>
        </div>
      </div>
    )
    if (isFeedback) return (
      <div className="grid" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <AnimatePresence>
          {showAddForm && <AddFormModal onClose={() => setShowAddForm(false)} isFeedback={true} />}
        </AnimatePresence>
        <div className="card" style={{ padding: '4.5rem', borderRadius: '45px', maxWidth: '850px', margin: '0 auto', boxShadow: '0 40px 80px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '950', marginBottom: '1rem', letterSpacing: '-2px' }}>Suara Siswa</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3.5rem', fontSize: '1.2rem', fontWeight: '500' }}>Feedback ini langsung terhubung ke dashboard ahli gizi nasional.</p>
          
          <div style={{ marginBottom: '4rem' }}>
            <p style={{ fontWeight: '950', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Bagaimana rasa "{activeDelivery.menuName}" hari ini?</p>
            <div style={{ display: 'flex', gap: '20px' }}>
               {[1,2,3,4,5].map(s => <motion.div whileHover={{ scale: 1.2 }} key={s}><Star size={54} fill={s <= feedbackRating ? "var(--banana)" : "none"} color="var(--banana)" style={{ cursor: 'pointer' }} onClick={() => setFeedbackRating(s)} /></motion.div>)}
            </div>
          </div>
          
          <div style={{ marginBottom: '4rem' }}>
             <p style={{ fontWeight: '950', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Catatan Tambahan dari Sekolah</p>
             <textarea placeholder="Contoh: Sayurnya sangat segar, anak-anak suka!" style={{ width: '100%', height: '180px', padding: '2rem', borderRadius: '30px', border: '2px solid var(--border)', background: 'var(--bg)', outline: 'none', fontSize: '1.1rem', fontWeight: '500', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
          </div>
          
          <button onClick={() => {alert("✅ Rating siswa dan feedback telah masuk log blockchain gizi nasional."); setShowAddForm(true);}} className="btn-primary" style={{ width: '100%', borderRadius: '60px', padding: '1.5rem', fontSize: '1.2rem', fontWeight: '900', background: 'linear-gradient(to right, var(--primary), var(--secondary))', border: 'none', color: 'white', boxShadow: '0 15px 30px rgba(16, 185, 129, 0.2)', cursor: 'pointer' }}>Kirim Penilaian Cepat & Tulis Laporan Detail</button>
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
    <DashboardLayout user={user} onLogout={onLogout}>
      {isMain ? (
        <>
          <AnimatePresence>
            {showAddForm && <AddFormModal onClose={() => setShowAddForm(false)} isFeedback={false} />}
          </AnimatePresence>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-1px' }}>SDN 06 Baru</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>Pusat Penerimaan Gizi Nasional — Jakarta Timur</p>
            </div>
            <div style={{ padding: '12px 24px', background: 'var(--banana-light)', borderRadius: '14px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid var(--banana)' }}>
              <Users size={20} color="var(--banana)" />
              <div>
                <p style={{ fontWeight: '800', fontSize: '1.2rem', lineHeight: '1' }}>404</p>
                <p style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--banana)' }}>SISWA TERDATA</p>
              </div>
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
            <div className="card" style={{ background: 'var(--role-primary)', color: 'white', padding: '2.5rem', borderRadius: '20px', border: 'none', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '700' }}>ID TRANS: {activeDelivery.id}</span>
                <p style={{ fontSize: '0.9rem', fontWeight: '600', marginTop: '1.5rem', opacity: 0.8 }}>MENU UTAMA HARI INI:</p>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginTop: '0.5rem', letterSpacing: '-1px', color: 'white' }}>{activeDelivery.menuName}</h2>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.5rem' }}>
                  <div>
                    <p style={{ fontSize: '0.7rem', fontWeight: '700', opacity: 0.7 }}>Update Waktu</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white' }}>{activeDelivery.time}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.7rem', fontWeight: '700', opacity: 0.7 }}>Status</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white' }}>{activeDelivery.status}</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="card" style={{ borderRadius: '16px', padding: '1.5rem', background: 'var(--carrot)', color: 'white', border: 'none' }}>
                <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Saran Penyajian</p>
                <p style={{ fontSize: '0.85rem', lineHeight: '1.5', fontWeight: '500' }}>Pastikan makanan disajikan dalam keadaan hangat sesuai protokol standar gizi MBG.</p>
              </div>
              
              <div className="card" style={{ borderRadius: '16px', padding: '1.5rem' }}>
                <h4 style={{ fontWeight: '700', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Bantuan Cepat</h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <button style={{ width: '100%', textAlign: 'left', padding: '0.8rem', borderRadius: '10px', background: 'var(--bg)', border: 'none', color: 'var(--text-main)', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    Hubungi Vendor <ChevronRight size={16} />
                  </button>
                  <button onClick={() => setShowAddForm(true)} style={{ width: '100%', textAlign: 'left', padding: '0.8rem', borderRadius: '10px', background: 'var(--bg)', border: 'none', color: 'var(--text-main)', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    Laporkan Kendala <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {isKonfirmasi && <Header title="Konfirmasi Kedatangan" subtitle="Manajemen bukti serah terima logistik gizi nasional." showAdd onAdd={() => setShowAddForm(true)} />}
          {isFeedback && <Header title="Pusat Feedback Sekolah" subtitle="Suara institusi untuk standar gizi masa depan." />}
          {renderContent()}
        </>
      )}
    </DashboardLayout>
  )
}

export default SekolahDashboard
