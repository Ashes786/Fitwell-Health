'use client'

import { useSession } from "@/components/providers/session-provider"
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { UserRole } from "@prisma/client"

interface AuthLayoutProps {
  children: ReactNode
  requiredRole: UserRole
  redirectTo?: string
  useDashboardLayout?: boolean
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Helper function to get role-specific redirect URL
function getRoleRedirectUrl(userRole: string): string {
  const roleMap: Record<string, string> = {
    'SUPER_ADMIN': '/dashboard/super-admin',
    'ADMIN': '/dashboard/admin',
    'DOCTOR': '/dashboard/doctor',
    'PATIENT': '/dashboard/patient',
    'ATTENDANT': '/dashboard/attendant',
    'CONTROL_ROOM': '/dashboard/control-room'
  }
  return roleMap[userRole] || '/dashboard'
}

export function AuthLayout({ 
  children, 
  requiredRole, 
  redirectTo = '/auth/signin',
  useDashboardLayout = false 
}: AuthLayoutProps) {
  const { user, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if we're not loading and session is available but invalid
    if (!loading) {
      if (user && user.role !== requiredRole) {
        const redirectUrl = getRoleRedirectUrl(user.role)
        router.push(redirectUrl)
      } else if (!user) {
        router.push(redirectTo)
      }
    }
  }, [user, loading, router, requiredRole, redirectTo])

  // Show loading state while session is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  // If session is loaded but user doesn't have required role, redirect
  if (user && user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  // If no session at all, redirect to signin
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  // Return children directly
  return <>{children}</>
}