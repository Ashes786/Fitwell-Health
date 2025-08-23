'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  DollarSign, 
  CreditCard,
  Server,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'

interface Analytics {
  totalRevenue: number
  monthlyGrowth: number
  activeSubscriptions: number
  totalAdmins: number
  systemUptime: number
  pendingRequests: number
}

export default function SuperAdminDashboard() {
  const { isAuthorized, isUnauthorized, isLoading, session } = useRoleAuthorization({
    requiredRole: "SUPER_ADMIN",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchDashboardData = async (forceRefresh = false) => {
    setLoading(true)
    setError(null)
    console.log('Fetching dashboard data...')
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data for testing
      const mockAnalytics: Analytics = {
        totalRevenue: 125000,
        monthlyGrowth: 22.1,
        activeSubscriptions: 45,
        totalAdmins: 12,
        systemUptime: 99.9,
        pendingRequests: 5
      }
      
      setAnalytics(mockAnalytics)
      console.log('Dashboard data loaded:', mockAnalytics)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data. Please try again.')
      toast.error('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoading) return

    if (!session) {
      console.log('No session found')
      return
    }

    console.log('Session found:', session)
    fetchDashboardData()
  }, [session, isLoading])

  // Show unauthorized message if user doesn't have SUPER_ADMIN role
  if (isUnauthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unauthorized Access</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // Show loading state
  if (loading && !analytics) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Loading dashboard data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Show error state but still allow dashboard to function with partial data
  const showErrorBanner = error && !loading

  // Provide default values for analytics to prevent undefined errors
  const safeAnalytics = analytics || {
    totalRevenue: 0,
    monthlyGrowth: 0,
    activeSubscriptions: 0,
    totalAdmins: 0,
    systemUptime: 0,
    pendingRequests: 0
  }

  return (
    <div className="space-y-6 p-6">
      {/* Error Banner */}
      {showErrorBanner && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
            <Button 
              onClick={() => fetchDashboardData(true)} 
              variant="outline" 
              size="sm"
              className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your system today.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => fetchDashboardData(true)}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${safeAnalytics.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600">+{safeAnalytics.monthlyGrowth}% from last month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{safeAnalytics.activeSubscriptions}</p>
                <p className="text-sm text-blue-600">Currently active</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Admins</p>
                <p className="text-2xl font-bold text-gray-900">{safeAnalytics.totalAdmins}</p>
                <p className="text-sm text-purple-600">In your network</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{safeAnalytics.systemUptime.toFixed(1)}%</p>
                <p className="text-sm text-green-600">All systems operational</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Server className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simple content to verify rendering */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle>Dashboard Status</CardTitle>
          <CardDescription>Super Admin Dashboard is working correctly</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Welcome to the Fitwell H.E.A.L.T.H. Super Admin Dashboard.</p>
          <p className="mt-2">All systems are operational and dashboard data is loading successfully.</p>
          <p className="mt-2">Current time: {new Date().toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  )
}