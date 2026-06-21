import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import RegisterVendor from './pages/RegisterVendor'
import VendorDashboard from './pages/VendorDashboard'
import AhliGiziDashboard from './pages/AhliGiziDashboard'
import SekolahDashboard from './pages/SekolahDashboard'
import PemerintahDashboard from './pages/PemerintahDashboard'

const demoUsersByRole = {
  vendor: { id_user: 1, name: 'Vendor Jakarta Timur', email: 'v.jaktim@traksi.id', role: 'vendor', status: 'active' },
  ahli_gizi: { id_user: 3, name: 'Ahli Gizi Jakarta Timur', email: 'nutri.jaktim@traksi.id', role: 'ahli_gizi', status: 'active' },
  sekolah: { id_user: 4, name: 'Admin SDN 06 Baru', email: 'sdn06@sekolah.traksi.id', role: 'sekolah', status: 'active' },
  pemerintah: { id_user: 2, name: 'Gov DKI Jakarta', email: 'gov.dki@traksi.id', role: 'pemerintah', status: 'active' }
}

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('traksi_user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const location = useLocation()
  
  const isAuthPage = location.pathname === '/' || location.pathname === '/login'

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('traksi_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('traksi_user')
  }

  const handleSwitchRole = (role) => {
    const demoUser = demoUsersByRole[role]
    if (!demoUser) return null

    setUser(demoUser)
    localStorage.setItem('traksi_user', JSON.stringify(demoUser))
    return demoUser
  }

  // Helper component for Protected Routes
  const ProtectedRoute = ({ children, role }) => {
    if (!user) return <Navigate to="/login" />
    if (user.role !== role) {
      // Small adjustment for underscores vs dashes in roles
      const normalizedRole = user.role.replace('_', '-');
      const normalizedReqRole = role.replace('_', '-');
      if (normalizedRole !== normalizedReqRole) return <Navigate to="/" />
    }
    return children
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/registrasi-vendor" element={<RegisterVendor />} />
      
      {/* Role Based Routes */}
      <Route 
        path="/vendor/*" 
        element={<ProtectedRoute role="vendor"><VendorDashboard user={user} onLogout={handleLogout} onSwitchRole={handleSwitchRole} /></ProtectedRoute>} 
      />
      <Route 
        path="/ahli-gizi/*" 
        element={<ProtectedRoute role="ahli_gizi"><AhliGiziDashboard user={user} onLogout={handleLogout} onSwitchRole={handleSwitchRole} /></ProtectedRoute>} 
      />
      <Route 
        path="/sekolah/*" 
        element={<ProtectedRoute role="sekolah"><SekolahDashboard user={user} onLogout={handleLogout} onSwitchRole={handleSwitchRole} /></ProtectedRoute>} 
      />
      <Route 
        path="/pemerintah/*" 
        element={<ProtectedRoute role="pemerintah"><PemerintahDashboard user={user} onLogout={handleLogout} onSwitchRole={handleSwitchRole} /></ProtectedRoute>} 
      />
      
      {/* Handle potential dashes or underscores from login */}
      <Route path="/ahli_gizi/*" element={<Navigate to="/ahli-gizi" replace />} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
