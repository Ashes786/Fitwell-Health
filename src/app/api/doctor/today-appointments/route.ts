import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'DOCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get doctor ID from user
    const doctor = await db.doctor.findUnique({
      where: { userId: session.user.id }
    })

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get today's appointments with patient details
    const appointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        scheduledAt: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    })

    // Format appointments for the frontend
    const formattedAppointments = appointments.map(appointment => ({
      id: appointment.id,
      patientName: appointment.patient?.user?.name || 'Unknown',
      patientAvatar: appointment.patient?.user?.image,
      time: appointment.scheduledAt.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      type: appointment.type.replace('_', ' '),
      status: appointment.status,
      priority: appointment.type === 'GP_CONSULTATION' ? 'medium' : 'low'
    }))

    return NextResponse.json(formattedAppointments)
  } catch (error) {
    console.error('Error fetching today appointments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}