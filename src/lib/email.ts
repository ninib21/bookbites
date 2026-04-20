import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@prettypartysweets.com'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@prettypartysweets.com'

// Send inquiry notification to admin
export const sendInquiryNotification = async ({
  name,
  email,
  phone,
  eventType,
  eventDate,
  message,
}: {
  name: string
  email: string
  phone?: string
  eventType: string
  eventDate: string
  message: string
}) => {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Inquiry: ${eventType} - ${name}`,
    html: `
      <h2>New Inquiry Received</h2>
      <p><strong>Customer:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Event Type:</strong> ${eventType}</p>
      <p><strong>Event Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
      <h3>Message:</h3>
      <p>${message}</p>
      <hr>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/leads">View in Admin Panel</a></p>
    `,
  })
}

// Send inquiry confirmation to customer
export const sendInquiryConfirmation = async ({
  name,
  email,
}: {
  name: string
  email: string
}) => {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Thank You for Your Inquiry - Pretty Party Sweets',
    html: `
      <h2>Thank You, ${name}!</h2>
      <p>We've received your inquiry and will get back to you within 24 hours.</p>
      <p><strong>What happens next:</strong></p>
      <ol>
        <li>We'll review your inquiry</li>
        <li>Contact you to discuss details</li>
        <li>Provide a custom quote</li>
        <li>Confirm your booking</li>
      </ol>
      <p>If you have any questions, feel free to contact us at ${ADMIN_EMAIL}</p>
      <hr>
      <p><strong>Pretty Party Sweets</strong><br/>
      Luxury Candy Tables & Dipped Treats</p>
    `,
  })
}

// Send contact message notification to admin
export const sendContactNotification = async ({
  name,
  email,
  subject,
  message,
}: {
  name: string
  email: string
  subject: string
  message: string
}) => {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `Contact Form: ${subject} - ${name}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <h3>Message:</h3>
      <p>${message}</p>
      <hr>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">View in Admin Panel</a></p>
    `,
  })
}

// Send booking notification to admin
export const sendBookingNotification = async ({
  reference,
  name,
  email,
  phone,
  eventType,
  eventDate,
  packageName,
  totalPrice,
}: {
  reference: string
  name: string
  email: string
  phone: string
  eventType: string
  eventDate: string
  packageName: string
  totalPrice?: number
}) => {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Booking: ${reference} - ${name}`,
    html: `
      <h2>New Booking Received</h2>
      <p><strong>Reference:</strong> ${reference}</p>
      <p><strong>Customer:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Event Type:</strong> ${eventType}</p>
      <p><strong>Event Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
      <p><strong>Package:</strong> ${packageName}</p>
      <p><strong>Total Price:</strong> ${totalPrice ? '$' + totalPrice : 'TBD'}</p>
      <hr>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/bookings">Review Booking</a></p>
    `,
  })
}

// Send booking confirmation to customer
export const sendBookingConfirmation = async ({
  reference,
  name,
  email,
  eventType,
  eventDate,
  packageName,
}: {
  reference: string
  name: string
  email: string
  eventType: string
  eventDate: string
  packageName: string
}) => {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Booking Confirmed - ${reference} | Pretty Party Sweets`,
    html: `
      <h2>Booking Confirmation</h2>
      <p>Dear ${name},</p>
      <p>Your booking has been confirmed!</p>
      
      <h3>Booking Details:</h3>
      <p><strong>Reference:</strong> ${reference}</p>
      <p><strong>Event Type:</strong> ${eventType}</p>
      <p><strong>Event Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
      <p><strong>Package:</strong> ${packageName}</p>
      
      <h3>What's Next?</h3>
      <ol>
        <li>We'll contact you to finalize details</li>
        <li>Complete payment to secure your date</li>
        <li>We'll create your sweet experience!</li>
      </ol>
      
      <p>You can track your booking anytime at:<br/>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/booking/lookup">Track Your Booking</a></p>
      
      <hr>
      <p><strong>Pretty Party Sweets</strong><br/>
      Luxury Candy Tables & Dipped Treats</p>
    `,
  })
}

// Send booking status update to customer
export const sendBookingStatusUpdate = async ({
  reference,
  name,
  email,
  status,
  adminNotes,
}: {
  reference: string
  name: string
  email: string
  status: string
  adminNotes?: string
}) => {
  const statusMessages = {
    confirmed: 'Your booking has been approved and confirmed!',
    cancelled: 'We regret to inform you that your booking has been declined.',
  }

  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)} - ${reference}`,
    html: `
      <h2>Booking Status Update</h2>
      <p>Dear ${name},</p>
      <p>${statusMessages[status as keyof typeof statusMessages]}</p>
      
      <p><strong>Reference:</strong> ${reference}</p>
      
      ${adminNotes ? `<p><strong>Note:</strong> ${adminNotes}</p>` : ''}
      
      ${status === 'confirmed' 
        ? '<p>We\'ll be in touch soon to finalize all the details!</p>'
        : '<p>Please contact us if you have any questions or would like to discuss alternative options.</p>'
      }
      
      <hr>
      <p><strong>Pretty Party Sweets</strong></p>
    `,
  })
}

