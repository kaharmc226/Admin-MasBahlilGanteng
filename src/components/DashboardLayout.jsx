import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Bell, LogOut, Menu, ChevronDown, ChevronRight, Home } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'

const themeMap = {
  vendor: 'theme-vendor',
  ahli_gizi: 'theme-ahligizi',
  sekolah: 'theme-sekolah',
  pemerintah: 'theme-pemerintah'
}

const roleLabelMap = {
  vendor: 'Vendor',
  ahli_gizi: 'Ahli Gizi',
  sekolah: 'Sekolah',
  pemerintah: 'Pemerintah'
}

const roleOptions = [
  { id: 'vendor', label: 'Vendor Dapur', path: '/vendor' },
  { id: 'ahli_gizi', label: 'Ahli Gizi', path: '/ahli-gizi' },
  { id: 'sekolah', label: 'Sekolah', path: '/sekolah' },
  { id: 'pemerintah', label: 'Pemerintah', path: '/pemerintah' }
]

const pageTitleMap = {
  '/vendor': 'Dashboard',
  '/vendor/dokumen': 'Dokumen & Izin',
  '/vendor/dapur': 'Manajemen Dapur',
  '/vendor/menu': 'Input Menu',
  '/vendor/produksi': 'Status Produksi',
  '/vendor/distribusi': 'Distribusi',
  '/ahli-gizi': 'Dashboard',
  '/ahli-gizi/validasi': 'Validasi Menu',
  '/ahli-gizi/standar': 'Standar Gizi',
  '/sekolah': 'Dashboard',
  '/sekolah/konfirmasi': 'Konfirmasi Makan',
  '/sekolah/feedback': 'Feedback',
  '/pemerintah': 'Overview',
  '/pemerintah/mapping': 'Hubungkan Sekolah',
  '/pemerintah/vendor': 'Monitoring Vendor',
  '/pemerintah/peta': 'Peta Distribusi',
  '/pemerintah/statistik': 'Statistik & Laporan',
  '/pemerintah/alert': 'Sistem Alert'
}

const DashboardLayout = ({ user, onLogout, onSwitchRole, children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const themeClass = themeMap[user?.role] || ''
  const roleLabel = roleLabelMap[user?.role] || ''
  const path = location.pathname.replace(/\/$/, '')
  const pageTitle = pageTitleMap[path] || 'Dashboard'

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
    setAccountMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  const handleRoleSwitch = (role) => {
    if (role === user?.role) {
      setAccountMenuOpen(false)
      return
    }

    const switchedUser = onSwitchRole?.(role)
    if (!switchedUser) return

    const target = roleOptions.find((item) => item.id === role)?.path || '/'
    navigate(target)
    setAccountMenuOpen(false)
  }

  return (
    <div className={`layout-wrapper ${themeClass}`}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar
        user={user}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Top Navigation */}
      <header className={`top-nav ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Mobile hamburger */}
          <button
            className="nav-icon-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: 'none' }}
            id="mobile-menu-btn"
          >
            <Menu size={20} />
          </button>
          <style>{`
            @media (max-width: 1024px) {
              #mobile-menu-btn { display: grid !important; }
            }
          `}</style>

          {/* Breadcrumb */}
          <nav className="nav-breadcrumb">
            <Home size={15} />
            <ChevronRight size={14} />
            <span>{roleLabel}</span>
            {pageTitle !== 'Dashboard' && pageTitle !== 'Overview' && (
              <>
                <ChevronRight size={14} />
                <span className="current">{pageTitle}</span>
              </>
            )}
            {(pageTitle === 'Dashboard' || pageTitle === 'Overview') && (
              <span className="current">{pageTitle}</span>
            )}
          </nav>
        </div>

        <div className="nav-actions">
          <button className="nav-icon-btn" title="Notifikasi" style={{ position: 'relative' }}>
            <Bell size={18} />
            <span style={{
              position: 'absolute', top: 8, right: 8,
              width: 7, height: 7, background: 'var(--error)',
              borderRadius: '50%', border: '2px solid var(--surface)'
            }} />
          </button>

          <div className="nav-account">
            <button
              type="button"
              className="nav-user"
              onClick={() => setAccountMenuOpen((open) => !open)}
              aria-expanded={accountMenuOpen}
              aria-haspopup="menu"
              title="Akun dan peran"
            >
              <div className="avatar">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="user-name">{user?.name || 'User'}</span>
              <ChevronDown size={16} color="var(--text-muted)" />
            </button>

            <AnimatePresence>
              {accountMenuOpen && (
                <motion.div
                  className="account-menu"
                  role="menu"
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                >
                  <div className="account-menu-header">
                    <strong>{user?.name || 'User'}</strong>
                    <span>{roleLabel || 'Akun demo'}</span>
                  </div>

                  <div className="account-menu-section">
                    <p>Ganti akun / peran</p>
                    {roleOptions.map((role) => {
                      const isActive = role.id === user?.role
                      return (
                        <button
                          key={role.id}
                          type="button"
                          className={`account-role-option ${isActive ? 'active' : ''}`}
                          onClick={() => handleRoleSwitch(role.id)}
                          disabled={isActive}
                        >
                          <span>{role.label}</span>
                          {isActive && <small>Aktif</small>}
                        </button>
                      )
                    })}
                  </div>

                  <button type="button" className="account-logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    Keluar Sistem
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div style={{ padding: '1.5rem 2rem 3rem', maxWidth: '1600px', margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

    </div>
  )
}

export default DashboardLayout
