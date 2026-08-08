import { model } from "@medusajs/framework/utils"

const BlogPost = model.define("blog_post", {
  id: model.id().primaryKey(),
  title: model.text(),
  slug: model.text(),
  content: model.text(),
  excerpt: model.text().nullable(),
  cover_image: model.text().nullable(),
  published: model.boolean().default(false),
  published_at: model.dateTime().nullable(),
  author: model.text().default("YOUNOYA"),
})

export default BlogPost
