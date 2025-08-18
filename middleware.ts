import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add performance headers
  const response = NextResponse.next()
  
  // Add caching headers for static assets
  if (request.nextUrl.pathname.startsWith('/_next/static')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  // Add caching headers for images
  if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    response.headers.set('Cache-Control', 'public, max-age=86400')
  }
  
  // Add performance headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}