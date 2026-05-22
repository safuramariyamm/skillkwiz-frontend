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

  const statusConfig: Record<string, { color: string; label: string }> = {
    invited: { color: "bg-yellow-500/20 text-yellow-300", label: "Invited" },
    registered: { color: "bg-blue-500/20 text-blue-300", label: "Registered" },
    booked: { color: "bg-green-500/20 text-green-300", label: "Slot Booked" },
    assessed: { color: "bg-purple-500/20 text-purple-300", label: "Assessed" },
  };

  return (
    <div className="text-white">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total", value: stats.total, color: "text-white" },
          { label: "Invited", value: stats.invited, color: "text-yellow-300" },
          { label: "Booked", value: stats.booked, color: "text-green-300" },
          { label: "Assessed", value: stats.assessed, color: "text-purple-300" },
        ].map(s => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <p className={`text-headingMd font-bold ${s.color}`}>{s.value}</p>
            <p className="text-caption text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-headingSm font-semibold">Candidate Access</h2>
        <button onClick={() => { setShowForm(!showForm); setError(""); setNewCred(null); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-body font-medium">
          <UserPlus className="w-4 h-4" /> {showForm ? "Cancel" : "Add Candidate"}
        </button>
      </div>

      {/* Add candidate form */}
      {showForm && (
        <form onSubmit={handleGenerate} className="bg-white/5 border border-white/10 rounded-xl p-5 mb-5 space-y-3">
          <h3 className="text-body font-medium text-gray-300 uppercase tracking-wide">Generate Credentials</h3>
          {error && <div className="bg-red-500/20 rounded-lg p-3"><p className="text-red-300 text-body">{error}</p></div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-caption text-gray-400 mb-1">Candidate Full Name</label>
              <input type="text" value={form.candidateName} onChange={e => setForm(p => ({ ...p, candidateName: e.target.value }))}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-[#1a2540] border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-body" />
            </div>
            <div>
              <label className="block text-caption text-gray-400 mb-1">Candidate Email</label>
              <input type="email" value={form.candidateEmail} onChange={e => setForm(p => ({ ...p, candidateEmail: e.target.value }))}
                placeholder="e.g. rahul@email.com"
                className="w-full bg-[#1a2540] border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-body" />
            </div>
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 rounded-lg text-body font-medium disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><Mail className="w-4 h-4" />Generate & Email Credentials</>}
          </button>
        </form>
      )}

      {/* New credential display */}
      {newCred && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-medium">Credentials generated and emailed to {newCred.candidateEmail}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-body">
            {[
              { label: "Company Code", value: newCred.companyCode },
              { label: "Username", value: newCred.username },
              { label: "Password", value: newCred.password },
            ].map(item => (
              <div key={item.label} className="bg-black/20 rounded-lg p-3 flex items-center justify-between">
                <div><p className="text-caption text-gray-400">{item.label}</p><p className="font-mono font-bold">{item.value}</p></div>
                <button onClick={() => copyToClipboard(item.value, item.label)} className="text-gray-400 hover:text-white ml-2">
                  {copied === item.label ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
          <p className="text-caption text-yellow-300 mt-3">⚠️ Save this password — it won't be shown again.</p>
        </div>
      )}

      {/* Candidates list */}
      {loading ? (
        <div className="text-center py-8"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-400" /></div>
      ) : credentials.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No candidates added yet. Add a candidate to generate login credentials.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {credentials.map(c => (
            <div key={c._id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="font-medium">{c.candidateName}</p>
                  <span className={`text-caption px-2 py-0.5 rounded-full ${statusConfig[c.status]?.color}`}>
                    {statusConfig[c.status]?.label}
                  </span>
                  {c.isUsed && <span className="text-caption bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">Logged in</span>}
                </div>
                <p className="text-body text-gray-400">{c.candidateEmail}</p>
                <p className="text-caption text-gray-500 font-mono mt-0.5">Username: {c.username}</p>
                {c.bookedSlot && (
                  <div className="mt-2 flex items-center gap-3 text-caption text-green-300">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{c.bookedSlot.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.bookedSlot.time}</span>
                    <span>{c.bookedSlot.center}</span>
                  </div>
                )}
              </div>
              {c.status === "invited" && (
                <button onClick={() => handleRevoke(c._id, c.candidateName)}
                  className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0">
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
