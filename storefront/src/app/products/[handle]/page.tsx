import React from 'react';
import Link from 'next/link';
import PriceDisplay from '@/components/ui/PriceDisplay';

const PRODUCT_MAP: Record<string, { title: string; sku: string; price: number; originalPrice: number; description: string; features: string[] }> = {
  "vedic-prosperity-rakhi": {
    title: "Vedic Prosperity Rakhi Set with Dry Fruits & Consecrated Thread",
    sku: "HOFK0009275279",
    price: 1099,
    originalPrice: 1299,
    description: `In cherished traditions, this designer handcrafted Vedic Rakhi set in vibrant colors tells a story of elegance and affection. Each intricately crafted rakhi celebrates the unique bond between siblings. The artful beadwork and rich colors make this an exquisite and memorable Raksha Bandhan gift that beautifully honours the most cherished relationships in the family.\n\nNow no more fearing planetary influences. Let this handcrafted Vedic Rakhi become a symbol of protection and blessings for every brother and sister.`,
    features: [
      "Designer Beads Rakhi Set: 1 N",
      "Sacred Symbolism & Vedic Elements: 1 N",
      "Almonds: 100 Gm",
      "Cashews: 100 Gm",
      "Complimentary Roli & Chawal Packets",
    ],
  },
  "vedic-prosperity-wealth-attraction-rakhi": {
    title: "Vedic Prosperity & Wealth Attraction Rakhi",
    sku: "HOFK0009275280",
    price: 999,
    originalPrice: 1199,
    description: `Featuring an astrologically selected crystal, oyster shells, sacred red-yellow mauli and thoughtfully curated Vedic elements, for PROSPERITY AND WEALTH ATTRACTION this Rakhi is designed to honour tradition while becoming a keepsake your brother can treasure long after the festival.`,
    features: [
      "Astrologically Curated Crystal: 1 N",
      "Natural Conch & Oyster Shell Details",
      "Sacred Red-Yellow Mauli Thread",
      "Complimentary Roli & Chawal Packets",
    ],
  },
  "vedic-abundance-blessing-rakhi": {
    title: "Vedic Abundance & Blessing Rakhi",
    sku: "HOFK0009275281",
    price: 999,
    originalPrice: 1199,
    description: `Celebrate Raksha Bandhan with a handcrafted Vedic Rakhi where every element has been chosen with intention. Designed to be treasured beyond the festival, this Rakhi becomes a lasting reminder of your wishes for prosperity, harmony and lifelong happiness.`,
    features: [
      "Handcrafted Vedic Thread: 1 N",
      "Sacred Symbolism",
      "Reusable Keepsake Box",
      "Complimentary Roli & Chawal Packets",
    ],
  },
  "navagraha-om-protection-kaudi-rakhi": {
    title: "Navagraha Om Protection Kaudi Rakhi",
    sku: "HOFK0009275282",
    price: 1099,
    originalPrice: 1299,
    description: `Featuring astrologically selected crystal accents, sacred kaudis symbolising prosperity and Goddess Lakshmi’s blessings, an Om motif representing divine protection, the timeless red-yellow mauli thread, and Vedic elements inspired by the harmony of the Navagrahas.`,
    features: [
      "Navagraha-Inspired Crystal Accents",
      "Sacred Kaudi Detailing & Om Motif",
      "Evil Eye Protection Thread",
      "Complimentary Roli & Chawal Packets",
    ],
  },
};

const SIMILAR_PRODUCTS = [
  { handle: "vedic-prosperity-rakhi", title: "Vedic Prosperity Rakhi", price: 1099, originalPrice: 1299 },
  { handle: "vedic-prosperity-wealth-attraction-rakhi", title: "Vedic Prosperity & Wealth Attraction Rakhi", price: 999, originalPrice: 1199 },
  { handle: "vedic-abundance-blessing-rakhi", title: "Vedic Abundance & Blessing Rakhi", price: 999, originalPrice: 1199 },
  { handle: "navagraha-om-protection-kaudi-rakhi", title: "Navagraha Om Protection Kaudi Rakhi", price: 1099, originalPrice: 1299 },
];

export async function generateStaticParams() {
  return [
    { handle: "vedic-prosperity-rakhi" },
    { handle: "vedic-prosperity-wealth-attraction-rakhi" },
    { handle: "vedic-abundance-blessing-rakhi" },
    { handle: "navagraha-om-protection-kaudi-rakhi" }
  ];
}

