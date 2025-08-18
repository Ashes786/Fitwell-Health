import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { hasPermission } from '@/lib/rbac'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user.role, 'view_dashboard')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get admin ID from session
    const admin = await db.admin.findFirst({
      where: { userId: session.user.id }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Get network users
    const networkUsers = await db.networkUser.findMany({
      where: { adminId: admin.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        }
      },
      orderBy: { joinedAt: 'desc' }
    })

    // Get network partners
    const networkPartners = await db.networkPartner.findMany({
      where: { adminId: admin.id },
      include: {
        labPartner: true,
        pharmacyPartner: true,
        hospitalPartner: true
      },
      orderBy: { addedAt: 'desc' }
    })

    return NextResponse.json({
      users: networkUsers,
      partners: networkPartners
    })
  } catch (error) {
    console.error('Error fetching network data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user.role, 'view_dashboard')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const admin = await db.admin.findFirst({
      where: { userId: session.user.id }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    const body = await request.json()
    const { type, userId, partnerId, partnerType } = body

    if (type === 'user') {
      if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
      }

      // Check if user is already in network
      const existingNetworkUser = await db.networkUser.findUnique({
        where: {
          adminId_userId: {
            adminId: admin.id,
            userId: userId
          }
        }
      })

      if (existingNetworkUser) {
        return NextResponse.json({ error: 'User already in network' }, { status: 400 })
      }

      // Get user details
      const user = await db.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const networkUser = await db.networkUser.create({
        data: {
          adminId: admin.id,
          userId: userId,
          userType: user.role
        }
      })

      return NextResponse.json(networkUser, { status: 201 })
    } else if (type === 'partner') {
      if (!partnerId || !partnerType) {
        return NextResponse.json({ error: 'Partner ID and type are required' }, { status: 400 })
      }

      // Check if partner is already in network
      const existingNetworkPartner = await db.networkPartner.findUnique({
        where: {
          adminId_partnerId: {
            adminId: admin.id,
            partnerId: partnerId
          }
        }
      })

      if (existingNetworkPartner) {
        return NextResponse.json({ error: 'Partner already in network' }, { status: 400 })
      }

      const networkPartner = await db.networkPartner.create({
        data: {
          adminId: admin.id,
          partnerType: partnerType,
          partnerId: partnerId
        }
      })

      return NextResponse.json(networkPartner, { status: 201 })
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error adding to network:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}