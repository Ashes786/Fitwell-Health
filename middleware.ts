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
  
  // Define public API routes
  const publicApiRoutes = ['/api/auth', '/api/seed', '/api/health', '/api/test-login', '/api/check-users', '/api/test-auth']
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Check if the current path is a public API route
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route))
  
  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Check if the current path is an API route
  const isApiRoute = pathname.startsWith('/api/')

  // Handle API route authentication
  if (isApiRoute && !isPublicApiRoute) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Check role-based access for protected API routes
    if (pathname.startsWith('/api/super-admin') && token.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }
    
    if (pathname.startsWith('/api/admin') && token.role !== 'ADMIN' && token.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }
  }

  // If user is not authenticated and trying to access a protected route
  if (!token && !isPublicRoute && !isPublicApiRoute) {
    const url = new URL('/auth/signin', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // If user is authenticated and trying to access auth routes
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is authenticated and accessing root path, redirect to unified dashboard
  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is trying to access role-specific dashboard URLs, redirect to unified dashboard
  if (token && pathname.startsWith('/dashboard/') && pathname !== '/dashboard') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
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
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}