import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

const YOUNOYA_PRODUCTS = [
  {
    title: "Vedic Prosperity Rakhi",
    handle: "vedic-prosperity-rakhi",
    sku: "YN-RAKHI-001",
    price: 1099,
    description: `अब ग्रहों से डरने की ज़रूरत नहीं 
vedic rakhi करेगी भाई बहन की रक्षा 

No more fearing planetary influences.
Let this handcrafted Vedic Rakhi become a symbol of protection and blessings for every brother and sister.

Celebrate Raksha Bandhan with a handcrafted Vedic Rakhi where every element has been chosen with intention. Inspired by timeless traditions, it transforms a simple thread into a meaningful keepsake that celebrates blessings, love and the sacred bond between siblings.

Designed to be treasured beyond the festival, this Rakhi becomes a lasting reminder of your wishes for prosperity, harmony and lifelong happiness.

Not just tied on the wrist—kept close to the heart.

Features: Handcrafted | Vedic-Inspired Design | Sacred Symbolism | Reusable Keepsake | Thoughtfully Curated`,
  },
  {
    title: "Vedic Prosperity & Wealth Attraction Rakhi",
    handle: "vedic-prosperity-wealth-attraction-rakhi",
    sku: "YN-RAKHI-002",
    price: 999,
    description: `Celebrate Raksha Bandhan with a handcrafted Vedic Rakhi where every element has been chosen with intention. ✨

Featuring an astrologically selected crystal, oyster shells, sacred red-yellow mauli and thoughtfully curated Vedic elements, for PROSPERITY AND WEALTH ATTRACTION this Rakhi is designed to honour tradition while becoming a keepsake your brother can treasure long after the festival.

Not just tied on the wrist—kept close to the heart. 🤍

Features: Handcrafted | Astrologically Curated | Natural Conch & Oyster Details | Sacred Mauli Thread | Reusable Keepsake`,
  },
  {
    title: "Vedic Abundance & Blessing Rakhi",
    handle: "vedic-abundance-blessing-rakhi",
    sku: "YN-RAKHI-003",
    price: 999,
    description: `Celebrate Raksha Bandhan with a handcrafted Vedic Rakhi where every element has been chosen with intention. ✨

Featuring an astrologically selected crystal, oyster shells, sacred red-yellow mauli and thoughtfully curated Vedic elements, for PROSPERITY AND WEALTH ATTRACTION this Rakhi is designed to honour tradition while becoming a keepsake your brother can treasure long after the festival.

Not just tied on the wrist—kept close to the heart. 🤍

Features: Handcrafted | Astrologically Curated | Natural Conch & Oyster Details | Sacred Mauli Thread | Reusable Keepsake`,
  },
  {
    title: "Navagraha Om Protection Kaudi Rakhi",
    handle: "navagraha-om-protection-kaudi-rakhi",
    sku: "YN-RAKHI-004",
    price: 1099,
    description: `Some blessings are meant to be worn, so their protection stays with you long after the festival is over. ✨

Featuring astrologically selected crystal accents, sacred kaudis symbolising prosperity and Goddess Lakshmi’s blessings, an Om motif representing divine protection, the timeless red-yellow mauli thread, and Vedic elements inspired by the harmony of the Navagrahas. Thoughtfully handcrafted to encourage protection, balance and obstacle-free abundance.

A sacred keepsake that celebrates tradition, love and lasting memories.

Features: Handcrafted | Astrologically Curated Crystals | Navagraha-Inspired Symbolism | Sacred Kaudi Detailing | Om Motif | Red & Yellow Mauli Thread | Evil Eye Protection | Reusable Keepsake | Thoughtfully Curated`,
  },
]

export default async function seedProducts({ container }: ExecArgs) {
  const productService = container.resolve(Modules.PRODUCT) as any
  const regionService = container.resolve(Modules.REGION) as any

  console.log("🌱 Seeding 4 YOUNOYA Vedic Rakhis...")

  try {
    const regions = await regionService.listRegions({ name: "India" })
    const indiaRegion = regions?.[0]

    for (const prodData of YOUNOYA_PRODUCTS) {
      const existing = await productService.listProducts({ handle: prodData.handle })
      if (existing && existing.length > 0) {
        console.log(`ℹ️ Product [${prodData.sku}] ${prodData.title} already exists.`)
        continue
      }

      await productService.createProducts({
        title: prodData.title,
        handle: prodData.handle,
        description: prodData.description,
        status: "published",
        options: [
          {
            title: "Type",
            values: ["Standard"],
          },
        ],
        variants: [
          {
            title: "Standard",
            sku: prodData.sku,
            prices: indiaRegion
              ? [
                  {
                    amount: prodData.price,
                    currency_code: "inr",
                    region_id: indiaRegion.id,
                  },
                ]
              : [
                  {
                    amount: prodData.price,
                    currency_code: "inr",
                  },
                ],
          },
        ],
      })
      console.log(`✅ Product seeded: [${prodData.sku}] ${prodData.title} - ₹${prodData.price}`)
    }
  } catch (e: any) {
    console.error("Error seeding products:", e.message)
  }

  console.log("🎉 Product seed completed!")
}
