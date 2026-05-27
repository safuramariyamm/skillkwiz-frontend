"use client";

import AdminLayout from "@/app/admin/layout/AdminLayout";
import {
  Users, Building2, ClipboardList,
  IndianRupee, Activity, Download,
  ArrowUpRight, ArrowDownRight, UserCheck,
} from "lucide-react";
import { useAdminRevenue, useAdminEmployers } from "@/hooks";
import { RevenueBarChart } from "@/components/dashboard/charts";
import { StatCard, SectionCard, PageHeader, Btn, SkeletonCard, EmptyState } from "@/components/dashboard/shared";

export default function AdminDashboardPage() {
  const { summary, monthly } = useAdminRevenue();
  const employers = useAdminEmployers(1, "", "");

  const stats      = summary.data as any;
  const revData    = (monthly.data as any)?.monthly ?? [];
  const recentEmps = (employers.data as any)?.employers?.slice(0, 5) ?? [];

  return (
    <AdminLayout section="dashboard">
      <div className="space-y-6">
        <PageHeader
          title="Platform Overview"
          subtitle="Live metrics across the entire SkillKwiz platform"
          actions={<Btn icon={<Download size={14} />}>Export Report</Btn>}
        />

        {/* KPI Cards — 5 cards, no Candidates */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {summary.loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          ) : summary.error ? (
            <div className="col-span-full">
              <EmptyState title="Could not load stats" description={summary.error} />
            </div>
          ) : (
            <>
              <StatCard
                label="Employees"
                value={String(stats?.totalEmployees ?? stats?.totalUsers ?? 0)}
                icon={<UserCheck size={18} className="text-[#1e40af]" />}
                iconBg="bg-[#eff6ff]"
              />
              <StatCard
                label="Employers"
                value={String(stats?.totalEmployers ?? 0)}
                icon={<Building2 size={18} className="text-emerald-700" />}
                iconBg="bg-emerald-50"
              />
              <StatCard
                label="Assessments"
                value={String(stats?.totalAssessments ?? 0)}
                icon={<ClipboardList size={18} className="text-[#f73e5d]" />}
                iconBg="bg-[#fff0f2]"
              />
              <StatCard
                label="Revenue"
                value={`$${Number(stats?.totalRevenue ?? 0).toLocaleString()}`}
                icon={<IndianRupee size={18} className="text-violet-700" />}
                iconBg="bg-violet-50"
              />
              <StatCard
                label="Active Plans"
                value={String(stats?.activePlans ?? 0)}
                icon={<Activity size={18} className="text-emerald-700" />}
                iconBg="bg-emerald-50"
              />
            </>
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <SectionCard title="Monthly Revenue" className="xl:col-span-2">
            {monthly.loading ? (
              <div className="h-[220px] bg-[#f0f7ff] rounded-lg animate-pulse" />
            ) : revData.length === 0 ? (
              <EmptyState title="No revenue data yet" description="Revenue will appear once payments are made." />
            ) : (
              <RevenueBarChart data={revData} height={220} />
            )}
          </SectionCard>

          <SectionCard title="Quick Stats">
            <div className="space-y-4 pt-1">
              {summary.loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-5 bg-gray-100 rounded animate-pulse" />
                ))
              ) : (
                [
                  {
                    label: "Employers this month",
                    value: stats?.newEmployersThisMonth ?? 0,
                    up: true,
                  },
                  {
                    label: "Employees this month",
                    value: stats?.newCandidatesThisMonth ?? stats?.newEmployeesThisMonth ?? 0,
                    up: true,
                  },
                  {
                    label: "Failed payments",
                    value: stats?.failedPayments ?? 0,
                    up: false,
                  },
                  {
                    label: "Expired plans",
                    value: stats?.expiredPlans ?? 0,
                    up: false,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                      item.up ? "text-emerald-600" : "text-red-500"
                    }`}>
                      {item.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {item.value}
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>

        {/* Recent Employers */}
        <SectionCard
          title="Recent Employers"
          action={
            <a href="/admin/companies" className="text-xs text-[#1e40af] hover:underline font-medium">
              View all →
            </a>
          }
        >
          {employers.loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recentEmps.length === 0 ? (
            <EmptyState title="No employers yet" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Company", "Contact", "Plan", "Credits", "Status", "Joined"].map(h => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentEmps.map((emp: any) => (
                    <tr key={emp._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3 font-medium text-gray-900">{emp.companyName}</td>
                      <td className="py-3 px-3 text-gray-500">{emp.contactName}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border
                          ${emp.plan === "enterprise" ? "bg-violet-50 text-violet-700 border-violet-200"
                            : emp.plan === "growth" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                          {emp.plan ?? "—"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-700">{emp.credits ?? 0}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border
                          ${emp.planStatus === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-600 border-red-200"}`}>
                          {emp.planStatus ?? "—"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-400 text-xs">
                        {emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>
    </AdminLayout>
  );
}