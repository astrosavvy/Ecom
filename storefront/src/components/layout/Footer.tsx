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
    <footer className="w-full bg-[#111111] text-white pt-16 pb-12 border-t border-white/10 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Top Grid (4 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-white/10 pb-12">
          {/* Column 1: Brand & Philosophy (5 cols) */}
          <div className="md:col-span-5 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <svg viewBox="0 0 256 256" className="w-7 h-7 fill-white">
                <path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z" />
              </svg>
              <span className="font-serif tracking-widest text-xl font-normal text-white uppercase">
                YOUNOYA
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-md font-normal">
              Building platforms for brilliant minds, fearless makers, and thoughtful souls. Crafting digital havens with zero-password express checkout.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest text-stone-300 uppercase">
              <Sparkles size={12} />
              <span>TIMELESS CRAFTSMANSHIP & ZERO-PASSWORD FLOW</span>
            </div>
          </div>

          {/* Column 2: Collections (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-stone-400 font-bold">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Signature Editions
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Studio Editions
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Brand Story
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
