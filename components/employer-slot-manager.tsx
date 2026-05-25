"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, Clock, MapPin, Users, Loader2, CheckCircle } from "lucide-react";
import { apiCall } from "@/context/AuthContext";

interface Slot {
  _id: string;
  date: string;
  time: string;
  center: string;
  location: string;
  skills: string[];
  capacity: number;
  bookedCount: number;
  isActive: boolean;
}

export default function EmployerSlotManager() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [form, setForm] = useState({
    date: "", time: "", center: "", location: "", capacity: "30", skills: [] as string[],
  });

  useEffect(() => { fetchSlots(); }, []);

  const fetchSlots = async () => {
    setLoading(true);
    const { ok, data } = await apiCall("/employers/slots");
    if (ok) setSlots(data.data.slots || []);
    setLoading(false);
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm(p => ({ ...p, skills: [...p.skills, s] }));
    }
    setSkillInput("");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.date || !form.time || !form.center || !form.location) {
      setError("All fields are required"); return;
    }
    setSubmitting(true);
    const { ok, data } = await apiCall("/employers/slots", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (ok) {
      setSuccess("Slot created successfully!");
      setForm({ date: "", time: "", center: "", location: "", capacity: "30", skills: [] });
      setShowForm(false);
      fetchSlots();
    } else {
      setError(data.message || "Failed to create slot");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slot?")) return;
    const { ok, data } = await apiCall(`/employers/slots/${id}`, { method: "DELETE" });
    if (ok) fetchSlots();
    else alert(data.message);
  };

  const inputClass = "w-full bg-[#0a1628] border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00418d] text-body";

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-headingSm font-semibold text-black">Assessment Slots</h2>
        <button onClick={() => { setShowForm(!showForm); setError(""); setSuccess(""); }}
          className="flex items-center gap-2 bg-[#00418d] hover:bg-[#003070] px-4 py-2 rounded-lg text-body font-medium transition-colors">
          <Plus className="w-4 h-4" /> {showForm ? "Cancel" : "Add Slot"}
        </button>
      </div>

      {success && <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-green-300 text-body">{success}</span></div>}
      {error && <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4"><p className="text-red-300 text-body">{error}</p></div>}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white/5 border border-white/10 rounded-xl p-5 mb-5 space-y-4">
          <h3 className="font-medium text-body text-gray-300 uppercase tracking-wide">New Assessment Slot</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-caption text-black mb-1">Date</label>
              <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-caption text-black mb-1">Time</label>
              <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-caption text-black mb-1">Test Center Name</label>
              <input type="text" value={form.center} onChange={e => setForm(p => ({ ...p, center: e.target.value }))} placeholder="e.g. TCS Bangalore Hub" className={inputClass} />
            </div>
            <div>
              <label className="block text-caption text-black mb-1">Location / City</label>
              <input type="text" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Bangalore, Karnataka" className={inputClass} />
            </div>
            <div>
              <label className="block text-caption text-black mb-1">Seat Capacity</label>
              <input type="number" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} min="1" max="500" className={inputClass} />
            </div>
            <div>
              <label className="block text-caption text-black mb-1">Skills to Test</label>
              <div className="flex gap-2">
                <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                  placeholder="Add skill + Enter" className={`${inputClass} flex-1`} />
                <button type="button" onClick={addSkill} className="bg-[#00418d] px-3 rounded-lg text-body">+</button>
              </div>
              {form.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.skills.map(s => (
                    <span key={s} className="bg-[#00418d]/20 text-black text-caption px-2 py-0.5 rounded-full flex items-center gap-1">
                      {s} <button type="button" onClick={() => setForm(p => ({ ...p, skills: p.skills.filter(x => x !== s) }))} className="hover:text-red-300">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 rounded-lg text-body font-medium disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Creating...</> : "Create Slot"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[#4d8fda]" /></div>
      ) : slots.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No slots created yet. Add your first assessment slot.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {slots.map(slot => (
            <div key={slot._id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="flex items-center gap-1.5 text-black text-body font-medium"><Calendar className="w-4 h-4 text-[#4d8fda]" />{new Date(slot.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span className="flex items-center gap-1.5 text-black"><Clock className="w-4 h-4 text-green-400" />{slot.time}</span>
                  <span className={`text-caption px-2 py-0.5 rounded-full ${slot.bookedCount >= slot.capacity ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-700"}`}>
                    {slot.bookedCount}/{slot.capacity} seats
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-body text-black">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-black" />{slot.center}</span>
                  <span className="text-black">{slot.location}</span>
                </div>
                {slot.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {slot.skills.map(s => <span key={s} className="bg-[#00418d]/10  text-caption text-black px-2 py-0.5 rounded-full">{s}</span>)}
                  </div>
                )}
              </div>
              {slot.bookedCount === 0 && (
                <button onClick={() => handleDelete(slot._id)} className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0">
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