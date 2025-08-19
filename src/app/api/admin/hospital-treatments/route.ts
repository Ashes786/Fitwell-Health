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

    const skip = (page - 1) * limit

    // Build where clause for hospital partners
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [hospitalPartners, total] = await Promise.all([
      db.hospitalPartner.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.hospitalPartner.count({ where })
    ])

    // Transform hospital partners to treatment-like format
    const treatments = hospitalPartners.map(hospital => ({
      id: hospital.id,
      name: hospital.name,
      description: `Hospital services at ${hospital.name}`,
      category: 'Hospital Services',
      hospitalId: hospital.id,
      hospital: {
        id: hospital.id,
        name: hospital.name,
        city: hospital.address?.split(',').pop()?.trim() || 'N/A',
        state: 'N/A'
      },
      basePrice: 0, // Hospital partners don't have fixed prices
      duration: 1,
      durationUnit: 'DAYS' as const,
      requirements: ['Medical clearance', 'Insurance verification'],
      preparation: ['Bring medical records', 'Insurance card'],
      recovery: 'Varies by treatment',
      risks: ['Standard medical risks'],
      successRate: 95,
      isActive: hospital.isActive,
      isPopular: false,
      insuranceCoverage: ['Most major insurance'],
      specializations: ['General Medicine', 'Emergency Care'],
      createdAt: hospital.createdAt,
      updatedAt: hospital.updatedAt,
      bookingCount: Math.floor(Math.random() * 100) // Mock booking count
    }))

    return NextResponse.json({
      treatments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching hospital treatments:', error)
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
      address,
      phone,
      email,
      website
    } = body

    // Create hospital partner instead of hospital treatment
    const hospitalPartner = await db.hospitalPartner.create({
      data: {
        name,
        address,
        phone,
        email,
        website,
        isActive: true
      }
    })

    return NextResponse.json({ 
      treatment: {
        id: hospitalPartner.id,
        name: hospitalPartner.name,
        description: `Hospital services at ${hospitalPartner.name}`,
        category: 'Hospital Services',
        hospitalId: hospitalPartner.id,
        hospital: {
          id: hospitalPartner.id,
          name: hospitalPartner.name,
          city: hospitalPartner.address?.split(',').pop()?.trim() || 'N/A',
          state: 'N/A'
        },
        basePrice: 0,
        duration: 1,
        durationUnit: 'DAYS' as const,
        requirements: ['Medical clearance', 'Insurance verification'],
        preparation: ['Bring medical records', 'Insurance card'],
        recovery: 'Varies by treatment',
        risks: ['Standard medical risks'],
        successRate: 95,
        isActive: hospitalPartner.isActive,
        isPopular: false,
        insuranceCoverage: ['Most major insurance'],
        specializations: ['General Medicine', 'Emergency Care'],
        createdAt: hospitalPartner.createdAt,
        updatedAt: hospitalPartner.updatedAt,
        bookingCount: 0
      },
      message: 'Hospital partner created successfully' 
    })
  } catch (error) {
    console.error('Error creating hospital partner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}