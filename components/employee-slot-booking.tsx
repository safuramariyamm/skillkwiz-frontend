"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, CheckCircle, Loader2 } from "lucide-react";
const CE_API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const ceApiCall = async (path: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("sk_ce_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  try {
    const res = await fetch(`${CE_API_BASE}${path}`, { ...options, headers });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch {
    return { ok: false, data: { message: "Network error" } };
  }
};

interface Slot {
  _id: string;
  date: string;
  time: string;
  center: string;
  location: string;
  skills: string[];
  capacity: number;
  bookedCount: number;
  availableSeats: number;
  isFull: boolean;
}

interface BookingConfirmation {
  slotId: string;
  date: string;
  time: string;
  center: string;
  location: string;
  skills: string[];
}

export default function EmployeeSlotBooking() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<BookingConfirmation | null>(null);
  const [error, setError] = useState("");
  const [alreadyBooked, setAlreadyBooked] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("sk_user") || "{}");
    if (user.status === "booked" || user.status === "assessed") {
      setAlreadyBooked(true);
    }
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    setLoading(true);
    const { ok, data } = await ceApiCall("/assessments/available-slots");
    if (ok) setSlots(data.data.slots || []);
    else setError(data.message || "Failed to load slots");
    setLoading(false);
  };

  const handleBook = async (slotId: string) => {
    if (!confirm("Are you sure? You cannot reschedule after booking.")) return;
    setBooking(slotId);
    setError("");
    const { ok, data } = await ceApiCall("/assessments/book-slot", {
      method: "POST",
      body: JSON.stringify({ slotId }),
    });
    if (ok) {
      setConfirmed(data.data.booking);
      // Update user status in localStorage
      const user = JSON.parse(localStorage.getItem("sk_user") || "{}");
      localStorage.setItem("sk_user", JSON.stringify({ ...user, status: "booked" }));
      setAlreadyBooked(true);
    } else {
      setError(data.message || "Booking failed");
    }
    setBooking(null);
  };

  if (confirmed) {
    return (
      <div className="text-black text-center py-8">
        <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-14 h-14 text-black" />
        </div>
        <h2 className="text-headingMd font-bold mb-2 text-black">Slot Booked Successfully!</h2>
        <p className="text-black mb-4">Your assessment slot has been confirmed. Check your email for details.</p>
           <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-w-sm mx-auto text-left space-y-2">
          <h3 className="text-body text-black font-medium text-center mb-2">Booking Confirmation</h3>
          <div className="space-y-2 text-body">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-black" /><span>{new Date(confirmed.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span></div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-black" /><span>{confirmed.time}</span></div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-black" /><span>{confirmed.center}, {confirmed.location}</span></div>
            {confirmed.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {confirmed.skills.map(s => <span key={s} className="bg-[#00418d]/20 text-[#c3dfff] text-caption px-2 py-0.5 rounded-full">{s}</span>)}
              </div>
            )}
          </div>
        </div>
        <p className="text-yellow-300 text-body mt-3">⚠️ No rescheduling allowed. Please arrive 15 minutes early with valid ID.</p>
      </div>
    );
  }

  if (alreadyBooked && !confirmed) {
    return (
      <div className="text-black text-center py-10">
        <CheckCircle className="w-16 h-16 text-black mx-auto mb-4" />
         <h2 className="text-headingSm font-semibold mb-1">You've Already Booked a Slot</h2>
        <p className="text-black text-body">No rescheduling is allowed. Please check your email for booking details.</p>
      </div>
    );
  }

  return (
    <div className="text-black">
      <h2 className="text-headingSm font-semibold mb-2">Available Assessment Slots</h2>
      <p className="text-black text-body mb-4">Select your preferred slot. <span className="text-yellow-300">You can only book once — no rescheduling.</span></p>

      {error && <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4"><p className="text-white text-body">{error}</p></div>}
      {loading ? (
        <div className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[#4d8fda]" /></div>
      ) : slots.length === 0 ? (
        <div className="text-center py-10 text-black">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No assessment slots available yet. Check back later or contact your employer.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {slots.map(slot => (
            <div key={slot._id} className={`border rounded-xl p-4 transition-colors ${slot.isFull ? "bg-white/3 border-white/5 opacity-60" : "bg-white/5 border-white/10 hover:border-[#00418d]/40"}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                     <span className="flex items-center gap-1 font-medium"><Calendar className="w-4 h-4 text-black" />{new Date(slot.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
                     <span className="flex items-center gap-1 text-body text-gray-300"><Clock className="w-4 h-4 text-black" />{slot.time}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-body text-black mb-2">
                     <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{slot.center}</span>
                     <span>{slot.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-caption ${slot.isFull ? "text-red-300" : "text-green-300"}`}>
                       <Users className="w-3.5 h-3.5" />{slot.isFull ? "Full" : `${slot.availableSeats} seats left`}
                     </span>
                     {slot.skills.length > 0 && slot.skills.map(s => (
                       <span key={s} className="bg-[#00418d]/10 text-[#c3dfff] text-caption px-2 py-0.5 rounded-full hover:bg-[#00418d]/20 cursor-default transition-colors">{s}</span>
                     ))}
                  </div>
                </div>
                <button onClick={() => handleBook(slot._id)}
                  disabled={slot.isFull || booking === slot._id}
                  className={`px-4 py-2 rounded-lg text-body font-medium flex-shrink-0 flex items-center gap-2 transition-colors ${slot.isFull ? "bg-gray-600 cursor-not-allowed" : "bg-[#00418d] hover:bg-[#003070]"} disabled:opacity-50`}>
                  {booking === slot._id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {slot.isFull ? "Full" : booking === slot._id ? "Booking..." : "Book Slot"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}