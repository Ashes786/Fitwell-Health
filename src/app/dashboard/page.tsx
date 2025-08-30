'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCustomSession } from '@/hooks/use-custom-session'

export default function Dashboard() {
  const { user, loading } = useCustomSession()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      // Redirect to role-specific dashboard based on user role
      switch (user.role) {
        case 'SUPER_ADMIN':
          router.push('/dashboard/super-admin')
          break
        case 'ADMIN':
          router.push('/dashboard/admin')
          break
        case 'DOCTOR':
          router.push('/dashboard/doctor')
          break
        case 'PATIENT':
          router.push('/dashboard/patient')
          break
        case 'ATTENDANT':
          router.push('/dashboard/attendant')
          break
        case 'CONTROL_ROOM':
          router.push('/dashboard/control-room')
          break
        default:
          router.push('/dashboard')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600">Please sign in to access the dashboard.</p>
          </div>
        </div>
      </div>
    )
  }

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