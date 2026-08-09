"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, ArrowRight } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide header on admin route
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { label: "Vedic Rakhis", href: "/#products" },
    { label: "Consecration Ritual", href: "/#rituals" },
    { label: "About YOUNOYA", href: "/about" },
    { label: "Concierge", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 sm:px-12 py-4 border-b border-white/5 bg-[#07080d]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Left: Authentic Gold YOUNOYA Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-36 sm:w-44">
            <img
              src="/younoya_logo.png"
              alt="YOUNOYA"
              className="object-contain h-full w-auto filter drop-shadow-[0_0_12px_rgba(255,180,50,0.35)] group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs font-mono tracking-wider uppercase text-[#8b93a8] hover:text-[#eef1f8] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Cart Pill & Aero Express Checkout */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/cart"
            className="aero-btn-secondary text-stone-200 text-xs font-medium px-4 py-2.5 rounded-full flex items-center gap-2 hover:text-white"
          >
            <ShoppingBag size={14} className="text-amber-400" />
            <span>Cart</span>
            <span className="w-4 h-4 rounded-full bg-amber-400 text-black text-[10px] font-bold flex items-center justify-center">
              1
            </span>
          </Link>

          <Link
            href="/checkout"
            className="aero-btn-primary text-white text-xs font-semibold px-5 py-2.5 rounded-full uppercase tracking-wider flex items-center gap-1.5"
          >
            <span>Express Checkout</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white/80 p-2 hover:text-white"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="fixed top-[73px] left-4 right-4 z-50 md:hidden chrome-card rounded-2xl p-5 flex flex-col gap-3 shadow-2xl border border-white/10 bg-[#0c0e15]/95 backdrop-blur-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-stone-300 hover:text-white py-2"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-3 border-t border-white/10">
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center aero-btn-secondary text-white text-xs font-medium py-2.5 rounded-full flex items-center justify-center gap-1.5"
            >
              <ShoppingBag size={13} />
              <span>Cart (1)</span>
            </Link>
            <Link
              href="/checkout"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center aero-btn-primary text-white text-xs font-semibold uppercase tracking-wider py-2.5 rounded-full"
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
