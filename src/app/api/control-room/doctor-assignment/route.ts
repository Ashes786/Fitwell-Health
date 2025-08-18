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

    // Get pending GP appointments
    const pendingAppointments = await db.appointment.findMany({
      where: {
        type: 'GP_CONSULTATION',
        status: 'PENDING',
        doctorId: null
      },
      include: {
        patient: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    })

    // Get available doctors
    const availableDoctors = await db.doctor.findMany({
      where: {
        doctorProfile: {
          specialization: {
            contains: 'General Practitioner',
            mode: 'insensitive'
          }
        }
      },
      include: {
        user: true,
        doctorProfile: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      pendingAppointments,
      availableDoctors
    })
  } catch (error) {
    console.error('Error fetching doctor assignments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user?.role !== 'CONTROL_ROOM') {
      return NextResponse.json({ error: 'Only control room staff can assign doctors' }, { status: 403 })
    }

    const body = await request.json()
    const {
      appointmentId,
      doctorId
    } = body

    // Validate required fields
    if (!appointmentId || !doctorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Update appointment with assigned doctor
    const appointment = await db.appointment.update({
      where: { id: appointmentId },
      data: {
        doctorId,
        status: 'CONFIRMED'
      },
      include: {
        doctor: {
          include: {
            user: true
          }
        },
        patient: {
          include: {
            user: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      appointment,
      message: 'Doctor assigned successfully'
    })
  } catch (error) {
    console.error('Error assigning doctor:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}