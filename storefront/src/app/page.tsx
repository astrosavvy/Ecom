"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, Check, Star, ArrowRight, ShoppingBag, 
  Clock, Sparkles, Feather, HeartHandshake, Zap, X, Truck 
} from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { TestimonialMarquee } from "@/components/ui/TestimonialMarquee";
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
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addItem } = useCart();

  // Scarcity Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 42 });

  useEffect(() => {
    fetch("https://api.younoya.com/api/v1/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setProducts(data.data);
        }
      })
      .catch((e) => console.error("Error fetching live products from database API:", e));

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 30, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
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

    setAddedId(prod.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const spotlightProd = products[0];

  return (
    <div className="relative w-full min-h-screen bg-[#FDFCF8] text-[#1C1C1C] pt-32 pb-24">
      {/* ========================================================
          HERO SECTION (Clinical Luxury 32px Container)
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
        <div className="relative w-full rounded-[24px] sm:rounded-[40px] overflow-hidden bg-[#E8E6E1] border border-[#E2E8E4] p-5 sm:p-16 min-h-[65vh] sm:min-h-[75vh] flex flex-col justify-between shadow-sm">
          {/* Background Ambient Image Overlay - Bright Crisp Photography */}
          <div className="absolute inset-0 z-0 opacity-40 bg-[url('/younoya_hero_v3.jpg')] bg-cover bg-center pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
            {/* Urgency Indicator Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#DC2626] text-white text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider pulse-badge shadow-sm">
              <span>⚡ LIMITED CONSECRATION BATCH // 2026 EDITION</span>
            </div>

            {/* Typography: Heading mix of bold sans and italic serif */}
            <h1 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-[#1C1C1C] leading-[1.1] sm:leading-[1.05] tracking-tight">
              Consecrated Grace <br />
              <span className="font-serif italic font-normal text-[#D4AF37]">& Astrological Harmony</span>
            </h1>

            <p className="text-xs sm:text-lg text-stone-700 leading-relaxed max-w-xl font-normal">
              Authentic Vedic Rakhis, handcrafted with natural Gomti Chakras, Rudrakshas, and organic silk threads—energized with 108 Gayatri mantras for brotherly protection & wealth attraction.
            </p>

            {/* Action Buttons Stacked on Mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/products"
                className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#1C1C1C] text-white text-xs font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-lg hover:bg-[#333333] transition-all transform hover:scale-105"
              >
                <span>Shop Consecrated Collection</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/checkout"
                className="w-full sm:w-auto px-6 py-3.5 sm:px-7 sm:py-4 rounded-full bg-[#E2E8E4] text-[#1C1C1C] text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 hover:bg-[#D4DFD7] transition-all"
              >
                <ShoppingBag size={15} className="text-[#D4AF37]" />
                <span>Instant Express Checkout</span>
              </Link>
            </div>
          </div>

          {/* Glassmorphism Trust Badges Row at Bottom - Responsive Stack */}
          <div className="relative z-10 pt-8 sm:pt-12">
            <div className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-8 px-4 sm:px-6 py-3 rounded-2xl sm:rounded-full bg-white/85 backdrop-blur-[12px] border border-white/60 shadow-sm text-xs font-medium text-[#1C1C1C] w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#D4AF37] flex-shrink-0" />
                <span>108 Gayatri Mantras</span>
              </div>
              <div className="hidden sm:block text-stone-300">•</div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#D4AF37] flex-shrink-0" />
                <span>Natural Gomti Chakra</span>
              </div>
              <div className="hidden sm:block text-stone-300">•</div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-[#D4AF37] flex-shrink-0" />
                <span>100% Free Air Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          PRODUCT SPOTLIGHT (Split 50/50 Layout)
         ======================================================== */}
      {spotlightProd && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
          <div className="rounded-[40px] bg-white border border-[#E2E8E4] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center shadow-sm">
            {/* Left: Square Product Container (#E8E6E1 bg, 40px rounded) */}
            <div className="lg:col-span-6 relative aspect-square rounded-[32px] bg-[#E8E6E1] border border-[#E2E8E4] overflow-hidden flex items-center justify-center p-8">
              <img
                src={
                  Array.isArray(spotlightProd.images)
                    ? spotlightProd.images[0]
                    : typeof spotlightProd.images === "string" && spotlightProd.images
                    ? JSON.parse(spotlightProd.images)[0] || "https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800"
                    : "https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800"
                }
                alt={spotlightProd.title}
                className="w-full h-full object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-6 left-6 bg-[#DC2626] text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-md pulse-badge">
                {spotlightProd.badge || "BESTSELLER"}
              </span>
            </div>

            {/* Right: Detailed Copy & Differentiators */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono tracking-widest uppercase text-[#D4AF37] font-bold">
                  FEATURED SPOTLIGHT
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#1C1C1C] leading-tight">
                  {spotlightProd.title}
                </h2>
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-3xl font-extrabold font-mono text-[#1C1C1C]">₹{spotlightProd.price}</span>
                  {spotlightProd.original_price > spotlightProd.price && (
                    <>
                      <span className="text-sm text-stone-400 line-through">₹{spotlightProd.original_price}</span>
                      <span className="text-xs font-bold text-emerald-700 bg-[#E2E8E4] px-2.5 py-0.5 rounded-full">
                        Save ₹{spotlightProd.original_price - spotlightProd.price}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-base text-stone-600 leading-relaxed font-normal">
                {spotlightProd.description || "An authentic consecrated Vedic Rakhi set energized with 108 Gayatri mantras."}
              </p>

              {/* Differentiators Checkmark List */}
              <div className="space-y-3 pt-2 border-t border-[#E2E8E4]">
                <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#1C1C1C]">
                  <div className="w-5 h-5 rounded-full bg-[#E2E8E4] text-[#1C1C1C] flex items-center justify-center flex-shrink-0">
                    <Check size={13} className="stroke-[3]" />
                  </div>
                  <span>Prana Pratishtha Consecration by Vedic Pandits</span>
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#1C1C1C]">
                  <div className="w-5 h-5 rounded-full bg-[#E2E8E4] text-[#1C1C1C] flex items-center justify-center flex-shrink-0">
                    <Check size={13} className="stroke-[3]" />
                  </div>
                  <span>Natural Astrological Elements (Gomti Chakra, Kaudi, Rudraksha)</span>
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#1C1C1C]">
                  <div className="w-5 h-5 rounded-full bg-[#E2E8E4] text-[#1C1C1C] flex items-center justify-center flex-shrink-0">
                    <Check size={13} className="stroke-[3]" />
                  </div>
                  <span>Complete Keepsake Box with Almonds, Cashews & Roli-Chawal</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/products/${spotlightProd.handle}`}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#1C1C1C] text-white text-xs font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-2 hover:bg-[#333333] transition-all transform hover:scale-105 shadow-md"
                >
                  <span>Claim Bestseller Rakhi</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          PRODUCTS CATALOG GRID (32px Clinical Cards)
         ======================================================== */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-8 py-16 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="text-xs font-mono tracking-widest uppercase text-[#D4AF37] font-bold">
              SACRED COLLECTION
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#1C1C1C]">
              Astrologically Consecrated Rakhis
            </h2>
            <p className="text-sm text-stone-600 max-w-lg">
              Each creation is individually energized for sibling protection, prosperity, and planetary harmony.
            </p>
          </div>

          <Link
            href="/products"
            className="px-6 py-3 rounded-full bg-[#E2E8E4] text-[#1C1C1C] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 hover:bg-[#D4DFD7] transition-all self-start md:self-auto"
          >
            <span>Explore All Products</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => {
            const prodImgs: string[] = Array.isArray(prod.images)
              ? prod.images
              : (typeof prod.images === "string" ? JSON.parse(prod.images || "[]") : []);
            const thumb = prodImgs[0] || "https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800";

            return (
              <div
                key={prod.id}
                className="clinical-card p-6 flex flex-col justify-between space-y-5"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#E8E6E1] border border-[#E2E8E4]">
                  <img
                    src={thumb}
                    alt={prod.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {prod.badge && (
                    <span className="absolute top-3 left-3 bg-[#1C1C1C] text-white text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-md shadow-sm">
                      {prod.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Link href={`/products/${prod.handle}`}>
                    <h3 className="text-sm font-bold font-heading text-[#1C1C1C] hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug">
                      {prod.title}
                    </h3>
                  </Link>
                  <p className="text-[11px] text-stone-500 line-clamp-1">
                    {prod.subtitle}
                  </p>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-lg font-extrabold font-mono text-[#1C1C1C]">₹{prod.price}</span>
                    <span className="text-xs text-stone-400 line-through">₹{prod.original_price}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleAddToCart(prod)}
                    className="py-2.5 rounded-full bg-[#E2E8E4] text-[#1C1C1C] text-xs font-bold hover:bg-[#D4DFD7] transition-colors flex items-center justify-center gap-1"
                  >
                    {addedId === prod.id ? (
                      <>
                        <Check size={13} className="text-emerald-700" />
                        <span className="text-emerald-700">Added</span>
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
                    className="py-2.5 rounded-full bg-[#1C1C1C] text-white text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center hover:bg-[#333333] transition-colors"
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
          COMPARISON SECTION (3-Column Grid Table, 30px rounded)
         ======================================================== */}
      <section id="comparison" className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="rounded-[32px] bg-white border border-[#E2E8E4] p-8 sm:p-12 space-y-10 shadow-sm">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="text-xs font-mono tracking-widest uppercase text-[#D4AF37] font-bold">
              WHY CHOOSE YOUNOYA
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#1C1C1C]">
              Vedic Heritage vs. Generic Market Rakhis
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Compare our authentic astrology-consecrated keepsakes against ordinary mass-produced threads.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8E4]">
                  <th className="py-4 px-4 font-extrabold font-heading text-[#1C1C1C]">Feature Comparison</th>
                  <th className="py-4 px-4 font-extrabold font-heading text-[#1C1C1C] bg-[#E2E8E4]/50 rounded-t-xl text-center">
                    YOUNOYA Vedic Rakhis
                  </th>
                  <th className="py-4 px-4 font-medium text-stone-400 text-center">Generic Market Rakhis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E4]/60">
                <tr>
                  <td className="py-4 px-4 font-semibold text-[#1C1C1C]">108-Mantra Gayatri Consecration</td>
                  <td className="py-4 px-4 text-center bg-[#E2E8E4]/20 font-bold text-emerald-700">
                    <Check size={18} className="mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center text-stone-400">
                    <X size={18} className="mx-auto text-red-400" />
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-semibold text-[#1C1C1C]">Natural Gemstones (Gomti Chakra / Kaudi / Rudraksha)</td>
                  <td className="py-4 px-4 text-center bg-[#E2E8E4]/20 font-bold text-emerald-700">
                    <Check size={18} className="mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center text-stone-400">
                    <X size={18} className="mx-auto text-red-400" />
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-semibold text-[#1C1C1C]">Complimentary Organic Roli, Akshat & Dry Fruits</td>
                  <td className="py-4 px-4 text-center bg-[#E2E8E4]/20 font-bold text-emerald-700">
                    <Check size={18} className="mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center text-stone-400">
                    <X size={18} className="mx-auto text-red-400" />
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-semibold text-[#1C1C1C]">Zero-Password Instant 1-Click Checkout</td>
                  <td className="py-4 px-4 text-center bg-[#E2E8E4]/20 font-bold text-emerald-700">
                    <Check size={18} className="mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center text-stone-400">
                    <X size={18} className="mx-auto text-red-400" />
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-semibold text-[#1C1C1C]">100% Free Express Air Shipping Across India</td>
                  <td className="py-4 px-4 text-center bg-[#E2E8E4]/20 font-bold text-emerald-700 rounded-b-xl">
                    <Check size={18} className="mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center text-stone-400">
                    <X size={18} className="mx-auto text-red-400" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================
          BENEFIT ICON CARDS (Hover background transition)
         ======================================================== */}
      <section id="rituals" className="max-w-7xl mx-auto px-4 sm:px-8 py-16 space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="text-xs font-mono tracking-widest uppercase text-[#D4AF37] font-bold">
            THE VEDIC ASSURANCE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#1C1C1C]">
            Crafted for Kinship & Divine Favor
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="benefit-card flex flex-col justify-between space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#E2E8E4] flex items-center justify-center text-[#1C1C1C] icon-box">
              <ShieldCheck size={28} className="text-[#D4AF37]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-heading text-[#1C1C1C]">Vedic Consecration</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                Recited with 108 Gayatri mantras by traditional pandits to invoke planetary shielding and long life for brothers.
              </p>
            </div>
          </div>

          <div className="benefit-card flex flex-col justify-between space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#F0E6D8] flex items-center justify-center text-[#1C1C1C] icon-box">
              <Sparkles size={28} className="text-[#D4AF37]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-heading text-[#1C1C1C]">Sacred Organic Materials</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                Natural Gomti Chakras, certified yellow Kaudis, 5 Mukhi Rudrakshas, and organic sacred silk threads.
              </p>
            </div>
          </div>

          <div className="benefit-card flex flex-col justify-between space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#E6E0F0] flex items-center justify-center text-[#1C1C1C] icon-box">
              <HeartHandshake size={28} className="text-[#D4AF37]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-heading text-[#1C1C1C]">Complimentary Puja Kit</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                Includes organic Chandan, auspicious Akshat, fresh Roli, and optional California dry fruits inside a keepsake box.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SOCIAL PROOF GRID & DEVOTEE REVIEWS
         ======================================================== */}
      <TestimonialMarquee />

      {/* ========================================================
          FINAL SCARCITY CTA & COUNTDOWN TIMER (Sage Green Container)
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="rounded-[40px] bg-[#E2E8E4] border border-[#C2D6C2] p-10 sm:p-16 text-center space-y-8 shadow-sm">
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-[#DC2626] text-white text-[10px] font-extrabold uppercase tracking-wider pulse-badge">
              <span>⚡ HIGH DEMAND // BATCH CLOSING SOON</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#1C1C1C] tracking-tight leading-tight">
              Reserve Your Consecrated Rakhi Today
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
              Morning consecration batch slots are filling fast. Order now to guarantee same-day energization and free air shipping.
            </p>
          </div>

          {/* Countdown Timer Component in Monospaced Font */}
          <div className="flex items-center justify-center gap-3 font-mono">
            <div className="px-4 py-3 rounded-2xl bg-[#1C1C1C] text-white text-center min-w-[70px]">
              <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, "0")}</div>
              <div className="text-[9px] uppercase tracking-wider text-stone-400">HOURS</div>
            </div>
            <span className="text-2xl font-bold text-[#1C1C1C]">:</span>
            <div className="px-4 py-3 rounded-2xl bg-[#1C1C1C] text-white text-center min-w-[70px]">
              <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, "0")}</div>
              <div className="text-[9px] uppercase tracking-wider text-stone-400">MINS</div>
            </div>
            <span className="text-2xl font-bold text-[#1C1C1C]">:</span>
            <div className="px-4 py-3 rounded-2xl bg-[#1C1C1C] text-white text-center min-w-[70px]">
              <div className="text-2xl font-bold text-[#D4AF37]">{String(timeLeft.seconds).padStart(2, "0")}</div>
              <div className="text-[9px] uppercase tracking-wider text-stone-400">SECS</div>
            </div>
          </div>

          {/* Primary Action Button with Shield Check */}
          <div className="pt-2">
            <Link
              href="/checkout"
              className="px-10 py-5 rounded-full bg-[#1C1C1C] text-white text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-2 shadow-xl hover:bg-[#333333] transition-all transform hover:scale-105"
            >
              <ShieldCheck size={18} className="text-[#D4AF37]" />
              <span>Claim Consecrated Rakhi Now</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Persistent Mobile Sticky Cart */}
      <MobileStickyCart />
    </div>
  );
}
