import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows"

const STOREFRONT_URL = process.env.STOREFRONT_URL || "https://younoya.com"

type SeedProduct = {
  title: string
  handle: string
  sku: string
  price: number
  subtitle: string
  description: string
  collection: string
  metadata: Record<string, unknown>
}

const CATALOG: SeedProduct[] = [
  {
    title: "Vedic Prosperity Rakhi",
    handle: "vedic-prosperity-rakhi",
    sku: "YN-RAKHI-001",
    price: 1099,
    subtitle: "Mars-blessed protection for the brother you pray for",
    description:
      "A handcrafted Vedic Rakhi where every element is chosen with intention — an astrologically selected crystal, sacred mauli thread and Vedic accents, consecrated for prosperity and protection. A keepsake long after the festival.",
    collection: "Rakhi",
    metadata: {
      subtitle: "Mars-blessed protection for the brother you pray for",
      mrp_inr: 1099,
      original_price_inr: 1399,
      badge: "Bestseller",
      astrology_elements: ["Fire", "Water"],
      ruling_planets: ["Mars", "Sun", "Moon"],
      compatible_rashis: ["Mesha", "Karka", "Simha", "Vrishchika", "Dhanu", "Meena"],
      compatible_sun_signs: ["Aries", "Cancer", "Leo", "Scorpio", "Sagittarius", "Pisces"],
      gemstone_crystal: "Red Coral (Moonga)",
      sacred_deity: "Lord Hanuman & Goddess Parvati",
      consecration_mantra: "108 Gayatri Mantra Energized",
      synergy_tags: ["protection", "prosperity", "sibling_grace"],
      occasions: ["rakhi", "protection", "birthday"],
    },
  },
  {
    title: "Wealth Attraction Vedic Rakhi",
    handle: "vedic-prosperity-wealth-attraction-rakhi",
    sku: "YN-RAKHI-002",
    price: 999,
    subtitle: "Sun & Jupiter graced — for abundance without obstacles",
    description:
      "Astrologically selected crystal, natural conch and oyster details on sacred red-yellow mauli — designed for prosperity and wealth attraction. Tied on the wrist, kept close to the heart.",
    collection: "Rakhi",
    metadata: {
      subtitle: "Sun & Jupiter graced — for abundance without obstacles",
      mrp_inr: 999,
      original_price_inr: 1299,
      badge: "New",
      astrology_elements: ["Fire", "Earth"],
      ruling_planets: ["Sun", "Jupiter", "Venus"],
      compatible_rashis: ["Simha", "Dhanu", "Meena", "Vrishabha", "Tula"],
      compatible_sun_signs: ["Leo", "Sagittarius", "Pisces", "Taurus", "Libra"],
      gemstone_crystal: "Yellow Citrine",
      sacred_deity: "Lord Vishnu & Goddess Lakshmi",
      consecration_mantra: "108 Gayatri Mantra Energized",
      synergy_tags: ["prosperity", "wealth", "sibling_grace"],
      occasions: ["rakhi", "diwali", "prosperity"],
    },
  },
  {
    title: "Abundance & Blessing Vedic Rakhi",
    handle: "vedic-abundance-blessing-rakhi",
    sku: "YN-RAKHI-003",
    price: 999,
    subtitle: "Jupiter's grace for a life of plenty",
    description:
      "Curated crystals and sacred Vedic elements woven on mauli, blessed for abundance and blessings that outlast the festival. Handcrafted, astrologically aligned.",
    collection: "Rakhi",
    metadata: {
      subtitle: "Jupiter's grace for a life of plenty",
      mrp_inr: 999,
      original_price_inr: 1299,
      badge: "New",
      astrology_elements: ["Fire", "Water"],
      ruling_planets: ["Jupiter", "Moon"],
      compatible_rashis: ["Dhanu", "Meena", "Karka"],
      compatible_sun_signs: ["Sagittarius", "Pisces", "Cancer"],
      gemstone_crystal: "Golden Topaz",
      sacred_deity: "Lord Brihaspati",
      consecration_mantra: "108 Gayatri Mantra Energized",
      synergy_tags: ["abundance", "blessings", "sibling_grace"],
      occasions: ["rakhi", "birthday", "prosperity"],
    },
  },
  {
    title: "Navagraha Om Protection Kaudi Rakhi",
    handle: "navagraha-om-protection-kaudi-rakhi",
    sku: "YN-RAKHI-004",
    price: 1099,
    subtitle: "Nine planets in harmony, one sacred thread",
    description:
      "Crystal accents, prosperity-kaudi shells, the Om motif and red-yellow mauli — inspired by the harmony of the Navagrahas for protection, balance and obstacle-free abundance.",
    collection: "Rakhi",
    metadata: {
      subtitle: "Nine planets in harmony, one sacred thread",
      mrp_inr: 1099,
      original_price_inr: 1399,
      badge: "Bestseller",
      astrology_elements: ["Fire", "Earth", "Air", "Water"],
      ruling_planets: ["Mars", "Sun", "Moon", "Jupiter", "Saturn", "Venus", "Mercury"],
      compatible_rashis: ["Mesha", "Karka", "Simha", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"],
      compatible_sun_signs: ["Aries", "Cancer", "Leo", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
      gemstone_crystal: "Multi-crystal Navagraha",
      sacred_deity: "Navagraha & Lord Shiva",
      consecration_mantra: "108 Gayatri Mantra & Navagraha Mantra Energized",
      synergy_tags: ["protection", "planetary_harmony", "sibling_grace"],
      occasions: ["rakhi", "protection", "new-beginnings"],
    },
  },
  {
    title: "Panchmukhi Rudraksha Moksha Bracelet",
    handle: "rudraksha-moksha-bracelet",
    sku: "YN-RUDR-005",
    price: 2499,
    subtitle: "Five-faced rudraksha for calm, clarity and Jupiter's wisdom",
    description:
      "Authentic 5-mukhi rudraksha beads, strung and consecrated over 108 chants of the Mahamrityunjaya. Worn for peace of mind, blood-pressure balance and Jupiter's blessings — suited to every rashi.",
    collection: "Rudraksha",
    metadata: {
      subtitle: "Five-faced rudraksha for calm, clarity and Jupiter's wisdom",
      mrp_inr: 2499,
      original_price_inr: 2999,
      badge: "Bestseller",
      astrology_elements: ["Ether", "Fire"],
      ruling_planets: ["Jupiter", "Saturn"],
      compatible_rashis: ["Dhanu", "Meena", "Makara", "Kumbha", "Simha"],
      compatible_sun_signs: ["Sagittarius", "Pisces", "Capricorn", "Aquarius", "Leo"],
      gemstone_crystal: "5-Mukhi Rudraksha",
      sacred_deity: "Lord Shiva",
      consecration_mantra: "108 Mahamrityunjaya Mantra Energized",
      synergy_tags: ["calm", "wisdom", "health", "protection"],
      occasions: ["birthday", "protection", "new-beginnings"],
    },
  },
  {
    title: "Sarpamani Navagraha Pendant",
    handle: "sarpamani-navagraha-pendant",
    sku: "YN-NAVG-006",
    price: 3999,
    subtitle: "Nine sacred manis to quiet every planetary affliction",
    description:
      "Nine planetary gemstones set in panchdhatu, aligned to your Navagraha. Consecrated for planetary harmony — recommended when Sade Sati, Rahu-Ketu periods or doshas weigh heavy.",
    collection: "Navagraha",
    metadata: {
      subtitle: "Nine sacred manis to quiet every planetary affliction",
      mrp_inr: 3999,
      original_price_inr: 4999,
      badge: "Premium",
      astrology_elements: ["Fire", "Earth", "Air", "Water"],
      ruling_planets: ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"],
      compatible_rashis: ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"],
      compatible_sun_signs: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
      gemstone_crystal: "Nine Planetary Manis",
      sacred_deity: "Navagraha Devatas",
      consecration_mantra: "Navagraha Mantra Energized (108 × 9)",
      synergy_tags: ["planetary_harmony", "protection", "remedy"],
      occasions: ["protection", "birthday", "new-beginnings"],
    },
  },
  {
    title: "Sphatik Shree Yantra Pendant",
    handle: "sphatik-shree-yantra-pendant",
    sku: "YN-SHRI-007",
    price: 2999,
    subtitle: "Crystal Shree Yantra — Lakshmi's geometry, worn close",
    description:
      "Clear quartz Shree Yantra pendant, precision-carved and consecrated with 108 Shree Suktam chants. For abundance, harmony at home and the gentle magnetism of Venus.",
    collection: "Yantra",
    metadata: {
      subtitle: "Crystal Shree Yantra — Lakshmi's geometry, worn close",
      mrp_inr: 2999,
      original_price_inr: 3499,
      badge: "Premium",
      astrology_elements: ["Earth", "Water"],
      ruling_planets: ["Venus", "Moon"],
      compatible_rashis: ["Vrishabha", "Tula", "Kanya", "Karka", "Makara"],
      compatible_sun_signs: ["Taurus", "Libra", "Virgo", "Cancer", "Capricorn"],
      gemstone_crystal: "Sphatik (Clear Quartz)",
      sacred_deity: "Goddess Lakshmi",
      consecration_mantra: "108 Shree Suktam Energized",
      synergy_tags: ["prosperity", "wealth", "harmony"],
      occasions: ["diwali", "wedding", "housewarming", "prosperity"],
    },
  },
  {
    title: "Moonstone Amavasya Bracelet",
    handle: "moonstone-amavasya-bracelet",
    sku: "YN-MOON-008",
    price: 2199,
    subtitle: "Moonstone for the Moon-ruled heart — peace for Cancer, Pisces, Scorpio",
    description:
      "Rainbow moonstone beads consecrated under the waxing moon with 108 Som Shanti chants. For emotional balance, restful sleep and gentler moods — a balm for water-sign hearts.",
    collection: "Crystals",
    metadata: {
      subtitle: "Moonstone for the Moon-ruled heart — peace for Cancer, Pisces, Scorpio",
      mrp_inr: 2199,
      original_price_inr: 2599,
      badge: "New",
      astrology_elements: ["Water"],
      ruling_planets: ["Moon"],
      compatible_rashis: ["Karka", "Meena", "Vrishchika", "Simha"],
      compatible_sun_signs: ["Cancer", "Pisces", "Scorpio", "Leo"],
      gemstone_crystal: "Rainbow Moonstone",
      sacred_deity: "Chandra Deva & Goddess Parvati",
      consecration_mantra: "108 Som Shanti Mantra Energized",
      synergy_tags: ["calm", "emotional_balance", "sleep"],
      occasions: ["birthday", "anniversary", "protection"],
    },
  },
  {
    title: "Red Coral Mangal Shanti Kada",
    handle: "red-coral-mangal-shanti-kada",
    sku: "YN-CORL-009",
    price: 3499,
    subtitle: "Moonga for Mars — courage for Aries, Scorpio and Leo",
    description:
      "Italian red coral kada in silver, consecrated with 108 Mangal Shanti chants. For courage, focus and victory over rivals — the warrior's stone for Mars-ruled souls.",
    collection: "Gemstones",
    metadata: {
      subtitle: "Moonga for Mars — courage for Aries, Scorpio and Leo",
      mrp_inr: 3499,
      original_price_inr: 3999,
      badge: "Premium",
      astrology_elements: ["Fire"],
      ruling_planets: ["Mars", "Sun"],
      compatible_rashis: ["Mesha", "Vrishchika", "Simha", "Dhanu"],
      compatible_sun_signs: ["Aries", "Scorpio", "Leo", "Sagittarius"],
      gemstone_crystal: "Red Coral (Moonga)",
      sacred_deity: "Lord Hanuman & Kartikeya",
      consecration_mantra: "108 Mangal Shanti Mantra Energized",
      synergy_tags: ["courage", "protection", "victory"],
      occasions: ["birthday", "protection", "new-beginnings"],
    },
  },
  {
    title: "Yellow Sapphire Guru Blessing Ring",
    handle: "yellow-sapphire-guru-blessing-ring",
    sku: "YN-PSH-010",
    price: 5499,
    subtitle: "Pukhraj for Jupiter — wisdom, marriage luck and wealth",
    description:
      "Ceylon yellow sapphire in panchdhatu, consecrated with 108 Guru chants. The counselor's stone — for Sagittarius and Pisces, and anyone seeking Jupiter's expansion in fortune and marriage.",
    collection: "Gemstones",
    metadata: {
      subtitle: "Pukhraj for Jupiter — wisdom, marriage luck and wealth",
      mrp_inr: 5499,
      original_price_inr: 6499,
      badge: "Premium",
      astrology_elements: ["Fire", "Water"],
      ruling_planets: ["Jupiter"],
      compatible_rashis: ["Dhanu", "Meena", "Karka", "Simha"],
      compatible_sun_signs: ["Sagittarius", "Pisces", "Cancer", "Leo"],
      gemstone_crystal: "Yellow Sapphire (Pukhraj)",
      sacred_deity: "Lord Brihaspati",
      consecration_mantra: "108 Guru Mantra Energized",
      synergy_tags: ["wisdom", "marriage", "wealth"],
      occasions: ["wedding", "anniversary", "prosperity"],
    },
  },
  {
    title: "Blue Sapphire Shani Raksha Pendant",
    handle: "blue-sapphire-shani-raksha-pendant",
    sku: "YN-BSH-011",
    price: 4999,
    subtitle: "Neelam for Saturn — discipline through Sade Sati",
    description:
      "Ceylon blue sapphire in panchdhatu, tested and consecrated with 108 Shani chants. For Capricorn and Aquarius — endurance, focus and Saturn's steady protection.",
    collection: "Gemstones",
    metadata: {
      subtitle: "Neelam for Saturn — discipline through Sade Sati",
      mrp_inr: 4999,
      original_price_inr: 5999,
      badge: "Premium",
      astrology_elements: ["Air", "Earth"],
      ruling_planets: ["Saturn"],
      compatible_rashis: ["Makara", "Kumbha", "Tula"],
      compatible_sun_signs: ["Capricorn", "Aquarius", "Libra"],
      gemstone_crystal: "Blue Sapphire (Neelam)",
      sacred_deity: "Shani Deva",
      consecration_mantra: "108 Shani Shanti Mantra Energized",
      synergy_tags: ["discipline", "protection", "remedy"],
      occasions: ["protection", "birthday"],
    },
  },
  {
    title: "Emerald Budha Vani Pendant",
    handle: "emerald-budha-vani-pendant",
    sku: "YN-EMRD-012",
    price: 4499,
    subtitle: "Panna for Mercury — eloquence for Gemini and Virgo",
    description:
      "Zambian emerald in panchdhatu, consecrated with 108 Budha chants. For speech, memory and commerce — Mercury's stone for writers, traders and students.",
    collection: "Gemstones",
    metadata: {
      subtitle: "Panna for Mercury — eloquence for Gemini and Virgo",
      mrp_inr: 4499,
      original_price_inr: 5299,
      badge: "Premium",
      astrology_elements: ["Earth", "Air"],
      ruling_planets: ["Mercury"],
      compatible_rashis: ["Mithuna", "Kanya", "Tula", "Vrishabha"],
      compatible_sun_signs: ["Gemini", "Virgo", "Libra", "Taurus"],
      gemstone_crystal: "Emerald (Panna)",
      sacred_deity: "Lord Budha & Goddess Saraswati",
      consecration_mantra: "108 Budha Mantra Energized",
      synergy_tags: ["speech", "memory", "commerce"],
      occasions: ["birthday", "new-beginnings"],
    },
  },
  {
    title: "Pearl Chandra Sukh Bracelet",
    handle: "pearl-chandra-sukh-bracelet",
    sku: "YN-PEAR-013",
    price: 2699,
    subtitle: "Moti for the Moon — mother's love, made wearable",
    description:
      "South sea pearl in silver, consecrated with 108 Chandra chants. For calm temper, stronger bonds with mother and lunar peace — Cancer's signature gift.",
    collection: "Gemstones",
    metadata: {
      subtitle: "Moti for the Moon — mother's love, made wearable",
      mrp_inr: 2699,
      original_price_inr: 3199,
      badge: "New",
      astrology_elements: ["Water"],
      ruling_planets: ["Moon"],
      compatible_rashis: ["Karka", "Vrishchika", "Meena", "Simha"],
      compatible_sun_signs: ["Cancer", "Scorpio", "Pisces", "Leo"],
      gemstone_crystal: "South Sea Pearl (Moti)",
      sacred_deity: "Chandra Deva",
      consecration_mantra: "108 Chandra Mantra Energized",
      synergy_tags: ["calm", "maternal_bond", "emotional_balance"],
      occasions: ["birthday", "anniversary", "thank-you"],
    },
  },
  {
    title: "Hanuman Gada Protection Locket",
    handle: "hanuman-gada-protection-locket",
    sku: "YN-HANM-014",
    price: 1899,
    subtitle: "The gada that guards — for every Tuesday-born warrior",
    description:
      "Silver Hanuman gada locket, energized with 108 Hanuman Chalisa recitations at a living temple sankalpa. For courage on hard days and protection on the road.",
    collection: "Deity",
    metadata: {
      subtitle: "The gada that guards — for every Tuesday-born warrior",
      mrp_inr: 1899,
      original_price_inr: 2299,
      badge: "Bestseller",
      astrology_elements: ["Fire"],
      ruling_planets: ["Mars", "Saturn"],
      compatible_rashis: ["Mesha", "Vrishchika", "Simha", "Makara", "Kumbha", "Dhanu"],
      compatible_sun_signs: ["Aries", "Scorpio", "Leo", "Capricorn", "Aquarius", "Sagittarius"],
      gemstone_crystal: "Silver Gada",
      sacred_deity: "Lord Hanuman",
      consecration_mantra: "108 Hanuman Chalisa Energized",
      synergy_tags: ["protection", "courage", "devotion"],
      occasions: ["protection", "birthday", "new-beginnings"],
    },
  },
]

const BLOG_POSTS = [
  {
    title: "Why Your Moon Sign Chooses the Gift, Not Your Sun Sign",
    slug: "moon-sign-chooses-the-gift",
    excerpt:
      "In Vedic tradition, the mind is the moon. When you gift by rashi — the moon's constellation at birth — you answer the heart, not the mask.",
    content: `In Vedic tradition, the mind is the moon. When you gift by rashi — the moon's constellation at birth — you answer the heart, not the mask.

Western astrology reads the sun: the self we show. Jyotisha reads the moon: the self we feel with. A Leo sun with a Meena (Pisces) moon doesn't need bold gold; it needs soft moonstone, quiet water, permission to rest.

That is why every Younoya reading begins with your birth moon. From the exact moment and place of birth, we place the moon within its nakshatra — one of 27 lunar mansions, each with its own deity, desire and stone. The nakshatra tells us what soothes you; the rashi's lord tells us which planet to propitiate; the element tells us the texture of the remedy.

Fire moons (Mesha, Simha, Dhanu) carry red coral and Hanuman's gada — courage worn on the wrist. Earth moons (Vrishabha, Kanya, Makara) answer to emerald and sphatik — grounding you can hold. Air moons (Mithuna, Tula, Kumbha) breathe with rudraksha and neelam — clarity that doesn't scatter. Water moons (Karka, Vrishchika, Meena) soften with pearl and moonstone — feeling, honoured instead of fought.

When you gift by moon sign, you are not guessing. You are answering a prayer the person hasn't spoken yet.`,
    published: true,
  },
  {
    title: "The Five Faces of Rudraksha: A Buyer's Guide",
    slug: "five-faces-of-rudraksha-guide",
    excerpt:
      "From 1-mukhi to 21-mukhi, every rudraksha carries a different current. Here is how to choose the one that matches your chart — and your intention.",
    content: `From 1-mukhi to 21-mukhi, every rudraksha carries a different current. Here is how to choose the one that matches your chart — and your intention.

The 5-mukhi is the everyday companion: Jupiter's bead, cooling to all rashis, safe for children and elders alike. If you are gifting without a birth chart, gift this one.

The 3-mukhi burns with Agni — for Mars-ruled souls stuck in anger or inertia. The 7-mukhi hums with Shani's discipline for those carrying debt, delay or Sade Sati. The Gauri Shankar — two beads joined — is gifted at weddings for union that softens both partners.

Whatever the mukhi, insist on three things: a natural thorn-texture under the thumb, a density that sinks in water, and a consecration you can name — the mantra, the count, the day. A rudraksha without prana-pratishtha is only a seed.

Every Younoya rudraksha is energized at a living sankalpa with your name spoken into the mantra. That is what turns a bead into a blessing.`,
    published: true,
  },
  {
    title: "What Actually Happens at a Consecration (Sankalpa)",
    slug: "what-happens-at-consecration-sankalpa",
    excerpt:
      "108 chants, your name, a living flame. Inside the temple ritual that turns a keepsake into a consecrated gift.",
    content: `108 chants, your name, a living flame. Inside the temple ritual that turns a keepsake into a consecrated gift.

Sankalpa means intention, declared aloud. Before a single chant begins, the priest speaks your name, your gotra and the purpose of the ritual into the space — the universe, it is said, files paperwork too.

Then the mantras begin. 108 is not decoration: one for each bead of a mala, each repetition sealing the item a little tighter to its purpose. For a Mars remedy it is Mangal Shanti; for Lakshmi's abundance, Shree Suktam; for general grace, the Gayatri.

Finally the item is passed over a ghee flame and showered with flower petals from the morning aarti. What reaches your door is no longer manufactured. It is remembered — by fire, by water, by sound.

This is why we ask for the recipient's name and birth details at checkout. The sankalpa needs a subject. The blessing needs an address.`,
    published: true,
  },
]

export default async function seedCatalog({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(ModuleRegistrationName.FULFILLMENT)

  logger.info("Seeding YOUNOYA catalog...")

  // sales channel + publishable key
  let channels = await container
    .resolve(ModuleRegistrationName.SALES_CHANNEL)
    .listSalesChannels({ name: "Default Sales Channel" })
  let defaultSalesChannel = channels?.[0]
  if (!defaultSalesChannel) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [{ name: "Default Sales Channel", description: "Younoya storefront" }],
      },
    })
    defaultSalesChannel = result[0]
  }

  const apiKeyService = container.resolve(ModuleRegistrationName.API_KEY)
  const existingKeys = await apiKeyService.listApiKeys({ type: "publishable" })
  let publishableApiKey = existingKeys?.[0]
  if (!publishableApiKey) {
    const { result } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          { title: "Younoya Storefront", type: "publishable", created_by: "" },
        ],
      },
    })
    publishableApiKey = result[0]
  }
  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: publishableApiKey.id, add: [defaultSalesChannel.id] },
  })
  logger.info(`Publishable key: ${publishableApiKey.token}`)

  // store (INR default)
  const storeService = container.resolve(ModuleRegistrationName.STORE)
  let stores = await storeService.listStores()
  if (!stores?.length) {
    await createStoresWorkflow(container).run({
      input: {
        stores: [
          {
            name: "Younoya",
            supported_currencies: [{ currency_code: "inr", is_default: true }],
            default_sales_channel_id: defaultSalesChannel.id,
          },
        ],
      },
    })
  } else {
    const store = stores[0]
    const hasInr = (store.supported_currencies || []).some(
      (c: any) => c.currency_code === "inr"
    )
    if (!hasInr) {
      await storeService.updateStores(store.id, {
        supported_currencies: [
          ...(store.supported_currencies || []).map((c: any) => ({
            currency_code: c.currency_code,
            is_default: false,
          })),
          { currency_code: "inr", is_default: true },
        ],
      })
    }
  }

  // region India (INR) with system payment
  const regionService = container.resolve(ModuleRegistrationName.REGION)
  let regions = await regionService.listRegions({ name: "India" })
  let indiaRegion = regions?.[0]
  if (!indiaRegion) {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "India",
            currency_code: "inr",
            countries: ["in"],
            payment_providers: process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
              ? ["pp_razorpay_razorpay"] : ["pp_system_default"],
          },
        ],
      },
    })
    indiaRegion = result[0]
  }
  try {
    await createTaxRegionsWorkflow(container).run({
      input: [{ country_code: "in", provider_id: "tp_system" }],
    })
  } catch (e: any) {
    logger.info(`Tax region IN exists, skipping (${e?.message?.slice(0, 60)})`)
  }

  // fulfillment: stock location + India service zone + shipping options
  const { data: existingLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })
  let stockLocation: any = existingLocations?.find((l: any) => l.name === "Younoya Atelier")
  if (!stockLocation) {
    const { result: stockLocationResult } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "Younoya Atelier",
            address: { city: "Jaipur", country_code: "IN", address_1: "" },
          },
        ],
      },
    })
    stockLocation = stockLocationResult[0]
  }

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
  })

  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfileResult[0]

  const { data: existingFulfillmentSets } = await query.graph({
    entity: "fulfillment_set",
    fields: ["id", "name"],
  })
  let fulfillmentSet: any = existingFulfillmentSets?.find((f: any) => f.name === "India shipping")
  if (!fulfillmentSet) {
    fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "India shipping",
      type: "shipping",
      service_zones: [
        { name: "India", geo_zones: [{ country_code: "in", type: "country" }] },
      ],
    })
  }

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
  }).catch(() => void 0)

  const { data: existingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name"],
  })
  if (!existingOptions?.find((o: any) => o.name === "Standard Shipping")) {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: { label: "Standard", description: "Delivered in 4-6 days.", code: "standard" },
          prices: [{ region_id: indiaRegion.id, amount: 0 }],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    })
  }

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: stockLocation.id, add: [defaultSalesChannel.id] },
  })

  // categories + collections (create only missing ones)
  const productServicePre = container.resolve(ModuleRegistrationName.PRODUCT) as any
  const existingCats = await productServicePre.listProductCategories(
    {},
    { take: 100, select: ["id", "name"] }
  )
  const wantedCats = [
    "Rakhi", "Rudraksha", "Gemstones", "Crystals", "Yantra", "Deity", "Navagraha",
  ]
  const missingCats = wantedCats.filter((n) => !existingCats.find((c: any) => c.name === n))
  let categoryResult: any[] = existingCats
  if (missingCats.length) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCats.map((n) => ({ name: n, is_active: true })),
      },
    })
    categoryResult = [...existingCats, ...result]
  }

  try {
    await createCollectionsWorkflow(container).run({
      input: {
        collections: [{ title: "Consecrated Gifts" }, { title: "Festival Edit" }],
      },
    })
  } catch (e: any) {
    logger.info(`Collections exist, skipping (${e?.message?.slice(0, 50)})`)
  }

  // products
  const productService = container.resolve(ModuleRegistrationName.PRODUCT) as any
  for (const p of CATALOG) {
    const existing = await productService.listProducts({ handle: p.handle })
    if (existing && existing.length > 0) {
      // refresh products whose variants were created without prices
      const hasPrice = !!existing[0].variants?.[0]?.prices?.length
      if (hasPrice) {
        logger.info(`Product exists: ${p.handle}`)
        continue
      }
      await productService.deleteProducts([existing[0].id])
      logger.info(`Removed unpriced product: ${p.handle}`)
    }

    await createProductsWorkflow(container).run({
      input: {
        products: [
          {
            title: p.title,
            handle: p.handle,
            subtitle: p.subtitle,
            description: p.description,
            status: ProductStatus.PUBLISHED,
            discountable: true,
            metadata: p.metadata,
            thumbnail: `${STOREFRONT_URL}/products/${p.handle}.webp`,
            images: [{ url: `${STOREFRONT_URL}/products/${p.handle}.webp` }],
            options: [{ title: "Size", values: ["Standard"] }],
            variants: [
              {
                title: "Standard",
                sku: p.sku,
                manage_inventory: false,
                options: { Size: "Standard" },
                prices: [
                  {
                    amount: p.price * 100,
                    currency_code: "inr",
                    ...(indiaRegion ? { region_id: indiaRegion.id } : {}),
                  },
                ],
              },
            ],
            category_ids: [
              categoryResult.find((c: any) => c.name === p.collection)?.id,
            ].filter(Boolean),
            sales_channels: [{ id: defaultSalesChannel.id }],
          },
        ],
      },
    })
    logger.info(`Seeded product: ${p.handle}`)
  }

  // inventory levels (unmanaged but present)
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })
  if (inventoryItems.length) {
    try {
      await createInventoryLevelsWorkflow(container).run({
        input: {
          inventory_levels: inventoryItems.map((item: any) => ({
            location_id: stockLocation.id,
            stocked_quantity: 100,
            inventory_item_id: item.id,
          })),
        },
      })
    } catch (e: any) {
      logger.info(`Inventory levels exist, skipping (${e?.message?.slice(0, 50)})`)
    }
  }

  // blog posts
  const blogService = container.resolve("younoyaBlog") as any
  for (const post of BLOG_POSTS) {
    const existing = await blogService.listBlogPosts({ slug: post.slug })
    if (existing?.length) continue
    await blogService.createBlogPosts({
      ...post,
      cover_image: null,
      author: "Younoya",
      published_at: new Date(),
    })
    logger.info(`Seeded blog post: ${post.slug}`)
  }

  logger.info("YOUNOYA catalog seed complete.")
}