export default async function ProductDetailPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = PRODUCT_MAP[handle] || PRODUCT_MAP["vedic-prosperity-rakhi"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 font-body bg-[#faf6f0]">
      {/* Breadcrumbs */}
      <nav className="text-xs text-stone-500 flex items-center gap-1.5 font-light">
        <Link href="/" className="hover:underline hover:text-orange-600">Home</Link>
        <span>&gt;</span>
        <Link href="/search" className="hover:underline hover:text-orange-600">Vedic Rakhis</Link>
        <span>&gt;</span>
        <span className="text-stone-800 font-medium">{product.title}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white p-6 sm:p-8 rounded-2xl border border-orange-100 shadow-sm">
        {/* Left Image Gallery (6 cols) */}
        <div className="lg:col-span-6 flex gap-4">
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-16 h-16 border border-orange-200 rounded-lg bg-orange-50/50 flex items-center justify-center text-xs text-stone-400 cursor-pointer hover:border-orange-500 transition-colors">
                Rakhi {i}
              </div>
            ))}
          </div>
          <div className="flex-1 bg-gradient-to-b from-orange-50 to-amber-50 border border-orange-100 rounded-xl h-96 sm:h-[450px] flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden">
            <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-md shadow-xs">
              Same Day Delivery | Today
            </span>
            <div className="text-5xl font-heading text-amber-700 italic font-bold tracking-wide">YOUNOYA</div>
            <div className="text-sm font-semibold text-stone-600">{product.title}</div>
          </div>
        </div>

        {/* Right Product Information Panel (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold font-heading text-stone-900 leading-snug">{product.title}</h1>
            <div className="text-xs text-stone-400 mt-1">SKU: {product.sku}</div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <PriceDisplay amount={product.price} className="text-3xl font-bold text-orange-600 font-heading" />
            <span className="text-sm text-stone-400 line-through">₹{product.originalPrice}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Save ₹{product.originalPrice - product.price}</span>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 block">Qty:</label>
            <div className="inline-flex items-center border border-orange-200 rounded-lg bg-orange-50/30 text-xs">
              <button className="px-3.5 py-2 text-stone-600 hover:bg-orange-100 font-bold rounded-l-lg transition-colors">-</button>
              <span className="px-4 py-2 font-semibold text-stone-800 border-x border-orange-200">1</span>
              <button className="px-3.5 py-2 text-stone-600 hover:bg-orange-100 font-bold rounded-r-lg transition-colors">+</button>
            </div>
          </div>

          {/* Delivery Date Picker */}
          <div className="space-y-1.5 max-w-sm">
            <label className="text-xs font-semibold text-stone-700 block">Select Delivery Date*</label>
            <input
              type="date"
              className="w-full h-11 px-4 text-xs border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-white"
            />
          </div>

          {/* PIN Code Checker */}
          <div className="space-y-1.5 max-w-sm">
            <label className="text-xs font-semibold text-stone-700 flex items-center gap-1">
              📍 Check Delivery Pincode
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit Pincode"
                className="flex-1 h-10 px-4 text-xs border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
              <button className="px-5 text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white rounded-lg uppercase tracking-wider transition-colors">
                CHECK
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 max-w-sm space-y-3">
            <Link href="/checkout" className="block w-full text-center py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-sm font-bold rounded-lg uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform active:scale-95">
              Buy Now
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs: Description & Delivery Info */}
      <div className="pt-6 bg-white p-6 sm:p-8 rounded-2xl border border-orange-100 shadow-sm space-y-6">
        <div className="flex justify-center border-b border-orange-100 gap-8 text-sm font-bold">
          <span className="pb-3 text-orange-600 border-b-2 border-orange-600 cursor-pointer">Description</span>
          <span className="pb-3 text-stone-500 hover:text-stone-800 cursor-pointer">Delivery Information</span>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 text-xs text-stone-700 leading-relaxed font-light">
          <p className="whitespace-pre-line">{product.description}</p>
          
          <div className="pt-2">
            <strong className="font-bold text-stone-900 block mb-1">Product Details:</strong>
            <ul className="list-disc pl-5 space-y-1 text-stone-600">
              {product.features.map((feat, idx) => (
                <li key={idx}>{feat}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <div className="pt-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold font-heading text-stone-900 tracking-wide border-b-2 border-orange-500 inline-block pb-1 px-4">
            Similar Vedic Rakhis
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SIMILAR_PRODUCTS.map((prod) => (
            <div key={prod.handle} className="bg-white border border-orange-100 rounded-xl p-4 space-y-3 hover:shadow-lg transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="bg-orange-50/50 h-36 rounded-lg flex items-center justify-center text-xs text-stone-400 font-bold p-2 text-center">
                  {prod.title}
                </div>
                <h4 className="font-bold text-xs text-stone-800 line-clamp-1">{prod.title}</h4>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="text-orange-600">₹{prod.price}</span>
                  <span className="text-stone-400 line-through text-[10px]">₹{prod.originalPrice}</span>
                </div>
              </div>
              <Link href={`/products/${prod.handle}`} className="block text-center text-[11px] font-semibold text-orange-600 border border-orange-500 py-1.5 rounded-lg hover:bg-orange-50 transition-colors">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