// Send payment confirmation
export const sendPaymentConfirmation = async ({
  reference,
  name,
  email,
  amount,
}: {
  reference: string
  name: string
  email: string
  amount: number
}) => {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Payment Received - ${reference} | Pretty Party Sweets`,
    html: `
      <h2>Payment Confirmed</h2>
      <p>Dear ${name},</p>
      <p>We've received your payment!</p>
      
      <p><strong>Reference:</strong> ${reference}</p>
      <p><strong>Amount:</strong> $${amount}</p>
      
      <p>Your booking is now fully secured. We'll contact you closer to your event date to finalize all details.</p>
      
      <hr>
      <p><strong>Pretty Party Sweets</strong><br/>
      Thank you for choosing us for your special event!</p>
    `,
  })
}

// Send payment submission notification to admin
export const sendPaymentSubmissionNotificationToAdmin = async ({
  reference,
  customerName,
  customerEmail,
  paymentMethod,
  amount,
  notes,
}: {
  reference: string
  customerName: string
  customerEmail: string
  paymentMethod: string
  amount?: number
  notes?: string
}) => {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `Payment Submitted - ${reference} | Review Required`,
    html: `
      <h2>New Payment Submission</h2>
      <p>A client has submitted a payment for your review.</p>
      
      <h3>Booking Details:</h3>
      <p><strong>Reference:</strong> ${reference}</p>
      <p><strong>Customer:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      
      <h3>Payment Details:</h3>
      <p><strong>Method:</strong> ${paymentMethod}</p>
      ${amount ? `<p><strong>Amount:</strong> $${amount}</p>` : ''}
      ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
      
      <hr>
      <p><strong>Action Required:</strong> Please verify the payment has been received and update the booking status.</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/bookings">Review Bookings</a></p>
      
      <hr>
      <p><strong>Pretty Party Sweets - Admin Notification</strong></p>
    `,
  })
}

// Send payment confirmation to client after admin approval
export const sendPaymentConfirmationToClient = async ({
  reference,
  name,
  email,
  amount,
}: {
  reference: string
  name: string
  email: string
  amount?: number
}) => {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Payment Confirmed - ${reference} | Pretty Party Sweets`,
    html: `
      <h2>Payment Confirmed!</h2>
      <p>Dear ${name},</p>
      <p>Great news! Your payment has been received and confirmed.</p>
      
      <p><strong>Booking Reference:</strong> ${reference}</p>
      ${amount ? `<p><strong>Amount:</strong> $${amount}</p>` : ''}
      
      <p>Your booking is now fully secured. We'll be in touch closer to your event date with final details.</p>
      
      <p>Thank you for choosing Pretty Party Sweets!</p>
      
      <hr>
      <p><strong>Pretty Party Sweets</strong><br/>
      Luxury Candy Tables & Dipped Treats</p>
    `,
  })
}

// Send notification to admin when new inquiry is submitted
export const sendInquiryNotificationToAdmin = async ({
  name,
  email,
  eventType,
  eventDate,
  message,
}: {
  name: string
  email: string
  eventType: string
  eventDate: Date
  message?: string
}) => {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Inquiry Received | ${eventType} Event`,
    html: `
      <h2>New Inquiry Received</h2>
      <p>A new inquiry has been submitted through your website.</p>
      
      <h3>Inquiry Details:</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Event Type:</strong> ${eventType}</p>
      <p><strong>Event Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      
      <hr>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/leads">View Leads</a></p>
      
      <hr>
      <p><strong>Pretty Party Sweets - Admin Notification</strong></p>
    `,
  })
}

// Send notification to admin when new booking is submitted
export const sendBookingNotificationToAdmin = async ({
  reference,
  customerName,
  customerEmail,
  eventType,
  eventDate,
  packageName,
  totalPrice,
}: {
  reference: string
  customerName: string
  customerEmail: string
  eventType: string
  eventDate: Date
  packageName: string
  totalPrice?: number
}) => {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Booking Received - ${reference} | Action Required`,
    html: `
      <h2>New Booking Received</h2>
      <p>A new booking has been submitted and requires your review.</p>
      
      <h3>Booking Details:</h3>
      <p><strong>Reference:</strong> ${reference}</p>
      <p><strong>Customer:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <p><strong>Event Type:</strong> ${eventType}</p>
      <p><strong>Event Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
      <p><strong>Package:</strong> ${packageName}</p>
      ${totalPrice ? `<p><strong>Total Price:</strong> $${totalPrice}</p>` : ''}
      
      <hr>
      <p><strong>Action Required:</strong> Please review and approve or decline this booking.</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/bookings">Review Bookings</a></p>
      
      <hr>
      <p><strong>Pretty Party Sweets - Admin Notification</strong></p>
    `,
  })
}

