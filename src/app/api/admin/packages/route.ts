import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET - List all packages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')

    const where: any = {}
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    const packages = await prisma.package.findMany({
      where,
      orderBy: [
        { isActive: 'desc' },
        { sortOrder: 'asc' },
      ],
    })

    return NextResponse.json({
      success: true,
      packages,
    })
  } catch (error) {
    console.error('GET /api/admin/packages error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch packages' },
      { status: 500 }
    )
  }
}

// POST - Create new package
const createPackageSchema = z.object({
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().min(1, 'Description is required').max(1000),
  price: z.number().min(0, 'Price must be positive'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  image: z.string().max(500).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().default(0),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Parse features if it's a string
    if (typeof body.features === 'string') {
      body.features = body.features.split('\n').filter((f: string) => f.trim())
    }
    
    // Convert price to number
    body.price = parseFloat(body.price)
    body.sortOrder = parseInt(body.sortOrder) || 0
    
    const parsed = createPackageSchema.parse(body)

    // Check if slug already exists
    const existing = await prisma.package.findUnique({
      where: { slug: parsed.slug },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'A package with this slug already exists' },
        { status: 400 }
      )
    }

    const pkg = await prisma.package.create({
      data: {
        ...parsed,
        features: JSON.stringify(parsed.features),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Package created successfully',
      package: pkg,
    })
  } catch (error) {
    console.error('POST /api/admin/packages error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid data', errors: error.flatten() },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create package' },
      { status: 500 }
    )
  }
}
