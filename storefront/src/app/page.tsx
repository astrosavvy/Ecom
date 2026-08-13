"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { VideoBackground } from "@/components/ui/VideoBackground";
import { ProductCard } from "@/components/ui/ProductCard";
import { MobileStickyCart } from "@/components/ui/MobileStickyCart";

interface Product {
  id: string;
  handle: string;
  sku: string;
  title: string;
  subtitle: string;
  price: number;
  original_price: number;
  badge: string;
  description: string;
  images: string[] | string;
  features: string[] | string;
  is_hidden?: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { totalItems } = useCart();

  useEffect(() => {
    fetch("https://api.younoya.com/api/v1/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setProducts(data.data);
        }
      })
      .catch((e) => console.error("Error fetching live products:", e));
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-white text-[#000000] overflow-hidden selection:bg-black selection:text-white">
      {/* ========================================================
          BACKGROUND VIDEO LAYER (z-0)
         ======================================================== */}
      <VideoBackground />

      {/* ========================================================
          CINEMATIC HERO SECTION (z-10)
         ======================================================== */}
      <section
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-40"
        style={{ paddingTop: "calc(10rem - 40px)" }}
      >
        {/* Main Headline */}
        <h1
          className="font-serif text-5xl sm:text-7xl md:text-8xl font-normal max-w-7xl text-[#000000] animate-fade-rise select-none"
          style={{
            lineHeight: 0.95,
            letterSpacing: "-2.46px",
            fontFamily: "'Instrument Serif', Georgia, serif",
          }}
        >
          Beyond <span className="italic text-[#6F6F6F]">silence,</span> we build{" "}
          <span className="italic text-[#6F6F6F]">the eternal.</span>
        </h1>

        {/* Description */}
        <p className="font-sans text-base sm:text-lg max-w-2xl mt-8 text-[#6F6F6F] leading-relaxed animate-fade-rise-delay">
          Building platforms for brilliant minds, fearless makers, and thoughtful
          souls. Through the noise, we craft digital havens for deep work and pure
          flows.
        </p>

        {/* Hero CTA Button */}
        <Link
          href="/products"
          className="rounded-full px-14 py-5 text-base font-sans font-normal mt-12 bg-[#000000] text-[#FFFFFF] hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200 animate-fade-rise-delay-2 cursor-pointer shadow-md inline-flex items-center justify-center gap-2"
        >
          <span>Begin Journey</span>
        </Link>
      </section>

      {/* ========================================================
          CURATED CATALOG COLLECTION (Minimalist Luxury)
         ======================================================== */}
      {products.length > 0 && (
        <section id="collection" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 border-t border-black/5 bg-white/90 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <div className="text-xs font-mono tracking-widest uppercase text-[#6F6F6F]">
                CURATED COLLECTION
              </div>
              <h2
                className="text-3xl sm:text-5xl font-serif text-[#000000]"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
              >
                Signature Editions
              </h2>
            </div>

            <Link
              href="/products"
              className="text-xs font-sans font-medium text-[#6F6F6F] hover:text-[#000000] inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Explore Full Catalog</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          PHILOSOPHY & CRAFT SECTION
         ======================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-24 border-t border-black/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4 p-8 rounded-3xl bg-[#FAFAFA] border border-black/5">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center">
              <Sparkles size={22} />
            </div>
            <h3
              className="text-2xl font-serif text-[#000000]"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Timeless Aesthetics
            </h3>
            <p className="text-sm font-sans text-[#6F6F6F] leading-relaxed">
              Every detail is meticulously crafted to eliminate distraction, elevating focus and harmony across all digital touchpoints.
            </p>
          </div>

          <div className="space-y-4 p-8 rounded-3xl bg-[#FAFAFA] border border-black/5">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <h3
              className="text-2xl font-serif text-[#000000]"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Zero-Password Flow
            </h3>
            <p className="text-sm font-sans text-[#6F6F6F] leading-relaxed">
              Instant authentication powered exclusively by one-click email OTP. Frictionless checkout built for modern speed.
            </p>
          </div>

          <div className="space-y-4 p-8 rounded-3xl bg-[#FAFAFA] border border-black/5">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center">
              <HeartHandshake size={22} />
            </div>
            <h3
              className="text-2xl font-serif text-[#000000]"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Pure Craftsmanship
            </h3>
            <p className="text-sm font-sans text-[#6F6F6F] leading-relaxed">
              Designed for thoughtful souls and fearless creators, delivering exceptional quality from first click to unboxing.
            </p>
          </div>
        </div>
      </section>

      {/* Persistent Mobile Sticky Cart */}
      {totalItems > 0 && <MobileStickyCart />}
    </div>
  );
}
