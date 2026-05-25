
"use client";

import Link from "next/link";
import { useEffect, useRef, useCallback, useState } from "react";

const CARDS = [
  {
    id: "card0",
    icon: "/images/homepage/books.gif",
    emoji: "📚",
    title: "Skill Library",
    description: "Extensive assessments covering technical, professional and soft skills for all roles and industries.",
    tx: -260, ty: 10, rot: -6,
  },
  {
    id: "card1",
    icon: "/images/homepage/guard.gif",
    emoji: "🛡️",
    title: "Secure Testing",
    description: "Biometric verification and content-aware environments ensure authentic, tamper-proof results.",
    tx: 0, ty: -18, rot: 0,
  },
  {
    id: "card2",
    icon: "/images/homepage/dollar.gif",
    emoji: "💰",
    title: "Flexible Pricing",
    description: "Credit-based model — pay only for what you use. Scale seamlessly with your organisation.",
    tx: 260, ty: 10, rot: 6,
  },
];

const DESKTOP_BREAKPOINT = 768;

export default function WhyChooseSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimatedRef = useRef(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsDesktop(e.matches);
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const clearAllTimeouts = () => { timeoutsRef.current.forEach(clearTimeout); timeoutsRef.current = []; };

  const applyStyle = (el: HTMLDivElement, props: Partial<CSSStyleDeclaration>) => { Object.assign(el.style, props); };

  const stackAll = useCallback(() => {
    CARDS.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      applyStyle(el, {
        transform: `translate(0px, ${i * -3}px) rotate(${(i - 1) * 2.5}deg) scale(${1 - i * 0.03})`,
        opacity: i === 0 ? "1" : i === 1 ? "0.88" : "0.75",
        transition: "none",
        zIndex: String(3 - i),
        boxShadow: "0 4px 20px rgba(0,65,141,0.12)",
      });
    });
  }, []);

  const playAnimation = useCallback(() => {
    clearAllTimeouts();
    stackAll();
    const t1 = setTimeout(() => {
      const el = cardRefs.current[1];
      if (!el) return;
      applyStyle(el, {
        transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s, box-shadow 0.2s",
        transform: "translate(0px, -36px) scale(1.06)",
        opacity: "1",
        boxShadow: "0 14px 36px rgba(0,65,141,0.2)",
      });
    }, 300);
    timeoutsRef.current.push(t1);
    CARDS.forEach((c, i) => {
      const t = setTimeout(() => {
        const el = cardRefs.current[i];
        if (!el) return;
        applyStyle(el, {
          transition: "transform 0.58s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s, box-shadow 0.3s",
          transform: `translate(${c.tx}px, ${c.ty}px) rotate(${c.rot}deg) scale(1)`,
          opacity: "1",
          zIndex: c.id === "card1" ? "4" : "3",
          boxShadow: c.id === "card1" ? "0 10px 32px rgba(0,65,141,0.18)" : "0 6px 18px rgba(0,65,141,0.10)",
        });
      }, 620 + i * 140);
      timeoutsRef.current.push(t);
    });
  }, [stackAll]);

  useEffect(() => {
    if (!isDesktop) { clearAllTimeouts(); return; }
    hasAnimatedRef.current = false;
    stackAll();
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !hasAnimatedRef.current) { hasAnimatedRef.current = true; playAnimation(); } },
      { threshold: 0.25 }
    );
    observer.observe(section);
    return () => { observer.disconnect(); clearAllTimeouts(); };
  }, [isDesktop, stackAll, playAnimation]);

  const CardInner = ({ card }: { card: (typeof CARDS)[0] }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", height: "100%" }}>
      <div style={{
        width: 68, height: 68, borderRadius: 12,
        background: "rgba(0,65,141,0.07)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 14, overflow: "hidden",
      }}>
        <img src={card.icon} alt="" aria-hidden="true"
          style={{ width: 54, height: 54, objectFit: "contain" }}
          loading="lazy"
          onError={(e) => {
            const p = (e.target as HTMLImageElement).parentElement;
            if (p) p.innerHTML = `<span style="font-size:36px">${card.emoji}</span>`;
          }}
        />
      </div>
      <h3 style={{
        fontFamily: "Georgia, serif", fontWeight: 700,
        fontSize: 15, color: "#00418d", marginBottom: 8, letterSpacing: "-0.01em",
      }}>{card.title}</h3>
      <p style={{ color: "#6b7a8d", fontSize: 13, lineHeight: 1.6 }}>{card.description}</p>
    </div>
  );

  return (
    <section ref={sectionRef} style={{
      background: "#e8f3ff",
      overflow: "hidden",
    }}>
      <div className="sk-container relative z-10" style={{ paddingTop: "clamp(48px, 6vw, 72px)", paddingBottom: "clamp(48px, 6vw, 72px)" }}>

        {/* Globe bg — subtler on light bg */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.05, pointerEvents: "none" }} aria-hidden="true">
          <img src="/images/homepage/home_globe.gif" alt="" style={{ width: "100%", maxWidth: 700 }} loading="lazy" />
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(36px, 5vw, 56px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ width: 32, height: 1, background: "rgba(0,65,141,0.3)", display: "block" }} />
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
              textTransform: "uppercase", color: "rgba(0,65,141,0.6)",
              fontFamily: "Georgia, serif",
            }}>Why Choose SkillKwiz</span>
            <span style={{ width: 32, height: 1, background: "rgba(0,65,141,0.3)", display: "block" }} />
          </div>

          <h2 style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(26px, 3.5vw, 44px)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            color: "#0a1628",
            marginBottom: 12,
          }}>
            Built for{" "}
            <span style={{ color: "#00418d" }}>Precision</span>
            {" & "}
            <span style={{ color: "#f73e5d" }}>Trust</span>
          </h2>
          <p style={{ color: "#6b7a8d", fontSize: 14, maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
            Discover the value propositions that make SkillKwiz the most reliable assessment platform for modern recruiting.
          </p>
        </div>

        {/* Mobile cards */}
        {!isDesktop && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 40 }}>
            {CARDS.map((card) => (
              <div key={card.id} style={{
                background: "#fff", borderRadius: 12,
                padding: "24px 20px", width: "100%", maxWidth: 420,
                boxShadow: "0 4px 20px rgba(0,65,141,0.10)",
                border: "1px solid rgba(0,65,141,0.08)",
              }}>
                <CardInner card={card} />
              </div>
            ))}
          </div>
        )}

        {/* Desktop fan */}
        {isDesktop && (
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: 280, marginBottom: 48 }}>
            {CARDS.map((card, i) => (
              <div key={card.id} ref={(el) => { cardRefs.current[i] = el; }}
                style={{
                  position: "absolute",
                  background: "#fff", borderRadius: 12,
                  padding: "24px 20px",
                  width: 230, textAlign: "center",
                  willChange: "transform, opacity",
                  transformOrigin: "center bottom",
                  boxShadow: "0 4px 20px rgba(0,65,141,0.12)",
                  border: "1px solid rgba(0,65,141,0.08)",
                }}
              >
                <CardInner card={card} />
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(12px, 3vw, 36px)",
          maxWidth: 540, margin: "0 auto 40px",
          padding: "24px 0", borderTop: "1px solid rgba(0,65,141,0.12)", borderBottom: "1px solid rgba(0,65,141,0.12)",
        }}>
          {[
            { num: "10K+", label: "Assessments" },
            { num: "500+", label: "Companies" },
            { num: "98%", label: "Accuracy" },
          ].map((s, i) => (
            <div key={s.label} style={{ textAlign: "center", position: "relative" }}>
              {i > 0 && <span style={{ position: "absolute", left: 0, top: "10%", height: "80%", width: 1, background: "rgba(0,65,141,0.12)", display: "block" }} />}
              <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, color: "#00418d", lineHeight: 1 }}>{s.num}</p>
              <p style={{ color: "#8899aa", fontSize: 11, marginTop: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <Link href="/services" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#00418d", color: "#fff",
            fontWeight: 700, fontSize: 13, letterSpacing: "0.03em",
            padding: "12px 28px", borderRadius: 8,
            textDecoration: "none",
            boxShadow: "0 4px 16px rgba(0,65,141,0.25)",
          }}>Get Started ↗</Link>
          <Link href="/about" style={{
            display: "inline-flex", alignItems: "center",
            color: "#00418d", fontWeight: 600, fontSize: 13,
            padding: "12px 24px", borderRadius: 8,
            border: "1px solid rgba(0,65,141,0.25)",
            textDecoration: "none",
          }}>Learn More</Link>
        </div>

        {/* Revolution sub-cta */}
        <div style={{
          textAlign: "center", marginTop: 56,
          padding: "36px 24px",
          borderTop: "1px solid rgba(0,65,141,0.1)",
        }}>
          <h3 style={{
            fontFamily: "Georgia, serif", fontSize: "clamp(18px, 2.4vw, 28px)",
            fontWeight: 900, color: "#0a1628", marginBottom: 12, letterSpacing: "-0.02em",
          }}>Join the Talent Revolution</h3>
          <p style={{ color: "#6b7a8d", maxWidth: 420, margin: "0 auto 24px", fontSize: 14, lineHeight: 1.7 }}>
            Take the first step towards transforming your hiring process with our tried and tested platform.
          </p>
          <Link href="/services" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#f73e5d", color: "#fff",
            fontWeight: 800, fontSize: 13, letterSpacing: "0.03em",
            padding: "12px 30px", borderRadius: 8,
            textDecoration: "none",
            boxShadow: "0 4px 16px rgba(247,62,93,0.3)",
          }}>Start Free Today</Link>
        </div>
      </div>
    </section>
  );
}
