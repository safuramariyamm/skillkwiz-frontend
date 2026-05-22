"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useCallback, useState } from "react";

const CARDS = [
  {
    id: "card0",
    icon: "/images/homepage/books.gif",
    emoji: "📚",
    title: "Skill Library",
    description:
      "Extensive assessments covering technical, professional and soft skills for all roles.",
    tx: -220,
    ty: 10,
    rot: -6,
  },
  {
    id: "card1",
    icon: "/images/homepage/guard.gif",
    emoji: "🛡️",
    title: "Secure Testing",
    description:
      "Biometric verification and content-aware environments ensure authentic results.",
    tx: 0,
    ty: -20,
    rot: 0,
  },
  {
    id: "card2",
    icon: "/images/homepage/dollar.gif",
    emoji: "💰",
    title: "Flexible Pricing",
    description:
      "Credit-based model — pay only for what you use, scale with your organisation.",
    tx: 220,
    ty: 10,
    rot: 6,
  },
];

const DESKTOP_BREAKPOINT = 768;

export default function WhyChooseSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimatedRef = useRef(false); // fire only once per mount
  const [isDesktop, setIsDesktop] = useState(false);

  // Track breakpoint
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
        transition:
          "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s, box-shadow 0.2s",
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
          transition:
            "transform 0.55s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s, box-shadow 0.3s",
          transform: `translate(${c.tx}px, ${c.ty}px) rotate(${c.rot}deg) scale(1)`,
          opacity: "1",
          zIndex: c.id === "card1" ? "4" : "3",
          boxShadow:
            c.id === "card1"
              ? "0 12px 36px rgba(0,0,0,0.24)"
              : "0 6px 20px rgba(0,0,0,0.16)",
        });
      }, 600 + i * 140);
      timeoutsRef.current.push(t);
    });
  }, [stackAll]);

  // IntersectionObserver — trigger animation when section scrolls into view
  useEffect(() => {
    if (!isDesktop) {
      clearAllTimeouts();
      return;
    }

    // Reset so it fires again if breakpoint toggled
    hasAnimatedRef.current = false;
    stackAll();

    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          playAnimation();
        }
      },
      {
        // Fire when 30% of the section is visible
        threshold: 0.3,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      clearAllTimeouts();
    };
  }, [isDesktop, stackAll, playAnimation]);

  // Shared card inner JSX to avoid duplication
  const CardInner = ({ card }: { card: (typeof CARDS)[0] }) => (
    <>
      <div
        className="w-[52px] h-[52px] rounded-full bg-[#e3f0ff] flex items-center justify-center mx-auto mb-3 overflow-hidden text-2xl"
      >
        <Image
          src={card.icon} alt="" width={56} height={56} className="object-cover"
          onError={(e) => {
            const parent = (e.target as HTMLImageElement).parentElement;
            if (parent) parent.textContent = card.emoji;
          }}
        />
      </div>
      <h3 className="text-sm font-bold text-[#00418d] mb-2">
        {card.title}
      </h3>
      <p className="text-caption text-[#555555] leading-relaxed">
        {card.description}
      </p>
    </>
  );

  return (
    <section ref={sectionRef} className="py-16 text-white relative overflow-hidden">
      {/* ── Background ── */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-[40%]">
          <Image src="/images/homepage/why_choose_banner_2.png" alt="" fill className="object-cover" priority loading="eager" aria-hidden="true" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[40%]">
          <div className="absolute inset-0 flex justify-center items-center opacity-60">
            <Image src="/images/homepage/home_globe.gif" alt="" width={600} height={400} className="max-w-2xl" loading="lazy" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* ── Heading ── */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Why Choose{" "}
          <span>
            Skill<span className="text-[#f73e5d]">Kwiz</span>
          </span>{" "}
          ?
        </h2>
        <p
          className="text-center mx-auto text-sm mb-10 sm:mb-11"
          style={{ color: "rgba(255,255,255,0.65)", maxWidth: 480 }}
        >
          Discover our unique value propositions designed to enhance your recruitment strategy.
        </p>

        {/* ── MOBILE: vertical card list ── */}
        {!isDesktop && (
          <div className="flex flex-col items-center gap-5 mb-10">
            {CARDS.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-2xl text-center w-full max-w-xs"
                style={{ padding: "24px 20px 20px", boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}
              >
                <CardInner card={card} />
              </div>
            ))}
          </div>
        )}

        {/* ── DESKTOP: animated fan stack ── */}
        {isDesktop && (
          <div
            className="relative flex items-center justify-center"
            style={{ height: 260, marginBottom: 40 }}
          >
            {CARDS.map((card, i) => (
              <div
                key={card.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
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
                <CardInner card={card} />
              </div>
            ))}
          </div>
        )}

        {/* ── CTA row ── */}
        <div
          className="flex justify-center items-center relative z-20"
          style={{ gap: 12, marginBottom: 64 }}
        >
          <Link
            href="/services"
            className="bg-[#f6c648] text-[#00418d] font-bold rounded-full px-7 py-2.5 no-underline hover:bg-opacity-90 transition-all"
          >
            Get started ↗
          </Link>
        </div>

        {/* ── Bottom CTA ── */}
        <div className="text-center relative z-20 mt-4 md:mt-0">
          <h3 className="text-xl sm:text-2xl font-bold mb-3">Join the Talent Revolution</h3>
          <p className="max-w-2xl mx-auto mb-8 text-sm px-2">
            Take the first step towards transforming your hiring process. Make selections in line
            with our tried and tested platform.
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