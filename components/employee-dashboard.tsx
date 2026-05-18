"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, CheckCircle, XCircle, RefreshCw, Plus } from "lucide-react";

const API_BASE = "http://localhost:5000/api";

interface Booking {
  _id: string;
  bookingReference?: string;
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

interface BookingStats {
  total: number;
  upcoming: number;
  completed: number;
}

export default function EmployeeDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats>({ total: 0, upcoming: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "scheduled" | "completed" | "cancelled">("all");

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("sk_token");
      const qs = filter !== "all" ? `?status=${filter}` : "";
      const response = await fetch(`${API_BASE}/assessments/my${qs}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to fetch bookings");
      }

      const data = await response.json();
      const allBookings: Booking[] = data.data?.assessments || [];
      setBookings(allBookings);
      setStats({
        total: allBookings.length,
        upcoming: allBookings.filter((b) => b.status === "scheduled").length,
        completed: allBookings.filter((b) => b.status === "completed").length,
      });
    } catch (err: any) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
      scheduled: { icon: <Clock className="w-4 h-4" />, color: "text-blue-300", bg: "bg-blue-500/20" },
      completed: { icon: <CheckCircle className="w-4 h-4" />, color: "text-green-300", bg: "bg-green-500/20" },
      cancelled: { icon: <XCircle className="w-4 h-4" />, color: "text-red-300", bg: "bg-red-500/20" },
      no_show: { icon: <XCircle className="w-4 h-4" />, color: "text-yellow-300", bg: "bg-yellow-500/20" },
    };
    return configs[status] || { icon: null, color: "text-gray-300", bg: "bg-gray-500/20" };
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">My Assessment Dashboard</h2>
        <button
          onClick={fetchBookings}
          disabled={loading}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500/20 rounded-xl p-4 text-center border border-blue-500/30">
          <p className="text-3xl font-bold text-blue-300">{stats.total}</p>
          <p className="text-sm text-gray-400 mt-1">Total Exams</p>
        </div>
        <div className="bg-green-500/20 rounded-xl p-4 text-center border border-green-500/30">
          <p className="text-3xl font-bold text-green-300">{stats.upcoming}</p>
          <p className="text-sm text-gray-400 mt-1">Upcoming</p>
        </div>
        <div className="bg-purple-500/20 rounded-xl p-4 text-center border border-purple-500/30">
          <p className="text-3xl font-bold text-purple-300">{stats.completed}</p>
          <p className="text-sm text-gray-400 mt-1">Completed</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {(["all", "scheduled", "completed", "cancelled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === f ? "bg-blue-600 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {f === "all" ? "All Bookings" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4ECDC4] mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading your bookings...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
          <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-300 mb-3">{error}</p>
          <button onClick={fetchBookings} className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg text-sm">
            Try Again
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white/5 rounded-xl p-10 text-center border border-white/10">
          <Calendar className="w-14 h-14 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-300 text-lg font-medium mb-2">No bookings found</p>
          <p className="text-gray-500 text-sm mb-5">
            {filter === "all" ? "You haven't booked any assessments yet." : `No ${filter} assessments.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.status);
            return (
              <div
                key={booking._id}
                className="bg-white/5 hover:bg-white/10 rounded-xl p-5 border border-white/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold capitalize text-lg">{booking.company}</h3>
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full capitalize ${statusConfig.bg} ${statusConfig.color}`}>
                        {statusConfig.icon}{booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        {formatDate(booking.scheduledDate)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        {booking.scheduledTime}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        {booking.centre}
                      </div>
                      <div className="text-xs">
                        {booking.country} — {booking.zipCode}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {booking.skills.map((skill) => (
                        <span key={skill} className="bg-blue-500/20 text-blue-300 text-xs px-2.5 py-0.5 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-gray-600 mt-2">
                      Booked: {formatDate(booking.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
