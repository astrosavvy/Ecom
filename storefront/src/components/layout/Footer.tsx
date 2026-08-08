import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-[#0a0608] text-white/80 font-inter border-t border-white/10 relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-r from-teal-500/10 via-amber-500/10 to-indigo-500/10 blur-[100px] pointer-events-none" />

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
        {/* Brand & Mission Statement */}
        <div className="md:col-span-5 space-y-5">
          <Link href="/" className="font-dancing text-white text-3xl md:text-4xl font-bold tracking-wide">
            Serene
          </Link>
          <p className="text-white/60 text-sm font-light leading-relaxed max-w-md font-instrument italic text-lg">
            "Gentle touch. Radiant presence. Refined outcomes that honour your natural essence and lasting vitality."
          </p>
          <div className="pt-2 text-xs text-white/40 font-mono tracking-widest uppercase">
            Astro-Consecrated Wellness & Sacred Adornments
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-white/90">Sanctuary</h4>
          <ul className="space-y-2.5 text-xs text-white/60 list-none p-0 m-0">
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

        {/* Policies */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-white/90">Client Care</h4>
          <ul className="space-y-2.5 text-xs text-white/60 list-none p-0 m-0">
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

        {/* Global Concierge */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-white/90">Concierge</h4>
          <div className="space-y-3 text-xs text-white/60">
            <p>Direct Enquiries & Blessing Consultations</p>
            <div className="text-white font-medium">concierge@younoya.com</div>
            <div className="pt-2">
              <Link
                href="/checkout"
                className="inline-block liquid-glass text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-white/10 transition-all border border-white/20"
              >
                Experience with Intention →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-6 px-6 md:px-12 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <div>© 2026 Serene / YOUNOYA. All Rights Reserved.</div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white/70 transition-colors">Secured Online Checkout</span>
            <span className="hover:text-white/70 transition-colors">Razorpay Trusted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
