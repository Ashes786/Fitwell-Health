"use client"

import { SessionProvider } from "next-auth/react"
import { useEffect } from "react"

interface SessionProviderProps {
  children: React.ReactNode
}

export function SessionProviderWrapper({ children }: SessionProviderProps) {
  return (
    <SessionProvider 
      session={null}
      basePath="/api/auth"
    >
      {children}
    </SessionProvider>
  )
}