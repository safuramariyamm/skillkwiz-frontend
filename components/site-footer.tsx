"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#003b8e] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Us Column */}
          <div>
            <h3 className="text-headingSm font-semibold mb-4">About Us</h3>
            <p className="text-body mb-4">
              SkillKwiz is at the forefront of transforming recruitment with
              innovative assessment solutions and best-in-class support.
            </p>
            <div className="text-body">
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
              <span className="mx-2">|</span>
              <Link href="/contact?sales=true" className="hover:underline">
                Sales
              </Link>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-headingSm font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-body">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:underline">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:underline">
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div>
            <h3 className="text-headingSm font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-body">
              <p>
                <span className="block">Address: 5th Block,</span>
                <span className="block">Jayanagar, Bangalore 560041</span>
              </p>
              <p>
                Email:{" "}
                <a href="mailto:info@skillkwiz.com" className="hover:underline">
                  info@skillkwiz.com
                </a>
              </p>
              <p>
                Phone:{" "}
                <a href="tel:+919740377330" className="hover:underline">
                  +91-9740377330
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-blue-700">
        <div className="max-w-7xl mx-auto px-6 py-4 text-body text-center">
          Copyright © 2025
        </div>
      </div>
    </footer>
  );
}
