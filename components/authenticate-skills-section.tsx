"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ShieldCheck, ClipboardList, BadgeCheck, Zap } from "lucide-react";
import styles from "./authenticate-skills-section.module.css";

const STEPS = [
  { icon: ClipboardList, num: "01", title: "Employer Posts Slot",       desc: "Company sets up an assessment slot with date, center, and required skills.", accent: "#00418d", bg: "#eef5ff" },
  { icon: Zap,           num: "02", title: "Candidate Gets Invited",     desc: "Credentials sent directly to the candidate's email instantly.",             accent: "#f73e5d", bg: "#fff0f3" },
  { icon: ShieldCheck,   num: "03", title: "Skill Verified Securely",    desc: "Biometric-verified assessment at a certified center — tamper-proof.",       accent: "#b8860b", bg: "#fffbea" },
  { icon: BadgeCheck,    num: "04", title: "Report Delivered Instantly", desc: "Authenticated skill certificate issued the moment the test is done.",       accent: "#00418d", bg: "#eef5ff" },
];

const STATS = [
  { num: "10K+", label: "Assessments" },
  { num: "500+", label: "Companies" },
  { num: "98%",  label: "Accuracy" },
  { num: "24h",  label: "Turnaround" },
];

// Desktop images - INCREASED TO 200px x 300px
const LEFT_IMAGES = [
  { src: "/images/homepage/skills_1.png", rotate: "-7deg", left: 0, top: 0,   w: 200, h: 300, isA: true },
  { src: "/images/homepage/skills_3.png", rotate:  "3deg", left: 55, top: 110, w: 200, h: 300, isA: false },
];

const RIGHT_IMAGES = [
  { src: "/images/homepage/skills_2.png", rotate:  "7deg", right: 0, top: 10,  w: 200, h: 300, isA: true },
  { src: "/images/homepage/skills_4.png", rotate: "-4deg", right: 52, top: 120, w: 200, h: 300, isA: false },
];

// Mobile images - slightly smaller for phones
const MOBILE_IMAGES = [
  { src: "/images/homepage/skills_1.png", w: 150, h: 220 },
  { src: "/images/homepage/skills_2.png", w: 150, h: 220 },
];

