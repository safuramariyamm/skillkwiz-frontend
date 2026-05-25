"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ShieldCheck, ClipboardList, BadgeCheck, Zap } from "lucide-react";

const STEPS = [
  { icon: ClipboardList, num: "01", title: "Employer Posts Slot",       desc: "Company sets up an assessment slot with date, center, and required skills.", accent: "#00418d", bg: "#eef5ff" },
  { icon: Zap,           num: "02", title: "Candidate Gets Invited",     desc: "Credentials sent directly to the candidate's email instantly.",             accent: "#f73e5d", bg: "#fff0f3" },
  { icon: ShieldCheck,   num: "03", title: "Skill Verified Securely",    desc: "Biometric-verified assessment at a certified center — tamper-proof.",       accent: "#b8860b", bg: "#fffbea" },
  { icon: BadgeCheck,    num: "04", title: "Report Delivered Instantly", desc: "Authenticated skill certificate issued the moment the test is done.",       accent: "#00418d", bg: "#eef5ff" },
];

const STATS = [
  { num: "10K+", label: "Assessments" },
  { num: "500+", label: "Companies" },
  { num: "98%",  label: "Accuracy" },
  { num: "24h",  label: "Turnaround" },
];

// Each pair shares the SAME cycle duration so their z-index swap is in sync.
// "a" card starts on top (zIndex 2), floats gently.
// "b" card starts behind (zIndex 1), rises higher mid-cycle to overtake, then returns.
const CYCLE = 5; // seconds — one full swap cycle

const LEFT_IMAGES = [
  { src: "/images/homepage/skills_1.png", rotate: "-7deg", left: 10, top: 0,   w: 168, h: 238, isA: true  },
  { src: "/images/homepage/skills_3.png", rotate:  "3deg", left: 50, top: 90,  w: 152, h: 214, isA: false },
];
const RIGHT_IMAGES = [
  { src: "/images/homepage/skills_2.png", rotate:  "7deg", right: 10, top: 10,  w: 162, h: 228, isA: true  },
  { src: "/images/homepage/skills_4.png", rotate: "-4deg", right: 48, top: 100, w: 148, h: 206, isA: false },
];

