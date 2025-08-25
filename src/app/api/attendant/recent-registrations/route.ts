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
      return NextResponse.json({ error: 'Only attendants can access recent registrations' }, { status: 403 })
    }

    // Get recent patient registrations
    const recentPatients = await db.user.findMany({
      where: {
        role: 'PATIENT'
      },
      include: {
        patient: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // Transform data for the dashboard
    const recentRegistrations = recentPatients.map(user => ({
      id: user.id,
      name: user.name || '',
      email: user.email,
      avatar: user.avatar || '',
      status: user.patient ? 'completed' : 'pending',
      registrationDate: user.createdAt,
      nhrNumber: user.patient?.nhrNumber || null
    }))

    return NextResponse.json(recentRegistrations)
  } catch (error) {
    console.error('Error fetching recent registrations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}