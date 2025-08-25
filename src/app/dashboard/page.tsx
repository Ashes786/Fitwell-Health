'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'

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

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (!isRedirecting) {
      setIsRedirecting(true)
      const redirectUrl = getRoleRedirectUrl(session.user?.role)
      router.push(redirectUrl)
    }
  }, [session, status, router, isRedirecting])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    </div>
  )
}