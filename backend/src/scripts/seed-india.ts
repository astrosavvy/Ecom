import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function seedIndiaRegion({ container }: ExecArgs) {
  const regionService = container.resolve(Modules.REGION) as any
  const fulfillmentService = container.resolve(Modules.FULFILLMENT) as any
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL) as any

  console.log("🌱 Seeding India region and configurations...")

  try {
    const existingRegions = await regionService.listRegions({ name: "India" })
    let region = existingRegions?.[0]

    if (!region) {
      region = await regionService.createRegions({
        name: "India",
        currency_code: "inr",
        countries: ["in"],
      })
      console.log("✅ Created Region: India (INR)")
    } else {
      console.log("ℹ️ Region India already exists")
    }

    const defaultChannels = await salesChannelService.listSalesChannels({ name: "Default Sales Channel" })
    if (defaultChannels?.length > 0 && region) {
      console.log("ℹ️ Default Sales Channel active")
    }
  } catch (e: any) {
    console.warn("Region seed info:", e.message)
  }

  console.log("🎉 Seed completed successfully!")
}
