"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ServicesAuthForm from "@/components/services-auth-form";
import EmployeeCompanyLogin from "@/components/employee-company-login";
import EmployeeRegistration from "@/components/employee-registeration";
import EmployeeSlotBooking from "@/components/employee-slot-booking";
import EmployerRegistration from "@/components/employer-registeration";
import EmployerProfile from "@/components/employer-profile";
import EmployerSlotManager from "@/components/employer-slot-manager";
import EmployerCredentialManager from "@/components/employer-credential-manager";
import SuccessMessage from "@/components/success-message";
import { DarkPageSkeleton } from "@/components/page-skeleton";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
type EmployerTab = "profile" | "slots" | "credentials";
type EmployeeScreen = "profile" | "booking";

export default function ServicesPage() {
  const { user, isLoggedIn, isLoading, logout } = useAuth();

  // Employer states
  const [employerTab, setEmployerTab] = useState<EmployerTab>("profile");
  const [employerHasProfile, setEmployerHasProfile] = useState<boolean | null>(null);
  const [employerProfileLoading, setEmployerProfileLoading] = useState(false);
  const [employerRegistered, setEmployerRegistered] = useState(false);

  // Company employee states — stored in localStorage for persistence across logout/login
  const [companyEmployee, setCompanyEmployee] = useState<any>(null);
  const [employeeScreen, setEmployeeScreen] = useState<EmployeeScreen>("profile");
  const [employeeHasProfile, setEmployeeHasProfile] = useState<boolean | null>(null);
  const [employeeProfileLoading, setEmployeeProfileLoading] = useState(false);

  // Restore company employee from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("sk_user");
    const storedToken = localStorage.getItem("sk_token");
    if (storedUser && storedToken) {
      try {
        const u = JSON.parse(storedUser);
        if (u.isCompanyEmployee) setCompanyEmployee(u);
      } catch { }
    }
  }, []);

  // When employer logs in OR company employee is set, run profile checks in parallel
  useEffect(() => {
    const token = localStorage.getItem("sk_ce_token") || localStorage.getItem("sk_token");
    if (!token) return;

    const checks: Promise<void>[] = [];

    if (isLoggedIn && user?.role === "employer") {
      setEmployerProfileLoading(true);
      checks.push(
        fetch(`${API_BASE}/employers/me`, { headers: { Authorization: `Bearer ${token}` } })
          .then(r => r.json())
          .then(data => {
            if (data.data?.employer) { setEmployerHasProfile(true); setEmployerRegistered(true); }
            else setEmployerHasProfile(false);
          })
          .catch(() => setEmployerHasProfile(false))
          .finally(() => setEmployerProfileLoading(false))
      );
    }

    if (companyEmployee) {
      setEmployeeProfileLoading(true);
      checks.push(
        fetch(`${API_BASE}/candidates/me`, { headers: { Authorization: `Bearer ${token}` } })
          .then(r => r.json())
          .then(data => {
            if (data.data?.candidate) { setEmployeeHasProfile(true); setEmployeeScreen("booking"); }
            else { setEmployeeHasProfile(false); setEmployeeScreen("profile"); }
          })
          .catch(() => { setEmployeeHasProfile(false); setEmployeeScreen("profile"); })
          .finally(() => setEmployeeProfileLoading(false))
      );
    }

    // Run all checks in parallel — no waterfall
    Promise.all(checks);
  }, [isLoggedIn, user?.role, companyEmployee?.id]);

  const handleEmployerLogin = () => {
    // Re-trigger the parallel profile check useEffect by forcing a state update
    setEmployerProfileLoading(true);
    const token = localStorage.getItem("sk_ce_token") || localStorage.getItem("sk_token");
    fetch(`${API_BASE}/employers/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data.data?.employer) { setEmployerHasProfile(true); setEmployerRegistered(true); }
        else setEmployerHasProfile(false);
      })
      .catch(() => setEmployerHasProfile(false))
      .finally(() => setEmployerProfileLoading(false));
  };

  const handleCompanyEmployeeLogin = (u: any) => {
    setCompanyEmployee(u);
    // checkEmployeeProfile will run via useEffect
  };

  const handleCompanyEmployeeLogout = () => {
    setCompanyEmployee(null);
    setEmployeeHasProfile(null);
    setEmployeeScreen("registration");
    localStorage.removeItem("sk_ce_token");
    localStorage.removeItem("sk_ce_refresh_token");
    localStorage.removeItem("sk_user");
  };

  const handleEmployeeRegistrationComplete = () => {
    setEmployeeHasProfile(true);
    setEmployeeScreen("booking");
    // Update stored user status
    const storedUser = localStorage.getItem("sk_user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      localStorage.setItem("sk_user", JSON.stringify({ ...u, status: "registered" }));
      setCompanyEmployee((prev: any) => ({ ...prev, status: "registered" }));
    }
  };

  const panelClass = "bg-gradient-to-br from-[#1a2a4a]/90 to-[#2d3a5a]/90 rounded-2xl p-6 backdrop-blur-sm border border-white/10";
  const tabClass = (active: boolean) => `py-2.5 px-4 text-sm font-medium rounded-lg transition-all ${active ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"}`;

  const isLoaderShowing = isLoading || employerProfileLoading || employeeProfileLoading;

  return (
    <div className="min-h-screen bg-[#050e2d] relative overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050e2d] via-[#1a1f35] to-[#2d3748]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(78,205,196,0.08),transparent_50%)]" />

      <div className="relative z-10 pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">

          {isLoaderShowing && <DarkPageSkeleton />}

          {/* ── Not logged in — show login/register tabs ── */}
          {!isLoaderShowing && !isLoggedIn && !companyEmployee && (
            <div>
              <LoginTabs
                panelClass={panelClass}
                onEmployerLogin={handleEmployerLogin}
                onEmployeeLogin={handleCompanyEmployeeLogin}
              />
            </div>
          )}

          {/* ── Company Employee logged in ── */}
          {!isLoaderShowing && !isLoggedIn && companyEmployee && (
            <div>
              {/* Employee header bar */}
              <div className="flex items-center justify-between mb-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <div>
                  <p className="font-semibold text-white">{companyEmployee.name}</p>
                  <p className="text-sm text-gray-400">{companyEmployee.companyName} · {companyEmployee.username}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                    companyEmployee.status === "booked" ? "bg-green-500/20 text-green-300" :
                    companyEmployee.status === "registered" ? "bg-blue-500/20 text-blue-300" :
                    "bg-yellow-500/20 text-yellow-300"}`}>
                    {companyEmployee.status}
                  </span>
                  <button onClick={handleCompanyEmployeeLogout}
                    className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1.5 rounded-lg">
                    Logout
                  </button>
                </div>
              </div>

              <div className={panelClass}>
                {employeeScreen === "profile" || employeeScreen === "registration" ? (
                  employeeHasProfile === true ? (
                    <EmployeeProfileView
                      companyEmployee={companyEmployee}
                      onSwitchToBooking={() => setEmployeeScreen("booking")}
                    />
                  ) : (
                    <EmployeeRegistration onNext={handleEmployeeRegistrationComplete} />
                  )
                ) : (
                  <EmployeeSlotBooking />
                )}
              </div>

              {/* Navigation tabs — always show both */}
              <div className="flex gap-2 mt-3 justify-center">
                <button onClick={() => setEmployeeScreen("profile")} className={tabClass(employeeScreen === "profile")}>
                  My Profile
                </button>
                <button
                  onClick={() => setEmployeeScreen("booking")}
                  disabled={!employeeHasProfile}
                  className={`${tabClass(employeeScreen === "booking")} disabled:opacity-40 disabled:cursor-not-allowed`}>
                  Book Slot
                </button>
              </div>
            </div>
          )}

          {/* ── Employer logged in ── */}
          {!isLoaderShowing && isLoggedIn && user?.role === "employer" && (
            <div>
              {employerRegistered ? (
                <>
                  <div className="flex gap-1 mb-4 bg-white/5 border border-white/10 rounded-xl p-1.5 overflow-x-auto">
                     {([
                        { key: "profile", label: "Profile" },
                        { key: "slots", label: "Manage Slots" },
                        { key: "credentials", label: "Candidates" },
                      ] as { key: EmployerTab; label: string }[]).map(tab => (
                      <button key={tab.key} onClick={() => setEmployerTab(tab.key)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${employerTab === tab.key ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"}`}>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className={panelClass}>
                    {employerTab === "profile" && <EmployerProfile employerData={null} />}
                    {employerTab === "slots" && <EmployerSlotManager />}
                    {employerTab === "credentials" && <EmployerCredentialManager />}
                  </div>
                </>
              ) : (
                <div className={panelClass}>
                  {employerHasProfile === false && (
                    <EmployerRegistration onSubmit={() => {
                      setEmployerHasProfile(true);
                      setEmployerRegistered(true);
                    }} />
                  )}
                  {employerHasProfile === null && (
                    <div className="text-center text-white py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Employee Profile View — replaces blank EmployeeRegistration as "My Profile" panel ──
function EmployeeProfileView({ companyEmployee, onSwitchToBooking }: {
  companyEmployee: any;
  onSwitchToBooking: () => void;
}) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const token = localStorage.getItem("sk_ce_token") || localStorage.getItem("sk_token");
    fetch(`${API_BASE}/candidates/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data.success) setProfile(data.data.candidate);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayName = profile
    ? `${profile.firstName || profile.candidateName?.split(" ")[0] || ""} ${profile.lastName || profile.candidateName?.split(" ").slice(1).join(" ") || ""}`.trim()
    : companyEmployee?.name || "";

  const displayEmail  = profile?.email || companyEmployee?.email || "";
  const displayCompany = profile?.companyName || profile?.companyName || companyEmployee?.companyName || companyEmployee?.companyCode || "";
  const displayStatus  = (profile?.status || companyEmployee?.status || "").charAt(0).toUpperCase() + (profile?.status || companyEmployee?.status || "").slice(1);

  if (loading) {
    return (
      <div className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto" /></div>
    );
  }

  return (
    <div className="text-white space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">My Profile</h2>
          <p className="text-sm text-gray-400 mt-0.5">{displayCompany}</p>
        </div>
        <button onClick={onSwitchToBooking}
          className="text-sm text-blue-400 hover:text-blue-300 font-medium">
          ← Back to Book Slot
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
            {displayName ? displayName.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{displayName}</h3>
            <p className="text-gray-400 text-sm">{displayEmail}</p>
            <span className="inline-block mt-1 text-xs bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full capitalize">
              {displayStatus}
            </span>
          </div>
        </div>

        <div className="h-px bg-white/10 my-4" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Company</p>
            <p className="font-medium">{displayCompany}</p>
          </div>
          {profile?.companyCode && (
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Company Code</p>
              <p className="font-mono font-medium">{profile.companyCode}</p>
            </div>
          )}
          {companyEmployee?.username && (
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Username</p>
              <p className="font-mono font-medium">{companyEmployee.username}</p>
            </div>
          )}
          {displayEmail && (
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Email</p>
              <p className="font-medium truncate">{displayEmail}</p>
            </div>
          )}
          {profile?.phone && (
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Phone</p>
              <p className="font-medium">{profile.phone}</p>
            </div>
          )}
          {profile?.skills && profile.skills.length > 0 && (
            <div className="col-span-1 sm:col-span-2 bg-white/5 rounded-lg p-3">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((s: any, i: number) => (
                  <span key={i} className="bg-blue-500/15 text-blue-300 text-xs px-2.5 py-1 rounded-full">
                    {s.name || s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {profile?.resume && (
            <div className="col-span-1 sm:col-span-2 bg-white/5 rounded-lg p-3">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Resume</p>
              <p className="text-green-400 text-sm">✓ Resume uploaded</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ── Separate component for login tabs to avoid complexity ────────────────────
function LoginTabs({ panelClass, onEmployerLogin, onEmployeeLogin }: {
  panelClass: string;
  onEmployerLogin: () => void;
  onEmployeeLogin: (user: any) => void;
}) {
  const [activeTab, setActiveTab] = useState<"employer" | "employee">("employer");

  return (
    <div>
      <div className="flex gap-2 mb-4 bg-white/5 border border-white/10 rounded-xl p-1.5 max-w-md mx-auto">
        <button onClick={() => setActiveTab("employer")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "employer" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
          🏢 Employer Login
        </button>
        <button onClick={() => setActiveTab("employee")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "employee" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
          👤 Employee Login
        </button>
      </div>
      <div className={`${panelClass} max-w-md mx-auto`}>
        {activeTab === "employer" ? (
          <ServicesAuthForm onLogin={onEmployerLogin} />
        ) : (
          <EmployeeCompanyLogin onLogin={onEmployeeLogin} />
        )}
      </div>
    </div>
  );
}