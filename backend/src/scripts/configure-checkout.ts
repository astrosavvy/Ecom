import type { MedusaContainer } from "@medusajs/framework"
import { provision } from "../modules/younoya-commerce/provision"
import { publicSettings } from "../modules/younoya-commerce/settings"

export default async function configureCheckout({ container }: { container: MedusaContainer }) {
  await provision(container)
  const config = await publicSettings()
  console.log(`India free delivery prepared. Checkout ${config.checkoutEnabled ? "enabled" : "disabled pending launch readiness"}. No payment, refund or pickup was created.`)
}
