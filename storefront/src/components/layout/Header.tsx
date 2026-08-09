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
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Top Scarcity Promo Bar (Responsive for Mobile) */}
      <div className="h-10 w-full bg-[#D8E6D8] border-b border-[#C2D6C2] px-2 sm:px-4 flex items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-semibold text-[#1C1C1C] tracking-tight sm:tracking-wide">
        <span className="pulse-badge flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded bg-[#DC2626] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
          Almost Gone
        </span>
        <span className="truncate max-w-[250px] sm:max-w-none">
          LIMITED CONSECRATION BATCH // 100% FREE EXPRESS AIR SHIPPING
        </span>
      </div>

      {/* Main Navigation Bar (Fluid Glassmorphic Header with Organic Bubbles) */}
      <div className="relative h-18 sm:h-22 w-full bg-[#FDFCF8]/90 backdrop-blur-xl border-b border-[#E2E8E4]/60 px-4 sm:px-8 flex items-center justify-between transition-all overflow-hidden">
        {/* Ambient Fluid Background Bubbles */}
        <div className="absolute -top-10 left-1/4 w-72 h-32 bg-gradient-to-r from-[#D4AF37]/10 via-[#E2E8E4]/30 to-transparent rounded-full blur-2xl pointer-events-none fluid-bubble-1" />
        <div className="absolute -top-12 right-1/3 w-64 h-36 bg-gradient-to-l from-emerald-100/30 via-[#D4AF37]/10 to-transparent rounded-full blur-2xl pointer-events-none fluid-bubble-2" />

        <div className="max-w-7xl mx-auto w-full flex items-center justify-between relative z-10">
          {/* Logo on Left - High-definition crisp gold presentation */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group py-1">
            <div className="relative flex items-center">
              <img
                src="/younoya_logo.png"
                alt="YOUNOYA"
                className="h-12 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Center-Aligned Nav Links (Fluid Organic Glass Pill) */}
          <nav className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/80 border border-[#E2E8E4] shadow-sm backdrop-blur-md">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full text-[#1C1C1C] hover:text-[#1C1C1C] hover:bg-[#E2E8E4]/60 transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Cluster (Fluid Cart Pill + Shop Now) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full bg-white border border-[#E2E8E4] text-[#1C1C1C] hover:bg-[#E2E8E4] transition-all flex items-center justify-center shadow-sm hover:scale-105"
              aria-label="View Cart"
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#1C1C1C] text-[#D4AF37] text-[10px] font-extrabold flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              href="/products"
              className="px-6 py-2.5 rounded-full bg-[#1C1C1C] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-[#333333] transition-all transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-2"
            >
              <span>Shop Now</span>
            </Link>
          </div>

          {/* Mobile Right Controls (Cart + Hamburger) */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/cart"
              className="relative p-2 rounded-full bg-white border border-[#E2E8E4] text-[#1C1C1C] flex items-center justify-center"
              aria-label="View Cart"
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1C1C1C] text-[#D4AF37] text-[9px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#1C1C1C]"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FDFCF8] border-b border-[#E2E8E4] px-6 py-6 space-y-4 shadow-xl">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#1C1C1C] py-2 border-b border-[#E2E8E4]/40"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 flex gap-3">
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-3 text-center rounded-full bg-[#E2E8E4] text-[#1C1C1C] text-xs font-bold uppercase tracking-wider"
            >
              Cart ({totalItems})
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-3 text-center rounded-full bg-[#1C1C1C] text-white text-xs font-bold uppercase tracking-wider"
            >
              Shop Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
