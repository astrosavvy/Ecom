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
    { label: "Features", href: "#features" },
    { label: "Plans", href: "#plans" },
    { label: "Security", href: "#security" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="relative z-20 w-full pt-4 md:pt-6 flex justify-center px-4">
      {/* Horizontal Nav Pill */}
      <nav className="inline-flex items-center justify-between gap-6 sm:gap-8 bg-white/70 backdrop-blur-md rounded-xl px-4 md:px-6 py-3 shadow-sm border border-white/40">
        {/* Custom Geometric SVG Logo + Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80 select-none"
        >
          <svg
            viewBox="0 0 256 256"
            className="w-6 h-6 fill-[#1B133C]"
            aria-hidden="true"
          >
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z" />
            <path d="M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="font-semibold text-sm tracking-tight text-[#1B133C]">
            Axon
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
