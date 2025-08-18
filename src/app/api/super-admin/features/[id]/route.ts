import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.role || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Since features have been made native to admins, inform about the change
    return NextResponse.json({ 
      message: 'Features are now native to all admin accounts. Feature management has been removed.',
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
    console.error('Error updating feature:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.role || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Since features have been made native to admins, inform about the change
    return NextResponse.json({ 
      message: 'Features are now native to all admin accounts. Feature management has been removed.',
      features: [],
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
    console.error('Error fetching feature:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.role || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Since features have been made native to admins, inform about the change
    return NextResponse.json({ 
      message: 'Features are now native to all admin accounts. Feature management has been removed.',
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
    console.error('Error deleting feature:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}