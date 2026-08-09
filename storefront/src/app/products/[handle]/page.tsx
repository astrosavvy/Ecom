"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronRight, Star, Truck, ShieldCheck, Check, ShoppingBag, 
  RefreshCw, MapPin, Loader2, Award, Heart 
} from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { StickyConversionBar } from "@/components/ui/StickyConversionBar";

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

const FALLBACK_PRODUCT_MAP: Record<string, Product> = {
  "vedic-prosperity-rakhi": {
    id: "prod_1",
    handle: "vedic-prosperity-rakhi",
    sku: "HOFK0009275279",
    title: "Vedic Prosperity Rakhi Set with Dry Fruits & Consecrated Thread",
    subtitle: "Sacred consecration for sibling grace and planetary harmony",
    price: 1099,
    original_price: 1299,
    badge: "Signature",
    description: "In cherished traditions, this designer handcrafted Vedic Rakhi set in vibrant colors tells a story of elegance and affection. Each intricately crafted rakhi celebrates the unique bond between siblings. The artful beadwork and rich colors make this an exquisite and memorable Raksha Bandhan gift.\n\nEnergized with 108 Gayatri mantra recitations to invite celestial prosperity, abundance, and planetary harmony.",
    images: [
      "https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800"
    ],
    features: [
      "Prana Pratishtha Consecration Ritual",
      "Organic Sacred Resham & Gold Wire Threading",
      "Signature Reusable Keepsake Box",
      "100 Gm California Jumbo Almonds",
      "100 Gm W240 Premium Cashews",
      "Complimentary Consecrated Akshat & Roli Packets"
    ]
  },
  "vedic-prosperity-wealth-attraction-rakhi": {
    id: "prod_2",
    handle: "vedic-prosperity-wealth-attraction-rakhi",
    sku: "HOFK0009275280",
    title: "Vedic Prosperity & Wealth Attraction Rakhi",
    subtitle: "Astrologically selected crystal, oyster shells & sacred mauli",
    price: 989,
    original_price: 1199,
    badge: "Prosperity",
    description: "Handcrafted with natural Gomti Chakra and energized yellow Kaudi shells, dedicated to invoking Goddess Lakshmi's perpetual blessings for brothers. Formatted in timeless sacred red-yellow Mauli threads to protect against malefic energies.",
    images: [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800"
    ],
    features: [
      "Natural Consecrated Gomti Chakra: 1 N",
      "Yellow Energized Kaudi Shell",
      "Sacred Red-Yellow Mauli Thread",
      "Complimentary Roli & Chawal Packets"
    ]
  },
  "vedic-abundance-blessing-rakhi": {
    id: "prod_3",
    handle: "vedic-abundance-blessing-rakhi",
    sku: "HOFK0009275281",
    title: "Vedic Abundance & Blessing Rakhi",
    subtitle: "A keepsake designed to be treasured long after the festive hour",
    price: 999,
    original_price: 1199,
    badge: "Abundance",
    description: "Created using pure silver-plated motifs and blessed Rudraksha beads for health, vitality, and shielding negative energies.",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800"
    ],
    features: [
      "5 Mukhi Blessed Rudraksha Bead",
      "Silver-Plated Centerpiece Talisman",
      "100% Organic Silk Threads",
      "Complimentary Roli & Chawal Packets"
    ]
  },
  "navagraha-om-protection-kaudi-rakhi": {
    id: "prod_4",
    handle: "navagraha-om-protection-kaudi-rakhi",
    sku: "HOFK0009275282",
    title: "Navagraha Om Protection Kaudi Rakhi",
    subtitle: "Sacred kaudi, Om motif & Navagraha-inspired planetary harmony",
    price: 1099,
    original_price: 1299,
    badge: "Sacred Shield",
    description: "Harmonizes the 9 astrological planets with 9 colored sacred silk threads and a central energized brass Om talisman. Shields against planetary afflictions.",
    images: [
      "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800"
    ],
    features: [
      "9 Astrological Planetary Silk Strands",
      "Pure Brass Energized Om Talisman",
      "Natural Sacred Kaudi Shell Detailing",
      "Complimentary Roli & Chawal Packets"
    ]
  }
};

const RELATED_PRODUCTS = [
  {
    handle: "vedic-prosperity-rakhi",
    title: "Vedic Prosperity Rakhi Set",
    category: "Signature Keepsake",
    price: 1099,
    image: "https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800",
    badge: "Signature"
  },
  {
    handle: "vedic-prosperity-wealth-attraction-rakhi",
    title: "Wealth Attraction Kaudi Rakhi",
    category: "Gomti Chakra",
    price: 989,
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800",
    badge: "Prosperity"
  },
  {
    handle: "vedic-abundance-blessing-rakhi",
    title: "Abundance Rudraksha Rakhi",
    category: "Silver Plated",
    price: 999,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    badge: "Abundance"
  },
  {
    handle: "navagraha-om-protection-kaudi-rakhi",
    title: "Navagraha Om Protection Rakhi",
    category: "Planetary Thread",
    price: 1099,
    image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800",
    badge: "Shield"
  }
];

