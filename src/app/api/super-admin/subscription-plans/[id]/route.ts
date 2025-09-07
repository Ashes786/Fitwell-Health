import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { NotificationHelpers } from '@/lib/notification-helpers'

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

    const plan = await db.subscriptionPlan.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        durationUnit: true,
        category: true,
        type: true,
        maxConsultations: true,
        maxFamilyMembers: true,
        discountPercentage: true,
        features: true,
        specializations: true,
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
    })

    if (!plan) {
      return NextResponse.json({ error: 'Subscription plan not found' }, { status: 404 })
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error fetching subscription plan:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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

    const body = await request.json()
    const {
      name,
      description,
      price,
      duration,
      durationUnit,
      category,
      type,
      maxConsultations,
      maxFamilyMembers,
      discountPercentage,
      features,
      specializations,
      isActive
    } = body

    // Get current plan data
    const currentPlan = await db.subscriptionPlan.findUnique({
      where: { id: params.id },
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

    if (!currentPlan) {
      return NextResponse.json({ error: 'Subscription plan not found' }, { status: 404 })
    }

    // Update subscription plan
    const updatedPlan = await db.subscriptionPlan.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(duration !== undefined && { duration: parseInt(duration) }),
        ...(durationUnit !== undefined && { durationUnit }),
        ...(category !== undefined && { category }),
        ...(type !== undefined && { type }),
        ...(maxConsultations !== undefined && { maxConsultations: maxConsultations ? parseInt(maxConsultations) : null }),
        ...(maxFamilyMembers !== undefined && { maxFamilyMembers: maxFamilyMembers ? parseInt(maxFamilyMembers) : null }),
        ...(discountPercentage !== undefined && { discountPercentage: discountPercentage ? parseFloat(discountPercentage) : null }),
        ...(features !== undefined && { features: features || [] }),
        ...(specializations !== undefined && { specializations: specializations || [] }),
        ...(isActive !== undefined && { isActive })
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        durationUnit: true,
        category: true,
        type: true,
        maxConsultations: true,
        maxFamilyMembers: true,
        discountPercentage: true,
        features: true,
        specializations: true,
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
      }
    })

    // Trigger notification for plan update
    await NotificationHelpers.onSubscriptionPlanUpdated(
      updatedPlan.name,
      currentPlan.admin.user.name || currentPlan.admin.user.email,
      updatedPlan.id
    )

    return NextResponse.json({ 
      plan: updatedPlan,
      message: 'Subscription plan updated successfully' 
    })
  } catch (error) {
    console.error('Error updating subscription plan:', error)
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

    // Get current plan data
    const currentPlan = await db.subscriptionPlan.findUnique({
      where: { id: params.id },
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

    if (!currentPlan) {
      return NextResponse.json({ error: 'Subscription plan not found' }, { status: 404 })
    }

    // Check if plan has active subscriptions
    const activeSubscriptions = await db.userSubscription.findMany({
      where: {
        subscriptionPlanId: params.id,
        isActive: true
      }
    })

    if (activeSubscriptions.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete subscription plan with active subscriptions',
        activeSubscriptions: activeSubscriptions.length 
      }, { status: 400 })
    }

    // Delete subscription plan
    await db.subscriptionPlan.delete({
      where: { id: params.id }
    })

    // Trigger notification for plan deletion
    await NotificationHelpers.onSubscriptionPlanDeleted(
      currentPlan.name,
      currentPlan.admin.user.name || currentPlan.admin.user.email,
      currentPlan.id
    )

    return NextResponse.json({ 
      message: 'Subscription plan deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting subscription plan:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}