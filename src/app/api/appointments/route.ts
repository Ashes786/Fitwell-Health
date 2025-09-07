import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user?.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Only patients can book appointments' }, { status: 403 })
    }

    const body = await request.json()
    const {
      doctorId,
      appointmentType,
      scheduledAt,
      chiefComplaint,
      paymentMethod,
      consultationFee
    } = body

    // Validate required fields
    if (!doctorId || !appointmentType || !scheduledAt || !chiefComplaint || !paymentMethod || !consultationFee) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get patient profile
    const patient = await db.patient.findUnique({
      where: { userId: session.user.id }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
    }

    // Generate appointment number
    const appointmentCount = await db.appointment.count()
    const appointmentNumber = `APT-${new Date().getFullYear()}-${String(appointmentCount + 1).padStart(3, '0')}`

    // Create appointment
    const appointment = await db.appointment.create({
      data: {
        appointmentNumber,
        type: appointmentType,
        status: 'PENDING',
        chiefComplaint,
        scheduledAt: new Date(scheduledAt),
        consultationFee,
        paymentStatus: 'PENDING',
        patientId: patient.id,
        doctorId: doctorId
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

    // Process payment (mock implementation)
    // In a real app, you would integrate with a payment gateway like Stripe
    const paymentSuccess = Math.random() > 0.1 // 90% success rate for demo

    if (paymentSuccess) {
      // Update appointment payment status
      await db.appointment.update({
        where: { id: appointment.id },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED'
        }
      })

      // Update subscription usage for consultation
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/patient/subscription/usage/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serviceType: 'CONSULTATION',
            increment: 1
          }),
        })
      } catch (error) {
        console.error('Failed to update subscription usage:', error)
        // Don't fail the appointment creation if usage tracking fails
      }
    }

    return NextResponse.json({
      success: true,
      appointment: {
        ...appointment,
        paymentSuccess
      }
    })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    const doctorId = searchParams.get('doctorId')

    let appointments

    if (session.user?.role === 'PATIENT') {
      // Get patient's appointments
      const patient = await db.patient.findUnique({
        where: { userId: session.user.id }
      })

      if (!patient) {
        return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
      }

      appointments = await db.appointment.findMany({
        where: { patientId: patient.id },
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
        },
        orderBy: {
          scheduledAt: 'desc'
        }
      })
    } else if (session.user?.role === 'DOCTOR' && doctorId) {
      // Get doctor's appointments
      appointments = await db.appointment.findMany({
        where: { doctorId },
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
        },
        orderBy: {
          scheduledAt: 'desc'
        }
      })
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}