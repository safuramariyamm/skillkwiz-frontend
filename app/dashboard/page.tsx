// app/dashboard/page.tsx
// Redirects /dashboard → correct role dashboard via middleware.
// This page is only hit if middleware somehow passes through.

import { redirect } from "next/navigation";

export default function DashboardRoot() {
  // Middleware handles the real redirect; this is a safety fallback
  redirect("/dashboard/employer/overview");
}
