'use client'

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AuthLayout } from "@/components/layout/auth-layout"
import { UserRole } from "@prisma/client"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthLayout requiredRole={UserRole.DOCTOR}>
      <DashboardLayout userRole={UserRole.DOCTOR}>
        {children}
      </DashboardLayout>
    </AuthLayout>
  )
}