import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyEmailToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Verification token is required.' },
        { status: 400 }
      )
    }

    const result = await verifyEmailToken(token)

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification token.' },
        { status: 400 }
      )
    }

    if (result.type === 'email_verification') {
      // Mark user's email as verified
      await prisma.businessUser.updateMany({
        where: { email: result.email },
        data: { emailVerified: new Date() },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully.',
    })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Something went wrong.' },
      { status: 500 }
    )
  }
}
