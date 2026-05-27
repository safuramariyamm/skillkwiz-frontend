"use client";

import { useState, useCallback } from "react";
import AdminLayout from "@/app/admin/layout/AdminLayout";
import {
  Building2, Search, Filter, MoreVertical, ChevronLeft,
  ChevronRight, ExternalLink, PowerOff, RefreshCw, Eye,
} from "lucide-react";
import {
  PageHeader, SectionCard, Badge, SkeletonTable, EmptyState, Btn,
} from "@/components/dashboard/shared";
import { useAdminEmployers } from "@/hooks";
import { adminEmployersAPI } from "@/services/api";

const PLAN_FILTER = ["", "starter", "growth", "enterprise"];

type PlanStatus = "active" | "expired" | "inactive";
type Plan       = "starter" | "growth" | "enterprise" | undefined;

function planBadge(plan: Plan) {
  if (plan === "enterprise") return <Badge label="Enterprise" variant="navy" />;
  if (plan === "growth")     return <Badge label="Growth"     variant="blue" />;
  if (plan === "starter")    return <Badge label="Starter"    variant="gray" />;
  return <Badge label="—" variant="gray" />;
}

function statusBadge(status: PlanStatus) {
  if (status === "active")   return <Badge label="Active"   variant="green" />;
  if (status === "expired")  return <Badge label="Expired"  variant="yellow" />;
  return                            <Badge label="Inactive" variant="red" />;
}

export default function AdminCompaniesPage() {
  const [page,   setPage]   = useState(1);
  const [search, setSearch] = useState("");
  const [plan,   setPlan]   = useState("");
  const [inputQ, setInputQ] = useState("");
  const [toasting, setToasting] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const result     = useAdminEmployers(page, search, plan);
  const employers  = (result.data as any)?.employers ?? [];
  const total      = (result.data as any)?.pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 20));

  const applySearch = () => { setSearch(inputQ); setPage(1); };

  const handleDeactivate = useCallback(async (id: string, name: string) => {
    setOpenMenu(null);
    if (!confirm(`Deactivate "${name}"? Their plan will become inactive.`)) return;
    const res = await adminEmployersAPI.deactivate(id);
    setToasting(res.ok ? `${name} deactivated.` : (res.message || "Failed"));
    if (res.ok) result.reload?.();
    setTimeout(() => setToasting(null), 3000);
  }, [result]);

  return (
    <AdminLayout section="companies">
      <div className="space-y-5">
        <PageHeader
          title="Company Management"
          subtitle={`${total} companies registered on SkillKwiz`}
        />

        {/* Filters */}
        <SectionCard title="Filter Companies">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1 bg-[#f0f7ff] border border-[#e2edf7] rounded-lg px-3 py-2">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input
                value={inputQ}
                onChange={(e) => setInputQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applySearch()}
                placeholder="Search company name, email, contact…"
                className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <select
                value={plan}
                onChange={(e) => { setPlan(e.target.value); setPage(1); }}
                className="bg-[#f0f7ff] border border-[#e2edf7] rounded-lg px-3 py-2 text-sm text-gray-700 outline-none"
              >
                {PLAN_FILTER.map((p) => (
                  <option key={p} value={p}>{p ? p.charAt(0).toUpperCase() + p.slice(1) : "All Plans"}</option>
                ))}
              </select>
              <Btn variant="primary" size="sm" onClick={applySearch}>Search</Btn>
              {(search || plan) && (
                <Btn size="sm" onClick={() => { setSearch(""); setPlan(""); setInputQ(""); setPage(1); }}>
                  Clear
                </Btn>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Table */}
        <SectionCard
          title={`Companies (${total})`}
          action={
            <button onClick={result.reload} className="text-gray-400 hover:text-gray-700 transition-colors">
              <RefreshCw size={15} />
            </button>
          }
        >
          {result.loading ? (
            <SkeletonTable rows={8} />
          ) : employers.length === 0 ? (
            <EmptyState
              icon={<Building2 size={24} />}
              title="No companies found"
              description="Try adjusting your search or filter criteria."
            />
          ) : (
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#f0f7ff]">
                    {["Company", "Contact", "Email", "Plan", "Credits", "Status", "Joined", "Actions"].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide px-3 py-2.5 border-b border-[#e2edf7]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employers.map((emp: any) => (
                    <tr key={emp._id} className="border-b border-[#f0f5fb] last:border-0 hover:bg-[#fafcff] transition-colors">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#eff6ff] flex items-center justify-center flex-shrink-0">
                            <Building2 size={13} className="text-[#1e40af]" />
                          </div>
                          <span className="font-medium text-gray-900">{emp.companyName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-600">{emp.contactName || "—"}</td>
                      <td className="px-3 py-3 text-gray-500 text-xs">{emp.email || "—"}</td>
                      <td className="px-3 py-3">{planBadge(emp.plan)}</td>
                      <td className="px-3 py-3 font-medium text-gray-800">{emp.credits ?? 0}</td>
                      <td className="px-3 py-3">{statusBadge(emp.planStatus)}</td>
                      <td className="px-3 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-3 py-3">
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenu(openMenu === emp._id ? null : emp._id)}
                            className="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors"
                          >
                            <MoreVertical size={15} />
                          </button>
                          {openMenu === emp._id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1">
                                <a
                                  href={`/admin/companies/${emp._id}`}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Eye size={13} /> View Details
                                </a>
                                <a
                                  href={`/admin/companies/${emp._id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <ExternalLink size={13} /> Open
                                </a>
                                <div className="border-t border-gray-100 my-1" />
                                <button
                                  onClick={() => handleDeactivate(emp._id, emp.companyName)}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                >
                                  <PowerOff size={13} /> Deactivate
                                </button>
                              </div>
                            </>
                          )}
                        </div>
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
              <span className="text-xs text-gray-400">
                Page {page} of {totalPages} · {total} total
              </span>
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

      {/* Toast */}
      {toasting && (
        <div className="fixed bottom-5 right-5 bg-[#0a1628] text-white text-sm px-4 py-3 rounded-xl shadow-lg z-50 animate-in slide-in-from-bottom-2">
          {toasting}
        </div>
      )}
    </AdminLayout>
  );
}
