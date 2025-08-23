import { db } from '@/lib/db'

export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      },
      take: 10
    })

    return Response.json({
      success: true,
      count: users.length,
      users: users,
      message: users.length > 0 ? "Users found in database" : "No users found in database"
    })
  } catch (error) {
    console.error("Error checking users:", error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to check users"
    }, { status: 500 })
  }
}