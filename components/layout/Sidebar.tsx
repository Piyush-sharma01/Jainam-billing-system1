'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Package,
  Users,
  FileText,
  ShoppingCart,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    label: 'Products',
    href: '/products',
    icon: Package,
  },
  {
    label: 'Clients',
    href: '/clients',
    icon: Users,
  },
  {
    label: 'Billing',
    href: '/billing',
    icon: ShoppingCart,
  },
  {
    label: 'Invoice History',
    href: '/invoice-history',
    icon: FileText,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-[#1e3a5f] text-white flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-blue-900">
        <h1 className="text-2xl font-bold">Jainam</h1>
        <p className="text-sm text-blue-200">Billing System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-orange-500 text-white'
                  : 'text-blue-100 hover:bg-blue-900'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-blue-900">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
