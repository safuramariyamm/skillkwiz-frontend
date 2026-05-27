// app/dashboard/employer/assessments/page.tsx
"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, UserPlus } from "lucide-react";
import {
  PageHeader, Btn, SectionCard, DataTable, Badge, EmptyState, SkeletonTable,
} from "@/components/dashboard/shared";
import { useAssessments } from "@/hooks";
import { assessmentsAPI } from "@/services/api";
import type { Assessment } from "@/types/dashboard";

const STATUS_VARIANT: Record<string, "green"|"yellow"|"gray"> = {
  active:    "green",
  draft:     "yellow",
  completed: "gray",
};

export default function EmployerAssessmentsPage() {
  const { data: assessments = [], loading, reload } = useAssessments();
  const [deleting, setDeleting] = useState<string|null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this assessment?")) return;
    setDeleting(id);
    await assessmentsAPI.remove(id);
    setDeleting(null);
    reload();
  };

  const columns = [
    {
      key:"title", header:"Assessment",
      render:(r:Assessment) => <span className="font-medium text-gray-900">{r.title}</span>,
    },
    {
      key:"status", header:"Status",
      render:(r:Assessment) => (
        <Badge
          label={r.status.charAt(0).toUpperCase() + r.status.slice(1)}
          variant={STATUS_VARIANT[r.status]}
        />
      ),
    },
    {
      key:"candidateCount", header:"Candidates",
      render:(r:Assessment) => (
        <span className="font-medium text-[#00418d]">{r.candidateCount}</span>
      ),
    },
    {
      key:"deadline", header:"Deadline",
      render:(r:Assessment) => <span className="text-gray-400">{r.deadline}</span>,
    },
    {
      key:"actions", header:"",
      render:(r:Assessment) => (
        <div className="flex items-center gap-2">
          <Btn size="sm" icon={<UserPlus size={12} />}>Invite</Btn>
          <Btn size="sm" icon={<Edit2 size={12} />} />
          <Btn
            size="sm"
            variant="danger"
            icon={<Trash2 size={12} />}
            disabled={deleting === r._id}
            onClick={() => handleDelete(r._id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Assessment Manager"
        subtitle={`${assessments.length} assessments total`}
        actions={
          <Btn variant="primary" icon={<Plus size={14} />}>Create Assessment</Btn>
        }
      />

      <SectionCard title="All Assessments">
        {loading ? (
          <SkeletonTable rows={4} />
        ) : assessments.length === 0 ? (
          <EmptyState
            title="No assessments yet"
            description="Create your first assessment to start inviting candidates."
            action={<Btn variant="primary" icon={<Plus size={14} />}>Create Assessment</Btn>}
          />
        ) : (
          <DataTable
            columns={columns}
            rows={assessments}
            keyExtractor={(r) => r._id}
          />
        )}
      </SectionCard>

      {/* Create Assessment Form (inline placeholder) */}
      <SectionCard title="Create New Assessment">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label:"Assessment Title",  placeholder:"e.g. React Senior Developer",   type:"text" },
            { label:"Deadline",          placeholder:"Pick a date",                    type:"date" },
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
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
            <textarea
              rows={3}
              placeholder="Describe the assessment scope, skills tested, and expectations..."
              className="w-full text-sm border border-[#e2edf7] rounded-lg px-3 py-2.5
                bg-[#f0f7ff] text-gray-700 placeholder:text-gray-400
                outline-none focus:border-[#00418d] transition-colors resize-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Btn>Save as Draft</Btn>
          <Btn variant="primary">Create Assessment</Btn>
        </div>
      </SectionCard>
    </div>
  );
}
