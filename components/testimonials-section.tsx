"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  id: number; name: string; title: string; company: string;
  quote: string; image: string; metrics: string;
}

const testimonials: Testimonial[] = [
  { id: 1, name: "Jennifer Cooper", title: "CEO & Founder", company: "TechFlow Solutions", quote: "Since implementing SkillKwiz, our hiring efficiency has skyrocketed. We've reduced time-to-hire by 40% while dramatically improving candidate quality.", image: "/images/homepage/5.png", metrics: "40% faster hiring" },
  { id: 2, name: "Michael Donovan", title: "VP of Talent Acquisition", company: "GlobalTech Corp", quote: "Managing technical recruitment for a Fortune 500 company, we needed a solution that could scale. SkillKwiz's enterprise-grade security has been game-changing.", image: "/images/homepage/6.png", metrics: "2,000+ assessments/quarter" },
  { id: 3, name: "Sarah Johnson", title: "Head of People Operations", company: "InnovateLabs", quote: "What impressed me most is the customization. We built assessment frameworks tailored to our unique tech stack — the platform adapts to our needs.", image: "/images/homepage/7.png", metrics: "Custom frameworks built" },
  { id: 4, name: "David Chen", title: "Engineering Director", company: "DataFlow Systems", quote: "SkillKwiz saves our engineering team countless hours. Their technical assessments accurately predict real-world performance.", image: "/images/homepage/5.png", metrics: "Dozens of hires monthly" },
  { id: 5, name: "Emily Rodriguez", title: "Senior Recruiter", company: "Nexus Technologies", quote: "I've worked with every major assessment platform, and SkillKwiz stands out for its user experience, accuracy, and responsive support team.", image: "/images/homepage/6.png", metrics: "10+ years recruiting" },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setActive(p => (p + 1) % testimonials.length), 5500);
  };

  useEffect(() => {
    resetInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (idx: number) => { setActive(idx); resetInterval(); };
  const t = testimonials[active];

  return (
    <section style={{ background: "#e8f3ff", overflow: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(40px, 5vw, 64px) clamp(16px, 4vw, 48px)" }}>

        {/* Top row — label + arrows */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{ width: 28, height: 1, background: "#00418d", display: "block" }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#00418d", fontFamily: "Georgia, serif" }}>
                Client Stories
              </span>
            </div>
            <h2 style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(22px, 2.8vw, 36px)",
              fontWeight: 900, lineHeight: 1.1,
              letterSpacing: "-0.025em", color: "#0a1628",
              margin: 0,
            }}>
              Trusted by Recruiting Teams{" "}
              <span style={{ color: "#00418d" }}>Worldwide</span>
            </h2>
          </div>

          {/* Nav arrows */}
          <div className="hidden md:flex" style={{ gap: 8, alignItems: "center" }}>
            <button onClick={() => goTo((active - 1 + testimonials.length) % testimonials.length)}
              style={{
                width: 38, height: 38, borderRadius: "50%",
                border: "1.5px solid rgba(0,65,141,0.2)",
                background: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#00418d", transition: "all 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#00418d"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; (e.currentTarget as HTMLElement).style.color = "#00418d"; }}
            >
              <ChevronLeft style={{ width: 16, height: 16 }} />
            </button>
            <span style={{ color: "#a0b4c8", fontSize: 12, fontWeight: 600, minWidth: 48, textAlign: "center" }}>
              {String(active + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
            </span>
            <button onClick={() => goTo((active + 1) % testimonials.length)}
              style={{
                width: 38, height: 38, borderRadius: "50%",
                border: "1.5px solid rgba(0,65,141,0.2)",
                background: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#00418d", transition: "all 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#00418d"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; (e.currentTarget as HTMLElement).style.color = "#00418d"; }}
            >
              <ChevronRight style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>

        {/* Main testimonial */}
        <div key={active} style={{
          background: "#fff", borderRadius: 16,
          border: "1px solid rgba(0,65,141,0.1)",
          padding: "clamp(20px, 3vw, 32px)",
          boxShadow: "0 4px 24px rgba(0,65,141,0.07)",
          animation: "fadeUp 0.4s ease both",
          display: "grid", gridTemplateColumns: "auto 1fr", gap: "clamp(16px, 3vw, 36px)",
          alignItems: "start",
        }}>

          {/* Person card */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 120 }}>
            <div style={{
              width: 88, height: 88, borderRadius: 10,
              overflow: "hidden", marginBottom: 10,
              border: "2px solid #daeeff",
              boxShadow: "0 4px 16px rgba(0,65,141,0.12)",
            }}>
              <Image src={t.image} alt={t.name} width={88} height={88} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <p style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 13, color: "#0a1628", textAlign: "center", margin: 0 }}>{t.name}</p>
            <p style={{ color: "#8899aa", fontSize: 11, textAlign: "center", marginTop: 3 }}>{t.title}</p>
            <p style={{ color: "#00418d", fontSize: 11, fontWeight: 700, textAlign: "center", marginTop: 2 }}>{t.company}</p>
            <div style={{ display: "flex", gap: 2, marginTop: 8 }}>
              {[...Array(5)].map((_, i) => <Star key={i} style={{ width: 10, height: 10, fill: "#f6c648", color: "#f6c648" }} />)}
            </div>
          </div>

          {/* Quote area */}
          <div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 72, color: "#d0e4f5",
              lineHeight: 0.75, marginBottom: 10, userSelect: "none", fontWeight: 900,
            }}>"</div>
            <p style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(14px, 1.8vw, 20px)",
              lineHeight: 1.6, color: "#1a2e44",
              fontStyle: "italic", marginBottom: 16,
              letterSpacing: "-0.01em",
            }}>{t.quote}</p>

            {/* Metric chip */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#f0f7ff", borderRadius: 6,
              padding: "8px 14px",
              borderLeft: "3px solid #00418d",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00418d", flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#00418d" }}>✓ {t.metrics}</span>
            </div>
          </div>
        </div>

        {/* Dots + trust bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, flexWrap: "wrap", gap: 12 }}>
          {/* Dots */}
          <div style={{ display: "flex", gap: 6 }}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                style={{
                  width: i === active ? 24 : 8, height: 8,
                  borderRadius: 4,
                  background: i === active ? "#00418d" : "rgba(0,65,141,0.2)",
                  border: "none", cursor: "pointer", transition: "all 0.3s",
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* Trust chips */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { dot: "#4ade80", text: "Verified Reviews" },
              { dot: "#00418d", text: "SOC 2 Certified" },
              { dot: null, text: "Trusted by 500+ companies" },
            ].map((chip, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {chip.dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: chip.dot }} />}
                <span style={{ fontSize: 11, color: "#7a8799", fontWeight: 600 }}>{chip.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}