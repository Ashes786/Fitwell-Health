import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user?.role !== 'ATTENDANT') {
      return NextResponse.json({ error: 'Only attendants can access stats' }, { status: 403 })
    }

    // Get total patients
    const totalPatients = await db.patient.count()

    // Get today's registrations
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    const todayRegistrations = await db.user.count({
      where: {
        role: 'PATIENT',
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })

    // Get pending appointments
    const pendingAppointments = await db.appointment.count({
      where: {
        status: 'PENDING',
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })

    // Get completed registrations (patients with profiles)
    const completedRegistrations = await db.patient.count()

    // Get active patients (patients with recent activity)
    const activePatients = await db.patient.count({
      where: {
        OR: [
          {
            appointments: {
              some: {
                scheduledAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                }
              }
            }
          },
          {
            vitals: {
              some: {
                recordedAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                }
              }
            }
          }
        ]
      }
    })

    // Get check-ins today (completed appointments today)
    const checkInToday = await db.appointment.count({
      where: {
        status: 'COMPLETED',
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })

    // Mock pending verifications (since we don't have a verification model)
    const pendingVerifications = 3

    // Mock average processing time
    const averageProcessingTime = 15 // minutes

    const stats = {
      totalPatients,
      todayRegistrations,
      pendingAppointments,
      completedRegistrations,
      activePatients,
      checkInToday,
      pendingVerifications,
      averageProcessingTime
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching attendant stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}