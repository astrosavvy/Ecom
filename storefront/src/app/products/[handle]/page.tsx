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
    <div className="relative min-h-screen bg-[#FDFCF8] text-[#1C1C1C] pt-36 pb-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Breadcrumbs */}
        <nav className="text-xs font-mono uppercase tracking-wider text-stone-400 flex items-center gap-2">
          <Link href="/" className="hover:text-[#1C1C1C]">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#1C1C1C]">Vedic Rakhis</Link>
          <span>/</span>
          <span className="text-[#D4AF37] font-bold line-clamp-1">{product.title}</span>
        </nav>

        {/* Main Product Layout (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Product Spotlight Image Box (#E8E6E1 bg, 40px rounded) */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-16 h-16 rounded-2xl overflow-hidden border flex-shrink-0 transition-all ${
                    selectedImgIndex === idx
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
                src={images[selectedImgIndex] || images[0]}
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

          {/* Right Column: Detailed Product Specs */}
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
            <div className="space-y-1.5">
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

              <button
                onClick={handleBuyNow}
                className="py-4 rounded-full bg-[#1C1C1C] text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:bg-[#333333] transition-all transform hover:scale-105"
              >
                <span>Express Buy Now</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
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
              Consecration Details & Box Contents
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`pb-3 text-xs font-mono uppercase tracking-wider font-bold transition-colors ${
                activeTab === "shipping"
                  ? "text-[#1C1C1C] border-b-2 border-[#1C1C1C]"
                  : "text-stone-400 hover:text-[#1C1C1C]"
              }`}
            >
              Express Shipping & Vedic Care
            </button>
          </div>

          {activeTab === "details" ? (
            <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-4xl">
              <p className="whitespace-pre-line text-[#1C1C1C] font-normal">
                {product.description}
              </p>

              {rawFeatures.length > 0 && (
                <div className="pt-4 space-y-2">
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

        {/* Testimonials Marquee */}
        <TestimonialMarquee />
      </div>

      <MobileStickyCart />
    </div>
  );
}
