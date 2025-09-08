import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { NotificationHelpers } from '@/lib/notification-helpers'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || 'all'
    const status = searchParams.get('status') || 'all'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category !== 'all') {
      where.category = category
    }

    if (status !== 'all') {
      where.isActive = status === 'active'
    }

    const [plans, total] = await Promise.all([
      db.subscriptionPlan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          duration: true,
          durationUnit: true,
          category: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          admin: {
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
          // Removed complex includes that were causing performance issues
        }
      }),
      db.subscriptionPlan.count({ where })
    ])

    return NextResponse.json({
      plans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching subscription plans:', error)
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
      name,
      description,
      price,
      duration,
      durationUnit,
      category,
      maxConsultations,
      maxFamilyMembers,
      discountPercentage,
      features,
      specializations,
      adminId
    } = body

    if (!name || !price || !duration || !adminId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify admin exists
    const admin = await db.admin.findUnique({
      where: { id: adminId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Create subscription plan
    const plan = await db.subscriptionPlan.create({
      data: {
        adminId,
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        durationUnit,
        category,
        maxConsultations: maxConsultations ? parseInt(maxConsultations) : null,
        maxFamilyMembers: maxFamilyMembers ? parseInt(maxFamilyMembers) : null,
        discountPercentage: discountPercentage ? parseFloat(discountPercentage) : null,
        features: features || [],
        specializations: specializations || [],
        isActive: true
      },
      include: {
        admin: {
          include: {
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

    // Trigger notification for new subscription plan creation
    await NotificationHelpers.onSubscriptionPlanCreated(
      plan.name,
      admin.user.name || admin.user.email,
      parseFloat(price),
      plan.id
    )

    return NextResponse.json({ 
      plan, 
      message: 'Subscription plan created successfully' 
    })
  } catch (error) {
    console.error('Error creating subscription plan:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}