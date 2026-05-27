// app/dashboard/employer/analytics/page.tsx
"use client";

import { PageHeader, SectionCard, EmptyState } from "@/components/dashboard/shared";
import { useCredentials } from "@/hooks";

export default function EmployerAnalyticsPage() {
  const { data: candidates = [], loading } = useCredentials();

  const total = candidates.length;
  const booked = candidates.filter((c) => c.assessmentStatus === "booked").length;
  const completed = candidates.filter((c) => c.assessmentStatus === "completed").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Analytics"
        subtitle="Based on your invited candidates (live data)"
      />

      {loading ? (
        <div className="h-32 bg-white border border-[#e2edf7] rounded-xl animate-pulse" />
      ) : total === 0 ? (
        <EmptyState
          title="No analytics yet"
          description="Invite candidates and complete assessments to see insights here."
        />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total Invited", value: String(total) },
            { label: "Booked", value: String(booked) },
            { label: "Completed", value: String(completed) },
            {
              label: "Completion Rate",
              value: total > 0 ? `${Math.round((completed / total) * 100)}%` : "—",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-[#e2edf7] rounded-xl px-4 py-3"
            >
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-2xl font-bold text-[#00418d] mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <SectionCard title="Candidate pipeline">
        <p className="text-sm text-gray-500">
          Detailed score charts will appear when assessment results are recorded in the
          system. For now, use the Candidates and Credentials pages for live status.
        </p>
      </SectionCard>
    </div>
  );
}
