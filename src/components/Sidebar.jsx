import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Home,
  FileText,
  Layout,
  Utensils,
  Truck,
  School,
  ShieldCheck,
  BarChart3,
  BadgeAlert,
  Zap,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { motion } from 'framer-motion'

const Sidebar = ({ user, collapsed, mobileOpen, onToggle, onMobileClose }) => {
  const location = useLocation()
  
  const [openMenus, setOpenMenus] = React.useState({ 'Manajemen Vendor': true })

  const toggleSubmenu = (title) => {
    setOpenMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  const vendorMenu = [
    { title: 'Dashboard', path: '/vendor', icon: <Home size={20}/> },
    {
      title: 'Manajemen Vendor',
      icon: <Utensils size={20}/>,
      children: [
        { title: 'Dapur Operasional', path: '/vendor/informasi', icon: <FileText size={18}/> },
        { title: 'Katalog Menu', path: '/vendor/menu', icon: <Utensils size={18}/> },
        { title: 'Stok & Gudang', path: '/vendor/stok', icon: <FileText size={18}/> },
      ]
    },
    { title: 'Status Produksi', path: '/vendor/produksi', icon: <Layout size={20}/> },
  ]

  const ahliGiziMenu = [
    { title: 'Dashboard', path: '/ahli-gizi', icon: <Home size={20}/> },
    { title: 'Validasi Menu', path: '/ahli-gizi/validasi', icon: <ShieldCheck size={20}/> },
    { title: 'Standar Gizi', path: '/ahli-gizi/standar', icon: <FileText size={20}/> },
  ]

  const sekolahMenu = [
    { title: 'Dashboard', path: '/sekolah', icon: <Home size={20}/> },
    { title: 'Status Distribusi', path: '/sekolah/konfirmasi', icon: <School size={20}/> },
    { title: 'Feedback', path: '/sekolah/feedback', icon: <FileText size={20}/> },
  ]

  const pemerintahMenu = [
    { title: 'Overview', path: '/pemerintah', icon: <Home size={20}/> },
    { title: 'Hubungkan Sekolah', path: '/pemerintah/mapping', icon: <Truck size={20}/> },
    { title: 'Monitoring Vendor', path: '/pemerintah/vendor', icon: <ShieldCheck size={20}/> },
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
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '0 0.75rem' : '0 1.5rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: '10px',
        height: 'var(--topnav-height)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', flexShrink: 0,
            background: 'var(--role-primary)', borderRadius: '10px',
            display: 'grid', placeItems: 'center'
          }}>
            <Zap size={18} fill="white" color="white"/>
          </div>
          <span className="sidebar-logo-text" style={{
            fontSize: '1.2rem', fontWeight: '900', letterSpacing: '-0.5px',
            fontFamily: 'var(--font-heading)'
          }}>
            <span style={{ color: 'var(--text-main)' }}>TRA</span>
            <span style={{ color: 'var(--role-primary)' }}>KSI</span>
          </span>
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onToggle}
          className="sidebar-logo-text"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: '4px',
            borderRadius: '6px', display: 'grid', placeItems: 'center'
          }}
          title={collapsed ? 'Perluas' : 'Perkecil'}
        >
          {collapsed ? <ChevronsRight size={18}/> : <ChevronsLeft size={18}/>}
        </button>

        {/* If collapsed, show expand btn centered */}
        {collapsed && (
          <button
            onClick={onToggle}
            style={{
              position: 'absolute', top: '1.25rem', right: '-12px',
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'var(--surface)', border: '1px solid var(--border)',
              display: 'none', placeItems: 'center', cursor: 'pointer',
              boxShadow: 'var(--shadow)', zIndex: 10, color: 'var(--text-muted)'
            }}
          >
            <ChevronsRight size={14}/>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: collapsed ? '1rem 0.5rem' : '1rem 0.75rem', overflowY: 'auto' }}>
        <p className="sidebar-section-title" style={{
          fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '1.5px',
          padding: '0.5rem 0.75rem', marginBottom: '0.25rem'
        }}>
          Menu
        </p>
        <ul style={{ listStyle: 'none' }}>
          {currentMenu.map((item, idx) => {
            if (item.children) {
              if (collapsed) {
                // If sidebar is collapsed, flatten out children icons
                return item.children.map((child, cIdx) => {
                  const childActive = location.pathname.replace(/\/$/, '') === child.path
                  return (
                    <li key={`collapsed-child-${idx}-${cIdx}`} style={{ marginBottom: '2px' }}>
                      <NavLink
                        to={child.path}
                        onClick={onMobileClose}
                        title={child.title}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '0.85rem',
                          justifyContent: 'center',
                          textDecoration: 'none',
                          color: childActive ? 'white' : 'var(--text-muted)',
                          background: childActive ? 'var(--role-primary)' : 'transparent',
                          borderRadius: '12px',
                          fontWeight: childActive ? '700' : '600',
                          fontSize: '0.9rem',
                          transition: 'all 0.15s ease',
                          position: 'relative',
                        }}
                        onMouseEnter={(e) => {
                          if (!childActive) {
                            e.currentTarget.style.background = 'var(--role-light)'
                            e.currentTarget.style.color = 'var(--role-primary)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!childActive) {
                            e.currentTarget.style.background = 'transparent'
                            e.currentTarget.style.color = 'var(--text-muted)'
                          }
                        }}
                      >
                        <span style={{ flexShrink: 0, display: 'flex' }}>{child.icon}</span>
                      </NavLink>
                    </li>
                  )
                })
              }

              const isSubMenuOpen = !!openMenus[item.title]
              const hasActiveChild = item.children.some(child => location.pathname.replace(/\/$/, '') === child.path)

              return (
                <li key={idx} style={{ marginBottom: '4px' }}>
                  <div
                    onClick={() => toggleSubmenu(item.title)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      color: hasActiveChild ? 'var(--role-primary)' : 'var(--text-muted)',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      transition: 'all 0.15s ease',
                      background: hasActiveChild ? 'var(--role-light)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!hasActiveChild) {
                        e.currentTarget.style.background = 'var(--role-light)'
                        e.currentTarget.style.color = 'var(--role-primary)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!hasActiveChild) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'var(--text-muted)'
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
                      <span className="nav-label">{item.title}</span>
                    </div>
                    <span className="nav-label" style={{ display: 'flex', opacity: collapsed ? 0 : 1 }}>
                      {isSubMenuOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </span>
                  </div>

                  {isSubMenuOpen && (
                    <ul style={{ listStyle: 'none', paddingLeft: '1.25rem', marginTop: '4px' }}>
                      {item.children.map((child, cIdx) => {
                        const childActive = location.pathname.replace(/\/$/, '') === child.path
                        return (
                          <li key={cIdx} style={{ marginBottom: '2px' }}>
                            <NavLink
                              to={child.path}
                              onClick={onMobileClose}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '0.6rem 1rem',
                                textDecoration: 'none',
                                color: childActive ? 'white' : 'var(--text-muted)',
                                background: childActive ? 'var(--role-primary)' : 'transparent',
                                borderRadius: '10px',
                                fontWeight: childActive ? '700' : '600',
                                fontSize: '0.85rem',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                if (!childActive) {
                                  e.currentTarget.style.background = 'var(--role-light)'
                                  e.currentTarget.style.color = 'var(--role-primary)'
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!childActive) {
                                  e.currentTarget.style.background = 'transparent'
                                  e.currentTarget.style.color = 'var(--text-muted)'
                                }
                              }}
                            >
                              <span style={{ flexShrink: 0, display: 'flex' }}>{child.icon}</span>
                              <span className="nav-label">{child.title}</span>
                            </NavLink>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            }

            const isActive = location.pathname.replace(/\/$/, '') === item.path

            return (
              <li key={idx} style={{ marginBottom: '2px' }}>
                <NavLink
                  to={item.path}
                  onClick={onMobileClose}
                  title={collapsed ? item.title : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: collapsed ? '0.85rem' : '0.75rem 1rem',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    textDecoration: 'none',
                    color: isActive ? 'white' : 'var(--text-muted)',
                    background: isActive ? 'var(--role-primary)' : 'transparent',
                    borderRadius: '12px',
                    fontWeight: isActive ? '700' : '600',
                    fontSize: '0.9rem',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--role-light)'
                      e.currentTarget.style.color = 'var(--role-primary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'var(--text-muted)'
                    }
                  }}
                >
                  <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
                  <span className="nav-label">{item.title}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom: Minimal info */}
      <div style={{
        padding: collapsed ? '1rem 0.5rem' : '1rem 1.25rem',
        borderTop: '1px solid var(--border)',
        textAlign: collapsed ? 'center' : 'left'
      }}>
        <p className="nav-label" style={{
          fontSize: '0.7rem', fontWeight: '700',
          color: 'var(--text-muted)', lineHeight: '1.4'
        }}>
          © 2026 TRAKSI UHO
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
