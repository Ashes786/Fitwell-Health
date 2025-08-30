import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({ success: true })
    
    // Note: NextAuth handles session invalidation automatically
    // No need to manually clear cookies as NextAuth manages its own cookies

    return response
  } catch (error) {
    console.error('Sign-out error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}