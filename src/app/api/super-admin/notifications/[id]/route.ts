import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'read') {
      // Mark notification as read
      // In a real app, you would update the notification in the database
      // For now, we'll just return success
      return NextResponse.json({ 
        id, 
        status: 'READ', 
        readAt: new Date().toISOString(),
        message: 'Notification marked as read'
      })
    }

    if (action === 'archive') {
      // Archive notification
      return NextResponse.json({ 
        id, 
        status: 'ARCHIVED', 
        archivedAt: new Date().toISOString(),
        message: 'Notification archived'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // In a real app, you would delete the notification from the database
    // For now, we'll just return success
    return NextResponse.json({ 
      id, 
      message: 'Notification deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 })
  }
}