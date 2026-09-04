import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { authAPI } from '../services/api'

// Drop your background image at billing-frontend/public/login-bg.jpg
// (or change the path below) — it will show behind the left panel copy.
const LOGIN_BG_IMAGE = '/login-bg.jpg'

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
    <div className="min-h-screen bg-navy flex items-center justify-center p-3 sm:p-6">
      {/* Outer frame */}
      <div className="w-full max-w-5xl bg-navy overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2 min-h-[600px] border border-white/10">

        {/* ══════════════════════════════════════
            LEFT — image / brand panel
        ══════════════════════════════════════ */}
        <div
          className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(15,27,61,0.55), rgba(15,27,61,0.85)), url(${LOGIN_BG_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#1E3A8A',
          }}
        >
          {/* Fallback fine grid — visible even without an image, blends once one is added */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#FFFFFF 1px,transparent 1px),linear-gradient(90deg,#FFFFFF 1px,transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />
          {/* Coral geometric accent */}
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-coral/80 rotate-12 pointer-events-none" />

          <div className="relative z-10">
            <span className="font-display font-600 text-xl text-white tracking-tight">Jainam</span>
          </div>

          <div className="relative z-10 max-w-sm">
            <span className="font-mono text-[11px] tracking-[0.2em] text-coral uppercase">
              Billing Management
            </span>
            <h1 className="font-display font-600 text-display-md text-white leading-[1.05] mt-4 mb-4">
              Welcome back.
            </h1>
            <p className="text-white/60 text-sm leading-relaxed">
              Sign in to manage orders, invoices and your product catalogue.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            RIGHT — form panel
        ══════════════════════════════════════ */}
        <div className="relative bg-navy flex flex-col justify-center px-8 sm:px-14 py-14">
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none lg:hidden"
            style={{
              backgroundImage:
                'linear-gradient(#FFFFFF 1px,transparent 1px),linear-gradient(90deg,#FFFFFF 1px,transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          <div className="relative z-10 w-full max-w-sm mx-auto">
            {/* Mobile-only wordmark (left panel is hidden below lg) */}
            <div className="lg:hidden mb-10 text-center">
              <span className="font-display font-600 text-2xl text-white tracking-tight">Jainam</span>
            </div>

            <span className="font-mono text-[11px] tracking-[0.2em] text-coral uppercase">
              Account
            </span>
            <h2 className="font-display font-600 text-2xl sm:text-3xl text-white mt-3 mb-8">
              Sign in
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {error && (
                <div className="bg-red-950/40 border border-red-900/60 text-red-300 text-xs px-3 py-2.5 font-mono">
                  {error}
                </div>
              )}

              <div>
                <label className="block font-mono text-[10px] tracking-widest text-white/50 uppercase mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-white/20 pb-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-coral transition-colors min-h-[44px]"
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-widest text-white/50 uppercase mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-white/20 pb-3 pr-8 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-coral transition-colors min-h-[44px]"
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 bottom-3 text-white/40 hover:text-white transition-colors"
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
                className="w-full flex items-center justify-center gap-2 bg-coral text-white py-3.5 font-display font-600 text-sm hover:bg-white hover:text-navy transition-colors disabled:opacity-60 min-h-[48px] mt-4"
              >
                {submitting ? (
                  <span className="font-mono text-xs tracking-widest uppercase">Signing in…</span>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
