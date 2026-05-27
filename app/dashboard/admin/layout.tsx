// app/dashboard/admin/layout.tsx
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";

export const metadata = { title: "Admin Dashboard — SkillKwiz" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="admin">{children}</DashboardLayout>;
}
