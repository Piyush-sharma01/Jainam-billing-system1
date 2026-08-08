import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Package, Users, FileText, History, LogOut, X, BookImage } from 'lucide-react'

  
export default function Sidebar({ onLogout, isOpen, onClose }) {
  const location = useLocation()

const navItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/catalogue', icon: BookImage, label: 'Catalogue' },
    { path: '/clients', icon: Users, label: 'Clients' },
    { path: '/billing', icon: FileText, label: 'Billing' },
    { path: '/invoice-history', icon: History, label: 'Invoice History' },
  ]
  return (
    <>
      {/* Mobile overlay — click to close */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel:
          - mobile: fixed, slides in/out with translate-x, hidden off-screen by default
          - md+: static, always visible, no transform */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-primary text-white flex flex-col h-screen
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        <div className="p-6 border-b border-blue-700 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Jainam</h1>
            <p className="text-blue-200 text-sm">Billing System</p>
          </div>
          <button onClick={onClose} className="md:hidden text-blue-200 hover:text-white">
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
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
    </>
  )
}
