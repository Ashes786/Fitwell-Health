'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { UserRole } from "@prisma/client"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if we're not loading and session is available but invalid
    if (status !== "loading") {
      if (session && session.user?.role !== "PATIENT") {
        router.push("/dashboard")
      } else if (!session) {
        router.push("/auth/signin")
      }
    }
  }, [session, status, router])

  // Show loading state while session is being determined
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  // If session is loaded but user is not PATIENT, redirect
  if (session && session.user?.role !== "PATIENT") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  // If no session at all, redirect to signin
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  // Use the DashboardLayout with header and sidebar
  return (
    <DashboardLayout userRole={UserRole.PATIENT}>
      {children}
    </DashboardLayout>
  )
}