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
    { label: "Home", href: "/" },
    { label: "Studio", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Journal", href: "/blog" },
    { label: "Reach Us", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none">
      {/* Floating Header Bar */}
      <div className="pt-4 sm:pt-6 px-4 sm:px-8 max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* 1. Large, Seamless Brand Logo on Left */}
        <Link href="/" className="pointer-events-auto flex items-center group flex-shrink-0">
          <div className="transition-transform duration-300 group-hover:scale-105">
            <picture>
              <source srcSet="/younoya_logo_nobg.webp" type="image/webp" />
              <img
                src="/younoya_logo_nobg.png"
                alt="YOUNOYA"
                className="h-11 sm:h-14 w-auto max-w-[160px] sm:max-w-[220px] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
              />
            </picture>
          </div>
        </Link>

        {/* 2. Desktop: Centered Clean Navigation Links Pill */}
        <nav className="pointer-events-auto hidden md:flex items-center gap-1 px-6 py-2.5 rounded-full bg-white/90 backdrop-blur-2xl border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_35px_rgb(0,0,0,0.08)] transition-all duration-300">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs font-sans px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                  isActive
                    ? "text-[#000000] font-semibold bg-black/5"
                    : "text-[#6F6F6F] hover:text-[#000000] hover:bg-black/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 3. Desktop: Direct Standalone Cart & Shop Now Buttons */}
        <div className="pointer-events-auto hidden md:flex items-center gap-3">
          <Link
            href="/cart"
            className="relative p-3 rounded-full bg-white/90 backdrop-blur-xl border border-black/5 text-[#000000] hover:bg-white transition-all flex items-center justify-center shadow-xs hover:scale-105 active:scale-95"
            aria-label="View Cart"
          >
            <ShoppingBag size={17} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#000000] text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            )}
          </Link>

          <Link
            href="/products"
            className="px-6 py-2.5 rounded-full bg-[#000000] text-[#FFFFFF] text-xs font-sans font-normal hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200 shadow-xs whitespace-nowrap"
          >
            Begin Journey
          </Link>
        </div>

        {/* Mobile: Direct Standalone Cart & Menu Buttons */}
        <div className="pointer-events-auto md:hidden flex items-center gap-2">
          <Link
            href="/cart"
            className="relative p-2.5 rounded-full bg-white/90 backdrop-blur-xl border border-black/5 text-[#000000] flex items-center justify-center shadow-xs"
            aria-label="View Cart"
          >
            <ShoppingBag size={16} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#000000] text-white text-[9px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-full bg-white/90 backdrop-blur-xl border border-black/5 text-[#000000] flex items-center justify-center shadow-xs"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="pointer-events-auto md:hidden mt-2 mx-3 bg-white/98 backdrop-blur-2xl rounded-3xl border border-black/5 p-5 space-y-3 shadow-2xl">
          <div className="divide-y divide-black/5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-sans text-[#1C1C1C] py-2.5 px-2 hover:bg-black/5 rounded-xl transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-2 flex gap-2">
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-3 text-center rounded-full bg-black/5 text-[#000000] text-xs font-sans font-medium"
            >
              Cart ({totalItems})
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-3 text-center rounded-full bg-[#000000] text-white text-xs font-sans font-normal"
            >
              Begin Journey
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
