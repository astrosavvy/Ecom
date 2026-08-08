import React from 'react';
import Link from 'next/link';

export async function generateStaticParams() {
  return [
    { id: "sample_order_1" },
    { id: "ord_confirmed" }
  ];
}

export default async function OrderConfirmedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 font-body">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl font-bold mx-auto">
        ✓
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-bold text-stone-900">Order Confirmed!</h1>
        <p className="text-stone-600 text-sm">Thank you for shopping with YOUNOYA.</p>
        <p className="text-xs font-mono text-stone-500 bg-stone-100 inline-block px-3 py-1 rounded-md mt-2">
          Order ID: {id}
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs text-left space-y-3 text-sm">
        <div className="font-semibold text-stone-900 border-b border-stone-100 pb-2">Order Summary</div>
        <div className="flex justify-between">
          <span className="text-stone-600">Product:</span>
          <span className="font-medium text-stone-900">Vedic Prosperity Rakhi</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-600">Payment Method:</span>
          <span className="font-medium text-stone-900">Razorpay (Online)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-600">Total Paid:</span>
          <span className="font-bold text-emerald-800 font-heading">₹1,099</span>
        </div>
      </div>

      <div className="pt-4">
        <Link href="/" className="inline-block py-3 px-8 bg-[var(--yn-primary)] hover:bg-[var(--yn-primary-hover)] text-white font-bold rounded-xl transition-all">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
