import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    // Get token from cookie
    const cookieHeader = request.headers.get('cookie')
    const token = cookieHeader?.split('auth-token=')[1]?.split(';')[0]

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret-for-development") as any
    
    // Get fresh user data
    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      }
    })

    if (!user || !user.isActive) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}