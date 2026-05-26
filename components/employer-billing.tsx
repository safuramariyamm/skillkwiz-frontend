"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Receipt,
  Smartphone,
  ChevronRight,
  X,
} from "lucide-react";
import { paymentApi, Plan, Transaction } from "@/lib/payment";
import { usePlan } from "@/hooks/usePlan";
import {
  PaymentMethodSelector,
  PaymentMethod,
} from "@/app/employer/payment/PaymentMethodSelector";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PLAN_ORDER = ["starter", "growth", "enterprise"];

const PLAN_LABELS: Record<string, { color: string; label: string }> = {
  starter:    { color: "text-blue-500",   label: "Starter"    },
  growth:     { color: "text-indigo-500", label: "Growth"     },
  enterprise: { color: "text-purple-500", label: "Enterprise" },
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  failed:    <XCircle      className="w-4 h-4 text-red-400"     />,
  pending:   <Clock        className="w-4 h-4 text-amber-400"   />,
};

const GATEWAY_BADGE: Record<string, React.ReactNode> = {
  paypal: (
    <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
      <CreditCard className="w-3 h-3" /> PayPal
    </span>
  ),
  phonepe: (
    <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">
      <Smartphone className="w-3 h-3" /> PhonePe
    </span>
  ),
};

export default function EmployerBilling() {
  const { credits, subscriptionStatus, activePlan, loading: planLoading } = usePlan();

  // Plans & payment
  const [plans, setPlans]                   = useState<Record<string, Plan>>({});
  const [plansLoading, setPlansLoading]     = useState(true);
  const [paymentMethod, setPaymentMethod]   = useState<PaymentMethod>("phonepe");
  const [selectedPlan, setSelectedPlan]     = useState<string | null>(null);
  const [showPaypal, setShowPaypal]         = useState(false);
  const [paying, setPaying]                 = useState(false);
  const [payError, setPayError]             = useState<string | null>(null);

  // Transaction history
  const [transactions, setTransactions]     = useState<Transaction[]>([]);
  const [txLoading, setTxLoading]           = useState(true);
  const [total, setTotal]                   = useState(0);
  const [page, setPage]                     = useState(1);

  useEffect(() => {
    paymentApi.getPlans().then((res) => {
      if (res.success) setPlans(res.data);
    }).finally(() => setPlansLoading(false));
  }, []);

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  const fetchHistory = async (p: number) => {
    try {
      setTxLoading(true);
      const res = await paymentApi.getHistory(p, 5);
      if (res.success) {
        setTransactions(res.data.transactions);
        setTotal(res.data.pagination.total);
      }
    } finally {
      setTxLoading(false);
    }
  };

  const totalPages = Math.ceil(total / 5);

  // ── PhonePe ──────────────────────────────────────────────────────────────
  const handlePhonePePay = async () => {
    if (!selectedPlan) return;
    try {
      setPaying(true);
      setPayError(null);
      const res = await paymentApi.initiatePhonePe(selectedPlan);
      if (!res.success || !res.data.redirectUrl) {
        setPayError("Failed to initiate PhonePe payment. Please try again.");
        return;
      }
      window.location.href = res.data.redirectUrl;
    } catch {
      setPayError("Something went wrong. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  // ── PayPal capture ────────────────────────────────────────────────────────
  const handlePayPalApprove = async (data: { orderID: string }) => {
    try {
      setPaying(true);
      setPayError(null);
      const res = await paymentApi.capturePayPalOrder(data.orderID);
      if (res.success) {
        window.location.href = `/employer/payment/success?gateway=paypal&credits=${res.data.credits}&invoice=${res.data.invoiceNumber}`;
      } else {
        setPayError("Payment capture failed. Please contact support.");
      }
    } catch {
      setPayError("Something went wrong. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  const handlePayNow = () => {
    if (!selectedPlan) return;
    setPayError(null);
    if (paymentMethod === "phonepe") {
      handlePhonePePay();
    } else {
      setShowPaypal(true);
    }
  };

  const noCredits = !planLoading && credits === 0;

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        currency: "USD",
      }}
    >
      <div className="space-y-6">

        {/* ── Credit Summary ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Credits Left",  value: planLoading ? "—" : credits,                          icon: <CreditCard className="w-5 h-5 text-blue-500"   /> },
            { label: "Total Bought",  value: planLoading ? "—" : (total ?? 0),                     icon: <Zap         className="w-5 h-5 text-green-500"  /> },
            { label: "Used",          value: planLoading ? "—" : Math.max(0, (total ?? 0) - credits), icon: <Receipt     className="w-5 h-5 text-orange-400" /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <div className="flex justify-center mb-2">{icon}</div>
              <p className="text-2xl font-extrabold text-slate-800">{value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── No Credits Warning ─────────────────────────────────────────── */}
        <AnimatePresence>
          {noCredits && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-3"
            >
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>No credits left.</strong> Assessment creation is blocked. Buy a plan below to continue.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── PayPal Missing Warning ─────────────────────────────────────── */}
        <AnimatePresence>
          {payError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-3"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {payError}
              </div>
              <button onClick={() => setPayError(null)}>
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Payment Method Selector ────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-slate-600 mb-3">Select Payment Method</p>
          <PaymentMethodSelector
            selected={paymentMethod}
            onChange={(m) => {
              setPaymentMethod(m);
              setShowPaypal(false);
              setPayError(null);
            }}
          />
        </div>

        {/* ── Buy Credits ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-yellow-400" />
            <p className="text-sm font-semibold text-slate-700">BUY CREDITS</p>
            <span className="text-xs text-slate-400">· 1 credit = 1 candidate assessment</span>
          </div>

          {plansLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              {PLAN_ORDER.filter((id) => plans[id]).map((planId) => {
                const plan = plans[planId];
                const meta = PLAN_LABELS[planId];
                const isSelected = selectedPlan === planId;

                return (
                  <div
                    key={planId}
                    onClick={() => { setSelectedPlan(planId); setShowPaypal(false); setPayError(null); }}
                    className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                      isSelected
                        ? "border-blue-400 bg-blue-50/40 shadow-md"
                        : "border-slate-100 hover:border-blue-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${isSelected ? "border-blue-500 bg-blue-500" : "border-slate-300"}`} />
                        <div>
                          <p className={`font-semibold text-sm ${meta.color}`}>{plan.name}</p>
                          <p className="text-xs text-slate-400">{plan.credits} credits</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {paymentMethod === "paypal" ? (
                          <p className="font-bold text-slate-800">${plan.amountUSD} <span className="text-xs font-normal text-slate-400">USD</span></p>
                        ) : (
                          <p className="font-bold text-slate-800">₹{plan.amountINR.toLocaleString("en-IN")} <span className="text-xs font-normal text-slate-400">INR</span></p>
                        )}
                      </div>
                    </div>

                    {/* PayPal buttons inline */}
                    <AnimatePresence>
                      {isSelected && showPaypal && paymentMethod === "paypal" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 overflow-hidden"
                        >
                          <PayPalButtons
                            style={{ layout: "vertical", shape: "pill", label: "pay" }}
                            createOrder={async () => {
                              const res = await paymentApi.createPayPalOrder(planId);
                              if (!res.success) throw new Error("Failed to create order");
                              return res.data.orderId;
                            }}
                            onApprove={handlePayPalApprove}
                            onError={(err) => {
                              console.error("PayPal error:", err);
                              setPayError("PayPal encountered an error. Please try again.");
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Pay button */}
              {selectedPlan && !(showPaypal && paymentMethod === "paypal") && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handlePayNow}
                  disabled={paying}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-60 mt-2"
                >
                  {paying ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                  ) : (
                    <>
                      {paymentMethod === "phonepe" ? <Smartphone className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                      {paymentMethod === "phonepe" ? "Pay with PhonePe" : "Pay with PayPal"}
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              )}
            </div>
          )}
        </div>

        {/* ── Transaction History ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-slate-400" />
            <p className="font-semibold text-sm text-slate-700">Payment History</p>
            {total > 0 && (
              <span className="ml-auto text-xs text-slate-400">{total} transaction{total !== 1 ? "s" : ""}</span>
            )}
          </div>

          {txLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center">
              <Receipt className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No transactions yet.</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-50">
                {transactions.map((txn, i) => (
                  <motion.div
                    key={txn._id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {STATUS_ICON[txn.paymentStatus] ?? STATUS_ICON.pending}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-slate-700 truncate">{txn.planName} Plan</p>
                        {GATEWAY_BADGE[txn.paymentGateway]}
                      </div>
                      <p className="text-xs text-slate-400">
                        {new Date(txn.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {txn.invoiceNumber && ` · ${txn.invoiceNumber}`}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-800">
                        {txn.currency === "INR" ? "₹" : "$"}{txn.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400">+{txn.creditsPurchased} credits</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="text-sm text-slate-500 disabled:opacity-30 hover:text-slate-800 transition-colors"
                  >
                    ← Previous
                  </button>
                  <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
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
        </div>

      </div>
    </PayPalScriptProvider>
  );
}