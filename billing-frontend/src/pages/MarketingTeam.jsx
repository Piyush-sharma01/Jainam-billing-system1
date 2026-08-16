import React, { useState, useEffect } from 'react'
import { userAPI } from '../services/api'
import { UserPlus, Trash2, Users, Eye, EyeOff } from 'lucide-react'

export default function MarketingTeam() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    loadTeam()
  }, [])

  const loadTeam = async () => {
    try {
      setLoading(true)
      const res = await userAPI.getMarketingTeam()
      setTeam(res.data || [])
    } catch (err) {
      setError('Failed to load marketing team')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!name || !username || !password || !phone) {
      setFormError('Please fill in all fields')
      return
    }
    if (password.length < 6) {
      setFormError('Password should be at least 6 characters')
      return
    }

    try {
      setSubmitting(true)
      await userAPI.createMarketingUser({ name, username, password, phone })
      setName('')
      setUsername('')
      setPassword('')
      setPhone('')
      await loadTeam()
    } catch (err) {
      setFormError(err.response?.data?.message || err.response?.data || 'Could not create account — username may already be taken')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id, memberName) => {
    if (!window.confirm(`Remove ${memberName}'s access? They won't be able to log in anymore, but their existing clients/invoices stay in the system.`)) {
      return
    }
    try {
      await userAPI.delete(id)
      await loadTeam()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Marketing Team</h1>
        <p className="text-gray-500">
          Create logins for your marketing team. Each member only sees the clients and invoices they add themselves.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <UserPlus size={20} />
          Add a team member
        </h2>

        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {formError}
          </div>
        )}

        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="e.g. Priya Sharma"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="e.g. priya"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">WhatsApp Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field"
              placeholder="e.g. 9198xxxxxxx"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-10"
                placeholder="Min 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="sm:col-span-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-secondary text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-60"
            >
              {submitting ? 'Creating...' : 'Create Login'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Users size={20} className="text-gray-600" />
          <h2 className="text-lg font-bold text-gray-800">Team members</h2>
        </div>

        {error && (
          <div className="p-4 text-red-600 text-sm">{error}</div>
        )}

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : team.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No marketing team members yet. Add one above and share the login with them.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Username</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">WhatsApp Number</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {team.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">{member.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{member.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{member.phone || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(member.id, member.name)}
                        className="text-red-500 hover:text-red-700 inline-flex items-center gap-1 text-sm"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
