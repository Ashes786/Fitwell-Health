import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { UserRole } from '@prisma/client'

export interface AuthResult {
  session: any
  user: any
  error?: string
  status?: number
}

export type ApiHandler = (request: NextRequest, auth: AuthResult, ...args: any[]) => Promise<any>

export async function authenticateRequest(
  request: NextRequest, 
  requiredRoles?: UserRole[]
): Promise<AuthResult> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return {
        session: null,
        user: null,
        error: 'Unauthorized',
        status: 401
      }
    }

    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = session.user?.role as UserRole
      if (!userRole || !requiredRoles.includes(userRole)) {
        return {
          session: null,
          user: null,
          error: 'Insufficient permissions',
          status: 403
        }
      }
    }

    return {
      session,
      user: session.user
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      session: null,
      user: null,
      error: 'Authentication failed',
      status: 500
    }
  }
}

export function createAuthHandler(handler: ApiHandler, requiredRoles?: UserRole[]) {
  return async (request: NextRequest, ...args: any[]) => {
    const auth = await authenticateRequest(request, requiredRoles)
    
    if (auth.error) {
      const { NextResponse } = await import('next/server')
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }
    
    return handler(request, auth, ...args)
  }
}

export function createAuthenticatedGETHandler(handler: ApiHandler, requiredRoles?: UserRole[]) {
  return createAuthHandler(handler, requiredRoles)
}

export function createAuthenticatedPOSTHandler(handler: ApiHandler, requiredRoles?: UserRole[]) {
  return createAuthHandler(handler, requiredRoles)
}