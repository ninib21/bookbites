import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET - List all gallery items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isFeatured = searchParams.get('isFeatured')

    const where: any = {}
    if (category && category !== 'all') {
      where.category = category
    }
    if (isFeatured !== null) {
      where.isFeatured = isFeatured === 'true'
    }

    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({
      success: true,
      items,
    })
  } catch (error) {
    console.error('GET /api/admin/gallery error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch gallery items' },
      { status: 500 }
    )
  }
}

// POST - Create new gallery item
const createGallerySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(500).optional(),
  imageUrl: z.string().min(1, 'Image URL is required'),
  category: z.string().min(1, 'Category is required'),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().default(0),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createGallerySchema.parse(body)

    const item = await prisma.galleryItem.create({
      data: parsed,
    })

    return NextResponse.json({
      success: true,
      message: 'Gallery item created successfully',
      item,
    })
  } catch (error) {
    console.error('POST /api/admin/gallery error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid data', errors: error.flatten() },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create gallery item' },
      { status: 500 }
    )
  }
}
