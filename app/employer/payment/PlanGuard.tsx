"use client";

// components/payment/PlanGuard.tsx
// Wrap any feature that requires an active plan.
// Shows a locked overlay with upgrade prompt if no plan exists.

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePlan } from "@/hooks/usePlan";

interface PlanGuardProps {
  children: React.ReactNode;
  feature?: string; // e.g. "Add Candidate"
  blur?: boolean;   // blur the children vs hiding them
}

export const PlanGuard: React.FC<PlanGuardProps> = ({
  children,
  feature = "this feature",
  blur = true,
}) => {
  const { hasActivePlan, loading } = usePlan();
  const router = useRouter();

  if (loading) {
    return <>{children}</>;
  }

  if (hasActivePlan) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred children */}
      {blur && (
        <div className="pointer-events-none select-none filter blur-sm opacity-60">
          {children}
        </div>
      )}

      {/* Lock overlay */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${
            blur
              ? "absolute inset-0"
              : "w-full"
          } flex items-center justify-center z-10`}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/90 backdrop-blur-md border border-blue-100 rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center gap-3 max-w-xs text-center"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-lavender-100 flex items-center justify-center">
              <Lock className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-semibold text-slate-800 text-sm">
              Unlock {feature}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Purchase a plan to access {feature} and all premium features.
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/employer/pricing")}
              className="mt-1 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              View Plans
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ─── LockedButton ─────────────────────────────────────────────────────────────
// Drop-in replacement for any button that needs a plan
interface LockedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  requirePlan?: boolean; // pass false to always enable
}

export const LockedButton: React.FC<LockedButtonProps> = ({
  children,
  requirePlan = true,
  onClick,
  className = "",
  ...props
}) => {
  const { hasActivePlan, loading } = usePlan();
  const router = useRouter();

  const isLocked = requirePlan && !hasActivePlan && !loading;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLocked) {
      e.preventDefault();
      router.push("/employer/pricing");
      return;
    }
    onClick?.(e);
  };

  return (
    <motion.button
      whileTap={{ scale: isLocked ? 1 : 0.97 }}
      onClick={handleClick}
      className={`relative ${className} ${
        isLocked ? "opacity-60 cursor-not-allowed" : ""
      }`}
      title={isLocked ? "Purchase a plan to unlock this feature" : undefined}
      {...(props as any)}
    >
      {isLocked && (
        <Lock className="w-3.5 h-3.5 absolute -top-1 -right-1 text-slate-400" />
      )}
      {children}
    </motion.button>
  );
};