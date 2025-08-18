import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

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
    const role = searchParams.get('role') || 'all'
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

    if (role !== 'all') {
      where.role = role as UserRole
    }

    if (status !== 'all') {
      where.isActive = status === 'active'
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        include: {
          profile: true,
          doctor: true,
          patient: true,
          attendant: true
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.user.count({
        where
      })
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
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
      role,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      city,
      specialization,
      experience,
      licenseNumber
    } = body

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    // Create user with profile
    const userData: any = {
      name,
      email,
      phone,
      role: role as UserRole,
      isActive: true,
      profile: {
        create: {
          dateOfBirth,
          gender,
          bloodGroup,
          address,
          city
        }
      }
    }

    // Add role-specific data
    if (role === 'DOCTOR') {
      userData.doctor = {
        create: {
          specialization,
          experience: parseInt(experience) || 0,
          licenseNumber
        }
      }
    }

    const user = await db.user.create({
      data: userData,
      include: {
        profile: true,
        doctor: true,
        patient: true,
        attendant: true
      }
    })

    return NextResponse.json({ user, message: 'User created successfully' })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}