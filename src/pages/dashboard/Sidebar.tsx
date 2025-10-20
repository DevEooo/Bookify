import { Home, Search, Calendar, Heart, CreditCard, Settings, LogOut, History } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ isOpen, onClose, activeView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", icon: Home, label: "Beranda" },
    { id: "search", icon: Search, label: "Cari Hotel" },
    { id: "bookings", icon: Calendar, label: "Pemesanan Saya" },
    { id: "history", icon: History, label: "Riwayat" },
    { id: "wishlist", icon: Heart, label: "Favorit" },
    { id: "payments", icon: CreditCard, label: "Pembayaran" },
  ];

  const handleItemClick = (id: string) => {
    onViewChange(id);
    onClose(); // Close sidebar on mobile after selection
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-[#0f1117] border-r border-gray-700 z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64`}
      >
        <div className="px-4 h-20 border-b border-gray-700 flex items-center">
          <h2 className="text-[#e5e7eb] text-xl pl-3">Bookify Dashboard</h2>
        </div>

        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#3b82f6] text-white"
                    : "text-gray-400 hover:bg-[#1a1c23] hover:text-[#e5e7eb]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 mt-3 border-t border-gray-700">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1a1c23] hover:text-[#e5e7eb] transition-all">
              <LogOut className="w-5 h-5" />
              <span>Keluar</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}