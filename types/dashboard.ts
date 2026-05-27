// ─── SkillKwiz Dashboard Types ────────────────────────────────────────────────

export type UserRole = "admin" | "employer" | "companyEmployee";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  company?: string;
}

// ─── Employer / Admin ─────────────────────────────────────────────────────────

export interface CreditBalance {
  credits: number;
  creditsUsed: number;
  totalCreditsPurchased: number;
  plan?: string;
  activePlan?: string;
  subscriptionStatus?: string;
  planExpiry?: string;
}

export interface Employer {
  _id: string;
  companyName: string;
  contactName: string;
  email: string;
  plan: "starter" | "growth" | "enterprise";
  planStatus: "active" | "expired";
  credits: number;
  totalRevenue: number;
  createdAt: string;
}

export interface Candidate {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  employer: string;
  score?: number;
  percentile?: string;
  assessmentStatus: "invited" | "booked" | "completed" | "cancelled";
}

export interface Assessment {
  _id: string;
  title: string;
  status: "draft" | "active" | "completed";
  candidateCount: number;
  deadline?: string;
  createdAt: string;
}

export interface Slot {
  _id: string;
  date: string;
  time: string;
  capacity: number;
  booked: number;
}

export interface Transaction {
  _id: string;
  date: string;
  employer?: string;
  plan: string;
  amount: number;
  status: "captured" | "failed" | "pending";
  orderId: string;
}

export interface Credential {
  _id: string;
  candidateName: string;
  username: string;
  sentAt: string;
  status: "active" | "revoked" | "sent";
}

export interface BlogPost {
  _id: string;
  title: string;
  status: "published" | "draft";
  thumbnail?: string;
  createdAt: string;
}

// ─── Employee ─────────────────────────────────────────────────────────────────

export interface Booking {
  _id: string;
  bookingReference?: string;
  company: string;
  skills: string[];
  scheduledDate: string;
  scheduledTime: string;
  centre: string;
  country: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  createdAt: string;
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface MonthlyRevenue {
  month: string;
  starter: number;
  growth: number;
  enterprise: number;
  total: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}
