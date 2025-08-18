import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.role || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Since admin features have been made native, return the native features
    const nativeFeatures = [
      'userManagement',
      'appointments', 
      'billing',
      'reports',
      'patients',
      'doctors',
      'subscriptions',
      'analytics'
    ]

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
    console.error('Error fetching admin features:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.role || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Since admin features have been made native, inform about the change
    return NextResponse.json({ 
      message: 'Admin features are now native to all admin accounts. Feature assignment is no longer required.',
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
    console.error('Error updating admin features:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}