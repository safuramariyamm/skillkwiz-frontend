"use client";

// hooks/useApiWithPlanCheck.ts
// Wrapper around fetch that automatically shows UpgradePlanPopup
// when the backend returns 403 with code NO_ACTIVE_PLAN or INSUFFICIENT_CREDITS

import { useState, useCallback } from "react";

interface PlanError {
  show: boolean;
  feature?: string;
  code?: string;
}

export const useApiWithPlanCheck = () => {
  const [planError, setPlanError] = useState<PlanError>({ show: false });

  const closePlanError = useCallback(() => {
    setPlanError({ show: false });
  }, []);

  /**
   * wrappedFetch
   * Drop-in for fetch(). If the response is 403 with a plan error code,
   * it sets planError so the popup shows.
   * Returns { data, ok } — data is the JSON response or null on network error.
   */
  const wrappedFetch = useCallback(
    async <T = unknown>(
      url: string,
      options?: RequestInit,
      featureLabel?: string
    ): Promise<{ data: T | null; ok: boolean }> => {
      try {
        const res = await fetch(url, options);
        const data = (await res.json()) as T & {
          code?: string;
          message?: string;
          success?: boolean;
        };

        if (
          res.status === 403 &&
          (data?.code === "NO_ACTIVE_PLAN" ||
            data?.code === "INSUFFICIENT_CREDITS" ||
            data?.code === "PLAN_EXPIRED")
        ) {
          setPlanError({
            show: true,
            feature: featureLabel,
            code: data.code,
          });
          return { data: null, ok: false };
        }

        return { data: data as T, ok: res.ok };
      } catch (err) {
        return { data: null, ok: false };
      }
    },
    []
  );

  return {
    wrappedFetch,
    planError,
    closePlanError,
  };
};