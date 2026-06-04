import React from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { 
  Home, 
  FileText, 
  Layout, 
  ChefHat, 
  Utensils, 
  Truck, 
  School, 
  ShieldCheck, 
  BarChart3, 
  Settings, 
  LogOut,
  Map,
  BadgeAlert,
  Zap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleQuickSwitch = (targetRole) => {
    const rolesInfo = {
      vendor: { id: 1, name: 'Vendor Jakarta Timur', role: 'vendor', email: 'v.jaktim@traksi.id' },
      ahli_gizi: { id: 1, name: 'Ahli Gizi Jakarta Timur', role: 'ahli_gizi', email: 'nutri.jaktim@traksi.id' },
      sekolah: { id: 1, name: 'Admin SDN 06 Baru', role: 'sekolah', email: 'sdn06@sekolah.traksi.id' },
      pemerintah: { id: 1, name: 'Gov DKI Jakarta', role: 'pemerintah', email: 'gov.dki@traksi.id' }
    }
    const userData = rolesInfo[targetRole]
    if (userData) {
      localStorage.setItem('traksi_user', JSON.stringify(userData))
      const targetPath = targetRole.replace('_', '-')
      window.location.href = `/${targetPath}`
    }
  }

  const vendorMenu = [
    { title: 'Dashboard', path: '/vendor', icon: <Home size={20}/> },
    { title: 'Dokumen Vendor', path: '/vendor/dokumen', icon: <FileText size={20}/> },
    { title: 'Registrasi Dapur', path: '/vendor/dapur', icon: <ChefHat size={20}/> },
    { title: 'Input Menu', path: '/vendor/menu', icon: <Utensils size={20}/> },
    { title: 'Status Produksi', path: '/vendor/produksi', icon: <Layout size={20}/> },
    { title: 'Distribusi', path: '/vendor/distribusi', icon: <Truck size={20}/> },
  ]

  const ahliGiziMenu = [
    { title: 'Dashboard', path: '/ahli-gizi', icon: <Home size={20}/> },
    { title: 'Validasi Menu', path: '/ahli-gizi/validasi', icon: <ShieldCheck size={20}/> },
    { title: 'Standar Gizi', path: '/ahli-gizi/standar', icon: <FileText size={20}/> },
  ]

  const sekolahMenu = [
    { title: 'Dashboard', path: '/sekolah', icon: <Home size={20}/> },
    { title: 'Konfirmasi Makan', path: '/sekolah/konfirmasi', icon: <School size={20}/> },
    { title: 'Feedback', path: '/sekolah/feedback', icon: <FileText size={20}/> },
  ]

  const pemerintahMenu = [
    { title: 'Overview', path: '/pemerintah', icon: <Home size={20}/> },
    { title: 'Hubungkan Sekolah', path: '/pemerintah/mapping', icon: <Truck size={20}/> },
    { title: 'Monitoring Vendor', path: '/pemerintah/vendor', icon: <ShieldCheck size={20}/> },
    { title: 'Peta Distribusi', path: '/pemerintah/peta', icon: <Map size={20}/> },
    { title: 'Statistik & Laporan', path: '/pemerintah/statistik', icon: <BarChart3 size={20}/> },
    { title: 'Sistem Alert', path: '/pemerintah/alert', icon: <BadgeAlert size={20}/> },
  ]

  const menuMap = {
    vendor: vendorMenu,
    ahli_gizi: ahliGiziMenu,
    sekolah: sekolahMenu,
    pemerintah: pemerintahMenu
  }

  const currentMenu = menuMap[user?.role] || []

  return (
    <aside className="sidebar premium-glass" style={{
      boxShadow: '20px 0 60px rgba(0,0,0,0.02)',
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(30px)',
      zIndex: 100
    }}>
      <div style={{ padding: '2.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '38px', height: '38px', background: 'var(--primary)', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
          <Zap size={22} fill="white" color="white"/>
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-1px', lineHeight: '1' }}>
            <span style={{ color: 'var(--text-main)' }}>TRA</span><span style={{ color: 'var(--primary)' }}>KSI</span>
          </h2>
          <p style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>National MBG System</p>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '2rem 1.25rem' }}>
        <ul style={{ listStyle: 'none' }}>
          {currentMenu.map((item, idx) => {
            const isActive = location.pathname === item.path
            
            return (
              <li key={idx} style={{ marginBottom: '0.75rem' }}>
                <NavLink 
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '1.1rem 1.5rem',
                    textDecoration: 'none',
                    color: isActive ? 'white' : 'var(--text-muted)',
                    background: isActive ? 'var(--primary)' : 'transparent',
                    borderRadius: '18px',
                    fontWeight: isActive ? '800' : '600',
                    boxShadow: isActive ? '0 12px 30px rgba(16, 185, 129, 0.25)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <motion.div animate={{ rotate: isActive ? [0, 10, 0] : 0 }}>{item.icon}</motion.div>
                    <span style={{ fontSize: '1rem' }}>{item.title}</span>
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="activeGlow"
                      style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)', zIndex: 1 }}
                    />
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Simulator / Quick Switcher */}
      <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)', background: 'rgba(16, 185, 129, 0.02)' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={14} color="var(--primary)" fill="var(--primary)" /> SIMULATOR PERAN
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          {[
            { id: 'vendor', label: 'Vendor' },
            { id: 'ahli_gizi', label: 'Ahli Gizi' },
            { id: 'sekolah', label: 'Sekolah' },
            { id: 'pemerintah', label: 'Pemda' }
          ].map((r) => {
            const isCurrent = user?.role === r.id;
            return (
              <motion.button
                key={r.id}
                whileHover={{ scale: isCurrent ? 1 : 1.03 }}
                whileTap={{ scale: isCurrent ? 1 : 0.97 }}
                onClick={() => !isCurrent && handleQuickSwitch(r.id)}
                style={{
                  padding: '0.6rem 0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: isCurrent ? 'var(--primary)' : 'var(--border)',
                  background: isCurrent ? 'var(--primary-light)' : 'white',
                  color: isCurrent ? 'var(--primary)' : 'var(--text-main)',
                  cursor: isCurrent ? 'default' : 'pointer',
                  opacity: isCurrent ? 1 : 0.8,
                  transition: 'all 0.2s',
                  textAlign: 'center',
                  boxShadow: isCurrent ? 'none' : '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                {r.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '1.5rem', background: 'var(--primary-light)', borderTop: '1px solid var(--border)' }}>
        <motion.div 
          whileHover={{ x: 5 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', padding: '0.5rem', borderRadius: '12px' }}
        >
          <div style={{ 
            width: '46px', height: '46px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--primary), #065f46)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.2rem',
            boxShadow: '0 8px 15px rgba(16, 185, 129, 0.2)'
          }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name || 'User'}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {user?.role?.replace('_', ' ') || 'Guest'}
            </p>
          </div>
        </motion.div>
        
        <button 
          onClick={() => {
            onLogout()
            navigate('/')
          }}
          style={{ 
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            padding: '1rem', color: 'white', background: 'var(--error)',
            border: 'none', borderRadius: '16px', fontWeight: '800', fontSize: '0.95rem',
            transition: 'all 0.2s',
            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.2)',
            cursor: 'pointer'
          }}
        >
          <LogOut size={20} /> Keluar Sistem
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
