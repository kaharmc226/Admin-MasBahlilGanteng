import React from 'react'
import { Bell, Search, User, LogOut } from 'lucide-react'

const Navbar = ({ user }) => {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <header className="premium-glass" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      borderRadius: 'var(--radius)',
      marginBottom: '2rem',
      position: 'sticky',
      top: '1rem',
      zIndex: 10
    }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Halo, {user.name}!</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentDate}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg)',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          border: '1px solid var(--border)'
        }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Cari sesuatu..." 
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.9rem',
              color: 'var(--text-main)',
              marginLeft: '8px',
              width: '200px'
            }} 
          />
        </div>

        <div style={{ position: 'relative', background: 'var(--bg)', p: '10px', borderRadius: '12px', border: '1px solid var(--border)', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Bell size={20} color="var(--text-muted)" />
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '8px',
            height: '8px',
            background: 'var(--error)',
            borderRadius: '50%',
            border: '2px solid var(--surface)'
          }}></span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'var(--primary-light)',
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          border: '1px solid var(--primary)',
          color: 'var(--primary)',
          cursor: 'pointer'
        }}>
          <User size={18} />
          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Profil</span>
        </div>
      </div>
    </header>
  )
}

export default Navbar
