'use client'

import { useCustomSession } from '@/hooks/use-custom-session'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function StaffCoordinationPage() {
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
          <p className="text-gray-600">Loading staff coordination...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to signin
  }

  const getStaffCoordinationComponent = () => {
    switch (user.role) {
      case 'CONTROL_ROOM':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Staff Coordination</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-green-800">Doctors On Duty</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">18</div>
                <div className="text-sm text-blue-800">Nurses Available</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">8</div>
                <div className="text-sm text-yellow-800">Support Staff</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">6</div>
                <div className="text-sm text-purple-800">Emergency Team</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Staff</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-health-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">DR</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Dr. Sarah Johnson</p>
                        <p className="text-xs text-gray-600">Cardiology • On Duty</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Available</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-health-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">DR</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Dr. Michael Chen</p>
                        <p className="text-xs text-gray-600">Neurology • In Surgery</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Busy</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">RN</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Nurse Emily Davis</p>
                        <p className="text-xs text-gray-600">ICU • On Duty</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Available</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">RN</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Nurse James Wilson</p>
                        <p className="text-xs text-gray-600">Emergency • On Break</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Break</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Schedule</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-blue-800">Morning Shift</p>
                      <span className="text-xs text-blue-600">6:00 AM - 2:00 PM</span>
                    </div>
                    <div className="text-xs text-blue-700">
                      8 Doctors • 12 Nurses • 4 Support Staff
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-yellow-800">Evening Shift</p>
                      <span className="text-xs text-yellow-600">2:00 PM - 10:00 PM</span>
                    </div>
                    <div className="text-xs text-yellow-700">
                      6 Doctors • 10 Nurses • 3 Support Staff
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-purple-800">Night Shift</p>
                      <span className="text-xs text-purple-600">10:00 PM - 6:00 AM</span>
                    </div>
                    <div className="text-xs text-purple-700">
                      4 Doctors • 8 Nurses • 2 Support Staff
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Coordination Activities</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Emergency Team Deployed</p>
                      <p className="text-xs text-gray-600">Cardiac arrest in ICU - Team Alpha responded</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">5 min ago</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs">👥</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Staff Reassignment</p>
                      <p className="text-xs text-gray-600">2 nurses moved from General to Emergency ward</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">15 min ago</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 text-xs">⚠️</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Staff Shortage Alert</p>
                      <p className="text-xs text-gray-600">Neurology department understaffed for evening shift</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">30 min ago</div>
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
              <p className="text-gray-600 mb-4">You don't have permission to access staff coordination.</p>
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
      {getStaffCoordinationComponent()}
    </DashboardLayout>
  )
}