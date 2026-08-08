"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Infinity as InfinityIcon, Menu, X } from "lucide-react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/", active: true },
    { label: "Wellness", href: "/search", dropdown: true },
    { label: "Routine", href: "/blog" },
    { label: "Our Team", href: "/about" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 py-5 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        {/* Left: Brand Logo with Infinity Icon */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-white font-medium text-lg hover:opacity-90 transition-opacity drop-shadow-md"
        >
          <InfinityIcon size={24} strokeWidth={1.5} className="text-white" />
          <span className="tracking-tight text-lg">Equilibrium</span>
        </Link>

        {/* Center: Desktop Nav Pill */}
        <nav className="hidden md:flex liquid-glass items-center gap-1 rounded-xl px-2 py-1.5 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-sm font-normal transition-all ${
                link.active
                  ? "bg-white/15 text-white shadow-xs"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{link.label}</span>
              {link.dropdown && <ChevronDown size={13} className="opacity-70 mt-px" />}
            </Link>
          ))}
        </nav>

        {/* Right: Desktop Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/account"
            className="liquid-glass text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-white/10 transition-colors shadow-sm"
          >
            Log in
          </Link>
          <Link
            href="/checkout"
            className="bg-white text-black text-sm font-medium px-5 py-2 rounded-full hover:bg-white/90 transition-colors shadow-md"
          >
            Begin Now
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden liquid-glass text-white p-2.5 rounded-xl focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="fixed top-[76px] left-4 right-4 z-50 md:hidden liquid-glass rounded-2xl p-5 flex flex-col gap-2 shadow-2xl bg-black/85 backdrop-blur-2xl border border-white/10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span>{link.label}</span>
              {link.dropdown && <ChevronDown size={14} />}
            </Link>
          ))}

          {/* Bottom Mobile Action Buttons */}
          <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center liquid-glass text-white text-sm font-medium py-2.5 rounded-full hover:bg-white/10 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/checkout"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center bg-white text-black text-sm font-medium py-2.5 rounded-full hover:bg-white/90 transition-colors"
            >
              Begin Now
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
