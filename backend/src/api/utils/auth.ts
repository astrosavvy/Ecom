import type { MedusaRequest } from "@medusajs/framework/http"

export function getCustomerId(req: MedusaRequest): string | null {
  const ctx = (req as unknown as { auth_context?: { actor_id?: string } }).auth_context
  return ctx?.actor_id ?? null
}
