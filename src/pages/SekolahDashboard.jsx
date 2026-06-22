import React, { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
import api from '../api'
import DashboardLayout from '../components/DashboardLayout'

const deliveryPriority = {
  TIBA: 0,
  DISTRIBUSI: 1,
  DIJADWALKAN: 2,
  SELESAI: 3
}

const deliveryProgress = {
  DIJADWALKAN: 35,
  DISTRIBUSI: 80,
  TIBA: 95,
  SELESAI: 100
}

// --- Sub-components (Moved Outside) ---

const Motif = ({ icon: Icon, top, right, bottom, left, color }) => (
  <div style={{ position: 'absolute', top, right, bottom, left, opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}>
    <Icon size={120} color={color} />
  </div>
)

const Header = ({ title, subtitle, showAdd = false, onAdd, isFeedback }) => (
  <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '950', letterSpacing: '-2px' }}>{title}</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '600' }}>{subtitle}</p>
    </div>
    {showAdd && (
      <button onClick={onAdd} className="btn-primary" style={{ padding: '1rem 2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', color: 'white', fontWeight: '800' }}>
        <Plus size={20} /> {isFeedback ? 'Tulis Feedback' : 'Tambah Laporan'}
      </button>
    )}
  </div>
)

const AddFormModal = ({ onClose, isFeedback, activeDelivery, user, onNotify }) => {
  const [rating, setRating] = useState(4);
  const [fields, setFields] = useState({
    nama_siswa: '',
    komentar: '',
    judul: '',
    urgency: 'Sedang',
    deskripsi: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  
  const handleActionSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      if (isFeedback) {
        await api.createFeedback({
          id_sekolah: activeDelivery.id_sekolah,
          id_user: user.id_user,
          id_menu: activeDelivery.id_menu || null,
          rating: rating,
          komentar: `[${fields.nama_siswa || 'Anonim'}] ${fields.komentar || 'Tidak ada catatan.'}`,
          kategori: 'kualitas'
        })
        onNotify?.('Feedback berhasil dikirim ke Ahli Gizi Pusat!', 'success')
      } else {
        await api.createAlert({
          judul: fields.judul || 'Kendala Sekolah',
          deskripsi: fields.deskripsi || 'Tidak ada deskripsi.',
          severity: fields.urgency === 'Tinggi (Segera)' ? 'warning' : (fields.urgency === 'Sedang' ? 'info' : 'info'),
          wilayah: 'Jakarta Timur'
        })
        onNotify?.('Kendala berhasil dilaporkan ke Vendor dan Pemerintah!', 'warning')
      }
      onClose();
    } catch (err) {
      console.error(err)
      onNotify?.(`Gagal mengirim data: ${err.message}`, 'warning')
    } finally {
      setIsSaving(false)
    }
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
              <h2 style={{ fontWeight: '950', fontSize: '1.8rem', color: '#0f172a', letterSpacing: '-0.5px' }}>{isFeedback ? 'Beri Feedback' : 'Lapor Kendala'}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', marginTop: '4px' }}>
                {isFeedback ? 'Bagikan ulasan gizi dan cita rasa makanan.' : 'Laporkan hambatan atau isu distribusi.'}
              </p>
            </div>
            <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
              <X size={20} color="#64748b" />
            </button>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {isFeedback ? (
              <>
                <div>
                  <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>NAMA SISWA / KELAS</label>
                  <input required value={fields.nama_siswa} onChange={(e) => setFields({ ...fields, nama_siswa: e.target.value })} placeholder="Contoh: Budi - Kelas 4A" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>RATING CITA RASA (1-5)</label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={32} color="var(--banana)" fill={s <= rating ? "var(--banana)" : "none"} style={{ cursor: 'pointer' }} onClick={() => setRating(s)} />)}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>PESAN / CATATAN RASA</label>
                  <textarea required value={fields.komentar} onChange={(e) => setFields({ ...fields, komentar: e.target.value })} placeholder="Makanannya enak sekali dan porsinya pas!" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700', minHeight: '100px', fontFamily: 'inherit' }} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>JUDUL KENDALA</label>
                  <input required value={fields.judul} onChange={(e) => setFields({ ...fields, judul: e.target.value })} placeholder="Contoh: Keterlambatan Pengiriman" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>TINGKAT URGENSI</label>
                  <select value={fields.urgency} onChange={(e) => setFields({ ...fields, urgency: e.target.value })} style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700', background: 'white' }}>
                    <option>Rendah</option>
                    <option>Sedang</option>
                    <option>Tinggi (Segera)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>DESKRIPSI DETAIL KENDALA</label>
                  <textarea required value={fields.deskripsi} onChange={(e) => setFields({ ...fields, deskripsi: e.target.value })} placeholder="Jelaskan detail kendala secara rinci agar segera direspon..." style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700', minHeight: '100px', fontFamily: 'inherit' }} />
                </div>
              </>
            )}
          </div>
        </div>

        <button 
          onClick={handleActionSubmit}
          className="btn-primary" 
          disabled={isSaving}
          style={{ width: '100%', padding: '1.2rem', borderRadius: '24px', border: 'none', color: 'white', fontWeight: '900', fontSize: '1.1rem', marginTop: '2rem', cursor: 'pointer', opacity: isSaving ? 0.7 : 1 }}
        >
          {isSaving ? 'Mengirim Laporan...' : 'Kirim Laporan'}
        </button>
      </motion.div>
    </div>
  )
}

