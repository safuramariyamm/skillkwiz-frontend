// ─── SkillKwiz API Service Layer ──────────────────────────────────────────────
// Centralised fetch wrapper that mirrors the backend routes in
// skillkwiz-backend-final. Reads JWT from localStorage (key: "sk_token").

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T;
  message?: string;
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function request<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("sk_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    // 401 → clear token and redirect to login
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("sk_token");
      window.location.href = "/auth/callback?reason=session_expired";
    }

    return { ok: res.ok, status: res.status, data, message: data?.message };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      data: null as any,
      message: err.message || "Network error",
    };
  }
}

/** Authenticated fetch — used by employer dashboard components */
export const apiCall = request;

// Convenience shorthands
const get = <T = any>(path: string) => request<T>(path);
const post = <T = any>(path: string, body: unknown) =>
  request<T>(path, { method: "POST", body: JSON.stringify(body) });
const put = <T = any>(path: string, body: unknown) =>
  request<T>(path, { method: "PUT", body: JSON.stringify(body) });
const del = <T = any>(path: string) => request<T>(path, { method: "DELETE" });

// ─── Auth ─────────────────────────────────────────────────────────────────────

/** Backend wraps tokens/user in `{ success, data: { accessToken, user } }` */
export function parseAuthPayload(body: Record<string, unknown> | null | undefined) {
  const inner = (body?.data as Record<string, unknown> | undefined) ?? body ?? {};
  return {
    accessToken:
      (inner.accessToken as string | undefined) ??
      (inner.token as string | undefined),
    refreshToken: inner.refreshToken as string | undefined,
    user: inner.user as Record<string, unknown> | undefined,
  };
}

export const authAPI = {
  login: (email: string, password: string) =>
    post("/auth/login", { email, password }),
  register: (
    name: string,
    email: string,
    password: string,
    role: string = "employee"
  ) => post("/auth/register", { name, email, password, role }),
  logout: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("sk_token");
    localStorage.removeItem("sk_refresh_token");
    localStorage.removeItem("sk_user");
  },
  me: () => get("/auth/me"),
};

// ─── Admin — unified namespace ────────────────────────────────────────────────

export const adminAPI = {
  // Overview / stats (counts CompanyCredentials for "Total Users" now)
  getOverview: () => get("/admin/overview"),

  // Employers
  getEmployers: (opts: { page?: number; search?: string; plan?: string } = {}) => {
    const { page = 1, search = "", plan = "" } = opts;
    return get(
      `/admin/employers?page=${page}&limit=20${search ? `&search=${encodeURIComponent(search)}` : ""}${plan ? `&plan=${encodeURIComponent(plan)}` : ""}`
    );
  },

  // FIX: Company-registered employees (CompanyCredential records)
  getEmployees: (opts: { page?: number; search?: string } = {}) => {
    const { page = 1, search = "" } = opts;
    return get(
      `/admin/employees?page=${page}&limit=20${search ? `&search=${encodeURIComponent(search)}` : ""}`
    );
  },

  // Candidates (standalone job-seekers — separate from company employees)
  getCandidates: (opts: { page?: number; search?: string; skill?: string } = {}) => {
    const { page = 1, search = "", skill = "" } = opts;
    return get(
      `/admin/candidates?page=${page}&limit=20${search ? `&search=${encodeURIComponent(search)}` : ""}${skill ? `&skill=${encodeURIComponent(skill)}` : ""}`
    );
  },

  // Revenue
  getRevenueSummary: () => get("/admin/revenue/summary"),
  getRevenueMonthly: (months = 6) => get(`/admin/revenue/monthly?months=${months}`),

  // Health
  getHealth: () => get("/admin/health"),
};

// ─── Admin — legacy named exports (keep for backward compat with hooks) ───────

export const adminEmployersAPI = {
  list: (page = 1, limit = 20, search = "", plan = "") =>
    get(
      `/admin/employers?page=${page}&limit=${limit}${search ? `&search=${search}` : ""}${plan ? `&plan=${plan}` : ""}`
    ),
  getOne: (id: string) => get(`/admin/employers/${id}`),
  updatePlan: (id: string, plan: string) =>
    put(`/admin/employers/${id}/plan`, { plan }),
  deactivate: (id: string) => put(`/admin/employers/${id}/deactivate`, {}),
};

export const adminCandidatesAPI = {
  list: (page = 1, limit = 20, search = "", skill = "") =>
    get(
      `/admin/candidates?page=${page}&limit=${limit}${search ? `&search=${search}` : ""}${skill ? `&skill=${skill}` : ""}`
    ),
  getOne: (id: string) => get(`/admin/candidates/${id}`),
};

export const adminRevenueAPI = {
  summary: () => get("/admin/overview"),
  monthly: (months = 6) => get(`/admin/revenue/monthly?months=${months}`),
  transactions: (page = 1, limit = 10) =>
    get(`/admin/revenue/transactions?page=${page}&limit=${limit}`),
};

export const adminBlogAPI = {
  list: () => get("/blogs"),
  getOne: (slug: string) => get(`/blogs/${slug}`),
  create: (body: { title: string; content: string; status: string }) =>
    post("/blogs", body),
  update: (id: string, body: object) => put(`/blogs/${id}`, body),
  remove: (id: string) => del(`/blogs/${id}`),
};

export const adminHealthAPI = {
  status: () => get("/admin/health"),
  transactions: (status = "failed") =>
    get(`/admin/transactions?status=${status}`),
};

// ─── Employer — Credits / Balance ─────────────────────────────────────────────

export const paymentsAPI = {
  balance: () => get("/payments/balance"),
  plans: () => fetch(`${BASE}/payments/plans`).then((r) => r.json()),
  history: (page = 1, limit = 10) =>
    get(`/payments/history?page=${page}&limit=${limit}`),
  createOrder: (planId: string) => post("/payments/create-order", { planId }),
  captureOrder: (orderId: string) =>
    post("/payments/capture-order", { orderId }),
};

// ─── Employer — Profile ───────────────────────────────────────────────────────

export const employerAPI = {
  me: () => get("/employers/me"),
  assessmentRequests: () => get("/employers/assessment-requests"),
};

// ─── Employer — Assessment requests ──────────────────────────────────────────

export const assessmentsAPI = {
  list: () => get("/employers/assessment-requests"),
  create: (body: object) => post("/employers/assessment-request", body),
  remove: (_id: string) => Promise.resolve({ ok: false, data: null, status: 501, message: "Not supported" }),
};

// ─── Employer — Slots ─────────────────────────────────────────────────────────

export const slotsAPI = {
  list: () => get("/employers/slots"),
  create: (body: {
    date: string;
    time: string;
    center: string;
    location: string;
    capacity: number;
    skills?: string[];
  }) => post("/employers/slots", body),
  remove: (id: string) => del(`/employers/slots/${id}`),
};

// ─── Employer — Candidates = company credentials ──────────────────────────────

export const employerCandidatesAPI = {
  list: () => get("/employers/credentials"),
};

// ─── Employer — Credentials ───────────────────────────────────────────────────

export const credentialsAPI = {
  list: () => get("/employers/credentials"),
  generate: (body: { candidateName: string; candidateEmail: string }) =>
    post("/employers/credentials", body),
  revoke: (credentialId: string) => del(`/employers/credentials/${credentialId}`),
};

// ─── Employee (company credential login) ─────────────────────────────────────

export const employeeAPI = {
  availableSlots: () => get("/assessments/available-slots"),
  bookSlot: (slotId: string) => post("/assessments/book-slot", { slotId }),
  myStatus: () => get("/auth/company-employee/me"),
};