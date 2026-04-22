import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// PUT /api/dashboard/reviews/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const existing = await prisma.businessReview.findUnique({ where: { id } })
    if (!existing || existing.businessId !== session.businessId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const review = await prisma.businessReview.update({
      where: { id },
      data: {
        ...(body.isApproved !== undefined && { isApproved: body.isApproved }),
        ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
      },
    })

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error('Review update error:', error)
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}

// DELETE /api/dashboard/reviews/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.businessReview.findUnique({ where: { id } })
    if (!existing || existing.businessId !== session.businessId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.businessReview.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Review delete error:', error)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
