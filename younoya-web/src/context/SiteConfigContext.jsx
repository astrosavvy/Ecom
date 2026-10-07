import { createContext, useContext, useEffect, useState } from 'react'
import { storeRequest } from '../lib/giftGuideApi'
export const initialSiteConfig = { storefrontMode: 'shop', checkoutEnabled: false, policiesPublished: false, policyRevision: null,
  shippingFee: 0, currency: 'INR', country: 'IN', business: { legalName: 'YOUNOYA HOUSE OF ASTRO PRIVATE LIMITED',
    supportEmail: 'support@younoya.com', dispatchHours: 24, deliveryMinDays: 3, deliveryMaxDays: 5 } }
const Context = createContext({ ...initialSiteConfig, loading: true })
export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(initialSiteConfig)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    const refresh = () => storeRequest('/store/site-config').then(data => { if (active) setConfig(data) })
      .catch(() => { if (active) setConfig(initialSiteConfig) }).finally(() => { if (active) setLoading(false) })
    refresh(); window.addEventListener('younoya-settings', refresh)
    return () => { active = false; window.removeEventListener('younoya-settings', refresh) }
  }, [])
  return <Context.Provider value={{ ...config, loading }}>{children}</Context.Provider>
}
export const useSiteConfig = () => useContext(Context)
