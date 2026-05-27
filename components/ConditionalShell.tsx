// components/ConditionalShell.tsx
// Renders SiteHeader + SiteFooter only on public pages.
// Dashboard routes get NO site header/footer — they have their own layout.
"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export default function ConditionalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) {
    // Dashboard pages: render children directly, no site chrome
    return <>{children}</>;
  }

  // Public pages: wrap with site header + footer
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow">{children}</main>
      <SiteFooter />
    </div>
  );
}
