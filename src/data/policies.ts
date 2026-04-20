export type Policy = {
  title: string
  content: string
  lastUpdated: string
}

export const policies: Record<string, Policy> = {
  privacy: {
    title: 'Privacy Policy',
    content: `At Pretty Party Sweets, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.

**Information We Collect:**
- Name, email, phone number when you submit inquiry forms
- Event details and preferences for order customization
- Payment information for processing transactions

**How We Use Your Information:**
- Process and fulfill your orders
- Communicate about your event and order details
- Improve our services and customer experience
- Send promotional emails (with your consent)

**Data Protection:**
We implement industry-standard security measures to protect your personal information. Your data is never sold or shared with third parties for marketing purposes.

**Your Rights:**
You can request access to, correction of, or deletion of your personal data at any time by contacting us.`,
    lastUpdated: '2024-01-01',
  },
  terms: {
    title: 'Terms of Service',
    content: `By using our services, you agree to the following terms:

**Ordering:**
- Orders must be placed at least 2 weeks in advance
- A 50% deposit is required to secure your booking
- Final balance is due one week before your event

**Cancellations:**
- Cancellations made 2+ weeks before event: Full deposit refund
- Cancellations within 2 weeks: 50% cancellation fee
- No refunds for cancellations within 48 hours

**Modifications:**
- Order modifications accepted up to 1 week before event
- Subject to availability and may affect pricing

**Liability:**
We take utmost care in preparing and delivering your order. However, we are not liable for:
- Allergic reactions (please inform us of allergies)
- Damage caused by improper handling after delivery
- Weather-related issues for outdoor events

**Quality Guarantee:**
We guarantee the quality and freshness of all our products. If you're not satisfied, please contact us within 24 hours of your event.`,
    lastUpdated: '2024-01-01',
  },
  refund: {
    title: 'Refund Policy',
    content: `We want you to be completely satisfied with our services. Here's our refund policy:

**Deposits:**
- Fully refundable if cancelled 2+ weeks before event
- 50% refundable if cancelled within 2 weeks
- Non-refundable within 48 hours of event

**Final Payments:**
- Refundable if we cancel due to unforeseen circumstances
- Non-refundable after event date has passed

**Quality Issues:**
If you're not satisfied with the quality of your order:
1. Contact us within 24 hours
2. Provide photos/documentation of the issue
3. We will offer a partial or full refund based on the situation

**Processing Time:**
Refunds are processed within 5-7 business days after approval.

**Contact:**
For refund requests, email us at hello@prettypartysweets.com or call (123) 456-7890.`,
    lastUpdated: '2024-01-01',
  },
}

export const policyLinks = [
  { label: 'Privacy Policy', href: '/policies/privacy' },
  { label: 'Terms of Service', href: '/policies/terms' },
  { label: 'Refund Policy', href: '/policies/refund' },
]
