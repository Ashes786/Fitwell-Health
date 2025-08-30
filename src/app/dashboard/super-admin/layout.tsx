'use client'

import { useState, useEffect } from 'react'
import { useSession } from "@/components/providers/session-provider"
import { useRouter } from 'next/navigation'
import { UserRole } from "@prisma/client"
import { DashboardLayout } from '@/components/layout/dashboard-layout'

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

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if we're not loading and session is available but invalid
    if (!loading) {
      if (user && user.role !== "SUPER_ADMIN") {
        console.log('Redirecting: User is not SUPER_ADMIN')
        const redirectUrl = getRoleRedirectUrl(user.role)
        router.push(redirectUrl)
      } else if (!user) {
        console.log('Redirecting: No session found')
        router.push("/auth/signin")
      }
    }
  }, [user, loading, router])

  // Show loading state while session is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading session...</p>
          </div>
        </div>
      </div>
    )
  }

  // If session is loaded but user is not SUPER_ADMIN, show redirecting message
  if (user && user.role !== "SUPER_ADMIN") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Redirecting to appropriate dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  // If no session at all, show redirecting message
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Redirecting to sign in...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout 
      userRole={user.role || ''}
      userName={user.name || ''}
      userImage={user.image || ''}
    >
      {children}
    </DashboardLayout>
  )
}