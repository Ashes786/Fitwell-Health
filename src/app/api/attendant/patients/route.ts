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
      return NextResponse.json({ error: 'Only attendants can access patients' }, { status: 403 })
    }

    // Get all patients
    const patients = await db.patient.findMany({
      include: {
        user: true,
        appointments: {
          include: {
            doctor: {
              include: {
                user: true
              }
            }
          },
          orderBy: {
            scheduledAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(patients)
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user?.role !== 'ATTENDANT') {
      return NextResponse.json({ error: 'Only attendants can register patients' }, { status: 403 })
    }

    const body = await request.json()
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      emergencyContactName,
      emergencyContactPhone,
      medicalHistory,
      allergies,
      currentMedications
    } = body

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone || !dateOfBirth || !gender) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    // Create user account
    const user = await db.user.create({
      data: {
        email,
        password, // In production, this should be hashed
        firstName,
        lastName,
        phone,
        role: 'PATIENT',
        city: city || null
      }
    })

    // Generate patient number
    const patientCount = await db.patient.count()
    const patientNumber = `PAT-${new Date().getFullYear()}-${String(patientCount + 1).padStart(3, '0')}`

    // Create patient profile
    const patient = await db.patient.create({
      data: {
        patientNumber,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        address: address || null,
        emergencyContactName: emergencyContactName || null,
        emergencyContactPhone: emergencyContactPhone || null,
        medicalHistory: medicalHistory || null,
        allergies: allergies || null,
        currentMedications: currentMedications || null,
        userId: user.id
      },
      include: {
        user: true
      }
    })

    return NextResponse.json({
      success: true,
      patient,
      message: 'Patient registered successfully'
    })
  } catch (error) {
    console.error('Error registering patient:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}