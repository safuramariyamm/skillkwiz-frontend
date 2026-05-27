"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/app/admin/layout/AdminLayout";
import {
  BarChart3, Users, Building2, TrendingUp, Activity,
  Download, RefreshCw,
} from "lucide-react";
import {
  PageHeader, SectionCard, StatCard, SkeletonCard, EmptyState, Btn,
} from "@/components/dashboard/shared";
import {
  RevenueBarChart, GrowthLineChart, StackedRevenueChart,
} from "@/components/dashboard/charts";
import { useAdminRevenue, useAdminEmployers, useAdminCandidates } from "@/hooks";
import { adminRevenueAPI } from "@/services/api";

function useFetch<T>(fetcher: () => Promise<{ ok: boolean; data: any }>, deps: any[] = []) {
  const [data,    setData]    = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetcher();
    setData(res.ok ? (res.data?.data ?? res.data) as T : null);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => { load(); }, [load]);
  return { data, loading, reload: load };
}

// Derive monthly growth from employer/candidate data
function buildGrowthData(employers: any[], candidates: any[]) {
  const months: Record<string, { employers: number; candidates: number }> = {};
  const addToMonth = (items: any[], key: "employers" | "candidates") => {
    items.forEach((item: any) => {
      if (!item.createdAt) return;
      const m = new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      if (!months[m]) months[m] = { employers: 0, candidates: 0 };
      months[m][key]++;
    });
  };
  addToMonth(employers, "employers");
  addToMonth(candidates, "candidates");
  return Object.entries(months)
    .sort((a, b) => new Date("1 " + a[0]).getTime() - new Date("1 " + b[0]).getTime())
    .slice(-6)
    .map(([month, v]) => ({ month, ...v }));
}

