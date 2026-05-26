"use client";

import {
  PayPalButtons,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";

interface Props {
  amount: number;
  plan: string;
  credits: number;
}

export default function PaypalCheckout({
  amount,
  plan,
  credits,
}: Props) {
  return (
    <PayPalScriptProvider
      options={{
        clientId:
          process.env
            .NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
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
          const res = await fetch(
            "http://localhost:5000/api/payments/create-order",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                amount,
                planName: plan,
                credits,
              }),
            }
          );

          const data = await res.json();

          if (!data.orderID) {
            throw new Error(
              "Failed to create PayPal order"
            );
          }

          return data.orderID;
        }}
        onApprove={async (data) => {
          const res = await fetch(
            "http://localhost:5000/api/payments/capture-order",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                orderID: data.orderID,
              }),
            }
          );

          const captureData =
            await res.json();

          console.log(
            "PAYMENT SUCCESS:",
            captureData
          );

          alert(
            "Payment Successful!"
          );
        }}
        onError={(err) => {
          console.error(
            "PAYPAL ERROR:",
            err
          );
        }}
      />
    </PayPalScriptProvider>
  );
}