import { commerceRoute } from "../../../../../utils/commerce"
import { readOrder } from "../../../../../../modules/younoya-commerce/orders"
import { settings } from "../../../../../../modules/younoya-commerce/settings"
import { shiprocket } from "../../../../../../modules/younoya-commerce/shiprocket"
import { pack } from "../../../../../../modules/younoya-commerce/packing"
export const GET = commerceRoute(async req => {
  const order = await readOrder(req.scope,req.params.id)
  const s = await settings()
  const approved = order.metadata?.commerce_approval
  const parcel = approved?.parcel || pack(order.items,s.draft)
  const couriers = await shiprocket.serviceability(approved?.shipping?.pickupPincode || s.draft.pickupPincode,
    order.shipping_address?.postal_code,parcel.weightKg,parcel,approved?.payment_method === 'cod')
  return { couriers: couriers.map((c: any) => ({ id: Number(c.courier_company_id), name: c.courier_name, rate: Number(c.rate), etd: c.etd })) }
})
