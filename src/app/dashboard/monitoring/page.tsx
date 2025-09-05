'use client'

import { useCustomSession } from '@/hooks/use-custom-session'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MonitoringPage() {
  const { user, loading } = useCustomSession()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-health-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading monitoring...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to signin
  }

  const getMonitoringComponent = () => {
    switch (user.role) {
      case 'CONTROL_ROOM':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Live Monitoring</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Patients</h3>
                <div className="text-3xl font-bold text-health-primary">24</div>
                <p className="text-sm text-gray-600">Currently monitored</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Cases</h3>
                <div className="text-3xl font-bold text-red-600">3</div>
                <p className="text-sm text-gray-600">Require immediate attention</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Available</h3>
                <div className="text-3xl font-bold text-green-600">12</div>
                <p className="text-sm text-gray-600">On duty now</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Emergency Room</span>
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Busy</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">ICU</span>
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Limited</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">General Ward</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Available</span>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">You don't have permission to access monitoring.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <DashboardLayout 
      userRole={user.role} 
      userName={user.name || user.email} 
      userImage={user.image}
    >
      {getMonitoringComponent()}
    </DashboardLayout>
  )
}