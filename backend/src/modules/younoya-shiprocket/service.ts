import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import { CommerceError } from "../younoya-commerce/db"
import { shipment } from "../younoya-commerce/orders"
import { requireLive } from "../younoya-commerce/settings"
import { pack } from "../younoya-commerce/packing"
import { shiprocket } from "../younoya-commerce/shiprocket"
import { COD_FEE } from '../younoya-commerce/delivery'
export default class ShiprocketFulfillment extends AbstractFulfillmentProviderService {
  static identifier = "younoya-shiprocket"
  async getFulfillmentOptions() { return [{ id: "india-prepaid", name: "Free India delivery" }, { id: 'india-cod', name: 'Cash on Delivery' }] }
  async validateOption(data: any) { return ['india-prepaid','india-cod'].includes(data.id) }
  async canCalculate() { return true }
  async calculatePrice(options: any) { return { calculated_amount: options.id === 'india-cod' ? COD_FEE : 0, is_calculated_price_tax_inclusive: true } }
  async validateFulfillmentData(options: any, _data: any, context: any) {
    const s = await requireLive()
    const parcel = pack(context.items,s.draft)
    const pin = context.shipping_address?.postal_code
    if (context.shipping_address?.country_code !== "in" || !/^[1-9]\d{5}$/.test(pin || "")) throw new CommerceError("Enter an India delivery address")
    // The signed checkout preparation performs one authoritative serviceability check.
    return { id: options.id, parcel }
  }
  async createFulfillment(_data: any, _items: any, order: any) {
    const delivery = await shipment(order?.id)
    if (!delivery?.data?.awb || !delivery.data.pickupScheduled || delivery.status === "cancelled") throw new CommerceError("Approve an AWB and pickup through order operations first",409)
    return { data: { order_id: order.id, ...delivery.data }, labels: [] }
  }
  async cancelFulfillment(data: any) {
    const delivery = await shipment(data.order_id)
    if (delivery && delivery.status !== "cancelled") throw new CommerceError("Cancel the Shiprocket booking through order operations first",409)
    return {}
  }
  async createReturnFulfillment(): Promise<any> { throw new CommerceError("Returns require atelier approval and return instructions",409) }
}
