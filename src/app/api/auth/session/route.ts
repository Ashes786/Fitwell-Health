import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      }
    })
  } catch (error) {
    console.error('Session error:', error)
    
    // If it's a JWT decryption error, clear the session by returning null
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_JWE_DECRYPTION_FAILED') {
      console.log('JWT decryption failed - clearing session')
      return NextResponse.json({ user: null }, { status: 200 })
    }
    
    return NextResponse.json({ user: null }, { status: 200 })
  }
}