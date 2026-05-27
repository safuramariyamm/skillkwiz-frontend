// ─── SkillKwiz Dashboard Hooks ────────────────────────────────────────────────

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  paymentsAPI,
  assessmentsAPI,
  slotsAPI,
  adminRevenueAPI,
  adminEmployersAPI,
  adminCandidatesAPI,
  employerCandidatesAPI,
  credentialsAPI,
  adminBlogAPI,
  employeeAPI,
  employerAPI,
} from "@/services/api";
import {
  mapAssessmentRequest,
  mapCredential,
  mapCredentialToCandidate,
  mapSlot,
} from "@/lib/dashboard-data";
import type {
  CreditBalance,
  Employer,
  Candidate,
  Assessment,
  Slot,
  Transaction,
  Credential,
  BlogPost,
} from "@/types/dashboard";

function unwrap<T>(body: any): T | null {
  if (!body) return null;
  if (body.data !== undefined && typeof body.data === "object" && !Array.isArray(body.data)) {
    return body.data as T;
  }
  return body as T;
}

function useAsync<T>(
  fetcher: () => Promise<{ ok: boolean; data: any; message?: string }>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetcher();
    if (res.ok) {
      setData(unwrap<T>(res.data) ?? (res.data as T));
    } else {
      setError(res.message || res.data?.message || "Failed to load");
      setData(null);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

export function useCredits() {
  return useAsync<CreditBalance>(() => paymentsAPI.balance());
}

export function usePlans() {
  const [plans, setPlans] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentsAPI.plans().then((d) => {
      if (d.success) setPlans(d.data);
      setLoading(false);
    });
  }, []);

  return { plans, loading };
}

export function usePaymentHistory(page = 1) {
  return useAsync<{
    transactions: Transaction[];
    ledger: any[];
    balance: CreditBalance;
    pagination: { total: number };
  }>(() => paymentsAPI.history(page), [page]);
}

export function useEmployerProfile() {
  return useAsync<{ employer: { company: string; firstName: string; lastName: string } }>(
    () => employerAPI.me()
  );
}

export function useAssessments() {
  const result = useAsync<{ requests: any[] }>(() => assessmentsAPI.list());
  const assessments: Assessment[] =
    result.data?.requests?.map(mapAssessmentRequest) ?? [];
  return { ...result, data: assessments };
}

export function useSlots() {
  const result = useAsync<{ slots: any[] }>(() => slotsAPI.list());
  const slots: Slot[] = result.data?.slots?.map(mapSlot) ?? [];
  return { ...result, data: slots };
}

export function useEmployerCandidates() {
  const result = useAsync<{ credentials: any[]; stats?: object }>(() =>
    employerCandidatesAPI.list()
  );
  const candidates: Candidate[] =
    result.data?.credentials?.map(mapCredentialToCandidate) ?? [];
  return { ...result, data: candidates };
}

export function useCredentials() {
  const result = useAsync<{ credentials: any[] }>(() => credentialsAPI.list());
  const credentials: Credential[] =
    result.data?.credentials?.map(mapCredential) ?? [];
  return { ...result, data: credentials };
}

export function useAdminRevenue() {
  const summary = useAsync(() => adminRevenueAPI.summary());
  const monthly = useAsync<{ monthly: { month: string; total: number }[] }>(() =>
    adminRevenueAPI.monthly(6)
  );
  return { summary, monthly };
}

export function useAdminEmployers(page = 1, search = "", plan = "") {
  return useAsync<{ employers: Employer[]; pagination: { total: number } }>(
    () => adminEmployersAPI.list(page, 20, search, plan),
    [page, search, plan]
  );
}

export function useAdminCandidates(page = 1, search = "", skill = "") {
  return useAsync<{ candidates: Candidate[]; pagination: { total: number } }>(
    () => adminCandidatesAPI.list(page, 20, search, skill),
    [page, search, skill]
  );
}

export function useBlogPosts() {
  const result = useAsync<any[]>(() => adminBlogAPI.list());
  const posts: BlogPost[] = Array.isArray(result.data)
    ? result.data
    : (result.data as any)?.blogs ?? [];
  return { ...result, data: posts };
}

export function useEmployeeSlots() {
  return useAsync<{ slots: any[] }>(() => employeeAPI.availableSlots());
}

export function useEmployeeStatus() {
  return useAsync<{ status: string; companyCode?: string }>(() =>
    employeeAPI.myStatus()
  );
}
