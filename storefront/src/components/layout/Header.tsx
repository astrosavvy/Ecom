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

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Studio", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Journal", href: "/blog" },
    { label: "Reach Us", href: "/contact" },
  ];

  return (
    <header className="relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        {/* Logo: Aethera® */}
        <Link
          href="/"
          className="font-serif text-3xl tracking-tight text-[#000000] select-none inline-flex items-start transition-opacity duration-200 hover:opacity-80"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          <span>Aethera</span>
          <sup className="text-sm font-sans font-normal ml-0.5 mt-0.5">®</sup>
        </Link>

        {/* Desktop Menu Items */}
        <nav className="hidden md:flex items-center space-x-10">
          {menuItems.map((item) => {
            const isHome = item.label === "Home";
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-sans transition-colors duration-200 ${
                  isHome
                    ? "text-[#000000] font-normal"
                    : "text-[#6F6F6F] hover:text-[#000000]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Button (and Cart if items exist) */}
        <div className="hidden md:flex items-center gap-4">
          {totalItems > 0 && (
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full border border-black/10 text-black hover:bg-black/5 transition-all"
              aria-label="Cart"
            >
              <ShoppingBag size={16} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            </Link>
          )}

          <Link
            href="/products"
            className="rounded-full px-6 py-2.5 text-sm font-sans bg-[#000000] text-[#FFFFFF] font-normal transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-xs inline-flex items-center justify-center"
          >
            Begin Journey
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          {totalItems > 0 && (
            <Link
              href="/cart"
              className="relative p-2 rounded-full border border-black/10 text-black"
              aria-label="Cart"
            >
              <ShoppingBag size={16} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#000000] focus:outline-hidden"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-8 pt-2 pb-6 border-b border-black/5 bg-white/95 backdrop-blur-md transition-all duration-300">
          <div className="flex flex-col space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-sans py-1 transition-colors ${
                  item.label === "Home"
                    ? "text-[#000000] font-medium"
                    : "text-[#6F6F6F] hover:text-[#000000]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center w-full rounded-full px-6 py-3 text-sm font-sans bg-[#000000] text-[#FFFFFF] transition-transform hover:scale-[1.02]"
              >
                Begin Journey
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
