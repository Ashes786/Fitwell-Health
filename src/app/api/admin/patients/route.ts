import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { authenticateRequest, createAuthenticatedGETHandler, createAuthenticatedPOSTHandler } from '@/lib/api-auth'
import { getPaginationParams, buildSearchWhereClause, buildStatusWhereClause, createPaginatedResponse } from '@/lib/pagination'
import { UserRole } from '@prisma/client'

const getHandler = async (request: NextRequest, auth: any) => {
  const pagination = getPaginationParams(request)

  // Build where clause
  const where: any = {
    role: 'PATIENT'
  }
  
  if (pagination.search) {
    Object.assign(where, buildSearchWhereClause(pagination.search, ['name', 'email', 'phone']))
  }

  if (pagination.status !== 'all') {
    Object.assign(where, buildStatusWhereClause(pagination.status))
  }

  return createPaginatedResponse(
    db.user.findMany({
      where,
      include: {
        patient: true,
        userSubscriptions: {
          include: {
            subscriptionPlan: true
          }
        }
      },
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: 'desc' }
    }),
    db.user.count({
      where
    }),
    pagination
  )
}

const postHandler = async (request: NextRequest, auth: any) => {
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
    password
  } = body

  // Hash password
  const hashedPassword = await bcrypt.hash(password || 'patient123', 12)

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    const { NextResponse } = await import('next/server')
    return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
  }

  // Create user
  const user = await db.user.create({
    data: {
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'PATIENT',
      isActive: true,
      patient: {
        create: {
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender,
          bloodGroup,
          address,
          city,
          emergencyContact
        }
      }
    },
    include: {
      patient: true
    }
  })

  const { NextResponse } = await import('next/server')
  return NextResponse.json({ user, message: 'Patient created successfully' })
}

export const GET = createAuthenticatedGETHandler(getHandler, [UserRole.ADMIN])
export const POST = createAuthenticatedPOSTHandler(postHandler, [UserRole.ADMIN])