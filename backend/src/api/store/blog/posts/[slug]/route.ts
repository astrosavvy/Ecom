import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { YOUNOYA_BLOG_MODULE } from "../../../../../modules/younoya-blog"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { slug } = req.params
  const blogService = req.scope.resolve(YOUNOYA_BLOG_MODULE) as any
  try {
    const posts = await blogService.listBlogPosts({ slug, published: true })
    const post = posts?.[0]
    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }
    return res.json({ post })
  } catch (e) {
    return res.status(404).json({ message: "Post not found" })
  }
}
