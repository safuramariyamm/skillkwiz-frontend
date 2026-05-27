"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Building2, Users, CreditCard,
  BarChart3, Settings, LogOut, ChevronLeft, ChevronRight,
  Shield,
} from "lucide-react";
import { useAdminLayout } from "./AdminLayout";
import { authAPI } from "@/services/api";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  section: string;
}

const NAV: NavItem[] = [
  { href: "/admin/dashboard",  label: "Dashboard",     icon: <LayoutDashboard size={18} />, section: "dashboard"  },
  { href: "/admin/companies",  label: "Companies",     icon: <Building2 size={18} />,       section: "companies"  },
  { href: "/admin/employees",  label: "Employees",     icon: <Users size={18} />,           section: "employees"  },
  { href: "/admin/payments",   label: "Payments",      icon: <CreditCard size={18} />,      section: "payments"   },
  { href: "/admin/analytics",  label: "Analytics",     icon: <BarChart3 size={18} />,       section: "analytics"  },
  { href: "/admin/settings",   label: "Settings",      icon: <Settings size={18} />,        section: "settings"   },
];

interface Props {
  collapsed: boolean;
  activeSection: string;
}

export default function AdminSidebar({ collapsed, activeSection }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const { toggleSidebar } = useAdminLayout();

  const handleLogout = () => {
    authAPI.logout();
    document.cookie = "sk_token=; path=/; max-age=0";
    router.push("/admin/login");
  };

  return (
    <aside
      className={`
        flex flex-col bg-[#0a1628] transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? "w-[56px]" : "w-[220px]"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-white/[0.07] h-[56px]">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#00418d] flex items-center justify-center">
          <Shield size={15} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <Image
              src="/images/skilllogo.png"
              alt="SkillKwiz"
              width={90}
              height={24}
              className="object-contain h-6 w-auto"
            />
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-hidden">
        {!collapsed && (
          <p className="px-3 pb-1 text-[10px] font-bold tracking-widest text-white/30">
            ADMIN PANEL
          </p>
        )}

        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`
                relative flex items-center gap-3 px-3 py-[9px] mx-1 rounded-lg my-[2px]
                transition-all duration-150 group
                ${active
                  ? "bg-[#00418d]/50 text-white"
                  : "text-white/55 hover:text-white hover:bg-white/[0.06]"
                }
              `}
            >
              {active && (
                <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#daeeff] rounded-r-full" />
              )}
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="text-[13px] font-medium whitespace-nowrap">{item.label}</span>
              )}
              {collapsed && (
                <span className="
                  absolute left-full ml-2 px-2 py-1 rounded-md text-xs font-medium
                  bg-[#0a1628] text-white border border-white/10
                  opacity-0 pointer-events-none group-hover:opacity-100
                  transition-opacity whitespace-nowrap z-50
                ">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/[0.07] py-2">
        <button
          onClick={handleLogout}
          style={{ width: "calc(100% - 8px)" }}
          className="flex items-center gap-3 px-3 py-[9px] mx-1 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all duration-150 text-[13px]"
        >
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>

        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center py-2 mt-1 text-white/30 hover:text-white/70 transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}