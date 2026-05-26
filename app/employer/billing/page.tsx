"use client";

// app/employer/billing/page.tsx
// Billing history page - shows PayPal and PhonePe transactions

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Receipt,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { paymentApi, Transaction } from "@/lib/payment";
import { usePlan } from "@/hooks/usePlan";

const GATEWAY_BADGE: Record<string, React.ReactNode> = {
  paypal: (
    <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
      <CreditCard className="w-3 h-3" />
      PayPal
    </span>
  ),
  phonepe: (
    <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">
      <Smartphone className="w-3 h-3" />
      PhonePe
    </span>
  ),
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  failed: <XCircle className="w-4 h-4 text-red-400" />,
  pending: <Clock className="w-4 h-4 text-amber-400" />,
};

export default function BillingPage() {
  const { credits, subscriptionStatus, activePlan, loading: planLoading } = usePlan();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchHistory = async (p: number) => {
    try {
      setLoading(true);
      const res = await paymentApi.getHistory(p, 10);
      if (res.success) {
        setTransactions(res.data.transactions);
        setTotal(res.data.pagination.total);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-extrabold text-slate-800 mb-1">
            Billing & Credits
          </h1>
          <p className="text-slate-500 text-sm">
            Manage your plan, credits, and payment history.
          </p>
        </motion.div>

        {/* Credit summary card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-xl mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm mb-1">Credits Remaining</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold">
                  {planLoading ? "—" : credits}
                </span>
                <Zap className="w-5 h-5 text-yellow-300" />
              </div>
              <p className="text-blue-200 text-xs mt-1 capitalize">
                {activePlan} Plan ·{" "}
                <span
                  className={
                    subscriptionStatus === "active"
                      ? "text-emerald-300"
                      : "text-red-300"
                  }
                >
                  {subscriptionStatus}
                </span>
              </p>
            </div>
            <a
              href="/employer/pricing"
              className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl transition-colors"
            >
              Buy Credits
            </a>
          </div>
        </motion.div>

        {/* Transaction table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <Receipt className="w-5 h-5 text-slate-400" />
            <h2 className="font-semibold text-slate-700">Payment History</h2>
            {total > 0 && (
              <span className="ml-auto text-xs text-slate-400">
                {total} transaction{total !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              Loading…
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-16 text-center">
              <Receipt className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No transactions yet.</p>
              <a
                href="/employer/pricing"
                className="mt-3 inline-block text-blue-500 text-sm font-medium hover:underline"
              >
                Purchase your first plan →
              </a>
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-50">
                {transactions.map((txn, i) => (
                  <motion.div
                    key={txn._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {STATUS_ICON[txn.paymentStatus] || STATUS_ICON.pending}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-slate-700 truncate">
                          {txn.planName} Plan
                        </p>
                        {GATEWAY_BADGE[txn.paymentGateway]}
                      </div>
                      <p className="text-xs text-slate-400">
                        {new Date(txn.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        {txn.invoiceNumber && ` · ${txn.invoiceNumber}`}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-800">
                        {txn.currency === "INR" ? "₹" : "$"}
                        {txn.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400">
                        +{txn.creditsPurchased} credits
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="text-sm text-slate-500 disabled:opacity-30 hover:text-slate-800 transition-colors"
                  >
                    ← Previous
                  </button>
                  <span className="text-xs text-slate-400">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="text-sm text-slate-500 disabled:opacity-30 hover:text-slate-800 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}