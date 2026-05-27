// app/dashboard/employer/billing/page.tsx
"use client";

import { useState } from "react";
import { Check, CreditCard, Download } from "lucide-react";
import {
  PageHeader, Btn, SectionCard, DataTable, Badge, SkeletonCard,
} from "@/components/dashboard/shared";
import { usePlans, usePaymentHistory, useCredits } from "@/hooks";
import { paymentsAPI } from "@/services/api";

// ─── Plan data (fallback if API plans endpoint is unavailable) ────────────────

const FALLBACK_PLANS = [
  {
    id:"starter", name:"Starter", price:99,
    credits:20, perCredit:"$4.95",
    features:["20 assessments","Email support","Basic analytics","CSV exports"],
    featured:false,
  },
  {
    id:"growth", name:"Growth", price:299,
    credits:60, perCredit:"$4.98",
    features:["60 assessments","Priority support","Full analytics","CSV & PDF exports","Slot manager"],
    featured:true,
  },
  {
    id:"enterprise", name:"Enterprise", price:599,
    credits:150, perCredit:"$3.99",
    features:["150 assessments","Dedicated support","Advanced analytics","API access","White-label option","Custom slots"],
    featured:false,
  },
];

type PaymentStatus = "idle" | "loading" | "success" | "error";

export default function EmployerBillingPage() {
  const { data: balance } = useCredits();
  const { data: history, loading: histLoading } = usePaymentHistory();
  const { plans } = usePlans();

  const displayPlans = Object.keys(plans).length > 0
    ? Object.entries(plans).map(([id, p]: any) => ({ id, ...p }))
    : FALLBACK_PLANS;

  const [selectedPlan, setSelectedPlan] = useState<typeof FALLBACK_PLANS[0] | null>(null);
  const [payStatus, setPayStatus] = useState<PaymentStatus>("idle");
  const [payError, setPayError] = useState("");

  const handleSelectPlan = (plan: typeof FALLBACK_PLANS[0]) => {
    setSelectedPlan(plan);
    setPayStatus("idle");
    setPayError("");
    // Scroll to payment section
    setTimeout(() => {
      document.getElementById("payment-section")?.scrollIntoView({ behavior:"smooth" });
    }, 100);
  };

  const handlePayPal = async () => {
    if (!selectedPlan) return;
    setPayStatus("loading");
    setPayError("");

    const orderRes = await paymentsAPI.createOrder(selectedPlan.id);
    if (!orderRes.ok) {
      setPayStatus("error");
      setPayError(orderRes.message || "Failed to create order");
      return;
    }

    // In production: open the PayPal approval URL from orderRes.data.approvalUrl
    // For demo we simulate a capture:
    const captureRes = await paymentsAPI.captureOrder(orderRes.data?.orderId ?? "demo");
    if (captureRes.ok) {
      setPayStatus("success");
    } else {
      setPayStatus("error");
      setPayError(captureRes.message || "Payment failed");
    }
  };

  const txColumns = [
    { key:"date", header:"Date", render:(r:any) => <span className="text-gray-400">{r.date}</span> },
    { key:"plan", header:"Plan" },
    { key:"amount", header:"Amount", render:(r:any) => <span className="font-semibold">${r.amount}</span> },
    { key:"credits", header:"Credits", render:(r:any) => <span className="text-[#00418d] font-medium">+{r.credits}</span> },
    {
      key:"status", header:"Status",
      render:(r:any) => <Badge label={r.status} variant={r.status === "Paid" ? "green" : "red"} />,
    },
    {
      key:"invoice", header:"",
      render:() => <Btn size="sm" icon={<Download size={11} />}>Invoice</Btn>,
    },
  ];

  const SEED_HISTORY = [
    { _id:"h1", date:"May 26", plan:"Growth",     amount:299, credits:60, status:"Paid" },
    { _id:"h2", date:"Apr 26", plan:"Growth",     amount:299, credits:60, status:"Paid" },
    { _id:"h3", date:"Mar 26", plan:"Starter",    amount:99,  credits:20, status:"Paid" },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Billing & Plans"
        subtitle={`Current: ${balance?.plan ?? "Growth"} Plan — ${(balance?.credits ?? 100) - (balance?.creditsUsed ?? 52)} credits remaining`}
      />

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl border p-5 cursor-pointer transition-all
              ${selectedPlan?.id === plan.id
                ? "border-[#00418d] border-2 bg-[#f0f7ff]"
                : plan.featured
                  ? "border-[#00418d] bg-white shadow-md shadow-[#00418d]/10"
                  : "border-[#e2edf7] bg-white hover:border-[#00418d]/40 hover:shadow-sm"
              }`}
            onClick={() => handleSelectPlan(plan as any)}
          >
            {plan.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#00418d] text-white text-[11px] font-semibold
                  px-3 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-800">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold text-[#00418d]">${plan.price}</span>
                <span className="text-xs text-gray-400">/ cycle</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{plan.credits} assessment credits</p>
              {plan.perCredit && (
                <p className="text-xs text-gray-400">{plan.perCredit} per credit</p>
              )}
            </div>

            <ul className="space-y-2 mb-5">
              {(plan.features ?? []).map((f:string) => (
                <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                  <Check size={13} className="text-emerald-600 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Btn
              variant={selectedPlan?.id === plan.id ? "primary" : plan.featured ? "primary" : "ghost"}
              className="w-full justify-center"
              onClick={() => handleSelectPlan(plan as any)}
            >
              {selectedPlan?.id === plan.id ? "✓ Selected" : `Select ${plan.name}`}
            </Btn>
          </div>
        ))}
      </div>

      {/* PayPal payment section */}
      {selectedPlan && (
        <div id="payment-section">
          <SectionCard title="Complete Your Purchase">
            <div className="max-w-sm mx-auto text-center space-y-4">
              {/* Order summary */}
              <div className="bg-[#f0f7ff] border border-[#daeeff] rounded-xl p-4 text-left">
                <p className="text-xs text-gray-500 mb-2 font-medium">Order Summary</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{selectedPlan.name} Plan</span>
                  <span className="font-semibold">${selectedPlan.price}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{selectedPlan.credits} assessment credits</span>
                </div>
              </div>

              {/* PayPal button */}
              {payStatus === "success" ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <Check size={24} className="text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-emerald-700">Payment Successful!</p>
                  <p className="text-xs text-emerald-600 mt-1">
                    {selectedPlan.credits} credits added to your account.
                  </p>
                </div>
              ) : (
                <>
                  <button
                    onClick={handlePayPal}
                    disabled={payStatus === "loading"}
                    className="w-full flex items-center justify-center gap-2 bg-[#ffc439]
                      hover:bg-[#f0b429] text-[#003087] font-semibold text-sm
                      px-6 py-3 rounded-xl transition-colors disabled:opacity-60"
                  >
                    {payStatus === "loading" ? (
                      "Processing…"
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M7 17H4L5.5 8H9C11 8 12.5 6.5 12.5 4.5C12.5 3 11.5 2 10 2H5.5L3 18"
                            stroke="#003087" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9.5 11H6.5L7.5 5H11C13 5 14.5 3.5 14.5 1.5"
                            stroke="#009cde" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Pay ${selectedPlan.price} with PayPal
                      </>
                    )}
                  </button>
                  {payStatus === "error" && (
                    <p className="text-xs text-[#f73e5d]">{payError}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    <CreditCard size={11} className="inline mr-1" />
                    Secure checkout. No card stored. Powered by PayPal.
                  </p>
                </>
              )}
            </div>
          </SectionCard>
        </div>
      )}

      {/* Payment History */}
      <SectionCard title="Payment History">
        <DataTable
          columns={txColumns}
          rows={history?.transactions ?? []}
          keyExtractor={(r) => r._id}
          emptyText="No payment history yet."
        />
      </SectionCard>
    </div>
  );
}
