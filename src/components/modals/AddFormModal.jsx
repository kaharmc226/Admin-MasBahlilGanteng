import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export const AddFormModal = ({ onClose, onSave, isVendor, isMapping, dapurs = [] }) => {
  const [isSaving, setIsSaving] = useState(false)
  const [fields, setFields] = useState({
    nama_vendor: '',
    region: '',
    izin_usaha: '',
    account_name: '',
    email: '',
    password: '',
    nama_sekolah: '',
    jumlah_siswa: '',
    alamat: '',
    id_dapur: ''
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(isVendor ? 'Vendor' : isMapping ? 'Sekolah' : 'Target', fields)
    } finally {
      setIsSaving(false)
    }
  }

  const getFields = () => {
    if (isVendor) return (
      <>
        <div>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>NAMA VENDOR</label>
          <input required value={fields.nama_vendor} onChange={(e) => setFields({ ...fields, nama_vendor: e.target.value })} placeholder="Contoh: PT. Pangan Sejahtera" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>NOMOR IZIN USAHA</label>
          <input required value={fields.izin_usaha} onChange={(e) => setFields({ ...fields, izin_usaha: e.target.value })} placeholder="B-9988/2026/MBG" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>WILAYAH OPERASIONAL</label>
          <input required value={fields.region} onChange={(e) => setFields({ ...fields, region: e.target.value })} placeholder="Contoh: Kecamatan Mandonga, Kota Kendari" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>NAMA AKUN VENDOR</label>
          <input required value={fields.account_name} onChange={(e) => setFields({ ...fields, account_name: e.target.value })} placeholder="Contoh: Admin Dapur Sejahtera" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>EMAIL LOGIN</label>
          <input required type="email" value={fields.email} onChange={(e) => setFields({ ...fields, email: e.target.value })} placeholder="vendor@traksi.id" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>PASSWORD LOGIN</label>
          <input required type="password" value={fields.password} onChange={(e) => setFields({ ...fields, password: e.target.value })} placeholder="Tetapkan password akun vendor" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
        </div>
      </>
    )
    if (isMapping) return (
      <>
        <div>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>DAPUR PENANGGUNG JAWAB</label>
          <select required value={fields.id_dapur} onChange={(e) => setFields({ ...fields, id_dapur: e.target.value })} disabled={dapurs.length === 0} style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700', background: 'white' }}>
            <option value="">{dapurs.length === 0 ? 'Belum ada dapur approved' : 'Pilih dapur'}</option>
            {dapurs.map((d) => (
              <option key={d.id_dapur} value={d.id_dapur}>Dapur {d.lokasi} - Vendor #{d.id_vendor}</option>
            ))}
          </select>
          {dapurs.length === 0 && (
            <p style={{ marginTop: '0.45rem', fontSize: '0.75rem', color: '#92400e', fontWeight: '700' }}>Mapping sekolah hanya bisa dibuat ke dapur yang sudah disetujui Pemerintah.</p>
          )}
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>NAMA SEKOLAH BARU</label>
          <input required value={fields.nama_sekolah} onChange={(e) => setFields({ ...fields, nama_sekolah: e.target.value })} placeholder="Contoh: SDN 05 Menteng" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>JUMLAH SISWA</label>
          <input required type="number" value={fields.jumlah_siswa} onChange={(e) => setFields({ ...fields, jumlah_siswa: e.target.value })} placeholder="450" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>ALAMAT LENGKAP SEKOLAH</label>
          <textarea required value={fields.alamat} onChange={(e) => setFields({ ...fields, alamat: e.target.value })} placeholder="Jl. Merdeka No. 10..." style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700', minHeight: '100px', fontFamily: 'inherit' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>NAMA AKUN SEKOLAH</label>
          <input required value={fields.account_name} onChange={(e) => setFields({ ...fields, account_name: e.target.value })} placeholder="Contoh: Admin SDN 05 Menteng" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>EMAIL LOGIN</label>
          <input required type="email" value={fields.email} onChange={(e) => setFields({ ...fields, email: e.target.value })} placeholder="admin@sekolah.traksi.id" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>PASSWORD LOGIN</label>
          <input required type="password" value={fields.password} onChange={(e) => setFields({ ...fields, password: e.target.value })} placeholder="Tetapkan password akun sekolah" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
        </div>
      </>
    )
    return (
      <div>
        <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>ANGGARAN TARGET (CAPEX/OPEX)</label>
        <input placeholder="Masukkan nilai anggaran..." style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', border: '2px solid #eee', fontWeight: '700' }} />
      </div>
    )
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
              <h2 style={{ fontWeight: '950', fontSize: '1.8rem', color: '#0f172a', letterSpacing: '-0.5px' }}>Tambah {isVendor ? 'Vendor' : isMapping ? 'Sekolah' : 'Target'}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', marginTop: '4px' }}>Input data administrasi ke dalam ekosistem pemerintah.</p>
            </div>
            <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
              <X size={20} color="#64748b" />
            </button>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {getFields()}
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="btn-primary" 
          style={{ width: '100%', padding: '1.2rem', borderRadius: '24px', border: 'none', color: 'white', fontWeight: '950', fontSize: '1.1rem', marginTop: '2rem', cursor: 'pointer' }}
        >
          {isSaving ? 'Menyimpan ke Ledger...' : 'Simpan Data'}
        </button>
      </motion.div>
    </div>
  )
}

export default AddFormModal
