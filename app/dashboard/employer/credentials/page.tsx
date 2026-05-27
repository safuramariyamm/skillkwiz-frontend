// app/dashboard/employer/credentials/page.tsx
"use client";

import { KeyRound, ShieldOff, RefreshCw } from "lucide-react";
import {
  PageHeader, Btn, SectionCard, DataTable, Badge, SkeletonTable, EmptyState,
} from "@/components/dashboard/shared";
import { useCredentials } from "@/hooks";
import { credentialsAPI } from "@/services/api";
import type { Credential } from "@/types/dashboard";

const STATUS_VARIANT: Record<string, "green"|"blue"|"gray"> = {
  active:  "green",
  sent:    "blue",
  revoked: "gray",
};

export default function EmployerCredentialsPage() {
  const { data: credentials = [], loading, reload } = useCredentials();
  const handleRevoke = async (id: string) => {
    if (!confirm("Revoke access for this candidate?")) return;
    await credentialsAPI.revoke(id);
    reload();
  };

  const columns = [
    {
      key:"candidateName", header:"Candidate",
      render:(r:Credential) => <span className="font-medium text-gray-900">{r.candidateName}</span>,
    },
    {
      key:"username", header:"Username",
      render:(r:Credential) => (
        <span className="font-mono text-xs bg-[#f0f7ff] text-[#00418d]
          border border-[#daeeff] px-2 py-0.5 rounded-lg">
          {r.username}
        </span>
      ),
    },
    {
      key:"sentAt", header:"Sent",
      render:(r:Credential) => <span className="text-gray-400 text-xs">{r.sentAt}</span>,
    },
    {
      key:"status", header:"Status",
      render:(r:Credential) => (
        <Badge
          label={r.status.charAt(0).toUpperCase() + r.status.slice(1)}
          variant={STATUS_VARIANT[r.status]}
        />
      ),
    },
    {
      key:"actions", header:"",
      render:(r:Credential) => (
        <div className="flex items-center gap-2">
          {r.status !== "revoked" && (
            <Btn
              size="sm"
              variant="danger"
              icon={<ShieldOff size={11} />}
              onClick={() => handleRevoke(r._id)}
            >
              Revoke
            </Btn>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Credential Manager"
        subtitle="Manage candidate login credentials"
        actions={
          <Btn variant="primary" icon={<KeyRound size={14} />}>
            Generate Credentials
          </Btn>
        }
      />

      <SectionCard title="All Credentials">
        {loading ? (
          <SkeletonTable rows={4} />
        ) : credentials.length === 0 ? (
          <EmptyState
            title="No credentials generated"
            description="Generate credentials for your invited candidates."
            action={
              <Btn variant="primary" icon={<KeyRound size={14} />}>
                Generate Credentials
              </Btn>
            }
          />
        ) : (
          <DataTable
            columns={columns}
            rows={credentials}
            keyExtractor={(r) => r._id}
          />
        )}
      </SectionCard>

      {/* How it works */}
      <SectionCard title="How Credentials Work">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              step:"1",
              icon:<KeyRound size={18} className="text-[#00418d]" />,
              bg:"bg-[#daeeff]",
              title:"Generate",
              desc:"Click 'Generate Credentials' to create a username and temporary password for the candidate.",
            },
            {
              step:"2",
              icon:<RefreshCw size={18} className="text-emerald-700" />,
              bg:"bg-emerald-50",
              title:"Auto-Send",
              desc:"SkillKwiz automatically emails the credentials to the candidate.",
            },
            {
              step:"3",
              icon:<ShieldOff size={18} className="text-amber-700" />,
              bg:"bg-amber-50",
              title:"Revoke Anytime",
              desc:"Revoke access at any time to prevent the candidate from logging in.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-3 p-3 rounded-xl bg-[#fafcff] border border-[#f0f5fb]">
              <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800 mb-0.5">
                  Step {item.step}: {item.title}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
