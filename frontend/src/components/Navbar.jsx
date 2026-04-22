import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'text-gold font-semibold border-b-2 border-gold pb-0.5'
      : 'text-gray-200 hover:text-white transition-colors duration-150'

  return (
    <nav className="bg-navy shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
            <span className="text-gold text-2xl">✝</span>
            <span className="font-serif text-white font-bold text-lg leading-tight group-hover:text-gold transition-colors">
              Jesus Is Better<br />
              <span className="text-xs font-sans font-normal text-gray-400 tracking-wide">COMMUNITY</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            <NavLink to="/sermons" className={navLinkClass}>Sermons</NavLink>
            <NavLink to="/prayers" className={navLinkClass}>Prayer Wall</NavLink>
            {isAuthenticated && (
              <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
            )}
          </div>

          {/* Auth actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-400 hover:text-white transition-colors border border-gray-600 rounded px-3 py-1"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-200 hover:text-white text-sm transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="bg-gold text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors">
                  Join
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-navy-dark border-t border-navy-light px-4 pb-4 pt-2 space-y-2">
          <NavLink to="/sermons" className="block text-gray-200 hover:text-white py-2" onClick={() => setMenuOpen(false)}>Sermons</NavLink>
          <NavLink to="/prayers" className="block text-gray-200 hover:text-white py-2" onClick={() => setMenuOpen(false)}>Prayer Wall</NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" className="block text-gray-200 hover:text-white py-2" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className="block text-gray-200 hover:text-white py-2" onClick={() => setMenuOpen(false)}>Admin</NavLink>
          )}
          <div className="pt-2 border-t border-navy-light">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm w-full text-left py-2">
                Sign out
              </button>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-200 hover:text-white text-sm py-2">Sign in</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-gold text-white text-sm font-semibold px-4 py-2 rounded-lg">Join</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
