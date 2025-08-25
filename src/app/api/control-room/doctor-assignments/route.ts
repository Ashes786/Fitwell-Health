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
      return NextResponse.json({ error: 'Only control room staff can access doctor assignments' }, { status: 403 })
    }

    // Get all doctors with their current status
    const doctors = await db.doctor.findMany({
      include: {
        user: true,
        appointments: {
          where: {
            scheduledAt: {
              gte: new Date()
            }
          },
          take: 1,
          orderBy: {
            scheduledAt: 'asc'
          }
        }
      },
      orderBy: {
        user: {
          name: 'asc'
        }
      }
    })

    // Transform data for the dashboard
    const doctorAssignments = doctors.map(doctor => {
      const nextAppointment = doctor.appointments[0]
      return {
        id: doctor.id,
        doctorName: doctor.user.name || '',
        doctorAvatar: doctor.user.avatar || '',
        department: doctor.specialization,
        status: doctor.isAvailable ? 'available' : 'unavailable',
        currentAssignment: nextAppointment ? `Appointment at ${nextAppointment.scheduledAt.toLocaleTimeString()}` : 'No appointments',
        nextAppointmentTime: nextAppointment?.scheduledAt || null
      }
    })

    return NextResponse.json(doctorAssignments)
  } catch (error) {
    console.error('Error fetching doctor assignments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}