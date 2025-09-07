import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const organizationId = searchParams.get('organizationId')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (organizationId) {
      where.organizationId = organizationId
    }

    const [subscriptions, total] = await Promise.all([
      db.organizationSubscription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { assignedAt: 'desc' },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              type: true
            }
          },
          subscriptionPlan: {
            select: {
              id: true,
              name: true,
              category: true,
              type: true,
              price: true,
              duration: true,
              durationUnit: true
            }
          },
          assignedByAdmin: {
            select: {
              id: true,
              networkName: true,
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      }),
      db.organizationSubscription.count({ where })
    ])

    return NextResponse.json({
      subscriptions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching organization subscriptions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      organizationId,
      subscriptionPlanId,
      assignedBy
    } = body

    if (!organizationId || !subscriptionPlanId || !assignedBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify organization exists
    const organization = await db.organization.findUnique({
      where: { id: organizationId }
    })

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Verify subscription plan exists and is private
    const subscriptionPlan = await db.subscriptionPlan.findUnique({
      where: { id: subscriptionPlanId }
    })

    if (!subscriptionPlan) {
      return NextResponse.json({ error: 'Subscription plan not found' }, { status: 404 })
    }

    if (subscriptionPlan.type !== 'PRIVATE') {
      return NextResponse.json({ error: 'Only private subscription plans can be assigned to organizations' }, { status: 400 })
    }

    // Verify admin exists
    const admin = await db.admin.findUnique({
      where: { id: assignedBy }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Check if subscription already exists
    const existingSubscription = await db.organizationSubscription.findUnique({
      where: {
        organizationId_subscriptionPlanId: {
          organizationId,
          subscriptionPlanId
        }
      }
    })

    if (existingSubscription) {
      return NextResponse.json({ error: 'Subscription already assigned to this organization' }, { status: 400 })
    }

    // Create organization subscription
    const subscription = await db.organizationSubscription.create({
      data: {
        organizationId,
        subscriptionPlanId,
        assignedBy
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        subscriptionPlan: {
          select: {
            id: true,
            name: true,
            category: true,
            type: true,
            price: true,
            duration: true,
            durationUnit: true
          }
        },
        assignedByAdmin: {
          select: {
            id: true,
            networkName: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ 
      subscription, 
      message: 'Organization subscription created successfully' 
    })
  } catch (error) {
    console.error('Error creating organization subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}