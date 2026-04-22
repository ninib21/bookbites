import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const paymentSubmittedSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required.'),
  paymentMethod: z.string().min(1, 'Payment method is required.').max(100),
  paymentReference: z.string().min(1, 'Payment reference is required.').max(150),
  note: z.string().max(1000).optional().default(''),
})

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = paymentSubmittedSchema.parse(body)

    const existingBooking = await prisma.businessBooking.findUnique({
      where: { id: parsed.bookingId },
    })

    if (!existingBooking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found.' },
        { status: 404 }
      )
    }

    if (existingBooking.paymentStatus === 'APPROVED') {
      return NextResponse.json(
        { success: false, message: 'This payment has already been approved.' },
        { status: 400 }
      )
    }

    const booking = await prisma.businessBooking.update({
      where: { id: parsed.bookingId },
      data: {
        paymentStatus: 'SUBMITTED',
        paymentMethod: parsed.paymentMethod,
        paymentReference: parsed.paymentReference,
        paymentSubmittedAt: new Date(),
      },
      select: {
        id: true,
        paymentStatus: true,
        paymentMethod: true,
        paymentReference: true,
        paymentReviewNote: true,
        paymentSubmittedAt: true,
      },
    })

    await prisma.businessBookingEvent.create({
      data: {
        bookingId: parsed.bookingId,
        type: 'payment_submitted',
        note: `Client submitted payment. Method: ${parsed.paymentMethod}. Reference: ${parsed.paymentReference}.`,
      },
    })

    // Create notification for business
    await prisma.businessNotification.create({
      data: {
        businessId: existingBooking.businessId,
        type: 'payment_submitted',
        title: 'Payment Submitted',
        message: `${existingBooking.customerName} submitted payment for booking ${existingBooking.reference}`,
        actionUrl: `/dashboard/bookings/${existingBooking.id}`,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Your payment submission was received and is now pending review.',
      booking,
    })
  } catch (error) {
    console.error('PATCH /api/booking/payment-submitted error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid request data.', errors: error.flatten() },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Unable to submit payment confirmation.' },
      { status: 500 }
    )
  }
}
