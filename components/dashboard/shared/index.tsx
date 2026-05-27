// components/dashboard/shared/index.tsx
// ─── Shared Dashboard UI Components ──────────────────────────────────────────

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: string;
  trendUp?: boolean;
  subtext?: string;
}

export function StatCard({
  label, value, icon, iconBg = "bg-[#eff6ff]",
  trend, trendUp, subtext,
}: StatCardProps) {
  return (
    <div className="bg-white border border-[#e2edf7] rounded-xl p-4">
      <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium
          ${trendUp ? "text-emerald-600" : "text-[#f73e5d]"}`}>
          {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </div>
      )}
      {subtext && !trend && (
        <div className="text-xs text-gray-400 mt-1">{subtext}</div>
      )}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

interface SectionCardProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function SectionCard({ title, children, className = "", action }: SectionCardProps) {
  return (
    <div className={`bg-white border border-[#e2edf7] rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

type BadgeVariant = "green" | "blue" | "red" | "yellow" | "gray" | "navy";

const BADGE_STYLES: Record<BadgeVariant, string> = {
  green:  "bg-emerald-50 text-emerald-700 border border-emerald-200",
  blue:   "bg-[#eff6ff] text-[#1e40af] border border-blue-200",
  red:    "bg-[#fff0f2] text-[#9f1239] border border-red-200",
  yellow: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  gray:   "bg-gray-100 text-gray-600 border border-gray-200",
  navy:   "bg-[#0a1628] text-white",
};

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export function Badge({ label, variant = "gray" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium
      ${BADGE_STYLES[variant]}`}>
      {label}
    </span>
  );
}

// ─── Data Table ───────────────────────────────────────────────────────────────

interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  keyExtractor: (row: T) => string;
  emptyText?: string;
}

export function DataTable<T>({
  columns, rows, keyExtractor, emptyText = "No data found",
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-400">{emptyText}</div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[#f0f7ff]">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="text-left text-[11px] font-semibold text-gray-500 uppercase
                  tracking-wide px-3 py-2.5 border-b border-[#e2edf7] first:rounded-tl-lg last:rounded-tr-lg"
                style={col.width ? { width: col.width } : {}}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={keyExtractor(row)}
              className="border-b border-[#f0f5fb] last:border-0 hover:bg-[#fafcff] transition-colors"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-3 py-3 text-gray-700">
                  {col.render
                    ? col.render(row)
                    : String((row as any)[col.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

export function SkeletonCard() {
  return (
    <div className="bg-white border border-[#e2edf7] rounded-xl p-4 animate-pulse">
      <div className="w-9 h-9 rounded-lg bg-gray-100 mb-3" />
      <div className="h-6 bg-gray-100 rounded w-20 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-28" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-9 bg-[#f0f7ff] rounded-lg" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-11 bg-gray-50 rounded-lg" />
      ))}
    </div>
  );
}

// ─── Credit Bar ───────────────────────────────────────────────────────────────

interface CreditBarProps {
  used: number;
  total: number;
  plan: string;
  onBuyMore?: () => void;
}

export function CreditBar({ used, total, plan, onBuyMore }: CreditBarProps) {
  const remaining = total - used;
  const pct = total > 0 ? Math.round((remaining / total) * 100) : 0;
  const low = pct <= 20;

  return (
    <div className={`rounded-xl p-4 border flex items-center gap-5
      ${low ? "bg-[#fff0f2] border-[#fdd0d7]" : "bg-white border-[#e2edf7]"}`}>
      <div className="flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className={`text-2xl font-semibold ${low ? "text-[#f73e5d]" : "text-[#00418d]"}`}>
            {remaining}
          </span>
          <span className="text-sm text-gray-400">/ {total} credits</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
          <div
            className={`h-full rounded-full transition-all duration-500
              ${low ? "bg-[#f73e5d]" : "bg-[#00418d]"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{used} used this cycle</span>
          <span className="text-xs font-medium text-[#00418d] bg-[#daeeff] px-2 py-0.5 rounded-full">
            {plan} Plan
          </span>
        </div>
      </div>
      {onBuyMore && (
        <button
          onClick={onBuyMore}
          className="flex-shrink-0 bg-[#00418d] text-white text-xs font-semibold
            px-4 py-2 rounded-lg hover:bg-[#003070] transition-colors"
        >
          Buy More
        </button>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="w-14 h-14 rounded-full bg-[#f0f7ff] flex items-center
          justify-content-center mb-4 text-[#00418d]">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-gray-700">{title}</p>
      {description && (
        <p className="text-xs text-gray-400 mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ─── Primary / Ghost Button ───────────────────────────────────────────────────

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md";
  icon?: React.ReactNode;
}

export function Btn({
  children, variant = "ghost", size = "md", icon,
  className = "", ...rest
}: BtnProps) {
  const base = "inline-flex items-center gap-1.5 font-medium rounded-lg transition-colors";
  const sz = size === "sm" ? "text-xs px-3 py-1.5" : "text-sm px-4 py-2";
  const v = {
    primary: "bg-[#00418d] text-white hover:bg-[#003070]",
    ghost:   "border border-[#e2edf7] text-gray-600 hover:bg-[#f0f7ff]",
    danger:  "bg-[#fff0f2] text-[#f73e5d] border border-[#fdd0d7] hover:bg-[#ffe4e9]",
  }[variant];

  return (
    <button className={`${base} ${sz} ${v} ${className}`} {...rest}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

// ─── Search Input ─────────────────────────────────────────────────────────────

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search..." }: SearchInputProps) {
  return (
    <div className="flex items-center gap-2 bg-[#f0f7ff] border border-[#e2edf7]
      rounded-lg px-3 py-2 text-sm">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" className="text-gray-400 flex-shrink-0">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent outline-none text-gray-700 placeholder:text-gray-400
          w-full text-sm"
      />
    </div>
  );
}

// ─── Timeline Item ────────────────────────────────────────────────────────────

interface TimelineItemProps {
  icon: React.ReactNode;
  iconBg?: string;
  title: string;
  time: string;
}

export function TimelineItem({
  icon, iconBg = "bg-[#eff6ff]", title, time,
}: TimelineItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center
        justify-center flex-shrink-0 mt-0.5`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 leading-snug">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
}
