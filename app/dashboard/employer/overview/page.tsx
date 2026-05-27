// app/dashboard/employer/overview/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Mail, CalendarCheck, BarChart3, ShoppingCart } from "lucide-react";
import {
  StatCard,
  SectionCard,
  PageHeader,
  Btn,
  CreditBar,
  SkeletonCard,
  TimelineItem,
  EmptyState,
} from "@/components/dashboard/shared";
import { CreditsAreaChart } from "@/components/dashboard/charts";
import { useCredits, useEmployerProfile, useCredentials, useAssessments, useSlots } from "@/hooks";
import { paymentsAPI } from "@/services/api";
import { ledgerToChart } from "@/lib/dashboard-data";

export default function EmployerOverviewPage() {
  const router = useRouter();
  const { data: balance, loading: creditsLoading } = useCredits();
  const { data: profile } = useEmployerProfile();
  const { data: candidates, loading: candLoading } = useCredentials();
  const { data: assessments, loading: assessLoading } = useAssessments();
  const { data: slots, loading: slotsLoading } = useSlots();

  const [chartData, setChartData] = useState<{ month: string; used: number; purchased: number }[]>([]);
  const [activity, setActivity] = useState<{ title: string; time: string; icon: React.ReactNode; bg: string }[]>([]);

  const credits = balance?.credits ?? 0;
  const creditsUsed = balance?.creditsUsed ?? 0;
  const plan = balance?.activePlan ?? balance?.subscriptionStatus ?? "—";
  const companyName = profile?.employer?.company ?? "your company";

  const invited = candidates?.length ?? 0;
  const booked = candidates?.filter((c) => c.assessmentStatus === "booked").length ?? 0;
  const completed = candidates?.filter((c) => c.assessmentStatus === "completed").length ?? 0;
  const assessmentCount = assessments?.length ?? 0;

  useEffect(() => {
    paymentsAPI.history(1, 10).then((res) => {
      if (res.ok && res.data) {
        const payload = res.data.data ?? res.data;
        setChartData(ledgerToChart(payload.ledger || []));
        const txns = payload.transactions || [];
        setActivity(
          txns.slice(0, 5).map((t: any) => ({
            title: `${t.planName || "Plan"} — $${t.amount} (${t.paymentGateway})`,
            time: new Date(t.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            icon: <ShoppingCart size={14} className="text-[#1e40af]" />,
            bg: "bg-[#eff6ff]",
          }))
        );
      }
    });
  }, []);

  const loading = creditsLoading || candLoading || assessLoading || slotsLoading;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Employer Dashboard"
        subtitle={`Welcome back, ${companyName}`}
        actions={
          <Btn
            variant="primary"
            icon={<ShoppingCart size={14} />}
            onClick={() => router.push("/dashboard/employer/billing")}
          >
            Buy Credits
          </Btn>
        }
      />

      {creditsLoading ? (
        <div className="h-20 bg-white border border-[#e2edf7] rounded-xl animate-pulse" />
      ) : (
        <CreditBar
          used={creditsUsed}
          total={Math.max(credits + creditsUsed, creditsUsed, 1)}
          plan={String(plan)}
          onBuyMore={() => router.push("/dashboard/employer/billing")}
        />
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              label="Assessment Requests"
              value={String(assessmentCount)}
              icon={<ClipboardList size={18} className="text-[#1e40af]" />}
              iconBg="bg-[#eff6ff]"
            />
            <StatCard
              label="Candidates Invited"
              value={String(invited)}
              icon={<Mail size={18} className="text-emerald-700" />}
              iconBg="bg-emerald-50"
            />
            <StatCard
              label="Slots Created"
              value={String(slots?.length ?? 0)}
              icon={<CalendarCheck size={18} className="text-amber-700" />}
              iconBg="bg-amber-50"
            />
            <StatCard
              label="Completed / Booked"
              value={`${completed} / ${booked}`}
              icon={<BarChart3 size={18} className="text-violet-700" />}
              iconBg="bg-violet-50"
            />
          </>
        )}
      </div>

      <SectionCard title="Credits Usage">
        {chartData.length === 0 ? (
          <EmptyState message="No credit activity yet. Purchase credits to get started." />
        ) :
          <CreditsAreaChart data={chartData} height={200} />
        }
      </SectionCard>

      <SectionCard title="Recent Payments">
        {activity.length === 0 ? (
          <EmptyState message="No payment history yet." />
        ) : (
          <div className="space-y-4">
            {activity.map((a, i) => (
              <TimelineItem key={i} icon={a.icon} iconBg={a.bg} title={a.title} time={a.time} />
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
