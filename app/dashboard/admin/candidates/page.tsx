// app/dashboard/admin/candidates/page.tsx
"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import {
  PageHeader, Btn, SectionCard, DataTable, Badge, SearchInput,
  SkeletonTable,
} from "@/components/dashboard/shared";
import { ScoreDistChart } from "@/components/dashboard/charts";
import { useAdminCandidates } from "@/hooks";
import type { Candidate } from "@/types/dashboard";

function scoreColor(score?: number) {
  if (!score) return "text-gray-400";
  if (score >= 85) return "text-emerald-600";
  if (score >= 70) return "text-[#00418d]";
  return "text-amber-600";
}

export default function AdminCandidatesPage() {
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [page, setPage] = useState(1);

  const { data, loading } = useAdminCandidates(page, search, skill);
  const candidates: Candidate[] = data?.candidates ?? [];

  const columns = [
    {
      key: "name", header: "Candidate",
      render: (r: Candidate) => (
        <div>
          <p className="font-medium text-gray-900">{r.name}</p>
          <p className="text-xs text-gray-400">{r.email}</p>
        </div>
      ),
    },
    {
      key: "skills", header: "Skills",
      render: (r: Candidate) => (
        <div className="flex flex-wrap gap-1">
          {r.skills.map((s) => (
            <span key={s} className="text-[11px] bg-[#f0f7ff] text-[#00418d]
              border border-[#daeeff] px-2 py-0.5 rounded-full">
              {s}
            </span>
          ))}
        </div>
      ),
    },
    { key: "employer", header: "Employer" },
    {
      key: "score", header: "Score",
      render: (r: Candidate) => (
        <span className={`font-semibold ${scoreColor(r.score)}`}>
          {r.score ?? "—"}{r.score ? "/100" : ""}
        </span>
      ),
    },
    {
      key: "percentile", header: "Percentile",
      render: (r: Candidate) =>
        r.percentile ? (
          <Badge label={r.percentile} variant="green" />
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        ),
    },
    {
      key: "report", header: "Report",
      render: () => (
        <Btn size="sm" icon={<FileText size={12} />}>View</Btn>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Candidate Management"
        subtitle="2,657 candidates on platform"
        actions={
          <Btn icon={<Download size={14} />}>Export</Btn>
        }
      />

      <SectionCard title="All Candidates">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              placeholder="Search by name or skill..."
            />
          </div>
          <select
            value={skill}
            onChange={(e) => { setSkill(e.target.value); setPage(1); }}
            className="text-sm border border-[#e2edf7] rounded-lg px-3 py-2
              bg-[#f0f7ff] text-gray-600 outline-none cursor-pointer"
          >
            <option value="">All Skills</option>
            <option value="react">React</option>
            <option value="python">Python</option>
            <option value="sql">SQL</option>
            <option value="java">Java</option>
          </select>
        </div>

        {loading ? (
          <SkeletonTable rows={5} />
        ) : (
          <DataTable
            columns={columns}
            rows={candidates}
            keyExtractor={(r) => r._id}
            emptyText="No candidates found."
          />
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f0f5fb]">
          <p className="text-xs text-gray-400">
            Showing {candidates.length} of {data?.total ?? candidates.length}
          </p>
          <div className="flex items-center gap-2">
            <Btn size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</Btn>
            <span className="text-xs text-gray-500 px-2">Page {page}</span>
            <Btn size="sm" onClick={() => setPage((p) => p + 1)}>Next →</Btn>
          </div>
        </div>
      </SectionCard>

      {candidates.some((c) => c.score != null) && (
        <SectionCard title="Score Distribution">
          <ScoreDistChart
            data={[
              { bucket: "70+", count: candidates.filter((c) => (c.score ?? 0) >= 70).length },
              { bucket: "<70", count: candidates.filter((c) => (c.score ?? 0) < 70 && c.score != null).length },
            ]}
            height={180}
          />
        </SectionCard>
      )}
    </div>
  );
}
