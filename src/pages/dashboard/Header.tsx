import { Search, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../function/config/AuthConfig";

interface TopNavbarProps {
  onMenuToggle: () => void;
}

export function TopNavbar({ onMenuToggle }: TopNavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-64 z-50 bg-[#0f1117] border-b border-gray-700 shadow-lg h-20">
      <div className="flex items-center justify-between px-4 h-full">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-[#1a1c23] rounded-lg transition-colors"
          >
            <div className="w-6 h-0.5 bg-gray-400 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-gray-400 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-gray-400"></div>
          </button>

          <div className="flex items-center gap-3 bg-[#1a1c23] rounded-lg px-3 py-2 w-64 md:w-80 lg:w-96">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari hotel, destinasi…"
              className="bg-transparent border-none outline-none text-[#e5e7eb] placeholder-gray-500 flex-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:block text-right">
            <p className="text-[#e5e7eb]">Selamat datang kembali,</p>
            <p className="text-[#3b82f6]">{user?.displayName || user?.email || 'User'}</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center hover:ring-4 hover:ring-blue-500/30 transition-all"
            >
              <User className="w-5 h-5 text-white" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-[#1a1c23] rounded-lg shadow-xl border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <p className="text-[#e5e7eb]">{user?.displayName || 'User'}</p>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full px-4 py-3 text-left text-[#e5e7eb] hover:bg-[#0f1117] transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}