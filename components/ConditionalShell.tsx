// components/ConditionalShell.tsx
// Renders SiteHeader + SiteFooter only on public pages.
// Dashboard routes AND admin routes get NO site header/footer — they have their own layout.
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
  // FIX: also exclude /admin/* from the public site chrome
  const isAppShell = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isAppShell) {
    // Dashboard + Admin pages: render children directly, no site chrome
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