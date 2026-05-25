"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface LoginFormProps {
  onLogin: (userType: "employer" | "employee") => void;
}

const GOOGLE_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/google`;

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
    if (!email.trim()) newErrors.email = "Email required";
    else if (!emailRegex.test(email)) newErrors.email = "Valid email required";
    if (!password) newErrors.password = "Password required";
    else if (password.length < 6) newErrors.password = "Min 6 characters";
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
        onLogin(result.user.role === "employer" ? "employer" : "employee");
      } else {
        setErrors({ general: result.message || "Invalid email or password." });
      }
    } catch {
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full bg-[#333333] rounded pl-10 pr-10 py-2.5 text-white placeholder-gray-400 focus:outline-none transition-colors ${
      hasError ? "ring-2 ring-red-400 bg-red-900/20" : "focus:ring-2 focus:ring-blue-400"
    }`;

  return (
    <div className="text-white">
      <h1 className="text-headingLg font-semibold text-center mb-1">Login</h1>
      <p className="text-center text-gray-300 text-sm mb-5">Sign in to access your account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2.5">
            <p className="text-red-300 text-sm">{errors.general}</p>
          </div>
        )}

        {/* User Type Toggle */}
        <div className="grid grid-cols-2 gap-3">
          {(["employee", "employer"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setUserType(type)}
              disabled={isLoading}
              className={`flex items-center justify-center py-2 rounded-md text-white transition-all text-sm ${
                userType === type
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
                  : "bg-gradient-to-r from-gray-500/80 to-gray-600/80 hover:from-gray-400/80 hover:to-gray-500/80"
              } disabled:opacity-50`}
            >
              <span className="mr-1.5">{type === "employee" ? "👤" : "🏢"}</span>
              {type === "employee" ? "Employee" : "Employer"}
            </button>
          ))}
        </div>

        {/* Email Field */}
        <div>
          <label className="block mb-1.5 text-sm">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
              placeholder="Enter your email"
              className={inputClass(!!errors.email)}
              disabled={isLoading}
              required
            />
          </div>
          {errors.email && <p className="text-red-300 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div>
          <label className="block mb-1.5 text-sm">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }}
              placeholder="Enter your password"
              className={inputClass(!!errors.password)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-gray-300"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
          {errors.password && <p className="text-red-300 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* Forgot Password */}
        <div className="text-right -mt-1">
          <a href="#" className="text-blue-400 hover:text-blue-300 text-xs">Forgot Password?</a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded bg-gradient-to-r from-[#4ECDC4] to-[#2d8a84] text-white hover:opacity-90 font-medium transition-all disabled:opacity-50 flex items-center justify-center text-sm"
        >
          {isLoading ? (
            <><div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white mr-2"></div>Signing In...</>
          ) : "Sign In"}
        </button>

        {/* Google OAuth */}
      

        {/* Sign Up Link */}
        <div className="text-center pt-1">
          <p className="text-gray-300 text-sm">
            Don&apos;t have an account?{" "}
            <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Sign Up</span>
          </p>
        </div>
      </form>
    </div>
  );
}