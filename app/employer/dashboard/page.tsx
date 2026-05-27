// app/employer/dashboard/page.tsx
// Redirects old employer dashboard URL to the new unified dashboard
import { redirect } from "next/navigation";

export default function OldEmployerDashboard() {
  redirect("/dashboard/employer/overview");
}
