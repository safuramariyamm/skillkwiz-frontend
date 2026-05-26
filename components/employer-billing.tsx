"use client";

import { useState, useEffect, useCallback } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { apiCall } from "@/context/AuthContext";
import { paymentApi } from "@/lib/payment";
import {
  PaymentMethodSelector,
  PaymentMethod,
} from "@/app/employer/payment/PaymentMethodSelector";
import {
  CreditCard, TrendingUp, TrendingDown, ShoppingCart,
  CheckCircle2, AlertTriangle, Receipt, Loader2, X,
  ChevronRight,
} from "lucide-react";

const PLAN_CONFIG: Record<string, { accent: string; bg: string; border: string; badge?: string; icon: string }> = {
  starter: {
    accent: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200",
    icon: "⚡",
  },
  growth: {
    accent: "text-purple-600", bg: "bg-purple-50", border: "border-purple-300",
    badge: "Most Popular", icon: "🚀",
  },
  enterprise: {
    accent: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200",
    icon: "🏢",
  },
};

export default function EmployerBilling() {
  const [plans, setPlans] = useState<Record<string, any>>({});
  const [balance, setBalance] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("phonepe");

  // Payment state
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [payStatus, setPayStatus] = useState<"idle" | "creating" | "success" | "error">("idle");
  const [payMsg, setPayMsg] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const plansRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/payments/plans`
      );
      const plansData = await plansRes.json();
      if (plansData.success) setPlans(plansData.data);

      const [balRes, histRes] = await Promise.all([
        apiCall("/payments/balance"),
        apiCall("/payments/history?limit=5"),
      ]);
      if (balRes.ok) setBalance(balRes.data.data);
      if (histRes.ok) setTransactions(histRes.data.data?.transactions || []);
    } catch (e) {
      setApiError("Could not connect to server. Make sure the backend is running.");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── PhonePe ──────────────────────────────────────────────────────────────
  const handlePhonePePay = async (planId: string) => {
    setSelectedPlan(planId);
    setPayStatus("creating");
    setPayMsg("");
    try {
      const res = await paymentApi.initiatePhonePe(planId);
      if (res.success && res.data?.redirectUrl) {
        window.location.href = res.data.redirectUrl;
      } else {
        setPayMsg("Failed to initiate PhonePe payment. Please try again.");
        setPayStatus("error");
        setSelectedPlan(null);
      }
    } catch {
      setPayMsg("Something went wrong. Please try again.");
      setPayStatus("error");
      setSelectedPlan(null);
    }
  };

  // ── PayPal ────────────────────────────────────────────────────────────────
  const handleSelectPayPalPlan = async (planId: string) => {
    setSelectedPlan(planId);
    setOrderId(null);
    setPayStatus("creating");
    setPayMsg("");

    const { ok, data } = await apiCall("/payments/create-order", {
      method: "POST",
      body: JSON.stringify({ planId }),
    });

    if (ok && data.success) {
      setOrderId(data.data.orderId);
      setPayStatus("idle");
    } else {
      setPayMsg(data.message || "Failed to create order. Please try again.");
      setPayStatus("error");
      setSelectedPlan(null);
    }
  };

  const handleCapture = async (captureOrderId: string) => {
    setPayStatus("creating");
    const { ok, data } = await apiCall("/payments/capture-order", {
      method: "POST",
      body: JSON.stringify({ orderId: captureOrderId }),
    });
    if (ok && data.success) {
      setPayMsg(data.message || "Payment successful! Credits added.");
      setPayStatus("success");
      setOrderId(null);
      setSelectedPlan(null);
      fetchAll();
    } else {
      setPayMsg(data.message || "Payment failed. Please contact support.");
      setPayStatus("error");
    }
  };

  const resetPayment = () => {
    setSelectedPlan(null);
    setOrderId(null);
    setPayStatus("idle");
    setPayMsg("");
  };

  // When switching payment method, reset selection
  const handleMethodChange = (m: PaymentMethod) => {
    setPaymentMethod(m);
    resetPayment();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#00418d]" />
        <p className="text-sm text-gray-500">Loading billing info…</p>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <p className="text-gray-700 font-medium">Backend not reachable</p>
        <p className="text-sm text-gray-400 max-w-xs">{apiError}</p>
        <button onClick={fetchAll} className="mt-2 text-sm text-[#00418d] hover:underline font-medium">
          Try again
        </button>
      </div>
    );
  }

  const creditsLeft = balance?.credits ?? 0;
  const totalPurchased = balance?.totalCreditsPurchased ?? 0;
  const creditsUsed = balance?.creditsUsed ?? 0;
  const pctUsed = totalPurchased > 0 ? Math.round((creditsUsed / totalPurchased) * 100) : 0;

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
        currency: "USD",
      }}
    >
      <div className="space-y-6">

        {/* ─── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0a1628]">Credits & Billing</h2>
            <p className="text-sm text-gray-500 mt-0.5">Purchase assessment credits for your account</p>
          </div>
          {balance?.activePlan && balance.activePlan !== "free" && (
            <span className="text-xs bg-[#00418d]/10 text-[#00418d] font-semibold px-3 py-1 rounded-full capitalize border border-[#00418d]/20">
              {balance.activePlan} plan
            </span>
          )}
        </div>

        {/* ─── Credit Stats ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Credits Left", value: creditsLeft, icon: <CreditCard className="w-4 h-4 text-[#00418d]" />, color: "text-[#00418d]", bg: "bg-blue-50" },
            { label: "Total Bought", value: totalPurchased, icon: <TrendingUp className="w-4 h-4 text-emerald-600" />, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Used", value: creditsUsed, icon: <TrendingDown className="w-4 h-4 text-orange-500" />, color: "text-orange-500", bg: "bg-orange-50" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
              <div className={`inline-flex p-1.5 rounded-lg ${s.bg} mb-2`}>{s.icon}</div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Usage bar */}
        {totalPurchased > 0 && (
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>Usage: {pctUsed}% consumed</span>
              <span>{creditsLeft} remaining</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#00418d] to-blue-400 transition-all duration-500"
                style={{ width: `${pctUsed}%` }}
              />
            </div>
          </div>
        )}

        {/* ─── Alerts ───────────────────────────────────────────────────── */}
        {creditsLeft === 0 && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-3.5 text-red-700 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span><strong>No credits left.</strong> Assessment creation is blocked. Buy a plan below to continue.</span>
          </div>
        )}
        {creditsLeft > 0 && creditsLeft <= 3 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-amber-700 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Only <strong>{creditsLeft} credit{creditsLeft !== 1 ? "s" : ""}</strong> remaining. Top up soon.</span>
          </div>
        )}

        {/* Payment status */}
        {payStatus === "success" && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3.5 text-green-700 text-sm">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{payMsg}</span>
          </div>
        )}
        {payStatus === "error" && (
          <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl p-3.5 text-red-700 text-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{payMsg}</span>
            </div>
            <button onClick={resetPayment} className="ml-2 flex-shrink-0 hover:opacity-60 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ─── Payment Method Selector ──────────────────────────────────── */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
          <PaymentMethodSelector selected={paymentMethod} onChange={handleMethodChange} />
        </div>

        {/* ─── Plans ────────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-4 h-4 text-[#00418d]" />
            <h3 className="font-semibold text-[#0a1628] text-sm uppercase tracking-wide">Buy Credits</h3>
            <span className="text-xs text-gray-400">· 1 credit = 1 candidate assessment</span>
          </div>

          {Object.keys(plans).length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-2xl">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Plans not available — check backend connection
            </div>
          ) : (
            <div className="grid gap-3">
              {Object.entries(plans).map(([planId, plan]: [string, any]) => {
                const cfg = PLAN_CONFIG[planId] || { accent: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", icon: "📦" };
                const isSelected = selectedPlan === planId;
                const price = paymentMethod === "phonepe"
                  ? `₹${plan.amountINR?.toLocaleString("en-IN") ?? plan.amount}`
                  : `$${plan.amountUSD ?? plan.amount}`;
                const perCredit = paymentMethod === "phonepe"
                  ? `₹${plan.inrPerCredit ?? "--"}/assessment`
                  : `$${plan.usdPerCredit?.toFixed(2) ?? "--"}/assessment`;

                return (
                  <div
                    key={planId}
                    className={`border-2 rounded-2xl p-5 transition-all duration-200 ${cfg.border} ${
                      isSelected ? cfg.bg + " shadow-md" : "bg-white hover:shadow-sm"
                    }`}
                  >
                    {/* Plan info row */}
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{cfg.icon}</span>
                        <span className="font-bold text-[#0a1628] text-base">{plan.name}</span>
                        {cfg.badge && (
                          <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">
                            {cfg.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`text-2xl font-black ${cfg.accent}`}>{price}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        <strong className="text-gray-700">{plan.credits} credits</strong>
                      </span>
                      <span>{perCredit}</span>
                      <span>Never expires</span>
                    </div>

                    {/* PhonePe flow */}
                    {paymentMethod === "phonepe" && (
                      <>
                        {!isSelected && (
                          <button
                            onClick={() => handlePhonePePay(planId)}
                            disabled={payStatus === "creating"}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                              planId === "growth"
                                ? "bg-[#5F259F] hover:bg-[#4a1c7a] text-white shadow-md shadow-purple-900/20"
                                : `${cfg.bg} ${cfg.accent} hover:opacity-80 border ${cfg.border}`
                            } disabled:opacity-40`}
                          >
                            {payStatus === "creating" && selectedPlan === planId ? (
                              <><Loader2 className="w-4 h-4 animate-spin" />Redirecting to PhonePe…</>
                            ) : (
                              <>
                                <span className="text-base">📱</span>
                                Pay {price} with PhonePe
                                <ChevronRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        )}
                        {isSelected && payStatus === "creating" && (
                          <div className="flex items-center justify-center gap-2 py-3 text-sm text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin text-[#5F259F]" />
                            Redirecting to PhonePe…
                          </div>
                        )}
                      </>
                    )}

                    {/* PayPal flow */}
                    {paymentMethod === "paypal" && (
                      <>
                        {!isSelected && (
                          <button
                            onClick={() => handleSelectPayPalPlan(planId)}
                            disabled={payStatus === "creating"}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                              planId === "growth"
                                ? "bg-[#00418d] hover:bg-[#003070] text-white shadow-md shadow-[#00418d]/20"
                                : `${cfg.bg} ${cfg.accent} hover:opacity-80 border ${cfg.border}`
                            } disabled:opacity-40`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Buy {plan.name} — {price}
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}

                        {isSelected && !orderId && payStatus === "creating" && (
                          <div className="flex items-center justify-center gap-2 py-3 text-sm text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin text-[#00418d]" />
                            Creating PayPal order…
                          </div>
                        )}

                        {isSelected && orderId && (
                          <div>
                            <p className="text-xs text-center text-gray-400 mb-3 font-medium">
                              Complete payment via PayPal ↓
                            </p>
                            <PayPalButtons
                              style={{ layout: "vertical", shape: "rect", label: "pay", height: 44 }}
                              createOrder={() => Promise.resolve(orderId)}
                              onApprove={async (d) => { await handleCapture(d.orderID); }}
                              onCancel={resetPayment}
                              onError={() => {
                                setPayMsg("Payment was cancelled or failed. Try again.");
                                setPayStatus("error");
                                resetPayment();
                              }}
                            />
                            <button
                              onClick={resetPayment}
                              className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
                            >
                              ← Choose different plan
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── Recent Transactions ──────────────────────────────────────── */}
        {transactions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="w-4 h-4 text-gray-400" />
              <h3 className="font-semibold text-[#0a1628] text-sm uppercase tracking-wide">Payment History</h3>
            </div>
            <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50">
              {transactions.map((t: any) => (
                <div key={t._id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0a1628] capitalize">{t.planName}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(t.createdAt).toLocaleDateString()} · {t.invoiceNumber}
                        {t.paymentGateway && (
                          <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            t.paymentGateway === "phonepe"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {t.paymentGateway === "phonepe" ? "PhonePe" : "PayPal"}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#0a1628]">
                      {t.currency === "INR" ? `₹${t.amount}` : `$${t.amount}`}
                    </p>
                    <p className="text-xs text-emerald-600 font-medium">+{t.creditsPurchased} credits</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pt-2">
          🔒 Payments secured by {paymentMethod === "phonepe" ? "PhonePe" : "PayPal"}
        </p>
      </div>
    </PayPalScriptProvider>
  );
}