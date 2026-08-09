"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TestimonialMarquee } from "@/components/ui/TestimonialMarquee";
import { useCart } from "@/lib/CartContext";
import { 
  ArrowRight, Sparkles, ShieldCheck, HeartHandshake, Feather, 
  ShoppingBag, Check, Star, RefreshCw, Truck, Zap 
} from "lucide-react";

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
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "prod_1",
    handle: "vedic-prosperity-rakhi",
    sku: "HOFK0009275279",
    title: "Vedic Prosperity Rakhi Set with Dry Fruits & Consecrated Thread",
    subtitle: "Sacred consecration for sibling grace and planetary harmony",
    price: 1099,
    original_price: 1299,
    badge: "Signature Edition",
    description: "An authentic consecrated Vedic Rakhi energized with sacred mantras, hand-threaded with Resham, accompanied by premium California almonds and sacred Akshat-Roli.",
    images: ["https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800"],
    features: ["Prana Pratishtha Consecration", "Sacred Resham & Gold Wire", "Includes Roli, Chawal & Dry Fruits"]
  },
  {
    id: "prod_2",
    handle: "vedic-prosperity-wealth-attraction-rakhi",
    sku: "HOFK0009275280",
    title: "Vedic Prosperity & Wealth Attraction Rakhi",
    subtitle: "Astrologically selected crystal, oyster shells & sacred mauli",
    price: 989,
    original_price: 1199,
    badge: "Prosperity",
    description: "Handcrafted with natural Gomti Chakra and energized yellow Kaudi, dedicated to invoking Goddess Lakshmi's perpetual blessings for brothers.",
    images: ["https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800"],
    features: ["Natural Gomti Chakra", "Yellow Kaudi Shell", "Energized by Vedic Pandits"]
  },
  {
    id: "prod_3",
    handle: "vedic-abundance-blessing-rakhi",
    sku: "HOFK0009275281",
    title: "Vedic Abundance & Blessing Rakhi",
    subtitle: "A keepsake designed to be treasured long after the festive hour",
    price: 999,
    original_price: 1199,
    badge: "Abundance",
    description: "Created using pure silver-plated motifs and blessed Rudraksha beads for health, vitality, and shielding negative energies.",
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"],
    features: ["5 Mukhi Rudraksha Bead", "Silver-Plated Centerpiece", "100% Organic Silk Threads"]
  },
  {
    id: "prod_4",
    handle: "navagraha-om-protection-kaudi-rakhi",
    sku: "HOFK0009275282",
    title: "Navagraha Om Protection Kaudi Rakhi",
    subtitle: "Sacred kaudi, Om motif & Navagraha-inspired planetary harmony",
    price: 1099,
    original_price: 1299,
    badge: "Sacred Shield",
    description: "Harmonizes the 9 astrological planets with 9 colored sacred silk threads and a central energized brass Om talisman.",
    images: ["https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800"],
    features: ["9 Astrological Silk Strands", "Pure Brass Om Talisman", "Planetary Shielding Blessing"]
  }
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    fetch("https://api.younoya.com/api/v1/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          setProducts(data.data.slice(0, 4));
        }
      })
      .catch((e) => console.log("Using cached items:", e));
  }, []);

  const handleAddToCart = (prod: Product) => {
    const prodImgs: string[] = Array.isArray(prod.images)
      ? prod.images
      : (typeof prod.images === "string" ? JSON.parse(prod.images || "[]") : []);
    const img = prodImgs[0] || "https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800";

    addItem({
      id: prod.id,
      handle: prod.handle,
      title: prod.title,
      subtitle: prod.subtitle,
      price: prod.price,
      original_price: prod.original_price,
      image: img
    });

    setAddedItem(prod.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  const rituals = [
    {
      num: "01",
      icon: <ShieldCheck size={22} className="text-amber-400" />,
      title: "Prana Pratishtha Consecration",
      desc: "Each Rakhi undergoes authentic Vedic rituals recited with 108 Gayatri mantras to invoke planetary protection."
    },
    {
      num: "02",
      icon: <Sparkles size={22} className="text-cyan-400" />,
      title: "Sacred Vedic Elements",
      desc: "Handcrafted using certified natural Kaudis, Gomti Chakras, Rudrakshas, and organic sacred Mauli threads."
    },
    {
      num: "03",
      icon: <HeartHandshake size={22} className="text-pink-400" />,
      title: "Complete Puja Keepsake Box",
      desc: "Accompanied by consecrated Akshat, organic Chandan, premium Roli, and optional California dry fruits."
    }
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#0c0d12] text-[#edf1f8] overflow-hidden">
      {/* Atmospheric Ambient Glows */}
      <div className="absolute top-[-10%] right-[5%] w-[680px] h-[680px] rounded-full bg-[#2e63ff]/18 blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[12%] right-[22%] w-[540px] h-[540px] rounded-full bg-[#ff2e88]/15 blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[28%] right-[2%] w-[580px] h-[580px] rounded-full bg-[#25e0ff]/15 blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[65%] left-[-8%] w-[680px] h-[680px] rounded-full bg-[#2e63ff]/12 blur-[170px] pointer-events-none z-0" />

      {/* ========================================================
          HERO SECTION (Two-Column Split)
         ======================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 pt-32 sm:pt-40 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[85vh]">
        {/* Left Column: Hero Text Stack */}
        <div className="lg:col-span-7 space-y-7 text-left">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/12 text-[11px] font-mono tracking-[0.16em] uppercase text-stone-200 backdrop-blur-md shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c6ff3d] shadow-[0_0_10px_#c6ff3d] animate-pulse" />
            <span>VEDIC CONSECRATION // 2026 EDITION</span>
          </div>

          {/* Liquid Chrome Headline */}
          <h1 className="hero-headline font-bold chrome-text">
            Consecrated in. <br />
            Grace out.
          </h1>

          {/* Subhead */}
          <p className="text-[#9ca6be] text-base sm:text-lg leading-relaxed max-w-[520px] font-normal">
            Sacred <strong className="text-white font-medium">astrology-consecrated Rakhis</strong> and Vedic ritual keepsakes, crafted with natural gemstones and energized for <strong className="text-white font-medium">planetary harmony & sibling prosperity</strong>.
          </p>

          {/* Dual Aero CTAs (Primary Hero CTA Redirects to /products) */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/products"
              className="aero-btn-primary text-white text-sm font-semibold px-7 py-3.5 rounded-full uppercase tracking-wider flex items-center gap-2"
            >
              <span>Explore Consecrated Rakhis</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/checkout"
              className="aero-btn-secondary text-stone-200 text-sm font-medium px-6 py-3.5 rounded-full flex items-center gap-2 hover:text-white"
            >
              <ShoppingBag size={15} className="text-amber-400" />
              <span>Instant Express Buy</span>
            </Link>
          </div>

          {/* Trust Line */}
          <div className="flex items-center gap-4 pt-4 text-xs text-[#9ca6be]">
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star size={14} className="fill-current" />
              <Star size={14} className="fill-current" />
              <Star size={14} className="fill-current" />
              <Star size={14} className="fill-current" />
              <Star size={14} className="fill-current" />
            </div>
            <div>
              100% Free Express Air Delivery across India • <span className="text-stone-200">14,000+ Blessed Rakhis Shipped</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Rotating Planet Sphere on Axis + Floating YOUNOYA Monogram */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-6 [perspective:1000px]">
          {/* Sparkles */}
          <div className="absolute top-[12%] right-[15%] text-white animate-bounce pointer-events-none z-20">
            <Sparkles size={26} className="text-[#25e0ff] drop-shadow-[0_0_14px_#25e0ff]" />
          </div>
          <div className="absolute bottom-[25%] left-[10%] text-white pointer-events-none animate-pulse z-20">
            <Sparkles size={20} className="text-[#ff2e88] drop-shadow-[0_0_14px_#ff2e88]" />
          </div>

          {/* Planet Sphere Rotating on Axis */}
          <div className="chrome-orb-sphere group cursor-pointer flex items-center justify-center">
            <div className="chrome-orb-specular" />
            <div className="chrome-orb-horizon" />
            <div className="chrome-orb-rim" />
            
            {/* Center Monogram Insignia Floating in 3D Levitation Effect */}
            <div className="relative z-10 w-28 h-28 chrome-orb-emblem-3d">
              <img
                src="/younoya_icon.png"
                alt="YOUNOYA Monogram"
                className="w-full h-full object-contain filter drop-shadow-[0_0_24px_rgba(255,200,60,0.85)]"
              />
            </div>
          </div>

          {/* Ground Reflection Shadow */}
          <div className="chrome-orb-shadow" />
        </div>
      </section>

      {/* ========================================================
          TRUST STRIP (Vedic Assurance)
         ======================================================== */}
      <section className="w-full border-y border-white/10 bg-[#10131f]/80 backdrop-blur-md py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-xs font-mono tracking-wider text-stone-200">
            <ShieldCheck size={18} className="text-amber-400" />
            <span>108-MANTRA CONSECRATION</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono tracking-wider text-stone-200">
            <Truck size={18} className="text-cyan-400" />
            <span>FREE EXPRESS AIR SHIPPING</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono tracking-wider text-stone-200">
            <Zap size={18} className="text-pink-400" />
            <span>ZERO-PASSWORD INSTANT CHECKOUT</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono tracking-wider text-stone-200">
            <Feather size={18} className="text-emerald-400" />
            <span>NATURAL ORGANIC SILK & KAUDI</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          INTERACTIVE PRODUCTS SHOWCASE
         ======================================================== */}
      <section id="products" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-28 space-y-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="text-xs font-mono tracking-[0.18em] uppercase text-[#25e0ff]">
              SACRED COLLECTION
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-space text-white tracking-tight">
              Astrologically Consecrated Rakhis
            </h2>
            <p className="text-sm text-[#9ca6be] max-w-lg">
              Each piece is individually energized with Vedic mantras, crafted with pure natural gemstones, and delivered in a gift keepsake box.
            </p>
          </div>

          {/* Links directly to All Products catalog */}
          <Link
            href="/products"
            className="aero-btn-secondary text-stone-200 text-xs font-medium px-6 py-3 rounded-full inline-flex items-center gap-2 self-start md:self-auto hover:text-white"
          >
            <span>Explore All Products</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => {
            const prodImgs: string[] = Array.isArray(prod.images)
              ? prod.images
              : (typeof prod.images === "string" ? JSON.parse(prod.images || "[]") : []);
            const thumb = prodImgs[0] || "https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800";

            return (
              <div
                key={prod.id}
                className="chrome-card rounded-2xl p-5 flex flex-col justify-between space-y-5 group"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/12">
                  <img
                    src={thumb}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  {prod.badge && (
                    <span className="absolute top-3 left-3 bg-black/85 backdrop-blur-md text-amber-300 text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border border-amber-400/35 shadow-lg">
                      {prod.badge}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <Link href={`/products/${prod.handle}`} className="block">
                    <h3 className="text-sm font-bold font-space text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                      {prod.title}
                    </h3>
                  </Link>
                  <p className="text-[11px] text-[#9ca6be] line-clamp-1">
                    {prod.subtitle}
                  </p>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-lg font-bold font-space text-white">
                      ₹{prod.price}
                    </span>
                    <span className="text-xs text-stone-500 line-through">
                      ₹{prod.original_price}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium ml-auto">
                      Save ₹{prod.original_price - prod.price}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleAddToCart(prod)}
                    className="py-2.5 rounded-xl aero-btn-secondary text-stone-200 text-xs font-semibold hover:text-white flex items-center justify-center gap-1.5"
                  >
                    {addedItem === prod.id ? (
                      <>
                        <Check size={13} className="text-emerald-400" />
                        <span className="text-emerald-400">Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={13} />
                        <span>Add</span>
                      </>
                    )}
                  </button>

                  <Link
                    href="/checkout"
                    onClick={() => handleAddToCart(prod)}
                    className="py-2.5 rounded-xl aero-btn-primary text-white text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          INFINITE MARQUEE TESTIMONIALS (Alpha Masked)
         ======================================================== */}
      <TestimonialMarquee />

      {/* ========================================================
          CONSECRATION RITUALS FEATURE TRIO
         ======================================================== */}
      <section id="rituals" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-28 space-y-16">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="text-xs font-mono tracking-[0.18em] uppercase text-[#ff2e88]">
            THE VEDIC PROMISE
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-space text-white tracking-tight">
            Crafted for Kinship & Sacred Protection
          </h2>
          <p className="text-sm text-[#9ca6be] leading-relaxed">
            Unlike mass-produced commercial threads, each YOUNOYA creation is an auspicious spiritual anchor.
          </p>
        </div>

        {/* 3-Up Feature Trio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rituals.map((item) => (
            <div
              key={item.num}
              className="chrome-card rounded-2xl p-8 flex flex-col justify-between space-y-8"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-white/20 to-white/5 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] flex items-center justify-center">
                  {item.icon}
                </div>

                <span className="font-mono text-xs text-[#9ca6be] tracking-widest font-semibold">
                  {item.num}
                </span>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-lg font-bold font-space text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#9ca6be] leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
