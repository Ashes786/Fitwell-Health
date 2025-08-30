"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

interface User {
  id: string
  email: string
  name?: string | null
  role: string
}

interface SessionContextType {
  user: User | null
  loading: boolean
  refetch: () => Promise<void>
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  loading: true,
  refetch: async () => {}
})

export function useSession() {
  return useContext(SessionContext)
}

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProviderWrapper({ children }: SessionProviderProps) {
  const [session, setSession] = useState<{
    user: User | null
    loading: boolean
  }>({
    user: null,
    loading: true
  })

  const refetch = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include'
      })
      const data = await response.json()
      
      setSession({
        user: data.user || null,
        loading: false
      })
    } catch (error) {
      console.error('Error fetching session:', error)
      setSession({
        user: null,
        loading: false
      })
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  return (
    <SessionContext.Provider value={{ ...session, refetch }}>
      {children}
    </SessionContext.Provider>
  )
}