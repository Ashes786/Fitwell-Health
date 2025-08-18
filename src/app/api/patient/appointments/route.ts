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

    if (session.user?.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Only patients can access appointments' }, { status: 403 })
    }

    // Get patient profile
    const patient = await db.patient.findUnique({
      where: { userId: session.user.id }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
    }

    // Get patient's appointments
    const appointments = await db.appointment.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: {
          include: {
            user: true,
            doctorProfile: true
          }
        },
        patient: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        scheduledAt: 'desc'
      }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching patient appointments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}