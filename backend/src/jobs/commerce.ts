import type { MedusaContainer } from "@medusajs/framework/types"
import { runCommerceWorker } from "../modules/younoya-commerce/worker"
export default async function commerceJob(container: MedusaContainer) {
  try { await runCommerceWorker(container) }
  catch { container.resolve("logger").error("Commerce reconciliation is unavailable; pending operations remain persisted.") }
}
export const config = { name: "younoya-commerce-reconciliation", schedule: "* * * * *" }
