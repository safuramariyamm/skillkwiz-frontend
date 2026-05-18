// Always use explicit absolute URL - never rely on env var at runtime
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("sk_token");
}

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extra,
    };
}

// ─── Auth ───────────────────────────────────────────────────────────────────
export async function apiLogin(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    return res.json();
}

export async function apiRegister(name: string, email: string, password: string, role: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
    });
    return res.json();
}

export async function apiGetMe() {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() });
    return res.json();
}

// ─── OTP ────────────────────────────────────────────────────────────────────
export async function apiSendOtp(identifier: string, type: "email" | "phone") {
    const res = await fetch(`${API_BASE}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, type }),
    });
    return res.json();
}

export async function apiVerifyOtp(identifier: string, type: "email" | "phone", otp: string) {
    const res = await fetch(`${API_BASE}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, type, otp }),
    });
    return res.json();
}

// ─── Candidate (Employee) ───────────────────────────────────────────────────
export async function apiRegisterCandidate(formData: FormData) {
    const token = getToken();
    const res = await fetch(`${API_BASE}/candidates/register`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
    });
    return res.json();
}

export async function apiGetCandidateProfile() {
    const res = await fetch(`${API_BASE}/candidates/me`, { headers: authHeaders() });
    return res.json();
}

export async function apiScheduleAssessment(data: {
    company: string;
    skills: string[];
    scheduledDate: string;
    scheduledTime: string;
    centre: string;
    country: string;
    zipCode: string;
}) {
    const res = await fetch(`${API_BASE}/assessments/schedule`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function apiGetMyAssessments(status?: string) {
    const qs = status ? `?status=${status}` : "";
    const res = await fetch(`${API_BASE}/assessments/my${qs}`, { headers: authHeaders() });
    return res.json();
}

// ─── Employer ───────────────────────────────────────────────────────────────
export async function apiRegisterEmployer(data: Record<string, unknown>) {
    const res = await fetch(`${API_BASE}/employers/register`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function apiGetEmployerProfile() {
    const res = await fetch(`${API_BASE}/employers/me`, { headers: authHeaders() });
    return res.json();
}

export async function apiGetCandidates(params: Record<string, string> = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/candidates${qs ? "?" + qs : ""}`, {
        headers: authHeaders(),
    });
    return res.json();
}

export async function apiRequestAssessment(data: {
    candidateFirstName: string;
    candidateLastName: string;
    candidateEmail: string;
    skills: string[];
    notes?: string;
}) {
    const res = await fetch(`${API_BASE}/assessments/request`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
}