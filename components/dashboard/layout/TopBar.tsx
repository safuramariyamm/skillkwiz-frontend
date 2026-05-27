// components/dashboard/layout/TopBar.tsx
"use client";

import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, User, LogOut, Settings } from "lucide-react";
import { useLayout } from "./DashboardLayout";
import { authAPI } from "@/services/api";
import { useRouter } from "next/navigation";

// Build breadcrumb from pathname
function useBreadcrumb() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean); // ["dashboard","admin","overview"]
  return parts.map((p, i) => ({
    label: p.charAt(0).toUpperCase() + p.slice(1),
    href: "/" + parts.slice(0, i + 1).join("/"),
    isLast: i === parts.length - 1,
  }));
}

const MOCK_NOTIFS = [
  { id: 1, text: "Acme Corp purchased Growth plan", time: "2m ago", unread: true },
  { id: 2, text: "12 candidates invited by TechHire", time: "8m ago", unread: true },
  { id: 3, text: "Assessment 'React Senior' completed", time: "15m ago", unread: true },
];

interface Props {
  role: "admin" | "employer" | "employee";
}

export default function TopBar({ role }: Props) {
  const crumbs = useBreadcrumb();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    router.push("/");
  };

  const roleLabel =
    role === "admin" ? "Admin" : role === "employer" ? "Employer" : "Employee";

  return (
    <header className="h-[56px] bg-white border-b border-[#e2edf7] flex items-center justify-between px-5 flex-shrink-0">

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
        {crumbs.map((c, i) => (
          <span key={c.href} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-gray-300">/</span>}
            {c.isLast ? (
              <span className="font-medium text-[#00418d]">{c.label}</span>
            ) : (
              <a href={c.href} className="text-gray-400 hover:text-gray-600 transition-colors">
                {c.label}
              </a>
            )}
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Role badge */}
        <span className="hidden sm:inline-flex text-xs font-medium text-[#00418d] bg-[#daeeff] px-3 py-1 rounded-full">
          {roleLabel}
        </span>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((p) => !p)}
            className="relative w-9 h-9 rounded-lg border border-[#e2edf7] bg-white
              flex items-center justify-center hover:bg-[#f0f7ff] transition-colors"
            aria-label="Notifications"
          >
            <Bell size={17} className="text-gray-500" />
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-[#f73e5d] rounded-full
              text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl border border-[#e2edf7]
              shadow-lg shadow-[#00418d]/10 z-50">
              <div className="px-4 py-3 border-b border-[#e2edf7]">
                <p className="text-sm font-medium text-gray-900">Notifications</p>
              </div>
              {MOCK_NOTIFS.map((n) => (
                <div key={n.id}
                  className="px-4 py-3 border-b border-[#f0f5fb] last:border-0
                    hover:bg-[#f8fbff] transition-colors cursor-pointer flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#00418d] flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="text-xs text-gray-700 leading-relaxed">{n.text}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2">
                <button className="text-xs text-[#00418d] hover:underline">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((p) => !p)}
            className="flex items-center gap-2 hover:bg-[#f0f7ff] px-2 py-1.5 rounded-lg
              transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#00418d] flex items-center justify-center
              text-white text-xs font-semibold">
              {roleLabel[0]}
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl
              border border-[#e2edf7] shadow-lg shadow-[#00418d]/10 z-50 py-1">
              <div className="px-3 py-2 border-b border-[#f0f5fb]">
                <p className="text-xs font-medium text-gray-800">Signed in as</p>
                <p className="text-xs text-gray-500 truncate">{roleLabel} Account</p>
              </div>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm
                text-gray-600 hover:bg-[#f8fbff] transition-colors">
                <User size={15} /> Profile
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm
                text-gray-600 hover:bg-[#f8fbff] transition-colors">
                <Settings size={15} /> Settings
              </button>
              <div className="border-t border-[#f0f5fb] mt-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm
                  text-[#f73e5d] hover:bg-[#fff0f2] transition-colors">
                <LogOut size={15} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
