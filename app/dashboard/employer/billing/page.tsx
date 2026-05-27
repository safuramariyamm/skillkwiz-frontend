// app/dashboard/employer/billing/page.tsx
// Full billing page — PayPal + PhonePe + real transaction history
"use client";

import { useState, useEffect } from "react";
import { Check, CreditCard, Download, Zap, Star, Crown, Sparkles, Shield, Loader2 } from "lucide-react";
import {
  PageHeader, Btn, SectionCard, DataTable, Badge, SkeletonCard,
} from "@/components/dashboard/shared";
import { usePlans, usePaymentHistory, useCredits } from "@/hooks";
import { paymentApi } from "@/lib/payment";
import {
  PaymentMethodSelector,
  PaymentMethod,
} from "@/app/employer/payment/PaymentMethodSelector";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// ─── Plan icon/gradient meta ──────────────────────────────────────────────────
const PLAN_META: Record<string, { icon: React.ReactNode; gradient: string; popular?: boolean }> = {
  starter: {
    icon: <Zap size={16} />,
    gradient: "from-blue-400 to-cyan-400",
  },
  growth: {
    icon: <Star size={16} />,
    gradient: "from-indigo-500 to-purple-500",
    popular: true,
  },
  enterprise: {
    icon: <Crown size={16} />,
    gradient: "from-purple-500 to-pink-500",
  },
};

// ─── Fallback plans if API is unavailable ────────────────────────────────────
const FALLBACK_PLANS = {
  starter: {
    name: "Starter", credits: 10, amountUSD: 49, amountINR: 4099,
    usdPerCredit: 4.9, inrPerCredit: 409,
  },
  growth: {
    name: "Growth", credits: 30, amountUSD: 129, amountINR: 10799,
    usdPerCredit: 4.3, inrPerCredit: 359,
  },
  enterprise: {
    name: "Enterprise", credits: 100, amountUSD: 399, amountINR: 33299,
    usdPerCredit: 3.99, inrPerCredit: 332,
  },
};

