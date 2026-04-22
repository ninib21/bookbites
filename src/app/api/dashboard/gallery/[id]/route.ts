import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// PUT /api/dashboard/gallery/[id]
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

    const existing = await prisma.businessGalleryItem.findUnique({ where: { id } })
    if (!existing || existing.businessId !== session.businessId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const item = await prisma.businessGalleryItem.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
      },
    })

    return NextResponse.json({ success: true, item })
  } catch (error) {
    console.error('Gallery update error:', error)
    return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 })
  }
}

// DELETE /api/dashboard/gallery/[id]
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

    const existing = await prisma.businessGalleryItem.findUnique({ where: { id } })
    if (!existing || existing.businessId !== session.businessId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.businessGalleryItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Gallery delete error:', error)
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 })
  }
}
