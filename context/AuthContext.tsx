"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

// Hardcoded - never rely on env var at browser runtime
const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type UserRole = "employee" | "employer" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: AuthUser }>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("sk_token");
    const storedUser = localStorage.getItem("sk_user");
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        // Silently re-validate token in background
        validateToken(storedToken);
      } catch {
        clearAuth();
      }
    }
    setIsLoading(false);
  }, []);

  const validateToken = async (accessToken: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) { clearAuth(); return; }
      const data = await res.json();
      if (data.success && data.data?.user) {
        setUser(data.data.user);
        localStorage.setItem("sk_user", JSON.stringify(data.data.user));
      } else {
        clearAuth();
      }
    } catch {
      // Network error — keep existing cached user, don't log out
    }
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("sk_token");
    localStorage.removeItem("sk_refresh");
    localStorage.removeItem("sk_user");
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        const { user: userData, accessToken, refreshToken } = data.data;
        setToken(accessToken);
        setUser(userData);
        localStorage.setItem("sk_token", accessToken);
        localStorage.setItem("sk_refresh", refreshToken);
        localStorage.setItem("sk_user", JSON.stringify(userData));
        return { success: true, message: data.message, user: userData };
      }
      return { success: false, message: data.message || "Login failed" };
    } catch {
      return { success: false, message: "Network error. Is the backend running?" };
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (data.success) {
        const { user: userData, accessToken, refreshToken } = data.data;
        setToken(accessToken);
        setUser(userData);
        localStorage.setItem("sk_token", accessToken);
        localStorage.setItem("sk_refresh", refreshToken);
        localStorage.setItem("sk_user", JSON.stringify(userData));
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || "Registration failed" };
    } catch {
      return { success: false, message: "Network error. Is the backend running?" };
    }
  };

  const logout = useCallback(() => { clearAuth(); }, []);

  const refreshUser = useCallback(async () => {
    const t = localStorage.getItem("sk_token");
    if (t) await validateToken(t);
  }, []);

  const authFetch = useCallback(
    (url: string, options: RequestInit = {}) => {
      const t = token || localStorage.getItem("sk_token");
      return fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          ...(t ? { Authorization: `Bearer ${t}` } : {}),
        },
      });
    },
    [token]
  );

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, token, login, register, logout, refreshUser, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
// ─── Alias for components that use isAuthenticated instead of isLoggedIn ───
// Export a convenience hook variant
export function useAuthCompat() {
  const ctx = useAuth();
  return { ...ctx, isAuthenticated: ctx.isLoggedIn, accessToken: ctx.token };
}

// ─── API helper functions (require token from localStorage) ──────────────────
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiCall(
  path: string,
  options: RequestInit = {}
): Promise<{ ok: boolean; data: any }> {
  const token = localStorage.getItem("sk_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch {
    return { ok: false, data: { message: "Network error" } };
  }
}

export async function apiUpload(
  path: string,
  formData: FormData
): Promise<{ ok: boolean; data: any }> {
  const token = localStorage.getItem("sk_token");
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers,
      body: formData,
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch {
    return { ok: false, data: { message: "Network error" } };
  }
}

