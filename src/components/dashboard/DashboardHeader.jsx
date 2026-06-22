import React from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, Activity, Plus } from 'lucide-react'

export const DashboardHeader = ({ 
  title, 
  subtitle, 
  variant = 'premium', // 'premium' or 'simple'
  showAdd = false, 
  onAdd, 
  addLabel = 'Tambah Data'
}) => {
  if (variant === 'simple') {
    return (
      <div style={{ 
        marginBottom: '1.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        position: 'relative', 
        zIndex: 1 
      }}>
        <div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: '950', letterSpacing: '-2px' }}>{title}</h1>
          {subtitle && (
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: '600' }}>{subtitle}</p>
          )}
        </div>
        {showAdd && (
          <button 
            onClick={onAdd} 
            className="btn-primary" 
            style={{ 
              padding: '1rem 2rem', 
              borderRadius: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              border: 'none', 
              color: 'white', 
              fontWeight: '800' 
            }}
          >
            <Plus size={20} /> {addLabel}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="card dashboard-card-vibrant" style={{ 
      marginBottom: '1.5rem', 
      padding: '1rem 1.5rem',
      borderRadius: '16px',
      background: 'white',
      border: '1px solid white',
      boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ 
          width: '55px', 
          height: '55px', 
          background: 'var(--primary-light)', 
          borderRadius: '18px', 
          display: 'grid', 
          placeItems: 'center', 
          boxShadow: '0 8px 16px rgba(16, 185, 129, 0.1)' 
        }}>
          <LayoutDashboard color="var(--primary)" size={28} />
        </div>
        <div>
          <h1 style={{ 
            fontSize: '2.1rem', 
            fontWeight: '950', 
            letterSpacing: '-1.5px', 
            color: 'var(--text-main)', 
            lineHeight: '1.2' 
          }}>{title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <div style={{ 
              width: '6px', 
              height: '6px', 
              background: 'var(--primary)', 
              borderRadius: '50%', 
              animation: 'pulse 1.5s infinite' 
            }} />
            <p style={{ 
              fontSize: '0.75rem', 
              fontWeight: '800', 
              color: 'var(--text-muted)', 
              textTransform: 'uppercase', 
              letterSpacing: '1.5px',
              margin: 0
            }}>{subtitle}</p>
          </div>
        </div>
      </div>
      
      <div style={{ 
        padding: '0.6rem 1.4rem', 
        borderRadius: '8px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px',
        background: 'var(--bg)',
        border: '1px solid var(--border)'
      }}>
         <div style={{ textAlign: 'right', borderRight: '1.5px solid var(--border)', paddingRight: '15px' }}>
            <p style={{ fontWeight: '950', fontSize: '1rem', color: 'var(--text-main)', margin: 0 }}>
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '900', margin: 0 }}>
              {new Date().toLocaleDateString('id-ID', { weekday: 'long' }).toUpperCase()}
            </p>
         </div>
         <div className="flex" style={{ gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '38px', height: '38px', background: 'white', borderRadius: '12px', display: 'grid', placeItems: 'center', boxShadow: '0 5px 10px rgba(0,0,0,0.05)' }}>
                <Activity size={18} color="var(--primary)" />
              </div>
              <motion.div 
                 animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 style={{ position: 'absolute', inset: 0, background: 'var(--primary)', borderRadius: '12px', zIndex: -1 }}
              />
            </div>
            <div>
              <p style={{ fontSize: '0.6rem', fontWeight: '900', color: 'var(--text-muted)', marginBottom: '1px', margin: 0 }}>SISTEM STATUS</p>
              <p style={{ fontSize: '0.8rem', fontWeight: '950', color: 'var(--primary)', margin: 0 }}>SINKRON</p>
            </div>
         </div>
      </div>
    </div>
  )
}

export default DashboardHeader
