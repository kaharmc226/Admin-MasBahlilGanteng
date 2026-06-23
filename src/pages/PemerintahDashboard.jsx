import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
  BadgeAlert,
  Zap,
  Globe,
  Fingerprint,
  PieChart as PieChartIcon,
  Lock,
  ChevronRight,
  Filter,
  Download,
  Apple,
  Carrot,
  Leaf,
  Link2,
  Plus,
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
import Motif from '../components/dashboard/Motif'
import Header from '../components/dashboard/DashboardHeader'
import AddFormModal from '../components/modals/AddFormModal'
import VendorAuditModal from '../components/modals/VendorAuditModal'


const PemerintahDashboard = ({ user, onLogout, onSwitchRole }) => {
  const location = useLocation()
  const navigate = useNavigate()
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
        await api.createVendor({
          nama_vendor: data.nama_vendor,
          izin_usaha: data.izin_usaha,
          region: data.region,
          account_name: data.account_name,
          email: data.email,
          password: data.password,
          status_verifikasi: 'approved',
          date_pendaftaran: new Date().toISOString().split('T')[0]
        })
        await refreshGovernmentData()
      } else if (type === 'Sekolah') {
        const createdSekolah = await api.createSekolah({
          nama_sekolah: data.nama_sekolah,
          jumlah_siswa: parseInt(data.jumlah_siswa) || 0,
          alamat: data.alamat,
          jenjang: 'SD',
          alergi_count: 0,
          intoleran_count: 0,
          account_name: data.account_name,
          email: data.email,
          password: data.password
        })
        if (!data.id_dapur) {
          throw new Error('Pilih dapur penanggung jawab sebelum membuat mapping.')
        }

        await api.createMapping({
          id_dapur: data.id_dapur,
          id_sekolah: createdSekolah.id_sekolah
        })
        await refreshGovernmentData()
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
  const isMapping = path === '/pemerintah/mapping' || path === '/pemerintah/peta'
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
    if (path === '/pemerintah/peta') {
      navigate('/pemerintah/mapping', { replace: true })
    }
  }, [navigate, path])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [v, w, a, m, s, stats, d, registrations] = await Promise.all([
          api.getVendors(),
          api.getWilayah(),
          api.getAlerts(),
          api.getMapping(),
          api.getSekolah({ includeInactive: true }),
          api.getPemerintahStats(),
          api.getDapur(),
          api.getVendorRegistrations()
        ])
        setActiveVendors(v.filter(x => ['approved', 'suspended'].includes(x.status_verifikasi)))
        setRegQueue(registrations.filter(x => ['pending', 'revision'].includes(x.status)))
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

  const refreshGovernmentData = async () => {
    const [vendors, registrations, mapping, alertRows, schools, dapurRows] = await Promise.all([
      api.getVendors(),
      api.getVendorRegistrations(),
      api.getMapping(),
      api.getAlerts(),
      api.getSekolah({ includeInactive: true }),
      api.getDapur()
    ])
    setActiveVendors(vendors.filter(x => ['approved', 'suspended'].includes(x.status_verifikasi)))
    setRegQueue(registrations.filter(x => ['pending', 'revision'].includes(x.status)))
    setMappingData(mapping)
    setAlerts(alertRows)
    setSekolahList(schools)
    setDapurs(dapurRows)
  }

  const handleApproveVendor = async (vendor) => {
    const isConfirm = window.confirm(`Sahkan ${vendor.nama_vendor} sebagai Vendor MBG Resmi?`);
    if (isConfirm) {
      try {
        if (vendor.id_registration) {
          await api.approveVendorRegistration(vendor.id_registration, { reviewed_by: user.id_user })
        } else {
          await api.updateVendor(vendor.id_vendor, { ...vendor, status_verifikasi: 'approved' })
        }
        await refreshGovernmentData()
        triggerToast(`${vendor.nama_vendor} telah resmi disahkan oleh Pemerintah!`)
      } catch (err) { console.error(err) }
    }
  }

  const handleRejectRegistration = async (registration, revision = false) => {
    const review_note = window.prompt(revision ? 'Catatan revisi untuk vendor:' : 'Alasan penolakan:', '')
    if (review_note === null) return
    try {
      await api.rejectVendorRegistration(registration.id_registration, { review_note, reviewed_by: user.id_user, revision })
      await refreshGovernmentData()
      triggerToast(revision ? 'Permintaan revisi tersimpan.' : 'Pendaftaran vendor ditolak.')
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan review: ' + err.message)
    }
  }

  const handleReviewDocument = async (doc, status) => {
    const review_note = window.prompt(`Catatan review untuk status ${status}:`, doc.review_note || '')
    if (review_note === null) return
    try {
      await api.updateDokumenStatus(doc.id_dokumen, { status, review_note, reviewed_by: user.id_user })
      setSelectedVendorDocs(prev => prev.map(item => item.id_dokumen === doc.id_dokumen ? { ...item, status, review_note } : item))
      triggerToast('Status dokumen vendor diperbarui.')
    } catch (err) {
      console.error(err)
      alert('Gagal memperbarui dokumen: ' + err.message)
    }
  }

  const handleApproveDapur = async (dapur) => {
    const review_note = window.prompt('Catatan persetujuan dapur (opsional):', dapur.review_note || '')
    if (review_note === null) return
    try {
      await api.approveDapur(dapur.id_dapur, {
        reviewed_by: user.id_user,
        review_note
      })
      await refreshGovernmentData()
      triggerToast(`Dapur ${dapur.lokasi} disetujui untuk operasional.`)
    } catch (err) {
      console.error(err)
      alert('Gagal menyetujui dapur: ' + err.message)
    }
  }

  const handleRejectDapur = async (dapur) => {
    const review_note = window.prompt('Catatan penolakan / revisi dapur:', dapur.review_note || '')
    if (review_note === null) return
    if (!review_note.trim()) {
      alert('Catatan penolakan dapur wajib diisi.')
      return
    }
    try {
      await api.rejectDapur(dapur.id_dapur, {
        reviewed_by: user.id_user,
        review_note
      })
      await refreshGovernmentData()
      triggerToast(`Review dapur ${dapur.lokasi} berhasil disimpan.`)
    } catch (err) {
      console.error(err)
      alert('Gagal menolak dapur: ' + err.message)
    }
  }

  const handleSuspendVendor = async (vendor) => {
    if (!window.confirm(`Suspend ${vendor.nama_vendor}?`)) return
    try {
      await api.deleteVendor(vendor.id_vendor)
      await refreshGovernmentData()
      setSelectedVendorAudit(prev => prev ? { ...prev, status_verifikasi: 'suspended' } : prev)
      triggerToast('Vendor disuspend.')
    } catch (err) {
      console.error(err)
      alert('Gagal suspend vendor: ' + err.message)
    }
  }

  const handleReinstateVendor = async (vendor) => {
    try {
      await api.updateVendor(vendor.id_vendor, { ...vendor, status_verifikasi: 'approved' })
      await refreshGovernmentData()
      setSelectedVendorAudit(prev => prev ? { ...prev, status_verifikasi: 'approved' } : prev)
      triggerToast('Vendor diaktifkan kembali.')
    } catch (err) {
      console.error(err)
      alert('Gagal mengaktifkan vendor: ' + err.message)
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

  const handleArchiveAlert = async (alertId) => {
    try {
      await api.archiveAlert(alertId)
      setAlerts(prev => prev.filter(item => item.id_alert !== alertId))
      triggerToast('Alert diarsipkan.')
    } catch (err) {
      console.error(err)
      alert('Gagal mengarsipkan alert: ' + err.message)
    }
  }

  const handleAlertSeverity = async (alertItem, severity) => {
    try {
      const updated = await api.updateAlert(alertItem.id_alert, { ...alertItem, severity })
      setAlerts(prev => prev.map(item => item.id_alert === alertItem.id_alert ? { ...item, ...updated } : item))
      triggerToast('Severity alert diperbarui.')
    } catch (err) {
      console.error(err)
      alert('Gagal memperbarui alert: ' + err.message)
    }
  }

  const handleUnlinkMapping = async (mappingId) => {
    if (!window.confirm('Lepas hubungan dapur dan sekolah ini?')) return
    try {
      await api.deleteMapping(mappingId)
      setMappingData(prev => prev.filter(item => item.id_mapping !== mappingId))
      triggerToast('Mapping dapur-sekolah dilepas.')
    } catch (err) {
      console.error(err)
      alert('Gagal melepas mapping: ' + err.message)
    }
  }

  const handleEditVendor = async (vendor) => {
    const nama_vendor = window.prompt('Nama vendor:', vendor.nama_vendor)
    if (nama_vendor === null) return
    const region = window.prompt('Region vendor:', vendor.region || '')
    if (region === null) return
    const izin_usaha = window.prompt('Izin usaha:', vendor.izin_usaha || '')
    if (izin_usaha === null) return
    try {
      await api.updateVendor(vendor.id_vendor, { ...vendor, nama_vendor, region, izin_usaha })
      await refreshGovernmentData()
      if (selectedVendorAudit?.id_vendor === vendor.id_vendor) {
        setSelectedVendorAudit(prev => prev ? { ...prev, nama_vendor, region, izin_usaha } : prev)
      }
      triggerToast('Data vendor diperbarui.')
    } catch (err) {
      console.error(err)
      alert('Gagal memperbarui vendor: ' + err.message)
    }
  }

  const handleEditSchool = async (school) => {
    const nama_sekolah = window.prompt('Nama sekolah:', school.nama_sekolah)
    if (nama_sekolah === null) return
    const alamat = window.prompt('Alamat sekolah:', school.alamat || '')
    if (alamat === null) return
    const jumlah_siswa = window.prompt('Jumlah siswa:', String(school.jumlah_siswa || 0))
    if (jumlah_siswa === null) return
    try {
      await api.updateSekolah(school.id_sekolah, {
        ...school,
        nama_sekolah,
        alamat,
        jumlah_siswa: parseInt(jumlah_siswa, 10) || 0
      })
      await refreshGovernmentData()
      triggerToast('Data sekolah diperbarui.')
    } catch (err) {
      console.error(err)
      alert('Gagal memperbarui sekolah: ' + err.message)
    }
  }

  const handleDeactivateSchool = async (school) => {
    if (!window.confirm(`Nonaktifkan ${school.nama_sekolah}?`)) return
    try {
      await api.deleteSekolah(school.id_sekolah)
      await refreshGovernmentData()
      triggerToast('Sekolah dinonaktifkan.')
    } catch (err) {
      console.error(err)
      alert('Gagal menonaktifkan sekolah: ' + err.message)
    }
  }

  const handleReactivateSchool = async (school) => {
    try {
      await api.reactivateSekolah(school.id_sekolah)
      await refreshGovernmentData()
      triggerToast('Sekolah diaktifkan kembali.')
    } catch (err) {
      console.error(err)
      alert('Gagal mengaktifkan sekolah: ' + err.message)
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
        <Header title="Audit Vendor Nasional" subtitle="Verifikasi izin usaha dan standar operasional MBG." showAdd onAdd={() => setShowAddForm(true)} addLabel="Tambah Vendor" variant="simple" />
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
                    <td style={{ padding: '1.5rem', fontWeight: '700' }}>{v.created_at ? new Date(v.created_at).toLocaleDateString('id-ID') : v.date_pendaftaran}</td>
                    <td style={{ padding: '1.5rem' }}><span className="badge badge-warning" style={{ fontWeight: '900' }}>{v.status?.toUpperCase() || 'PENDING REVIEW'}</span></td>
                    <td style={{ padding: '1.5rem', borderRadius: '0 20px 20px 0' }}>
                       <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                         <button onClick={() => handleApproveVendor(v)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '15px', border: 'none', fontWeight: '900', color: 'white', cursor: 'pointer' }}>SAHKAN</button>
                         <button onClick={() => handleRejectRegistration(v, true)} style={{ padding: '8px 16px', borderRadius: '15px', border: 'none', fontWeight: '900', color: '#92400e', background: '#fef3c7', cursor: 'pointer' }}>REVISI</button>
                         <button onClick={() => handleRejectRegistration(v, false)} style={{ padding: '8px 16px', borderRadius: '15px', border: 'none', fontWeight: '900', color: '#b91c1c', background: '#fee2e2', cursor: 'pointer' }}>TOLAK</button>
                       </div>
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
                     <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                       <button onClick={() => handleOpenVendorAudit(v)} style={{ color: 'var(--primary)', background: 'var(--primary-light)', border: 'none', fontWeight: '900', padding: '8px 16px', borderRadius: '15px', cursor: 'pointer' }}>Detail Audit</button>
                       <button onClick={() => handleEditVendor(v)} style={{ color: 'var(--text-main)', background: 'white', border: '1px solid var(--border)', fontWeight: '900', padding: '8px 16px', borderRadius: '15px', cursor: 'pointer' }}>Edit</button>
                       {v.status_verifikasi === 'suspended' ? (
                         <button onClick={() => handleReinstateVendor(v)} style={{ color: 'var(--primary)', background: 'white', border: '1px solid var(--primary)', fontWeight: '900', padding: '8px 16px', borderRadius: '15px', cursor: 'pointer' }}>Aktifkan</button>
                       ) : (
                         <button onClick={() => handleSuspendVendor(v)} style={{ color: '#b91c1c', background: '#fee2e2', border: 'none', fontWeight: '900', padding: '8px 16px', borderRadius: '15px', cursor: 'pointer' }}>Suspend</button>
                       )}
                     </div>
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
        <Header title="Hubungkan Dapur ↔ Sekolah" subtitle="Tentukan cakupan wilayah pelayanan dapur ke institusi pendidikan." showAdd onAdd={() => setShowAddForm(true)} addLabel="Tambah Sekolah" variant="simple" />
        <AnimatePresence>
          {showAddForm && (
            <AddFormModal 
              onClose={() => setShowAddForm(false)} 
              onSave={handleModalSave}
              isMapping={isMapping} 
              dapurs={dapurs.filter((d) => d.status_verifikasi === 'approved')}
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
                         <button onClick={() => handleUnlinkMapping(m.id_mapping)} style={{ border: 'none', borderRadius: '10px', padding: '0.55rem 0.75rem', background: '#fee2e2', color: '#b91c1c', fontWeight: '900', cursor: 'pointer' }}>Unlink</button>
                      </div>
                   </div>
                 )
               })}
             </div>
          </div>
          <div className="card" style={{ borderRadius: '16px', background: 'white', padding: '1.5rem' }}>
             <h3 style={{ marginBottom: '1rem', fontWeight: '900' }}>Manajemen Sekolah</h3>
             <div style={{ display: 'grid', gap: '0.75rem' }}>
               {sekolahList.map((school) => (
                 <div key={school.id_sekolah} style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg)', display: 'grid', gap: '0.6rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'start' }}>
                     <div>
                       <p style={{ fontWeight: '900' }}>{school.nama_sekolah}</p>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>{school.jenjang} • {school.jumlah_siswa} siswa</p>
                     </div>
                     <span className="badge" style={{ background: school.status === 'inactive' ? '#fee2e2' : 'var(--primary-light)', color: school.status === 'inactive' ? '#b91c1c' : 'var(--primary)', fontWeight: '900' }}>
                       {(school.status || 'active').toUpperCase()}
                     </span>
                   </div>
                   <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', margin: 0 }}>{school.alamat}</p>
                   <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                     <button onClick={() => handleEditSchool(school)} style={{ border: 'none', borderRadius: '10px', padding: '0.55rem 0.8rem', background: 'white', color: 'var(--text-main)', fontWeight: '900', cursor: 'pointer' }}>Edit</button>
                     {school.status === 'inactive' ? (
                       <button onClick={() => handleReactivateSchool(school)} style={{ border: 'none', borderRadius: '10px', padding: '0.55rem 0.8rem', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '900', cursor: 'pointer' }}>Aktifkan</button>
                     ) : (
                       <button onClick={() => handleDeactivateSchool(school)} style={{ border: 'none', borderRadius: '10px', padding: '0.55rem 0.8rem', background: '#fee2e2', color: '#b91c1c', fontWeight: '900', cursor: 'pointer' }}>Nonaktifkan</button>
                     )}
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    )

    if (isStatistik) return (
      <div className="grid">
        <Header title="Laporan & Statistik" subtitle="Analisis pertumbuhan dan efektivitas distribusi gizi." variant="simple" />
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
        <Header title="Sistem Alert & Log" subtitle="Deteksi dini kendala distribusi dan kualitas di lapangan." variant="simple" />
        <div className="grid" style={{ gap: '1rem' }}>
          {alerts.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', background: 'white', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <ShieldCheck size={48} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
              <h4 style={{ fontWeight: '900', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Semua Sistem Normal</h4>
              <p style={{ color: 'var(--text-muted)', fontWeight: '600', maxWidth: '400px', margin: '0 auto' }}>Tidak ada laporan kendala operasional atau keluhan kualitas gizi aktif saat ini.</p>
            </div>
          ) : (
            alerts.map((a, i) => (
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
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <select value={a.severity || 'info'} onChange={(e) => handleAlertSeverity(a, e.target.value)} style={{ padding: '0.7rem', borderRadius: '12px', border: '1px solid var(--border)', fontWeight: '800', background: 'white' }}>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="critical">Critical</option>
                  </select>
                  {!a.is_resolved && (
                    <button
                      onClick={() => handleResolveAlert(a.id_alert)}
                      className="btn-primary"
                      style={{ padding: '0.8rem 1rem', borderRadius: '12px', border: 'none', color: 'white', fontWeight: '800', cursor: 'pointer' }}
                    >
                      Tandai Selesai
                    </button>
                  )}
                  <button onClick={() => handleArchiveAlert(a.id_alert)} style={{ padding: '0.8rem 1rem', borderRadius: '12px', border: 'none', background: '#fee2e2', color: '#b91c1c', fontWeight: '800', cursor: 'pointer' }}>
                    Arsipkan
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )

    if (isMain) return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1 }}>
        <Header title="Monitoring Gizi Nasional" subtitle="Portal Transparansi Program Makan Bergizi Gratis (MBG)." variant="simple" />
        
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
    <DashboardLayout user={user} onLogout={onLogout} onSwitchRole={onSwitchRole}>
      <AnimatePresence>
        {selectedVendorAudit && (
          <VendorAuditModal
            vendor={selectedVendorAudit}
            docs={selectedVendorDocs}
            dapurs={dapurs.filter((d) => d.id_vendor === selectedVendorAudit.id_vendor)}
            onReviewDocument={handleReviewDocument}
            onApproveDapur={handleApproveDapur}
            onRejectDapur={handleRejectDapur}
            onSuspendVendor={handleSuspendVendor}
            onReinstateVendor={handleReinstateVendor}
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
              position: 'fixed', top: 0, left: '50%', zIndex: 10001, 
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
