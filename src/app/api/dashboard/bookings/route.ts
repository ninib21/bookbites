import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Not authenticated.' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const search = searchParams.get('search')

    const where: any = { businessId: session.businessId }
    if (status && status !== 'ALL') where.status = status
    if (paymentStatus && paymentStatus !== 'ALL') where.paymentStatus = paymentStatus
    if (search) {
      where.OR = [
        { customerName: { contains: search } },
        { customerEmail: { contains: search } },
        { reference: { contains: search } },
      ]
    }

    const bookings = await prisma.businessBooking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        reference: true,
        customerName: true,
        customerEmail: true,
        eventType: true,
        eventDate: true,
        guestCount: true,
        status: true,
        paymentStatus: true,
        totalPrice: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: bookings.map((b: any) => ({
        ...b,
        eventDate: b.eventDate.toISOString(),
        createdAt: b.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Bookings fetch error:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong.' }, { status: 500 })
  }
}
