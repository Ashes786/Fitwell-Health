'use client'

import { useCustomSession } from '@/hooks/use-custom-session'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import PatientCart from '@/app/dashboard/patient/cart/page'

export default function CartPage() {
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
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to signin
  }

  const getCartComponent = () => {
    switch (user.role) {
      case 'PATIENT':
        return <PatientCart />
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">You don't have permission to access cart.</p>
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
      {getCartComponent()}
    </DashboardLayout>
  )
}