"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/app/admin/layout/AdminLayout";
import {
  Users, Search, ChevronLeft, ChevronRight,
  RefreshCw, Building2, Calendar, Hash, UserCheck,
} from "lucide-react";
import {
  PageHeader, SectionCard, Badge, SkeletonTable, EmptyState, Btn,
} from "@/components/dashboard/shared";
import { adminAPI } from "@/services/api";

function statusBadge(status: string) {
  if (status === "assessed")   return <Badge label="Assessed"   variant="green"  />;
  if (status === "booked")     return <Badge label="Booked"     variant="blue"   />;
  if (status === "registered") return <Badge label="Registered" variant="yellow" />;
  if (status === "invited")    return <Badge label="Invited"    variant="gray"   />;
  return                              <Badge label={status || "—"} variant="gray" />;
}

interface Employee {
  _id: string;
  name: string;
  email: string;
  username: string;
  companyCode: string;
  companyName: string;
  status: string;
  isUsed: boolean;
  createdAt: string;
}

interface EmployeesResult {
  employees: Employee[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

export default function AdminEmployeesPage() {
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState("");
  const [inputQ,  setInputQ]  = useState("");
  const [data,    setData]    = useState<EmployeesResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // FIX: call the new /api/admin/employees endpoint (CompanyCredential records)
      const res = await adminAPI.getEmployees({ page, search });
      setData(res.data);
    } catch (e: any) {
      setError(e?.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const applySearch = () => {
    setSearch(inputQ);
    setPage(1);
  };

  const employees  = data?.employees ?? [];
  const total      = data?.pagination?.total ?? 0;
  const totalPages = Math.max(1, data?.pagination?.pages ?? 1);

  return (
    <AdminLayout section="employees">
      <div className="space-y-5">
        <PageHeader
          title="Employee Management"
          subtitle={`${total} company-registered employee${total !== 1 ? "s" : ""} across all companies`}
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
                placeholder="Search by name, email, company code, username…"
                className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full"
              />
            </div>
            <div className="flex gap-2">
              <Btn variant="primary" size="sm" onClick={applySearch}>Search</Btn>
              {search && (
                <Btn size="sm" onClick={() => {
                  setSearch(""); setInputQ(""); setPage(1);
                }}>Clear</Btn>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Table */}
        <SectionCard
          title={`Employees (${total})`}
          action={
            <button onClick={load} className="text-gray-400 hover:text-gray-700 transition-colors">
              <RefreshCw size={15} />
            </button>
          }
        >
          {loading ? (
            <SkeletonTable rows={8} />
          ) : error ? (
            <EmptyState
              icon={<Users size={24} />}
              title="Failed to load employees"
              description={error}
            />
          ) : employees.length === 0 ? (
            <EmptyState
              icon={<Users size={24} />}
              title="No company employees found"
              description={
                search
                  ? "Try adjusting your search criteria."
                  : "Employees will appear here once employers generate credentials for them."
              }
            />
          ) : (
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#f0f7ff]">
                    {["Employee", "Email", "Username", "Company", "Status", "Invited On"].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide px-3 py-2.5 border-b border-[#e2edf7]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp._id} className="border-b border-[#f0f5fb] last:border-0 hover:bg-[#fafcff] transition-colors">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#eff6ff] flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-[#1e40af]">
                            {(emp.name || "?")[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">{emp.name || "—"}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-500 text-xs">{emp.email || "—"}</td>
                      <td className="px-3 py-3">
                        <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                          {emp.username || "—"}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <Building2 size={11} className="text-gray-400 flex-shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-gray-700">{emp.companyName || "—"}</div>
                            <div className="text-[10px] text-gray-400 font-mono">{emp.companyCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">{statusBadge(emp.status)}</td>
                      <td className="px-3 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {emp.createdAt ? (
                          <div className="flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(emp.createdAt).toLocaleDateString()}
                          </div>
                        ) : "—"}
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