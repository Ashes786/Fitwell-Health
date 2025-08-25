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

    const doctor = await db.doctor.findFirst({
      where: {
        userId: session.user.id
      }
    })

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get doctor's appointments (transactions)
    const appointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        paymentStatus: { in: ['PAID', 'PENDING'] }
      },
      include: {
        patient: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    // Transform appointments to transaction format
    const transactions = appointments.map(apt => {
      let type: 'consultation' | 'prescription' | 'follow_up' | 'other' = 'consultation'
      let consultationType: 'video' | 'phone' | 'in_person' = 'in_person'

      // Determine appointment type
      switch (apt.type) {
        case 'VIDEO_CONSULTATION':
          consultationType = 'video'
          break
        case 'PHONE_CONSULTATION':
          consultationType = 'phone'
          break
        case 'PHYSICAL_VISIT':
          consultationType = 'in_person'
          break
        default:
          consultationType = 'in_person'
      }

      // Determine transaction type based on chief complaint or notes
      if (apt.chiefComment?.toLowerCase().includes('follow') || apt.notes?.toLowerCase().includes('follow')) {
        type = 'follow_up'
      } else if (apt.chiefComment?.toLowerCase().includes('prescription') || apt.notes?.toLowerCase().includes('prescription')) {
        type = 'prescription'
      }

      return {
        id: apt.id,
        date: apt.createdAt.toISOString(),
        patientName: apt.patient?.user?.name || 'Unknown Patient',
        type,
        amount: apt.consultationFee || 0,
        status: apt.paymentStatus.toLowerCase() as 'completed' | 'pending' | 'failed',
        consultationType
      }
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching doctor transactions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}