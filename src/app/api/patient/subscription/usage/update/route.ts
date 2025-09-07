import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      serviceType,
      increment = 1,
      userId
    } = body

    if (!serviceType) {
      return NextResponse.json({ error: 'Service type is required' }, { status: 400 })
    }

    // Get user ID from session or request body
    const targetUserId = userId || session.user.id

    // Get user's current subscription
    const subscription = await db.userSubscription.findFirst({
      where: {
        userId: targetUserId,
        isActive: true
      },
      include: {
        subscriptionPlan: {
          select: {
            maxConsultations: true,
            maxFamilyMembers: true
          }
        }
      }
    })

    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    // Check if usage is within limits
    let canIncrement = true
    let currentUsage = 0
    let maxUsage = null

    switch (serviceType) {
      case 'CONSULTATION':
        currentUsage = subscription.consultationsUsed
        maxUsage = subscription.subscriptionPlan.maxConsultations
        break
      case 'FAMILY_MEMBER':
        currentUsage = subscription.familyMembersUsed
        maxUsage = subscription.subscriptionPlan.maxFamilyMembers
        break
      case 'LAB_TEST':
        currentUsage = subscription.labTestsUsed
        maxUsage = Math.floor((subscription.subscriptionPlan.maxConsultations || 0) * 0.8) || null
        break
      case 'PRESCRIPTION':
        currentUsage = subscription.prescriptionsUsed
        maxUsage = Math.floor((subscription.subscriptionPlan.maxConsultations || 0) * 1.5) || null
        break
      case 'AI_REPORT':
        currentUsage = subscription.aiReportsUsed
        maxUsage = Math.floor((subscription.subscriptionPlan.maxConsultations || 0) * 0.6) || null
        break
      default:
        return NextResponse.json({ error: 'Invalid service type' }, { status: 400 })
    }

    // Check if incrementing would exceed limit
    if (maxUsage !== null && (currentUsage + increment) > maxUsage) {
      canIncrement = false
      return NextResponse.json({ 
        error: 'Usage limit exceeded',
        currentUsage,
        maxUsage,
        serviceType
      }, { status: 400 })
    }

    // Update usage
    const updateData: any = {}
    switch (serviceType) {
      case 'CONSULTATION':
        updateData.consultationsUsed = currentUsage + increment
        break
      case 'FAMILY_MEMBER':
        updateData.familyMembersUsed = currentUsage + increment
        break
      case 'LAB_TEST':
        updateData.labTestsUsed = currentUsage + increment
        break
      case 'PRESCRIPTION':
        updateData.prescriptionsUsed = currentUsage + increment
        break
      case 'AI_REPORT':
        updateData.aiReportsUsed = currentUsage + increment
        break
    }

    const updatedSubscription = await db.userSubscription.update({
      where: { id: subscription.id },
      data: updateData
    })

    return NextResponse.json({ 
      message: 'Usage updated successfully',
      subscription: updatedSubscription,
      serviceType,
      newUsage: currentUsage + increment,
      remainingUsage: maxUsage !== null ? maxUsage - (currentUsage + increment) : null
    })
  } catch (error) {
    console.error('Error updating subscription usage:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}