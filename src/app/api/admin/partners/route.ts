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
    const type = searchParams.get('type') || 'all'
    const status = searchParams.get('status') || 'all'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (type !== 'all') {
      where.type = type
    }

    if (status !== 'all') {
      where.isActive = status === 'active'
    }

    const [partners, total] = await Promise.all([
      db.partner.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.partner.count({ where })
    ])

    return NextResponse.json({
      partners,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching partners:', error)
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
      type,
      description,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      website,
      specialties,
      services,
      contactPerson,
      partnershipLevel
    } = body

    // Create partner
    const partner = await db.partner.create({
      data: {
        name,
        type,
        description,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        website,
        specialties,
        services,
        contactPerson,
        partnershipLevel,
        isActive: true,
        rating: 5.0
      }
    })

    return NextResponse.json({ partner, message: 'Partner created successfully' })
  } catch (error) {
    console.error('Error creating partner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}