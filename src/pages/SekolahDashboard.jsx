import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  History,
  MessageSquare,
  Package,
  School,
  ShieldCheck,
  Star,
  Truck,
  Users,
  X
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import api from '../api'
import DashboardLayout from '../components/DashboardLayout'

const deliveryPriority = {
  TIBA: 0,
  DISTRIBUSI: 1,
  DIJADWALKAN: 2,
  SELESAI: 3
}

const deliveryMeta = {
  DIJADWALKAN: {
    label: 'Ditugaskan ke Vendor',
    shortLabel: 'ASSIGNED',
    progress: 25,
    background: 'var(--banana-light)',
    color: 'var(--banana)',
    description: 'Tiket sudah dibuat vendor dan sekolah bisa langsung memantau prosesnya.'
  },
  DISTRIBUSI: {
    label: 'Dalam Distribusi',
    shortLabel: 'ON THE WAY',
    progress: 65,
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    description: 'Vendor sudah memulai pengiriman ke sekolah.'
  },
  TIBA: {
    label: 'Tiba di Sekolah',
    shortLabel: 'ARRIVED',
    progress: 90,
    background: 'rgba(14, 165, 233, 0.12)',
    color: 'var(--secondary)',
    description: 'Batch sudah sampai dan menunggu penyelesaian akhir dari sekolah.'
  },
  SELESAI: {
    label: 'Distribusi Selesai',
    shortLabel: 'COMPLETED',
    progress: 100,
    background: '#e2e8f0',
    color: '#64748b',
    description: 'Distribusi sudah dikonfirmasi selesai oleh sekolah.'
  }
}

const timelineSteps = ['DIJADWALKAN', 'DISTRIBUSI', 'TIBA', 'SELESAI']

const formatDate = (value, options) => {
  if (!value) return '-'
  return new Date(value).toLocaleString('id-ID', options)
}

