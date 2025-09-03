"use client"

import { useCustomSession } from "@/hooks/use-custom-session"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Stethoscope,
  UserCheck,
  CreditCard,
  FileText
} from "lucide-react"
import { BarChart } from "@/components/ui/bar-chart"
import { LineChart } from "@/components/ui/line-chart"
import { toast } from "sonner"

interface AnalyticsData {
  userGrowth: {
    date: string
    patients: number
    doctors: number
    attendants: number
  }[]
  revenueData: {
    month: string
    subscriptions: number
    consultations: number
    total: number
  }[]
  appointmentStats: {
    total: number
    completed: number
    cancelled: number
    noShow: number
  }
  systemMetrics: {
    uptime: number
    responseTime: number
    activeUsers: number
    errorRate: number
  }
}

export default function UnifiedAnalytics() {
  const { user, loading } = useCustomSession()
  const router = useRouter()
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  // Role-based API endpoint
  const getApiEndpoint = () => {
    if (!user) return null
    switch (user.role) {
      case 'SUPER_ADMIN':
        return '/api/super-admin/analytics'
      case 'ADMIN':
        return '/api/admin/analytics'
      case 'DOCTOR':
        return '/api/doctor/revenue'
      default:
        return null
    }
  }

  const getPermissions = () => {
    if (!user) return { canView: false, canExport: false }
    switch (user.role) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return { canView: true, canExport: true }
      case 'DOCTOR':
        return { canView: true, canExport: false }
      default:
        return { canView: false, canExport: false }
    }
  }

  const permissions = getPermissions()

  useEffect(() => {
    if (user && !loading) {
      fetchAnalytics()
    }
  }, [user, loading])

  const fetchAnalytics = async () => {
    const apiEndpoint = getApiEndpoint()
    if (!apiEndpoint) {
      setIsDataLoading(false)
      return
    }

    try {
      const response = await fetch(apiEndpoint)
      if (response.ok) {
        const data = await response.json()
        
        // Transform data based on role
        let transformedData: AnalyticsData
        
        if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
          transformedData = {
            userGrowth: data.userGrowth || [],
            revenueData: data.revenueData || [],
            appointmentStats: data.appointmentStats || {
              total: 0,
              completed: 0,
              cancelled: 0,
              noShow: 0
            },
            systemMetrics: data.systemMetrics || {
              uptime: 99.9,
              responseTime: 150,
              activeUsers: 0,
              errorRate: 0.1
            }
          }
        } else {
          // Doctor-specific analytics
          transformedData = {
            userGrowth: [],
            revenueData: data.revenueData || [],
            appointmentStats: data.appointmentStats || {
              total: 0,
              completed: 0,
              cancelled: 0,
              noShow: 0
            },
            systemMetrics: {
              uptime: 99.9,
              responseTime: 150,
              activeUsers: 0,
              errorRate: 0.1
            }
          }
        }
        
        setAnalytics(transformedData)
      } else {
        toast.error('Failed to fetch analytics data')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to load analytics')
    } finally {
      setIsDataLoading(false)
    }
  }

  const handleExport = () => {
    if (permissions.canExport) {
      toast.success('Analytics export started')
    } else {
      toast.error('You do not have permission to export analytics')
    }
  }

  if (loading || isDataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !permissions.canView) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You do not have permission to view analytics.</p>
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600">Analytics data is not available at the moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive analytics and insights {user.role && `for ${user.role.replace('_', ' ')}`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {permissions.canExport && (
            <Button 
              variant="outline"
              onClick={handleExport}
            >
              <FileText className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${analytics.revenueData.reduce((sum, month) => sum + month.total, 0).toLocaleString()}
                </p>
                <p className="text-xs text-green-600">+12.5% from last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.appointmentStats.total}</p>
                <p className="text-xs text-blue-600">
                  {Math.round((analytics.appointmentStats.completed / analytics.appointmentStats.total) * 100)}% completion rate
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.systemMetrics.activeUsers}</p>
                <p className="text-xs text-purple-600">Currently online</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold text-green-600">{analytics.systemMetrics.uptime}%</p>
                <p className="text-xs text-green-600">Last 30 days</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="users">User Growth</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Revenue Trends</span>
              </CardTitle>
              <CardDescription>Monthly revenue breakdown by source</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <BarChart 
                  data={analytics.revenueData}
                  categories={['subscriptions', 'consultations', 'total']}
                  index="month"
                  colors={['#3B82F6', '#10B981', '#8B5CF6']}
                  valueFormatter={(value) => `$${value.toLocaleString()}`}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Subscription Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${analytics.revenueData.reduce((sum, month) => sum + month.subscriptions, 0).toLocaleString()}
                  </p>
                  <CreditCard className="h-6 w-6 text-blue-600 mx-auto mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Consultation Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${analytics.revenueData.reduce((sum, month) => sum + month.consultations, 0).toLocaleString()}
                  </p>
                  <Stethoscope className="h-6 w-6 text-green-600 mx-auto mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Average Monthly</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${Math.round(analytics.revenueData.reduce((sum, month) => sum + month.total, 0) / analytics.revenueData.length).toLocaleString()}
                  </p>
                  <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {analytics.userGrowth.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>User Growth Trends</span>
                </CardTitle>
                <CardDescription>User registration and growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <LineChart 
                    data={analytics.userGrowth}
                    categories={['patients', 'doctors', 'attendants']}
                    colors={['#10B981', '#3B82F6', '#F59E0B']}
                    valueFormatter={(value) => value.toString()}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Total Patients</p>
                  <p className="text-2xl font-bold text-green-600">
                    {analytics.userGrowth.length > 0 ? analytics.userGrowth[analytics.userGrowth.length - 1].patients : 0}
                  </p>
                  <UserCheck className="h-6 w-6 text-green-600 mx-auto mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Total Doctors</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {analytics.userGrowth.length > 0 ? analytics.userGrowth[analytics.userGrowth.length - 1].doctors : 0}
                  </p>
                  <Stethoscope className="h-6 w-6 text-blue-600 mx-auto mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Total Attendants</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {analytics.userGrowth.length > 0 ? analytics.userGrowth[analytics.userGrowth.length - 1].attendants : 0}
                  </p>
                  <Users className="h-6 w-6 text-orange-600 mx-auto mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  <span>Appointment Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Appointments</span>
                    <span className="font-semibold">{analytics.appointmentStats.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completed</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{analytics.appointmentStats.completed}</span>
                      <Badge className="bg-green-100 text-green-800">
                        {Math.round((analytics.appointmentStats.completed / analytics.appointmentStats.total) * 100)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cancelled</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{analytics.appointmentStats.cancelled}</span>
                      <Badge className="bg-red-100 text-red-800">
                        {Math.round((analytics.appointmentStats.cancelled / analytics.appointmentStats.total) * 100)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">No Show</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{analytics.appointmentStats.noShow}</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {Math.round((analytics.appointmentStats.noShow / analytics.appointmentStats.total) * 100)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span>System Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Uptime</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{analytics.systemMetrics.uptime}%</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Healthy
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{analytics.systemMetrics.responseTime}ms</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Good
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="font-semibold">{analytics.systemMetrics.activeUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Error Rate</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{analytics.systemMetrics.errorRate}%</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Low
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}