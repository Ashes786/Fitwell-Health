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

    // Get user's current subscription with usage data
    const subscription = await db.userSubscription.findFirst({
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
            type: true,
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

    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    // Calculate usage data
    const usageData = [
      {
        type: 'GP Consultations',
        used: subscription.consultationsUsed,
        total: subscription.subscriptionPlan.maxConsultations || null,
        icon: 'stethoscope',
        color: 'bg-blue-500',
        description: 'General practitioner visits'
      },
      {
        type: 'Family Members',
        used: subscription.familyMembersUsed,
        total: subscription.subscriptionPlan.maxFamilyMembers || null,
        icon: 'users',
        color: 'bg-pink-500',
        description: 'Family member coverage'
      },
      {
        type: 'Lab Tests',
        used: subscription.labTestsUsed,
        total: Math.floor((subscription.subscriptionPlan.maxConsultations || 0) * 0.8) || null, // Example calculation
        icon: 'flask',
        color: 'bg-green-500',
        description: 'Laboratory tests and diagnostics'
      },
      {
        type: 'Prescriptions',
        used: subscription.prescriptionsUsed,
        total: Math.floor((subscription.subscriptionPlan.maxConsultations || 0) * 1.5) || null, // Example calculation
        icon: 'pill',
        color: 'bg-orange-500',
        description: 'Prescription medications'
      },
      {
        type: 'AI Reports',
        used: subscription.aiReportsUsed,
        total: Math.floor((subscription.subscriptionPlan.maxConsultations || 0) * 0.6) || null, // Example calculation
        icon: 'activity',
        color: 'bg-cyan-500',
        description: 'AI-generated health reports'
      }
    ]

    // Calculate days remaining
    const daysRemaining = Math.ceil((subscription.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

    return NextResponse.json({
      subscription,
      usageData,
      daysRemaining
    })
  } catch (error) {
    console.error('Error fetching subscription usage:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}