export default function AuthenticateSkillsSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ background: "#f0f7ff", padding: "clamp(40px,5vw,68px) 0", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,40px)" }}>

        {/* Responsive 3-col layout */}
        <div className={styles.threeColumnLayout}>

          {/* LEFT CARDS - Desktop only */}
          <div className={`${styles.leftCardWrapper} ${styles.cardContainer} ${styles.fadeInLeft} ${visible ? styles.visible : ""}`}>
            {LEFT_IMAGES.map((img, i) => (
              <div
                key={i}
                className={`${styles.card} ${img.isA ? styles.cardA_left : styles.cardB_left}`}
                style={{
                  left: img.left,
                  top: img.top,
                  width: img.w,
                  height: img.h,
                }}
              >
                <Image 
                  src={img.src} 
                  alt="" 
                  fill 
                  sizes="(max-width: 768px) 0vw, 25vw"
                  style={{ objectFit: "cover", objectPosition: "top center" }} 
                />
              </div>
            ))}
          </div>

          {/* CENTRE TEXT */}
          <div className={`${styles.fadeInUp} ${visible ? styles.visible : ""}`} style={{ textAlign: "center", maxWidth: "500px", margin: "0 auto", width: "100%" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ width: 20, height: 2, background: "#00418d", borderRadius: 2, opacity: 0.4 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#00418d", opacity: 0.65 }}>Smart Hiring Solution</span>
              <span style={{ width: 20, height: 2, background: "#00418d", borderRadius: 2, opacity: 0.4 }} />
            </div>

            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px, 5vw, 34px)", fontWeight: 900, lineHeight: 1.2, color: "#0a1628", marginBottom: 14, letterSpacing: "-0.02em" }}>
              Authenticate Skills,<br />
              <span style={{ color: "#00418d" }}>Simplify Hiring</span>
            </h2>

            <p style={{ color: "#6b7a8d", fontSize: "clamp(13px, 3vw, 14px)", lineHeight: 1.6, maxWidth: "100%", margin: "0 auto 22px", padding: "0 16px" }}>
              SkillKwiz ensures professionals are evaluated accurately in their chosen fields. Our secure testing centers provide authenticated skill assessments — eliminating the need for lengthy technical interviews.
            </p>

            {/* Stat pills */}
            <div className={styles.statsContainer}>
              {STATS.map((s) => (
                <div key={s.label} className={styles.statPill}>
                  <span className={styles.statNumber}>{s.num}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "clamp(8px, 3vw, 10px)", flexWrap: "wrap" }}>
              <a href="/services" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#00418d", color: "#fff", fontSize: "clamp(11px, 3vw, 12px)", fontWeight: 700,
                padding: "clamp(8px, 2vw, 10px) clamp(16px, 4vw, 22px)", borderRadius: 8, textDecoration: "none",
                boxShadow: "0 2px 12px rgba(0,65,141,0.22)",
              }}>
                Explore Services
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a href="/about" style={{
                display: "inline-flex", alignItems: "center", fontSize: "clamp(11px, 3vw, 12px)", fontWeight: 600,
                padding: "clamp(8px, 2vw, 10px) clamp(14px, 3vw, 18px)", borderRadius: 8, textDecoration: "none",
                color: "#00418d", border: "1px solid rgba(0,65,141,0.25)",
              }}>
                Learn More
              </a>
            </div>
          </div>

          {/* RIGHT CARDS - Desktop only */}
          <div className={`${styles.rightCardWrapper} ${styles.cardContainer} ${styles.fadeInRight} ${visible ? styles.visible : ""}`}>
            {RIGHT_IMAGES.map((img, i) => (
              <div
                key={i}
                className={`${styles.card} ${img.isA ? styles.cardA_right : styles.cardB_right}`}
                style={{
                  right: img.right,
                  top: img.top,
                  width: img.w,
                  height: img.h,
                }}
              >
                <Image 
                  src={img.src} 
                  alt="" 
                  fill 
                  sizes="(max-width: 768px) 0vw, 25vw"
                  style={{ objectFit: "cover", objectPosition: "top center" }} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE CARDS - Shown below text on mobile */}
        <div className={`${styles.mobileCardsWrapper} ${visible ? styles.visible : ""}`}>
          <div className={styles.mobileCardsContainer}>
            {MOBILE_IMAGES.map((img, i) => (
              <div
                key={i}
                className={styles.mobileCard}
                style={{
                  width: img.w,
                  height: img.h,
                }}
              >
                <Image 
                  src={img.src} 
                  alt="" 
                  fill 
                  sizes="(max-width: 768px) 40vw, 0vw"
                  style={{ objectFit: "cover", objectPosition: "top center" }} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className={`${styles.fadeInUp} ${visible ? styles.visible : ""}`} style={{ transitionDelay: "0.2s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 16 }}>
            <span style={{ width: 28, height: 1, background: "rgba(0,65,141,0.25)", display: "block" }} />
            <p style={{ fontSize: "clamp(9px, 2.5vw, 10px)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(0,65,141,0.55)", margin: 0 }}>How It Works</p>
            <span style={{ width: 28, height: 1, background: "rgba(0,65,141,0.25)", display: "block" }} />
          </div>

          <div className={styles.stepsGrid}>
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className={styles.stepCard}>
                  {i < STEPS.length - 1 && <span className={styles.stepConnector} />}
                  <div className={styles.stepIconWrapper} style={{ background: step.bg }}>
                    <Icon size={15} color={step.accent} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div className={styles.stepNumber} style={{ color: step.accent }}>STEP {step.num}</div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDesc}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}