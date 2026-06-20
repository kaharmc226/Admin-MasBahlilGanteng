import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Building, GraduationCap, Microscope, Zap, ArrowRight, LogIn } from 'lucide-react'
import api from '../api'

const ENABLE_QUICK_LOGIN = false

const roleColors = {
  vendor: { primary: '#f97316', light: '#fff7ed', label: 'Vendor Dapur' },
  ahli_gizi: { primary: '#06b6d4', light: '#ecfeff', label: 'Ahli Gizi' },
  sekolah: { primary: '#8b5cf6', light: '#f5f3ff', label: 'Sekolah' },
  pemerintah: { primary: '#3b82f6', light: '#eff6ff', label: 'Pemerintah' }
}

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('v.jaktim@traksi.id')
  const [password, setPassword] = useState('vendor123')
  const [role, setRole] = useState('vendor')
  const [quickLoginMode, setQuickLoginMode] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const roles = [
    { id: 'vendor', icon: <Building size={22}/>, title: 'Vendor Dapur', desc: 'Pemilik dapur produksi & distribusi.' },
    { id: 'ahli_gizi', icon: <Microscope size={22}/>, title: 'Ahli Gizi', desc: 'Validator standar gizi & menu.' },
    { id: 'sekolah', icon: <GraduationCap size={22}/>, title: 'Sekolah', desc: 'Penerima manfaat & feedback.' },
    { id: 'pemerintah', icon: <ShieldCheck size={22}/>, title: 'Pemerintah', desc: 'Dinas/Kementerian pengawas.' }
  ]

  const validUsers = {
    vendor: { email: 'v.jaktim@traksi.id', pass: 'vendor123', name: 'Vendor Jakarta Timur' },
    ahli_gizi: { email: 'nutri.jaktim@traksi.id', pass: 'nutri123', name: 'Ahli Gizi Jakarta Timur' },
    sekolah: { email: 'sdn06@sekolah.traksi.id', pass: 'sekolah123', name: 'Admin SDN 06 Baru' },
    pemerintah: { email: 'gov.dki@traksi.id', pass: 'gov123', name: 'Gov DKI Jakarta' }
  }

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    setErrorMsg('')
    const creds = validUsers[selectedRole]
    if (creds) {
      setEmail(creds.email)
      setPassword(creds.pass)
    }
  }

  const handleQuickLogin = async (selectedRole) => {
    setErrorMsg('')
    const expected = validUsers[selectedRole]
    try {
      const userData = await api.login(expected.email, expected.pass)
      onLogin(userData)
      const targetPath = selectedRole.replace('_', '-')
      navigate(`/${targetPath}`)
    } catch (err) {
      setErrorMsg(`Gagal Masuk Cepat: ${err.error || err.message || 'Error login backend'}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    try {
      const userData = await api.login(email, password)
      onLogin(userData)
      const targetPath = userData.role.replace('_', '-')
      navigate(`/${targetPath}`)
    } catch (err) {
      setErrorMsg(`Gagal Masuk: ${err.error || err.message || 'Kredensial salah atau server offline'}`)
    }
  }

  const activeColor = roleColors[role]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch', background: '#f8fafc' }}>
      {/* Left Panel — Brand */}
      <div style={{
        flex: '0 0 420px',
        background: `linear-gradient(135deg, ${activeColor.primary}, ${activeColor.primary}dd)`,
        padding: '1.5rem',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.4s ease'
      }}>
        {/* Decorative shapes */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '300px', height: '300px',
          background: 'rgba(255,255,255,0.08)', borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '200px', height: '200px',
          background: 'rgba(255,255,255,0.06)', borderRadius: '50%'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <div style={{
              width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px', display: 'grid', placeItems: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <Zap size={22} fill="white" color="white"/>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-1px', color: 'white' }}>
              TRAKSI
            </h1>
          </div>

          <h2 style={{
            fontSize: '2.5rem', fontWeight: '900', lineHeight: '1.1',
            letterSpacing: '-2px', color: 'white', marginBottom: '1.5rem'
          }}>
            Transparansi<br/>Gizi Nasional
          </h2>
          <p style={{
            fontSize: '1.05rem', fontWeight: '500', lineHeight: '1.6',
            opacity: 0.9, maxWidth: '340px'
          }}>
            Platform monitoring & audit distribusi makanan bergizi gratis untuk seluruh Indonesia.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '0.8rem', fontWeight: '600', opacity: 0.7 }}>
            © 2026 TRAKSI TEAM UHO
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div style={{ flex: 1, padding: '1.5rem', display: 'grid', placeItems: 'center', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0f172a', letterSpacing: '-0.5px' }}>
                Masuk ke Portal
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>
                Pilih peran lalu masuk ke dashboard Anda.
              </p>
            </div>

            {ENABLE_QUICK_LOGIN && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f5f9', padding: '10px 20px', borderRadius: '12px', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={16} color="var(--primary)" fill="var(--primary)" /> Mode Masuk Cepat (Dev)
                </span>
                <button 
                  type="button"
                  onClick={() => setQuickLoginMode(!quickLoginMode)}
                  style={{
                    background: quickLoginMode ? activeColor.primary : '#cbd5e1',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontWeight: '800',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {quickLoginMode ? 'ON' : 'OFF'}
                </button>
              </div>
            )}

            {ENABLE_QUICK_LOGIN && quickLoginMode && (
              <>
                {/* Role Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                  {roles.map((r) => {
                    const isSelected = role === r.id
                    const color = roleColors[r.id]
                    return (
                      <motion.div
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        key={r.id}
                        onClick={() => handleRoleSelect(r.id)}
                        style={{
                          padding: '1.25rem',
                          border: '2px solid',
                          borderColor: isSelected ? color.primary : '#e2e8f0',
                          borderRadius: '16px',
                          background: isSelected ? color.light : 'white',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{
                          marginBottom: '0.75rem',
                          width: '40px', height: '40px', borderRadius: '10px',
                          display: 'grid', placeItems: 'center',
                          background: isSelected ? color.primary : '#f1f5f9',
                          color: isSelected ? 'white' : '#64748b',
                          transition: 'all 0.2s'
                        }}>
                          {r.icon}
                        </div>
                        <h4 style={{
                          fontSize: '0.9rem', fontWeight: '700',
                          marginBottom: '2px',
                          color: isSelected ? color.primary : '#0f172a'
                        }}>
                          {r.title}
                        </h4>
                        <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '500', lineHeight: '1.3' }}>
                          {r.desc}
                        </p>

                        {/* Quick Login Button */}
                        {isSelected && (
                          <motion.button
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={(e) => { e.stopPropagation(); handleQuickLogin(r.id) }}
                            style={{
                              marginTop: '0.75rem',
                              width: '100%',
                              padding: '0.5rem',
                              borderRadius: '8px',
                              border: 'none',
                              background: color.primary,
                              color: 'white',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <LogIn size={14} /> Masuk Cepat
                          </motion.button>
                        )}
                      </motion.div>
                    )
                  })}
                </div>

                {/* Separator */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  marginBottom: '1.5rem', color: '#cbd5e1'
                }}>
                  <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                    atau masuk manual
                  </span>
                  <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                </div>
              </>
            )}

            {/* Manual Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.85rem', color: '#374151' }}>
                  Email Institusi
                </label>
                <input
                  type="email"
                  placeholder="Masukkan email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%', padding: '0.85rem 1rem', borderRadius: '12px',
                    border: '1.5px solid #e2e8f0', outline: 'none', background: 'white',
                    fontSize: '0.9rem', fontWeight: '500', transition: 'border-color 0.2s',
                    fontFamily: 'var(--font-body)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = activeColor.primary}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.85rem', color: '#374151' }}>
                  Kata Sandi
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%', padding: '0.85rem 1rem', borderRadius: '12px',
                    border: '1.5px solid #e2e8f0', outline: 'none', background: 'white',
                    fontSize: '0.9rem', fontWeight: '500', transition: 'border-color 0.2s',
                    fontFamily: 'var(--font-body)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = activeColor.primary}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {errorMsg && (
                <div style={{
                  background: '#fef2f2', color: '#dc2626',
                  padding: '0.75rem 1rem', borderRadius: '10px',
                  marginBottom: '1rem', fontWeight: '600',
                  border: '1px solid #fecaca', fontSize: '0.85rem'
                }}>
                  {errorMsg}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                style={{
                  width: '100%', padding: '0.9rem', fontSize: '0.95rem',
                  borderRadius: '12px', fontWeight: '700',
                  background: activeColor.primary,
                  border: 'none', color: 'white',
                  cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'background 0.3s'
                }}
              >
                Masuk ke Dashboard <ArrowRight size={18} />
              </motion.button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link to="/" style={{
                color: '#64748b', fontSize: '0.85rem', fontWeight: '600',
                textDecoration: 'none'
              }}>
                ← Kembali ke Beranda
              </Link>
            </p>

          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Login
