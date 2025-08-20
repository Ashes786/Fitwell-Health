import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface UseRoleAuthorizationOptions {
  requiredRole?: string
  redirectTo?: string
  showUnauthorizedMessage?: boolean
}

export function useRoleAuthorization(options: UseRoleAuthorizationOptions = {}) {
  const { 
    requiredRole, 
    redirectTo = '/auth/signin',
    showUnauthorizedMessage = true 
  } = options
  
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isUnauthorized, setIsUnauthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      if (redirectTo) {
        router.push(redirectTo)
      }
      setIsLoading(false)
      return
    }

    if (requiredRole && session.user?.role !== requiredRole) {
      if (showUnauthorizedMessage) {
        setIsUnauthorized(true)
      } else if (redirectTo) {
        router.push(redirectTo)
      }
      setIsLoading(false)
      return
    }

    setIsAuthorized(true)
    setIsLoading(false)
  }, [session, status, requiredRole, redirectTo, showUnauthorizedMessage, router])

  return {
    isAuthorized,
    isUnauthorized,
    isLoading,
    session
  }
}