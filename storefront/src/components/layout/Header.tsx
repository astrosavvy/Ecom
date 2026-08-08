import React from 'react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="w-full bg-white font-body border-b border-orange-100 sticky top-0 z-50 shadow-xs">
      {/* Top Warm Orange Announcement Bar */}
      <div className="bg-[#f97316] text-white text-xs font-semibold py-1.5 px-4 text-center tracking-wide flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span>Free Express Shipping across India on Rakhi Collection | Consecrated & Astrologically Blessed</span>
        <span className="hidden sm:inline">Customer Helpline: +91 (022) 8000-9090</span>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0 transition-transform hover:scale-105">
          <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center font-heading text-2xl font-bold italic shadow-md">
            y
          </div>
          <span className="font-heading italic text-3xl tracking-tight text-stone-900 font-bold">
            YOUNOYA
          </span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Vedic Rakhis, Ritual Kits & Blessing Sets..."
              className="w-full h-11 px-5 pr-12 text-xs border border-orange-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-orange-50/30 transition-all"
            />
            <button className="absolute right-4 top-3 text-orange-500 hover:text-orange-700 transition-colors">
              🔍
            </button>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-6 text-xs font-semibold text-stone-700 shrink-0">
          <Link href="/account/orders" className="flex flex-col items-center gap-1 hover:text-orange-600 transition-colors">
            <span className="text-lg">📍</span>
            <span className="hidden sm:inline">Track Order</span>
          </Link>
          <Link href="/account" className="flex flex-col items-center gap-1 hover:text-orange-600 transition-colors">
            <span className="text-lg">🤍</span>
            <span className="hidden sm:inline">Wishlist</span>
          </Link>
          <Link href="/cart" className="flex flex-col items-center gap-1 hover:text-orange-600 transition-colors relative">
            <span className="text-lg">🛒</span>
            <span className="hidden sm:inline">Cart</span>
            <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
              1
            </span>
          </Link>
          <Link href="/account" className="flex flex-col items-center gap-1 hover:text-orange-600 transition-colors">
            <span className="text-lg">👤</span>
            <span className="hidden sm:inline">Sign In</span>
          </Link>
        </div>
      </div>

      {/* Category Navigation Bar - Filtered specifically to Rakhi Collections */}
      <nav className="border-t border-orange-100 bg-orange-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-10 text-xs font-bold text-stone-800 py-3 uppercase tracking-wider">
          <Link href="/" className="text-orange-600 font-extrabold border-b-2 border-orange-600 pb-0.5">
            Sacred Vedic Rakhi Collection
          </Link>
          <Link href="/search?category=bhaiya-bhabhi" className="hover:text-orange-600 transition-colors">
            Bhaiya Bhabhi Sets
          </Link>
          <Link href="/search?category=navagraha" className="hover:text-orange-600 transition-colors">
            Navagraha Protection Rakhi
          </Link>
          <Link href="/search?category=puja-kits" className="hover:text-orange-600 transition-colors">
            Complimentary Roli-Chawal Kits
          </Link>
        </div>
      </nav>
    </header>
  );
}
