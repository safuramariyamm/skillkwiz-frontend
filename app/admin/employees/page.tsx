"use client";

import { useState } from "react";
import AdminLayout from "@/app/admin/layout/AdminLayout";
import {
  Users, Search, ChevronLeft, ChevronRight,
  RefreshCw, Building2, Calendar, Hash,
} from "lucide-react";
import {
  PageHeader, SectionCard, Badge, SkeletonTable, EmptyState, Btn,
} from "@/components/dashboard/shared";
import { useAdminCandidates } from "@/hooks";

function statusBadge(status: string) {
  if (status === "completed")  return <Badge label="Completed"  variant="green"  />;
  if (status === "pending")    return <Badge label="Pending"    variant="yellow" />;
  if (status === "scheduled")  return <Badge label="Scheduled"  variant="blue"   />;
  if (status === "failed")     return <Badge label="Failed"     variant="red"    />;
  return                              <Badge label={status || "—"} variant="gray" />;
}

export default function AdminEmployeesPage() {
  const [page,   setPage]   = useState(1);
  const [search, setSearch] = useState("");
  const [skill,  setSkill]  = useState("");
  const [inputQ, setInputQ] = useState("");
  const [skillQ, setSkillQ] = useState("");

  const result    = useAdminCandidates(page, search, skill);
  const candidates = (result.data as any)?.candidates ?? [];
  const total      = (result.data as any)?.pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 20));

  const applySearch = () => {
    setSearch(inputQ);
    setSkill(skillQ);
    setPage(1);
  };

  return (
    <AdminLayout section="employees">
      <div className="space-y-5">
        <PageHeader
          title="Employee Management"
          subtitle={`${total} employees across all companies`}
        />

        {/* Search */}
        <SectionCard title="Filter Employees">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1 bg-[#f0f7ff] border border-[#e2edf7] rounded-lg px-3 py-2">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input
                value={inputQ}
                onChange={(e) => setInputQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applySearch()}
                placeholder="Search by name, email, company code…"
                className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full"
              />
            </div>
            <div className="flex items-center gap-2 bg-[#f0f7ff] border border-[#e2edf7] rounded-lg px-3 py-2">
              <Hash size={14} className="text-gray-400" />
              <input
                value={skillQ}
                onChange={(e) => setSkillQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applySearch()}
                placeholder="Filter by skill…"
                className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 w-40"
              />
            </div>
            <div className="flex gap-2">
              <Btn variant="primary" size="sm" onClick={applySearch}>Search</Btn>
              {(search || skill) && (
                <Btn size="sm" onClick={() => {
                  setSearch(""); setSkill(""); setInputQ(""); setSkillQ(""); setPage(1);
                }}>Clear</Btn>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Table */}
        <SectionCard
          title={`Employees (${total})`}
          action={
            <button onClick={result.reload} className="text-gray-400 hover:text-gray-700 transition-colors">
              <RefreshCw size={15} />
            </button>
          }
        >
          {result.loading ? (
            <SkeletonTable rows={8} />
          ) : candidates.length === 0 ? (
            <EmptyState
              icon={<Users size={24} />}
              title="No employees found"
              description="Try adjusting your search or filter criteria."
            />
          ) : (
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#f0f7ff]">
                    {["Employee", "Email", "Company Code", "Skill", "Score", "Status", "Assessed On"].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide px-3 py-2.5 border-b border-[#e2edf7]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c: any) => (
                    <tr key={c._id} className="border-b border-[#f0f5fb] last:border-0 hover:bg-[#fafcff] transition-colors">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#eff6ff] flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-[#1e40af]">
                            {(c.name || c.firstName || "?")[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">
                            {c.name || `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-500 text-xs">{c.email || "—"}</td>
                      <td className="px-3 py-3">
                        {c.companyCode ? (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Building2 size={11} className="text-gray-400" />
                            <span className="text-xs font-mono">{c.companyCode}</span>
                          </div>
                        ) : "—"}
                      </td>
                      <td className="px-3 py-3 text-gray-700 text-xs">{c.skill || c.skillName || "—"}</td>
                      <td className="px-3 py-3">
                        {c.score != null ? (
                          <span className={`font-semibold text-sm ${
                            c.score >= 80 ? "text-emerald-600"
                            : c.score >= 60 ? "text-amber-600"
                            : "text-red-500"
                          }`}>
                            {c.score}%
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-3 py-3">{statusBadge(c.status)}</td>
                      <td className="px-3 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {c.assessedAt || c.createdAt
                          ? (
                            <div className="flex items-center gap-1">
                              <Calendar size={10} />
                              {new Date(c.assessedAt || c.createdAt).toLocaleDateString()}
                            </div>
                          )
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#e2edf7]">
              <span className="text-xs text-gray-400">Page {page} of {totalPages} · {total} total</span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-1.5 rounded-lg border border-[#e2edf7] text-gray-500 hover:bg-[#f0f7ff] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pg = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  if (pg < 1 || pg > totalPages) return null;
                  return (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        pg === page
                          ? "bg-[#00418d] text-white"
                          : "border border-[#e2edf7] text-gray-600 hover:bg-[#f0f7ff]"
                      }`}
                    >
                      {pg}
                    </button>
                  );
                })}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-1.5 rounded-lg border border-[#e2edf7] text-gray-500 hover:bg-[#f0f7ff] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </AdminLayout>
  );
}
