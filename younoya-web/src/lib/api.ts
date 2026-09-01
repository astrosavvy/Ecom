const API_BASE = (import.meta.env.VITE_API_BASE as string) || "https://api.younoya.com"
const PUBLISHABLE_KEY =
  (import.meta.env.VITE_PUBLISHABLE_KEY as string) ||
  "pk_d4577228b532cf8c81a5b63e898652da2dbaf9730acd3f8f449ccda1f8482c75"

const TOKEN_KEY = "younoya_customer_token"

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}
export function setToken(t: string | null) {
  if (t) localStorage.setItem(TOKEN_KEY, t)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function req<T>(
  path: string,
  opts: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "x-publishable-api-key": PUBLISHABLE_KEY,
    "Content-Type": "application/json",
  }
  if (opts.auth && getToken()) headers["Authorization"] = `Bearer ${getToken()}`
  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  })
  const text = await res.text()
  const data = text ? JSON.parse(text) : {}
  if (!res.ok) throw new ApiError(res.status, data?.message || data?.error || `Request failed (${res.status})`)
  return data as T
}

// ---------- types ----------
export type Product = {
  id: string
  title: string
  handle: string
  subtitle?: string | null
  description?: string | null
  thumbnail?: string | null
  metadata?: Record<string, unknown>
  variants?: Array<{
    id: string
    title: string
    calculated_price?: {
      calculated_amount?: number
      original_amount?: number
      currency_code?: string
    }
  }>
}

export type AstroProfile = {
  id: string
  full_name: string
  relationship: string
  is_self: boolean
  sun_sign: string
  moon_sign: string
  nakshatra: string | null
  element: string
  ruling_planet: string
  dob: string
  tob: string | null
  pob: string | null
  chart?: { approximate?: boolean }
}

export type RecommendationItem = {
  id: string
  handle: string
  title: string
  thumbnail: string | null
  price: number | null
  score: number
  reasons: string[]
  gemstone_crystal?: string | null
  sacred_deity?: string | null
}

export type RecommendResult = {
  main: RecommendationItem | null
  suggestions: RecommendationItem[]
  subject: { full_name: string; sun_sign: string; moon_sign: string; nakshatra: string | null; element: string }
  synergy_note: string | null
  profile: {
    id: string
    full_name: string
    relationship: string
    approximate: boolean
    sun_sign: string
    moon_sign: string
    nakshatra: string | null
  }
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  cover_image: string | null // 16:9 hero
  list_image: string | null // 1:1 square for listing
  author: string
  published_at: string | null
}

export type Cart = {
  id: string
  total?: number
  subtotal?: number
  items?: Array<{
    id: string
    title: string
    thumbnail?: string | null
    quantity: number
    unit_price: number
    variant_id: string
    product_handle?: string
  }>
}

// ---------- auth ----------
export async function requestOtp(phone: string): Promise<{ mock_otp?: string }> {
  const r = await req<{ mock_otp?: string }>("/store/otp/request", { method: "POST", body: { phone } })
  return r
}

export async function verifyOtp(phone: string, otp: string): Promise<{ ticket: string }> {
  return req<{ ticket: string }>("/store/otp/verify", { method: "POST", body: { phone, otp } })
}

export async function exchangeTicket(ticket: string): Promise<string> {
  const r = await req<{ token: string }>("/auth/customer/younoya-mobile-otp", {
    method: "POST",
    body: { ticket },
  })
  setToken(r.token)
  return r.token
}

export type Customer = { id: string; email: string; first_name?: string; last_name?: string; phone?: string }
export async function getCustomer(): Promise<{ customer: Customer } | null> {
  try {
    return await req("/store/customers/me", { auth: true })
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) return null
    throw e
  }
}

export async function createCustomer(input: {
  email: string
  first_name: string
  last_name?: string
  phone?: string
}): Promise<{ customer: { id: string; email: string } }> {
  return req("/store/customers", { method: "POST", body: input, auth: true })
}

// ---------- astro ----------
export async function listProfiles(): Promise<AstroProfile[]> {
  const r = await req<{ profiles: AstroProfile[] }>("/store/astro/profiles", { auth: true })
  return r.profiles
}

export async function createProfile(input: {
  full_name: string
  relationship?: string
  is_self?: boolean
  phone?: string
  dob: string
  tob?: string | null
  pob?: string
}): Promise<{ profile: AstroProfile }> {
  const r = await req<{ profile: AstroProfile }>("/store/astro/profiles", {
    method: "POST",
    body: input,
    auth: true,
  })
  return r
}

export async function deleteProfile(id: string): Promise<void> {
  await req(`/store/astro/profiles/${id}`, { method: "DELETE", auth: true })
}

export async function recommend(input: {
  profile_id: string
  sender_profile_id?: string
  occasion?: string
}): Promise<RecommendResult> {
  return req("/store/astro/recommend", { method: "POST", body: input, auth: true })
}

