import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export type AdminRole = "admin" | "support" | "marketing"

/**
 * Resolve the console role of the authenticated admin user.
 * Users without a role in metadata default to "admin" (the owner account
 * predates roles). Missing actor fails closed.
 */
export async function getAdminRole(req: MedusaRequest): Promise<AdminRole | null> {
  const actorId = (req as any).auth_context?.actor_id
  if (!actorId) return null
  const userModule = req.scope.resolve(Modules.USER) as any
  const users = await userModule.listUsers({ id: actorId })
  const role = users?.[0]?.metadata?.role
  if (role === "support" || role === "marketing") return role
  return "admin"
}

type Next = (err?: unknown) => void

/** Middleware factory: allow only the given roles (checked after authenticate). */
export function requireRole(...allowed: AdminRole[]) {
  return async (req: MedusaRequest, res: MedusaResponse, next: Next) => {
    try {
      const role = await getAdminRole(req)
      if (!role || !allowed.includes(role)) {
        return res.status(403).json({ message: "You do not have permission to do this." })
      }
      ;(req as any).adminRole = role
      next()
    } catch (e) {
      next(e)
    }
  }
}

/**
 * Method-aware guard for core admin resources.
 * reads: admin + support; writes: admin only.
 */
export function readStaffWriteAdmin(req: MedusaRequest, res: MedusaResponse, next: Next) {
  const read = req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS"
  const allowed: AdminRole[] = read ? ["admin", "support"] : ["admin"]
  return requireRole(...allowed)(req, res, next)
}

/** Blog: reads for all staff; writes for admin + marketing. */
export function blogRoleGuard(req: MedusaRequest, res: MedusaResponse, next: Next) {
  const read = req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS"
  const allowed: AdminRole[] = read ? ["admin", "support", "marketing"] : ["admin", "marketing"]
  return requireRole(...allowed)(req, res, next)
}

/** Files (cover uploads): admin + marketing. */
export const fileGuard = requireRole("admin", "marketing")

/** Users: every staff member may GET their own /admin/users/me profile;
 * everything else (list, create, delete users) is admin only.
 */
export function usersGuard(req: MedusaRequest, res: MedusaResponse, next: Next) {
  const url = (req as any).originalUrl || (req as any).url || (req as any).path || ""
  if (req.method === "GET" && url.includes("/admin/users/me")) {
    return next()
  }
  return requireRole("admin")(req, res, next)
}
