import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.role || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'

    // Calculate date range based on timeRange
    const now = new Date()
    let startDate: Date
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    // Fetch all necessary data
    const [users, admins, subscriptionPlans, systemStatus, appointments] = await Promise.all([
      db.user.findMany({
        where: {
          createdAt: { gte: startDate }
        },
        select: {
          id: true,
          createdAt: true,
          role: true,
          patient: {
            select: { id: true }
          },
          doctor: {
            select: { id: true }
          },
          attendant: {
            select: { id: true }
          },
          controlRoom: {
            select: { id: true }
          },
          admin: {
            select: { id: true }
          }
        }
      }),
      db.admin.findMany({
        select: {
          id: true,
          createdAt: true,
          user: {
            select: { id: true, name: true, email: true }
          },
          subscriptionPlans: {
            select: { id: true, name: true, price: true, duration: true, durationUnit: true, category: true }
          }
        }
      }),
      db.subscriptionPlan.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          duration: true,
          createdAt: true
        }
      }),
      db.systemStatus.findMany({
        select: {
          id: true,
          serviceName: true,
          status: true,
          responseTime: true,
          lastChecked: true
        }
      }),
      db.appointment.findMany({
        where: {
          createdAt: { gte: startDate }
        },
        select: {
          id: true,
          createdAt: true,
          status: true
        }
      })
    ])

    // Calculate revenue analytics based on active admin subscriptions
    const activeAdminSubscriptions = admins.filter(admin => 
      admin.subscriptionPlans && admin.subscriptionPlans.length > 0
    )
    const totalRevenue = activeAdminSubscriptions.reduce((sum, admin) => 
      sum + admin.subscriptionPlans.reduce((planSum, plan) => planSum + plan.price, 0), 0
    )
    
    // Generate monthly revenue data
    const monthlyRevenue: { month: string; revenue: number }[] = []
    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
      
      const monthRevenue = activeAdminSubscriptions
        .reduce((sum, admin) => 
          sum + admin.subscriptionPlans.reduce((planSum, plan) => planSum + plan.price, 0), 0
        )
      
      monthlyRevenue.unshift({
        month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        revenue: monthRevenue
      })
    }

    // Calculate subscription analytics
    const subscriptionsByStatus = [
      { status: 'ACTIVE', count: activeAdminSubscriptions.length },
      { status: 'NO_SUBSCRIPTION', count: admins.filter(admin => !admin.subscriptionPlans || admin.subscriptionPlans.length === 0).length }
    ]

    const subscriptionsByPlan = subscriptionPlans.reduce((acc, plan) => {
      const adminCount = admins.filter(admin => 
        admin.subscriptionPlans && admin.subscriptionPlans.some(sp => sp.id === plan.id)
      ).length
      if (adminCount > 0) {
        acc.push({ plan: plan.name, count: adminCount })
      }
      return acc
    }, [] as Array<{ plan: string; count: number }>)

    // Calculate user analytics
    const usersByRole = [
      { role: 'Patients', count: users.filter(u => u.patient).length },
      { role: 'Doctors', count: users.filter(u => u.doctor).length },
      { role: 'Attendants', count: users.filter(u => u.attendant).length },
      { role: 'Control Room', count: users.filter(u => u.controlRoom).length },
      { role: 'Admins', count: admins.length }
    ]

    const newUsers = users.filter(u => {
      const userDate = new Date(u.createdAt)
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return userDate >= thirtyDaysAgo
    }).length

    const newAdmins = admins.filter(admin => {
      const adminDate = new Date(admin.createdAt)
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return adminDate >= thirtyDaysAgo
    }).length

    // Calculate system analytics
    const onlineServices = systemStatus.filter(s => s.status === 'ONLINE')
    const systemUptime = systemStatus.length > 0 ? (onlineServices.length / systemStatus.length) * 100 : 100
    const avgResponseTime = systemStatus.reduce((sum, s) => sum + (s.responseTime || 0), 0) / systemStatus.length || 0

    const systemServices = systemStatus.map(service => ({
      name: service.serviceName,
      status: service.status,
      uptime: service.status === 'ONLINE' ? 99.9 : 0 // Mock uptime data
    }))

    // Calculate appointment analytics
    const completedAppointments = appointments.filter(apt => apt.status === 'COMPLETED').length
    const cancelledAppointments = appointments.filter(apt => apt.status === 'CANCELLED').length

    // Generate monthly appointment data
    const appointmentsByMonth: { month: string; count: number }[] = []
    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
      
      const monthAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.createdAt)
        return aptDate >= monthStart && aptDate <= monthEnd
      }).length
      
      appointmentsByMonth.unshift({
        month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        count: monthAppointments
      })
    }

    // Calculate growth rates (mock data for demo)
    const revenueGrowth = 12.5 // Mock growth rate
    const userGrowth = 8.3 // Mock growth rate

    const analytics = {
      revenue: {
        monthly: monthlyRevenue,
        total: totalRevenue,
        growth: revenueGrowth
      },
      subscriptions: {
        byStatus: subscriptionsByStatus,
        byPlan: subscriptionsByPlan,
        total: admins.length,
        active: activeAdminSubscriptions.length
      },
      users: {
        byRole: usersByRole,
        total: users.length + admins.length,
        newUsers: newUsers + newAdmins,
        growth: userGrowth
      },
      system: {
        uptime: systemUptime,
        responseTime: Math.round(avgResponseTime),
        errors: systemStatus.filter(s => s.status === 'OFFLINE').length,
        services: systemServices
      },
      appointments: {
        total: appointments.length,
        completed: completedAppointments,
        cancelled: cancelledAppointments,
        byMonth: appointmentsByMonth
      }
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}