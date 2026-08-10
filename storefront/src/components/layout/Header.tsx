"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { label: "Vedic Rakhis", href: "/#products" },
    { label: "All Products", href: "/products" },
    { label: "Consecration", href: "/#rituals" },
    { label: "Comparison", href: "/#comparison" },
    { label: "Reviews", href: "/#reviews" },
    { label: "Story", href: "/about" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none">
      {/* Top Scarcity Promo Bar (Pointer events enabled) */}
      <div className="pointer-events-auto h-9 w-full bg-[#D8E6D8]/95 backdrop-blur-md border-b border-[#C2D6C2] px-2 sm:px-4 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-semibold text-[#1C1C1C] tracking-tight">
        <span className="pulse-badge flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded bg-[#DC2626] text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider">
          Almost Gone
        </span>
        <span className="truncate max-w-[260px] sm:max-w-none">
          LIMITED CONSECRATION BATCH // 100% FREE EXPRESS AIR SHIPPING
        </span>
      </div>

      {/* Floating Header Bar (3 Detached Elements: Left Logo + Center Navigation + Right Cart & Shop Action) */}
      <div className="pt-2 sm:pt-4 px-3 sm:px-8 max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* 1. Detached Prominent Logo on the Far Left */}
        <Link href="/" className="pointer-events-auto flex items-center group flex-shrink-0">
          <div className="relative rounded-2xl p-0.5 bg-gradient-to-br from-[#D4AF37]/50 via-[#1C1C1C] to-[#B8860B]/40 shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:shadow-[0_6px_25px_rgba(212,175,55,0.25)] group-hover:scale-105">
            <div className="h-11 sm:h-14 w-auto rounded-[14px] overflow-hidden bg-[#0A0B10] flex items-center justify-center p-1 sm:p-1.5 border border-white/10">
              <img
                src="/younoya_cosmic_logo_cropped.png"
                alt="YOUNOYA — for every chapter"
                className="h-full w-auto max-w-[150px] sm:max-w-[200px] object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
              />
            </div>
          </div>
        </Link>

        {/* 2. Desktop: Centered Navigation Links Pill */}
        <nav className="pointer-events-auto hidden md:flex items-center gap-1 px-5 py-2.5 rounded-full bg-[#FDFCF8]/95 backdrop-blur-2xl border border-[#E2E8E4] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_35px_rgb(0,0,0,0.09)] transition-all duration-300">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-semibold px-3 py-1.5 rounded-full text-[#1C1C1C] hover:text-[#1C1C1C] hover:bg-[#E2E8E4]/70 transition-all whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 3. Desktop: Detached Cart & Shop Now Pill on the Far Right */}
        <div className="pointer-events-auto hidden md:flex items-center gap-3 px-3.5 py-2 rounded-full bg-[#FDFCF8]/95 backdrop-blur-2xl border border-[#E2E8E4] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_35px_rgb(0,0,0,0.09)] transition-all duration-300">
          <Link
            href="/cart"
            className="relative p-2 rounded-full bg-white border border-[#E2E8E4] text-[#1C1C1C] hover:bg-[#E2E8E4] transition-all flex items-center justify-center shadow-sm hover:scale-105"
            aria-label="View Cart"
          >
            <ShoppingBag size={16} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1C1C1C] text-[#D4AF37] text-[9px] font-extrabold flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>

          <Link
            href="/products"
            className="px-5 py-2 rounded-full bg-[#1C1C1C] text-white text-[11px] font-extrabold uppercase tracking-wider hover:bg-[#333333] transition-all transform hover:scale-105 active:scale-95 shadow-sm whitespace-nowrap"
          >
            Shop Now
          </Link>
        </div>

        {/* Mobile: Quick Action Bar (Cart + Mobile Drawer Toggle) */}
        <div className="pointer-events-auto md:hidden flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FDFCF8]/95 backdrop-blur-2xl border border-[#E2E8E4] shadow-md">
          <Link
            href="/cart"
            className="relative p-2 rounded-full bg-white border border-[#E2E8E4] text-[#1C1C1C] flex items-center justify-center shadow-sm"
            aria-label="View Cart"
          >
            <ShoppingBag size={16} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1C1C1C] text-[#D4AF37] text-[9px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full bg-white border border-[#E2E8E4] text-[#1C1C1C] flex items-center justify-center shadow-sm"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Clean Dropdown) */}
      {isMobileMenuOpen && (
        <div className="pointer-events-auto md:hidden mt-2 mx-3 bg-[#FDFCF8]/98 backdrop-blur-2xl rounded-3xl border border-[#E2E8E4] p-5 space-y-3 shadow-2xl">
          <div className="divide-y divide-[#E2E8E4]/60">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-xs font-bold text-[#1C1C1C] py-2.5 px-2 hover:bg-[#E2E8E4]/40 rounded-xl transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-2 flex gap-2">
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-2.5 text-center rounded-full bg-[#E2E8E4] text-[#1C1C1C] text-xs font-bold uppercase tracking-wider"
            >
              Cart ({totalItems})
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-2.5 text-center rounded-full bg-[#1C1C1C] text-white text-xs font-bold uppercase tracking-wider"
            >
              Shop Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
