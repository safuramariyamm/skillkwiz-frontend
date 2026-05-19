const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("sk_token") : null;

const authHeaders = (): Record<string, string> => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const apiLogin = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    return res.json();
};

export const apiRegister = async (name: string, email: string, password: string, role: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
    });
    return res.json();
};

export const apiGetMe = async () => {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() });
    return res.json();
};

export const apiSendOtp = async (identifier: string, type: "email" | "phone") => {
    const res = await fetch(`${API_BASE}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, type, purpose: "registration" }),
    });
    return res.json();
};

export const apiVerifyOtp = async (identifier: string, type: "email" | "phone", otp: string) => {
    const res = await fetch(`${API_BASE}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, type, otp }),
    });
    return res.json();
};

export const apiRegisterCandidate = async (formData: FormData) => {
    const token = getToken();
    const res = await fetch(`${API_BASE}/candidates/register`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
    });
    return res.json();
};

export const apiGetCandidateProfile = async () => {
    const res = await fetch(`${API_BASE}/candidates/me`, { headers: authHeaders() });
    return res.json();
};

export const apiScheduleAssessment = async (data: object) => {
    const res = await fetch(`${API_BASE}/assessments/schedule`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
};

export const apiGetMyAssessments = async (status?: string) => {
    const qs = status ? `?status=${status}` : "";
    const res = await fetch(`${API_BASE}/assessments/my${qs}`, { headers: authHeaders() });
    return res.json();
};

export const apiRegisterEmployer = async (data: object) => {
    const res = await fetch(`${API_BASE}/employers/register`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
};

export const apiGetEmployerProfile = async () => {
    const res = await fetch(`${API_BASE}/employers/me`, { headers: authHeaders() });
    return res.json();
};

export const apiGetCandidates = async (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    const res = await fetch(`${API_BASE}/candidates${qs}`, { headers: authHeaders() });
    return res.json();
};

export const apiRequestAssessment = async (data: object) => {
    const res = await fetch(`${API_BASE}/assessments/request`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
};

export const apiGetGoogleAuthUrl = () =>
    `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}/api/auth/google`;