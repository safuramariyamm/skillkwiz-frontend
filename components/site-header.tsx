"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <div className="w-full fixed top-0 left-0 z-50">
      <nav className="flex flex-col w-full md:w-4/5 lg:w-[65%] xl:w-[60%] mx-auto bg-[#335f92] text-white rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between px-5 py-0">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center relative w-48 h-14">
            <Image
              src="/images/skilllogo.png"
              alt="SkillKwiz"
              width={240}
              height={80}
              className="h-25 w-auto absolute left-0 top--30 object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-0">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`relative group py-4 px-4 text-sm lg:text-base transition-all whitespace-nowrap font-medium ${pathname === link.href ? "text-yellow-400 font-semibold" : "text-white hover:text-yellow-300"
                  }`}>
                <span>{link.label}</span>
                <span className="absolute left-0 bottom-2 w-full h-0.5 bg-gradient-to-r from-blue-400 to-yellow-400 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn && user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/10 rounded-lg px-3 py-1.5">
                  <User className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium truncate max-w-[100px]">{user.name}</span>
                  <span className="text-xs text-yellow-300 capitalize ml-1">({user.role})</span>
                </div>
                <button onClick={logout}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm text-red-300 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/services"
                className="px-4 py-2 bg-yellow-400 text-[#050e2d] rounded-lg text-sm font-semibold hover:bg-yellow-300 transition-colors">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white focus:outline-none p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden flex flex-col items-center py-3 bg-[#335f92] rounded-b-3xl border-t border-blue-400/30">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`py-3 text-base w-full text-center font-medium ${pathname === link.href ? "text-yellow-400 font-semibold" : "text-white"
                  }`}
                onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            {isLoggedIn && user ? (
              <div className="flex items-center gap-3 pt-2 border-t border-blue-400/30 w-full justify-center">
                <span className="text-sm text-yellow-300">{user.name} ({user.role})</span>
                <button onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="text-red-300 text-sm flex items-center gap-1">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <Link href="/services" onClick={() => setIsMenuOpen(false)}
                className="mt-2 px-6 py-2 bg-yellow-400 text-[#050e2d] rounded-lg text-sm font-semibold">
                Sign In
              </Link>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}
