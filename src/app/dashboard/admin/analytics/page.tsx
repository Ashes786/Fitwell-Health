"use client"

import { useSession } from "next-auth/react"
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
  Activity, 
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Heart,
  Stethoscope,
  UserCheck,
  Building,
  Pill,
  FlaskConical,
  Eye,
  ArrowUp,
  ArrowDown,
  Target,
  Zap,
  Star
} from "lucide-react"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

interface AnalyticsData {
  overview: {
    totalUsers: number
    activePatients: number
    totalDoctors: number
    totalPartners: number
    monthlyRevenue: number
    revenueGrowth: number
    appointmentCompletion: number
    userSatisfaction: number
  }
  userMetrics: {
    newUsers: number
    activeUsers: number
    userGrowth: number
    userRetention: number
    demographics: {
      ageGroups: { [key: string]: number }
      gender: { [key: string]: number }
      locations: { [key: string]: number }
    }
  }
  revenueMetrics: {
    totalRevenue: number
    monthlyRevenue: number
    revenueGrowth: number
    subscriptionRevenue: number
    consultationRevenue: number
    revenueByCategory: { [key: string]: number }
    revenueTrend: Array<{ month: string; revenue: number }>
  }
  appointmentMetrics: {
    totalAppointments: number
    completedAppointments: number
    cancelledAppointments: number
    noShowRate: number
    averageWaitTime: number
    appointmentsByType: { [key: string]: number }
    appointmentTrend: Array<{ month: string; appointments: number }>
  }
  partnerMetrics: {
    totalPartners: number
    activePartners: number
    partnerPerformance: Array<{ name: string; rating: number; appointments: number }>
    utilizationRates: { [key: string]: number }
  }
}

