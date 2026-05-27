"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dashboardHref =
    user?.role === "admin"
      ? "/dashboard/admin/overview"
      : user?.role === "employer"
        ? "/dashboard/employer/overview"
        : "/dashboard/employee/booking";

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/blog", label: "Blog" },
  ];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="w-full fixed top-0 left-0 z-50">
      <nav
        className={`w-full transition-all duration-300
          ${scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md shadow-[#00418d]/10"
            : "bg-[#daeeff]"
          }`}
      >
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/images/skilllogo.png"
              alt="SkillKwiz"
              width={160}
              height={40}
              className="object-contain block"
              style={{ height: "40px", width: "auto" }}
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200
                  ${pathname === link.href
                    ? "text-[#00418d] font-semibold bg-[#00418d]/8"
                    : "text-[#0a1628] hover:text-[#00418d] hover:bg-[#00418d]/8"
                  }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#00418d] rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-[#00418d]/10 hover:bg-[#00418d]/18 rounded-full pl-2 pr-3 py-1.5 text-[#00418d] text-sm font-medium transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-full bg-[#f6c648] flex items-center justify-center text-[#00418d] font-bold text-xs shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[90px] truncate">{user.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl shadow-black/10 py-2 z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-sm text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                      <span className="inline-block mt-1.5 text-xs bg-[#00418d]/10 text-[#00418d] px-2 py-0.5 rounded-full capitalize font-medium">
                        {user.role}
                      </span>
                    </div>
                    <Link
                      href={dashboardHref}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-400" /> Dashboard
                    </Link>
                    <button
                      onClick={() => { logout(); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/services" className="btn-outline text-[#00418d] border-[#00418d] btn-sm hover:bg-[#00418d] hover:text-white">
                  Sign In
                </Link>
                <Link href="/services" className="btn-cta btn-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-[#00418d] rounded-xl hover:bg-[#00418d]/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#00418d]/15 py-3 px-4 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center py-2.5 px-4 rounded-xl text-sm font-medium mb-1 transition-colors
                  ${pathname === link.href
                    ? "bg-[#00418d]/10 text-[#00418d] font-semibold"
                    : "text-[#0a1628] hover:bg-[#00418d]/8 hover:text-[#00418d]"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[#00418d]/15 mt-2 pt-3 px-1 space-y-2">
              {isLoggedIn && user ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-[#00418d]">{user.name}</p>
                    <p className="text-xs text-[#00418d]/60 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="text-red-500 text-sm flex items-center gap-1.5 font-medium"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/services"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center py-2.5 border-2 border-[#00418d] text-[#00418d] rounded-full text-sm font-semibold hover:bg-[#00418d] hover:text-white transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/services"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center py-2.5 bg-[#f73e5d] text-white rounded-full text-sm font-semibold hover:bg-[#d62f4f] transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}