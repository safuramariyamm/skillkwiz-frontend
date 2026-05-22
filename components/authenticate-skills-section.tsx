"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function AuthenticateSkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) obs.observe(sectionRef.current);

    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 bg-[#f8fbff]"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-[#00418d]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-[-10%] w-[450px] h-[450px] bg-[#f73e5d]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        {/* TOP LABEL */}
        <div
          className={`flex justify-center transition-all duration-700 ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
          }`}
        >
          <span className="bg-[#00418d]/10 text-[#00418d] px-5 py-2 rounded-full text-caption font-bold tracking-[0.25em] uppercase">
            Smart Hiring Solution
          </span>
        </div>

        {/* HEADING */}
        <div
          className={`text-center mt-6 max-w-4xl mx-auto transition-all duration-700 delay-100 ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="text-headingXl md:text-headingXl lg:text-6xl font-black leading-[1.05] text-gray-900">
            Authenticate Skills
            <span className="block text-[#00418d] mt-2">
              With Confidence
            </span>
          </h2>

          <p className="mt-6 text-headingSm text-gray-600 leading-relaxed max-w-2xl mx-auto">
            SkillKwiz helps companies verify candidate expertise
            through secure assessments, intelligent evaluation,
            and trusted reporting systems.
          </p>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center mt-12 sm:mt-16 md:mt-20">

          {/* LEFT SIDE */}
          <div
            className={`transition-all duration-700 delay-200 ${
              visible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            {/* FEATURE CARD */}
            <div className="space-y-6">

              {/* CARD 1 */}
              <div className="group bg-white border border-gray-100 rounded-[30px] p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">

                <div className="flex items-start gap-5">

                  <div className="w-14 h-14 rounded-2xl bg-[#00418d]/10 flex items-center justify-center shrink-0">
                    <svg
                      className="w-7 h-7 text-[#00418d]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-headingSm font-bold text-gray-900">
                      Verified Assessments
                    </h3>

                    <p className="mt-2 text-gray-600 leading-relaxed text-body">
                      Conduct secure evaluations and receive
                      authenticated reports instantly.
                    </p>
                  </div>

                </div>
              </div>

              {/* CARD 2 */}
              <div className="group bg-white border border-gray-100 rounded-[30px] p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">

                <div className="flex items-start gap-5">

                  <div className="w-14 h-14 rounded-2xl bg-[#f73e5d]/10 flex items-center justify-center shrink-0">
                    <svg
                      className="w-7 h-7 text-[#f73e5d]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-headingSm font-bold text-gray-900">
                      AI Evaluation
                    </h3>

                    <p className="mt-2 text-gray-600 leading-relaxed text-body">
                      Intelligent workflows improve candidate
                      analysis with higher accuracy and efficiency.
                    </p>
                  </div>

                </div>
              </div>

              {/* CARD 3 */}
              <div className="group bg-white border border-gray-100 rounded-[30px] p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">

                <div className="flex items-start gap-5">

                  <div className="w-14 h-14 rounded-2xl bg-[#f6c648]/20 flex items-center justify-center shrink-0">
                    <svg
                      className="w-7 h-7 text-[#f6c648]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-headingSm font-bold text-gray-900">
                      Trusted Centers
                    </h3>

                    <p className="mt-2 text-gray-600 leading-relaxed text-body">
                      Secure assessment centers ensure fair,
                      transparent, and trusted testing environments.
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap gap-4">

              <a
                href="/services"
                className="inline-flex items-center gap-3 bg-[#00418d] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-[#042578] hover:scale-105 transition-all duration-300"
              >
                Explore Services

                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>

            </div>
          </div>

          {/* RIGHT SIDE — responsive wrapper prevents overflow on narrow viewports */}
          <div
            className={`relative px-4 md:px-0 transition-all duration-700 delay-300 ${
              visible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            {/* MAIN IMAGE — responsive height on mobile / tablet */}
            <div className="relative h-[480px] sm:h-[550px] md:h-[650px] rounded-[28px] sm:rounded-[36px] md:rounded-[40px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.15)]">

              <Image
                src="/images/homepage/skills_1.png"
                alt="Skill Authentication"
                fill
                priority
                className="object-cover"
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

            </div>

            {/* FLOATING STATS CARD — safe from screen edges on all sizes */}
            <div className="absolute bottom-2 right-2 md:bottom-6 md:left-6 bg-white/90 backdrop-blur-xl border border-white rounded-3xl px-5 py-4 shadow-2xl w-[calc(100%-160px)] max-w-[240px] sm:w-auto">

              <div className="text-headingXl font-black text-[#00418d]">
                98%
              </div>

              <p className="mt-2 text-body text-gray-600 leading-relaxed">
                Candidate verification accuracy powered by AI systems.
              </p>

            </div>

            {/* SMALL FLOATING IMAGE — stays in-bounds on all viewports */}
            <div className="absolute top-2 right-0 sm:top-6 sm:right-0 md:top-6 md:-right-6 w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-[24px] sm:rounded-[28px] overflow-hidden border-[4px] sm:border-[6px] border-white shadow-2xl">

              <Image
                src="/images/homepage/skills_3.png"
                alt="Professional"
                fill
                className="object-cover"
              />

            </div>

            {/* EXPERIENCE BADGE — in-bounds on mobile; negative offset only on md+ */}
            <div className="absolute -top-2 -left-2 md:top-1/2 md:-left-10 bg-[#00418d] text-white rounded-2xl md:rounded-3xl px-5 py-4 md:px-6 md:py-5 shadow-2xl">

              <div className="text-headingLg font-black">
                10K+
              </div>

              <p className="text-body mt-1 text-white/80">
                Verified Assessments
              </p>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}