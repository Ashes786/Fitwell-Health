import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // NextAuth handles session invalidation automatically through its signOut function
    // This route is kept for compatibility but the actual signout is handled client-side
    const response = NextResponse.json({ success: true, message: 'Signout initiated' })
    return response
  } catch (error) {
    console.error('Sign-out error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}