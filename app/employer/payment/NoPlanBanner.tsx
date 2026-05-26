"use client";

// components/payment/NoPlanBanner.tsx
// Sticky banner shown at top of employer dashboard when no plan is active

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, X, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePlan } from "@/hooks/usePlan";

export const NoPlanBanner: React.FC = () => {
  const { hasActivePlan, loading, credits } = usePlan();
  const router = useRouter();
  const [dismissed, setDismissed] = React.useState(false);

  if (loading || hasActivePlan || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="w-full bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm mb-6"
      >
        {/* Icon */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-md">
          <Zap className="w-4 h-4 text-white" />
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800">
            {credits === 0
              ? "You have no credits remaining"
              : "No active plan"}
          </p>
          <p className="text-xs text-slate-500 truncate">
            Purchase a plan to add candidates, create slots, and generate
            credentials.
          </p>
        </div>

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => router.push("/employer/pricing")}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow hover:shadow-md transition-shadow flex-shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Upgrade
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/60 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};