"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Completing sign-in...");

  useEffect(() => {
    // Resolve API base only on client side to avoid SSR empty env
    const API_BASE =
      (typeof window !== "undefined" && (window as any).__NEXT_PUBLIC_API_URL__) ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      setMessage("Google sign-in was cancelled or failed. Please try again.");
      setTimeout(() => router.replace("/services"), 3000);
      return;
    }

    if (!accessToken || !refreshToken) {
      setStatus("error");
      setMessage("Missing authentication tokens. Redirecting...");
      setTimeout(() => router.replace("/services"), 3000);
      return;
    }

    // Store tokens immediately
    localStorage.setItem("sk_token", accessToken);
    localStorage.setItem("sk_refresh", refreshToken);

    // Fetch user info — use explicit full URL to avoid relative path pitfall
    const meUrl = `${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/me`;

    fetch(meUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.user) {
          localStorage.setItem("sk_user", JSON.stringify(data.data.user));
          setStatus("success");
          setMessage(`Welcome, ${data.data.user.name}! Redirecting to dashboard...`);
          setTimeout(() => router.replace("/services"), 1500);
        } else {
          throw new Error("Failed to fetch user");
        }
      })
      .catch((err) => {
        console.error("Auth callback error:", err);
        // Tokens are stored — redirect anyway; AuthContext will pick them up
        setStatus("success");
        setMessage("Signed in! Redirecting...");
        setTimeout(() => router.replace("/services"), 1500);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#050e2d] flex items-center justify-center">
      <div className="text-center text-white px-6">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Signing you in with Google...</h2>
            <p className="text-gray-400 text-sm">{message}</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Signed in successfully!</h2>
            <p className="text-gray-400 text-sm">{message}</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Sign-in failed</h2>
            <p className="text-gray-400 text-sm">{message}</p>
            <button onClick={() => router.replace("/services")}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

