'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Settings, 
  Activity, 
  Database, 
  Server, 
  Globe, 
  RefreshCw,
  Shield,
  Calendar,
  DollarSign,
  Network,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CreditCard,
  FileText,
  BarChart3,
  PieChart,
  Zap,
  Eye,
  Edit,
  MoreHorizontal,
  Bell,
  User,
  LogOut,
  Cog,
  Menu,
  X,
  ChartBar,
  Lock
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserRole } from "@prisma/client"

interface Admin {
  id: string
  user: {
    id: string
    name: string
    email: string
  }
  networkName: string
  isActive: boolean
  createdAt: string
}

interface SubscriptionRequest {
  id: string
  admin: {
    user: {
      name: string
      email: string
    }
    networkName: string
  }
  planName: string
  description: string
  price: number
  duration: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  createdAt: string
}

interface SystemStatus {
  id: string
  serviceName: string
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'MAINTENANCE'
  responseTime?: number
  lastChecked: string
  message?: string
}

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
  const [admins, setAdmins] = useState<Admin[]>([])
  const [subscriptionRequests, setSubscriptionRequests] = useState<SubscriptionRequest[]>([])
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [checkingStatus, setCheckingStatus] = useState<string[]>([])
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchDashboardData = async (forceRefresh = false) => {
    // Check if we should use cached data (within 30 seconds)
    const now = Date.now()
    if (!forceRefresh && lastFetchTime && (now - lastFetchTime) < 30000) {
      return // Use cached data
    }

    setLoading(true)
    setError(null)
    console.log('Fetching dashboard data...')
    try {
      // Add timeout to fetch requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      })

      const [adminsRes, requestsRes, statusRes] = await Promise.allSettled([
        Promise.race([
          fetch('/api/super-admin/admins', { signal: AbortSignal.timeout(10000) }),
          timeoutPromise
        ]) as Promise<Response>,
        Promise.race([
          fetch('/api/super-admin/subscription-requests', { signal: AbortSignal.timeout(10000) }),
          timeoutPromise
        ]) as Promise<Response>,
        Promise.race([
          fetch('/api/super-admin/system-status', { signal: AbortSignal.timeout(10000) }),
          timeoutPromise
        ]) as Promise<Response>
      ])

      console.log('API responses:', { adminsRes, requestsRes, statusRes })

      let adminsData: Admin[] = []
      let requestsData: SubscriptionRequest[] = []
      let statusData: SystemStatus[] = []
      let hasErrors = false

      if (adminsRes.status === 'fulfilled' && adminsRes.value.ok) {
        const adminsResponse = await adminsRes.value.json()
        console.log('Admins data:', adminsResponse)
        // Handle both array and object responses
        adminsData = Array.isArray(adminsResponse) ? adminsResponse : []
        setAdmins(adminsData)
      } else {
        console.warn('Failed to fetch admins data')
        hasErrors = true
      }

      if (requestsRes.status === 'fulfilled' && requestsRes.value.ok) {
        const requestsResponse = await requestsRes.value.json()
        console.log('Requests data:', requestsResponse)
        // Handle the case where subscription requests return a message object instead of array
        if (Array.isArray(requestsResponse)) {
          requestsData = requestsResponse
        } else if (requestsResponse && requestsResponse.subscriptionRequests) {
          requestsData = requestsResponse.subscriptionRequests
        } else {
          requestsData = []
        }
        setSubscriptionRequests(requestsData)
      } else {
        console.warn('Failed to fetch subscription requests data')
        hasErrors = true
      }

      if (statusRes.status === 'fulfilled' && statusRes.value.ok) {
        const statusResponse = await statusRes.value.json()
        console.log('Status data:', statusResponse)
        // Handle both array and object responses
        statusData = Array.isArray(statusResponse) ? statusResponse : []
        setSystemStatus(statusData)
      } else {
        console.warn('Failed to fetch system status data')
        hasErrors = true
      }

      // Calculate analytics
      const pendingRequests = requestsData?.filter((req: SubscriptionRequest) => req.status === 'PENDING') || []
      const approvedRequests = requestsData?.filter((req: SubscriptionRequest) => req.status === 'APPROVED') || []
      const totalRevenue = approvedRequests.reduce((sum: number, req: SubscriptionRequest) => sum + req.price, 0)
      const activeAdmins = adminsData?.filter((admin: Admin) => admin.isActive) || []
      const onlineServices = statusData?.filter((status: SystemStatus) => status.status === 'ONLINE') || []
      
      // Calculate growth based on actual data
      const monthlyGrowth = approvedRequests.length > 0 ? 
        ((approvedRequests.length / Math.max(1, adminsData?.length || 1)) * 100) : 0
      
      setAnalytics({
        totalRevenue,
        monthlyGrowth,
        activeSubscriptions: approvedRequests.length,
        totalAdmins: adminsData?.length || 0,
        systemUptime: statusData.length > 0 ? (onlineServices.length / statusData.length) * 100 : 0,
        pendingRequests: pendingRequests.length
      })

      // Update last fetch time
      setLastFetchTime(now)

      if (hasErrors) {
        setError('Some data failed to load. Please refresh to try again.')
      }
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

  // Add a retry mechanism for failed loads
  useEffect(() => {
    if (error && !loading) {
      const timer = setTimeout(() => {
        // Auto-retry after 5 seconds if there's an error
        fetchDashboardData(true)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [error, loading])

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
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your system today.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-6 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Show error state but still allow dashboard to function with partial data
  const showErrorBanner = error && !loading

  const handleSubscriptionRequest = async (requestId: string, action: 'approve' | 'reject', reason?: string) => {
    setSelectedRequest(requestId)
    try {
      const response = await fetch(`/api/super-admin/subscription-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, reason }),
      })

      if (response.ok) {
        toast.success(`Subscription request ${action}d successfully`)
        fetchDashboardData()
      } else {
        toast.error(`Failed to ${action} subscription request`)
      }
    } catch (error) {
      console.error('Error handling subscription request:', error)
      toast.error('An error occurred while processing the request')
    } finally {
      setSelectedRequest(null)
    }
  }

  const checkSystemStatus = async (serviceName: string) => {
    setCheckingStatus(prev => [...prev, serviceName])
    try {
      const startTime = Date.now()
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })
      const endTime = Date.now()
      const responseTime = endTime - startTime

      const statusResponse = await fetch('/api/super-admin/system-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceName,
          status: response.ok ? 'ONLINE' : 'OFFLINE',
          responseTime,
          message: response.ok ? 'System is responding normally' : 'System is not responding'
        }),
        signal: AbortSignal.timeout(5000)
      })

      if (statusResponse.ok) {
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error checking system status:', error)
    } finally {
      setCheckingStatus(prev => prev.filter(s => s !== serviceName))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONLINE':
      case 'APPROVED':
        return <Badge variant="default" className="bg-green-500 text-white">Online</Badge>
      case 'OFFLINE':
      case 'REJECTED':
        return <Badge variant="destructive">Offline</Badge>
      case 'DEGRADED':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Degraded</Badge>
      case 'MAINTENANCE':
        return <Badge variant="outline">Maintenance</Badge>
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case "PATIENT": return "Patient"
      case "DOCTOR": return "Doctor"
      case "ATTENDANT": return "Attendant"
      case "CONTROL_ROOM": return "Control Room"
      case "ADMIN": return "Administrator"
      case "SUPER_ADMIN": return "Super Admin"
      default: return role
    }
  }

  const userInitials = session?.user?.name 
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : session?.user?.email?.[0]?.toUpperCase() || 'U'

  const pendingRequests = subscriptionRequests.filter(req => req.status === 'PENDING').slice(0, 5)
  const recentActivity = subscriptionRequests.slice(0, 5)

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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
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
          <Button 
            onClick={() => router.push('/dashboard/super-admin/create-admin')}
            className="flex items-center justify-start"
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Create Admin</span>
          </Button>
          <Button 
            onClick={() => router.push('/dashboard/super-admin/subscription-requests')}
            className="flex items-center justify-start"
            variant="outline"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            <span>Approve Requests</span>
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
                <p className="text-sm text-blue-600">+12% from last month</p>
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
                <p className="text-sm text-green-600">+{safeAnalytics.totalAdmins > 0 ? '8' : '0'}% from last month</p>
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
                <p className="text-sm text-green-600">Excellent performance</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue trends and projections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <BarChart3 className="h-16 w-16 mr-4" />
              <span>Revenue Chart Placeholder</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">User Growth</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <TrendingUp className="h-16 w-16 mr-4" />
              <span>Growth Chart Placeholder</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Requests</span>
                <Badge variant="secondary">{analytics?.pendingRequests || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Users</span>
                <Badge variant="default">{admins.filter(a => a.isActive).length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">System Load</span>
                <Badge variant="outline">Normal</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
            <CardDescription>Latest system events and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.admin.user.name} - {activity.planName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.admin.networkName} • {format(activity.createdAt, 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(activity.status)}
                      {activity.status === 'PENDING' && (
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleSubscriptionRequest(activity.id, 'approve')}
                            disabled={selectedRequest === activity.id}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleSubscriptionRequest(activity.id, 'reject')}
                            disabled={selectedRequest === activity.id}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">System Status</CardTitle>
              <CardDescription>Current status of all system components</CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                systemStatus.forEach(status => {
                  if (!checkingStatus.includes(status.serviceName)) {
                    checkSystemStatus(status.serviceName)
                  }
                })
              }}
              disabled={checkingStatus.length > 0}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${checkingStatus.length > 0 ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemStatus.map((status) => (
              <div key={status.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    status.status === 'ONLINE' ? 'bg-green-100' : 
                    status.status === 'OFFLINE' ? 'bg-red-100' : 
                    status.status === 'DEGRADED' ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    {status.serviceName === 'Database' && <Database className="h-4 w-4 text-gray-600" />}
                    {status.serviceName === 'API Server' && <Server className="h-4 w-4 text-gray-600" />}
                    {status.serviceName === 'File Storage' && <Globe className="h-4 w-4 text-gray-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{status.serviceName}</p>
                    <p className="text-xs text-gray-500">
                      {status.responseTime ? `${status.responseTime}ms` : 'Checking...'}
                    </p>
                  </div>
                </div>
                <div>
                  {getStatusBadge(status.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}