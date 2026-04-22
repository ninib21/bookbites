/**
 * BookBites SaaS - Multi-Tenant Authentication
 *
 * JWT-based session management for business users.
 * Sessions are stored in the BusinessSession table (DB-backed).
 */

import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'
import type { BusinessSessionData, UserRole, SubscriptionTier } from '@/types'

const SESSION_COOKIE = 'bb_session'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

// ─── Password helpers ─────────────────────────────────────────────

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

// ─── Session token generation ─────────────────────────────────────

const generateSessionToken = (): string => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

// ─── Create session ───────────────────────────────────────────────

export const createSession = async (userId: string): Promise<string> => {
  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  await prisma.businessSession.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })

  return token
}

// ─── Get session data (from request) ──────────────────────────────

export const getSession = async (
  request?: NextRequest
): Promise<BusinessSessionData | null> => {
  let token: string | undefined

  if (request) {
    token = request.cookies.get(SESSION_COOKIE)?.value
  } else {
    const cookieStore = await cookies()
    token = cookieStore.get(SESSION_COOKIE)?.value
  }

  if (!token) return null

  const session = await prisma.businessSession.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          business: {
            select: {
              id: true,
              name: true,
              slug: true,
              subscriptionTier: true,
            },
          },
        },
      },
    },
  })

  if (!session) return null

  // Check expiry
  if (new Date() > session.expiresAt) {
    await prisma.businessSession.delete({ where: { id: session.id } })
    return null
  }

  // Check user is active
  if (!session.user.isActive) {
    await prisma.businessSession.delete({ where: { id: session.id } })
    return null
  }

  return {
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role as UserRole,
    businessId: session.user.businessId,
    businessName: session.user.business.name,
    businessSlug: session.user.business.slug,
    subscriptionTier: session.user.business.subscriptionTier as SubscriptionTier,
  }
}

// ─── Destroy session ──────────────────────────────────────────────

export const destroySession = async (): Promise<void> => {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (token) {
    await prisma.businessSession.deleteMany({ where: { token } })
  }

  cookieStore.delete(SESSION_COOKIE)
}

// ─── Clean up expired sessions ────────────────────────────────────

export const cleanupExpiredSessions = async (): Promise<void> => {
  await prisma.businessSession.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  })
}

// ─── Rate limiting (in-memory, replace with Redis in prod) ────────

const loginAttempts = new Map<string, { count: number; resetAt: Date }>()

export const checkRateLimit = (identifier: string): boolean => {
  const now = new Date()
  const attempt = loginAttempts.get(identifier)

  if (attempt && now > attempt.resetAt) {
    loginAttempts.delete(identifier)
  }

  const current = loginAttempts.get(identifier)
  if (current && current.count >= 5) {
    return false
  }

  return true
}

export const recordLoginAttempt = (identifier: string): void => {
  const now = new Date()
  const existing = loginAttempts.get(identifier)

  if (existing) {
    existing.count += 1
  } else {
    loginAttempts.set(identifier, {
      count: 1,
      resetAt: new Date(now.getTime() + 15 * 60 * 1000),
    })
  }
}

export const clearRateLimit = (identifier: string): void => {
  loginAttempts.delete(identifier)
}

// ─── Verification tokens ──────────────────────────────────────────

export const generateVerificationToken = async (
  email: string,
  type: string = 'email_verification'
): Promise<string> => {
  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  await prisma.verificationToken.create({
    data: {
      email,
      token,
      type,
      expiresAt,
    },
  })

  return token
}

export const verifyEmailToken = async (
  token: string
): Promise<{ email: string; type: string } | null> => {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!record) return null

  // Check expiry
  if (new Date() > record.expiresAt) {
    await prisma.verificationToken.delete({ where: { id: record.id } })
    return null
  }

  // Check already used
  if (record.usedAt) return null

  // Mark as used
  await prisma.verificationToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  })

  return { email: record.email, type: record.type }
}
