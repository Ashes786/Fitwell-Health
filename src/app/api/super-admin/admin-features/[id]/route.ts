import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Since admin features have been made native, inform about the change
    return NextResponse.json({ 
      message: 'Admin features are now native to all admin accounts. Feature assignment has been removed.',
      nativeFeatures: [
        'userManagement',
        'appointments', 
        'billing',
        'reports',
        'patients',
        'doctors',
        'subscriptions',
        'analytics'
      ]
    })
  } catch (error) {
    console.error('Error updating admin feature:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Since admin features have been made native, inform about the change
    return NextResponse.json({ 
      message: 'Admin features are now native to all admin accounts. Feature assignment has been removed.',
      nativeFeatures: [
        'userManagement',
        'appointments', 
        'billing',
        'reports',
        'patients',
        'doctors',
        'subscriptions',
        'analytics'
      ]
    })
  } catch (error) {
    console.error('Error deleting admin feature:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Since admin features have been made native, inform about the change
    return NextResponse.json({ 
      message: 'Admin features are now native to all admin accounts. Feature assignment has been removed.',
      adminFeatures: [],
      nativeFeatures: [
        'userManagement',
        'appointments', 
        'billing',
        'reports',
        'patients',
        'doctors',
        'subscriptions',
        'analytics'
      ]
    })
  } catch (error) {
    console.error('Error fetching admin feature:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}