"use client";

import { useEffect, useState } from "react";
import { Building2, Mail, Phone, Briefcase, Shield, CheckCircle, Loader2, Copy } from "lucide-react";
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
    if (!initialData) fetchProfile();
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
    <div className="text-center py-10 text-white">
      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-400" />
      <p className="text-gray-400">Loading profile...</p>
    </div>
  );

  if (!profile) return (
    <div className="text-center py-10 text-gray-400">Profile not found.</div>
  );

  return (
    <div className="text-white">
      <h2 className="text-headingMd font-semibold text-center mb-6">Employer Profile</h2>

      {/* Company Code — most important, show first */}
      <div className="bg-gradient-to-r from-[#192030] to-[#364059] border border-blue-500/40 rounded-2xl p-5 mb-5 text-center">
        <p className="text-body text-blue-300 mb-1 uppercase tracking-wider font-medium">Your Company Code</p>
        <p className="text-headingXl font-black tracking-[0.3em] text-white mb-2">{profile.companyCode}</p>
        <button onClick={copyCode}
          className="flex items-center gap-2 mx-auto text-body bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg transition-colors">
          {copied ? <><CheckCircle className="w-4 h-4 text-green-400" />Copied!</> : <><Copy className="w-4 h-4" />Copy Code</>}
        </button>
        <p className="text-caption text--400 mt-3">Share this code with candidates so they can log in to take your assessment</p>
      </div>

      {/* Profile details */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-[#364059] flex items-center justify-center text-headingSm font-bold flex-shrink-0">
            {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
          </div>
          <div>
            <h3 className="text-headingSm text-black font-semibold">{profile.firstName} {profile.lastName !== "-" ? profile.lastName : ""}</h3>
            <p className="text-black text-body capitalize">{profile.department} — {profile.company}</p>
            {profile.isVerified && (
              <span className="inline-flex items-center gap-1 text-caption bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full mt-1">
                <CheckCircle className="w-3 h-3" />Verified
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-body">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-black flex-shrink-0" />
            <div><p className="text-black text-caption">Email</p><p className="text-black">{profile.email}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-black flex-shrink-0" />
            <div><p className="text-black text-caption">Phone</p><p className="text-black">{profile.phone}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4 text-black flex-shrink-0" />
            <div><p className="text-black text-caption">Company</p><p className="capitalize text-black">{profile.company}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <Briefcase className="w-4 h-4 text-black flex-shrink-0" />
            <div><p className="text-black text-caption">Department</p><p className="capitalize text-black">{profile.department}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-black flex-shrink-0" />
            <div><p className="text-black text-caption">Authorization</p><p className="text-black">{profile.authorized === "yes" ? "✓ Authorized to Hire" : "Not Authorized"}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 flex-shrink-0" />
            <div><p className="text-black text-caption">Member Since</p><p className="text-black">{new Date(profile.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}