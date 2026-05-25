"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "/images/homepage/Carousel/Pick - Laptop.jpg",
    heading: "World's Largest Skill Assessment Library",
    subtext: "Assessments in Secure Centers — Verified Skills, Simplified Hiring",
    cta: "Get Started Free",
    ctaHref: "/services",
    badge: "Hiring Simplified",
    accent: "#f6c648",
  },
  {
    id: 2,
    image: "/images/homepage/Carousel/Skill Library.jpg",
    heading: "Authenticate Skills, Simplify Hiring",
    subtext: "SkillKwiz ensures professionals are evaluated accurately in their chosen fields. Secure testing centers. Verified reports.",
    cta: "Explore Skills",
    ctaHref: "/services",
    badge: "Skill Assessment",
    accent: "#f73e5d",
  },
  {
    id: 3,
    image: "/images/homepage/Carousel/Secure Center.jpg",
    heading: "Assessments in Secure Centers",
    subtext: "Eliminate the need for lengthy technical interviews. Get instant access to authenticated skill reports.",
    cta: "Learn More",
    ctaHref: "/about",
    badge: "Secure & Trusted",
    accent: "#f6c648",
  },
  {
    id: 4,
    image: "/images/homepage/Carousel/Drivers License.jpg",
    heading: "Your Skill — Your License",
    subtext: "Just like a driver's license validates your ability to drive, SkillKwiz validates your professional skills.",
    cta: "Get Assessed",
    ctaHref: "/services",
    badge: "Verified Excellence",
    accent: "#f73e5d",
  },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    slides.forEach((s, i) => {
      if (i === 0) return;
      const img = new window.Image();
      img.src = s.image;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => goTo((current + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const goTo = (idx: number) => {
    if (transitioning || idx === current) return;
    setTransitioning(true);
    setCurrent(idx);
    setTimeout(() => setTransitioning(false), 600);
  };

  const slide = slides[current];

  return (
    <div className="relative w-full overflow-hidden" style={{ marginTop: "64px", minHeight: "clamp(520px, 80vh, 780px)" }}>

      {/* Background images */}
      {slides.map((s, i) => (
        <div key={s.id} className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}>
          <Image src={s.image} alt="" fill className="object-cover object-center"
            priority={i === 0} loading={i === 0 ? "eager" : "lazy"} sizes="100vw" />
          {/* Split overlay — dark left 60%, fades right */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(105deg, #0a1628 0%, #0a1628 42%, rgba(10,22,40,0.75) 62%, rgba(10,22,40,0.15) 100%)"
          }} />
        </div>
      ))}

      {/* Diagonal accent line */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        <div style={{
          position: "absolute", left: "52%", top: 0, bottom: 0, width: "2px",
          background: `linear-gradient(180deg, transparent 0%, ${slide.accent}60 30%, ${slide.accent} 50%, ${slide.accent}60 70%, transparent 100%)`,
          transform: "rotate(8deg) scaleX(1)", transformOrigin: "top",
          transition: "all 0.6s ease",
        }} />
      </div>

      {/* Slide number — big typographic element */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-[3] hidden lg:block pointer-events-none select-none">
        <span style={{
          fontSize: "clamp(120px, 18vw, 240px)",
          fontWeight: 900,
          lineHeight: 1,
          color: "rgba(255,255,255,0.04)",
          fontFamily: "Georgia, serif",
          letterSpacing: "-0.04em",
        }}>0{current + 1}</span>
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-[4] flex items-center" style={{ paddingTop: "clamp(60px, 10vh, 100px)" }}>
        <div className="sk-container w-full">
          <div style={{ maxWidth: "clamp(340px, 52%, 660px)" }}>

            {/* Badge — pill with accent dot */}
            <div key={`badge-${current}`} className="flex items-center gap-2.5 mb-7"
              style={{ animation: "heroIn 0.5s ease both" }}>
              <span style={{
                background: slide.accent,
                width: 8, height: 8, borderRadius: "50%", display: "inline-block", flexShrink: 0,
              }} />
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
                color: slide.accent, textTransform: "uppercase", fontFamily: "Georgia, serif",
              }}>{slide.badge}</span>
              <span style={{ height: 1, width: 40, background: `${slide.accent}60`, display: "inline-block" }} />
            </div>

            {/* Heading — editorial serif */}
            <h1 key={`h-${current}`} style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(32px, 4.5vw, 64px)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "#fff",
              marginBottom: "1.25rem",
              animation: "heroIn 0.55s 0.05s ease both",
            }}>{slide.heading}</h1>

            {/* Subtext */}
            <p key={`s-${current}`} style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "clamp(15px, 1.4vw, 18px)",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
              maxWidth: 480,
              animation: "heroIn 0.6s 0.1s ease both",
            }}>{slide.subtext}</p>

            {/* CTAs */}
            <div key={`cta-${current}`} className="flex flex-wrap gap-4"
              style={{ animation: "heroIn 0.65s 0.15s ease both" }}>
              <Link href={slide.ctaHref} style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: slide.accent,
                color: slide.accent === "#f6c648" ? "#0a1628" : "#fff",
                fontWeight: 700, fontSize: 14, letterSpacing: "0.04em",
                padding: "14px 28px", borderRadius: 4,
                textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: `0 4px 24px ${slide.accent}50`,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}
              >
                {slide.cta}
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/about" style={{
                display: "inline-flex", alignItems: "center",
                color: "rgba(255,255,255,0.8)",
                fontWeight: 600, fontSize: 14,
                padding: "14px 24px", borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.25)",
                textDecoration: "none", transition: "all 0.2s",
                background: "rgba(255,255,255,0.06)",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.14)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
              >
                How it Works
              </Link>
            </div>

            {/* Trust bar */}
            <div key={`trust-${current}`} className="flex flex-wrap items-center gap-6 mt-10"
              style={{ animation: "heroIn 0.7s 0.2s ease both" }}>
              {[
                { num: "10K+", label: "Verified Assessments" },
                { num: "500+", label: "Companies Worldwide" },
                { num: "98%", label: "Accuracy Rate" },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-3">
                  {i > 0 && <span style={{ width: 1, height: 28, background: "rgba(255,255,255,0.15)", display: "block" }} />}
                  <div>
                    <span style={{ color: slide.accent, fontWeight: 900, fontSize: "clamp(16px, 2vw, 22px)", fontFamily: "Georgia, serif", display: "block", lineHeight: 1 }}>{stat.num}</span>
                    <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 z-[5] pointer-events-none" style={{ height: 70 }}>
        <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
          <path d="M0 70 L0 40 Q360 5 720 35 Q1080 65 1440 30 L1440 70 Z" fill="#f0f7ff" />
        </svg>
      </div>

      {/* Slide controls — vertical right side */}
      <div className="absolute right-6 bottom-20 z-[5] flex flex-col gap-2">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => goTo(idx)} aria-label={`Slide ${idx + 1}`}
            style={{
              width: idx === current ? 3 : 2,
              height: idx === current ? 32 : 16,
              background: idx === current ? slide.accent : "rgba(255,255,255,0.3)",
              border: "none", borderRadius: 2, cursor: "pointer",
              transition: "all 0.3s ease",
            }} />
        ))}
      </div>

      {/* Arrow controls */}
      {[
        { dir: "prev", side: "left-4", label: "Previous" },
        { dir: "next", side: "right-14", label: "Next" },
      ].map(({ dir, side, label }) => (
        <button key={dir} onClick={() => goTo(dir === "next" ? (current + 1) % slides.length : (current - 1 + slides.length) % slides.length)}
          className={`absolute ${side} bottom-16 z-[5]`}
          aria-label={label}
          style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = slide.accent; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={dir === "next" ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
          </svg>
        </button>
      ))}

      <style jsx>{`
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}