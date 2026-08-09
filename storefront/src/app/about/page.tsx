"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles, HeartHandshake, ArrowRight, Award, Lock, Feather } from "lucide-react";
import { MobileStickyCart } from "@/components/ui/MobileStickyCart";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#FDFCF8] text-[#1C1C1C] pt-36 pb-24 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-16 relative z-10">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E2E8E4] border border-[#C2D6C2] text-[11px] font-mono tracking-widest uppercase text-[#1C1C1C]">
            <Sparkles size={12} className="text-[#D4AF37]" />
            <span>OUR SACRED PHILOSOPHY</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold font-heading text-[#1C1C1C] leading-tight">
            The Craft of Consecrated Sibling Grace
          </h1>
          <p className="text-base text-stone-600 leading-relaxed font-normal">
            YOUNOYA was born from a singular spiritual commitment: to restore authentic Vedic consecration and astrological intention to the sacred festival of Raksha Bandhan.
          </p>
        </div>

        {/* Section 1: The Vedic Heritage */}
        <div className="clinical-card p-8 sm:p-12 space-y-6">
          <div className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
            01 // VEDIC CONSECRATION
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1C1C1C]">
            108 Gayatri Mantras & Prana Pratishtha
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            In mass-produced commerce, the sacred thread has often been reduced to plastic beads and synthetic strings. At YOUNOYA, every single Rakhi undergoes authentic <strong>Prana Pratishtha</strong> rituals recited by traditional Vedic pandits. During sunrise consecration sessions, 108 chants of the Gayatri Mantra are recited to energize the natural elements with planetary shielding and long-life blessings for brothers.
          </p>
        </div>

        {/* Section 2: Pure Natural Elements (3 Columns) */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              02 // ASTROLOGICAL INGREDIENTS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1C1C1C]">
              Natural Gemstones & Organic Resham
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="benefit-card space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E2E8E4] flex items-center justify-center text-[#1C1C1C]">
                <Sparkles size={22} className="text-[#D4AF37]" />
              </div>
              <h3 className="text-base font-bold font-heading text-[#1C1C1C]">Gomti Chakra & Kaudi</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hand-picked natural Gomti Chakras from sacred river beds and certified yellow Kaudi shells to attract Goddess Lakshmi’s perpetual prosperity.
              </p>
            </div>

            <div className="benefit-card space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F0E6D8] flex items-center justify-center text-[#1C1C1C]">
                <Feather size={22} className="text-[#D4AF37]" />
              </div>
              <h3 className="text-base font-bold font-heading text-[#1C1C1C]">5 Mukhi Rudrakshas</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Authentic 5 Mukhi Rudraksha beads from Nepal, renowned for balancing bio-energies, calming the nervous system, and shielding negative influences.
              </p>
            </div>

            <div className="benefit-card space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E6E0F0] flex items-center justify-center text-[#1C1C1C]">
                <HeartHandshake size={22} className="text-[#D4AF37]" />
              </div>
              <h3 className="text-base font-bold font-heading text-[#1C1C1C]">Organic Silk Threads</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                100% skin-safe organic Resham silk and pure Mauli threads designed for comfortable extended wear long after the festive hours.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Zero-Password Checkout Mission */}
        <div className="clinical-card p-8 sm:p-12 space-y-6">
          <div className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
            03 // FRICTIONLESS DEVOTEE EXPERIENCE
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1C1C1C]">
            Zero-Password Frictionless Shopping
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            We believe spiritual gifting should never be obstructed by tedious password resets or mandatory multi-step account creations. YOUNOYA pioneered zero-password checkout across India: simply enter your mobile number, verify via instant OTP, and complete your order in seconds.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="px-8 py-4 rounded-full bg-[#1C1C1C] text-white text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg hover:bg-[#333333] transition-all"
            >
              <span>Explore Consecrated Rakhis</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      <MobileStickyCart />
    </div>
  );
}
