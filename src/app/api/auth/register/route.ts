import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createSession, checkRateLimit, recordLoginAttempt, clearRateLimit } from '@/lib/auth'
import { z } from 'zod'

const registerSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
})

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug
  let counter = 1

  while (await prisma.business.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = registerSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { businessName, email, password, name } = result.data

    // Check rate limit
    if (!checkRateLimit(email)) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.businessUser.findUnique({
      where: { email },
    })

    if (existingUser) {
      recordLoginAttempt(email)
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists.' },
        { status: 409 }
      )
    }

    // Generate unique slug
    const baseSlug = slugify(businessName)
    const slug = await generateUniqueSlug(baseSlug)

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create business + user + settings in a transaction
    const business = await prisma.business.create({
      data: {
        name: businessName,
        slug,
        email,
        settings: {
          create: {
            bookingPageSlug: slug,
          },
        },
        users: {
          create: {
            email,
            password: hashedPassword,
            name: name || null,
            role: 'OWNER',
          },
        },
        cateringProfile: {
          create: {
            isEnabled: false,
          },
        },
      },
      include: {
        users: true,
      },
    })

    const user = business.users[0]

    // Create session
    await createSession(user.id)

    clearRateLimit(email)

    return NextResponse.json({
      success: true,
      data: {
        businessId: business.id,
        businessSlug: business.slug,
        requiresOnboarding: true,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
