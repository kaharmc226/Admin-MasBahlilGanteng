import React from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export const StandardModal = ({ onClose, onSave, standard, setStandard, isEdit = false }) => (
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
            <h2 style={{ fontWeight: '950', fontSize: '1.8rem', color: '#0f172a', letterSpacing: '-0.5px' }}>{isEdit ? 'Edit Data Standar' : 'Tambah Standar Gizi'}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', marginTop: '4px' }}>Tetapkan standar kecukupan nutrisi program MBG.</p>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
            <X size={20} color="#64748b" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(); }} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>NAMA ZAT GIZI</label>
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
              <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>RENTANG KEBUTUHAN</label>
              <input 
                required
                value={standard.requirement}
                onChange={(e) => setStandard({...standard, requirement: e.target.value})}
                placeholder="20g - 35g" 
                style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)' }} 
              />
            </div>
            <div>
               <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>WARNA AKSEN</label>
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
            <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>DESKRIPSI RINGKAS</label>
            <textarea 
              value={standard.desc}
              onChange={(e) => setStandard({...standard, desc: e.target.value})}
              placeholder="Manfaat bagi anak sekolah..." 
              style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)', height: '80px', fontFamily: 'inherit' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>RINCIAN LANJUTAN</label>
            <textarea 
              value={standard.details}
              onChange={(e) => setStandard({...standard, details: e.target.value})}
              placeholder="Tambahkan information teknis, rujukan sumber..." 
              style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1.5px solid var(--border)', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }} 
            />
          </div>
          
          <button 
            type="submit"
            className="btn-primary" 
            style={{ width: '100%', padding: '1.2rem', borderRadius: '24px', border: 'none', color: 'white', fontWeight: '950', fontSize: '1.1rem', marginTop: '1rem', cursor: 'pointer', background: standard.color || 'var(--primary)' }}
          >
            {isEdit ? 'Simpan Perubahan' : 'Tetapkan Standar'}
          </button>
        </form>
      </div>
    </motion.div>
  </div>
)

export default StandardModal
