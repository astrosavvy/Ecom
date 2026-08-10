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
import { ProductCard } from "@/components/ui/ProductCard";

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

export function ProductDetailClient({ initialHandle }: { initialHandle?: string }) {
  const params = useParams();
  const router = useRouter();
  const handle = initialHandle || (params?.handle as string) || "vedic-prosperity-rakhi";
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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
          setAllProducts(data.data);
          const found = data.data.find((p: Product) => p.handle === handle);
          if (found) {
            setProduct(found);
          }
        }
      })
      .catch((e) => console.log("Error loading product:", e))
      .finally(() => setLoading(false));
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

  if (loading || !product) {
    return (
      <div className="bg-[#FDFCF8] text-[#111827] min-h-screen pt-36 pb-24 font-sans">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12">
          {/* Skeleton Breadcrumb */}
          <div className="h-4 bg-stone-200 rounded w-64 animate-pulse" />

          {/* Skeleton Product Spotlight */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
              <div className="flex sm:flex-col gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-16 h-16 rounded-2xl bg-stone-200 animate-pulse" />
                ))}
              </div>
              <div className="flex-1 aspect-square rounded-[40px] bg-stone-200 animate-pulse" />
            </div>
            <div className="lg:col-span-6 space-y-6">
              <div className="h-4 bg-stone-200 rounded w-40 animate-pulse" />
              <div className="h-8 bg-stone-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-stone-100 rounded w-full animate-pulse" />
              <div className="h-24 bg-stone-200 rounded-3xl animate-pulse" />
              <div className="h-12 bg-stone-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const rawImages: string[] = Array.isArray(product.images)
    ? product.images
    : (typeof product.images === "string" ? JSON.parse(product.images || "[]") : []);

  const rawFeatures: string[] = Array.isArray(product.features)
    ? product.features
    : (typeof product.features === "string" ? JSON.parse(product.features || "[]") : []);

  const images = rawImages.length > 0 
    ? rawImages 
    : ["/younoya_logo.png"];

  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

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
                  placeholder="Enter 6-digit PIN code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8E4] bg-[#F5F5F0] text-xs font-mono text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                />
                <button
                  onClick={handleCheckPincode}
                  disabled={pincodeLoading || pincode.length !== 6}
                  className="px-5 py-2.5 rounded-xl bg-[#1C1C1C] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  {pincodeLoading ? <Loader2 size={13} className="animate-spin" /> : "Check"}
                </button>
              </div>
              {pincodeResult && (
                <p className="text-[11px] font-medium text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                  {pincodeResult}
                </p>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <button
                id="primary-add-to-cart-btn"
                onClick={handleAddToCart}
                className="w-full py-4 rounded-full bg-[#1C1C1C] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-[#333333] transition-all transform active:scale-98 shadow-md flex items-center justify-center gap-2"
              >
                {added ? (
                  <>
                    <Check size={16} className="text-emerald-400 stroke-[3]" />
                    <span>Added to Sacred Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add to Sacred Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  handleAddToCart();
                  router.push("/checkout");
                }}
                className="w-full py-4 rounded-full bg-[#E2E8E4] text-[#1C1C1C] text-xs font-bold uppercase tracking-wider hover:bg-[#D4DFD7] transition-all flex items-center justify-center gap-2"
              >
                <span>Express 1-Click Buy Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            TABBED ACCORDIONS (Specifications, Consecration Rituals)
           ======================================================== */}
        <section className="rounded-[32px] bg-[#FDFCF8] border border-[#E2E8E4] p-8 sm:p-12 space-y-8">
          <div className="flex border-b border-[#E2E8E4] gap-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-3 text-sm font-bold transition-colors ${
                activeTab === "details"
                  ? "text-[#1C1C1C] border-b-2 border-[#1C1C1C]"
                  : "text-stone-400 hover:text-[#1C1C1C]"
              }`}
            >
              Consecration Details & Sacred Inclusions
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`pb-3 text-sm font-bold transition-colors ${
                activeTab === "shipping"
                  ? "text-[#1C1C1C] border-b-2 border-[#1C1C1C]"
                  : "text-stone-400 hover:text-[#1C1C1C]"
              }`}
            >
              Shipping & Authenticity Guarantee
            </button>
          </div>

          {activeTab === "details" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-mono uppercase tracking-wider text-stone-600 font-bold">
                  Sacred Features & Contents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {rawFeatures.map((feat: string, i: number) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-stone-700">
                      <ShieldCheck size={14} className="text-[#D4AF37] flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {product.description && (
                <div className="space-y-2 pt-2 border-t border-[#E2E8E4]">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-stone-600 font-bold">
                    Devotional Summary
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 text-xs text-stone-600 leading-relaxed">
              <p>
                <strong>100% Free Express Air Dispatch:</strong> Every order is hand-packed at our temple sanctuary in Jaipur and dispatched via priority air couriers (Shiprocket / BlueDart).
              </p>
              <p>
                <strong>Estimated Delivery:</strong> 2 to 4 business days across metro cities in India. Real-time SMS tracking updates sent instantly upon dispatch.
              </p>
            </div>
          )}
        </section>

        {/* ========================================================
            TRUST BADGES (3-Column Grid)
           ======================================================== */}
        <section className="border-t border-[#E5E7EB] pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        {relatedProducts.length > 0 && (
          <section className="space-y-8 py-8">
            <h2 className="text-2xl font-bold font-heading text-[#1C1C1C] tracking-tight">You May Also Honor</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}
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
