"use client";

import { useState, useEffect } from "react";
import { Calendar, CheckCircle, Loader2, History, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiCall } from "@/context/AuthContext";

interface Assessment {
  _id: string;
  company: string;
  skills: string[];
  scheduledDate: string;
  scheduledTime: string;
  centre: string;
  country: string;
  zipCode: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  createdAt: string;
}

interface ScheduleAssessmentProps {
  candidateData?: any;
}

export default function ScheduleAssessment({ candidateData }: ScheduleAssessmentProps) {
  const { user } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState("microsoft");
  const [country, setCountry] = useState("India");
  const [zipCode, setZipCode] = useState("110001");
  const [centre, setCentre] = useState("Centre 1");
  const [date, setDate] = useState({ mm: "05", dd: "25", yyyy: "2026" });
  const [time, setTime] = useState({ hh: "10", mm: "00", period: "AM" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [bookedAssessment, setBookedAssessment] = useState<Assessment | null>(null);
  const [bookingHistory, setBookingHistory] = useState<Assessment[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const companies = [
    { id: "microsoft", label: "Microsoft" },
    { id: "google", label: "Google" },
    { id: "amazon", label: "Amazon" },
    { id: "meta", label: "Meta" },
    { id: "infosys", label: "Infosys" },
  ];

  const companySkills: Record<string, string[]> = {
    microsoft: ["C#", "SQL Server", "Web2.0", "React"],
    google: ["Python", "Go", "Data Structures", "System Design"],
    amazon: ["Java", "AWS", "SQL", "Algorithms"],
    meta: ["JavaScript", "React", "GraphQL", "Python"],
    infosys: ["Java", "Spring Boot", "SQL", "Agile"],
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const { ok, data } = await apiCall("/assessments/my");
      if (ok) setBookingHistory(data.data.assessments || []);
    } catch { }
    finally { setHistoryLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!zipCode.trim()) { setErrors({ zipCode: "Zip code is required" }); return; }
    setLoading(true);
    try {
      const { ok, data } = await apiCall("/assessments/schedule", {
        method: "POST",
        body: JSON.stringify({
          company: selectedCompany,
          skills: companySkills[selectedCompany] || [],
          scheduledDate: `${date.yyyy}-${date.mm}-${date.dd}`,
          scheduledTime: `${time.hh}:${time.mm} ${time.period}`,
          centre,
          country,
          zipCode,
        }),
      });
      if (ok) {
        setBookedAssessment(data.data.assessment);
        await loadHistory();
      } else {
        setErrors({ general: data.message || "Failed to schedule assessment." });
      }
    } catch { setErrors({ general: "Network error. Please try again." }); }
    finally { setLoading(false); }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const statusColor = (s: string) => ({ scheduled: "bg-blue-500/20 text-blue-300", completed: "bg-green-500/20 text-green-300", cancelled: "bg-red-500/20 text-red-300", no_show: "bg-yellow-500/20 text-yellow-300" }[s] || "bg-gray-500/20 text-gray-300");

  const upcoming = bookingHistory.filter((a) => a.status === "scheduled");
  const past = bookingHistory.filter((a) => a.status !== "scheduled");

  if (bookedAssessment) {
    return (
      <div className="text-white">
        <div className="text-center py-6">
          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-14 h-14 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Slot Booked Successfully!</h2>
          <p className="text-gray-300 mb-6">Your assessment has been scheduled. A confirmation email will be sent to you.</p>
          <div className="bg-white/10 rounded-xl p-6 text-left max-w-md mx-auto mb-6">
            <h3 className="font-semibold text-lg mb-4 text-center">Booking Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Company</span><span className="font-medium capitalize">{bookedAssessment.company}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Date</span><span>{formatDate(bookedAssessment.scheduledDate)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Time</span><span>{bookedAssessment.scheduledTime}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Centre</span><span>{bookedAssessment.centre}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Location</span><span>{bookedAssessment.country} - {bookedAssessment.zipCode}</span></div>
              <div><span className="text-gray-400">Skills</span><div className="flex flex-wrap gap-1 mt-1">{bookedAssessment.skills.map((s) => <span key={s} className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded">{s}</span>)}</div></div>
            </div>
          </div>
          <button onClick={() => setBookedAssessment(null)} className="bg-gradient-to-r from-[#4ECDC4] to-[#2d8a84] text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-all">
            Book Another Assessment
          </button>
        </div>

        {bookingHistory.length > 0 && (
          <div className="mt-8 border-t border-white/20 pt-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><History className="w-5 h-5" />Booking History ({bookingHistory.length})</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-blue-500/20 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-blue-300">{bookingHistory.length}</p><p className="text-xs text-gray-400">Total</p></div>
              <div className="bg-green-500/20 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-green-300">{upcoming.length}</p><p className="text-xs text-gray-400">Upcoming</p></div>
              <div className="bg-purple-500/20 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-purple-300">{past.length}</p><p className="text-xs text-gray-400">Completed</p></div>
            </div>
            <div className="space-y-3">
              {bookingHistory.map((a) => (
                <div key={a._id} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium capitalize">{a.company}</p>
                    <p className="text-sm text-gray-400">{formatDate(a.scheduledDate)} at {a.scheduledTime}</p>
                    <p className="text-xs text-gray-500">{a.centre}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusColor(a.status)}`}>{a.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Stats */}
      {!historyLoading && bookingHistory.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-blue-500/20 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-blue-300">{bookingHistory.length}</p><p className="text-xs text-gray-400">Total Booked</p></div>
          <div className="bg-green-500/20 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-green-300">{upcoming.length}</p><p className="text-xs text-gray-400">Upcoming</p></div>
          <div className="bg-purple-500/20 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-purple-300">{past.length}</p><p className="text-xs text-gray-400">Completed</p></div>
        </div>
      )}

      <h2 className="text-2xl font-semibold text-center mb-6">Schedule Assessment</h2>
      {errors.general && <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4"><p className="text-red-300 text-sm">{errors.general}</p></div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company */}
        <div>
          <label className="block mb-2 text-sm">Select Company</label>
          <div className="flex flex-wrap gap-2">
            {companies.map((c) => (
              <button key={c.id} type="button" onClick={() => setSelectedCompany(c.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCompany === c.id ? "bg-blue-600 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}>
                {c.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-400 bg-white/5 p-2 rounded">
            Skills: <strong className="text-white">{(companySkills[selectedCompany] || []).join(", ")}</strong>
          </p>
        </div>

        {/* Date */}
        <div>
          <label className="block mb-2 text-sm">Assessment Date</label>
          <div className="flex gap-2">
            {["mm", "dd", "yyyy"].map((field) => (
              <div key={field} className="flex-1">
                <input type="number" placeholder={field.toUpperCase()} value={date[field as keyof typeof date]}
                  onChange={(e) => setDate((p) => ({ ...p, [field]: e.target.value }))}
                  className="w-full bg-[#333333] rounded px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-center" />
                <p className="text-xs text-gray-500 text-center mt-0.5 capitalize">{field === "mm" ? "Month" : field === "dd" ? "Day" : "Year"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Time */}
        <div>
          <label className="block mb-2 text-sm">Assessment Time</label>
          <div className="flex gap-2 items-center">
            <input type="number" placeholder="HH" min="1" max="12" value={time.hh}
              onChange={(e) => setTime((p) => ({ ...p, hh: e.target.value.padStart(2, "0") }))}
              className="w-20 bg-[#333333] rounded px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-center" />
            <span className="text-gray-400 text-xl">:</span>
            <input type="number" placeholder="MM" min="0" max="59" step="15" value={time.mm}
              onChange={(e) => setTime((p) => ({ ...p, mm: e.target.value.padStart(2, "0") }))}
              className="w-20 bg-[#333333] rounded px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-center" />
            <select value={time.period} onChange={(e) => setTime((p) => ({ ...p, period: e.target.value }))}
              className="bg-[#333333] rounded px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option>AM</option><option>PM</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm">Country</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-[#333333] rounded px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option>India</option><option>USA</option><option>UK</option><option>Canada</option><option>Australia</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm">Assessment Centre</label>
            <select value={centre} onChange={(e) => setCentre(e.target.value)} className="w-full bg-[#333333] rounded px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option>Centre 1</option><option>Centre 2</option><option>Centre 3</option><option>Centre 4</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm">Zip Code</label>
            <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)}
              className={`w-full bg-[#333333] rounded px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.zipCode ? "ring-2 ring-red-400" : ""}`} />
            {errors.zipCode && <p className="text-red-300 text-xs mt-1">{errors.zipCode}</p>}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3 rounded bg-gradient-to-r from-[#4ECDC4] to-[#2d8a84] text-white font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Scheduling...</> : <><Calendar className="w-5 h-5" />Book Assessment Slot</>}
        </button>
      </form>

      {/* History */}
      {!historyLoading && bookingHistory.length > 0 && (
        <div className="mt-8 border-t border-white/20 pt-6">
          <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 text-gray-300 hover:text-white text-sm font-medium w-full justify-between">
            <span className="flex items-center gap-2"><History className="w-5 h-5" />Booking History ({bookingHistory.length})</span>
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showHistory && (
            <div className="mt-4 space-y-3">
              {bookingHistory.map((a) => (
                <div key={a._id} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium capitalize">{a.company}</p>
                    <p className="text-sm text-gray-400">{formatDate(a.scheduledDate)} at {a.scheduledTime}</p>
                    <p className="text-xs text-gray-500">{a.centre}, {a.country}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize flex-shrink-0 ${statusColor(a.status)}`}>{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
