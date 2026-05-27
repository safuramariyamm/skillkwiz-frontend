// app/dashboard/employer/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Save, Building2, User, Phone, Briefcase, Globe } from "lucide-react";
import {
  PageHeader, Btn, SectionCard,
} from "@/components/dashboard/shared";
import { employerAPI, apiCall } from "@/services/api";

interface EmployerProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  department: string;
  companyCode: string;
  authorized: boolean;
}

export default function EmployerProfilePage() {
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState({
    firstName:  "",
    lastName:   "",
    phone:      "",
    company:    "",
    department: "",
  });
  const [saving,   setSaving]   = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    employerAPI.me().then((res) => {
      setLoading(false);
      if (res.ok) {
        // Backend returns { success, data: { employer } }
        const e: EmployerProfile =
          res.data?.data?.employer ?? res.data?.employer ?? res.data;
        if (e) {
          setProfile(e);
          setForm({
            firstName:  e.firstName  ?? "",
            lastName:   e.lastName   ?? "",
            phone:      e.phone      ?? "",
            company:    e.company    ?? "",
            department: e.department ?? "",
          });
        }
      }
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    setSuccess(false);

    const res = await apiCall("/employers/me", {
      method: "PUT",
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (res.ok) {
      setSuccess(true);
      // Refresh profile
      const updated = res.data?.data?.employer ?? res.data?.employer;
      if (updated) setProfile(updated);
    } else {
      setSaveError(res.message || "Failed to save profile.");
    }
  };

  const field = (key: keyof typeof form, label: string, icon: React.ReactNode, type = "text") => (
    <div key={key}>
      <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
        {icon}
        {label}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        className="w-full text-sm border border-[#e2edf7] rounded-lg px-3 py-2.5
          bg-[#f0f7ff] text-gray-700 outline-none focus:border-[#00418d] transition-colors"
      />
    </div>
  );

  return (
    <div className="space-y-5">
      <PageHeader title="Employer Profile" subtitle="Manage your company details" />

      {/* Company code card */}
      {profile?.companyCode && (
        <div className="bg-white border border-[#e2edf7] rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Your Company Code
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-2xl font-bold text-[#00418d] tracking-[0.25em] bg-[#f0f7ff] border border-[#daeeff] px-5 py-2.5 rounded-xl">
              {profile.companyCode}
            </span>
            <p className="text-sm text-gray-500">
              Share this code with candidates so they can log in as your company employees.
            </p>
          </div>
        </div>
      )}

      {/* Profile edit form */}
      <SectionCard title="Company Information">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field("firstName",  "First Name",  <User size={12} className="text-gray-400" />)}
              {field("lastName",   "Last Name",   <User size={12} className="text-gray-400" />)}
              {field("company",    "Company Name",<Building2 size={12} className="text-gray-400" />)}
              {field("department", "Department",  <Briefcase size={12} className="text-gray-400" />)}
              {field("phone",      "Phone",       <Phone size={12} className="text-gray-400" />, "tel")}
            </div>

            {/* Read-only email */}
            {profile?.email && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Email (read-only)</label>
                <div className="text-sm border border-[#e2edf7] rounded-lg px-3 py-2.5 bg-gray-50 text-gray-400">
                  {profile.email}
                </div>
              </div>
            )}

            {saveError && (
              <p className="text-xs text-red-500 mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {saveError}
              </p>
            )}
            {success && (
              <p className="text-xs text-emerald-600 mt-3 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                Profile saved successfully.
              </p>
            )}

            <div className="flex justify-end mt-5">
              <Btn
                variant="primary"
                icon={<Save size={14} />}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save Changes"}
              </Btn>
            </div>
          </>
        )}
      </SectionCard>

      {/* Authorization status */}
      {profile && (
        <SectionCard title="Authorization Status">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${profile.authorized ? "bg-emerald-400" : "bg-amber-400"}`} />
            <p className="text-sm text-gray-700">
              {profile.authorized
                ? "Your account is authorized to conduct assessments."
                : "Your account is pending authorization. Contact support to complete verification."}
            </p>
          </div>
        </SectionCard>
      )}
    </div>
  );
}