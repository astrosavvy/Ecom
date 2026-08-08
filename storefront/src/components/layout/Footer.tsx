import React from "react";
import Link from "next/link";
import { Infinity as InfinityIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0c] text-white/70 border-t border-white/10 relative z-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10">
        {/* Brand & Purpose */}
        <div className="md:col-span-5 space-y-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-medium text-lg hover:opacity-90 transition-opacity"
          >
            <InfinityIcon size={22} strokeWidth={1.5} className="text-white" />
            <span className="tracking-tight text-lg">Equilibrium</span>
          </Link>
          <p className="text-white/50 text-xs sm:text-sm leading-relaxed max-w-md font-light">
            Take charge of how you feel with a companion built for your journey—authentic consecrated Vedic essentials,
            lifelong rituals, and sacred blessings.
          </p>
          <div className="text-[11px] text-white/40 font-mono uppercase tracking-wider">
            Vedic Consecration & Astro Harmony
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-white/90">Sanctuary</h4>
          <ul className="space-y-2 text-xs text-white/60 list-none p-0 m-0">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                Our Philosophy
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-white transition-colors">
                Vedic Rakhis
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white transition-colors">
                Journal
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Consultations
              </Link>
            </li>
          </ul>
        </div>

        {/* Client Care */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-white/90">Care</h4>
          <ul className="space-y-2 text-xs text-white/60 list-none p-0 m-0">
            <li>
              <Link href="/shipping" className="hover:text-white transition-colors">
                Express Delivery
              </Link>
            </li>
            <li>
              <Link href="/refund" className="hover:text-white transition-colors">
                Returns & Unboxing
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Grace
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
          <h4 className="text-xs uppercase tracking-widest font-semibold text-white/90">Concierge</h4>
          <div className="space-y-2.5 text-xs text-white/60">
            <p>Direct Enquiries & Astrological Guidance</p>
            <div className="text-white font-medium text-xs">concierge@younoya.com</div>
            <div className="pt-2">
              <Link
                href="/checkout"
                className="inline-block liquid-glass text-white px-5 py-2 rounded-full text-xs font-medium hover:bg-white/10 transition-colors"
              >
                Begin Now →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-6 px-6 sm:px-12 bg-black/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <div>© 2026 Equilibrium / YOUNOYA. All Rights Reserved.</div>
          <div className="flex items-center gap-6">
            <span>Free Express Across India</span>
            <span>Razorpay Secure</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
