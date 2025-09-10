import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'PUBLIC' or 'ALL'

    // Build where clause for subscription plans
    const where: any = { isActive: true }
    
    // If user is requesting only public plans, filter out custom plans
    if (type === 'PUBLIC') {
      where.category = { not: 'CUSTOM' }
    }

    // Get available subscription plans
    let plans = await db.subscriptionPlan.findMany({
      where,
      orderBy: { price: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        durationUnit: true,
        category: true,
        maxConsultations: true,
        maxFamilyMembers: true,
        discountPercentage: true,
        features: true,
        specializations: true,
        isActive: true,
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
      }
    })

    // If user is requesting ALL plans, filter custom plans based on organization access
    if (type === 'ALL' || !type) {
      // Get user's organization (if any)
      const userWithOrg = await db.user.findUnique({
        where: { id: session.user.id },
        include: {
          patient: {
            select: {
              organizationId: true,
              organization: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      })

      // Get custom plans that belong to organizations the user has access to
      let accessibleCustomPlanIds = new Set<string>()
      
      if (userWithOrg?.patient?.organizationId) {
        // Get organization subscriptions for the user's organization
        const orgSubscriptions = await db.organizationSubscription.findMany({
          where: {
            organizationId: userWithOrg.patient.organizationId,
            isActive: true
          },
          select: {
            subscriptionPlanId: true
          }
        })
        
        // Add the custom plan IDs to the accessible set
        orgSubscriptions.forEach(orgSub => {
          accessibleCustomPlanIds.add(orgSub.subscriptionPlanId)
        })
      }

      // Filter plans: keep all non-custom plans + custom plans accessible through organizations
      plans = plans.filter(plan => 
        plan.category !== 'CUSTOM' || accessibleCustomPlanIds.has(plan.id)
      )
    }

    // Get user's current subscription
    const currentSubscription = await db.userSubscription.findFirst({
      where: {
        userId: session.user.id,
        isActive: true
      },
      include: {
        subscriptionPlan: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
            durationUnit: true,
            category: true,
            maxConsultations: true,
            maxFamilyMembers: true,
            discountPercentage: true,
            features: true,
            specializations: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      plans,
      currentSubscription
    })
  } catch (error) {
    console.error('Error fetching subscription data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      subscriptionPlanId,
      paymentMethod,
      paymentId
    } = body

    if (!subscriptionPlanId || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify subscription plan exists and is active
    const subscriptionPlan = await db.subscriptionPlan.findUnique({
      where: { id: subscriptionPlanId, isActive: true }
    })

    if (!subscriptionPlan) {
      return NextResponse.json({ error: 'Subscription plan not found or inactive' }, { status: 404 })
    }

    // Check if user already has an active subscription
    const existingSubscription = await db.userSubscription.findFirst({
      where: {
        userId: session.user.id,
        isActive: true
      }
    })

    // Calculate subscription dates
    const startDate = new Date()
    const endDate = new Date()
    
    switch (subscriptionPlan.durationUnit) {
      case 'DAYS':
        endDate.setDate(endDate.getDate() + subscriptionPlan.duration)
        break
      case 'MONTHS':
        endDate.setMonth(endDate.getMonth() + subscriptionPlan.duration)
        break
      case 'YEARS':
        endDate.setFullYear(endDate.getFullYear() + subscriptionPlan.duration)
        break
    }

    // If user has existing subscription, deactivate it
    if (existingSubscription) {
      await db.userSubscription.update({
        where: { id: existingSubscription.id },
        data: { isActive: false }
      })
    }

    // Create new subscription
    const newSubscription = await db.userSubscription.create({
      data: {
        userId: session.user.id,
        subscriptionPlanId,
        startDate,
        endDate,
        isActive: true
      },
      include: {
        subscriptionPlan: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
            durationUnit: true,
            category: true,
            maxConsultations: true,
            maxFamilyMembers: true,
            discountPercentage: true,
            features: true,
            specializations: true
          }
        }
      }
    })

    // TODO: Process payment here
    // This is where you would integrate with a payment gateway
    const paymentProcessed = true // Placeholder

    if (!paymentProcessed) {
      return NextResponse.json({ error: 'Payment processing failed' }, { status: 400 })
    }

    return NextResponse.json({ 
      subscription: newSubscription,
      message: 'Subscription created successfully' 
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}