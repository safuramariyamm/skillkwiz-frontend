"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  company: string;
  quote: string;
  image: string;
  metrics: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1, name: "Jennifer Cooper", title: "CEO & Founder", company: "TechFlow Solutions",
    quote: "Since implementing SkillKwiz, our hiring efficiency has skyrocketed. We've reduced time-to-hire by 40% while dramatically improving candidate quality.",
    image: "/images/homepage/5.png", metrics: "40% faster hiring",
  },
  {
    id: 2, name: "Michael Donovan", title: "VP of Talent Acquisition", company: "GlobalTech Corp",
    quote: "Managing technical recruitment for a Fortune 500 company, we needed a solution that could scale. SkillKwiz's enterprise-grade security has been game-changing.",
    image: "/images/homepage/6.png", metrics: "2,000+ assessments/quarter",
  },
  {
    id: 3, name: "Sarah Johnson", title: "Head of People Operations", company: "InnovateLabs",
    quote: "What impressed me most is the customization. We built assessment frameworks tailored to our unique tech stack — the platform adapts to our needs.",
    image: "/images/homepage/7.png", metrics: "Custom frameworks built",
  },
  {
    id: 4, name: "David Chen", title: "Engineering Director", company: "DataFlow Systems",
    quote: "SkillKwiz saves our engineering team countless hours. Their technical assessments accurately predict real-world performance.",
    image: "/images/homepage/5.png", metrics: "Dozens of hires monthly",
  },
  {
    id: 5, name: "Emily Rodriguez", title: "Senior Recruiter", company: "Nexus Technologies",
    quote: "I've worked with every major assessment platform, and SkillKwiz stands out for its user experience, accuracy, and responsive support team.",
    image: "/images/homepage/6.png", metrics: "10+ years recruiting",
  },
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
  const prev = () => goTo((active - 1 + testimonials.length) % testimonials.length);
  const next = () => goTo((active + 1) % testimonials.length);

  const getCard = (offset: number) => testimonials[(active + offset + testimonials.length) % testimonials.length];

  return (
    /* White section — blends out of dark why-choose section */
    <section className="bg-[#f0f7ff] sk-section">
      <div className="sk-container">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="sk-label text-[#00418d]/50 bg-[#00418d]/6 px-5 py-2 rounded-full border border-[#00418d]/12 mb-4 inline-block">
            Client Stories
          </span>
          <h2 className="sk-h2 text-gray-900 mt-4">
            Trusted by Recruiting Teams{" "}
            <span className="text-[#00418d]">Worldwide</span>
          </h2>
          <p className="sk-body max-w-xl mx-auto mt-4">
            Hear from the companies that have transformed their hiring with SkillKwiz.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">

          {/* Nav arrows — desktop */}
          <button onClick={prev} aria-label="Previous" className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 items-center justify-center text-[#00418d] hover:bg-[#0a1628] hover:text-white transition-all duration-200">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} aria-label="Next" className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 items-center justify-center text-[#00418d] hover:bg-[#0a1628]
          
          
      hover:text-white transition-all duration-200">
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards row */}
          <div className="flex items-center justify-center gap-4 overflow-hidden px-0 md:px-12 min-h-[320px] md:min-h-[280px]">

            {/* Side card — left */}
            <div className="hidden md:block w-[28%] shrink-0">
              <SideCard t={getCard(-1)} />
            </div>

            {/* Center card — active */}
            <div className="w-full md:w-[44%] shrink-0">
              <MainCard t={getCard(0)} />
            </div>

            {/* Side card — right */}
            <div className="hidden md:block w-[28%] shrink-0">
              <SideCard t={getCard(1)} />
            </div>
          </div>

          {/* Mobile nav */}
          <div className="flex md:hidden justify-between items-center mt-6 px-4">
            <button onClick={prev} className="btn-primary btn-sm">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-500">{active + 1} of {testimonials.length}</span>
            <button onClick={next} className="btn-primary btn-sm">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${i === active ? "w-8 h-2.5 bg-[#0a1628]" : "w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300"}`}
              aria-label={`Go to ${i + 1}`}
            />
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center items-center gap-6 mt-12 pt-10 border-t border-gray-100">
          <p className="text-sm text-gray-400 font-medium">Trusted by 500+ companies worldwide</p>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            Verified Reviews
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-[#00418d]" />
            SOC 2 Certified
          </div>
        </div>
      </div>
    </section>
  );
}

function MainCard({ t }: { t: Testimonial }) {
  return (
    <div className="sk-card p-7 md:p-8 bg-[#00418d] border-none rounded-3xl text-white">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
          <Image src={t.image} alt={t.name} width={56} height={56} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-bold text-base">{t.name}</p>
          <p className="text-white/65 text-sm">{t.title}</p>
          <p className="text-[#f6c648] text-xs font-medium mt-0.5">{t.company}</p>
        </div>
        <div className="ml-auto">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-[#f6c648] text-[#f6c648]" />)}
          </div>
        </div>
      </div>
      <p className="text-white/85 leading-relaxed text-sm md:text-base">"{t.quote}"</p>
      <div className="mt-5 pt-4 border-t border-white/15">
        <span className="text-xs text-[#f6c648] font-semibold">✓ {t.metrics}</span>
      </div>
    </div>
  );
}

function SideCard({ t }: { t: Testimonial }) {
  return (
    <div className="sk-card p-5 rounded-2xl opacity-60 hover:opacity-80 transition-opacity duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shrink-0">
          <Image src={t.image} alt={t.name} width={40} height={40} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-900">{t.name}</p>
          <p className="text-gray-500 text-xs">{t.company}</p>
        </div>
      </div>
      <p className="text-gray-600 text-xs leading-relaxed line-clamp-4">"{t.quote}"</p>
    </div>
  );
}