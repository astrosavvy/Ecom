"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronRight, Star, Truck, ShieldCheck, Check, ShoppingBag, 
  RefreshCw, MapPin, Loader2, Award, Heart, Plus, Minus 
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
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "shipping">("details");

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

  const handleCheckPincode = async () => {
    if (pincode.length !== 6) {
      setPincodeResult("Please enter a valid 6-digit PIN code.");
      return;
    }
    setPincodeLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === "Success") {
        const place = data[0].PostOffice[0]?.District || data[0].PostOffice[0]?.Name || "your area";
        setPincodeResult(`✓ Express Delivery available to ${place}! Estimated arrival in 2-3 days.`);
      } else {
        setPincodeResult("✓ Express Air Delivery available across all serviceable Indian PIN codes.");
      }
    } catch {
      setPincodeResult("✓ Express Air Delivery active for this PIN.");
    } finally {
      setPincodeLoading(false);
    }
  };

  const rawImages: string[] = Array.isArray(product.images)
    ? product.images
    : (typeof product.images === "string" ? JSON.parse(product.images || "[]") : []);

  const rawFeatures: string[] = Array.isArray(product.features)
    ? product.features
    : (typeof product.features === "string" ? JSON.parse(product.features || "[]") : []);

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
            PRODUCT MAIN SECTION (Clinical Luxury 2-Column Spotlight Layout)
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Product Spotlight Image Box (#E8E6E1 bg, 40px rounded) */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-2xl overflow-hidden border flex-shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? "border-[#1C1C1C] ring-2 ring-[#1C1C1C]/20"
                      : "border-[#E2E8E4] opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="flex-1 relative aspect-square rounded-[40px] overflow-hidden bg-[#E8E6E1] border border-[#E2E8E4] p-6 shadow-sm group">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={product.title}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              />
              {product.badge && (
                <span className="absolute top-6 left-6 bg-[#1C1C1C] text-white text-[10px] font-mono uppercase tracking-wider font-bold px-3 py-1 rounded-md shadow-sm">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Detailed Product Specs with PIN Lookup & Quantity Selector */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                VEDIC CONSECRATION // SKU: {product.sku}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#1C1C1C] leading-snug">
                {product.title}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {product.subtitle}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-6 rounded-[24px] bg-white border border-[#E2E8E4] space-y-2 shadow-sm">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold font-mono text-[#1C1C1C]">
                  ₹{product.price}
                </span>
                <span className="text-sm text-stone-400 line-through">
                  ₹{product.original_price}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-[#E2E8E4] px-2.5 py-0.5 rounded-full">
                  Save ₹{product.original_price - product.price}
                </span>
              </div>
              <div className="text-xs text-stone-500 flex items-center gap-1.5 pt-1">
                <Truck size={14} className="text-[#D4AF37]" />
                <span>100% Free Express Air Shipping across India • Taxes included</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-mono uppercase tracking-wider text-stone-600 font-bold">Quantity</label>
              <div className="inline-flex items-center border border-[#E2E8E4] rounded-full bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-stone-600 hover:text-[#1C1C1C]"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 text-xs font-mono font-bold text-[#1C1C1C]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-stone-600 hover:text-[#1C1C1C]"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* PIN Code Delivery Checker */}
            <div className="p-5 rounded-[24px] bg-white border border-[#E2E8E4] space-y-2.5 shadow-sm">
              <label className="text-xs font-mono uppercase tracking-wider text-stone-700 font-bold flex items-center gap-1.5">
                <MapPin size={14} className="text-[#D4AF37]" />
                <span>Check Delivery Pincode</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit PIN"
                  className="flex-1 bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                />
                <button
                  onClick={handleCheckPincode}
                  disabled={pincodeLoading}
                  className="px-5 py-2 rounded-xl bg-[#1C1C1C] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#333333]"
                >
                  {pincodeLoading ? <Loader2 size={12} className="animate-spin" /> : "Check"}
                </button>
              </div>
              {pincodeResult && (
                <div className="text-xs text-emerald-700 font-medium pt-0.5">{pincodeResult}</div>
              )}
            </div>

            {/* Action CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                id="primary-add-to-cart-btn"
                onClick={handleAddToCart}
                className="py-4 rounded-full bg-[#E2E8E4] text-[#1C1C1C] text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#D4DFD7] transition-all"
              >
                {added ? (
                  <>
                    <Check size={15} className="text-emerald-700" />
                    <span className="text-emerald-700">Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={15} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <Link
                href="/checkout"
                onClick={handleAddToCart}
                className="py-4 rounded-full bg-[#1C1C1C] text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:bg-[#333333] transition-all transform hover:scale-105"
              >
                <span>Express Buy Now</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================
            PRODUCT DESCRIPTION & CONSECRATION DETAILS TABS
           ======================================================== */}
        <div className="rounded-[32px] bg-white border border-[#E2E8E4] p-8 space-y-6 shadow-sm">
          <div className="flex border-b border-[#E2E8E4] gap-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-3 text-xs font-mono uppercase tracking-wider font-bold transition-colors ${
                activeTab === "details"
                  ? "text-[#1C1C1C] border-b-2 border-[#1C1C1C]"
                  : "text-stone-400 hover:text-[#1C1C1C]"
              }`}
            >
              Product Description & Consecration Details
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`pb-3 text-xs font-mono uppercase tracking-wider font-bold transition-colors ${
                activeTab === "shipping"
                  ? "text-[#1C1C1C] border-b-2 border-[#1C1C1C]"
                  : "text-stone-400 hover:text-[#1C1C1C]"
              }`}
            >
              Express Air Shipping & Box Guarantee
            </button>
          </div>

          {activeTab === "details" ? (
            <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-4xl">
              <div className="space-y-2">
                <h3 className="text-base font-bold font-heading text-[#1C1C1C]">About This Sacred Creation</h3>
                <p className="whitespace-pre-line text-[#1C1C1C] font-normal leading-relaxed">
                  {product.description}
                </p>
              </div>

              {rawFeatures.length > 0 && (
                <div className="pt-4 space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-bold">
                    Included in the Signature Keepsake Box:
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                    {rawFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-700 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
              <p>
                • <strong>100% Free Express Air Shipping</strong> across all PIN codes in India.
              </p>
              <p>
                • Each Rakhi is consecrated with morning Vedic rituals and dispatched with unbroken tamper-proof security seals.
              </p>
              <p>
                • Full replacement warranty in case of transit damage with 360° unboxing assistance.
              </p>
            </div>
          )}
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
