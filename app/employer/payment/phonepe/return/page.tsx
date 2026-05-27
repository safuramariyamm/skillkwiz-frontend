"use client";

// app/employer/payment/phonepe/return/page.tsx
// PhonePe redirects here after payment attempt.
// We verify status with backend (with retries), then redirect to success or failure.

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { paymentApi } from "@/lib/payment";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function PhonePeReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const txnId = searchParams.get("txnId");
  const [status, setStatus] = useState<"verifying" | "done" | "error">("verifying");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!txnId) {
      router.replace("/employer/payment/failure?gateway=phonepe&reason=missing_txn");
      return;
    }

    const verify = async () => {
      const MAX_ATTEMPTS = 6;
      const DELAY_MS = 3000; // 3 seconds between retries

      for (let i = 1; i <= MAX_ATTEMPTS; i++) {
        setAttempt(i);

        // Wait before each attempt (including the first — gives PhonePe time to settle)
        await sleep(i === 1 ? 2000 : DELAY_MS);

        try {
          const res = await paymentApi.verifyPhonePe(txnId);

          if (res.success) {
            setStatus("done");
            router.replace(
              `/employer/payment/success?gateway=phonepe&credits=${res.data.credits}&invoice=${res.data.invoiceNumber}&plan=${res.data.planName}`
            );
            return;
          }

          // If PhonePe says explicitly failed/declined — stop retrying
          const terminalCodes = ["PAYMENT_ERROR", "TIMED_OUT", "PAYMENT_DECLINED"];
          if (res.code && terminalCodes.includes(res.code)) {
            break;
          }

          // Otherwise it's still PENDING — keep retrying
          console.log(`[PhonePe verify] Attempt ${i}/${MAX_ATTEMPTS} — status: ${res.code}`);

        } catch (err) {
          console.error(`[PhonePe verify] Attempt ${i} error:`, err);
          // Network error — keep retrying
        }
      }

      // All attempts exhausted or terminal failure
      setStatus("error");
      router.replace("/employer/payment/failure?gateway=phonepe&reason=payment_failed");
    };

    verify();
  }, [txnId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 px-10 py-12 flex flex-col items-center gap-5 max-w-sm w-full text-center"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">
            Verifying Payment
          </h2>
          <p className="text-sm text-slate-500">
            Please wait while we confirm your PhonePe payment…
          </p>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: attempt >= 6 ? "100%" : `${(attempt / 6) * 90}%` }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full"
          />
        </div>
        <p className="text-xs text-slate-400">
          {attempt > 1
            ? `Checking payment status… (attempt ${attempt}/6)`
            : "Do not close this window or press back."}
        </p>
      </motion.div>
    </div>
  );
}