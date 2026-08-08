"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 transition-all duration-300 ${
          scrolled ? "bg-[#0a0608]/90 backdrop-blur-xl border-b border-white/10 py-4 shadow-2xl" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo - Dancing Script */}
          <Link
            href="/"
            className="font-dancing text-white text-2xl md:text-3xl font-bold tracking-wide hover:opacity-90 transition-opacity"
          >
            Serene
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-12 text-white/80 text-sm tracking-wide font-inter">
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/search" className="hover:text-white transition-colors">
              Services
            </Link>
            <Link href="/blog" className="hover:text-white transition-colors">
              Journal
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Desktop CTA */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/checkout"
              className="bg-white text-black px-7 py-3 rounded-full font-medium text-sm tracking-wide hover:bg-white/90 transition-all duration-300 button-glow"
            >
              Book a consultation
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-50 relative focus:outline-none"
            aria-label="Toggle Menu"
          >
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                mobileMenuOpen ? "rotate-45 translate-y-[8px]" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                mobileMenuOpen ? "opacity-0 scale-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                mobileMenuOpen ? "-rotate-45 -translate-y-[8px]" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Slide-in Menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-[85%] max-w-[340px] bg-[#0a0608]/95 backdrop-blur-xl border-l border-white/10 p-8 flex flex-col justify-between transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pt-16 space-y-6">
            <div className="font-dancing text-white text-3xl font-bold mb-8">Serene</div>
            <nav className="flex flex-col gap-6 text-lg tracking-wide font-inter">
              {[
                { name: "About", href: "/about", delay: "150ms" },
                { name: "Services", href: "/search", delay: "225ms" },
                { name: "Journal", href: "/blog", delay: "300ms" },
                { name: "Contact", href: "/contact", delay: "375ms" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ transitionDelay: item.delay }}
                  className={`text-white/80 hover:text-white transition-all transform ${
                    mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div
            style={{ transitionDelay: "450ms" }}
            className={`transition-all duration-300 transform ${
              mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Link
              href="/checkout"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center bg-white text-black py-4 rounded-full font-medium text-sm tracking-wide hover:bg-white/90 transition-all button-glow"
            >
              Book a consultation
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
