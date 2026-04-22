import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../App'

// Demo login — accepts any credentials and creates a mock session
function mockLogin(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email || !password) { reject(new Error('Please fill in all fields')); return }
      const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      const isAdmin = email.includes('admin') || email.includes('rob')
      resolve({
        token: `demo_${Date.now()}`,
        user: { id: '1', name, email, role: isAdmin ? 'admin' : 'member' },
      })
    }, 600)
  })
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { token, user } = await mockLogin(form.email, form.password)
      login(token, user)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-cream">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-gold text-3xl block mb-2">✝</span>
            <h1 className="font-serif text-navy text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-2">Jesus Is Better Community</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-white font-semibold py-3 rounded-xl hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold hover:text-gold-dark font-semibold">Create one free</Link>
          </p>

          {/* Demo hint */}
          <div className="mt-6 bg-cream-dark rounded-xl px-4 py-3 text-xs text-gray-400 text-center">
            <strong className="text-gray-500">Demo:</strong> Use any email + password to sign in.
            Email with "admin" gives admin access.
          </div>
        </div>
      </div>
    </div>
  )
}
