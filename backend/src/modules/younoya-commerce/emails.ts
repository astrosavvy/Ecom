import nodemailer from "nodemailer"
import { enqueue, CommerceError, orderPaise, rupees } from "./db"
import { readOrder } from "./orders"
import { settings, defaults } from "./settings"

export function renderOrderEmailHtml(order: any, business: any) {
  const displayId = order.display_id ? `#${order.display_id}` : `#${order.id.slice(-8).toUpperCase()}`
  const totalAmount = `₹${rupees(orderPaise(order.total, order)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const addr = order.shipping_address || {}
  const recipientName = `${addr.first_name || ''} ${addr.last_name || ''}`.trim() || 'Valued Patron'
  const fullAddress = [
    addr.address_1,
    addr.address_2,
    [addr.city, addr.province].filter(Boolean).join(', '),
    addr.postal_code,
    'India'
  ].filter(Boolean).join('<br/>')

  const itemsHtml = (order.items || []).map((item: any) => {
    const itemTotal = `₹${rupees(orderPaise(item.total, order)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    return `
      <tr>
        <td style="padding: 14px 0; border-bottom: 1px solid #ECE3D6; vertical-align: top;">
          <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 15px; font-weight: 600; color: #1E1C1A; line-height: 1.4;">
            ${item.title}
          </div>
          <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 13px; color: #8A7B70; margin-top: 4px;">
            Quantity: ${item.quantity}
          </div>
        </td>
        <td style="padding: 14px 0; border-bottom: 1px solid #ECE3D6; text-align: right; vertical-align: top; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 15px; font-weight: 600; color: #1E1C1A;">
          ${itemTotal}
        </td>
      </tr>
    `
  }).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed · YOUNOYA</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E1C1A; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FAF7F2; padding: 36px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid rgba(44, 34, 28, 0.08); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(44, 34, 28, 0.04);" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="background-color: #1A0A17; padding: 32px 28px 26px; text-align: center;">
              <div style="font-family: Georgia, 'Cormorant Garamond', serif; font-size: 26px; letter-spacing: 0.18em; color: #FAF6EE; font-weight: 600; text-transform: uppercase;">
                YOUNOYA
              </div>
              <div style="font-size: 11px; letter-spacing: 0.22em; color: #D6B06A; margin-top: 6px; text-transform: uppercase; font-weight: 500;">
                For Every Chapter · Atelier Gifting
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 32px 18px; text-align: center;">
              <div style="display: inline-block; background-color: #F8F5EE; border: 1px solid #E5D5C0; border-radius: 999px; padding: 5px 16px; font-size: 12px; letter-spacing: 0.12em; font-weight: 600; color: #935632; text-transform: uppercase; margin-bottom: 14px;">
                ✦ &nbsp; Order Confirmed &nbsp; ✦
              </div>
              <h1 style="font-family: Georgia, 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; color: #1E1C1A; margin: 0 0 8px; line-height: 1.25;">
                Congratulations, ${recipientName}
              </h1>
              <p style="font-size: 15px; color: #695E57; line-height: 1.6; margin: 0 auto; max-width: 480px;">
                Thank you for your order. We have securely received your payment and our atelier is preparing your pieces with intention.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 20px;">
              <table role="presentation" width="100%" style="background-color: #FAF8F5; border: 1px solid #EFEAE3; border-radius: 8px; padding: 16px 18px;" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="vertical-align: top;">
                    <div style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #8A7B70; font-weight: 600;">Order Reference</div>
                    <div style="font-size: 16px; font-weight: 700; color: #1E1C1A; margin-top: 4px; font-family: monospace;">${displayId}</div>
                  </td>
                  <td style="vertical-align: top; text-align: right;">
                    <div style="display: inline-block; background-color: #EBF5EE; border: 1px solid #C4E3CC; color: #2B6E3F; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 6px;">
                      ✓ Payment Verified
                    </div>
                    <div style="font-size: 17px; font-weight: 700; color: #1E1C1A; margin-top: 4px;">${totalAmount}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 18px;">
              <div style="font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #8A7B70; font-weight: 700; margin-bottom: 10px; border-bottom: 1px solid #ECE3D6; padding-bottom: 8px;">
                Curated Selection
              </div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${itemsHtml}
                <tr>
                  <td style="padding: 10px 0 4px; font-size: 14px; color: #695E57;">Subtotal</td>
                  <td style="padding: 10px 0 4px; text-align: right; font-size: 14px; color: #1E1C1A; font-weight: 600;">${totalAmount}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #695E57;">Express India Shipping</td>
                  <td style="padding: 4px 0; text-align: right; font-size: 14px; color: #2B6E3F; font-weight: 600;">Free</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 15px; font-weight: 700; color: #1E1C1A; border-top: 1px solid #ECE3D6;">Total Paid</td>
                  <td style="padding: 10px 0; text-align: right; font-size: 17px; font-weight: 700; color: #935632; border-top: 1px solid #ECE3D6;">${totalAmount}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 24px;">
              <table role="presentation" width="100%" style="background-color: #FAF8F5; border-radius: 8px; border: 1px solid #EFEAE3; padding: 16px 18px;" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <div style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #8A7B70; font-weight: 700; margin-bottom: 6px;">
                      Delivery Destination
                    </div>
                    <div style="font-size: 14px; font-weight: 600; color: #1E1C1A;">${recipientName}</div>
                    <div style="font-size: 13px; color: #695E57; line-height: 1.5; margin-top: 4px;">
                      ${fullAddress}
                    </div>
                    ${addr.phone ? `<div style="font-size: 13px; color: #695E57; margin-top: 4px;">Contact: ${addr.phone}</div>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 28px;">
              <div style="background-color: #F8F5EE; border-left: 3px solid #D6B06A; padding: 14px 16px; border-radius: 0 8px 8px 0;">
                <div style="font-size: 13px; font-weight: 600; color: #1E1C1A; margin-bottom: 4px;">
                  What Happens Next?
                </div>
                <div style="font-size: 13px; color: #695E57; line-height: 1.6;">
                  Our atelier team in New Delhi is preparing your keepsake packaging with sacred care. Once handed over to our delivery partner (Shiprocket), you will receive live courier tracking updates via SMS &amp; email.
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px; text-align: center;">
              <a href="https://younoya.com/account/orders/${order.id}" style="display: inline-block; background-color: #1A0A17; color: #FAF6EE; font-size: 14px; font-weight: 600; text-decoration: none; padding: 13px 30px; border-radius: 999px; letter-spacing: 0.04em;">
                View Order Details ↗
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F7F3EC; border-top: 1px solid rgba(44, 34, 28, 0.08); padding: 22px 32px; text-align: center;">
              <p style="font-size: 12px; color: #8A7B70; line-height: 1.6; margin: 0 0 6px;">
                Questions or special gifting requests? Contact our atelier concierge at
                <a href="mailto:${business.supportEmail || 'support@younoya.com'}" style="color: #935632; text-decoration: underline;">${business.supportEmail || 'support@younoya.com'}</a>
              </p>
              <p style="font-size: 11px; color: #A4978D; margin: 0;">
                © ${new Date().getFullYear()} ${business.legalName || 'YOUNOYA'}. Astrology-backed gifting, curated for what matters.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function queueEmail(orderId: string, key: string, subject: string, text: string) {
  return enqueue("email",`email:${orderId}:${key}`,{ subject,text },orderId)
}

export async function sendOrderEmail(scope: any, operation: any) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_FROM_EMAIL) throw new CommerceError("Order email delivery is not configured",503)
  const order = await readOrder(scope,operation.order_id)
  if (!order.email) throw new Error("Order email is missing")
  const s = await settings()
  const business = s.published || defaults
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465", connectionTimeout: 10000, socketTimeout: 12000,
    ...(process.env.SMTP_USER ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } } : {}) })
  const plainText = `${operation.payload.text}\n\nOrder #${order.display_id || order.id}\n${order.items.map((i: any) => `${i.title} × ${i.quantity}`).join("\n")}\nTotal: INR ${rupees(orderPaise(order.total,order)).toFixed(2)}\n\nView your order: https://younoya.com/account/orders/${order.id}\n${business.supportEmail}\n${business.legalName}`
  const htmlContent = renderOrderEmailHtml(order, business)
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM_NAME ? `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>` : process.env.SMTP_FROM_EMAIL,
      replyTo: business.supportEmail || process.env.SMTP_FROM_EMAIL,
      to: order.email,
      messageId: `<${operation.id}@younoya.com>`,
      subject: `${operation.payload.subject} · YOUNOYA #${order.display_id || order.id}`,
      text: plainText,
      html: htmlContent
    })
  } finally { transporter.close() }
  return { sent: true }
}

