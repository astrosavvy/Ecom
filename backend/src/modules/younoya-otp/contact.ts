import { channelEnabled } from "./config"
import { OtpError, type OtpContact, type OtpInput } from "./types"

export function normalizePhone(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length > 30 || !/^[+\d\s()-]+$/.test(raw)) return null
  const clean = raw.replace(/[\s()-]/g, "")
  const local = clean.replace(/^(?:\+91|91)(?=[6-9]\d{9}$)/, "")
  return /^[6-9]\d{9}$/.test(local) ? `+91${local}` : null
}

export function resolveContact(input: OtpInput, requireEnabled = true): OtpContact {
  if (!input || typeof input !== "object" || (input.phone && input.email)) {
    throw new OtpError("Choose one phone number or email address.", 400)
  }
  let contact: OtpContact
  if (input.phone) {
    const identifier = normalizePhone(input.phone)
    if (!identifier) throw new OtpError("Enter a valid 10-digit Indian mobile number.", 400)
    const channel = input.channel || "whatsapp"
    if (channel !== "whatsapp" && channel !== "sms") throw new OtpError("Choose WhatsApp or SMS.", 400)
    contact = { identifier, identifierType: "mobile", channel }
  } else {
    const identifier = typeof input.email === "string" ? input.email.trim().toLowerCase() : ""
    if (identifier.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      throw new OtpError("Enter a valid email address.", 400)
    }
    if (input.channel && input.channel !== "email") throw new OtpError("Choose email for this address.", 400)
    contact = { identifier, identifierType: "email", channel: "email" }
  }
  if (requireEnabled && !channelEnabled(contact.channel)) {
    throw new OtpError("This verification method is currently unavailable. Please choose another method.")
  }
  return contact
}
