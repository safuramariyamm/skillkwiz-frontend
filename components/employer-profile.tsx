"use client";

import { useState, useEffect } from "react";
import { Edit, Loader2, Building, Phone, Mail, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiGetEmployerProfile } from "@/lib/api";

interface EmployerProfileProps {
  employerData?: any;
}

export default function EmployerProfile({ employerData: initialData }: EmployerProfileProps) {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialData) {
      fetchProfile();
    }
  }, [initialData]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await apiGetEmployerProfile();
      if (res.success) {
        setProfileData(res.data.employer);
      } else {
        setError(res.message || "Failed to load profile");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="text-center text-white py-6">
        <Building className="w-10 h-10 mx-auto mb-3 text-gray-400" />
        <p className="text-gray-300">{error || "No profile data available"}</p>
        <p className="text-gray-400 text-sm mt-1">Please complete your registration to view your profile.</p>
      </div>
    );
  }

  const fullName = profileData.firstName && profileData.lastName
    ? `${profileData.firstName} ${profileData.lastName}`
    : user?.name || "Employer";

  const initials = fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="text-white">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white/10 rounded-xl p-6 mb-6">
        {/* Avatar */}
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex-shrink-0 flex items-center justify-center text-3xl font-bold shadow-lg">
          {initials}
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
            <div>
              <h1 className="text-3xl font-bold">{fullName}</h1>
              <p className="text-blue-300 text-lg font-medium">{profileData.department || "N/A"}</p>
            </div>
            <button className="text-gray-300 hover:text-white transition-colors self-start">
              <Edit className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Building className="w-4 h-4 text-blue-300 shrink-0" />
              <span className="text-gray-300">{profileData.company || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-blue-300 shrink-0" />
              <span className="text-gray-300">{profileData.email || user?.email || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-blue-300 shrink-0" />
              <span className="text-gray-300">{profileData.phone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-blue-300 shrink-0" />
              <span className={`px-2 py-0.5 rounded-full text-xs ${profileData.authorized ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"}`}>
                {profileData.authorized ? "✅ Authorized to Hire" : "Not Authorized"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Assessment Requests", value: profileData.assessmentRequests?.length || 0, color: "text-blue-300" },
          { label: "Candidates Managed", value: "—", color: "text-yellow-300" },
          { label: "Account Status", value: "Active", color: "text-green-300" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#1e3a5f] rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {profileData.authorizationDetails && (
        <div className="mt-4 bg-[#1e3a5f] rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Authorization Details</h3>
          <p className="text-sm text-gray-400">{profileData.authorizationDetails}</p>
        </div>
      )}
    </div>
  );
}
