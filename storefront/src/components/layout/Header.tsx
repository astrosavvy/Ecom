"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { label: "All Products", href: "/products" },
    { label: "Our Story", href: "/about" },
    { label: "Consecration Rituals", href: "/#rituals" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none transition-all duration-300">
      {/* Main Floating Navbar (Left Logo + Centered Nav Pill + Right Standalone Actions) */}
      <div className="pt-4 sm:pt-6 px-3 sm:px-8 max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* 1. Large, Seamless Gold Logo on the Far Left (No Box / No Border) */}
        <Link href="/" className="pointer-events-auto flex items-center group flex-shrink-0">
          <div className="transition-transform duration-300 group-hover:scale-105">
            <picture>
              <source srcSet="/younoya_logo_nobg.webp" type="image/webp" />
              <img
                src="/younoya_logo_nobg.png"
                alt="YOUNOYA — for every chapter"
                className="h-10 sm:h-14 w-auto max-w-[160px] sm:max-w-[220px] object-contain drop-shadow-[0_2px_12px_rgba(212,175,55,0.4)]"
              />
            </picture>
          </div>
        </Link>

        {/* 2. Desktop: Centered Frosted Glass Navigation Pill */}
        <nav className="pointer-events-auto hidden md:flex items-center gap-1 px-5 py-2.5 rounded-full bg-[#0E1017]/85 backdrop-blur-2xl border border-[#D4AF37]/25 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-[#D4AF37]/45 transition-all duration-300">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-full text-stone-200 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 3. Desktop: Direct Standalone Cart & Shop Now Buttons */}
        <div className="pointer-events-auto hidden md:flex items-center gap-3">
          <Link
            href="/cart"
            className="relative p-3 rounded-full bg-[#0E1017]/90 backdrop-blur-xl border border-[#D4AF37]/30 text-white hover:border-[#D4AF37] hover:bg-[#141724] transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
            aria-label="View Cart"
          >
            <ShoppingBag size={17} className="text-[#D4AF37]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[9px] font-extrabold flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>

          <Link
            href="/products"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#07080E] text-xs font-extrabold uppercase tracking-wider hover:opacity-90 transition-all transform hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(212,175,55,0.3)] whitespace-nowrap"
          >
            Shop Collection
          </Link>
        </div>

        {/* Mobile: Direct Standalone Cart & Menu Buttons */}
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

      {/* Mobile Drawer (Clean Dropdown Menu) */}
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
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-3 text-center rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#07080E] text-xs font-extrabold uppercase tracking-wider shadow-md"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
