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
      return NextResponse.json({ error: 'Only attendants can access today\'s appointments' }, { status: 403 })
    }

    // Get today's appointments
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    const appointments = await db.appointment.findMany({
      where: {
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay
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

    // Transform data for the dashboard
    const todayAppointments = appointments.map(appointment => ({
      id: appointment.id,
      patientName: appointment.patient.user.name || '',
      patientAvatar: appointment.patient.user.avatar || '',
      doctorName: appointment.doctor?.user.name || 'Unassigned',
      time: appointment.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: appointment.type,
      status: appointment.status.toLowerCase(),
      appointmentNumber: appointment.appointmentNumber
    }))

    return NextResponse.json(todayAppointments)
  } catch (error) {
    console.error('Error fetching today\'s appointments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}