export default function DynamicMonochromeProductPage() {
  const params = useParams();
  const router = useRouter();
  const handle = (params?.handle as string) || "vedic-prosperity-rakhi";
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product>(
    FALLBACK_PRODUCT_MAP[handle] || FALLBACK_PRODUCT_MAP["vedic-prosperity-rakhi"]
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState("Single Set");
  const [selectedColor, setSelectedColor] = useState("Sacred Red");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch("https://api.younoya.com/api/v1/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          const found = data.data.find((p: Product) => p.handle === handle);
          if (found) {
            setProduct(found);
          }
        }
      })
      .catch((e) => console.log("Using cached product:", e));
  }, [handle]);

  const rawImages: string[] = Array.isArray(product.images)
    ? product.images
    : (typeof product.images === "string" ? JSON.parse(product.images || "[]") : []);

  const images = rawImages.length >= 4 
    ? rawImages 
    : [
        rawImages[0] || "https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800"
      ];

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      handle: product.handle,
      title: product.title,
      subtitle: product.subtitle,
      price: product.price,
      original_price: product.original_price,
      image: images[0]
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white text-[#111827] min-h-screen pt-28 pb-24 font-sans selection:bg-[#111827] selection:text-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12">
        {/* ========================================================
            NAVIGATION & BREADCRUMBS (14px text in #9CA3AF)
           ======================================================== */}
        <nav className="flex items-center gap-2 text-sm text-[#9CA3AF] py-2 border-b border-[#E5E7EB]">
          <Link href="/" className="hover:text-[#111827] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-[#9CA3AF]" />
          <Link href="/products" className="hover:text-[#111827] transition-colors">Vedic Rakhis</Link>
          <ChevronRight size={14} className="text-[#9CA3AF]" />
          <span className="text-[#111827] font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        {/* ========================================================
            PRODUCT MAIN SECTION (2-Column Grid: 7:5 Ratio)
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (60% / 7 cols): Vertical Image Stack */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary 4:5 Image with 500ms Smooth Zoom */}
            <div className="relative aspect-[4/5] w-full rounded-[4px] bg-[#F3F4F6] border border-[#E5E7EB] overflow-hidden group">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#111827] text-white text-[12px] font-medium uppercase tracking-wider px-3 py-1 rounded-[4px]">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Supporting 2x2 Grid of 4:5 Aspect Ratio Thumbnails */}
            <div className="grid grid-cols-2 gap-4">
              {images.slice(0, 4).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[4/5] w-full rounded-[4px] bg-[#F3F4F6] border overflow-hidden cursor-pointer group transition-all ${
                    activeImageIndex === idx ? "border-[#111827] ring-1 ring-[#111827]" : "border-[#E5E7EB] opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Detail ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (40% / 5 cols): Sticky Container (top: 32px) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
            <div className="space-y-2 border-b border-[#E5E7EB] pb-6">
              <div className="text-xs font-mono uppercase tracking-widest text-[#6B7280]">
                SKU: {product.sku}
              </div>
              <h1 className="text-3xl sm:text-[36px] sm:leading-[40px] font-medium text-[#111827] tracking-tight">
                {product.title}
              </h1>

              {/* Star Rating Row */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex text-[#111827]">
                  <Star size={16} className="fill-current" />
                  <Star size={16} className="fill-current" />
                  <Star size={16} className="fill-current" />
                  <Star size={16} className="fill-current" />
                  <Star size={16} className="fill-current" />
                </div>
                <a href="#reviews" className="text-xs font-medium text-[#111827] underline underline-offset-4 hover:text-[#6B7280]">
                  4.9 / 5 (10,000+ Reviews)
                </a>
              </div>

              {/* Pricing ($120.00 equivalent in 24px) */}
              <div className="flex items-baseline gap-3 pt-4">
                <span className="text-2xl font-medium text-[#111827] font-mono">₹{product.price}</span>
                {product.original_price > product.price && (
                  <span className="text-base text-[#6B7280] line-through font-mono">₹{product.original_price}</span>
                )}
                <span className="text-xs font-medium text-[#111827] bg-[#F9FAFB] border border-[#E5E7EB] px-2.5 py-1 rounded-[4px] ml-auto">
                  100% Free Air Shipping
                </span>
              </div>
            </div>

            {/* Variant Section 1: Color Swatches (40x40px circles with 2px ring on active) */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-[#111827] uppercase tracking-wider">
                Select Thread Element: <span className="text-[#6B7280]">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-3">
                {[
                  { name: "Sacred Red", color: "bg-red-800" },
                  { name: "Saffron Gold", color: "bg-amber-600" },
                  { name: "Vedic Mauli", color: "bg-[#111827]" }
                ].map((swatch) => (
                  <button
                    key={swatch.name}
                    onClick={() => setSelectedColor(swatch.name)}
                    className={`w-10 h-10 rounded-full ${swatch.color} transition-all ${
                      selectedColor === swatch.name
                        ? "ring-2 ring-offset-2 ring-[#111827]"
                        : "opacity-80 hover:opacity-100"
                    }`}
                    title={swatch.name}
                  />
                ))}
              </div>
            </div>

            {/* Variant Section 2: Size/Package Grid (4-column buttons, 48px height) */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-[#111827] uppercase tracking-wider">
                Select Package Configuration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["Single Set", "Set of 2", "Set of 5", "Puja Deluxe"].map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    className={`h-12 rounded-[6px] border text-xs font-medium transition-all ${
                      selectedVariant === variant
                        ? "bg-[#111827] text-white border-[#111827]"
                        : "bg-white text-[#111827] border-[#E5E7EB] hover:bg-[#F9FAFB]"
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>

            {/* Description Text (16px, leading 1.6) */}
            <div className="text-base leading-[1.6] text-[#6B7280] space-y-3 pt-2 font-sans">
              <p className="whitespace-pre-line">{product.description}</p>
            </div>

            {/* 56px Height Primary CTA Button */}
            <div className="pt-4 space-y-3">
              <button
                id="primary-add-to-cart-btn"
                onClick={handleAddToCart}
                className="w-full h-[56px] rounded-[6px] bg-[#111827] text-white text-base font-medium hover:bg-[#1F2937] transition-all flex items-center justify-between px-8 shadow-sm active:scale-95"
              >
                <span>{added ? "✓ Added to Sacred Cart" : "Add to Cart"}</span>
                <span className="font-mono text-sm">₹{product.price}</span>
              </button>

              <Link
                href="/checkout"
                onClick={handleAddToCart}
                className="w-full h-[56px] rounded-[6px] bg-[#F9FAFB] border border-[#E5E7EB] text-[#111827] text-base font-medium hover:bg-[#F3F4F6] transition-all flex items-center justify-center gap-2"
              >
                <span>Express Buy Now</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================
            SOCIAL PROOF AND BENEFITS STRIP (Full-Width #F9FAFB)
           ======================================================== */}
        <section className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] p-8 sm:p-12 space-y-12 my-16">
          <div className="text-center space-y-2">
            <div className="flex justify-center text-[#111827] gap-1">
              <Star size={20} className="fill-current" />
              <Star size={20} className="fill-current" />
              <Star size={20} className="fill-current" />
              <Star size={20} className="fill-current" />
              <Star size={20} className="fill-current" />
            </div>
            <h3 className="text-xl font-medium text-[#111827] font-sans">
              Rated 4.9/5 by 10,000+ Customers Across India
            </h3>
          </div>

          {/* 4-Column Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#E5E7EB]/50 flex items-center justify-center text-[#111827]">
                <Truck size={24} />
              </div>
              <h4 className="text-base font-medium text-[#111827]">Free Air Shipping</h4>
              <p className="text-sm text-[#6B7280]">100% Free Express Air Shipping across all PIN codes in India.</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#E5E7EB]/50 flex items-center justify-center text-[#111827]">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-base font-medium text-[#111827]">Prana Pratishtha</h4>
              <p className="text-sm text-[#6B7280]">Energized with 108 Gayatri mantras recited by Vedic pandits.</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#E5E7EB]/50 flex items-center justify-center text-[#111827]">
                <Award size={24} />
              </div>
              <h4 className="text-base font-medium text-[#111827]">Natural Gemstones</h4>
              <p className="text-sm text-[#6B7280]">Natural Gomti Chakras, Rudraksha beads & organic silk strands.</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#E5E7EB]/50 flex items-center justify-center text-[#111827]">
                <RefreshCw size={24} />
              </div>
              <h4 className="text-base font-medium text-[#111827]">Unboxing Warranty</h4>
              <p className="text-sm text-[#6B7280]">Full damage replacement with 360° unboxing assistance.</p>
            </div>
          </div>
        </section>

        {/* ========================================================
            RELATED PRODUCTS CAROUSEL (4-Column Grid, 3:4 Ratio)
           ======================================================== */}
        <section className="space-y-8 py-8">
          <h2 className="text-2xl font-medium text-[#111827] tracking-tight">You May Also Honor</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RELATED_PRODUCTS.map((prod) => (
              <div key={prod.handle} className="group space-y-3 cursor-pointer">
                {/* 3:4 Aspect Ratio Container with 500ms zoom */}
                <div className="relative aspect-[3/4] w-full rounded-[4px] bg-[#F3F4F6] border border-[#E5E7EB] overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-[#111827] text-white text-[12px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-[4px]">
                    {prod.badge}
                  </span>
                </div>

                <div className="flex justify-between items-start pt-1">
                  <div>
                    <Link href={`/products/${prod.handle}`} className="text-sm font-medium text-[#111827] hover:underline">
                      {prod.title}
                    </Link>
                    <div className="text-xs text-[#6B7280]">{prod.category}</div>
                  </div>
                  <div className="text-sm font-bold text-[#111827] font-mono">₹{prod.price}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sticky Conversion Bar (Appears after scrolling past primary CTA button) */}
      <StickyConversionBar
        productId={product.id}
        handle={product.handle}
        title={product.title}
        price={product.price}
        originalPrice={product.original_price}
        image={images[0]}
        variantName={selectedVariant}
        triggerElementId="primary-add-to-cart-btn"
      />
    </div>
  );
}
