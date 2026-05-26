const axios = require("axios");

// Reads PAYPAL_BASE_URL if set directly (Railway), otherwise falls back to PAYPAL_ENV
const PAYPAL_BASE =
  process.env.PAYPAL_BASE_URL ||
  (process.env.PAYPAL_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com");

// Log on startup so Railway logs show which URL is being used
console.log(`[PayPal] Base URL: ${PAYPAL_BASE}`);
console.log(`[PayPal] Client ID loaded: ${process.env.PAYPAL_CLIENT_ID ? "YES" : "NO"}`);
console.log(`[PayPal] Client Secret loaded: ${process.env.PAYPAL_CLIENT_SECRET ? "YES" : "NO"}`);

let cachedToken = null;
let tokenExpiry = null;

const getAccessToken = async () => {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "PayPal credentials not configured on the server. Contact admin."
    );
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const { data } = await axios.post(
      `${PAYPAL_BASE}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
    return cachedToken;
  } catch (err) {
    const msg = err.response?.data?.error_description || err.response?.data?.error || err.message;
    // Clear cache so next request retries
    cachedToken = null;
    tokenExpiry = null;
    throw new Error(`PayPal authentication failed: ${msg}`);
  }
};

const createOrder = async (amount, credits, planName, idempotencyKey) => {
  const token = await getAccessToken();
  try {
    const { data } = await axios.post(
      `${PAYPAL_BASE}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [{
          amount: { currency_code: "USD", value: amount.toFixed(2) },
          description: `SkillKwiz - ${planName} (${credits} assessment credits)`,
          custom_id: idempotencyKey,
        }],
        application_context: {
          brand_name: "SkillKwiz",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
          return_url: `${process.env.FRONTEND_URL}/employer/payment/success`,
          cancel_url: `${process.env.FRONTEND_URL}/employer/payment/cancel`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": idempotencyKey,
        },
      }
    );
    return data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    throw new Error(`PayPal createOrder failed: ${msg}`);
  }
};

const captureOrder = async (orderId) => {
  const token = await getAccessToken();
  try {
    const { data } = await axios.post(
      `${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`,
      {},
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );
    return data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    throw new Error(`PayPal captureOrder failed: ${msg}`);
  }
};

const verifyWebhookSignature = async (headers, rawBody) => {
  const token = await getAccessToken();
  const { data } = await axios.post(
    `${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`,
    {
      auth_algo: headers["paypal-auth-algo"],
      cert_url: headers["paypal-cert-url"],
      transmission_id: headers["paypal-transmission-id"],
      transmission_sig: headers["paypal-transmission-sig"],
      transmission_time: headers["paypal-transmission-time"],
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: JSON.parse(rawBody),
    },
    { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
  );
  return data.verification_status === "SUCCESS";
};

module.exports = { createOrder, captureOrder, verifyWebhookSignature };