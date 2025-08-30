// Compatibility layer for next-auth/react imports
import React from 'react'
export { useSession } from '@/components/providers/session-provider'

// Mock other NextAuth React exports that might be used
export function signIn() {
  // Redirect to sign in page
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/signin'
  }
  return Promise.resolve()
}

export function signOut() {
  // Redirect to sign out page
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/signout'
  }
  return Promise.resolve()
}

// Mock SessionProvider component
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children)
}