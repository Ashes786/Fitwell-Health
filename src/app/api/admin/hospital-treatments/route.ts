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
    const category = searchParams.get('category') || 'all'
    const hospitalId = searchParams.get('hospitalId') || 'all'
    const status = searchParams.get('status') || 'all'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category !== 'all') {
      where.category = category
    }

    if (hospitalId !== 'all') {
      where.hospitalId = hospitalId
    }

    if (status !== 'all') {
      where.isActive = status === 'active'
    }

    const [treatments, total] = await Promise.all([
      db.hospitalTreatment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          hospital: {
            select: {
              id: true,
              name: true,
              city: true,
              state: true
            }
          },
          _count: {
            select: {
              bookings: true
            }
          }
        }
      }),
      db.hospitalTreatment.count({ where })
    ])

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
      description,
      category,
      hospitalId,
      basePrice,
      duration,
      durationUnit,
      requirements,
      preparation,
      recovery,
      risks,
      successRate,
      insuranceCoverage,
      specializations
    } = body

    // Create hospital treatment
    const treatment = await db.hospitalTreatment.create({
      data: {
        name,
        description,
        category,
        hospitalId,
        basePrice,
        duration,
        durationUnit,
        requirements,
        preparation,
        recovery,
        risks,
        successRate,
        insuranceCoverage,
        specializations,
        isActive: true,
        isPopular: false
      }
    })

    return NextResponse.json({ treatment, message: 'Hospital treatment created successfully' })
  } catch (error) {
    console.error('Error creating hospital treatment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}