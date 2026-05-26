"use client";
import { useState, useEffect, useCallback } from "react";
import { paymentApi } from "@/lib/payment";

interface CreditBalance {
  credits: number;
  activePlan: string;
  subscriptionStatus: string;
  creditsUsed: number;
  totalCreditsPurchased: number;
}

export const useCredits = () => {
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      const res = await paymentApi.getBalance();
      if (res.success) setBalance(res.data);
      else setError(res.message);
    } catch {
      setError("Failed to load credits");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, loading, error, refetch: fetchBalance };
};
