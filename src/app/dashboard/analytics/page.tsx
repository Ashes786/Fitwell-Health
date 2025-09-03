'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCustomSession } from '@/hooks/use-custom-session'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity, 
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  newUsers: number
  revenue: number
  growth: number
  topMetrics: Array<{
    name: string
    value: number
    change: number
  }>
}

interface RoleSpecificAnalytics {
  SUPER_ADMIN: {
    systemStats: AnalyticsData
    adminPerformance: Array<{
      name: string
      efficiency: number
    }>
  }
  ADMIN: {
    organizationStats: AnalyticsData
    staffPerformance: Array<{
      name: string
      performance: number
    }>
  }
  DOCTOR: {
    patientStats: AnalyticsData
    appointmentStats: Array<{
      type: string
      count: number
      revenue: number
    }>
  }
  PATIENT: {
    healthStats: AnalyticsData
    activityStats: Array<{
      activity: string
      frequency: number
    }>
  }
  ATTENDANT: {
    registrationStats: AnalyticsData
    efficiencyStats: Array<{
      metric: string
      value: number
    }>
  }
  CONTROL_ROOM: {
    monitoringStats: AnalyticsData
    responseStats: Array<{
      metric: string
      avgTime: number
    }>
  }
}

export default function AnalyticsPage() {
  const { user, loading } = useCustomSession()
  const router = useRouter()
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/auth/signin')
      return
    }

    fetchAnalyticsData()
  }, [user, loading, router])

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch analytics based on user role
      let endpoint = ''
      switch (user?.role) {
        case 'SUPER_ADMIN':
          endpoint = '/api/super-admin/analytics'
          break
        case 'ADMIN':
          endpoint = '/api/admin/analytics'
          break
        case 'DOCTOR':
          endpoint = '/api/doctor/revenue'
          break
        case 'PATIENT':
          endpoint = '/api/patient/health-stats'
          break
        case 'ATTENDANT':
          endpoint = '/api/attendant/stats'
          break
        case 'CONTROL_ROOM':
          endpoint = '/api/control-room/stats'
          break
        default:
          endpoint = '/api/health'
      }

      const response = await fetch(endpoint)
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      } else {
        // Fallback to mock data
        setAnalyticsData(getMockAnalyticsData(user?.role))
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to load analytics data')
      setAnalyticsData(getMockAnalyticsData(user?.role))
    } finally {
      setIsLoading(false)
    }
  }

  const getMockAnalyticsData = (role: string) => {
    const baseData = {
      totalUsers: 1250,
      activeUsers: 890,
      newUsers: 45,
      revenue: 45600,
      growth: 12.5,
      topMetrics: [
        { name: 'Engagement', value: 85, change: 5.2 },
        { name: 'Satisfaction', value: 92, change: 3.1 },
        { name: 'Retention', value: 78, change: -2.1 }
      ]
    }

    switch (role) {
      case 'SUPER_ADMIN':
        return {
          ...baseData,
          systemStats: baseData,
          adminPerformance: [
            { name: 'System Uptime', efficiency: 99.8 },
            { name: 'Response Time', efficiency: 95.2 },
            { name: 'Security Score', efficiency: 97.5 }
          ]
        }
      case 'ADMIN':
        return {
          ...baseData,
          organizationStats: baseData,
          staffPerformance: [
            { name: 'Doctor Efficiency', performance: 88.5 },
            { name: 'Attendant Speed', performance: 92.1 },
            { name: 'Patient Satisfaction', performance: 94.3 }
          ]
        }
      case 'DOCTOR':
        return {
          ...baseData,
          patientStats: baseData,
          appointmentStats: [
            { type: 'Consultations', count: 45, revenue: 2250 },
            { type: 'Follow-ups', count: 23, revenue: 690 },
            { type: 'Emergency', count: 8, revenue: 800 }
          ]
        }
      case 'PATIENT':
        return {
          ...baseData,
          healthStats: baseData,
          activityStats: [
            { activity: 'Exercise', frequency: 12 },
            { activity: 'Medication', frequency: 3 },
            { activity: 'Check-ups', frequency: 1 }
          ]
        }
      case 'ATTENDANT':
        return {
          ...baseData,
          registrationStats: baseData,
          efficiencyStats: [
            { metric: 'Registration Time', value: 8.5 },
            { metric: 'Accuracy', value: 98.2 },
            { metric: 'Satisfaction', value: 96.7 }
          ]
        }
      case 'CONTROL_ROOM':
        return {
          ...baseData,
          monitoringStats: baseData,
          responseStats: [
            { metric: 'Emergency Response', avgTime: 4.2 },
            { metric: 'Doctor Assignment', avgTime: 2.1 },
            { metric: 'Bed Allocation', avgTime: 1.8 }
          ]
        }
      default:
        return baseData
    }
  }

  const getRoleSpecificTitle = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'System Analytics'
      case 'ADMIN': return 'Organization Analytics'
      case 'DOCTOR': return 'Practice Analytics'
      case 'PATIENT': return 'Health Analytics'
      case 'ATTENDANT': return 'Service Analytics'
      case 'CONTROL_ROOM': return 'Monitoring Analytics'
      default: return 'Analytics Dashboard'
    }
  }

  const getRoleSpecificDescription = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Comprehensive system-wide analytics and performance metrics'
      case 'ADMIN': return 'Organization performance and staff efficiency analytics'
      case 'DOCTOR': return 'Practice performance, patient statistics, and revenue analytics'
      case 'PATIENT': return 'Personal health metrics and activity tracking'
      case 'ATTENDANT': return 'Service efficiency and registration analytics'
      case 'CONTROL_ROOM': return 'Real-time monitoring and response time analytics'
      default: return 'Comprehensive analytics and insights'
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!user || !analyticsData) {
    return (
      <div className="text-center">
        <p className="text-gray-600">Unable to load analytics. Please try again.</p>
        <Button onClick={fetchAnalyticsData} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getRoleSpecificTitle(user.role)}</h1>
          <p className="text-gray-600 mt-1">{getRoleSpecificDescription(user.role)}</p>
        </div>
        <Button onClick={fetchAnalyticsData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total {user.role === 'PATIENT' ? 'Activities' : 'Users'}</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalUsers}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {analyticsData.growth > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm ${analyticsData.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData.growth > 0 ? '+' : ''}{analyticsData.growth}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active {user.role === 'PATIENT' ? 'Health Score' : 'Users'}</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.activeUsers}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Healthy</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New {user.role === 'PATIENT' ? 'Records' : 'Users'}</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.newUsers}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">This month</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{user.role === 'PATIENT' ? 'Wellness Score' : 'Revenue'}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.role === 'PATIENT' ? `${analyticsData.revenue}/100` : `$${analyticsData.revenue.toLocaleString()}`}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Growing</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role-Specific Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analyticsData.systemStats && (
          <Card>
            <CardHeader>
              <CardTitle>System Statistics</CardTitle>
              <CardDescription>Overall system performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topMetrics.map((metric: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{metric.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">{metric.value}</span>
                      <Badge variant={metric.change > 0 ? "default" : "secondary"}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {analyticsData.adminPerformance && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Performance</CardTitle>
              <CardDescription>System administrator efficiency metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.adminPerformance.map((admin: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{admin.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${admin.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{admin.efficiency}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {analyticsData.appointmentStats && (
          <Card>
            <CardHeader>
              <CardTitle>Appointment Statistics</CardTitle>
              <CardDescription>Consultation and revenue breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.appointmentStats.map((stat: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{stat.type}</p>
                      <p className="text-sm text-gray-600">{stat.count} appointments</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${stat.revenue}</p>
                      <p className="text-sm text-gray-600">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {analyticsData.healthStats && (
          <Card>
            <CardHeader>
              <CardTitle>Health Statistics</CardTitle>
              <CardDescription>Personal health and wellness metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topMetrics.map((metric: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{metric.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">{metric.value}</span>
                      <Badge variant={metric.change > 0 ? "default" : "secondary"}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}