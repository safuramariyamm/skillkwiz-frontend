"use client";

// app/employer/payment/success/page.tsx
// Shown after successful PayPal capture OR PhonePe verification

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Zap,
  ArrowRight,
  Download,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const params = useSearchParams();

  const gateway = params.get("gateway") || "paypal";
  const credits = params.get("credits") || "0";
  const invoice = params.get("invoice") || "";
  const plan = params.get("plan") || "";

  useEffect(() => {
    // Fire confetti
    const end = Date.now() + 1500;
    const colors = ["#818cf8", "#60a5fa", "#a78bfa", "#34d399"];
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 px-10 py-12 max-w-md w-full flex flex-col items-center text-center gap-6"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </motion.div>

        {/* Heading */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-sm text-slate-500">
            Your{" "}
            {gateway === "phonepe" ? "PhonePe" : "PayPal"} payment has been
            confirmed.
          </p>
        </div>

        {/* Credits badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl px-8 py-5 w-full shadow-lg"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-yellow-300" />
            <span className="text-3xl font-extrabold">{credits}</span>
          </div>
          <p className="text-sm text-blue-100">Credits Added to Your Account</p>
          {plan && (
            <p className="text-xs text-blue-200 mt-0.5 capitalize">{plan} Plan</p>
          )}
        </motion.div>

        {/* Invoice */}
        {invoice && (
          <div className="w-full bg-slate-50 rounded-2xl px-5 py-3 border border-slate-100">
            <p className="text-xs text-slate-500 mb-0.5">Invoice Number</p>
            <p className="text-sm font-mono font-semibold text-slate-700">
              {invoice}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full mt-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/employer/dashboard")}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm py-3 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <Sparkles className="w-4 h-4" />
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <button
            onClick={() => router.push("/employer/billing")}
            className="flex items-center justify-center gap-2 w-full bg-slate-100 text-slate-600 font-semibold text-sm py-3 rounded-2xl hover:bg-slate-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            View Billing History
          </button>
        </div>
      </motion.div>
    </div>
  );
}