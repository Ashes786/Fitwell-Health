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

    // Get network-related alerts and issues
    const [
      failedLogins,
      systemErrors,
      highLoadAppointments,
      pendingPayments,
      inactiveUsers
    ] = await Promise.all([
      // Recent failed login attempts (security alerts)
      db.securityFailedLogin.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          },
          success: false
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      }),
      // System errors from notifications
      db.notification.findMany({
        where: {
          type: 'SYSTEM_ALERT',
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      }),
      // High load on appointments (many appointments in short time)
      db.appointment.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      }),
      // Pending payments that need attention
      db.appointment.findMany({
        where: {
          paymentStatus: 'PENDING',
          createdAt: {
            lte: new Date(Date.now() - 30 * 60 * 1000) // Older than 30 minutes
          }
        },
        orderBy: {
          createdAt: 'asc'
        },
        take: 5
      }),
      // Inactive users (potential system issues)
      db.user.findMany({
        where: {
          isActive: false,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 3
      })
    ])

    const alerts = []

    // Security alerts from failed logins
    if (failedLogins.length > 0) {
      alerts.push({
        type: 'warning',
        message: `${failedLogins.length} failed login attempts detected in the last 24 hours`,
        severity: 'high'
      })
    }

    // System error alerts
    systemErrors.forEach(error => {
      alerts.push({
        type: 'error',
        message: error.message,
        severity: 'high'
      })
    })

    // High load alerts
    const recentAppointmentsCount = await db.appointment.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
        }
      }
    })

    if (recentAppointmentsCount > 50) {
      alerts.push({
        type: 'warning',
        message: `High system load: ${recentAppointmentsCount} appointments created in the last hour`,
        severity: 'medium'
      })
    }

    // Payment processing alerts
    if (pendingPayments.length > 0) {
      alerts.push({
        type: 'warning',
        message: `${pendingPayments.length} payments pending processing for over 30 minutes`,
        severity: 'medium'
      })
    }

    // User activity alerts
    if (inactiveUsers.length > 0) {
      alerts.push({
        type: 'info',
        message: `${inactiveUsers.length} users deactivated in the last 7 days`,
        severity: 'low'
      })
    }

    // Network performance alerts (mock data for now)
    const networkPerformance = await getNetworkPerformance()
    if (networkPerformance.avgResponseTime > 2000) {
      alerts.push({
        type: 'warning',
        message: `High network response time: ${networkPerformance.avgResponseTime}ms`,
        severity: 'medium'
      })
    }

    if (networkPerformance.errorRate > 5) {
      alerts.push({
        type: 'error',
        message: `High network error rate: ${networkPerformance.errorRate}%`,
        severity: 'high'
      })
    }

    // Add positive system status if no critical alerts
    if (alerts.filter(a => a.severity === 'high').length === 0) {
      alerts.push({
        type: 'info',
        message: 'Network performance optimization completed',
        severity: 'low'
      })
    }

    return NextResponse.json(alerts.slice(0, 10))
  } catch (error) {
    console.error('Error fetching network alerts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getNetworkPerformance() {
  // Mock network performance data
  // In a real implementation, this would fetch from monitoring systems
  return {
    avgResponseTime: Math.floor(Math.random() * 3000), // 0-3000ms
    errorRate: Math.floor(Math.random() * 10), // 0-10%
    uptime: 99.5 + (Math.random() * 0.4) // 99.5-99.9%
  }
}