export default function AdminAnalytics() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  const { isAuthorized, isUnauthorized, isLoading, authSession: authSession } = useRoleAuthorization({
    requiredRole: "ADMIN",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  useEffect(() => {
    if (isAuthorized) {
      fetchAnalytics()
    }
  }, [isAuthorized])

  const fetchAnalytics = async () => {
    try {
      // Mock data - in real app, this would come from API
      const mockAnalytics: AnalyticsData = {
        overview: {
          totalUsers: 1250,
          activePatients: 890,
          totalDoctors: 45,
          totalPartners: 12,
          monthlyRevenue: 125000,
          revenueGrowth: 18.5,
          appointmentCompletion: 92.5,
          userSatisfaction: 4.7
        },
        userMetrics: {
          newUsers: 125,
          activeUsers: 980,
          userGrowth: 12.5,
          userRetention: 85.2,
          demographics: {
            ageGroups: {
              "18-25": 15,
              "26-35": 25,
              "36-45": 30,
              "46-55": 20,
              "55+": 10
            },
            gender: {
              "Male": 45,
              "Female": 52,
              "Other": 3
            },
            locations: {
              "New York": 35,
              "Los Angeles": 25,
              "Chicago": 20,
              "Houston": 15,
              "Other": 5
            }
          }
        },
        revenueMetrics: {
          totalRevenue: 1500000,
          monthlyRevenue: 125000,
          revenueGrowth: 18.5,
          subscriptionRevenue: 85000,
          consultationRevenue: 40000,
          revenueByCategory: {
            "Subscriptions": 85000,
            "Consultations": 40000,
            "Lab Tests": 15000,
            "Pharmacy": 10000,
            "Other": 5000
          },
          revenueTrend: [
            { month: "Jan", revenue: 98000 },
            { month: "Feb", revenue: 105000 },
            { month: "Mar", revenue: 112000 },
            { month: "Apr", revenue: 108000 },
            { month: "May", revenue: 115000 },
            { month: "Jun", revenue: 125000 }
          ]
        },
        appointmentMetrics: {
          totalAppointments: 1250,
          completedAppointments: 1156,
          cancelledAppointments: 94,
          noShowRate: 7.5,
          averageWaitTime: 15,
          appointmentsByType: {
            "General Consultation": 450,
            "Specialist Consultation": 350,
            "Follow-up": 250,
            "Emergency": 100,
            "Procedure": 100
          },
          appointmentTrend: [
            { month: "Jan", appointments: 180 },
            { month: "Feb", appointments: 195 },
            { month: "Mar", appointments: 210 },
            { month: "Apr", appointments: 205 },
            { month: "May", appointments: 220 },
            { month: "Jun", appointments: 240 }
          ]
        },
        partnerMetrics: {
          totalPartners: 12,
          activePartners: 12,
          partnerPerformance: [
            { name: "General Hospital Center", rating: 4.9, appointments: 450 },
            { name: "City Medical Laboratory", rating: 4.8, appointments: 320 },
            { name: "Wellness Pharmacy Plus", rating: 4.6, appointments: 280 },
            { name: "Heart Specialist Clinic", rating: 4.7, appointments: 200 }
          ],
          utilizationRates: {
            "Hospitals": 85,
            "Laboratories": 78,
            "Pharmacies": 72
          }
        }
      }

      setAnalytics(mockAnalytics)
      setIsDataLoading(false)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast({
        title: "Error",
        description: 'Failed to load analytics data'
      })
      setIsDataLoading(false)
    }
  }

  const refreshData = () => {
    setIsDataLoading(true)
    fetchAnalytics()
  }

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

  if (isLoading || isDataLoading) {
    return (
      <DashboardLayout userRole="ADMIN" userName={session?.user?.name || "Admin"}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session || !analytics) {
    return (
      <DashboardLayout userRole="ADMIN" userName={session?.user?.name || "Admin"}>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">No data available</p>
        </div>
      </DashboardLayout>
    )
  }

  const renderMetricCard = (title: string, value: string | number, change?: number, icon?: React.ReactNode, color: string = "emerald") => {
    const colorClasses = {
      emerald: "border-emerald-200",
      blue: "border-blue-200",
      purple: "border-purple-200",
      red: "border-red-200"
    }

    return (
      <Card className={`${colorClasses[color]} hover:shadow-md transition-shadow`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
              {change !== undefined && (
                <div className="flex items-center space-x-1 mt-1">
                  {change > 0 ? (
                    <ArrowUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-xs font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(change)}%
                  </span>
                </div>
              )}
            </div>
            {icon && (
              <div className="h-8 w-8 text-gray-400">
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderBarChart = (data: Array<{ name: string; value: number }>, color: string = "bg-emerald-500") => {
    const maxValue = Math.max(...data.map(d => d.value))
    
    return (
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-20 text-xs text-gray-600">{item.name}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`${color} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <div className="w-12 text-xs text-gray-600 text-right">{item.value}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <DashboardLayout userRole="ADMIN" userName={session?.user?.name || "Admin"}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Network Analytics</h1>
            <p className="text-gray-600 mt-2">
              Monitor your healthcare network performance and metrics
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button onClick={refreshData} className="bg-emerald-600 hover:bg-emerald-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderMetricCard("Total Users", analytics.overview.totalUsers, undefined, <Users className="h-8 w-8" />)}
          {renderMetricCard("Active Patients", analytics.overview.activePatients, undefined, <UserCheck className="h-8 w-8" />)}
          {renderMetricCard("Monthly Revenue", `$${analytics.overview.monthlyRevenue.toLocaleString()}`, analytics.overview.revenueGrowth, <DollarSign className="h-8 w-8" />)}
          {renderMetricCard("Appointment Completion", `${analytics.overview.appointmentCompletion}%`, undefined, <CheckCircle className="h-8 w-8" />)}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-emerald-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Users
            </TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Revenue
            </TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Appointments
            </TabsTrigger>
            <TabsTrigger value="partners" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Partners
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.revenueMetrics.revenueTrend.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-12 text-xs text-gray-600">{item.month}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(item.revenue / Math.max(...analytics.revenueMetrics.revenueTrend.map(r => r.revenue))) * 100}%` }}
                          />
                        </div>
                        <div className="w-20 text-xs text-gray-600 text-right">
                          ${(item.revenue / 1000).toFixed(0)}k
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Appointment Trend */}
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Appointment Trends</CardTitle>
                  <CardDescription>Monthly appointment volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.appointmentMetrics.appointmentTrend.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-12 text-xs text-gray-600">{item.month}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(item.appointments / Math.max(...analytics.appointmentMetrics.appointmentTrend.map(a => a.appointments))) * 100}%` }}
                          />
                        </div>
                        <div className="w-12 text-xs text-gray-600 text-right">{item.appointments}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue by Category */}
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Revenue by Category</CardTitle>
                  <CardDescription>Breakdown of revenue sources</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderBarChart(
                    Object.entries(analytics.revenueMetrics.revenueByCategory).map(([key, value]) => ({
                      name: key,
                      value
                    })),
                    "bg-purple-500"
                  )}
                </CardContent>
              </Card>

              {/* Appointments by Type */}
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Appointments by Type</CardTitle>
                  <CardDescription>Distribution of appointment types</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderBarChart(
                    Object.entries(analytics.appointmentMetrics.appointmentsByType).map(([key, value]) => ({
                      name: key,
                      value
                    })),
                    "bg-green-500"
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Demographics - Age Groups */}
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Age Distribution</CardTitle>
                  <CardDescription>User demographics by age group</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderBarChart(
                    Object.entries(analytics.userMetrics.demographics.ageGroups).map(([key, value]) => ({
                      name: key,
                      value
                    })),
                    "bg-emerald-500"
                  )}
                </CardContent>
              </Card>

              {/* User Demographics - Gender */}
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Gender Distribution</CardTitle>
                  <CardDescription>User demographics by gender</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderBarChart(
                    Object.entries(analytics.userMetrics.demographics.gender).map(([key, value]) => ({
                      name: key,
                      value
                    })),
                    "bg-blue-500"
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Geographic Distribution</CardTitle>
                <CardDescription>User distribution by location</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBarChart(
                  Object.entries(analytics.userMetrics.demographics.locations).map(([key, value]) => ({
                    name: key,
                    value
                  })),
                  "bg-purple-500"
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Metrics */}
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Revenue Overview</CardTitle>
                  <CardDescription>Key revenue metrics and growth</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderMetricCard("Total Revenue", `$${analytics.revenueMetrics.totalRevenue.toLocaleString()}`, analytics.revenueMetrics.revenueGrowth, <DollarSign className="h-8 w-8" />)}
                  {renderMetricCard("Monthly Revenue", `$${analytics.revenueMetrics.monthlyRevenue.toLocaleString()}`, undefined, <TrendingUp className="h-8 w-8" />, "blue")}
                  {renderMetricCard("Subscription Revenue", `$${analytics.revenueMetrics.subscriptionRevenue.toLocaleString()}`, undefined, <Calendar className="h-8 w-8" />, "purple")}
                  {renderMetricCard("Consultation Revenue", `$${analytics.revenueMetrics.consultationRevenue.toLocaleString()}`, undefined, <Stethoscope className="h-8 w-8" />, "red")}
                </CardContent>
              </Card>

              {/* Revenue Trend */}
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Revenue Trend</CardTitle>
                  <CardDescription>6-month revenue performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.revenueMetrics.revenueTrend.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-12 text-xs text-gray-600">{item.month}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(item.revenue / Math.max(...analytics.revenueMetrics.revenueTrend.map(r => r.revenue))) * 100}%` }}
                          />
                        </div>
                        <div className="w-20 text-xs text-gray-600 text-right">
                          ${(item.revenue / 1000).toFixed(0)}k
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Revenue by Category</CardTitle>
                <CardDescription>Detailed breakdown of revenue sources</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBarChart(
                  Object.entries(analytics.revenueMetrics.revenueByCategory).map(([key, value]) => ({
                    name: key,
                    value
                  })),
                  "bg-purple-500"
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Appointment Metrics */}
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Appointment Overview</CardTitle>
                  <CardDescription>Key appointment metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderMetricCard("Total Appointments", analytics.appointmentMetrics.totalAppointments, undefined, <Calendar className="h-8 w-8" />)}
                  {renderMetricCard("Completed", analytics.appointmentMetrics.completedAppointments, undefined, <CheckCircle className="h-8 w-8" />, "green")}
                  {renderMetricCard("Cancelled", analytics.appointmentMetrics.cancelledAppointments, undefined, <AlertCircle className="h-8 w-8" />, "red")}
                  {renderMetricCard("No-Show Rate", `${analytics.appointmentMetrics.noShowRate}%`, undefined, <Clock className="h-8 w-8" />, "purple")}
                </CardContent>
              </Card>

              {/* Appointment Trend */}
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Appointment Trends</CardTitle>
                  <CardDescription>Monthly appointment volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.appointmentMetrics.appointmentTrend.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-12 text-xs text-gray-600">{item.month}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(item.appointments / Math.max(...analytics.appointmentMetrics.appointmentTrend.map(a => a.appointments))) * 100}%` }}
                          />
                        </div>
                        <div className="w-12 text-xs text-gray-600 text-right">{item.appointments}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Appointments by Type</CardTitle>
                <CardDescription>Distribution of appointment types</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBarChart(
                  Object.entries(analytics.appointmentMetrics.appointmentsByType).map(([key, value]) => ({
                    name: key,
                    value
                  })),
                  "bg-green-500"
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="partners" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Partner Metrics */}
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Partner Overview</CardTitle>
                  <CardDescription>Key partner metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderMetricCard("Total Partners", analytics.partnerMetrics.totalPartners, undefined, <Building className="h-8 w-8" />)}
                  {renderMetricCard("Active Partners", analytics.partnerMetrics.activePartners, undefined, <CheckCircle className="h-8 w-8" />, "green")}
                  {renderMetricCard("Avg. Rating", "4.7", undefined, <Star className="h-8 w-8" />, "yellow")}
                  {renderMetricCard("Utilization Rate", "78%", undefined, <Zap className="h-8 w-8" />, "purple")}
                </CardContent>
              </Card>

              {/* Partner Performance */}
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Top Performing Partners</CardTitle>
                  <CardDescription>Partners with highest appointment volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.partnerMetrics.partnerPerformance.map((partner, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{partner.name}</p>
                            <p className="text-sm text-gray-600">{partner.appointments} appointments</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{partner.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Utilization Rates by Partner Type</CardTitle>
                <CardDescription>Partner facility utilization rates</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBarChart(
                  Object.entries(analytics.partnerMetrics.utilizationRates).map(([key, value]) => ({
                    name: key,
                    value
                  })),
                  "bg-purple-500"
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}