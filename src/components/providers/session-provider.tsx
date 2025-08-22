"use client"

import { SessionProvider } from "next-auth/react"
import { useEffect } from "react"

interface SessionProviderProps {
  children: React.ReactNode
}

export function SessionProviderWrapper({ children }: SessionProviderProps) {
  return (
    <SessionProvider 
      basePath="/api/auth"
      refetchOnWindowFocus={false}
      refetchInterval={0}
    >
      {children}
    </SessionProvider>
  )
}