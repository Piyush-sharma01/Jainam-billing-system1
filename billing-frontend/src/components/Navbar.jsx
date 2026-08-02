import React from 'react'
import { User } from 'lucide-react'

export default function Navbar({ user, onLogout }) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome, {user?.name || 'User'}</h2>
          <p className="text-gray-500 text-sm">Manage your billing and invoices</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <User size={20} className="text-gray-600" />
            <span className="text-gray-700">{user?.name || 'Guest'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
