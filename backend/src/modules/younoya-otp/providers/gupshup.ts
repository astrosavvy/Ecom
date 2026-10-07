import { OtpError, type OtpContact } from "../types"

async function sendForm(url: string, form: URLSearchParams, headers: Record<string, string> = {}) {
  try {
    const response = await fetch(url, { method: "POST", headers: {
      "content-type": "application/x-www-form-urlencoded", ...headers }, body: form,
      signal: AbortSignal.timeout(8000), redirect: "error" })
    const body = await response.text()
    if (!response.ok) throw new Error("Provider rejected the request")
    return body
  } catch {
    // Never include provider payloads, credentials or contact details in public errors/logs.
    throw new OtpError("Could not request a code. Please try again after a minute.", 503, 60)
  }
}

export async function sendGupshup(contact: OtpContact, otp: string): Promise<string> {
  const destination = contact.identifier.slice(1)
  if (contact.channel === "whatsapp") {
    const form = new URLSearchParams({ channel: "whatsapp", source: process.env.GUPSHUP_WA_SOURCE!,
      destination, "src.name": process.env.GUPSHUP_WA_APP_NAME!, template: JSON.stringify({
        id: process.env.GUPSHUP_WA_TEMPLATE_ID!, params: [otp, otp] }) })
    const raw = await sendForm("https://api.gupshup.io/wa/api/v1/template/msg", form,
      { apikey: process.env.GUPSHUP_WA_API_KEY! })
    try {
      const data = JSON.parse(raw)
      if (data.status === "success" && typeof data.messageId === "string" && data.messageId) return data.messageId
    } catch { /* A malformed success must not activate a code. */ }
  } else {
    const form = new URLSearchParams({ userid: process.env.GUPSHUP_SMS_USER_ID!,
      password: process.env.GUPSHUP_SMS_PASSWORD!, send_to: destination, method: "sendMessage",
      auth_scheme: "PLAIN", v: "1.1", format: "TEXT", msg_type: "TEXT",
      mask: process.env.GUPSHUP_SMS_SENDER!, principalEntityId: process.env.GUPSHUP_SMS_ENTITY_ID!,
      dltTemplateId: process.env.GUPSHUP_SMS_TEMPLATE_ID!,
      msg: process.env.GUPSHUP_SMS_TEMPLATE_TEXT!.replaceAll("{{otp}}", otp) })
    const raw = await sendForm("https://enterprise.smsgupshup.com/GatewayAPI/rest", form)
    const fields = raw.trim().split("|").map(part => part.trim())
    if (fields.length === 3 && fields[0].toLowerCase() === "success" && fields[1] === destination && fields[2]) return fields[2]
  }
  throw new OtpError("Could not request a code. Please try again after a minute.", 503, 60)
}
