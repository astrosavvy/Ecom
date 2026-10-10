import { authenticate, defineMiddlewares } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { checkoutGuard, completionGuard, operationGuard } from "./utils/commerce-guards"
import { POST as durableRazorpayWebhook } from './hooks/younoya-razorpay/route'
import {
  blogRoleGuard,
  fileGuard,
  readStaffWriteAdmin,
  requireRole,
  usersGuard,
} from "./utils/roles"

const customerAuth = authenticate("customer", ["bearer", "session"])
const optionalCustomerAuth = authenticate("customer", ["bearer", "session"], { allowUnauthenticated: true })
const adminAuth = authenticate("user", ["bearer", "session"])
const adminOnly = requireRole("admin")
const staffRead = requireRole("admin", "support")

export async function hideRecommendationOffers(req: any, res: any, next: any) {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as any
    const allHidden: any[] = []
    let offset = 0
    const batchSize = 1000
    while (true) {
      const { data, count } = await query.graph({
        entity: "product", fields: ["id", "handle", "title", "metadata", "collection_id", "categories.id"],
        pagination: { take: batchSize, skip: offset },
      })
      const items = data || []
      for (const p of items) {
        if (p.metadata?.recommendation_only === true) allHidden.push(p)
      }
      offset += items.length
      if (!items.length || offset >= (count ?? items.length) || items.length < batchSize) break
    }
    const hiddenSet = new Set(allHidden.map((p) => p.id))
    const send = res.json.bind(res)
    res.json = (body: any) => {
      if (!Array.isArray(body?.products)) return send(body)
      const products = body.products.filter((p: any) => !hiddenSet.has(p.id) && p.metadata?.recommendation_only !== true)
      const queryParams = req.query ?? {}
      let hiddenMatching = 0
      for (const p of allHidden) {
        if (queryParams.id && p.id !== queryParams.id && (!Array.isArray(queryParams.id) || !queryParams.id.includes(p.id))) continue
        if (queryParams.handle && p.handle !== queryParams.handle) continue
        if (queryParams.collection_id && p.collection_id !== queryParams.collection_id &&
          (!Array.isArray(queryParams.collection_id) || !queryParams.collection_id.includes(p.collection_id))) continue
        if (queryParams.category_id) {
          const catIds = (p.categories || []).map((c: any) => c.id)
          const target = Array.isArray(queryParams.category_id) ? queryParams.category_id : [queryParams.category_id]
          if (!target.some((t: string) => catIds.includes(t))) continue
        }
        if (queryParams.q) {
          const q = String(queryParams.q).toLowerCase()
          if (!p.title?.toLowerCase().includes(q) && !p.handle?.toLowerCase().includes(q)) continue
        }
        hiddenMatching++
      }
      const adjustedCount = Math.max(0, Number(body.count ?? products.length) - hiddenMatching)
      return send({ ...body, products, count: adjustedCount,
        ...(body.estimate_count === undefined ? {} : { estimate_count: Math.max(0, Number(body.estimate_count) - hiddenMatching) }) })
    }
    next()
  } catch (error) { next(error) }
}

export default defineMiddlewares([
  { matcher: "/hooks/younoya-razorpay", method: ["POST"], bodyParser: { preserveRawBody: true } },
  { matcher: /^\/hooks\/payment\/(?:pp_)?razorpay(?:_razorpay)?$/, method: ["POST"], bodyParser: { preserveRawBody: true }, middlewares: [async (req, res) => { await durableRazorpayWebhook(req,res) }] },
  { matcher: /^\/store\/account(?:\/|$)/, middlewares: [customerAuth] },
  { matcher: "/store/commerce/prepare", method: ["POST"], middlewares: [optionalCustomerAuth] },
  { matcher: '/store/commerce/cod', method: ['POST'], middlewares: [optionalCustomerAuth] },
  { matcher: /^\/store\/payment-collections\/[^/]+\/payment-sessions$/, method: ["POST"], middlewares: [optionalCustomerAuth, checkoutGuard] },
  { matcher: /^\/store\/carts\/[^/]+\/complete$/, method: ["POST"], middlewares: [optionalCustomerAuth, completionGuard] },
  { matcher: /^\/admin\/commerce(?:\/|$)/, middlewares: [adminAuth, readStaffWriteAdmin] },
  { matcher: /^\/admin\/commerce\/(settings|provision)(?:\/|$)/, middlewares: [adminOnly] },
  { matcher: /^\/admin\/(payments\/[^/]+\/refund|orders\/[^/]+\/cancel|orders\/[^/]+\/fulfillments(?:\/.*)?)$/, method: ["POST"], middlewares: [adminAuth, adminOnly, operationGuard] },
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
    middlewares: [optionalCustomerAuth],
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
