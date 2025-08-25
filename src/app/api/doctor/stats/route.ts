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

    // Get all required stats in parallel
    const [
      totalPatients,
      todayAppointments,
      pendingPrescriptions,
      monthlyRevenue,
      upcomingAppointments,
      completedAppointments,
      averageRating
    ] = await Promise.all([
      // Total unique patients
      db.appointment.findMany({
        where: { doctorId: doctor.id },
        select: { patientId: true }
      }).then(appointments => {
        const uniquePatientIds = new Set(appointments.map(a => a.patientId))
        return uniquePatientIds.size
      }),

      // Today's appointments
      db.appointment.count({
        where: {
          doctorId: doctor.id,
          scheduledAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),

      // Pending prescriptions
      db.prescription.count({
        where: {
          doctorId: doctor.id,
          isActive: true
        }
      }),

      // Monthly revenue (mock data for now)
      8500,

      // Upcoming appointments
      db.appointment.count({
        where: {
          doctorId: doctor.id,
          scheduledAt: { gte: now },
          status: { in: ['PENDING', 'CONFIRMED'] }
        }
      }),

      // Completed appointments
      db.appointment.count({
        where: {
          doctorId: doctor.id,
          status: 'COMPLETED'
        }
      }),

      // Average rating (mock data)
      4.7
    ])

    const stats = {
      totalPatients,
      todayAppointments,
      pendingPrescriptions,
      monthlyRevenue,
      upcomingAppointments,
      completedAppointments,
      averageRating,
      responseTime: 15 // Mock response time in minutes
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching doctor stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}