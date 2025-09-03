'use client'

import { useRouter } from 'next/navigation'
import { useCustomSession } from '@/hooks/use-custom-session'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { PatientDashboard } from '@/components/dashboards/patient-dashboard'
import { DoctorDashboard } from '@/components/dashboards/doctor-dashboard'
import { AttendantDashboard } from '@/components/dashboards/attendant-dashboard'
import { ControlRoomDashboard } from '@/components/dashboards/control-room-dashboard'
import { AdminDashboard } from '@/components/dashboards/admin-dashboard'
import { SuperAdminDashboard } from '@/components/dashboards/super-admin-dashboard'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

export default function Dashboard() {
  const { user, loading } = useCustomSession()

  const getRoleDashboardContent = () => {
    if (!user) return null

    // Return the appropriate dashboard component based on user role
    switch (user.role) {
      case 'PATIENT':
        return (
          <PatientDashboard 
            userName={user.name || user.email} 
            userImage={user.avatar}
            userEmail={user.email}
            userPhone={user.phone}
          />
        )
      case 'DOCTOR':
        return (
          <DoctorDashboard 
            userName={user.name || user.email} 
            userImage={user.avatar}
            specialization={user.specialization}
          />
        )
      case 'ATTENDANT':
        return (
          <AttendantDashboard 
            userName={user.name || user.email} 
            userImage={user.avatar}
          />
        )
      case 'CONTROL_ROOM':
        return (
          <ControlRoomDashboard 
            userName={user.name || user.email} 
            userImage={user.avatar}
          />
        )
      case 'ADMIN':
        return (
          <AdminDashboard 
            userName={user.name || user.email} 
            userImage={user.avatar}
          />
        )
      case 'SUPER_ADMIN':
        return (
          <SuperAdminDashboard 
            userName={user.name || user.email} 
            userImage={user.avatar}
          />
        )
      default:
        return (
          <div className="text-center">
            <p className="text-gray-600">Unknown user role. Please contact support.</p>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to access the dashboard.</p>
          <Button 
            className="mt-4" 
            onClick={() => router.push('/auth/signin')}
          >
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout 
      userRole={user.role} 
      userName={user.name || user.email} 
      userImage={user.avatar}
    >
      {getRoleDashboardContent()}
    </DashboardLayout>
  )
}