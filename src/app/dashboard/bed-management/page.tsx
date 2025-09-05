'use client'

import { useCustomSession } from '@/hooks/use-custom-session'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function BedManagementPage() {
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
          <p className="text-gray-600">Loading bed management...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to signin
  }

  const getBedManagementComponent = () => {
    switch (user.role) {
      case 'CONTROL_ROOM':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Bed Management</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">45</div>
                <div className="text-sm text-green-800">Available Beds</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600">23</div>
                <div className="text-sm text-red-800">Occupied Beds</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">8</div>
                <div className="text-sm text-yellow-800">Reserved Beds</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-blue-800">Maintenance</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ICU Beds</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((bed) => (
                    <div key={bed} className={`p-3 rounded text-center text-sm font-medium ${
                      bed <= 2 ? 'bg-red-100 text-red-800' : 
                      bed === 3 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      Bed {bed}
                      <div className="text-xs mt-1">
                        {bed <= 2 ? 'Occupied' : bed === 3 ? 'Reserved' : 'Available'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">General Ward</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((bed) => (
                    <div key={bed} className={`p-3 rounded text-center text-sm font-medium ${
                      bed <= 5 ? 'bg-red-100 text-red-800' : 
                      bed <= 7 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      Bed {bed}
                      <div className="text-xs mt-1">
                        {bed <= 5 ? 'Occupied' : bed <= 7 ? 'Reserved' : 'Available'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bed Assignments</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-health-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">P</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Patient #1234</p>
                      <p className="text-xs text-gray-600">ICU Bed 2 - Cardiac Care</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">10 min ago</div>
                    <div className="text-xs text-green-600">Assigned</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-health-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">P</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Patient #5678</p>
                      <p className="text-xs text-gray-600">General Ward Bed 3 - Post-op</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">25 min ago</div>
                    <div className="text-xs text-green-600">Assigned</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">P</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Patient #9012</p>
                      <p className="text-xs text-gray-600">ICU Bed 1 - Discharged</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">1 hour ago</div>
                    <div className="text-xs text-blue-600">Vacated</div>
                  </div>
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
              <p className="text-gray-600 mb-4">You don't have permission to access bed management.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <DashboardLayout 
      userRole={user.role} 
      userName={user.name || user.email} 
      userImage={user.avatar}
    >
      {getBedManagementComponent()}
    </DashboardLayout>
  )
}