"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full bg-[#07080E] text-[#FDFCF8] pt-16 pb-12 border-t border-[#D4AF37]/20 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Top Grid (4 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-white/10 pb-12">
          {/* Column 1: Brand & Philosophy (5 cols) */}
          <div className="md:col-span-5 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(212,175,55,0.35)] transition-transform group-hover:scale-105">
                <img
                  src="/younoya_celestial_nebula_logo.png"
                  alt="YOUNOYA"
                  className="h-11 sm:h-14 w-auto object-cover"
                />
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-md font-normal">
              Sacred Vedic Astrology-Blessed Rakhis, authentic gemstones, and consecrated ritual keepsakes energized with 108 Gayatri Mantras and delivered across India with zero-password checkout.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest text-stone-300 uppercase">
              <Sparkles size={12} />
              <span>TIMELESS CRAFTSMANSHIP & ZERO-PASSWORD FLOW</span>
            </div>
          </div>

          {/* Column 2: Vedic Sanctuary (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-stone-400 font-bold">
              Sanctuary
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Sacred Heritage
                </Link>
              </li>
              <li>
                <Link href="/#rituals" className="hover:text-white transition-colors">
                  108 Mantra Rituals
                </Link>
              </li>
              <li>
                <Link href="/#zodiac" className="hover:text-white transition-colors">
                  12 Rashis Matrix
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Reach Priests
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Policies (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-stone-400 font-bold">
              Policies
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Express Shipping
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-white transition-colors">
                  Refund & Return Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Devotee / Customer Concierge (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-stone-400 font-bold">
              Concierge
            </h4>
            <p className="text-xs text-stone-400">
              Direct Inquiries & Order Assistance:
            </p>
            <div className="text-xs font-mono text-white font-bold">
              support@younoya.com
            </div>
            <div className="pt-2">
              <Link
                href="/products"
                className="px-5 py-2.5 rounded-full bg-white text-[#000000] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 hover:bg-stone-200 transition-colors"
              >
                <span>Explore Collection</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Trust Line */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © {new Date().getFullYear()} YOUNOYA. All Rights Reserved.
          </div>
          <div className="flex items-center gap-6 text-[11px] font-mono">
            <span>Free Express Delivery</span>
            <span>Razorpay 256-Bit Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
