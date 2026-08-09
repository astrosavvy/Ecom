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
    removeCoupon
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
      <div className="relative min-h-screen bg-[#0c0d12] text-[#edf1f8] pt-40 pb-24 px-6 flex items-center justify-center">
        <div className="max-w-md w-full chrome-card rounded-3xl p-10 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-amber-400">
            <ShoppingBag size={28} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold font-space text-white">Your Sacred Cart is Empty</h1>
            <p className="text-xs text-[#9ca6be] leading-relaxed">
              Explore our consecrated Vedic Rakhis, authentic Gomti Chakras, and ritual keepsakes to begin your order.
            </p>
          </div>

          <Link
            href="/products"
            className="w-full py-3.5 rounded-full aero-btn-primary text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl inline-flex"
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
    <div className="relative min-h-screen bg-[#0c0d12] text-[#edf1f8] pt-32 pb-24 px-6 sm:px-12">
      {/* Atmosphere Glow */}
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#2e63ff]/15 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] left-[5%] w-[450px] h-[450px] rounded-full bg-[#ff2e88]/12 blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-mono tracking-[0.16em] uppercase text-[#25e0ff]">
              ORDER SUMMARY
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-space text-white tracking-tight">
              Your Sacred Cart ({items.length} {items.length === 1 ? "Item" : "Items"})
            </h1>
          </div>

          <Link
            href="/products"
            className="text-xs text-stone-400 hover:text-white flex items-center gap-1.5 font-mono uppercase tracking-wider"
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
                  className="chrome-card rounded-2xl p-5 flex gap-4 items-center justify-between"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-bold font-space text-white line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-xs text-[#9ca6be]">
                      {item.subtitle || "Signature Consecration Keepsake Box"}
                    </div>
                    <div className="text-sm font-bold font-space text-amber-400 pt-1">
                      ₹{item.price}{" "}
                      {item.original_price > item.price && (
                        <span className="text-xs text-stone-500 line-through">
                          ₹{item.original_price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Delete Controls */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-stone-400 hover:text-red-400 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>

                    <div className="flex items-center gap-2 border border-white/10 rounded-lg p-1 bg-black/40">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-white text-stone-400"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-mono font-bold px-1.5">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-white text-stone-400"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Free Gift Strip */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2.5">
              <ShieldCheck size={18} className="flex-shrink-0" />
              <span>Includes complimentary consecrated Akshat, Chandan & Roli in every box</span>
            </div>

            {/* Promo Coupon Card */}
            <div className="chrome-card rounded-2xl p-5 space-y-3">
              <label className="block text-xs font-mono tracking-wider uppercase text-stone-300">
                Promo Coupon Code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3.5 top-3 text-stone-500" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="e.g. VEDIC10"
                    className="w-full bg-[#080a10] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  onClick={handleApply}
                  disabled={validating}
                  className="aero-btn-secondary text-white text-xs font-semibold px-5 py-2.5 rounded-xl"
                >
                  {validating ? "Validating..." : "Apply"}
                </button>
              </div>

              {couponMsg && (
                <div className={`text-xs font-medium pt-1 ${couponMsg.startsWith("Coupon") ? "text-emerald-400" : "text-amber-400"}`}>
                  {couponMsg}
                </div>
              )}
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="chrome-card rounded-2xl p-6 space-y-6 sticky top-28">
              <h2 className="text-base font-bold font-space text-white">Order Breakdown</h2>

              <div className="space-y-3 text-xs text-[#9ca6be] border-b border-white/10 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Coupon ({appliedCoupon})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Air Shipping</span>
                  <span className="text-cyan-400 font-semibold">100% FREE (India)</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Consecration Ritual</span>
                  <span className="text-stone-400">Included</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-sm font-bold text-white">Grand Total</span>
                <span className="text-2xl font-bold font-space text-white">
                  ₹{finalTotal}
                </span>
              </div>

              <Link
                href="/checkout"
                className="w-full py-4 rounded-full aero-btn-primary text-white text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-2xl"
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
