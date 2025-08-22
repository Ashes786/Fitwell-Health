import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/auth/signin', '/auth/signup', '/auth/forgot-password']
  
  // Define auth routes that should redirect authenticated users
  const authRoutes = ['/auth/signin', '/auth/signup']
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // If user is not authenticated and trying to access a protected route
  if (!token && !isPublicRoute) {
    const url = new URL('/auth/signin', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // If user is authenticated and trying to access auth routes
  if (token && isAuthRoute) {
    // Redirect to role-specific dashboard
    const userRole = token.role as string
    let redirectUrl = '/dashboard'
    
    // Map roles to their specific dashboard pages
    switch (userRole) {
      case 'SUPER_ADMIN':
        redirectUrl = '/dashboard/super-admin'
        break
      case 'ADMIN':
        redirectUrl = '/dashboard/admin'
        break
      case 'DOCTOR':
        redirectUrl = '/dashboard/doctor'
        break
      case 'PATIENT':
        redirectUrl = '/dashboard/patient'
        break
      case 'ATTENDANT':
        redirectUrl = '/dashboard/attendant'
        break
      case 'CONTROL_ROOM':
        redirectUrl = '/dashboard/control-room'
        break
      default:
        redirectUrl = '/dashboard'
    }
    
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  // If user is authenticated and accessing root path, redirect to role-specific dashboard
  if (token && pathname === '/') {
    const userRole = token.role as string
    let redirectUrl = '/dashboard'
    
    // Map roles to their specific dashboard pages
    switch (userRole) {
      case 'SUPER_ADMIN':
        redirectUrl = '/dashboard/super-admin'
        break
      case 'ADMIN':
        redirectUrl = '/dashboard/admin'
        break
      case 'DOCTOR':
        redirectUrl = '/dashboard/doctor'
        break
      case 'PATIENT':
        redirectUrl = '/dashboard/patient'
        break
      case 'ATTENDANT':
        redirectUrl = '/dashboard/attendant'
        break
      case 'CONTROL_ROOM':
        redirectUrl = '/dashboard/control-room'
        break
      default:
        redirectUrl = '/dashboard'
    }
    
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  // Add performance headers to the response
  const response = NextResponse.next()
  
  // Add caching headers for static assets
  if (request.nextUrl.pathname.startsWith('/_next/static')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  // Add caching headers for images
  if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    response.headers.set('Cache-Control', 'public, max-age=86400')
  }
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  return response
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}