// app/dashboard/employer/slots/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Calendar } from "lucide-react";
import {
  PageHeader, Btn, SectionCard, EmptyState, SkeletonTable,
} from "@/components/dashboard/shared";
import { useSlots } from "@/hooks";
import { slotsAPI } from "@/services/api";
import type { Slot } from "@/types/dashboard";

function SlotCard({
  slot,
  onDelete,
  deleting,
}: {
  slot: Slot;
  onDelete: (id: string) => void;
  deleting: string | null;
}) {
  const full     = slot.booked >= slot.capacity;
  const pct      = Math.round((slot.booked / slot.capacity) * 100);
  const barColor = full ? "bg-emerald-400" : pct >= 60 ? "bg-amber-400" : "bg-[#00418d]";

  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-3 transition-all
        ${full
          ? "bg-emerald-50 border-emerald-200"
          : "bg-white border-[#e2edf7] hover:border-[#00418d]/40 hover:shadow-sm"
        }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">{slot.date}</p>
          <p className="text-sm font-semibold text-gray-800">{slot.time}</p>
        </div>
        {full ? (
          <span className="text-xs font-medium text-emerald-700 bg-emerald-100
            border border-emerald-200 px-2 py-0.5 rounded-full">
            Full
          </span>
        ) : (
          <span className="text-xs text-gray-400">{slot.capacity - slot.booked} left</span>
        )}
      </div>

      {/* Capacity bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{slot.booked} / {slot.capacity} booked</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {!full && (
        <div className="flex items-center gap-2">
          <Btn size="sm" icon={<Edit2 size={11} />} className="flex-1 justify-center">
            Edit
          </Btn>
          <Btn
            size="sm"
            variant="danger"
            icon={<Trash2 size={11} />}
            disabled={deleting === slot._id}
            onClick={() => onDelete(slot._id)}
          />
        </div>
      )}
    </div>
  );
}

export default function EmployerSlotsPage() {
  const { data: slots = [], loading, reload } = useSlots();
  const [selectedDate, setSelectedDate] = useState("");
  const [deleting,     setDeleting]     = useState<string | null>(null);

  // ─── Create form state ────────────────────────────────────────────────────────
  const [form,        setForm]        = useState({ date: "", time: "", capacity: "5" });
  const [saving,      setSaving]      = useState(false);
  const [createError, setCreateError] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slot?")) return;
    setDeleting(id);
    await slotsAPI.remove(id);
    setDeleting(null);
    reload();
  };

  useEffect(() => {
    if (!selectedDate && slots.length > 0) {
      setSelectedDate(slots[0].date);
    }
  }, [slots, selectedDate]);

  const handleCreate = async () => {
    if (!form.date || !form.time) {
      setCreateError("Date and time are required.");
      return;
    }
    setSaving(true);
    setCreateError("");

    const res = await slotsAPI.create({
      date:     form.date,
      time:     form.time,
      center:   "Online",
      location: "Remote",
      capacity: Number(form.capacity),
    });

    setSaving(false);

    if (res.ok) {
      setForm({ date: "", time: "", capacity: "5" });
      reload();
    } else if (res.status === 403) {
      setCreateError(
        "You need an active plan to create slots. Go to Billing to purchase one."
      );
    } else {
      setCreateError(res.message || "Failed to create slot.");
    }
  };

  const dates = [...new Set(slots.map((s) => s.date))];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Slot Manager"
        subtitle="Manage assessment time slots"
        actions={
          <Btn
            variant="primary"
            icon={<Plus size={14} />}
            onClick={() =>
              document.getElementById("add-slot-form")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Add Slot
          </Btn>
        }
      />

      {/* Date tabs */}
      {dates.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {dates.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm
                font-medium transition-all border
                ${selectedDate === d
                  ? "bg-[#00418d] text-white border-[#00418d]"
                  : "bg-white text-gray-500 border-[#e2edf7] hover:bg-[#f0f7ff]"
                }`}
            >
              <Calendar size={13} />
              {d}
            </button>
          ))}
        </div>
      )}

      {/* Slot grid */}
      {loading ? (
        <SkeletonTable rows={3} />
      ) : selectedDate && slots.filter((s) => s.date === selectedDate).length === 0 ? (
        <EmptyState
          title="No slots for this date"
          description="Add slots below to start accepting bookings."
        />
      ) : !selectedDate ? (
        <EmptyState
          title="No slots yet"
          description="Create your first slot below."
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {slots
            .filter((s) => s.date === selectedDate)
            .map((slot) => (
              <SlotCard
                key={slot._id}
                slot={slot}
                onDelete={handleDelete}
                deleting={deleting}
              />
            ))}
        </div>
      )}

      {/* Add new slot form */}
      <SectionCard title="Add New Slot" id="add-slot-form">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: "date",     label: "Date",     type: "date",   placeholder: "" },
            { key: "time",     label: "Time",     type: "time",   placeholder: "" },
            { key: "capacity", label: "Capacity", type: "number", placeholder: "5" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key as keyof typeof form]}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full text-sm border border-[#e2edf7] rounded-lg px-3 py-2.5
                  bg-[#f0f7ff] text-gray-700 outline-none focus:border-[#00418d] transition-colors"
              />
            </div>
          ))}
        </div>

        {createError && (
          <p className="text-xs text-red-500 mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {createError}
          </p>
        )}

        <div className="flex justify-end mt-4">
          <Btn variant="primary" onClick={handleCreate} disabled={saving}>
            {saving ? "Creating…" : "Create Slot"}
          </Btn>
        </div>
      </SectionCard>
    </div>
  );
}