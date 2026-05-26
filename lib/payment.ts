// lib/api/payment.ts
// Centralized payment API calls for both PayPal and PhonePe

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const authHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("sk_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface Plan {
  name: string;
  credits: number;
  amountUSD: number;
  amountINR: number;
  usdPerCredit: number;
  inrPerCredit: number;
}

export interface PlansResponse {
  success: boolean;
  data: Record<string, Plan>;
}

export interface BalanceResponse {
  success: boolean;
  data: {
    credits: number;
    subscriptionStatus: string;
    activePlan: string;
  };
}

export interface CreateOrderResponse {
  success: boolean;
  data: {
    orderId: string;
    approveUrl: string;
  };
}

export interface CaptureOrderResponse {
  success: boolean;
  message: string;
  data: {
    credits: number;
    invoiceNumber: string;
  };
}

export interface PhonePeInitiateResponse {
  success: boolean;
  data: {
    redirectUrl: string;
    merchantTransactionId: string;
  };
}

export interface PhonePeVerifyResponse {
  success: boolean;
  message: string;
  data: {
    credits: number;
    invoiceNumber: string;
    planName: string;
    creditsPurchased: number;
  };
}

export interface Transaction {
  _id: string;
  amount: number;
  currency: string;
  paymentGateway: "paypal" | "phonepe";
  creditsPurchased: number;
  paymentStatus: string;
  planName: string;
  invoiceNumber: string;
  createdAt: string;
}

export const paymentApi = {
  getPlans: async (): Promise<PlansResponse> => {
    const res = await fetch(`${API_BASE}/payments/plans`);
    return res.json();
  },

  getBalance: async (): Promise<BalanceResponse> => {
    const res = await fetch(`${API_BASE}/payments/balance`, {
      headers: authHeaders(),
    });
    return res.json();
  },

  getHistory: async (
    page = 1,
    limit = 10
  ): Promise<{
    success: boolean;
    data: {
      transactions: Transaction[];
      balance: { credits: number };
      pagination: { total: number; page: number; limit: number };
    };
  }> => {
    const res = await fetch(
      `${API_BASE}/payments/history?page=${page}&limit=${limit}`,
      { headers: authHeaders() }
    );
    return res.json();
  },

  // ─── PayPal ────────────────────────────────────────────────────────────────
  createPayPalOrder: async (
    planId: string
  ): Promise<CreateOrderResponse> => {
    const res = await fetch(`${API_BASE}/payments/create-order`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ planId }),
    });
    return res.json();
  },

  capturePayPalOrder: async (
    orderId: string
  ): Promise<CaptureOrderResponse> => {
    const res = await fetch(`${API_BASE}/payments/capture-order`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ orderId }),
    });
    return res.json();
  },

  // ─── PhonePe ───────────────────────────────────────────────────────────────
  initiatePhonePe: async (
    planId: string
  ): Promise<PhonePeInitiateResponse> => {
    const res = await fetch(`${API_BASE}/payments/phonepe/initiate`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ planId }),
    });
    return res.json();
  },

  verifyPhonePe: async (
    txnId: string
  ): Promise<PhonePeVerifyResponse> => {
    const res = await fetch(
      `${API_BASE}/payments/phonepe/verify/${txnId}`,
      { headers: authHeaders() }
    );
    return res.json();
  },
};