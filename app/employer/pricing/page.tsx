"use client";

// app/employer/pricing/page.tsx
// Full pricing page — supports PayPal and PhonePe

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Check,
  Zap,
  Star,
  Crown,
  Sparkles,
  ChevronRight,
  Loader2,
  Shield,
} from "lucide-react";
import { paymentApi, Plan } from "@/lib/payment";
import {
  PaymentMethodSelector,
  PaymentMethod,
} from "@/app/employer/payment/PaymentMethodSelector";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// ─── Plan Meta ────────────────────────────────────────────────────────────────
const PLAN_META: Record<
  string,
  {
    icon: React.ReactNode;
    color: string;
    gradient: string;
    features: string[];
    popular?: boolean;
  }
> = {
  starter: {
    icon: <Zap className="w-5 h-5" />,
    color: "text-blue-500",
    gradient: "from-blue-400 to-cyan-400",
    features: [
      "10 assessment credits",
      "Add up to 10 candidates",
      "Create assessment slots",
      "Generate login credentials",
      "Email support",
    ],
  },
  growth: {
    icon: <Star className="w-5 h-5" />,
    color: "text-indigo-500",
    gradient: "from-indigo-500 to-purple-500",
    popular: true,
    features: [
      "30 assessment credits",
      "Add up to 30 candidates",
      "Priority slot creation",
      "Bulk credential generation",
      "Priority email support",
      "Analytics dashboard",
    ],
  },
  enterprise: {
    icon: <Crown className="w-5 h-5" />,
    color: "text-purple-500",
    gradient: "from-purple-500 to-pink-500",
    features: [
      "100 assessment credits",
      "Unlimited candidates",
      "Dedicated slot management",
      "Custom credential branding",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom integrations",
    ],
  },
};

