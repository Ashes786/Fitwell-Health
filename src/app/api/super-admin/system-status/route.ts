import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    // Authentication is now handled by middleware
    console.log('Authentication verified by middleware for system-status')
    
    // Optimize query with better selection and limit
    const systemStatus = await db.systemStatus.findMany({
      orderBy: {
        lastChecked: 'desc'
      },
      take: 20 // Limit results for better performance
    })

    return NextResponse.json(systemStatus)
  } catch (error) {
    console.error('Error fetching system status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { serviceName, status, responseTime, message } = await request.json()

    if (!serviceName || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get super admin ID
    const superAdmin = await db.superAdmin.findFirst({
      where: { userId: session.user.id }
    })

    if (!superAdmin) {
      return NextResponse.json({ error: 'Super admin not found' }, { status: 404 })
    }

    // Check if status for this service already exists
    const existingStatus = await db.systemStatus.findFirst({
      where: { 
        superAdminId: superAdmin.id,
        serviceName 
      }
    })

    let systemStatus
    if (existingStatus) {
      systemStatus = await db.systemStatus.update({
        where: { id: existingStatus.id },
        data: {
          status,
          responseTime,
          message,
          lastChecked: new Date()
        }
      })
    } else {
      systemStatus = await db.systemStatus.create({
        data: {
          superAdminId: superAdmin.id,
          serviceName,
          status,
          responseTime,
          message
        }
      })
    }

    return NextResponse.json(systemStatus)
  } catch (error) {
    console.error('Error updating system status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}