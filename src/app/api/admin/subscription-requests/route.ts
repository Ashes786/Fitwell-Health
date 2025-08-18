import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Since subscription requests have been removed, inform about the new process
    return NextResponse.json({ 
      message: 'Subscription requests have been replaced by direct subscription plan creation. Please contact your super-admin for subscription plans.',
      subscriptionRequests: [],
      newProcess: 'Super-admins now create subscription plans directly and assign them to admins.'
    })
  } catch (error) {
    console.error('Error fetching admin subscription requests:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Since subscription requests have been removed, inform about the new process
    return NextResponse.json({ 
      message: 'Subscription requests have been replaced by direct subscription plan creation. Please contact your super-admin for subscription plans.',
      newProcess: 'Super-admins now create subscription plans directly and assign them to admins.',
      contactSuperAdmin: 'Please reach out to your super-admin to manage your subscription.'
    })
  } catch (error) {
    console.error('Error creating subscription request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}