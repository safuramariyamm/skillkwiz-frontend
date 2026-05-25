"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ShieldCheck, ClipboardList, BadgeCheck, Zap } from "lucide-react";

const STEPS = [
  { icon: ClipboardList, num: "01", title: "Employer Posts Slot", desc: "Company sets up an assessment slot with date, center, and required skills.", accent: "#00418d", bg: "#eef5ff" },
  { icon: Zap,           num: "02", title: "Candidate Gets Invited", desc: "Credentials sent directly to the candidate's email instantly.", accent: "#f73e5d", bg: "#fff0f3" },
  { icon: ShieldCheck,   num: "03", title: "Skill Verified Securely", desc: "Biometric-verified assessment at a certified center — tamper-proof.", accent: "#b8860b", bg: "#fffbea" },
  { icon: BadgeCheck,    num: "04", title: "Report Delivered Instantly", desc: "Authenticated skill certificate issued the moment the test is done.", accent: "#00418d", bg: "#eef5ff" },
];

const STATS = [
  { num: "10K+", label: "Assessments" },
  { num: "500+", label: "Companies" },
  { num: "98%",  label: "Accuracy" },
  { num: "24h",  label: "Turnaround" },
];

const LEFT_IMAGES = [
  { src: "/images/homepage/skills_1.png", animClass: "float-a", rotate: "-6deg", top: 0,   left: 20, size: { w: 200, h: 300 } },
  { src: "/images/homepage/skills_3.png", animClass: "float-b", rotate: "4deg",  top: 110, left: 60, size: { w: 200, h: 300 } },
];
const RIGHT_IMAGES = [
  { src: "/images/homepage/skills_2.png", animClass: "float-c", rotate: "7deg",  top: 20,  right: 20, size: { w: 200, h: 300 } },
  { src: "/images/homepage/skills_4.png", animClass: "float-d", rotate: "-5deg", top: 130, right: 55, size: { w: 200, h: 300 } },
];

