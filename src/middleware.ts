import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySession } from './lib/auth'

// Protected admin routes
const protectedRoutes = [
  '/admin/dashboard',
  '/admin/leads',
  '/admin/bookings',
  '/admin/reviews',
  '/admin/settings',
  '/admin/gallery',
  '/admin/packages',
  '/admin/payments',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if this is a protected admin route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    const session = await verifySession(request)

    if (!session) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next()

  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}
