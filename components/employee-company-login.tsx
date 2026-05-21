"use client";

import { useState } from "react";
import { Loader2, Eye, EyeOff, Building2, User, Key } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface EmployeeCompanyLoginProps {
  onLogin: (user: any, token: string) => void;
}

export default function EmployeeCompanyLogin({ onLogin }: EmployeeCompanyLoginProps) {
  const [companyCode, setCompanyCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!companyCode.trim() || !username.trim() || !password) {
      setError("All fields are required"); return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/employee-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyCode: companyCode.toUpperCase().trim(), username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Login failed"); return; }
      localStorage.setItem("sk_ce_token", data.data.accessToken);
      localStorage.setItem("sk_ce_refresh_token", data.data.refreshToken);
      localStorage.setItem("sk_user", JSON.stringify(data.data.user));
      onLogin(data.data.user, data.data.accessToken);
    } catch { setError("Network error. Please try again."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="text-white">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
          <Building2 className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold">Employee Login</h2>
        <p className="text-gray-400 text-sm mt-1">Use credentials provided by your employer</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1.5">Company Code</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input type="text" value={companyCode}
              onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
              placeholder="e.g. TCS-X7K2"
              className="w-full bg-[#1a2540] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 uppercase tracking-widest font-mono text-lg"
              disabled={isLoading} maxLength={12} />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1.5">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input type="text" value={username}
              onChange={(e) => setUsername(e.target.value.toUpperCase())}
              placeholder="e.g. TCS-001"
              className="w-full bg-[#1a2540] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 uppercase font-mono"
              disabled={isLoading} />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1.5">Password</label>
          <div className="relative">
            <Key className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input type={showPassword ? "text" : "password"} value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-[#1a2540] border border-white/10 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
              disabled={isLoading} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-white">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
          {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Logging in...</> : "Login to Assessment Portal"}
        </button>
      </form>

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-blue-300 text-xs text-center">
          Don't have credentials? Contact your HR/Employer to get your login details.
        </p>
      </div>
    </div>
  );
}