// ─── PlanCard ─────────────────────────────────────────────────────────────────
const PlanCard: React.FC<{
  planId: string;
  plan: Plan;
  selected: boolean;
  paymentMethod: PaymentMethod;
  onSelect: () => void;
  onPay: () => void;
  paying: boolean;
  showPaypal: boolean;
  onPaypalApprove: (data: { orderID: string }) => Promise<void>;
}> = ({
  planId,
  plan,
  selected,
  paymentMethod,
  onSelect,
  onPay,
  paying,
  showPaypal,
  onPaypalApprove,
}) => {
  const meta = PLAN_META[planId];
  if (!meta) return null;

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      onClick={onSelect}
      className={`relative cursor-pointer rounded-3xl border-2 bg-white transition-all duration-300 overflow-hidden ${
        selected
          ? "border-blue-400 shadow-2xl shadow-blue-100"
          : "border-slate-100 shadow-md hover:shadow-xl hover:border-blue-200"
      }`}
    >
      {/* Popular badge */}
      {meta.popular && (
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${meta.gradient}`}
        />
      )}
      {meta.popular && (
        <div className="absolute -top-1 right-5">
          <span
            className={`text-[10px] font-bold px-3 py-1 rounded-b-lg bg-gradient-to-r ${meta.gradient} text-white shadow`}
          >
            Most Popular
          </span>
        </div>
      )}

      <div className="p-6">
        {/* Plan header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-white shadow-md`}
          >
            {meta.icon}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">{plan.name}</h3>
            <p className="text-xs text-slate-500">
              {plan.credits} assessment credits
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-5">
          {paymentMethod === "paypal" ? (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-800">
                ${plan.amountUSD}
              </span>
              <span className="text-sm text-slate-400">USD</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-800">
                ₹{plan.amountINR.toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-slate-400">INR</span>
            </div>
          )}
          <p className="text-xs text-slate-400 mt-0.5">
            {paymentMethod === "paypal"
              ? `$${plan.usdPerCredit} per credit`
              : `₹${plan.inrPerCredit} per credit`}
          </p>
        </div>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {meta.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
              <Check
                className={`w-4 h-4 flex-shrink-0 ${meta.color}`}
              />
              {f}
            </li>
          ))}
        </ul>

        {/* Pay button / PayPal buttons */}
        <AnimatePresence mode="wait">
          {selected && showPaypal && paymentMethod === "paypal" ? (
            <motion.div
              key="paypal-buttons"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-2"
            >
              <PayPalButtons
                style={{ layout: "vertical", shape: "pill", label: "pay" }}
                createOrder={async () => {
                  const res = await paymentApi.createPayPalOrder(planId);
                  if (!res.success) throw new Error("Failed to create order");
                  return res.data.orderId;
                }}
                onApprove={onPaypalApprove}
                onError={(err) =>
                  console.error("PayPal error:", err)
                }
              />
            </motion.div>
          ) : (
            <motion.button
              key="pay-button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                if (!selected) {
                  onSelect();
                } else {
                  onPay();
                }
              }}
              disabled={paying}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all ${
                selected
                  ? `bg-gradient-to-r ${meta.gradient} text-white shadow-lg hover:shadow-xl`
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              } disabled:opacity-60`}
            >
              {paying && selected ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {selected
                    ? paymentMethod === "phonepe"
                      ? "Pay with PhonePe"
                      : "Pay with PayPal"
                    : "Select Plan"}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Record<string, Plan>>({});
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("phonepe");
  const [paying, setPaying] = useState(false);
  const [showPaypalButtons, setShowPaypalButtons] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    paymentApi.getPlans().then((res) => {
      if (res.success) setPlans(res.data);
    });
  }, []);

  // ─── PhonePe Payment ────────────────────────────────────────────────────────
  const handlePhonePePay = async () => {
    if (!selectedPlan) return;
    try {
      setPaying(true);
      setError(null);
      const res = await paymentApi.initiatePhonePe(selectedPlan);
      if (!res.success || !res.data.redirectUrl) {
        setError("Failed to initiate PhonePe payment. Please try again.");
        return;
      }
      // Redirect to PhonePe payment page
      window.location.href = res.data.redirectUrl;
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  // ─── PayPal Capture ─────────────────────────────────────────────────────────
  const handlePayPalApprove = async (data: { orderID: string }) => {
    try {
      setPaying(true);
      setError(null);
      const res = await paymentApi.capturePayPalOrder(data.orderID);
      if (res.success) {
        router.push(
          `/employer/payment/success?gateway=paypal&credits=${res.data.credits}&invoice=${res.data.invoiceNumber}`
        );
      } else {
        setError("Payment capture failed. Please contact support.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  const handleSelectAndPay = (planId: string) => {
    if (selectedPlan === planId) {
      // Already selected — trigger pay
      if (paymentMethod === "phonepe") {
        handlePhonePePay();
      } else {
        setShowPaypalButtons(true);
      }
    } else {
      setSelectedPlan(planId);
      setShowPaypalButtons(false);
    }
  };

  const handlePayNow = () => {
    if (paymentMethod === "phonepe") {
      handlePhonePePay();
    } else {
      setShowPaypalButtons(true);
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        currency: "USD",
        intent: "capture",
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Simple, transparent pricing
            </div>
            <h1 className="text-4xl font-extrabold text-slate-800 mb-3">
              Choose your plan
            </h1>
            <p className="text-slate-500 text-base max-w-lg mx-auto">
              Purchase credits once and use them at your own pace. No
              subscriptions, no hidden fees.
            </p>
          </motion.div>

          {/* Payment Method Selector */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-8 max-w-lg mx-auto"
          >
            <PaymentMethodSelector
              selected={paymentMethod}
              onChange={(m) => {
                setPaymentMethod(m);
                setShowPaypalButtons(false);
              }}
            />
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-3 mb-6 max-w-lg mx-auto text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {Object.entries(plans).map(([planId, plan], i) => (
              <motion.div
                key={planId}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
              >
                <PlanCard
                  planId={planId}
                  plan={plan}
                  selected={selectedPlan === planId}
                  paymentMethod={paymentMethod}
                  onSelect={() => setSelectedPlan(planId)}
                  onPay={handlePayNow}
                  paying={paying}
                  showPaypal={showPaypalButtons}
                  onPaypalApprove={handlePayPalApprove}
                />
              </motion.div>
            ))}
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6 mt-10 text-xs text-slate-400"
          >
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-green-400" />
              Secure payments
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-blue-400" />
              No recurring charges
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400" />
              Credits never expire
            </span>
          </motion.div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}