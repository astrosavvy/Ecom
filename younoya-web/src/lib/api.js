/**
 * YOUNOYA Commerce & Editorial Blog API Client
 * Single SSOT for fetching published stories and editorial content from Medusa 2.18
 */

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
  ? import.meta.env.VITE_API_BASE
  : 'https://api.younoya.com'

const PUBLISHABLE_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PUBLISHABLE_KEY)
  ? import.meta.env.VITE_PUBLISHABLE_KEY
  : 'pk_d4577228b532cf8c81a5b63e898652da2dbaf9730acd3f8f449ccda1f8482c75'

export const FALLBACK_BLOG_POSTS = [
  {
    id: '01M1XBR1GTFASJRX90FPXSB6NS',
    title: 'Thoughtful Gifts Inspired by Astrology',
    slug: 'thoughtful-gifts-inspired-by-astrology',
    author: 'YOUNOYA Atelier',
    published_at: '2026-09-07T07:18:57.806Z',
    category: 'Astrology & Rituals',
    readTime: '5 min read',
    excerpt: 'Explore how aligning keepsakes with planetary energies and sacred intentions creates gifts of enduring resonance. Discover meaningful connections through crystals, zodiac symbolism, and intentional celebration.',
    cover_image: 'https://api.younoya.com/static/1788765534846-ChatGPT%20Image%20Sep%207,%202026,%2012_48_28%20PM.png',
    featured: true,
    content: `
Gifting is one of the oldest and most personal ways people express love, appreciation, and connection. A well-chosen gift can celebrate a special moment, mark an important chapter in someone’s life, or simply bring a sense of warmth and thoughtfulness to everyday life.

In recent years, more people have begun looking for gifts that offer something deeper than standard presents. Instead of generic items, they are drawn to gifts that carry meaning, reflect personal identity, or connect with the stories and symbols that matter to them.

This is where astrology-inspired gifting comes in.

Astrology offers a rich visual and symbolic language that connects people to the stars, the seasons, and the qualities associated with different zodiac signs. When combined with wearable design and natural materials like crystals and gemstones, it creates a way to give gifts that feel deeply personal without being overly complicated.

At YOUNOYA, we explore how thoughtful design, zodiac inspiration, and crystal jewelry come together to create meaningful gifting experiences.

## Crystal Bracelets: Meaning You Can Wear

A crystal bracelet is one of the most personal forms of astrology-inspired jewelry. Unlike a decorative object that stays in one place, a bracelet travels with the wearer. It becomes part of everyday life, whether someone is working, travelling, meeting friends, or enjoying a quiet moment.

This makes it a natural choice for meaningful gifting.

Different crystals are traditionally associated with different qualities:
- **Rose Quartz** is often connected with love, tenderness, and compassion.
- **Amethyst** is associated with calmness, clarity, and contemplative reflection.
- **Citrine** is commonly linked with radiant confidence, warmth, and prosperity.
- **Clear Quartz** is traditionally associated with sacred clarity and pure intention.

These associations are part of crystal and spiritual traditions, not scientifically established medical claims. At YOUNOYA, we see them as a way to give jewelry a personal meaning. A crystal bracelet can be beautiful on its own. But when it is chosen with someone’s personality or intentions in mind, it transforms into an enduring keepsake.

## Gifts Inspired by Zodiac Signs

Zodiac signs are one of the most intuitive ways people connect with astrology. For some, a zodiac sign is a delightful part of their personality. For others, it is a meaningful part of how they understand themselves. Either way, zodiac-inspired gifting offers a simple way to make a present feel deeply personal.

A zodiac gift can celebrate someone’s individuality, reflect their natural talents, or become a small daily reminder of the qualities they admire.

Whether you are shopping for an Aries who loves bold choices, a Libra who appreciates harmony and beauty, or a Pisces who enjoys meaningful symbolism, astrology offers endless inspiration without making gifting complicated.

At YOUNOYA, our astrology gifting approach is about celebrating these personal connections through thoughtful products and artisanal design.

## Why Meaningful Gifting Matters

In a world where it is easy to buy almost anything with a tap, choosing a gift with intention makes the experience genuinely unforgettable.

A meaningful gift does not have to be noisy or elaborate. It can be a small piece of jewelry, a carefully chosen crystal vessel, or an authentic keepsake that reflects a person’s inner spirit. What matters is the thought behind it.

A gift can mark a milestone, celebrate a relationship, encourage someone embarking on a new beginning, or simply whisper, *"You matter to me."*

This is why we believe astrology gifting has an indispensable place in modern celebrations. It gives people an eloquent way to express appreciation, affection, and cosmic connection.

## Designed for Everyday Gifting

At YOUNOYA, we understand that gifting happens throughout the year. Birthdays, anniversaries, auspicious festivals, friendships, milestones, and personal celebrations all create opportunities to give something meaningful. Sometimes, there is no occasion at all. You simply want to make someone smile.

Our approach to gifting is designed around that everyday reality. We want our keepsakes to feel easy to choose, effortless to wear, and joyous to give. A thoughtful gift should not require a complicated explanation. It should simply feel right.

## A Gift for Yourself, Too

Gifting is often associated with other people, but self-gifting can be just as sacred.

Choosing something for yourself is a way to celebrate a quiet milestone, mark a new chapter, or anchor an intention. An astrology-inspired bracelet can become an amulet of personal resolve. A gemstone can add colour to your everyday rituals. A zodiac keepsake can honour your natural strengths.

There is no need to wait for an external occasion. At YOUNOYA, we believe celebrating yourself is an essential ritual.

## Our Approach to Astrology and Symbolism

Astrology and sacred traditions have been part of cultures for millennia. At YOUNOYA, we honour that personal connection while keeping our creations grounded in intentional aesthetic excellence.

Our products are designed as authentic keepsakes and consecrated heirlooms that people can treasure in their own way. Whether you feel guided by planetary wisdom or simply appreciate the beauty of raw crystals, there is always room for your own interpretation.

## Why Choose YOUNOYA?

Choosing a gift is about more than finding a product. It is about finding something that feels deeply suited for the person receiving it.

- **Meaningful**: Curated with a specific person or intention in mind.
- **Enduring**: Handcrafted materials designed to become part of everyday life.
- **Thoughtful**: Consecrated and personalized rather than mass-produced.
- **Versatile**: Designed for life’s quiet transitions as well as grand celebrations.
- **Authentic**: Grounded in natural minerals, brass artistry, and timeless Vedic insight.

## Discover YOUNOYA

YOUNOYA is created for people who believe that everyday objects can carry personal meaning. Our astrology-inspired keepsakes, crystal vessels, and sacred heirlooms bring together beauty, symbolism, and the joy of intentional gifting.

*YOUNOYA — For every chapter.*
    `.trim(),
  },
]

