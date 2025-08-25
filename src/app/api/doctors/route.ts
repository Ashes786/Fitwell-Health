import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { authenticateRequest, createAuthenticatedGETHandler } from '@/lib/api-auth'
import { UserRole } from '@prisma/client'

const getHandler = async (request: NextRequest, auth: any) => {
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
    name: doctor.name,
    specialization: doctor.doctor?.specialization || 'General Practitioner',
    experience: doctor.doctor?.experience || 0,
    rating: doctor.doctor?.rating || 0,
    consultationFee: doctor.doctor?.consultationFee || 100,
    availableSlots: [], // This would be calculated based on doctor's availability
    city: doctor.doctor?.city || 'N/A',
    avatar: doctor.avatar
  }))

  const { NextResponse } = await import('next/server')
  return NextResponse.json(formattedDoctors)
}

export const GET = createAuthenticatedGETHandler(getHandler)