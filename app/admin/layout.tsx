// app/admin/layout.tsx
// Root layout for all /admin/* pages.
// No public navigation is rendered — completely isolated from the main site shell.

export const metadata = {
  title: { default: "Admin — SkillKwiz", template: "%s | Admin — SkillKwiz" },
  robots: { index: false, follow: false }, // Never indexed by search engines
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  // Intentionally minimal — no site header/footer/nav.
  // Each admin page wraps itself in AdminLayout for the sidebar shell.
  return <>{children}</>;
}