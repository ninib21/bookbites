import { NextRequest, NextResponse } from 'next/server'
import {
  validateAdminCredentials,
  createSession,
  checkRateLimit,
  recordLoginAttempt,
  clearRateLimit,
} from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check rate limit (by IP + email combination)
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitKey = `${clientIp}:${email}`

    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in 15 minutes.' },
        { status: 429 }
      )
    }

    // Validate credentials
    const isValid = await validateAdminCredentials(email, password)

    if (!isValid) {
      recordLoginAttempt(rateLimitKey)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Clear rate limit on successful login
    clearRateLimit(rateLimitKey)

    // Create session
    await createSession(email)

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
