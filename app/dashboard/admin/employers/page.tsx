// app/dashboard/admin/employers/page.tsx
"use client";

import { useState } from "react";
import { Plus, Filter, ExternalLink } from "lucide-react";
import {
  PageHeader, Btn, SectionCard, DataTable, Badge, SearchInput,
  SkeletonTable,
} from "@/components/dashboard/shared";
import { useAdminEmployers } from "@/hooks";
import type { Employer } from "@/types/dashboard";

const PLAN_VARIANT: Record<string, "blue" | "green" | "navy" | "gray"> = {
  enterprise: "navy",
  growth:     "blue",
  starter:    "gray",
};

export default function AdminEmployersPage() {
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");
  const [page, setPage] = useState(1);

  const { data, loading, error } = useAdminEmployers(page, search, plan);
  const employers: Employer[] = data?.employers ?? [];

  const columns = [
    {
      key: "companyName", header: "Company",
      render: (r: Employer) => (
        <span className="font-medium text-gray-900">{r.companyName}</span>
      ),
    },
    { key: "contactName", header: "Contact" },
    { key: "email", header: "Email",
      render: (r: Employer) => (
        <span className="text-xs text-gray-500">{r.email}</span>
      ),
    },
    {
      key: "plan", header: "Plan",
      render: (r: Employer) => (
        <Badge
          label={r.plan.charAt(0).toUpperCase() + r.plan.slice(1)}
          variant={PLAN_VARIANT[r.plan] ?? "gray"}
        />
      ),
    },
    {
      key: "planStatus", header: "Status",
      render: (r: Employer) => (
        <Badge
          label={r.planStatus === "active" ? "Active" : "Expired"}
          variant={r.planStatus === "active" ? "green" : "red"}
        />
      ),
    },
    {
      key: "credits", header: "Credits",
      render: (r: Employer) => (
        <span className="font-medium text-[#00418d]">{r.credits}</span>
      ),
    },
    {
      key: "totalRevenue", header: "Revenue",
      render: (r: Employer) => (
        <span className="font-medium">${r.totalRevenue.toLocaleString()}</span>
      ),
    },
    {
      key: "actions", header: "",
      render: () => (
        <div className="flex items-center gap-2">
          <Btn size="sm" icon={<ExternalLink size={12} />}>Manage</Btn>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Employer Management"
        subtitle={`${employers.length} employers registered`}
        actions={
          <Btn variant="primary" icon={<Plus size={14} />}>Add Employer</Btn>
        }
      />

      <SectionCard title="All Employers">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              placeholder="Search employers..."
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={plan}
              onChange={(e) => { setPlan(e.target.value); setPage(1); }}
              className="text-sm border border-[#e2edf7] rounded-lg px-3 py-2
                bg-[#f0f7ff] text-gray-600 outline-none cursor-pointer"
            >
              <option value="">All Plans</option>
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <Btn icon={<Filter size={14} />}>Filter</Btn>
          </div>
        </div>

        {loading ? (
          <SkeletonTable rows={5} />
        ) : (
          <DataTable
            columns={columns}
            rows={employers}
            keyExtractor={(r) => r._id}
            emptyText="No employers found."
          />
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f0f5fb]">
          <p className="text-xs text-gray-400">
            Showing {employers.length} of {data?.total ?? employers.length} results
          </p>
          <div className="flex items-center gap-2">
            <Btn size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              ← Prev
            </Btn>
            <span className="text-xs text-gray-500 px-2">Page {page}</span>
            <Btn size="sm" onClick={() => setPage((p) => p + 1)}>
              Next →
            </Btn>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
