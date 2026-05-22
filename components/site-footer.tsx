"use client";

import Link from "next/link";
import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="bg-[#000c2a] text-white">

      {/* Main footer content */}
      <div className="sk-container py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="md:col-span-1">
            <Image
              src="/images/skilllogo.png"
              alt="SkillKwiz"
              width={140}
              height={36}
              className="object-contain mb-4"
              style={{ height: "36px", width: "auto" }}
            />
            <p className="text-white/55 text-sm leading-relaxed mb-5">
SkillKwiz is at the forefront of transforming recruitment with innovative assessment solutions and best-in-class support.            </p>
           
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="sk-label text-white/40 mb-5">Navigation</h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/services", label: "Services" },
                { href: "/blog", label: "Blog" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="sk-label text-white/40 mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About SkillKwiz" },
                { href: "/contact", label: "Contact Us" },
                { href: "/contact?sales=true", label: "Talk to Sales" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="sk-label text-white/40 mb-5">Get in Touch</h4>
            <div className="space-y-3 text-sm text-white/60">
              <p className="leading-relaxed">5th Block, Jayanagar<br />Bangalore 560041, India</p>
              <a href="mailto:info@skillkwiz.com" className="flex items-center gap-2 hover:text-white transition-colors duration-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f6c648]" />
                info@skillkwiz.com
              </a>
              <a href="tel:+919740377330" className="flex items-center gap-2 hover:text-white transition-colors duration-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f73e5d]" />
                +91-9740377330
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="sk-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/40">© 2025 SkillKwiz. All rights reserved.</p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service"].map((l) => (
              <a key={l} href="#" className="text-xs text-white/35 hover:text-white/70 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}