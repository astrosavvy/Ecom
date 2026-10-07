export const POLICY_ROUTES = {
  '/terms-and-conditions': 'Terms and Conditions', '/privacy-policy': 'Privacy Policy', '/shipping-policy': 'Shipping Policy',
  '/contact': 'Contact Us', '/cancellation-and-refunds': 'Cancellation and Refunds',
}
export function policySections(path, b) {
  const contact = `For assistance, write to ${b.supportEmail}. Include your order number for order enquiries.`
  const grievance = b.grievanceName ? `Grievance contact: ${b.grievanceName}, ${b.grievanceEmail}, ${b.grievancePhone}. We acknowledge consumer grievances within 48 hours and aim to resolve them within one month.` : 'Grievance contact details are being finalized before online ordering opens.'
  if (path === '/shipping-policy') return [
    ['Delivery within India', 'We offer free shipping to serviceable addresses in India. Availability is checked against your PIN code and selection before payment.'],
    ['Dispatch and arrival', `Dispatch is within ${b.dispatchHours} hours of payment confirmation. Estimated delivery is ${b.deliveryMinDays}–${b.deliveryMaxDays} working days after dispatch. Remote areas, courier disruptions and circumstances beyond our control may cause delays. Estimates are not guaranteed arrival dates.`],
    ['Following your order', 'Payment confirmation means your order has been received. It does not mean the parcel has dispatched. Your order page shows courier pickup, tracking and delivery updates when available.'],
    ['Delivery assistance', `Please enter a complete address and reachable mobile number. Contact us promptly about an incorrect address, delay or delivery issue. ${contact}`],
  ]
  if (path === '/cancellation-and-refunds') return [
    ['Before dispatch', 'Request cancellation from your order page or contact support before dispatch. The atelier checks courier status before approval. A submitted request does not itself cancel an order.'],
    ['Damaged, defective or incorrect pieces', b.damageReportHours ? `Please report damaged, defective or incorrect items within ${b.damageReportHours} hours of delivery, quoting your order number and sending clear photographs to support. The atelier reviews the issue and provides resolution instructions. This reporting window does not limit statutory consumer rights.` : 'We accept requests concerning damaged, defective or incorrect items. The reporting timeframe will be published before ordering opens. Statutory consumer rights remain unaffected.'],
    ['Returns and review', 'Change-of-mind returns are not offered. Wait for approval and return instructions before sending an item. We review the reported issue and, where applicable, returned items before approving a refund or other resolution.'],
    ['Refunds', b.refundInitiationDays ? `Approved refunds are initiated within ${b.refundInitiationDays} working days after approval and any required return verification. Refunds use the original payment method. Bank/provider processing can take additional time; your order page shows the refund reference and status.` : 'The refund initiation timeframe will be published before ordering opens. Approved refunds use the original payment method, with separate bank/provider processing time.'],
    ['Support and rights', `${contact} ${grievance}`],
  ]
  if (path === '/privacy-policy') return [
    ['Who handles your information', `${b.legalName} operates Younoya. ${b.address ? `Business address: ${b.address}.` : ''} ${contact}`],
    ['Information you provide', 'We process contact and login details, delivery addresses, order information, saved selections, support requests and optional gift-guide answers. Birth date, birth time and birthplace are optional and used for the astrological guidance you request.'],
    ['How we use it', 'We use information to verify access, curate requested guidance, save recommendations, fulfil orders, provide support, prevent fraud and meet record-keeping obligations. Essential browser storage maintains login, bag, selected gifts and pending payment recovery.'],
    ['Service providers', 'Razorpay processes payments and Shiprocket coordinates shipping when ordering is enabled. Email/message delivery providers handle verification and order communications. Requested guidance may use OpenCage, VedAstro and OpenRouter for location, astrology and wording. These services receive information needed for their role and may process it outside India. The storefront does not store full card details or payment credentials.'],
    ['Retention and requests', 'We retain information needed for active services, support and applicable business/legal records. Email support to request access, correction or deletion; identity verification and legal retention obligations may apply. Optional guidance is not a guarantee of outcomes or medical, legal or financial advice.'],
    ['Grievances and changes', `${grievance} Changes are published with a policy revision; checkout records the revision accepted for your order.`],
  ]
  if (path === '/contact') return [ ['The Younoya atelier', b.legalName], ['Write to us', contact],
    ...(b.supportPhone ? [['Call us', b.supportPhone]] : []), ...(b.address ? [['Business address', b.address]] : []),
    ['Order assistance', 'Sign in to your order page to see delivery information or request cancellation, or help with a damaged, defective or incorrect piece.'], ['Grievance assistance', grievance] ]
  return [
    ['Our store', `${b.legalName} operates Younoya for customers in India. ${b.address ? `Business address: ${b.address}.` : ''} These terms apply to website use and purchases through it.`],
    ['Orders and payment', 'Prices and availability are confirmed at checkout. The final payable INR total, including any applicable tax, discount and delivery charge, is shown before payment. Orders require payment confirmation; stock or payment problems may require support review and, where appropriate, refund.'],
    ['Meaningful guidance', 'Our gift guide offers optional astrology-inspired and intentional gifting guidance. It does not guarantee personal, health, career or financial outcomes. Product descriptions, materials, dimensions and care instructions should guide your purchase.'],
    ['Delivery, cancellation and refunds', `Delivery is free to serviceable Indian addresses. Dispatch is within ${b.dispatchHours} hours of payment confirmation, with estimated delivery ${b.deliveryMinDays}–${b.deliveryMaxDays} working days after dispatch. Our Shipping Policy and Cancellation and Refunds page explain the full process; statutory rights remain unaffected.`],
    ['Account and website use', 'Keep verification codes private and provide accurate order/contact details. Do not misuse the website, access another account or interfere with its operation. Content and branding may not be reproduced without permission or a legal basis.'],
    ['Assistance and applicable law', `${contact} ${grievance} Applicable Indian law governs these terms without limiting statutory consumer remedies.`],
  ]
}
