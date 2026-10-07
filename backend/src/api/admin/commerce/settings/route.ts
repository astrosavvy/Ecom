import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { commerceRoute } from "../../../utils/commerce"
import { settings, saveSettings, readiness } from "../../../../modules/younoya-commerce/settings"
export const GET = commerceRoute(async req => {
  const value = await settings()
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as any
  const [locations,channels,products] = await Promise.all([
    query.graph({ entity: "stock_location", fields: ["id","name"] }),
    query.graph({ entity: "sales_channel", fields: ["id","name"] }),
    query.graph({ entity: "product", fields: ["id","title","variants.id","variants.title"], pagination: { take: 1000 } }),
  ])
  return { ...value, readiness: readiness(value.draft,value.published,value.revision), locations: locations.data, channels: channels.data,
    variants: products.data.flatMap((p: any) => p.variants.map((v: any) => ({ id: v.id, title: `${p.title} · ${v.title}` }))) }
})
export const POST = commerceRoute(async req => {
  const value = await saveSettings(req.body.settings,req.body.publish === true)
  return { ...value, readiness: readiness(value.draft,value.published,value.revision) }
})
