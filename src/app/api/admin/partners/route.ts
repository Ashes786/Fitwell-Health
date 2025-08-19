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

    const skip = (page - 1) * limit

    // Build where clauses for each partner type
    const whereClause: any = {}
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Fetch all partner types based on filter
    let labPartners: any[] = []
    let pharmacyPartners: any[] = []
    let hospitalPartners: any[] = []

    if (type === 'all' || type === 'LAB') {
      labPartners = await db.labPartner.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    }

    if (type === 'all' || type === 'PHARMACY') {
      pharmacyPartners = await db.pharmacyPartner.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    }

    if (type === 'all' || type === 'HOSPITAL') {
      hospitalPartners = await db.hospitalPartner.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    }

    // Transform to unified partner format
    const partners = [
      ...labPartners.map(p => ({ ...p, type: 'LAB' })),
      ...pharmacyPartners.map(p => ({ ...p, type: 'PHARMACY' })),
      ...hospitalPartners.map(p => ({ ...p, type: 'HOSPITAL' }))
    ]

    const total = partners.length

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
      website
    } = body

    let partner

    // Create partner based on type
    switch (type) {
      case 'LAB':
        partner = await db.labPartner.create({
          data: {
            name,
            address,
            phone,
            email,
            website,
            isActive: true
          }
        })
        break
      case 'PHARMACY':
        partner = await db.pharmacyPartner.create({
          data: {
            name,
            address,
            phone,
            email,
            website,
            isActive: true
          }
        })
        break
      case 'HOSPITAL':
        partner = await db.hospitalPartner.create({
          data: {
            name,
            address,
            phone,
            email,
            website,
            isActive: true
          }
        })
        break
      default:
        return NextResponse.json({ error: 'Invalid partner type' }, { status: 400 })
    }

    // Add type to the response
    const partnerWithType = { ...partner, type }

    return NextResponse.json({ partner: partnerWithType, message: 'Partner created successfully' })
  } catch (error) {
    console.error('Error creating partner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}