import React, { useState, useEffect, useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { 
  Plus, 
  X, 
  Truck, 
  Package, 
  FileText, 
  CheckCircle,
  CheckCircle2,
  LayoutDashboard,
  Store,
  UtensilsCrossed,
  Clock,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  Activity,
  ChevronRight,
  ClipboardCheck,
  Zap,
  HardDrive,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  Search,
  ArrowLeft,
  Trash2,
  Apple,
  Archive
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import api from "../api"
import DashboardLayout from "../components/DashboardLayout"
import { AddDapurForm } from "../components/forms/AddDapurForm"
import { AddMenuForm } from "../components/forms/AddMenuForm"

import { 
  parseNutrientValue, 
  parseJsonField, 
  normalizeMenuIngredient, 
  normalizeValidationLog, 
  attachValidationMetadata 
} from "../utils/dashboardHelpers"
import Motif from "../components/dashboard/Motif"
import Header from "../components/dashboard/DashboardHeader"
import WelcomeBanner from "../components/dashboard/WelcomeBanner"
import Footer from "../components/dashboard/Footer"
import FloatingShape from "../components/dashboard/FloatingShape"
import FoodItem3D from "../components/dashboard/FoodItem3D"
import PdfModal from "../components/modals/PdfModal"
import VisualAuditModal from "../components/modals/VisualAuditModal"
import AddTicketForm from "../components/modals/AddTicketForm"


const produksiStatusMeta = {
  pending: {
    label: "PENDING",
    badgeBackground: "var(--banana-light)",
    badgeColor: "var(--banana)",
    helper: "Tiket sudah dibuat dan menunggu persiapan bahan.",
    nextStatus: "persiapan",
    actionLabel: "Mulai Persiapan (Potong Stok)",
    actionBackground: "var(--primary)",
    toast: "Status dipindah ke Persiapan. Stok bahan baku dipotong otomatis."
  },
  persiapan: {
    label: "PERSIAPAN",
    badgeBackground: "var(--primary-light)",
    badgeColor: "var(--primary)",
    helper: "Bahan sedang disiapkan untuk batch ini.",
    nextStatus: "memasak",
    actionLabel: "Masuk Tahap Memasak",
    actionBackground: "var(--secondary)",
    toast: "Batch masuk tahap Memasak."
  },
  memasak: {
    label: "MEMASAK",
    badgeBackground: "rgba(14, 165, 233, 0.12)",
    badgeColor: "var(--secondary)",
    helper: "Produksi makanan sedang berjalan di dapur.",
    nextStatus: "siap_kirim",
    actionLabel: "Tandai Siap Kirim",
    actionBackground: "var(--banana)",
    toast: "Batch siap dikirim ke armada distribusi."
  },
  siap_kirim: {
    label: "SIAP KIRIM",
    badgeBackground: "rgba(249, 115, 22, 0.12)",
    badgeColor: "var(--carrot)",
    helper: "Produksi selesai dan batch siap diserahkan ke distribusi.",
    nextStatus: "selesai",
    actionLabel: "Tutup Batch Produksi",
    actionBackground: "var(--role-primary)",
    toast: "Batch produksi ditutup. Lanjutkan pembaruan status distribusi secara manual."
  },
  selesai: {
    label: "SELESAI",
    badgeBackground: "#e2e8f0",
    badgeColor: "#64748b",
    helper: "Produksi ditutup. Pantau penyelesaian lewat status distribusi."
  }
}

const distribusiStatusMeta = {
  DIJADWALKAN: {
    label: "DITUGASKAN",
    background: "var(--banana-light)",
    color: "var(--banana)",
    helper: "Tiket sudah terhubung ke sekolah.",
    nextStatus: "DISTRIBUSI",
    actionLabel: "Mulai Distribusi",
    actionBackground: "var(--primary)"
  },
  DISTRIBUSI: {
    label: "DI PERJALANAN",
    background: "var(--primary-light)",
    color: "var(--primary)",
    helper: "Vendor mengirim batch ke sekolah.",
    nextStatus: "TIBA",
    actionLabel: "Tandai Tiba",
    actionBackground: "var(--secondary)"
  },
  TIBA: {
    label: "TIBA",
    background: "rgba(14, 165, 233, 0.12)",
    color: "var(--secondary)",
    helper: "Menunggu konfirmasi akhir dari sekolah."
  },
  SELESAI: {
    label: "SELESAI",
    background: "#e2e8f0",
    color: "#64748b",
    helper: "Distribusi ditutup oleh sekolah."
  }
}

const dapurStatusMeta = {
  approved: {
    label: 'AKTIF',
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    helper: 'Siap dipakai untuk operasional.',
  },
  pending: {
    label: 'PENDING',
    background: 'var(--banana-light)',
    color: 'var(--banana)',
    helper: 'Menunggu verifikasi Pemerintah.',
  },
  rejected: {
    label: 'DITOLAK',
    background: '#fee2e2',
    color: '#b91c1c',
    helper: 'Belum boleh beroperasi.',
  },
}

// parseNutrientValue is imported

// parseJsonField is imported

// normalizeMenuIngredient is imported

// normalizeValidationLog is imported)

// attachValidationMetadata is imported

const normalizeVendorMenu = (menu, nutritionMap, validationLogs = []) => {
  const bahan = parseJsonField(menu?.bahan, [])
  const nilaiGizi = parseJsonField(menu?.nilai_gizi, {})
  const notes = parseJsonField(menu?.notes, [])
  const normalizedMenu = {
    ...menu,
    bahan: Array.isArray(bahan) ? bahan.map((item) => normalizeMenuIngredient(item, nutritionMap)) : [],
    nilai_gizi: nilaiGizi && typeof nilaiGizi === 'object' ? nilaiGizi : {},
    notes: Array.isArray(notes) ? notes.filter(Boolean) : (typeof notes === 'string' && notes.trim() ? [notes.trim()] : [])
  }

  return attachValidationMetadata(normalizedMenu, validationLogs)
}

// Header is imported

// WelcomeBanner is imported

// Footer is imported

// FloatingShape is imported

// FoodItem3D is imported

// Motif is imported

const getDocumentAsset = (title = '') => {
  if (title.includes('NIB')) return '/nib_mockup.png'
  if (title.includes('Halal')) return '/halal_mockup.png'
  if (title.includes('P-IRT')) return '/pirt_mockup.png'
  return '/higiene_mockup.png'
}

// PdfModal is imported

// VisualAuditModal is imported


// AddTicketForm is imported

const VendorDashboard = ({ user, onLogout, onSwitchRole }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const path = location.pathname.replace(/\/$/, '')
  const isMain = path === '/vendor'
  const isInformasi = path === '/vendor/informasi'
  const isMenu = path === '/vendor/menu'
  const isProduksi = path === '/vendor/produksi' || path === '/vendor/distribusi'
  const isStok = path === '/vendor/stok'
  const [showAddForm, setShowAddForm] = useState(false)
  const [showMenuForm, setShowMenuForm] = useState(false)
  const [editingMenu, setEditingMenu] = useState(null)
  const [menuFormMode, setMenuFormMode] = useState('create')
  const [activeDoc, setActiveDoc] = useState(null)
  const [selectedAuditMenu, setSelectedAuditMenu] = useState(null)
  const [selectedDapurForStok, setSelectedDapurForStok] = useState(() => localStorage.getItem('selectedDapurForStok') || null)
  const [currentVendor, setCurrentVendor] = useState(null)
  const [showToast, setShowToast] = useState({ show: false, message: '', type: 'success' })
  const [documentForm, setDocumentForm] = useState({ nama_dokumen: '', jenis: 'izin_usaha', tanggal_berlaku: '' })
  const [documentUpload, setDocumentUpload] = useState(null)
  const [isUploadingDocument, setIsUploadingDocument] = useState(false)
  
  // Stock history and alert states
  const [stokHistory, setStokHistory] = useState([])
  const [prodError, setProdError] = useState(null)
  const [statusFilter, setStatusFilter] = useState(null) // 'persiapan' | 'memasak' | 'siap_kirim' | null
  const [stokFilter, setStokFilter] = useState(null) // 'all' | 'kritis' | 'ledger' | null

  const triggerToast = (message, type = 'success') => {
    setShowToast({ show: true, message, type })
    setTimeout(() => setShowToast({ show: false, message: '', type: 'success' }), 3000)
  }
  
  // API-driven state
  const [dapurs, setDapurs] = useState([])
  const [menus, setMenus] = useState([])
  const [dokumen, setDokumen] = useState([])
  const [produksi, setProduksi] = useState([])
  const [distribusi, setDistribusi] = useState([])
  const [stokData, setStokData] = useState([])
  const [sekolah, setSekolah] = useState([])
  const [mappingData, setMappingData] = useState([])
  const [nutritionItems, setNutritionItems] = useState([])
  const [validationLogs, setValidationLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const approvedDapurs = useMemo(() => dapurs.filter((d) => d.status_verifikasi === 'approved'), [dapurs])
  const distribusiByProduksiId = useMemo(
    () => new Map(distribusi.map((item) => [item.id_produksi, item])),
    [distribusi]
  )

  useEffect(() => {
    if (path === '/vendor/distribusi') {
      navigate('/vendor/produksi', { replace: true })
    }
  }, [navigate, path])

  const buildVendorMenus = (rawMenus = [], activeNutritionItems = [], rawValidationLogs = [], vendorId = null) => {
    const nutritionMap = new Map(activeNutritionItems.map((item) => [String(item.id), item]))
    const normalizedLogs = Array.isArray(rawValidationLogs) ? rawValidationLogs.map(normalizeValidationLog) : []
    return rawMenus
      .filter((item) => item.id_vendor === vendorId)
      .map((item) => normalizeVendorMenu(item, nutritionMap, normalizedLogs))
  }

  const refreshVendorMenus = async (vendorId = currentVendor?.id_vendor, activeNutritionItems = nutritionItems) => {
    if (!vendorId) return
    const [allMenus, logs] = await Promise.all([api.getMenus(), api.getValidasiLog()])
    const nextLogs = Array.isArray(logs) ? logs.map(normalizeValidationLog) : []
    const nextMenus = buildVendorMenus(Array.isArray(allMenus) ? allMenus : [], activeNutritionItems, nextLogs, vendorId)
    setValidationLogs(nextLogs)
    setMenus(nextMenus)
    setSelectedAuditMenu((current) => {
      if (!current) return null
      return nextMenus.find((item) => (item.id_menu || item.id) === (current.id_menu || current.id)) || null
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendor, d, m, prod, dist, sek, mappings, nutrition, logs] = await Promise.all([
          api.getVendorByUser(user.id_user),
          api.getDapur(),
          api.getMenus(),
          api.getProduksi(),
          api.getDistribusi(),
          api.getSekolah(),
          api.getMapping(),
          api.getNutrition(),
          api.getValidasiLog()
        ])
        const vendorDapurs = d.filter(item => item.id_vendor === vendor.id_vendor)
        const vendorDapurIds = new Set(vendorDapurs.map(item => item.id_dapur))
        const activeNutritionItems = Array.isArray(nutrition) ? nutrition.filter(item => item.status !== 'retired') : []
        const normalizedLogs = Array.isArray(logs) ? logs.map(normalizeValidationLog) : []
        const vendorMenus = buildVendorMenus(Array.isArray(m) ? m : [], activeNutritionItems, normalizedLogs, vendor.id_vendor)
        const vendorProduksi = prod.filter(item => vendorDapurIds.has(item.id_dapur))
        const vendorProduksiIds = new Set(vendorProduksi.map(item => item.id_produksi))
        const vendorDistribusi = dist.filter(item => vendorProduksiIds.has(item.id_produksi))
        const vendorMappings = mappings.filter(item => vendorDapurIds.has(item.id_dapur))
        const mappedSekolahIds = new Set(vendorMappings.map(item => item.id_sekolah))
        const vendorSekolah = sek
          .filter(item => mappedSekolahIds.has(item.id_sekolah))
          .map(item => {
            const mapping = vendorMappings.find((entry) => entry.id_sekolah === item.id_sekolah)
            return { ...item, id_dapur: mapping?.id_dapur ?? null }
          })
        const dok = await api.getDokumen(vendor.id_vendor)

        setCurrentVendor(vendor)
        setDapurs(vendorDapurs)
        setMenus(vendorMenus)
        setDokumen(dok)
        setProduksi(vendorProduksi)
        setDistribusi(vendorDistribusi)
        setSekolah(vendorSekolah)
        setMappingData(vendorMappings)
        setNutritionItems(activeNutritionItems)
        setValidationLogs(normalizedLogs)
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setCurrentVendor(null)
        setDapurs([])
        setMenus([])
        setDokumen([])
        setProduksi([])
        setDistribusi([])
        setSekolah([])
        setMappingData([])
        setNutritionItems([])
        setValidationLogs([])
      } finally {
        setLoading(false)
      }
    }
    if (user?.id_user) {
      fetchData()
    }
  }, [user?.id_user])

  useEffect(() => {
    if (approvedDapurs.length > 0 && !selectedDapurForStok) {
      const saved = localStorage.getItem('selectedDapurForStok')
      if (saved && approvedDapurs.some(d => (d.id_dapur || d.id || '').toString() === saved.toString())) {
        setSelectedDapurForStok(saved)
      } else {
        const firstId = approvedDapurs[0].id_dapur || approvedDapurs[0].id
        setSelectedDapurForStok(firstId.toString())
        localStorage.setItem('selectedDapurForStok', firstId.toString())
      }
      return
    }
    if (approvedDapurs.length === 0) {
      setSelectedDapurForStok(null)
      setStokData([])
      setStokHistory([])
      localStorage.removeItem('selectedDapurForStok')
      return
    }
    if (selectedDapurForStok && !approvedDapurs.some((d) => (d.id_dapur || d.id || '').toString() === selectedDapurForStok.toString())) {
      const firstId = approvedDapurs[0].id_dapur || approvedDapurs[0].id
      setSelectedDapurForStok(firstId.toString())
      localStorage.setItem('selectedDapurForStok', firstId.toString())
    }
  }, [approvedDapurs, selectedDapurForStok])

  useEffect(() => {
    if (selectedDapurForStok && approvedDapurs.some(d => (d.id_dapur || d.id || '').toString() === selectedDapurForStok.toString())) {
      api.getStok(selectedDapurForStok).then(setStokData).catch(console.error)
      api.getStokHistory(selectedDapurForStok).then(setStokHistory).catch(console.error)
      return
    }
    setStokData([])
    setStokHistory([])
  }, [selectedDapurForStok, approvedDapurs])

  const [formBahan, setFormBahan] = useState('')
  const [formSatuan, setFormSatuan] = useState('kg')
  const [showSuggestions, setShowSuggestions] = useState(false)
  useEffect(() => {
    if (isStok) {
      const rep = localStorage.getItem('replenishBahan')
      if (rep) {
        setFormBahan(rep)
        localStorage.removeItem('replenishBahan')
        const existing = stokData.find(s => s.nama_bahan.toLowerCase() === rep.toLowerCase())
        if (existing) {
          setFormSatuan(existing.satuan)
        }
      }
    }
  }, [isStok, stokData])

  const handleBahanChange = (val) => {
    setFormBahan(val)
    const lowerVal = val.toLowerCase()
    const literKeywords = ['minyak', 'air', 'kecap', 'susu', 'kaldu', 'jus', 'sirup', 'santan', 'saus', 'cuka']
    const kgKeywords = ['beras', 'daging', 'ayam', 'ikan', 'tahu', 'tempe', 'wortel', 'cabai', 'cabe', 'bawang', 'garam', 'gula', 'tepung', 'kentang', 'sayur', 'kol', 'bayam', 'kangkung', 'tomat', 'terigu', 'maizena', 'merica', 'ketumbar', 'bumbu']
    const butirKeywords = ['telur', 'telur ayam', 'telur puyuh', 'telur bebek']
    const packKeywords = ['masako', 'royco', 'penyedap', 'ragi', 'mentega', 'keju']

    if (literKeywords.some(kw => lowerVal.includes(kw))) {
      setFormSatuan('liter')
    } else if (kgKeywords.some(kw => lowerVal.includes(kw))) {
      setFormSatuan('kg')
    } else if (butirKeywords.some(kw => lowerVal.includes(kw))) {
      setFormSatuan('butir')
    } else if (packKeywords.some(kw => lowerVal.includes(kw))) {
      setFormSatuan('pack')
    }
  }

  const handleAddDapur = async (newDapur) => {
    try {
      if (!currentVendor) throw new Error('Vendor tidak ditemukan untuk user yang sedang login.')
      const created = await api.createDapur({ id_vendor: currentVendor.id_vendor, lokasi: newDapur.lokasi, kapasitas_produksi: newDapur.kapasitas_produksi || newDapur.kapasitas_production })
      setDapurs(prev => [...prev, { ...created, id: created.id_dapur }])
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const handleDeleteDapur = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus dapur ini?")) {
      try {
        await api.deleteDapur(id)
        setDapurs(prev => prev.filter(d => (d.id_dapur || d.id) !== id))
      } catch (err) { console.error(err) }
    }
  }
  const closeMenuForm = () => {
    setShowMenuForm(false)
    setEditingMenu(null)
    setMenuFormMode('create')
  }

  const openCreateMenuForm = () => {
    setEditingMenu(null)
    setMenuFormMode('create')
    setShowMenuForm(true)
  }

  const openEditMenuForm = (menu) => {
    setEditingMenu(menu)
    setMenuFormMode('edit')
    setShowMenuForm(true)
  }

  const handleAddMenu = async (newMenu) => {
    try {
      let fotoUrl = newMenu.foto_url || null
      if (newMenu.foto_data_url) {
        const uploaded = await api.uploadMenuPhoto({
          imageData: newMenu.foto_data_url,
          fileName: newMenu.foto_file_name || newMenu.nama_menu
        })
        fotoUrl = uploaded.foto_url
      }

      if (editingMenu) {
        await api.updateMenu(newMenu.id || newMenu.id_menu, {
          nama_menu: newMenu.nama_menu,
          bahan: newMenu.bahan,
          foto_url: fotoUrl,
          tanggal: newMenu.date || newMenu.tanggal,
          notes: newMenu.notes,
          status_validasi: newMenu.status_validasi
        })
      } else {
        if (!currentVendor) throw new Error('Vendor tidak ditemukan untuk user yang sedang login.')
        await api.createMenu({
          id_vendor: currentVendor.id_vendor,
          nama_menu: newMenu.nama_menu,
          bahan: newMenu.bahan,
          foto_url: fotoUrl,
          tanggal: newMenu.date || newMenu.tanggal || new Date().toISOString().split('T')[0],
          notes: newMenu.notes
        })
      }
      await refreshVendorMenus(currentVendor?.id_vendor, nutritionItems)
      setEditingMenu(null)
      setMenuFormMode('create')
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const handleRequestIngredient = async (requestData) => {
    if (!currentVendor) throw new Error('Vendor tidak ditemukan untuk user yang sedang login.')
    await api.createNutritionRequest({
      id_vendor: currentVendor.id_vendor,
      requested_by: user.id_user,
      ...requestData
    })
  }

  const handleDocumentFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setDocumentUpload({ dataUrl: reader.result, fileName: file.name })
      setDocumentForm(prev => ({ ...prev, nama_dokumen: prev.nama_dokumen || file.name.replace(/\.[^.]+$/, '') }))
    }
    reader.readAsDataURL(file)
  }

  const handleUploadDocument = async (e) => {
    e.preventDefault()
    if (!currentVendor) {
      triggerToast('Vendor tidak ditemukan.', 'warning')
      return
    }
    if (!documentUpload) {
      triggerToast('Pilih file dokumen terlebih dahulu.', 'warning')
      return
    }
    setIsUploadingDocument(true)
    try {
      const uploaded = await api.uploadVendorDocument({
        imageData: documentUpload.dataUrl,
        fileName: documentUpload.fileName
      })
      await api.createDokumen({
        id_vendor: currentVendor.id_vendor,
        nama_dokumen: documentForm.nama_dokumen || documentUpload.fileName,
        jenis: documentForm.jenis,
        status: 'pending_review',
        tanggal_berlaku: documentForm.tanggal_berlaku || null,
        file_path: uploaded.file_path
      })
      const refreshed = await api.getDokumen(currentVendor.id_vendor)
      setDokumen(refreshed)
      setDocumentForm({ nama_dokumen: '', jenis: 'izin_usaha', tanggal_berlaku: '' })
      setDocumentUpload(null)
      triggerToast('Dokumen berhasil diunggah untuk review Pemerintah.')
    } catch (err) {
      console.error(err)
      triggerToast(`Gagal upload dokumen: ${err.message}`, 'warning')
    } finally {
      setIsUploadingDocument(false)
    }
  }

  const handleArchiveDocument = async (doc) => {
    if (!window.confirm(`Arsipkan ${doc.nama_dokumen}?`)) return
    try {
      await api.archiveDokumen(doc.id_dokumen)
      setDokumen(prev => prev.filter(item => item.id_dokumen !== doc.id_dokumen))
    } catch (err) {
      console.error(err)
      triggerToast(`Gagal mengarsipkan dokumen: ${err.message}`, 'warning')
    }
  }

  const handleAddStok = async (e) => {
    e.preventDefault()
    const form = e.target
    const data = {
      id_dapur: selectedDapurForStok,
      nama_bahan: formBahan,
      jumlah: parseFloat(form.jumlah.value),
      satuan: formSatuan
    }
    try {
      const created = await api.createStok(data)
      api.getStok(selectedDapurForStok).then(setStokData).catch(console.error)
      api.getStokHistory(selectedDapurForStok).then(setStokHistory).catch(console.error)
      form.reset()
      setFormBahan('')
      setFormSatuan('kg')
    } catch (err) { console.error(err) }
  }

  const handleUpdateStok = async (id_stok, newJumlah) => {
    try {
      await api.updateStok(id_stok, { jumlah: parseFloat(newJumlah) })
      setStokData(prev => prev.map(s => s.id_stok === id_stok ? { ...s, jumlah: parseFloat(newJumlah) } : s))
      api.getStokHistory(selectedDapurForStok).then(setStokHistory).catch(console.error)
    } catch (err) { console.error(err) }
  }

  const handleDeleteStok = async (id_stok) => {
    if (confirm("Hapus item stok ini?")) {
      try {
        await api.deleteStok(id_stok)
        setStokData(prev => prev.filter(s => s.id_stok !== id_stok))
        api.getStokHistory(selectedDapurForStok).then(setStokHistory).catch(console.error)
      } catch (err) { console.error(err) }
    }
  }

  const [showTicketForm, setShowTicketForm] = useState(false)

  const refreshOperationalTickets = async (sourceDapurs = dapurs) => {
    const dapurIds = new Set((sourceDapurs || []).map((item) => item.id_dapur || item.id))
    const [produksiRows, distribusiRows] = await Promise.all([
      api.getProduksi(),
      api.getDistribusi()
    ])
    const filteredProduksi = produksiRows.filter((item) => dapurIds.has(item.id_dapur))
    const produksiIds = new Set(filteredProduksi.map((item) => item.id_produksi))
    setProduksi(filteredProduksi)
    setDistribusi(distribusiRows.filter((item) => produksiIds.has(item.id_produksi)))
  }

  const handleCreateProduksiTicket = async (data) => {
    try {
      await api.createProduksi({ ...data, status: 'pending' })
      await refreshOperationalTickets()
    } catch (err) {
      triggerToast(`Gagal membuat tiket: ${err.message}`, 'warning')
      throw err
    }
  }

  const handleUpdateProduksiStatus = async (id_produksi, status) => {
    try {
      setProdError(null)
      await api.updateProduksi(id_produksi, { status })
      triggerToast(produksiStatusMeta[status]?.toast || 'Status produksi berhasil diperbarui.')
      await refreshOperationalTickets()
      // Refresh stok silently
      if (selectedDapurForStok) {
        api.getStok(selectedDapurForStok).then(setStokData).catch(console.error)
        api.getStokHistory(selectedDapurForStok).then(setStokHistory).catch(console.error)
      }
    } catch (err) {
      const p = produksi.find(item => item.id_produksi === id_produksi)
      const dapurId = p ? p.id_dapur : selectedDapurForStok
      
      let bahanName = ''
      const matchStok = err.message.match(/Stok\s+([A-Za-z0-9\s\-_]+)\s+(kurang|tidak mencukupi)/i)
      const matchRegister = err.message.match(/Bahan\s+([A-Za-z0-9\s\-_]+)\s+belum terdaftar/i)
      if (matchStok) {
        bahanName = matchStok[1].trim()
      } else if (matchRegister) {
        bahanName = matchRegister[1].trim()
      }

      setProdError({
        message: err.message,
        dapurId,
        bahanName
      })
    }
  }

  const handleUpdateDistribusiStatus = async (id_distribusi, status) => {
    try {
      await api.updateDistribusi(id_distribusi, { status })
      triggerToast(`Status distribusi diperbarui ke ${distribusiStatusMeta[status]?.label || status}.`)
      await refreshOperationalTickets()
    } catch (err) {
      triggerToast(`Gagal memperbarui distribusi: ${err.message}`, 'warning')
    }
  }

  const handleReviseMenu = (menu) => {
    setEditingMenu(menu)
    setMenuFormMode('revision')
    setShowMenuForm(true)
    if (path !== '/vendor/menu') {
      navigate('/vendor/menu')
    }
  }


  
  const stats = [
    { title: "Dashboard", value: "MBG Centre", icon: <LayoutDashboard />, color: "var(--primary)" },
    { title: "Dapur Operasional", value: approvedDapurs.length.toString(), icon: <Store />, color: "var(--secondary)" },
    { title: "Varian Menu Gizi", value: menus.length.toString(), icon: <UtensilsCrossed />, color: "var(--banana)" }
  ]
  const approvedMenus = menus.filter((menu) => menu.status_validasi === 'approved')
  const pendingMenus = menus.filter((menu) => menu.status_validasi === 'pending')
  const rejectedMenus = menus.filter((menu) => menu.status_validasi === 'rejected')

  const prodList = [
    { school: "SDN 02 Mandonga", menuName: "Nasi Ayam Tempe", status: "DISTRIBUSI", date: "14 Mar 2026" },
    { school: "SMPN 05 Kendari", menuName: "Nasi Ikan Kembung", status: "PRODUKSI", date: "14 Mar 2026" },
    { school: "SDN 08 Kadia", menuName: "Soto Ayam", status: "SELESAI", date: "13 Mar 2026" }
  ]

  const renderContent = () => {
    if (isInformasi) return (
      <div className="grid" style={{ gap: '1rem' }}>
        <Header title="Informasi & Dokumen Vendor" subtitle="Operational Center • Live Monitoring" />
        
        {/* Section: Daftar Dapur */}
        <AnimatePresence>
          {showAddForm && (
            <AddDapurForm isOpen={true} onClose={() => setShowAddForm(false)} onSave={handleAddDapur} />
          )}
        </AnimatePresence>
        <div className="card dashboard-card-vibrant" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <div className="flex justify-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: '950' }}>Daftar Dapur Terdaftar</h3>
            <button 
              onClick={() => setShowAddForm(true)}
              className="btn-primary" 
              style={{ padding: '0.8rem 1.5rem', borderRadius: '24px', border: 'none', color: 'white', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Plus size={18} /> Tambah Dapur
            </button>
          </div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {dapurs.length === 0 && (
              <div style={{ padding: '1.5rem', background: 'var(--bg)', borderRadius: '12px', border: '1px dashed var(--border)', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'center' }}>
                Belum ada dapur terdaftar.
              </div>
            )}
            {dapurs.map((d, i) => {
              const statusMeta = dapurStatusMeta[d.status_verifikasi || 'pending'] || dapurStatusMeta.pending
              return (
              <div key={i} style={{ padding: '1.5rem', background: 'var(--bg)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(0,0,0,0.05)', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ background: 'white', padding: '12px', borderRadius: '15px' }}><Store color="var(--primary)" size={24} /></div>
                  <div>
                    <h4 style={{ fontWeight: '900' }}>Dapur {d.lokasi}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: D-00{(d.id_dapur || d.id || 0).toString().slice(-3)} | Kapasitas: {d.kapasitas_produksi} Porsi/Hari</p>
                    <p style={{ fontSize: '0.75rem', color: statusMeta.color, fontWeight: '800', marginTop: '0.35rem' }}>{statusMeta.helper}</p>
                    {d.review_note && (
                      <p style={{ fontSize: '0.75rem', color: '#7f1d1d', fontWeight: '700', marginTop: '0.35rem' }}>
                        Catatan Pemerintah: {d.review_note}
                      </p>
                    )}
                    {d.reviewed_at && (
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', marginTop: '0.3rem' }}>
                        Ditinjau {new Date(d.reviewed_at).toLocaleDateString('id-ID')} {d.reviewed_by_name ? `oleh ${d.reviewed_by_name}` : ''}
                      </p>
                    )}
                    {d.hash && (
                      <p style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: '800', fontFamily: 'monospace', marginTop: '4px' }}>
                        🔗 LEDGER HASH: {d.hash}
                      </p>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ textAlign: 'right', maxWidth: '220px' }}>
                    <span className="badge" style={{ background: statusMeta.background, color: statusMeta.color, fontWeight: '900', marginBottom: '5px', display: 'inline-block' }}>{statusMeta.label}</span>
                    <p style={{ fontSize: '0.75rem', fontWeight: '800', color: statusMeta.color }}>
                      {d.status_verifikasi === 'approved' ? 'Siap untuk stok, mapping, dan produksi' : 'Belum bisa dipakai untuk operasional'}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDeleteDapur(d.id_dapur || d.id)}
                    style={{ background: '#fff5f5', color: '#ff4d4d', border: '1px solid #ffe3e3', padding: '12px', borderRadius: '15px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                    title="Hapus / Non-aktifkan Dapur"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* Section: Dokumen Izin Usaha */}
        <div className="card dashboard-card-vibrant" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <h3 style={{ fontWeight: '950', marginBottom: '1rem' }}>Dokumen & Izin Usaha</h3>
          <form onSubmit={handleUploadDocument} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end', padding: '1rem', borderRadius: '12px', background: 'var(--bg)', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '900', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>NAMA DOKUMEN</label>
              <input value={documentForm.nama_dokumen} onChange={(e) => setDocumentForm({ ...documentForm, nama_dokumen: e.target.value })} placeholder="Contoh: Sertifikat Halal" style={{ width: '100%', padding: '0.9rem', borderRadius: '10px', border: '1px solid var(--border)', fontWeight: '700' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '900', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>JENIS</label>
              <select value={documentForm.jenis} onChange={(e) => setDocumentForm({ ...documentForm, jenis: e.target.value })} style={{ width: '100%', padding: '0.9rem', borderRadius: '10px', border: '1px solid var(--border)', fontWeight: '700', background: 'white' }}>
                <option value="izin_usaha">Izin Usaha</option>
                <option value="sertifikat_halal">Sertifikat Halal</option>
                <option value="izin_edar">Izin Edar</option>
                <option value="sertifikat_laik_hygiene">Higiene Sanitasi</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '900', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>FILE</label>
              <label style={{ width: '100%', padding: '0.9rem', borderRadius: '10px', border: '1px solid var(--border)', fontWeight: '800', background: 'white', display: 'block', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {documentUpload?.fileName || 'Pilih file'}
                <input type="file" accept="image/*,application/pdf" onChange={(e) => handleDocumentFile(e.target.files?.[0])} style={{ display: 'none' }} />
              </label>
            </div>
            <button type="submit" disabled={isUploadingDocument} className="btn-primary" style={{ padding: '0.95rem 1.2rem', borderRadius: '12px', border: 'none', color: 'white', fontWeight: '900', cursor: isUploadingDocument ? 'wait' : 'pointer', opacity: isUploadingDocument ? 0.7 : 1 }}>
              {isUploadingDocument ? 'Upload...' : 'Upload'}
            </button>
          </form>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {dokumen.length === 0 && (
              <div className="card" style={{ padding: '1rem', borderRadius: '12px', border: '1px dashed var(--border)', background: 'white' }}>
                <p style={{ color: 'var(--text-muted)', fontWeight: '800' }}>Belum ada dokumen vendor. Upload dokumen untuk review Pemerintah.</p>
              </div>
            )}
            {dokumen.map((doc, i) => {
              const docIcon = doc.jenis === 'sertifikat_halal' ? <ShieldCheck color="var(--secondary)" /> : 
                              doc.jenis === 'sertifikat_laik_hygiene' ? <ClipboardCheck color="var(--primary)" /> : 
                              doc.status === 'pending' ? <Clock color="var(--banana)" /> : <FileText color="var(--primary)" />;
              const displayStatus = doc.status === 'valid' || doc.status === 'approved' ? 'Verified' : (doc.status === 'pending' || doc.status === 'pending_review') ? 'Pending' : 'Expired';
              const displayDate = doc.tanggal_berlaku ? new Date(doc.tanggal_berlaku).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date(doc.created_at || '2026-01-01').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
              
              return (
                <div key={i} className="card" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'white' }}>
                  <div style={{ background: 'var(--bg)', width: '50px', height: '50px', borderRadius: '15px', display: 'grid', placeItems: 'center', marginBottom: '1.5rem' }}>{docIcon}</div>
                  <h4 style={{ fontWeight: '900', marginBottom: '0.5rem' }}>{doc.nama_dokumen}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Diunggah: {displayDate}</p>
                  <div className="flex justify-between" style={{ alignItems: 'center' }}>
                    <span className="badge" style={{ background: displayStatus === 'Verified' ? 'var(--primary-light)' : 'var(--banana-light)', color: displayStatus === 'Verified' ? 'var(--primary)' : 'var(--banana)', fontWeight: '900' }}>{displayStatus}</span>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button 
                        onClick={() => setActiveDoc({ ...doc, title: doc.nama_dokumen, date: displayDate, status: displayStatus })}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        Lihat Detail
                      </button>
                      <button onClick={() => handleArchiveDocument(doc)} style={{ background: '#fee2e2', border: 'none', color: '#b91c1c', borderRadius: '8px', padding: '0.35rem 0.55rem', fontWeight: '900', cursor: 'pointer', fontSize: '0.8rem' }}>Arsip</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    )

    if (isStok) return (
      <div className="grid" style={{ gap: '1.5rem' }}>
        <Header title="Manajemen Stok & Gudang" subtitle="Operational Center • Live Monitoring" />
        
        <div className="card dashboard-card-vibrant" style={{ padding: '1.5rem', borderRadius: '16px' }}>
           <div style={{ marginBottom: '1.5rem' }}>
             <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px', color: 'var(--text-muted)' }}>PILIH DAPUR OPERASIONAL</label>
             <select 
               value={selectedDapurForStok || ''} 
               onChange={(e) => setSelectedDapurForStok(e.target.value)}
               disabled={approvedDapurs.length === 0}
               style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid var(--border)', fontWeight: '700', fontSize: '1.1rem' }}
             >
               <option value="" disabled>{approvedDapurs.length === 0 ? '-- Belum ada dapur approved --' : '-- Pilih Dapur --'}</option>
               {approvedDapurs.map(d => <option key={d.id_dapur || d.id} value={d.id_dapur || d.id}>Dapur {d.lokasi}</option>)}
             </select>
             {approvedDapurs.length === 0 && (
               <p style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: '#92400e', fontWeight: '700' }}>
                 Stok hanya bisa dikelola dari dapur yang sudah disetujui Pemerintah.
               </p>
             )}
           </div>
           
           {selectedDapurForStok ? (
             <div style={{ display: 'grid', gap: '1.5rem' }}>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {[
                    {
                      status: 'all',
                      title: 'Total Kategori Bahan',
                      val: stokData.length,
                      unit: 'Item',
                      desc: 'Bahan baku aktif terdaftar',
                      icon: <Archive color="var(--primary)" />,
                      color: 'var(--primary)',
                      bgDefault: 'var(--bg)'
                    },
                    {
                      status: 'kritis',
                      title: 'Bahan Kritis & Habis',
                      val: stokData.filter(s => s.jumlah <= 0 || s.jumlah < 5).length,
                      unit: 'Item',
                      desc: stokData.some(s => s.jumlah <= 0 || s.jumlah < 5) ? 'Segera lakukan replenishment!' : 'Semua stok dalam batas aman',
                      icon: <AlertCircle color="#dc2626" />,
                      color: '#dc2626',
                      bgDefault: stokData.some(s => s.jumlah <= 0 || s.jumlah < 5) ? '#fff5f5' : 'var(--bg)',
                      borderDefault: stokData.some(s => s.jumlah <= 0 || s.jumlah < 5) ? '1px solid #fee2e2' : '1px solid var(--border)'
                    },
                    {
                      status: 'ledger',
                      title: 'Total Ledger Mutasi',
                      val: stokHistory.length,
                      unit: 'Log',
                      desc: 'Mutasi stok terverifikasi sistem',
                      icon: <Activity color="#3b82f6" />,
                      color: '#3b82f6',
                      bgDefault: 'var(--bg)'
                    }
                  ].map((card, idx) => {
                    const isActive = stokFilter === card.status;
                    return (
                      <div
                        key={idx}
                        className="card dashboard-card-vibrant"
                        style={{
                          padding: '1.25rem',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          background: isActive ? 'white' : card.bgDefault,
                          border: isActive ? `3px solid ${card.color}` : (card.borderDefault || '1.5px solid transparent'),
                          boxShadow: isActive ? `0 10px 25px ${card.color}25` : 'none',
                          transform: isActive ? 'scale(1.02)' : 'none',
                          transition: 'all 0.25s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                        onClick={() => {
                          if (stokFilter === card.status) {
                            setStokFilter(null);
                          } else {
                            setStokFilter(card.status);
                            if (card.status === 'ledger') {
                              const ledgerEl = document.getElementById('ledger-section');
                              if (ledgerEl) {
                                ledgerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }
                          }
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ background: `${card.color}15`, padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {card.icon}
                          </div>
                          {isActive && (
                            <span style={{ fontSize: '0.65rem', color: card.color, background: `${card.color}15`, padding: '2px 8px', borderRadius: '12px', fontWeight: '900' }}>
                              Fokus Aktif
                            </span>
                          )}
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                            {card.title}
                          </p>
                          <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: isActive ? card.color : 'var(--text-main)' }}>
                            {card.val} <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>{card.unit}</span>
                          </h3>
                          <p style={{ fontSize: '0.75rem', color: (card.status === 'kritis' && stokData.some(s => s.jumlah <= 0 || s.jumlah < 5)) ? '#b91c1c' : 'var(--text-muted)', fontWeight: '600', marginTop: '4px' }}>
                            {card.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

               {/* Stock & Replenishment Form Section */}
               <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
                 <div>
                   <h3 style={{ fontWeight: '950', marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                     <Package size={20} color="var(--primary)" />
                     Stok Terkini
                   </h3>
                   <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '450px', overflowY: 'auto', paddingRight: '10px' }}>
                     {(() => {
                       const displayedStok = stokData.filter(s => {
                         if (stokFilter === 'kritis') {
                           return s.jumlah <= 0 || s.jumlah < 5;
                         }
                         return true;
                       });
                       
                       if (displayedStok.length === 0) {
                         return (
                           <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                             <Archive size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                             <p style={{ color: 'var(--text-muted)', fontWeight: '700' }}>
                               {stokFilter === 'kritis' ? 'Tidak ada bahan dalam kondisi kritis.' : 'Stok kosong.'}
                             </p>
                           </div>
                         );
                       }
                       
                       return displayedStok.map((s, i) => {
                         const isCritical = s.jumlah <= 0 || s.jumlah < 5;
                         return (
                           <div key={i} style={{ 
                             padding: '1.25rem', 
                             background: isCritical ? '#fffcfc' : 'var(--bg)', 
                             borderRadius: '12px', 
                             display: 'flex', 
                             justifyContent: 'space-between', 
                             alignItems: 'center', 
                             border: isCritical ? '1.5px solid #fca5a5' : '1px solid var(--border)',
                             boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
                           }}>
                             <div>
                               <h4 style={{ fontWeight: '900', fontSize: '1.05rem', color: isCritical ? '#991b1b' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                 {s.nama_bahan}
                                 {isCritical && <span style={{ fontSize: '0.65rem', background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '4px', fontWeight: '800' }}>KRITIS</span>}
                               </h4>
                               <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>Update: {new Date(s.last_updated).toLocaleString('id-ID')}</p>
                             </div>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                               <input 
                                 type="number" 
                                 step="any"
                                 defaultValue={s.jumlah}
                                 onBlur={(e) => handleUpdateStok(s.id_stok, e.target.value)}
                                 style={{ width: '80px', padding: '10px', borderRadius: '10px', border: '1.5px solid var(--border)', textAlign: 'center', fontWeight: '800' }}
                               />
                               <span style={{ fontWeight: '800', color: 'var(--text-muted)', minWidth: '30px' }}>{s.satuan}</span>
                               <button onClick={() => handleDeleteStok(s.id_stok)} style={{ background: '#fff5f5', color: '#ff4d4d', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}><Trash2 size={18} /></button>
                             </div>
                           </div>
                         );
                       });
                     })()}
                   </div>
                 </div>
                 
                 {/* Replenishment Form Box */}
                 <div style={{ 
                   background: '#ffffff', 
                   padding: '1.5rem', 
                   borderRadius: '16px', 
                   border: formBahan ? '2px solid var(--primary)' : '1px solid var(--border)', 
                   boxShadow: formBahan ? '0 10px 30px rgba(16,185,129,0.08)' : 'var(--shadow)',
                   position: 'relative'
                 }}>
                   {formBahan && (
                     <span className="badge animate-pulse-glow" style={{ 
                       position: 'absolute', 
                       top: '-12px', 
                       right: '20px', 
                       background: 'var(--primary)', 
                       color: 'white', 
                       fontWeight: '900',
                       fontSize: '0.65rem',
                       padding: '4px 12px',
                       borderRadius: '20px'
                     }}>
                       📍 QUICK ACTION REPLENISHMENT
                     </span>
                   )}
                   <h4 style={{ fontWeight: '950', marginBottom: '1rem', fontSize: '1.1rem' }}>Tambah Item Baru</h4>
                   <form onSubmit={handleAddStok} style={{ display: 'grid', gap: '1rem' }}>
                      <div style={{ position: 'relative' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '5px' }}>NAMA BAHAN BAKU</label>
                        <input 
                          required 
                          name="nama_bahan" 
                          value={formBahan}
                          onChange={e => handleBahanChange(e.target.value)}
                          onFocus={() => setShowSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                          placeholder="Nama Bahan (Cth: Beras)" 
                          style={{ 
                            width: '100%',
                            padding: '1rem', 
                            borderRadius: '12px', 
                            border: formBahan ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                            fontWeight: '700',
                            outline: 'none',
                            background: formBahan ? 'var(--primary-light)' : 'white'
                          }} 
                        />
                        {(() => {
                          const suggestions = formBahan.trim() ? stokData.filter(s => 
                            s.nama_bahan.toLowerCase().includes(formBahan.toLowerCase()) &&
                            s.nama_bahan.toLowerCase() !== formBahan.toLowerCase()
                          ).slice(0, 3) : [];
                          const existingItem = stokData.find(s => s.nama_bahan.toLowerCase() === formBahan.trim().toLowerCase());

                          return (
                            <>
                              {showSuggestions && suggestions.length > 0 && (
                                <div style={{ 
                                  position: 'absolute',
                                  top: '100%',
                                  left: 0,
                                  right: 0,
                                  marginTop: '5px', 
                                  background: '#ffffff', 
                                  border: '1.5px solid var(--border)', 
                                  borderRadius: '12px', 
                                  padding: '8px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '4px',
                                  zIndex: 100,
                                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                }}>
                                  <p style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)', paddingLeft: '8px', marginBottom: '2px' }}>BAHAN SERUPA DITEMUKAN:</p>
                                  {suggestions.map((s, idx) => (
                                    <div 
                                      key={idx} 
                                      onClick={() => {
                                        setFormBahan(s.nama_bahan);
                                        setFormSatuan(s.satuan);
                                      }}
                                      style={{ 
                                        padding: '8px 12px', 
                                        borderRadius: '8px', 
                                        background: 'var(--bg)', 
                                        border: '1px solid #e2e8f0',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                      }}
                                    >
                                      <span style={{ fontWeight: '750', fontSize: '0.85rem' }}>{s.nama_bahan}</span>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '800', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px' }}>autofill ({s.satuan})</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {existingItem && (
                                <div style={{ 
                                  marginTop: '8px', 
                                  background: 'var(--primary-light)', 
                                  border: '1.5px solid var(--primary)', 
                                  borderRadius: '10px', 
                                  padding: '8px 12px',
                                  fontSize: '0.75rem',
                                  fontWeight: '750',
                                  color: 'var(--primary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}>
                                  <CheckCircle2 size={16} /> Bahan ini sudah terdaftar. Input baru akan ditambahkan ke stok {existingItem.nama_bahan} saat ini.
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '5px' }}>KUANTITAS</label>
                          <input required type="number" step="0.01" name="jumlah" placeholder="0.00" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1.5px solid var(--border)', fontWeight: '700' }} />
                        </div>
                        <div style={{ width: '120px' }}>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '5px' }}>SATUAN</label>
                          <select 
                            value={formSatuan} 
                            onChange={e => setFormSatuan(e.target.value)}
                            style={{ 
                              width: '100%', 
                              padding: '1rem', 
                              borderRadius: '12px', 
                              border: '1.5px solid var(--border)', 
                              fontWeight: '750',
                              background: 'white',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="kg">kg (Kilo)</option>
                            <option value="liter">liter (Ltr)</option>
                            <option value="pcs">pcs (Biji)</option>
                            <option value="pack">pack (Bks)</option>
                            <option value="butir">butir</option>
                            <option value="ikat">ikat</option>
                            <option value="gram">gram</option>
                          </select>
                        </div>
                      </div>
                      <button type="submit" className="btn-primary" style={{ padding: '1.2rem', borderRadius: '24px', border: 'none', color: 'white', fontWeight: '900', marginTop: '10px', cursor: 'pointer' }}>Tambahkan Item</button>
                    </form>
                 </div>
               </div>

               {/* Digital Banking Statement Ledger */}
               <div id="ledger-section" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                 <h3 style={{ fontWeight: '950', marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <Activity size={20} color="#3b82f6" />
                   Riwayat Transaksi Stok (Ledger)
                 </h3>
                 <div style={{ 
                   background: 'white', 
                   border: stokFilter === 'ledger' ? '3px solid #3b82f6' : '1px solid var(--border)', 
                   borderRadius: '16px', 
                   overflow: 'hidden', 
                   boxShadow: stokFilter === 'ledger' ? '0 10px 30px rgba(59, 130, 246, 0.15)' : '0 4px 20px rgba(0,0,0,0.02)',
                   transition: 'all 0.3s ease'
                 }}>
                   <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                     <thead>
                       <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>
                         <th style={{ padding: '1.25rem' }}>TANGGAL & WAKTU</th>
                         <th style={{ padding: '1.25rem' }}>BAHAN BAKU</th>
                         <th style={{ padding: '1.25rem' }}>TIPE MUTASI</th>
                         <th style={{ padding: '1.25rem', textAlign: 'right' }}>JUMLAH</th>
                         <th style={{ padding: '1.25rem' }}>TRANSAKSI / KETERANGAN</th>
                         <th style={{ padding: '1.25rem', textAlign: 'center' }}>MUTASI LOG</th>
                       </tr>
                     </thead>
                     <tbody>
                       {stokHistory.map((h, idx) => {
                         const isCredit = h.tipe === 'CREDIT'
                         const isDebit = h.tipe === 'DEBIT'
                         return (
                           <tr key={idx} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                             <td style={{ padding: '1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                               {new Date(h.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                             </td>
                             <td style={{ padding: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                               {h.nama_bahan}
                             </td>
                             <td style={{ padding: '1.25rem' }}>
                               <span className="badge" style={{ 
                                 background: h.tipe === 'CREDIT' ? '#dcfce7' : h.tipe === 'DEBIT' ? '#fee2e2' : '#f1f5f9',
                                 color: h.tipe === 'CREDIT' ? '#15803d' : h.tipe === 'DEBIT' ? '#b91c1c' : '#475569',
                                 fontWeight: '900',
                                 fontSize: '0.7rem'
                               }}>
                                 {h.tipe}
                               </span>
                             </td>
                             <td style={{ 
                               padding: '1.25rem', 
                               textAlign: 'right', 
                               fontWeight: '900', 
                               color: h.tipe === 'CREDIT' ? '#16a34a' : h.tipe === 'DEBIT' ? '#dc2626' : 'var(--text-main)' 
                             }}>
                               {h.tipe === 'CREDIT' ? '+' : h.tipe === 'DEBIT' ? '-' : ''} {parseFloat(h.jumlah)} {h.satuan}
                             </td>
                             <td style={{ padding: '1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                               {h.keterangan}
                             </td>
                             <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                               <span style={{ 
                                 fontSize: '0.65rem', 
                                 background: 'var(--primary-light)', 
                                 color: 'var(--primary)', 
                                 fontWeight: '800', 
                                 padding: '4px 10px', 
                                 borderRadius: '24px', 
                                 fontFamily: 'monospace' 
                               }}>
                                 #LEDGER-{h.id_log}
                               </span>
                             </td>
                           </tr>
                         )
                       })}
                       {stokHistory.length === 0 && (
                         <tr>
                           <td colSpan="6" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '700' }}>
                             Belum ada mutasi transaksi stok tercatat.
                           </td>
                         </tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>

             </div>
           ) : (
             <div style={{ textAlign: 'center', padding: '3rem 1.5rem', opacity: 0.5 }}>
               <Archive size={64} style={{ marginBottom: '1rem' }} />
               <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>Pilih dapur terlebih dahulu untuk melihat stok.</p>
             </div>
           )}
        </div>
      </div>
    )

    if (isMenu) return (
      <div className="grid" style={{ gap: '1.5rem' }}>
        <Header title="Katalog Menu Gizi" subtitle="Operational Center • Live Monitoring" />
        <AnimatePresence>
          {showMenuForm && (
            <AddMenuForm
              isOpen={true}
              onClose={closeMenuForm}
              onSave={handleAddMenu}
              editData={editingMenu}
              nutritionItems={nutritionItems}
              onRequestIngredient={handleRequestIngredient}
              mode={menuFormMode}
              revisionNote={menuFormMode === 'revision' ? editingMenu?.latestRejectedLog?.catatan || '' : ''}
            />
          )}
        </AnimatePresence>

        {/* 1. Ajukan Menu Baru (Full Width CTA Banner) */}
        <div style={{ 
          padding: '2rem 2.5rem', 
          borderRadius: '20px', 
          background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', 
          color: 'white', 
          boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.4)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid rgba(255,255,255,0.2)',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          {/* Background Decorative Element */}
          <div style={{ position: 'absolute', top: '-60px', right: '5%', opacity: 0.08, transform: 'rotate(15deg)' }}>
             <UtensilsCrossed size={300} />
          </div>
          
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
            <h3 style={{ fontWeight: '950', fontSize: '2.2rem', marginBottom: '0.8rem', letterSpacing: '-0.5px', color: 'white' }}>Ajukan Menu Baru</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', opacity: 0.9, margin: 0, color: 'white' }}>
              Wujudkan standar gizi nasional. Ajukan komposisi menu Anda untuk divalidasi oleh Ahli Gizi Pemerintah.
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openCreateMenuForm}
              style={{ 
                background: 'white', 
                color: '#064e3b', 
                border: 'none', 
                padding: '1.2rem 2.5rem', 
                borderRadius: '16px', 
                fontWeight: '950', 
                fontSize: '1.1rem', 
                cursor: 'pointer',
                boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Plus size={24} color="#10b981" /> Input Menu Sekarang
            </motion.button>
          </div>
        </div>

        {/* 2. Approved Menus Catalog */}
        <div className="card dashboard-card-vibrant" style={{ padding: '2rem', borderRadius: '20px', background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <div className="flex justify-between" style={{ gap: '1rem', alignItems: 'start', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontWeight: '950', marginBottom: '0.5rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.5rem' }}>
                <div style={{ background: 'var(--primary-light)', padding: '12px', borderRadius: '14px', display: 'grid', placeItems: 'center' }}>
                  <CheckCircle2 color="var(--primary)" size={24} />
                </div>
                Menu Siap Diproduksi
              </h3>
              <p style={{ color: '#64748b', fontWeight: '600', margin: 0, fontSize: '1rem', maxWidth: '820px' }}>
                Menu-menu di bawah ini telah disahkan oleh Ahli Gizi dan siap digunakan untuk tiket operasional produksi harian.
              </p>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '0.8rem 1rem', minWidth: '120px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: '950', color: '#0f172a', lineHeight: 1 }}>{approvedMenus.length}</p>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.78rem', color: '#64748b', fontWeight: '800' }}>menu approved</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {approvedMenus.map((m, i) => (
              <motion.div
                whileHover={{ scale: 1.02, translateY: -4 }}
                key={m.id_menu || i}
                className="card"
                style={{
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onClick={() => setSelectedAuditMenu(m)}
              >
                <div style={{ height: '140px', background: '#f8fafc', position: 'relative', borderBottom: '1px solid #e2e8f0' }}>
                  {m.foto_url ? (
                    <img src={api.assetUrl(m.foto_url)} alt={m.nama_menu} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#cbd5e1' }}>
                      <UtensilsCrossed size={48} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '900', padding: '6px 12px', borderRadius: '8px', border: '1px solid #bbf7d0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                      APPROVED
                    </span>
                  </div>
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontWeight: '950', fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px', lineHeight: '1.3' }}>{m.nama_menu}</h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700', marginBottom: '1.25rem', flex: 1 }}>
                    {m.bahan.slice(0, 3).map((b) => b.nama).join(', ')}{m.bahan.length > 3 ? ', dll.' : ''}
                  </p>
                  <div className="flex justify-between" style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '1rem', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700' }}>
                      Disahkan: {m.latestApprovedLog?.created_at ? new Date(m.latestApprovedLog.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : (m.tanggal || m.date || '-')}
                    </span>
                    <button
                      style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}
                    >
                      Detail <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {approvedMenus.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 2rem', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #cbd5e1', marginTop: '1rem' }}>
              <CheckCircle2 color="#94a3b8" size={48} style={{ margin: '0 auto 15px', opacity: 0.5 }} />
              <h4 style={{ color: '#475569', fontWeight: '900', fontSize: '1.2rem', marginBottom: '8px' }}>Belum Ada Menu Disahkan</h4>
              <p style={{ color: '#64748b', fontWeight: '600', maxWidth: '400px', margin: '0 auto' }}>
                Menu yang telah divalidasi dan disetujui oleh Ahli Gizi akan muncul di sini sebagai katalog produksi Anda.
              </p>
            </div>
          )}
        </div>

        {/* 3. Grid Status (Pending & Revisi) */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          
          {/* Pending Section */}
          <div className="card dashboard-card-vibrant" style={{ padding: '1.5rem', borderRadius: '16px', background: 'white' }}>
            <h3 style={{ fontWeight: '950', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.3rem' }}>
              <div style={{ background: 'var(--banana-light)', padding: '10px', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                <Clock color="var(--banana)" size={22} />
              </div>
              Menunggu Validasi
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingMenus.map((m, i) => (
                <div key={i} className="card" style={{ padding: '1.5rem', borderRadius: '12px', border: '1.5px solid var(--border)', background: '#f8fafc' }}>
                   <div className="flex justify-between" style={{ marginBottom: '12px', alignItems: 'flex-start' }}>
                      <h4 style={{ fontWeight: '950', fontSize: '1.15rem', color: 'var(--text-main)' }}>{m.nama_menu}</h4>
                      <span className="badge" style={{ background: 'var(--banana-light)', color: 'var(--banana)', fontWeight: '900', padding: '6px 12px', borderRadius: '8px' }}>PENDING</span>
                   </div>
                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
                      {m.bahan.slice(0, 4).map((b, bi) => <span key={bi} style={{ fontSize: '0.75rem', background: 'white', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '24px', fontWeight: '800', color: '#64748b' }}>{b.nama}</span>)}
                      {m.bahan.length > 4 && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', padding: '6px' }}>+{m.bahan.length - 4} lainnya</span>}
                   </div>
                   <div className="flex justify-end" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                      <button 
                        onClick={() => openEditMenuForm(m)}
                        style={{ color: 'var(--primary)', background: 'var(--primary-light)', padding: '8px 16px', borderRadius: '10px', border: 'none', fontWeight: '900', cursor: 'pointer', transition: '0.2s' }}
                        onMouseOver={(e)=>e.currentTarget.style.filter='brightness(0.95)'} onMouseOut={(e)=>e.currentTarget.style.filter='none'}
                      >
                        Edit Resep
                      </button>
                   </div>
                </div>
              ))}
              {pendingMenus.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <CheckCircle color="#94a3b8" size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                  <p style={{ color: '#64748b', fontWeight: '700' }}>Antrian bersih, tidak ada menu pending.</p>
                </div>
              )}
            </div>
          </div>

          {/* Revisi Section */}
          <div className="card dashboard-card-vibrant" style={{ padding: '1.5rem', borderRadius: '16px', background: 'white', border: '2px solid #fee2e2' }}>
            <h3 style={{ fontWeight: '950', marginBottom: '1.5rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.3rem' }}>
              <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                <AlertCircle color="#dc2626" size={22} />
              </div>
              Butuh Revisi
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {rejectedMenus.map((m, i) => (
                <motion.div 
                  whileHover={{ scale: 1.01, translateY: -2 }}
                  key={i} 
                  className="card" 
                  style={{ padding: '1.5rem', borderRadius: '12px', border: '1.5px solid #fecaca', background: '#fffafa', cursor: 'pointer', boxShadow: '0 4px 6px rgba(220, 38, 38, 0.05)' }}
                  onClick={() => setSelectedAuditMenu(m)}
                >
                   <div className="flex justify-between" style={{ marginBottom: '8px', alignItems: 'flex-start' }}>
                      <h4 style={{ fontWeight: '950', fontSize: '1.15rem', color: '#991b1b' }}>{m.nama_menu}</h4>
                      <span className="badge" style={{ background: '#fee2e2', color: '#dc2626', fontWeight: '900', padding: '6px 12px', borderRadius: '8px', border: '1px solid #fca5a5' }}>REVISI</span>
                   </div>
                   <p style={{ fontSize: '0.9rem', color: '#7f1d1d', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                     <Search size={14} /> Klik untuk melihat catatan audit Ahli Gizi
                   </p>
                   <p style={{ fontSize: '0.82rem', color: '#991b1b', fontWeight: '700', margin: '-0.8rem 0 1.1rem', lineHeight: '1.5' }}>
                     {m.latestRejectedLog?.catatan || 'Belum ada pesan revisi yang terekam.'}
                   </p>
                   <div className="flex justify-between" style={{ borderTop: '1px solid #fecaca', paddingTop: '1rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#b91c1c', fontWeight: '800' }}>Terdeteksi: {m.tanggal || m.date || '-'}</span>
                      <button 
                        style={{ color: '#dc2626', background: 'none', border: 'none', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        Lihat Laporan <ChevronRight size={16} />
                      </button>
                   </div>
                </motion.div>
              ))}
              {rejectedMenus.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <CheckCircle2 color="#10b981" size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                  <p style={{ color: '#64748b', fontWeight: '700' }}>Hebat! Tidak ada menu yang butuh revisi saat ini.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    )

    if (isProduksi) {
      const activeProduksi = produksi.filter(p => p.status !== 'selesai')
      const totalTickets = activeProduksi.length || 1
      const prepCount = activeProduksi.filter(p => p.status === 'pending' || p.status === 'persiapan').length
      const cookCount = activeProduksi.filter(p => p.status === 'memasak').length
      const packCount = activeProduksi.filter(p => p.status === 'siap_kirim').length
      
      const prepVal = Math.min(100, Math.round((prepCount / totalTickets) * 100));
      const cookVal = Math.min(100, Math.round((cookCount / totalTickets) * 100));
      const packVal = Math.min(100, Math.round((packCount / totalTickets) * 100));

      return (
        <div className="grid" style={{ gap: '1rem' }}>
          <Header title="Tiket Produksi & Distribusi" subtitle="Status produksi dan distribusi dikelola dari tiket yang sama." />
          
          {prodError && (
            <div style={{
              background: '#fef2f2',
              border: '2px solid #fecaca',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.05)',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: '#fee2e2', padding: '10px', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                  <AlertCircle color="#dc2626" size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: '950', color: '#991b1b', fontSize: '1.1rem' }}>Kegagalan Alokasi Bahan Baku</h4>
                  <p style={{ color: '#7f1d1d', fontWeight: '700', fontSize: '0.9rem', marginTop: '2px' }}>{prodError.message}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {prodError.bahanName && (
                  <button
                    onClick={() => {
                      localStorage.setItem('selectedDapurForStok', prodError.dapurId)
                      localStorage.setItem('replenishBahan', prodError.bahanName)
                      setSelectedDapurForStok(prodError.dapurId.toString())
                      setProdError(null)
                      navigate('/vendor/stok')
                    }}
                    style={{
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '12px',
                      fontWeight: '950',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 10px rgba(220,38,38,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Plus size={16} /> Tambah Stok {prodError.bahanName}
                  </button>
                )}
                <button
                  onClick={() => setProdError(null)}
                  style={{
                    background: 'white',
                    color: '#64748b',
                    border: '1.5px solid #e2e8f0',
                    padding: '10px 15px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>
          )}

          <AnimatePresence>
            {showTicketForm && (
              <AddTicketForm 
                onClose={() => setShowTicketForm(false)} 
                onSave={handleCreateProduksiTicket} 
                dapurs={approvedDapurs} 
                menus={menus} 
                sekolah={sekolah} 
                onNotify={triggerToast}
              />
            )}
          </AnimatePresence>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
             {[
               { title: 'Persiapan Bahan', val: `${prepVal}%`, count: activeProduksi.filter(x => x.status === 'persiapan' || x.status === 'pending').length, status: 'persiapan', icon: <Package color="var(--primary)" />, color: 'var(--primary)' },
               { title: 'Proses Pemasakan', val: `${cookVal}%`, count: activeProduksi.filter(x => x.status === 'memasak').length, status: 'memasak', icon: <UtensilsCrossed color="var(--secondary)" />, color: 'var(--secondary)' },
               { title: 'Packaging', val: `${packVal}%`, count: activeProduksi.filter(x => x.status === 'siap_kirim').length, status: 'siap_kirim', icon: <Zap color="var(--banana)" />, color: 'var(--banana)' }
             ].map((p, i) => {
               const isActive = statusFilter === p.status;
               return (
                 <div 
                   key={i} 
                   className="card dashboard-card-vibrant" 
                   style={{ 
                     padding: '1.25rem', 
                     borderRadius: '16px',
                     cursor: 'pointer',
                     border: isActive ? `3px solid ${p.color}` : '1.5px solid transparent',
                     boxShadow: isActive ? `0 10px 25px ${p.color}25` : 'none',
                     transform: isActive ? 'scale(1.02)' : 'none',
                     transition: 'all 0.25s ease',
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'space-between'
                   }}
                   onClick={() => {
                     if (statusFilter === p.status) {
                       setStatusFilter(null);
                     } else {
                       setStatusFilter(p.status);
                     }
                   }}
                 >
                   <div>
                     <div className="flex justify-between" style={{ marginBottom: '1.2rem', alignItems: 'center' }}>
                       <div style={{ background: `${p.color}15`, padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         {p.icon}
                       </div>
                       <span style={{ fontWeight: '950', color: p.color, fontSize: '1.2rem' }}>{p.val}</span>
                     </div>
                     <h4 style={{ fontWeight: '900', marginBottom: '12px' }}>{p.title}</h4>
                     <div style={{ height: '8px', background: 'var(--bg)', borderRadius: '10px', overflow: 'hidden' }}>
                       <div style={{ width: p.val, height: '100%', background: p.color, transition: 'width 1s ease-in-out' }} />
                     </div>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', alignItems: 'center' }}>
                     <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800' }}>
                       {p.count} Tiket Aktif
                     </span>
                     {isActive && (
                       <span style={{ fontSize: '0.7rem', color: p.color, background: `${p.color}15`, padding: '2px 8px', borderRadius: '12px', fontWeight: '900' }}>
                         Fokus Aktif
                       </span>
                     )}
                   </div>
                 </div>
               );
             })}
          </div>
          <div className="card dashboard-card-vibrant" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <div className="flex justify-between" style={{ marginBottom: '1rem', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontWeight: '950', marginBottom: '0.25rem' }}>Tiket Operasional Vendor</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: '700' }}>
                  Status produksi dan distribusi sekarang dikelola dari tiket yang sama.
                </p>
              </div>
              <button 
                onClick={() => setShowTicketForm(true)}
                className="btn-primary" 
                disabled={approvedDapurs.length === 0 || approvedMenus.length === 0}
                style={{ padding: '0.8rem 1.5rem', borderRadius: '24px', border: 'none', color: 'white', fontWeight: '800', cursor: approvedDapurs.length === 0 || approvedMenus.length === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: approvedDapurs.length === 0 || approvedMenus.length === 0 ? 0.6 : 1 }}
              >
                <Plus size={18} /> Buat Tiket Produksi Baru
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.8rem' }}>
               <thead>
                 <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '900' }}>
                   <th>TICKET ID</th>
                   <th>MENU & PORSI</th>
                   <th>DAPUR & TARGET</th>
                   <th>PRODUKSI</th>
                   <th>DISTRIBUSI</th>
                   <th>AKSI</th>
                 </tr>
               </thead>
               <tbody>
                  {produksi
                    .filter(p => {
                      if (!statusFilter) return true;
                      if (statusFilter === 'persiapan') {
                        return p.status === 'persiapan' || p.status === 'pending';
                      }
                      return p.status === statusFilter;
                    })
                    .map((p) => {
                   const delivery = distribusiByProduksiId.get(p.id_produksi)
                   const deliveryMeta = delivery ? (distribusiStatusMeta[delivery.status] || distribusiStatusMeta.DIJADWALKAN) : null
                   return (
                   <tr key={p.id_produksi} style={{ background: 'var(--bg)', opacity: p.status === 'selesai' ? 0.6 : 1 }}>
                     <td style={{ padding: '1.5rem', fontWeight: '900', borderRadius: '15px 0 0 15px', color: 'var(--primary)' }}>#PRD-{p.id_produksi}</td>
                     <td style={{ padding: '1.5rem' }}>
                       <p style={{ fontWeight: '900', margin: 0 }}>{p.nama_menu}</p>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', margin: 0 }}>{p.jumlah_porsi} Porsi</p>
                     </td>
                     <td style={{ padding: '1.5rem' }}>
                       <p style={{ fontWeight: '800', margin: 0, fontSize: '0.9rem' }}>{p.dapur_lokasi}</p>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', margin: 0 }}>➡ {p.target_sekolah || 'Tidak ditentukan'}</p>
                     </td>
                     <td style={{ padding: '1.5rem' }}>
                       <span className="badge" style={{ background: produksiStatusMeta[p.status]?.badgeBackground || '#e2e8f0', color: produksiStatusMeta[p.status]?.badgeColor || '#64748b', fontWeight: '900' }}>
                         {produksiStatusMeta[p.status]?.label || String(p.status || '-').toUpperCase()}
                       </span>
                       <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', margin: '0.45rem 0 0' }}>
                         {produksiStatusMeta[p.status]?.helper || 'Status produksi aktif.'}
                       </p>
                     </td>
                     <td style={{ padding: '1.5rem' }}>
                       {delivery ? (
                         <>
                           <span className="badge" style={{ background: deliveryMeta?.background || '#e2e8f0', color: deliveryMeta?.color || '#64748b', fontWeight: '900' }}>
                             {deliveryMeta?.label || delivery.status}
                           </span>
                           <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', margin: '0.45rem 0 0' }}>
                             {deliveryMeta?.helper || 'Status distribusi aktif.'}
                           </p>
                         </>
                       ) : (
                         <span style={{ color: 'var(--text-muted)', fontWeight: '800', fontSize: '0.85rem' }}>Belum terhubung ke sekolah</span>
                       )}
                     </td>
                     <td style={{ padding: '1.5rem', borderRadius: '0 15px 15px 0' }}>
                       <div style={{ display: 'grid', gap: '0.6rem', justifyItems: 'start' }}>
                         {produksiStatusMeta[p.status]?.nextStatus ? (
                           <button 
                             onClick={() => handleUpdateProduksiStatus(p.id_produksi, produksiStatusMeta[p.status].nextStatus)}
                             style={{ background: produksiStatusMeta[p.status].actionBackground, color: 'white', border: 'none', padding: '10px 15px', borderRadius: '24px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 10px rgba(15,23,42,0.12)' }}
                           >
                             {produksiStatusMeta[p.status].actionLabel}
                           </button>
                         ) : (
                           <span style={{ color: 'var(--text-muted)', fontWeight: '800', fontSize: '0.85rem' }}>Batch produksi ditutup</span>
                         )}
                         {delivery?.id_distribusi && deliveryMeta?.nextStatus ? (
                           <button
                             onClick={() => handleUpdateDistribusiStatus(delivery.id_distribusi, deliveryMeta.nextStatus)}
                             style={{ background: deliveryMeta.actionBackground, color: 'white', border: 'none', padding: '10px 15px', borderRadius: '24px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 10px rgba(15,23,42,0.12)' }}
                           >
                             {deliveryMeta.actionLabel}
                           </button>
                         ) : delivery?.status === 'SELESAI' ? (
                           <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.82rem' }}>Sekolah sudah menutup distribusi</span>
                         ) : delivery?.status === 'TIBA' ? (
                           <span style={{ color: 'var(--secondary)', fontWeight: '800', fontSize: '0.82rem' }}>Menunggu penyelesaian dari sekolah</span>
                         ) : null}
                       </div>
                     </td>
                   </tr>
                 )})}
                 {produksi.length === 0 && (
                   <tr><td colSpan="6" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '700' }}>Belum ada tiket produksi.</td></tr>
                 )}
               </tbody>
            </table>
          </div>
        </div>
      )
    }

    return (
      <div style={{ textAlign: 'center', padding: '5rem', display: 'grid', placeItems: 'center', flex: 1 }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <ShieldCheck size={80} color="var(--border)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: '950', color: 'var(--text-muted)', letterSpacing: '-1px' }}>Silakan Pilih Menu di Sidebar</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: '600', marginTop: '10px' }}>Pilih kategori untuk memantau data operasional Anda</p>
        </motion.div>
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
              background: showToast.type === 'warning' ? 'var(--carrot)' : 'var(--primary)',
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
      {isMain ? (
        <>
          <WelcomeBanner name={currentVendor?.nama_vendor || user?.name || 'Vendor MBG'} />

          <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: '1rem', marginBottom: '1rem' }}>
            {stats.map((stat, i) => (
              <div
                key={i}
                className="card dashboard-card-vibrant"
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  display: "flex",
                  flexDirection: 'column',
                  gap: "16px",
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ background: `${stat.color}15`, padding: "1rem", borderRadius: "14px", color: stat.color, width: 'fit-content' }}>
                  {stat.icon}
                </div>
                <div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "700", marginBottom: "4px", textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.title}</p>
                  <h3 style={{ fontSize: "2rem", fontWeight: "900", color: 'var(--text-main)', letterSpacing: '-1px' }}>{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="card dashboard-card-vibrant" style={{
            padding: '1rem',
            borderRadius: '8px',
          }}>
            <div className="flex justify-between" style={{ marginBottom: "1.5rem" }}>
              <div className="flex" style={{ gap: "15px" }}>
                <div style={{ width: '44px', height: '44px', background: 'var(--role-light)', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                  <Activity color="var(--role-primary)" size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "800", letterSpacing: '-0.5px' }}>Feed Logistik Terkini</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Pemantauan distribusi armada gizi</p>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(distribusi.length > 0 ? distribusi.slice(0, 3) : prodList).map((item, i) => {
                const schoolName = item.nama_sekolah || item.school;
                const menuName = item.nama_menu || item.menuName;
                const statusName = item.status;
                const allPending = menus.every(m => m.status_validasi === 'pending');
                const displayStatus = allPending ? "MENUNGGU VALIDASI" : statusName;
                
                return (
                  <div
                    key={i}
                    style={{
                      padding: "1.25rem",
                      borderRadius: "14px",
                      border: "1px solid var(--border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: 'var(--bg)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div className="flex" style={{ gap: "15px" }}>
                      <div style={{ background: 'white', width: "44px", height: "44px", borderRadius: "12px", display: "grid", placeItems: "center", color: "var(--role-primary)" }}>
                        <Truck size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "2px" }}>{schoolName}</h4>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "500" }}>{menuName}</p>
                      </div>
                    </div>
                    <span className="badge" style={{
                      background: displayStatus === "SELESAI" || displayStatus === "TIBA" ? "var(--role-primary)" : displayStatus === "MENUNGGU VALIDASI" ? "var(--banana)" : "var(--role-primary)",
                      color: 'white',
                      padding: "6px 14px",
                      borderRadius: '24px',
                      fontWeight: "700",
                      fontSize: "0.7rem"
                    }}>
                      {displayStatus}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : renderContent()}

      <AnimatePresence>
        {activeDoc && (
          <PdfModal doc={activeDoc} onClose={() => setActiveDoc(null)} />
        )}
        {selectedAuditMenu && <VisualAuditModal menu={selectedAuditMenu} onClose={() => setSelectedAuditMenu(null)} onRevise={handleReviseMenu} onEditRecipe={openEditMenuForm} />}
      </AnimatePresence>
    </DashboardLayout>
  )
}

export default VendorDashboard
