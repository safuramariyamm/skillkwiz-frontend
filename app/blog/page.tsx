"use client";
import Image from "next/image";
import { useState } from "react";

const allBlogPosts = [
  { id: 1, img: "/images/blogpage/1.png", title: "The Importance of Upskilling in Today's Job Market", excerpt: "In an era of rapid technological advancement, upskilling has become essential for career longevity and professional growth.", category: "Career Development", readTime: "5 min", date: "Mar 15, 2025", slug: "importance-of-upskilling-2025" },
  { id: 2, img: "/images/blogpage/2.png", title: "How Gamified Learning Enhances Skill Retention", excerpt: "Discover how game-based learning techniques can significantly improve knowledge retention and skill acquisition.", category: "Learning Science", readTime: "7 min", date: "Mar 12, 2025", slug: "gamified-learning-retention" },
  { id: 3, img: "/images/blogpage/3.png", title: "Soft Skills vs. Hard Skills: Finding the Perfect Balance", excerpt: "While technical expertise opens doors, soft skills determine how far you can go in your career journey.", category: "Skill Development", readTime: "6 min", date: "Mar 10, 2025", slug: "soft-skills-vs-hard-skills" },
  { id: 4, img: "/images/blogpage/4.png", title: "Top 10 Tech Skills That Can Land You a High-Paying Job", excerpt: "From AI and machine learning to cloud computing, discover the most in-demand technical skills for 2025.", category: "Technology", readTime: "8 min", date: "Mar 8, 2025", slug: "top-tech-skills-2025" },
  { id: 5, img: "/images/blogpage/5.png", title: "How to Stay Motivated While Learning New Skills", excerpt: "Building sustainable learning habits requires more than just discipline — it needs the right motivation strategies.", category: "Learning Science", readTime: "6 min", date: "Mar 5, 2025", slug: "staying-motivated-learning" },
  { id: 6, img: "/images/blogpage/6.png", title: "The Future of Online Learning: What's Next in 2025", excerpt: "Virtual reality classrooms, AI-powered tutors, and personalized learning paths are reshaping education.", category: "Technology", readTime: "4 min", date: "Mar 3, 2025", slug: "future-online-learning-2025" },
  { id: 7, img: "/images/blogpage/7.png", title: "Essential Skills to Boost Your Career in 2025", excerpt: "Adaptability, digital literacy, and emotional intelligence will be your competitive advantage this year.", category: "Career Development", readTime: "5 min", date: "Mar 1, 2025", slug: "essential-career-skills-2025" },
  { id: 8, img: "/images/blogpage/8.png", title: "How Gamification Enhances Learning & Engagement", excerpt: "Game mechanics in education create immersive experiences that boost retention by up to 40%.", category: "Learning Science", readTime: "6 min", date: "Feb 28, 2025", slug: "gamification-learning-engagement" },
  { id: 9, img: "/images/blogpage/1.png", title: "The Power of Microlearning in Professional Development", excerpt: "Short, focused learning sessions deliver better results than traditional long-form training.", category: "Skill Development", readTime: "5 min", date: "Feb 25, 2025", slug: "microlearning-power" },
];

const CATEGORIES = ["All", "Career Development", "Learning Science", "Technology", "Skill Development"];

const CATEGORY_COLORS: Record<string, string> = {
  "Career Development": "bg-[#00418d]/10 text-[#00418d]",
  "Learning Science":   "bg-[#f73e5d]/10 text-[#f73e5d]",
  "Technology":         "bg-[#f6c648]/20 text-[#8a6800]",
  "Skill Development":  "bg-emerald-100 text-emerald-700",
};

export default function BlogPage() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? allBlogPosts : allBlogPosts.filter(p => p.category === active);
  const [featured, ...rest] = filtered;

  return (
    <div className="bg-[#f0f7ff]">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#0a1628] text-white overflow-hidden pt-16">
        <video className="absolute inset-0 w-full h-full object-cover opacity-25 z-0" autoPlay muted loop playsInline preload="none" aria-hidden="true">
          <source src="/images/homepage/banner_video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/95 via-[#0a1628]/70 to-[#0a1628]/40 z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none" style={{ height: 60 }}>
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="#f0f7ff" />
          </svg>
        </div>

        <div className="sk-container relative z-[3] py-14 md:py-20">
          <span className="sk-label text-[#f6c648]/70 bg-[#f6c648]/10 border border-[#f6c648]/20 px-5 py-2 rounded-full inline-block mb-5">
            SkillKwiz Blog
          </span>
          <h1 className="sk-h1 text-white mb-4">
            Insights & <span className="text-[#f6c648]">Ideas</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl leading-relaxed">
            Strategies, trends, and thinking to help you grow professionally and stay ahead.
          </p>
        </div>
      </section>

      {/* ── Filter + Grid ─────────────────────────────────────────────────────── */}
      <section className="sk-section sk-container">

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                active === cat
                  ? "bg-[#00418d] text-white shadow-md"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-[#00418d]/30 hover:text-[#00418d]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-20">No posts in this category yet.</p>
        ) : (
          <>
            {/* Featured post — full-width horizontal card */}
            {featured && (
              <a href={`/blog/${featured.slug}`} className="group block sk-card overflow-hidden mb-8 md:grid md:grid-cols-2 hover:shadow-2xl transition-all duration-300">
                <div className="relative overflow-hidden h-56 md:h-full">
                  <Image src={featured.img} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full ${CATEGORY_COLORS[featured.category] ?? "bg-gray-100 text-gray-600"}`}>
                    {featured.category}
                  </span>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-medium mb-4">
                    <span className="bg-[#f73e5d] text-white px-3 py-1 rounded-full font-bold">Featured</span>
                    <span>{featured.date}</span>
                    <span>·</span>
                    <span>{featured.readTime} read</span>
                  </div>
                  <h2 className="sk-h3 text-[#0a1628] mb-3 group-hover:text-[#00418d] transition-colors">
                    {featured.title}
                  </h2>
                  <p className="sk-body text-sm line-clamp-3 mb-6">{featured.excerpt}</p>
                  <span className="inline-flex items-center gap-1.5 text-[#00418d] font-bold text-sm group-hover:gap-3 transition-all duration-200">
                    Read Article
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </a>
            )}

            {/* Rest — uniform 3-col grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map(post => (
                  <a key={post.id} href={`/blog/${post.slug}`} className="group sk-card overflow-hidden flex flex-col">
                    <div className="relative overflow-hidden h-44">
                      <Image src={post.img} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-600"}`}>
                        {post.category}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-3">
                        <span>{post.date}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{post.readTime} read</span>
                      </div>
                      <h3 className="sk-h4 text-[#0a1628] mb-2 group-hover:text-[#00418d] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="sk-caption line-clamp-2 mb-5 flex-1">{post.excerpt}</p>
                      <span className="inline-flex items-center gap-1 text-[#00418d] font-bold text-sm group-hover:gap-2 transition-all duration-200 mt-auto">
                        Read more
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}