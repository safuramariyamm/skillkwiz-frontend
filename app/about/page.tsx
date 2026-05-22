"use client";

import Image from "next/image";
import Link from "next/link";

const visionCards = [
  {
    gif: "/images/aboutpage/eye.gif",
    emoji: "👁️",
    title: "Our Vision",
    text: "A future where skill assessments empower companies to grow confidently by hiring and developing talent based on data, not guesswork.",
  },
  {
    gif: "/images/aboutpage/mission.gif",
    emoji: "🎯",
    title: "Our Mission",
    text: "To provide the most accurate, secure, and scalable skill assessment platform that transforms how organizations evaluate and develop talent.",
  },

  {
    gif: "/images/aboutpage/purpose.gif",
    emoji: "💡",
    title: "Our Purpose",
    text: "Creating stakeholder value through cutting-edge assessment technology that is reliable, fair, and trusted by thousands of companies worldwide.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#f0f7ff] pt-16">

      {/* ── Hero ── */}
      <section className="relative w-full bg-[#0a1628] text-white overflow-hidden pt-16">
        {/* Deferred background video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-40"
          autoPlay muted loop playsInline preload="none"
          aria-hidden="true"
        >
          <source src="/images/homepage/banner_video.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/70 to-[#0a1628]/40 z-[1]" />
        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none" style={{ height: 60 }}>
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="#f0f7ff" />
          </svg>
        </div>

        <div className="sk-container relative z-[3] py-14 md:py-20">
          <div className="max-w-3xl">
            <span className="sk-label text-[#f6c648]/70 bg-[#f6c648]/10 border border-[#f6c648]/20 px-5 py-2 rounded-full inline-block mb-6">
              About SkillKwiz
            </span>
            <h1 className="sk-h1 text-white mb-5">
              Elevate Your{" "}
              <span className="text-[#f6c648]">Business</span>
            </h1>
            <p className="text-white/65 text-lg leading-relaxed mb-8 max-w-xl">
              Skill Assessments done with the utmost Knowledge, Integrity, Trust, Respect and Security. We provide accurate insights into the skill levels of your workforce.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/services" className="btn-cta btn-lg">
                Get Started Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <div>
                <p className="text-white/50 text-sm">Join 500+ companies</p>
                <p className="text-white/35 text-xs">Free 14-day trial · No credit card required</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vision / Mission / Purpose cards ── */}
      <section className="bg-[#f0f7ff] sk-section-sm">
        <div className="sk-container">
          <div className="text-center mb-12">
            <h2 className="sk-h2 text-gray-900">
              What Drives <span className="text-[#00418d]">Us</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {visionCards.map((c) => (
              <div
                key={c.title}
                className="group sk-card p-8 flex flex-col items-center text-center rounded-3xl hover:bg-[#00418d] hover:border-transparent transition-colors duration-400"
              >
                <div className="w-20 h-20 overflow-hidden mb-5 flex items-center justify-center">
                  <Image
                    src={c.gif}
                    alt=""
                    width={80}
                    height={80}
                    className="object-contain"
                    loading="lazy"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                      const p = (e.currentTarget as HTMLImageElement).parentElement;
                      if (p) p.innerHTML = `<span style="font-size:36px">${c.emoji}</span>`;
                    }}
                  />
                </div>
                <h3 className="sk-h4 text-[#00418d] group-hover:text-white mb-3 transition-colors duration-300">{c.title}</h3>
                <p className="sk-caption group-hover:text-white/75 transition-colors duration-300 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section className="bg-white sk-section">
        <div className="sk-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Text */}
            <div>
              <span className="sk-label text-[#f73e5d] mb-3 inline-block">About SkillKwiz</span>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-10 bg-[#f6c648] rounded-full shrink-0" />
                <h2 className="sk-h2 text-[#00418d]">Who We Are</h2>
              </div>
              <div className="space-y-5">
                <p className="sk-body text-gray-700">
                  We are your trusted partner in skill assessment. Our expertise lies in assessing skill levels in people and quantifying them through innovative, secure, and reliable evaluation methods.
                </p>
                <blockquote className="bg-[#f0f7ff] border-l-4 border-[#f6c648] rounded-xl p-5 md:p-6 relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#00418d] rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="sk-body text-gray-700 italic leading-relaxed mt-1">
                    "SkillKwiz has a single purpose — to create stakeholder value through cutting-edge assessment technology that transforms how organizations evaluate and develop talent."
                  </p>
                  <cite className="block mt-3 text-sm font-bold text-[#00418d] not-italic">
                    — Venugopal B A, CEO & Founder
                  </cite>
                </blockquote>
              </div>
            </div>

            {/* Image grid */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[0, 1, 2].map((i) => (
                <Image
                  key={i}
                  src={`/images/aboutpage/about_who_we_are-${i}.png`}
                  alt="SkillKwiz team"
                  width={180}
                  height={240}
                  loading="lazy"
                  className="rounded-2xl w-full h-auto object-cover shadow-md hover:scale-105 transition-transform duration-300"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CEO / Founder ── */}
      <section className="bg-[#f8fbff] sk-section">
        <div className="sk-container max-w-5xl">

          <div className="text-center mb-12">
            <span className="sk-label text-[#f73e5d] mb-3 inline-block">Leadership</span>
            <h2 className="sk-h2 text-gray-900">Our <span className="text-[#00418d]">Founder</span></h2>
          </div>

          <div className="sk-card rounded-3xl overflow-hidden shadow-2xl shadow-[#00418d]/8">
            <div className="grid lg:grid-cols-2">

              {/* Photo */}
              <div className="bg-[#000c2a] p-8 md:p-12 flex items-center justify-center">
                <div className="relative">
                  <div className="bg-white rounded-2xl p-2.5 shadow-2xl">
                    <Image
                      src="/images/aboutpage/Venugopal.png"
                      alt="Venugopal B A — CEO"
                      width={280}
                      height={280}
                      className="w-52 h-52 md:w-64 md:h-64 rounded-xl object-cover"
                    />
                  </div>
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-[#f6c648] rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-[#00418d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <span className="inline-block bg-[#00418d] text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4 w-fit">
                  CEO & Founder
                </span>
                <h3 className="sk-h3 text-[#00418d] mb-5">Venugopal B A</h3>
                <div className="space-y-4">
                  <p className="sk-body text-gray-700">
                    A veteran leader in the IT industry with 24 years of experience in senior leadership roles, Venugopal has chosen to lead SkillKwiz with a deep understanding of key challenges faced by the services sector.
                  </p>
                  <p className="sk-body text-gray-700">
                    With a rich background in technology, he aims to establish SkillKwiz as an AI-first company, shaping it entirely according to market needs and technological innovation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Video ── */}
      <section className="bg-white sk-section-sm">
        <div className="sk-container max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="sk-h2 text-gray-900">
              See SkillKwiz{" "}
              <span className="text-[#00418d]">in Action</span>
            </h2>
            <p className="sk-body mt-4 max-w-xl mx-auto">
              Watch how our platform revolutionizes skill assessment and talent evaluation.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-[#00418d]/12">
            <video
              className="w-full h-auto"
              controls
              preload="metadata"
              poster="/images/aboutpage/about_video.png"
            >
              <source src="/images/aboutpage/about_video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

    </div>
  );
}