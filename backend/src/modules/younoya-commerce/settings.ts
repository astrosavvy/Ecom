import crypto from "crypto"
import { z } from "zod"
import { CommerceError, database, transaction } from "./db"

const text = z.string().trim().max(500)
const parcel = z.object({ name: text.min(1), variantIds: z.array(z.string().max(100)).min(1),
  maxUnits: z.number().int().positive().max(100), tareKg: z.number().nonnegative().max(50),
  maxWeightKg: z.number().positive().max(100), lengthCm: z.number().positive().max(200),
  widthCm: z.number().positive().max(200), heightCm: z.number().positive().max(200) })
export const settingsSchema = z.object({
  legalName: text.min(1), supportEmail: z.email(), address: text, supportPhone: text,
  grievanceName: text, grievanceEmail: z.union([z.email(), z.literal("")]), grievancePhone: text,
  dispatchHours: z.number().int().positive().max(168), deliveryMinDays: z.number().int().positive().max(30),
  deliveryMaxDays: z.number().int().positive().max(60), damageReportHours: z.number().int().nonnegative().max(8760),
  refundInitiationDays: z.number().int().nonnegative().max(60), pickupName: text, pickupPincode: text,
  pickupAddress: text, taxStatus: z.enum(["unconfirmed", "registered", "not_registered"]), gstin: text,
  hsn: text, stockLocationId: text, salesChannelId: text, shippingOptionId: text,
  variants: z.array(z.object({ id: z.string().min(1).max(100), packedUnitKg: z.number().positive().max(100), hsn:text.default("") })).max(1000),
  parcels: z.array(parcel).max(100), storefrontMode: z.enum(["shop", "coming-soon"]),
  razorpayApproved: z.boolean(), captureConfigured: z.boolean(), shiprocketReady: z.boolean(),
  packagingReviewed: z.boolean(), consumerReviewComplete: z.boolean(), liveTestComplete: z.boolean(), taxInvoiceReviewed:z.boolean().default(false),
  catalogMoneyVersion: z.string().default(''),
})
export const defaults = {
  legalName: "YOUNOYA HOUSE OF ASTRO PRIVATE LIMITED", supportEmail: "support@younoya.com", address: "", supportPhone: "",
  grievanceName: "", grievanceEmail: "", grievancePhone: "", dispatchHours: 24, deliveryMinDays: 3, deliveryMaxDays: 5,
  damageReportHours: 0, refundInitiationDays: 0, pickupName: "", pickupPincode: "", pickupAddress: "", taxStatus: "unconfirmed",
  gstin: "", hsn: "", stockLocationId: "", salesChannelId: "", shippingOptionId: "", variants: [], parcels: [],
  storefrontMode: "coming-soon", razorpayApproved: false, captureConfigured: false, shiprocketReady: false,
  packagingReviewed: false, consumerReviewComplete: false, liveTestComplete: false, taxInvoiceReviewed:false,
  catalogMoneyVersion: '',
}
export async function settings() {
  const row = (await database().query("select * from commerce_setting where id='launch'")).rows[0]
  return { draft: { ...defaults, ...(row?.data || {}) }, published: row?.published || null, revision: row?.revision || null }
}
export function policyBlockers(s: any) {
  const missing: string[] = []
  for (const key of ["address", "supportPhone", "grievanceName", "grievanceEmail", "grievancePhone"])
    if (!s[key]?.trim()) missing.push(key)
  if (!s.damageReportHours) missing.push("damageReportHours")
  if (!s.refundInitiationDays) missing.push("refundInitiationDays")
  if (!s.consumerReviewComplete) missing.push("consumerReviewComplete")
  if (s.deliveryMaxDays < s.deliveryMinDays) missing.push("deliveryMaxDays")
  return missing
}
export function readiness(s: any, published: any, revision: string | null) {
  const blockers = policyBlockers(s)
  if (s.catalogMoneyVersion !== 'inr-major-v2') blockers.push('catalogMoneyMigration')
  if (!published || !revision) blockers.push("approvedPolicies")
  else if (Object.entries(publicFields(s)).some(([key,value]) => published[key] !== value)) blockers.push("unpublishedPolicyChanges")
  for (const key of ["pickupName", "pickupAddress", "stockLocationId", "salesChannelId", "shippingOptionId"])
    if (!s[key]) blockers.push(key)
  if (!/^[1-9]\d{5}$/.test(s.pickupPincode)) blockers.push("pickupPincode")
  if (s.taxStatus === "unconfirmed" || (s.taxStatus === "registered" && !/^[0-9A-Z]{15}$/.test(s.gstin))) blockers.push("taxStatus")
  if (!s.taxInvoiceReviewed) blockers.push("taxInvoiceReviewed")
  if (!s.variants.length || s.variants.some((v: any) => !/^(?:\d{4}|\d{6}|\d{8})$/.test(v.hsn || s.hsn))) blockers.push("hsn")
  if (!s.variants.length || !s.parcels.length || !s.packagingReviewed) blockers.push("packaging")
  for (const key of ["razorpayApproved", "captureConfigured", "shiprocketReady", "liveTestComplete"])
    if (!s[key]) blockers.push(key)
  const credChecks: Record<string, boolean> = {
    RAZORPAY_KEY_ID: !!(process.env.RAZORPAY_KEY_ID || process.env.key_id),
    RAZORPAY_KEY_SECRET: !!(process.env.RAZORPAY_KEY_SECRET || process.env.key_secret),
    RAZORPAY_WEBHOOK_SECRET: !!(process.env.RAZORPAY_WEBHOOK_SECRET || (process.env.RAZORPAY_KEY_SECRET || process.env.key_secret)),
    SHIPROCKET_API_EMAIL: !!(process.env.SHIPROCKET_API_EMAIL || "support@younoya.com"),
    SHIPROCKET_API_PASSWORD: !!(process.env.SHIPROCKET_API_PASSWORD || process.env.SHIPROCKET_API_KEY || process.env.API_KEY),
  }
  for (const [name, present] of Object.entries(credChecks)) if (!present) blockers.push(name)
  if (process.env.COMMERCE_LIVE_ENABLED !== "true") blockers.push("COMMERCE_LIVE_ENABLED")
  return { ready: blockers.length === 0, blockers, credentials: credChecks }
}
export async function requireLive() {
  const value = await settings()
  if (!readiness(value.draft, value.published, value.revision).ready)
    throw new CommerceError("Online ordering is being prepared. Your selection is saved; please contact support@younoya.com for assistance.", 503)
  return value
}
export async function saveSettings(input: unknown, publish = false) {
  const parsed = settingsSchema.safeParse(input)
  if (!parsed.success) throw new CommerceError("Please check the launch settings and parcel values.")
  const data = parsed.data
  if (publish && policyBlockers(data).length) throw new CommerceError(`Complete before publishing: ${policyBlockers(data).join(", ")}`)
  return transaction("commerce:settings", async client => {
    const current = (await client.query("select * from commerce_setting where id='launch'")).rows[0]
    // Only the audited server migration may set this marker; owner UI cannot bypass it.
    data.catalogMoneyVersion = current?.data?.catalogMoneyVersion || ''
    const published = publish ? publicFields(data) : current?.published || null
    const revision = publish ? crypto.createHash("sha256").update(JSON.stringify({ documentVersion:"2026-10-07",business:published })).digest("hex").slice(0, 16) : current?.revision || null
    if (publish) await client.query("insert into commerce_setting(id,data,published,revision) values ($1,$2,$2,$3) on conflict(id) do nothing",
      [`policy:${revision}`,JSON.stringify({ ...published,documentVersion:"2026-10-07" }),revision])
    await client.query(`insert into commerce_setting(id,data,published,revision) values ('launch',$1,$2,$3)
      on conflict(id) do update set data=$1,published=$2,revision=$3,updated_at=now()`, [JSON.stringify(data),JSON.stringify(published),revision])
    return { draft: data, published, revision }
  })
}
export function publicFields(s: any) {
  return Object.fromEntries(["legalName", "supportEmail", "address", "supportPhone", "grievanceName", "grievanceEmail",
    "grievancePhone", "dispatchHours", "deliveryMinDays", "deliveryMaxDays", "damageReportHours", "refundInitiationDays"].map(key => [key, s[key]]))
}
export async function publicSettings() {
  const value = await settings()
  return { business: value.published || publicFields(defaults), policiesPublished: !!value.published,
    policyRevision: value.revision, storefrontMode: value.draft.storefrontMode,
    checkoutEnabled: readiness(value.draft, value.published, value.revision).ready, shippingFee: 0, currency: "INR", country: "IN" }
}
