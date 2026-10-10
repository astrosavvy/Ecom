import nodemailer from "nodemailer"
import { enqueue, CommerceError, orderPaise, rupees } from "./db"
import { readOrder } from "./orders"
import { settings, defaults } from "./settings"

export function renderOrderEmailHtml(order: any, business: any) {
  const displayId = order.custom_display_id || (order.display_id ? `YOU-2026-${String(order.display_id).padStart(4, '0')}` : `#${order.id.slice(-8).toUpperCase()}`)
  const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  
  // Calculate delivery window (dispatch within 24h + 3-5 delivery days)
  const deliveryStart = new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  const deliveryEnd = new Date(Date.now() + 6 * 86400000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })

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

  const totalItemsCount = (order.items || []).reduce((acc: number, item: any) => acc + (Number(item.quantity) || 1), 0)

  const itemsHtml = (order.items || []).map((item: any) => {
    const itemTotal = `₹${rupees(orderPaise(item.total, order)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    const thumbnail = item.thumbnail || item.variant?.product?.thumbnail || (String(item.title || '').toLowerCase().includes('navratri') ? 'https://younoya.com/media/navratri/red-kit-600.webp' : 'https://younoya.com/media/shop-apple.webp')
    const sku = item.variant_sku || item.variant?.sku || (String(item.title || '').toLowerCase().includes('navratri') ? 'YN-NAVRATRI-9D-001' : item.variant_id || 'YN-ATELIER-001')

    return `
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid #ECE3D6; vertical-align: top; width: 88px;">
          <img src="${thumbnail}" alt="${item.title}" width="80" height="80" style="display: block; width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(44,34,28,0.08);" />
        </td>
        <td style="padding: 16px 0 16px 14px; border-bottom: 1px solid #ECE3D6; vertical-align: top;">
          <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 15px; font-weight: 600; color: #1E1C1A; line-height: 1.4;">
            ${item.title}
          </div>
          <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 12px; color: #8A7B70; margin-top: 4px;">
            SKU: ${sku}
          </div>
          <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 13px; color: #1E1C1A; margin-top: 4px;">
            Quantity: ${item.quantity}
          </div>
        </td>
        <td style="padding: 16px 0; border-bottom: 1px solid #ECE3D6; text-align: right; vertical-align: top; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 15px; font-weight: 600; color: #1E1C1A; white-space: nowrap;">
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
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FAF7F2; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #FFFFFF; border: 1px solid rgba(44, 34, 28, 0.08); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(44, 34, 28, 0.04);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- BRAND HEADER WITH LOGO -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 32px 24px 20px; text-align: center; border-bottom: 1px solid #F0EAE1;">
              <a href="https://younoya.com" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="https://younoya.com/brand.png" alt="YOUNOYA · For every chapter" width="150" height="87" style="display: block; width: 150px; max-width: 100%; height: auto; margin: 0 auto; border: 0;" />
              </a>
              <div style="font-size: 11px; letter-spacing: 0.14em; color: #8A7B70; margin-top: 14px; text-transform: uppercase; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;">
                Rituals &nbsp;·&nbsp; Keepsakes &nbsp;·&nbsp; Sacred Altar &nbsp;·&nbsp; Gift Sets
              </div>
            </td>
          </tr>

          <!-- CELEBRATION HEADLINE -->
          <tr>
            <td style="padding: 32px 28px 20px; text-align: center;">
              <div style="font-size: 24px; color: #D6B06A; margin-bottom: 12px;">✨ ✦ ✨</div>
              <h1 style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 26px; font-weight: 700; color: #1E1C1A; margin: 0 0 10px; line-height: 1.25;">
                Woohoo! Your order is confirmed.
              </h1>
              <p style="font-size: 15px; color: #5C524A; line-height: 1.55; margin: 0 auto; max-width: 440px;">
                <strong>YOUNOYA Atelier</strong> will start working on this right away. We'll email you as soon as it ships.
              </p>
            </td>
          </tr>

          <!-- MILESTONE PROGRESS STEPPER -->
          <tr>
            <td style="padding: 12px 32px 28px;">
              <!-- 3-STAGE PROGRESS BAR (EQUAL SPACING & EXACT ALIGNMENT) -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed; width: 100%; border-collapse: collapse;">
                <!-- ROW 1: NODES AND CONNECTING LINES -->
                <tr>
                  <!-- STAGE 1: ORDERED (COMPLETED) -->
                  <td width="33.33%" align="center" style="width: 33.33%; padding: 0; vertical-align: middle;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse;">
                      <tr>
                        <td width="50%" style="width: 50%; height: 26px;">&nbsp;</td>
                        <td width="26" align="center" style="width: 26px; height: 26px; vertical-align: middle;">
                          <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #1E1C1A; border: 2px solid #1E1C1A; color: #FFFFFF; line-height: 24px; text-align: center; font-size: 13px; font-weight: bold; margin: 0 auto; mso-line-height-rule: exactly; box-sizing: border-box;">✓</div>
                        </td>
                        <td width="50%" style="width: 50%; height: 26px; vertical-align: middle; line-height: 1px; font-size: 1px;">
                          <div style="height: 2px; background-color: #1E1C1A; line-height: 1px; font-size: 1px; width: 100%;">&nbsp;</div>
                        </td>
                      </tr>
                    </table>
                  </td>

                  <!-- STAGE 2: READY TO SHIP (IN PROGRESS) -->
                  <td width="33.34%" align="center" style="width: 33.34%; padding: 0; vertical-align: middle;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse;">
                      <tr>
                        <td width="50%" style="width: 50%; height: 26px; vertical-align: middle; line-height: 1px; font-size: 1px;">
                          <div style="height: 2px; background-color: #1E1C1A; line-height: 1px; font-size: 1px; width: 100%;">&nbsp;</div>
                        </td>
                        <td width="26" align="center" style="width: 26px; height: 26px; vertical-align: middle;">
                          <div style="width: 22px; height: 22px; border-radius: 50%; border: 2px solid #8A7B70; background-color: #FFFFFF; margin: 0 auto; box-sizing: border-box;"></div>
                        </td>
                        <td width="50%" style="width: 50%; height: 26px; vertical-align: middle; line-height: 1px; font-size: 1px;">
                          <div style="height: 2px; background-color: #DCD4CA; line-height: 1px; font-size: 1px; width: 100%;">&nbsp;</div>
                        </td>
                      </tr>
                    </table>
                  </td>

                  <!-- STAGE 3: EXPECTED DELIVERY (UPCOMING) -->
                  <td width="33.33%" align="center" style="width: 33.33%; padding: 0; vertical-align: middle;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse;">
                      <tr>
                        <td width="50%" style="width: 50%; height: 26px; vertical-align: middle; line-height: 1px; font-size: 1px;">
                          <div style="height: 2px; background-color: #DCD4CA; line-height: 1px; font-size: 1px; width: 100%;">&nbsp;</div>
                        </td>
                        <td width="26" align="center" style="width: 26px; height: 26px; vertical-align: middle;">
                          <div style="width: 22px; height: 22px; border-radius: 50%; border: 2px solid #DCD4CA; background-color: #FFFFFF; margin: 0 auto; box-sizing: border-box;"></div>
                        </td>
                        <td width="50%" style="width: 50%; height: 26px;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- ROW 2: LABELS -->
                <tr>
                  <td width="33.33%" align="center" style="width: 33.33%; padding-top: 10px; vertical-align: top; text-align: center;">
                    <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 13px; font-weight: 600; color: #1E1C1A; line-height: 1.3;">Ordered</div>
                    <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 11px; color: #8A7B70; line-height: 1.3; margin-top: 2px;">on ${orderDate}</div>
                  </td>
                  <td width="33.34%" align="center" style="width: 33.34%; padding-top: 10px; vertical-align: top; text-align: center;">
                    <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 13px; font-weight: 600; color: #1E1C1A; line-height: 1.3;">Ready to ship</div>
                  </td>
                  <td width="33.33%" align="center" style="width: 33.33%; padding-top: 10px; vertical-align: top; text-align: center;">
                    <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 13px; font-weight: 600; color: #1E1C1A; line-height: 1.3;">Expected delivery</div>
                    <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 11px; color: #8A7B70; line-height: 1.3; margin-top: 2px;">${deliveryStart} – ${deliveryEnd}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- NOTICE SUBTITLE (NO VIEW ORDER BUTTON) -->
          <tr>
            <td style="padding: 0 32px 24px; text-align: center;">
              <p style="font-size: 12px; color: #8A7B70; line-height: 1.5; margin: 0;">
                Delivery times are estimated. If you're experiencing difficulty with this order, please
                <a href="mailto:${business.supportEmail || 'support@younoya.com'}?subject=Inquiry for ${displayId}" style="color: #1E1C1A; text-decoration: underline; font-weight: 500;">contact the atelier</a>.
              </p>
            </td>
          </tr>

          <!-- ORDER DETAILS HEADER -->
          <tr>
            <td style="padding: 0 28px 12px; text-align: center;">
              <h2 style="font-size: 20px; font-weight: 700; color: #1E1C1A; margin: 0 0 4px;">Order details</h2>
              <div style="font-size: 13px; color: #695E57;">
                Confirmation number: <strong style="color: #1E1C1A;">${displayId}</strong>
              </div>
            </td>
          </tr>

          <!-- ORDER DETAILS CARD -->
          <tr>
            <td style="padding: 0 24px 28px;">
              <table role="presentation" width="100%" style="background-color: #FFFFFF; border: 1px solid #ECE3D6; border-radius: 10px; overflow: hidden;" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding: 8px 20px;">
                    <!-- ITEMS -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      ${itemsHtml}
                    </table>
                  </td>
                </tr>

                <!-- ADDRESS & PAYMENT 2-COLUMN SECTION -->
                <tr>
                  <td style="padding: 18px 20px 14px; background-color: #FFFFFF;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <!-- SHIPPING ADDRESS -->
                        <td style="vertical-align: top; width: 50%; padding-right: 14px;">
                          <div style="font-size: 13px; font-weight: 700; color: #1E1C1A; margin-bottom: 6px;">Shipping address</div>
                          <div style="font-size: 13px; color: #5C524A; line-height: 1.5;">
                            ${recipientName}<br/>
                            ${fullAddress}
                          </div>
                        </td>
                        <!-- PAYMENT & BREAKDOWN -->
                        <td style="vertical-align: top; width: 50%; padding-left: 14px; border-left: 1px solid #F0EAE1;">
                          <div style="font-size: 13px; font-weight: 700; color: #1E1C1A; margin-bottom: 6px;">Paid with Online Payment</div>
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px; color: #5C524A;">
                            <tr>
                              <td style="padding: 3px 0;">Subtotal</td>
                              <td style="text-align: right; font-weight: 600; color: #1E1C1A;">${totalAmount}</td>
                            </tr>
                            <tr>
                              <td style="padding: 3px 0;">GST / Taxes</td>
                              <td style="text-align: right; color: #8A7B70;">Included</td>
                            </tr>
                            <tr>
                              <td style="padding: 3px 0;">Shipping</td>
                              <td style="text-align: right; color: #2B6E3F; font-weight: 600;">Free</td>
                            </tr>
                            <tr>
                              <td colspan="2" style="padding-top: 2px; font-size: 11px; color: #8A7B70;">
                                Shiprocket Express Courier
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- TOTAL ROW -->
                <tr>
                  <td style="padding: 14px 20px; border-top: 1px solid #ECE3D6; text-align: right;">
                    <span style="font-size: 14px; color: #1E1C1A; margin-right: 14px;">Total (${totalItemsCount} item${totalItemsCount > 1 ? 's' : ''})</span>
                    <span style="font-size: 20px; font-weight: 700; color: #1E1C1A;">${totalAmount}</span>
                  </td>
                </tr>

                <!-- CARD FOOTER RIBBON -->
                <tr>
                  <td style="background-color: #FAF8F5; padding: 10px 20px; border-top: 1px solid #ECE3D6; text-align: center; font-size: 12px; color: #695E57;">
                    🌿 YOUNOYA offsets carbon emissions from every delivery
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ATELIER INFORMATION CARD -->
          <tr>
            <td style="padding: 0 24px 32px;">
              <div style="font-size: 16px; font-weight: 700; color: #1E1C1A; margin-bottom: 12px; text-align: center;">
                Shop Information
              </div>
              <table role="presentation" width="100%" style="background-color: #FAF8F5; border: 1px solid #ECE3D6; border-radius: 10px; padding: 18px 20px;" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="width: 54px; vertical-align: middle;">
                    <div style="width: 48px; height: 48px; border-radius: 50%; background-color: #1A0A17; color: #FAF6EE; font-family: Georgia, serif; font-size: 20px; font-weight: bold; line-height: 48px; text-align: center;">
                      Y
                    </div>
                  </td>
                  <td style="vertical-align: middle; padding-left: 12px;">
                    <div style="font-size: 14px; font-weight: 700; color: #1E1C1A;">YOUNOYA Atelier</div>
                    <div style="font-size: 12px; color: #8A7B70; margin-top: 2px;">House of Astro Private Limited · New Delhi</div>
                    <div style="color: #D6B06A; font-size: 13px; margin-top: 2px;">★★★★★</div>
                  </td>
                  <td style="vertical-align: middle; text-align: right;">
                    <a href="mailto:${business.supportEmail || 'support@younoya.com'}?subject=Help with Order ${displayId}" style="display: inline-block; background-color: #1E1C1A; color: #FFFFFF; font-size: 13px; font-weight: 600; text-decoration: none; padding: 9px 18px; border-radius: 999px;">
                      Help with order
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER LEGAL -->
          <tr>
            <td style="background-color: #F7F3EC; border-top: 1px solid rgba(44, 34, 28, 0.08); padding: 20px 24px; text-align: center;">
              <p style="font-size: 11px; color: #A4978D; margin: 0; line-height: 1.5;">
                © ${new Date().getFullYear()} ${business.legalName || 'YOUNOYA HOUSE OF ASTRO PRIVATE LIMITED'}.<br/>
                Astrology-backed gifting, curated for what matters.
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
  const displayId = order.custom_display_id || (order.display_id ? `YOU-2026-${String(order.display_id).padStart(4, '0')}` : `#${order.id.slice(-8).toUpperCase()}`)
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465", connectionTimeout: 10000, socketTimeout: 12000,
    ...(process.env.SMTP_USER ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } } : {}) })
  const plainText = `${operation.payload.text}\n\nOrder Confirmation: ${displayId}\n${order.items.map((i: any) => `${i.title} × ${i.quantity}`).join("\n")}\nTotal: INR ${rupees(orderPaise(order.total,order)).toFixed(2)}\n\nDelivery Destination:\n${order.shipping_address?.first_name || ''} ${order.shipping_address?.last_name || ''}\n${order.shipping_address?.address_1 || ''}\n${order.shipping_address?.city || ''}, ${order.shipping_address?.province || ''} ${order.shipping_address?.postal_code || ''}\nIndia\n\nQuestions? Contact the atelier: ${business.supportEmail || 'support@younoya.com'}\n${business.legalName || 'YOUNOYA'}`
  const htmlContent = renderOrderEmailHtml(order, business)
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM_NAME ? `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>` : process.env.SMTP_FROM_EMAIL,
      replyTo: business.supportEmail || process.env.SMTP_FROM_EMAIL,
      to: order.email,
      messageId: `<${operation.id}@younoya.com>`,
      subject: `${operation.payload.subject} · YOUNOYA ${displayId}`,
      text: plainText,
      html: htmlContent
    })
  } finally { transporter.close() }
  return { sent: true }
}

