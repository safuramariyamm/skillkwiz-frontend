"use client";

import { CheckCircle } from "lucide-react";

interface SuccessMessageProps {
  title: string;
  message: string;
  buttonText: string;
  onContinue: () => void;
}

export default function SuccessMessage({
  title,
  message,
  buttonText,
  onContinue,
}: SuccessMessageProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full mx-4 text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[#00418d] mb-3">{title}</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>
        <button
          onClick={onContinue}
          className="px-10 py-3 rounded-full bg-[#f73e5d] text-white font-semibold hover:bg-[#d62f4f] transition-all shadow-md"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
