"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Do not render storefront header on admin dashboard
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { label: "Home", href: "/", active: true },
    { label: "Vedic Rakhis", href: "/search", dropdown: true },
    { label: "Consecration Rituals", href: "/blog" },
    { label: "About Brand", href: "/about" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 sm:px-12 py-5 flex items-center justify-between bg-gradient-to-b from-black/85 via-black/40 to-transparent">
        {/* Left: YOUNOYA Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-black flex items-center justify-center font-bold text-sm shadow-md">
            Y
          </div>
          <span className="tracking-wider font-semibold text-lg uppercase text-white">YOUNOYA</span>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex liquid-glass items-center gap-1 rounded-xl px-2 py-1.5 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs tracking-wide uppercase transition-colors ${
                link.active
                  ? "bg-white/15 text-white font-medium"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <span>{link.label}</span>
              {link.dropdown && <ChevronDown size={13} className="opacity-70 mt-0.5" />}
            </Link>
          ))}
        </nav>

        {/* Right: Cart, Profile & Quick Checkout */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/cart"
            className="liquid-glass text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <span>🛒 Cart</span>
            <span className="w-4 h-4 bg-amber-500 text-black text-[10px] rounded-full flex items-center justify-center font-bold">
              1
            </span>
          </Link>
          <Link
            href="/account"
            className="liquid-glass text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
          >
            Profile
          </Link>
          <Link
            href="/checkout"
            className="bg-white text-black text-xs font-semibold uppercase tracking-wider px-5 py-2 rounded-full hover:bg-white/90 transition-colors shadow-md"
          >
            Express Checkout
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden liquid-glass text-white p-2.5 rounded-xl focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="fixed top-[72px] left-4 right-4 z-50 md:hidden liquid-glass rounded-2xl p-4 flex flex-col gap-1 shadow-2xl bg-[#0a0a0c]/95">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm text-white/80 hover:text-white"
            >
              <span>{link.label}</span>
              {link.dropdown && <ChevronDown size={14} />}
            </Link>
          ))}

          <div className="flex gap-2 mt-2 pt-3 border-t border-white/10">
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center liquid-glass text-white text-sm font-medium px-4 py-2.5 rounded-full hover:bg-white/5 transition-colors"
            >
              Profile
            </Link>
            <Link
              href="/checkout"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center bg-white text-black text-sm font-medium px-4 py-2.5 rounded-full hover:bg-white/90 transition-colors"
            >
              Express Checkout
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
