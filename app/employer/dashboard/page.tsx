"use client";
import { useState, useEffect } from "react";
import { useCredits } from "@/hooks/useCredits";
import { paymentAPI } from "@/lib/payment";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  CreditCard, TrendingUp, AlertTriangle, ShoppingCart,
  Zap, Activity, CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function EmployerDashboard() {
  const { balance, loading } = useCredits();
  const [history, setHistory] = useState<any>(null);

  useEffect(() => {
    paymentAPI.getHistory(1).then((res) => res.success && setHistory(res.data));
  }, []);

  // Build monthly usage chart from ledger
  const chartData = (() => {
    if (!history?.ledger) return [];
    const months: Record<string, { month: string; used: number; purchased: number }> = {};
    history.ledger.forEach((entry: any) => {
      const month = new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      if (!months[month]) months[month] = { month, used: 0, purchased: 0 };
      if (entry.type === "debit") months[month].used += entry.amount;
      else months[month].purchased += entry.amount;
    });
    return Object.values(months).slice(-6);
  })();

  const creditsPct = balance
    ? Math.round((balance.creditsUsed / Math.max(balance.totalCreditsPurchased, 1)) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Your assessment credits overview</p>
          </div>
          <Link
            href="/employer/pricing"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" /> Buy Credits
          </Link>
        </div>

        {/* Low credit warning */}
        {balance && balance.credits <= 3 && balance.credits > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <span className="text-amber-800 text-sm font-medium">
              Only {balance.credits} credit{balance.credits !== 1 ? "s" : ""} remaining.{" "}
              <Link href="/employer/pricing" className="underline font-semibold">Top up now →</Link>
            </span>
          </div>
        )}
        {balance?.credits === 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-800 text-sm font-medium">
              No credits remaining. Assessment creation is blocked.{" "}
              <Link href="/employer/pricing" className="underline font-semibold">Buy credits →</Link>
            </span>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Credits Remaining",
              value: balance?.credits ?? 0,
              icon: <CreditCard className="w-5 h-5 text-blue-500" />,
              bg: "bg-blue-50",
              sub: balance?.activePlan ? `Plan: ${balance.activePlan}` : "No plan",
            },
            {
              label: "Credits Used",
              value: balance?.creditsUsed ?? 0,
              icon: <Activity className="w-5 h-5 text-orange-500" />,
              bg: "bg-orange-50",
              sub: "Assessments run",
            },
            {
              label: "Total Purchased",
              value: balance?.totalCreditsPurchased ?? 0,
              icon: <TrendingUp className="w-5 h-5 text-green-500" />,
              bg: "bg-green-50",
              sub: "All time",
            },
            {
              label: "Usage Rate",
              value: `${creditsPct}%`,
              icon: <Zap className="w-5 h-5 text-purple-500" />,
              bg: "bg-purple-50",
              sub: "Credits consumed",
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`inline-flex p-2 rounded-lg ${stat.bg} mb-3`}>{stat.icon}</div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-700 text-sm font-medium">{stat.label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Chart + Recent Payments */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Monthly Usage Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-6">Monthly Credit Activity</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: 12 }}
                  />
                  <Bar dataKey="purchased" fill="#3b82f6" name="Purchased" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="used" fill="#f97316" name="Used" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">
                No activity yet
              </div>
            )}
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900">Recent Payments</h2>
              <Link href="/employer/billing" className="text-blue-600 text-sm hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {history?.transactions?.slice(0, 5).map((t: any) => (
                <div key={t._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 capitalize">{t.planName}</p>
                      <p className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">${t.amount}</p>
                    <p className="text-xs text-blue-600">+{t.creditsPurchased} credits</p>
                  </div>
                </div>
              ))}
              {!history?.transactions?.length && (
                <p className="text-gray-400 text-sm text-center py-6">No payments yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
