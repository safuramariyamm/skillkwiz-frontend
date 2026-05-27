// app/dashboard/employee/layout.tsx
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";

export const metadata = { title: "My Dashboard — SkillKwiz" };

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="employee">{children}</DashboardLayout>;
}
