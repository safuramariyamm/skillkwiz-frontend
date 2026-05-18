"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
    <section ref={sectionRef} className="py-12 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left stacked images */}
          <div
            className={`relative w-full md:w-[30%] h-[360px] transition-all duration-700 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="absolute top-0 left-0 w-[80%] h-[80%] transform -rotate-6 hover:-rotate-2 transition-transform duration-300 z-10 shadow-xl rounded-xl overflow-hidden">
              <Image
                src="/images/homepage/skills_1.png"
                alt="Professional working"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-[15%] w-[80%] h-[80%] transform rotate-3 hover:rotate-0 transition-transform duration-300 shadow-xl rounded-xl overflow-hidden">
              <Image
                src="/images/homepage/skills_2.png"
                alt="Tech professional"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Center content */}
          <div
            className={`w-full md:w-[36%] text-center my-6 md:my-0 z-20 transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-block bg-[#f6c648]/20 text-[#00418d] text-xs font-bold px-4 py-1 rounded-full mb-3 uppercase tracking-wider">
              Skill Authentication
            </div>
            <h2 className="text-3xl font-bold text-[#00418d] mb-4 leading-tight">
              Authenticate Skills,
              <br />
              Simplify Hiring
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              SkillKwiz ensures professionals are evaluated accurately in their
              chosen fields. Our secure testing centers provide authenticated
              skill assessments, giving you instant access to verified
              reports—eliminating the need for lengthy technical interviews.
            </p>
            <a
              href="/services"
              className="inline-block bg-[#00418d] text-white px-7 py-3 rounded-full font-semibold hover:bg-[#042578] transition-all"
            >
              Learn More
            </a>
          </div>

          {/* Right stacked images */}
          <div
            className={`relative w-full md:w-[30%] h-[360px] transition-all duration-700 delay-300 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <div className="absolute top-0 right-0 w-[80%] h-[80%] transform rotate-6 hover:rotate-2 transition-transform duration-300 z-10 shadow-xl rounded-xl overflow-hidden">
              <Image
                src="/images/homepage/skills_3.png"
                alt="Professional at workstation"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-[15%] w-[80%] h-[80%] transform -rotate-3 hover:rotate-0 transition-transform duration-300 shadow-xl rounded-xl overflow-hidden">
              <Image
                src="/images/homepage/skills_5.png"
                alt="Business professional"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
