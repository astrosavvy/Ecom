import React from 'react';
import Link from 'next/link';
import PriceDisplay from '@/components/ui/PriceDisplay';

const ALL_PRODUCTS = [
  {
    handle: "vedic-prosperity-rakhi",
    title: "Vedic Prosperity Rakhi",
    price: 1099,
    description: "अब ग्रहों से डरने की ज़रूरत नहीं - vedic rakhi करेगी भाई बहन की रक्षा",
  },
  {
    handle: "vedic-prosperity-wealth-attraction-rakhi",
    title: "Vedic Prosperity & Wealth Attraction Rakhi",
    price: 999,
    description: "Astrologically selected crystal, oyster shells & sacred red-yellow mauli",
  },
  {
    handle: "vedic-abundance-blessing-rakhi",
    title: "Vedic Abundance & Blessing Rakhi",
    price: 999,
    description: "Honour tradition while becoming a keepsake your brother can treasure",
  },
  {
    handle: "navagraha-om-protection-kaudi-rakhi",
    title: "Navagraha Om Protection Kaudi Rakhi",
    price: 1099,
    description: "Sacred kaudis, Om motif & Navagraha-inspired harmony thread",
  },
];

export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-3xl font-bold font-heading">Vedic Rakhi Collection</h1>
        <p className="text-sm text-stone-600 font-light mt-1">Handcrafted with intention, sacred symbolism, and astrological curation.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_PRODUCTS.map((prod) => (
          <div key={prod.handle} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <h3 className="font-heading text-lg font-bold text-stone-900">{prod.title}</h3>
              <PriceDisplay amount={prod.price} className="text-xl font-bold text-emerald-700 block font-heading" />
              <p className="text-xs text-stone-600 leading-relaxed">{prod.description}</p>
            </div>
            <div className="pt-6">
              <Link href={`/products/${prod.handle}`} className="block text-center py-2 px-4 bg-[var(--yn-primary)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--yn-primary-hover)] transition-colors">
                View & Buy Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
