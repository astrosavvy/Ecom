"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Mail, Phone, Lock, Heart, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#1C1C1C] text-white pt-16 pb-12 border-t border-white/10 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Top Grid (4 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-white/10 pb-12">
          {/* Column 1: Brand & Philosophy (5 cols) */}
          <div className="md:col-span-5 space-y-5">
            <Link href="/" className="inline-block group">
              <img
                src="/younoya_logo.png"
                alt="YOUNOYA"
                className="h-14 sm:h-18 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-md font-normal">
              Consecrated Vedic Rakhis, authentic astrological gemstones, and sacred puja keepsakes crafted with devotion and delivered across India with zero-password checkout.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
              <Sparkles size={12} />
              <span>VEDIC CONSECRATION & SPIRITUAL KINSHIP</span>
            </div>
          </div>

          {/* Column 2: Collections (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Prosperity Rakhis
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Navagraha Protection
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Rudraksha Blessings
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Products Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Policies (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              Policies
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Express Air Shipping
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-white transition-colors">
                  Refund & Unboxing Policy
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

          {/* Column 4: Devotee Concierge (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
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
                href="/checkout"
                className="px-5 py-2.5 rounded-full bg-[#E2E8E4] text-[#1C1C1C] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 hover:bg-white transition-colors"
              >
                <span>Express Checkout</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Trust Line */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © {new Date().getFullYear()} YOUNOYA. All Rights Reserved. Crafted for Devotee Kinship.
          </div>
          <div className="flex items-center gap-6 text-[11px] font-mono">
            <span>100% Free Express Air Shipping (India)</span>
            <span>Razorpay 256-Bit Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
