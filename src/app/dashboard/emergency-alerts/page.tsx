'use client'

import { useCustomSession } from '@/hooks/use-custom-session'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function EmergencyAlertsPage() {
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
          <p className="text-gray-600">Loading emergency alerts...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to signin
  }

  const getEmergencyAlertsComponent = () => {
    switch (user.role) {
      case 'CONTROL_ROOM':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Emergency Alerts</h1>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-red-600 font-medium">Live Alerts</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600">5</div>
                <div className="text-sm text-red-800">Critical Alerts</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">12</div>
                <div className="text-sm text-yellow-800">Warning Alerts</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">8</div>
                <div className="text-sm text-blue-800">Info Alerts</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">23</div>
                <div className="text-sm text-green-800">Resolved Today</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-xs font-bold">🚨</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-800">Code Blue - ICU Room 204</h3>
                      <p className="text-sm text-red-600">Cardiac arrest in progress</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-red-600 font-medium">CRITICAL</div>
                    <div className="text-xs text-gray-500">2 min ago</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span>👨‍⚕️ Response Team: Alpha</span>
                    <span>📍 ICU Room 204</span>
                    <span>⏱️ Response Time: 1 min</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                      Acknowledge
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                      Details
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-xs font-bold">🚨</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-800">Mass Casualty Incident</h3>
                      <p className="text-sm text-red-600">Multi-vehicle accident on Highway 101</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-red-600 font-medium">CRITICAL</div>
                    <div className="text-xs text-gray-500">5 min ago</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span>🚑 3 Ambulances dispatched</span>
                    <span>👥 Estimated 8-10 patients</span>
                    <span>🏥 St. Mary's Hospital notified</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                      Acknowledge
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                      Details
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 text-xs font-bold">⚠️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-800">Equipment Failure</h3>
                      <p className="text-sm text-yellow-600">Ventilator #003 malfunctioning in ICU</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-yellow-600 font-medium">WARNING</div>
                    <div className="text-xs text-gray-500">8 min ago</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span>🔧 Maintenance team notified</span>
                    <span>🔄 Backup ventilator activated</span>
                    <span>👨‍⚕️ Patient stable</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700">
                      Acknowledge
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                      Details
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 text-xs font-bold">⚠️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-800">Staff Shortage</h3>
                      <p className="text-sm text-yellow-600">Emergency department understaffed for evening shift</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-yellow-600 font-medium">WARNING</div>
                    <div className="text-xs text-gray-500">12 min ago</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span>👥 Need 2 more nurses</span>
                    <span>📞 On-call staff contacted</span>
                    <span>⏱️ Expected in 30 mins</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700">
                      Acknowledge
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                      Details
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">ℹ️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-800">Weather Alert</h3>
                      <p className="text-sm text-blue-600">Severe thunderstorm warning in effect</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-blue-600 font-medium">INFO</div>
                    <div className="text-xs text-gray-500">15 min ago</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span>🌧️ Expected in 2 hours</span>
                    <span>⚡ Power backup ready</span>
                    <span>🚑 Emergency protocols activated</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      Acknowledge
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                      Details
                    </button>
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
              <p className="text-gray-600 mb-4">You don't have permission to access emergency alerts.</p>
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
      {getEmergencyAlertsComponent()}
    </DashboardLayout>
  )
}