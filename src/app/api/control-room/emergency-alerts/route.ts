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
      return NextResponse.json({ error: 'Only control room staff can access emergency alerts' }, { status: 403 })
    }

    // Get appointments that might be emergencies (physical visits with high priority)
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    const emergencyAppointments = await db.appointment.findMany({
      where: {
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        type: 'PHYSICAL_VISIT',
        status: {
          in: ['PENDING', 'CONFIRMED']
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
        scheduledAt: 'asc'
      }
    })

    // Transform data for emergency alerts
    const emergencyAlerts = emergencyAppointments.map((appointment, index) => {
      // Determine severity based on appointment time and type
      const now = new Date()
      const appointmentTime = new Date(appointment.scheduledAt)
      const hoursUntilAppointment = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60)
      
      let severity = 'medium'
      if (hoursUntilAppointment < 1) severity = 'critical'
      else if (hoursUntilAppointment < 3) severity = 'high'
      else if (hoursUntilAppointment > 6) severity = 'low'

      return {
        id: appointment.id,
        patientName: appointment.patient.user.name || '',
        patientId: appointment.patient.id,
        doctorName: appointment.doctor?.user.name || 'Unassigned',
        severity,
        type: appointment.chiefComplaint || 'Physical Visit',
        location: 'Emergency Room', // Mock location
        estimatedArrival: appointment.scheduledAt,
        status: appointment.status,
        description: appointment.chiefComplaint || 'Patient requires immediate attention'
      }
    })

    return NextResponse.json(emergencyAlerts)
  } catch (error) {
    console.error('Error fetching emergency alerts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}