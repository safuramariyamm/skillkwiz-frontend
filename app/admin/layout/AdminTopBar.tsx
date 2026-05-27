"use client";

import { Shield, Bell, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminLayout } from "./AdminLayout";
import { authAPI } from "@/services/api";

interface Props {
  user: { name: string; email: string } | null;
}

export default function AdminTopBar({ user }: Props) {
  const router = useRouter();
  const { toggleSidebar } = useAdminLayout();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    authAPI.logout();
    document.cookie = "sk_token=; path=/; max-age=0";
    router.push("/admin/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

  return (
    <header className="h-[56px] bg-white border-b border-[#e2edf7] flex items-center px-4 gap-3 flex-shrink-0">
      {/* Sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="text-gray-400 hover:text-gray-700 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Admin badge */}
      <div className="flex items-center gap-1.5 bg-[#eff6ff] border border-blue-200 rounded-full px-3 py-1">
        <Shield size={12} className="text-[#1e40af]" />
        <span className="text-[11px] font-bold text-[#1e40af] tracking-wide">ADMIN</span>
      </div>

      <div className="flex-1" />

      {/* Notifications (placeholder) */}
      <button className="relative text-gray-400 hover:text-gray-700 transition-colors p-1.5">
        <Bell size={18} />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((p) => !p)}
          className="flex items-center gap-2 pl-2 py-1 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[#00418d] flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-gray-800 leading-tight">{user?.name || "Admin"}</div>
            <div className="text-[10px] text-gray-400">{user?.email || ""}</div>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1">
              <button
                onClick={() => { setDropdownOpen(false); router.push("/admin/settings"); }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Settings
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}