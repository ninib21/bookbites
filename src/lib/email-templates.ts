import { prisma } from '@/lib/prisma'

interface EmailParams {
  to: string
  subject: string
  template: string
  data: Record<string, string>
}

// Generate HTML email from template name and data
function renderEmail(template: string, data: Record<string, string>): string {
  const baseStyle = `
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    max-width: 600px; margin: 0 auto; padding: 0;
    background: #ffffff; color: #2D2D2D;
  `
  const buttonStyle = `
    display: inline-block; padding: 12px 24px;
    background: #D4A5B8; color: #ffffff;
    text-decoration: none; border-radius: 8px;
    font-weight: 600; font-size: 14px;
  `

  const header = `
    <div style="${baseStyle}">
      <div style="background: #2D2D2D; padding: 24px 32px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-family: Georgia, serif;">
          Book<span style="color: #D4A5B8;">Bites</span>
        </h1>
      </div>
      <div style="padding: 32px;">
  `

  const footer = `
      </div>
      <div style="background: #f8f6f5; padding: 24px 32px; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #888;">
          Sent by BookBites &middot; ${data.business_name || 'Your Business'}
        </p>
        <p style="margin: 4px 0 0; font-size: 12px; color: #aaa;">
          <a href="mailto:${data.business_email || 'hello@bookbites.com'}" style="color: #D4A5B8;">Contact Support</a>
        </p>
      </div>
    </div>
  `

  switch (template) {
    case 'booking_confirmation':
      return `${header}
        <h2 style="color: #2D2D2D; font-size: 20px;">Booking Confirmed! 🎉</h2>
        <p style="color: #666; line-height: 1.6;">Hi ${data.customer_name},</p>
        <p style="color: #666; line-height: 1.6;">Your booking with <strong>${data.business_name}</strong> has been confirmed!</p>
        <div style="background: #f8f6f5; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Reference:</strong> ${data.reference}</p>
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Event:</strong> ${data.event_type}</p>
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Date:</strong> ${data.event_date}</p>
          ${data.guest_count ? `<p style="margin: 0 0 8px; font-size: 14px;"><strong>Guests:</strong> ${data.guest_count}</p>` : ''}
          ${data.total_price ? `<p style="margin: 0; font-size: 14px;"><strong>Total:</strong> $${data.total_price}</p>` : ''}
        </div>
        ${data.deposit_amount ? `
          <div style="background: #FFF8E1; border: 1px solid #FFD54F; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px; color: #F57F17;"><strong>Deposit Required:</strong> $${data.deposit_amount}</p>
          </div>
        ` : ''}
        <p style="color: #666; line-height: 1.6;">Please save your booking reference for future inquiries.</p>
      ${footer}`

    case 'booking_created_business':
      return `${header}
        <h2 style="color: #2D2D2D; font-size: 20px;">New Booking! 📅</h2>
        <p style="color: #666; line-height: 1.6;">You have a new booking request!</p>
        <div style="background: #f8f6f5; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Client:</strong> ${data.customer_name}</p>
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Email:</strong> ${data.customer_email}</p>
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Event:</strong> ${data.event_type}</p>
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Date:</strong> ${data.event_date}</p>
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Guests:</strong> ${data.guest_count}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Reference:</strong> ${data.reference}</p>
        </div>
        <a href="${data.dashboard_url || '/dashboard/bookings'}" style="${buttonStyle}">Review Booking</a>
      ${footer}`

    case 'payment_reminder':
      return `${header}
        <h2 style="color: #2D2D2D; font-size: 20px;">Payment Reminder 💳</h2>
        <p style="color: #666; line-height: 1.6;">Hi ${data.customer_name},</p>
        <p style="color: #666; line-height: 1.6;">This is a friendly reminder about your upcoming payment for your booking with <strong>${data.business_name}</strong>.</p>
        <div style="background: #f8f6f5; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Reference:</strong> ${data.reference}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Amount Due:</strong> $${data.amount_due}</p>
        </div>
        ${data.payment_url ? `<a href="${data.payment_url}" style="${buttonStyle}">Make Payment</a>` : ''}
      ${footer}`

    case 'invoice_created':
      return `${header}
        <h2 style="color: #2D2D2D; font-size: 20px;">Invoice from ${data.business_name} 📄</h2>
        <p style="color: #666; line-height: 1.6;">Hi ${data.customer_name},</p>
        <p style="color: #666; line-height: 1.6;">An invoice has been created for you.</p>
        <div style="background: #f8f6f5; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Invoice #:</strong> ${data.invoice_number}</p>
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Amount:</strong> $${data.amount}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Due Date:</strong> ${data.due_date}</p>
        </div>
        ${data.payment_url ? `<a href="${data.payment_url}" style="${buttonStyle}">Pay Now</a>` : ''}
      ${footer}`

    case 'welcome':
      return `${header}
        <h2 style="color: #2D2D2D; font-size: 20px;">Welcome to BookBites! 🎉</h2>
        <p style="color: #666; line-height: 1.6;">Hi ${data.business_name},</p>
        <p style="color: #666; line-height: 1.6;">Your account is set up and ready to go. Here are a few things to get you started:</p>
        <ul style="color: #666; line-height: 2;">
          <li>Add your services and menu items</li>
          <li>Set up your booking page</li>
          <li>Configure your payment settings</li>
        </ul>
        <a href="${data.dashboard_url || '/dashboard'}" style="${buttonStyle}">Go to Dashboard</a>
        <p style="color: #666; line-height: 1.6; margin-top: 24px;">Your booking page is live at: <a href="${data.booking_url}" style="color: #D4A5B8;">${data.booking_url}</a></p>
      ${footer}`

    case 'booking_status_update':
      return `${header}
        <h2 style="color: #2D2D2D; font-size: 20px;">Booking Update 📋</h2>
        <p style="color: #666; line-height: 1.6;">Hi ${data.customer_name},</p>
        <p style="color: #666; line-height: 1.6;">Your booking with <strong>${data.business_name}</strong> has been updated.</p>
        <div style="background: #f8f6f5; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Reference:</strong> ${data.reference}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Status:</strong> <span style="color: ${data.status === 'CONFIRMED' ? '#4CAF50' : '#FF9800'}; font-weight: bold;">${data.status}</span></p>
        </div>
        ${data.status_message ? `<p style="color: #666; line-height: 1.6;">${data.status_message}</p>` : ''}
      ${footer}`

    default:
      return `${header}
        <h2 style="color: #2D2D2D; font-size: 20px;">${data.title || 'Notification'}</h2>
        <p style="color: #666; line-height: 1.6;">${data.message || ''}</p>
      ${footer}`
  }
}

