// Client-side authentication utilities
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Get the session from client-side storage
  const session = await getClientSession()
  
  if (!session) {
    throw new Error('No session found')
  }
  
  // Add Authorization header
  const authOptions: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${session.accessToken || session.user?.id}`,
      'Content-Type': 'application/json',
    },
  }
  
  const response = await fetch(url, authOptions)
  
  if (response.status === 401) {
    // Redirect to login if unauthorized
    window.location.href = '/auth/signin'
    throw new Error('Unauthorized')
  }
  
  return response
}

// Helper to get client-side session
async function getClientSession() {
  try {
    const response = await fetch('/api/auth/session')
    const session = await response.json()
    return session
  } catch (error) {
    console.error('Error getting client session:', error)
    return null
  }
}

// Server-side auth check for API routes
export async function requireAuth(request: Request, requiredRole?: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return { authorized: false, error: 'Unauthorized' }
  }
  
  if (requiredRole && session.user.role !== requiredRole) {
    return { authorized: false, error: 'Insufficient permissions' }
  }
  
  return { authorized: true, session }
}

// Import server-side auth
import { getServerSession } from "next-auth"
import { authOptions } from "./auth"