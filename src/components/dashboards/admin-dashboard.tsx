'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  Building, 
  CreditCard, 
  Calendar, 
  Bell, 
  TrendingUp, 
  TrendingDown,
  Activity,
  DollarSign,
  CheckCircle,
  Plus,
  UserCheck,
  Stethoscope,
  Users2,
  Settings,
  LogOut,
  Heart,
  Monitor,
  AlertTriangle,
  FileText,
  Phone,
  MapPin,
  Mail,
  Hospital,
  FlaskConical,
  ShoppingCart,
  ChartBar,
  Clock,
  Star,
  Target,
  Zap,
  Award
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface AdminDashboardProps {
  userName: string
  userImage?: string
}

interface OrganizationStats {
  totalPatients: number
  newToday: number
  newThisWeek: number
}

interface StaffStats {
  totalDoctors: number
  activeDoctors: number
  inactiveDoctors: number
}

interface SubscriptionStats {
  activeSubscriptions: number
  revenueSnapshot: number
  growthRate: number
}

interface AppointmentSummary {
  todayGP: number
  todaySpecialist: number
  thisWeekGP: number
  thisWeekSpecialist: number
}

interface Partner {
  id: string
  name: string
  type: 'hospital' | 'lab' | 'pharmacy'
  status: 'active' | 'inactive' | 'pending'
  location: string
}

interface Notification {
  id: string
  type: 'approval' | 'issue' | 'contract' | 'system'
  message: string
  time: string
  priority: 'high' | 'medium' | 'low'
}

interface Stats {
  totalPatients: number
  totalDoctors: number
  activeSubscriptions: number
  todayAppointments: number
  weeklyRevenue: number
  totalPartners: number
}

