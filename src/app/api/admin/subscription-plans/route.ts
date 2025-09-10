import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
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
        include: {
          _count: {
            select: {
              userSubscriptions: true
            }
          }
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
    
    if (!session || session.user?.role !== 'ADMIN') {
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
      specialistConsultations,
      labTestDiscounts,
      pharmacyDiscounts
    } = body

    // Get admin ID from session
    const admin = await db.admin.findFirst({
      where: { userId: session.user.id }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Create subscription plan
    const plan = await db.subscriptionPlan.create({
      data: {
        adminId: admin.id,
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        durationUnit,
        category,
        maxConsultations: maxConsultations ? parseInt(maxConsultations) : null,
        maxFamilyMembers: maxFamilyMembers ? parseInt(maxFamilyMembers) : null,
        discountPercentage: discountPercentage ? parseFloat(discountPercentage) : null,
        features: features && features.length > 0 ? JSON.stringify(features) : null,
        specializations: specializations && specializations.length > 0 ? JSON.stringify(specializations) : null,
        specialistConsultations: specialistConsultations && specialistConsultations.length > 0 ? JSON.stringify(specialistConsultations) : null,
        labTestDiscounts: labTestDiscounts && labTestDiscounts.length > 0 ? JSON.stringify(labTestDiscounts) : null,
        pharmacyDiscounts: pharmacyDiscounts && pharmacyDiscounts.length > 0 ? JSON.stringify(pharmacyDiscounts) : null,
        isActive: true
      }
    })

    return NextResponse.json({ plan, message: 'Subscription plan created successfully' })
  } catch (error) {
    console.error('Error creating subscription plan:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}