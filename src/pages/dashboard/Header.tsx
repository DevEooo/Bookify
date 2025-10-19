import { Search, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../function/config/AuthConfig";
import { useNavigate } from "react-router-dom";

interface TopNavbarProps {
  onMenuToggle: () => void;
  activeView: string;
  username: string;
}

export function TopNavbar({ onMenuToggle, activeView, username }: TopNavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-64 z-50 bg-[#0f1117] border-b border-gray-700 shadow-lg h-20">
      <div className="flex items-center justify-between px-4 h-full">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-[#1a1c23] rounded-lg transition-colors"
          >
            <div className="w-6 h-0.5 bg-gray-400 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-gray-400 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-gray-400"></div>
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[#e5e7eb]">Selamat datang,</p>
            <p className="text-[#3b82f6]">{username}</p>
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
                  <p className="text-[#e5e7eb]">{user?.displayName || "User"}</p>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
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