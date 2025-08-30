// Compatibility layer to make NextAuth imports work with custom JWT system
import { getUserFromRequest } from './auth-utils'

// Re-export the custom auth functions with NextAuth-compatible names
export { getUserFromRequest as getServerSession }

// Mock authOptions for compatibility
export const authOptions = {
  // This is just for compatibility - the actual auth is handled by our custom system
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development"
}

// Create a mock session object that matches NextAuth structure
export function createMockSession(user: any) {
  return {
    user: user,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
  }
}