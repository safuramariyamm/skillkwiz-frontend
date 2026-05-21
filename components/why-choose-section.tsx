"use client";

import Link from "next/link";
import { useEffect, useRef, useCallback } from "react";

const CARDS = [
  {
    id: "card0",
    icon: "/images/homepage/books.gif",
    emoji: "📚",
    title: "Skill Library",
    description: "Extensive assessments covering technical, professional and soft skills for all roles.",
    tx: -220,
    ty: 10,
    rot: -6,
  },
  {
    id: "card1",
    icon: "/images/homepage/guard.gif",
    emoji: "🛡️",
    title: "Secure Testing",
    description: "Biometric verification and content-aware environments ensure authentic results.",
    tx: 0,
    ty: -20,
    rot: 0,
  },
  {
    id: "card2",
    icon: "/images/homepage/dollar.gif",
    emoji: "💰",
    title: "Flexible Pricing",
    description: "Credit-based model — pay only for what you use, scale with your organisation.",
    tx: 220,
    ty: 10,
    rot: 6,
  },
];

export default function WhyChooseSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const applyStyle = (el: HTMLDivElement, props: Partial<CSSStyleDeclaration>) => {
    Object.assign(el.style, props);
  };

  const stackAll = useCallback(() => {
    CARDS.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      applyStyle(el, {
        transform: `translate(0px, ${i * -3}px) rotate(${(i - 1) * 2}deg) scale(${1 - i * 0.03})`,
        opacity: i === 0 ? "1" : i === 1 ? "0.9" : "0.8",
        transition: "none",
        zIndex: String(3 - i),
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
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
        transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s, box-shadow 0.2s",
        transform: "translate(0px, -40px) scale(1.06)",
        opacity: "1",
        boxShadow: "0 16px 40px rgba(0,0,0,0.28)",
      });
    }, 300);
    timeoutsRef.current.push(t1);

    CARDS.forEach((c, i) => {
      const t = setTimeout(() => {
        const el = cardRefs.current[i];
        if (!el) return;
        applyStyle(el, {
          transition: "transform 0.55s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s, box-shadow 0.3s",
          transform: `translate(${c.tx}px, ${c.ty}px) rotate(${c.rot}deg) scale(1)`,
          opacity: "1",
          zIndex: c.id === "card1" ? "4" : "3",
          boxShadow: c.id === "card1"
            ? "0 12px 36px rgba(0,0,0,0.24)"
            : "0 6px 20px rgba(0,0,0,0.16)",
        });
      }, 600 + i * 140);
      timeoutsRef.current.push(t);
    });
  }, [stackAll]);

  useEffect(() => {
    stackAll();
    const t = setTimeout(playAnimation, 400);
    timeoutsRef.current.push(t);
    return () => clearAllTimeouts();
  }, [stackAll, playAnimation]);

  return (
    <section className="py-16 text-white relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 flex">
        <div className="w-full relative">
          <div className="absolute top-0 left-0 right-0 h-[40%]">
            <img
              src="/images/homepage/why_choose_banner_2.png"
              alt=""
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[40%]">
            <img
              src="/images/homepage/why_choose_banner_2.png"
              alt=""
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
            <div className="absolute inset-0 flex justify-center items-center opacity-60">
              <img
                src="/images/homepage/home_globe.gif"
                alt=""
                className="w-full max-w-2xl"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-2">
          Why Choose <span>Skill<span className="text-[#f73e5d]">Kwiz</span></span> ?
        </h2>
        <p
          className="text-center mx-auto text-sm mb-11"
          style={{ color: "rgba(255,255,255,0.65)", maxWidth: 480 }}
        >
          Discover our unique value propositions designed to enhance your recruitment strategy.
        </p>

        {/* ── Card stack ── */}
        {/*
          overflow:visible on the wrapper so fanned cards aren't clipped,
          but the section itself has overflow:hidden so they don't scroll.
          Height matches the HTML: 260px.
        */}
        <div
          className="relative flex items-center justify-center"
          style={{ height: 260, marginBottom: 40 }}
        >
          {CARDS.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{
                position: "absolute",
                width: 190,
                background: "#fff",
                borderRadius: 16,
                padding: "24px 20px 20px",
                textAlign: "center",
                cursor: "default",
                willChange: "transform, opacity",
                transformOrigin: "center bottom",
                boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "#e3f0ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  fontSize: 22,
                  overflow: "hidden",
                }}
              >
                <img
                  src={card.icon}
                  alt=""
                  aria-hidden="true"
                  style={{ width: 56, height: 56, objectFit: "cover" }}
                  onError={(e) => {
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) parent.innerHTML = card.emoji;
                  }}
                />
              </div>

              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#00418d",
                  margin: "0 0 8px",
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontSize: 12,
                  color: "#555",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Replay + CTA */}
        <div
          className="flex justify-center items-center relative z-20"
          style={{ gap: 12, marginBottom: 64 }}
        >
          <button
            onClick={playAnimation}
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff",
              borderRadius: 100,
              padding: "10px 24px",
              fontSize: 13,
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.22)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)")
            }
          >
            ↺ Replay animation
          </button>

          <Link
            href="/services"
            style={{
              background: "#f6c648",
              color: "#00418d",
              fontWeight: 700,
              borderRadius: 100,
              padding: "10px 28px",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Get started ↗
          </Link>
        </div>

        {/* Bottom CTA */}
        <div className="text-center relative z-20">
          <h3 className="text-2xl font-bold mb-4">Join the Talent Revolution</h3>
          <p className="max-w-2xl mx-auto mb-8 text-sm">
            Take the first step towards transforming your hiring process. Make
            selections in line with our tried and tested platform.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center justify-center bg-[#f7d03e] text-black px-8 py-3 rounded-md font-medium hover:bg-opacity-90 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}