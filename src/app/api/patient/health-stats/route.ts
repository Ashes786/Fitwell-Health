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
      return NextResponse.json({ error: 'Only patients can access health stats' }, { status: 403 })
    }

    // Get patient profile
    const patient = await db.patient.findUnique({
      where: { userId: session.user.id }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
    }

    // Get latest vitals for health stats
    const latestVitals = await db.vital.findMany({
      where: { patientId: patient.id },
      orderBy: { recordedAt: 'desc' },
      take: 10
    })

    // Get recent appointments
    const recentAppointments = await db.appointment.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: {
          include: {
            user: true
          }
        }
      },
      orderBy: { scheduledAt: 'desc' },
      take: 5
    })

    // Get active prescriptions
    const activePrescriptions = await db.prescription.findMany({
      where: { 
        patientId: patient.id,
        isActive: true
      },
      include: {
        doctor: {
          include: {
            user: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get recent lab tests
    const recentLabTests = await db.labTest.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    // Calculate health stats
    const healthStats = {
      totalAppointments: recentAppointments.length,
      activePrescriptions: activePrescriptions.length,
      recentLabTests: recentLabTests.length,
      latestVitals: latestVitals.slice(0, 5),
      upcomingAppointments: recentAppointments.filter(apt => 
        apt.status === 'CONFIRMED' && new Date(apt.scheduledAt) > new Date()
      ).length,
      completedAppointments: recentAppointments.filter(apt => 
        apt.status === 'COMPLETED'
      ).length
    }

    return NextResponse.json(healthStats)
  } catch (error) {
    console.error('Error fetching patient health stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}