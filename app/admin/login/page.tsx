"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Shield, Loader2, AlertCircle } from "lucide-react";
import { authAPI, parseAuthPayload } from "@/services/api";

const REASON_MESSAGES: Record<string, string> = {
  unauthenticated:  "Please sign in to access the admin panel.",
  session_expired:  "Your session has expired. Please sign in again.",
  invalid_token:    "Authentication error. Please sign in again.",
  unauthorized:     "You do not have permission to access that page.",
};

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [sessionNote, setSessionNote] = useState<string | null>(null);

  useEffect(() => {
    const reason = searchParams.get("reason");
    if (reason && REASON_MESSAGES[reason]) {
      setSessionNote(REASON_MESSAGES[reason]);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authAPI.login(email.trim().toLowerCase(), password);

      if (!res.ok) {
        setError(res.message || res.data?.message || "Invalid credentials.");
        setLoading(false);
        return;
      }

      const { accessToken, user } = parseAuthPayload(res.data);

      if (!accessToken || !user) {
        setError("Authentication failed. Please try again.");
        setLoading(false);
        return;
      }

      // CRITICAL: Verify role is admin before granting access
      if (user.role !== "admin") {
        setError("Access denied. This portal is for administrators only.");
        setLoading(false);
        return;
      }

      // Store token in localStorage AND cookie (cookie is used by middleware)
      localStorage.setItem("sk_token",  accessToken);
      localStorage.setItem("sk_user",   JSON.stringify(user));
      document.cookie = `sk_token=${accessToken}; path=/; SameSite=Strict`;

      router.replace("/admin/dashboard");
    } catch {
      setError("A network error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050e2d] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00418d] mb-4 shadow-lg shadow-blue-900/40">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-sm text-white/40 mt-1.5">SkillKwiz — Restricted Access</p>
        </div>

        {sessionNote && (
          <div className="flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-5">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-300">{sessionNote}</p>
          </div>
        )}

        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@skillkwiz.com"
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-[#00418d] focus:ring-1 focus:ring-[#00418d]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-[#00418d] focus:ring-1 focus:ring-[#00418d]/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-[#00418d] hover:bg-[#0052b3] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors duration-150 mt-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Signing in…</>
              ) : (
                <><Shield className="w-4 h-4" />Sign In to Admin Panel</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          Unauthorised access is strictly prohibited and monitored.
        </p>
      </div>
    </div>
  );
}