"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Check, ArrowRight, ShieldCheck, Filter } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { MobileStickyCart } from "@/components/ui/MobileStickyCart";
import { ProductCard, Product } from "@/components/ui/ProductCard";

export default function ProductsCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch("https://api.younoya.com/api/v1/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          setProducts(data.data);
        }
      })
      .catch((e) => console.log("Error loading live products from database:", e))
      .finally(() => setLoading(false));
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

  return (
    <div className="relative min-h-screen bg-[#FDFCF8] text-[#1C1C1C] pt-36 pb-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-mono tracking-[0.18em] uppercase text-[#D4AF37] font-bold">
            COMPLETE CONSECRATED COLLECTION
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#1C1C1C] tracking-tight">
            Explore All Consecrated Rakhis
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Discover the full catalog of astrological keepsakes, handcrafted Gomti Chakras, Rudrakshas, and pure silk threads.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E2E8E4] shadow-sm">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search size={15} className="absolute left-4 top-3.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by spiritual element or blessing..."
              className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#1C1C1C] text-white shadow-sm"
                    : "bg-[#E2E8E4] text-[#1C1C1C] hover:bg-[#D4DFD7]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="clinical-card p-6 flex flex-col justify-between space-y-5 animate-pulse">
                <div className="w-full aspect-square rounded-2xl bg-stone-200" />
                <div className="space-y-2">
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-100 rounded w-1/2" />
                  <div className="h-5 bg-stone-200 rounded w-1/3 pt-1" />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="h-9 bg-stone-200 rounded-full" />
                  <div className="h-9 bg-stone-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>

      <MobileStickyCart />
    </div>
  );
}
