import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all doctors with their profiles
    const doctors = await db.user.findMany({
      where: {
        role: 'DOCTOR',
        doctor: {
          isNot: null
        }
      },
      include: {
        doctor: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to match the frontend interface
    const formattedDoctors = doctors.map(doctor => ({
      id: doctor.id,
      name: `${doctor.firstName} ${doctor.lastName}`,
      specialization: doctor.doctor?.specialization || 'General Practitioner',
      experience: doctor.doctor?.experience || 0,
      rating: doctor.doctor?.rating || 0,
      consultationFee: doctor.doctor?.consultationFee || 100,
      availableSlots: [], // This would be calculated based on doctor's availability
      city: doctor.doctor?.city || doctor.city,
      avatar: doctor.avatar
    }))

    return NextResponse.json(formattedDoctors)
  } catch (error) {
    console.error('Error fetching doctors:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}