export async function searchCities(q: string): Promise<Array<{ name: string; state: string }>> {
  const r = await req<{ cities: Array<{ name: string; state: string }> }>(
    `/store/cities?q=${encodeURIComponent(q)}`
  )
  return r.cities
}

// ---------- catalog ----------
let cachedRegionId: string | undefined

export async function getIndiaRegionId(): Promise<string | undefined> {
  if (cachedRegionId) return cachedRegionId
  try {
    const regions = await listRegions()
    cachedRegionId = regions.find((r) => r.currency_code === "inr")?.id
  } catch {
    cachedRegionId = undefined
  }
  return cachedRegionId
}

export async function listProducts(opts: { limit?: number; handle?: string } = {}): Promise<{ products: Product[]; count: number }> {
  const params = new URLSearchParams({ limit: String(opts.limit ?? 24) })
  const regionId = await getIndiaRegionId()
  if (regionId) {
    params.set("region_id", regionId)
    params.set("fields", "*variants.calculated_price")
  }
  if (opts.handle) params.set("handle", opts.handle)
  try {
    return await req(`/store/products?${params}`)
  } catch (e) {
    // Fallback: if pricing context still fails, retry without calculated_price
    if (e instanceof ApiError && e.status === 400 && params.has("fields")) {
      params.delete("fields")
      params.delete("region_id")
      return req(`/store/products?${params}`)
    }
    throw e
  }
}

export function variantPrice(p: Product): { amount?: number; original?: number } {
  const cp = p.variants?.[0]?.calculated_price
  return { amount: cp?.calculated_amount, original: cp?.original_amount }
}

export async function getProduct(handle: string): Promise<Product | null> {
  const r = await listProducts({ handle, limit: 1 })
  return r.products[0] ?? null
}

// ---------- cart ----------
export async function createCart(regionId?: string): Promise<Cart> {
  const r = await req<{ cart: Cart }>("/store/carts", {
    method: "POST",
    body: regionId ? { region_id: regionId } : {},
  })
  return r.cart
}

export async function getCart(id: string): Promise<Cart> {
  const r = await req<{ cart: Cart }>(`/store/carts/${id}`)
  return r.cart
}

export async function addToCart(cartId: string, variantId: string, qty = 1): Promise<Cart> {
  const r = await req<{ cart: Cart }>(`/store/carts/${cartId}/line-items`, {
    method: "POST",
    body: { variant_id: variantId, quantity: qty },
  })
  return r.cart
}

export async function updateLineItem(cartId: string, lineId: string, qty: number): Promise<Cart> {
  const r = await req<{ cart: Cart }>(`/store/carts/${cartId}/line-items/${lineId}`, {
    method: "POST",
    body: { quantity: qty },
  })
  return r.cart
}

export async function removeLineItem(cartId: string, lineId: string): Promise<Cart> {
  const r = await req<{ cart: Cart }>(`/store/carts/${cartId}/line-items/${lineId}`, {
    method: "DELETE",
  })
  return r.cart
}

export async function listRegions(): Promise<Array<{ id: string; name: string; currency_code: string }>> {
  const r = await req<{ regions: Array<{ id: string; name: string; currency_code: string }> }>("/store/regions")
  return r.regions
}

export async function updateCart(cartId: string, data: Record<string, unknown>): Promise<Cart> {
  const r = await req<{ cart: Cart }>(`/store/carts/${cartId}`, { method: "POST", body: data })
  return r.cart
}

export async function createPaymentSessions(cartId: string): Promise<Cart> {
  const r = await req<{ cart: Cart }>(`/store/carts/${cartId}/payment-sessions`, { method: "POST" })
  return r.cart
}

export async function completeCart(cartId: string): Promise<{ type: string; order?: { id: string; display_id: number } }> {
  return req(`/store/carts/${cartId}/complete`, { method: "POST" })
}

export async function getOrder(id: string): Promise<{ order: { id: string; display_id: number; total?: number; items?: Array<{ title: string; quantity: number }> } }> {
  return req(`/store/orders/${id}`)
}

// ---------- blog ----------
export async function listPosts(limit = 12, offset = 0): Promise<{ posts: BlogPost[]; count: number }> {
  return req(`/store/blog/posts?limit=${limit}&offset=${offset}`)
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const r = await req<{ post: BlogPost }>(`/store/blog/posts/${slug}`)
    return r.post
  } catch {
    return null
  }
}

export function purchaseType(p: Product): "direct" | "enquire" {
  const md = (p.metadata ?? {}) as Record<string, unknown>
  const price = variantPrice(p).amount ?? 0
  const tags = (md.synergy_tags as string[]) || []
  const crystal = String(md.gemstone_crystal || "")
  if (md.purchase_type === "enquire" || md.purchase_type === "direct") return md.purchase_type as any
  if (price >= 349900 || tags.includes("remedy") || crystal.includes("Sapphire") || crystal.includes("Panna") || crystal.includes("Navagraha")) return "enquire"
  return "direct"
}

export const formatINR = (paise: number | undefined | null) =>
  paise == null ? "—" : `₹${(paise / 100).toLocaleString("en-IN")}`
