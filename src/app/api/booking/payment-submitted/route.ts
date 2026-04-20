import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendPaymentSubmissionNotificationToAdmin } from '@/lib/email'

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

    const existingBooking = await prisma.booking.findUnique({
      where: { id: parsed.bookingId },
    })

    if (!existingBooking) {
      return NextResponse.json(
        {
          success: false,
          message: 'Booking not found.',
        },
        { status: 404 }
      )
    }

    if (existingBooking.paymentStatus === 'approved') {
      return NextResponse.json(
        {
          success: false,
          message: 'This payment has already been approved.',
        },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.update({
      where: { id: parsed.bookingId },
      data: {
        paymentStatus: 'submitted',
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

    await prisma.bookingEvent.create({
      data: {
        bookingId: parsed.bookingId,
        type: 'payment_submitted',
        note: parsed.note?.trim()
          ? `Client submitted payment. Method: ${parsed.paymentMethod}. Reference: ${parsed.paymentReference}. Note: ${parsed.note}`
          : `Client submitted payment. Method: ${parsed.paymentMethod}. Reference: ${parsed.paymentReference}.`,
      },
    })

    // Send notification email to admin
    try {
      await sendPaymentSubmissionNotificationToAdmin({
        reference: existingBooking.reference,
        customerName: existingBooking.customerName,
        customerEmail: existingBooking.customerEmail,
        paymentMethod: parsed.paymentMethod,
        notes: parsed.note,
      })
    } catch (emailError) {
      console.error('Failed to send payment submission email:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Your payment submission was received and is now pending review.',
      booking,
    })
  } catch (error) {
    console.error('PATCH /api/booking/payment-submitted error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request data.',
          errors: error.flatten(),
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Unable to submit payment confirmation.',
      },
      { status: 500 }
    )
  }
}
