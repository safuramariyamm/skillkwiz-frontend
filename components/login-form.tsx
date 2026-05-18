"use client";

import type React from "react";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface LoginFormProps {
  onLogin: (userType: "employer" | "employee") => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"employer" | "employee">("employee");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email address";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success && result.user) {
        const resolvedType: "employer" | "employee" =
          result.user.role === "employer" ? "employer" : "employee";
        onLogin(resolvedType);
      } else {
        setErrors({ general: result.message || "Invalid email or password." });
      }
    } catch {
      setErrors({ general: "Login failed. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-white">
      <h1 className="text-3xl font-semibold text-center mb-2">Login</h1>
      <p className="text-center text-gray-300 mb-8">Sign in to access your account</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-300 text-sm">{errors.general}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button type="button" onClick={() => setUserType("employee")} disabled={isLoading}
            className={`flex items-center justify-center py-3 px-6 rounded-md text-white transition-all ${userType === "employee" ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg" : "bg-gradient-to-r from-gray-500/80 to-gray-600/80 hover:from-gray-400/80 hover:to-gray-500/80"} disabled:opacity-50`}>
            <span className="mr-2">👤</span> Employee
          </button>
          <button type="button" onClick={() => setUserType("employer")} disabled={isLoading}
            className={`flex items-center justify-center py-3 px-6 rounded-md text-white transition-all ${userType === "employer" ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg" : "bg-gradient-to-r from-gray-500/80 to-gray-600/80 hover:from-gray-400/80 hover:to-gray-500/80"} disabled:opacity-50`}>
            <span className="mr-2">🏢</span> Employer
          </button>
        </div>

        <div>
          <label htmlFor="email" className="block mb-2">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input id="email" type="email" value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
              placeholder="Enter your email"
              className={`w-full bg-[#333333] rounded pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors ${errors.email ? "ring-2 ring-red-400 bg-red-900/20" : "focus:ring-2 focus:ring-blue-400"}`}
              disabled={isLoading} required />
          </div>
          {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block mb-2">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input id="password" type={showPassword ? "text" : "password"} value={password}
              onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }}
              placeholder="Enter your password"
              className={`w-full bg-[#333333] rounded pl-10 pr-10 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors ${errors.password ? "ring-2 ring-red-400 bg-red-900/20" : "focus:ring-2 focus:ring-blue-400"}`}
              disabled={isLoading} required />
            <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-gray-300 transition-colors"
              onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
              {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
            </button>
          </div>
          {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password}</p>}
        </div>

        <div className="text-right">
          <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Forgot Password?</a>
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full py-3 rounded bg-gradient-to-r from-[#4ECDC4] to-[#2d8a84] text-white hover:opacity-90 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
          {isLoading ? (
            <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Signing In...</>
          ) : "Sign In"}
        </button>

        <a href="${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/google"
          className="w-full py-3 rounded border border-gray-500 text-white hover:bg-white/10 font-medium transition-all flex items-center justify-center gap-2">
          <span>G</span> Continue with Google
        </a>

        <div className="text-center mt-4">
          <p className="text-gray-300">
            Don&apos;t have an account?{" "}
            <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Sign Up</span>
          </p>
        </div>
      </form>
    </div>
  );
}

