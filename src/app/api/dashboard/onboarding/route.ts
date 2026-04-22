import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const step1Schema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
})

const step2Schema = z.object({
  allowOnlineBooking: z.boolean().default(true),
  allowCustomOrders: z.boolean().default(true),
  allowCatering: z.boolean().default(false),
})

const step3Schema = z.object({
  paymentMethods: z.array(z.string()).min(1),
  cashAppTag: z.string().optional(),
  cryptoWalletAddress: z.string().optional(),
})

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ success: false, error: 'Not authenticated.' }, { status: 401 })
    }

    const body = await request.json()
    const { step, data } = body

    if (!step || !data) {
      return NextResponse.json({ success: false, error: 'Step and data are required.' }, { status: 400 })
    }

    const businessId = session.businessId

    if (step === 1) {
      const result = step1Schema.safeParse(data)
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error.errors[0].message }, { status: 400 })
      }

      await prisma.business.update({
        where: { id: businessId },
        data: {
          address: result.data.address || null,
          city: result.data.city || null,
          state: result.data.state || null,
          zipCode: result.data.zipCode || null,
          phone: result.data.phone || null,
          description: result.data.description || null,
        },
      })
    } else if (step === 2) {
      const result = step2Schema.safeParse(data)
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error.errors[0].message }, { status: 400 })
      }

      await prisma.businessSettings.update({
        where: { businessId },
        data: {
          allowOnlineBooking: result.data.allowOnlineBooking,
          allowCustomOrders: result.data.allowCustomOrders,
          allowCatering: result.data.allowCatering,
        },
      })

      // If catering is enabled, update the catering profile
      if (result.data.allowCatering) {
        await prisma.cateringProfile.update({
          where: { businessId },
          data: { isEnabled: true },
        })
      }
    } else if (step === 3) {
      const result = step3Schema.safeParse(data)
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error.errors[0].message }, { status: 400 })
      }

      await prisma.business.update({
        where: { id: businessId },
        data: {
          cashAppTag: result.data.cashAppTag || null,
          cryptoWalletAddress: result.data.cryptoWalletAddress || null,
        },
      })
    } else {
      return NextResponse.json({ success: false, error: 'Invalid step.' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong.' }, { status: 500 })
  }
}
