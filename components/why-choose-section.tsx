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
    tx: -260,
    ty: 12,
    rot: -6,
  },
  {
    id: "card1",
    icon: "/images/homepage/guard.gif",
    emoji: "🛡️",
    title: "Secure Testing",
    description: "Biometric verification and content-aware environments ensure authentic, tamper-proof results.",
    tx: 0,
    ty: -22,
    rot: 0,
  },
  {
    id: "card2",
    icon: "/images/homepage/dollar.gif",
    emoji: "💰",
    title: "Flexible Pricing",
    description: "Credit-based model — pay only for what you use. Scale seamlessly with your organisation.",
    tx: 260,
    ty: 12,
    rot: 6,
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
        transform: `translate(0px, ${i * -4}px) rotate(${(i - 1) * 2.5}deg) scale(${1 - i * 0.03})`,
        opacity: i === 0 ? "1" : i === 1 ? "0.88" : "0.75",
        transition: "none",
        zIndex: String(3 - i),
        boxShadow: "0 6px 30px rgba(0,65,141,0.2)",
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
        transform: "translate(0px, -44px) scale(1.07)",
        opacity: "1",
        boxShadow: "0 20px 50px rgba(0,65,141,0.28)",
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
          boxShadow: c.id === "card1"
            ? "0 16px 44px rgba(0,65,141,0.22)"
            : "0 8px 24px rgba(0,65,141,0.14)",
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
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          playAnimation();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(section);
    return () => { observer.disconnect(); clearAllTimeouts(); };
  }, [isDesktop, stackAll, playAnimation]);

  const CardInner = ({ card }: { card: (typeof CARDS)[0] }) => (
    <div className="flex flex-col items-center text-center h-full">
      {/* Icon circle */}
      <div className="w-16 h-16 rounded-2xl bg-[#00418d]/8 flex items-center justify-center mb-5 overflow-hidden">
        <img
          src={card.icon}
          alt=""
          aria-hidden="true"
          className="w-12 h-12 object-contain"
          loading="lazy"
          onError={(e) => {
            const p = (e.target as HTMLImageElement).parentElement;
            if (p) p.innerHTML = `<span style="font-size:28px">${card.emoji}</span>`;
          }}
        />
      </div>
      <h3 className="sk-h4 text-[#00418d] mb-3">{card.title}</h3>
      <p className="sk-caption text-gray-500 leading-relaxed">{card.description}</p>
    </div>
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #f0f7ff 0%, #000c2a 18%, #000c2a 82%, #f0f7ff 100%)" }}>

      {/* Globe decoration */}
      <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none" aria-hidden="true">
        <img src="/images/homepage/home_globe.gif" alt="" className="w-full max-w-3xl" loading="lazy" />
      </div>

      <div className="sk-container relative z-10 sk-section">

        {/* Eyebrow */}
        <div className="flex justify-center mb-4">
          <span className="sk-label text-white/50 bg-white/8 px-5 py-2 rounded-full border border-white/12">
            Why Choose SkillKwiz
          </span>
        </div>

        {/* Heading */}
        <h2 className="sk-h2 text-center text-white mb-4">
          Built for{" "}
          <span className="text-[#f6c648]">Precision</span>
          {" & "}
          <span className="text-[#f73e5d]">Trust</span>
        </h2>
        <p className="text-center text-white/55 max-w-xl mx-auto mb-16 text-base leading-relaxed">
          Discover the value propositions that make SkillKwiz the most reliable assessment platform for modern recruiting.
        </p>

        {/* Mobile: vertical stack */}
        {!isDesktop && (
          <div className="flex flex-col items-center gap-5 mb-14">
            {CARDS.map((card) => (
              <div key={card.id} className="sk-card w-full max-w-sm p-8">
                <CardInner card={card} />
              </div>
            ))}
          </div>
        )}

        {/* Desktop: animated fan */}
        {isDesktop && (
          <div className="relative flex items-center justify-center mb-16" style={{ height: 300 }}>
            {CARDS.map((card, i) => (
              <div
                key={card.id}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="absolute bg-white rounded-2xl p-8 text-center"
                style={{
                  width: 220,
                  cursor: "default",
                  willChange: "transform, opacity",
                  transformOrigin: "center bottom",
                  boxShadow: "0 6px 30px rgba(0,65,141,0.2)",
                  borderRadius: 20,
                }}
              >
                <CardInner card={card} />
              </div>
            ))}
          </div>
        )}

        {/* Stats row */}


        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/services" className="btn-accent btn-lg">
            Get Started ↗
          </Link>
          <Link href="/about" className="btn-ghost-white btn-md">
            Learn More
          </Link>
        </div>

        {/* Join revolution sub-cta */}
        <div className="text-center mt-20 border-t border-white/10 pt-16">
          <h3 className="sk-h3 text-white mb-4">Join the Talent Revolution</h3>
          <p className="text-white/55 max-w-lg mx-auto mb-8 text-base leading-relaxed">
            Take the first step towards transforming your hiring process with our tried and tested platform.
          </p>
          <Link href="/services" className="btn-cta btn-lg">
            Start Free Today
          </Link>
        </div>
      </div>
    </section>
  );
}