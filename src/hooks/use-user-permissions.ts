import { useState, useEffect } from 'react'
import { useSession } from "@/components/providers/session-provider"
import { UserRole } from '@prisma/client'

interface UserPermissions {
  role: UserRole
  permissions: string[]
  features: string[]
  subscriptions: string[]
}

export function useUserPermissions() {
  const { user } = useSession()
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/user/permissions')
        if (!response.ok) {
          throw new Error('Failed to fetch permissions')
        }
        const data = await response.json()
        setPermissions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchPermissions()
  }, [user])

  const hasPermission = (permission: string): boolean => {
    if (!permissions) return false
    return permissions.permissions.includes(permission)
  }

  const hasFeature = (feature: string): boolean => {
    if (!permissions) return false
    return permissions.features.includes(feature)
  }

  const hasSubscription = (subscription: string): boolean => {
    if (!permissions) return false
    return permissions.subscriptions.includes(subscription)
  }

  return {
    permissions,
    loading,
    error,
    hasPermission,
    hasFeature,
    hasSubscription,
    role: permissions?.role
  }
}