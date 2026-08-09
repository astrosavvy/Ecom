"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import PriceDisplay from "@/components/ui/PriceDisplay";
import { Sparkles, ShieldCheck, Truck, Clock } from "lucide-react";

const BG_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_230229_7c9bc431-46cf-489a-948d-e8144d8eb5d4.mp4";

const FALLBACK_PRODUCTS = [
  {
    id: "prod_001",
    handle: "vedic-prosperity-rakhi",
    title: "Vedic Prosperity Rakhi Set with Dry Fruits & Consecrated Thread",
    subtitle: "Sacred consecration for sibling grace and planetary harmony",
    price: 1099,
    original_price: 1299,
    badge: "Signature Edition",
    description:
      "Handcrafted with authentic Vedic symbolism, sacred crystals, and dry fruit accompaniments to honour lifelong bonds.",
  },
  {
    id: "prod_002",
    handle: "vedic-prosperity-wealth-attraction-rakhi",
    title: "Vedic Prosperity & Wealth Attraction Rakhi",
    subtitle: "Astrologically selected crystal, oyster shells & sacred mauli",
    price: 999,
    original_price: 1199,
    badge: "Prosperity",
    description:
      "Infused with astrological crystal resonance and sacred oceanic shells for abundance, vitality, and protective light.",
  },
  {
    id: "prod_003",
    handle: "vedic-abundance-blessing-rakhi",
    title: "Vedic Abundance & Blessing Rakhi",
    subtitle: "A keepsake designed to be treasured long after the festive hour",
    price: 999,
    original_price: 1199,
    badge: "Abundance",
    description:
      "Every knot woven with intention, invoking divine grace and cherished memories for brother and sister.",
  },
  {
    id: "prod_004",
    handle: "navagraha-om-protection-kaudi-rakhi",
    title: "Navagraha Om Protection Kaudi Rakhi",
    subtitle: "Sacred kaudis, Om motif & Navagraha-inspired planetary harmony",
    price: 1099,
    original_price: 1299,
    badge: "Sacred Shield",
    description:
      "Featuring nine-planet resonance, pure mauli weave, and Goddess Lakshmi's blessing symbols for supreme auspiciousness.",
  },
];

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://api.younoya.com";

export default function Home() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/v1/products`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setProducts(json.data);
        }
      })
      .catch((err) => console.error("Using cached fallback products:", err));
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {/* ========================================================
          HERO SECTION (YOUNOYA Authentic Hero with Video Background)
         ======================================================== */}
      <section className="relative w-full h-screen overflow-hidden flex items-end">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={BG_VIDEO}
        />

        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-black/35 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent z-10" />

        {/* Hero Content (Clean Bottom-Left Alignment) */}
        <div className="relative z-20 px-6 sm:px-12 pb-14 sm:pb-20 max-w-2xl text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 liquid-glass rounded-full text-xs font-semibold uppercase tracking-widest text-amber-300">
            <Sparkles size={13} />
            <span>Sacred Astrology & Vedic Blessings 2026</span>
          </div>

          <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight">
            YOUNOYA — Consecrated Vedic Rakhis & Sacred Gifting
          </h1>

          <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-lg font-light">
            Each Rakhi is astrologically energized with sacred Vedic mantras, oceanic kaudis, and protective crystals
            delivered with complimentary express shipping across India.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/checkout"
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs sm:text-sm font-bold uppercase tracking-wider px-7 py-3 rounded-full hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg"
            >
              Order Consecrated Set
            </Link>
            <Link
              href="#sacred-collection"
              className="liquid-glass text-white text-xs sm:text-sm font-medium px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              Explore Collection ↓
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          CONSECRATED VEDIC COLLECTION (Connected to MariaDB)
         ======================================================== */}
      <section
        id="sacred-collection"
        className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-24 space-y-12"
      >
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-amber-400 text-xs uppercase tracking-widest font-semibold font-mono">
            Handcrafted With Devotion
          </span>

          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Authentic Vedic Rakhi Collection
          </h2>

          <p className="text-white/60 text-sm leading-relaxed font-light">
            All designs include complimentary premium Roli & Chawal packets, sacred red-yellow mauli thread, and express doorstep delivery.
          </p>
        </div>

        {/* Structured 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div
              key={prod.id || prod.handle}
              className="liquid-glass rounded-2xl p-6 flex flex-col justify-between hover:bg-white/[0.03] transition-all group border border-white/10"
            >
              <div className="space-y-4">
                {/* Product Badge & Brand Card */}
                <div className="h-48 rounded-xl bg-gradient-to-b from-white/5 to-white/0 border border-white/5 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
                  <span className="absolute top-3 left-3 bg-amber-500/20 text-amber-300 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-amber-500/30">
                    {prod.badge}
                  </span>
                  <div className="text-2xl font-bold tracking-widest text-white/90 group-hover:scale-105 transition-transform duration-300">
                    YOUNOYA
                  </div>
                  <span className="text-[10px] text-white/40 mt-1 uppercase tracking-widest font-mono">
                    Consecrated Edition
                  </span>
                </div>

                {/* Subtitle */}
                <div className="text-xs text-amber-300 font-medium leading-relaxed">
                  {prod.subtitle}
                </div>

                {/* Product Title */}
                <h3 className="text-base font-semibold text-white line-clamp-2 leading-snug group-hover:text-amber-200 transition-colors">
                  <Link href={`/products/${prod.handle}`}>{prod.title}</Link>
                </h3>

                {/* Description */}
                <p className="text-xs text-white/50 line-clamp-2 leading-relaxed font-light">
                  {prod.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 pt-1">
                  <PriceDisplay amount={prod.price} className="text-xl font-bold text-amber-400" />
                  <span className="text-xs text-white/40 line-through">₹{prod.original_price}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                    Free Express
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <Link
                  href={`/products/${prod.handle}`}
                  className="block w-full text-center bg-white text-black text-xs font-bold uppercase tracking-wider py-3 rounded-full hover:bg-white/90 transition-colors shadow-md"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