export function AdminDashboard({ userName, userImage }: AdminDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Mock data for admin dashboard
  const [orgStats, setOrgStats] = useState<OrganizationStats>({
    totalPatients: 1250,
    newToday: 8,
    newThisWeek: 45
  })

  const [staffStats, setStaffStats] = useState<StaffStats>({
    totalDoctors: 45,
    activeDoctors: 38,
    inactiveDoctors: 7
  })

  const [subscriptionStats, setSubscriptionStats] = useState<SubscriptionStats>({
    activeSubscriptions: 180,
    revenueSnapshot: 45000,
    growthRate: 12
  })

  const [appointmentSummary, setAppointmentSummary] = useState<AppointmentSummary>({
    todayGP: 25,
    todaySpecialist: 15,
    thisWeekGP: 120,
    thisWeekSpecialist: 85
  })

  const [partners, setPartners] = useState<Partner[]>([
    { id: '1', name: 'City General Hospital', type: 'hospital', status: 'active', location: 'Downtown' },
    { id: '2', name: 'MedLab Diagnostics', type: 'lab', status: 'active', location: 'Medical District' },
    { id: '3', name: 'QuickCare Pharmacy', type: 'pharmacy', status: 'pending', location: 'Westside' },
    { id: '4', name: 'Sunset Medical Center', type: 'hospital', status: 'active', location: 'Sunset Blvd' }
  ])

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'approval', message: 'New hospital partnership pending approval', time: '1 hour ago', priority: 'medium' },
    { id: '2', type: 'issue', message: 'System downtime reported in East wing', time: '2 hours ago', priority: 'high' },
    { id: '3', type: 'contract', message: 'Pharmacy contract expiring in 30 days', time: '3 hours ago', priority: 'medium' },
    { id: '4', type: 'system', message: 'Monthly report generation completed', time: '4 hours ago', priority: 'low' }
  ])

  const [stats, setStats] = useState<Stats>({
    totalPatients: 1250,
    totalDoctors: 45,
    activeSubscriptions: 180,
    todayAppointments: 40,
    weeklyRevenue: 45000,
    totalPartners: 12
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastRefresh(new Date())
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    { 
      name: 'Register Patient', 
      icon: UserCheck, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      route: '/dashboard/patients'
    },
    { 
      name: 'Register Doctor', 
      icon: Stethoscope, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      route: '/dashboard/doctors'
    },
    { 
      name: 'Create Subscription Plan', 
      icon: CreditCard, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      route: '/dashboard/subscription-plans'
    },
    { 
      name: 'Manage Hospital', 
      icon: Hospital, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      route: '/dashboard/partners'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hospital': return 'bg-blue-50 text-blue-600 border-blue-200'
      case 'lab': return 'bg-purple-50 text-purple-600 border-purple-200'
      case 'pharmacy': return 'bg-green-50 text-green-600 border-green-200'
      default: return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-600 border-red-200'
      case 'medium': return 'bg-yellow-50 text-yellow-600 border-yellow-200'
      default: return 'bg-blue-50 text-blue-600 border-blue-200'
    }
  }

  const getPartnerIcon = (type: string) => {
    switch (type) {
      case 'hospital': return <Hospital className="h-4 w-4" />
      case 'lab': return <FlaskConical className="h-4 w-4" />
      case 'pharmacy': return <ShoppingCart className="h-4 w-4" />
      default: return <Building className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                <AvatarImage src={userImage} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white text-xl font-bold">
                  {userName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}</h1>
              <p className="text-gray-600 mt-1">Organization Administrator</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <div className="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
                  System Active
                </Badge>
                <span className="text-sm text-gray-500">
                  Updated {lastRefresh.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalPatients.toLocaleString()}</p>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+{orgStats.newToday} today</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Stethoscope className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Medical Staff</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalDoctors}</p>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">{staffStats.activeDoctors} active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Subscriptions</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stats.activeSubscriptions}</p>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+{subscriptionStats.growthRate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Today's Schedule</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stats.todayAppointments}</p>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-orange-600">Appointments</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Patient Overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Patient Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="text-4xl font-bold text-blue-600 mb-2">{orgStats.totalPatients.toLocaleString()}</div>
                <div className="text-sm text-blue-700 font-medium">Total Patients</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="text-2xl font-bold text-green-600 mb-1">{orgStats.newToday}</div>
                  <div className="text-xs text-green-700 font-medium">New Today</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{orgStats.newThisWeek}</div>
                  <div className="text-xs text-purple-700 font-medium">This Week</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full justify-center gap-2">
                  <Users className="h-4 w-4" />
                  View All Patients
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Appointments & Partners */}
        <div className="lg:col-span-1 space-y-6">
          {/* Appointments */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{appointmentSummary.todayGP}</div>
                  <div className="text-xs text-blue-700 font-medium">GP Today</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{appointmentSummary.todaySpecialist}</div>
                  <div className="text-xs text-purple-700 font-medium">Specialists</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">This Week GP</span>
                  <span className="text-lg font-semibold text-gray-900">{appointmentSummary.thisWeekGP}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">This Week Specialists</span>
                  <span className="text-lg font-semibold text-gray-900">{appointmentSummary.thisWeekSpecialist}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partners */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Building className="h-5 w-5 text-indigo-600" />
                Partners
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {partners.map((partner) => (
                <div key={partner.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(partner.type)}`}>
                      {getPartnerIcon(partner.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{partner.name}</p>
                      <p className="text-xs text-gray-600">{partner.location}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(partner.status)}>
                    {partner.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Revenue & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Revenue */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Revenue Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-1">${subscriptionStats.revenueSnapshot.toLocaleString()}</div>
                <div className="text-sm text-green-700 font-medium">Monthly Revenue</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-xl font-bold text-blue-600 mb-1">{subscriptionStats.activeSubscriptions}</div>
                  <div className="text-xs text-blue-700 font-medium">Active Plans</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-xl font-bold text-purple-600 mb-1">+{subscriptionStats.growthRate}%</div>
                  <div className="text-xs text-purple-700 font-medium">Growth</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-red-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-lg border ${getPriorityColor(notification.priority)}`}>
                    <div className="flex items-start space-x-3">
                      <Bell className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{notification.message}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link key={index} href={action.route}>
                      <div className={`p-4 rounded-xl border-2 border-transparent ${action.bgColor} hover:border-blue-300 cursor-pointer transition-all duration-300 hover:shadow-md`}>
                        <Icon className={`h-6 w-6 ${action.color} mb-2`} />
                        <p className="text-xs font-medium text-gray-900">{action.name}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}