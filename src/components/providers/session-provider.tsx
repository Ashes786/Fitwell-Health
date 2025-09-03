"use client"

import { SessionProvider } from "@/lib/compat-next-auth-react"
import { useSession } from "@/lib/compat-next-auth-react"

interface SessionProviderProps {
  children: React.ReactNode
}

export function SessionProviderWrapper({ children }: SessionProviderProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

// Re-export useSession for convenience
export { useSession }