"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useDeck } from "@/components/home/DeckContext";

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  let activeTile = 0;
  try {
    const deck = useDeck();
    activeTile = deck.activeTile;
  } catch {
    activeTile = 1;
  }

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Hide header completely on the first tile (Hero Video) when on the home page
  const isHomePage = pathname === "/";
  const shouldHideOnHero = isHomePage && activeTile === 0;

  const navItems = [
    { label: "Our Heritage", href: "/about" },
    { label: "Vedic Consecration", href: "/#rituals" },
    { label: "Astrological Matrix", href: "/#zodiac" },
    { label: "Reach Sanctuary", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full pointer-events-none transition-all duration-700 ${
        shouldHideOnHero ? "opacity-0 -translate-y-10 pointer-events-none" : "opacity-100 translate-y-0"
      }`}
    >
      {/* Main Floating Navbar */}
      <div className="pt-4 sm:pt-6 px-3 sm:px-8 max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* 1. Clean Transparent Gold Logo with Ambient Glow */}
        <Link href="/" className="pointer-events-auto flex items-center group flex-shrink-0">
          <div className="logo-ambient-glow transition-transform duration-300 group-hover:scale-105">
            <img
              src="/younoya_celestial_gold_clean.png"
              alt="YOUNOYA — for every chapter"
              className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_2px_12px_rgba(212,175,55,0.3)]"
            />
          </div>
        </Link>

        {/* 2. Desktop: Centered Frosted Glass Navigation Pill */}
        <nav className="pointer-events-auto hidden md:flex items-center gap-1 px-5 py-2.5 rounded-full bg-[#080A10]/90 backdrop-blur-2xl border border-[#D4AF37]/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:border-[#D4AF37]/50 transition-all duration-300">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-full text-stone-200 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap font-mono tracking-wider"
              data-cursor="hover"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 3. Desktop: Cart & Sacred Alignment CTA */}
        <div className="pointer-events-auto hidden md:flex items-center gap-3">
          <Link
            href="/cart"
            className="relative p-3 rounded-full bg-[#080A10]/90 backdrop-blur-xl border border-[#D4AF37]/30 text-white hover:border-[#D4AF37] hover:bg-[#121522] transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
            aria-label="View Sacred Cart"
            data-cursor="hover"
          >
            <ShoppingBag size={17} className="text-[#D4AF37]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[9px] font-extrabold flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>

          <Link
            href="/#onboard"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B8860B] text-[#07080E] text-xs font-extrabold uppercase tracking-widest hover:opacity-95 transition-all transform hover:scale-105 active:scale-95 shadow-[0_4px_25px_rgba(212,175,55,0.4)] whitespace-nowrap"
            data-cursor="hover"
          >
            ✦ Calculate Kundali
          </Link>
        </div>

        {/* Mobile: Cart & Menu Buttons */}
        <div className="pointer-events-auto md:hidden flex items-center gap-2">
          <Link
            href="/cart"
            className="relative p-2.5 rounded-full bg-[#0E1017]/90 backdrop-blur-xl border border-[#D4AF37]/30 text-white flex items-center justify-center shadow-md"
            aria-label="View Cart"
          >
            <ShoppingBag size={16} className="text-[#D4AF37]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[9px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-full bg-[#0E1017]/90 backdrop-blur-xl border border-[#D4AF37]/30 text-white flex items-center justify-center shadow-md"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="pointer-events-auto md:hidden mt-3 mx-3 bg-[#0E1017]/98 backdrop-blur-2xl rounded-3xl border border-[#D4AF37]/30 p-5 space-y-4 shadow-2xl animate-fade-rise">
          <div className="divide-y divide-white/10">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-semibold text-stone-200 py-3 px-2 hover:bg-white/5 rounded-xl transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-2 flex gap-3">
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-3 text-center rounded-2xl bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider"
            >
              Cart ({totalItems})
            </Link>
            <Link
              href="/#onboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-3 text-center rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#07080E] text-xs font-extrabold uppercase tracking-wider shadow-md"
            >
              ✦ Calculate Kundali
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
