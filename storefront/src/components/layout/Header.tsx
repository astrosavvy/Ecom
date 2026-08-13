"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { label: "Collection", href: "/products" },
    { label: "Our Story", href: "/about" },
    { label: "Rituals", href: "/#rituals" },
    { label: "Reach Us", href: "/contact" },
  ];

  return (
    <header className="relative z-20 w-full pt-4 md:pt-6 flex justify-center px-4">
      {/* Horizontal Nav Pill */}
      <nav className="inline-flex items-center justify-between gap-6 sm:gap-8 bg-white/70 backdrop-blur-md rounded-xl px-4 md:px-6 py-3 shadow-sm border border-white/40">
        {/* YOUNOYA Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80 select-none group"
        >
          <picture>
            <source srcSet="/younoya_logo_nobg.webp" type="image/webp" />
            <img
              src="/younoya_logo_nobg.png"
              alt="YOUNOYA"
              className="h-6 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </picture>
          <span className="font-serif tracking-widest text-base font-semibold text-[#1B133C] uppercase">
            YOUNOYA
          </span>
        </Link>

        {/* Nav Links (hidden on mobile, visible sm+) */}
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#1B133C]/80 hover:text-[#1B133C] transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
