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
      return NextResponse.json({ error: 'Only doctors can access prescriptions' }, { status: 403 })
    }

    // Get doctor profile
    const doctor = await db.doctor.findUnique({
      where: { userId: session.user.id }
    })

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 })
    }

    // Get doctor's prescriptions
    const prescriptions = await db.prescription.findMany({
      where: { doctorId: doctor.id },
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
        },
        appointment: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(prescriptions)
  } catch (error) {
    console.error('Error fetching doctor prescriptions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user?.role !== 'DOCTOR') {
      return NextResponse.json({ error: 'Only doctors can create prescriptions' }, { status: 403 })
    }

    const body = await request.json()
    const {
      patientId,
      appointmentId,
      medication,
      dosage,
      frequency,
      duration,
      instructions,
      notes
    } = body

    // Validate required fields
    if (!patientId || !medication || !dosage || !frequency || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get doctor profile
    const doctor = await db.doctor.findUnique({
      where: { userId: session.user.id }
    })

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 })
    }

    // Generate prescription number
    const prescriptionCount = await db.prescription.count()
    const prescriptionNumber = `RX-${new Date().getFullYear()}-${String(prescriptionCount + 1).padStart(3, '0')}`

    // Create prescription
    const prescription = await db.prescription.create({
      data: {
        medication,
        dosage,
        frequency,
        duration,
        instructions: instructions || null,
        patientId,
        doctorId: doctor.id,
        appointmentId: appointmentId || null
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
        },
        appointment: true
      }
    })

    // Update subscription usage for prescription
    try {
      const patient = await db.patient.findUnique({
        where: { id: patientId },
        include: {
          user: true
        }
      })

      if (patient) {
        // Create a server-side call to update usage
        // Note: This would normally be done with a direct database call in a real implementation
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/patient/subscription/usage/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.INTERNAL_API_KEY || 'internal-key'}`
          },
          body: JSON.stringify({
            serviceType: 'PRESCRIPTION',
            increment: 1,
            userId: patient.user.id
          }),
        })
      }
    } catch (error) {
      console.error('Failed to update subscription usage:', error)
      // Don't fail the prescription creation if usage tracking fails
    }

    return NextResponse.json(prescription)
  } catch (error) {
    console.error('Error creating prescription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}