import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const bookingSchema = z.object({
  businessSlug: z.string(),
  serviceType: z.enum(['event', 'custom_order', 'catering']),
  selectedServiceId: z.string().optional(),
  selectedPackageId: z.string().optional(),
  eventType: z.string().optional(),
  eventDate: z.string().optional(),
  eventTime: z.string().optional(),
  guestCount: z.coerce.number().min(1).default(1),
  venue: z.string().optional(),
  customizations: z.string().optional(),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  customerNotes: z.string().optional(),
  agreedToTerms: z.boolean().refine(v => v === true),
})

function generateReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = 'BK-'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = bookingSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const data = result.data

    // Find business by slug
    const business = await prisma.business.findUnique({
      where: { slug: data.businessSlug, isActive: true },
      include: { settings: true },
    })

    if (!business) {
      return NextResponse.json(
        { success: false, error: 'Business not found.' },
        { status: 404 }
      )
    }

    if (!business.settings?.allowOnlineBooking) {
      return NextResponse.json(
        { success: false, error: 'Online booking is not available for this business.' },
        { status: 400 }
      )
    }

    // Generate unique reference
    let reference = generateReference()
    while (await prisma.businessBooking.findUnique({ where: { reference } })) {
      reference = generateReference()
    }

    // Calculate pricing
    let totalPrice: number | null = null
    let depositAmount: number | null = null

    if (data.selectedPackageId) {
      const pkg = await prisma.businessPackage.findUnique({ where: { id: data.selectedPackageId } })
      if (pkg) {
        totalPrice = pkg.pricingType === 'per_person' ? pkg.price * data.guestCount : pkg.price
      }
    } else if (data.selectedServiceId) {
      const service = await prisma.service.findUnique({ where: { id: data.selectedServiceId } })
      if (service) totalPrice = service.price
    }

    if (totalPrice && business.settings.requireDeposit) {
      depositAmount = totalPrice * (business.settings.depositPercentage / 100)
    }

    // Create or find client
    let clientId: string | undefined
    const existingClient = await prisma.client.findUnique({
      where: {
        businessId_email: {
          businessId: business.id,
          email: data.customerEmail,
        },
      },
    })

    if (existingClient) {
      clientId = existingClient.id
    } else {
      const newClient = await prisma.client.create({
        data: {
          businessId: business.id,
          name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone || null,
          source: 'website',
          tags: '["NEW"]',
        },
      })
      clientId = newClient.id
    }

    // Create booking
    const booking = await prisma.businessBooking.create({
      data: {
        reference,
        businessId: business.id,
        clientId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone || null,
        eventType: data.eventType || data.serviceType,
        eventDate: data.eventDate ? new Date(data.eventDate) : new Date(),
        eventTime: data.eventTime || null,
        venue: data.venue || null,
        guestCount: data.guestCount,
        serviceId: data.selectedServiceId || null,
        packageId: data.selectedPackageId || null,
        customizations: data.customizations || null,
        totalPrice,
        depositAmount,
        balanceAmount: depositAmount && totalPrice ? totalPrice - depositAmount : null,
        paymentMethod: 'MANUAL',
        paymentStatus: business.settings.requireDeposit ? 'AWAITING_PAYMENT' : 'PENDING',
        status: 'PENDING',
        customerNotes: data.customerNotes || null,
        agreedToTerms: data.agreedToTerms,
      },
    })

    // Create booking event
    await prisma.businessBookingEvent.create({
      data: {
        bookingId: booking.id,
        type: 'booking_created',
        note: 'Booking submitted by customer',
      },
    })

    // Create notification for business
    await prisma.businessNotification.create({
      data: {
        businessId: business.id,
        type: 'booking_new',
        title: 'New Booking!',
        message: `${data.customerName} booked ${data.eventType || 'a service'} for ${data.guestCount} guests`,
        actionUrl: `/dashboard/bookings/${booking.id}`,
      },
    })

    return NextResponse.json({
      success: true,
      reference: booking.reference,
      bookingId: booking.id,
    })
  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
