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

    if (session.user?.role !== 'DOCTOR') {
      return NextResponse.json({ error: 'Only doctors can access patients' }, { status: 403 })
    }

    // Get doctor profile
    const doctor = await db.doctor.findUnique({
      where: { userId: session.user.id }
    })

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 })
    }

    // Get doctor's patients through appointments
    const appointments = await db.appointment.findMany({
      where: { doctorId: doctor.id },
      include: {
        patient: {
          include: {
            user: true
          }
        }
      },
      distinct: ['patientId'],
      orderBy: {
        scheduledAt: 'desc'
      }
    })

    // Extract unique patients
    const patients = appointments.map(appointment => appointment.patient)

    return NextResponse.json(patients)
  } catch (error) {
    console.error('Error fetching doctor patients:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}