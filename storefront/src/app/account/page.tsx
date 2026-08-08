import React from 'react';
import Link from 'next/link';

export default function AccountPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 font-body">
      <h1 className="text-3xl font-heading font-bold text-stone-900 border-b border-stone-200 pb-4">
        Account Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/account/orders" className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-2">
          <h3 className="font-heading font-bold text-stone-900 text-lg">📦 Order History</h3>
          <p className="text-xs text-stone-600">Track and view your recent orders.</p>
        </Link>
        <Link href="/account/addresses" className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-2">
          <h3 className="font-heading font-bold text-stone-900 text-lg">🏠 Saved Addresses</h3>
          <p className="text-xs text-stone-600">Manage delivery addresses.</p>
        </Link>
        <Link href="/account/profile" className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-2">
          <h3 className="font-heading font-bold text-stone-900 text-lg">👤 Profile Info</h3>
          <p className="text-xs text-stone-600">View contact details.</p>
        </Link>
      </div>
    </div>
  );
}
