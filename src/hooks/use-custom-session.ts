"use client"

import { useSession as useNextAuthSession } from 'next-auth/react'

interface User {
  id: string
  email: string
  name?: string | null
  role: string
  image?: string | null
}

interface Session {
  user: User | null
  loading: boolean
  refetch: () => Promise<void>
  clearSession: () => void
}

export function useCustomSession(): Session {
  const { data: session, status, update } = useNextAuthSession()
  
  const refetch = async () => {
    await update()
  }

  const clearSession = () => {
    // NextAuth handles session clearing automatically
    // This is kept for compatibility with existing code
    console.log('Session clear requested - NextAuth handles this automatically')
  }

  return {
    user: session?.user ? {
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.name,
      role: session.user.role,
      image: session.user.image
    } : null,
    loading: status === 'loading',
    refetch,
    clearSession
  }
}