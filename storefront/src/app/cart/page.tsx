import React from 'react';
import Link from 'next/link';
import PriceDisplay from '@/components/ui/PriceDisplay';

export default function CartPage() {
  const cartItem = {
    title: "Vedic Prosperity Rakhi",
    price: 1099,
    quantity: 1,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 font-body">
      <h1 className="text-3xl font-heading font-bold text-stone-900 border-b border-stone-200 pb-4">
        Your Shopping Cart
      </h1>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h3 className="font-heading font-bold text-stone-900 text-lg">{cartItem.title}</h3>
            <p className="text-xs text-stone-500">Handcrafted Vedic Keepsake</p>
          </div>
          <PriceDisplay amount={cartItem.price} className="font-bold text-stone-900 text-lg" />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm font-medium text-stone-600">Subtotal:</div>
          <PriceDisplay amount={cartItem.price} className="text-xl font-bold text-emerald-800 font-heading" />
        </div>

        <div className="pt-4 flex justify-end">
          <Link href="/checkout" className="w-full sm:w-auto text-center py-3.5 px-8 bg-[var(--yn-primary)] hover:bg-[var(--yn-primary-hover)] text-white font-bold text-base rounded-xl shadow-md transition-all">
            Proceed to One-Page Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
