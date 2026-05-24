"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle, LogOut, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type View = "login" | "signup";
type UserType = "employee" | "employer";
interface FormErrors { email?: string; password?: string; name?: string; general?: string; }

const GOOGLE_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/google`;

export default function LoginSection() {
  const router = useRouter();
  const { login, register, user, isLoggedIn, logout } = useAuth();
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<UserType>("employee");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email";
    if (!password) newErrors.password = "Password is required";
    else if (view === "signup" && password.length < 8) newErrors.password = "Minimum 8 characters";
    if (view === "signup" && !name.trim()) newErrors.name = "Full name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setErrors({});
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) setErrors({ general: result.message || "Invalid email or password." });
    } catch { setErrors({ general: "Login failed. Please try again." }); }
    finally { setIsLoading(false); }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); setErrors({});
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const result = await register(name, email, password, userType);
      if (!result.success) setErrors({ general: result.message || "Registration failed." });
    } catch { setErrors({ general: "Registration failed. Please try again." }); }
    finally { setIsLoading(false); }
  };

  const switchView = (v: View) => { setView(v); setEmail(""); setPassword(""); setName(""); setErrors({}); };

  /* Shared input class */
  const inputClass = (err?: string) =>
    `w-full bg-white/10 text-white placeholder-white/40 border ${err ? "border-red-400" : "border-white/20"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f6c648]/60 focus:border-transparent transition-all duration-200`;

  return (
    /* Seamlessly blends from white testimonials section */
    <section className="bg-[#f0f7ff] sk-section-sm">
      <div className="sk-container">
        <div className="max-w-5xl mx-auto">
          <div className="sk-card overflow-hidden flex flex-col md:flex-row min-h-[520px] rounded-3xl shadow-2xl shadow-[#0a1628]/10">

            {/* Left — illustration */}
            <div className="w-full md:w-[48%] bg-white flex items-center justify-center p-8">
              <Image
                src="/images/homepage/undraw_online-test_cqv0.svg"
                alt="Skill Assessment"
                width={520}
                height={400}
                className="w-full h-auto max-h-[400px] object-contain"
                priority
              />
            </div>

            {/* Right — auth panel */}
            <div className="w-full md:w-[52%] bg-[#00418d] p-8 md:p-10 flex items-center">
              <div className="w-full">

                {/* Logged in state */}
                {isLoggedIn && user ? (
                  <div className="text-center text-white">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle className="w-9 h-9 text-green-400" />
                    </div>
                    <h3 className="sk-h3 text-white mb-1.5">Welcome back!</h3>
                    <p className="text-white/60 text-sm mb-6">You're signed in to SkillKwiz</p>
                    <div className="bg-white/10 rounded-2xl p-5 mb-6 text-left space-y-2">
                      {[
                        { label: "Name", value: user.name },
                        { label: "Email", value: user.email },
                        { label: "Role", value: user.role },
                      ].map((r) => (
                        <p key={r.label} className="text-sm">
                          <span className="text-white/50">{r.label}: </span>
                          <span className="font-semibold capitalize">{r.value}</span>
                        </p>
                      ))}
                    </div>
                    <div className="flex flex-col gap-3">
                      <button onClick={() => router.push("/services")} className="btn-cta btn-md w-full justify-center">
                        Go to Dashboard <ArrowRight className="w-4 h-4" />
                      </button>
                      <button onClick={logout} className="btn-ghost-white btn-md w-full justify-center">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Toggle tabs */}
                    <div className="flex rounded-xl overflow-hidden mb-7 border border-white/20 p-1 bg-white/8">
                      {(["login", "signup"] as View[]).map((v) => (
                        <button
                          key={v}
                          onClick={() => switchView(v)}
                          disabled={isLoading}
                          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 ${
                            view === v ? "bg-white text-[#00418d] shadow-sm" : "text-white/70 hover:text-white"
                          }`}
                        >
                          {v === "login" ? "Sign In" : "Register"}
                        </button>
                      ))}
                    </div>

                    <h2 className="sk-h3 text-white mb-6">
                      {view === "login" ? "Welcome Back!" : "Create Account"}
                    </h2>

                    {errors.general && (
                      <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-3.5 mb-5 flex items-center gap-2.5">
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span className="text-red-300 text-sm">{errors.general}</span>
                      </div>
                    )}

                    {view === "login" ? (
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <input type="email" placeholder="Email address" value={email} disabled={isLoading}
                            onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                            className={inputClass(errors.email)} />
                          {errors.email && <p className="text-red-300 text-xs mt-1.5 flex items-center gap-1"><XCircle className="w-3 h-3" />{errors.email}</p>}
                        </div>
                        <div className="relative">
                          <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} disabled={isLoading}
                            onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }}
                            className={`${inputClass(errors.password)} pr-12`} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                            {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                          </button>
                          {errors.password && <p className="text-red-300 text-xs mt-1.5 flex items-center gap-1"><XCircle className="w-3 h-3" />{errors.password}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center text-white/60 text-sm gap-2 cursor-pointer">
                            <input type="checkbox" className="accent-[#f6c648] rounded" disabled={isLoading} /> Remember me
                          </label>
                          <button type="button" className="text-[#f6c648] hover:text-[#e5b23d] text-sm transition-colors" disabled={isLoading}>
                            Forgot password?
                          </button>
                        </div>
                        <button type="submit" disabled={isLoading} className="btn-cta btn-md w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed rounded-xl">
                          {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing In…</> : "Sign In"}
                        </button>
                        <div className="text-center">
                          <p className="text-white/40 text-xs mb-3">— or continue with —</p>
                          <div className="flex justify-center">
                            <a href={GOOGLE_AUTH_URL} className="w-11 h-11 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-md">
                              <svg width="20" height="20" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                              </svg>
                            </a>
                          </div>
                        </div>
                        <p className="text-center text-white/50 text-sm">
                          Don't have an account?{" "}
                          <button type="button" onClick={() => switchView("signup")} className="text-[#f6c648] hover:text-[#e5b23d] font-semibold transition-colors" disabled={isLoading}>
                            Sign up free
                          </button>
                        </p>
                      </form>
                    ) : (
                      <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                          <input type="text" placeholder="Full Name" value={name} disabled={isLoading}
                            onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: undefined }); }}
                            className={inputClass(errors.name)} />
                          {errors.name && <p className="text-red-300 text-xs mt-1.5 flex items-center gap-1"><XCircle className="w-3 h-3" />{errors.name}</p>}
                        </div>
                        <div>
                          <input type="email" placeholder="Email address" value={email} disabled={isLoading}
                            onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                            className={inputClass(errors.email)} />
                          {errors.email && <p className="text-red-300 text-xs mt-1.5 flex items-center gap-1"><XCircle className="w-3 h-3" />{errors.email}</p>}
                        </div>
                        <div className="relative">
                          <input type={showPassword ? "text" : "password"} placeholder="Password (min. 8 characters)" value={password} disabled={isLoading}
                            onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }}
                            className={`${inputClass(errors.password)} pr-12`} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                            {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                          </button>
                          {errors.password && <p className="text-red-300 text-xs mt-1.5 flex items-center gap-1"><XCircle className="w-3 h-3" />{errors.password}</p>}
                        </div>
                        <div>
                          <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2.5">Account Type</label>
                          <div className="flex gap-3">
                            {(["employee", "employer"] as const).map((type) => (
                              <button key={type} type="button" onClick={() => setUserType(type)} disabled={isLoading}
                                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                                  userType === type
                                    ? "bg-[#f6c648] text-[#00418d]"
                                    : "bg-white/10 text-white/70 border border-white/20 hover:bg-white/18"
                                }`}>
                                {type === "employee" ? "👤 Employee" : "🏢 Employer"}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button type="submit" disabled={isLoading} className="btn-cta btn-md w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed rounded-xl">
                          {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Creating…</> : "Create Account"}
                        </button>
                        <p className="text-center text-white/50 text-sm">
                          Already have an account?{" "}
                          <button type="button" onClick={() => switchView("login")} className="text-[#f6c648] hover:text-[#e5b23d] font-semibold transition-colors" disabled={isLoading}>
                            Sign in
                          </button>
                        </p>
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}