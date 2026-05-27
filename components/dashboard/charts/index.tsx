// components/dashboard/charts/index.tsx
// ─── SkillKwiz Chart Components (Recharts) ────────────────────────────────────
"use client";

import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
} from "recharts";

const SK_BLUE   = "#00418d";
const SK_LIGHT  = "#daeeff";
const SK_RED    = "#f73e5d";
const SK_YELLOW = "#f6c648";

// ─── Tooltip styling ─────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label, prefix = "", suffix = "" }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#e2edf7] rounded-xl px-3 py-2.5
      shadow-lg shadow-[#00418d]/10 text-xs">
      <p className="text-gray-500 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="font-semibold" style={{ color: p.color }}>
          {p.name}: {prefix}{typeof p.value === "number" ? p.value.toLocaleString() : p.value}{suffix}
        </p>
      ))}
    </div>
  );
}

// ─── Revenue Bar Chart ────────────────────────────────────────────────────────

interface RevenueChartProps {
  data: { month: string; total: number }[];
  height?: number;
}

export function RevenueBarChart({ data, height = 200 }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barSize={28} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="#f0f5fb" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip prefix="$" />} />
        <Bar dataKey="total" name="Revenue" fill={SK_BLUE} radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Stacked Revenue (by plan) ────────────────────────────────────────────────

interface StackedRevenueProps {
  data: { month: string; starter: number; growth: number; enterprise: number }[];
  height?: number;
}

export function StackedRevenueChart({ data, height = 220 }: StackedRevenueProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barSize={24} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="#f0f5fb" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip prefix="$" />} />
        <Legend wrapperStyle={{ fontSize: 11, color: "#6b7280" }} />
        <Bar dataKey="starter"    name="Starter"    stackId="a" fill="#b3d4f5" radius={[0,0,0,0]} />
        <Bar dataKey="growth"     name="Growth"     stackId="a" fill={SK_BLUE} radius={[0,0,0,0]} />
        <Bar dataKey="enterprise" name="Enterprise" stackId="a" fill="#0a1628" radius={[5,5,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── User Growth Line Chart ───────────────────────────────────────────────────

interface GrowthChartProps {
  data: { month: string; candidates: number; employers: number }[];
  height?: number;
}

export function GrowthLineChart({ data, height = 200 }: GrowthChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="#f0f5fb" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line type="monotone" dataKey="candidates" name="Candidates"
          stroke={SK_BLUE} strokeWidth={2} dot={{ r: 3, fill: SK_BLUE }} />
        <Line type="monotone" dataKey="employers" name="Employers"
          stroke={SK_RED} strokeWidth={2} dot={{ r: 3, fill: SK_RED }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Credits Usage Area Chart ─────────────────────────────────────────────────

interface CreditsChartProps {
  data: { month: string; used: number; purchased: number }[];
  height?: number;
}

export function CreditsAreaChart({ data, height = 180 }: CreditsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="gradUsed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={SK_BLUE}  stopOpacity={0.15} />
            <stop offset="95%" stopColor={SK_BLUE}  stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradPurchased" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={SK_LIGHT} stopOpacity={0.4} />
            <stop offset="95%" stopColor={SK_LIGHT} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#f0f5fb" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip suffix=" credits" />} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Area type="monotone" dataKey="purchased" name="Purchased"
          stroke={SK_LIGHT} strokeWidth={2} fill="url(#gradPurchased)" />
        <Area type="monotone" dataKey="used" name="Used"
          stroke={SK_BLUE} strokeWidth={2} fill="url(#gradUsed)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Score Distribution Bar Chart ────────────────────────────────────────────

interface ScoreDistProps {
  data: { bucket: string; count: number }[];
  height?: number;
}

export function ScoreDistChart({ data, height = 160 }: ScoreDistProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barSize={24} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="#f0f5fb" />
        <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip suffix=" candidates" />} />
        <Bar dataKey="count" name="Candidates" fill={SK_BLUE} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Booking Trend Line ───────────────────────────────────────────────────────

interface BookingTrendProps {
  data: { week: string; bookings: number }[];
  height?: number;
}

export function BookingTrendChart({ data, height = 160 }: BookingTrendProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="gradBookings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={SK_BLUE} stopOpacity={0.12} />
            <stop offset="95%" stopColor={SK_BLUE} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#f0f5fb" />
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="bookings" name="Bookings"
          stroke={SK_BLUE} strokeWidth={2} fill="url(#gradBookings)"
          dot={{ r: 3, fill: SK_BLUE }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── API Response Time Chart ──────────────────────────────────────────────────

interface ApiChartProps {
  data: { hour: string; ms: number }[];
  height?: number;
}

export function ApiResponseChart({ data, height = 160 }: ApiChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="#f0f5fb" />
        <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false}
          tickFormatter={(v) => `${v}ms`} />
        <Tooltip content={<CustomTooltip suffix="ms" />} />
        <Line type="monotone" dataKey="ms" name="Response"
          stroke={SK_BLUE} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
