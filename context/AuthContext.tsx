"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Single source of truth for API URL - reads from env at build time
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "employee" | "employer" | "admin";
  avatar?: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: AuthUser }>;
  register: (name: string, email: string, password: string, role: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("sk_token");
    const storedUser = localStorage.getItem("sk_user");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        verifyToken(storedToken);
      } catch {
        clearAuth();
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (tk: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${tk}` },
      });
      if (res.ok) {
        const data = await res.json();
        const u = data.data?.user || data.user;
        if (u) {
          setUser(u);
          localStorage.setItem("sk_user", JSON.stringify(u));
        } else {
          clearAuth();
        }
      } else {
        clearAuth();
      }
    } catch {
      // Network error — keep stored user offline
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("sk_token");
    localStorage.removeItem("sk_refresh_token");
    localStorage.removeItem("sk_user");
  };

  const saveAuth = (userData: AuthUser, accessToken: string, refreshToken?: string) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("sk_token", accessToken);
    localStorage.setItem("sk_user", JSON.stringify(userData));
    if (refreshToken) localStorage.setItem("sk_refresh_token", refreshToken);
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || "Login failed" };
      const userData: AuthUser = data.data?.user || data.user;
      const accessToken: string = data.data?.accessToken || data.accessToken;
      const refreshToken: string = data.data?.refreshToken || data.refreshToken;
      saveAuth(userData, accessToken, refreshToken);
      return { success: true, message: data.message || "Login successful", user: userData };
    } catch {
      return { success: false, message: "Network error. Please check your connection." };
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || "Registration failed" };
      const userData: AuthUser = data.data?.user || data.user;
      const accessToken: string = data.data?.accessToken || data.accessToken;
      const refreshToken: string = data.data?.refreshToken || data.refreshToken;
      saveAuth(userData, accessToken, refreshToken);
      return { success: true, message: data.message || "Account created" };
    } catch {
      return { success: false, message: "Network error. Please check your connection." };
    }
  };

  const logout = () => clearAuth();

  const refreshUser = async () => {
    const tk = localStorage.getItem("sk_token");
    if (tk) await verifyToken(tk);
  };

  return (
    <AuthContext.Provider value={{
      user, token, isLoggedIn: !!user, isLoading,
      login, register, logout, refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// ─── Shared API helpers used across all components ───────────────────────────
export async function apiCall(path: string, options: RequestInit = {}): Promise<{ ok: boolean; data: any }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("sk_token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch {
    return { ok: false, data: { message: "Network error. Please check your connection." } };
  }
}

export async function apiUpload(path: string, formData: FormData): Promise<{ ok: boolean; data: any }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("sk_token") : null;
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch {
    return { ok: false, data: { message: "Network error. Please check your connection." } };
  }
}