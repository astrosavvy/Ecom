"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, Tag, Plus, Minus } from "lucide-react";

export default function CartPage() {
  const [quantity, setQuantity] = useState(1);
  const [coupon, setCoupon] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  const basePrice = 1099;
  const originalPrice = 1299;
  const subtotal = basePrice * quantity;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      const res = await fetch("https://api.younoya.com/api/v1/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon.trim().toUpperCase(), subtotal })
      });
      const data = await res.json();
      if (data.success) {
        setDiscountAmount(data.discount_amount);
        setCouponMsg(`✓ Coupon ${data.code} applied! (Saved ₹${data.discount_amount})`);
      } else {
        setCouponMsg("❌ " + (data.error || "Invalid coupon"));
      }
    } catch (e) {
      setCouponMsg("❌ Could not validate coupon.");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07080d] text-[#eef1f8] pt-32 pb-24 px-6 sm:px-12">
      {/* Background glow */}
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#2e63ff]/15 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] left-[5%] w-[450px] h-[450px] rounded-full bg-[#ff2e88]/12 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        <div className="space-y-2 text-left">
          <div className="text-xs font-mono tracking-[0.16em] uppercase text-[#25e0ff]">
            ORDER SUMMARY
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-space text-white tracking-tight">
            Your Sacred Cart
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items Card */}
          <div className="lg:col-span-7 space-y-4">
            <div className="chrome-card rounded-2xl p-6 space-y-6">
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800"
                    alt="Vedic Prosperity Rakhi Set"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="text-sm font-bold font-space text-white">
                    Vedic Prosperity Rakhi Set with Dry Fruits & Consecrated Thread
                  </div>
                  <div className="text-xs text-[#8b93a8]">
                    Signature Consecration Keepsake Box
                  </div>
                  <div className="text-sm font-bold font-space text-amber-400 pt-1">
                    ₹{basePrice} <span className="text-xs text-stone-500 line-through">₹{originalPrice}</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 border border-white/10 rounded-lg p-1 bg-black/40">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:text-white text-stone-400"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="text-xs font-mono font-bold px-1.5">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:text-white text-stone-400"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Free Gift Strip */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
                <ShieldCheck size={16} />
                <span>Includes complimentary Roli, Chawal & Blessing Certificate</span>
              </div>
            </div>

            {/* Coupon Code Card */}
            <div className="chrome-card rounded-2xl p-5 space-y-3">
              <label className="block text-xs font-mono tracking-wider uppercase text-stone-300">
                Have a Promo Coupon?
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3.5 top-3 text-stone-500" />
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="e.g. VEDIC10"
                    className="w-full bg-[#07080d] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  className="aero-btn-secondary text-white text-xs font-semibold px-4 py-2 rounded-xl"
                >
                  Apply
                </button>
              </div>
              {couponMsg && (
                <div className="text-xs font-medium pt-1 text-stone-300">
                  {couponMsg}
                </div>
              )}
            </div>
          </div>

          {/* Pricing Summary Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="chrome-card rounded-2xl p-6 space-y-5">
              <h2 className="text-base font-bold font-space text-white">Order Breakdown</h2>

              <div className="space-y-3 text-xs text-[#8b93a8] border-b border-white/10 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-emerald-400 font-semibold">-₹{discountAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="text-cyan-400 font-semibold">FREE (Across India)</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (GST)</span>
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
                className="w-full py-3.5 rounded-full aero-btn-primary text-white text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-xl"
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
