import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    // Find user by email
    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: email },
          { phone: email }
        ]
      },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        isActive: true
      }
    })

    if (!user || !user.isActive) {
      return Response.json({
        success: false,
        error: "User not found or inactive",
        message: "Invalid credentials"
      })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return Response.json({
        success: false,
        error: "Invalid password",
        message: "Invalid credentials"
      })
    }

    // Return user info (without password)
    return Response.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      message: "Authentication successful"
    })
  } catch (error) {
    console.error("Test login error:", error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Test login failed"
    }, { status: 500 })
  }
}