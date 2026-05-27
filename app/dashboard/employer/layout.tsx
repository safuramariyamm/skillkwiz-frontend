// app/dashboard/employer/layout.tsx
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";

export const metadata = { title: "Employer Dashboard — SkillKwiz" };

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="employer">{children}</DashboardLayout>;
}
