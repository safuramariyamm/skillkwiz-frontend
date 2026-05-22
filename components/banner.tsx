"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "/images/homepage/Carousel/Pick - Laptop.jpg",
    heading: "The World's Largest Skill Assessment Library",
    subtext: "Assessments in Secure Centers — Verified Skills, Simplified Hiring",
    cta: "Get Started",
    ctaHref: "/services",
    badge: "Hiring Simplified",
  },
  {
    id: 2,
    image: "/images/homepage/Carousel/Skill Library.jpg",
    heading: "Authenticate Skills, Simplify Hiring",
    subtext:
      "SkillKwiz ensures professionals are evaluated accurately in their chosen fields. Secure testing centers. Verified reports.",
    cta: "Explore Skills",
    ctaHref: "/services",
    badge: "Skill Assessment",
  },
  {
    id: 3,
    image: "/images/homepage/Carousel/Secure Center.jpg",
    heading: "Assessments in Secure Centers",
    subtext:
      "Eliminate the need for lengthy technical interviews. Get instant access to authenticated skill reports.",
    cta: "Learn More",
    ctaHref: "/about",
    badge: "Secure & Trusted",
  },
  {
    id: 4,
    image: "/images/homepage/Carousel/Drivers License.jpg",
    heading: "Your Skill — Your License",
    subtext:
      "Just like a driver's license validates your ability to drive, SkillKwiz validates your professional skills.",
    cta: "Get Assessed",
    ctaHref: "/services",
    badge: "Verified Excellence",
  },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Preload slides 2-4 in background so transitions are instant
  useEffect(() => {
    slides.forEach((s, i) => {
      if (i === 0) return;
      const img = new window.Image();
      img.src = s.image;
    });
  }, []);

  // Auto-advance carousel every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx: number) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 400);
  };

  const goToNext = () => {
    goTo((current + 1) % slides.length);
  };

  const goToPrev = () => {
    goTo((current - 1 + slides.length) % slides.length);
  };

  const slide = slides[current];

  return (
    <div className="relative w-full overflow-hidden" style={{ marginTop: "64px" }}>
      {/* Slides */}
      <div
        className={`relative w-full h-[480px] md:h-[560px] lg:h-[640px] transition-opacity duration-500 ${animating ? "opacity-0" : "opacity-100"}`}
      >
        <Image
          src={slide.image}
          alt={slide.heading}
          fill
          className="object-cover object-center"
          priority={current === 0}
          loading={current === 0 ? "eager" : "lazy"}
          sizes="100vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#000c2a]/80 via-[#000c2a]/50 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-xl">
              {/* Badge */}
              <div className="inline-block bg-[#f6c648] text-[#00418d] font-bold text-body px-4 py-1 rounded-full mb-4 animate-fade-in">
                {slide.badge}
              </div>
              <h1 className="text-headingLg md:text-headingXl lg:text-headingXl font-bold text-white mb-4 leading-tight">
                {slide.heading}
              </h1>
              <p className="text-subhead md:text-headingSm text-gray-200 mb-8">
                {slide.subtext}
              </p>
              <Link
                href={slide.ctaHref}
                className="inline-flex items-center justify-center bg-[#f73e5d] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#d62f4f] transition-all shadow-lg"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all z-10"
        aria-label="Previous"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all z-10"
        aria-label="Next"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`rounded-full transition-all ${
              idx === current ? "bg-[#f6c648] w-6 h-3" : "bg-white/60 w-3 h-3"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}