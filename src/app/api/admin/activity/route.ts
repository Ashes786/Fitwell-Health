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

    // Get recent activity from various sources
    const [
      recentUsers,
      recentAppointments,
      recentPartners,
      recentSubscriptions
    ] = await Promise.all([
      // Recent user registrations
      db.user.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        include: {
          patient: true,
          doctor: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      }),
      // Recent appointments
      db.appointment.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        },
        include: {
          patient: {
            include: {
              user: true
            }
          },
          doctor: {
            include: {
              user: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      }),
      // Recent partner activity
      Promise.all([
        db.labPartner.findMany({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          },
          take: 3
        }),
        db.pharmacyPartner.findMany({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          },
          take: 3
        }),
        db.hospitalPartner.findMany({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          },
          take: 3
        })
      ]),
      // Recent subscription activity
      db.userSubscription.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        },
        include: {
          user: true,
          subscriptionPlan: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      })
    ])

    // Format activity data
    const activity = []

    // User registration activity
    recentUsers.forEach(user => {
      const timeAgo = getTimeAgo(user.createdAt)
      if (user.role === 'PATIENT') {
        activity.push({
          type: 'user',
          description: `New patient registration: ${user.name}`,
          timestamp: timeAgo,
          severity: 'low'
        })
      } else if (user.role === 'DOCTOR') {
        activity.push({
          type: 'user',
          description: `New doctor registration: Dr. ${user.name}`,
          timestamp: timeAgo,
          severity: 'medium'
        })
      }
    })

    // Appointment activity
    recentAppointments.forEach(appointment => {
      const timeAgo = getTimeAgo(appointment.createdAt)
      const patientName = appointment.patient?.user?.name || 'Unknown Patient'
      const doctorName = appointment.doctor?.user?.name || 'Unknown Doctor'
      
      activity.push({
        type: 'appointment',
        description: `New appointment: ${patientName} with ${doctorName}`,
        timestamp: timeAgo,
        severity: 'low'
      })
    })

    // Partner activity
    const allPartners = [...recentPartners[0], ...recentPartners[1], ...recentPartners[2]]
    allPartners.forEach(partner => {
      const timeAgo = getTimeAgo(partner.createdAt)
      activity.push({
        type: 'partner',
        description: `New partner onboarded: ${partner.name}`,
        timestamp: timeAgo,
        severity: 'medium'
      })
    })

    // Subscription activity
    recentSubscriptions.forEach(subscription => {
      const timeAgo = getTimeAgo(subscription.createdAt)
      activity.push({
        type: 'subscription',
        description: `New subscription: ${subscription.user.name} - ${subscription.subscriptionPlan.name}`,
        timestamp: timeAgo,
        severity: 'low'
      })
    })

    // Sort by timestamp and return top activities
    return NextResponse.json(activity.slice(0, 20))
  } catch (error) {
    console.error('Error fetching activity:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? 's' : ''} ago`
}