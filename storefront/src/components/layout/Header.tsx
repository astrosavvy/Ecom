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

      {/* Main Navigation Bar (80px, Sticky Backdrop Blur 12px) */}
      <div className="h-16 sm:h-20 w-full bg-[#FDFCF8]/95 backdrop-blur-[12px] border-b border-[#F3F4F6] px-3 sm:px-8 flex items-center justify-between transition-all">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          {/* Logo on Left - Responsive Scale */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group py-0 -my-2">
            <img
              src="/younoya_logo.png"
              alt="YOUNOYA"
              className="h-14 sm:h-22 w-auto object-contain filter drop-shadow-[0_0_20px_rgba(212,175,55,0.8)] brightness-115 group-hover:scale-105 transition-all"
            />
          </Link>

          {/* Center-Aligned Nav Links (14px Medium Weight) */}
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[#1C1C1C] hover:text-[#D4AF37] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full bg-[#E2E8E4] text-[#1C1C1C] hover:bg-[#D4DFD7] transition-colors flex items-center justify-center"
              aria-label="View Cart"
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#1C1C1C] text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              href="/products"
              className="px-6 py-3 rounded-full bg-[#1C1C1C] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-all transform hover:scale-105 active:scale-95 shadow-md"
            >
              Shop Now
            </Link>
          </div>

          {/* Mobile Right Controls (Cart + Hamburger) */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/cart"
              className="relative p-2 rounded-full bg-[#E2E8E4] text-[#1C1C1C] flex items-center justify-center"
              aria-label="View Cart"
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1C1C1C] text-white text-[9px] font-bold flex items-center justify-center">
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
