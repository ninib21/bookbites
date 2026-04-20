import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const SESSION_COOKIE = 'admin_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// Hash password with bcrypt
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12) // 12 rounds for security
  return bcrypt.hash(password, salt)
}

// Verify password
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

// Generate secure session token
const generateSessionToken = (): string => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

// Create session
export const createSession = async (email: string): Promise<string> => {
  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  // Store session in cookie
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: expiresAt,
    path: '/',
  })

  // Store session data (in production, use Redis or database)
  // For now, we'll store in a simple in-memory map (resets on server restart)
  sessions.set(token, {
    email,
    expiresAt,
    createdAt: new Date(),
  })

  return token
}

// Simple in-memory session store (replace with Redis in production)
const sessions = new Map<
  string,
  {
    email: string
    expiresAt: Date
    createdAt: Date
  }
>()

// Verify session
export const verifySession = async (
  request: NextRequest
): Promise<{ email: string } | null> => {
  const token = request.cookies.get(SESSION_COOKIE)?.value

  if (!token) {
    return null
  }

  const session = sessions.get(token)

  if (!session) {
    return null
  }

  // Check if session is expired
  if (new Date() > session.expiresAt) {
    sessions.delete(token)
    return null
  }

  return { email: session.email }
}

// Verify session from cookies (server components)
export const verifySessionFromCookies = async (): Promise<{
  email: string
} | null> => {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (!token) {
    return null
  }

  const session = sessions.get(token)

  if (!session || new Date() > session.expiresAt) {
    if (session) sessions.delete(token)
    return null
  }

  return { email: session.email }
}

// Destroy session (logout)
export const destroySession = async (): Promise<void> => {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (token) {
    sessions.delete(token)
  }

  cookieStore.delete(SESSION_COOKIE)
}

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; resetAt: Date }>()

export const checkRateLimit = (identifier: string): boolean => {
  const now = new Date()
  const attempt = loginAttempts.get(identifier)

  // Reset after 15 minutes
  if (attempt && now > attempt.resetAt) {
    loginAttempts.delete(identifier)
  }

  const current = loginAttempts.get(identifier)

  if (current && current.count >= 5) {
    return false // Rate limited
  }

  return true // Allowed
}

export const recordLoginAttempt = (identifier: string): void => {
  const now = new Date()
  const existing = loginAttempts.get(identifier)

  if (existing) {
    existing.count += 1
  } else {
    loginAttempts.set(identifier, {
      count: 1,
      resetAt: new Date(now.getTime() + 15 * 60 * 1000), // 15 minutes
    })
  }
}

// Clear rate limit (on successful login)
export const clearRateLimit = (identifier: string): void => {
  loginAttempts.delete(identifier)
}

// Validate admin credentials
export const validateAdminCredentials = async (
  email: string,
  password: string
): Promise<boolean> => {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

  if (!adminEmail || !adminPasswordHash) {
    console.error('Admin credentials not configured')
    return false
  }

  if (email !== adminEmail) {
    return false
  }

  return verifyPassword(password, adminPasswordHash)
}

// Initialize admin password hash (run once to generate hash)
export const generateAdminPasswordHash = async (): Promise<string> => {
  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    throw new Error('ADMIN_PASSWORD not set in environment')
  }
  return hashPassword(password)
}
