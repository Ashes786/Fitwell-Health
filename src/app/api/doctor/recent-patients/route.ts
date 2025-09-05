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

    // Get recent patients (last 5 appointments)
    const recentAppointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id
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
        scheduledAt: 'desc'
      },
      take: 5,
      distinct: ['patientId']
    })

    // Format patients for the frontend
    const patients = recentAppointments.map(appointment => ({
      id: appointment.patient?.id,
      name: appointment.patient?.user?.name || 'Unknown',
      avatar: appointment.patient?.user?.image,
      lastVisit: appointment.scheduledAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }))

    return NextResponse.json(patients)
  } catch (error) {
    console.error('Error fetching recent patients:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}