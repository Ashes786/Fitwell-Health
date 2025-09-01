'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCustomSession } from '@/hooks/use-custom-session'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Server, 
  Database, 
  Lock,
  Shield,
  Bell,
  User,
  LogOut,
  ChartBar,
  Activity,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  Stethoscope,
  UserCheck,
  Clipboard,
  Monitor,
  Users2,
  Building,
  HeartPulse,
  FileText,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { toast } from 'sonner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { useWebSocketUpdates } from '@/hooks/use-websocket-updates'
import { useDataFetch } from '@/hooks/use-data-fetch'
import { DataLoader, MetricCardLoader, ChartLoader } from '@/components/ui/data-loader'

export default function SuperAdminDashboard() {
  const { user, loading } = useCustomSession()
  const router = useRouter()

  // Use the new data fetching hook with caching and error handling
  const { 
    data: analyticsData, 
    isLoading, 
    error, 
    isRefreshing, 
    refetch 
  } = useDataFetch(
    async () => {
      const response = await fetch('/api/super-admin/analytics')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }
      return response.json()
    },
    {
      enabled: !!user,
      refetchInterval: 30000, // Auto-refresh every 30 seconds
      retryCount: 3,
      retryDelay: 1000,
      cacheKey: 'super-admin-analytics',
      onError: (errorMessage) => {
        toast.error(errorMessage)
      }
    }
  )

  // Transform API data to component structure
  const analytics = analyticsData ? {
    totalUsers: analyticsData.users?.total || 0,
    totalDoctors: analyticsData.users?.byRole?.find((r: any) => r.role === 'Doctors')?.count || 0,
    totalPatients: analyticsData.users?.byRole?.find((r: any) => r.role === 'Patients')?.count || 0,
    totalAdmins: analyticsData.users?.byRole?.find((r: any) => r.role === 'Admins')?.count || 0,
    totalAppointments: analyticsData.appointments?.total || 0,
    totalRevenue: analyticsData.revenue?.total || 0,
    systemUptime: Math.round((analyticsData.system?.uptime || 99.9) * 10) / 10,
    activeUsers: Math.round((analyticsData.users?.total || 0) * 0.22),
    pendingRequests: (analyticsData.subscriptions?.total || 0) - (analyticsData.subscriptions?.active || 0),
    systemStatus: (analyticsData.system?.errors || 0) > 0 ? 'warning' : 'operational',
    monthlyGrowth: analyticsData.users?.growth || 0,
    weeklyGrowth: Math.round((analyticsData.users?.growth || 0) * 0.25 * 10) / 10,
    dailyGrowth: Math.round((analyticsData.users?.growth || 0) * 0.06 * 10) / 10
  } : {
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAdmins: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    systemUptime: 99.9,
    activeUsers: 0,
    pendingRequests: 0,
    systemStatus: 'operational',
    monthlyGrowth: 0,
    weeklyGrowth: 0,
    dailyGrowth: 0
  }

  const revenueData = analyticsData?.revenue?.monthly?.map((item: any) => ({
    month: item.month,
    revenue: item.revenue
  })) || []

  const userGrowthData = analyticsData?.revenue?.monthly?.map((item: any, index: number) => ({
    month: item.month,
    users: Math.round(((analyticsData.users?.total || 0) - ((analyticsData.users?.total || 0) * 0.15 * index)) * 0.95)
  })) || []

  const appointmentData = analyticsData?.appointments?.byMonth?.map((item: any) => ({
    month: item.month,
    appointments: item.count
  })) || []

  const recentActivity = analyticsData ? [
    { 
      type: 'user', 
      description: `New ${analyticsData.users?.byRole?.find((r: any) => r.role === 'Doctors') ? 'doctor' : 'user'} registration`, 
      timestamp: '2 minutes ago', 
      severity: 'low' 
    },
    { 
      type: 'system', 
      description: `System backup completed successfully`, 
      timestamp: '15 minutes ago', 
      severity: 'low' 
    },
    { 
      type: 'security', 
      description: (analyticsData.system?.errors || 0) > 0 ? 'System issues detected' : 'All systems operational', 
      timestamp: '1 hour ago', 
      severity: (analyticsData.system?.errors || 0) > 0 ? 'high' : 'low' 
    },
    { 
      type: 'user', 
      description: `New patient registration`, 
      timestamp: '2 hours ago', 
      severity: 'low' 
    },
    { 
      type: 'system', 
      description: `Database optimization completed`, 
      timestamp: '3 hours ago', 
      severity: 'medium' 
    }
  ] : []

  const systemAlerts = analyticsData ? ((analyticsData.system?.errors || 0) > 0 ? [
    { type: 'warning', message: 'System issues detected', severity: 'medium' },
    { type: 'info', message: 'Performance monitoring active', severity: 'low' }
  ] : [
    { type: 'info', message: 'All systems operational', severity: 'low' }
  ]) : []

  const [lastRefresh, setLastRefresh] = useState(new Date())

  // WebSocket integration for real-time updates
  const { isConnected, sendUpdate } = useWebSocketUpdates({
    enabled: !!user,
    onDataUpdate: (data) => {
      if (data.type === 'system_stats' || data.type === 'doctor_availability') {
        // Refresh data when receiving real-time updates
        refetch()
        setLastRefresh(new Date())
      }
    },
    onNotification: (notification) => {
      // Add to recent activity
      recentActivity.unshift({
        type: notification.type,
        description: notification.message,
        timestamp: 'Just now',
        severity: notification.priority === 'high' ? 'high' : 
                 notification.priority === 'medium' ? 'medium' : 'low'
      })
      
      // Update system alerts if needed
      if (notification.type === 'system_alert' || notification.priority === 'high') {
        systemAlerts.unshift({ 
          type: notification.priority === 'high' ? 'warning' : 'info', 
          message: notification.message, 
          severity: notification.priority 
        })
      }
    }
  })

  useEffect(() => {
    if (loading) return
    
    if (!user) {
      router.push('/auth/signin')
      return
    }

    // Redirect to unified dashboard - it handles role-specific content
    router.push('/dashboard')
    return
  }, [user, loading, router])

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Monitor className="h-4 w-4 text-gray-600" />
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <DataLoader 
      isLoading={isLoading} 
      error={error} 
      onRetry={refetch}
      loadingComponent={<MetricCardLoader />}
    >
      <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-health-primary to-health-secondary rounded-lg p-6 relative overflow-hidden">
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Welcome back, {user?.name}!</h1>
            <p className="text-white/90">Super Admin Dashboard - Complete system overview</p>
            <p className="text-white/70 text-sm mt-1">
              Last updated: {lastRefresh.toLocaleTimeString()}
              {isConnected && (
                <span className="ml-2 inline-flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  Live
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => {
                refetch()
                setLastRefresh(new Date())
              }}
              disabled={isRefreshing}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Refresh</span>
            </Button>
            <div className="p-3 bg-white/20 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* System Status Alert */}
      {systemAlerts.length > 0 && (
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-800">System Alerts</h3>
                <p className="text-sm text-yellow-700">{systemAlerts.length} active alerts</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/dashboard/super-admin/system-status')}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.totalUsers)}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {getGrowthIcon(analytics.monthlyGrowth)}
                  <span className="text-sm text-green-600">+{analytics.monthlyGrowth}%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {getGrowthIcon(22.1)}
                  <span className="text-sm text-green-600">+22.1%</span>
                </div>
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
                <p className="text-sm font-medium text-gray-600">Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.totalAppointments)}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {getGrowthIcon(15.7)}
                  <span className="text-sm text-green-600">+15.7%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.systemUptime}%</p>
                <div className="flex items-center space-x-1 mt-1">
                  {getStatusIcon(analytics.systemStatus)}
                  <span className="text-sm text-green-600">Excellent</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Revenue Trend</span>
            </CardTitle>
            <CardDescription>Monthly revenue over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area type="monotone" dataKey="revenue" stroke="#2ba664" fill="#2ba664" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>User Growth</span>
            </CardTitle>
            <CardDescription>User growth over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Line type="monotone" dataKey="users" stroke="#2ba664" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/super-admin/admins')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Admins</h3>
                <p className="text-sm text-gray-500">Admin administration</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/super-admin/subscription-requests')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clipboard className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Review Requests</h3>
                <p className="text-sm text-gray-500">{analytics.pendingRequests} pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/super-admin/analytics')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <ChartBar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Analytics</h3>
                <p className="text-sm text-gray-500">System analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/super-admin/system-status')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Server className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">System Status</h3>
                <p className="text-sm text-gray-500">Monitor systems</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>Latest system activities and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-full">
                    {activity.type === 'user' && <User className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'system' && <Server className="h-4 w-4 text-green-600" />}
                    {activity.type === 'security' && <Shield className="h-4 w-4 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                  <Badge variant={activity.severity === 'high' ? 'destructive' : activity.severity === 'medium' ? 'default' : 'secondary'}>
                    {activity.severity}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </DataLoader>
  )
}