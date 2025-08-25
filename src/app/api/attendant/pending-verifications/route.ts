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

    if (session.user?.role !== 'ATTENDANT') {
      return NextResponse.json({ error: 'Only attendants can access pending verifications' }, { status: 403 })
    }

    // Get patients without complete profiles (pending verification)
    const pendingPatients = await db.user.findMany({
      where: {
        role: 'PATIENT',
        patient: null
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // Transform data for the dashboard
    const pendingVerifications = pendingPatients.map((user, index) => {
      // Determine priority based on how long they've been waiting
      const hoursSinceRegistration = (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60)
      let priority = 'low'
      if (hoursSinceRegistration > 24) priority = 'high'
      else if (hoursSinceRegistration > 4) priority = 'medium'

      return {
        id: user.id,
        patientName: user.name || '',
        email: user.email,
        documentType: 'ID Proof', // Mock document type
        submittedAt: user.createdAt,
        priority,
        status: 'pending',
        reason: 'Profile incomplete - missing patient information'
      }
    })

    return NextResponse.json(pendingVerifications)
  } catch (error) {
    console.error('Error fetching pending verifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}