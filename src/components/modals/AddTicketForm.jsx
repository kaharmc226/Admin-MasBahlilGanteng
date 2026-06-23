import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export const AddTicketForm = ({ onClose, onSave, dapurs, menus, sekolah, onNotify }) => {
  const validMenus = menus.filter(m => m.status_validasi === 'approved')
  const [formData, setFormData] = useState({
    id_dapur: dapurs[0]?.id_dapur || dapurs[0]?.id || '',
    id_menu: validMenus[0]?.id_menu || '',
    id_sekolah: sekolah[0]?.id_sekolah || '',
    jumlah_porsi: ''
  })
  const availableSekolah = sekolah.filter((s) => {
    if (!formData.id_dapur) return false
    return (s.id_dapur || '').toString() === formData.id_dapur.toString()
  })

  useEffect(() => {
    if (availableSekolah.length === 0) {
      setFormData((prev) => ({ ...prev, id_sekolah: '' }))
      return
    }
    const stillValid = availableSekolah.some((s) => s.id_sekolah.toString() === (formData.id_sekolah || '').toString())
    if (!stillValid) {
      setFormData((prev) => ({ ...prev, id_sekolah: availableSekolah[0].id_sekolah }))
    }
  }, [formData.id_dapur, availableSekolah, formData.id_sekolah])

  const handleSubmit = async () => {
    if (!formData.id_dapur || !formData.id_menu || !formData.id_sekolah || !formData.jumlah_porsi) {
      alert("Lengkapi semua data tiket produksi.")
      return
    }
    try {
      await onSave({
        ...formData,
        jumlah_porsi: parseInt(formData.jumlah_porsi)
      })
      onNotify?.('Tiket produksi berhasil dibuat.')
      onClose()
    } catch (err) {
      onNotify?.(err.message || 'Gagal membuat tiket produksi.', 'warning')
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
              <h2 style={{ fontWeight: '950', fontSize: '1.8rem', color: '#0f172a', letterSpacing: '-0.5px' }}>Buat Tiket Produksi</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', marginTop: '4px' }}>Buat tiket antrian produksi baru.</p>
            </div>
            <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
              <X size={20} color="#64748b" />
            </button>
          </div>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>DAPUR OPERASIONAL</label>
              <select 
                value={formData.id_dapur} 
                onChange={e => setFormData({...formData, id_dapur: e.target.value})}
                disabled={dapurs.length === 0}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid var(--border)', fontWeight: '700' }}
              >
                <option value="" disabled>{dapurs.length === 0 ? 'Belum ada dapur approved' : 'Pilih Dapur'}</option>
                {dapurs.map(d => <option key={d.id_dapur || d.id} value={d.id_dapur || d.id}>{d.lokasi}</option>)}
              </select>
              {dapurs.length === 0 && (
                <p style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: '700', marginTop: '0.45rem' }}>
                  Produksi baru bisa dibuat setelah ada dapur yang disetujui Pemerintah.
                </p>
              )}
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>PILIH MENU (APPROVED)</label>
              <select 
                value={formData.id_menu} 
                onChange={e => setFormData({...formData, id_menu: e.target.value})}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid var(--border)', fontWeight: '700' }}
              >
                <option value="" disabled>Pilih Menu</option>
                {validMenus.map(m => <option key={m.id_menu} value={m.id_menu}>{m.nama_menu}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>TARGET SEKOLAH (DISTRIBUSI)</label>
              <select 
                value={formData.id_sekolah} 
                onChange={e => setFormData({...formData, id_sekolah: e.target.value})}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid var(--border)', fontWeight: '700' }}
              >
                <option value="" disabled>Pilih Sekolah</option>
                {availableSekolah.map(s => <option key={s.id_sekolah} value={s.id_sekolah}>{s.nama_sekolah}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>JUMLAH PORSI</label>
              <input 
                type="number" 
                placeholder="Misal: 500"
                value={formData.jumlah_porsi}
                onChange={e => setFormData({...formData, jumlah_porsi: e.target.value})}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid var(--border)', fontWeight: '700' }}
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="btn-primary" 
          style={{ width: '100%', padding: '1.2rem', borderRadius: '24px', border: 'none', color: 'white', fontWeight: '900', fontSize: '1.1rem', marginTop: '2rem', cursor: 'pointer' }}
        >
          Terbitkan Tiket
        </button>
      </motion.div>
    </div>
  )
}

export default AddTicketForm
