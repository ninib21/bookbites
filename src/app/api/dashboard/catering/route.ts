import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/dashboard/catering
export async function GET() {
  try {
    const session = await getSession()
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.cateringProfile.findUnique({
      where: { businessId: session.businessId },
    })

    return NextResponse.json({
      success: true,
      settings: profile ? {
        isEnabled: profile.isEnabled,
        minGuests: profile.minGuestCount,
        maxGuests: profile.maxGuestCount || 500,
        perHeadPrice: 0,
        includesStaff: profile.staffCount > 1,
        includesDelivery: !!profile.deliveryRadius,
        deliveryRadius: profile.deliveryRadius || 25,
        description: '',
        packages: [],
      } : null,
    })
  } catch (error) {
    console.error('Catering GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch catering settings' }, { status: 500 })
  }
}

// PUT /api/dashboard/catering
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { isEnabled, minGuests, maxGuests, perHeadPrice, includesStaff, includesDelivery, deliveryRadius, description } = body

    const profile = await prisma.cateringProfile.upsert({
      where: { businessId: session.businessId },
      update: {
        isEnabled: isEnabled ?? false,
        minGuestCount: minGuests ?? 20,
        maxGuestCount: maxGuests ?? null,
        deliveryRadius: deliveryRadius ?? null,
        staffCount: includesStaff ? 2 : 1,
      },
      create: {
        businessId: session.businessId,
        isEnabled: isEnabled ?? false,
        minGuestCount: minGuests ?? 20,
        maxGuestCount: maxGuests ?? null,
        deliveryRadius: deliveryRadius ?? null,
        staffCount: includesStaff ? 2 : 1,
      },
    })

    // Also update business settings allowCatering flag
    await prisma.businessSettings.upsert({
      where: { businessId: session.businessId },
      update: { allowCatering: isEnabled ?? false },
      create: {
        businessId: session.businessId,
        allowCatering: isEnabled ?? false,
      },
    })

    return NextResponse.json({ success: true, settings: profile })
  } catch (error) {
    console.error('Catering PUT error:', error)
    return NextResponse.json({ error: 'Failed to save catering settings' }, { status: 500 })
  }
}
