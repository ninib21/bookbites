import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPaymentDeclineToClient } from '@/lib/email'

// POST - Reject payment and request again
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { reason } = body

    // Get current booking
    const currentBooking = await prisma.booking.findUnique({
      where: { id },
    })

    if (!currentBooking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    if (currentBooking.paymentStatus !== 'submitted') {
      return NextResponse.json(
        { success: false, message: 'Payment is not in submitted status' },
        { status: 400 }
      )
    }

    // Update booking - reset to pending payment
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        paymentStatus: 'declined',
        paymentReviewedAt: new Date(),
        paymentReviewNote: reason,
        BookingEvent: {
          create: {
            type: 'payment_declined',
            note: `Payment declined. Reason: ${reason || 'No reason provided'}. Client needs to resubmit.`,
          },
        },
      },
      include: {
        BookingEvent: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    // Send email to client about payment rejection
    try {
      await sendPaymentDeclineToClient({
        reference: booking.reference,
        name: booking.customerName,
        email: booking.customerEmail,
        reason,
      })
    } catch (emailError) {
      console.error('Failed to send payment decline email:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Payment rejected. Client can resubmit.',
      booking,
    })
  } catch (error) {
    console.error('Reject payment error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to reject payment' },
      { status: 500 }
    )
  }
}