const SekolahDashboard = ({ user, onLogout, onSwitchRole }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showAddForm, setShowAddForm] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState(4)
  const [quickFeedbackNote, setQuickFeedbackNote] = useState('')
  const [showToast, setShowToast] = useState({ show: false, message: '', type: 'success' })
  
  const path = location.pathname.replace(/\/$/, '')
  const isMain = path === '/sekolah'
  const isKonfirmasi = path === '/sekolah/konfirmasi'
  const isFeedback = path === '/sekolah/feedback'

  const [distribusi, setDistribusi] = useState([])
  const [feedback, setFeedback] = useState([])
  const [schoolProfile, setSchoolProfile] = useState(null)
  const [konfirmasiHistory, setKonfirmasiHistory] = useState([])
  const [proofUpload, setProofUpload] = useState(null)
  const [proofPreview, setProofPreview] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)

  const triggerToast = (message, type = 'success') => {
    setShowToast({ show: true, message, type })
    setTimeout(() => setShowToast({ show: false, message: '', type: 'success' }), 3000)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dist, fb, matchedSchool, confirmations] = await Promise.all([api.getDistribusi(), api.getFeedback(), api.getSekolahByUser(user.id_user, { includeInactive: true }), api.getKonfirmasi()])
        setSchoolProfile(matchedSchool)
        const canOperate = matchedSchool && matchedSchool.status !== 'inactive'
        setDistribusi(canOperate ? dist.filter((item) => item.id_sekolah === matchedSchool.id_sekolah) : [])
        setKonfirmasiHistory(matchedSchool ? confirmations.filter((item) => item.id_sekolah === matchedSchool.id_sekolah) : [])
        setFeedback(fb)
      } catch (err) {
        console.error('Failed to fetch:', err)
        setSchoolProfile(null)
        setDistribusi([])
        setKonfirmasiHistory([])
      }
    }
    fetchData()
  }, [user?.id_user])

  const selectedDelivery = useMemo(() => {
    if (distribusi.length === 0) return null
    return [...distribusi].sort((a, b) => {
      const priorityDiff = (deliveryPriority[a.status] ?? 99) - (deliveryPriority[b.status] ?? 99)
      if (priorityDiff !== 0) return priorityDiff
      const aTime = new Date(a.waktu_tiba || a.waktu_kirim || a.created_at || 0).getTime()
      const bTime = new Date(b.waktu_tiba || b.waktu_kirim || b.created_at || 0).getTime()
      if (bTime !== aTime) return bTime - aTime
      return (b.id_distribusi || 0) - (a.id_distribusi || 0)
    })[0]
  }, [distribusi])

  const activeDelivery = selectedDelivery ? {
    id_distribusi: selectedDelivery.id_distribusi,
    id_sekolah: selectedDelivery.id_sekolah,
    id_menu: selectedDelivery.id_menu,
    jumlah_porsi: selectedDelivery.jumlah_porsi,
    id: selectedDelivery.kode_transaksi,
    vendor: 'Dapur Sehat Nusantara',
    status: selectedDelivery.status,
    time: (selectedDelivery.waktu_tiba || selectedDelivery.waktu_kirim) ? new Date(selectedDelivery.waktu_tiba || selectedDelivery.waktu_kirim).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : '-',
    menuName: selectedDelivery.nama_menu || 'Menu Hari Ini',
    progress: deliveryProgress[selectedDelivery.status] ?? 0
  } : {
    id_distribusi: null,
    id_sekolah: null,
    id_menu: null,
    id: 'TX-0000',
    vendor: 'Menunggu Vendor...',
    status: 'Sistem Standby',
    time: '-',
    menuName: 'Belum ada jadwal',
    progress: 0
  }

  const handleConfirmArrival = async () => {
    if (!activeDelivery.id_distribusi) {
      triggerToast('Tidak ada distribusi aktif saat ini.', 'warning')
      return
    }
    if (!['DISTRIBUSI', 'TIBA'].includes(activeDelivery.status)) {
      triggerToast('Konfirmasi kedatangan baru tersedia saat armada sudah berangkat atau tiba.', 'warning')
      return
    }
    if (!proofUpload) {
      triggerToast('Upload foto bukti serah terima terlebih dahulu.', 'warning')
      return
    }
    setIsConfirming(true)
    try {
      const uploaded = await api.uploadConfirmationPhoto({
        imageData: proofUpload.dataUrl,
        fileName: proofUpload.fileName
      })
      await api.createKonfirmasi({
        id_distribusi: activeDelivery.id_distribusi,
        id_user: user.id_user,
        kondisi_makanan: 'baik',
        jumlah_diterima: schoolProfile?.jumlah_siswa || activeDelivery.jumlah_porsi || 0,
        catatan: 'Diterima sesuai jadwal',
        foto_bukti: uploaded.foto_bukti
      })
      
      setDistribusi(prev => prev.map(d => d.id_distribusi === activeDelivery.id_distribusi ? { ...d, status: 'SELESAI' } : d))
      const confirmations = await api.getKonfirmasi()
      setKonfirmasiHistory(schoolProfile ? confirmations.filter((item) => item.id_sekolah === schoolProfile.id_sekolah) : confirmations)
      setProofUpload(null)
      setProofPreview('')
      triggerToast('Konfirmasi berhasil disimpan dengan foto bukti.')
    } catch (err) {
      console.error(err)
      triggerToast(`Gagal konfirmasi: ${err.message}`, 'warning')
    } finally {
      setIsConfirming(false)
    }
  }

  const handleProofFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setProofUpload({ dataUrl: reader.result, fileName: file.name })
      setProofPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleQuickFeedback = async () => {
    try {
      await api.createFeedback({
        id_sekolah: activeDelivery.id_sekolah,
        id_user: user.id_user,
        id_menu: activeDelivery.id_menu || null,
        rating: feedbackRating,
        komentar: quickFeedbackNote.trim() || 'Penilaian cepat dari halaman utama',
        kategori: 'kualitas'
      })
      triggerToast('Rating siswa dan feedback berhasil dikirim.')
      setQuickFeedbackNote('')
      setShowAddForm(true)
    } catch (err) {
      console.error(err)
      triggerToast(`Gagal mengirim feedback cepat: ${err.message}`, 'warning')
    }
  }

  const renderContent = () => {
    if (isKonfirmasi) return (
      <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '1rem', position: 'relative', zIndex: 1, width: '100%' }}>
        <div style={{ gridColumn: '1 / -1' }} />
        <div className="card dashboard-card-vibrant" style={{ padding: '3.5rem', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-1px' }}>Logistik Tiba</h2>
          <div className="animate-pulse-glow" style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--primary-light)', borderRadius: '12px', border: '2px solid var(--primary)' }}>
             <p style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '0.9rem', marginBottom: '10px', textTransform: 'uppercase' }}>Kedatangan Hari Ini</p>
             <h3 style={{ fontWeight: '950', fontSize: '2rem', marginBottom: '8px' }}>{activeDelivery.menuName}</h3>
             <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: '700' }}>📦 Status: {activeDelivery.status} | Estimasi: {activeDelivery.time}</p>
          </div>
          
          <div style={{ padding: '1.5rem', border: '3px dashed var(--border)', borderRadius: '16px', textAlign: 'center', background: 'var(--bg)', marginBottom: '1.5rem' }}>
             <Camera size={64} color="var(--primary)" style={{ marginBottom: '1.5rem', opacity: 0.4 }} />
             <p style={{ fontWeight: '950', fontSize: '1.4rem', color: 'var(--text-main)' }}>Bukti Serah Terima</p>
             <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: '600', maxWidth: '400px', margin: '0 auto 2.5rem' }}>Ambil foto makanan yang diterima untuk validasi transparansi blockchain.</p>
             {proofPreview && (
               <img src={proofPreview} alt="Preview bukti serah terima" style={{ width: '100%', maxWidth: '360px', height: '220px', objectFit: 'cover', borderRadius: '16px', marginBottom: '1rem', border: '4px solid white' }} />
             )}
             <label className="btn-primary" style={{ padding: '1.5rem 3.5rem', borderRadius: '60px', border: 'none', color: 'white', fontWeight: '900', cursor: 'pointer', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
               <Camera size={20} /> Upload / Ambil Foto
               <input type="file" accept="image/*" capture="environment" onChange={(e) => handleProofFile(e.target.files?.[0])} style={{ display: 'none' }} />
             </label>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
             <button onClick={handleConfirmArrival} disabled={isConfirming} className="btn-primary" style={{ flex: 1.5, padding: '1.5rem', borderRadius: '12px', border: 'none', color: 'white', fontWeight: '950', fontSize: '1.2rem', cursor: isConfirming ? 'wait' : 'pointer', opacity: isConfirming ? 0.75 : 1 }}>{isConfirming ? 'Menyimpan Bukti...' : 'Konfirmasi Sesuai'}</button>
             <button onClick={() => setShowAddForm(true)} className="btn-outline" style={{ flex: 1, padding: '1.5rem', borderRadius: '12px', color: 'var(--error)', borderColor: 'var(--error)', fontWeight: '900', cursor: 'pointer' }}>Lapor Selisih</button>
          </div>
        </div>
        
        <div className="grid" style={{ alignContent: 'start', gap: '1rem' }}>
          <div className="card dashboard-card-vibrant" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <h3 style={{ marginBottom: '1rem', fontWeight: '950', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}><History color="var(--primary)" /> Riwayat 3 Hari</h3>
            <div style={{ display: 'grid', gap: '1.2rem' }}>
              {(konfirmasiHistory.length > 0 ? konfirmasiHistory.slice(0, 3) : distribusi.length > 0 ? distribusi.slice(0, 3) : [
                { created_at: '2026-03-13T00:00:00Z', nama_menu: 'Nasi Kuning Special', jumlah_porsi: 404, status: 'SELESAI' },
                { created_at: '2026-03-12T00:00:00Z', nama_menu: 'Ayam Kecap Madu', jumlah_porsi: 404, status: 'SELESAI' },
                { created_at: '2026-03-11T00:00:00Z', nama_menu: 'Sup Bakso Sehat', jumlah_porsi: 404, status: 'SELESAI' }
              ]).map((h, i) => {
                const rawDate = h.waktu_konfirmasi || h.waktu_tiba || h.created_at || new Date().toISOString()
                const dateStr = new Date(rawDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                const isFinished = h.status === 'SELESAI' || h.status === 'TIBA';
                
                return (
                  <div key={i} style={{ padding: '1.5rem', background: 'var(--bg)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <p style={{ fontWeight: '900', fontSize: '1rem' }}>{dateStr}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>{h.nama_menu} ({h.jumlah_porsi} Porsi)</p>
                        {h.foto_bukti && <button onClick={() => window.open(api.assetUrl(h.foto_bukti), '_blank')} style={{ marginTop: '0.5rem', border: 'none', background: 'white', color: 'var(--primary)', borderRadius: '8px', padding: '0.35rem 0.6rem', fontWeight: '800', cursor: 'pointer' }}>Lihat Foto</button>}
                     </div>
                     <div style={{ background: isFinished ? 'var(--primary)' : 'var(--banana)', padding: '10px', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                       {isFinished ? <CheckCircle2 color="white" size={20} /> : <Clock color="white" size={20} />}
                     </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="card dashboard-card-vibrant" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--carrot)', color: 'white', border: 'none' }}>
             <h4 style={{ fontWeight: '950', marginBottom: '1rem', fontSize: '1.3rem' }}>Bantuan Logistik</h4>
             <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.6', fontWeight: '600' }}>Jika armada pengiriman terlambat lebih dari 30 menit dari estimasi, segera hubungi satgas wilayah.</p>
             <button onClick={() => setShowAddForm(true)} style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', borderRadius: '15px', background: 'white', color: 'var(--carrot)', border: 'none', fontWeight: '900', cursor: 'pointer' }}>Hubungi Satgas</button>
          </div>
        </div>
      </div>
    )
    if (isFeedback) return (
      <div className="grid" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div className="card" style={{ padding: '4.5rem', borderRadius: '16px', maxWidth: '850px', margin: '0 auto', boxShadow: '0 40px 80px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '950', marginBottom: '1rem', letterSpacing: '-2px' }}>Suara Siswa</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '500' }}>Feedback ini langsung terhubung ke dashboard ahli gizi nasional.</p>
          
          <div style={{ marginBottom: '4rem' }}>
            <p style={{ fontWeight: '950', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Bagaimana rasa "{activeDelivery.menuName}" hari ini?</p>
            <div style={{ display: 'flex', gap: '20px' }}>
               {[1,2,3,4,5].map(s => <motion.div whileHover={{ scale: 1.2 }} key={s}><Star size={54} fill={s <= feedbackRating ? "var(--banana)" : "none"} color="var(--banana)" style={{ cursor: 'pointer' }} onClick={() => setFeedbackRating(s)} /></motion.div>)}
            </div>
          </div>
          
          <div style={{ marginBottom: '4rem' }}>
             <p style={{ fontWeight: '950', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Catatan Tambahan dari Sekolah</p>
             <textarea value={quickFeedbackNote} onChange={(e) => setQuickFeedbackNote(e.target.value)} placeholder="Contoh: Sayurnya sangat segar, anak-anak suka!" style={{ width: '100%', height: '180px', padding: '1rem', borderRadius: '12px', border: '2px solid var(--border)', background: 'var(--bg)', outline: 'none', fontSize: '1.1rem', fontWeight: '500', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
          </div>
          
          <button onClick={handleQuickFeedback} className="btn-primary" style={{ width: '100%', borderRadius: '60px', padding: '1.5rem', fontSize: '1.2rem', fontWeight: '900', background: 'linear-gradient(to right, var(--primary), var(--secondary))', border: 'none', color: 'white', boxShadow: '0 15px 30px rgba(16, 185, 129, 0.2)', cursor: 'pointer' }}>Kirim Penilaian Cepat & Tulis Laporan Detail</button>
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
    <DashboardLayout user={user} onLogout={onLogout} onSwitchRole={onSwitchRole}>
      <AnimatePresence>
        {showToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -40, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -40, x: '-50%' }}
            style={{
              position: 'fixed',
              top: 0,
              left: '50%',
              zIndex: 3000,
              background: showToast.type === 'warning' ? 'var(--carrot)' : 'var(--role-primary)',
              color: 'white',
              padding: '0.9rem 1.5rem',
              borderRadius: '20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <ShieldCheck size={18} />
            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{showToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      {schoolProfile?.status === 'inactive' ? (
        <div className="card" style={{ padding: '2rem', borderRadius: '16px', background: '#fff7ed', border: '1px solid #fdba74' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '950', marginBottom: '0.75rem', color: '#9a3412' }}>Akun sekolah sedang nonaktif</h2>
          <p style={{ color: '#9a3412', fontWeight: '600', margin: 0 }}>Operasional distribusi, konfirmasi, dan feedback baru dinonaktifkan sampai Pemerintah mengaktifkan kembali sekolah ini.</p>
        </div>
      ) : isMain ? (
      
        <>
          <AnimatePresence>
            {showAddForm && <AddFormModal onClose={() => setShowAddForm(false)} isFeedback={false} activeDelivery={activeDelivery} user={user} onNotify={triggerToast} />}
          </AnimatePresence>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-1px' }}>{schoolProfile?.nama_sekolah || 'Sekolah MBG'}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>Pusat Penerimaan Gizi Nasional — Jakarta Timur</p>
            </div>
            <div style={{ padding: '12px 24px', background: 'var(--banana-light)', borderRadius: '14px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid var(--banana)' }}>
              <Users size={20} color="var(--banana)" />
              <div>
                <p style={{ fontWeight: '800', fontSize: '1.2rem', lineHeight: '1' }}>{schoolProfile?.jumlah_siswa ?? 0}</p>
                <p style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--banana)' }}>SISWA TERDATA</p>
              </div>
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
            <div className="card" style={{ background: 'var(--role-primary)', color: 'white', padding: '1.5rem', borderRadius: '8px', border: 'none', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '24px', fontSize: '0.75rem', fontWeight: '700' }}>ID TRANS: {activeDelivery.id}</span>
                <p style={{ fontSize: '0.9rem', fontWeight: '600', marginTop: '1.5rem', opacity: 0.8 }}>MENU UTAMA HARI INI:</p>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginTop: '0.5rem', letterSpacing: '-1px', color: 'white' }}>{activeDelivery.menuName}</h2>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.5rem' }}>
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
                  <button onClick={() => navigate('/sekolah/feedback')} style={{ width: '100%', textAlign: 'left', padding: '0.8rem', borderRadius: '10px', background: 'var(--bg)', border: 'none', color: 'var(--text-main)', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
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
          <AnimatePresence>
            {showAddForm && <AddFormModal onClose={() => setShowAddForm(false)} isFeedback={isFeedback} activeDelivery={activeDelivery} user={user} onNotify={triggerToast} />}
          </AnimatePresence>
          {renderContent()}
        </>
      )}
    </DashboardLayout>
  )
}

export default SekolahDashboard
