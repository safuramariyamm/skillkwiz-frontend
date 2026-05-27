// app/dashboard/employer/assessments/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, UserPlus } from "lucide-react";
import {
  PageHeader, Btn, SectionCard, DataTable, Badge, EmptyState, SkeletonTable,
} from "@/components/dashboard/shared";
import { useAssessments } from "@/hooks";
import { assessmentsAPI } from "@/services/api";
import type { Assessment } from "@/types/dashboard";

const STATUS_VARIANT: Record<string, "green" | "yellow" | "gray"> = {
  active:    "green",
  draft:     "yellow",
  completed: "gray",
};

export default function EmployerAssessmentsPage() {
  const router = useRouter();
  const { data: assessments = [], loading, reload } = useAssessments();
  const [deleting, setDeleting] = useState<string | null>(null);

  // ─── Create form state ────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    title:        "",
    deadline:     "",
    description:  "",
    candidateEmail: "",
  });
  const [saving,      setSaving]      = useState(false);
  const [saveError,   setSaveError]   = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCreate = async () => {
    if (!form.title) {
      setSaveError("Assessment title is required.");
      return;
    }
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    const res = await assessmentsAPI.create({
      candidateFirstName: form.title,
      candidateLastName:  "",
      candidateEmail:     form.candidateEmail || "pending@skillkwiz.com",
      skills:             [form.title],
      notes:              form.description,
    });

    setSaving(false);

    if (res.ok) {
      setSaveSuccess(true);
      setForm({ title: "", deadline: "", description: "", candidateEmail: "" });
      reload();
    } else {
      // 403 = no active plan
      if (res.status === 403) {
        setSaveError("You need an active plan to create assessments. Go to Billing to purchase one.");
      } else {
        setSaveError(res.message || "Failed to create assessment.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this assessment?")) return;
    setDeleting(id);
    await assessmentsAPI.remove(id);
    setDeleting(null);
    reload();
  };

  const columns = [
    {
      key: "title", header: "Assessment",
      render: (r: Assessment) => <span className="font-medium text-gray-900">{r.title}</span>,
    },
    {
      key: "status", header: "Status",
      render: (r: Assessment) => (
        <Badge
          label={r.status.charAt(0).toUpperCase() + r.status.slice(1)}
          variant={STATUS_VARIANT[r.status]}
        />
      ),
    },
    {
      key: "candidateCount", header: "Candidates",
      render: (r: Assessment) => (
        <span className="font-medium text-[#00418d]">{r.candidateCount}</span>
      ),
    },
    {
      key: "deadline", header: "Deadline",
      render: (r: Assessment) => <span className="text-gray-400">{r.deadline}</span>,
    },
    {
      key: "actions", header: "",
      render: (r: Assessment) => (
        <div className="flex items-center gap-2">
          <Btn
            size="sm"
            icon={<UserPlus size={12} />}
            onClick={() => router.push("/dashboard/employer/credentials")}
          >
            Invite
          </Btn>
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
          <Btn
            variant="primary"
            icon={<Plus size={14} />}
            onClick={() =>
              document.getElementById("create-assessment-form")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Create Assessment
          </Btn>
        }
      />

      {/* Assessment list */}
      <SectionCard title="All Assessments">
        {loading ? (
          <SkeletonTable rows={4} />
        ) : assessments.length === 0 ? (
          <EmptyState
            title="No assessments yet"
            description="Create your first assessment to start inviting candidates."
            action={
              <Btn
                variant="primary"
                icon={<Plus size={14} />}
                onClick={() =>
                  document.getElementById("create-assessment-form")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Create Assessment
              </Btn>
            }
          />
        ) : (
          <DataTable
            columns={columns}
            rows={assessments}
            keyExtractor={(r) => r._id}
          />
        )}
      </SectionCard>

      {/* Create form — wired up */}
      <SectionCard title="Create New Assessment" id="create-assessment-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Assessment Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. React Senior Developer"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full text-sm border border-[#e2edf7] rounded-lg px-3 py-2.5
                bg-[#f0f7ff] text-gray-700 placeholder:text-gray-400
                outline-none focus:border-[#00418d] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Candidate Email
            </label>
            <input
              type="email"
              placeholder="candidate@email.com"
              value={form.candidateEmail}
              onChange={(e) => setForm((p) => ({ ...p, candidateEmail: e.target.value }))}
              className="w-full text-sm border border-[#e2edf7] rounded-lg px-3 py-2.5
                bg-[#f0f7ff] text-gray-700 placeholder:text-gray-400
                outline-none focus:border-[#00418d] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))}
              className="w-full text-sm border border-[#e2edf7] rounded-lg px-3 py-2.5
                bg-[#f0f7ff] text-gray-700 outline-none focus:border-[#00418d] transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
            <textarea
              rows={3}
              placeholder="Describe the assessment scope, skills tested, and expectations..."
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full text-sm border border-[#e2edf7] rounded-lg px-3 py-2.5
                bg-[#f0f7ff] text-gray-700 placeholder:text-gray-400
                outline-none focus:border-[#00418d] transition-colors resize-none"
            />
          </div>
        </div>

        {/* Feedback */}
        {saveError && (
          <p className="text-xs text-red-500 mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {saveError}
          </p>
        )}
        {saveSuccess && (
          <p className="text-xs text-emerald-600 mt-3 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            Assessment created successfully.
          </p>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Btn
            onClick={() => setForm({ title: "", deadline: "", description: "", candidateEmail: "" })}
          >
            Clear
          </Btn>
          <Btn variant="primary" onClick={handleCreate} disabled={saving}>
            {saving ? "Creating…" : "Create Assessment"}
          </Btn>
        </div>
      </SectionCard>
    </div>
  );
}