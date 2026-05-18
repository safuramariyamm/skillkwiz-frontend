"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Building, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API_BASE = "http://localhost:5000/api";

interface ServicesAuthFormProps {
  onLogin: (userType: "employer" | "employee") => void;
}

type View = "login" | "signup" | "otp";
type UserType = "employee" | "employer";

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  emailOtp?: string;
  phoneOtp?: string;
  general?: string;
}

export default function ServicesAuthForm({ onLogin }: ServicesAuthFormProps) {
  const { login, register } = useAuth();
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<UserType>("employee");
  const [phone, setPhone] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  const validateLogin = () => {
    const newErrors: FormErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  };

  const validateSignup = () => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    else if (phone.length < 10) newErrors.phone = "Invalid phone number";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  };

  const sendOtp = async (identifier: string, type: "email" | "phone") => {
    setIsSendingOtp(true);
    try {
      const res = await fetch(`${API_BASE}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, type, purpose: "registration" }),
      });
      const data = await res.json();
      if (!data.success) { setErrors((p) => ({ ...p, general: data.message || "Failed to send OTP" })); return false; }
      return true;
    } catch { setErrors((p) => ({ ...p, general: "Failed to send OTP" })); return false; }
    finally { setIsSendingOtp(false); }
  };

  const verifyOtp = async (identifier: string, type: "email" | "phone", otp: string) => {
    try {
      const res = await fetch(`${API_BASE}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, type, otp }),
      });
      const data = await res.json();
      return data.success;
    } catch { return false; }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateLogin()) return;
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success && result.user) {
        onLogin(result.user.role === "employer" ? "employer" : "employee");
      } else {
        setErrors({ general: result.message || "Invalid email or password." });
      }
    } catch { setErrors({ general: "Login failed. Please try again." }); }
    finally { setIsLoading(false); }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateSignup()) return;
    setIsLoading(true);
    try {
      const emailOtpSent = await sendOtp(email, "email");
      if (!emailOtpSent) { setIsLoading(false); return; }
      const phoneOtpSent = await sendOtp(phone, "phone");
      if (!phoneOtpSent) { setIsLoading(false); return; }
      setView("otp");
    } catch { setErrors({ general: "Failed to initiate registration." }); }
    finally { setIsLoading(false); }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!emailOtp.trim() || !phoneOtp.trim()) { setErrors({ general: "Please enter both OTP codes" }); return; }
    setIsLoading(true);
    try {
      const [emailVerified, phoneVerified] = await Promise.all([
        verifyOtp(email, "email", emailOtp),
        verifyOtp(phone, "phone", phoneOtp),
      ]);
      if (!emailVerified || !phoneVerified) { setErrors({ general: "Invalid OTP. Please check and try again." }); return; }
      const result = await register(name, email, password, userType);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => onLogin(userType), 1500);
      } else {
        setErrors({ general: result.message || "Registration failed." });
      }
    } catch { setErrors({ general: "Registration failed. Please try again." }); }
    finally { setIsLoading(false); }
  };

  const resetForm = () => { setEmail(""); setPassword(""); setName(""); setPhone(""); setEmailOtp(""); setPhoneOtp(""); setErrors({}); setSuccess(false); };
  const switchView = (v: View) => { setView(v); resetForm(); };

  const inputClass = (field?: string) => `w-full bg-[#333333] rounded pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors ${field ? "ring-2 ring-red-400 bg-red-900/20" : "focus:ring-2 focus:ring-blue-400"}`;

  return (
    <div className="text-white">
      {/* Login / Register Toggle */}
      {view !== "otp" && (
        <div className="flex rounded-lg overflow-hidden mb-6 border border-white/20">
          <button onClick={() => switchView("login")} disabled={isLoading}
            className={`flex-1 py-3 text-sm font-semibold transition-all disabled:opacity-50 ${view === "login" ? "bg-white text-[#00418d]" : "text-white hover:bg-white/10"}`}>
            Sign In
          </button>
          <button onClick={() => switchView("signup")} disabled={isLoading}
            className={`flex-1 py-3 text-sm font-semibold transition-all disabled:opacity-50 ${view === "signup" ? "bg-white text-[#00418d]" : "text-white hover:bg-white/10"}`}>
            Register
          </button>
        </div>
      )}

      <h1 className="text-3xl font-semibold text-center mb-2">
        {view === "login" ? "Sign In" : view === "signup" ? "Create Account" : "Verify OTP"}
      </h1>
      <p className="text-center text-gray-300 mb-6">
        {view === "login" ? "Sign in to access your account" : view === "signup" ? "Join SkillKwiz to get started" : "Enter the codes sent to your email and phone"}
      </p>

      {success && <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-4 text-center text-green-300">Account created! Signing you in...</div>}
      {errors.general && <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4"><p className="text-red-300 text-sm">{errors.general}</p></div>}

      {/* LOGIN FORM */}
      {view === "login" && (
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-2">Email</label>
            <div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Mail className="w-5 h-5 text-gray-400" /></div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className={inputClass(errors.email)} disabled={isLoading} required />
            </div>
            {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block mb-2">Password</label>
            <div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Lock className="w-5 h-5 text-gray-400" /></div>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className={`${inputClass(errors.password)} pr-10`} disabled={isLoading} required />
              <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
            {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password}</p>}
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 rounded bg-gradient-to-r from-[#4ECDC4] to-[#2d8a84] text-white hover:opacity-90 font-medium disabled:opacity-50 flex items-center justify-center gap-2">
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing In...</> : "Sign In"}
          </button>
          <a href="http://localhost:5000/api/auth/google" className="w-full py-3 rounded border border-gray-500 text-white hover:bg-white/10 font-medium flex items-center justify-center gap-2 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </a>
          <p className="text-center text-gray-300 text-sm">Don&apos;t have an account? <button type="button" onClick={() => switchView("signup")} className="text-blue-400 hover:text-blue-300" disabled={isLoading}>Sign up</button></p>
        </form>
      )}

      {/* SIGNUP FORM */}
      {view === "signup" && (
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button type="button" onClick={() => setUserType("employee")} disabled={isLoading}
              className={`flex items-center justify-center py-3 rounded-md text-white transition-all ${userType === "employee" ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-gray-600/80 hover:bg-gray-500/80"} disabled:opacity-50`}>
              <User className="mr-2 w-4 h-4" /> Employee
            </button>
            <button type="button" onClick={() => setUserType("employer")} disabled={isLoading}
              className={`flex items-center justify-center py-3 rounded-md text-white transition-all ${userType === "employer" ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-gray-600/80 hover:bg-gray-500/80"} disabled:opacity-50`}>
              <Building className="mr-2 w-4 h-4" /> Employer
            </button>
          </div>
          <div>
            <label className="block mb-2">Full Name</label>
            <div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><User className="w-5 h-5 text-gray-400" /></div>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className={inputClass(errors.name)} disabled={isLoading} required />
            </div>
            {errors.name && <p className="text-red-300 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block mb-2">Email</label>
            <div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Mail className="w-5 h-5 text-gray-400" /></div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className={inputClass(errors.email)} disabled={isLoading} required />
            </div>
            {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block mb-2">Phone Number</label>
            <div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><span className="text-gray-400 text-sm">📱</span></div>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone with country code" className={inputClass(errors.phone)} disabled={isLoading} required />
            </div>
            {errors.phone && <p className="text-red-300 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block mb-2">Password (min. 8 characters)</label>
            <div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Lock className="w-5 h-5 text-gray-400" /></div>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className={`${inputClass(errors.password)} pr-10`} disabled={isLoading} required />
              <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
            {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password}</p>}
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 rounded bg-gradient-to-r from-[#4ECDC4] to-[#2d8a84] text-white hover:opacity-90 font-medium disabled:opacity-50 flex items-center justify-center gap-2">
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Sending OTP...</> : "Create Account"}
          </button>
          <p className="text-center text-gray-300 text-sm">Already have an account? <button type="button" onClick={() => switchView("login")} className="text-blue-400 hover:text-blue-300" disabled={isLoading}>Sign In</button></p>
        </form>
      )}

      {/* OTP FORM */}
      {view === "otp" && (
        <form onSubmit={handleOtpVerification} className="space-y-5">
          <div>
            <label className="block mb-2">Email OTP (sent to {email})</label>
            <input type="text" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} placeholder="6-digit code" maxLength={6}
              className="w-full bg-[#333333] rounded px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400" disabled={isLoading} />
            <button type="button" onClick={() => sendOtp(email, "email")} disabled={isSendingOtp} className="text-blue-400 text-sm mt-1 disabled:opacity-50">
              {isSendingOtp ? "Sending..." : "Resend Email OTP"}
            </button>
          </div>
          <div>
            <label className="block mb-2">Phone OTP (sent to {phone})</label>
            <input type="text" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} placeholder="6-digit code" maxLength={6}
              className="w-full bg-[#333333] rounded px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400" disabled={isLoading} />
            <button type="button" onClick={() => sendOtp(phone, "phone")} disabled={isSendingOtp} className="text-blue-400 text-sm mt-1 disabled:opacity-50">
              {isSendingOtp ? "Sending..." : "Resend Phone OTP"}
            </button>
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 rounded bg-gradient-to-r from-[#4ECDC4] to-[#2d8a84] text-white hover:opacity-90 font-medium disabled:opacity-50 flex items-center justify-center gap-2">
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Verifying...</> : "Verify & Complete Registration"}
          </button>
          <p className="text-center text-gray-300 text-sm">
            <button type="button" onClick={() => switchView("signup")} className="text-blue-400 hover:text-blue-300" disabled={isLoading}>← Back to Registration</button>
          </p>
        </form>
      )}
    </div>
  );
}
