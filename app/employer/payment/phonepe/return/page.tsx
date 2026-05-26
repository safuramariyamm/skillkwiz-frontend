"use client";

// app/employer/payment/phonepe/return/page.tsx
// PhonePe redirects here after payment attempt.
// We verify status with backend, then redirect to success or failure.

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { paymentApi } from "@/lib/payment";

export default function PhonePeReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const txnId = searchParams.get("txnId");
  const [status, setStatus] = useState<"verifying" | "done" | "error">(
    "verifying"
  );

  useEffect(() => {
    if (!txnId) {
      router.replace("/employer/payment/failure?gateway=phonepe&reason=missing_txn");
      return;
    }

    const verify = async () => {
      try {
        const res = await paymentApi.verifyPhonePe(txnId);
        if (res.success) {
          setStatus("done");
          router.replace(
            `/employer/payment/success?gateway=phonepe&credits=${res.data.credits}&invoice=${res.data.invoiceNumber}&plan=${res.data.planName}`
          );
        } else {
          setStatus("error");
          router.replace(
            `/employer/payment/failure?gateway=phonepe&reason=${
              encodeURIComponent(res.message || "payment_failed")
            }`
          );
        }
      } catch (err) {
        setStatus("error");
        router.replace(
          "/employer/payment/failure?gateway=phonepe&reason=verification_error"
        );
      }
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
            animate={{ width: "90%" }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full"
          />
        </div>
        <p className="text-xs text-slate-400">
          Do not close this window or press back.
        </p>
      </motion.div>
    </div>
  );
}