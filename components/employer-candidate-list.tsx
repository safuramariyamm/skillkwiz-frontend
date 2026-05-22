"use client";

import { useState, useEffect } from "react";
import {
  UserPlus,
  Copy,
  CheckCircle,
  Loader2,
  Mail,
  Shield,
  Clock,
  Calendar,
  Trash2,
} from "lucide-react";
import { apiCall } from "@/context/AuthContext";

interface Credential {
  _id: string;
  candidateName: string;
  candidateEmail: string;
  username: string;
  status: "invited" | "registered" | "booked" | "assessed";
  isUsed: boolean;
  bookedSlot: {
    date: string;
    time: string;
    center: string;
    location: string;
  } | null;
  createdAt: string;
}

interface NewCredential {
  candidateName: string;
  candidateEmail: string;
  username: string;
  password: string;
  companyCode: string;
}

export default function EmployerCredentialManager() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    invited: 0,
    registered: 0,
    booked: 0,
    assessed: 0,
  });

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [newCred, setNewCred] = useState<NewCredential | null>(null);
  const [copied, setCopied] = useState("");
  const [form, setForm] = useState({
    candidateName: "",
    candidateEmail: "",
  });

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    setLoading(true);

    const { ok, data } = await apiCall("/employers/credentials");

    if (ok) {
      setCredentials(data.data.credentials || []);
      setStats(data.data.stats || {});
    }

    setLoading(false);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!form.candidateName.trim() || !form.candidateEmail.trim()) {
      setError("Name and email are required");
      return;
    }

    setSubmitting(true);

    const { ok, data } = await apiCall("/employers/credentials", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (ok) {
      setNewCred(data.data.credential);

      setForm({
        candidateName: "",
        candidateEmail: "",
      });

      setShowForm(false);

      fetchCredentials();
    } else {
      setError(data.message || "Failed to generate credentials");
    }

    setSubmitting(false);
  };

  const handleRevoke = async (id: string, name: string) => {
    if (!confirm(`Revoke access for ${name}?`)) return;

    const { ok, data } = await apiCall(
      `/employers/credentials/${id}`,
      {
        method: "DELETE",
      }
    );

    if (ok) {
      fetchCredentials();
    } else {
      alert(data.message);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);

    setCopied(key);

    setTimeout(() => setCopied(""), 2000);
  };

  const statusConfig: Record<
    string,
    {
      color: string;
      label: string;
    }
  > = {
    invited: {
      color:
        "bg-[#5c4a12]/30 text-[#f4d35e] border border-[#7a6218]/40",
      label: "Invited",
    },

    registered: {
      color:
        "bg-[#1e3a5f]/40 text-[#9ec5ff] border border-[#2d5184]/40",
      label: "Registered",
    },

    booked: {
      color:
        "bg-[#123524]/30 text-[#7ee2b8] border border-[#1f5b3f]/40",
      label: "Slot Booked",
    },

    assessed: {
      color:
        "bg-[#3a1d5c]/30 text-[#d3b5ff] border border-[#5b2a8a]/40",
      label: "Assessed",
    },
  };

  return (
    <div className="text-white min-h-screen bg-[#1a2540] rounded-2xl p-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          {
            label: "Total",
            value: stats.total,
            color: "text-white",
          },

          {
            label: "Invited",
            value: stats.invited,
            color: "text-[#f4d35e]",
          },

          {
            label: "Booked",
            value: stats.booked,
            color: "text-[#7ee2b8]",
          },

          {
            label: "Assessed",
            value: stats.assessed,
            color: "text-[#d3b5ff]",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#1e2f4d] border border-[#2d5184]/40 rounded-2xl p-4 text-center shadow-lg shadow-black/10"
          >
            <p className={`text-headingMd font-bold ${s.color}`}>
              {s.value}
            </p>

            <p className="text-caption text-gray-400 mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-headingSm font-semibold">
          Candidate Access
        </h2>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setError("");
            setNewCred(null);
          }}
          className="flex items-center gap-2 bg-[#00418d] hover:bg-[#2d5184] transition-all duration-300 shadow-md shadow-[#00418d]/20 px-4 py-2 rounded-xl text-body font-medium"
        >
          <UserPlus className="w-4 h-4" />

          {showForm ? "Cancel" : "Add Candidate"}
        </button>
      </div>

      {/* Add Candidate Form */}
      {showForm && (
        <form
          onSubmit={handleGenerate}
          className="bg-[#1e2f4d] border border-[#2d5184]/40 rounded-2xl p-5 mb-5 space-y-4 shadow-xl shadow-black/10"
        >
          <h3 className="text-body font-medium text-gray-300 uppercase tracking-wide">
            Generate Credentials
          </h3>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
              <p className="text-red-300 text-body">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-caption text-gray-400 mb-1">
                Candidate Full Name
              </label>

              <input
                type="text"
                value={form.candidateName}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    candidateName: e.target.value,
                  }))
                }
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-[#162238] border border-[#2d5184]/40 rounded-xl px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00418d] focus:ring-2 focus:ring-[#00418d]/20 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-caption text-gray-400 mb-1">
                Candidate Email
              </label>

              <input
                type="email"
                value={form.candidateEmail}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    candidateEmail: e.target.value,
                  }))
                }
                placeholder="e.g. rahul@email.com"
                className="w-full bg-[#162238] border border-[#2d5184]/40 rounded-xl px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00418d] focus:ring-2 focus:ring-[#00418d]/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#123524] hover:bg-[#1f5b3f] rounded-xl text-body font-medium disabled:opacity-50 flex items-center justify-center gap-2 transition-all duration-300"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Generate & Email Credentials
              </>
            )}
          </button>
        </form>
      )}

      {/* Success Credentials */}
      {newCred && (
        <div className="bg-[#123524]/30 border border-[#1f5b3f]/50 rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-[#7ee2b8]" />

            <span className="text-[#7ee2b8] font-medium">
              Credentials generated and emailed to{" "}
              {newCred.candidateEmail}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-body">
            {[
              {
                label: "Company Code",
                value: newCred.companyCode,
              },

              {
                label: "Username",
                value: newCred.username,
              },

              {
                label: "Password",
                value: newCred.password,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-[#162238] border border-[#2d5184]/30 rounded-xl p-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-caption text-gray-400">
                    {item.label}
                  </p>

                  <p className="font-mono font-bold break-all">
                    {item.value}
                  </p>
                </div>

                <button
                  onClick={() =>
                    copyToClipboard(item.value, item.label)
                  }
                  className="text-gray-400 hover:text-white ml-2 transition-colors"
                >
                  {copied === item.label ? (
                    <CheckCircle className="w-4 h-4 text-[#7ee2b8]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>

          <p className="text-caption text-[#f4d35e] mt-4">
            ⚠️ Save this password — it won't be shown again.
          </p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#4d8fda]" />
        </div>
      ) : credentials.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 text-gray-400">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-40" />

          <p>
            No candidates added yet. Add a candidate to generate
            login credentials.
          </p>
        </div>
      ) : (
        /* Candidates */
        <div className="space-y-3">
          {credentials.map((c) => (
            <div
              key={c._id}
              className="bg-[#1e2f4d] border border-[#2d5184]/40 rounded-2xl p-4 hover:border-[#3a6394]/60 transition-all duration-300 flex items-start justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                {/* Top Row */}
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="font-medium">
                    {c.candidateName}
                  </p>

                  <span
                    className={`text-caption px-2 py-0.5 rounded-full ${statusConfig[c.status]?.color}`}
                  >
                    {statusConfig[c.status]?.label}
                  </span>

                  {c.isUsed && (
                    <span className="text-caption bg-[#00418d]/20 text-[#9ec5ff] border border-[#2d5184]/40 px-2 py-0.5 rounded-full">
                      Logged in
                    </span>
                  )}
                </div>

                {/* Email */}
                <p className="text-body text-gray-400">
                  {c.candidateEmail}
                </p>

                {/* Username */}
                <p className="text-caption text-gray-500 font-mono mt-0.5">
                  Username: {c.username}
                </p>

                {/* Slot */}
                {c.bookedSlot && (
                  <div className="mt-3 flex items-center gap-3 flex-wrap text-caption text-[#7ee2b8]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {c.bookedSlot.date}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {c.bookedSlot.time}
                    </span>

                    <span>{c.bookedSlot.center}</span>
                  </div>
                )}
              </div>

              {/* Delete */}
              {c.status === "invited" && (
                <button
                  onClick={() =>
                    handleRevoke(c._id, c.candidateName)
                  }
                  className="text-[#ff8b8b] hover:text-white hover:bg-[#5c1f1f]/40 transition-all duration-300 p-2 rounded-lg flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

