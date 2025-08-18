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
    const auditLogs = [
      {
        id: "1",
        action: "User Login",
        user: "John Doe",
        userRole: "PATIENT",
        timestamp: "2024-01-15 10:30:45",
        ipAddress: "192.168.1.100",
        status: "SUCCESS",
        details: "Successful login from web browser",
        category: "AUTHENTICATION"
      },
      {
        id: "2",
        action: "Access Health Record",
        user: "Dr. Sarah Johnson",
        userRole: "DOCTOR",
        timestamp: "2024-01-15 10:25:12",
        ipAddress: "192.168.1.101",
        status: "SUCCESS",
        details: "Accessed patient record for John Doe",
        category: "DATA_ACCESS"
      }
    ]

    return NextResponse.json({ auditLogs })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
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
    const newAuditLog = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({ auditLog: newAuditLog })
  } catch (error) {
    console.error('Error creating audit log:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}