"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Props {
  planId: string;
  amount: number;
  plan: string;
  credits: number;
}

export default function PaypalCheckout({ planId, amount, plan, credits }: Props) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: "USD",
      }}
    >
      <PayPalButtons
        style={{
          layout: "vertical",
          shape: "pill",
          label: "paypal",
        }}
        createOrder={async () => {
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("sk_token")
              : null;

          const res = await fetch(`${API_BASE}/payments/create-order`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
            body: JSON.stringify({ planId }),
          });

          const data = await res.json();

          if (!data.success || !data.data?.orderId) {
            throw new Error(
              data.message || "Failed to create PayPal order"
            );
          }

          return data.data.orderId;
        }}
        onApprove={async (approveData) => {
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("sk_token")
              : null;

          const res = await fetch(`${API_BASE}/payments/capture-order`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
            body: JSON.stringify({ orderId: approveData.orderID }),
          });

          const captureData = await res.json();

          if (!captureData.success) {
            throw new Error(captureData.message || "Payment capture failed");
          }

          console.log("PAYMENT SUCCESS:", captureData);
          window.location.href = "/employer/payment/success";
        }}
        onError={(err) => {
          console.error("PAYPAL ERROR:", err);
        }}
      />
    </PayPalScriptProvider>
  );
}