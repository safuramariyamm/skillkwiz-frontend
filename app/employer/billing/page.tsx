// app/employer/billing/page.tsx
// Redirects old billing URL to the new unified dashboard billing page
import { redirect } from "next/navigation";

export default function OldEmployerBilling() {
  redirect("/dashboard/employer/billing");
}
