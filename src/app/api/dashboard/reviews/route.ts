import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/dashboard/reviews
export async function GET() {
  try {
    const session = await getSession()
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reviews = await prisma.businessReview.findMany({
      where: { businessId: session.businessId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      reviews: reviews.map((r: any) => ({
        id: r.id,
        customerName: r.customerName,
        rating: r.rating,
        comment: r.comment,
        imageUrl: r.imageUrl,
        isApproved: r.isApproved,
        isFeatured: r.isFeatured,
        source: r.source,
        createdAt: r.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Reviews GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

// POST /api/dashboard/reviews - Add manual review
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { customerName, rating, comment, source } = body

    if (!customerName || !rating || !comment) {
      return NextResponse.json({ error: 'Customer name, rating, and comment are required' }, { status: 400 })
    }

    const review = await prisma.businessReview.create({
      data: {
        businessId: session.businessId,
        customerName,
        rating: parseInt(rating),
        comment,
        source: source || 'manual',
        isApproved: true,
      },
    })

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error('Reviews POST error:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
