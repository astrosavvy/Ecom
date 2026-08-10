"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/CartContext";

interface StickyBarProps {
  productId: string;
  handle: string;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  variantName?: string;
  triggerElementId?: string;
}

export function StickyConversionBar({
  productId,
  handle,
  title,
  price,
  originalPrice,
  image,
  variantName = "Signature Set",
  triggerElementId = "primary-add-to-cart-btn"
}: StickyBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const triggerEl = document.getElementById(triggerElementId);
      if (triggerEl) {
        const rect = triggerEl.getBoundingClientRect();
        // Visible only after scrolling past the primary CTA button
        if (rect.bottom < 0) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else {
        if (window.scrollY > 500) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [triggerElementId]);

  if (!isVisible) return null;

  const handleAddToCart = () => {
    addItem({
      id: `${productId}-${variantName}`,
      handle,
      title,
      subtitle: variantName,
      price,
      original_price: originalPrice,
      image,
      variant: variantName
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 w-full bg-white border-t border-[#E5E7EB] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left Side: 48px square thumbnail + Title/Variant stack */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded bg-[#F3F4F6] border border-[#E5E7EB] overflow-hidden flex-shrink-0">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <h4 className="text-sm font-medium text-[#111827] truncate font-sans">{title}</h4>
            <div className="text-xs text-[#6B7280] font-sans">{variantName} • Free Air Shipping</div>
          </div>
        </div>

        {/* Right Side: Price + 48px Height CTA Button */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-base font-medium text-[#111827] font-mono">₹{price}</div>
            {originalPrice > price && (
              <div className="text-xs text-[#6B7280] line-through font-mono">₹{originalPrice}</div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="h-12 px-6 rounded-[6px] bg-[#111827] text-white text-sm font-medium hover:bg-[#1F2937] transition-all flex items-center gap-2 shadow-sm active:scale-95"
          >
            {added ? (
              <>
                <Check size={16} className="text-emerald-400" />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span>Add to Cart — ₹{price}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
