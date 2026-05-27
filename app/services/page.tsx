"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
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

const EmployerBilling = dynamic(() => import("@/components/employer-billing"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#00418d]" />
    </div>
  ),
});

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
type EmployerTab = "profile" | "slots" | "credentials" | "billing";
type EmployeeScreen = "profile" | "booking";

// ── Service feature cards shown before login ──────────────────────────────────
const SERVICE_FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    accent: "#f6c648",
    title: "Secure Assessments",
    desc: "Biometric-verified test centres with anti-cheat measures give you tamper-proof skill reports.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    accent: "#f73e5d",
    title: "Instant Verified Reports",
    desc: "Skip lengthy interviews. Get authenticated skill reports the moment an assessment completes.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    accent: "#c3dfff",
    title: "Candidate Management",
    desc: "Issue credentials, manage slots, and track your entire talent pipeline from one dashboard.",
  },
];

export default function ServicesPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading, logout } = useAuth();

  const [employerTab, setEmployerTab] = useState<EmployerTab>("profile");
  const [employerHasProfile, setEmployerHasProfile] = useState<boolean | null>(null);
  const [employerProfileLoading, setEmployerProfileLoading] = useState(false);
  const [employerRegistered, setEmployerRegistered] = useState(false);
  const [justRegisteredEmployer, setJustRegisteredEmployer] = useState<any>(null);

  const [companyEmployee, setCompanyEmployee] = useState<any>(null);
  const [employeeScreen, setEmployeeScreen] = useState<EmployeeScreen>("profile");
  const [employeeHasProfile, setEmployeeHasProfile] = useState<boolean | null>(null);
  const [employeeProfileLoading, setEmployeeProfileLoading] = useState(false);

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

    Promise.all(checks);
  }, [isLoggedIn, user?.role, companyEmployee?.id]);

  const handleEmployerLogin = () => {
    router.push("/dashboard/employer/overview");
  };

  const handleCompanyEmployeeLogin = (u: any) => {
    setCompanyEmployee(u);
    router.push("/dashboard/employee/booking");
  };

  const handleCompanyEmployeeLogout = () => {
    setCompanyEmployee(null);
    setEmployeeHasProfile(null);
    setEmployeeScreen("profile");
    localStorage.removeItem("sk_ce_token");
    localStorage.removeItem("sk_ce_refresh_token");
    localStorage.removeItem("sk_token");
    localStorage.removeItem("sk_refresh_token");
    localStorage.removeItem("sk_user");
    document.cookie = "sk_token=; path=/; max-age=0; SameSite=Strict";
  };

  const handleEmployeeRegistrationComplete = () => {
    setEmployeeHasProfile(true);
    setEmployeeScreen("booking");
    const storedUser = localStorage.getItem("sk_user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      localStorage.setItem("sk_user", JSON.stringify({ ...u, status: "registered" }));
      setCompanyEmployee((prev: any) => ({ ...prev, status: "registered" }));
    }
  };

  const isLoaderShowing = isLoading || employerProfileLoading || employeeProfileLoading;
  const isAuthenticated = isLoggedIn || !!companyEmployee;

  return (
    <div className="min-h-screen bg-[#f0f7ff]">

      {/* ── HERO ── dark navy, matches About/Blog ─────────────────────────── */}
      <section className="relative w-full bg-[#0a1628] text-white overflow-hidden pt-16">
        {/* Background video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-25"
          autoPlay muted loop playsInline preload="none"
          aria-hidden="true"
        >
          <source src="/images/homepage/banner_video.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/70 to-[#0a1628]/40 z-[1]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 z-[1] opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(#c3dfff 1px, transparent 1px), linear-gradient(90deg, #c3dfff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none" style={{ height: 60 }}>
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="#f0f7ff" />
          </svg>
        </div>

        <div className="sk-container relative z-[3] py-14 md:py-20">
          {isAuthenticated ? (
            /* ── Logged-in hero ── */
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="sk-label text-[#f6c648]/70 bg-[#f6c648]/10 border border-[#f6c648]/20 px-5 py-2 rounded-full inline-block mb-5">
                  {isLoggedIn && user?.role === "employer" ? "Employer Dashboard" : "Employee Portal"}
                </span>
                <h1 className="sk-h1 text-white mb-3">
                  Welcome back,{" "}
                  <span className="text-[#f6c648]">
                    {isLoggedIn ? user?.name?.split(" ")[0] : companyEmployee?.name?.split(" ")[0]}
                  </span>
                </h1>
                <p className="text-white/60 text-lg max-w-xl">
                  {isLoggedIn && user?.role === "employer"
                    ? "Manage your job slots, review candidates, and track your hiring pipeline."
                    : "Complete your profile and book your skill assessment slot below."}
                </p>
              </div>
              {/* Quick stat pills */}
              <div className="flex gap-3 flex-wrap shrink-0">
                {isLoggedIn && user?.role === "employer" ? (
                  <>
                    <div className="bg-white/8 border border-white/12 rounded-2xl px-5 py-4 text-center min-w-[100px]">
                      <p className="text-2xl font-black text-[#f6c648]">∞</p>
                      <p className="text-white/50 text-xs mt-1 font-medium">Skill Library</p>
                    </div>
                    <div className="bg-white/8 border border-white/12 rounded-2xl px-5 py-4 text-center min-w-[100px]">
                      <p className="text-2xl font-black text-[#f73e5d]">24h</p>
                      <p className="text-white/50 text-xs mt-1 font-medium">Fast Reports</p>
                    </div>
                  </>
                ) : (
                  <div className="bg-white/8 border border-white/12 rounded-2xl px-6 py-4 text-center">
                    <p className="text-2xl font-black text-[#f6c648] capitalize">{companyEmployee?.status || "Active"}</p>
                    <p className="text-white/50 text-xs mt-1 font-medium">Account Status</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ── Guest hero ── */
            <div className="max-w-3xl">
              <span className="sk-label text-[#f6c648]/70 bg-[#f6c648]/10 border border-[#f6c648]/20 px-5 py-2 rounded-full inline-block mb-6">
                Skill Authentication Services
              </span>
              <h1 className="sk-h1 text-white mb-5">
                Verify Skills.{" "}
                <span className="text-[#f6c648]">Hire Right.</span>
              </h1>
              <p className="text-white/65 text-lg leading-relaxed max-w-2xl">
                The world's most trusted skill assessment platform. Employers post slots, candidates get verified — no guesswork, no bias.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURE STRIP (shown only to guests) ────────────────────────────── */}
      {!isAuthenticated && !isLoaderShowing && (
        <section className="sk-section-sm sk-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICE_FEATURES.map((f, i) => (
              <div
                key={i}
                className="sk-card group p-7 flex gap-5 items-start"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${f.accent}18`, color: f.accent }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3 className="sk-h4 text-[#0a1628] mb-1.5">{f.title}</h3>
                  <p className="sk-caption leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── MAIN PORTAL AREA ─────────────────────────────────────────────────── */}
      <section className="pb-24 sk-container">
        <div className={isAuthenticated ? "max-w-5xl" : "max-w-2xl mx-auto"}>

          {/* Loading */}
          {isLoaderShowing && (
            <div className="sk-card rounded-3xl p-10">
              <DarkPageSkeleton />
            </div>
          )}

          {/* ── GUEST: login tabs ── */}
          {!isLoaderShowing && !isLoggedIn && !companyEmployee && (
            <div>
              {/* Section label */}
              <div className="text-center mb-8">
                <span className="sk-label text-[#00418d]/60 bg-[#00418d]/8 border border-[#00418d]/15 px-5 py-2 rounded-full inline-block mb-3">
                  Get Started
                </span>
                <h2 className="sk-h2 text-[#0a1628]">Sign In to Your Account</h2>
                <p className="sk-body mt-2">Choose your account type to continue.</p>
              </div>
              <LoginTabs
                onEmployerLogin={handleEmployerLogin}
                onEmployeeLogin={handleCompanyEmployeeLogin}
              />
            </div>
          )}

          {/* ── COMPANY EMPLOYEE logged in ── */}
          {!isLoaderShowing && !isLoggedIn && companyEmployee && (
            <div className="space-y-4">
              {/* Employee header card */}
              <div className="bg-[#0a1628] text-white rounded-3xl px-7 py-5 flex items-center justify-between gap-4 shadow-xl shadow-[#0a1628]/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#f6c648] flex items-center justify-center text-[#0a1628] font-black text-lg shrink-0">
                    {companyEmployee.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-white">{companyEmployee.name}</p>
                    <p className="text-white/50 text-sm mt-0.5">
                      {companyEmployee.companyName} · {companyEmployee.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1.5 rounded-full font-bold capitalize ${
                    companyEmployee.status === "booked"
                      ? "bg-green-400/15 text-green-400"
                      : companyEmployee.status === "registered"
                      ? "bg-[#c3dfff]/15 text-[#c3dfff]"
                      : "bg-[#f6c648]/15 text-[#f6c648]"
                  }`}>
                    {companyEmployee.status}
                  </span>
                  <button
                    onClick={handleCompanyEmployeeLogout}
                    className="text-xs text-white/40 hover:text-[#f73e5d] border border-white/10 hover:border-[#f73e5d]/30 px-3 py-1.5 rounded-xl font-medium transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Tab nav */}
              <div className="flex gap-2 bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm">
                {([
                  { key: "profile" as EmployeeScreen, label: "My Profile", icon: "👤" },
                  { key: "booking" as EmployeeScreen, label: "Book Slot", icon: "📅" },
                ]).map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setEmployeeScreen(t.key)}
                    disabled={t.key === "booking" && !employeeHasProfile}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      employeeScreen === t.key
                        ? "bg-[#0a1628] text-white shadow-sm"
                        : "text-gray-500 hover:text-[#00418d] hover:bg-[#00418d]/5"
                    }`}
                  >
                    <span>{t.icon}</span> {t.label}
                  </button>
                ))}
              </div>

              {/* Content panel */}
              <div className="sk-card rounded-3xl p-7">
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
            </div>
          )}

          {/* ── EMPLOYER logged in ── */}
          {!isLoaderShowing && isLoggedIn && user?.role === "employer" && (
            <div className="space-y-4">
              {/* Employer header card */}
              <div className="bg-[#0a1628] text-white rounded-3xl px-7 py-5 flex items-center justify-between gap-4 shadow-xl shadow-[#0a1628]/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#00418d] flex items-center justify-center text-white font-black text-lg shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-white">{user.name}</p>
                    <p className="text-white/50 text-sm mt-0.5">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-3 py-1.5 rounded-full font-bold bg-[#f6c648]/15 text-[#f6c648] capitalize">
                    Employer
                  </span>
                  <button
                    onClick={logout}
                    className="text-xs text-white/40 hover:text-[#f73e5d] border border-white/10 hover:border-[#f73e5d]/30 px-3 py-1.5 rounded-xl font-medium transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {employerRegistered ? (
                <>
                  {/* Employer tab nav */}
                  <div className="flex gap-2 bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm overflow-x-auto">
                    {([
                      { key: "profile", label: "Profile", icon: "🏢" },
                      { key: "slots", label: "Manage Slots", icon: "📅" },
                      { key: "credentials", label: "Candidates", icon: "👥" },
                      { key: "billing", label: "Credits & Billing", icon: "💳" },
                    ] as { key: EmployerTab; label: string; icon: string }[]).map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setEmployerTab(tab.key)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                          employerTab === tab.key
                            ? "bg-[#0a1628] text-white shadow-sm"
                            : "text-gray-500 hover:text-[#00418d] hover:bg-[#00418d]/5"
                        }`}
                      >
                        <span>{tab.icon}</span> {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Panel */}
                  <div className="sk-card rounded-3xl p-7">
                    {employerTab === "profile" && <EmployerProfile employerData={justRegisteredEmployer} />}
                    {employerTab === "slots" && <EmployerSlotManager />}
                    {employerTab === "credentials" && <EmployerCredentialManager />}
                    {employerTab === "billing" && <EmployerBilling />}
                  </div>
                </>
              ) : (
                <div className="sk-card rounded-3xl p-7">
                  {employerHasProfile === false && (
                    <EmployerRegistration onSubmit={(employer: any) => {
                      setEmployerHasProfile(true);
                      setEmployerRegistered(true);
                      setEmployerTab("profile");
                      setJustRegisteredEmployer(employer);
                    }} />
                  )}
                  {employerHasProfile === null && (
                    <div className="flex justify-center py-12">
                      <div className="w-8 h-8 rounded-full border-2 border-[#00418d] border-t-transparent animate-spin" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      

    </div>
  );
}

// ── Employee profile view ─────────────────────────────────────────────────────
function EmployeeProfileView({ companyEmployee, onSwitchToBooking }: {
  companyEmployee: any;
  onSwitchToBooking: () => void;
}) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sk_ce_token") || localStorage.getItem("sk_token");
    fetch(`${API_BASE}/candidates/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data.success) setProfile(data.data.candidate); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const displayName    = profile ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || companyEmployee?.name : companyEmployee?.name;
  const displayEmail   = profile?.email || companyEmployee?.email || "";
  const displayCompany = profile?.companyName || companyEmployee?.companyName || companyEmployee?.companyCode || "";
  const displayStatus  = (profile?.status || companyEmployee?.status || "").charAt(0).toUpperCase() + (profile?.status || companyEmployee?.status || "").slice(1);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 rounded-full border-2 border-[#00418d] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="sk-h4 text-gray-900">My Profile</h2>
          <p className="sk-caption mt-0.5">{displayCompany}</p>
        </div>
        <button onClick={onSwitchToBooking} className="text-sm text-[#00418d] hover:text-[#042578] font-semibold transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          Book Slot
        </button>
      </div>

      {/* Profile hero */}
      <div className="bg-gradient-to-br from-[#f0f7ff] to-[#daeeff] rounded-2xl p-6 border border-[#00418d]/10">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-[#00418d] flex items-center justify-center text-2xl font-black text-white shrink-0">
            {displayName?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{displayName}</h3>
            <p className="text-sm text-gray-500">{displayEmail}</p>
            <span className="inline-block mt-1.5 text-xs bg-[#00418d] text-white px-3 py-0.5 rounded-full capitalize font-semibold">
              {displayStatus}
            </span>
          </div>
        </div>

        <div className="h-px bg-[#00418d]/10 my-4" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Company", value: displayCompany },
            ...(profile?.companyCode ? [{ label: "Company Code", value: profile.companyCode }] : []),
            ...(companyEmployee?.username ? [{ label: "Username", value: companyEmployee.username }] : []),
            ...(displayEmail ? [{ label: "Email", value: displayEmail }] : []),
            ...(profile?.phone ? [{ label: "Phone", value: profile.phone }] : []),
          ].map((field) => (
            <div key={field.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">{field.label}</p>
              <p className="text-gray-900 font-semibold text-sm truncate">{field.value}</p>
            </div>
          ))}

          {profile?.skills?.length > 0 && (
            <div className="col-span-2 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">Skills</p>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s: any, i: number) => (
                  <span key={i} className="bg-[#00418d]/8 text-[#00418d] text-xs px-3 py-1 rounded-full font-semibold">
                    {s.name || s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile?.resume && (
            <div className="col-span-2 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">Resume</p>
              <p className="text-green-600 text-sm font-semibold flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                Resume uploaded
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Login tabs ─────────────────────────────────────────────────────────────────
function LoginTabs({ onEmployerLogin, onEmployeeLogin }: {
  onEmployerLogin: () => void;
  onEmployeeLogin: (user: any) => void;
}) {
  const [activeTab, setActiveTab] = useState<"employer" | "employee">("employer");

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-2 mb-5 bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm">
        {([
          { key: "employer" as const, label: "Employer Login", icon: "🏢" },
          { key: "employee" as const, label: "Employee Login", icon: "👤" },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === t.key
                ? "bg-[#0a1628] text-white shadow-sm"
                : "text-gray-500 hover:text-[#00418d] hover:bg-[#00418d]/5"
            }`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Panel — dark card style matching auth form's dark theme */}
      <div className="bg-[#0a1628] rounded-3xl p-8 shadow-2xl shadow-[#0a1628]/30">
        {activeTab === "employer"
          ? <ServicesAuthForm onLogin={onEmployerLogin} />
          : <EmployeeCompanyLogin onLogin={onEmployeeLogin} />
        }
      </div>
    </div>
  );
}