"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { label: "Product", href: "#features" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#features" },
    { label: "Docs", href: "#features" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 sm:px-12 py-5 flex items-center justify-between border-b border-white/5 bg-[#07080d]/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Left: CHROMA. Wordmark */}
        <Link href="/" className="flex items-baseline text-2xl font-bold tracking-tight">
          <span className="chrome-text">CHROMA</span>
          <span className="text-[#ff2e88] font-black text-2xl ml-0.5">.</span>
        </Link>

        {/* Center: Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs text-[#8b93a8] hover:text-[#eef1f8] font-medium transition-colors tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Sign in + Aero Get Started Pill */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/admin"
            className="text-xs text-[#8b93a8] hover:text-white font-medium transition-colors"
          >
            Sign in
          </Link>

          <Link
            href="/checkout"
            className="aero-btn-primary text-white text-xs font-semibold px-5 py-2.5 rounded-full uppercase tracking-wider"
          >
            Get started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white/80 p-2 hover:text-white"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="fixed top-[69px] left-4 right-4 z-50 md:hidden chrome-card rounded-2xl p-5 flex flex-col gap-3 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-stone-300 hover:text-white py-2"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-3 border-t border-white/10">
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center aero-btn-secondary text-white text-xs font-medium py-2.5 rounded-full"
            >
              Sign in
            </Link>
            <Link
              href="/checkout"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center aero-btn-primary text-white text-xs font-semibold uppercase tracking-wider py-2.5 rounded-full"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
