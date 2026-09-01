import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { YOUNOYA_BLOG_MODULE } from "../../../../modules/younoya-blog"
import crypto from "crypto"

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80)
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const blog = req.scope.resolve(YOUNOYA_BLOG_MODULE) as any
  const limit = Math.min(50, parseInt(String(req.query.limit ?? "20"), 10) || 20)
  const offset = parseInt(String(req.query.offset ?? "0"), 10) || 0
  const [posts, count] = await blog.listAndCountBlogPosts(
    {},
    { skip: offset, take: limit, order: { created_at: "DESC" } }
  )
  return res.json({ posts, count, limit, offset })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const blog = req.scope.resolve(YOUNOYA_BLOG_MODULE) as any
  const body = (req.body ?? {}) as {
    title?: string
    content?: string
    excerpt?: string
    cover_image?: string
    list_image?: string
    author?: string
    published?: boolean
    slug?: string
  }

  if (!body.title || !body.content) {
    return res.status(400).json({ message: "title and content are required." })
  }

  const customSlug = body.slug?.trim() ? slugify(body.slug.trim()) : ""
  const generatedSlug = `${slugify(body.title)}-${crypto.randomBytes(2).toString("hex")}`

  const post = await blog.createBlogPosts({
    title: body.title.trim(),
    slug: customSlug || generatedSlug,
    content: body.content,
    excerpt: body.excerpt ?? body.content.replace(/<[^>]*>/g, "").slice(0, 180),
    cover_image: body.cover_image ?? null,
    list_image: body.list_image ?? null,
    author: body.author ?? "YOUNOYA",
    published: body.published ?? false,
    published_at: body.published ? new Date() : null,
  })

  return res.json({ post })
}
