import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { db } from './db'
import { NextRequest, NextResponse } from 'next/server'
import { UserRole } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  name?: string | null
  role: UserRole
}

export interface AuthResult {
  user: AuthUser | null
  error?: string
  status?: number
}

/**
 * Verify JWT token from request using NextAuth
 */
export async function verifyAuthToken(request: NextRequest): Promise<AuthResult> {
  try {
    // Get session using NextAuth's getServerSession
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return {
        user: null,
        error: 'No authentication session found',
        status: 401
      }
    }

    // Get fresh user data
    const user = await db.user.findUnique({
      where: { id: session.user.id as string },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      }
    })

    if (!user || !user.isActive) {
      return {
        user: null,
        error: 'User not found or inactive',
        status: 401
      }
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return {
      user: null,
      error: 'Invalid authentication token',
      status: 401
    }
  }
}

/**
 * Middleware to authenticate API requests
 */
export async function authenticateRequest(
  request: NextRequest, 
  requiredRoles?: UserRole[]
): Promise<AuthResult> {
  const auth = await verifyAuthToken(request)
  
  if (auth.error) {
    return auth
  }

  if (requiredRoles && requiredRoles.length > 0 && auth.user) {
    if (!requiredRoles.includes(auth.user.role)) {
      return {
        user: null,
        error: 'Insufficient permissions',
        status: 403
      }
    }
  }

  return auth
}

/**
 * Higher-order function to create authenticated API handlers
 */
export function createAuthHandler(handler: (request: NextRequest, auth: AuthResult, ...args: any[]) => Promise<any>, requiredRoles?: UserRole[]) {
  return async (request: NextRequest, ...args: any[]) => {
    const auth = await authenticateRequest(request, requiredRoles)
    
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }
    
    return handler(request, auth, ...args)
  }
}

/**
 * Convenience functions for GET and POST handlers
 */
export function createAuthenticatedGETHandler(handler: (request: NextRequest, auth: AuthResult, ...args: any[]) => Promise<any>, requiredRoles?: UserRole[]) {
  return createAuthHandler(handler, requiredRoles)
}

export function createAuthenticatedPOSTHandler(handler: (request: NextRequest, auth: AuthResult, ...args: any[]) => Promise<any>, requiredRoles?: UserRole[]) {
  return createAuthHandler(handler, requiredRoles)
}

/**
 * Get user from request (for use in API routes)
 */
export async function getUserFromRequest(request: NextRequest): Promise<AuthUser | null> {
  const auth = await verifyAuthToken(request)
  return auth.user || null
}