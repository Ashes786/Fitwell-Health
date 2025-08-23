import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    // Authentication is now handled by middleware
    console.log('Authentication verified by middleware for subscription-requests')
    
    // Since subscription requests have been removed, redirect to subscription plans
    // Return empty array with message to indicate the change
    return NextResponse.json({ 
      message: 'Subscription requests have been replaced by direct subscription plan creation. Please use /api/super-admin/subscription-plans instead.',
      subscriptionRequests: [],
      redirect: '/api/super-admin/subscription-plans'
    })
  } catch (error) {
    console.error('Error fetching subscription requests:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Since subscription requests have been removed, inform about the new process
    return NextResponse.json({ 
      message: 'Subscription requests have been replaced by direct subscription plan creation. Please use POST /api/super-admin/subscription-plans instead.',
      redirect: '/api/super-admin/subscription-plans'
    })
  } catch (error) {
    console.error('Error creating subscription request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}