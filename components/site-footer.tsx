"use client";

import Link from "next/link";
import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer style={{ background: "#0a1628", color: "#fff" }}>

      {/* Main footer content — max-width and padding match site-header */}
      <div style={{
        maxWidth: "calc(1280px + 2 * clamp(16px, 2.5vw, 40px))",
        margin: "0 auto",
        padding: "48px clamp(16px, 2.5vw, 40px) 36px",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(180px, 1.4fr) repeat(3, 1fr)",
          gap: "32px 40px",
          alignItems: "start",
        }}>

          {/* Brand column */}
          <div>
            <Image
              src="/images/skilllogo.png"
              alt="SkillKwiz"
              width={130}
              height={32}
              className="object-contain  "
              style={{ height: "32px", width: "auto", marginBottom: 12 }}
            />
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.65, marginBottom: 16, maxWidth: 220 }}>
              The world&apos;s most trusted skill assessment platform for modern recruiting.
            </p>
            
          </div>

          {/* Quick Links */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>Navigation</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/services", label: "Services" },
                { href: "/blog", label: "Blog" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"}
                  >{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>Company</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { href: "/about", label: "About SkillKwiz" },
                { href: "/contact", label: "Contact Us" },
                { href: "/contact?sales=true", label: "Talk to Sales" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"}
                  >{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>Get in Touch</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>
                5th Block, Jayanagar<br />Bangalore 560041, India
              </p>
              <a href="mailto:info@skillkwiz.com" style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none", display: "flex", alignItems: "center", gap: 8, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"}
              >
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#f6c648", flexShrink: 0 }} />
                info@skillkwiz.com
              </a>
              <a href="tel:+919740377330" style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none", display: "flex", alignItems: "center", gap: 8, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"}
              >
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#f73e5d", flexShrink: 0 }} />
                +91-9740377330
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{
          maxWidth: "calc(1280px + 2 * clamp(16px, 2.5vw, 40px))",
          margin: "0 auto",
          padding: "14px clamp(16px, 2.5vw, 40px)",
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0 }}>© 2025 SkillKwiz. All rights reserved.</p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms of Service"].map((l) => (
              <a key={l} href="#" style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Mobile: stack into single column */
        @media (max-width: 768px) {
          footer > div:first-child > div {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer > div:first-child > div {
            grid-template-columns: 1fr !important;
            gap: 24px 0 !important;
          }
        }
      `}</style>
    </footer>
  );
}
