import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { YOUNOYA_BLOG_MODULE } from "../../../../modules/younoya-blog"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const blogService = req.scope.resolve(YOUNOYA_BLOG_MODULE) as any
  try {
    const posts = await blogService.listBlogPosts({ published: true })
    return res.json({ posts: posts || [] })
  } catch (e) {
    return res.json({ posts: [] })
  }
}
