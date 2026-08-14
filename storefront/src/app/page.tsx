"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useScroll } from "framer-motion";
import { Sparkles, ChevronDown, ArrowRight, ShieldCheck, Flame, Compass } from "lucide-react";
import { FoldCard } from "@/components/ui/FoldCard";
import { Product } from "@/components/ui/ProductCard";

const BG_VIDEO =
  "https://7jpz6d1nkrer2cbv.public.blob.vercel-storage.com/new-ecom";

// Fallback initial products if offline or hydrating
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "1",
    handle: "vedic-prosperity-rakhi",
    sku: "YN-001",
    title: "Vedic Prosperity & Abundance Rakhi",
    subtitle: "Consecrated with 108 chants of the Gayatri Mantra to attract divine wealth, health, and familial harmony.",
    price: 999,
    original_price: 1199,
    badge: "Most Auspicious",
    images: ["/younoya_logo.png"],
    features: [
      "Natural Gomti Chakra Embedded",
      "108 Gayatri Chants Blessed",
      "Pure Resham Silk Thread",
      "Free Express Air Delivery"
    ]
  },
  {
    id: "2",
    handle: "navagraha-om-protection-kaudi-rakhi",
    sku: "YN-002",
    title: "Navagraha Om Protection Kaudi Rakhi",
    subtitle: "Harmonizes planetary doshas with natural Yellow Kaudi and authentic 5-Mukhi Indonesian Rudraksha.",
    price: 1299,
    original_price: 1599,
    badge: "Planetary Shield",
    images: ["/younoya_logo.png"],
    features: [
      "Natural Sacred Kaudi Shell",
      "Certified 5-Mukhi Rudraksha",
      "Planetary Dosha Harmonization",
      "Free Express Air Delivery"
    ]
  },
  {
    id: "3",
    handle: "vedic-abundance-blessing-rakhi",
    sku: "YN-003",
    title: "Vedic Abundance Blessing Rakhi",
    subtitle: "Energized during the auspicious Shravan Purnima Muhurat for long-term health, protection, and boundless grace.",
    price: 1099,
    original_price: 1399,
    badge: "Limited Edition",
    images: ["/younoya_logo.png"],
    features: [
      "Energized at Shravan Purnima",
      "Hand-braided Sacred Silk",
      "Consecration Certificate",
      "Zero-Password Express Checkout"
    ]
  }
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);

  // Fetch live products from backend
  useEffect(() => {
    fetch("https://api.younoya.com/api/v1/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          // Filter unhidden products
          const visible = data.data.filter((p: Product) => !p.is_hidden);
          if (visible.length > 0) {
            setProducts(visible);
          }
        }
      })
      .catch((e) => console.log("Using fallback consecrated collection:", e));
  }, []);

  // Track scroll progress across the folding cards container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scrollToCards = () => {
    containerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-full bg-[#07080E] text-[#FDFCF8] font-sans selection:bg-[#D4AF37] selection:text-[#07080E]">
      {/* 1. Fullscreen Cinematic Background Video (Pure Video — No Text Overlays) */}
      <section className="relative h-[100dvh] w-full overflow-hidden flex flex-col justify-between items-center px-4 select-none">
        {/* Responsive Background Video Player */}
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
          <video
            src={BG_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center md:object-top"
          />
          {/* Subtle bottom fade to transition seamlessly into the folding cards canvas */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#07080E] via-[#07080E]/60 to-transparent" />
        </div>

        {/* Top spacer (navigation space) */}
        <div className="h-20" />

        {/* Minimal Kinetic Scroll-Down Indicator */}
        <div className="relative z-10 pb-8 sm:pb-12 flex flex-col items-center gap-3">
          <button
            onClick={scrollToCards}
            className="group flex flex-col items-center gap-2 px-5 py-2.5 rounded-full bg-[#07080E]/70 backdrop-blur-xl border border-[#D4AF37]/30 text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#07080E]/90 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] font-bold">
              Scroll to Explore Consecrated Editions
            </span>
            <ChevronDown size={16} className="animate-bounce" />
          </button>
        </div>
      </section>

      {/* 2. Kinetic Scroll-Folding Cards Canvas */}
      <section ref={containerRef} className="relative w-full px-3 sm:px-8 py-16 sm:py-24 max-w-7xl mx-auto">
        {/* Section Header with Luminescence Tokens */}
        <div className="text-center space-y-4 mb-16 sm:mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#D4AF37]/30 text-[10px] sm:text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
            <Sparkles size={13} className="text-[#D4AF37]" />
            <span>AUTHENTIC VEDIC KEEPSAKES // 2026 EDITION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#FDFCF8] font-heading">
            Consecrated Sacred Editions
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-stone-300 leading-relaxed font-normal">
            Each sacred rakhi is energized with 108 Vedic Gayatri Chants by learned pandits.
            Experience the collection as each chapter unfolds.
          </p>
        </div>

        {/* Stacking / Folding Card Container */}
        <div className="relative space-y-24 sm:space-y-36 pb-32">
          {products.map((product, index) => (
            <FoldCard
              key={product.id}
              product={product}
              index={index}
              total={products.length}
              progress={scrollYProgress}
            />
          ))}
        </div>

        {/* Bottom Catalog Discovery Banner */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0E1017] to-[#141724] border border-[#D4AF37]/20 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-[#DC2626]/10 blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest font-bold">
              LOOKING FOR MORE SPIRITUAL KEEPSAKES?
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#FDFCF8]">
              Explore the Full YOUNOYA Catalog
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto">
              Browse our complete catalog of consecrated rakhis, natural gemstones, and ritual boxes with 100% Free Express Air Shipping.
            </p>
          </div>

          <div className="pt-2 relative z-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#FDFCF8] text-[#07080E] font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#D4AF37] hover:text-[#07080E] transition-all duration-300 shadow-[0_4px_25px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95"
            >
              <span>View All Products</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
