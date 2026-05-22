"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiRegisterEmployer, apiGetEmployerProfile } from "@/lib/api";
import { apiSendOtp, apiVerifyOtp } from "@/lib/api";

interface EmployerRegistrationProps {
  onSubmit: (data: any) => void;
}


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

export default function EmployerRegistration({ onSubmit }: EmployerRegistrationProps) {
  const { user, register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: user?.email || "",
    phone: "",
    department: "",
    password: "",
    authorized: null as "yes" | "no" | null,
    authorizationDetails: "",
    phoneOtp: "",
  });

  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState<"phone" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState("");
  const [showAccountStep, setShowAccountStep] = useState(!user);

  const inputClass = (field: string) =>
    `w-full bg-[#0d2d5c] border ${errors[field] ? "border-red-400" : "border-[#1a4480]"} rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#f73e5d] transition-colors text-body`;

  const sendPhoneOtp = async () => {
    if (!formData.phone) { setErrors({ ...errors, phone: "Enter phone first" }); return; }
    setOtpLoading("phone");
    try {
      const res = await apiSendOtp(normalizePhone(formData.phone), "phone");
      if (res.success) { setPhoneOtpSent(true); }
      else { setErrors({ ...errors, phone: res.message || "Failed to send OTP" }); }
    } catch { setErrors({ ...errors, phone: "Network error" }); }
    setOtpLoading(null);
  };

  const verifyPhoneOtp = async () => {
    setOtpLoading("phone");
    try {
      const res = await apiVerifyOtp(normalizePhone(formData.phone), "phone", formData.phoneOtp);
      if (res.success) { setPhoneVerified(true); }
      else { setErrors({ ...errors, phoneOtp: res.message || "Invalid OTP" }); }
    } catch { setErrors({ ...errors, phoneOtp: "Network error" }); }
    setOtpLoading(null);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setServerError("Please fill all required fields");
      return;
    }
    setIsLoading(true);
    const name = `${formData.firstName} ${formData.lastName}`;
    const result = await register(name, formData.email, formData.password, "employer");
    setIsLoading(false);
    if (result.success) {
      setShowAccountStep(false);
    } else if (result.message?.includes("already registered")) {
      setServerError("Account exists. Please login instead.");
    } else {
      setServerError(result.message || "Registration failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!formData.company || !formData.department || !formData.phone) {
      setServerError("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    try {
      // Derive firstName/lastName from user.name if form fields are empty (logged-in user skipped account step)
      const derivedFirst = formData.firstName || user?.name?.split(" ")[0] || "";
      const derivedLast =
        formData.lastName ||
        (user?.name?.includes(" ") ? user.name.split(" ").slice(1).join(" ") : "") ||
        derivedFirst; // fallback to first name to satisfy validator

      const res = await apiRegisterEmployer({
        firstName: derivedFirst,
        lastName: derivedLast,
        company: formData.company,
        email: formData.email || user?.email,
        phone: formData.phone,
        department: formData.department,
        authorized: formData.authorized,          // send "yes"/"no" string, not a boolean
        authorizationDetails: formData.authorizationDetails,
      });

      if (res.success) {
        onSubmit(res.data.employer);
      } else if (res.message?.includes("already exists") || res.message?.includes("profile")) {
        // Profile exists — fetch it
        const profileRes = await apiGetEmployerProfile();
        if (profileRes.success) {
          onSubmit(profileRes.data.employer);
        } else {
          setServerError(res.message);
        }
      } else {
        setServerError(res.message || "Registration failed");
      }
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (showAccountStep) {
    return (
      <div className="text-white">
        <h2 className="text-headingMd font-bold mb-2">Create Employer Account</h2>
        <p className="text-gray-300 mb-5">Register to manage candidates and assessments</p>
        {serverError && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 flex gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-300 text-body">{serverError}</p>
          </div>
        )}
        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-body mb-1">First Name *</label>
              <input className={inputClass("firstName")} value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Jane" required />
            </div>
            <div>
              <label className="block text-body mb-1">Last Name *</label>
              <input className={inputClass("lastName")} value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Smith" required />
            </div>
          </div>
          <div>
            <label className="block text-body mb-1">Email *</label>
            <input className={inputClass("email")} type="email" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jane@company.com" required />
          </div>
          <div>
            <label className="block text-body mb-1">Password *</label>
            <input className={inputClass("password")} type="password" value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Min 8 characters" minLength={8} required />
          </div>
          <button type="submit" disabled={isLoading}
            className="w-full py-3 rounded-lg bg-[#f73e5d] hover:bg-[#d62f4f] text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Creating Account...</> : "Create Account & Continue"}
          </button>
          <p className="text-center text-gray-400 text-caption">Already have an account? Use the Login tab above.</p>
        </form>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h2 className="text-headingMd font-bold mb-1">Employer Profile</h2>
      {user && <p className="text-gray-300 text-body mb-4">Logged in as: {user.name}</p>}

      {serverError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 flex gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-300 text-body">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-body mb-1">Company Name *</label>
          <input className={inputClass("company")} value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Acme Corp" required />
        </div>

        {/* Email */}
        <div>
          <label className="block text-body mb-1">Work Email *</label>
          <div className="flex gap-2">
            <input className={inputClass("email") + " flex-1"} type="email"
              value={formData.email || user?.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jane@company.com" readOnly={!!user} />
          </div>
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
                className="px-3 py-2 bg-[#00418d] hover:bg-[#003070] text-white text-caption rounded-lg whitespace-nowrap disabled:opacity-50">
                {otpLoading === "phone" ? <Loader2 className="w-3 h-3 animate-spin" /> : phoneOtpSent ? "Resend" : "OTP"}
              </button>
            )}
            {phoneVerified && <CheckCircle className="w-5 h-5 text-green-400 mt-3 shrink-0" />}
          </div>
          {phoneOtpSent && !phoneVerified && (
            <div className="flex gap-2 mt-2">
              <input className={inputClass("phoneOtp") + " flex-1"} value={formData.phoneOtp}
                onChange={(e) => setFormData({ ...formData, phoneOtp: e.target.value })}
                placeholder="6-digit OTP" maxLength={6} />
              <button type="button" onClick={verifyPhoneOtp} disabled={otpLoading === "phone"}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-caption rounded-lg">Verify</button>
            </div>
          )}
          {errors.phoneOtp && <p className="text-red-300 text-caption mt-1">{errors.phoneOtp}</p>}
        </div>

        <div>
          <label className="block text-body mb-1">Department *</label>
          <select className={inputClass("department")} value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })} required>
            <option value="">Select Department</option>
            {["HR", "Engineering", "Finance", "Marketing", "Operations", "Legal", "Other"].map((d) => (
              <option key={d} value={d.toLowerCase()}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-body mb-2">Authorized to hire?</label>
          <div className="flex gap-3">
            {["yes", "no"].map((opt) => (
              <button key={opt} type="button"
                onClick={() => setFormData({ ...formData, authorized: opt as "yes" | "no" })}
                className={`flex-1 py-2 rounded-lg text-body border ${formData.authorized === opt ? "bg-[#f73e5d] border-[#f73e5d]" : "bg-[#0d2d5c] border-[#1a4480]"}`}>
                {opt === "yes" ? "✅ Yes" : "❌ No"}
              </button>
            ))}
          </div>
        </div>

        {formData.authorized === "yes" && (
          <div>
            <label className="block text-body mb-1">Authorization Details</label>
            <textarea className={inputClass("authorizationDetails") + " h-20 resize-none"}
              value={formData.authorizationDetails}
              onChange={(e) => setFormData({ ...formData, authorizationDetails: e.target.value })}
              placeholder="Describe your authorization..." />
          </div>
        )}

        <button type="submit" disabled={isLoading}
          className="w-full py-3 rounded-lg bg-[#f73e5d] hover:bg-[#d62f4f] text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">
          {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Registering...</> : "Complete Registration"}
        </button>
      </form>
    </div>
  );
}