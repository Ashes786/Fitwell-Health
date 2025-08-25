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

    if (session.user?.role !== 'CONTROL_ROOM') {
      return NextResponse.json({ error: 'Only control room staff can access stats' }, { status: 403 })
    }

    // Get active doctors count
    const activeDoctors = await db.doctor.count({
      where: { isAvailable: true }
    })

    // Get total patients
    const totalPatients = await db.patient.count()

    // Get appointments stats
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    const todayAppointments = await db.appointment.count({
      where: {
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })

    const emergencyAppointments = await db.appointment.count({
      where: {
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        type: 'PHYSICAL_VISIT'
      }
    })

    // Mock data for bed occupancy and staff (since these aren't in the schema yet)
    const stats = {
      activeDoctors,
      availableBeds: 25, // Mock data
      emergencyCases: emergencyAppointments,
      totalPatients,
      waitingQueue: Math.max(0, todayAppointments - activeDoctors * 8), // Mock calculation
      averageResponseTime: 15, // Mock data in minutes
      criticalCases: Math.floor(emergencyAppointments * 0.3), // Mock calculation
      staffOnDuty: activeDoctors + 10 // Mock data (doctors + other staff)
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching control room stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}