export default function EmployerBillingPage() {
  const { data: balance } = useCredits();
  const { data: history, loading: histLoading } = usePaymentHistory();
  const { plans: rawPlans, loading: plansLoading } = usePlans();

  const plans = Object.keys(rawPlans).length > 0 ? rawPlans : FALLBACK_PLANS;

  const [selectedPlan, setSelectedPlan]       = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod]     = useState<PaymentMethod>("phonepe");
  const [showPaypalBtns, setShowPaypalBtns]   = useState(false);
  const [paying, setPaying]                   = useState(false);
  const [error, setError]                     = useState("");
  const [success, setSuccess]                 = useState("");

  // ─── PhonePe ─────────────────────────────────────────────────────────────────
  const handlePhonePe = async () => {
    if (!selectedPlan) return;
    setPaying(true);
    setError("");
    try {
      const res = await paymentApi.initiatePhonePe(selectedPlan);
      if (!res.success || !res.data?.redirectUrl) {
        setError("Failed to initiate PhonePe payment. Please try again.");
        return;
      }
      window.location.href = res.data.redirectUrl;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  // ─── PayPal capture ───────────────────────────────────────────────────────────
  const handlePayPalApprove = async (data: { orderID: string }) => {
    setPaying(true);
    setError("");
    try {
      const res = await paymentApi.capturePayPalOrder(data.orderID);
      if (res.success) {
        setSuccess(`Payment successful! ${res.data.credits} credits added to your account.`);
        setSelectedPlan(null);
        setShowPaypalBtns(false);
      } else {
        setError("Payment capture failed. Please contact support.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaypalBtns(false);
    setError("");
    setSuccess("");
    setTimeout(() => {
      document.getElementById("payment-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handlePayNow = () => {
    if (!selectedPlan) return;
    if (paymentMethod === "phonepe") {
      handlePhonePe();
    } else {
      setShowPaypalBtns(true);
    }
  };

  // ─── Transaction table columns ────────────────────────────────────────────────
  const txColumns = [
    {
      key: "date", header: "Date",
      render: (r: any) => (
        <span className="text-gray-500">
          {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
    {
      key: "plan", header: "Plan",
      render: (r: any) => <span className="font-medium capitalize">{r.planName}</span>,
    },
    {
      key: "gateway", header: "Method",
      render: (r: any) => (
        <span className="text-xs text-gray-500 uppercase tracking-wide">{r.paymentGateway}</span>
      ),
    },
    {
      key: "amount", header: "Amount",
      render: (r: any) => (
        <span className="font-semibold">
          {r.currency === "INR" ? "₹" : "$"}{r.amount}
        </span>
      ),
    },
    {
      key: "credits", header: "Credits",
      render: (r: any) => (
        <span className="text-[#00418d] font-medium">+{r.creditsPurchased}</span>
      ),
    },
    {
      key: "status", header: "Status",
      render: (r: any) => (
        <Badge
          label={r.paymentStatus === "completed" ? "Paid" : r.paymentStatus}
          variant={r.paymentStatus === "completed" ? "green" : "gray"}
        />
      ),
    },
    {
      key: "invoice", header: "",
      render: (r: any) =>
        r.invoiceNumber ? (
          <Btn size="sm" icon={<Download size={11} />}>Invoice</Btn>
        ) : null,
    },
  ];

  const credits     = balance?.credits ?? 0;
  const creditsUsed = balance?.creditsUsed ?? 0;
  const planName    = balance?.activePlan ?? balance?.subscriptionStatus ?? "No active plan";

  // Safely get transactions from the hook response
  const transactions = (history as any)?.transactions ?? [];

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        currency: "USD",
        intent: "capture",
      }}
    >
      <div className="space-y-5">
        <PageHeader
          title="Billing & Plans"
          subtitle={`Current: ${planName} — ${credits} credits remaining`}
        />

        {/* Current balance summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Credits Remaining", value: credits,     color: "text-[#00418d]" },
            { label: "Credits Used",       value: creditsUsed, color: "text-amber-600" },
            { label: "Active Plan",        value: planName,    color: "text-emerald-700" },
            { label: "Total Purchased",    value: (credits + creditsUsed), color: "text-gray-700" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-[#e2edf7] rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Payment method selector */}
        <SectionCard title="Payment Method">
          <div className="max-w-lg">
            <PaymentMethodSelector
              selected={paymentMethod}
              onChange={(m) => {
                setPaymentMethod(m);
                setShowPaypalBtns(false);
              }}
            />
          </div>
        </SectionCard>

        {/* Plan cards */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Choose a Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(plans).map(([planId, plan]: [string, any]) => {
              const meta = PLAN_META[planId] ?? { icon: <Zap size={16} />, gradient: "from-blue-400 to-cyan-400" };
              const price = paymentMethod === "phonepe"
                ? `₹${plan.amountINR?.toLocaleString("en-IN") ?? plan.price ?? 0}`
                : `$${plan.amountUSD ?? plan.price ?? 0}`;
              const perCredit = paymentMethod === "phonepe"
                ? `₹${plan.inrPerCredit ?? ""} / credit`
                : `$${plan.usdPerCredit ?? plan.perCredit ?? ""} / credit`;

              return (
                <div
                  key={planId}
                  onClick={() => handleSelectPlan(planId)}
                  className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all
                    ${selectedPlan === planId
                      ? "border-[#00418d] bg-[#f0f7ff] shadow-md"
                      : meta.popular
                        ? "border-[#00418d]/40 bg-white shadow-sm hover:shadow-md"
                        : "border-[#e2edf7] bg-white hover:border-[#00418d]/30 hover:shadow-sm"
                    }`}
                >
                  {meta.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-[#00418d] text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-white shadow`}>
                      {meta.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">{plan.name}</h3>
                      <p className="text-xs text-gray-400">{plan.credits} credits</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-extrabold text-[#00418d]">{price}</span>
                    <p className="text-xs text-gray-400 mt-0.5">{perCredit}</p>
                  </div>

                  <Btn
                    variant={selectedPlan === planId ? "primary" : meta.popular ? "primary" : "ghost"}
                    className="w-full justify-center"
                    onClick={(e) => { e.stopPropagation(); handleSelectPlan(planId); }}
                  >
                    {selectedPlan === planId ? "✓ Selected" : `Select ${plan.name}`}
                  </Btn>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment section */}
        {selectedPlan && (
          <div id="payment-section">
            <SectionCard title="Complete Your Purchase">
              <div className="max-w-sm mx-auto space-y-4">
                {/* Order summary */}
                {(() => {
                  const p = plans[selectedPlan] as any;
                  const price = paymentMethod === "phonepe"
                    ? `₹${p?.amountINR?.toLocaleString("en-IN") ?? p?.price ?? 0}`
                    : `$${p?.amountUSD ?? p?.price ?? 0}`;
                  return (
                    <div className="bg-[#f0f7ff] border border-[#daeeff] rounded-xl p-4">
                      <p className="text-xs text-gray-500 font-medium mb-2">Order Summary</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">{p?.name} Plan</span>
                        <span className="font-bold text-[#00418d]">{price}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{p?.credits} assessment credits</span>
                        <span className="capitalize">{paymentMethod}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Success */}
                {success && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                    <Check size={22} className="text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-emerald-700">Payment Successful!</p>
                    <p className="text-xs text-emerald-600 mt-1">{success}</p>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                {/* PayPal buttons */}
                {!success && paymentMethod === "paypal" && showPaypalBtns ? (
                  <PayPalButtons
                    style={{ layout: "vertical", shape: "pill", label: "pay" }}
                    createOrder={async () => {
                      const res = await paymentApi.createPayPalOrder(selectedPlan);
                      if (!res.success) throw new Error("Failed to create order");
                      return res.data.orderId;
                    }}
                    onApprove={handlePayPalApprove}
                    onError={(err) => {
                      console.error("PayPal error:", err);
                      setError("PayPal encountered an error. Please try again.");
                    }}
                  />
                ) : !success ? (
                  <Btn
                    variant="primary"
                    className="w-full justify-center"
                    onClick={handlePayNow}
                    disabled={paying}
                    icon={paying ? <Loader2 size={14} className="animate-spin" /> : undefined}
                  >
                    {paying ? "Processing…" : paymentMethod === "phonepe" ? "Pay with PhonePe" : "Pay with PayPal"}
                  </Btn>
                ) : null}

                <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1.5">
                  <Shield size={11} />
                  Secure checkout. Credits never expire.
                </p>
              </div>
            </SectionCard>
          </div>
        )}

        {/* Payment history */}
        <SectionCard title="Payment History">
          {histLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No payment history yet.</p>
          ) : (
            <DataTable
              columns={txColumns}
              rows={transactions}
              keyExtractor={(r: any) => r._id}
            />
          )}
        </SectionCard>
      </div>
    </PayPalScriptProvider>
  );
}
