"use client"

import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name?: string | null
  role: string
}

interface Session {
  user: User | null
  loading: boolean
  refetch: () => Promise<void>
}

export function useCustomSession(): Session {
  const [session, setSession] = useState<Session>({
    user: null,
    loading: true,
    refetch: async () => {}
  })

  const refetch = async () => {
    console.log('Refetching session...')
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      console.log('Session data:', data)
      
      setSession(prev => ({
        ...prev,
        user: data.user || null,
        loading: false
      }))
    } catch (error) {
      console.error('Error fetching session:', error)
      setSession(prev => ({
        ...prev,
        user: null,
        loading: false
      }))
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  return {
    user: session.user,
    loading: session.loading,
    refetch
  }
}