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
      return NextResponse.json({ error: 'Only patients can access vitals' }, { status: 403 })
    }

    // Get patient profile
    const patient = await db.patient.findUnique({
      where: { userId: session.user.id }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
    }

    // Get patient's vitals
    const vitals = await db.vital.findMany({
      where: { patientId: patient.id },
      orderBy: { recordedAt: 'desc' }
    })

    return NextResponse.json(vitals)
  } catch (error) {
    console.error('Error fetching vitals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user?.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Only patients can record vitals' }, { status: 403 })
    }

    const body = await request.json()
    const {
      type,
      value,
      unit,
      notes
    } = body

    // Validate required fields
    if (!type || value === undefined || !unit) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get patient profile
    const patient = await db.patient.findUnique({
      where: { userId: session.user.id }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
    }

    // Create vital record
    const vital = await db.vital.create({
      data: {
        type,
        value: parseFloat(value),
        unit,
        notes: notes || null,
        patientId: patient.id,
        recordedAt: new Date()
      }
    })

    return NextResponse.json(vital)
  } catch (error) {
    console.error('Error creating vital:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}