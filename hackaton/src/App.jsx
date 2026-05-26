import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import RegisterVendor from './pages/RegisterVendor'
import VendorDashboard from './pages/VendorDashboard'
import AhliGiziDashboard from './pages/AhliGiziDashboard'
import SekolahDashboard from './pages/SekolahDashboard'
import PemerintahDashboard from './pages/PemerintahDashboard'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

function App() {
  const [user, setUser] = useState(null)
  const location = useLocation()
  
  const isAuthPage = location.pathname === '/' || location.pathname === '/login'

  useEffect(() => {
    const savedUser = localStorage.getItem('traksi_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('traksi_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('traksi_user')
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
        element={<ProtectedRoute role="vendor"><VendorDashboard user={user} onLogout={handleLogout} /></ProtectedRoute>} 
      />
      <Route 
        path="/ahli-gizi/*" 
        element={<ProtectedRoute role="ahli_gizi"><AhliGiziDashboard user={user} onLogout={handleLogout} /></ProtectedRoute>} 
      />
      <Route 
        path="/sekolah/*" 
        element={<ProtectedRoute role="sekolah"><SekolahDashboard user={user} onLogout={handleLogout} /></ProtectedRoute>} 
      />
      <Route 
        path="/pemerintah/*" 
        element={<ProtectedRoute role="pemerintah"><PemerintahDashboard user={user} onLogout={handleLogout} /></ProtectedRoute>} 
      />
      
      {/* Handle potential dashes or underscores from login */}
      <Route path="/ahli_gizi/*" element={<Navigate to="/ahli-gizi" replace />} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
