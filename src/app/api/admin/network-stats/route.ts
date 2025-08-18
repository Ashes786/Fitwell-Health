import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get admin ID from session
    const admin = await db.admin.findFirst({
      where: { userId: session.user.id }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Get network users count
    const networkUsers = await db.networkUser.findMany({
      where: { adminId: admin.id }
    })

    // Get subscription plans for this admin
    const subscriptionPlans = await db.subscriptionPlan.findMany({
      where: { adminId: admin.id }
    })

    // Get user subscriptions for this admin's plans
    const userSubscriptions = await db.userSubscription.findMany({
      where: {
        subscriptionPlanId: {
          in: subscriptionPlans.map(plan => plan.id)
        },
        isActive: true
      }
    })

    // Since subscription requests have been removed, pending requests are now 0
    // Super-admins create subscription plans directly
    const pendingRequests = 0

    // Get network partners count
    const networkPartners = await db.networkPartner.findMany({
      where: { adminId: admin.id }
    })

    // Get organizations count (this is a global count, not admin-specific in this example)
    const totalOrganizations = await db.organization.count()

    // Calculate stats
    const totalUsers = networkUsers.length
    const totalPatients = networkUsers.filter(user => user.userType === 'PATIENT').length
    const totalDoctors = networkUsers.filter(user => user.userType === 'DOCTOR').length
    
    // Mock appointments and revenue for now
    const totalAppointments = Math.floor(Math.random() * 1000) + 100
    const monthlyRevenue = Math.floor(Math.random() * 50000) + 10000
    const activeSubscriptions = userSubscriptions.length
    const totalPartners = networkPartners.length

    const networkStats = {
      totalUsers,
      totalPatients,
      totalDoctors,
      totalAppointments,
      monthlyRevenue,
      activeSubscriptions,
      pendingRequests: 0, // No pending requests since process changed
      totalPartners,
      totalOrganizations
    }

    return NextResponse.json(networkStats)
  } catch (error) {
    console.error('Error fetching network stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}