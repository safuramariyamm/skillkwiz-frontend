"use client";

// components/payment/CreditWidget.tsx
// Compact credit display for dashboard header or sidebar.
// Shows credits remaining, plan badge, upgrade link.

import React from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePlan } from "@/hooks/usePlan";

interface CreditWidgetProps {
  compact?: boolean; // compact = icon + number only (for header)
}

export const CreditWidget: React.FC<CreditWidgetProps> = ({
  compact = false,
}) => {
  const { credits, subscriptionStatus, activePlan, loading, hasActivePlan } =
    usePlan();
  const router = useRouter();

  if (loading) {
    return (
      <div className="w-20 h-8 bg-slate-100 rounded-xl animate-pulse" />
    );
  }

  if (compact) {
    return (
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => router.push("/employer/billing")}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
          hasActivePlan
            ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
            : "bg-orange-50 text-orange-600 hover:bg-orange-100"
        }`}
        title="View billing"
      >
        <Zap className="w-3.5 h-3.5" />
        {credits} credits
      </motion.button>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Credits</p>
            <p className="text-lg font-extrabold text-slate-800 leading-none">
              {credits}
            </p>
          </div>
        </div>

        {/* Plan badge */}
        <span
          className={`text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize ${
            subscriptionStatus === "active"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {activePlan}
        </span>
      </div>

      {!hasActivePlan && (
        <div className="flex items-center gap-1.5 text-xs text-orange-500 bg-orange-50 rounded-xl px-3 py-2 mb-3">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>No active plan. Features locked.</span>
        </div>
      )}

      {credits > 0 && credits <= 3 && hasActivePlan && (
        <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 mb-3">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Low credits. Top up soon.</span>
        </div>
      )}

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => router.push("/employer/pricing")}
        className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
      >
        Buy more credits
        <ArrowRight className="w-3.5 h-3.5" />
      </motion.button>
    </div>
  );
};