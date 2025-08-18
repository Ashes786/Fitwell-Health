import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
    console.error('Error fetching features:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Since features have been made native to admins, inform about the change
    return NextResponse.json({ 
      message: 'Features are now native to all admin accounts. Feature creation is no longer required.',
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
    console.error('Error creating feature:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}