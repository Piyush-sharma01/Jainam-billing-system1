import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { authAPI } from '../services/api'

// ── Jainam palette (scoped to this file only) ──
// Luster #F4F1EC · Aster #9BACD8 · Habanero #F98513
// Tan #DAD1C8 · Royal #223382 · Deadly #111144

// Optional: replace with a real product photo when available, e.g. '/login-visual.jpg'
const LOGIN_VISUAL_IMAGE = null

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
    <div className="min-h-screen bg-[#F4F1EC] flex items-center justify-center p-4 sm:p-8">
      {/* ══════════════════════════════════════
          AUTH CARD — premium container
      ══════════════════════════════════════ */}
      <div
        className="w-full max-w-[1200px] bg-white grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]
                   rounded-[28px] overflow-hidden border border-[#DAD1C8]/50 shadow-2xl
                   animate-fade-up"
      >

        {/* ══════════════════════════════════════
            LEFT — editorial visual panel
        ══════════════════════════════════════ */}
        <div
          className="relative flex flex-col justify-between overflow-hidden
                     h-[220px] sm:h-[280px] lg:h-auto lg:min-h-[640px]
                     p-8 sm:p-10 lg:p-12"
          style={{
            background: LOGIN_VISUAL_IMAGE
              ? `linear-gradient(160deg, rgba(17,17,68,0.82), rgba(34,51,130,0.75)), url(${LOGIN_VISUAL_IMAGE}) center/cover`
              : 'linear-gradient(160deg, #111144 0%, #223382 100%)',
          }}
        >
          {/* Fine technical grid — blueprint texture */}
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#F4F1EC 1px,transparent 1px),linear-gradient(90deg,#F4F1EC 1px,transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          {/* ── Custom line-art illustration: interlocking pipe fittings ── */}
          <div className="absolute inset-0 flex items-center justify-center opacity-90 pointer-events-none group">
            <svg
              viewBox="0 0 420 420"
              className="w-[85%] max-w-[420px] transition-transform duration-700 group-hover:scale-[1.03]"
              fill="none"
            >
              {/* Main horizontal pipe run */}
              <rect x="20" y="190" width="380" height="40" rx="4" stroke="#9BACD8" strokeWidth="2" />
              <line x1="20" y1="210" x2="400" y2="210" stroke="#9BACD8" strokeOpacity="0.35" strokeWidth="1" />

              {/* Flange joints */}
              <rect x="70" y="178" width="14" height="64" rx="2" stroke="#DAD1C8" strokeWidth="2" />
              <rect x="220" y="178" width="14" height="64" rx="2" stroke="#DAD1C8" strokeWidth="2" />
              <rect x="330" y="178" width="14" height="64" rx="2" stroke="#DAD1C8" strokeWidth="2" />

              {/* Vertical branch pipe */}
              <rect x="130" y="60" width="40" height="130" rx="4" stroke="#9BACD8" strokeWidth="2" />
              <line x1="150" y1="60" x2="150" y2="190" stroke="#9BACD8" strokeOpacity="0.35" strokeWidth="1" />

              {/* Elbow fitting */}
              <path
                d="M130 60 Q90 60 90 100 L90 140"
                stroke="#F98513"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="90" cy="140" r="5" fill="#F98513" />

              {/* Valve wheel */}
              <circle cx="280" cy="210" r="26" stroke="#F98513" strokeWidth="2.5" />
              <line x1="280" y1="184" x2="280" y2="236" stroke="#F98513" strokeWidth="2" />
              <line x1="254" y1="210" x2="306" y2="210" stroke="#F98513" strokeWidth="2" />
              <line x1="262" y1="192" x2="298" y2="228" stroke="#F98513" strokeWidth="1.5" strokeOpacity="0.6" />
              <line x1="298" y1="192" x2="262" y2="228" stroke="#F98513" strokeWidth="1.5" strokeOpacity="0.6" />

              {/* Dimension / spec callouts */}
              <line x1="70" y1="260" x2="234" y2="260" stroke="#9BACD8" strokeWidth="1" strokeDasharray="4 4" />
              <text x="70" y="278" fill="#9BACD8" fontSize="10" fontFamily="monospace" letterSpacing="1">
                DN 100 · PN 16
              </text>

              {/* Small bolt/nut details on flanges */}
              {[77, 227, 337].map((x) => (
                <g key={x}>
                  <circle cx={x} cy="182" r="2" fill="#DAD1C8" />
                  <circle cx={x} cy="238" r="2" fill="#DAD1C8" />
                </g>
              ))}
            </svg>
          </div>

          {/* Coral (Habanero) geometric accent */}
          <div className="absolute -bottom-14 -right-14 w-48 h-48 bg-[#F98513]/25 rotate-12 pointer-events-none" />

          {/* Wordmark */}
          <div className="relative z-10">
            <span className="font-display font-600 text-lg sm:text-xl text-white tracking-tight">
              Jainam
            </span>
          </div>

          {/* Headline + copy */}
          <div className="relative z-10 max-w-sm">
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-[#F98513] uppercase">
              Pipes · Valves · Fittings
            </span>
            <h1 className="font-display font-600 text-2xl sm:text-3xl lg:text-4xl text-white leading-[1.1] mt-3 mb-3">
              Built for<br className="hidden lg:block" /> better flow.
            </h1>
            <p className="hidden sm:block text-[#9BACD8] text-sm leading-relaxed">
              Sign in to manage your orders, enquiries and catalogue access.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            RIGHT — login form panel
        ══════════════════════════════════════ */}
        <div className="relative bg-white flex flex-col justify-center px-6 sm:px-12 lg:px-14 py-12 sm:py-16">
          <div className="w-full max-w-sm mx-auto animate-fade-in">

            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-[#F98513] uppercase">
              Login
            </span>
            <h2 className="font-display font-600 text-2xl sm:text-[28px] text-[#111144] mt-3 mb-2">
              Welcome back.
            </h2>
            <p className="text-[#223382]/60 text-sm mb-9">
              Sign in to continue to Jainam.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {error && (
                <div className="bg-[#F98513]/10 border border-[#F98513]/40 text-[#F98513] text-xs px-3 py-2.5 font-display rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block font-mono text-[10px] tracking-widest text-[#223382]/60 uppercase mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent border-0 border-b-[1.5px] border-[#DAD1C8] pb-3 text-sm text-[#111144]
                             placeholder:text-[#DAD1C8] focus:outline-none focus:border-[#F98513]
                             transition-colors duration-200 min-h-[44px]"
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-widest text-[#223382]/60 uppercase mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-[1.5px] border-[#DAD1C8] pb-3 pr-8 text-sm text-[#111144]
                               placeholder:text-[#DAD1C8] focus:outline-none focus:border-[#F98513]
                               transition-colors duration-200 min-h-[44px]"
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 bottom-3 text-[#DAD1C8] hover:text-[#223382] transition-colors"
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
                className="w-full flex items-center justify-center gap-2 bg-[#F98513] text-white py-3.5
                           font-display font-600 text-sm rounded
                           hover:bg-[#111144] transition-all duration-200
                           active:scale-[0.98]
                           disabled:opacity-60 disabled:cursor-not-allowed
                           min-h-[48px] mt-2"
              >
                {submitting ? (
                  <span className="font-mono text-xs tracking-widest uppercase">Signing in…</span>
                ) : (
                  <>
                    Sign in
