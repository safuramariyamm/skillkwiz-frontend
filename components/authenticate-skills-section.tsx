"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
    iconBg: "bg-[#00418d]/10",
    iconColor: "text-[#00418d]",
    title: "Verified Assessments",
    description: "Conduct secure evaluations and receive authenticated skill reports instantly after completion.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    iconBg: "bg-[#f73e5d]/8",
    iconColor: "text-[#f73e5d]",
    title: "AI-Powered Evaluation",
    description: "Intelligent workflows improve candidate analysis with higher accuracy and efficiency.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    iconBg: "bg-[#f6c648]/15",
    iconColor: "text-[#e5a800]",
    title: "Trusted Test Centers",
    description: "Secure assessment centers with biometric verification ensure fair, transparent results.",
  },
];

export default function AuthenticateSkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#f8fbff] sk-section-sm relative overflow-hidden">

      {/* Soft background blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-[-8%] w-96 h-96 bg-[#00418d]/4 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-[-8%] w-80 h-80 bg-[#f73e5d]/4 rounded-full blur-3xl" />
      </div>

      <div className="sk-container relative z-10">

        {/* Eyebrow */}
        <div className={`flex justify-center mb-5 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <span className="sk-label text-[#00418d]/60 bg-[#00418d]/8 border border-[#00418d]/12 px-5 py-2 rounded-full">
            Smart Hiring Solution
          </span>
        </div>

        {/* Heading */}
        <div className={`text-center max-w-3xl mx-auto mb-10 transition-all duration-700 delay-75 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          <h2 className="sk-h2 text-gray-900">
            Authenticate Skills{" "}
            <span className="text-[#00418d]">With Confidence</span>
          </h2>
          <p className="sk-body mt-5 max-w-2xl mx-auto">
            SkillKwiz helps companies verify candidate expertise through secure assessments, intelligent evaluation, and trusted reporting systems.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[58%_42%] gap-8 lg:gap-12 items-center">

          {/* Left — feature cards */}
          <div className={`transition-all duration-700 delay-150 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <div className="space-y-5">
              {features.map((f) => (
                <div key={f.title} className="sk-card p-7 flex items-start gap-6 rounded-2xl">
                  <div className={`w-20 h-20 rounded-2xl ${f.iconBg} ${f.iconColor} flex items-center justify-center shrink-0 [&>svg]:w-10 [&>svg]:h-10`}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="sk-h3 text-gray-900 mb-2">{f.title}</h3>
                    <p className="sk-body">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/services" className="btn-primary btn-lg">
                Explore Services
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a href="/about" className="btn-outline text-[#00418d] border-[#00418d] btn-lg hover:bg-[#00418d] hover:text-white">
                Learn More
              </a>
            </div>
          </div>

          {/* Right — image stack */}
          <div className={`relative transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>

            {/* Main image */}
            <div className="relative h-[360px] md:h-[440px] rounded-3xl overflow-hidden shadow-2xl shadow-[#00418d]/15">
              <Image src="/images/homepage/skills_1.png" alt="Skill Authentication" fill priority className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>

            {/* Floating stats card */}
            <div className="absolute bottom-6 left-4 md:left-6 bg-white/95 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-2xl border border-white max-w-[200px]">
              <p className="text-4xl font-black text-[#00418d]">98%</p>
              <p className="text-xs text-gray-500 mt-1.5 leading-snug">Candidate verification accuracy powered by AI.</p>
            </div>

            {/* Floating secondary image */}
            <div className="absolute top-4 -right-3 md:-right-6 w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
              <Image src="/images/homepage/skills_3.png" alt="Professional" fill className="object-cover" />
            </div>

            {/* Floating counter badge */}
            <div className="absolute -top-4 -left-3 md:-left-8 bg-[#00418d] text-white rounded-2xl px-5 py-4 shadow-2xl">
              <p className="text-3xl font-black">10K+</p>
              <p className="text-xs text-white/70 mt-0.5">Verified Assessments</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}