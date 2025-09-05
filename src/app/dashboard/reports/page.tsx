'use client'

import { useCustomSession } from '@/hooks/use-custom-session'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ReportsPage() {
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
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to signin
  }

  const getReportsComponent = () => {
    switch (user.role) {
      case 'CONTROL_ROOM':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-sm text-blue-800">Reports Today</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">18</div>
                <div className="text-sm text-green-800">Completed</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">6</div>
                <div className="text-sm text-yellow-800">Pending Review</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Reports</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 text-xs">🚨</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Code Blue - ICU Room 204</p>
                        <p className="text-xs text-gray-600">Cardiac arrest incident</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">2 hours ago</div>
                      <div className="text-xs text-yellow-600">Pending Review</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 text-xs">⚠️</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Equipment Failure</p>
                        <p className="text-xs text-gray-600">Ventilator malfunction</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">4 hours ago</div>
                      <div className="text-xs text-green-600">Completed</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs">📋</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Staff Response Time</p>
                        <p className="text-xs text-gray-600">Emergency response analysis</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">6 hours ago</div>
                      <div className="text-xs text-green-600">Completed</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Summary</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-green-800">Emergency Responses</p>
                      <span className="text-sm text-green-600 font-bold">15</span>
                    </div>
                    <div className="text-xs text-green-700">
                      Average response time: 3.2 minutes
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-blue-800">Patient Transfers</p>
                      <span className="text-sm text-blue-600 font-bold">8</span>
                    </div>
                    <div className="text-xs text-blue-700">
                      All transfers completed successfully
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-yellow-800">Equipment Issues</p>
                      <span className="text-sm text-yellow-600 font-bold">3</span>
                    </div>
                    <div className="text-xs text-yellow-700">
                      2 resolved, 1 in progress
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-purple-800">Staff Coordination</p>
                      <span className="text-sm text-purple-600 font-bold">12</span>
                    </div>
                    <div className="text-xs text-purple-700">
                      Staff reassignments and shift changes
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate New Report</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="text-blue-600 mb-2">📊</div>
                  <div className="text-sm font-medium text-gray-900">Incident Summary</div>
                  <div className="text-xs text-gray-600">Daily/Weekly/Monthly</div>
                </button>
                <button className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="text-green-600 mb-2">⏱️</div>
                  <div className="text-sm font-medium text-gray-900">Response Time</div>
                  <div className="text-xs text-gray-600">Performance metrics</div>
                </button>
                <button className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
                  <div className="text-yellow-600 mb-2">👥</div>
                  <div className="text-sm font-medium text-gray-900">Staff Activity</div>
                  <div className="text-xs text-gray-600">Shift and coordination</div>
                </button>
                <button className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                  <div className="text-purple-600 mb-2">🏥</div>
                  <div className="text-sm font-medium text-gray-900">Resource Usage</div>
                  <div className="text-xs text-gray-600">Equipment and facilities</div>
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Daily Operations Report</p>
                      <p className="text-xs text-gray-600">Generated by System • March 15, 2024</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      View
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                      Download
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Emergency Response Analysis</p>
                      <p className="text-xs text-gray-600">Generated by Dr. Sarah • March 14, 2024</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      View
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                      Download
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 text-xs">⏳</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Weekly Performance Summary</p>
                      <p className="text-xs text-gray-600">Auto-generated • March 13, 2024</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      View
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                      Download
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
              <p className="text-gray-600 mb-4">You don't have permission to access reports.</p>
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
      {getReportsComponent()}
    </DashboardLayout>
  )
}