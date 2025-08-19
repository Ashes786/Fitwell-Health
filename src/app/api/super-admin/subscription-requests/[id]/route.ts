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

    // Since subscription requests have been removed, inform about the new process
    return NextResponse.json({ 
      message: 'Subscription requests have been replaced by direct subscription plan creation. Please use /api/super-admin/subscription-plans instead.',
      redirect: '/api/super-admin/subscription-plans'
    })
  } catch (error) {
    console.error('Error processing subscription request:', error)
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

    // Since subscription requests have been removed, inform about the new process
    return NextResponse.json({ 
      message: 'Subscription requests have been replaced by direct subscription plan creation. Please use /api/super-admin/subscription-plans instead.',
      redirect: '/api/super-admin/subscription-plans'
    })
  } catch (error) {
    console.error('Error fetching subscription request:', error)
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

    // Since subscription requests have been removed, inform about the new process
    return NextResponse.json({ 
      message: 'Subscription requests have been replaced by direct subscription plan creation. Please use /api/super-admin/subscription-plans instead.',
      redirect: '/api/super-admin/subscription-plans'
    })
  } catch (error) {
    console.error('Error deleting subscription request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}