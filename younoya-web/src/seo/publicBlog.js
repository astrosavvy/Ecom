import { isPublishedPost } from './blog.js'

// This is Medusa's public storefront key, never a private provider credential.
export const PUBLIC_API_BASE = 'https://api.younoya.com'
export const PUBLIC_STOREFRONT_KEY = 'pk_d4577228b532cf8c81a5b63e898652da2dbaf9730acd3f8f449ccda1f8482c75'

async function requestJson(path, options) {
  const response = await (options.fetcher || fetch)(`${options.apiBase || PUBLIC_API_BASE}${path}`, {
    headers: { 'x-publishable-api-key': options.key || PUBLIC_STOREFRONT_KEY, Accept: 'application/json' },
    signal: options.signal,
  })
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Public journal returned HTTP ${response.status}`)
  return response.json()
}

export async function readPublishedPost(slug, options = {}) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null
  const value = await requestJson(`/store/blog/posts/${encodeURIComponent(slug)}`, { signal: AbortSignal.timeout(6000), ...options })
  if (!value) return null
  if (value.post?.published === false) return null
  if (!isPublishedPost(value.post) || value.post.slug !== slug) throw new Error('Invalid public journal article')
  return value.post
}

export async function readPublishedPosts(options = {}) {
  const posts = new Map()
  const requestOptions = { signal: AbortSignal.timeout(10000), ...options }
  const limit = 24
  let offset = 0
  for (let page = 0; page < 100; page++) {
    const value = await requestJson(`/store/blog/posts?limit=${limit}&offset=${offset}`, requestOptions)
    if (!value || !Array.isArray(value.posts) || !Number.isSafeInteger(value.count) || value.count < 0) throw new Error('Invalid public journal listing')
    for (const post of value.posts) {
      if (post.published === false) continue
      if (!isPublishedPost(post)) throw new Error('Invalid public journal entry')
      posts.set(post.slug, post)
    }
    offset += value.posts.length
    if (offset >= value.count) return [...posts.values()]
    if (!value.posts.length) throw new Error('Incomplete public journal listing')
  }
  throw new Error('Public journal pagination limit exceeded')
}
