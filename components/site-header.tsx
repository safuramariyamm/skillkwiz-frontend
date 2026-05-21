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
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <header className="w-full fixed top-0 left-0 z-50">
      <nav className="w-full md:w-[85%] lg:w-[70%] mx-auto bg-[#cfe5f7] text-[#00418d] rounded-b-3xl shadow-xl">
        <div className="flex items-center justify-between px-6 h-16">

          {/* Logo — fixed visibility */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/images/skilllogo.png"
              alt="SkillKwiz"
              width={180}
              height={44}
              className="object-contain block"
              style={{ height: '44px', width: 'auto' }}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  pathname === link.href
                    ? "text-[#00418d] font-semibold"
                    : "text-[#00418d]/80 hover:text-[#00418d] hover:bg-white/30"
                }`}>
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#00418d] rounded-full" />
                )}
              </Link>
            ))}
          </div>

           {/* Auth */}
           <div className="hidden md:flex items-center gap-3">
             {isLoggedIn && user ? (
               <div className="relative" ref={dropdownRef}>
                 <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                   className="flex items-center gap-2 bg-[#00418d]/10 hover:bg-[#00418d]/20 rounded-full px-3 py-2 text-sm font-medium transition-all">
                   <div className="w-7 h-7 rounded-full bg-[#f6c648] flex items-center justify-center text-[#00418d] font-bold text-xs">
                     {user.name?.charAt(0).toUpperCase()}
                   </div>
                   <span className="max-w-[100px] truncate">{user.name}</span>
                   <ChevronDown className="w-3 h-3" />
                 </button>
                 {isDropdownOpen && (
                   <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl py-2 text-gray-800 z-50 border border-gray-100">
                     <div className="px-4 py-3 border-b border-gray-100">
                       <p className="font-semibold text-sm truncate">{user.name}</p>
                       <p className="text-xs text-gray-500 truncate">{user.email}</p>
                       <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">{user.role}</span>
                     </div>
                     <Link href="/services" onClick={() => setIsDropdownOpen(false)}
                       className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">
                       <User className="w-4 h-4 text-gray-400" /> Dashboard
                     </Link>
                     <button onClick={() => { logout(); setIsDropdownOpen(false); }}
                       className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 transition-colors">
                       <LogOut className="w-4 h-4" /> Sign Out
                     </button>
                   </div>
                 )}
               </div>
             ) : (
               <>
                 <Link href="/services"
                   className="px-5 py-2 bg-[#f73e5d] hover:bg-[#d62f4f] text-white rounded-full text-sm font-semibold transition-all shadow-md mr-2">
                   Sign In
                 </Link>
                 <Link href="/services"
                   className="px-5 py-2 bg-[#f6c648] hover:bg-[#e5b23d] text-[#00418d] rounded-full text-sm font-semibold transition-all shadow-md">
                   Sign Up
                 </Link>
               </>
             )}
           </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-[#00418d]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

         {/* Mobile menu */}
         {isMenuOpen && (
           <div className="md:hidden border-t border-[#00418d]/20 py-3 px-4">
             {navLinks.map((link) => (
               <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}
                 className={`block py-3 px-4 rounded-lg text-sm font-medium mb-1 ${
                   pathname === link.href ? "bg-[#00418d]/10 text-[#00418d]" : "text-[#00418d]/80 hover:bg-white/30"
                 }`}>
                 {link.label}
               </Link>
             ))}
             <div className="border-t border-[#00418d]/20 mt-2 pt-3">
               {isLoggedIn && user ? (
                 <div className="flex items-center justify-between px-2">
                   <span className="text-sm text-[#00418d]/80">{user.name} <span className="text-[#f6c648] capitalize">({user.role})</span></span>
                   <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-red-500 text-sm flex items-center gap-1">
                     <LogOut className="w-4 h-4" /> Logout
                   </button>
                 </div>
               ) : (
                 <>
                   <Link href="/services" onClick={() => setIsMenuOpen(false)}
                     className="block w-full text-center py-2.5 mb-2 bg-[#f73e5d] text-white rounded-full text-sm font-semibold">
                       Sign In
                   </Link>
                   <Link href="/services" onClick={() => setIsMenuOpen(false)}
                     className="block w-full text-center py-2.5 bg-[#f6c648] text-[#00418d] rounded-full text-sm font-semibold">
                       Sign Up
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