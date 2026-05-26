"use client";

// components/payment/UpgradePlanPopup.tsx
// Popup modal triggered when employer tries to use a feature without a plan.
// Usage: show when API returns 403 with code NO_ACTIVE_PLAN or INSUFFICIENT_CREDITS

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  X,
  Crown,
  Sparkles,
  Zap,
  Star,
  Lock,
  ArrowRight,
} from "lucide-react";

interface UpgradePlanPopupProps {
  open: boolean;
  onClose: () => void;
  feature?: string; // e.g. "Add Candidate"
  code?: "NO_ACTIVE_PLAN" | "INSUFFICIENT_CREDITS" | string;
}

export const UpgradePlanPopup: React.FC<UpgradePlanPopupProps> = ({
  open,
  onClose,
  feature,
  code,
}) => {
  const router = useRouter();

  const isNoCredits = code === "INSUFFICIENT_CREDITS";

  const perks = [
    { icon: <Zap className="w-4 h-4 text-blue-500" />, text: "Add candidates" },
    { icon: <Star className="w-4 h-4 text-indigo-500" />, text: "Create assessment slots" },
    { icon: <Crown className="w-4 h-4 text-purple-500" />, text: "Generate login credentials" },
    { icon: <Sparkles className="w-4 h-4 text-pink-500" />, text: "Book & manage assessments" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4 pointer-events-none"
          >
            <div className="pointer-events-auto bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-sm w-full overflow-hidden">
              {/* Gradient header */}
              <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 px-8 pt-8 pb-10 text-white text-center">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-7 h-7 text-white" />
                </div>

                <h2 className="text-xl font-extrabold mb-1">
                  {isNoCredits ? "No Credits Left" : "Unlock Premium Access"}
                </h2>
                <p className="text-blue-100 text-sm">
                  {isNoCredits
                    ? "You've used all your credits. Top up to continue."
                    : feature
                    ? `Purchase a plan to use "${feature}"`
                    : "Purchase a plan to continue using SkillKwiz"}
                </p>
              </div>

              {/* Features list */}
              <div className="px-8 py-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  What you'll unlock
                </p>
                <ul className="space-y-2.5 mb-6">
                  {perks.map((p, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm text-slate-700"
                    >
                      <div className="w-7 h-7 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                        {p.icon}
                      </div>
                      {p.text}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    onClose();
                    router.push("/employer/pricing");
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Sparkles className="w-4 h-4" />
                  {isNoCredits ? "Buy More Credits" : "View Plans"}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <button
                  onClick={onClose}
                  className="w-full mt-2.5 text-slate-400 hover:text-slate-600 text-xs py-2 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};