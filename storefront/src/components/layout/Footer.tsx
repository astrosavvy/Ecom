"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Do not render storefront footer on admin dashboard
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full bg-[#0a0a0c] text-white/70 border-t border-white/10 relative z-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 text-left">
        {/* Brand & Purpose */}
        <div className="md:col-span-5 space-y-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-bold text-xl hover:opacity-90 transition-opacity tracking-wider uppercase"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-black flex items-center justify-center font-bold text-xs shadow-md">
              Y
            </div>
            <span>YOUNOYA</span>
          </Link>
          <p className="text-white/50 text-xs sm:text-sm leading-relaxed max-w-md font-light">
            Consecrated Vedic Rakhis, authentic astrological gemstones, and sacred ritual kits crafted with devotion and
            delivered across India with zero-password instant checkout.
          </p>
          <div className="text-[11px] text-amber-400 font-mono uppercase tracking-wider">
            Vedic Consecration & Spiritual Kinship
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-white/90">Collections</h4>
          <ul className="space-y-2 text-xs text-white/60 list-none p-0 m-0">
            <li>
              <Link href="/search" className="hover:text-white transition-colors">
                Prosperity Rakhis
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-white transition-colors">
                Navagraha Protection
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white transition-colors">
                Vedic Journal
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                Our Story
              </Link>
            </li>
          </ul>
        </div>

        {/* Client Care */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-white/90">Support</h4>
          <ul className="space-y-2 text-xs text-white/60 list-none p-0 m-0">
            <li>
              <Link href="/shipping" className="hover:text-white transition-colors">
                Express Shipping
              </Link>
            </li>
            <li>
              <Link href="/refund" className="hover:text-white transition-colors">
                Cancellation & Video Return
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

        {/* Concierge */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-white/90">Customer Desk</h4>
          <div className="space-y-2.5 text-xs text-white/60">
            <p>Direct Inquiries & Order Tracking</p>
            <div className="text-white font-medium text-xs">support@younoya.com</div>
            <div className="pt-2">
              <Link
                href="/checkout"
                className="inline-block liquid-glass text-amber-300 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-white/10 transition-colors"
              >
                Checkout Now →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-6 px-6 sm:px-12 bg-black/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <div>© 2026 YOUNOYA. All Rights Reserved.</div>
          <div className="flex items-center gap-6">
            <span>Free Express Across India</span>
            <span>Razorpay Secure</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
