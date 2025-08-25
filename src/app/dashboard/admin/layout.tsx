'use client'

import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { UserRole } from "@prisma/client"

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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
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

  if (!session) {
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

  if (session.user?.role !== 'ADMIN') {
    const redirectUrl = getRoleRedirectUrl(session.user?.role)
    router.push(redirectUrl)
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

  return (
    <DashboardLayout 
      userRole={session.user?.role || ''}
      userName={session.user?.name || ''}
      userImage={session.user?.image || ''}
    >
      {children}
    </DashboardLayout>
  )
}