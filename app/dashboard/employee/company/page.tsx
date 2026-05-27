// app/dashboard/employee/company/page.tsx
"use client";

import { useEffect, useState } from "react";
import { PageHeader, SectionCard, EmptyState } from "@/components/dashboard/shared";
import { Building2, Mail } from "lucide-react";

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#f0f7ff] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-700">{value}</p>
      </div>
    </div>
  );
}

export default function EmployeeCompanyPage() {
  const [companyName, setCompanyName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sk_user");
      if (raw) {
        const u = JSON.parse(raw);
        setCompanyName(u.companyName || "");
        setCompanyCode(u.companyCode || "");
        setEmail(u.email || "");
      }
    } catch {
      /* ignore */
    }
  }, []);

  if (!companyName && !companyCode) {
    return (
      <div className="space-y-5">
        <PageHeader title="Company Info" subtitle="Your employer details" />
        <EmptyState
          title="No company data"
          description="Log in with your company employee credentials to see employer information."
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Company Info" subtitle="Your employer (from your login session)" />

      <SectionCard title={companyName || "Your company"}>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoRow
            icon={<Building2 size={16} className="text-[#00418d]" />}
            label="Company"
            value={companyName || "—"}
          />
          <InfoRow
            icon={<Building2 size={16} className="text-[#00418d]" />}
            label="Company code"
            value={companyCode || "—"}
          />
          {email && (
            <InfoRow
              icon={<Mail size={16} className="text-[#00418d]" />}
              label="Your email"
              value={email}
            />
          )}
        </div>
        <p className="text-sm text-gray-500 mt-6">
          Contact your employer HR team for role details, office location, and assessment
          instructions.
        </p>
      </SectionCard>
    </div>
  );
}
