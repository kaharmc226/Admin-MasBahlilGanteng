import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Upload, CheckCircle, ArrowLeft, Building, FileText, Users, Microscope, Carrot, Apple, Leaf } from 'lucide-react'
import api from '../api'

const RegisterVendor = () => {
  const [step, setStep] = useState(1)
  const [namaUsah, setNamaUsaha] = useState('')
  const [alamat, setAlamat] = useState('')
  const [kontak, setKontak] = useState('')
  const [email, setEmail] = useState('')
  const [region, setRegion] = useState('')
  const [uploads, setUploads] = useState({ nib: false, higiene: false, gizi: false })
  const [documents, setDocuments] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleFileUpload = async (doc, file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const uploaded = await api.uploadVendorDocument({ imageData: reader.result, fileName: file.name })
        setUploads(prev => ({ ...prev, [doc.id]: true }))
        setDocuments(prev => ({
          ...prev,
          [doc.id]: {
            nama_dokumen: doc.label,
            jenis: doc.jenis,
            file_path: uploaded.file_path
          }
        }))
      } catch (err) {
        alert('Gagal upload dokumen: ' + err.message)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRegister = async () => {
    if (!namaUsah || !alamat) {
      alert("Mohon lengkapi data dasar usaha.");
      setStep(1);
      return;
    }
    setIsSubmitting(true)
    try {
      await api.createVendorRegistration({
        nama_vendor: namaUsah,
        alamat,
        kontak,
        email,
        region: region || 'Belum ditentukan',
        izin_usaha: `REG-${Math.floor(Math.random() * 9000) + 1000}/MBG/2026`,
        documents: Object.values(documents)
      })
      setStep(3)
    } catch (err) {
      alert('Gagal mengirim registrasi: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const Motif = ({ icon: Icon, top, right, bottom, left, color }) => (
    <div style={{ position: 'absolute', top, right, bottom, left, opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}>
      <Icon size={120} color={color} />
    </div>
  )

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1rem' }}>Data Dasar Vendor</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Informasi profil perusahaan/catering penyedia MBG.</p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px' }}>Nama Usaha / Catering</label>
                <input value={namaUsah} onChange={(e) => setNamaUsaha(e.target.value)} type="text" placeholder="Contoh: Dapur Sehat Nusantara" className="card" style={{ width: '100%', padding: '1rem', border: '1.5px solid var(--border)', borderRadius: '15px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px' }}>Alamat Utama</label>
                <textarea value={alamat} onChange={(e) => setAlamat(e.target.value)} placeholder="Alamat kantor pusat..." className="card" style={{ width: '100%', padding: '1rem', border: '1.5px solid var(--border)', borderRadius: '15px', height: '100px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px' }}>Wilayah Operasional</label>
                <input value={region} onChange={(e) => setRegion(e.target.value)} type="text" placeholder="Contoh: Kota Kendari" className="card" style={{ width: '100%', padding: '1rem', border: '1.5px solid var(--border)', borderRadius: '15px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px' }}>Kontak</label>
                  <input value={kontak} onChange={(e) => setKontak(e.target.value)} type="text" placeholder="08xx..." className="card" style={{ width: '100%', padding: '1rem', border: '1.5px solid var(--border)', borderRadius: '15px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px' }}>Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="vendor@example.com" className="card" style={{ width: '100%', padding: '1rem', border: '1.5px solid var(--border)', borderRadius: '15px' }} />
                </div>
              </div>
              <button onClick={() => setStep(2)} className="btn-primary" style={{ padding: '1.2rem', borderRadius: '24px', marginTop: '1rem', border: 'none', color: 'white', fontWeight: '800' }}>Lanjut ke Dokumen</button>
            </div>
          </motion.div>
        )
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1rem' }}>Upload Dokumen Perizinan</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Sesuai standar MBG Nasional, lampirkan dokumen berikut.</p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                { id: 'nib', label: 'Izin Usaha (NIB)', jenis: 'izin_usaha', icon: <Building size={20}/> },
                { id: 'higiene', label: 'Sertifikasi Higiene Dapur', jenis: 'sertifikat_laik_hygiene', icon: <FileText size={20}/> },
                { id: 'gizi', label: 'Data Karyawan & Ahli Gizi', jenis: 'lainnya', icon: <Users size={20}/> }
              ].map((d, i) => (
                <div key={i} style={{ padding: '1.5rem', border: uploads[d.id] ? '2px solid var(--primary)' : '2px dashed var(--border)', background: uploads[d.id] ? 'var(--primary-light)' : 'transparent', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s' }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    {uploads[d.id] ? <CheckCircle size={20} color="var(--primary)" /> : d.icon}
                    <span style={{ fontWeight: '700' }}>{d.label}</span>
                  </div>
                  <label style={{ background: 'var(--bg)', border: 'none', padding: '8px 15px', borderRadius: '10px', fontWeight: '800', color: uploads[d.id] ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer' }}>
                    {uploads[d.id] ? 'Berhasil' : 'Pilih File'}
                    <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(d, e.target.files?.[0])} style={{ display: 'none' }} />
                  </label>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                 <button onClick={() => setStep(1)} className="btn-outline" style={{ flex: 1, padding: '1.2rem', borderRadius: '24px' }}>Kembali</button>
                 <button onClick={handleRegister} disabled={isSubmitting} className="btn-primary" style={{ flex: 1, padding: '1.2rem', borderRadius: '24px', border: 'none', color: 'white', fontWeight: '800', opacity: isSubmitting ? 0.7 : 1 }}>{isSubmitting ? 'Mengirim...' : 'Kirim Registrasi'}</button>
              </div>
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ background: 'var(--primary-light)', width: '100px', height: '100px', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 2rem' }}>
               <CheckCircle size={50} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '950', marginBottom: '1rem', letterSpacing: '-1.5px' }}>Data Terkirim!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '1.5rem', fontWeight: '500' }}>
              Dokumen Anda sedang dalam proses **Verifikasi Pemerintah**. Kami akan memberitahu Anda via email jika ID Vendor MBG sudah diterbitkan.
            </p>
            <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '1.2rem 4rem', borderRadius: '24px', border: 'none', color: 'white', fontWeight: '800' }}>Kembali ke Beranda</button>
          </motion.div>
        )
      default: return null
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <Motif icon={Apple} top="50px" right="50px" color="var(--primary)" />
      <Motif icon={Carrot} bottom="100px" left="50px" color="var(--carrot)" />
      <Motif icon={Leaf} top="400px" right="100px" color="var(--secondary)" />

      <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '4rem', borderRadius: '16px', position: 'relative', zIndex: 1, border: 'none', boxShadow: '0 40px 100px rgba(0,0,0,0.05)' }}>
        <button onClick={() => navigate('/')} style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <ArrowLeft size={18} /> Beranda
        </button>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
           <h1 style={{ fontSize: '2.5rem', fontWeight: '950', letterSpacing: '-2.5px' }}>Registrasi <span style={{ color: 'var(--primary)' }}>Vendor MBG</span></h1>
           {step < 3 && <p style={{ fontWeight: '800', color: 'var(--primary)', marginTop: '10px' }}>Langkah {step} dari 2</p>}
        </div>
        {renderStep()}
      </div>
    </div>
  )
}

export default RegisterVendor
