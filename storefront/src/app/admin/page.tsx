"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Plus, Edit, Trash2, Image as ImageIcon, Save, ArrowLeft, 
  CheckCircle, AlertCircle, Sparkles, RefreshCw, Eye, ExternalLink, Globe, Lock, LogOut,
  Upload, X, Link as LinkIcon, ShoppingBag, Tag, Users, BarChart3, Package, Truck,
  Star, ChevronLeft, ChevronRight, Printer, Archive, RotateCcw, Copy, Settings,
  Check, Filter, Search, ShieldCheck, FileText, Send
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
  meta_title?: string;
  meta_description?: string;
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
  subtotal: number;
  discount_amount: number;
  total_amount: number;
  payment_status: string;
  fulfillment_status: string;
  awb_number?: string;
  courier_name?: string;
  courier_code?: string;
  tracking_url?: string;
  order_notes?: string;
  is_archived?: number;
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

interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  file_size: number;
  created_at: string;
}

const BACKEND_URL = "https://api.younoya.com";

const COURIER_OPTIONS = [
  { code: "shiprocket", name: "Shiprocket Priority" },
  { code: "bluedart", name: "Bluedart Express Air" },
  { code: "delhivery", name: "Delhivery Surface & Express" },
  { code: "dtdc", name: "DTDC Prime Air" },
  { code: "indiapost", name: "India Post Speed Post" },
  { code: "custom", name: "Custom / Hyperlocal Courier" }
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Admin Tab: 'products' | 'orders' | 'media' | 'discounts'
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "media" | "discounts">("products");

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);

  // Product Editing state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Media Library Picker Modal in Product Editor (Supports Multi-Select)
  const [showMediaStoreModal, setShowMediaStoreModal] = useState(false);
  const [selectedMediaInModal, setSelectedMediaInModal] = useState<string[]>([]);

  // Orders Filter & Management
  const [orderStageFilter, setOrderStageFilter] = useState<string>("all");
  const [orderSearch, setOrderSearch] = useState<string>("");
  const [selectedOrderForShipping, setSelectedOrderForShipping] = useState<Order | null>(null);
  const [selectedOrderForLabel, setSelectedOrderForLabel] = useState<Order | null>(null);
  const [shippingModalData, setShippingModalData] = useState({
    courier_code: "shiprocket",
    courier_name: "Shiprocket Priority",
    awb_number: "",
    fulfillment_status: "Shipped"
  });

  // Shipper Template Settings for A5 Label
  const [showShipperSettingsModal, setShowShipperSettingsModal] = useState(false);
  const [shipperSettings, setShipperSettings] = useState({
    brand_name: "YOUNOYA — Sacred Vedic Blessings",
    dispatch_address: "Plot 42, Vedic Consecration Hub, Phase 2, Industrial Estate",
    city_state_pin: "Jaipur, Rajasthan — 302013",
    contact_phone: "+91 98765 43210",
    support_email: "support@younoya.com",
    gstin: "08AAECY1234F1Z5"
  });

  // New Discount Form state
  const [showNewDiscountModal, setShowNewDiscountModal] = useState(false);
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    type: "percentage",
    value: 10,
    min_order_value: 0,
    usage_limit: 500
  });

  // Media upload state with dedicated refs
  const [uploadingImage, setUploadingImage] = useState(false);
  const productFileInputRef = useRef<HTMLInputElement>(null);
  const mediaStoreFileInputRef = useRef<HTMLInputElement>(null);

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
      const [resProd, resOrders, resDisc, resMedia, resSettings] = await Promise.all([
        fetch(`${BACKEND_URL}/api/v1/admin/products`),
        fetch(`${BACKEND_URL}/api/v1/admin/orders`),
        fetch(`${BACKEND_URL}/api/v1/admin/discounts`),
        fetch(`${BACKEND_URL}/api/v1/admin/media`),
        fetch(`${BACKEND_URL}/api/v1/admin/settings`)
      ]);

      const dataProd = await resProd.json();
      const dataOrders = await resOrders.json();
      const dataDisc = await resDisc.json();
      const dataMedia = await resMedia.json();
      const dataSettings = await resSettings.json();

      if (dataProd.success) setProducts(dataProd.data || []);
      if (dataOrders.success) setOrders(dataOrders.data || []);
      if (dataDisc.success) setDiscounts(dataDisc.data || []);
      if (dataMedia.success) setMediaAssets(dataMedia.data || []);
      if (dataSettings.success && dataSettings.data?.brand_name) {
        setShipperSettings({ ...shipperSettings, ...dataSettings.data });
      }
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

  // Product CRUD
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

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/products/${id}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (json.success) {
        fetchData();
        setStatusMsg("✓ Product deleted successfully.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Gallery Ordering & Primary Toggle
  const handleSetPrimaryImage = (index: number) => {
    if (!selectedProduct) return;
    const currentImgs: string[] = Array.isArray(selectedProduct.images)
      ? [...selectedProduct.images]
      : (typeof selectedProduct.images === "string" ? JSON.parse(selectedProduct.images || "[]") : []);

    const target = currentImgs.splice(index, 1)[0];
    currentImgs.unshift(target);
    setSelectedProduct({ ...selectedProduct, images: currentImgs });
  };

  const handleMoveImage = (index: number, direction: "left" | "right") => {
    if (!selectedProduct) return;
    const currentImgs: string[] = Array.isArray(selectedProduct.images)
      ? [...selectedProduct.images]
      : (typeof selectedProduct.images === "string" ? JSON.parse(selectedProduct.images || "[]") : []);

    const newIndex = direction === "left" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentImgs.length) return;

    const temp = currentImgs[index];
    currentImgs[index] = currentImgs[newIndex];
    currentImgs[newIndex] = temp;
    setSelectedProduct({ ...selectedProduct, images: currentImgs });
  };

  const handleRemoveImage = (index: number) => {
    if (!selectedProduct) return;
    const currentImgs: string[] = Array.isArray(selectedProduct.images)
      ? selectedProduct.images
      : (typeof selectedProduct.images === "string" ? JSON.parse(selectedProduct.images || "[]") : []);

    const updated = currentImgs.filter((_, i) => i !== index);
    setSelectedProduct({ ...selectedProduct, images: updated });
  };

  // Upload Images with Multi-File support & Auto-compression fallback
  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setStatusMsg("");

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files[]", files[i]);
    }
    formData.append("file", files[0]);

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/upload`, {
        method: "POST",
        body: formData
      });
      const json = await res.json();

      if (json.success) {
        const uploadedList: string[] = json.urls || (json.url ? [json.url] : []);
        if (selectedProduct) {
          const currentImgs: string[] = Array.isArray(selectedProduct.images)
            ? selectedProduct.images
            : (typeof selectedProduct.images === "string" ? JSON.parse(selectedProduct.images || "[]") : []);

          setSelectedProduct({ ...selectedProduct, images: [...currentImgs, ...uploadedList] });
        }
        await fetchData();
        setStatusMsg(`✓ Uploaded ${uploadedList.length} image(s) to Image Store!`);
      } else {
        setStatusMsg("❌ Upload failed: " + (json.error || "Server rejected request"));
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setStatusMsg("❌ Upload error: " + (err.message || "Network failure"));
    } finally {
      setUploadingImage(false);
      if (productFileInputRef.current) productFileInputRef.current.value = "";
      if (mediaStoreFileInputRef.current) mediaStoreFileInputRef.current.value = "";
    }
  };

  // Media Library Deletion
  const handleDeleteMediaAsset = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset from Image Store?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/media/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchData();
        setStatusMsg("✓ Media asset deleted.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Order Management Actions
  const handleOpenDispatchModal = (order: Order) => {
    setSelectedOrderForShipping(order);
    setShippingModalData({
      courier_code: order.courier_code || "shiprocket",
      courier_name: order.courier_name || "Shiprocket Priority",
      awb_number: order.awb_number || "AWB" + Math.floor(10000000 + Math.random() * 90000000),
      fulfillment_status: "Shipped"
    });
  };

  const handleConfirmDispatch = async () => {
    if (!selectedOrderForShipping) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/orders/${selectedOrderForShipping.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shippingModalData)
      });
      const json = await res.json();
      if (json.success) {
        setStatusMsg(`✓ Order #${selectedOrderForShipping.order_number} marked as Shipped via ${shippingModalData.courier_name}!`);
        setSelectedOrderForShipping(null);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, updates: Partial<Order>) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      const json = await res.json();
      if (json.success) {
        setStatusMsg("✓ Order updated successfully.");
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this test order?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/orders/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchData();
        setStatusMsg("✓ Test order deleted.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Discount Actions
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
        setStatusMsg("✓ Coupon created successfully!");
        setShowNewDiscountModal(false);
        setNewDiscount({ code: "", type: "percentage", value: 10, min_order_value: 0, usage_limit: 500 });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteDiscount = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon code?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/discounts/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchData();
        setStatusMsg("✓ Coupon deleted.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveShipperSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shipperSettings)
      });
      const json = await res.json();
      if (json.success) {
        setStatusMsg("✓ Shipper template settings saved successfully!");
        setShowShipperSettingsModal(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered Orders Calculation
  const filteredOrders = orders.filter((o) => {
    const isArchived = o.is_archived === 1;
    if (orderStageFilter === "archived") return isArchived;
    if (isArchived && orderStageFilter !== "archived") return false;

    if (orderStageFilter === "pending") return o.payment_status !== "paid";
    if (orderStageFilter === "consecration") return o.fulfillment_status === "Ordered" || o.fulfillment_status === "Consecration";
    if (orderStageFilter === "shipped") return o.fulfillment_status === "shipped" || o.fulfillment_status === "Shipped";
    if (orderStageFilter === "delivered") return o.fulfillment_status === "delivered" || o.fulfillment_status === "Delivered";

    if (orderSearch.trim()) {
      const query = orderSearch.toLowerCase();
      return (
        o.order_number?.toLowerCase().includes(query) ||
        o.customer_name?.toLowerCase().includes(query) ||
        o.customer_phone?.includes(query) ||
        o.awb_number?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] text-[#1C1C1C] flex items-center justify-center px-4 font-sans">
        <div className="w-full max-w-md p-8 rounded-[32px] bg-white border border-[#E2E8E4] shadow-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#1C1C1C] text-[#D4AF37] flex items-center justify-center font-bold text-xl mx-auto shadow-md">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-extrabold font-heading tracking-tight text-[#1C1C1C]">YOUNOYA Store Admin</h1>
            <p className="text-xs text-stone-500">Enterprise Merchant Console & OMS</p>
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
                className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F0] border border-[#E2E8E4] text-[#1C1C1C] text-sm focus:outline-none focus:border-[#1C1C1C]"
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
                className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F0] border border-[#E2E8E4] text-[#1C1C1C] text-sm focus:outline-none focus:border-[#1C1C1C]"
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

  const currentEditorImages: string[] = Array.isArray(selectedProduct?.images)
    ? (selectedProduct?.images as string[])
    : (typeof selectedProduct?.images === "string" ? JSON.parse(selectedProduct.images || "[]") : []);

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1C1C1C] font-sans selection:bg-[#1C1C1C] selection:text-white pb-20">
      {/* Top Admin Header */}
      <header className="border-b border-[#E2E8E4] bg-white px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1C1C1C] text-[#D4AF37] flex items-center justify-center font-bold text-sm">
            Y
          </div>
          <div>
            <div className="font-extrabold font-heading text-[#1C1C1C] tracking-wider flex items-center gap-2">
              YOUNOYA <span className="text-[10px] font-mono uppercase bg-[#E2E8E4] text-[#1C1C1C] font-bold px-2 py-0.5 rounded-full">Merchant Hub</span>
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
            <Truck size={14} />
            <span>Orders & Fulfillment ({orders.filter(o => o.is_archived !== 1).length})</span>
          </button>

          <button
            onClick={() => { setIsEditing(false); setActiveTab("media"); }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "media" ? "bg-[#1C1C1C] text-white shadow-sm" : "text-stone-600 hover:text-[#1C1C1C]"
            }`}
          >
            <ImageIcon size={14} />
            <span>Image Store ({mediaAssets.length})</span>
          </button>

          <button
            onClick={() => { setIsEditing(false); setActiveTab("discounts"); }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "discounts" ? "bg-[#1C1C1C] text-white shadow-sm" : "text-stone-600 hover:text-[#1C1C1C]"
            }`}
          >
            <Tag size={14} />
            <span>Coupons ({discounts.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={() => setShowShipperSettingsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E2E8E4] text-stone-700 hover:text-[#1C1C1C] font-bold transition-colors"
            title="Shipper template settings for A5 labels"
          >
            <Settings size={13} />
            <span className="hidden sm:inline">Label Shipper Info</span>
          </button>

          <Link 
            href="/" 
            target="_blank"
            className="flex items-center gap-1.5 text-stone-600 hover:text-[#1C1C1C] font-bold transition-colors"
          >
            <span>Live Store</span>
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

        {/* Quick Analytics Bar (Shopify Summary Style) */}
        {!isEditing && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="clinical-card p-5 shadow-sm">
              <div className="text-xs text-stone-500 font-bold uppercase font-mono">Catalog Items</div>
              <div className="text-2xl font-extrabold font-heading text-[#1C1C1C] mt-1">{products.length} Products</div>
            </div>
            <div className="clinical-card p-5 shadow-sm">
              <div className="text-xs text-stone-500 font-bold uppercase font-mono">Active Orders</div>
              <div className="text-2xl font-extrabold font-heading text-[#1C1C1C] mt-1">{orders.filter(o => o.is_archived !== 1).length} Orders</div>
            </div>
            <div className="clinical-card p-5 shadow-sm">
              <div className="text-xs text-stone-500 font-bold uppercase font-mono">Media Assets</div>
              <div className="text-2xl font-extrabold font-heading text-[#1C1C1C] mt-1">{mediaAssets.length} Photos</div>
            </div>
            <div className="clinical-card p-5 shadow-sm">
              <div className="text-xs text-stone-500 font-bold uppercase font-mono">Promo Coupons</div>
              <div className="text-2xl font-extrabold font-heading text-[#D4AF37] mt-1">{discounts.length} Active</div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 1: PRODUCTS CATALOG & SHOPIFY-GRADE EDITOR
           ======================================================== */}
        {activeTab === "products" && !isEditing && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1C1C1C] tracking-tight">Products ({products.length})</h1>
                <p className="text-xs text-stone-600 mt-1">Manage catalog, inventory, primary featured images, and pricing.</p>
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
                    <th className="py-4 px-6">Product</th>
                    <th className="py-4 px-6">SKU / Handle</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6 min-w-[140px]">Inventory</th>
                    <th className="py-4 px-6 min-w-[140px]">Badge</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8E4]">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-500">
                        {loading ? "Loading products from MariaDB..." : "No products found. Click 'Add Product' to create one."}
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
                            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-[#E2E8E4] text-emerald-900 border border-[#C2D6C2] whitespace-nowrap">
                              {prod.inventory_count || 100} in stock
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-block px-3 py-1 rounded-full text-[10px] uppercase font-extrabold font-mono bg-[#1C1C1C] text-white whitespace-nowrap">
                              {prod.badge || "Standard"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button
                              onClick={() => handleEdit(prod)}
                              className="px-3.5 py-1.5 rounded-full bg-[#E2E8E4] text-[#1C1C1C] hover:bg-[#D4DFD7] transition-colors inline-flex items-center gap-1.5 text-xs font-bold"
                              title="Edit product"
                            >
                              <Edit size={13} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-2 hover:bg-red-100 rounded-full text-stone-400 hover:text-red-700 transition-colors"
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

        {/* 2-Column Shopify Product Editor */}
        {isEditing && selectedProduct && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#1C1C1C] transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Back to Products Catalog</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-full border border-[#E2E8E4] text-xs font-bold text-stone-600 hover:text-[#1C1C1C] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#1C1C1C] text-white text-xs font-extrabold uppercase tracking-wider px-7 py-2.5 rounded-full hover:bg-[#333333] transition-all shadow-md flex items-center gap-2"
                >
                  <Save size={15} />
                  <span>{saving ? "Publishing..." : "Save Product"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 8 Cols: Title, Media Gallery, Description */}
              <div className="lg:col-span-8 space-y-6">
                <div className="clinical-card p-6 space-y-4 shadow-sm">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#1C1C1C] font-heading">Product Details</h2>
                  
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">Product Title*</label>
                    <input
                      type="text"
                      value={selectedProduct.title}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, title: e.target.value })}
                      className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-sm text-[#1C1C1C] font-bold focus:outline-none focus:border-[#1C1C1C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">Subtitle / Consecration Summary</label>
                    <input
                      type="text"
                      value={selectedProduct.subtitle}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, subtitle: e.target.value })}
                      className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">Description</label>
                    <textarea
                      rows={6}
                      value={selectedProduct.description}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                      className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-3 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                    />
                  </div>
                </div>

                {/* Media Gallery with Reordering & Make Primary */}
                <div className="clinical-card p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#1C1C1C] font-heading">Product Media Gallery ({currentEditorImages.length})</h2>
                      <p className="text-[11px] text-stone-500 mt-0.5">First image is the <strong>★ Primary Featured</strong> photo shown across all listings.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowMediaStoreModal(true)}
                        className="px-3.5 py-2 rounded-full border border-[#E2E8E4] bg-[#F5F5F0] text-[#1C1C1C] text-xs font-bold flex items-center gap-1.5 hover:bg-[#E2E8E4]"
                      >
                        <ImageIcon size={13} />
                        <span>Image Store</span>
                      </button>

                      <input
                        type="file"
                        ref={productFileInputRef}
                        multiple
                        accept="image/*"
                        onChange={handleMultipleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => productFileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="px-4 py-2 rounded-full bg-[#1C1C1C] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#333333]"
                      >
                        <Upload size={13} />
                        <span>{uploadingImage ? "Uploading..." : "Upload New"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Visual Reorderable Thumbnail Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                    {currentEditorImages.map((imgUrl, idx) => (
                      <div key={idx} className={`relative aspect-square rounded-2xl overflow-hidden border ${idx === 0 ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/30" : "border-[#E2E8E4]"} bg-[#E8E6E1] group shadow-sm flex flex-col justify-between p-2`}>
                        <img src={imgUrl} alt={`Product ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover z-0" />
                        
                        {/* Top Overlay Badge & Delete */}
                        <div className="relative z-10 flex items-center justify-between w-full">
                          {idx === 0 ? (
                            <span className="px-2 py-0.5 rounded-md bg-[#1C1C1C] text-[#D4AF37] text-[9px] font-extrabold uppercase font-mono shadow-md">
                              ★ Primary Hero
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="px-2 py-0.5 rounded-md bg-white/90 text-stone-800 text-[9px] font-bold hover:bg-[#1C1C1C] hover:text-[#D4AF37] transition-colors shadow-md"
                            >
                              Make Primary
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
                            title="Remove image"
                          >
                            <X size={11} />
                          </button>
                        </div>

                        {/* Bottom Reordering Arrow Controls */}
                        <div className="relative z-10 flex items-center justify-between w-full opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm rounded-xl p-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveImage(idx, "left")}
                            className="p-1 rounded bg-white/80 text-black hover:bg-white disabled:opacity-30"
                            title="Move Left"
                          >
                            <ChevronLeft size={14} />
                          </button>
                          <span className="text-[10px] text-white font-mono font-bold">#{idx + 1}</span>
                          <button
                            type="button"
                            disabled={idx === currentEditorImages.length - 1}
                            onClick={() => handleMoveImage(idx, "right")}
                            className="p-1 rounded bg-white/80 text-black hover:bg-white disabled:opacity-30"
                            title="Move Right"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 4 Cols: Pricing, Inventory, Badge & Preview */}
              <div className="lg:col-span-4 space-y-6">
                <div className="clinical-card p-6 space-y-4 shadow-sm">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#1C1C1C] font-heading">Pricing & Stock</h2>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">Selling Price (₹)*</label>
                    <input
                      type="number"
                      value={selectedProduct.price}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, price: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">Original Price / MRP (₹)</label>
                    <input
                      type="number"
                      value={selectedProduct.original_price}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, original_price: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-sm font-mono text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">Stock Quantity</label>
                    <input
                      type="number"
                      value={selectedProduct.inventory_count}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, inventory_count: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-sm font-mono text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">Highlight Badge</label>
                    <input
                      type="text"
                      value={selectedProduct.badge}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, badge: e.target.value })}
                      placeholder="e.g. Signature Edition"
                      className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">SKU</label>
                    <input
                      type="text"
                      value={selectedProduct.sku}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, sku: e.target.value })}
                      className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2 text-xs font-mono text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                    />
                  </div>
                </div>

                {/* Primary Hero Preview Card */}
                {currentEditorImages[0] && (
                  <div className="clinical-card p-6 space-y-3 shadow-sm">
                    <h3 className="text-xs font-mono uppercase font-bold text-stone-500">Live Featured Showcase</h3>
                    <div className="aspect-square rounded-2xl overflow-hidden bg-[#E8E6E1] border border-[#E2E8E4]">
                      <img src={currentEditorImages[0]} alt="Primary featured" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: ORDER MANAGEMENT SYSTEM (OMS) & LOGISTICS
           ======================================================== */}
        {activeTab === "orders" && !isEditing && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1C1C1C] tracking-tight">Orders & Fulfillment</h1>
                <p className="text-xs text-stone-600 mt-1">Multi-carrier logistics, A5 printable shipping labels, stage lifecycle, and test order archiving.</p>
              </div>

              {/* Order Stage Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto bg-[#F5F5F0] p-1.5 rounded-2xl border border-[#E2E8E4]">
                {[
                  { id: "all", label: "All Active" },
                  { id: "pending", label: "Payment Pending" },
                  { id: "consecration", label: "Consecration" },
                  { id: "shipped", label: "Shipped / Transit" },
                  { id: "delivered", label: "Delivered" },
                  { id: "archived", label: "Archived / Test" }
                ].map((stg) => (
                  <button
                    key={stg.id}
                    onClick={() => setOrderStageFilter(stg.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      orderStageFilter === stg.id ? "bg-[#1C1C1C] text-white" : "text-stone-600 hover:text-[#1C1C1C]"
                    }`}
                  >
                    {stg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table Card */}
            <div className="border border-[#E2E8E4] rounded-[24px] bg-white overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8E4] bg-[#F5F5F0] text-stone-600 uppercase font-mono text-[10px] tracking-wider font-bold">
                    <th className="py-4 px-6">Order ID & Date</th>
                    <th className="py-4 px-6">Customer & Mobile</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Payment</th>
                    <th className="py-4 px-6">Stage</th>
                    <th className="py-4 px-6">Logistics & AWB</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8E4]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-stone-500">
                        No orders matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.id} className={`hover:bg-[#F5F5F0]/50 transition-colors ${o.is_archived === 1 ? "opacity-60 bg-stone-50" : ""}`}>
                        <td className="py-4 px-6 font-mono font-bold text-[#1C1C1C]">
                          <div className="text-sm">{o.order_number}</div>
                          <div className="text-[10px] text-stone-400 font-normal">{new Date(o.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-[#1C1C1C]">{o.customer_name}</div>
                          <div className="text-stone-600 text-[11px] font-mono">{o.customer_phone}</div>
                          <div className="text-stone-400 text-[10px] truncate max-w-[140px]">{o.customer_email}</div>
                        </td>
                        <td className="py-4 px-6 font-extrabold font-mono text-[#1C1C1C]">
                          ₹{o.total_amount}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border ${
                            o.payment_status === "paid" 
                              ? "bg-[#E2E8E4] text-emerald-800 border-[#C2D6C2]" 
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}>
                            {o.payment_status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border ${
                            o.fulfillment_status === "Delivered"
                              ? "bg-[#E2E8E4] text-emerald-800 border-[#C2D6C2]"
                              : o.fulfillment_status === "Shipped" || o.fulfillment_status === "shipped"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}>
                            {o.fulfillment_status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {o.awb_number ? (
                            <div className="space-y-0.5">
                              <div className="text-[11px] font-bold text-[#1C1C1C]">{o.courier_name}</div>
                              <div className="font-mono text-[10px] text-stone-500">{o.awb_number}</div>
                              {o.tracking_url && (
                                <a 
                                  href={o.tracking_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-blue-600 hover:underline inline-flex items-center gap-0.5"
                                >
                                  <span>Track Parcel</span>
                                  <ExternalLink size={9} />
                                </a>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-stone-400 italic">Not Assigned</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                          {/* Print A5 Label */}
                          <button
                            onClick={() => setSelectedOrderForLabel(o)}
                            className="p-1.5 rounded-full bg-[#E2E8E4] hover:bg-[#D4DFD7] text-[#1C1C1C] transition-colors"
                            title="Print A5 Shipping Label"
                          >
                            <Printer size={14} />
                          </button>

                          {/* Dispatch & Assign Carrier */}
                          <button
                            onClick={() => handleOpenDispatchModal(o)}
                            className="px-3 py-1.5 rounded-full bg-[#1C1C1C] text-white text-xs font-bold hover:bg-[#333333] transition-colors"
                          >
                            Dispatch
                          </button>

                          {/* Archive/Unarchive Toggle */}
                          <button
                            onClick={() => handleUpdateOrderStatus(o.id, { is_archived: o.is_archived === 1 ? 0 : 1 })}
                            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
                            title={o.is_archived === 1 ? "Restore order" : "Archive order"}
                          >
                            {o.is_archived === 1 ? <RotateCcw size={14} /> : <Archive size={14} />}
                          </button>

                          {/* Delete Order (for test cleanup) */}
                          <button
                            onClick={() => handleDeleteOrder(o.id)}
                            className="p-1.5 rounded-full hover:bg-red-100 text-stone-400 hover:text-red-700 transition-colors"
                            title="Delete test order"
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
        )}

        {/* ========================================================
            TAB 3: CENTRALIZED MEDIA ASSET LIBRARY ("IMAGE STORE")
           ======================================================== */}
        {activeTab === "media" && !isEditing && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1C1C1C] tracking-tight">Image Store ({mediaAssets.length})</h1>
                <p className="text-xs text-stone-600 mt-1">Reusable brand photography library across products without duplicating server disk space.</p>
              </div>

              <div>
                <input
                  type="file"
                  ref={mediaStoreFileInputRef}
                  multiple
                  accept="image/*"
                  onChange={handleMultipleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => mediaStoreFileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="bg-[#1C1C1C] text-white text-xs font-extrabold uppercase tracking-wider px-5 py-3 rounded-full hover:bg-[#333333] transition-all flex items-center gap-2 shadow-md"
                >
                  <Upload size={16} />
                  <span>{uploadingImage ? "Uploading Photos..." : "Upload Photos"}</span>
                </button>
              </div>
            </div>

            {/* Asset Library Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mediaAssets.map((asset) => (
                <div key={asset.id} className="clinical-card overflow-hidden group shadow-sm flex flex-col justify-between">
                  <div className="relative aspect-square bg-[#E8E6E1] overflow-hidden">
                    <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-3 bg-white space-y-1.5 border-t border-[#E2E8E4]">
                    <div className="text-[11px] font-bold text-[#1C1C1C] truncate">{asset.filename}</div>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(asset.url);
                          setStatusMsg("✓ Image URL copied to clipboard!");
                        }}
                        className="p-1 rounded hover:bg-stone-100 text-stone-600"
                        title="Copy direct URL"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteMediaAsset(asset.id)}
                        className="p-1 rounded hover:bg-red-100 text-stone-400 hover:text-red-700"
                        title="Delete asset"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: COUPONS & DISCOUNTS
           ======================================================== */}
        {activeTab === "discounts" && !isEditing && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1C1C1C] tracking-tight">Discounts & Promo Codes ({discounts.length})</h1>
                <p className="text-xs text-stone-600 mt-1">Create and manage promotional discount coupons for checkout.</p>
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
                    <th className="py-3.5 px-6 text-right">Actions</th>
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
                        <button
                          onClick={() => handleDeleteDiscount(d.id)}
                          className="p-1.5 hover:bg-red-100 rounded-full text-stone-400 hover:text-red-700 transition-colors"
                          title="Delete coupon"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          MODAL 1: A5 PRINTABLE SHIPPING LABEL GENERATOR
         ======================================================== */}
      {selectedOrderForLabel && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-[#1C1C1C] font-heading">A5 Shipping Label Preview</h3>
                <p className="text-xs text-stone-500">Standard 148mm × 210mm Thermal / Laser Print Ready</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-full bg-[#1C1C1C] text-white text-xs font-bold flex items-center gap-2 shadow-md hover:bg-[#333333]"
                >
                  <Printer size={14} />
                  <span>Print A5 Label</span>
                </button>
                <button onClick={() => setSelectedOrderForLabel(null)} className="p-2 text-stone-400 hover:text-black">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* A5 Printable Area Container */}
            <div id="printable-a5-label" className="p-6 border-2 border-dashed border-stone-800 rounded-2xl bg-white space-y-6 text-xs text-black font-sans">
              {/* Header: Carrier & Order Code */}
              <div className="flex items-center justify-between border-b-2 border-black pb-4">
                <div>
                  <div className="text-2xl font-black font-heading tracking-wider">{shipperSettings.brand_name.split("—")[0].trim()}</div>
                  <div className="text-[10px] text-stone-600 uppercase tracking-widest font-mono">PRIORITY SACRED CONSECRATION PARCEL</div>
                </div>
                <div className="text-right">
                  <div className="inline-block border-2 border-black px-3 py-1 font-black text-sm uppercase">
                    {selectedOrderForLabel.payment_status === "paid" ? "PREPAID AIR" : "COD PARCEL"}
                  </div>
                  <div className="text-xs font-mono font-bold mt-1">{selectedOrderForLabel.courier_name || "Shiprocket Express"}</div>
                </div>
              </div>

              {/* Grid: Deliver To & Dispatch From */}
              <div className="grid grid-cols-2 gap-6 border-b-2 border-black pb-6">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase font-bold text-stone-500">1. DELIVER TO (CONSIGNEE):</div>
                  <div className="font-extrabold text-sm">{selectedOrderForLabel.customer_name}</div>
                  <div className="text-xs">{selectedOrderForLabel.shipping_address?.address}</div>
                  <div className="text-xs font-bold">{selectedOrderForLabel.shipping_address?.city}, {selectedOrderForLabel.shipping_address?.state}</div>
                  <div className="text-base font-black font-mono">PIN: {selectedOrderForLabel.shipping_address?.pincode}</div>
                  <div className="text-xs font-bold font-mono">Tel: {selectedOrderForLabel.customer_phone}</div>
                </div>

                <div className="space-y-1 border-l-2 border-stone-300 pl-6">
                  <div className="text-[10px] font-mono uppercase font-bold text-stone-500">2. DISPATCHED FROM (SHIPPER):</div>
                  <div className="font-bold">{shipperSettings.brand_name}</div>
                  <div className="text-xs">{shipperSettings.dispatch_address}</div>
                  <div className="text-xs">{shipperSettings.city_state_pin}</div>
                  <div className="text-[11px] font-mono">GSTIN: {shipperSettings.gstin}</div>
                  <div className="text-[11px] font-mono">Helpline: {shipperSettings.contact_phone}</div>
                </div>
              </div>

              {/* Order Items & Barcode Box */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase font-bold text-stone-500">3. PARCEL CONTENTS:</div>
                <table className="w-full text-left text-xs border border-black">
                  <thead className="bg-stone-100 border-b border-black font-bold">
                    <tr>
                      <th className="p-2">Item Title</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black">
                    {(selectedOrderForLabel.items || []).map((it, i) => (
                      <tr key={i}>
                        <td className="p-2 font-medium">{it.title}</td>
                        <td className="p-2 text-center font-mono font-bold">{it.quantity || 1}</td>
                        <td className="p-2 text-right font-mono font-bold">₹{it.price * (it.quantity || 1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* AWB & Routing Footer */}
              <div className="border-t-2 border-black pt-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-stone-500">ORDER NO:</div>
                  <div className="text-sm font-black font-mono">{selectedOrderForLabel.order_number}</div>
                </div>
                <div className="text-center font-mono">
                  <div className="text-xs font-bold">||||| | |||| |||||| |||| |||</div>
                  <div className="text-xs font-bold">{selectedOrderForLabel.awb_number || "AWB-PENDING"}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-stone-500">ROUTING HUB:</div>
                  <div className="text-sm font-black uppercase font-mono">DEL-AIR-01</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: DISPATCH & ASSIGN CARRIER MODAL
         ======================================================== */}
      {selectedOrderForShipping && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-xl border border-[#E2E8E4]">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-[#1C1C1C] text-base font-heading">Dispatch & Assign Courier</h3>
              <button onClick={() => setSelectedOrderForShipping(null)}><X size={18} /></button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Select Courier Partner</label>
                <select
                  value={shippingModalData.courier_code}
                  onChange={(e) => {
                    const sel = COURIER_OPTIONS.find(c => c.code === e.target.value);
                    setShippingModalData({
                      ...shippingModalData,
                      courier_code: e.target.value,
                      courier_name: sel ? sel.name : "Shiprocket Priority"
                    });
                  }}
                  className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-3 py-2.5 text-[#1C1C1C] font-bold"
                >
                  {COURIER_OPTIONS.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">AWB Tracking Number / Consignment ID*</label>
                <input
                  type="text"
                  required
                  value={shippingModalData.awb_number}
                  onChange={(e) => setShippingModalData({ ...shippingModalData, awb_number: e.target.value.trim() })}
                  placeholder="e.g. 18274619284"
                  className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-[#1C1C1C]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Update Fulfillment Stage</label>
                <select
                  value={shippingModalData.fulfillment_status}
                  onChange={(e) => setShippingModalData({ ...shippingModalData, fulfillment_status: e.target.value })}
                  className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-3 py-2.5 text-[#1C1C1C] font-bold"
                >
                  <option value="Packed">Packed / Ready for Pickup</option>
                  <option value="Shipped">Shipped / In Transit</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForShipping(null)}
                  className="flex-1 py-3 rounded-full border border-[#E2E8E4] text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDispatch}
                  className="flex-1 py-3 rounded-full bg-[#1C1C1C] text-white font-extrabold uppercase tracking-wider hover:bg-[#333333]"
                >
                  Confirm Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: REUSABLE IMAGE STORE SELECTOR MODAL (MULTI-SELECT SUPPORT)
         ======================================================== */}
      {showMediaStoreModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-[#E2E8E4] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-[#1C1C1C] text-base font-heading">Select Photos from Image Store</h3>
                <p className="text-xs text-stone-500">Click photos to select multiple images, then click 'Add to Product'.</p>
              </div>
              <button 
                onClick={() => {
                  setSelectedMediaInModal([]);
                  setShowMediaStoreModal(false);
                }}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 p-1">
              {mediaAssets.map((asset) => {
                const isSelected = selectedMediaInModal.includes(asset.url);
                return (
                  <div
                    key={asset.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedMediaInModal(selectedMediaInModal.filter((u) => u !== asset.url));
                      } else {
                        setSelectedMediaInModal([...selectedMediaInModal, asset.url]);
                      }
                    }}
                    className={`relative aspect-square rounded-2xl overflow-hidden bg-[#E8E6E1] border-2 cursor-pointer transition-all ${
                      isSelected ? "border-[#1C1C1C] ring-4 ring-[#1C1C1C]/20 scale-95" : "border-[#E2E8E4] hover:border-stone-400"
                    }`}
                  >
                    <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover" />
                    
                    {/* Selection Indicator Checkmark Badge */}
                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? "bg-[#1C1C1C] text-[#D4AF37] shadow-md" : "bg-black/30 text-white/70"
                    }`}>
                      <Check size={13} className="stroke-[3]" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Action Footer for Multi-Select */}
            <div className="border-t pt-3 flex items-center justify-between">
              <div className="text-xs font-bold text-stone-600">
                {selectedMediaInModal.length} photo(s) selected
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMediaInModal([]);
                    setShowMediaStoreModal(false);
                  }}
                  className="px-5 py-2.5 rounded-full border border-[#E2E8E4] text-xs font-bold text-stone-600 hover:text-black"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={selectedMediaInModal.length === 0}
                  onClick={() => {
                    if (selectedProduct && selectedMediaInModal.length > 0) {
                      const current = Array.isArray(selectedProduct.images)
                        ? [...selectedProduct.images]
                        : (typeof selectedProduct.images === "string" ? JSON.parse(selectedProduct.images || "[]") : []);
                      
                      // Append selected images without duplicates
                      const combined = [...current];
                      selectedMediaInModal.forEach((u) => {
                        if (!combined.includes(u)) combined.push(u);
                      });

                      setSelectedProduct({ ...selectedProduct, images: combined });
                      setSelectedMediaInModal([]);
                      setShowMediaStoreModal(false);
                      setStatusMsg(`✓ Added ${selectedMediaInModal.length} photo(s) to product gallery!`);
                    }
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#1C1C1C] text-white text-xs font-extrabold uppercase tracking-wider disabled:opacity-40 hover:bg-[#333333] transition-all shadow-md"
                >
                  Add {selectedMediaInModal.length > 0 ? `(${selectedMediaInModal.length}) ` : ""}to Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: SHIPPER TEMPLATE SETTINGS FOR A5 LABELS
         ======================================================== */}
      {showShipperSettingsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-xl border border-[#E2E8E4]">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-[#1C1C1C] text-base font-heading">Shipper Label Settings</h3>
              <button onClick={() => setShowShipperSettingsModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveShipperSettings} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Brand / Sender Name*</label>
                <input
                  type="text"
                  required
                  value={shipperSettings.brand_name}
                  onChange={(e) => setShipperSettings({ ...shipperSettings, brand_name: e.target.value })}
                  className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2 text-[#1C1C1C]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Dispatch Street Address*</label>
                <input
                  type="text"
                  required
                  value={shipperSettings.dispatch_address}
                  onChange={(e) => setShipperSettings({ ...shipperSettings, dispatch_address: e.target.value })}
                  className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2 text-[#1C1C1C]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">City, State & PIN Code*</label>
                <input
                  type="text"
                  required
                  value={shipperSettings.city_state_pin}
                  onChange={(e) => setShipperSettings({ ...shipperSettings, city_state_pin: e.target.value })}
                  className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-4 py-2 text-[#1C1C1C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={shipperSettings.gstin}
                    onChange={(e) => setShipperSettings({ ...shipperSettings, gstin: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-3 py-2 text-[#1C1C1C] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Helpline Phone</label>
                  <input
                    type="text"
                    value={shipperSettings.contact_phone}
                    onChange={(e) => setShipperSettings({ ...shipperSettings, contact_phone: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-3 py-2 text-[#1C1C1C]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowShipperSettingsModal(false)}
                  className="flex-1 py-2.5 rounded-full border border-[#E2E8E4] text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#1C1C1C] text-white font-extrabold uppercase tracking-wider"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 5: CREATE NEW COUPON MODAL
         ======================================================== */}
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
                    className="w-full bg-[#F5F5F0] border border-[#E2E8E4] rounded-xl px-3 py-2.5 text-[#1C1C1C] font-bold"
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
  );
}
