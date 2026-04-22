import React, { createContext, useContext, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Sermons from './pages/Sermons'
import SermonDetail from './pages/SermonDetail'
import Prayers from './pages/Prayers'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Admin from './pages/Admin'

// ─── Auth Context ─────────────────────────────────────────────────────────────

export const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('jib_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      // In production: validate token with /api/auth/me
      // For demo, decode a mock user from localStorage
      const savedUser = localStorage.getItem('jib_user')
      if (savedUser) {
        try { setUser(JSON.parse(savedUser)) } catch { logout() }
      }
    }
    setLoading(false)
  }, [token])

  function login(token, userData) {
    localStorage.setItem('jib_token', token)
    localStorage.setItem('jib_user', JSON.stringify(userData))
    setToken(token)
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem('jib_token')
    localStorage.removeItem('jib_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Protected Route ──────────────────────────────────────────────────────────

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-navy font-serif text-xl">Loading...</div></div>
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/dashboard" replace />

  return children
}

// ─── Layout Wrapper ───────────────────────────────────────────────────────────

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/sermons" element={<Layout><Sermons /></Layout>} />
          <Route path="/sermons/:id" element={<Layout><SermonDetail /></Layout>} />
          <Route path="/prayers" element={<Layout><Prayers /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><Layout><Admin /></Layout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
