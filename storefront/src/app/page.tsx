import Link from "next/link";
import PriceDisplay from "@/components/ui/PriceDisplay";

const RAKHI_PRODUCTS = [
  {
    handle: "vedic-prosperity-rakhi",
    title: "Vedic Prosperity Rakhi Set with Dry Fruits & Consecrated Thread",
    subtitle: "अब ग्रहों से डरने की ज़रूरत नहीं - vedic rakhi करेगी भाई बहन की रक्षा",
    price: 1099,
    originalPrice: 1299,
    badge: "Bestseller",
    description: "Designed to be treasured beyond the festival, this handcrafted Rakhi becomes a lasting reminder of your wishes for prosperity, harmony and lifelong happiness."
  },
  {
    handle: "vedic-prosperity-wealth-attraction-rakhi",
    title: "Vedic Prosperity & Wealth Attraction Rakhi",
    subtitle: "Astrologically selected crystal, oyster shells & sacred red-yellow mauli",
    price: 999,
    originalPrice: 1199,
    badge: "Popular",
    description: "Featuring an astrologically selected crystal, oyster shells, and sacred red-yellow mauli for protection and wealth attraction."
  },
  {
    handle: "vedic-abundance-blessing-rakhi",
    title: "Vedic Abundance & Blessing Rakhi",
    subtitle: "Honour tradition while becoming a keepsake your brother can treasure",
    price: 999,
    originalPrice: 1199,
    badge: "New",
    description: "Celebrate Raksha Bandhan with a handcrafted Vedic Rakhi where every element has been chosen with intention."
  },
  {
    handle: "navagraha-om-protection-kaudi-rakhi",
    title: "Navagraha Om Protection Kaudi Rakhi",
    subtitle: "Sacred kaudis, Om motif & Navagraha-inspired harmony thread",
    price: 1099,
    originalPrice: 1299,
    badge: "Sacred",
    description: "Sacred kaudis symbolising Goddess Lakshmi's blessings with an Om motif representing divine planetary harmony."
  },
];

export default function Home() {
  return (
    <div className="space-y-12 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-body bg-[#faf6f0]">
      {/* Clean Category Header Title (Hero Banner Removed Per User Request) */}
      <section className="text-center space-y-3 pt-2">
        <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-800 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
          Authentic Consecrated Vedic Rakhis 2026
        </span>
        <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-stone-900 tracking-tight">
          Handcrafted Vedic Rakhis for Blessings & Protection
        </h1>
        <p className="text-stone-600 text-xs md:text-sm max-w-2xl mx-auto font-light leading-relaxed">
          Inspired by timeless traditions, each Rakhi transforms a sacred thread into a meaningful keepsake celebrating prosperity, harmony, and sibling love.
        </p>
      </section>

      {/* Product Grid Section */}
      <section className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RAKHI_PRODUCTS.map((prod) => (
            <div
              key={prod.handle}
              className="group bg-white border border-orange-100 rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Product Image Container */}
                <div className="bg-gradient-to-b from-orange-50/50 to-amber-50/30 h-52 rounded-xl flex flex-col items-center justify-center p-4 text-center relative overflow-hidden border border-orange-100/50">
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-md shadow-xs">
                    {prod.badge}
                  </span>
                  <div className="text-3xl font-heading text-amber-700 font-bold italic tracking-wide group-hover:scale-110 transition-transform duration-300">
                    YOUNOYA
                  </div>
                  <span className="text-[11px] font-semibold text-stone-500 mt-1">Vedic Collection</span>
                </div>

                {/* Subtitle / Hindi Catchphrase */}
                <div className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                  {prod.subtitle}
                </div>

                {/* Title */}
                <h3 className="font-bold text-sm text-stone-900 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                  <Link href={`/products/${prod.handle}`}>{prod.title}</Link>
                </h3>

                {/* Description Snippet */}
                <p className="text-xs text-stone-500 line-clamp-2 font-light leading-relaxed">
                  {prod.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 pt-1">
                  <PriceDisplay amount={prod.price} className="text-lg font-bold text-orange-600 font-heading" />
                  <span className="text-xs text-stone-400 line-through">₹{prod.originalPrice}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <Link
                  href={`/products/${prod.handle}`}
                  className="block text-center py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform active:scale-95"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
