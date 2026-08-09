"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Plus, Edit, Trash2, Image as ImageIcon, Save, ArrowLeft, 
  CheckCircle, AlertCircle, Sparkles, RefreshCw, Eye, ExternalLink, Globe, Lock, LogOut,
  Upload, X, Link as LinkIcon, ShoppingBag, Tag, Users, BarChart3, Package, Truck
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

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  items: any[];
  total_amount: number;
  payment_status: string;
  fulfillment_status: string;
  awb_number: string;
  courier_name: string;
  created_at: string;
}

interface Discount {
  id: string;
  code: string;
  type: string;
  value: number;
  min_order_value: number;
  usage_limit: number;
  used_count: number;
  is_active: boolean | number;
}

const BACKEND_URL = "https://api.younoya.com";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Admin Tab: 'products' | 'orders' | 'discounts'
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "discounts">("products");

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);

  // Product Editing state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // New Discount Form state
  const [showNewDiscountModal, setShowNewDiscountModal] = useState(false);
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    type: "percentage",
    value: 10,
    min_order_value: 0,
    usage_limit: 500
  });

  // Media upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setLoginError("Failed to connect to authentication server");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("yn_admin_token");
    setIsAuthenticated(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resProd, resOrders, resDisc] = await Promise.all([
        fetch(`${BACKEND_URL}/api/v1/admin/products`),
        fetch(`${BACKEND_URL}/api/v1/admin/orders`),
        fetch(`${BACKEND_URL}/api/v1/admin/discounts`)
      ]);

      const dataProd = await resProd.json();
      const dataOrders = await resOrders.json();
      const dataDisc = await resDisc.json();

      if (dataProd.success) setProducts(dataProd.data || []);
      if (dataOrders.success) setOrders(dataOrders.data || []);
      if (dataDisc.success) setDiscounts(dataDisc.data || []);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleEdit = (prod: Product) => {
    setSelectedProduct(JSON.parse(JSON.stringify(prod)));
    setIsEditing(true);
    setIsNew(false);
    setStatusMsg("");
  };

  const handleCreate = () => {
    const newProd: Product = {
      id: "prod_" + Date.now(),
      handle: "new-vedic-rakhi-" + Math.floor(Math.random() * 1000),
      sku: "HOFK" + Math.floor(1000000000 + Math.random() * 9000000000),
      title: "New Consecrated Vedic Rakhi",
      subtitle: "Sacred energization for sibling grace",
      price: 1099,
      original_price: 1299,
      badge: "Signature",
      description: "Handcrafted consecrated Vedic Rakhi set with natural Gomti Chakra, 5 Mukhi Rudraksha, and sacred silk threads.",
      features: [
        "Prana Pratishtha Consecration Ritual",
        "Natural Gomti Chakra / Rudraksha",
        "Includes Roli, Chawal & Dry Fruits"
      ],
      images: ["https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80&w=800"],
      meta_title: "Consecrated Vedic Rakhi | YOUNOYA",
      meta_description: "Handcrafted Vedic Rakhi energized with 108 Gayatri mantras.",
      inventory_count: 100
    };
    setSelectedProduct(newProd);
    setIsEditing(true);
    setIsNew(true);
    setStatusMsg("");
  };

  const handleSave = async () => {
    if (!selectedProduct) return;
    setSaving(true);
    setStatusMsg("");

    try {
      const payload = {
        ...selectedProduct,
        price: Number(selectedProduct.price),
        original_price: Number(selectedProduct.original_price),
        inventory_count: Number(selectedProduct.inventory_count)
      };

      const res = await fetch(`${BACKEND_URL}/api/v1/admin/products`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      if (json.success) {
        setStatusMsg("✓ Product changes published successfully!");
        setIsEditing(false);
        fetchData();
      } else {
        setStatusMsg("❌ Error saving product: " + (json.error || "Unknown failure"));
      }
    } catch (e: any) {
      setStatusMsg("❌ Error saving product: " + e.message);
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
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string, awb?: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fulfillment_status: status, awb_number: awb })
      });
      const json = await res.json();
      if (json.success) {
        setStatusMsg("✓ Order status updated successfully!");
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/discounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDiscount)
      });
      const json = await res.json();
      if (json.success) {
        setStatusMsg("✓ Coupon code created successfully!");
        setShowNewDiscountModal(false);
        setNewDiscount({ code: "", type: "percentage", value: 10, min_order_value: 0, usage_limit: 500 });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 1. Password Protected Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] text-[#1C1C1C] flex items-center justify-center px-4 font-sans">
        <div className="w-full max-w-md p-8 rounded-[32px] bg-white border border-[#E2E8E4] shadow-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#1C1C1C] text-[#D4AF37] flex items-center justify-center font-bold text-xl mx-auto shadow-md">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-extrabold font-heading tracking-tight text-[#1C1C1C]">YOUNOYA Store Admin</h1>
            <p className="text-xs text-stone-500">Enter credentials to manage products, orders, discounts, and store settings.</p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F0] border border-[#E2E8E4] text-[#1C1C1C] text-sm focus:outline-none focus:border-[#1C1C1C] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F0] border border-[#E2E8E4] text-[#1C1C1C] text-sm focus:outline-none focus:border-[#1C1C1C] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-full bg-[#1C1C1C] hover:bg-[#333333] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md mt-2"
            >
              {loginLoading ? "Authenticating..." : "Sign In to Admin"}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-stone-400 hover:text-[#1C1C1C] transition-colors">
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard View (Clinical Luxury White Theme)
  const currentImages: string[] = Array.isArray(selectedProduct?.images)
    ? (selectedProduct?.images as string[])
    : (typeof selectedProduct?.images === "string" ? JSON.parse(selectedProduct.images || "[]") : []);

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1C1C1C] font-sans selection:bg-[#1C1C1C] selection:text-white">
      {/* Top Admin Header */}
      <header className="border-b border-[#E2E8E4] bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1C1C1C] text-[#D4AF37] flex items-center justify-center font-bold text-sm">
            Y
          </div>
          <div>
            <div className="font-extrabold font-heading text-[#1C1C1C] tracking-wider flex items-center gap-2">
              YOUNOYA <span className="text-[10px] font-mono uppercase bg-[#E2E8E4] text-[#1C1C1C] font-bold px-2 py-0.5 rounded-full">Store Admin</span>
            </div>
          </div>
        </div>

        {/* Center Tabs */}
        <div className="hidden md:flex items-center gap-1.5 bg-[#F5F5F0] p-1.5 rounded-2xl border border-[#E2E8E4]">
          <button
            onClick={() => { setIsEditing(false); setActiveTab("products"); }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "products" && !isEditing ? "bg-[#1C1C1C] text-white shadow-sm" : "text-stone-600 hover:text-[#1C1C1C]"
            }`}
          >
            <Package size={14} />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => { setIsEditing(false); setActiveTab("orders"); }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "orders" ? "bg-[#1C1C1C] text-white shadow-sm" : "text-stone-600 hover:text-[#1C1C1C]"
            }`}
          >
            <ShoppingBag size={14} />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => { setIsEditing(false); setActiveTab("discounts"); }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "discounts" ? "bg-[#1C1C1C] text-white shadow-sm" : "text-stone-600 hover:text-[#1C1C1C]"
            }`}
          >
            <Tag size={14} />
            <span>Discounts ({discounts.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Link 
            href="/" 
            target="_blank"
            className="flex items-center gap-1.5 text-stone-600 hover:text-[#1C1C1C] font-semibold transition-colors"
          >
            <span>View Live Store</span>
            <ExternalLink size={13} />
          </Link>
          <button 
            onClick={fetchData}
            className="p-2 hover:bg-[#F5F5F0] rounded-xl text-stone-600 hover:text-[#1C1C1C] transition-colors"
            title="Refresh database"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E2E8E4] hover:bg-red-100 hover:text-red-700 rounded-full text-[#1C1C1C] font-bold transition-colors"
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
          <div className="mb-6 p-4 rounded-2xl bg-[#E2E8E4] border border-[#C2D6C2] text-[#1C1C1C] text-sm font-medium flex items-center justify-between shadow-sm">
            <span>{statusMsg}</span>
            <button onClick={() => setStatusMsg("")}><X size={14} /></button>
          </div>
        )}

        {/* Quick Analytics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="clinical-card p-6 shadow-sm">
            <div className="text-xs text-stone-500 font-bold uppercase font-mono tracking-wider">Total Products</div>
            <div className="text-3xl font-extrabold font-heading text-[#1C1C1C] mt-1">{products.length}</div>
          </div>
          <div className="clinical-card p-6 shadow-sm">
            <div className="text-xs text-stone-500 font-bold uppercase font-mono tracking-wider">Total Orders (OMS)</div>
            <div className="text-3xl font-extrabold font-heading text-[#1C1C1C] mt-1">{orders.length}</div>
          </div>
          <div className="clinical-card p-6 shadow-sm">
            <div className="text-xs text-stone-500 font-bold uppercase font-mono tracking-wider">Active Coupons</div>
            <div className="text-3xl font-extrabold font-heading text-[#D4AF37] mt-1">{discounts.length}</div>
          </div>
        </div>

        {/* Tab 1: Products */}
        {activeTab === "products" && !isEditing && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1C1C1C] tracking-tight">Products ({products.length})</h1>
                <p className="text-xs text-stone-600 mt-1">Manage catalog, photos, inventory, pricing, and SEO meta tags.</p>
              </div>

              <button
                onClick={handleCreate}
                className="bg-[#1C1C1C] text-white text-xs font-extrabold uppercase tracking-wider px-5 py-3 rounded-full hover:bg-[#333333] transition-all flex items-center gap-2 shadow-md"
              >
                <Plus size={16} />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table Card */}
            <div className="border border-[#E2E8E4] rounded-[24px] bg-white overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8E4] bg-[#F5F5F0] text-stone-600 uppercase font-mono text-[10px] tracking-wider font-bold">
                    <th className="py-3.5 px-6">Product</th>
                    <th className="py-3.5 px-6">SKU / Handle</th>
                    <th className="py-3.5 px-6">Price</th>
                    <th className="py-3.5 px-6">Inventory</th>
                    <th className="py-3.5 px-6">Badge</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8E4]">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-500">
                        {loading ? "Loading products from MariaDB..." : "No products found. Click 'Add Product' above to create one."}
                      </td>
                    </tr>
                  ) : (
                    products.map((prod) => {
                      const prodImgs: string[] = Array.isArray(prod.images) 
                        ? prod.images 
                        : (typeof prod.images === "string" ? JSON.parse(prod.images || "[]") : []);
                      const thumb = prodImgs[0];

                      return (
                        <tr key={prod.id} className="hover:bg-[#F5F5F0]/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-[#E8E6E1] border border-[#E2E8E4] flex items-center justify-center overflow-hidden flex-shrink-0">
                                {thumb ? (
                                  <img src={thumb} alt={prod.title} className="w-full h-full object-cover" />
                                ) : (
                                  <ImageIcon size={18} className="text-stone-400" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-[#1C1C1C] text-sm font-heading">{prod.title}</div>
                                <div className="text-xs text-stone-500 line-clamp-1 mt-0.5">{prod.subtitle}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-stone-600 font-mono text-[11px]">
                            <div className="font-bold text-[#1C1C1C]">{prod.sku || "N/A"}</div>
                            <div className="text-[10px] text-stone-400">{prod.handle}</div>
                          </td>
                          <td className="py-4 px-6 font-extrabold font-mono text-[#1C1C1C]">
                            ₹{prod.price} <span className="text-stone-400 text-[10px] line-through font-normal">₹{prod.original_price}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E2E8E4] text-emerald-800 border border-[#C2D6C2]">
                              {prod.inventory_count || 100} in stock
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-extrabold font-mono bg-[#1C1C1C] text-white">
                              {prod.badge || "Standard"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button
                              onClick={() => handleEdit(prod)}
                              className="px-3 py-1.5 rounded-full bg-[#E2E8E4] text-[#1C1C1C] hover:bg-[#D4DFD7] transition-colors inline-flex items-center gap-1 text-xs font-bold"
                              title="Edit product"
                            >
                              <Edit size={13} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(prod.id)}
                              className="p-1.5 hover:bg-red-100 rounded-full text-stone-400 hover:text-red-700 transition-colors"
                              title="Delete product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Orders (OMS) */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1C1C1C] tracking-tight">Orders & Fulfillment ({orders.length})</h1>
                <p className="text-xs text-stone-600 mt-1">Manage customer orders, track payments, and update Bluedart AWB shipping numbers.</p>
              </div>
            </div>

            <div className="border border-[#E2E8E4] rounded-[24px] bg-white overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8E4] bg-[#F5F5F0] text-stone-600 uppercase font-mono text-[10px] tracking-wider font-bold">
                    <th className="py-3.5 px-6">Order</th>
                    <th className="py-3.5 px-6">Customer</th>
                    <th className="py-3.5 px-6">Total</th>
                    <th className="py-3.5 px-6">Payment</th>
                    <th className="py-3.5 px-6">Fulfillment</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8E4]">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-500">
                        No orders recorded yet. New customer checkout orders will appear here automatically.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#F5F5F0]/50 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-[#1C1C1C]">
                          <div>{o.order_number}</div>
                          <div className="text-[10px] text-stone-400 font-normal">{new Date(o.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-[#1C1C1C]">{o.customer_name}</div>
                          <div className="text-stone-600 text-[11px] font-mono">{o.customer_phone}</div>
                          <div className="text-stone-400 text-[10px]">{o.customer_email}</div>
                        </td>
                        <td className="py-4 px-6 font-extrabold font-mono text-[#1C1C1C]">
                          ₹{o.total_amount}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-[#E2E8E4] text-emerald-800 border border-[#C2D6C2]">
                            {o.payment_status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-[#E2E8E4] text-[#1C1C1C] border border-[#C2D6C2]">
                            {o.fulfillment_status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => {
                              const awb = prompt("Enter Bluedart AWB Tracking Number:", o.awb_number || "BLUEDART" + Date.now());
                              if (awb) handleUpdateOrderStatus(o.id, "shipped", awb);
                            }}
                            className="px-4 py-1.5 bg-[#1C1C1C] text-white rounded-full text-xs font-bold hover:bg-[#333333] transition-colors"
                          >
                            Dispatch AWB
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Discounts & Coupons */}
        {activeTab === "discounts" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1C1C1C] tracking-tight">Discounts & Promo Codes ({discounts.length})</h1>
                <p className="text-xs text-stone-600 mt-1">Create promotional coupons for checkout discounts.</p>
              </div>

              <button
                onClick={() => setShowNewDiscountModal(true)}
                className="bg-[#1C1C1C] text-white text-xs font-extrabold uppercase tracking-wider px-5 py-3 rounded-full hover:bg-[#333333] transition-all flex items-center gap-2 shadow-md"
              >
                <Plus size={16} />
                <span>Create Coupon</span>
              </button>
            </div>

            <div className="border border-[#E2E8E4] rounded-[24px] bg-white overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8E4] bg-[#F5F5F0] text-stone-600 uppercase font-mono text-[10px] tracking-wider font-bold">
                    <th className="py-3.5 px-6">Coupon Code</th>
                    <th className="py-3.5 px-6">Discount</th>
                    <th className="py-3.5 px-6">Min Order Value</th>
                    <th className="py-3.5 px-6">Usage Limit</th>
                    <th className="py-3.5 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8E4]">
                  {discounts.map((d) => (
                    <tr key={d.id} className="hover:bg-[#F5F5F0]/50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-[#1C1C1C] text-sm">
                        {d.code}
                      </td>
                      <td className="py-4 px-6 font-bold text-[#1C1C1C]">
                        {d.type === "percentage" ? `${d.value}% OFF` : `₹${d.value} FLAT OFF`}
                      </td>
                      <td className="py-4 px-6 text-stone-600 font-mono">
                        ₹{d.min_order_value || 0}
                      </td>
                      <td className="py-4 px-6 text-stone-500 font-mono">
                        {d.used_count || 0} / {d.usage_limit || 500}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-[#E2E8E4] text-emerald-800 border border-[#C2D6C2]">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Create Discount Modal */}
            {showNewDiscountModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="w-full max-w-md bg-white border border-[#E2E8E4] rounded-[32px] p-8 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-[#1C1C1C] text-base font-heading">Create New Coupon</h3>
                    <button onClick={() => setShowNewDiscountModal(false)}><X size={18} /></button>
                  </div>

                  <form onSubmit={handleCreateDiscount} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">Coupon Code*</label>
                      <input
                        type="text"
                        required
                        value={newDiscount.code}
                        onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
                        placeholder="e.g. SPECIAL20"
                        className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-[#1C1C1C] font-mono uppercase focus:outline-none focus:border-[#1C1C1C]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 font-bold mb-1">Discount Type</label>
                        <select
                          value={newDiscount.type}
                          onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value })}
                          className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-3 py-2.5 text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed_amount">Flat (₹)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-700 font-bold mb-1">Value*</label>
                        <input
                          type="number"
                          required
                          value={newDiscount.value}
                          onChange={(e) => setNewDiscount({ ...newDiscount, value: parseInt(e.target.value) || 0 })}
                          className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-3 py-2.5 text-[#1C1C1C] font-bold focus:outline-none focus:border-[#1C1C1C]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">Minimum Order Value (₹)</label>
                      <input
                        type="number"
                        value={newDiscount.min_order_value}
                        onChange={(e) => setNewDiscount({ ...newDiscount, min_order_value: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-3 py-2.5 text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                      />
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowNewDiscountModal(false)}
                        className="flex-1 py-3 rounded-full border border-[#E2E8E4] text-stone-600 hover:text-[#1C1C1C] font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 rounded-full bg-[#1C1C1C] text-white font-extrabold uppercase tracking-wider hover:bg-[#333333]"
                      >
                        Create Coupon
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
