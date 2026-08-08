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
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 sm:px-8 py-5">
        {/* Left: Brand Logo with Infinity Icon */}
        <Link href="/" className="flex items-center gap-2 text-white font-medium text-base hover:opacity-90 transition-opacity">
          <InfinityIcon size={22} strokeWidth={1.5} className="text-white" />
          <span className="tracking-tight">Equilibrium</span>
        </Link>

        {/* Center: Desktop Nav Pill */}
        <nav className="hidden md:flex liquid-glass items-center gap-1 rounded-xl px-2 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-0.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                link.active ? "bg-white/15 text-white" : "text-white/70 hover:text-white"
              }`}
            >
              <span>{link.label}</span>
              {link.dropdown && <ChevronDown size={13} className="mt-px" />}
            </Link>
          ))}
        </nav>

        {/* Right: Desktop Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/account"
            className="liquid-glass text-white text-sm font-medium px-4 py-2.5 rounded-full hover:bg-white/5 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/checkout"
            className="bg-white text-black text-sm font-medium px-4 py-2.5 rounded-full hover:bg-white/90 transition-colors"
          >
            Begin Now
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden liquid-glass text-white p-2 rounded-lg focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute top-[72px] left-4 right-4 z-30 md:hidden liquid-glass rounded-2xl p-4 flex flex-col gap-1 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
            >
              <span>{link.label}</span>
              {link.dropdown && <ChevronDown size={14} />}
            </Link>
          ))}

          {/* Bottom Mobile Action Buttons */}
          <div className="flex gap-2 mt-2 pt-3 border-t border-white/10">
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center liquid-glass text-white text-sm font-medium px-4 py-2.5 rounded-full hover:bg-white/5 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/checkout"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center bg-white text-black text-sm font-medium px-4 py-2.5 rounded-full hover:bg-white/90 transition-colors"
            >
              Begin Now
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
