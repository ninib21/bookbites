import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Not authenticated.' }, { status: 401 })
    }

    const business = await prisma.business.findUnique({
      where: { id: session.businessId },
      include: { settings: true },
    })

    if (!business) {
      return NextResponse.json({ success: false, error: 'Business not found.' }, { status: 404 })
    }

    return NextResponse.json({ success: true, business })
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong.' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Not authenticated.' }, { status: 401 })
    }

    const body = await request.json()

    // Update business
    await prisma.business.update({
      where: { id: session.businessId },
      data: {
        name: body.businessName,
        description: body.description || null,
        phone: body.phone || null,
        address: body.address || null,
        city: body.city || null,
        state: body.state || null,
        zipCode: body.zipCode || null,
        primaryColor: body.primaryColor || '#D4A5B8',
      },
    })

    // Update settings
    await prisma.businessSettings.update({
      where: { businessId: session.businessId },
      data: {
        allowOnlineBooking: body.allowOnlineBooking,
        allowCustomOrders: body.allowCustomOrders,
        allowCatering: body.allowCatering,
        requireDeposit: body.requireDeposit,
        depositPercentage: body.depositPercentage,
      },
    })

    // Update catering profile if toggled
    if (body.allowCatering) {
      await prisma.cateringProfile.upsert({
        where: { businessId: session.businessId },
        update: { isEnabled: true },
        create: { businessId: session.businessId, isEnabled: true },
      })
    } else {
      await prisma.cateringProfile.updateMany({
        where: { businessId: session.businessId },
        data: { isEnabled: false },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong.' }, { status: 500 })
  }
}
