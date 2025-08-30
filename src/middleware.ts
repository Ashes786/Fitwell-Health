import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// Force this middleware to run in Node.js runtime
export const runtime = 'nodejs'

export async function middleware(request: NextRequest) {
  // Get token from cookie
  const cookieHeader = request.headers.get('cookie')
  const token = cookieHeader?.split('auth-token=')[1]?.split(';')[0]
  
  console.log('Middleware - Token from cookie:', token ? 'Present' : 'Missing')
  
  let decodedToken = null
  
  if (token) {
    try {
      decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret-for-development")
      console.log('Middleware - Token decoded successfully:', decodedToken.role)
    } catch (error) {
      // Token is invalid, continue as unauthenticated
      console.log('Middleware - Invalid JWT token:', error.message)
    }
  }
  
  const { pathname } = request.nextUrl

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/auth/signin', '/auth/signup', '/auth/forgot-password']
  
  // Define auth routes that should redirect authenticated users
  const authRoutes = ['/auth/signin', '/auth/signup']
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Only redirect to signin if trying to access dashboard routes without authentication
  const isDashboardRoute = pathname.startsWith('/dashboard')
  
  if (!decodedToken && isDashboardRoute) {
    const url = new URL('/auth/signin', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (decodedToken && isAuthRoute) {
    const userRole = decodedToken.role as string
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

  // If user is authenticated and accessing root dashboard path, redirect to role-specific dashboard
  if (decodedToken && pathname === '/dashboard') {
    const userRole = decodedToken.role as string
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

  // Allow the request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}