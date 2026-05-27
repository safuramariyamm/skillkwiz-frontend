// components/dashboard/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Building2, Users, BarChart3, Newspaper,
  Server, ClipboardList, Calendar, Key, CreditCard, TrendingUp,
  CalendarCheck, FileText, BookOpen, ChevronLeft, ChevronRight,
  LogOut,
} from "lucide-react";
import { useLayout } from "./DashboardLayout";
import { authAPI } from "@/services/api";
import { useRouter } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NAV: Record<string, NavItem[]> = {
  admin: [
    { href: "/dashboard/admin/overview",    label: "Overview",        icon: <LayoutDashboard size={18} /> },
    { href: "/dashboard/admin/employers",   label: "Employers",       icon: <Building2 size={18} /> },
    { href: "/dashboard/admin/candidates",  label: "Candidates",      icon: <Users size={18} /> },
    { href: "/dashboard/admin/revenue",     label: "Revenue",         icon: <BarChart3 size={18} /> },
    { href: "/dashboard/admin/blog",        label: "Blog CMS",        icon: <Newspaper size={18} /> },
    { href: "/dashboard/admin/health",      label: "Platform Health", icon: <Server size={18} /> },
  ],
  employer: [
    { href: "/dashboard/employer/overview",     label: "Overview",    icon: <LayoutDashboard size={18} /> },
    { href: "/dashboard/employer/assessments",  label: "Assessments", icon: <ClipboardList size={18} /> },
    { href: "/dashboard/employer/slots",        label: "Slot Manager",icon: <Calendar size={18} /> },
    { href: "/dashboard/employer/candidates",   label: "Candidates",  icon: <Users size={18} /> },
    { href: "/dashboard/employer/credentials",  label: "Credentials", icon: <Key size={18} /> },
    { href: "/dashboard/employer/billing",      label: "Billing",     icon: <CreditCard size={18} /> },
    { href: "/dashboard/employer/analytics",    label: "Analytics",   icon: <TrendingUp size={18} /> },
  ],
  employee: [
    { href: "/dashboard/employee/booking",      label: "Book Slot",       icon: <CalendarCheck size={18} /> },
    { href: "/dashboard/employee/status",       label: "My Bookings",     icon: <BookOpen size={18} /> },
    { href: "/dashboard/employee/instructions", label: "Instructions",    icon: <FileText size={18} /> },
    { href: "/dashboard/employee/company",      label: "Company Info",    icon: <Building2 size={18} /> },
  ],
};

const SECTION_LABEL: Record<string, string> = {
  admin: "ADMIN PANEL",
  employer: "EMPLOYER",
  employee: "EMPLOYEE",
};

interface Props {
  role: "admin" | "employer" | "employee";
  collapsed: boolean;
}

export default function Sidebar({ role, collapsed }: Props) {
  const pathname = usePathname();
  const { toggle } = useLayout();
  const router = useRouter();

  const handleLogout = () => {
    authAPI.logout();
    router.push("/");
  };

  return (
    <aside
      className={`
        flex flex-col bg-[#0a1628] transition-all duration-300 ease-in-out
        ${collapsed ? "w-[56px]" : "w-[220px]"}
        flex-shrink-0
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-white/[0.07] h-[56px]">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#00418d] flex items-center justify-center">
          <span className="text-white font-bold text-sm">SK</span>
        </div>
        {!collapsed && (
          <Image
            src="/images/skilllogo.png"
            alt="SkillKwiz"
            width={100}
            height={28}
            className="object-contain h-7 w-auto"
          />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-hidden">
        {!collapsed && (
          <p className="px-3 pb-1 text-[10px] font-bold tracking-widest text-white/30">
            {SECTION_LABEL[role]}
          </p>
        )}

        {NAV[role].map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href);
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
              {/* Active indicator bar */}
              {active && (
                <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#daeeff] rounded-r-full" />
              )}

              <span className="flex-shrink-0">{item.icon}</span>

              {!collapsed && (
                <span className="text-[13px] font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}

              {/* Tooltip when collapsed */}
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

      {/* Bottom: logout + collapse toggle */}
      <div className="border-t border-white/[0.07] py-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-[9px] mx-1 rounded-lg
            text-white/40 hover:text-white/80 hover:bg-white/[0.06]
            transition-all duration-150 text-[13px]"
          style={{ width: "calc(100% - 8px)" }}
        >
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>

        <button
          onClick={toggle}
          className="w-full flex items-center justify-center py-2 mt-1
            text-white/30 hover:text-white/70 transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