export default function AuthenticateSkillsSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const cardStyle = (img: typeof LEFT_IMAGES[0] & { left?: number; right?: number }, side: "left" | "right"): React.CSSProperties => ({
    position: "absolute",
    ...(side === "left"  ? { left:  img.left  } : {}),
    ...(side === "right" ? { right: (img as typeof RIGHT_IMAGES[0]).right } : {}),
    top: img.top,
    width: img.w,
    height: img.h,
    borderRadius: 18,
    overflow: "hidden",
    border: "3px solid #fff",
    boxShadow: "0 12px 40px rgba(0,65,141,0.18)",
    // a-cards: float gently, stay front first half then go back
    // b-cards: rise up past a-cards, come back down
    animation: img.isA
      ? `floatA_${side} ${CYCLE}s ease-in-out infinite, zA ${CYCLE}s step-end infinite`
      : `floatB_${side} ${CYCLE}s ease-in-out infinite, zB ${CYCLE}s step-end infinite`,
  });

  const renderCards = (images: typeof LEFT_IMAGES, side: "left" | "right") => (
    <div style={{
      position: "relative", height: 380,
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : `translateX(${side === "left" ? -30 : 30}px)`,
      transition: "opacity 0.7s 0.1s, transform 0.7s 0.1s",
    }}>
      {images.map((img, i) => (
        <div key={i} style={cardStyle(img as any, side)}>
          <Image src={img.src} alt="" fill style={{ objectFit: "cover", objectPosition: "top center" }} />
        </div>
      ))}
    </div>
  );

  return (
    <section ref={ref} style={{ background: "#f0f7ff", padding: "clamp(40px,5vw,68px) 0", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,40px)" }}>

        {/* ── 3-col: left cards | centre text | right cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr 1fr", gap: "clamp(16px,2.5vw,36px)", alignItems: "center", minHeight: 420 }}>

          {renderCards(LEFT_IMAGES, "left")}

          {/* ── CENTRE ── */}
          <div style={{
            textAlign: "center",
            opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)",
            transition: "opacity 0.7s 0.2s, transform 0.7s 0.2s",
          }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ width: 20, height: 2, background: "#00418d", borderRadius: 2, opacity: 0.4 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#00418d", opacity: 0.65 }}>Smart Hiring Solution</span>
              <span style={{ width: 20, height: 2, background: "#00418d", borderRadius: 2, opacity: 0.4 }} />
            </div>

            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px,2.5vw,34px)", fontWeight: 900, lineHeight: 1.2, color: "#0a1628", marginBottom: 14, letterSpacing: "-0.02em" }}>
              Authenticate Skills,<br />
              <span style={{ color: "#00418d" }}>Simplify Hiring</span>
            </h2>

            <p style={{ color: "#6b7a8d", fontSize: 13, lineHeight: 1.75, maxWidth: 340, margin: "0 auto 22px" }}>
              SkillKwiz ensures professionals are evaluated accurately in their chosen fields. Our secure testing centers provide authenticated skill assessments — eliminating the need for lengthy technical interviews.
            </p>

            {/* Stat pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
              {STATS.map((s) => (
                <div key={s.label} style={{
                  background: "#fff", borderRadius: 24, padding: "7px 14px",
                  border: "1px solid #daeeff", boxShadow: "0 1px 4px rgba(0,65,141,0.07)",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: 14, fontWeight: 900, color: "#00418d", lineHeight: 1 }}>{s.num}</span>
                  <span style={{ fontSize: 10, color: "#8899aa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <a href="/services" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#00418d", color: "#fff", fontSize: 12, fontWeight: 700,
                padding: "10px 22px", borderRadius: 8, textDecoration: "none",
                boxShadow: "0 2px 12px rgba(0,65,141,0.22)",
              }}>
                Explore Services
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a href="/about" style={{
                display: "inline-flex", alignItems: "center", fontSize: 12, fontWeight: 600,
                padding: "10px 18px", borderRadius: 8, textDecoration: "none",
                color: "#00418d", border: "1px solid rgba(0,65,141,0.25)",
              }}>
                Learn More
              </a>
            </div>
          </div>

          {renderCards(RIGHT_IMAGES as any, "right")}
        </div>

        {/* ── How it works ── */}
        <div style={{
          marginTop: 36,
          opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)",
          transition: "opacity 0.7s 0.4s, transform 0.7s 0.4s",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 16 }}>
            <span style={{ width: 28, height: 1, background: "rgba(0,65,141,0.25)", display: "block" }} />
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(0,65,141,0.55)", margin: 0 }}>How It Works</p>
            <span style={{ width: 28, height: 1, background: "rgba(0,65,141,0.25)", display: "block" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.num} style={{
                  background: "#fff", borderRadius: 12, padding: "14px",
                  border: "1px solid #daeeff", boxShadow: "0 2px 8px rgba(0,65,141,0.05)",
                  display: "flex", gap: 12, alignItems: "flex-start",
                  transition: "box-shadow 0.2s", position: "relative",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 18px rgba(0,65,141,0.12)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,65,141,0.05)"}
                >
                  {i < STEPS.length - 1 && (
                    <span style={{ position: "absolute", right: -7, top: "50%", transform: "translateY(-50%)", width: 14, height: 1.5, background: "#c8dff5", display: "block", zIndex: 1 }} />
                  )}
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: step.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={15} color={step.accent} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: step.accent, opacity: 0.6, letterSpacing: "0.08em", marginBottom: 2 }}>STEP {step.num}</div>
                    <h3 style={{ fontSize: 12, fontWeight: 700, color: "#0a1628", margin: 0, marginBottom: 4, lineHeight: 1.3 }}>{step.title}</h3>
                    <p style={{ fontSize: 11, color: "#8899aa", margin: 0, lineHeight: 1.55 }}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        /*
         * Each pair cycles at the same duration (${CYCLE}s).
         * A-card: gentle float, starts z=2, drops to z=1 at 50% when B rises past it.
         * B-card: rises higher than A at 50% to visually overtake, starts z=1, jumps to z=3 at 50%.
         */

        /* ── z-index swap (same timing for both sides) ── */
        @keyframes zA {
          0%,  49% { z-index: 2; }
          50%, 100% { z-index: 1; }
        }
        @keyframes zB {
          0%,  49% { z-index: 1; }
          50%, 100% { z-index: 3; }
        }

        /* ── LEFT side float ── */
        @keyframes floatA_left {
          0%   { transform: rotate(-7deg) translateY(0px);   }
          50%  { transform: rotate(-7deg) translateY(-12px); }
          100% { transform: rotate(-7deg) translateY(0px);   }
        }
        @keyframes floatB_left {
          0%   { transform: rotate(3deg) translateY(0px);    }
          50%  { transform: rotate(3deg) translateY(-38px);  }
          100% { transform: rotate(3deg) translateY(0px);    }
        }

        /* ── RIGHT side float ── */
        @keyframes floatA_right {
          0%   { transform: rotate(7deg) translateY(0px);    }
          50%  { transform: rotate(7deg) translateY(-12px);  }
          100% { transform: rotate(7deg) translateY(0px);    }
        }
        @keyframes floatB_right {
          0%   { transform: rotate(-4deg) translateY(0px);   }
          50%  { transform: rotate(-4deg) translateY(-38px); }
          100% { transform: rotate(-4deg) translateY(0px);   }
        }
      `}</style>
    </section>
  );
}