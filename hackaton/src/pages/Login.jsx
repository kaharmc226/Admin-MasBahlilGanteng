import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, User, Building, GraduationCap, Microscope, Carrot } from 'lucide-react'

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('v.jaktim@traksi.id')
  const [password, setPassword] = useState('pass123')
  const [role, setRole] = useState('vendor')
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const roles = [
    { id: 'vendor', icon: <Building size={24}/>, title: 'Vendor Dapur', desc: 'Pemilik dapur produksi & distribusi.' },
    { id: 'ahli_gizi', icon: <Microscope size={24}/>, title: 'Ahli Gizi', desc: 'Validator standar gizi & menu.' },
    { id: 'sekolah', icon: <GraduationCap size={24}/>, title: 'Sekolah', desc: 'Penerima manfaat & feedback.' },
    { id: 'pemerintah', icon: <ShieldCheck size={24}/>, title: 'Pemerintah', desc: 'Dinas/Kementerian pengawas.' }
  ]

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    const validUsers = {
      vendor: { email: 'v.jaktim@traksi.id', pass: 'pass123' },
      ahli_gizi: { email: 'nutri.jaktim@traksi.id', pass: 'pass123' },
      sekolah: { email: 'sdn06@sekolah.traksi.id', pass: 'pass123' },
      pemerintah: { email: 'gov.dki@traksi.id', pass: 'pass123' }
    }
    const creds = validUsers[selectedRole]
    if (creds) {
      setEmail(creds.email)
      setPassword(creds.pass)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')

    const validUsers = {
      vendor: { email: 'v.jaktim@traksi.id', pass: 'pass123', name: 'Vendor Jakarta Timur' },
      ahli_gizi: { email: 'nutri.jaktim@traksi.id', pass: 'pass123', name: 'Ahli Gizi Jakarta Timur' },
      sekolah: { email: 'sdn06@sekolah.traksi.id', pass: 'pass123', name: 'Admin SDN 06 Baru' },
      pemerintah: { email: 'gov.dki@traksi.id', pass: 'pass123', name: 'Gov DKI Jakarta' }
    }

    const expected = validUsers[role]

    if (email !== expected.email || password !== expected.pass) {
      setErrorMsg(`Kredensial salah! Gunakan Email: ${expected.email} | Password: pass123`)
      return
    }

    const userData = {
      id: 1,
      name: expected.name,
      role: role,
      email: expected.email,
    }
    onLogin(userData)
    const targetPath = role.replace('_', '-')
    navigate(`/${targetPath}`)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch', background: 'var(--bg)' }}>
      {/* Left Decoration */}
      <div className="gradient-bg" style={{ flex: 1, padding: '5rem', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{ position: 'absolute', top: '-10%', right: '-10%', width: '500px', height: '500px', background: 'white', borderRadius: '50%', filter: 'blur(100px)' }}
        />
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', opacity: 0.1, transform: 'rotate(-20deg)' }}>
          <Carrot size={200} color="white" />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: 'white', fontSize: '4rem', marginBottom: '1.5rem', fontWeight: '900', letterSpacing: '-2px' }}>TRAKSI</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.4rem', maxWidth: '450px', marginBottom: '3rem', fontWeight: '500', lineHeight: '1.4' }}>
            Transformasi Gizi Nasional melalui Transparansi Digital & Audit Blockchain.
          </p>
          <div style={{ borderLeft: '4px solid rgba(255, 255, 255, 0.3)', padding: '1rem 2rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0 20px 20px 0' }}>
            <p style={{ fontStyle: 'italic', color: 'white', fontSize: '1.2rem', fontWeight: '500' }}>
              "Membangun Fondasi Indonesia Emas 2045."
            </p>
          </div>
        </div>
      </div>

      {/* Login Area */}
      <div style={{ flex: 1, padding: '4rem', display: 'grid', placeItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '450px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.75rem', color: 'var(--text-main)', letterSpacing: '-1px' }}>Portal Akses</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem', fontWeight: '500' }}>Silahkan pilih otorisasi akses anda.</p>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
                {roles.map((r) => (
                  <motion.div 
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    key={r.id} 
                    onClick={() => handleRoleSelect(r.id)}
                    style={{
                      padding: '1.5rem',
                      border: '2px solid',
                      borderColor: role === r.id ? 'var(--primary)' : 'var(--border)',
                      borderRadius: 'var(--radius)',
                      background: role === r.id ? 'var(--primary-light)' : 'var(--surface)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      color: role === r.id ? 'var(--primary)' : 'var(--text-main)',
                      boxShadow: role === r.id ? '0 10px 20px rgba(16, 185, 129, 0.1)' : 'none'
                    }}
                  >
                    <div style={{ marginBottom: '1rem', background: role === r.id ? 'white' : 'var(--bg)', width: '45px', height: '45px', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                      {r.icon}
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '4px' }}>{r.title}</h4>
                    <p style={{ fontSize: '0.75rem', opacity: 0.7, fontWeight: '600', lineHeight: '1.3' }}>{r.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>Email Institusi</label>
                <input 
                  type="email" 
                  placeholder="Masukkan email resmi..." 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%', padding: '1.2rem', borderRadius: 'var(--radius)', 
                    border: '1px solid var(--border)', outline: 'none', background: 'white',
                    fontSize: '1rem', fontWeight: '500', transition: 'all 0.2s',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>Kata Sandi Keamanan</label>
                <input 
                  type="password" 
                  placeholder="••••••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%', padding: '1.2rem', borderRadius: 'var(--radius)', 
                    border: '1px solid var(--border)', outline: 'none', background: 'white',
                    fontSize: '1rem', fontWeight: '500', transition: 'all 0.2s',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              {errorMsg && (
                <div style={{ background: 'var(--error-light)', color: 'var(--error)', padding: '1rem', borderRadius: '15px', marginBottom: '1.5rem', fontWeight: '800', border: '1px solid var(--error)', fontSize: '0.9rem' }}>
                  {errorMsg}
                </div>
              )}

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', borderRadius: '50px', fontWeight: '800', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.25)', border: 'none', color: 'white' }}
              >
                Masuk ke Dashboard
              </motion.button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>
              &copy; 2026 TRAKSI TEAM UHO • National Gizi Security
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Login
