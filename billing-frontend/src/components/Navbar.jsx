import React from "react";
import { User, Menu } from "lucide-react";
import GlobalLoadingBar from "./GlobalLoadingBar";

export default function Navbar({ user, onLogout, onMenuClick }) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="md:hidden shrink-0 p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">
              Welcome, {user?.name || "User"}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm hidden sm:block">
              Manage your billing and invoices
            </p>
            <GlobalLoadingBar />
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg">
            <User size={18} className="text-gray-600" />
            <span className="text-gray-700 text-sm hidden sm:inline">
              {user?.name || "Guest"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
