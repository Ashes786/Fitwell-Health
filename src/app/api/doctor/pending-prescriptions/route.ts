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

    // Get pending prescriptions
    const prescriptions = await db.prescription.findMany({
      where: {
        doctorId: doctor.id,
        isActive: true
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
        createdAt: 'desc'
      },
      take: 10
    })

    // Format prescriptions for the frontend
    const formattedPrescriptions = prescriptions.map(prescription => ({
      id: prescription.id,
      patientName: prescription.patient?.user?.name || 'Unknown',
      patientAvatar: prescription.patient?.user?.image,
      medication: prescription.medication,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: prescription.duration,
      createdAt: prescription.createdAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }))

    return NextResponse.json(formattedPrescriptions)
  } catch (error) {
    console.error('Error fetching pending prescriptions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}