"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle, LogOut, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type View = "login" | "signup";
type UserType = "employee" | "employer";

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  general?: string;
}

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
    else if (view === "signup" && password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (view === "signup" && !name.trim()) newErrors.name = "Full name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) setErrors({ general: result.message || "Invalid email or password." });
      // On success, AuthContext updates globally — no redirect needed, form replaces with welcome card
    } catch {
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const result = await register(name, email, password, userType);
      if (!result.success) setErrors({ general: result.message || "Registration failed." });
    } catch {
      setErrors({ general: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const switchView = (v: View) => {
    setView(v); setEmail(""); setPassword(""); setName(""); setErrors({});
  };

  return (
    <section className="py-10 bg-[#000c2a]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]">

          {/* Left — illustration (always visible) */}
          <div className="w-full md:w-1/2 bg-white flex items-center justify-center overflow-hidden p-4">
            <Image src="/images/homepage/undraw_online-test_cqv0.svg" alt="Skill Assessment"
              width={600} height={450} className="w-full h-[450px] object-contain"
              priority fetchpriority="high" />
          </div>

          {/* Right — auth panel */}
          <div className="w-full md:w-1/2 bg-[#00418d] p-8 flex items-center">
            <div className="w-full">

              {/* ── LOGGED IN STATE ── */}
              {isLoggedIn && user ? (
                <div className="text-center text-white py-4">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  </div>
                  <h3 className="text-headingMd font-bold mb-1">Welcome back!</h3>
                  <p className="text-gray-300 mb-4">You're signed in to SkillKwiz</p>

                  <div className="bg-white/10 rounded-xl p-4 mb-6 text-left space-y-1">
                    <p className="text-body">
                      <span className="text-gray-300">Name: </span>
                      <span className="font-semibold">{user.name}</span>
                    </p>
                    <p className="text-body">
                      <span className="text-gray-300">Email: </span>
                      <span className="font-semibold">{user.email}</span>
                    </p>
                    <p className="text-body capitalize">
                      <span className="text-gray-300">Role: </span>
                      <span className="font-semibold text-blue-300">{user.role}</span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button onClick={() => router.push("/services")}
                      className="w-full flex items-center justify-center gap-2 bg-[#f73e5d] text-white py-3 rounded-lg font-semibold hover:bg-[#d62f4f] transition-all">
                      Go to My Dashboard <ArrowRight className="w-4 h-4" />
                    </button>
                    <button onClick={logout}
                      className="w-full flex items-center justify-center gap-2 bg-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/20 transition-all">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                /* ── NOT LOGGED IN → show form ── */
                <>
                  {/* Toggle */}
                  <div className="flex rounded-lg overflow-hidden mb-6 border border-white/20">
                    <button onClick={() => switchView("login")} disabled={isLoading}
                      className={`flex-1 py-3 text-body font-semibold transition-all disabled:opacity-50 ${view === "login" ? "bg-white text-[#00418d]" : "text-white hover:bg-white/10"
                        }`}>Sign In</button>
                    <button onClick={() => switchView("signup")} disabled={isLoading}
                      className={`flex-1 py-3 text-body font-semibold transition-all disabled:opacity-50 ${view === "signup" ? "bg-white text-[#00418d]" : "text-white hover:bg-white/10"
                        }`}>Register</button>
                  </div>

                  <h2 className="text-headingSm font-bold text-white mb-5">
                    {view === "login" ? "Welcome Back!" : "Create Your Account"}
                  </h2>

                  {errors.general && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span className="text-red-300 text-body">{errors.general}</span>
                    </div>
                  )}

                  {view === "login" ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <input type="email" placeholder="Email address" value={email} disabled={isLoading}
                          onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                          className={`w-full bg-gray-200 text-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 ${errors.email ? "ring-2 ring-red-400 bg-red-50" : "focus:ring-[#00a8e8]"}`} />
                        {errors.email && <p className="text-red-300 text-caption mt-1 flex items-center gap-1"><XCircle className="w-3 h-3" />{errors.email}</p>}
                      </div>

                      <div className="relative">
                        <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} disabled={isLoading}
                          onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }}
                          className={`w-full bg-gray-200 text-gray-800 p-3 pr-12 rounded-md focus:outline-none focus:ring-2 ${errors.password ? "ring-2 ring-red-400 bg-red-50" : "focus:ring-[#00a8e8]"}`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        {errors.password && <p className="text-red-300 text-caption mt-1 flex items-center gap-1"><XCircle className="w-3 h-3" />{errors.password}</p>}
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center text-white text-body gap-2">
                          <input type="checkbox" className="accent-[#f73e5d]" disabled={isLoading} /> Remember me
                        </label>
                        <button type="button" className="text-blue-300 hover:underline text-body" disabled={isLoading}>Forgot Password?</button>
                      </div>

                      <button type="submit" disabled={isLoading}
                        className="w-full bg-[#f73e5d] text-white p-3 rounded-md font-semibold hover:bg-[#d62f4f] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Signing In...</> : "Sign In"}
                      </button>

                      <div className="text-center text-white text-body">
                        <p className="mb-3 text-gray-300">— Or continue with —</p>
                        <div className="flex justify-center">
                          <a href={GOOGLE_AUTH_URL}
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-md">
                            <svg width="22" height="22" viewBox="0 0 24 24">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                          </a>
                        </div>
                      </div>

                      <p className="text-center text-gray-300 text-body">
                        Don't have an account?{" "}
                        <button type="button" onClick={() => switchView("signup")} className="text-blue-300 hover:underline" disabled={isLoading}>Sign up</button>
                      </p>
                    </form>
                  ) : (
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div>
                        <input type="text" placeholder="Full Name" value={name} disabled={isLoading}
                          onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: undefined }); }}
                          className={`w-full bg-gray-200 text-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 ${errors.name ? "ring-2 ring-red-400 bg-red-50" : "focus:ring-[#00a8e8]"}`} />
                        {errors.name && <p className="text-red-300 text-caption mt-1 flex items-center gap-1"><XCircle className="w-3 h-3" />{errors.name}</p>}
                      </div>

                      <div>
                        <input type="email" placeholder="Email address" value={email} disabled={isLoading}
                          onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                          className={`w-full bg-gray-200 text-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 ${errors.email ? "ring-2 ring-red-400 bg-red-50" : "focus:ring-[#00a8e8]"}`} />
                        {errors.email && <p className="text-red-300 text-caption mt-1 flex items-center gap-1"><XCircle className="w-3 h-3" />{errors.email}</p>}
                      </div>

                      <div className="relative">
                        <input type={showPassword ? "text" : "password"} placeholder="Password (min. 8 characters)" value={password} disabled={isLoading}
                          onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }}
                          className={`w-full bg-gray-200 text-gray-800 p-3 pr-12 rounded-md focus:outline-none focus:ring-2 ${errors.password ? "ring-2 ring-red-400 bg-red-50" : "focus:ring-[#00a8e8]"}`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        {errors.password && <p className="text-red-300 text-caption mt-1 flex items-center gap-1"><XCircle className="w-3 h-3" />{errors.password}</p>}
                      </div>

                      <div>
                        <label className="block text-white text-body mb-2">Account Type</label>
                        <div className="flex gap-3">
                          {(["employee", "employer"] as const).map((type) => (
                            <button key={type} type="button" onClick={() => setUserType(type)} disabled={isLoading}
                              className={`flex-1 py-3 rounded-md text-body font-medium transition-all flex items-center justify-center gap-2 ${userType === type ? "bg-[#f73e5d] text-white border-2 border-[#f73e5d]" : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                                }`}>
                              {type === "employee" ? "👤 Employee" : "🏢 Employer"}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button type="submit" disabled={isLoading}
                        className="w-full bg-[#f73e5d] text-white p-3 rounded-md font-semibold hover:bg-[#d62f4f] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Creating Account...</> : "Create Account"}
                      </button>

                      <p className="text-center text-gray-300 text-body">
                        Already have an account?{" "}
                        <button type="button" onClick={() => switchView("login")} className="text-blue-300 hover:underline" disabled={isLoading}>Sign in</button>
                      </p>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

