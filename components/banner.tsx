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
  },
  {
    id: 2,
    image: "/images/homepage/Carousel/Skill Library.jpg",
    heading: "Authenticate Skills, Simplify Hiring",
    subtext: "SkillKwiz ensures professionals are evaluated accurately in their chosen fields. Secure testing centers. Verified reports.",
    cta: "Explore Skills",
    ctaHref: "/services",
    badge: "Skill Assessment",
  },
  {
    id: 3,
    image: "/images/homepage/Carousel/Secure Center.jpg",
    heading: "Assessments in Secure Centers",
    subtext: "Eliminate the need for lengthy technical interviews. Get instant access to authenticated skill reports.",
    cta: "Learn More",
    ctaHref: "/about",
    badge: "Secure & Trusted",
  },
  {
    id: 4,
    image: "/images/homepage/Carousel/Drivers License.jpg",
    heading: "Your Skill — Your License",
    subtext: "Just like a driver's license validates your ability to drive, SkillKwiz validates your professional skills.",
    cta: "Get Assessed",
    ctaHref: "/services",
    badge: "Verified Excellence",
  },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  // Preload slides 2-4 in background
  useEffect(() => {
    slides.forEach((s, i) => {
      if (i === 0) return;
      const img = new window.Image();
      img.src = s.image;
    });
  }, []);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => goTo((current + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const goTo = (idx: number) => {
    if (transitioning || idx === current) return;
    setTransitioning(true);
    setPrev(current);
    setCurrent(idx);
    setTimeout(() => { setTransitioning(false); setPrev(null); }, 600);
  };

  const slide = slides[current];

  return (
    /* Top margin matches nav height (64px) */
    <div className="relative w-full overflow-hidden" style={{ marginTop: "64px" }}>

      {/* ── Background image layer (crossfade) ── */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 1 : 0,
            willChange: "opacity",
          }}
        >
          <Image
            src={s.image}
            alt=""
            fill
            className="object-cover object-center"
            priority={i === 0}
            loading={i === 0 ? "eager" : "lazy"}
            sizes="100vw"
          />
          {/* Gradient overlay — left heavy for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/85 via-[#0a1628]/55 to-transparent" />
          {/* Bottom blend into next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#f0f7ff]/30" />
        </div>
      ))}

      {/* ── Content ── */}
      <div
        className="relative z-10 flex items-start"
        style={{ minHeight: "clamp(480px, 70vh, 680px)", paddingTop: "clamp(80px, 14vh, 140px)" }}
      >
        <div className="sk-container w-full">
          <div className="max-w-2xl">

            {/* Badge */}
            <div
              key={slide.badge}
              className="inline-flex items-center gap-2 bg-[#f6c648] text-[#00418d] px-4 py-1.5 rounded-full mb-6"
              style={{ animation: "fadeSlideUp 0.5s ease both" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00418d]" />
              <span className="sk-label text-[#00418d]">{slide.badge}</span>
            </div>

            {/* Heading */}
            <h1
              key={slide.heading}
              className="sk-h1 text-white mb-5 leading-[1.08]"
              style={{ animation: "fadeSlideUp 0.55s 0.05s ease both" }}
            >
              {slide.heading}
            </h1>

            {/* Subtext */}
            <p
              key={slide.subtext}
              className="text-gray-200 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
              style={{ animation: "fadeSlideUp 0.6s 0.1s ease both" }}
            >
              {slide.subtext}
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-4"
              style={{ animation: "fadeSlideUp 0.65s 0.15s ease both" }}
            >
              <Link href={slide.ctaHref} className="btn-cta btn-lg">
                {slide.cta}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/about" className="btn-ghost-white btn-lg">
                How it Works
              </Link>
            </div>

            {/* Trust bar */}
            <div
              className="flex flex-wrap items-center gap-5 mt-10"
              style={{ animation: "fadeSlideUp 0.7s 0.2s ease both" }}
            >
              {[
                { num: "10K+", label: "Verified Assessments" },
                { num: "500+", label: "Companies Worldwide" },
                { num: "98%", label: "Accuracy Rate" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="text-[#f6c648] font-black text-xl">{stat.num}</span>
                  <span className="text-white/60 text-sm">{stat.label}</span>
                  <span className="w-px h-4 bg-white/20 last:hidden" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Slide dots ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`rounded-full transition-all duration-300 ${
              idx === current
                ? "bg-[#f6c648] w-7 h-2.5"
                : "bg-white/40 hover:bg-white/70 w-2.5 h-2.5"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* ── Arrow controls ── */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
        aria-label="Previous"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
        aria-label="Next"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ── Bottom wave blend into next section ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none" style={{ height: 60 }}>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
          <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="#f0f7ff" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}