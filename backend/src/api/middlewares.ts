import { authenticate, defineMiddlewares } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  blogRoleGuard,
  fileGuard,
  readStaffWriteAdmin,
  requireRole,
  usersGuard,
} from "./utils/roles"

const customerAuth = authenticate("customer", ["bearer", "session"])
const adminAuth = authenticate("user", ["bearer", "session"])
const adminOnly = requireRole("admin")
const staffRead = requireRole("admin", "support")

export async function hideRecommendationOffers(req: any, res: any, next: any) {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as any
    const { data } = await query.graph({ entity: "product", fields: ["id", "metadata"],
      pagination: { take: 1000 } })
    const hidden = new Set(data.filter((product: any) => product.metadata?.recommendation_only === true)
      .map((product: any) => product.id))
    const send = res.json.bind(res)
    res.json = (body: any) => {
      if (!Array.isArray(body?.products)) return send(body)
      const products = body.products.filter((product: any) => !hidden.has(product.id))
      return send({ ...body, products, count: Math.max(0, Number(body.count ?? products.length) - hidden.size),
        ...(body.estimate_count === undefined ? {} : { estimate_count: Math.max(0, Number(body.estimate_count) - hidden.size) }) })
    }
    next()
  } catch (error) { next(error) }
}

export default defineMiddlewares([
  {
    matcher: "/store/products",
    method: ["GET"],
    middlewares: [hideRecommendationOffers],
  },
  {
    matcher: "/store/astro/profiles",
    method: ["GET", "POST"],
    middlewares: [customerAuth],
  },
  {
    matcher: "/store/astro/profiles/*",
    method: ["GET", "DELETE"],
    middlewares: [customerAuth],
  },
  {
    matcher: "/store/astro/recommend",
    method: ["POST"],
    middlewares: [customerAuth],
  },
  {
    matcher: "/store/toolkits",
    method: ["GET", "POST"],
    middlewares: [customerAuth],
  },
  {
    matcher: "/store/toolkits/*",
    method: ["GET"],
    middlewares: [customerAuth],
  },
  {
    matcher: "/store/gift-guide/saved",
    method: ["GET", "POST"],
    middlewares: [customerAuth],
  },
  {
    matcher: "/store/gift-guide/saved/*",
    method: ["GET"],
    middlewares: [customerAuth],
  },
  {
    matcher: "/store/gift-guide/payment-confirm",
    method: ["GET", "POST"],
    middlewares: [customerAuth],
  },
  {
    matcher: "/store/recipients",
    method: ["GET", "POST"],
    middlewares: [customerAuth],
  },
  {
    matcher: "/store/recipients/*",
    method: ["GET", "PUT", "DELETE"],
    middlewares: [customerAuth],
  },
  // Admin theme/rules management
  {
    matcher: /^\/admin\/gift-guide(?:\/|$)/,
    middlewares: [adminAuth, adminOnly],
  },
  {
    matcher: "/admin/themes*",
    method: ["GET", "POST", "PUT", "DELETE"],
    middlewares: [adminAuth, adminOnly],
  },
  {
    matcher: "/admin/rules*",
    method: ["GET", "POST", "PUT", "DELETE"],
    middlewares: [adminAuth, adminOnly],
  },
  {
    matcher: "/admin/blog*",
    method: ["GET", "POST", "PUT", "DELETE"],
    middlewares: [adminAuth, blogRoleGuard],
  },
  {
    matcher: "/admin/team",
    method: ["GET", "POST"],
    middlewares: [adminAuth, adminOnly],
  },
  {
    matcher: "/admin/team/*",
    method: ["DELETE"],
    middlewares: [adminAuth, adminOnly],
  },
  {
    matcher: "/admin/astro/profiles",
    method: ["GET"],
    middlewares: [adminAuth, staffRead],
  },
  {
    // core admin resources: staff can read, only admin can write
    matcher: /^\/admin\/(orders|products|customers)/,
    middlewares: [readStaffWriteAdmin],
  },
  {
    // sensitive settings: admin only (GET /admin/users/me stays open for all staff)
    matcher: /^\/admin\/(users|store|api-keys|promotions|campaigns|collections|regions|sales-channels)/,
    middlewares: [usersGuard],
  },
  {
    matcher: "/admin/uploads*",
    method: ["GET", "POST"],
    middlewares: [adminAuth, fileGuard],
  },
  {
    matcher: "/admin/uploads*",
    method: ["DELETE"],
    middlewares: [adminAuth, adminOnly],
  },
  {
    matcher: "/admin/files*",
    method: ["GET", "POST"],
    middlewares: [adminAuth, fileGuard],
  },
  {
    matcher: "/admin/files*",
    method: ["DELETE"],
    middlewares: [adminAuth, adminOnly],
  },
])
