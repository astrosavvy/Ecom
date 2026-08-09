"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Truck, Lock, ArrowUpRight } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full bg-[#07080d] text-[#8b93a8] border-t border-white/10 relative z-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 text-left">
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <Link href="/" className="inline-block">
            <img
              src="/younoya_logo.png"
              alt="YOUNOYA"
              className="h-10 w-auto filter drop-shadow-[0_0_12px_rgba(255,180,50,0.35)]"
            />
          </Link>
          <p className="text-xs sm:text-sm text-[#8b93a8] leading-relaxed max-w-sm">
            Consecrated Vedic Rakhis, authentic astrological gemstones, and sacred puja keepsakes crafted with devotion and delivered across India with zero-password checkout.
          </p>
          <div className="text-[11px] font-mono text-amber-400/90 uppercase tracking-widest">
            Vedic Consecration & Spiritual Kinship
          </div>
        </div>

        {/* Collections */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-widest font-semibold text-white">Collections</h4>
          <ul className="space-y-2 text-xs text-[#8b93a8] list-none p-0 m-0">
            <li><Link href="/#products" className="hover:text-white transition-colors">Prosperity Rakhis</Link></li>
            <li><Link href="/#products" className="hover:text-white transition-colors">Navagraha Protection</Link></li>
            <li><Link href="/#products" className="hover:text-white transition-colors">Rudraksha Blessings</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">Brand Story</Link></li>
          </ul>
        </div>

        {/* Support & Policies */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-widest font-semibold text-white">Policies</h4>
          <ul className="space-y-2 text-xs text-[#8b93a8] list-none p-0 m-0">
            <li><Link href="/shipping" className="hover:text-white transition-colors">Express Shipping</Link></li>
            <li><Link href="/refund" className="hover:text-white transition-colors">Refund & Unboxing Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Concierge Contact */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-widest font-semibold text-white">Concierge</h4>
          <div className="space-y-2 text-xs text-[#8b93a8]">
            <p>Direct Inquiries & Order Assistance</p>
            <div className="text-white font-medium text-xs font-mono">support@younoya.com</div>
            <div className="pt-2">
              <Link
                href="/checkout"
                className="inline-flex items-center gap-1.5 aero-btn-secondary text-amber-300 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider"
              >
                <span>Express Checkout</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 px-6 sm:px-12 bg-black/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>© 2026 YOUNOYA. All Rights Reserved.</div>
          <div className="flex items-center gap-6">
            <span className="text-stone-400">100% Free Express Shipping (India)</span>
            <span className="text-stone-400">Razorpay 256-Bit Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