/**
 * Fetch all published blog posts from the Medusa 2.18 backend
 */
export async function fetchBlogPosts({ limit = 12, offset = 0 } = {}) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const res = await fetch(`${API_BASE}/store/blog/posts?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      console.warn(`[YOUNOYA API] Failed to fetch blog posts (${res.status}), using fallback dataset.`)
      return { posts: FALLBACK_BLOG_POSTS, count: FALLBACK_BLOG_POSTS.length }
    }

    const data = await res.json()
    if (data && Array.isArray(data.posts) && data.posts.length > 0) {
      // Enrich with categories, read times and formatting
      const enriched = data.posts.map((post, idx) => ({
        ...post,
        category: post.category || (idx === 0 ? 'Astrology & Rituals' : 'Intentional Gifting'),
        readTime: post.readTime || `${Math.max(3, Math.ceil((post.content?.split(/\s+/).length || 500) / 220))} min read`,
        featured: idx === 0,
      }))
      return { posts: enriched, count: data.count || enriched.length }
    }

    return { posts: FALLBACK_BLOG_POSTS, count: FALLBACK_BLOG_POSTS.length }
  } catch (err) {
    console.warn('[YOUNOYA API] Network error fetching blog posts, using fallback:', err.message)
    return { posts: FALLBACK_BLOG_POSTS, count: FALLBACK_BLOG_POSTS.length }
  }
}

/**
 * Fetch a single blog post by slug from Medusa 2.18
 */
export async function fetchBlogPostBySlug(slug) {
  if (!slug) return null

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const res = await fetch(`${API_BASE}/store/blog/posts/${encodeURIComponent(slug)}`, {
      method: 'GET',
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (res.ok) {
      const data = await res.json()
      if (data && data.post) {
        const post = data.post
        return {
          ...post,
          category: post.category || 'Astrology & Rituals',
          readTime: `${Math.max(3, Math.ceil((post.content?.split(/\s+/).length || 500) / 220))} min read`,
        }
      }
    }
  } catch (err) {
    console.warn('[YOUNOYA API] Error fetching post by slug, checking fallback:', err.message)
  }

  // Check fallback dataset
  const fallback = FALLBACK_BLOG_POSTS.find((p) => p.slug === slug)
  return fallback || null
}
