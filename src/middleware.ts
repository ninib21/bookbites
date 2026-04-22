import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE = 'bb_session'

// Routes that require business user authentication
const protectedRoutes = [
  '/dashboard',
  '/dashboard/bookings',
  '/dashboard/orders',
  '/dashboard/clients',
  '/dashboard/menu',
  '/dashboard/catering',
  '/dashboard/finance',
  '/dashboard/gallery',
  '/dashboard/reviews',
  '/dashboard/settings',
  '/dashboard/onboarding',
  '/dashboard/billing',
  '/dashboard/notifications',
]

// Routes accessible only to unauthenticated users
const authRoutes = ['/login', '/register', '/verify', '/reset-password']

// Admin routes requiring admin session
const adminRoutes = ['/admin']

// Public business pages (no auth needed)
const publicBusinessRoutes = ['/b/']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip public business pages
  const isPublicBusinessPage = publicBusinessRoutes.some((route) => pathname.startsWith(route))
  if (isPublicBusinessPage) {
    const response = NextResponse.next()
    setSecurityHeaders(response)
    return response
  }

  // Check if this is a protected dashboard route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  // Dashboard API routes require auth
  const isDashboardApi = pathname.startsWith('/api/dashboard')

  if (isProtectedRoute || isDashboardApi) {
    // Check if session cookie exists (lightweight check, no DB)
    // API routes do their own full getSession() validation
    const sessionToken = request.cookies.get(SESSION_COOKIE)?.value

    if (!sessionToken) {
      // For API routes, return 401
      if (isDashboardApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Add business context headers placeholder (actual validation done in API route)
    if (isDashboardApi) {
      const response = NextResponse.next()
      setSecurityHeaders(response)
      return response
    }
  }

  // Admin routes - check for admin session cookie
  if (isAdminRoute) {
    const adminToken = request.cookies.get('admin_session')?.value

    if (!adminToken) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute) {
    const sessionToken = request.cookies.get(SESSION_COOKIE)?.value

    if (sessionToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next()
  setSecurityHeaders(response)
  return response
}

function setSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/verify',
    '/reset-password',
    '/b/:path*',
  ],
}