export default function AdminAnalyticsPage() {
  const { summary, monthly } = useAdminRevenue();
  const employersResult  = useAdminEmployers(1, "", "");
  const candidatesResult = useAdminCandidates(1, "", "");

  const stats      = summary.data as any;
  const revData    = (monthly.data as any)?.monthly ?? [];
  const employers  = (employersResult.data as any)?.employers ?? [];
  const candidates = (candidatesResult.data as any)?.candidates ?? [];

  const growthData = buildGrowthData(employers, candidates);

  // Plan distribution
  const planDist = employers.reduce((acc: Record<string, number>, emp: any) => {
    const p = emp.plan ?? "none";
    acc[p] = (acc[p] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Score distribution for candidates
  const scoreBuckets: Record<string, number> = {
    "0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0,
  };
  candidates.forEach((c: any) => {
    const s = c.score ?? 0;
    if (s <= 20)      scoreBuckets["0-20"]++;
    else if (s <= 40) scoreBuckets["21-40"]++;
    else if (s <= 60) scoreBuckets["41-60"]++;
    else if (s <= 80) scoreBuckets["61-80"]++;
    else              scoreBuckets["81-100"]++;
  });

  const PLAN_COLOR: Record<string, string> = {
    enterprise: "#0a1628",
    growth: "#00418d",
    starter: "#b3d4f5",
    none: "#e2edf7",
  };

  return (
    <AdminLayout section="analytics">
      <div className="space-y-5">
        <PageHeader
          title="Analytics"
          subtitle="Platform-wide growth, revenue trends, and engagement metrics"
          actions={<Btn icon={<Download size={14} />}>Export Report</Btn>}
        />

        {/* KPI Row */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {summary.loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <StatCard
                label="Total Employers"
                value={String(stats?.totalEmployers ?? 0)}
                icon={<Building2 size={18} className="text-[#1e40af]" />}
                iconBg="bg-[#eff6ff]"
                trend={stats?.newEmployersThisMonth ? `+${stats.newEmployersThisMonth} this month` : undefined}
                trendUp
              />
              <StatCard
                label="Total Candidates"
                value={String(stats?.totalCandidates ?? 0)}
                icon={<Users size={18} className="text-emerald-700" />}
                iconBg="bg-emerald-50"
                trend={stats?.newCandidatesThisMonth ? `+${stats.newCandidatesThisMonth} this month` : undefined}
                trendUp
              />
              <StatCard
                label="Total Assessments"
                value={String(stats?.totalAssessments ?? 0)}
                icon={<Activity size={18} className="text-amber-700" />}
                iconBg="bg-amber-50"
              />
              <StatCard
                label="Platform Revenue"
                value={`₹${Number(stats?.totalRevenue ?? 0).toLocaleString()}`}
                icon={<TrendingUp size={18} className="text-violet-700" />}
                iconBg="bg-violet-50"
              />
            </>
          )}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <SectionCard title="Revenue Trend (6 Months)" className="xl:col-span-2">
            {monthly.loading ? (
              <div className="h-[220px] bg-[#f0f7ff] rounded-lg animate-pulse" />
            ) : revData.length === 0 ? (
              <EmptyState title="No revenue data yet" />
            ) : (
              <RevenueBarChart data={revData} height={220} />
            )}
          </SectionCard>

          <SectionCard title="Plan Distribution">
            {employersResult.loading ? (
              <div className="h-[220px] bg-[#f0f7ff] rounded-lg animate-pulse" />
            ) : (
              <div className="space-y-3 py-2">
                {Object.entries(planDist).map(([plan, count]) => {
                  const total = employers.length || 1;
                  const pct = Math.round(((count as number) / total) * 100);
                  return (
                    <div key={plan}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700 capitalize">{plan}</span>
                        <span className="text-xs text-gray-400">{count as number} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: PLAN_COLOR[plan] || "#b3d4f5",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                {Object.keys(planDist).length === 0 && (
                  <EmptyState title="No plan data" />
                )}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <SectionCard title="User Growth (Employers vs Candidates)">
            {employersResult.loading || candidatesResult.loading ? (
              <div className="h-[200px] bg-[#f0f7ff] rounded-lg animate-pulse" />
            ) : growthData.length === 0 ? (
              <EmptyState title="Not enough data to show growth" />
            ) : (
              <GrowthLineChart data={growthData} height={200} />
            )}
          </SectionCard>

          <SectionCard title="Assessment Score Distribution">
            {candidatesResult.loading ? (
              <div className="h-[200px] bg-[#f0f7ff] rounded-lg animate-pulse" />
            ) : candidates.length === 0 ? (
              <EmptyState title="No assessment data yet" />
            ) : (
              <div className="space-y-3 pt-2">
                {Object.entries(scoreBuckets).map(([bucket, count]) => {
                  const max = Math.max(...Object.values(scoreBuckets), 1);
                  const pct = Math.round(((count as number) / max) * 100);
                  const color =
                    bucket === "81-100" ? "#10b981"
                    : bucket === "61-80" ? "#00418d"
                    : bucket === "41-60" ? "#f59e0b"
                    : "#f73e5d";
                  return (
                    <div key={bucket}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">{bucket}%</span>
                        <span className="text-xs text-gray-400">{count as number} candidates</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Activity Summary */}
        <SectionCard title="Platform Activity Summary">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Active Plans",         value: stats?.activePlans         ?? "—" },
              { label: "Expired Plans",         value: stats?.expiredPlans        ?? "—" },
              { label: "Failed Payments",       value: stats?.failedPayments      ?? "—" },
              { label: "New Employers / Month", value: stats?.newEmployersThisMonth ?? "—" },
              { label: "New Candidates / Month",value: stats?.newCandidatesThisMonth ?? "—" },
              { label: "Total Assessments",     value: stats?.totalAssessments    ?? "—" },
            ].map((item) => (
              <div key={item.label} className="bg-[#f0f7ff] rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-semibold text-[#00418d]">{item.value}</div>
                <div className="text-[11px] text-gray-500 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </AdminLayout>
  );
}
