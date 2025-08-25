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
      return NextResponse.json({ error: 'Only patients can access lab tests' }, { status: 403 })
    }

    // Get patient profile
    const patient = await db.patient.findUnique({
      where: { userId: session.user.id }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
    }

    // Get recent lab tests
    const recentLabTests = await db.labTest.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: {
          include: {
            user: true
          }
        },
        labPartner: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    return NextResponse.json(recentLabTests)
  } catch (error) {
    console.error('Error fetching recent lab tests:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}