"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export interface Product {
  id: string;
  handle: string;
  sku: string;
  title: string;
  subtitle: string;
  price: number;
  original_price: number;
  badge: string;
  description?: string;
  images: string[] | string;
  features?: string[] | string;
  is_hidden?: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Normalize images array
  const imagesList: string[] = Array.isArray(product.images)
    ? product.images
    : typeof product.images === "string" && product.images
    ? JSON.parse(product.images || "[]")
    : [];

  const validImages = imagesList.length > 0 ? imagesList : ["/younoya_logo.png"];

  // 2-second Slideshow on Mouse Hover
  useEffect(() => {
    if (isHovered && validImages.length > 1) {
      timerRef.current = setInterval(() => {
        setActiveImageIdx((prev) => (prev + 1) % validImages.length);
      }, 2000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setActiveImageIdx(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, validImages.length]);

  const handleCardClick = () => {
    router.push(`/products/${product.handle}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      handle: product.handle,
      title: product.title,
      subtitle: product.subtitle,
      price: product.price,
      original_price: product.original_price,
      image: validImages[0]
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      handle: product.handle,
      title: product.title,
      subtitle: product.subtitle,
      price: product.price,
      original_price: product.original_price,
      image: validImages[0]
    });
    router.push("/checkout");
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="clinical-card p-5 sm:p-6 flex flex-col justify-between space-y-5 cursor-pointer group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border border-[#E2E8E4] rounded-3xl"
    >
      {/* Square Image Box with Smooth Image Transition */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#E8E6E1] border border-[#E2E8E4]">
        <img
          src={validImages[activeImageIdx] || validImages[0]}
          alt={product.title}
          className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#1C1C1C] text-white text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-md shadow-sm z-10">
            {product.badge}
          </span>
        )}

        {/* Dots indicator when multi-photo slideshow is active */}
        {validImages.length > 1 && isHovered && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
            {validImages.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeImageIdx === idx ? "w-4 bg-white shadow-md" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold font-heading text-[#1C1C1C] group-hover:text-[#B8860B] transition-colors line-clamp-2 leading-snug">
          {product.title}
        </h3>
        <p className="text-[11px] text-stone-500 line-clamp-1">
          {product.subtitle}
        </p>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-lg font-extrabold font-mono text-[#1C1C1C]">₹{product.price}</span>
          <span className="text-xs text-stone-400 line-through">₹{product.original_price}</span>
        </div>
      </div>

      {/* Action Buttons with e.stopPropagation() */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={handleAddToCart}
          className="py-2.5 rounded-full bg-[#E2E8E4] text-[#1C1C1C] text-xs font-bold hover:bg-[#D4DFD7] transition-colors flex items-center justify-center gap-1 shadow-sm active:scale-95"
        >
          {isAdded ? (
            <>
              <Check size={13} className="text-emerald-700 stroke-[3]" />
              <span className="text-emerald-700">Added</span>
            </>
          ) : (
            <>
              <ShoppingBag size={13} />
              <span>Add</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          className="py-2.5 rounded-full bg-[#1C1C1C] text-white text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center hover:bg-[#333333] transition-colors shadow-sm active:scale-95"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
