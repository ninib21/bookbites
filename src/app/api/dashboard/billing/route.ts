import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/dashboard/billing
export async function GET() {
  try {
    const session = await getSession()
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const business = await prisma.business.findUnique({
      where: { id: session.businessId },
      select: {
        subscriptionTier: true,
        subscriptionStatus: true,
        subscriptionExpiresAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      subscription: {
        plan: business?.subscriptionTier?.toLowerCase() || 'free',
        status: business?.subscriptionStatus?.toLowerCase() || 'active',
        currentPeriodEnd: business?.subscriptionExpiresAt?.toISOString() || null,
        trialEnd: null,
      },
    })
  } catch (error) {
    console.error('Billing GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch billing info' }, { status: 500 })
  }
}
