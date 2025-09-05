'use client'

import { useCustomSession } from '@/hooks/use-custom-session'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AmbulanceTrackingPage() {
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
          <p className="text-gray-600">Loading ambulance tracking...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to signin
  }

  const getAmbulanceTrackingComponent = () => {
    switch (user.role) {
      case 'CONTROL_ROOM':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Ambulance Tracking</h1>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Live Tracking</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-sm text-green-800">Available</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600">3</div>
                <div className="text-sm text-red-800">On Emergency</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">2</div>
                <div className="text-sm text-yellow-800">Maintenance</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">5</div>
                <div className="text-sm text-blue-800">On Transfer</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Emergency Missions</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-red-800">Ambulance #EMS-001</p>
                      <span className="text-xs text-red-600">Priority: Critical</span>
                    </div>
                    <p className="text-xs text-red-700 mb-2">Cardiac arrest - Downtown Area</p>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>📍 2.5 km away</span>
                      <span>⏱️ ETA: 8 mins</span>
                      <span>👨‍⚕️ Dr. Sarah on board</span>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-yellow-800">Ambulance #EMS-003</p>
                      <span className="text-xs text-yellow-600">Priority: Urgent</span>
                    </div>
                    <p className="text-xs text-yellow-700 mb-2">Traffic accident - Highway Junction</p>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>📍 5.1 km away</span>
                      <span>⏱️ ETA: 12 mins</span>
                      <span>👨‍⚕️ Paramedic team</span>
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-orange-800">Ambulance #EMS-005</p>
                      <span className="text-xs text-orange-600">Priority: High</span>
                    </div>
                    <p className="text-xs text-orange-700 mb-2">Stroke patient - Residential Area</p>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>📍 3.8 km away</span>
                      <span>⏱️ ETA: 10 mins</span>
                      <span>👨‍⚕️ Neuro team on board</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ambulance Fleet Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">🚑</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Ambulance #EMS-001</p>
                        <p className="text-xs text-gray-600">Advanced Life Support</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-red-600 font-medium">On Emergency</div>
                      <div className="text-xs text-gray-500">Downtown</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">🚑</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Ambulance #EMS-002</p>
                        <p className="text-xs text-gray-600">Basic Life Support</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-green-600 font-medium">Available</div>
                      <div className="text-xs text-gray-500">Base Station</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">🚑</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Ambulance #EMS-003</p>
                        <p className="text-xs text-gray-600">Advanced Life Support</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-yellow-600 font-medium">On Emergency</div>
                      <div className="text-xs text-gray-500">Highway</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">🚑</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Ambulance #EMS-004</p>
                        <p className="text-xs text-gray-600">Patient Transfer</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-blue-600 font-medium">On Transfer</div>
                      <div className="text-xs text-gray-500">City Hospital</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Mission Completed</p>
                      <p className="text-xs text-gray-600">EMS-002 delivered patient to St. Mary's Hospital</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">15 min ago</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-xs">🚨</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Emergency Dispatched</p>
                      <p className="text-xs text-gray-600">EMS-005 dispatched to stroke emergency</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">25 min ago</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs">🔄</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Vehicle Returned</p>
                      <p className="text-xs text-gray-600">EMS-006 returned from maintenance, now available</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">1 hour ago</div>
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
              <p className="text-gray-600 mb-4">You don't have permission to access ambulance tracking.</p>
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
      {getAmbulanceTrackingComponent()}
    </DashboardLayout>
  )
}