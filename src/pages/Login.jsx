import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Building, GraduationCap, Microscope, Zap, ArrowRight, KeyRound, UserRound } from 'lucide-react'
import api from '../api'

const roleColors = {
  vendor: { primary: '#f97316', light: '#fff7ed', label: 'Vendor Dapur' },
  ahli_gizi: { primary: '#06b6d4', light: '#ecfeff', label: 'Ahli Gizi' },
  sekolah: { primary: '#8b5cf6', light: '#f5f3ff', label: 'Sekolah' },
  pemerintah: { primary: '#3b82f6', light: '#eff6ff', label: 'Pemerintah' }
}

const roles = [
  { id: 'vendor', icon: <Building size={22} />, title: 'Vendor Dapur', desc: 'Akun vendor aktif yang sudah disahkan pemerintah.' },
  { id: 'ahli_gizi', icon: <Microscope size={22} />, title: 'Ahli Gizi', desc: 'Validator gizi aktif yang terhubung ke wilayah.' },
  { id: 'sekolah', icon: <GraduationCap size={22} />, title: 'Sekolah', desc: 'Akun sekolah aktif yang sudah ditambahkan pemerintah.' },
  { id: 'pemerintah', icon: <ShieldCheck size={22} />, title: 'Pemerintah', desc: 'Admin pengawas dan pengelola ekosistem daerah.' }
]

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('vendor')
  const [accountsByRole, setAccountsByRole] = useState([])
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoadingAccounts(true)
      try {
        const groups = await api.getLoginAccounts()
        setAccountsByRole(Array.isArray(groups) ? groups : [])
        const firstRoleWithAccounts = (Array.isArray(groups) ? groups : []).find((item) => item.accounts?.length > 0)?.role
        if (firstRoleWithAccounts) {
          setRole(firstRoleWithAccounts)
          const firstAccount = (Array.isArray(groups) ? groups : []).find((item) => item.role === firstRoleWithAccounts)?.accounts?.[0]
          setEmail(firstAccount?.email || '')
          setPassword(firstAccount?.password || '')
        }
      } catch (err) {
        setErrorMsg(`Gagal memuat daftar akun: ${err.message}`)
      } finally {
        setIsLoadingAccounts(false)
      }
    }
    fetchAccounts()
  }, [])

  const currentGroup = useMemo(
    () => accountsByRole.find((item) => item.role === role) || { role, accounts: [] },
    [accountsByRole, role]
  )

  const activeColor = roleColors[role]

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    setErrorMsg('')
    const firstAccount = accountsByRole.find((item) => item.role === selectedRole)?.accounts?.[0]
    setEmail(firstAccount?.email || '')
    setPassword(firstAccount?.password || '')
  }

  const handleAccountPick = (account) => {
    setEmail(account.email)
    setPassword(account.password || '')
    setErrorMsg('')
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
      setErrorMsg(`Gagal Masuk: ${err.message || 'Kredensial salah atau server offline'}`)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch', background: '#f8fafc' }}>
      <div
        style={{
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
        }}
      >
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'grid', placeItems: 'center', backdropFilter: 'blur(10px)' }}>
              <Zap size={22} fill="white" color="white" />
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-1px', color: 'white' }}>TRAKSI</h1>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: '1.1', letterSpacing: '-2px', color: 'white', marginBottom: '1.5rem' }}>
            Pilih Portal
            <br />
            & Masuk
          </h2>
          <p style={{ fontSize: '1.05rem', fontWeight: '500', lineHeight: '1.6', opacity: 0.9, maxWidth: '340px' }}>
            Semua akun aktif per role ditampilkan dari data backend. Pemerintah mengelola aktivasi akun vendor dan sekolah dari dashboard.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '0.8rem', fontWeight: '600', opacity: 0.7 }}>© 2026 TRAKSI TEAM UHO</p>
        </div>
      </div>

      <div style={{ flex: 1, padding: '1.5rem', display: 'grid', placeItems: 'center', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '760px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0f172a', letterSpacing: '-0.5px' }}>
                Masuk ke Portal
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>
                Pilih role, lihat akun yang tersedia, lalu login dengan password akun tersebut.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
              {roles.map((item) => {
                const isSelected = role === item.id
                const color = roleColors[item.id]
                const accountCount = accountsByRole.find((group) => group.role === item.id)?.accounts?.length || 0
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect(item.id)}
                    style={{
                      padding: '1.25rem',
                      border: '2px solid',
                      borderColor: isSelected ? color.primary : '#e2e8f0',
                      borderRadius: '16px',
                      background: isSelected ? color.light : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ marginBottom: '0.75rem', width: '40px', height: '40px', borderRadius: '10px', display: 'grid', placeItems: 'center', background: isSelected ? color.primary : '#f1f5f9', color: isSelected ? 'white' : '#64748b' }}>
                      {item.icon}
                    </div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '2px', color: isSelected ? color.primary : '#0f172a' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '500', lineHeight: '1.35', marginBottom: '0.6rem' }}>{item.desc}</p>
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', color: isSelected ? color.primary : '#475569' }}>
                      {accountCount} akun tersedia
                    </span>
                  </motion.button>
                )
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', alignItems: 'start' }}>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '18px', background: 'white', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: '900', letterSpacing: '0.06em', textTransform: 'uppercase', color: activeColor.primary }}>
                      Daftar Akun {roleColors[role].label}
                    </p>
                    <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>
                      {currentGroup.accounts.length > 0 ? 'Pilih akun untuk mengisi email login.' : 'Belum ada akun aktif pada role ini.'}
                    </p>
                  </div>
                  <div style={{ background: activeColor.light, color: activeColor.primary, borderRadius: '999px', padding: '0.4rem 0.7rem', fontWeight: '800', fontSize: '0.75rem' }}>
                    {currentGroup.accounts.length} akun
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '360px', overflowY: 'auto', paddingRight: '0.2rem' }}>
                  {isLoadingAccounts ? (
                    <div style={{ padding: '1rem', borderRadius: '14px', background: '#f8fafc', color: '#64748b', fontWeight: '700' }}>
                      Memuat daftar akun...
                    </div>
                  ) : currentGroup.accounts.length === 0 ? (
                    <div style={{ padding: '1rem', borderRadius: '14px', background: '#f8fafc', color: '#64748b', fontWeight: '700' }}>
                      Tidak ada akun aktif yang bisa dipakai login.
                    </div>
                  ) : currentGroup.accounts.map((account) => {
                    const isPicked = account.email === email
                    return (
                      <button
                        key={account.id_user}
                        type="button"
                        onClick={() => handleAccountPick(account)}
                        style={{
                          padding: '0.95rem',
                          borderRadius: '14px',
                          border: `1.5px solid ${isPicked ? activeColor.primary : '#e2e8f0'}`,
                          background: isPicked ? activeColor.light : '#fff',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'start' }}>
                          <div>
                            <p style={{ margin: 0, fontWeight: '800', color: '#0f172a' }}>{account.entityName || account.name}</p>
                            <p style={{ margin: '0.25rem 0 0', color: '#475569', fontWeight: '600', fontSize: '0.83rem' }}>{account.name}</p>
                            <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontWeight: '600', fontSize: '0.8rem' }}>{account.email}</p>
                          </div>
                          <span style={{ fontSize: '0.72rem', fontWeight: '900', color: activeColor.primary }}>Pilih</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '18px', background: 'white', padding: '1rem' }}>
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.85rem', color: '#374151' }}>
                      Email Institusi
                    </label>
                    <input
                      type="email"
                      placeholder="Pilih akun atau ketik email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '1.5px solid #e2e8f0', outline: 'none', background: 'white', fontSize: '0.9rem', fontWeight: '500', fontFamily: 'var(--font-body)' }}
                    />
                  </div>

                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.85rem', color: '#374151' }}>
                      Kata Sandi
                    </label>
                    <input
                      type="password"
                      placeholder="Masukkan password akun"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '1.5px solid #e2e8f0', outline: 'none', background: 'white', fontSize: '0.9rem', fontWeight: '500', fontFamily: 'var(--font-body)' }}
                    />
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '0.85rem', display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#475569', fontWeight: '700', fontSize: '0.82rem' }}>
                      <UserRound size={15} color={activeColor.primary} />
                      Role dipilih: {roleColors[role].label}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#64748b', fontWeight: '600', fontSize: '0.8rem' }}>
                      <KeyRound size={15} color={activeColor.primary} />
                      Email dan password akan terisi otomatis saat role atau akun dipilih.
                    </div>
                  </div>

                  {errorMsg && (
                    <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1rem', fontWeight: '600', border: '1px solid #fecaca', fontSize: '0.85rem' }}>
                      {errorMsg}
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', borderRadius: '12px', fontWeight: '700', background: activeColor.primary, border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    Masuk ke Dashboard <ArrowRight size={18} />
                  </motion.button>
                </form>
              </div>
            </div>

            <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link to="/" style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>
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
