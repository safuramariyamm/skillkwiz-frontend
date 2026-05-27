// app/dashboard/employee/booking/page.tsx
"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, AlertCircle, CheckCircle } from "lucide-react";
import { PageHeader, SectionCard, Btn, EmptyState } from "@/components/dashboard/shared";
import { employeeAPI } from "@/services/api";
import { useEmployeeSlots } from "@/hooks";

interface SlotOption {
  _id: string;
  date: string;
  time: string;
  spotsLeft: number;
  full: boolean;
  center?: string;
  location?: string;
  skills?: string[];
}

type Status = "idle" | "booking" | "success" | "error";

export default function EmployeeBookingPage() {
  const { data, loading, reload } = useEmployeeSlots();
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [bookedSlot, setBookedSlot] = useState<SlotOption | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const slots: SlotOption[] = (data?.slots || []).map((s: any) => ({
    _id: s._id,
    date: s.date,
    time: s.time,
    spotsLeft: s.availableSeats ?? s.capacity - (s.bookedCount || 0),
    full: s.isFull ?? s.bookedCount >= s.capacity,
    center: s.center,
    location: s.location,
    skills: s.skills,
  }));

  const selectedSlotData = slots.find((s) => s._id === selected);
  const firstSlot = slots[0];

  const handleConfirm = async () => {
    if (!selected || !selectedSlotData) return;
    setStatus("booking");
    setErrorMsg("");
    const res = await employeeAPI.bookSlot(selected);
    if (res.ok) {
      setBookedSlot(selectedSlotData);
      setStatus("success");
      reload();
    } else {
      setErrorMsg(res.message || "Booking failed");
      setStatus("error");
    }
  };

  const dates = [...new Set(slots.map((s) => s.date))];

  return (
    <div className="space-y-5">
      <PageHeader title="Book Assessment Slot" subtitle="Select a time slot from your employer" />

      {firstSlot && (
        <div className="bg-white border border-[#daeeff] rounded-xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#daeeff] flex items-center justify-center flex-shrink-0">
            <CalendarCheck size={20} className="text-[#00418d]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {(firstSlot.skills || []).join(", ") || "Company Assessment"}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {firstSlot.center || "Online"} · {firstSlot.location || "Remote"}
            </p>
          </div>
        </div>
      )}

      {status === "success" && bookedSlot && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
          <CheckCircle size={40} className="text-emerald-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-emerald-800">Booking Confirmed!</h3>
          <p className="text-sm text-emerald-700 mt-1">
            {bookedSlot.date} at {bookedSlot.time}
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-2 text-red-700 text-sm">
          <AlertCircle size={18} className="flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="h-40 bg-white border border-[#e2edf7] rounded-xl animate-pulse" />
      ) : slots.length === 0 ? (
        <EmptyState
          title="No slots available"
          description="Your employer has not created assessment slots yet. Check back later."
        />
      ) : (
        <SectionCard title="Available Slots">
          {dates.map((date) => (
            <div key={date} className="mb-6 last:mb-0">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{date}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {slots
                  .filter((s) => s.date === date)
                  .map((slot) => (
                    <button
                      key={slot._id}
                      disabled={slot.full || status === "booking"}
                      onClick={() => setSelected(slot._id)}
                      className={`p-3 rounded-xl border text-left text-sm transition-all
                        ${slot.full ? "opacity-40 cursor-not-allowed bg-gray-50" : ""}
                        ${selected === slot._id
                          ? "border-[#00418d] bg-[#f0f7ff] ring-2 ring-[#00418d]/20"
                          : "border-[#e2edf7] bg-white hover:border-[#00418d]/40"
                        }`}
                    >
                      <p className="font-semibold text-gray-800">{slot.time}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {slot.full ? "Full" : `${slot.spotsLeft} spot(s) left`}
                      </p>
                    </button>
                  ))}
              </div>
            </div>
          ))}

          {selected && status !== "success" && (
            <div className="mt-6 pt-4 border-t border-[#e2edf7]">
              <Btn
                variant="primary"
                onClick={handleConfirm}
                disabled={status === "booking"}
              >
                {status === "booking" ? "Booking…" : "Confirm Booking"}
              </Btn>
            </div>
          )}
        </SectionCard>
      )}
    </div>
  );
}
