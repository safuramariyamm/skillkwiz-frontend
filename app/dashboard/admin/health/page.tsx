// app/dashboard/admin/health/page.tsx
"use client";

import { RefreshCw, Server, CreditCard, Database, AlertTriangle } from "lucide-react";
import {
  PageHeader, Btn, SectionCard, DataTable, Badge, TimelineItem,
} from "@/components/dashboard/shared";
import { ApiResponseChart } from "@/components/dashboard/charts";

const API_DATA = [
  { hour:"0h", ms:180 }, { hour:"2h", ms:195 }, { hour:"4h", ms:210 },
  { hour:"6h", ms:185 }, { hour:"8h", ms:175 }, { hour:"10h", ms:220 },
  { hour:"12h", ms:240 }, { hour:"14h", ms:195 }, { hour:"16h", ms:180 },
  { hour:"18h", ms:170 }, { hour:"20h", ms:185 }, { hour:"22h", ms:200 },
  { hour:"24h", ms:190 },
];

const FAILED_TX = [
  { _id:"f1", date:"Jun 26", employer:"DevCo Ltd",     amount:99,  reason:"Card declined",       orderId:"PP-8821" },
  { _id:"f2", date:"Jun 25", employer:"AlphaHire",     amount:299, reason:"PayPal timeout",      orderId:"PP-8819" },
  { _id:"f3", date:"Jun 24", employer:"BetaRecruit",   amount:599, reason:"Insufficient funds",  orderId:"PP-8801" },
];

const ACTIVITY = [
  { icon:<Server size={14} className="text-emerald-700" />,   bg:"bg-emerald-50", title:'React Senior assessment completed by 3 candidates', time:"5 min ago" },
  { icon:<CreditCard size={14} className="text-amber-700" />, bg:"bg-amber-50",   title:'Python Fundamentals assessment started',            time:"12 min ago" },
  { icon:<AlertTriangle size={14} className="text-[#f73e5d]" />, bg:"bg-[#fff0f2]", title:"Slot booking timeout for candidate ID#2841",      time:"28 min ago" },
  { icon:<Database size={14} className="text-[#1e40af]" />,   bg:"bg-[#eff6ff]",  title:"DB backup completed successfully",                  time:"1 hr ago" },
];

function StatusRow({
  icon, label, status, detail, dotColor,
}: {
  icon: React.ReactNode; label: string; status: string;
  detail: string; dotColor: string;
}) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl border border-[#e2edf7]
      bg-white hover:bg-[#fafcff] transition-colors">
      <div className="w-9 h-9 rounded-lg bg-[#f0f7ff] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
          <span className="text-sm font-medium text-gray-800">{label}</span>
          <span className="text-xs text-gray-400">— {status}</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{detail}</p>
      </div>
    </div>
  );
}

export default function AdminHealthPage() {
  const txColumns = [
    { key:"date",     header:"Date",     render:(r:typeof FAILED_TX[0]) => <span className="text-gray-400">{r.date}</span> },
    { key:"employer", header:"Employer", render:(r:typeof FAILED_TX[0]) => <span className="font-medium">{r.employer}</span> },
    { key:"amount",   header:"Amount",   render:(r:typeof FAILED_TX[0]) => <span className="font-semibold">${r.amount}</span> },
    { key:"reason",   header:"Reason",   render:(r:typeof FAILED_TX[0]) => <Badge label={r.reason} variant="red" /> },
    { key:"orderId",  header:"Order ID", render:(r:typeof FAILED_TX[0]) => <span className="font-mono text-xs text-gray-500">{r.orderId}</span> },
    {
      key:"retry", header:"",
      render:() => <Btn size="sm">Retry</Btn>,
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Platform Health"
        subtitle="Real-time system monitoring"
        actions={
          <Btn icon={<RefreshCw size={14} />}>Refresh</Btn>
        }
      />

      {/* Status indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatusRow
          icon={<Server size={17} className="text-emerald-700" />}
          label="API Server"
          status="Online"
          detail="99.98% uptime this month"
          dotColor="bg-emerald-400"
        />
        <StatusRow
          icon={<CreditCard size={17} className="text-emerald-700" />}
          label="PayPal Gateway"
          status="Operational"
          detail="97.2% payment success rate"
          dotColor="bg-emerald-400"
        />
        <StatusRow
          icon={<Database size={17} className="text-amber-700" />}
          label="MongoDB"
          status="Warning"
          detail="78% capacity — consider scaling"
          dotColor="bg-amber-400"
        />
        <StatusRow
          icon={<AlertTriangle size={17} className="text-[#f73e5d]" />}
          label="Failed Transactions"
          status="3 today"
          detail="Review flagged payments below"
          dotColor="bg-[#f73e5d]"
        />
      </div>

      {/* API response time chart */}
      <SectionCard title="API Response Times — Last 24 Hours">
        <ApiResponseChart data={API_DATA} height={180} />
      </SectionCard>

      {/* Failed transactions */}
      <SectionCard title="Failed Transactions">
        <DataTable
          columns={txColumns}
          rows={FAILED_TX}
          keyExtractor={(r) => r._id}
          emptyText="No failed transactions."
        />
      </SectionCard>

      {/* Assessment Activity */}
      <SectionCard title="Assessment Activity">
        <div className="space-y-4">
          {ACTIVITY.map((a, i) => (
            <TimelineItem key={i} icon={a.icon} iconBg={a.bg} title={a.title} time={a.time} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
