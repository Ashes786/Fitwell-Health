import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status !== 'all') {
      where.isActive = status === 'active'
    }

    const [patients, total] = await Promise.all([
      db.user.findMany({
        where: {
          ...where,
          role: 'PATIENT'
        },
        include: {
          patient: true,
          userSubscriptions: {
            include: {
              subscriptionPlan: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.user.count({
        where: {
          ...where,
          role: 'PATIENT'
        }
      })
    ])

    return NextResponse.json({
      patients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      city,
      emergencyContact,
      medicalHistory
    } = body

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        phone,
        role: 'PATIENT',
        isActive: true,
        patient: {
          create: {
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            gender,
            bloodGroup,
            address,
            city,
            emergencyContact,
            medicalHistory
          }
        }
      },
      include: {
        patient: true
      }
    })

    return NextResponse.json({ user, message: 'Patient created successfully' })
  } catch (error) {
    console.error('Error creating patient:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}