import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getManualPaymentSettings, upsertManualPaymentSettings } from '@/lib/payment-settings'

const paymentSettingsSchema = z.object({
  cashAppTag: z.string().max(100).optional(),
  chimeTag: z.string().max(100).optional(),
  applePayValue: z.string().max(150).optional(),
  applePayLabel: z.string().max(50).optional(),
  instructions: z.string().max(2000).optional(),
  depositNote: z.string().max(500).optional(),
  isCashAppEnabled: z.boolean().optional(),
  isChimeEnabled: z.boolean().optional(),
  isApplePayEnabled: z.boolean().optional(),
})

export async function GET() {
  try {
    const settings = await getManualPaymentSettings()

    return NextResponse.json({
      success: true,
      settings,
    })
  } catch (error) {
    console.error('GET /api/admin/settings/payment failed:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Unable to load payment settings.',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = paymentSettingsSchema.parse(body)

    const settings = await upsertManualPaymentSettings(parsed)

    return NextResponse.json({
      success: true,
      message: 'Payment settings updated successfully.',
      settings,
    })
  } catch (error) {
    console.error('PATCH /api/admin/settings/payment failed:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid payment settings payload.',
          errors: error.flatten(),
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Unable to update payment settings.',
      },
      { status: 500 }
    )
  }
}
