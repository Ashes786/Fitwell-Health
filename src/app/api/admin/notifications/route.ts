import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission } from '@/lib/rbac'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user.role, 'manage_users')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Mock data for demonstration
    const notifications = [
      {
        id: "1",
        title: "System Maintenance Scheduled",
        message: "Scheduled maintenance will occur on January 20, 2024 from 2:00 AM to 4:00 AM EST",
        type: "INFO",
        recipient: "All Users",
        recipientType: "ALL",
        status: "SENT",
        timestamp: "2024-01-15 10:00:00",
        priority: "MEDIUM",
        channel: "EMAIL"
      },
      {
        id: "2",
        title: "New Feature Available",
        message: "The new telemedicine feature is now available for all doctors",
        type: "SUCCESS",
        recipient: "Doctors",
        recipientType: "ROLE",
        status: "SENT",
        timestamp: "2024-01-14 15:30:00",
        priority: "LOW",
        channel: "IN_APP"
      }
    ]

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user.role, 'manage_users')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    
    // Mock response for demonstration
    const newNotification = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({ notification: newNotification })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}