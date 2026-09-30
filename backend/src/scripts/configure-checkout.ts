import type { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { updateRegionsWorkflow } from "@medusajs/medusa/core-flows"

export default async function configureCheckout({ container }: { container: MedusaContainer }) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Set Razorpay key ID and secret before enabling checkout")
  }
  const regionService = container.resolve(Modules.REGION) as any
  const regions = await regionService.listRegions({ currency_code: "inr" }, { relations: ["countries"] })
  const india = regions.find((region: any) => region.countries?.some((country: any) => country.iso_2 === "in"))
  if (!india) throw new Error("Create the India / INR region before enabling checkout")
  await updateRegionsWorkflow(container).run({ input: { selector: { id: india.id },
    update: { payment_providers: ["pp_razorpay_razorpay"] } } })
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as any
  const { data: updated } = await query.graph({ entity: "region", filters: { id: india.id },
    fields: ["id", "payment_providers.id"] })
  if (!updated[0]?.payment_providers?.some((provider: any) => provider.id === "pp_razorpay_razorpay")) {
    throw new Error("Razorpay provider was not linked to the India region")
  }
}
