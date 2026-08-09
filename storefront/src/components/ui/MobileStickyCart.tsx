"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { ShoppingBag } from "lucide-react";

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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 w-full bg-white/95 backdrop-blur-[12px] border-t border-[#E2E8E4] px-3.5 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
      {/* Price & Scarcity Micro-Tag */}
      <div className="space-y-0.5 min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold text-[#1C1C1C] font-mono">₹{total}</span>
          <span className="text-[11px] text-stone-400 line-through font-mono">₹{original}</span>
        </div>
        <div className="inline-flex items-center gap-1 text-[9px] font-bold text-[#DC2626] uppercase tracking-wider truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse flex-shrink-0" />
          <span className="truncate">Selling Fast • High Demand</span>
        </div>
      </div>

      {/* Add to Cart / Express Buy Button */}
      <Link
        href={items.length > 0 ? "/checkout" : "/products"}
        className="px-4 py-2.5 rounded-full bg-[#1C1C1C] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md flex-shrink-0 hover:bg-[#333333] transition-all"
      >
        <ShoppingBag size={13} />
        <span>{items.length > 0 ? "Checkout" : "Add to Cart"}</span>
      </Link>
    </div>
  );
}
