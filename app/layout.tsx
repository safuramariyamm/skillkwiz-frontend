import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "SkillKwiz - The World's Largest Skill Assessment Library",
  description:
    "SkillKwiz provides authenticated skill assessments in secure testing centers. Verified skills, simplified hiring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Inter, Arial, sans-serif" }}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-grow">{children}</main>
            <SiteFooter />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
