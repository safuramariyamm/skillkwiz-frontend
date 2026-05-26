"use client";

// components/payment/PaymentMethodSelector.tsx
// Rendered inside the plan purchase flow so user can pick PayPal or PhonePe

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export type PaymentMethod = "paypal" | "phonepe";

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector: React.FC<
  PaymentMethodSelectorProps
> = ({ selected, onChange }) => {
  const methods: {
    id: PaymentMethod;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: "paypal",
      label: "PayPal",
      sublabel: "Pay in USD · Cards & PayPal balance",
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
          <rect width="24" height="24" rx="6" fill="#003087" />
          <path
            d="M7.5 18.5l.6-3.5H10c3.2 0 5.5-1.7 6.1-4.4.5-2.3-1-4.1-3.8-4.1H7.5L5 18.5h2.5z"
            fill="#009CDE"
          />
          <path
            d="M10.2 15H8.5l.4-2.5h1.5c1.5 0 2.5-.7 2.8-2 .3-1.1-.4-1.9-1.7-1.9H9l-1.5 9h2l.4-2.6z"
            fill="white"
          />
        </svg>
      ),
    },
    {
      id: "phonepe",
      label: "PhonePe",
      sublabel: "Pay in INR · UPI, Cards & Netbanking",
      badge: "Recommended for India",
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
          <rect width="24" height="24" rx="6" fill="#5F259F" />
          <path
            d="M12 4C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.46 10.04c-.34.56-.84.94-1.44 1.1v1.36h-1v-1.32c-.6-.08-1.14-.36-1.56-.8l.72-.72c.3.32.7.52 1.16.52.86 0 1.46-.6 1.46-1.4 0-.72-.44-1.14-1.3-1.3l-.44-.08c-1.18-.22-1.86-.92-1.86-2 0-.98.68-1.76 1.62-2V6.5h1v1.38c.5.1.96.36 1.34.74l-.72.72c-.28-.26-.62-.42-1-.42-.74 0-1.26.5-1.26 1.2 0 .64.4 1.02 1.22 1.18l.44.08c1.24.24 1.94 1 1.94 2.1 0 .6-.16 1.1-.32 1.56z"
            fill="white"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-slate-700 mb-1">
        Select Payment Method
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {methods.map((method) => (
          <motion.button
            key={method.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(method.id)}
            className={`relative w-full text-left rounded-2xl border-2 px-4 py-4 transition-all duration-200 ${
              selected === method.id
                ? "border-blue-400 bg-blue-50/70 shadow-md"
                : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"
            }`}
          >
            {method.badge && (
              <span className="absolute -top-2.5 left-3 text-[10px] font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-0.5 rounded-full">
                {method.badge}
              </span>
            )}
            <div className="flex items-center gap-3">
              {method.icon}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">
                  {method.label}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {method.sublabel}
                </p>
              </div>
              {/* Radio dot */}
              <div
                className={`ml-auto w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  selected === method.id
                    ? "border-blue-500 bg-blue-500"
                    : "border-slate-300"
                }`}
              >
                {selected === method.id && (
                  <motion.div
                    layoutId="radio-dot"
                    className="w-1.5 h-1.5 rounded-full bg-white"
                  />
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};