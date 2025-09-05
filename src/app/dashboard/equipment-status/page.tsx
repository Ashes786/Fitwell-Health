'use client'

import { useCustomSession } from '@/hooks/use-custom-session'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function EquipmentStatusPage() {
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
          <p className="text-gray-600">Loading equipment status...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to signin
  }

  const getEquipmentStatusComponent = () => {
    switch (user.role) {
      case 'CONTROL_ROOM':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Equipment Status</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">45</div>
                <div className="text-sm text-green-800">Operational</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">8</div>
                <div className="text-sm text-yellow-800">Maintenance</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600">3</div>
                <div className="text-sm text-red-800">Out of Service</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-blue-800">In Use</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Equipment</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Ventilator #001</p>
                        <p className="text-xs text-gray-600">ICU Room 204</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Operational</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Defibrillator #A1</p>
                        <p className="text-xs text-gray-600">Emergency Room</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Operational</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 text-xs">⚠️</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">X-Ray Machine #2</p>
                        <p className="text-xs text-gray-600">Radiology Dept</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Maintenance</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 text-xs">✗</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">ECG Machine #003</p>
                        <p className="text-xs text-gray-600">Cardiology Ward</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Out of Service</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Room Equipment</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Anesthesia Machine #1</p>
                        <p className="text-xs text-gray-600">OR 1 • Available</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Ready</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs">🔵</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Surgical Table #2</p>
                        <p className="text-xs text-gray-600">OR 2 • In Use</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">In Use</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Electrosurgical Unit #1</p>
                        <p className="text-xs text-gray-600">OR 3 • Available</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Ready</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 text-xs">⚠️</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Patient Monitor #5</p>
                        <p className="text-xs text-gray-600">OR 1 • Calibration</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Calibrating</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Schedule</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 text-xs">🔧</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">X-Ray Machine #2</p>
                      <p className="text-xs text-gray-600">Scheduled maintenance - Tube replacement</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-yellow-600">In Progress</div>
                    <div className="text-xs text-gray-500">Est. 2 hours</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs">🔧</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Ultrasound Machine #1</p>
                      <p className="text-xs text-gray-600">Routine inspection and calibration</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-blue-600">Scheduled</div>
                    <div className="text-xs text-gray-500">Tomorrow 9:00 AM</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-xs">🔧</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">ECG Machine #003</p>
                      <p className="text-xs text-gray-600">Circuit board replacement required</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-red-600">Parts Ordered</div>
                    <div className="text-xs text-gray-500">Est. 3 days</div>
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
              <p className="text-gray-600 mb-4">You don't have permission to access equipment status.</p>
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
      {getEquipmentStatusComponent()}
    </DashboardLayout>
  )
}