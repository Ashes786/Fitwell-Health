import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    console.log("Custom sign-in attempt for:", email)
    
    // Find user by email
    const user = await db.user.findFirst({
      where: {
        email: email
      },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        isActive: true,
      }
    })

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'User not found or inactive' }, { status: 404 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Return user data (the actual JWT token will be handled by NextAuth)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: "Authentication successful. Please use NextAuth for session management."
    })
  } catch (error) {
    console.error('Custom sign-in error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}