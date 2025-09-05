'use client'

import { useCustomSession } from '@/hooks/use-custom-session'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DoctorAssignmentPage() {
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
          <p className="text-gray-600">Loading doctor assignment...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to signin
  }

  const getDoctorAssignmentComponent = () => {
    switch (user.role) {
      case 'CONTROL_ROOM':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Doctor Assignment</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Doctors</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-health-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">DR</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Dr. Sarah Johnson</p>
                        <p className="text-xs text-gray-600">Cardiology</p>
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
                        <p className="text-xs text-gray-600">Neurology</p>
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
                        <p className="text-sm font-medium">Dr. Emily Davis</p>
                        <p className="text-xs text-gray-600">Pediatrics</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Busy</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Assignments</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-red-800">Emergency - Patient #1234</p>
                      <span className="text-xs text-red-600">High Priority</span>
                    </div>
                    <p className="text-xs text-red-700">Chest pain, needs immediate cardiology consultation</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-yellow-800">Patient #5678</p>
                      <span className="text-xs text-yellow-600">Medium Priority</span>
                    </div>
                    <p className="text-xs text-yellow-700">Neurological consultation requested</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-blue-800">Patient #9012</p>
                      <span className="text-xs text-blue-600">Low Priority</span>
                    </div>
                    <p className="text-xs text-blue-700">Routine pediatric checkup</p>
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
              <p className="text-gray-600 mb-4">You don't have permission to access doctor assignment.</p>
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
      {getDoctorAssignmentComponent()}
    </DashboardLayout>
  )
}