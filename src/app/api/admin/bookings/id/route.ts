import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendBookingApprovalToClient, sendBookingDeclineToClient } from '@/lib/email'

// PATCH - Update booking status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, paymentStatus, adminNotes } = body

    // Get current booking to determine previous status
    const currentBooking = await prisma.booking.findUnique({
      where: { id },
    })

    if (!currentBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Create booking event for timeline
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
        BookingEvent: {
          create: {
            status: status || currentBooking.status,
            note: `Status updated to ${status || paymentStatus}`,
          },
        },
      },
      include: {
        BookingEvent: true,
      },
    })

    // Send email notification to customer about status change
    if (status === 'confirmed' && currentBooking.status !== 'confirmed') {
      try {
        await sendBookingApprovalToClient({
          reference: booking.reference,
          name: booking.customerName,
          email: booking.customerEmail,
          eventType: booking.eventType,
          eventDate: booking.eventDate,
          adminNotes: adminNotes || undefined,
        })
      } catch (emailError) {
        console.error('Failed to send booking approval email:', emailError)
      }
    } else if (status === 'declined' && currentBooking.status !== 'declined') {
      try {
        await sendBookingDeclineToClient({
          reference: booking.reference,
          name: booking.customerName,
          email: booking.customerEmail,
          eventType: booking.eventType,
          eventDate: booking.eventDate,
          adminNotes: adminNotes || undefined,
        })
      } catch (emailError) {
        console.error('Failed to send booking decline email:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      booking,
    })
  } catch (error) {
    console.error('Update booking error:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}
