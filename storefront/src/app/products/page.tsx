"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Check, ArrowRight, ShieldCheck, Filter } from "lucide-react";
import { useCart } from "@/lib/CartContext";

interface Product {
  id: string;
  handle: string;
  sku: string;
  title: string;
  subtitle: string;
  price: number;
  original_price: number;
  badge: string;
  description: string;
  images: string[] | string;
  features: string[] | string;
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "prod_1",
    handle: "vedic-prosperity-rakhi",
    sku: "HOFK0009275279",
    title: "Vedic Prosperity Rakhi Set with Dry Fruits & Consecrated Thread",
    subtitle: "Sacred consecration for sibling grace and planetary harmony",
    price: 1099,
    original_price: 1299,
    badge: "Signature Edition",
    description: "An authentic consecrated Vedic Rakhi energized with sacred mantras, hand-threaded with Resham, accompanied by premium California almonds and sacred Akshat-Roli.",
    images: ["https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800"],
    features: ["Prana Pratishtha Consecration", "Sacred Resham & Gold Wire", "Includes Roli, Chawal & Dry Fruits"]
  },
  {
    id: "prod_2",
    handle: "vedic-prosperity-wealth-attraction-rakhi",
    sku: "HOFK0009275280",
    title: "Vedic Prosperity & Wealth Attraction Rakhi",
    subtitle: "Astrologically selected crystal, oyster shells & sacred mauli",
    price: 989,
    original_price: 1199,
    badge: "Prosperity",
    description: "Handcrafted with natural Gomti Chakra and energized yellow Kaudi, dedicated to invoking Goddess Lakshmi's perpetual blessings for brothers.",
    images: ["https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800"],
    features: ["Natural Gomti Chakra", "Yellow Kaudi Shell", "Energized by Vedic Pandits"]
  },
  {
    id: "prod_3",
    handle: "vedic-abundance-blessing-rakhi",
    sku: "HOFK0009275281",
    title: "Vedic Abundance & Blessing Rakhi",
    subtitle: "A keepsake designed to be treasured long after the festive hour",
    price: 999,
    original_price: 1199,
    badge: "Abundance",
    description: "Created using pure silver-plated motifs and blessed Rudraksha beads for health, vitality, and shielding negative energies.",
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"],
    features: ["5 Mukhi Rudraksha Bead", "Silver-Plated Centerpiece", "100% Organic Silk Threads"]
  },
  {
    id: "prod_4",
    handle: "navagraha-om-protection-kaudi-rakhi",
    sku: "HOFK0009275282",
    title: "Navagraha Om Protection Kaudi Rakhi",
    subtitle: "Sacred kaudi, Om motif & Navagraha-inspired planetary harmony",
    price: 1099,
    original_price: 1299,
    badge: "Sacred Shield",
    description: "Harmonizes the 9 astrological planets with 9 colored sacred silk threads and a central energized brass Om talisman.",
    images: ["https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800"],
    features: ["9 Astrological Silk Strands", "Pure Brass Om Talisman", "Planetary Shielding Blessing"]
  }
];

export default function ProductsCatalogPage() {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    fetch("https://api.younoya.com/api/v1/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          setProducts(data.data);
        }
      })
      .catch((e) => console.log("Using cached products:", e));
  }, []);

  const categories = ["All", "Signature", "Prosperity", "Sacred Shield", "Abundance"];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      (p.badge && p.badge.toLowerCase().includes(selectedCategory.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (prod: Product) => {
    const prodImgs: string[] = Array.isArray(prod.images)
      ? prod.images
      : (typeof prod.images === "string" ? JSON.parse(prod.images || "[]") : []);
    const img = prodImgs[0] || "https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800";

    addItem({
      id: prod.id,
      handle: prod.handle,
      title: prod.title,
      subtitle: prod.subtitle,
      price: prod.price,
      original_price: prod.original_price,
      image: img
    });

    setAddedItem(prod.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#0c0d12] text-[#edf1f8] pt-32 pb-24 px-6 sm:px-12">
      {/* Background Atmosphere */}
      <div className="absolute top-[8%] right-[10%] w-[600px] h-[600px] rounded-full bg-[#2e63ff]/15 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] left-[5%] w-[550px] h-[550px] rounded-full bg-[#ff2e88]/12 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-mono tracking-[0.18em] uppercase text-[#25e0ff]">
            COMPLETE CONSECRATED COLLECTION
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-space text-white tracking-tight">
            Explore All Consecrated Rakhis
          </h1>
          <p className="text-xs sm:text-sm text-[#9ca6be] leading-relaxed">
            Discover the full catalog of astrological keepsakes, handcrafted Gomti Chakras, Rudrakshas, and pure silk threads.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#121520]/80 border border-white/10 backdrop-blur-xl">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search size={15} className="absolute left-4 top-3.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by spiritual element or blessing..."
              className="w-full bg-[#080a10] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-amber-400 text-black font-bold shadow-[0_0_12px_rgba(251,191,36,0.4)]"
                    : "bg-white/5 text-stone-400 hover:text-white border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => {
            const prodImgs: string[] = Array.isArray(prod.images)
              ? prod.images
              : (typeof prod.images === "string" ? JSON.parse(prod.images || "[]") : []);
            const thumb = prodImgs[0] || "https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800";

            return (
              <div
                key={prod.id}
                className="chrome-card rounded-2xl p-5 flex flex-col justify-between space-y-5 group"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/12">
                  <img
                    src={thumb}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  {prod.badge && (
                    <span className="absolute top-3 left-3 bg-black/85 backdrop-blur-md text-amber-300 text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border border-amber-400/35 shadow-lg">
                      {prod.badge}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <Link href={`/products/${prod.handle}`} className="block">
                    <h3 className="text-sm font-bold font-space text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                      {prod.title}
                    </h3>
                  </Link>
                  <p className="text-[11px] text-[#9ca6be] line-clamp-1">
                    {prod.subtitle}
                  </p>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-lg font-bold font-space text-white">
                      ₹{prod.price}
                    </span>
                    <span className="text-xs text-stone-500 line-through">
                      ₹{prod.original_price}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium ml-auto">
                      Save ₹{prod.original_price - prod.price}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleAddToCart(prod)}
                    className="py-2.5 rounded-xl aero-btn-secondary text-stone-200 text-xs font-semibold hover:text-white flex items-center justify-center gap-1.5"
                  >
                    {addedItem === prod.id ? (
                      <>
                        <Check size={13} className="text-emerald-400" />
                        <span className="text-emerald-400">Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={13} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <Link
                    href="/checkout"
                    onClick={() => handleAddToCart(prod)}
                    className="py-2.5 rounded-xl aero-btn-primary text-white text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
