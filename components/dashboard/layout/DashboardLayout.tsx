// components/dashboard/layout/DashboardLayout.tsx
"use client";

import { useState, createContext, useContext } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface LayoutContextValue {
  collapsed: boolean;
  toggle: () => void;
}
const LayoutContext = createContext<LayoutContextValue>({
  collapsed: false,
  toggle: () => {},
});
export const useLayout = () => useContext(LayoutContext);

interface Props {
  children: React.ReactNode;
  role: "admin" | "employer" | "employee";
}

export default function DashboardLayout({ children, role }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <LayoutContext.Provider
      value={{ collapsed, toggle: () => setCollapsed((p) => !p) }}
    >
      <div className="flex h-screen overflow-hidden bg-[#f0f7ff]">
        {/* Sidebar */}
        <Sidebar role={role} collapsed={collapsed} />

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <TopBar role={role} />

          <main className="flex-1 overflow-y-auto p-5 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
