import React from 'react';
import Link from 'next/link';

export default function OrderHistoryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 font-body">
      <h1 className="text-3xl font-heading font-bold text-stone-900 border-b border-stone-200 pb-4">
        Your Order History
      </h1>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-stone-100 pb-3">
          <div>
            <span className="font-mono text-xs font-semibold text-stone-500">Order #ORD_1723056000000</span>
            <div className="font-heading font-bold text-stone-900">Vedic Prosperity Rakhi</div>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-md">Paid</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone-600">Total: <strong className="text-stone-900">₹1,099</strong></span>
          <Link href="/order/confirmed/ord_1723056000000" className="text-[var(--yn-primary)] hover:underline font-semibold text-xs">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
