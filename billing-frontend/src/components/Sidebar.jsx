import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Package, Users, FileText, History, LogOut } from 'lucide-react'

export default function Sidebar({ onLogout }) {
  const location = useLocation()
  
  const navItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/clients', icon: Users, label: 'Clients' },
    { path: '/billing', icon: FileText, label: 'Billing' },
    { path: '/invoice-history', icon: History, label: 'Invoice History' },
  ]

  return (
    <div className="w-64 bg-primary text-white flex flex-col h-screen">
      <div className="p-6 border-b border-blue-700">
        <h1 className="text-2xl font-bold">Jainam</h1>
        <p className="text-blue-200 text-sm">Billing System</p>
      </div>
      
      <nav className="flex-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive ? 'bg-secondary text-white' : 'text-blue-100 hover:bg-blue-700'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-blue-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
