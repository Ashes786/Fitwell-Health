import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { NotificationHelpers } from '@/lib/notification-helpers'

export async function GET() {
  try {
    console.log('GET /api/super-admin/admins called')
    const session = await getServerSession(authOptions)
    console.log('Session:', session)
    
    if (!session?.user?.role || session.user.role !== 'SUPER_ADMIN') {
      console.log('Unauthorized access attempt:', session)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Optimized query with minimal includes and better selection
    const admins = await db.admin.findMany({
      select: {
        id: true,
        networkName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true
          }
        }
        // Removed complex includes that were causing performance issues
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 25 // Reduced limit for better performance
    })

    console.log('Admins found:', admins.length)
    return NextResponse.json(admins)
  } catch (error) {
    console.error('Error fetching admins:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.role || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, password, networkName, phone } = body

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 })
    }

    // Get super admin
    const superAdmin = await db.superAdmin.findFirst()
    if (!superAdmin) {
      return NextResponse.json({ message: 'Super admin not found' }, { status: 404 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user and admin in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
          role: UserRole.ADMIN
        }
      })

      // Create admin with default permissions
      const admin = await tx.admin.create({
        data: {
          userId: user.id,
          networkName,
          createdBy: superAdmin.id,
          permissions: JSON.stringify({
            // Default native permissions for all admins
            userManagement: true,
            appointments: true,
            billing: true,
            reports: true,
            patients: true,
            doctors: true,
            subscriptions: true,
            analytics: true
          })
        }
      })

      return { user, admin }
    })

    // Trigger notification for new admin creation
    await NotificationHelpers.onAdminCreated(
      name,
      session.user.name || session.user.email || 'Super Admin',
      'ADMIN'
    )

    return NextResponse.json({ 
      message: 'Admin created successfully',
      admin: result.admin 
    })
  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}