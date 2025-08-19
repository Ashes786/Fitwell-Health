'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  Download,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns'

interface AnalyticsData {
  totalUsers: number
  totalDoctors: number
  totalPatients: number
  totalAdmins: number
  totalAppointments: number
  totalRevenue: number
  monthlyGrowth: number
  userGrowth: number
  appointmentGrowth: number
  revenueGrowth: number
  systemUptime: number
  activeUsers: number
  recentActivity: Array<{
    type: string
    description: string
    timestamp: string
  }>
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (session.user?.role !== "SUPER_ADMIN") {
      router.push("/dashboard")
      return
    }

    fetchAnalytics()
  }, [session, status, selectedPeriod])

  const fetchAnalytics = async () => {
    if (refreshing) return
    
    try {
      const response = await fetch(`/api/super-admin/analytics?timeRange=${selectedPeriod}`)
      if (response.ok) {
        const data = await response.json()
        // Transform API data to match the expected format
        setAnalytics({
          totalUsers: data.users?.total || 0,
          totalDoctors: data.users?.byRole?.find(r => r.role === 'Doctors')?.count || 0,
          totalPatients: data.users?.byRole?.find(r => r.role === 'Patients')?.count || 0,
          totalAdmins: data.users?.byRole?.find(r => r.role === 'Admins')?.count || 0,
          totalAppointments: data.appointments?.total || 0,
          totalRevenue: data.revenue?.total || 0,
          monthlyGrowth: data.revenue?.growth || 0,
          userGrowth: data.users?.growth || 0,
          appointmentGrowth: data.appointments?.growth || 0,
          revenueGrowth: data.revenue?.growth || 0,
          systemUptime: data.system?.uptime || 0,
          activeUsers: data.users?.active || 0,
          recentActivity: data.recentActivity || []
        })
      } else {
        // Only use mock data if API fails, but make it minimal
        setAnalytics({
          totalUsers: 0,
          totalDoctors: 0,
          totalPatients: 0,
          totalAdmins: 0,
          totalAppointments: 0,
          totalRevenue: 0,
          monthlyGrowth: 0,
          userGrowth: 0,
          appointmentGrowth: 0,
          revenueGrowth: 0,
          systemUptime: 0,
          activeUsers: 0,
          recentActivity: []
        })
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to load analytics')
      // Set minimal fallback data
      setAnalytics({
        totalUsers: 0,
        totalDoctors: 0,
        totalPatients: 0,
        totalAdmins: 0,
        totalAppointments: 0,
        totalRevenue: 0,
        monthlyGrowth: 0,
        userGrowth: 0,
        appointmentGrowth: 0,
        revenueGrowth: 0,
        systemUptime: 0,
        activeUsers: 0,
        recentActivity: []
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const exportReport = async () => {
    try {
      if (typeof window === 'undefined') {
        toast.error('Export not available on server')
        return
      }

      // Generate CSV report from analytics data
      if (!analytics) {
        toast.error('No data available to export')
        return
      }

      const csvContent = [
        ['Metric', 'Value', 'Growth'],
        ['Total Users', analytics.totalUsers.toString(), `${analytics.userGrowth > 0 ? '+' : ''}${analytics.userGrowth}%`],
        ['Total Doctors', analytics.totalDoctors.toString(), ''],
        ['Total Patients', analytics.totalPatients.toString(), ''],
        ['Total Admins', analytics.totalAdmins.toString(), ''],
        ['Total Appointments', analytics.totalAppointments.toString(), `${analytics.appointmentGrowth > 0 ? '+' : ''}${analytics.appointmentGrowth}%`],
        ['Total Revenue', `$${analytics.totalRevenue}`, `${analytics.revenueGrowth > 0 ? '+' : ''}${analytics.revenueGrowth}%`],
        ['System Uptime', `${analytics.systemUptime}%`, ''],
        ['Active Users', analytics.activeUsers.toString(), '']
      ].map(row => row.join(',')).join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast.success('Analytics report exported successfully')
    } catch (error) {
      console.error('Error exporting report:', error)
      toast.error('Failed to export report')
    }
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Ensure analytics data exists with default values
  const safeAnalytics = analytics || {
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAdmins: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    userGrowth: 0,
    appointmentGrowth: 0,
    revenueGrowth: 0,
    systemUptime: 0,
    activeUsers: 0,
    recentActivity: []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Comprehensive system analytics and insights</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {['7d', '30d', '90d', '1y'].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period as any)}
                >
                  {period}
                </Button>
              ))}
            </div>
            <Button onClick={exportReport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => {
              setRefreshing(true)
              fetchAnalytics()
            }} disabled={refreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{safeAnalytics.totalUsers ? safeAnalytics.totalUsers.toLocaleString() : '0'}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getGrowthIcon(safeAnalytics.userGrowth)}
                    <span className={`text-sm ${getGrowthColor(safeAnalytics.userGrowth)}`}>
                      {safeAnalytics.userGrowth > 0 ? '+' : ''}{safeAnalytics.userGrowth}%
                    </span>
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
                  <p className="text-2xl font-bold text-gray-900">${safeAnalytics.totalRevenue ? safeAnalytics.totalRevenue.toLocaleString() : '0'}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getGrowthIcon(safeAnalytics.revenueGrowth)}
                    <span className={`text-sm ${getGrowthColor(safeAnalytics.revenueGrowth)}`}>
                      {safeAnalytics.revenueGrowth > 0 ? '+' : ''}{safeAnalytics.revenueGrowth}%
                    </span>
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
                  <p className="text-2xl font-bold text-gray-900">{safeAnalytics.totalAppointments ? safeAnalytics.totalAppointments.toLocaleString() : '0'}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getGrowthIcon(safeAnalytics.appointmentGrowth)}
                    <span className={`text-sm ${getGrowthColor(safeAnalytics.appointmentGrowth)}`}>
                      {safeAnalytics.appointmentGrowth > 0 ? '+' : ''}{safeAnalytics.appointmentGrowth}%
                    </span>
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
                  <p className="text-2xl font-bold text-gray-900">{safeAnalytics.systemUptime}%</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Activity className="h-4 w-4 text-green-600" />
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

        {/* User Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>User Distribution</span>
              </CardTitle>
              <CardDescription>Breakdown of users by role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Patients</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{safeAnalytics.totalPatients}</span>
                    <Badge variant="outline">
                      {((safeAnalytics.totalPatients / safeAnalytics.totalUsers) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Doctors</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{safeAnalytics.totalDoctors}</span>
                    <Badge variant="outline">
                      {((safeAnalytics.totalDoctors / safeAnalytics.totalUsers) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium">Admins</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{safeAnalytics.totalAdmins}</span>
                    <Badge variant="outline">
                      {((safeAnalytics.totalAdmins / safeAnalytics.totalUsers) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Active Users</span>
              </CardTitle>
              <CardDescription>Currently active users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">{safeAnalytics.activeUsers}</div>
                <p className="text-sm text-gray-600">users online now</p>
                <div className="mt-4 text-sm text-gray-500">
                  <span className="text-green-600">↑ 12%</span> from last hour
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Revenue Overview</span>
              </CardTitle>
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
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>User Growth</span>
              </CardTitle>
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
              {safeAnalytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'user' ? 'bg-blue-100' :
                      activity.type === 'appointment' ? 'bg-purple-100' :
                      'bg-green-100'
                    }`}>
                      {activity.type === 'user' && <Users className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'appointment' && <Calendar className="h-4 w-4 text-purple-600" />}
                      {activity.type === 'revenue' && <DollarSign className="h-4 w-4 text-green-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}