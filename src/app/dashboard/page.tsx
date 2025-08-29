'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCustomSession } from '@/hooks/use-custom-session'

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
  const { user, loading } = useCustomSession()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    console.log('Dashboard page - User:', user, 'Loading:', loading)
    
    if (loading) return

    if (!user) {
      console.log('No user found, redirecting to signin')
      router.push('/auth/signin')
      return
    }

    if (!isRedirecting) {
      console.log('Redirecting to role-specific dashboard for role:', user.role)
      setIsRedirecting(true)
      const redirectUrl = getRoleRedirectUrl(user.role)
      console.log('Redirect URL:', redirectUrl)
      router.push(redirectUrl)
    }
  }, [user, loading, router, isRedirecting])

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