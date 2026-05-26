"use client";

// app/employer/payment/failure/page.tsx
// Shown when PayPal or PhonePe payment fails or is cancelled

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  XCircle,
  RefreshCw,
  ArrowLeft,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";

const REASON_MAP: Record<string, string> = {
  missing_txn: "Transaction ID was missing. Please try again.",
  payment_failed: "Your payment could not be processed. Please try again.",
  verification_error:
    "We could not verify your payment. Please contact support if money was deducted.",
  cancelled: "You cancelled the payment.",
  capture_failed: "Payment authorised but capture failed. Please contact support.",
};

export default function PaymentFailurePage() {
  const router = useRouter();
  const params = useSearchParams();

  const gateway = params.get("gateway") || "paypal";
  const reason = params.get("reason") || "payment_failed";
  const readableReason =
    REASON_MAP[reason] || "Something went wrong. Please try again.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 px-10 py-12 max-w-md w-full flex flex-col items-center text-center gap-6"
      >
        {/* Failure icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center"
        >
          <XCircle className="w-10 h-10 text-red-500" />
        </motion.div>

        {/* Heading */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2">
            Payment Failed
          </h1>
          <p className="text-sm text-slate-500">
            Your {gateway === "phonepe" ? "PhonePe" : "PayPal"} payment was not
            completed.
          </p>
        </div>

        {/* Reason card */}
        <div className="w-full bg-red-50 border border-red-100 rounded-2xl px-5 py-4 flex items-start gap-3 text-left">
          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700 leading-relaxed">
            {readableReason}
          </p>
        </div>

        {/* No charge notice */}
        <p className="text-xs text-slate-400">
          No charges have been made to your account unless your bank shows
          otherwise. If you were charged, please contact support.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full mt-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/employer/pricing")}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm py-3 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </motion.button>

          <button
            onClick={() => router.push("/employer/dashboard")}
            className="flex items-center justify-center gap-2 w-full bg-slate-100 text-slate-600 font-semibold text-sm py-3 rounded-2xl hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <button
            onClick={() =>
              window.open("mailto:support@skillkwiz.com", "_blank")
            }
            className="flex items-center justify-center gap-2 w-full text-slate-400 hover:text-slate-600 text-xs transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Contact Support
          </button>
        </div>
      </motion.div>
    </div>
  );
}