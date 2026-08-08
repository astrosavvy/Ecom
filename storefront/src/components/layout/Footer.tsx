import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-[#fdf8f5] text-stone-800 font-body border-t border-stone-200">
      {/* Newsletter Subscribe Banner */}
      <div className="bg-[#595757] text-white py-10 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="font-heading text-xl font-bold tracking-wide">Stay Informed. Subscribe for Gifting Insights</h3>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address..."
              className="flex-1 px-4 py-2.5 rounded-full text-xs text-stone-900 focus:outline-none bg-white"
            />
            <button className="bg-[#d9232d] hover:bg-red-700 text-white text-xs font-bold px-6 py-2.5 rounded-full transition-colors uppercase tracking-wider">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
        {/* Categories */}
        <div className="space-y-3">
          <h4 className="font-bold text-stone-900 uppercase tracking-wider">Categories</h4>
          <ul className="space-y-2 text-stone-600 list-none p-0 m-0">
            <li><Link href="/search" className="hover:text-[#d9232d]">Birthday</Link></li>
            <li><Link href="/search" className="hover:text-[#d9232d]">Jewellery & Accessories</Link></li>
            <li><Link href="/search" className="hover:text-[#d9232d]">Greeting Cards</Link></li>
            <li><Link href="/search" className="hover:text-[#d9232d]">Same Day Delivery</Link></li>
            <li><Link href="/search" className="hover:text-[#d9232d]">Personalized Gifts</Link></li>
            <li><Link href="/search" className="hover:text-[#d9232d]">Stationery</Link></li>
          </ul>
        </div>

        {/* Information */}
        <div className="space-y-3">
          <h4 className="font-bold text-stone-900 uppercase tracking-wider">Information</h4>
          <ul className="space-y-2 text-stone-600 list-none p-0 m-0">
            <li><Link href="/terms" className="hover:text-[#d9232d]">Terms & Conditions</Link></li>
            <li><Link href="/shipping" className="hover:text-[#d9232d]">Shipping & Delivery</Link></li>
            <li><Link href="/refund" className="hover:text-[#d9232d]">Cancellation & Returns</Link></li>
            <li><Link href="/privacy" className="hover:text-[#d9232d]">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* About */}
        <div className="space-y-3">
          <h4 className="font-bold text-stone-900 uppercase tracking-wider">About</h4>
          <ul className="space-y-2 text-stone-600 list-none p-0 m-0">
            <li><Link href="/about" className="hover:text-[#d9232d]">About Us</Link></li>
            <li><Link href="/blog" className="hover:text-[#d9232d]">Blog & Articles</Link></li>
            <li><Link href="/contact" className="hover:text-[#d9232d]">Corporate Gifting</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="font-bold text-stone-900 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-stone-600 list-none p-0 m-0">
            <li><Link href="/search" className="hover:text-[#d9232d]">Media</Link></li>
            <li><Link href="/search" className="hover:text-[#d9232d]">Blog</Link></li>
            <li><Link href="/contact" className="hover:text-[#d9232d]">Store Locator</Link></li>
          </ul>
        </div>

        {/* Global Enquiry */}
        <div className="space-y-3 col-span-2 md:col-span-1">
          <h4 className="font-bold text-stone-900 uppercase tracking-wider">Global Enquiry</h4>
          <div className="space-y-2 text-stone-600">
            <div className="font-bold text-[#d9232d] text-lg font-heading italic">YOUNOYA</div>
            <div>Helpline: <strong>011-41608080</strong></div>
            <div>Email: <a href="mailto:support@younoya.com" className="hover:underline text-stone-800">support@younoya.com</a></div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Payment Badges */}
      <div className="border-t border-stone-200 bg-white py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>© 2026 YOUNOYA. All Rights Reserved.</div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-stone-700">VISA</span>
            <span className="font-bold text-stone-700">MasterCard</span>
            <span className="font-bold text-stone-700">PayPal</span>
            <span className="font-bold text-emerald-700">Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