// Send email via configured provider
export async function sendEmail({ to, subject, template, data }: EmailParams): Promise<boolean> {
  const html = renderEmail(template, data)

  // In development, log the email
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Email sent:', { to, subject, template })
    return true
  }

  // Production: Use SendGrid, Resend, or similar
  const apiKey = process.env.EMAIL_API_KEY
  const fromEmail = process.env.EMAIL_FROM || 'noreply@bookbites.com'

  if (!apiKey) {
    console.warn('EMAIL_API_KEY not configured. Email not sent.')
    return false
  }

  try {
    // Using Resend API (can be swapped for SendGrid, etc.)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `BookBites <${fromEmail}>`,
        to: [to],
        subject,
        html,
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Email send error:', error)
    return false
  }
}

// Convenience functions
export const EmailTemplates = {
  bookingConfirmation: (params: {
    to: string; customerName: string; businessName: string; reference: string;
    eventType: string; eventDate: string; guestCount?: string; totalPrice?: string;
    depositAmount?: string;
  }) => sendEmail({
    to: params.to,
    subject: `Booking Confirmed - ${params.reference}`,
    template: 'booking_confirmation',
    data: {
      customer_name: params.customerName,
      business_name: params.businessName,
      reference: params.reference,
      event_type: params.eventType,
      event_date: params.eventDate,
      guest_count: params.guestCount || '',
      total_price: params.totalPrice || '',
      deposit_amount: params.depositAmount || '',
    },
  }),

  newBookingBusiness: (params: {
    to: string; customerName: string; customerEmail: string; reference: string;
    eventType: string; eventDate: string; guestCount: string; dashboardUrl?: string;
  }) => sendEmail({
    to: params.to,
    subject: `New Booking - ${params.reference}`,
    template: 'booking_created_business',
    data: {
      customer_name: params.customerName,
      customer_email: params.customerEmail,
      reference: params.reference,
      event_type: params.eventType,
      event_date: params.eventDate,
      guest_count: params.guestCount,
      dashboard_url: params.dashboardUrl || '',
    },
  }),

  welcome: (params: {
    to: string; businessName: string; bookingUrl: string; dashboardUrl?: string;
  }) => sendEmail({
    to: params.to,
    subject: 'Welcome to BookBites!',
    template: 'welcome',
    data: {
      business_name: params.businessName,
      booking_url: params.bookingUrl,
      dashboard_url: params.dashboardUrl || '',
    },
  }),

  bookingStatusUpdate: (params: {
    to: string; customerName: string; businessName: string; reference: string;
    status: string; statusMessage?: string;
  }) => sendEmail({
    to: params.to,
    subject: `Booking Update - ${params.reference}`,
    template: 'booking_status_update',
    data: {
      customer_name: params.customerName,
      business_name: params.businessName,
      reference: params.reference,
      status: params.status,
      status_message: params.statusMessage || '',
    },
  }),

  invoiceCreated: (params: {
    to: string; customerName: string; businessName: string;
    invoiceNumber: string; amount: string; dueDate: string; paymentUrl?: string;
  }) => sendEmail({
    to: params.to,
    subject: `Invoice #${params.invoiceNumber} from ${params.businessName}`,
    template: 'invoice_created',
    data: {
      customer_name: params.customerName,
      business_name: params.businessName,
      invoice_number: params.invoiceNumber,
      amount: params.amount,
      due_date: params.dueDate,
      payment_url: params.paymentUrl || '',
    },
  }),

  paymentReminder: (params: {
    to: string; customerName: string; businessName: string;
    reference: string; amountDue: string; paymentUrl?: string;
  }) => sendEmail({
    to: params.to,
    subject: `Payment Reminder - ${params.reference}`,
    template: 'payment_reminder',
    data: {
      customer_name: params.customerName,
      business_name: params.businessName,
      reference: params.reference,
      amount_due: params.amountDue,
      payment_url: params.paymentUrl || '',
    },
  }),
}
