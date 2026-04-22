import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const business = await prisma.business.findUnique({
      where: { slug, isActive: true },
      include: {
        settings: {
          select: {
            allowOnlineBooking: true,
            allowCustomOrders: true,
            allowCatering: true,
            requireDeposit: true,
            depositPercentage: true,
          },
        },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            customerName: true,
            rating: true,
            comment: true,
            isFeatured: true,
          },
        },
        galleryItems: {
          where: { isFeatured: true },
          orderBy: { sortOrder: 'asc' },
          take: 8,
          select: {
            id: true,
            title: true,
            imageUrl: true,
            category: true,
            isFeatured: true,
          },
        },
        services: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
          },
        },
      },
    })

    if (!business) {
      return NextResponse.json(
        { success: false, error: 'Business not found.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, business })
  } catch (error) {
    console.error('Business fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Something went wrong.' },
      { status: 500 }
    )
  }
}
