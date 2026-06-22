import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export const WelcomeBanner = ({ 
  name, 
  subtitle, 
  icon: Icon, 
  emoji = '👋', 
  primaryButtonText = 'Jelajahi Laporan',
  secondaryButtonText = 'Update Stok Bahan',
  onPrimaryClick,
  onSecondaryClick
}) => (
  <motion.div 
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    style={{ 
      background: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)',
      padding: '1.5rem',
      borderRadius: '16px',
      marginBottom: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      color: 'white',
      boxShadow: '0 30px 60px -15px rgba(6, 78, 59, 0.4)'
    }}
  >
    <div style={{ position: 'relative', zIndex: 2 }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '950', color: 'white', marginBottom: '10px' }}>
        Halo Selamat Siang, {name}! {emoji}
      </h2>
      <p style={{ fontSize: '1.1rem', fontWeight: '600', opacity: 0.9, maxWidth: '600px', lineHeight: '1.6' }}>
        {subtitle}
      </p>
      
      <div style={{ display: 'flex', gap: '15px', marginTop: '2.5rem' }}>
        {primaryButtonText && (
          <button 
            onClick={onPrimaryClick}
            style={{ 
              background: 'white', 
              color: 'var(--text-main)', 
              padding: '0.8rem 1.8rem', 
              border: 'none', 
              borderRadius: '15px', 
              fontWeight: '900', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px' 
            }}
          >
            {primaryButtonText} <ChevronRight size={20} />
          </button>
        )}
        {secondaryButtonText && (
          <button 
            onClick={onSecondaryClick}
            style={{ 
              background: 'rgba(255,255,255,0.15)', 
              color: 'white', 
              padding: '0.8rem 1.8rem', 
              border: '1px solid rgba(255,255,255,0.3)', 
              borderRadius: '15px', 
              fontWeight: '900', 
              cursor: 'pointer', 
              backdropFilter: 'blur(10px)' 
            }}
          >
            {secondaryButtonText}
          </button>
        )}
      </div>
    </div>

    {/* Decorative Elements inside banner */}
    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '250px', height: '250px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', bottom: '-20px', right: '50px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%', pointerEvents: 'none' }} />
    {Icon && (
      <Icon 
        style={{ 
          position: 'absolute', 
          right: '40px', 
          top: '50%', 
          transform: 'translateY(-50%) rotate(15deg)', 
          opacity: 0.1, 
          color: 'white' 
        }} 
        size={200} 
      />
    )}
  </motion.div>
)

export default WelcomeBanner
