import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/dashboard/gallery
export async function GET() {
  try {
    const session = await getSession()
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const items = await prisma.businessGalleryItem.findMany({
      where: { businessId: session.businessId },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }],
    })

    return NextResponse.json({
      success: true,
      items: items.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        category: item.category,
        isFeatured: item.isFeatured,
        sortOrder: item.sortOrder,
        createdAt: item.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Gallery GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 })
  }
}

// POST /api/dashboard/gallery
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, imageUrl, category, isFeatured } = body

    if (!title || !imageUrl || !category) {
      return NextResponse.json({ error: 'Title, image URL, and category are required' }, { status: 400 })
    }

    const item = await prisma.businessGalleryItem.create({
      data: {
        businessId: session.businessId,
        title,
        description: description || null,
        imageUrl,
        category,
        isFeatured: isFeatured ?? false,
      },
    })

    return NextResponse.json({ success: true, item })
  } catch (error) {
    console.error('Gallery POST error:', error)
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 })
  }
}
