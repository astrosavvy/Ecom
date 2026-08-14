"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useTransform, MotionValue } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { Product } from "@/components/ui/ProductCard";

interface FoldCardProps {
  product: Product;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

export function FoldCard({ product, index, total, progress }: FoldCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  // Compute individual scroll step for stacking & 3D folding
  const start = index / total;
  const end = (index + 1) / total;

  // Stacking scale: cards underneath scale down slightly
  const scale = useTransform(progress, [start, end], [1, 0.92 - index * 0.02]);
  
  // 3D Fold rotation: tilts back on the X-axis as user scrolls past
  const rotateX = useTransform(progress, [start, end], [0, -12]);
  
  // Opacity fadeout when buried deeply
  const opacity = useTransform(
    progress,
    [start, end, Math.min(1, end + 0.15)],
    [1, 1, 0.4]
  );

  // Parse images
  const imagesList: string[] = Array.isArray(product.images)
    ? product.images
    : typeof product.images === "string" && product.images
    ? JSON.parse(product.images || "[]")
    : [];
  const displayImages = imagesList.length > 0 ? imagesList : ["/younoya_logo.png"];

  // Parse features
  const featuresList: string[] = Array.isArray(product.features)
    ? product.features
    : typeof product.features === "string" && product.features
    ? JSON.parse(product.features || "[]")
    : [];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addItem({
      id: product.id,
      handle: product.handle,
      title: product.title,
      subtitle: product.subtitle,
      price: product.price,
      original_price: product.original_price,
      image: displayImages[0],
      variant: "Standard Edition",
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  return (
    <div className="sticky top-20 sm:top-24 w-full flex items-center justify-center py-4 px-2 sm:px-6">
      <motion.div
        style={{
          scale,
          rotateX,
          opacity,
          transformPerspective: 1200,
          transformOrigin: "top center",
        }}
        className="w-full max-w-5xl rounded-3xl sm:rounded-[36px] bg-[#0E1017]/95 backdrop-blur-2xl border border-[#D4AF37]/25 shadow-[0_20px_60px_rgba(0,0,0,0.65)] hover:border-[#D4AF37]/50 transition-colors duration-300 overflow-hidden relative group"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 p-6 sm:p-10 items-center">
          {/* Left Visual Gallery (5 cols) */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            {/* Main Interactive Image Frame */}
            <div className="relative w-full aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-[#07080E] border border-white/10 shadow-inner group/img">
              <img
                src={displayImages[activeImg] || displayImages[0]}
                alt={product.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover/img:scale-105"
              />

              {/* Badge */}
              <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#07080E]/85 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] sm:text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Sparkles size={11} className="animate-spin-slow" />
                <span>{product.badge || "Vedic Consecrated"}</span>
              </div>

              {/* Discount Tag */}
              {product.original_price > product.price && (
                <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-[#DC2626] text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-tight shadow-md">
                  Save ₹{product.original_price - product.price}
                </div>
              )}
            </div>

            {/* Thumbnail dots if multiple images */}
            {displayImages.length > 1 && (
              <div className="flex items-center gap-2 mt-3.5">
                {displayImages.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      activeImg === idx
                        ? "bg-[#D4AF37] scale-125 shadow-[0_0_8px_#D4AF37]"
                        : "bg-white/20 hover:bg-white/50"
                    }`}
                    aria-label={`Show image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Product Details & Conversion Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5 sm:space-y-6">
            {/* Header / Subtitle */}
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono tracking-[0.2em] text-[#D4AF37] uppercase font-bold">
                  CHAPTER {String(index + 1).padStart(2, "0")} // SACRED EDITION
                </span>
                <span className="text-[11px] font-mono text-stone-400">
                  SKU: {product.sku || `YN-00${index + 1}`}
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold text-[#FDFCF8] tracking-tight leading-tight">
                {product.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {product.subtitle ||
                  "Consecrated with 108 Gayatri Mantras and blessed under auspicious planetary transits."}
              </p>
            </div>

            {/* Inclusions / Highlights */}
            {featuresList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {featuresList.slice(0, 4).map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-[11px] sm:text-xs text-stone-200"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-[11px] sm:text-xs text-stone-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>108 Gayatri Chants Blessed</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-[11px] sm:text-xs text-stone-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>Natural Gomti Chakra Embedded</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-[11px] sm:text-xs text-stone-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>Pure Resham Silk Sacred Thread</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-[11px] sm:text-xs text-stone-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>Free Express Air Delivery</span>
                </div>
              </div>
            )}

            {/* Price & Express Actions */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Pricing Box */}
              <div className="text-left space-y-0.5">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#FDFCF8]">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.original_price > product.price && (
                    <span className="text-sm sm:text-base text-stone-400 line-through">
                      ₹{product.original_price.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[#D4AF37] font-mono flex items-center gap-1">
                  <ShieldCheck size={12} />
                  <span>100% Guaranteed Consecration Certificate Included</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
                    isAdded
                      ? "bg-[#10B981] text-white scale-95"
                      : "bg-white/10 hover:bg-white/20 text-[#FDFCF8] border border-white/15 active:scale-95"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={16} />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>Quick Add</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/products/${product.handle}`}
                  className="flex-1 sm:flex-none px-5 sm:px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#07080E] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <span>View Details</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