export default function AuthenticateSkillsSection() {
  const ref = useRef<HTMLElement>(null);
  // Use a ref to track observed state — avoids triggering re-renders on scroll
  const visibleRef = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !visibleRef.current) {
          visibleRef.current = true;
          setVisible(true);
          obs.disconnect(); // once visible, stop observing — no more re-renders
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []); // stable empty deps — effect runs once only

  return (
    <section ref={ref} className="auth-skills-section">
      <div className="auth-skills-container">

        {/* ── Main layout: images | centre | steps ── */}
        <div className={`auth-skills-grid ${visible ? "is-visible" : ""}`}>

          {/* ── LEFT floating image cards ── */}
          <div className="img-col img-col-left">
            {LEFT_IMAGES.map((img, i) => (
              <div
                key={i}
                className={`img-card ${img.animClass}`}
                style={{
                  top: img.top,
                  left: img.left,
                  width: img.size.w,
                  height: img.size.h,
                  transform: `rotate(${img.rotate})`,
                }}
              >
                <Image src={img.src} alt="" fill style={{ objectFit: "cover", objectPosition: "top center" }} />
              </div>
            ))}
          </div>

          {/* ── CENTRE: headline + stats + CTAs ── */}
          <div className="centre-col">
            <div className="eyebrow-row">
              <span className="eyebrow-line" />
              <span className="eyebrow-text">Smart Hiring Solution</span>
              <span className="eyebrow-line" />
            </div>

            <h2 className="section-heading">
              Authenticate Skills,<br />
              <span style={{ color: "#00418d" }}>Simplify Hiring</span>
            </h2>

            <p className="section-body">
              SkillKwiz ensures professionals are evaluated accurately in their chosen fields. Our secure testing centers provide authenticated skill assessments — eliminating the need for lengthy technical interviews.
            </p>

            {/* Stat pills */}
            <div className="stats-row">
              {STATS.map((s) => (
                <div key={s.label} className="stat-pill">
                  <span className="stat-num">{s.num}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="cta-row">
              <a href="/services" className="cta-primary">
                Explore Services
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a href="/about" className="cta-secondary">Learn More</a>
            </div>
          </div>

          {/* ── RIGHT floating image cards ── */}
          <div className="img-col img-col-right">
            {RIGHT_IMAGES.map((img, i) => (
              <div
                key={i}
                className={`img-card ${img.animClass}`}
                style={{
                  top: img.top,
                  right: img.right,
                  width: img.size.w,
                  height: img.size.h,
                  transform: `rotate(${img.rotate})`,
                }}
              >
                <Image src={img.src} alt="" fill style={{ objectFit: "cover", objectPosition: "top center" }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── How it works — step cards ── */}
        <div className={`steps-wrapper ${visible ? "is-visible" : ""}`}>
          <div className="steps-eyebrow">
            <span className="steps-line" />
            <p className="steps-label">How It Works</p>
            <span className="steps-line" />
          </div>

          <div className="steps-grid">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="step-card">
                  {i < STEPS.length - 1 && <span className="step-connector" />}
                  <div className="step-icon" style={{ background: step.bg }}>
                    <Icon size={15} color={step.accent} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div className="step-num" style={{ color: step.accent }}>STEP {step.num}</div>
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ── Section shell ── */
        .auth-skills-section {
          background: #f0f7ff;
          padding: clamp(40px, 5vw, 68px) 0;
          overflow: hidden;
        }
        .auth-skills-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 40px);
        }

        /* ── Main 3-col grid ── */
        .auth-skills-grid {
          display: grid;
          grid-template-columns: 1fr 1.15fr 1fr;
          gap: clamp(16px, 2.5vw, 36px);
          align-items: center;
          min-height: 480px;
          /* enter animation — driven by CSS class toggle, NOT JS timers */
          opacity: 0;
          transition: opacity 0.7s ease;
        }
        .auth-skills-grid.is-visible { opacity: 1; }

        /* ── Image columns ── */
        .img-col { position: relative; height: 380px; }
        .img-col-left {
          transform: translateX(-30px);
          transition: transform 0.7s 0.1s ease;
        }
        .img-col-right {
          transform: translateX(30px);
          transition: transform 0.7s 0.1s ease;
        }
        .is-visible .img-col-left,
        .is-visible .img-col-right { transform: translateX(0); }

        /* ── Individual image card ── */
        .img-card {
          position: absolute;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(0,65,141,0.18);
          border: 3px solid #fff;
          /* z-cycle: cards take turns rising to the top */
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        /* ── z-cycle transmission:
             Each card gets a float + z-index cycle.
             The z-index alternates so cards "pass through" each other in sequence.
             Uses only CSS animations — zero JS state, zero re-renders. ── */
        .float-a {
          animation-name: floatA, zCycleA;
          animation-duration: 3.8s, 7.6s;
        }
        .float-b {
          animation-name: floatB, zCycleB;
          animation-duration: 5.1s, 10.2s;
        }
        .float-c {
          animation-name: floatC, zCycleC;
          animation-duration: 4.4s, 8.8s;
        }
        .float-d {
          animation-name: floatD, zCycleD;
          animation-duration: 3.2s, 6.4s;
        }

        @keyframes floatA {
          0%, 100% { transform: rotate(-6deg) translateY(0px); }
          50%       { transform: rotate(-6deg) translateY(-14px); }
        }
        @keyframes floatB {
          0%, 100% { transform: rotate(4deg) translateY(0px); }
          50%       { transform: rotate(4deg) translateY(-10px); }
        }
        @keyframes floatC {
          0%, 100% { transform: rotate(7deg) translateY(0px); }
          50%       { transform: rotate(7deg) translateY(-12px); }
        }
        @keyframes floatD {
          0%, 100% { transform: rotate(-5deg) translateY(0px); }
          50%       { transform: rotate(-5deg) translateY(-16px); }
        }

        /* z-cycle: 1 → 2 → 1 → 2 alternating, each card offset in phase */
        @keyframes zCycleA { 0%,49%{ z-index:2; } 50%,100%{ z-index:1; } }
        @keyframes zCycleB { 0%,49%{ z-index:1; } 50%,100%{ z-index:2; } }
        @keyframes zCycleC { 0%,49%{ z-index:2; } 50%,100%{ z-index:1; } }
        @keyframes zCycleD { 0%,49%{ z-index:1; } 50%,100%{ z-index:2; } }

        /* ── Centre column ── */
        .centre-col {
          text-align: center;
          transform: translateY(20px);
          transition: transform 0.7s 0.2s ease;
        }
        .is-visible .centre-col { transform: translateY(0); }

        .eyebrow-row {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .eyebrow-line { width: 20px; height: 2px; background: #00418d; border-radius: 2px; opacity: 0.4; }
        .eyebrow-text {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #00418d; opacity: 0.65;
        }
        .section-heading {
          font-family: Georgia, serif;
          font-size: clamp(22px, 2.5vw, 34px);
          font-weight: 900; line-height: 1.2;
          color: #0a1628; margin-bottom: 14px;
          letter-spacing: -0.02em;
        }
        .section-body {
          color: #6b7a8d; font-size: 13px; line-height: 1.75;
          margin: 0 auto 22px; max-width: 340px;
        }

        .stats-row {
          display: flex; justify-content: center;
          gap: 8px; flex-wrap: wrap; margin-bottom: 24px;
        }
        .stat-pill {
          background: #fff; border-radius: 24px; padding: 7px 14px;
          border: 1px solid #daeeff; box-shadow: 0 1px 4px rgba(0,65,141,0.07);
          display: flex; align-items: center; gap: 6px;
        }
        .stat-num  { font-family: Georgia, serif; font-size: 14px; font-weight: 900; color: #00418d; line-height: 1; }
        .stat-label{ font-size: 10px; color: #8899aa; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

        .cta-row {
          display: flex; justify-content: center;
          gap: 10px; flex-wrap: wrap;
        }
        .cta-primary {
          display: inline-flex; align-items: center; gap: 6px;
          background: #00418d; color: #fff; font-size: 12px; font-weight: 700;
          padding: 10px 22px; border-radius: 8px; text-decoration: none;
          box-shadow: 0 2px 12px rgba(0,65,141,0.22); transition: background 0.2s;
        }
        .cta-primary:hover { background: #003070; }
        .cta-secondary {
          display: inline-flex; align-items: center;
          font-size: 12px; font-weight: 600;
          padding: 10px 18px; border-radius: 8px; text-decoration: none;
          color: #00418d; border: 1px solid rgba(0,65,141,0.25); transition: background 0.2s;
        }
        .cta-secondary:hover { background: rgba(0,65,141,0.06); }

        /* ── Steps section ── */
        .steps-wrapper {
          margin-top: 40px;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.7s 0.4s ease, transform 0.7s 0.4s ease;
        }
        .steps-wrapper.is-visible { opacity: 1; transform: translateY(0); }

        .steps-eyebrow {
          display: flex; align-items: center; gap: 10px;
          justify-content: center; margin-bottom: 18px;
        }
        .steps-line { width: 28px; height: 1px; background: rgba(0,65,141,0.25); display: block; }
        .steps-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.15em;
          text-transform: uppercase; color: rgba(0,65,141,0.55); margin: 0;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .step-card {
          background: #fff; border-radius: 12px; padding: 14px;
          border: 1px solid #daeeff;
          box-shadow: 0 2px 8px rgba(0,65,141,0.05);
          display: flex; gap: 12px; align-items: flex-start;
          position: relative;
          transition: box-shadow 0.2s;
        }
        .step-card:hover { box-shadow: 0 4px 18px rgba(0,65,141,0.12); }
        .step-connector {
          position: absolute; right: -7px; top: 50%; transform: translateY(-50%);
          width: 14px; height: 1.5px; background: #c8dff5; display: block; z-index: 1;
        }
        .step-icon {
          width: 32px; height: 32px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .step-num  { font-size: 9px; font-weight: 700; opacity: 0.6; letter-spacing: 0.08em; margin-bottom: 2px; }
        .step-title{ font-size: 12px; font-weight: 700; color: #0a1628; margin: 0 0 4px; line-height: 1.3; }
        .step-desc { font-size: 11px; color: #8899aa; margin: 0; line-height: 1.55; }

        /* ── RESPONSIVE: tablet ── */
        @media (max-width: 900px) {
          .auth-skills-grid {
            grid-template-columns: 1fr;
            min-height: unset;
            gap: 24px;
          }
          .img-col { display: none; }
          .steps-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* ── RESPONSIVE: mobile ── */
        @media (max-width: 600px) {
          .auth-skills-section { padding: 32px 0; }
          .section-heading { font-size: clamp(20px, 5vw, 26px); }
          .stats-row { gap: 6px; }
          .stat-pill { padding: 6px 10px; }
          .steps-grid { grid-template-columns: 1fr; gap: 10px; }
          .step-connector { display: none; }
          .cta-row { gap: 8px; }
          .cta-primary, .cta-secondary { font-size: 13px; padding: 11px 20px; }
        }
      `}</style>
    </section>
  );
}
