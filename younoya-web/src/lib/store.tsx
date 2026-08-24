import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import * as api from "./api"

type StoreState = {
  cart: api.Cart | null
  cartCount: number
  customer: api.Customer | null
  profiles: api.AstroProfile[]
  lastResult: api.RecommendResult | null
  setLastResult: (r: api.RecommendResult | null) => void
  refreshCart: () => Promise<void>
  ensureCart: () => Promise<api.Cart>
  addToCart: (variantId: string, qty?: number) => Promise<void>
  refreshProfiles: () => Promise<void>
  refreshCustomer: () => Promise<void>
  logout: () => void
}

const Ctx = createContext<StoreState | null>(null)
const CART_KEY = "younoya_cart_id"

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<api.Cart | null>(null)
  const [customer, setCustomer] = useState<StoreState["customer"]>(null)
  const [profiles, setProfiles] = useState<api.AstroProfile[]>([])
  const [lastResult, setLastResult] = useState<api.RecommendResult | null>(null)

  const refreshCart = useCallback(async () => {
    const id = localStorage.getItem(CART_KEY)
    if (!id) return setCart(null)
    try {
      setCart(await api.getCart(id))
    } catch {
      localStorage.removeItem(CART_KEY)
      setCart(null)
    }
  }, [])

  const ensureCart = useCallback(async () => {
    const id = localStorage.getItem(CART_KEY)
    if (id) {
      try {
        const c = await api.getCart(id)
        setCart(c)
        return c
      } catch {
        localStorage.removeItem(CART_KEY)
      }
    }
    const regions = await api.listRegions()
    const india = regions.find((r) => r.currency_code === "inr")
    const c = await api.createCart(india?.id)
    localStorage.setItem(CART_KEY, c.id)
    setCart(c)
    return c
  }, [])

  const addToCart = useCallback(
    async (variantId: string, qty = 1) => {
      const c = await ensureCart()
      const updated = await api.addToCart(c.id, variantId, qty)
      setCart(updated)
    },
    [ensureCart]
  )

  const refreshProfiles = useCallback(async () => {
    if (!api.getToken()) return setProfiles([])
    try {
      setProfiles(await api.listProfiles())
    } catch {
      setProfiles([])
    }
  }, [])

  const refreshCustomer = useCallback(async () => {
    if (!api.getToken()) {
      setCustomer(null)
      return
    }
    const me = await api.getCustomer()
    setCustomer(me?.customer ?? null)
    if (!me?.customer) api.setToken(null)
  }, [])

  const logout = useCallback(() => {
    api.setToken(null)
    setCustomer(null)
    setProfiles([])
    setLastResult(null)
  }, [])

  useEffect(() => {
    refreshCart()
    refreshCustomer().then(refreshProfiles).catch(() => void 0)
  }, [refreshCart, refreshCustomer, refreshProfiles])

  const cartCount = useMemo(
    () => (cart?.items ?? []).reduce((n, i) => n + i.quantity, 0),
    [cart]
  )

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      customer,
      profiles,
      lastResult,
      setLastResult,
      refreshCart,
      ensureCart,
      addToCart,
      refreshProfiles,
      refreshCustomer,
      logout,
    }),
    [cart, cartCount, customer, profiles, lastResult, refreshCart, ensureCart, addToCart, refreshProfiles, refreshCustomer, logout]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): StoreState {
  const v = useContext(Ctx)
  if (!v) throw new Error("useStore outside StoreProvider")
  return v
}
