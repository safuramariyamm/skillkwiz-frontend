"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Loader2, Copy } from "lucide-react";
import { apiCall } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";

interface EmployerProfileProps {
  employerData?: any;
}

export default function EmployerProfile({ employerData: initialData }: EmployerProfileProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    const { ok, data } = await apiCall("/employers/me");
    if (ok) setProfile(data.data.employer);
    setIsLoading(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(profile.companyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) return (
    <div className="text-center py-10">
      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[#00418d]" />
      <p className="text-gray-500">Loading profile...</p>
    </div>
  );

  if (!profile) return (
    <div className="text-center py-10 text-gray-500">Profile not found.</div>
  );

  return (
    <div className="space-y-6">
      {/* Employer header tile */}
      <div className="bg-gradient-to-br from-[#f0f7ff] to-[#daeeff] rounded-2xl p-6 border border-[#00418d]/10">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-[#00418d] flex items-center justify-center text-2xl font-black text-white shrink-0">
            {profile.firstName?.charAt(0).toUpperCase()}
            {profile.lastName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              {profile.firstName} {profile.lastName !== "-" ? profile.lastName : ""}
            </h3>
            <p className="text-sm text-gray-500 capitalize">
              {profile.department} — {profile.company}
            </p>
            {profile.isVerified && (
              <span className="inline-flex items-center gap-1 mt-1.5 text-xs bg-green-100 text-green-700 px-3 py-0.5 rounded-full font-semibold">
                <CheckCircle className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
        </div>

        <div className="h-px bg-[#00418d]/10 my-4" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">Email</p>
            <p className="text-gray-900 font-semibold text-sm">{profile.email}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">Phone</p>
            <p className="text-gray-900 font-semibold text-sm">{profile.phone}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">Company</p>
            <p className="text-gray-900 font-semibold text-sm capitalize">{profile.company}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">Department</p>
            <p className="text-gray-900 font-semibold text-sm capitalize">{profile.department}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">Authorization</p>
            <p className="text-gray-900 font-semibold text-sm">
              {profile.authorized === "yes" ? "✓ Authorized to Hire" : "Not Authorized"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">Member Since</p>
            <p className="text-gray-900 font-semibold text-sm">
              {new Date(profile.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Company Code — secondary, below profile fields */}
        <div className="h-px bg-[#00418d]/10 my-4" />
        <div className="pt-1">
          <p className="text-gray-500 text-caption mb-1 uppercase tracking-wider font-medium">Your Company Code</p>
          <div className="flex items-center gap-3">
            <p className="text-headingSm font-black text-[#00418d] tracking-wide">{profile.companyCode}</p>
            <button onClick={copyCode}
              className="flex items-center gap-1.5 text-body bg-[#00418d]/8 hover:bg-[#00418d]/15 text-[#00418d] px-3 py-1.5 rounded-lg transition-colors text-sm font-semibold">
              {copied ? <><CheckCircle className="w-3.5 h-3.5 text-green-600" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-2">Share this code with candidates so they can log in to take your assessment</p>
        </div>
      </div>
    </div>
  );
}
