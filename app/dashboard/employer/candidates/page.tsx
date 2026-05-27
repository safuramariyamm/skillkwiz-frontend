// app/dashboard/employer/candidates/page.tsx
"use client";

import { useState } from "react";
import { UserPlus, Download, FileText } from "lucide-react";
import {
  PageHeader, Btn, SectionCard, DataTable, Badge, SearchInput,
  SkeletonTable, EmptyState,
} from "@/components/dashboard/shared";
import { useEmployerCandidates } from "@/hooks";
import type { Candidate } from "@/types/dashboard";

const STATUS_LABEL: Record<string, string> = {
  completed: "Completed",
  booked:    "Scheduled",
  invited:   "Pending",
  cancelled: "Cancelled",
};
const STATUS_VARIANT: Record<string, "green"|"blue"|"gray"|"red"> = {
  completed: "green",
  booked:    "blue",
  invited:   "gray",
  cancelled: "red",
};

export default function EmployerCandidatesPage() {
  const [search, setSearch] = useState("");
  const { data: candidates = [], loading } = useEmployerCandidates();

  const filtered = candidates.filter(
    (c) =>
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key:"name", header:"Candidate",
      render:(r:Candidate) => (
        <div>
          <p className="font-medium text-gray-900">{r.name}</p>
          <p className="text-xs text-gray-400">{r.email}</p>
        </div>
      ),
    },
    {
      key:"skills", header:"Skills",
      render:(r:Candidate) => (
        <div className="flex flex-wrap gap-1">
          {r.skills.map((s) => (
            <span key={s}
              className="text-[11px] bg-[#f0f7ff] text-[#00418d]
                border border-[#daeeff] px-1.5 py-0.5 rounded-full">
              {s}
            </span>
          ))}
        </div>
      ),
    },
    {
      key:"assessmentStatus", header:"Status",
      render:(r:Candidate) => (
        <Badge
          label={STATUS_LABEL[r.assessmentStatus]}
          variant={STATUS_VARIANT[r.assessmentStatus]}
        />
      ),
    },
    {
      key:"score", header:"Score",
      render:(r:Candidate) =>
        r.score !== undefined ? (
          <span className="font-semibold text-[#00418d]">{r.score}/100</span>
        ) : (
          <span className="text-gray-300">—</span>
        ),
    },
    {
      key:"percentile", header:"Percentile",
      render:(r:Candidate) =>
        r.percentile ? (
          <Badge label={r.percentile} variant="green" />
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        ),
    },
    {
      key:"report", header:"Report",
      render:(r:Candidate) =>
        r.score !== undefined ? (
          <Btn size="sm" icon={<Download size={12} />}>PDF</Btn>
        ) : (
          <Btn size="sm" icon={<FileText size={12} />} disabled>PDF</Btn>
        ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Candidate Management"
        subtitle={`${candidates.length} candidates`}
        actions={
          <>
            <Btn icon={<Download size={14} />}>Export CSV</Btn>
            <Btn variant="primary" icon={<UserPlus size={14} />}>Invite Candidate</Btn>
          </>
        }
      />

      <SectionCard title="All Candidates">
        <div className="mb-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name or email..."
          />
        </div>

        {loading ? (
          <SkeletonTable rows={5} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No candidates found"
            description="Invite candidates to your assessments to see them here."
            action={<Btn variant="primary" icon={<UserPlus size={14} />}>Invite Candidate</Btn>}
          />
        ) : (
          <DataTable
            columns={columns}
            rows={filtered}
            keyExtractor={(r) => r._id}
          />
        )}
      </SectionCard>

      {/* Invite form */}
      <SectionCard title="Invite New Candidate">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label:"Full Name",   placeholder:"Candidate full name",    type:"text" },
            { label:"Email",       placeholder:"candidate@email.com",    type:"email" },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                className="w-full text-sm border border-[#e2edf7] rounded-lg px-3 py-2.5
                  bg-[#f0f7ff] text-gray-700 placeholder:text-gray-400
                  outline-none focus:border-[#00418d] transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Assessment</label>
            <select className="w-full text-sm border border-[#e2edf7] rounded-lg px-3 py-2.5
              bg-[#f0f7ff] text-gray-600 outline-none cursor-pointer focus:border-[#00418d]">
              <option>React Senior Dev</option>
              <option>Python Fundamentals</option>
              <option>SQL Intermediate</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Btn variant="primary" icon={<UserPlus size={14} />}>Send Invitation</Btn>
        </div>
      </SectionCard>
    </div>
  );
}
