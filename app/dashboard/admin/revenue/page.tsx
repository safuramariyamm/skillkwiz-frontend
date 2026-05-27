// app/dashboard/admin/revenue/page.tsx
"use client";

import { DollarSign, TrendingUp, Users, Receipt, Download } from "lucide-react";
import {
  StatCard, SectionCard, PageHeader, Btn, DataTable, Badge, SkeletonCard,
} from "@/components/dashboard/shared";
import { StackedRevenueChart } from "@/components/dashboard/charts";
import { useAdminRevenue } from "@/hooks";

const STACKED = [
  { month:"Jan", starter:1980,  growth:17940, enterprise:11980 },
  { month:"Feb", starter:1980,  growth:14940, enterprise:11980 },
  { month:"Mar", starter:1980,  growth:23940, enterprise:11980 },
  { month:"Apr", starter:2970,  growth:20940, enterprise:11980 },
  { month:"May", starter:2970,  growth:29940, enterprise:11980 },
  { month:"Jun", starter:2970,  growth:29940, enterprise:11980 },
];

const TRANSACTIONS = [
  { _id:"t1", date:"Jun 26", employer:"Acme Corp",    plan:"Growth",     amount:299, status:"captured" as const },
  { _id:"t2", date:"Jun 25", employer:"TechHire",     plan:"Enterprise", amount:599, status:"captured" as const },
  { _id:"t3", date:"Jun 24", employer:"DevCo Ltd",    plan:"Starter",    amount:99,  status:"failed"   as const },
  { _id:"t4", date:"Jun 23", employer:"StartupXYZ",   plan:"Starter",    amount:99,  status:"captured" as const },
  { _id:"t5", date:"Jun 22", employer:"GlobalRecruit", plan:"Growth",    amount:299, status:"captured" as const },
];

export default function AdminRevenuePage() {
  const { summary } = useAdminRevenue();

  const txColumns = [
    { key:"date",     header:"Date",    render:(r:typeof TRANSACTIONS[0]) => <span className="text-gray-400">{r.date}</span> },
    { key:"employer", header:"Employer",render:(r:typeof TRANSACTIONS[0]) => <span className="font-medium">{r.employer}</span> },
    { key:"plan",     header:"Plan" },
    { key:"amount",   header:"Amount",  render:(r:typeof TRANSACTIONS[0]) => <span className="font-semibold">${r.amount}</span> },
    {
      key:"status", header:"Status",
      render:(r:typeof TRANSACTIONS[0]) => (
        <Badge
          label={r.status === "captured" ? "Captured" : "Failed"}
          variant={r.status === "captured" ? "green" : "red"}
        />
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Revenue Analytics"
        subtitle="Financial performance overview"
        actions={<Btn icon={<Download size={14} />}>Export PDF</Btn>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summary.loading ? (
          Array.from({ length:4 }).map((_,i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="June Revenue"    value="$48,320" icon={<DollarSign size={18} className="text-emerald-700" />} iconBg="bg-emerald-50" trend="+18%" trendUp />
            <StatCard label="YTD Revenue"     value="$241,600" icon={<TrendingUp size={18} className="text-[#1e40af]" />} iconBg="bg-[#eff6ff]" trend="+24%" trendUp />
            <StatCard label="Active Subs"     value="76"       icon={<Users size={18} className="text-amber-700" />} iconBg="bg-amber-50" trend="-2 this week" trendUp={false} />
            <StatCard label="Avg. Order"      value="$634"     icon={<Receipt size={18} className="text-violet-700" />} iconBg="bg-violet-50" trend="+$42 MoM" trendUp />
          </>
        )}
      </div>

      <SectionCard title="Revenue Breakdown by Plan">
        <StackedRevenueChart data={STACKED} height={220} />
      </SectionCard>

      <SectionCard title="Recent Transactions">
        <DataTable
          columns={txColumns}
          rows={TRANSACTIONS}
          keyExtractor={(r) => r._id}
        />
      </SectionCard>
    </div>
  );
}
