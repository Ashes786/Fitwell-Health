'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCustomSession } from '@/hooks/use-custom-session'
import { AttendantDashboard } from '@/components/dashboards/attendant-dashboard'

export default function AttendantDashboardPage() {
  const { user, loading } = useCustomSession()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    
    if (!user) {
      router.push('/auth/signin')
      return
    }

    // No redirect - let this page render with its own layout
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AttendantDashboard 
      userName={user?.name || 'Attendant'} 
      userImage={user?.image}
    />
  )
}