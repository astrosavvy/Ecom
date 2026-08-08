"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import PriceDisplay from "@/components/ui/PriceDisplay";

const RAKHI_PRODUCTS = [
  {
    handle: "vedic-prosperity-rakhi",
    title: "Vedic Prosperity Rakhi Set with Dry Fruits & Consecrated Thread",
    subtitle: "Sacred consecration for sibling grace and planetary harmony",
    price: 1099,
    originalPrice: 1299,
    badge: "Signature Essence",
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
    badge: "Keepsake",
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
  const quoteRef = useRef<HTMLDivElement>(null);
  const [parallaxState, setParallaxState] = useState({
    rainbowY: 120,
    cloudX: -200,
    cloudY: 0,
    cloudOpacity: 0,
  });

  useEffect(() => {
    let animId: number;
    let targetProgress = 0;
    let currentRainbowY = 120;
    let currentCloudX = -200;
    let currentCloudY = 0;
    let currentCloudOpacity = 0;

    const handleScroll = () => {
      if (!quoteRef.current) return;
      const rect = quoteRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalDist = windowHeight + rect.height;
      const current = windowHeight - rect.top;
      const p = Math.max(0, Math.min(1, current / totalDist));
      targetProgress = p;
    };

    const updateLoop = () => {
      // Lerp rainbow Y: moves from +120px to -160px
      const targetRainbowY = 120 - targetProgress * 280;
      currentRainbowY += (targetRainbowY - currentRainbowY) * 0.06;

      // Lerp cloud X & Opacity when in view (progress 0.12 - 0.92)
      let targetCloudX = -200;
      let targetOpacity = 0;
      if (targetProgress > 0.12 && targetProgress < 0.92) {
        targetCloudX = 0;
        targetOpacity = 1;
      }
      currentCloudX += (targetCloudX - currentCloudX) * 0.04;
      currentCloudOpacity += (targetOpacity - currentCloudOpacity) * 0.04;

      const targetCloudY = targetProgress * -50;
      currentCloudY += (targetCloudY - currentCloudY) * 0.04;

      setParallaxState({
        rainbowY: currentRainbowY,
        cloudX: currentCloudX,
        cloudY: currentCloudY,
        cloudOpacity: currentCloudOpacity,
      });

      animId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    animId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="bg-[#0a0608] text-white selection:bg-white selection:text-black overflow-hidden font-inter">
      {/* ========================================================
          SECTION 1: HERO (Full Viewport with Background Video)
         ======================================================== */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4"
        />

        {/* Dark Cinematic Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0608] via-transparent to-black/30 z-10" />

        {/* Center Content (Shifted up slightly) */}
        <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-5xl -mt-[80px] md:-mt-[120px]">
          <span className="font-dancing text-amber-200/90 text-2xl md:text-3xl mb-3 tracking-wider">
            Serene Presence
          </span>

          <h1 className="font-instrument text-white text-[36px] md:text-7xl lg:text-[110px] leading-[0.9] tracking-tight text-center text-glow font-normal">
            Gentle touch. Radiant presence.
          </h1>

          <p className="text-white/80 text-sm md:text-base text-center mt-5 md:mt-7 max-w-xl font-light leading-relaxed">
            Expert beauty and holistic wellness, delivered with warmth and intention.
          </p>

          <Link
            href="/checkout"
            className="mt-6 md:mt-9 bg-white text-black px-8 py-3.5 rounded-full font-medium text-sm tracking-wide hover:bg-white/90 transition-all duration-300 button-glow"
          >
            Begin your renewal
          </Link>
        </div>

        {/* Desktop Sound Indicator in Bottom-Left */}
        <div className="hidden md:flex items-center gap-3 absolute bottom-8 left-8 z-20">
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center liquid-glass">
            <span className="w-3 h-0.5 bg-white/80 animate-pulse" />
          </div>
          <div className="text-white/60 text-xs font-light tracking-wide leading-tight">
            <div>Experience</div>
            <div>with sound</div>
          </div>
        </div>

        {/* Subtle Scroll Prompt */}
        <div className="absolute bottom-6 right-8 z-20 text-white/40 text-xs tracking-widest uppercase hidden md:block">
          Scroll to explore ↓
        </div>
      </section>

      {/* ========================================================
          SECTION 2: QUOTE SECTION (Parallax Animated Layers)
         ======================================================== */}
      <section
        ref={quoteRef}
        className="relative w-full min-h-screen py-28 md:py-0 md:h-screen flex items-center justify-center overflow-hidden z-20"
        style={{
          background: "linear-gradient(180deg, #010A17 0%, #0A4267 30%, #20658E 60%, #6BADC4 100%)",
        }}
      >
        {/* Layer 1: Rainbow Image (Top Parallax) */}
        <div
          className="absolute inset-x-0 top-0 z-30 pointer-events-none will-change-transform"
          style={{
            transform: `translate3d(0, ${parallaxState.rainbowY}px, 0)`,
          }}
        >
          <img
            src="https://soft-zoom-63098134.figma.site/_assets/v11/8d520a7515d06cbfc403d0125e3d05b1a7ccd29c.png"
            alt="Ethereal Arc"
            className="w-full max-h-[550px] object-contain object-top opacity-90"
          />
        </div>

        {/* Layer 2: Left Cloud */}
        <div
          className="absolute left-0 bottom-[10%] z-10 pointer-events-none hidden sm:block will-change-transform"
          style={{
            marginLeft: "-25%",
            opacity: parallaxState.cloudOpacity,
            transform: `translate3d(${parallaxState.cloudX}px, ${parallaxState.cloudY}px, 0)`,
          }}
        >
          <img
            src="https://soft-zoom-63098134.figma.site/_assets/v11/0d6dfd3f90b930f21726f2ed56a3320d79b7a797.png"
            alt="Serene Cloud Left"
            className="w-[500px] md:w-[650px] object-contain opacity-80"
          />
        </div>

        {/* Layer 3: Right Cloud (Flipped) */}
        <div
          className="absolute right-0 bottom-[15%] z-10 pointer-events-none hidden sm:block will-change-transform"
          style={{
            marginRight: "-25%",
            opacity: parallaxState.cloudOpacity,
            transform: `translate3d(${-parallaxState.cloudX}px, ${parallaxState.cloudY}px, 0) scaleX(-1)`,
          }}
        >
          <img
            src="https://soft-zoom-63098134.figma.site/_assets/v11/0d6dfd3f90b930f21726f2ed56a3320d79b7a797.png"
            alt="Serene Cloud Right"
            className="w-[500px] md:w-[650px] object-contain opacity-80"
          />
        </div>

        {/* Layer 4: Quote Content */}
        <div className="relative z-20 max-w-4xl px-6 md:px-12 text-center text-white">
          <p className="font-instrument text-white text-xl sm:text-2xl md:text-4xl lg:text-[42px] leading-[1.45] md:leading-[1.5] italic font-normal tracking-wide text-glow">
            “Serene was founded on a belief in beauty that honors your nature. We pursue refined outcomes,
            considered approaches, and lasting vitality. We spend time learning what matters to you before deciding
            what serves you best. No rushing, no excess — just support that lets you feel radiant.”
          </p>

          <div className="mt-6 md:mt-8 text-white/80 text-sm md:text-base tracking-wide font-inter font-light">
            Dr. Mia Callahan — Founder
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: CONSECRATED VEDIC COLLECTION (Retained Data)
         ======================================================== */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12 relative z-20">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-block px-4 py-1.5 liquid-glass text-amber-300 rounded-full text-xs font-semibold uppercase tracking-widest">
            Vedic Astrology Sanctuary
          </span>
          <h2 className="text-3xl md:text-5xl font-instrument italic font-normal text-white tracking-wide">
            The Consecrated Rakhi Collection
          </h2>
          <p className="text-white/60 text-xs md:text-sm font-light leading-relaxed">
            Handcrafted with intentional Vedic crystals, sacred oyster elements, and pure consecrated mauli to invoke
            protection, prosperity, and timeless kinship.
          </p>
        </div>

        {/* Product Cards Grid in Serene Liquid Glass Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {RAKHI_PRODUCTS.map((prod) => (
            <div
              key={prod.handle}
              className="group liquid-glass rounded-3xl p-6 flex flex-col justify-between hover:border-white/30 hover:scale-[1.02] transition-all duration-500"
            >
              <div className="space-y-4">
                {/* Product Badge & Artwork Header */}
                <div className="relative h-56 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/5 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                  <span className="absolute top-3 left-3 bg-white/10 backdrop-blur-md text-amber-200 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border border-white/10">
                    {prod.badge}
                  </span>
                  <div className="font-dancing text-4xl text-amber-200/90 font-bold group-hover:scale-110 transition-transform duration-500">
                    YOUNOYA
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 mt-2 font-mono">
                    Sacred Edition
                  </span>
                </div>

                {/* Subtitle */}
                <div className="text-xs text-amber-300/80 font-instrument italic">
                  {prod.subtitle}
                </div>

                {/* Product Title */}
                <h3 className="font-instrument text-xl text-white line-clamp-2 leading-snug group-hover:text-amber-200 transition-colors">
                  <Link href={`/products/${prod.handle}`}>{prod.title}</Link>
                </h3>

                {/* Description */}
                <p className="text-xs text-white/60 line-clamp-2 font-light leading-relaxed">
                  {prod.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 pt-2">
                  <PriceDisplay amount={prod.price} className="text-2xl font-bold text-white font-instrument" />
                  <span className="text-xs text-white/40 line-through">₹{prod.originalPrice}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                    Complimentary Express Delivery
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <Link
                  href={`/products/${prod.handle}`}
                  className="block w-full text-center py-3 bg-white text-black text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-white/90 transition-all button-glow"
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
