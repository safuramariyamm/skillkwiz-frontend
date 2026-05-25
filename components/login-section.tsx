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

  const inputStyle = (err?: string): React.CSSProperties => ({
    width: "100%", padding: "10px 14px",
    background: "#fff",
    border: `1px solid ${err ? "#f73e5d" : "#d0dff0"}`,
    borderRadius: 8, color: "#0a1628", fontSize: 13,
    outline: "none", transition: "border-color 0.2s",
    boxSizing: "border-box",
  });

  return (
    <section style={{ background: "#dceeff", overflow: "hidden" }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "clamp(28px, 4vw, 44px) clamp(16px, 4vw, 48px)",
      }}>

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <span style={{ width: 32, height: 1, background: "rgba(0,65,141,0.3)" }} />
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
            textTransform: "uppercase", color: "rgba(0,65,141,0.6)",
            fontFamily: "Georgia, serif",
          }}>Join SkillKwiz</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* LEFT — headline + illustration */}
          <div>
            <h2 style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(20px, 2.4vw, 30px)",
              fontWeight: 900, lineHeight: 1.1,
              letterSpacing: "-0.025em", color: "#0a1628",
              marginBottom: 12,
            }}>
              Start Hiring<br />
              <span style={{ color: "#00418d" }}>Smarter</span>{" "}Today
            </h2>
            <p style={{ color: "#6b7a8d", fontSize: 14, lineHeight: 1.7, marginBottom: 18, maxWidth: 360 }}>
              Join thousands of companies verifying skills with confidence. Sign in or create your account to get started.
            </p>

            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", height: 190 }}>
              <Image src="/images/homepage/undraw_online-test_cqv0.svg" alt="Skill Assessment" fill className="object-contain" style={{ padding: 16 }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,65,141,0.06) 0%, transparent 60%)" }} />
            </div>
          </div>

          {/* RIGHT — auth card */}
          <div style={{
            background: "#fff",
            border: "1px solid rgba(0,65,141,0.12)",
            borderRadius: 16,
            padding: "clamp(20px, 3vw, 32px)",
            boxShadow: "0 4px 24px rgba(0,65,141,0.08)",
          }}>
            {isLoggedIn && user ? (
              <div style={{ textAlign: "center", color: "#0a1628" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "rgba(34,197,94,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                  <CheckCircle style={{ width: 26, height: 26, color: "#22c55e" }} />
                </div>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Welcome back!</h3>
                <p style={{ color: "#8899aa", fontSize: 13, marginBottom: 20 }}>You're signed in to SkillKwiz</p>
                <div style={{
                  background: "#f0f7ff", borderRadius: 8,
                  padding: "12px 16px", marginBottom: 20, textAlign: "left",
                }}>
                  {[{ label: "Name", value: user.name }, { label: "Email", value: user.email }, { label: "Role", value: user.role }].map((r) => (
                    <p key={r.label} style={{ fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: "#8899aa" }}>{r.label}: </span>
                      <span style={{ fontWeight: 600, textTransform: "capitalize" }}>{r.value}</span>
                    </p>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button onClick={() => router.push("/services")} style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    background: "#00418d", color: "#fff",
                    fontWeight: 700, fontSize: 13, padding: "10px 20px",
                    border: "none", borderRadius: 8, cursor: "pointer",
                  }}>Go to Dashboard <ArrowRight style={{ width: 14, height: 14 }} /></button>
                  <button onClick={logout} style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    background: "transparent", color: "#6b7a8d",
                    fontWeight: 600, fontSize: 13, padding: "10px 20px",
                    border: "1px solid #d0dff0", borderRadius: 8, cursor: "pointer",
                  }}><LogOut style={{ width: 13, height: 13 }} /> Sign Out</button>
                </div>
              </div>
            ) : (
              <>
                {/* Tab switcher */}
                <div style={{
                  display: "flex", gap: 3, marginBottom: 20,
                  background: "#f0f7ff", borderRadius: 8, padding: 3,
                }}>
                  {(["login", "signup"] as View[]).map((v) => (
                    <button key={v} onClick={() => switchView(v)} disabled={isLoading} style={{
                      flex: 1, padding: "8px", fontSize: 12, fontWeight: 700,
                      border: "none", borderRadius: 6, cursor: "pointer",
                      transition: "all 0.2s",
                      background: view === v ? "#fff" : "transparent",
                      color: view === v ? "#00418d" : "#8899aa",
                      boxShadow: view === v ? "0 1px 4px rgba(0,65,141,0.12)" : "none",
                    }}>{v === "login" ? "Sign In" : "Register"}</button>
                  ))}
                </div>

                <h3 style={{
                  fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700,
                  color: "#0a1628", marginBottom: 18, letterSpacing: "-0.01em",
                }}>
                  {view === "login" ? "Welcome Back!" : "Create Account"}
                </h3>

                {errors.general && (
                  <div style={{
                    background: "rgba(247,62,93,0.08)", border: "1px solid rgba(247,62,93,0.25)",
                    borderRadius: 8, padding: "10px 14px", marginBottom: 16,
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <XCircle style={{ width: 14, height: 14, color: "#f73e5d", flexShrink: 0 }} />
                    <span style={{ color: "#f73e5d", fontSize: 12 }}>{errors.general}</span>
                  </div>
                )}

                {view === "login" ? (
                  <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                      <input type="email" placeholder="Email address" value={email} disabled={isLoading}
                        onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                        style={inputStyle(errors.email)} />
                      {errors.email && <p style={{ color: "#f73e5d", fontSize: 11, marginTop: 4 }}>{errors.email}</p>}
                    </div>
                    <div style={{ position: "relative" }}>
                      <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} disabled={isLoading}
                        onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }}
                        style={{ ...inputStyle(errors.password), paddingRight: 40 }} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", color: "#8899aa",
                      }}>
                        {showPassword ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
                      </button>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, color: "#8899aa", fontSize: 12, cursor: "pointer" }}>
                        <input type="checkbox" style={{ accentColor: "#00418d" }} /> Remember me
                      </label>
                      <button type="button" style={{ background: "none", border: "none", color: "#00418d", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                        Forgot password?
                      </button>
                    </div>
                    <button type="submit" disabled={isLoading} style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      background: "#00418d", color: "#fff",
                      fontWeight: 700, fontSize: 13, padding: "11px",
                      border: "none", borderRadius: 8, cursor: "pointer",
                      opacity: isLoading ? 0.7 : 1,
                    }}>
                      {isLoading ? <><Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />Signing In…</> : "Sign In"}
                    </button>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ color: "#c0cdd8", fontSize: 10, marginBottom: 10, letterSpacing: "0.1em" }}>— OR CONTINUE WITH —</p>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <a href={GOOGLE_AUTH_URL} style={{
                          width: 38, height: 38, background: "#fff", borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.1)", border: "1px solid #d0dff0",
                        }}>
                          <svg width="18" height="18" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                    <p style={{ textAlign: "center", color: "#8899aa", fontSize: 12 }}>
                      Don't have an account?{" "}
                      <button type="button" onClick={() => switchView("signup")} style={{
                        background: "none", border: "none", color: "#00418d", fontWeight: 700, cursor: "pointer", fontSize: 12,
                      }}>Sign up free</button>
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                      <input type="text" placeholder="Full Name" value={name} disabled={isLoading}
                        onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: undefined }); }}
                        style={inputStyle(errors.name)} />
                      {errors.name && <p style={{ color: "#f73e5d", fontSize: 11, marginTop: 4 }}>{errors.name}</p>}
                    </div>
                    <div>
                      <input type="email" placeholder="Email address" value={email} disabled={isLoading}
                        onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                        style={inputStyle(errors.email)} />
                      {errors.email && <p style={{ color: "#f73e5d", fontSize: 11, marginTop: 4 }}>{errors.email}</p>}
                    </div>
                    <div style={{ position: "relative" }}>
                      <input type={showPassword ? "text" : "password"} placeholder="Password (min. 8 characters)" value={password} disabled={isLoading}
                        onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }}
                        style={{ ...inputStyle(errors.password), paddingRight: 40 }} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", color: "#8899aa",
                      }}>
                        {showPassword ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
                      </button>
                    </div>
                    <div>
                      <p style={{ color: "#8899aa", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Account Type</p>
                      <div style={{ display: "flex", gap: 8 }}>
                        {(["employee", "employer"] as const).map((type) => (
                          <button key={type} type="button" onClick={() => setUserType(type)} style={{
                            flex: 1, padding: "10px", fontSize: 12, fontWeight: 700,
                            border: userType === type ? "none" : "1px solid #d0dff0",
                            borderRadius: 8, cursor: "pointer",
                            background: userType === type ? "#00418d" : "#fff",
                            color: userType === type ? "#fff" : "#8899aa",
                            transition: "all 0.2s",
                          }}>
                            {type === "employee" ? "👤 Employee" : "🏢 Employer"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button type="submit" disabled={isLoading} style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      background: "#00418d", color: "#fff",
                      fontWeight: 700, fontSize: 13, padding: "11px",
                      border: "none", borderRadius: 8, cursor: "pointer",
                      opacity: isLoading ? 0.7 : 1,
                    }}>
                      {isLoading ? <><Loader2 style={{ width: 14, height: 14 }} />Creating…</> : "Create Account"}
                    </button>
                    <p style={{ textAlign: "center", color: "#8899aa", fontSize: 12 }}>
                      Already have an account?{" "}
                      <button type="button" onClick={() => switchView("login")} style={{
                        background: "none", border: "none", color: "#00418d", fontWeight: 700, cursor: "pointer", fontSize: 12,
                      }}>Sign in</button>
                    </p>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

