"use client";

import { useState } from "react";
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiSendOtp, apiVerifyOtp, apiRegisterCandidate, apiGetCandidateProfile } from "@/lib/api";

interface EmployeeRegistrationProps {
  onNext: (data: any) => void;
}


// Normalize phone to E.164 before sending to backend
function normalizePhone(phone: string): string {
  let digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+') && digits.length >= 10) return digits;
  digits = digits.replace(/\D/g, '');
  if (digits.length === 10 && /^[6-9]/.test(digits)) return '+91' + digits;
  if (digits.length === 12 && digits.startsWith('91')) return '+' + digits;
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits.startsWith('1')) return '+' + digits;
  return '+' + digits;
}

export default function EmployeeRegistration({ onNext }: EmployeeRegistrationProps) {
  const { user, register, token } = useAuth();

  const [step, setStep] = useState<"account" | "profile" | "otp">("account");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    password: "",
    emailOtp: "",
    phoneOtp: "",
    resume: null as File | null,
  });

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState<"email" | "phone" | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [serverError, setServerError] = useState("");

  const handleFileUpload = (file: File) => {
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, resume: "Please upload a PDF or Word document" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, resume: "File size must be less than 5MB" });
      return;
    }
    setFormData({ ...formData, resume: file });
    setErrors({ ...errors, resume: "" });
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 20;
      });
    }, 100);
  };

  const sendEmailOtp = async () => {
    if (!formData.email) { setErrors({ ...errors, email: "Enter email first" }); return; }
    setOtpLoading("email");
    try {
      const res = await apiSendOtp(formData.email, "email");
      if (res.success) {
        setEmailOtpSent(true);
        setErrors({ ...errors, email: "" });
      } else {
        setErrors({ ...errors, email: res.message || "Failed to send OTP" });
      }
    } catch {
      setErrors({ ...errors, email: "Network error sending OTP" });
    } finally {
      setOtpLoading(null);
    }
  };

  const verifyEmailOtp = async () => {
    if (!formData.emailOtp) { setErrors({ ...errors, emailOtp: "Enter OTP" }); return; }
    setOtpLoading("email");
    try {
      const res = await apiVerifyOtp(formData.email, "email", formData.emailOtp);
      if (res.success) {
        setEmailVerified(true);
        setErrors({ ...errors, emailOtp: "" });
      } else {
        setErrors({ ...errors, emailOtp: res.message || "Invalid OTP" });
      }
    } catch {
      setErrors({ ...errors, emailOtp: "Network error verifying OTP" });
    } finally {
      setOtpLoading(null);
    }
  };

  const sendPhoneOtp = async () => {
    if (!formData.phone) { setErrors({ ...errors, phone: "Enter phone first" }); return; }
    setOtpLoading("phone");
    try {
      const res = await apiSendOtp(normalizePhone(formData.phone), "phone");
      if (res.success) {
        setPhoneOtpSent(true);
        setErrors({ ...errors, phone: "" });
      } else {
        setErrors({ ...errors, phone: res.message || "Failed to send OTP" });
      }
    } catch {
      setErrors({ ...errors, phone: "Network error sending OTP" });
    } finally {
      setOtpLoading(null);
    }
  };

  const verifyPhoneOtp = async () => {
    if (!formData.phoneOtp) { setErrors({ ...errors, phoneOtp: "Enter OTP" }); return; }
    setOtpLoading("phone");
    try {
      const res = await apiVerifyOtp(normalizePhone(formData.phone), "phone", formData.phoneOtp);
      if (res.success) {
        setPhoneVerified(true);
        setErrors({ ...errors, phoneOtp: "" });
      } else {
        setErrors({ ...errors, phoneOtp: res.message || "Invalid OTP" });
      }
    } catch {
      setErrors({ ...errors, phoneOtp: "Network error verifying OTP" });
    } finally {
      setOtpLoading(null);
    }
  };

  const handleAccountStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    // If already logged in as employee, skip account creation
    if (user && user.role === "employee") {
      // Check if already has a profile
      setIsLoading(true);
      try {
        const profileRes = await apiGetCandidateProfile();
        if (profileRes.success && profileRes.data?.candidate) {
          // Already has profile — go straight to assessment
          onNext(profileRes.data.candidate);
          return;
        }
      } catch { }
      setIsLoading(false);
      setStep("profile");
      return;
    }

    // New account
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setServerError("Please fill all required fields");
      return;
    }
    setIsLoading(true);
    const name = `${formData.firstName} ${formData.lastName}`;
    const result = await register(name, formData.email, formData.password, "employee");
    setIsLoading(false);

    if (result.success) {
      setStep("profile");
    } else if (result.message?.includes("already registered")) {
      // Account exists — try to log in
      setServerError("An account with this email already exists. Please login instead.");
    } else {
      setServerError(result.message || "Registration failed");
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!formData.resume) {
      setErrors({ ...errors, resume: "Resume is required" });
      return;
    }

    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("firstName", formData.firstName);
      fd.append("lastName", formData.lastName);
      fd.append("email", formData.email || user?.email || "");
      fd.append("phone", formData.phone);
      if (formData.resume) fd.append("resume", formData.resume);

      const res = await apiRegisterCandidate(fd);

      if (res.success) {
        onNext(res.data.candidate);
      } else if (res.message?.includes("already exists")) {
        // Profile already exists — fetch and continue
        const profileRes = await apiGetCandidateProfile();
        if (profileRes.success) {
          onNext(profileRes.data.candidate);
        } else {
          setServerError(res.message);
        }
      } else {
        setServerError(res.message || "Profile creation failed");
      }
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full bg-[#1e3a5f] border ${errors[field] ? "border-red-400" : "border-[#2d5184]"} rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#f73e5d] transition-colors`;

  if (step === "account" && !user) {
    return (
      <div className="text-white">
        <h2 className="text-headingMd font-bold mb-2">Create Account</h2>
        <p className="text-gray-300 mb-6">Register as an employee to get started</p>

        {serverError && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-red-300 text-body">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleAccountStep} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-body mb-1">First Name *</label>
              <input className={inputClass("firstName")} value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John" required />
            </div>
            <div>
              <label className="block text-body mb-1">Last Name *</label>
              <input className={inputClass("lastName")} value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Doe" required />
            </div>
          </div>

          <div>
            <label className="block text-body mb-1">Email *</label>
            <input className={inputClass("email")} type="email" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com" required />
          </div>

          <div>
            <label className="block text-body mb-1">Password *</label>
            <input className={inputClass("password")} type="password" value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Min 8 characters" minLength={8} required />
          </div>

          <button type="submit" disabled={isLoading}
            className="w-full py-3 rounded-lg bg-[#f73e5d] hover:bg-[#d62f4f] text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : "Create Account & Continue"}
          </button>

          <p className="text-center text-gray-400 text-body">Already have an account? Please use the Login tab above.</p>
        </form>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h2 className="text-headingMd font-bold mb-2">
        {user ? `Welcome, ${user.name}!` : "Complete Your Profile"}
      </h2>
      <p className="text-gray-300 mb-6">
        {user ? "Complete your candidate profile to schedule assessments" : "Fill in your details to register"}
      </p>

      {serverError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-red-300 text-body">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-body mb-1">First Name *</label>
            <input className={inputClass("firstName")} value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="John" required />
          </div>
          <div>
            <label className="block text-body mb-1">Last Name *</label>
            <input className={inputClass("lastName")} value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Doe" required />
          </div>
        </div>

        {/* Email with OTP */}
        <div>
          <label className="block text-body mb-1">Email *</label>
          <div className="flex gap-2">
            <input className={inputClass("email") + " flex-1"} type="email"
              value={formData.email || user?.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com" readOnly={!!user} />
            {!emailVerified && (
              <button type="button" onClick={sendEmailOtp} disabled={otpLoading === "email"}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-body rounded-lg whitespace-nowrap disabled:opacity-50">
                {otpLoading === "email" ? <Loader2 className="w-4 h-4 animate-spin" /> : emailOtpSent ? "Resend" : "Send OTP"}
              </button>
            )}
            {emailVerified && <CheckCircle className="w-6 h-6 text-green-400 mt-3 shrink-0" />}
          </div>
          {emailOtpSent && !emailVerified && (
            <div className="flex gap-2 mt-2">
              <input className={inputClass("emailOtp") + " flex-1"} value={formData.emailOtp}
                onChange={(e) => setFormData({ ...formData, emailOtp: e.target.value })}
                placeholder="Enter 6-digit OTP" maxLength={6} />
              <button type="button" onClick={verifyEmailOtp} disabled={otpLoading === "email"}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-body rounded-lg whitespace-nowrap disabled:opacity-50">
                Verify
              </button>
            </div>
          )}
          {errors.emailOtp && <p className="text-red-300 text-caption mt-1">{errors.emailOtp}</p>}
        </div>

        {/* Phone with OTP */}
        <div>
          <label className="block text-body mb-1">Phone *</label>
          <div className="flex gap-2">
            <input className={inputClass("phone") + " flex-1"} type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 9876543210" />
            {!phoneVerified && (
              <button type="button" onClick={sendPhoneOtp} disabled={otpLoading === "phone"}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-body rounded-lg whitespace-nowrap disabled:opacity-50">
                {otpLoading === "phone" ? <Loader2 className="w-4 h-4 animate-spin" /> : phoneOtpSent ? "Resend" : "Send OTP"}
              </button>
            )}
            {phoneVerified && <CheckCircle className="w-6 h-6 text-green-400 mt-3 shrink-0" />}
          </div>
          {phoneOtpSent && !phoneVerified && (
            <div className="flex gap-2 mt-2">
              <input className={inputClass("phoneOtp") + " flex-1"} value={formData.phoneOtp}
                onChange={(e) => setFormData({ ...formData, phoneOtp: e.target.value })}
                placeholder="Enter 6-digit OTP" maxLength={6} />
              <button type="button" onClick={verifyPhoneOtp} disabled={otpLoading === "phone"}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-body rounded-lg whitespace-nowrap disabled:opacity-50">
                Verify
              </button>
            </div>
          )}
          {errors.phoneOtp && <p className="text-red-300 text-caption mt-1">{errors.phoneOtp}</p>}
          {errors.phone && <p className="text-red-300 text-caption mt-1">{errors.phone}</p>}
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block text-body mb-1">Resume * (PDF or Word, max 5MB)</label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${errors.resume ? "border-red-400" : "border-[#2d5184] hover:border-blue-400"}`}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileUpload(f); }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("resume-upload")?.click()}
          >
            <input id="resume-upload" type="file" className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
            {formData.resume ? (
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-300 text-body">{formData.resume.name}</span>
                <button type="button" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, resume: null }); setUploadProgress(0); }}>
                  <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-body">Drag & drop or click to upload resume</p>
              </>
            )}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-3 bg-[#1e3a5f] rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}
          </div>
          {errors.resume && <p className="text-red-300 text-caption mt-1">{errors.resume}</p>}
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full py-3 rounded-lg bg-[#f73e5d] hover:bg-[#d62f4f] text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">
          {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Registering...</> : "Register & Continue"}
        </button>
      </form>
    </div>
  );
}