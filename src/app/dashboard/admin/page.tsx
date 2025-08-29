'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCustomSession } from '@/hooks/use-custom-session'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingCard, LoadingChart, LoadingSpinner, PageLoading } from '@/components/ui/loading'
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
  Trash2,
  Network,
  Globe,
  MapPin
} from 'lucide-react'
import { toast } from 'sonner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

export default function AdminDashboard() {
  const { user, loading } = useCustomSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalPartners: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    networkUptime: 99.8,
    activeUsers: 0,
    pendingRequests: 0,
    networkStatus: 'operational',
    monthlyGrowth: 0,
    weeklyGrowth: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [networkAlerts, setNetworkAlerts] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [userGrowthData, setUserGrowthData] = useState([])
  const [appointmentData, setAppointmentData] = useState([])
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (loading) return
    
    if (!user) {
      router.push('/auth/signin')
      return
    }

    if (user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    fetchDashboardData()
    
    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchDashboardData()
    }, 30000)
    
    return () => clearInterval(refreshInterval)
  }, [user, loading, router])

  const fetchDashboardData = async (manualRefresh = false) => {
    try {
      if (manualRefresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }
      
      // Fetch real data from API
      const [analyticsResponse, activityResponse, alertsResponse] = await Promise.all([
        fetch('/api/admin/analytics'),
        fetch('/api/admin/activity'),
        fetch('/api/admin/network-alerts')
      ])

      if (!analyticsResponse.ok) {
        throw new Error('Failed to fetch analytics data')
      }

      const analyticsData = await analyticsResponse.json()
      
      // Generate chart data based on real analytics
      const revenueData = analyticsData.revenueMetrics?.revenueTrend || []
      const userGrowthData = analyticsData.userMetrics?.growthTrend || []
      const appointmentData = analyticsData.appointmentMetrics?.appointmentTrend || []
      
      // Fetch recent activity and alerts
      const recentActivity = activityResponse.ok ? await activityResponse.json() : []
      const networkAlerts = alertsResponse.ok ? await alertsResponse.json() : []

      setAnalytics(analyticsData.overview || {})
      setRevenueData(revenueData)
      setUserGrowthData(userGrowthData)
      setAppointmentData(appointmentData)
      setRecentActivity(recentActivity)
      setNetworkAlerts(networkAlerts)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
      
      // Fallback to empty data
      setAnalytics({
        totalUsers: 0,
        totalDoctors: 0,
        totalPatients: 0,
        totalPartners: 0,
        totalAppointments: 0,
        totalRevenue: 0,
        networkUptime: 0,
        activeUsers: 0,
        pendingRequests: 0,
        networkStatus: 'operational',
        monthlyGrowth: 0,
        weeklyGrowth: 0
      })
      setRevenueData([])
      setUserGrowthData([])
      setAppointmentData([])
      setRecentActivity([])
      setNetworkAlerts([])
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-health-primary to-health-secondary rounded-lg p-6 relative overflow-hidden">
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Welcome back, {user?.name}!</h1>
            <p className="text-white/90">Admin Dashboard - Network management and user oversight</p>
            <p className="text-white/70 text-sm mt-1">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => fetchDashboardData(true)}
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
              <Network className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Network Status Alert */}
      {networkAlerts.length > 0 && (
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-800">Network Alerts</h3>
                <p className="text-sm text-yellow-700">{networkAlerts.length} active alerts</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/dashboard/admin/network')}
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
                  {getGrowthIcon(18.5)}
                  <span className="text-sm text-green-600">+18.5%</span>
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
                  {getGrowthIcon(12.3)}
                  <span className="text-sm text-green-600">+12.3%</span>
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
                <p className="text-sm font-medium text-gray-600">Network Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.networkUptime}%</p>
                <div className="flex items-center space-x-1 mt-1">
                  {getStatusIcon(analytics.networkStatus)}
                  <span className="text-sm text-green-600">Excellent</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Network className="h-6 w-6 text-green-600" />
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
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/admin/users')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Users</h3>
                <p className="text-sm text-gray-500">User administration</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/admin/doctors')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Stethoscope className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Doctors</h3>
                <p className="text-sm text-gray-500">Doctor management</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/admin/partners')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Partners</h3>
                <p className="text-sm text-gray-500">Partner network</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/admin/subscription-requests')}>
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
      </div>

      {/* Recent Activity */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>Latest network activities and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-full">
                    {activity.type === 'user' && <User className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'network' && <Network className="h-4 w-4 text-green-600" />}
                    {activity.type === 'partner' && <Building className="h-4 w-4 text-purple-600" />}
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
  )
}