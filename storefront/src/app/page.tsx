"use client";

import React from "react";
import Link from "next/link";
import PriceDisplay from "@/components/ui/PriceDisplay";
import { Sparkles, ShieldCheck, Moon } from "lucide-react";

const BG_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_230229_7c9bc431-46cf-489a-948d-e8144d8eb5d4.mp4";

const RAKHI_PRODUCTS = [
  {
    handle: "vedic-prosperity-rakhi",
    title: "Vedic Prosperity Rakhi Set with Dry Fruits & Consecrated Thread",
    subtitle: "Sacred consecration for sibling grace and planetary harmony",
    price: 1099,
    originalPrice: 1299,
    badge: "Signature Edition",
    description:
      "Handcrafted with authentic Vedic symbolism, sacred crystals, and dry fruit accompaniments to honour lifelong bonds.",
  },
  {
    handle: "vedic-prosperity-wealth-attraction-rakhi",
    title: "Vedic Prosperity & Wealth Attraction Rakhi",
    subtitle: "Astrologically selected crystal, oyster shells & sacred mauli",
    price: 999,
    originalPrice: 1199,
    badge: "Prosperity",
    description:
      "Infused with astrological crystal resonance and sacred oceanic shells for abundance, vitality, and protective light.",
  },
  {
    handle: "vedic-abundance-blessing-rakhi",
    title: "Vedic Abundance & Blessing Rakhi",
    subtitle: "A keepsake designed to be treasured long after the festive hour",
    price: 999,
    originalPrice: 1199,
    badge: "Abundance",
    description:
      "Every knot woven with intention, invoking divine grace and cherished memories for brother and sister.",
  },
  {
    handle: "navagraha-om-protection-kaudi-rakhi",
    title: "Navagraha Om Protection Kaudi Rakhi",
    subtitle: "Sacred kaudis, Om motif & Navagraha-inspired planetary harmony",
    price: 1099,
    originalPrice: 1299,
    badge: "Sacred Shield",
    description:
      "Featuring nine-planet resonance, pure mauli weave, and Goddess Lakshmi's blessing symbols for supreme auspiciousness.",
  },
];

export default function Home() {
  return (
    <div className="bg-[#0a0a0c] text-white selection:bg-white selection:text-black overflow-hidden font-inter">
      {/* ========================================================
          HERO SECTION (Full Viewport with Background Video)
         ======================================================== */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background Looping Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={BG_VIDEO}
        />

        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-black/20 z-10" />

        {/* Hero Content (Positioned Bottom-Left) */}
        <div className="absolute bottom-0 left-0 z-20 px-6 sm:px-12 pb-10 sm:pb-16 max-w-2xl">
          <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight tracking-tight mb-4">
            Live Better, Feel Whole Every Day
          </h1>

          <p className="text-white/60 text-sm leading-relaxed mb-7 max-w-md">
            Take charge of how you feel with a companion built for your journey—build routines, follow your growth, and
            unlock tailored insights for a steadier, more vibrant life each day.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/checkout"
              className="bg-white text-black text-sm sm:text-base font-medium px-6 sm:px-7 py-3 rounded-full hover:bg-white/90 transition-colors"
            >
              Start Today
            </Link>
            <Link
              href="#sacred-collection"
              className="liquid-glass text-white text-sm sm:text-base font-medium px-6 sm:px-7 py-3 rounded-full hover:bg-white/5 transition-colors"
            >
              Discover How
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          CONSECRATED VEDIC COLLECTION (Retained Authentic Data)
         ======================================================== */}
      <section id="sacred-collection" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto space-y-12 relative z-20">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 liquid-glass rounded-full text-xs font-medium text-white/80">
            <Sparkles size={14} className="text-amber-300" />
            <span>Vedic Ritual & Consecrated Essentials</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight">
            Sacred Consecrated Rakhis
          </h2>

          <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
            Handcrafted with authentic Vedic planetary resonance, sacred crystals, and pure blessed mauli threads for
            protection and lifelong prosperity.
          </p>
        </div>

        {/* Product Grid in Liquid Glass Aesthetic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RAKHI_PRODUCTS.map((prod) => (
            <div
              key={prod.handle}
              className="liquid-glass rounded-2xl p-5 flex flex-col justify-between hover:bg-white/[0.03] transition-colors group"
            >
              <div className="space-y-4">
                {/* Artwork Placeholder Container */}
                <div className="h-52 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
                  <span className="absolute top-3 left-3 bg-white/10 text-white text-[10px] uppercase font-semibold px-2.5 py-1 rounded-full border border-white/10">
                    {prod.badge}
                  </span>
                  <div className="text-2xl font-semibold tracking-wider text-white/90 group-hover:scale-105 transition-transform duration-300">
                    YOUNOYA
                  </div>
                  <span className="text-[11px] text-white/40 mt-1">Consecrated Edition</span>
                </div>

                {/* Subtitle */}
                <div className="text-xs text-white/70 font-medium">{prod.subtitle}</div>

                {/* Title */}
                <h3 className="text-base font-medium text-white line-clamp-2 leading-snug group-hover:text-white/90 transition-colors">
                  <Link href={`/products/${prod.handle}`}>{prod.title}</Link>
                </h3>

                {/* Description */}
                <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">{prod.description}</p>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 pt-1">
                  <PriceDisplay amount={prod.price} className="text-xl font-semibold text-white" />
                  <span className="text-xs text-white/40 line-through">₹{prod.originalPrice}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                    Free Express
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5">
                <Link
                  href={`/products/${prod.handle}`}
                  className="block w-full text-center bg-white text-black text-xs font-medium py-2.5 rounded-full hover:bg-white/90 transition-colors"
                >
                  Acquire Blessing
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
