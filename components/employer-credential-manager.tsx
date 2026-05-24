"use client";

import { useState, useEffect } from "react";
import { UserPlus, Copy, CheckCircle, Loader2, Mail, Shield, Clock, Calendar, Trash2 } from "lucide-react";
import { apiCall } from "@/context/AuthContext";

interface Credential {
  _id: string;
  candidateName: string;
  candidateEmail: string;
  username: string;
  status: "invited" | "registered" | "booked" | "assessed";
  isUsed: boolean;
  bookedSlot: { date: string; time: string; center: string; location: string } | null;
  createdAt: string;
}

interface NewCredential {
  candidateName: string;
  candidateEmail: string;
  username: string;
  password: string;
  companyCode: string;
}

const STATUS: Record<string, { bg: string; text: string; label: string }> = {
  invited:    { bg: "bg-amber-50",   text: "text-amber-700 border-amber-200 border",   label: "Invited" },
  registered: { bg: "bg-blue-50",    text: "text-[#00418d] border-[#00418d]/20 border", label: "Registered" },
  booked:     { bg: "bg-emerald-50", text: "text-emerald-700 border-emerald-200 border", label: "Slot Booked" },
  assessed:   { bg: "bg-purple-50",  text: "text-purple-700 border-purple-200 border",  label: "Assessed" },
};

export default function EmployerCredentialManager() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [stats, setStats] = useState({ total: 0, invited: 0, registered: 0, booked: 0, assessed: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [newCred, setNewCred] = useState<NewCredential | null>(null);
  const [copied, setCopied] = useState("");
  const [form, setForm] = useState({ candidateName: "", candidateEmail: "" });

  useEffect(() => { fetchCredentials(); }, []);

  const fetchCredentials = async () => {
    setLoading(true);
    const { ok, data } = await apiCall("/employers/credentials");
    if (ok) { setCredentials(data.data.credentials || []); setStats(data.data.stats || {}); }
    setLoading(false);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.candidateName.trim() || !form.candidateEmail.trim()) { setError("Name and email are required"); return; }
    setSubmitting(true);
    const { ok, data } = await apiCall("/employers/credentials", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (ok) {
      setNewCred(data.data.credential);
      setForm({ candidateName: "", candidateEmail: "" });
      setShowForm(false);
      fetchCredentials();
    } else { setError(data.message || "Failed to generate credentials"); }
    setSubmitting(false);
  };

  const handleRevoke = async (id: string, name: string) => {
    if (!confirm(`Revoke access for ${name}?`)) return;
    const { ok, data } = await apiCall(`/employers/credentials/${id}`, { method: "DELETE" });
    if (ok) fetchCredentials();
    else alert(data.message);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div>
      {/* ── Stats row ── */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total",    value: stats.total,    num: "text-gray-900" },
          { label: "Invited",  value: stats.invited,  num: "text-amber-600" },
          { label: "Booked",   value: stats.booked,   num: "text-emerald-600" },
          { label: "Assessed", value: stats.assessed, num: "text-purple-600" },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 border border-gray-200 rounded-2xl p-3 text-center">
            <p className={`text-2xl font-black ${s.num}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Candidate Access</h2>
        <button
          onClick={() => { setShowForm(!showForm); setError(""); setNewCred(null); }}
          className="flex items-center gap-2 bg-[#00418d] hover:bg-[#003070] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          {showForm ? "Cancel" : "Add Candidate"}
        </button>
      </div>

      {/* ── Add form ── */}
      {showForm && (
        <form onSubmit={handleGenerate} className="bg-[#f0f7ff] border border-[#00418d]/15 rounded-2xl p-5 mb-5 space-y-3">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Generate Credentials</h3>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Candidate Full Name</label>
              <input
                type="text" value={form.candidateName}
                onChange={e => setForm(p => ({ ...p, candidateName: e.target.value }))}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-gray-900 placeholder-gray-300 text-sm focus:outline-none focus:border-[#00418d] focus:ring-2 focus:ring-[#00418d]/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Candidate Email</label>
              <input
                type="email" value={form.candidateEmail}
                onChange={e => setForm(p => ({ ...p, candidateEmail: e.target.value }))}
                placeholder="e.g. rahul@email.com"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-gray-900 placeholder-gray-300 text-sm focus:outline-none focus:border-[#00418d] focus:ring-2 focus:ring-[#00418d]/10 transition-all"
              />
            </div>
          </div>
          <button
            type="submit" disabled={submitting}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
          >
            {submitting
              ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</>
              : <><Mail className="w-4 h-4" />Generate & Email Credentials</>}
          </button>
        </form>
      )}

      {/* ── New credential display ── */}
      {newCred && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-emerald-700 font-semibold text-sm">
              Credentials generated and emailed to {newCred.candidateEmail}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { label: "Company Code", value: newCred.companyCode },
              { label: "Username",     value: newCred.username },
              { label: "Password",     value: newCred.password },
            ].map(item => (
              <div key={item.label} className="bg-white border border-emerald-100 rounded-xl p-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-gray-400 font-semibold">{item.label}</p>
                  <p className="font-mono font-bold text-gray-900 text-sm mt-0.5">{item.value}</p>
                </div>
                <button onClick={() => copyToClipboard(item.value, item.label)} className="text-gray-300 hover:text-[#00418d] transition-colors shrink-0">
                  {copied === item.label
                    ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                    : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-600 font-semibold mt-3 flex items-center gap-1.5">
            ⚠️ Save this password — it won't be shown again.
          </p>
        </div>
      )}

      {/* ── Credentials list ── */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-7 h-7 animate-spin text-[#00418d]" />
        </div>
      ) : credentials.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-gray-400 text-sm">No candidates added yet.</p>
          <p className="text-gray-300 text-xs mt-1">Add a candidate to generate login credentials.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {credentials.map(c => {
            const st = STATUS[c.status] ?? STATUS.invited;
            return (
              <div
                key={c._id}
                className="bg-white border border-gray-200 rounded-2xl p-4 flex items-start justify-between gap-3 hover:border-[#00418d]/30 hover:shadow-md hover:shadow-[#00418d]/5 transition-all duration-200"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-[#00418d] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                    {c.candidateName?.charAt(0).toUpperCase() || "?"}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Name + badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-bold text-gray-900 text-sm">{c.candidateName}</p>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${st.bg} ${st.text}`}>
                        {st.label}
                      </span>
                      {c.isUsed && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#00418d]/8 text-[#00418d] border border-[#00418d]/20">
                          Logged in
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <p className="text-gray-500 text-xs">{c.candidateEmail}</p>

                    {/* Username */}
                    <p className="text-gray-400 text-xs font-mono mt-0.5">
                      Username: <span className="text-gray-600 font-semibold">{c.username}</span>
                    </p>

                    {/* Booked slot details */}
                    {c.bookedSlot && (
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                          <Calendar className="w-3 h-3" />
                          {c.bookedSlot.date}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" />
                          {c.bookedSlot.time}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">{c.bookedSlot.center}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delete — invited only */}
                {c.status === "invited" && (
                  <button
                    onClick={() => handleRevoke(c._id, c.candidateName)}
                    className="text-gray-300 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-xl transition-all shrink-0"
                    title="Revoke access"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}