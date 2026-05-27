// Validates role server-side AND client-side for defence in depth.
"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import { Loader2 } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminLayoutContextValue {
  user: AdminUser | null;
  collapsed: boolean;
  toggleSidebar: () => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextValue>({
  user: null,
  collapsed: false,
  toggleSidebar: () => {},
});

export const useAdminLayout = () => useContext(AdminLayoutContext);

interface Props {
  children: React.ReactNode;
  section: "dashboard" | "companies" | "employees" | "payments" | "analytics" | "settings";
}

export default function AdminLayout({ children, section }: Props) {
  const router = useRouter();
  const [user,       setUser]       = useState<AdminUser | null>(null);
  const [collapsed,  setCollapsed]  = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Client-side role guard — second layer of defence after middleware
    const raw = localStorage.getItem("sk_user");
    const token = localStorage.getItem("sk_token");

    if (!raw || !token) {
      router.replace("/admin/login?reason=unauthenticated");
      return;
    }

    try {
      const parsed = JSON.parse(raw);

      // Verify JWT hasn't expired client-side
      const [, payloadB64] = token.split(".");
      const payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
      if (payload.exp && Date.now() / 1000 > payload.exp) {
        localStorage.removeItem("sk_token");
        localStorage.removeItem("sk_user");
        document.cookie = "sk_token=; path=/; max-age=0";
        router.replace("/admin/login?reason=session_expired");
        return;
      }

      // Verify role
      if (parsed.role !== "admin") {
        router.replace("/admin/login?reason=unauthorized");
        return;
      }

      setUser(parsed);
      setAuthChecked(true);
    } catch {
      router.replace("/admin/login?reason=invalid_token");
    }
  }, [router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#050e2d] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-3" />
          <p className="text-white/40 text-sm">Verifying session…</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayoutContext.Provider value={{ user, collapsed, toggleSidebar: () => setCollapsed(p => !p) }}>
      <div className="flex h-screen overflow-hidden bg-[#f0f7ff]">
        <AdminSidebar collapsed={collapsed} activeSection={section} />
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <AdminTopBar user={user} />
          <main className="flex-1 overflow-y-auto p-5 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminLayoutContext.Provider>
  );
}