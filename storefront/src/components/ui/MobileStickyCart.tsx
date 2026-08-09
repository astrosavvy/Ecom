"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { ShoppingBag, ArrowRight } from "lucide-react";

export function MobileStickyCart() {
  const { items, subtotal } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = subtotal > 0 ? subtotal : 1099;
  const original = subtotal > 0 ? Math.round(subtotal * 1.2) : 1299;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 w-full bg-white/95 backdrop-blur-[12px] border-t border-[#E2E8E4] px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-4">
      {/* Price & Scarcity Micro-Tag */}
      <div className="space-y-0.5">
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-[#1C1C1C] font-mono">₹{total}</span>
          <span className="text-xs text-stone-400 line-through">₹{original}</span>
        </div>
        <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
          <span>Selling Fast • High Demand</span>
        </div>
      </div>

      {/* Add to Cart / Express Buy Button */}
      <Link
        href={items.length > 0 ? "/checkout" : "/products"}
        className="px-6 py-3 rounded-full bg-[#1C1C1C] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md hover:bg-[#333333] transition-all"
      >
        <ShoppingBag size={14} />
        <span>{items.length > 0 ? "Express Checkout" : "Add to Cart"}</span>
      </Link>
    </div>
  );
}
