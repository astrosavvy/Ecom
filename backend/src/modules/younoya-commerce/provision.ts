import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createShippingOptionsWorkflow, linkSalesChannelsToStockLocationWorkflow, updateRegionsWorkflow } from "@medusajs/medusa/core-flows"
import { CommerceError } from "./db"
import { settings, saveSettings } from "./settings"
export async function provision(scope: any) {
  const s = (await settings()).draft
  if (!s.stockLocationId || !s.salesChannelId || !s.pickupName || !s.pickupAddress || !/^[1-9]\d{5}$/.test(s.pickupPincode))
    throw new CommerceError("Save the actual pickup details, stock location and sales channel first")
  const fulfillment = scope.resolve(Modules.FULFILLMENT)
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)
  const link = scope.resolve(ContainerRegistrationKeys.LINK)
  const regions = await scope.resolve(Modules.REGION).listRegions({ currency_code: "inr" }, { relations: ["countries"] })
  const india = regions.find((r: any) => r.countries?.some((c: any) => c.iso_2 === "in"))
  if (!india) throw new CommerceError("India INR region must be configured")
  const profiles = await fulfillment.listShippingProfiles({ type: "default" })
  const profile = profiles[0] || await fulfillment.createShippingProfiles({ name: "Younoya delivery", type: "default" })
  let sets = await fulfillment.listFulfillmentSets({ name: "Younoya Shiprocket India" }, { relations: ["service_zones"] })
  const set = sets[0] || await fulfillment.createFulfillmentSets({ name: "Younoya Shiprocket India", type: "shipping",
    service_zones: [{ name: "India prepaid", geo_zones: [{ country_code: "in", type: "country" }] }] })
  async function ensureLink(value: any) {
    try { await link.create(value) }
    catch (error: any) { if (!/already|duplicate|unique/i.test(error?.message || "")) throw error }
  }
  await ensureLink({ [Modules.STOCK_LOCATION]: { stock_location_id: s.stockLocationId }, [Modules.FULFILLMENT]: { fulfillment_provider_id: "younoya-shiprocket_shiprocket" } })
  await ensureLink({ [Modules.STOCK_LOCATION]: { stock_location_id: s.stockLocationId }, [Modules.FULFILLMENT]: { fulfillment_set_id: set.id } })
  await linkSalesChannelsToStockLocationWorkflow(scope).run({ input: { id: s.stockLocationId, add: [s.salesChannelId] } })
  const existing = await fulfillment.listShippingOptions({ name: "Younoya free India delivery" })
  let option = existing[0]
  if (!option) {
    const { result } = await createShippingOptionsWorkflow(scope).run({ input: [{ name: "Younoya free India delivery", price_type: "flat",
      provider_id: "younoya-shiprocket_shiprocket", service_zone_id: set.service_zones[0].id, shipping_profile_id: profile.id,
      data: { id: "india-prepaid" }, type: { label: "Free delivery", description: "Estimated 3–5 working days after dispatch", code: "india-prepaid" },
      prices: [{ region_id: india.id, amount: 0 }], rules: [{ attribute: "enabled_in_store", value: "true", operator: "eq" },{ attribute: "is_return", value: "false", operator: "eq" }] }] })
    option = result[0]
  }
  const codOptions = await fulfillment.listShippingOptions({ name: 'Younoya COD handling' })
  let cod = codOptions[0]
  if (!cod) {
    const { result } = await createShippingOptionsWorkflow(scope).run({ input: [{ name: 'Younoya COD handling', price_type: 'calculated',
      provider_id: 'younoya-shiprocket_shiprocket', service_zone_id: set.service_zones[0].id, shipping_profile_id: profile.id,
      data: { id: 'india-cod' }, type: { label: 'Cash on Delivery', description: 'Free delivery; ₹49 COD handling per order', code: 'india-cod' },
      rules: [{ attribute: 'enabled_in_store', value: 'true', operator: 'eq' }, { attribute: 'is_return', value: 'false', operator: 'eq' }] }] })
    cod = result[0]
  }
  const providerIds = (await scope.resolve(Modules.PAYMENT).listPaymentProviders({ is_enabled: true })).map((p: any) => p.id)
  const methods = providerIds.filter((id: string) => id === 'pp_system' || id.includes('razorpay'))
  await updateRegionsWorkflow(scope).run({ input: { selector: { id: india.id }, update: { payment_providers: methods } } })
  await saveSettings({ ...s, shippingOptionId: option.id, codShippingOptionId: cod.id })
  return { shippingOptionId: option.id, codShippingOptionId: cod.id }
}
