"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/app/admin/layout/AdminLayout";
import {
  CreditCard, DollarSign, TrendingUp, AlertTriangle,
  ChevronLeft, ChevronRight, RefreshCw, Download,
} from "lucide-react";
import {
  PageHeader, SectionCard, StatCard, Badge,
  SkeletonCard, SkeletonTable, EmptyState, Btn,
} from "@/components/dashboard/shared";
import { RevenueBarChart } from "@/components/dashboard/charts";
import { useAdminRevenue } from "@/hooks";
import { adminRevenueAPI } from "@/services/api";

function useFetch<T>(
  fetcher: () => Promise<{ ok: boolean; data: any; message?: string }>,
  deps: any[] = []
) {
  const [data,    setData]    = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetcher();
    if (res.ok) setData((res.data?.data ?? res.data) as T);
    else { setError(res.message || "Failed"); setData(null); }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load };
}

type Transaction = {
  _id: string;
  employer?: { companyName?: string };
  amount: number;
  plan?: string;
  status: string;
  method?: string;
  createdAt: string;
};

function txStatusBadge(status: string) {
  if (status === "success" || status === "completed") return <Badge label="Success"  variant="green"  />;
  if (status === "pending")                           return <Badge label="Pending"  variant="yellow" />;
  if (status === "failed")                            return <Badge label="Failed"   variant="red"    />;
  return <Badge label={status} variant="gray" />;
}

export default function AdminPaymentsPage() {
  const [txPage, setTxPage] = useState(1);
  const { summary, monthly } = useAdminRevenue();
  const txResult = useFetch<{ transactions: Transaction[]; pagination: { total: number } }>(
    () => adminRevenueAPI.transactions(txPage, 15),
    [txPage]
  );

  const stats   = summary.data as any;
  const revData = (monthly.data as any)?.monthly ?? [];
  const txList  = (txResult.data as any)?.transactions ?? [];
  const txTotal = (txResult.data as any)?.pagination?.total ?? 0;
  const txPages = Math.max(1, Math.ceil(txTotal / 15));

  return (
    <AdminLayout section="payments">
      <div className="space-y-5">
        <PageHeader
          title="Payments & Billing"
          subtitle="Subscription revenue, transaction history and plan activity"
          actions={<Btn icon={<Download size={14} />}>Export CSV</Btn>}
        />

        {/* KPI Row */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {summary.loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <StatCard
                label="Total Revenue"
                value={`₹${Number(stats?.totalRevenue ?? 0).toLocaleString()}`}
                icon={<DollarSign size={18} className="text-violet-700" />}
                iconBg="bg-violet-50"
              />
              <StatCard
                label="Active Plans"
                value={String(stats?.activePlans ?? 0)}
                icon={<CreditCard size={18} className="text-[#1e40af]" />}
                iconBg="bg-[#eff6ff]"
              />
              <StatCard
                label="Revenue This Month"
                value={`₹${Number(stats?.revenueThisMonth ?? 0).toLocaleString()}`}
                icon={<TrendingUp size={18} className="text-emerald-700" />}
                iconBg="bg-emerald-50"
              />
              <StatCard
                label="Failed Payments"
                value={String(stats?.failedPayments ?? 0)}
                icon={<AlertTriangle size={18} className="text-red-500" />}
                iconBg="bg-red-50"
              />
            </>
          )}
        </div>

        {/* Revenue Chart */}
        <SectionCard title="Monthly Revenue (Last 6 Months)">
          {monthly.loading ? (
            <div className="h-[220px] bg-[#f0f7ff] rounded-lg animate-pulse" />
          ) : revData.length === 0 ? (
            <EmptyState title="No revenue data" description="Revenue will appear once payments are made." />
          ) : (
            <RevenueBarChart data={revData} height={220} />
          )}
        </SectionCard>

        {/* Transactions */}
        <SectionCard
          title={`Transaction History (${txTotal})`}
          action={
            <button onClick={txResult.reload} className="text-gray-400 hover:text-gray-700 transition-colors">
              <RefreshCw size={15} />
            </button>
          }
        >
          {txResult.loading ? (
            <SkeletonTable rows={8} />
          ) : txList.length === 0 ? (
            <EmptyState icon={<CreditCard size={24} />} title="No transactions yet" />
          ) : (
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#f0f7ff]">
                    {["Company", "Amount", "Plan", "Method", "Status", "Date"].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide px-3 py-2.5 border-b border-[#e2edf7]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {txList.map((tx: Transaction) => (
                    <tr key={tx._id} className="border-b border-[#f0f5fb] last:border-0 hover:bg-[#fafcff] transition-colors">
                      <td className="px-3 py-3 font-medium text-gray-900">
                        {tx.employer?.companyName || "—"}
                      </td>
                      <td className="px-3 py-3 font-semibold text-emerald-700">
                        ₹{Number(tx.amount).toLocaleString()}
                      </td>
                      <td className="px-3 py-3 capitalize text-gray-600">{tx.plan || "—"}</td>
                      <td className="px-3 py-3 text-gray-500 capitalize">{tx.method || "—"}</td>
                      <td className="px-3 py-3">{txStatusBadge(tx.status)}</td>
                      <td className="px-3 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {txPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#e2edf7]">
              <span className="text-xs text-gray-400">Page {txPage} of {txPages} · {txTotal} total</span>
              <div className="flex items-center gap-1">
                <button
                  disabled={txPage === 1}
                  onClick={() => setTxPage(p => p - 1)}
                  className="p-1.5 rounded-lg border border-[#e2edf7] text-gray-500 hover:bg-[#f0f7ff] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(5, txPages) }, (_, i) => {
                  const pg = Math.max(1, Math.min(txPage - 2, txPages - 4)) + i;
                  if (pg < 1 || pg > txPages) return null;
                  return (
                    <button
                      key={pg}
                      onClick={() => setTxPage(pg)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        pg === txPage ? "bg-[#00418d] text-white" : "border border-[#e2edf7] text-gray-600 hover:bg-[#f0f7ff]"
                      }`}
                    >
                      {pg}
                    </button>
                  );
                })}
                <button
                  disabled={txPage === txPages}
                  onClick={() => setTxPage(p => p + 1)}
                  className="p-1.5 rounded-lg border border-[#e2edf7] text-gray-500 hover:bg-[#f0f7ff] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </AdminLayout>
  );
}
