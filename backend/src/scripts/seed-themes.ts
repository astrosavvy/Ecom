import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

const THEMES = [
  { name: "Love & Connection", slug: "love-connection", icon: "💕", category: "relationship", description: "Products associated with romantic relationships, partnerships, and emotional bonds. Perfect for anniversaries, Valentine's, or simply expressing deep affection.", sort_order: 1 },
  { name: "Career & Growth", slug: "career-growth", icon: "📈", category: "career", description: "Products symbolizing professional advancement, ambition, and recognition. Ideal for promotions, new jobs, or career milestones.", sort_order: 2 },
  { name: "Money & Prosperity", slug: "money-prosperity", icon: "💰", category: "finance", description: "Products associated with financial abundance, wealth retention, and opportunity. Suitable for business launches, investments, and financial milestones.", sort_order: 3 },
  { name: "Calm & Balance", slug: "calm-balance", icon: "🧘", category: "wellbeing", description: "Products supporting emotional equilibrium, mindfulness, and inner peace. Perfect for someone going through stress, anxiety, or life transitions.", sort_order: 4 },
  { name: "New Beginnings", slug: "new-beginnings", icon: "🌱", category: "growth", description: "Products symbolizing transformation, fresh starts, and change. Ideal for housewarmings, new chapters, or recovery milestones.", sort_order: 5 },
  { name: "Confidence & Courage", slug: "confidence-courage", icon: "💪", category: "growth", description: "Products associated with self-assurance, courage, and personal power. Great for someone facing challenges or stepping into a new role.", sort_order: 6 },
  { name: "Focus & Direction", slug: "focus-direction", icon: "🎯", category: "career", description: "Products supporting clarity, decision-making, and purposeful action. Suitable for students, entrepreneurs, or anyone seeking clarity.", sort_order: 7 },
  { name: "Home & Harmony", slug: "home-harmony", icon: "🏠", category: "home_vastu", description: "Products for creating balanced, positive living spaces. Perfect for housewarmings, new homes, or Vastu corrections.", sort_order: 8 },
  { name: "Protection & Safety", slug: "protection-safety", icon: "🛡️", category: "lifestyle", description: "Products associated with warding off negativity, evil eye protection, and spiritual safety. Suitable for travel, new ventures, or vulnerable life phases.", sort_order: 9 },
  { name: "Gratitude & Appreciation", slug: "gratitude-appreciation", icon: "🙏", category: "gifting", description: "Products expressing thankfulness, respect, and recognition. Perfect for teachers, mentors, parents, or anyone who deserves appreciation.", sort_order: 10 },
]

// Map existing products to themes (product handle -> theme slugs with priority)
const PRODUCT_THEME_MAP: Record<string, Array<{ theme: string; priority: string }>> = {
  "vedic-prosperity-rakhi": [
    { theme: "protection-safety", priority: "high" },
    { theme: "love-connection", priority: "medium" },
    { theme: "gratitude-appreciation", priority: "medium" },
  ],
  "celestial-harmony-rakhi": [
    { theme: "calm-balance", priority: "high" },
    { theme: "love-connection", priority: "medium" },
  ],
  "cosmic-guardian-rakhi": [
    { theme: "protection-safety", priority: "high" },
    { theme: "confidence-courage", priority: "medium" },
  ],
  "nakshatra-blessing-rakhi": [
    { theme: "new-beginnings", priority: "high" },
    { theme: "gratitude-appreciation", priority: "medium" },
  ],
  "divine-shield-rakhi": [
    { theme: "protection-safety", priority: "high" },
    { theme: "confidence-courage", priority: "high" },
  ],
  "astral-abundance-pendant": [
    { theme: "money-prosperity", priority: "high" },
    { theme: "career-growth", priority: "medium" },
  ],
  "lunar-grace-pendant": [
    { theme: "calm-balance", priority: "high" },
    { theme: "love-connection", priority: "medium" },
  ],
  "solar-vitality-bracelet": [
    { theme: "confidence-courage", priority: "high" },
    { theme: "career-growth", priority: "medium" },
  ],
  "mercury-wisdom-bracelet": [
    { theme: "focus-direction", priority: "high" },
    { theme: "career-growth", priority: "medium" },
  ],
  "venus-harmony-ring": [
    { theme: "love-connection", priority: "high" },
    { theme: "calm-balance", priority: "medium" },
  ],
  "saturn-discipline-ring": [
    { theme: "career-growth", priority: "high" },
    { theme: "focus-direction", priority: "medium" },
  ],
  "jupiter-fortune-locket": [
    { theme: "money-prosperity", priority: "high" },
    { theme: "new-beginnings", priority: "medium" },
  ],
  "mars-courage-locket": [
    { theme: "confidence-courage", priority: "high" },
    { theme: "protection-safety", priority: "medium" },
  ],
  "rahu-transformation-pendant": [
    { theme: "new-beginnings", priority: "high" },
    { theme: "career-growth", priority: "medium" },
  ],
}

