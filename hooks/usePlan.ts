"use client";

// hooks/usePlan.ts
// Use this hook anywhere to check if employer has an active plan

import { useState, useEffect, useCallback } from "react";
import { paymentApi } from "@/lib/payment";

export interface PlanStatus {
  hasActivePlan: boolean;
  credits: number;
  subscriptionStatus: string;
  activePlan: string;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePlan = (): PlanStatus => {
  const [credits, setCredits] = useState(0);
  const [subscriptionStatus, setSubscriptionStatus] = useState("inactive");
  const [activePlan, setActivePlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await paymentApi.getBalance();
      if (res.success) {
        setCredits(res.data.credits);
        setSubscriptionStatus(res.data.subscriptionStatus);
        setActivePlan(res.data.activePlan);
      }
    } catch (err) {
      setError("Failed to load plan status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    hasActivePlan:
      subscriptionStatus === "active" && credits > 0,
    credits,
    subscriptionStatus,
    activePlan,
    loading,
    error,
    refetch: fetchBalance,
  };
};