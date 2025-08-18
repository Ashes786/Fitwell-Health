import { NextRequest, NextResponse } from 'next/server'

// This is an internal API endpoint that should be protected
// In production, you would want to add proper authentication
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'internal-key'

export async function POST(request: NextRequest) {
  try {
    // Verify internal API key
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    if (token !== INTERNAL_API_KEY) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { notification, targetRole } = body

    if (!notification) {
      return NextResponse.json({ error: 'Notification data required' }, { status: 400 })
    }

    // Import socket.io dynamically to avoid server-side issues
    const { Server } = await import('socket.io')
    
    // Get the socket.io server instance from the global scope
    // This assumes you have a global socket.io server instance
    const globalWithIo = global as typeof globalThis & {
      io?: any
    }

    if (globalWithIo.io) {
      // Emit notification to the target role
      if (targetRole) {
        globalWithIo.io.to(targetRole).emit('super_admin_notification', {
          ...notification,
          timestamp: new Date().toISOString()
        })
      } else {
        globalWithIo.io.emit('super_admin_notification', {
          ...notification,
          timestamp: new Date().toISOString()
        })
      }

      console.log(`Notification emitted to ${targetRole || 'all'}:`, notification.id)
    } else {
      console.warn('Socket.io server not available for real-time notification')
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Notification emitted successfully',
      notificationId: notification.id 
    })
  } catch (error) {
    console.error('Error emitting notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}