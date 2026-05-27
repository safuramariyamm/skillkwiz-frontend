// app/dashboard/employee/status/page.tsx
"use client";

import { CalendarCheck, Clock, XCircle, CheckCircle } from "lucide-react";
import { PageHeader, SectionCard, Badge, SkeletonTable, EmptyState } from "@/components/dashboard/shared";
import { useEmployeeStatus } from "@/hooks";

const STATUS_CONFIG: Record<
  string,
  {
    icon: React.ReactNode;
    bg: string;
    border: string;
    label: string;
    variant: "green" | "blue" | "gray" | "red" | "yellow";
  }
> = {
  booked: {
    icon: <CalendarCheck size={18} className="text-emerald-700" />,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    label: "Slot booked",
    variant: "green",
  },
  assessed: {
    icon: <CheckCircle size={18} className="text-[#1e40af]" />,
    bg: "bg-[#eff6ff]",
    border: "border-blue-200",
    label: "Assessment completed",
    variant: "blue",
  },
  registered: {
    icon: <Clock size={18} className="text-amber-700" />,
    bg: "bg-amber-50",
    border: "border-amber-200",
    label: "Registered — book a slot",
    variant: "yellow",
  },
  invited: {
    icon: <Clock size={18} className="text-gray-500" />,
    bg: "bg-gray-50",
    border: "border-gray-200",
    label: "Invited — complete registration",
    variant: "gray",
  },
};

export default function EmployeeStatusPage() {
  const { data, loading, error } = useEmployeeStatus();
  const status = data?.status || "invited";
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.invited;

  return (
    <div className="space-y-5">
      <PageHeader title="My Assessment Status" subtitle="Your current progress with SkillKwiz" />

      {loading ? (
        <SkeletonTable rows={1} />
      ) : error ? (
        <EmptyState title="Could not load status" description={error} />
      ) : (
        <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-6`}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center">
              {cfg.icon}
            </div>
            <div>
              <Badge label={cfg.label} variant={cfg.variant} />
              <p className="text-sm text-gray-700 mt-3">
                {status === "booked" && (
                  <>Your slot is confirmed. Go to <strong>Book Slot</strong> if you need to view details.</>
                )}
                {status === "invited" && (
                  <>Use the credentials emailed by your employer to complete setup, then book a slot.</>
                )}
                {status === "registered" && (
                  <>You are registered. Open <strong>Book Slot</strong> to choose an assessment time.</>
                )}
                {status === "assessed" && (
                  <>Your assessment is complete. Results are shared with your employer.</>
                )}
              </p>
              {data?.companyCode && (
                <p className="text-xs text-gray-500 mt-2">Company code: {data.companyCode}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {status === "booked" && (
        <SectionCard title="Next steps">
          <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
            <li>Arrive (log in) 10 minutes before your scheduled time</li>
            <li>Keep your login credentials ready</li>
            <li>Contact your employer if you need to reschedule</li>
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
