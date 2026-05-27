// app/auth/callback/page.tsx
// Handles Google OAuth callback + manual login redirects.
// After storing the JWT, redirects each role to its dashboard.
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const ROLE_REDIRECT: Record<string, string> = {
  employer:        "/dashboard/employer/overview",
  admin:           "/dashboard/admin/overview",
  employee:        "/dashboard/employee/booking",
  companyEmployee: "/dashboard/employee/booking",
};

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status,  setStatus]  = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Completing sign-in...");

  useEffect(() => {
    const API_BASE =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const accessToken  = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const error        = searchParams.get("error");
    const reason       = searchParams.get("reason");

    // ── Session-expired / unauthenticated redirects back here ────────────────
    if (reason === "session_expired" || reason === "unauthenticated" || reason === "invalid_token") {
      // Clear stale tokens
      localStorage.removeItem("sk_token");
      localStorage.removeItem("sk_refresh_token");
      localStorage.removeItem("sk_user");
      document.cookie = "sk_token=; path=/; max-age=0";
      setStatus("error");
      setMessage("Your session has expired. Please sign in again.");
      return;
    }

    // ── Google OAuth error ───────────────────────────────────────────────────
    if (error) {
      setStatus("error");
      setMessage("Google sign-in was cancelled or failed. Please try again.");
      return;
    }

    // ── No tokens — nothing to handle ────────────────────────────────────────
    if (!accessToken || !refreshToken) {
      setStatus("error");
      setMessage("Missing authentication tokens. Redirecting...");
      return;
    }

    // ── Store tokens ─────────────────────────────────────────────────────────
    localStorage.setItem("sk_token",         accessToken);
    localStorage.setItem("sk_refresh_token", refreshToken);
    // Also write to cookie so middleware can read it
    document.cookie = `sk_token=${accessToken}; path=/; SameSite=Strict`;

    // ── Fetch user profile to determine role ──────────────────────────────────
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.user) {
          const user = data.data.user;
          localStorage.setItem("sk_user", JSON.stringify(user));

          const role = user.isCompanyEmployee ? "companyEmployee" : (user.role ?? "employer");
          const destination = ROLE_REDIRECT[role] ?? "/dashboard/employer/overview";

          setStatus("success");
          setMessage(`Welcome, ${user.name || "back"}! Redirecting…`);
          setTimeout(() => router.replace(destination), 1200);
        } else {
          throw new Error("Failed to fetch user");
        }
      })
      .catch(() => {
        // Tokens are stored — decode role from JWT as fallback
        try {
          const payload = JSON.parse(
            atob(accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
          );
          const role = payload.isCompanyEmployee ? "companyEmployee" : (payload.role ?? "employer");
          const destination = ROLE_REDIRECT[role] ?? "/dashboard/employer/overview";
          setStatus("success");
          setMessage("Signed in! Redirecting…");
          setTimeout(() => router.replace(destination), 1200);
        } catch {
          // Last resort
          setStatus("success");
          setMessage("Signed in! Redirecting…");
          setTimeout(() => router.replace("/dashboard/employer/overview"), 1200);
        }
      });
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-[#050e2d] flex items-center justify-center">
      <div className="text-center text-white px-6 max-w-sm w-full">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Signing you in…</h2>
            <p className="text-gray-400 text-sm">{message}</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Signed in!</h2>
            <p className="text-gray-400 text-sm">{message}</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Sign-in failed</h2>
            <p className="text-gray-400 text-sm mb-6">{message}</p>
            <button
              onClick={() => router.push("/services")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold
                px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}