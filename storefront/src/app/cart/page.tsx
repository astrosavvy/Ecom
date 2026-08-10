"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, Tag, Plus, Minus, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discountAmount,
    appliedCoupon,
    applyCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [validating, setValidating] = useState(false);

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApply = async () => {
    if (!couponInput.trim()) return;
    setValidating(true);
    const res = await applyCoupon(couponInput);
    setCouponMsg(res.message);
    setValidating(false);
  };

  // 1. Empty Cart State
  if (items.length === 0) {
    return (
      <div className="relative min-h-screen bg-[#FDFCF8] text-[#1C1C1C] pt-40 pb-24 px-6 flex items-center justify-center">
        <div className="max-w-md w-full clinical-card p-10 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#E2E8E4] flex items-center justify-center mx-auto text-[#1C1C1C]">
            <ShoppingBag size={28} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold font-heading text-[#1C1C1C]">Your Sacred Cart is Empty</h1>
            <p className="text-xs text-stone-600 leading-relaxed">
              Explore our consecrated Vedic Rakhis, authentic Gomti Chakras, and ritual keepsakes to begin your order.
            </p>
          </div>

          <Link
            href="/products"
            className="w-full py-4 rounded-full bg-[#1C1C1C] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:bg-[#333333] transition-all inline-flex"
          >
            <span>Explore Consecrated Collection</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  // 2. Active Cart State
  return (
    <div className="relative min-h-screen bg-[#FDFCF8] text-[#1C1C1C] pt-36 pb-24 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-mono tracking-[0.16em] uppercase text-[#D4AF37] font-bold">
              ORDER SUMMARY
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#1C1C1C] tracking-tight">
              Your Sacred Cart ({items.length} {items.length === 1 ? "Item" : "Items"})
            </h1>
          </div>

          <Link
            href="/products"
            className="text-xs text-stone-600 hover:text-[#1C1C1C] flex items-center gap-1.5 font-mono uppercase tracking-wider font-bold"
          >
            <ArrowLeft size={13} />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="clinical-card p-5 flex gap-4 items-center justify-between"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#E8E6E1] border border-[#E2E8E4] flex-shrink-0 flex items-center justify-center p-2">
                    <img
                      src={item.image || "/younoya_logo.png"}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-bold font-heading text-[#1C1C1C] line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-xs text-stone-500">
                      {item.subtitle || "Signature Consecration Keepsake Box"}
                    </div>
                    <div className="text-sm font-extrabold font-mono text-[#1C1C1C] pt-1">
                      ₹{item.price}{" "}
                      {item.original_price > item.price && (
                        <span className="text-xs text-stone-400 line-through">
                          ₹{item.original_price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Delete Controls */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>

                    <div className="flex items-center gap-2 border border-[#E2E8E4] rounded-full p-1 bg-[#F5F5F0]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-[#1C1C1C] text-stone-500"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-mono font-bold px-1.5 text-[#1C1C1C]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-[#1C1C1C] text-stone-500"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Free Gift Strip */}
            <div className="p-4 rounded-2xl bg-[#E2E8E4]/60 border border-[#C2D6C2] text-xs text-[#1C1C1C] flex items-center gap-2.5 font-semibold">
              <ShieldCheck size={18} className="text-[#D4AF37] flex-shrink-0" />
              <span>Includes complimentary consecrated Akshat, Chandan & Roli in every box</span>
            </div>

            {/* Promo Coupon Card */}
            <div className="clinical-card p-5 space-y-3">
              <label className="block text-xs font-mono tracking-wider uppercase text-stone-700 font-bold">
                Promo Coupon Code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="e.g. VEDIC10"
                    className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#1C1C1C] font-mono uppercase focus:outline-none focus:border-[#1C1C1C]"
                  />
                </div>
                <button
                  onClick={handleApply}
                  disabled={validating}
                  className="px-5 py-2.5 rounded-xl bg-[#1C1C1C] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333]"
                >
                  {validating ? "Validating..." : "Apply"}
                </button>
              </div>

              {couponMsg && (
                <div className={`text-xs font-medium pt-1 ${couponMsg.startsWith("Coupon") ? "text-emerald-700" : "text-amber-700"}`}>
                  {couponMsg}
                </div>
              )}
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="clinical-card p-6 space-y-6 sticky top-28">
              <h2 className="text-base font-extrabold font-heading text-[#1C1C1C]">Order Breakdown</h2>

              <div className="space-y-3 text-xs text-stone-600 border-b border-[#E2E8E4] pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#1C1C1C] font-semibold">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon ({appliedCoupon})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Air Shipping</span>
                  <span className="text-[#D4AF37] font-bold">100% FREE (India)</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Consecration Ritual</span>
                  <span className="text-stone-400">Included</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-sm font-bold text-[#1C1C1C]">Grand Total</span>
                <span className="text-2xl font-extrabold font-mono text-[#1C1C1C]">
                  ₹{finalTotal}
                </span>
              </div>

              <Link
                href="/checkout"
                className="w-full py-4 rounded-full bg-[#1C1C1C] text-white text-xs font-extrabold uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-lg hover:bg-[#333333] transition-all"
              >
                <span>Proceed to Express Checkout</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