const DeliveryReportModal = ({ onClose, reportArea, onNotify }) => {
  const [fields, setFields] = useState({
    judul: '',
    urgency: 'Sedang',
    deskripsi: ''
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    try {
      await api.createAlert({
        judul: fields.judul || 'Kendala Sekolah',
        deskripsi: fields.deskripsi || 'Tidak ada deskripsi.',
        severity: fields.urgency === 'Tinggi (Segera)' ? 'warning' : 'info',
        wilayah: reportArea
      })
      onNotify?.('Kendala berhasil dikirim ke vendor dan pemerintah.', 'warning')
      onClose()
    } catch (err) {
      onNotify?.(`Gagal mengirim laporan: ${err.message}`, 'warning')
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
          maxWidth: '420px',
          height: '100%',
          background: 'white',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontWeight: '950', fontSize: '1.8rem', color: '#0f172a', letterSpacing: '-0.5px' }}>Lapor Kendala</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', marginTop: '4px' }}>
              Laporkan hambatan distribusi agar vendor dan pemerintah bisa merespons cepat.
            </p>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
            <X size={20} color="#64748b" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', flex: 1 }}>
          <div>
            <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>JUDUL KENDALA</label>
            <input
              required
              value={fields.judul}
              onChange={(event) => setFields((prev) => ({ ...prev, judul: event.target.value }))}
              placeholder="Contoh: Pengiriman terlambat"
              style={{ width: '100%', padding: '1.1rem', borderRadius: '14px', border: '2px solid #eee', fontWeight: '700' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>TINGKAT URGENSI</label>
            <select
              value={fields.urgency}
              onChange={(event) => setFields((prev) => ({ ...prev, urgency: event.target.value }))}
              style={{ width: '100%', padding: '1.1rem', borderRadius: '14px', border: '2px solid #eee', fontWeight: '700', background: 'white' }}
            >
              <option>Rendah</option>
              <option>Sedang</option>
              <option>Tinggi (Segera)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>DESKRIPSI</label>
            <textarea
              required
              value={fields.deskripsi}
              onChange={(event) => setFields((prev) => ({ ...prev, deskripsi: event.target.value }))}
              placeholder="Jelaskan kendala yang terjadi di sekolah."
              style={{ width: '100%', minHeight: '140px', padding: '1.1rem', borderRadius: '14px', border: '2px solid #eee', fontWeight: '700', fontFamily: 'inherit' }}
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSaving}
            style={{ width: '100%', padding: '1.2rem', borderRadius: '24px', border: 'none', color: 'white', fontWeight: '900', fontSize: '1rem', marginTop: 'auto', cursor: 'pointer', opacity: isSaving ? 0.7 : 1 }}
          >
            {isSaving ? 'Mengirim Laporan...' : 'Kirim Laporan'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

const SekolahDashboard = ({ user, onLogout, onSwitchRole }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname.replace(/\/$/, '')
  const isFeedback = path === '/sekolah/feedback'
  const showLifecycleView = path === '/sekolah' || path === '/sekolah/konfirmasi'

  const [showReportModal, setShowReportModal] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState(4)
  const [quickFeedbackNote, setQuickFeedbackNote] = useState('')
  const [showToast, setShowToast] = useState({ show: false, message: '', type: 'success' })
  const [distribusi, setDistribusi] = useState([])
  const [schoolProfile, setSchoolProfile] = useState(null)
  const [konfirmasiHistory, setKonfirmasiHistory] = useState([])
  const [proofUpload, setProofUpload] = useState(null)
  const [proofPreview, setProofPreview] = useState('')
  const [completionNote, setCompletionNote] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)

  const triggerToast = (message, type = 'success') => {
    setShowToast({ show: true, message, type })
    setTimeout(() => setShowToast({ show: false, message: '', type: 'success' }), 3000)
  }

  const loadData = async () => {
    try {
      const [dist, matchedSchool, confirmations] = await Promise.all([
        api.getDistribusi(),
        api.getSekolahByUser(user.id_user, { includeInactive: true }),
        api.getKonfirmasi()
      ])
      setSchoolProfile(matchedSchool)
      const canOperate = matchedSchool && matchedSchool.status !== 'inactive'
      setDistribusi(canOperate ? dist.filter((item) => item.id_sekolah === matchedSchool.id_sekolah) : [])
      setKonfirmasiHistory(matchedSchool ? confirmations.filter((item) => item.id_sekolah === matchedSchool.id_sekolah) : [])
    } catch (err) {
      console.error('Failed to fetch school data:', err)
      setSchoolProfile(null)
      setDistribusi([])
      setKonfirmasiHistory([])
    }
  }

  useEffect(() => {
    loadData()
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

  const activeDelivery = useMemo(() => {
    if (!selectedDelivery) {
      return {
        id_distribusi: null,
        id_sekolah: schoolProfile?.id_sekolah || null,
        id_menu: null,
        jumlah_porsi: 0,
        kode_transaksi: 'TX-0000',
        vendor: 'Menunggu Vendor',
        dapur: '-',
        status: 'STANDBY',
        statusMeta: null,
        menuName: 'Belum ada tiket aktif',
        progress: 0,
        assignedAt: null,
        sentAt: null,
        arrivedAt: null,
        lastUpdateAt: null
      }
    }

    const statusMeta = deliveryMeta[selectedDelivery.status] || deliveryMeta.DIJADWALKAN
    return {
      id_distribusi: selectedDelivery.id_distribusi,
      id_sekolah: selectedDelivery.id_sekolah,
      id_menu: selectedDelivery.id_menu,
      jumlah_porsi: selectedDelivery.jumlah_porsi,
      kode_transaksi: selectedDelivery.kode_transaksi,
      vendor: selectedDelivery.nama_vendor || 'Vendor terhubung',
      dapur: selectedDelivery.dapur_lokasi || '-',
      status: selectedDelivery.status,
      statusMeta,
      menuName: selectedDelivery.nama_menu || 'Menu Hari Ini',
      progress: statusMeta.progress,
      assignedAt: selectedDelivery.created_at,
      sentAt: selectedDelivery.waktu_kirim,
      arrivedAt: selectedDelivery.waktu_tiba,
      lastUpdateAt: selectedDelivery.waktu_tiba || selectedDelivery.waktu_kirim || selectedDelivery.created_at
    }
  }, [selectedDelivery, schoolProfile?.id_sekolah])

  const schoolRegionLabel = useMemo(() => {
    const segments = schoolProfile?.alamat
      ?.split(',')
      .map((segment) => segment.trim())
      .filter(Boolean)

    if (!segments?.length) return 'Kota Kendari'
    return segments.length >= 2 ? segments.slice(-2).join(', ') : segments[0]
  }, [schoolProfile?.alamat])

  const recentHistory = useMemo(() => {
    if (konfirmasiHistory.length > 0) return konfirmasiHistory.slice(0, 3)
    return distribusi.slice(0, 3)
  }, [konfirmasiHistory, distribusi])

  const handleProofFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setProofUpload({ dataUrl: reader.result, fileName: file.name })
      setProofPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleCompleteDelivery = async () => {
    if (!activeDelivery.id_distribusi) {
      triggerToast('Belum ada tiket distribusi yang bisa diselesaikan.', 'warning')
      return
    }
    if (activeDelivery.status !== 'TIBA') {
      triggerToast('Sekolah hanya bisa menutup distribusi setelah vendor menandai status TIBA.', 'warning')
      return
    }

    setIsConfirming(true)
    try {
      let uploadedPhoto = null
      if (proofUpload?.dataUrl) {
        uploadedPhoto = await api.uploadConfirmationPhoto({
          imageData: proofUpload.dataUrl,
          fileName: proofUpload.fileName
        })
      }

      await api.createKonfirmasi({
        id_distribusi: activeDelivery.id_distribusi,
        id_user: user.id_user,
        kondisi_makanan: 'baik',
        jumlah_diterima: schoolProfile?.jumlah_siswa || activeDelivery.jumlah_porsi || 0,
        catatan: completionNote.trim() || 'Distribusi selesai diterima sekolah.',
        foto_bukti: uploadedPhoto?.foto_bukti || null
      })

      setCompletionNote('')
      setProofUpload(null)
      setProofPreview('')
      await loadData()
      triggerToast('Distribusi berhasil ditutup oleh sekolah.')
    } catch (err) {
      console.error(err)
      triggerToast(`Gagal menyelesaikan distribusi: ${err.message}`, 'warning')
    } finally {
      setIsConfirming(false)
    }
  }

  const handleQuickFeedback = async () => {
    if (!schoolProfile?.id_sekolah) {
      triggerToast('Data sekolah belum tersedia.', 'warning')
      return
    }

    try {
      await api.createFeedback({
        id_sekolah: schoolProfile.id_sekolah,
        id_user: user.id_user,
        id_menu: activeDelivery.id_menu || null,
        rating: feedbackRating,
        komentar: quickFeedbackNote.trim() || 'Penilaian cepat dari halaman sekolah',
        kategori: 'kualitas'
      })
      setQuickFeedbackNote('')
      triggerToast('Feedback sekolah berhasil dikirim.')
    } catch (err) {
      console.error(err)
      triggerToast(`Gagal mengirim feedback: ${err.message}`, 'warning')
    }
  }

  const renderLifecycleView = () => (
    <>
      <AnimatePresence>
        {showReportModal && (
          <DeliveryReportModal
            onClose={() => setShowReportModal(false)}
            reportArea={schoolRegionLabel}
            onNotify={triggerToast}
          />
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-1px', marginBottom: '0.25rem' }}>{schoolProfile?.nama_sekolah || 'Sekolah MBG'}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '600', margin: 0 }}>
            Pantau tiket distribusi dari vendor yang terhubung melalui sistem dapur-sekolah.
          </p>
        </div>
        <div style={{ padding: '12px 24px', background: 'var(--banana-light)', borderRadius: '14px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid var(--banana)' }}>
          <Users size={20} color="var(--banana)" />
          <div>
            <p style={{ fontWeight: '800', fontSize: '1.2rem', lineHeight: '1', margin: 0 }}>{schoolProfile?.jumlah_siswa ?? 0}</p>
            <p style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--banana)', margin: '4px 0 0' }}>SISWA TERDATA</p>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '1rem', alignItems: 'start' }}>
        <div className="grid" style={{ gap: '1rem' }}>
          <div className="card" style={{ background: 'var(--role-primary)', color: 'white', padding: '1.75rem', borderRadius: '18px', border: 'none', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div>
                <span style={{ background: 'rgba(255,255,255,0.18)', padding: '6px 14px', borderRadius: '24px', fontSize: '0.75rem', fontWeight: '800' }}>
                  TIKET {activeDelivery.kode_transaksi}
                </span>
                <p style={{ fontSize: '0.82rem', fontWeight: '700', margin: '1rem 0 0.4rem', opacity: 0.78 }}>MENU AKTIF</p>
                <h2 style={{ fontSize: '1.85rem', fontWeight: '950', letterSpacing: '-1px', margin: 0 }}>{activeDelivery.menuName}</h2>
                <p style={{ margin: '0.9rem 0 0', fontWeight: '700', opacity: 0.88 }}>
                  Vendor: {activeDelivery.vendor}
                </p>
                <p style={{ margin: '0.35rem 0 0', fontWeight: '700', opacity: 0.78 }}>
                  Dapur: {activeDelivery.dapur}
                </p>
              </div>
              <div style={{ minWidth: '180px' }}>
                <span
                  className="badge"
                  style={{
                    background: activeDelivery.statusMeta?.background || 'rgba(255,255,255,0.18)',
                    color: activeDelivery.statusMeta?.color || 'white',
                    fontWeight: '900'
                  }}
                >
                  {activeDelivery.statusMeta?.shortLabel || activeDelivery.status}
                </span>
                <p style={{ fontSize: '0.8rem', fontWeight: '700', margin: '0.8rem 0 0.25rem', opacity: 0.78 }}>Porsi Ticket</p>
                <p style={{ fontSize: '1.3rem', fontWeight: '900', margin: 0 }}>{activeDelivery.jumlah_porsi || 0}</p>
                <p style={{ fontSize: '0.78rem', fontWeight: '700', margin: '0.8rem 0 0.2rem', opacity: 0.78 }}>Update Terakhir</p>
                <p style={{ margin: 0, fontWeight: '800' }}>
                  {formatDate(activeDelivery.lastUpdateAt, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.16)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                <p style={{ margin: 0, fontWeight: '800' }}>Progress Distribusi</p>
                <p style={{ margin: 0, fontWeight: '900' }}>{activeDelivery.progress}%</p>
              </div>
              <div style={{ height: '10px', background: 'rgba(255,255,255,0.18)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${activeDelivery.progress}%`, height: '100%', background: 'white', borderRadius: '999px' }} />
              </div>
              <p style={{ margin: '0.8rem 0 0', fontSize: '0.85rem', fontWeight: '600', opacity: 0.85 }}>
                {activeDelivery.statusMeta?.description || 'Belum ada distribusi aktif untuk sekolah ini.'}
              </p>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderRadius: '18px' }}>
            <div className="flex justify-between" style={{ alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontWeight: '950' }}>Timeline Distribusi</h3>
                <p style={{ margin: '0.3rem 0 0', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.82rem' }}>
                  Sekolah mulai melihat tiket sejak status ditugaskan.
                </p>
              </div>
              <Truck color="var(--primary)" size={20} />
            </div>

            <div style={{ display: 'grid', gap: '0.9rem' }}>
              {timelineSteps.map((step, index) => {
                const meta = deliveryMeta[step]
                const currentIndex = timelineSteps.indexOf(activeDelivery.status)
                const stepIndex = timelineSteps.indexOf(step)
                const isReached = currentIndex >= stepIndex

                return (
                  <div key={step} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: '0.9rem', alignItems: 'start' }}>
                    <div style={{ display: 'grid', justifyItems: 'center', gap: '0.35rem' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: isReached ? meta.background : '#f1f5f9',
                        border: `2px solid ${isReached ? meta.color : '#cbd5e1'}`,
                        display: 'grid',
                        placeItems: 'center'
                      }}>
                        {isReached ? <CheckCircle2 size={18} color={meta.color} /> : <Clock size={16} color="#94a3b8" />}
                      </div>
                      {index < timelineSteps.length - 1 && (
                        <div style={{ width: '2px', minHeight: '36px', background: isReached ? meta.color : '#e2e8f0', opacity: 0.35 }} />
                      )}
                    </div>
                    <div style={{ paddingTop: '0.25rem' }}>
                      <p style={{ margin: 0, fontWeight: '900', color: isReached ? 'var(--text-main)' : '#94a3b8' }}>{meta.label}</p>
                      <p style={{ margin: '0.3rem 0 0', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.82rem' }}>{meta.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderRadius: '18px' }}>
            <div className="flex justify-between" style={{ alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontWeight: '950' }}>Selesaikan Distribusi</h3>
                <p style={{ margin: '0.3rem 0 0', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.82rem' }}>
                  Catatan dan foto bukti bersifat opsional. Sekolah hanya bisa menutup tiket saat status sudah TIBA.
                </p>
              </div>
              <Package color="var(--primary)" size={20} />
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '14px' }}>
                  <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)' }}>DITUGASKAN</p>
                  <p style={{ margin: '0.35rem 0 0', fontWeight: '900' }}>
                    {formatDate(activeDelivery.assignedAt, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '14px' }}>
                  <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)' }}>DIKIRIM</p>
                  <p style={{ margin: '0.35rem 0 0', fontWeight: '900' }}>
                    {formatDate(activeDelivery.sentAt, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '14px' }}>
                  <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)' }}>TIBA</p>
                  <p style={{ margin: '0.35rem 0 0', fontWeight: '900' }}>
                    {formatDate(activeDelivery.arrivedAt, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>CATATAN PENYELESAIAN OPSIONAL</label>
                <textarea
                  value={completionNote}
                  onChange={(event) => setCompletionNote(event.target.value)}
                  placeholder="Contoh: Paket diterima lengkap dan dibagikan sesuai jadwal."
                  style={{ width: '100%', minHeight: '110px', padding: '1rem', borderRadius: '14px', border: '2px solid var(--border)', background: 'var(--bg)', fontFamily: 'inherit', fontWeight: '600' }}
                />
              </div>

              <div style={{ padding: '1rem', borderRadius: '16px', border: '2px dashed var(--border)', background: 'var(--bg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: proofPreview ? '1rem' : 0 }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'white', display: 'grid', placeItems: 'center' }}>
                    <Camera size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: '900' }}>Foto Bukti Opsional</p>
                    <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.82rem' }}>
                      Unggah foto jika sekolah ingin melampirkan kondisi makanan saat diterima.
                    </p>
                  </div>
                </div>
                {proofPreview && (
                  <img
                    src={proofPreview}
                    alt="Preview bukti distribusi"
                    style={{ width: '100%', maxWidth: '340px', height: '220px', objectFit: 'cover', borderRadius: '16px', marginBottom: '0.9rem', border: '4px solid white' }}
                  />
                )}
                <label className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '0.9rem 1.2rem', borderRadius: '20px', border: 'none', color: 'white', fontWeight: '800', cursor: 'pointer' }}>
                  <Camera size={18} /> Upload Foto
                  <input type="file" accept="image/*" capture="environment" onChange={(event) => handleProofFile(event.target.files?.[0])} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleCompleteDelivery}
                  disabled={isConfirming || activeDelivery.status !== 'TIBA'}
                  className="btn-primary"
                  style={{
                    padding: '1rem 1.4rem',
                    borderRadius: '16px',
                    border: 'none',
                    color: 'white',
                    fontWeight: '900',
                    cursor: isConfirming || activeDelivery.status !== 'TIBA' ? 'not-allowed' : 'pointer',
                    opacity: isConfirming || activeDelivery.status !== 'TIBA' ? 0.6 : 1
                  }}
                >
                  {isConfirming ? 'Menyimpan Penyelesaian...' : 'Tandai Distribusi Selesai'}
                </button>
                <button
                  onClick={() => navigate('/sekolah/feedback')}
                  style={{ padding: '1rem 1.2rem', borderRadius: '16px', border: '1px solid var(--border)', background: 'white', color: 'var(--text-main)', fontWeight: '800', cursor: 'pointer' }}
                >
                  Buka Feedback
                </button>
                <button
                  onClick={() => setShowReportModal(true)}
                  style={{ padding: '1rem 1.2rem', borderRadius: '16px', border: '1px solid #fdba74', background: '#fff7ed', color: '#c2410c', fontWeight: '800', cursor: 'pointer' }}
                >
                  Laporkan Kendala
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid" style={{ gap: '1rem' }}>
          <div className="card" style={{ padding: '1.5rem', borderRadius: '18px' }}>
            <h3 style={{ margin: 0, fontWeight: '950', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <School color="var(--primary)" size={20} /> Ringkasan Tiket
            </h3>
            <div style={{ display: 'grid', gap: '0.9rem', marginTop: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '14px' }}>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '800' }}>STATUS SAAT INI</p>
                <p style={{ margin: '0.35rem 0 0', fontWeight: '900', color: activeDelivery.statusMeta?.color || 'var(--text-main)' }}>
                  {activeDelivery.statusMeta?.label || 'Belum ada tiket aktif'}
                </p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '14px' }}>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '800' }}>WILAYAH SEKOLAH</p>
                <p style={{ margin: '0.35rem 0 0', fontWeight: '900' }}>{schoolRegionLabel}</p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '14px' }}>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '800' }}>TARGET PORSI</p>
                <p style={{ margin: '0.35rem 0 0', fontWeight: '900' }}>{activeDelivery.jumlah_porsi || schoolProfile?.jumlah_siswa || 0} porsi</p>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderRadius: '18px' }}>
            <h3 style={{ margin: 0, fontWeight: '950', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <History color="var(--primary)" size={20} /> Riwayat Terbaru
            </h3>
            <div style={{ display: 'grid', gap: '0.9rem', marginTop: '1rem' }}>
              {recentHistory.length === 0 ? (
                <div style={{ padding: '1.2rem', background: 'var(--bg)', borderRadius: '14px', color: 'var(--text-muted)', fontWeight: '700' }}>
                  Belum ada riwayat distribusi untuk sekolah ini.
                </div>
              ) : recentHistory.map((item, index) => {
                const isFinished = item.status === 'SELESAI'
                return (
                  <div key={`${item.id_konfirmasi || item.id_distribusi || index}`} style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '14px', display: 'grid', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center' }}>
                      <p style={{ margin: 0, fontWeight: '900' }}>{item.nama_menu || activeDelivery.menuName}</p>
                      <span className="badge" style={{ background: isFinished ? 'var(--primary-light)' : 'var(--banana-light)', color: isFinished ? 'var(--primary)' : 'var(--banana)', fontWeight: '900' }}>
                        {item.status || 'SELESAI'}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.82rem' }}>
                      {item.jumlah_porsi || activeDelivery.jumlah_porsi || 0} porsi
                    </p>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.8rem' }}>
                      {formatDate(item.waktu_konfirmasi || item.waktu_tiba || item.waktu_kirim || item.created_at, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {item.foto_bukti && (
                      <button
                        onClick={() => window.open(api.assetUrl(item.foto_bukti), '_blank')}
                        style={{ marginTop: '0.4rem', border: 'none', background: 'white', color: 'var(--primary)', borderRadius: '10px', padding: '0.55rem 0.75rem', fontWeight: '800', cursor: 'pointer', justifySelf: 'start' }}
                      >
                        Lihat Foto Bukti
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderRadius: '18px', background: '#fff7ed', border: '1px solid #fdba74' }}>
            <h3 style={{ margin: 0, fontWeight: '950', color: '#9a3412', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={20} /> Bantuan Cepat
            </h3>
            <p style={{ margin: '0.75rem 0 0', color: '#9a3412', fontWeight: '600', lineHeight: '1.6' }}>
              Jika distribusi belum bergerak atau ada masalah kualitas, laporkan kendala tanpa harus menunggu tiket selesai.
            </p>
            <div style={{ display: 'grid', gap: '0.65rem', marginTop: '1rem' }}>
              <button onClick={() => navigate('/sekolah/feedback')} style={{ width: '100%', textAlign: 'left', padding: '0.85rem 1rem', borderRadius: '12px', background: 'white', border: 'none', color: 'var(--text-main)', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                Kirim Review Sekolah <ChevronRight size={16} />
              </button>
              <button onClick={() => setShowReportModal(true)} style={{ width: '100%', textAlign: 'left', padding: '0.85rem 1rem', borderRadius: '12px', background: 'white', border: 'none', color: 'var(--text-main)', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                Laporkan Kendala <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  const renderFeedbackView = () => (
    <div className="grid" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
      <div className="card" style={{ padding: '4rem', borderRadius: '18px', maxWidth: '860px', margin: '0 auto', boxShadow: '0 40px 80px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'start', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '3rem', fontWeight: '950', marginBottom: '0.75rem', letterSpacing: '-2px' }}>Feedback Sekolah</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500', margin: 0 }}>
              Review ini tetap terhubung ke menu dan sekolah pada tiket distribusi terakhir.
            </p>
          </div>
          <div style={{ padding: '0.8rem 1rem', borderRadius: '14px', background: 'var(--bg)', minWidth: '180px' }}>
            <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)' }}>TIKET TERKAIT</p>
            <p style={{ margin: '0.35rem 0 0', fontWeight: '900' }}>{activeDelivery.kode_transaksi}</p>
          </div>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontWeight: '950', marginBottom: '1rem', fontSize: '1.2rem' }}>
            Bagaimana kualitas menu "{activeDelivery.menuName}"?
          </p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 5].map((score) => (
              <motion.div whileHover={{ scale: 1.12 }} key={score}>
                <Star
                  size={52}
                  fill={score <= feedbackRating ? 'var(--banana)' : 'none'}
                  color="var(--banana)"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setFeedbackRating(score)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontWeight: '950', marginBottom: '1rem', fontSize: '1.15rem' }}>Catatan Tambahan</p>
          <textarea
            value={quickFeedbackNote}
            onChange={(event) => setQuickFeedbackNote(event.target.value)}
            placeholder="Contoh: Distribusi tepat waktu dan makanan diterima dalam kondisi baik."
            style={{ width: '100%', minHeight: '180px', padding: '1rem', borderRadius: '14px', border: '2px solid var(--border)', background: 'var(--bg)', outline: 'none', fontSize: '1rem', fontWeight: '500', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleQuickFeedback}
            className="btn-primary"
            style={{ borderRadius: '18px', padding: '1.1rem 1.5rem', fontSize: '1rem', fontWeight: '900', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            Kirim Feedback
          </button>
          <button
            onClick={() => navigate('/sekolah')}
            style={{ borderRadius: '18px', padding: '1.1rem 1.5rem', fontSize: '1rem', fontWeight: '800', border: '1px solid var(--border)', background: 'white', color: 'var(--text-main)', cursor: 'pointer' }}
          >
            Kembali ke Status Distribusi
          </button>
        </div>
      </div>
    </div>
  )

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
          <p style={{ color: '#9a3412', fontWeight: '600', margin: 0 }}>
            Operasional distribusi, penyelesaian tiket, dan feedback dinonaktifkan sampai pemerintah mengaktifkan kembali sekolah ini.
          </p>
        </div>
      ) : showLifecycleView ? renderLifecycleView() : isFeedback ? renderFeedbackView() : (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
          <MessageSquare size={64} color="var(--border)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-muted)' }}>Halaman sekolah tidak ditemukan</h2>
        </div>
      )}
    </DashboardLayout>
  )
}

export default SekolahDashboard
