"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, Edit, Trash2, Image as ImageIcon, Save, ArrowLeft, 
  CheckCircle, AlertCircle, Sparkles, RefreshCw, Eye, ExternalLink, Globe, Lock, LogOut
} from "lucide-react";

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
  features: string[] | string;
  images: string[] | string;
  meta_title: string;
  meta_description: string;
  inventory_count: number;
}

const BACKEND_URL = "https://api.younoya.com";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Check existing session token on mount
  useEffect(() => {
    const token = localStorage.getItem("yn_admin_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const json = await res.json();

      if (json.success && json.token) {
        localStorage.setItem("yn_admin_token", json.token);
        setIsAuthenticated(true);
      } else {
        setLoginError(json.error || "Invalid username or password");
      }
    } catch (err: any) {
      setLoginError("Could not connect to backend server: " + err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("yn_admin_token");
    setIsAuthenticated(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/products`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProducts(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const handleEdit = (prod: Product) => {
    setSelectedProduct({ ...prod });
    setIsNew(false);
    setIsEditing(true);
  };

  const handleCreate = () => {
    const newProd: Product = {
      id: "prod_" + Date.now(),
      handle: "new-vedic-rakhi-" + Date.now(),
      sku: "HOFK" + Date.now(),
      title: "New Consecrated Vedic Item",
      subtitle: "Astrologically selected sacred element",
      price: 999,
      original_price: 1199,
      badge: "New",
      description: "Handcrafted with authentic Vedic symbolism and energized threads.",
      features: ["Sacred Mauli Thread", "Complimentary Roli & Chawal"],
      images: [],
      meta_title: "Vedic Rakhi | YOUNOYA",
      meta_description: "Consecrated handcrafted Vedic Rakhi.",
      inventory_count: 100
    };
    setSelectedProduct(newProd);
    setIsNew(true);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedProduct) return;
    setSaving(true);
    setStatusMsg("");

    try {
      const method = isNew ? "POST" : "PUT";
      const endpoint = isNew 
        ? `${BACKEND_URL}/api/v1/admin/products`
        : `${BACKEND_URL}/api/v1/admin/products/${selectedProduct.id}`;

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedProduct)
      });

      const json = await res.json();
      if (json.success) {
        setStatusMsg("✓ Product published successfully to MariaDB & Storefront!");
        setIsEditing(false);
        fetchProducts();
      } else {
        setStatusMsg("❌ Error saving: " + (json.error || "Unknown error"));
      }
    } catch (err: any) {
      setStatusMsg("❌ Network error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/products/${id}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (json.success) {
        fetchProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 1. Password Protected Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center px-4 font-inter">
        <div className="w-full max-w-md p-8 rounded-2xl liquid-glass border border-white/10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-black flex items-center justify-center font-bold text-xl mx-auto shadow-lg">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">YOUNOYA Admin</h1>
            <p className="text-xs text-white/60">Enter credentials to manage products and store settings.</p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/50 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg mt-2"
            >
              {loginLoading ? "Authenticating..." : "Sign In to Admin"}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-white/40 hover:text-white transition-colors">
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard View
  return (
    <div className="min-h-screen bg-[#0d0f12] text-stone-200 font-inter">
      {/* Top Admin Header */}
      <header className="border-b border-white/10 bg-[#14171d] px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-black flex items-center justify-center font-bold text-sm">
            Y
          </div>
          <div>
            <div className="font-bold text-white tracking-wider flex items-center gap-2">
              YOUNOYA <span className="text-xs bg-amber-500/20 text-amber-300 font-normal px-2 py-0.5 rounded">Store Admin</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Link 
            href="/" 
            target="_blank"
            className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors"
          >
            <span>View Live Store</span>
            <ExternalLink size={13} />
          </Link>
          <button 
            onClick={fetchProducts}
            className="p-2 hover:bg-white/5 rounded-lg text-stone-400 hover:text-white transition-colors"
            title="Refresh database"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-red-500/20 hover:text-red-300 rounded-lg text-stone-400 transition-colors"
            title="Sign out"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {statusMsg && (
          <div className="mb-6 p-4 rounded-xl liquid-glass border border-emerald-500/30 text-emerald-300 text-sm font-medium">
            {statusMsg}
          </div>
        )}

        {!isEditing ? (
          /* ========================================================
             PRODUCT LIST VIEW (Shopify Products Table)
             ======================================================== */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Products ({products.length})</h1>
                <p className="text-xs text-stone-400 mt-1">Manage catalog, inventory, pricing, and SEO meta tags.</p>
              </div>

              <button
                onClick={handleCreate}
                className="bg-white text-black text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg"
              >
                <Plus size={16} />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table Card */}
            <div className="border border-white/10 rounded-2xl bg-[#14171d] overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-stone-400 uppercase font-mono text-[10px] tracking-wider">
                    <th className="py-3.5 px-6">Product</th>
                    <th className="py-3.5 px-6">SKU / Handle</th>
                    <th className="py-3.5 px-6">Price</th>
                    <th className="py-3.5 px-6">Inventory</th>
                    <th className="py-3.5 px-6">Badge</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-400">
                        {loading ? "Loading products from MariaDB..." : "No products found. Click 'Add Product' above to create one."}
                      </td>
                    </tr>
                  ) : (
                    products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-white text-sm">{prod.title}</div>
                          <div className="text-xs text-amber-400/80 line-clamp-1 mt-0.5">{prod.subtitle}</div>
                        </td>
                        <td className="py-4 px-6 text-stone-400 font-mono text-[11px]">
                          <div>{prod.sku || "N/A"}</div>
                          <div className="text-[10px] text-stone-500">{prod.handle}</div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-white">
                          ₹{prod.price} <span className="text-stone-500 text-[10px] line-through">₹{prod.original_price}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-500/20">
                            {prod.inventory_count || 100} in stock
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/20">
                            {prod.badge || "Standard"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(prod)}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-stone-300 hover:text-white transition-colors inline-flex items-center gap-1 text-xs"
                            title="Edit product"
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id)}
                            className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors inline-flex items-center gap-1 text-xs"
                            title="Delete product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ========================================================
             SHOPIFY-STYLE PRODUCT EDITOR VIEW
             ======================================================== */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Back to Products</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-xs text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold uppercase tracking-wider px-6 py-2 rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg flex items-center gap-2"
                >
                  <Save size={15} />
                  <span>{saving ? "Publishing..." : "Save Product"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Columns: Title, Description, Media, SEO */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title & Subtitle Card */}
                <div className="border border-white/10 rounded-2xl bg-[#14171d] p-6 space-y-4 shadow-xl">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-400">Title & Narrative</h2>
                  
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5">Product Title*</label>
                    <input
                      type="text"
                      value={selectedProduct?.title || ""}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct!, title: e.target.value })}
                      className="w-full bg-[#0d0f12] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="e.g. Vedic Prosperity Rakhi Set"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5">Astrological Subtitle / Blessing Summary</label>
                    <input
                      type="text"
                      value={selectedProduct?.subtitle || ""}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct!, subtitle: e.target.value })}
                      className="w-full bg-[#0d0f12] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="e.g. Sacred consecration for sibling grace"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5">Rich Description</label>
                    <textarea
                      rows={5}
                      value={selectedProduct?.description || ""}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct!, description: e.target.value })}
                      className="w-full bg-[#0d0f12] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="Detailed spiritual symbolism, sacred materials, and story..."
                    />
                  </div>
                </div>

                {/* SEO Meta Tags (Shopify Search Engine Listing) */}
                <div className="border border-white/10 rounded-2xl bg-[#14171d] p-6 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-stone-400">
                    <Globe size={16} className="text-amber-400" />
                    <span>Search Engine Listing Preview (SEO)</span>
                  </div>

                  <div className="bg-[#0d0f12] p-4 rounded-xl border border-white/5 space-y-1">
                    <div className="text-xs text-blue-400 font-medium">https://younoya.com/products/{selectedProduct?.handle}</div>
                    <div className="text-sm font-semibold text-white">{selectedProduct?.meta_title || selectedProduct?.title}</div>
                    <div className="text-xs text-stone-400 line-clamp-2">{selectedProduct?.meta_description || selectedProduct?.description}</div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">Page Meta Title</label>
                      <input
                        type="text"
                        value={selectedProduct?.meta_title || ""}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct!, meta_title: e.target.value })}
                        className="w-full bg-[#0d0f12] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        placeholder="Vedic Prosperity Rakhi | YOUNOYA"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">Meta Description</label>
                      <textarea
                        rows={2}
                        value={selectedProduct?.meta_description || ""}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct!, meta_description: e.target.value })}
                        className="w-full bg-[#0d0f12] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        placeholder="Concise search engine snippet..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">URL Handle (Slug)</label>
                      <input
                        type="text"
                        value={selectedProduct?.handle || ""}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct!, handle: e.target.value })}
                        className="w-full bg-[#0d0f12] border border-white/10 rounded-xl px-4 py-2 text-xs text-stone-400 font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing, Inventory & Status */}
              <div className="space-y-6">
                {/* Pricing Card */}
                <div className="border border-white/10 rounded-2xl bg-[#14171d] p-6 space-y-4 shadow-xl">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-400">Pricing & Taxes</h2>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">Selling Price (₹)*</label>
                    <input
                      type="number"
                      value={selectedProduct?.price || 0}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct!, price: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#0d0f12] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">Compare-at Price (₹)</label>
                    <input
                      type="number"
                      value={selectedProduct?.original_price || 0}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct!, original_price: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#0d0f12] border border-white/10 rounded-xl px-4 py-2 text-xs text-stone-400 line-through focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="text-[11px] text-emerald-400 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/20">
                    ✓ 100% Free Express Shipping included
                  </div>
                </div>

                {/* Organization & Badges */}
                <div className="border border-white/10 rounded-2xl bg-[#14171d] p-6 space-y-4 shadow-xl">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-400">Organization</h2>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">SKU (Stock Keeping Unit)</label>
                    <input
                      type="text"
                      value={selectedProduct?.sku || ""}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct!, sku: e.target.value })}
                      className="w-full bg-[#0d0f12] border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={selectedProduct?.badge || ""}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct!, badge: e.target.value })}
                      className="w-full bg-[#0d0f12] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      placeholder="e.g. Bestseller, Signature, Sacred"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">Available Quantity</label>
                    <input
                      type="number"
                      value={selectedProduct?.inventory_count || 100}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct!, inventory_count: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#0d0f12] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
