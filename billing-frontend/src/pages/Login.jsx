import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { authAPI } from '../services/api'

export default function Login({ onLogin }) {
  const [username,     setUsername]     = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error,        setError]        = useState('')
  const [submitting,   setSubmitting]   = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => { 
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Please enter both username and password')
      return
    }

    // Owner login
    if (username === 'Sanjay123' && password === 'Jainam1234') {
      onLogin({ name: 'Admin User', username, role: 'admin' })
      navigate('/dashboard')
      return
    }

    setSubmitting(true)
    try {
      const clientRes = await authAPI.clientLogin(username, password)
      const client = clientRes.data
      onLogin({
        name:     client.contactPerson || client.company,
        username: client.username,
        company:  client.company,
        role:     'client',
      })
      navigate('/store')
      return
    } catch (clientErr) {
      // not a client — fall through
    }

    try {
      const res     = await authAPI.login(username, password)
      const account = res.data
      onLogin({
        name:     account.name,
        username: account.username,
        phone:    account.phone,
        role:     'marketing',
      })
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid credentials')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Wordmark */}
        <div className="text-center mb-8">
          <span className="font-display font-600 text-3xl text-primary tracking-tight">Jainam</span>
          <p className="font-mono text-[11px] tracking-widest text-ink-muted uppercase mt-2">
            Billing Management System
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-hairline rounded p-8 shadow-sm">
          <h2 className="font-display font-600 text-xl text-ink mb-6">Sign in</h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 rounded font-display">
                {error}
              </div>
            )}

            <div>
              <label className="block font-display font-medium text-xs text-ink-muted uppercase tracking-widest mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2.5 border border-hairline rounded text-sm text-ink bg-white placeholder:text-ink-muted focus:outline-none focus:border-ink-muted focus:ring-1 focus:ring-ink-muted/20 transition-colors min-h-[44px]"
                placeholder="Enter username"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block font-display font-medium text-xs text-ink-muted uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 border border-hairline rounded text-sm text-ink bg-white placeholder:text-ink-muted focus:outline-none focus:border-ink-muted focus:ring-1 focus:ring-ink-muted/20 transition-colors min-h-[44px]"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white py-3 rounded font-display font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 min-h-[48px] mt-2"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center font-mono text-[10px] text-ink-muted mt-6">
          © {new Date().getFullYear()} Jainam
        </p>
      </div>
    </div>
  )
}
