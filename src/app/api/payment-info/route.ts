import { NextResponse } from 'next/server'
import { getManualPaymentSettings, buildManualPaymentLines } from '@/lib/payment-settings'

export async function GET() {
  try {
    const settings = await getManualPaymentSettings()

    return NextResponse.json({
      success: true,
      paymentMethods: buildManualPaymentLines(settings),
      settings,
    })
  } catch (error) {
    console.error('GET /api/payment-info failed:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Unable to load payment information.',
      },
      { status: 500 }
    )
  }
}
