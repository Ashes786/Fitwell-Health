import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { UserRole } from '@prisma/client'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      address,
      city,
      state,
      country,
      postalCode,
      // Patient specific
      dateOfBirth,
      gender,
      bloodGroup,
      emergencyContact,
      cnicNumber,
      nhrNumber,
      // Doctor specific
      specialization,
      experience,
      consultationFee,
      medicalLicense,
      cnicDoctorNumber
    } = body

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    // Check if CNIC already exists for patients
    if (role === UserRole.PATIENT && cnicNumber) {
      const existingPatient = await db.patient.findUnique({
        where: { cnicNumber }
      })

      if (existingPatient) {
        return NextResponse.json({ error: 'Patient with this CNIC already exists' }, { status: 400 })
      }
    }

    // Check if CNIC already exists for doctors
    if (role === UserRole.DOCTOR && cnicDoctorNumber) {
      const existingDoctor = await db.doctor.findUnique({
        where: { cnicNumber: cnicDoctorNumber }
      })

      if (existingDoctor) {
        return NextResponse.json({ error: 'Doctor with this CNIC already exists' }, { status: 400 })
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with profile
    const userData: any = {
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      phone,
      role
    }

    if (role === UserRole.PATIENT) {
      userData.patient = {
        create: {
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender,
          bloodGroup,
          emergencyContact,
          cnicNumber,
          nhrNumber: nhrNumber || null,
          address,
          city,
          state,
          country,
          postalCode
        }
      }
    }

    if (role === UserRole.DOCTOR) {
      userData.doctor = {
        create: {
          specialization,
          experience,
          consultationFee,
          medicalLicense,
          cnicNumber: cnicDoctorNumber,
          city,
          address,
          state,
          country,
          postalCode,
          availabilitySchedule: JSON.stringify([
            { day: 'Monday', isAvailable: true, startTime: '09:00', endTime: '17:00' },
            { day: 'Tuesday', isAvailable: true, startTime: '09:00', endTime: '17:00' },
            { day: 'Wednesday', isAvailable: true, startTime: '09:00', endTime: '17:00' },
            { day: 'Thursday', isAvailable: true, startTime: '09:00', endTime: '17:00' },
            { day: 'Friday', isAvailable: true, startTime: '09:00', endTime: '17:00' }
          ])
        }
      }
    }

    const user = await db.user.create({
      data: userData,
      include: {
        patient: role === UserRole.PATIENT,
        doctor: role === UserRole.DOCTOR
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'User created successfully'
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}