// Product metadata (editorial stories, materials, etc.)
const PRODUCT_METADATA: Record<string, {
  editorial_story?: string
  symbolic_significance?: string
  materials?: string
  dimensions?: string
  care_instructions?: string
  suitable_for?: string[]
}> = {
  "vedic-prosperity-rakhi": {
    editorial_story: "Every thread in this Rakhi carries a prayer. The Red Coral at its centre has been associated with Mars energy for millennia — courage for the wearer, protection from the giver. We source each stone from ethical suppliers, then thread it through hand-spun mauli cotton blessed during Brahma Muhurta.",
    symbolic_significance: "The Rakhi tradition is one of the most powerful symbolic gestures in Indian culture — a sister's prayer made physical. This isn't just decorative thread. It's intention, wrapped.",
    materials: "Red Coral (Moonga), hand-spun mauli cotton, gold-plated accents, sandalwood beads",
    dimensions: "Adjustable, fits wrist sizes 15cm-22cm",
    care_instructions: "Store in the included velvet pouch. Avoid water and perfume contact. The crystal may develop a natural patina over time — this is considered auspicious.",
    suitable_for: ["Brothers", "Cousins", "Close male friends", "Raksha Bandhan", "Protection rituals"],
  },
  "astral-abundance-pendant": {
    editorial_story: "Citrine has been called the 'Merchant's Stone' across cultures. In Vedic tradition, it resonates with Jupiter — the planet of fortune, expansion, and wisdom. This pendant is designed to be worn close to the heart, where tradition says its vibrations can influence the Anahata chakra.",
    symbolic_significance: "Jupiter represents growth that comes from wisdom, not luck. This pendant is for someone who is building something — a business, a career, a life — and wants to carry a symbol of their intent.",
    materials: "Natural Citrine crystal, 925 sterling silver setting, gold-plated chain",
    dimensions: "Pendant: 18mm x 12mm, Chain: 45cm adjustable",
    care_instructions: "Clean with a soft cloth. Recharge under moonlight during Purnima (full moon) for best results. Avoid harsh chemicals.",
    suitable_for: ["Entrepreneurs", "Career-focused individuals", "Graduation gifts", "Business launches"],
  },
  "venus-harmony-ring": {
    editorial_story: "Rose Quartz has been the universal stone of love since antiquity. In the Vedic system, it channels Venus — the planet of beauty, harmony, and romantic connection. This ring is hand-finished with a faceted cut that catches light differently depending on the angle, much like relationships themselves.",
    symbolic_significance: "Venus in Vedic astrology governs not just romance, but all forms of beauty and harmony. This ring represents the wearer's commitment to bringing more balance and love into their world.",
    materials: "Rose Quartz crystal, brushed 925 sterling silver band",
    dimensions: "Available in sizes 5-11, crystal: 8mm round",
    care_instructions: "Remove before washing hands. Store separately to avoid scratching. Polish silver with the included cloth.",
    suitable_for: ["Partners", "Anniversaries", "Self-love rituals", "Bridesmaids"],
  },
}

export default async function seedThemes(container: MedusaContainer) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  let themesService: any
  try {
    themesService = container.resolve("younoyaThemes")
  } catch {
    logger.warn("younoyaThemes module not available — skipping theme seed.")
    return
  }

  // Seed themes
  for (const theme of THEMES) {
    const existing = await themesService.listThemes({ slug: theme.slug })
    if (existing?.length) {
      logger.info(`Theme already exists: ${theme.slug}`)
      continue
    }
    await themesService.createThemes({ ...theme, active: true })
    logger.info(`Seeded theme: ${theme.name}`)
  }

  // Get all themes for ID lookup
  const allThemes = await themesService.listThemes({})
  const themeBySlug = new Map(allThemes.map((t: any) => [t.slug, t.id]))

  // Get all products for handle lookup
  const productService = container.resolve(Modules.PRODUCT) as any
  let products: any[] = []
  try {
    products = await productService.listProducts({}, { take: 100 })
  } catch {
    logger.warn("Could not list products — skipping product-theme associations.")
    return
  }
  const productByHandle = new Map(products.map((p: any) => [p.handle, p.id]))

  // Seed product-theme associations
  for (const [handle, themes] of Object.entries(PRODUCT_THEME_MAP)) {
    const productId = productByHandle.get(handle)
    if (!productId) {
      logger.info(`Product not found: ${handle} — skipping associations`)
      continue
    }

    for (const { theme, priority } of themes) {
      const themeId = themeBySlug.get(theme)
      if (!themeId) continue

      const existing = await themesService.listProductThemes({ product_id: productId, theme_id: themeId })
      if (existing?.length) continue

      await themesService.createProductThemes({
        product_id: productId,
        theme_id: themeId,
        priority,
      })
      logger.info(`  Linked ${handle} -> ${theme} (${priority})`)
    }
  }

  // Seed product metadata
  for (const [handle, meta] of Object.entries(PRODUCT_METADATA)) {
    const productId = productByHandle.get(handle)
    if (!productId) {
      logger.info(`Product not found: ${handle} — skipping metadata`)
      continue
    }

    const existing = await themesService.listProductMetadatas({ product_id: productId })
    if (existing?.length) {
      logger.info(`Metadata already exists for: ${handle}`)
      continue
    }

    await themesService.createProductMetadatas({
      product_id: productId,
      editorial_story: meta.editorial_story || null,
      symbolic_significance: meta.symbolic_significance || null,
      materials: meta.materials || null,
      dimensions: meta.dimensions || null,
      care_instructions: meta.care_instructions || null,
      suitable_for: meta.suitable_for || null,
      symbolic_associations: null,
      seo_title: null,
      meta_description: null,
      clean_url: null,
    })
    logger.info(`Seeded metadata for: ${handle}`)
  }

  logger.info("Theme seed complete.")
}