// Send booking confirmation to client
export const sendBookingConfirmationToClient = async ({
  reference,
  name,
  email,
  eventType,
  eventDate,
  packageName,
}: {
  reference: string
  name: string
  email: string
  eventType: string
  eventDate: Date
  packageName: string
}) => {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Booking Received - ${reference} | Pretty Party Sweets`,
    html: `
      <h2>Booking Request Received!</h2>
      <p>Dear ${name},</p>
      <p>Thank you for booking with Pretty Party Sweets! We've received your request and are reviewing the details.</p>
      
      <h3>Booking Details:</h3>
      <p><strong>Reference:</strong> ${reference}</p>
      <p><strong>Event Type:</strong> ${eventType}</p>
      <p><strong>Event Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
      <p><strong>Package:</strong> ${packageName}</p>
      
      <p>We'll review your booking and send you a confirmation within 24 hours.</p>
      
      <p>You can track your booking status at any time:</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/booking/lookup">Track Your Booking</a></p>
      
      <hr>
      <p><strong>Pretty Party Sweets</strong><br/>
      Luxury Candy Tables & Dipped Treats</p>
    `,
  })
}

// Send booking approval notification to client
export const sendBookingApprovalToClient = async ({
  reference,
  name,
  email,
  eventType,
  eventDate,
  adminNotes,
}: {
  reference: string
  name: string
  email: string
  eventType: string
  eventDate: Date
  adminNotes?: string
}) => {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Booking Confirmed - ${reference} | Pretty Party Sweets`,
    html: `
      <h2>Your Booking is Confirmed!</h2>
      <p>Dear ${name},</p>
      <p>Great news! Your booking has been approved and confirmed.</p>
      
      <h3>Booking Details:</h3>
      <p><strong>Reference:</strong> ${reference}</p>
      <p><strong>Event Type:</strong> ${eventType}</p>
      <p><strong>Event Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
      
      ${adminNotes ? `<p><strong>Note from us:</strong> ${adminNotes}</p>` : ''}
      
      <p>Your date is now reserved! We'll be in touch closer to your event to finalize all the sweet details.</p>
      
      <p>Track your booking:</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/booking/lookup">View Booking Status</a></p>
      
      <hr>
      <p><strong>Pretty Party Sweets</strong><br/>
      Luxury Candy Tables & Dipped Treats</p>
    `,
  })
}

// Send booking decline notification to client
export const sendBookingDeclineToClient = async ({
  reference,
  name,
  email,
  eventType,
  eventDate,
  adminNotes,
}: {
  reference: string
  name: string
  email: string
  eventType: string
  eventDate: Date
  adminNotes?: string
}) => {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Booking Update - ${reference} | Pretty Party Sweets`,
    html: `
      <h2>Booking Update</h2>
      <p>Dear ${name},</p>
      <p>We regret to inform you that we are unable to accommodate your booking request at this time.</p>
      
      <h3>Booking Details:</h3>
      <p><strong>Reference:</strong> ${reference}</p>
      <p><strong>Event Type:</strong> ${eventType}</p>
      <p><strong>Event Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
      
      ${adminNotes ? `<p><strong>Message from us:</strong> ${adminNotes}</p>` : ''}
      
      <p>We apologize for any inconvenience. Please feel free to contact us to discuss alternative dates or options.</p>
      
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact">Contact Us</a></p>
      
      <hr>
      <p><strong>Pretty Party Sweets</strong><br/>
      Luxury Candy Tables & Dipped Treats</p>
    `,
  })
}

// Send verification email to new user
export const sendVerificationEmail = async ({
  email,
  name,
  token,
}: {
  email: string
  name: string
  token: string
}) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email?token=${token}`
  
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Verify Your Email - Tasty Treats',
    html: `
      <h2>Welcome to Tasty Treats!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for creating your business account. Please verify your email address to get started.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" 
           style="background-color: #D4A5B8; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p>${verificationUrl}</p>
      
      <p>This link will expire in 24 hours.</p>
      
      <hr>
      <p><strong>Tasty Treats</strong><br/>
      Multi-Tenant Booking Platform</p>
    `,
  })
}

// Send payment decline notification to client
export const sendPaymentDeclineToClient = async ({
  reference,
  name,
  email,
  reason,
}: {
  reference: string
  name: string
  email: string
  reason?: string
}) => {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Payment Update - ${reference} | Pretty Party Sweets`,
    html: `
      <h2>Payment Update</h2>
      <p>Dear ${name},</p>
      <p>We were unable to verify your payment for booking <strong>${reference}</strong>.</p>
      
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      
      <p>Please submit your payment again through our booking lookup page, or contact us if you need assistance.</p>
      
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/booking/lookup">Submit Payment</a></p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact">Contact Us</a></p>
      
      <hr>
      <p><strong>Pretty Party Sweets</strong><br/>
      Luxury Candy Tables & Dipped Treats</p>
    `,
  })
}
