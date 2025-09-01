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
  ChartBar
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
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Greeting & Profile Summary */}
      <Card className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-white">
                <AvatarImage src={userImage} />
                <AvatarFallback className="bg-white text-indigo-600 text-xl">
                  {userName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {userName}!</h1>
                <p className="text-indigo-100">Organization Administrator</p>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge className="bg-white/20 text-white border-white/30">
                    <div className="w-2 h-2 rounded-full mr-2 bg-green-400"></div>
                    System Active
                  </Badge>
                  <span className="text-indigo-100 text-sm">
                    Last updated: {lastRefresh.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-indigo-100">Organization Overview</div>
              <div className="text-lg font-semibold">{stats.totalPatients} patients • {stats.totalDoctors} doctors</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs at the top */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Registered Patients</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalPatients}</p>
                <p className="text-xs text-green-600">+{orgStats.newToday} today</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Registered Doctors</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalDoctors}</p>
                <p className="text-xs text-gray-600">{staffStats.activeDoctors} active</p>
              </div>
              <Stethoscope className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-purple-600">{stats.activeSubscriptions}</p>
                <p className="text-xs text-green-600">+{subscriptionStats.growthRate}% growth</p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-orange-600">{stats.todayAppointments}</p>
                <p className="text-xs text-gray-600">GP: {appointmentSummary.todayGP} • Spec: {appointmentSummary.todaySpecialist}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Registered Patients Overview */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Registered Patients</span>
              </CardTitle>
              <CardDescription>Count, new today/this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{orgStats.totalPatients}</div>
                  <div className="text-sm text-gray-600">Total Patients</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-1">{orgStats.newToday}</div>
                  <div className="text-sm text-gray-600">New Today</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-1">{orgStats.newThisWeek}</div>
                  <div className="text-sm text-gray-600">New This Week</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Summary */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <span>Appointment Summary</span>
              </CardTitle>
              <CardDescription>Today/this week: GP vs Specialist</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Today's Appointments</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">GP Consultations</span>
                      <span className="text-lg font-bold text-blue-600">{appointmentSummary.todayGP}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium">Specialist Consultations</span>
                      <span className="text-lg font-bold text-purple-600">{appointmentSummary.todaySpecialist}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">This Week's Appointments</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">GP Consultations</span>
                      <span className="text-lg font-bold text-green-600">{appointmentSummary.thisWeekGP}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm font-medium">Specialist Consultations</span>
                      <span className="text-lg font-bold text-orange-600">{appointmentSummary.thisWeekSpecialist}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization Partners */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Building className="h-5 w-5 text-indigo-600" />
                <span>Organization Partners</span>
              </CardTitle>
              <CardDescription>Linked hospitals, labs, pharmacies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partners.map((partner) => (
                  <div key={partner.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(partner.type)}`}>
                        {getPartnerIcon(partner.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{partner.name}</p>
                        <p className="text-sm text-gray-600">{partner.location}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(partner.status)}>
                      {partner.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Active Subscriptions */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                <span>Active Subscriptions</span>
              </CardTitle>
              <CardDescription>Count + revenue snapshot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-1">{subscriptionStats.activeSubscriptions}</div>
                  <div className="text-sm text-gray-600">Active Plans</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">${subscriptionStats.revenueSnapshot.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600 mb-1">+{subscriptionStats.growthRate}%</div>
                  <div className="text-sm text-gray-600">Growth Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Bell className="h-5 w-5 text-orange-600" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>Approvals, issues, expiring contracts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-3 border rounded-lg ${getPriorityColor(notification.priority)}`}>
                    <div className="flex items-start space-x-2">
                      <Bell className="h-4 w-4 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.message}</p>
                        <p className="text-xs opacity-75">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Plus className="h-5 w-5 text-blue-600" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link key={index} href={action.route}>
                      <div className={`p-3 rounded-lg border-2 border-transparent ${action.bgColor} hover:border-blue-300 cursor-pointer transition-all duration-300`}>
                        <Icon className={`h-5 w-5 ${action.color} mb-2`} />
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