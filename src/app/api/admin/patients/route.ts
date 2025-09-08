import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getFilteredData, checkResourceAccess } from '@/lib/rbac-utils'
import bcrypt from 'bcryptjs'
import { authenticateRequest, createAuthenticatedGETHandler, createAuthenticatedPOSTHandler } from '@/lib/api-auth'
import { getPaginationParams, buildSearchWhereClause, buildStatusWhereClause, createPaginatedResponse } from '@/lib/pagination'
import { UserRole } from '@prisma/client'

const getHandler = async (request: NextRequest, auth: any) => {
  const pagination = getPaginationParams(request)

  // Get admin's network patients only
  const { data: patients, hasAccess } = await getFilteredData(
    auth.user.id,
    auth.user.role,
    'patients',
    {
      where: {
        user: {
          role: 'PATIENT',
          ...(pagination.search && {
            OR: [
              { name: { contains: pagination.search, mode: 'insensitive' } },
              { email: { contains: pagination.search, mode: 'insensitive' } },
              { phone: { contains: pagination.search, mode: 'insensitive' } }
            ]
          }),
          ...(pagination.status !== 'all' && {
            isActive: pagination.status === 'active'
          })
        }
      },
      include: {
        patient: {
          include: {
            organization: {
              select: {
                id: true,
                name: true,
                type: true
              }
            }
          }
        },
        userSubscriptions: {
          include: {
            subscriptionPlan: true
          }
        }
      },
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: 'desc' }
    }
  )

  if (!hasAccess) {
    const { NextResponse } = await import('next/server')
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }

  // Get total count for pagination
  const totalCount = await db.user.count({
    where: {
      role: 'PATIENT',
      ...(pagination.search && {
        OR: [
          { name: { contains: pagination.search, mode: 'insensitive' } },
          { email: { contains: pagination.search, mode: 'insensitive' } },
          { phone: { contains: pagination.search, mode: 'insensitive' } }
        ]
      }),
      ...(pagination.status !== 'all' && {
        isActive: pagination.status === 'active'
      })
    }
  })

  return createPaginatedResponse(
    patients,
    totalCount,
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
    password,
    organizationId
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
  const userData: any = {
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
        emergencyContact,
        ...(organizationId && { organizationId })
      }
    }
  }

  const user = await db.user.create({
    data: userData,
    include: {
      patient: {
        include: {
          organization: true
        }
      }
    }
  })

  // Add user to admin's network
  if (auth.user.role === UserRole.ADMIN) {
    const admin = await db.admin.findUnique({
      where: { userId: auth.user.id }
    })

    if (admin) {
      await db.networkUser.create({
        data: {
          adminId: admin.id,
          userId: user.id,
          userType: UserRole.PATIENT
        }
      })
    }
  }

  const { NextResponse } = await import('next/server')
  return NextResponse.json({ user, message: 'Patient created successfully' })
}

export const GET = createAuthenticatedGETHandler(getHandler, [UserRole.ADMIN])
export const POST = createAuthenticatedPOSTHandler(postHandler, [UserRole.ADMIN])