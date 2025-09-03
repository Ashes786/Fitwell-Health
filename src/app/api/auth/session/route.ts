import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    console.log('Session API called')
    const session = await getServerSession(authOptions)
    console.log('Session retrieved:', session)

    if (!session) {
      console.log('No session found, returning null user')
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const response = {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      }
    }
    
    console.log('Returning session response:', response)
    return NextResponse.json(response)
  } catch (error) {
    console.error('Session error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    // If it's a JWT decryption error, clear the session by returning null
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_JWE_DECRYPTION_FAILED') {
      console.log('JWT decryption failed - clearing session')
      return NextResponse.json({ user: null }, { status: 200 })
    }
    
    // For any other error, return null user
    console.log('General error - returning null user')
    return NextResponse.json({ user: null }, { status: 200 })
  }
}