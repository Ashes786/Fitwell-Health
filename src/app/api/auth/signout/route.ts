import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Get the response object
    const response = NextResponse.json({ success: true, message: 'Signout initiated' })
    
    // Clear all NextAuth related cookies
    const cookies = request.cookies.getAll()
    cookies.forEach(cookie => {
      if (cookie.name.includes('next-auth') || cookie.name.includes('session')) {
        response.cookies.delete(cookie.name, {
          path: '/',
          domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : undefined,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        })
      }
    })
    
    // Set additional headers to ensure cookies are cleared
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Sign-out error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}