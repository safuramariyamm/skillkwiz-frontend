// app/dashboard/admin/overview/page.tsx
"use client";

import {
  Users,
  Building2,
  UserCheck,
  ClipboardList,
  DollarSign,
  Star,
  Download,
} from "lucide-react";
import {
  StatCard,
  SectionCard,
  PageHeader,
  Btn,
  SkeletonCard,
  EmptyState,
} from "@/components/dashboard/shared";
import { RevenueBarChart } from "@/components/dashboard/charts";
import { useAdminRevenue } from "@/hooks";

export default function AdminOverviewPage() {
  const { summary, monthly } = useAdminRevenue();

  const revData = monthly.data?.monthly ?? [];
  const stats = summary.data;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Platform Overview"
        subtitle="Live metrics from your SkillKwiz database"
        actions={<Btn icon={<Download size={14} />}>Export CSV</Btn>}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {summary.loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : summary.error ? (
          <div className="col-span-full">
            <EmptyState title="Could not load platform stats" description={summary.error} />
          </div>
        ) : (
          <>
            <StatCard
              label="Total Users"
              value={String(stats?.totalUsers ?? 0)}
              icon={<Users size={18} className="text-[#1e40af]" />}
              iconBg="bg-[#eff6ff]"
            />
            <StatCard
              label="Employers"
              value={String(stats?.totalEmployers ?? 0)}
              icon={<Building2 size={18} className="text-emerald-700" />}
              iconBg="bg-emerald-50"
            />
            <StatCard
              label="Candidates"
              value={String(stats?.totalCandidates ?? 0)}
              icon={<UserCheck size={18} className="text-amber-700" />}
              iconBg="bg-amber-50"
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
              icon={<DollarSign size={18} className="text-violet-700" />}
              iconBg="bg-violet-50"
            />
            <StatCard
              label="Active Plans"
              value={String(stats?.activePlans ?? 0)}
              icon={<Star size={18} className="text-emerald-700" />}
              iconBg="bg-emerald-50"
            />
          </>
        )}
      </div>

      <SectionCard title="Monthly Revenue">
        {monthly.loading ? (
          <div className="h-[200px] bg-[#f0f7ff] rounded-lg animate-pulse" />
        ) : revData.length === 0 ? (
          <EmptyState message="No completed payments yet." />
        ) : (
          <RevenueBarChart data={revData} height={200} />
        )}
      </SectionCard>
    </div>
  );
}
