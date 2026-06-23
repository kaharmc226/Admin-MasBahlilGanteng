import React from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, ShieldCheck } from 'lucide-react'

export const Footer = ({ logoLetter = 'T' }) => (
  <div className="card dashboard-card-vibrant" style={{ 
    marginTop: '2rem', 
    padding: '1.5rem', 
    borderRadius: '16px',
    background: 'white',
    border: '1px solid white',
    boxShadow: '0 -10px 40px rgba(0,0,0,0.02)',
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    position: 'relative',
    zIndex: 2
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={{ 
        background: 'var(--primary)', 
        color: 'white', 
        width: '45px', 
        height: '45px', 
        borderRadius: '14px', 
        display: 'grid', 
        placeItems: 'center', 
        fontWeight: '950', 
        fontSize: '1.2rem', 
        boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' 
      }}>{logoLetter}</div>
      <div>
        <h4 style={{ fontWeight: '950', fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '2px', letterSpacing: '-0.5px' }}>TRAKSI National Ecosystem</h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>Platform Transparansi & Gizi Nasional • Versi 4.2.0-Production</p>
      </div>
    </div>
    <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
       <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '900', marginBottom: '8px', letterSpacing: '1px' }}>KONEKSI ENKRIPSI</p>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
             {[1,2,3,4,5,6].map(i => (
               <motion.div 
                 key={i} 
                 animate={{ opacity: [0.3, 1, 0.3] }} 
                 transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} 
                 style={{ width: '12px', height: '6px', background: 'var(--primary)', borderRadius: '10px' }}
               />
             ))}
          </div>
       </div>
       <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ width: '45px', height: '45px', background: 'var(--bg)', border: 'none', borderRadius: '14px', display: 'grid', placeItems: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}><MessageSquare size={20} /></button>
          <button style={{ width: '45px', height: '45px', background: 'var(--bg)', border: 'none', borderRadius: '14px', display: 'grid', placeItems: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}><ShieldCheck size={20} /></button>
       </div>
    </div>
  </div>
)

export default Footer
