"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ShieldCheck, Sparkles, Truck, HeartHandshake, Feather, 
  ShoppingBag, Check, Star, ArrowRight, Minus, Plus, Loader2, MapPin 
} from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { TestimonialMarquee } from "@/components/ui/TestimonialMarquee";

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
    badge: "Signature Edition",
    description: "In cherished traditions, this designer handcrafted Vedic Rakhi set in vibrant colors tells a story of elegance and affection. Each intricately crafted rakhi celebrates the unique bond between siblings. The artful beadwork and rich colors make this an exquisite and memorable Raksha Bandhan gift.\n\nEnergized with 108 Gayatri mantra recitations to invite celestial prosperity, abundance, and planetary harmony.",
    images: [
      "https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
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
      "https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800"
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
      "https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800"
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
      "https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800"
    ],
    features: [
      "9 Astrological Planetary Silk Strands",
      "Pure Brass Energized Om Talisman",
      "Natural Sacred Kaudi Shell Detailing",
      "Complimentary Roli & Chawal Packets"
    ]
  }
};

export default function DynamicProductPage() {
  const params = useParams();
  const router = useRouter();
  const handle = (params?.handle as string) || "vedic-prosperity-rakhi";
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product>(
    FALLBACK_PRODUCT_MAP[handle] || FALLBACK_PRODUCT_MAP["vedic-prosperity-rakhi"]
  );
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "shipping">("details");
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
  
  const images = rawImages.length > 0 
    ? rawImages 
    : ["https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800"];

  const rawFeatures: string[] = Array.isArray(product.features)
    ? product.features
    : (typeof product.features === "string" ? JSON.parse(product.features || "[]") : []);

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

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      handle: product.handle,
      title: product.title,
      subtitle: product.subtitle,
      price: product.price,
      original_price: product.original_price,
      image: images[0]
    }, quantity);

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      handle: product.handle,
      title: product.title,
      subtitle: product.subtitle,
      price: product.price,
      original_price: product.original_price,
      image: images[0]
    }, quantity);

    router.push("/checkout");
  };

  return (
    <div className="relative min-h-screen bg-[#0c0d12] text-[#edf1f8] pt-32 pb-24 px-4 sm:px-8">
      {/* Background Atmosphere */}
      <div className="absolute top-[5%] right-[10%] w-[600px] h-[600px] rounded-full bg-[#2e63ff]/15 blur-[150px] pointer-events-none" />
      <div className="absolute top-[45%] left-[5%] w-[550px] h-[550px] rounded-full bg-[#ff2e88]/12 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Breadcrumbs */}
        <nav className="text-xs font-mono uppercase tracking-wider text-stone-400 flex items-center gap-2">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white">Vedic Rakhis</Link>
          <span>/</span>
          <span className="text-amber-400 line-clamp-1">{product.title}</span>
        </nav>

        {/* Main Product Layout (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnail list */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border flex-shrink-0 transition-all ${
                    selectedImgIndex === idx
                      ? "border-amber-400 ring-2 ring-amber-400/30"
                      : "border-white/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Featured Photo */}
            <div className="flex-1 relative aspect-square rounded-3xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl group">
              <img
                src={images[selectedImgIndex] || images[0]}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-amber-300 text-xs font-mono uppercase tracking-wider font-bold px-3.5 py-1.5 rounded-full border border-amber-400/30 shadow-lg">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Product Info & Purchase Panel */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-amber-400">
                VEDIC CONSECRATION // SKU: {product.sku}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-space text-white tracking-tight leading-snug">
                {product.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#9ca6be] leading-relaxed">
                {product.subtitle}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-[#121520]/80 border border-white/10 space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold font-space text-amber-400">
                  ₹{product.price}
                </span>
                <span className="text-sm text-stone-500 line-through">
                  ₹{product.original_price}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Save ₹{product.original_price - product.price}
                </span>
              </div>
              <div className="text-[11px] text-[#9ca6be] flex items-center gap-1.5">
                <Truck size={13} className="text-cyan-400" />
                <span>100% Free Express Air Shipping across India • Taxes included</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-stone-300">Quantity</label>
              <div className="inline-flex items-center border border-white/10 rounded-xl bg-black/40 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-stone-400 hover:text-white"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 text-xs font-mono font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-stone-400 hover:text-white"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* PIN Code Delivery Checker */}
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2.5">
              <label className="text-xs font-mono uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                <MapPin size={13} className="text-amber-400" />
                <span>Check Delivery Pincode</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit PIN"
                  className="flex-1 bg-[#080a10] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleCheckPincode}
                  disabled={pincodeLoading}
                  className="aero-btn-secondary text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5"
                >
                  {pincodeLoading ? <Loader2 size={12} className="animate-spin" /> : "Check"}
                </button>
              </div>
              {pincodeResult && (
                <div className="text-xs text-emerald-400 pt-0.5">{pincodeResult}</div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="py-3.5 rounded-full aero-btn-secondary text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:border-amber-400/40"
              >
                {added ? (
                  <>
                    <Check size={15} className="text-emerald-400" />
                    <span className="text-emerald-400">Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={15} className="text-amber-400" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 rounded-full aero-btn-primary text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl"
              >
                <span>Express Buy Now</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="chrome-card rounded-3xl p-8 space-y-6">
          <div className="flex border-b border-white/10 gap-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-3 text-xs font-mono uppercase tracking-wider font-bold transition-colors ${
                activeTab === "details"
                  ? "text-amber-400 border-b-2 border-amber-400"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Consecration Details & Box Contents
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`pb-3 text-xs font-mono uppercase tracking-wider font-bold transition-colors ${
                activeTab === "shipping"
                  ? "text-amber-400 border-b-2 border-amber-400"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Express Shipping & Vedic Care
            </button>
          </div>

          {activeTab === "details" ? (
            <div className="space-y-4 text-xs sm:text-sm text-[#9ca6be] leading-relaxed max-w-4xl">
              <p className="whitespace-pre-line text-stone-200 font-normal">
                {product.description}
              </p>

              {rawFeatures.length > 0 && (
                <div className="pt-4 space-y-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Included in the Signature Keepsake Box:
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-300">
                    {rawFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check size={14} className="text-amber-400 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 text-xs sm:text-sm text-[#9ca6be] leading-relaxed max-w-3xl">
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

        {/* Testimonials Marquee */}
        <TestimonialMarquee />
      </div>
    </div>
  );
}
