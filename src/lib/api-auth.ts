import { NextRequest } from 'next/server'
import { UserRole } from '@prisma/client'
import { authenticateRequest, createAuthHandler, AuthResult } from './auth-utils'

export interface AuthResult {
  user: any
  error?: string
  status?: number
}

export type ApiHandler = (request: NextRequest, auth: AuthResult, ...args: any[]) => Promise<any>

export async function authenticateRequest(
  request: NextRequest, 
  requiredRoles?: UserRole[]
): Promise<AuthResult> {
  const { authenticateRequest: customAuthenticate } = await import('./auth-utils')
  return customAuthenticate(request, requiredRoles)
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