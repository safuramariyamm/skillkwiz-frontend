// Maps backend API shapes → dashboard UI types

import type { Assessment, Candidate, Credential, Slot } from "@/types/dashboard";

export function mapAssessmentRequest(req: any): Assessment {
  const skills = Array.isArray(req.skills)
    ? req.skills.join(", ")
    : req.skills || "Assessment";
  return {
    _id: req._id,
    title: skills,
    status: (req.status === "completed" ? "completed" : req.status === "pending" ? "draft" : "active") as Assessment["status"],
    candidateCount: 1,
    deadline: req.createdAt
      ? new Date(req.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "—",
    createdAt: req.createdAt
      ? new Date(req.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "",
  };
}

export function mapCredentialToCandidate(c: any): Candidate {
  const statusMap: Record<string, Candidate["assessmentStatus"]> = {
    invited: "invited",
    registered: "invited",
    booked: "booked",
    assessed: "completed",
  };
  return {
    _id: c._id,
    name: c.candidateName || c.name || "—",
    email: c.candidateEmail || c.email || "",
    skills: c.skills || [],
    employer: c.companyName || "",
    score: c.score,
    percentile: c.percentile,
    assessmentStatus: statusMap[c.status] || "invited",
  };
}

export function mapCredential(c: any): Credential {
  return {
    _id: c._id,
    candidateName: c.candidateName || "—",
    username: c.username || "—",
    sentAt: c.createdAt
      ? new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "—",
    status: c.status === "revoked" ? "revoked" : c.isUsed ? "active" : "sent",
  };
}

export function mapSlot(s: any): Slot {
  return {
    _id: s._id,
    date: s.date,
    time: s.time,
    capacity: s.capacity ?? 0,
    booked: s.bookedCount ?? (s.bookedBy?.length ?? 0),
  };
}

export function ledgerToChart(ledger: any[] = []) {
  const months: Record<string, { month: string; used: number; purchased: number }> = {};
  ledger.forEach((entry) => {
    const month = new Date(entry.createdAt).toLocaleDateString("en-US", {
      month: "short",
    });
    if (!months[month]) months[month] = { month, used: 0, purchased: 0 };
    if (entry.type === "debit" || entry.type === "deduct") {
      months[month].used += entry.amount || 1;
    } else {
      months[month].purchased += entry.amount || 0;
    }
  });
  return Object.values(months).slice(-6);
}
