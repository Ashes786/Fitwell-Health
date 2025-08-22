"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Stethoscope, 
  UserCheck, 
  Activity, 
  TrendingUp,
  Calendar,
  DollarSign,
  CheckCircle,
  Settings,
  BarChart3,
  Star,
  Clock,
  CreditCard,
  Building,
  Heart,
  Briefcase,
  Users2,
  Hospital,
  FlaskConical,
  Pill,
  Shield,
  AlertTriangle,
  ThumbsUp,
  Eye,
  FileText,
  Bell,
  Globe,
  Building2,
  Wrench
} from "lucide-react"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"

interface NetworkStats {
  totalUsers: number
  totalPatients: number
  totalDoctors: number
  totalAppointments: number
  monthlyRevenue: number
  activeSubscriptions: number
  pendingRequests: number
  totalPartners: number
  totalOrganizations: number
}

interface RecentActivity {
  id: string
  type: string
  description: string
  timestamp: string
  user: string
  status?: string
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      // Let middleware handle authentication redirects
      // This prevents redirect loops
      return
    }

    if (session.user?.role !== "ADMIN") {
      // Don't redirect - let the middleware handle routing
      // This prevents redirect loops
      return
    }

    fetchDashboardData()
  }, [session, status, router])

  const fetchDashboardData = async () => {
    try {
      const statsRes = await fetch('/api/admin/network-stats')

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setNetworkStats(statsData)
      }

      // Enhanced recent activity with more realistic data
      setRecentActivity([
        {
          id: "1",
          type: "USER_REGISTRATION",
          description: "New patient John Doe registered",
          timestamp: new Date().toISOString(),
          user: "system",
          status: "completed"
        },
        {
          id: "2", 
          type: "APPOINTMENT_BOOKED",
          description: "Appointment scheduled with Dr. Sarah Johnson",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: "Jane Smith",
          status: "confirmed"
        },
        {
          id: "3",
          type: "FEATURE_GRANTED",
          description: "Organization Management feature granted",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          user: "Super Admin",
          status: "completed"
        },
        {
          id: "4",
          type: "PARTNER_ADDED",
          description: "New lab partner City Diagnostics added",
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          user: "admin",
          status: "active"
        },
        {
          id: "5",
          type: "SUBSCRIPTION_PURCHASED",
          description: "Premium plan purchased by Acme Corp",
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          user: "Acme Corp",
          status: "active"
        }
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      
    )
  }

  if (!session) {
    return null
  }
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "USER_REGISTRATION":
        return <UserCheck className="h-4 w-4 text-emerald-600" />
      case "APPOINTMENT_BOOKED":
        return <Calendar className="h-4 w-4 text-blue-600" />
      case "FEATURE_GRANTED":
        return <Star className="h-4 w-4 text-purple-600" />
      case "PARTNER_ADDED":
        return <Building className="h-4 w-4 text-orange-600" />
      case "SUBSCRIPTION_PURCHASED":
        return <DollarSign className="h-4 w-4 text-green-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return null
    
    const statusConfig = {
      completed: { variant: "default" as const, text: "Completed", className: "bg-green-100 text-green-800" },
      confirmed: { variant: "default" as const, text: "Confirmed", className: "bg-blue-100 text-blue-800" },
      active: { variant: "default" as const, text: "Active", className: "bg-emerald-100 text-emerald-800" },
      pending: { variant: "secondary" as const, text: "Pending", className: "bg-yellow-100 text-yellow-800" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    
    return (
      <Badge className={config.className}>
        {config.text}
      </Badge>
    )
  }

  return (
    
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, Administrator!
            </h1>
            <p className="text-gray-600 mt-2">
              Here's what's happening in your healthcare network today
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-emerald-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{networkStats?.totalUsers || '0'}</p>
                  <p className="text-xs text-emerald-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Patients</p>
                  <p className="text-3xl font-bold text-gray-900">{networkStats?.totalPatients || '0'}</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8% from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Healthcare Providers</p>
                  <p className="text-3xl font-bold text-gray-900">{networkStats?.totalDoctors || '0'}</p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3 new this week
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">${(networkStats?.monthlyRevenue || 0).toLocaleString()}</p>
                  <p className="text-xs text-orange-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15% growth
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-gray-600" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>
                Latest activities in your healthcare network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">
                          {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                        </p>
                        {getStatusBadge(activity.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Activity
              </Button>
            </CardContent>
          </Card>

          {/* Network Overview */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-gray-600" />
                <span>Network Overview</span>
              </CardTitle>
              <CardDescription>
                Your healthcare network at a glance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{networkStats?.totalAppointments || '0'}</p>
                  <p className="text-sm text-gray-600">Appointments</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{networkStats?.activeSubscriptions || '0'}</p>
                  <p className="text-sm text-gray-600">Subscriptions</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Building className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{networkStats?.totalPartners || '0'}</p>
                  <p className="text-sm text-gray-600">Partners</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Building2 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{networkStats?.totalOrganizations || '0'}</p>
                  <p className="text-sm text-gray-600">Organizations</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {networkStats?.pendingRequests || '0'} Pending Requests
                    </p>
                    <p className="text-xs text-gray-600">
                      Requires your attention
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Insights */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-gray-600" />
              <span>Performance Insights</span>
            </CardTitle>
            <CardDescription>
              Key metrics and performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <ThumbsUp className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Patient Satisfaction</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">94%</p>
                <p className="text-xs text-green-600">+2% from last month</p>
              </div>
              <div className="text-center p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Avg. Wait Time</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">12 min</p>
                <p className="text-xs text-blue-600">-3 min improvement</p>
              </div>
              <div className="text-center p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Eye className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">System Uptime</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">99.9%</p>
                <p className="text-xs text-purple-600">Excellent performance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    
  )
}