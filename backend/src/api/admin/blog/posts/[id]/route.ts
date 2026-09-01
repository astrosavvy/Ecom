import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { YOUNOYA_BLOG_MODULE } from "../../../../../modules/younoya-blog"

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const blog = req.scope.resolve(YOUNOYA_BLOG_MODULE) as any
  const { id } = req.params
  const body = (req.body ?? {}) as Record<string, unknown>

  const updates: Record<string, unknown> = {}
  for (const key of ["title", "slug", "content", "excerpt", "cover_image", "list_image", "author"]) {
    if (typeof body[key] === "string") updates[key] = body[key]
  }
  if (typeof body.published === "boolean") {
    updates.published = body.published
    updates.published_at = body.published ? new Date() : null
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "Nothing to update." })
  }

  try {
    const post = await blog.updateBlogPosts({ id, ...updates })
    return res.json({ post })
  } catch (e) {
    return res.status(404).json({ message: "Post not found." })
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const blog = req.scope.resolve(YOUNOYA_BLOG_MODULE) as any
  const posts = await blog.listBlogPosts({ id: req.params.id })
  if (!posts?.length) return res.status(404).json({ message: "Post not found." })
  return res.json({ post: posts[0] })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const blog = req.scope.resolve(YOUNOYA_BLOG_MODULE) as any
  await blog.deleteBlogPosts(req.params.id)
  return res.json({ success: true, id: req.params.id })
}
