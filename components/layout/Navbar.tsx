'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { User, Bell } from 'lucide-react';

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">
        Welcome back, {user?.name}!
      </h2>
      
      <div className="flex items-center gap-6">
        <button className="text-gray-600 hover:text-gray-800 relative">
          <Bell size={24} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
            {user?.name?.[0]}
          </div>
        </div>
      </div>
    </header>
  );
}
