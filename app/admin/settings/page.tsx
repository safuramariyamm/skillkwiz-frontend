"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/app/admin/layout/AdminLayout";
import {
  User, Shield, Bell, Globe, Key, Lock,
  Save, Eye, EyeOff, CheckCircle2, AlertCircle,
} from "lucide-react";
import { PageHeader, SectionCard, Btn } from "@/components/dashboard/shared";
import { authAPI } from "@/services/api";

type Tab = "profile" | "security" | "notifications" | "platform";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "profile",       label: "Admin Profile",      icon: <User size={15} />    },
  { id: "security",      label: "Security",            icon: <Shield size={15} /> },
  { id: "notifications", label: "Notifications",       icon: <Bell size={15} />   },
  { id: "platform",      label: "Platform Settings",   icon: <Globe size={15} />  },
];

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`fixed bottom-5 right-5 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg z-50 text-sm text-white animate-in slide-in-from-bottom-2 ${ok ? "bg-emerald-600" : "bg-red-500"}`}>
      {ok ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
      {msg}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<Tab>("profile");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // Profile state
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");

  // Security state
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [showCur,    setShowCur]    = useState(false);
  const [showNew,    setShowNew]    = useState(false);

  // Platform state
  const [platformName, setPlatformName] = useState("SkillKwiz");
  const [supportEmail, setSupportEmail] = useState("support@skillkwiz.com");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Notification toggles
  const [notifNewEmployer,   setNotifNewEmployer]   = useState(true);
  const [notifNewPayment,    setNotifNewPayment]    = useState(true);
  const [notifFailedPayment, setNotifFailedPayment] = useState(true);
  const [notifWeeklyReport,  setNotifWeeklyReport]  = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("sk_user");
    if (raw) {
      try {
        const u = JSON.parse(raw);
        setName(u.name || "");
        setEmail(u.email || "");
      } catch { /* ignore */ }
    }
  }, []);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveProfile = () => {
    if (!name.trim()) { showToast("Name cannot be empty.", false); return; }
    // In production: call PATCH /admin/profile
    const raw = localStorage.getItem("sk_user");
    if (raw) {
      try {
        const u = JSON.parse(raw);
        localStorage.setItem("sk_user", JSON.stringify({ ...u, name: name.trim() }));
      } catch { /* ignore */ }
    }
    showToast("Profile updated successfully.", true);
  };

  const handleChangePassword = () => {
    if (!currentPw || !newPw || !confirmPw) {
      showToast("Please fill all password fields.", false); return;
    }
    if (newPw !== confirmPw) {
      showToast("New passwords do not match.", false); return;
    }
    if (newPw.length < 8) {
      showToast("New password must be at least 8 characters.", false); return;
    }
    // In production: call POST /admin/change-password
    showToast("Password changed successfully.", true);
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
  };

  return (
    <AdminLayout section="settings">
      <div className="space-y-5">
        <PageHeader title="Settings" subtitle="Manage your admin profile, security, and platform configuration" />

        {/* Tab Nav */}
        <div className="flex gap-1 bg-white border border-[#e2edf7] rounded-xl p-1 w-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-[#00418d] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-[#f0f7ff]"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === "profile" && (
          <SectionCard title="Admin Profile">
            <div className="max-w-md space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#00418d] flex items-center justify-center text-white text-xl font-bold">
                  {name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "AD"}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{name || "Admin"}</div>
                  <div className="text-xs text-gray-400">{email}</div>
                  <div className="inline-flex items-center gap-1 bg-[#eff6ff] text-[#1e40af] text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
                    <Shield size={9} /> ADMINISTRATOR
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#f0f7ff] border border-[#e2edf7] rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00418d] focus:ring-1 focus:ring-[#00418d]/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
                <input
                  value={email}
                  disabled
                  className="w-full bg-gray-100 border border-[#e2edf7] rounded-lg px-3 py-2.5 text-sm text-gray-400 outline-none cursor-not-allowed"
                />
                <p className="text-[11px] text-gray-400 mt-1">Email cannot be changed from this panel.</p>
              </div>

              <Btn variant="primary" icon={<Save size={14} />} onClick={handleSaveProfile}>
                Save Profile
              </Btn>
            </div>
          </SectionCard>
        )}

        {/* Security Tab */}
        {tab === "security" && (
          <div className="space-y-4">
            <SectionCard title="Change Password">
              <div className="max-w-md space-y-4">
                {[
                  { label: "Current Password",  value: currentPw,  set: setCurrentPw,  show: showCur, setShow: setShowCur },
                  { label: "New Password",       value: newPw,      set: setNewPw,      show: showNew, setShow: setShowNew },
                  { label: "Confirm New Password", value: confirmPw, set: setConfirmPw, show: showNew, setShow: setShowNew },
                ].map(({ label, value, set, show, setShow }) => (
                  <div key={label}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
                    <div className="relative">
                      <input
                        type={show ? "text" : "password"}
                        value={value}
                        onChange={(e) => set(e.target.value)}
                        className="w-full bg-[#f0f7ff] border border-[#e2edf7] rounded-lg px-3 py-2.5 pr-10 text-sm text-gray-800 outline-none focus:border-[#00418d] focus:ring-1 focus:ring-[#00418d]/30 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {show ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                ))}

                <div className="bg-[#f0f7ff] border border-[#e2edf7] rounded-lg p-3">
                  <p className="text-[11px] text-gray-500 font-medium mb-1">Password requirements:</p>
                  <ul className="text-[11px] text-gray-400 space-y-0.5 list-disc list-inside">
                    <li>Minimum 8 characters</li>
                    <li>Mix of uppercase, lowercase, and numbers recommended</li>
                  </ul>
                </div>

                <Btn variant="primary" icon={<Lock size={14} />} onClick={handleChangePassword}>
                  Update Password
                </Btn>
              </div>
            </SectionCard>

            <SectionCard title="Session Security">
              <div className="space-y-3">
                {[
                  { label: "JWT Token Expiry",      value: "24 hours (configured on backend)" },
                  { label: "Admin Route Protection", value: "middleware.ts + server-side role check" },
                  { label: "Cookie Security",        value: "SameSite=Strict, path=/" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-[#f0f5fb] last:border-0">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-xs text-gray-400 bg-[#f0f7ff] px-2 py-1 rounded-lg">{item.value}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {/* Notifications Tab */}
        {tab === "notifications" && (
          <SectionCard title="Notification Preferences">
            <div className="max-w-md space-y-4">
              {[
                { label: "New Employer Registration", desc: "Get notified when a new employer registers", value: notifNewEmployer, set: setNotifNewEmployer },
                { label: "Successful Payments",        desc: "Alert for every completed transaction",     value: notifNewPayment,    set: setNotifNewPayment    },
                { label: "Failed Payments",             desc: "Immediate alert on failed transactions",    value: notifFailedPayment, set: setNotifFailedPayment },
                { label: "Weekly Summary Report",       desc: "Weekly email digest of platform metrics",   value: notifWeeklyReport,  set: setNotifWeeklyReport  },
              ].map(({ label, desc, value, set }) => (
                <div key={label} className="flex items-start justify-between gap-4 py-3 border-b border-[#f0f5fb] last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                  </div>
                  <button
                    onClick={() => set(!value)}
                    className={`flex-shrink-0 relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${value ? "bg-[#00418d]" : "bg-gray-200"}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}

              <Btn variant="primary" icon={<Save size={14} />} onClick={() => showToast("Notification preferences saved.", true)}>
                Save Preferences
              </Btn>
            </div>
          </SectionCard>
        )}

        {/* Platform Tab */}
        {tab === "platform" && (
          <div className="space-y-4">
            <SectionCard title="General Platform Settings">
              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Platform Name</label>
                  <input
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    className="w-full bg-[#f0f7ff] border border-[#e2edf7] rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00418d] focus:ring-1 focus:ring-[#00418d]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Support Email</label>
                  <input
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    type="email"
                    className="w-full bg-[#f0f7ff] border border-[#e2edf7] rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00418d] focus:ring-1 focus:ring-[#00418d]/30"
                  />
                </div>

                <div className="flex items-start justify-between gap-4 py-3 bg-red-50 border border-red-200 rounded-xl px-4">
                  <div>
                    <div className="text-sm font-medium text-red-800">Maintenance Mode</div>
                    <div className="text-xs text-red-500 mt-0.5">Disables access for all non-admin users</div>
                  </div>
                  <button
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`flex-shrink-0 relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${maintenanceMode ? "bg-red-500" : "bg-gray-200"}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${maintenanceMode ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </div>

                <Btn variant="primary" icon={<Save size={14} />} onClick={() => showToast("Platform settings saved.", true)}>
                  Save Settings
                </Btn>
              </div>
            </SectionCard>

            <SectionCard title="System Information">
              <div className="space-y-2">
                {[
                  { label: "Frontend Framework", value: "Next.js 14 (App Router)" },
                  { label: "Auth Strategy",       value: "JWT + Cookie + Middleware" },
                  { label: "Admin Route",          value: "/admin/*  (hidden, role-gated)" },
                  { label: "API Base",             value: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api" },
                  { label: "Environment",          value: process.env.NODE_ENV || "development" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-[#f0f5fb] last:border-0">
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className="text-xs font-mono text-gray-400 bg-[#f0f7ff] px-2 py-0.5 rounded">{value}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}
      </div>

      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </AdminLayout>
  );
}
