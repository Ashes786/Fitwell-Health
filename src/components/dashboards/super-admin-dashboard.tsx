'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  DollarSign, 
  Building, 
  Activity, 
  Bell, 
  TrendingUp, 
  TrendingDown,
  Server,
  Database,
  Settings,
  LogOut,
  Heart,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Plus,
  UserCheck,
  Stethoscope,
  Users2,
  CreditCard,
  Calendar,
  ChartBar,
  Shield,
  Globe,
  Hospital,
  FlaskConical,
  ShoppingCart,
  Network,
  Cloud,
  Cpu,
  HardDrive
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface SuperAdminDashboardProps {
  userName: string
  userImage?: string
}

interface UserStats {
  totalPatients: number
  totalDoctors: number
  totalAttendants: number
  totalOrganizations: number
}

interface RevenueStats {
  totalRevenue: number
  subscriptionBreakdown: {
    patient: number
    doctor: number
    organization: number
  }
  monthlyGrowth: number
}

interface MarketplaceStats {
  totalLabs: number
  totalPharmacies: number
  totalHospitals: number
  newOnboarding: number
}

interface PlatformKPIs {
  activeConsultations: number
  averageWaitTime: string
  appUsageRate: number
  systemUptime: string
}

interface SystemHealth {
  uptime: string
  errors: number
  alerts: number
  status: 'healthy' | 'warning' | 'critical'
}

interface Notification {
  id: string
  type: 'critical' | 'compliance' | 'system' | 'security'
  message: string
  time: string
  priority: 'high' | 'medium' | 'low'
  resolved: boolean
}

interface Stats {
  totalUsers: number
  totalRevenue: number
  totalPartners: number
  systemHealth: string
}

export function SuperAdminDashboard({ userName, userImage }: SuperAdminDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Mock data for super admin dashboard
  const [userStats, setUserStats] = useState<UserStats>({
    totalPatients: 15420,
    totalDoctors: 485,
    totalAttendants: 320,
    totalOrganizations: 45
  })

  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    totalRevenue: 2850000,
    subscriptionBreakdown: {
      patient: 1200000,
      doctor: 850000,
      organization: 800000
    },
    monthlyGrowth: 18.5
  })

  const [marketplaceStats, setMarketplaceStats] = useState<MarketplaceStats>({
    totalLabs: 125,
    totalPharmacies: 89,
    totalHospitals: 67,
    newOnboarding: 12
  })

  const [platformKPIs, setPlatformKPIs] = useState<PlatformKPIs>({
    activeConsultations: 1247,
    averageWaitTime: '8.5 min',
    appUsageRate: 94.2,
    systemUptime: '99.98%'
  })

  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    uptime: '99.98%',
    errors: 3,
    alerts: 2,
    status: 'healthy'
  })

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'critical', message: 'Database cluster showing high latency', time: '15 min ago', priority: 'high', resolved: false },
    { id: '2', type: 'compliance', message: 'GDPR compliance audit due next week', time: '1 hour ago', priority: 'high', resolved: false },
    { id: '3', type: 'security', message: 'Unusual login activity detected', time: '2 hours ago', priority: 'high', resolved: true },
    { id: '4', type: 'system', message: 'Backup system completed successfully', time: '3 hours ago', priority: 'low', resolved: true }
  ])

  const [stats, setStats] = useState<Stats>({
    totalUsers: 16225,
    totalRevenue: 2850000,
    totalPartners: 281,
    systemHealth: 'Healthy'
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
      name: 'Add/Remove Admins', 
      icon: Users2, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      route: '/dashboard/admins'
    },
    { 
      name: 'Create/Update Plans', 
      icon: CreditCard, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      route: '/dashboard/subscription-plans'
    },
    { 
      name: 'Add Organization', 
      icon: Building, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      route: '/dashboard/organizations'
    },
    { 
      name: 'Add Hospital/Lab', 
      icon: Hospital, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      route: '/dashboard/partners'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-600 border-red-200'
      case 'medium': return 'bg-yellow-50 text-yellow-600 border-yellow-200'
      default: return 'bg-blue-50 text-blue-600 border-blue-200'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />
      case 'compliance': return <Shield className="h-4 w-4" />
      case 'system': return <Server className="h-4 w-4" />
      case 'security': return <Shield className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
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
      <Card className="bg-gradient-to-r from-gray-800 to-gray-900 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-white">
                <AvatarImage src={userImage} />
                <AvatarFallback className="bg-white text-gray-800 text-xl">
                  {userName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Super Admin Dashboard - {userName}</h1>
                <p className="text-gray-300">Platform Owner & System Administrator</p>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge className="bg-white/20 text-white border-white/30">
                    <div className="w-2 h-2 rounded-full mr-2 bg-green-400"></div>
                    System Operational
                  </Badge>
                  <span className="text-gray-300 text-sm">
                    Last updated: {lastRefresh.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-300">Platform Overview</div>
              <div className="text-lg font-semibold">{stats.totalUsers.toLocaleString()} users • ${stats.totalRevenue.toLocaleString()} revenue</div>
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
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-gray-600">All roles combined</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-green-600">+{revenueStats.monthlyGrowth}% monthly</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Marketplace</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalPartners}</p>
                <p className="text-xs text-gray-600">Labs, pharmacies, hospitals</p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Health</p>
                <p className="text-2xl font-bold text-emerald-600">{systemHealth.uptime}</p>
                <p className="text-xs text-gray-600">{systemHealth.errors} errors • {systemHealth.alerts} alerts</p>
              </div>
              <Activity className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Total Users Breakdown */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Total Users</span>
              </CardTitle>
              <CardDescription>Patients, doctors, attendants, orgs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{userStats.totalPatients.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Patients</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">{userStats.totalDoctors}</div>
                  <div className="text-sm text-gray-600">Doctors</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{userStats.totalAttendants}</div>
                  <div className="text-sm text-gray-600">Attendants</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{userStats.totalOrganizations}</div>
                  <div className="text-sm text-gray-600">Organizations</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue & Subscription Breakdown */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>Revenue & Subscription Breakdown</span>
              </CardTitle>
              <CardDescription>Total revenue & subscription analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Revenue Distribution</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">Patient Subscriptions</span>
                      <span className="text-lg font-bold text-blue-600">${(revenueStats.subscriptionBreakdown.patient / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Doctor Subscriptions</span>
                      <span className="text-lg font-bold text-green-600">${(revenueStats.subscriptionBreakdown.doctor / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium">Organization Plans</span>
                      <span className="text-lg font-bold text-purple-600">${(revenueStats.subscriptionBreakdown.organization / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Growth Metrics</h4>
                  <div className="space-y-3">
                    <div className="text-center p-4 bg-emerald-50 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">+{revenueStats.monthlyGrowth}%</div>
                      <div className="text-sm text-gray-600">Monthly Growth</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600 mb-1">${(revenueStats.totalRevenue / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-gray-600">Total Revenue</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Marketplace Overview */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Building className="h-5 w-5 text-indigo-600" />
                <span>Marketplace Overview</span>
              </CardTitle>
              <CardDescription>Labs, pharmacies, hospitals onboarded</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-1">{marketplaceStats.totalHospitals}</div>
                  <div className="text-sm text-gray-600">Hospitals</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{marketplaceStats.totalLabs}</div>
                  <div className="text-sm text-gray-600">Labs</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">{marketplaceStats.totalPharmacies}</div>
                  <div className="text-sm text-gray-600">Pharmacies</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{marketplaceStats.newOnboarding}</div>
                  <div className="text-sm text-gray-600">New This Month</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Platform-Wide KPIs */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <ChartBar className="h-5 w-5 text-purple-600" />
                <span>Platform-Wide KPIs</span>
              </CardTitle>
              <CardDescription>Active consultations, wait time, usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{platformKPIs.activeConsultations}</div>
                  <div className="text-sm text-gray-600">Active Consultations</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600 mb-1">{platformKPIs.averageWaitTime}</div>
                  <div className="text-sm text-gray-600">Average Wait Time</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600 mb-1">{platformKPIs.appUsageRate}%</div>
                  <div className="text-sm text-gray-600">App Usage Rate</div>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <div className="text-lg font-bold text-emerald-600 mb-1">{platformKPIs.systemUptime}</div>
                  <div className="text-sm text-gray-600">System Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health/Logs */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Server className="h-5 w-5 text-emerald-600" />
                <span>System Health</span>
              </CardTitle>
              <CardDescription>Uptime, errors, alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                  <span className="text-sm font-medium">System Status</span>
                  <Badge className={getStatusColor(systemHealth.status)}>
                    {systemHealth.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">Uptime</span>
                  <span className="text-sm font-bold text-blue-600">{systemHealth.uptime}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium">Active Errors</span>
                  <span className="text-sm font-bold text-red-600">{systemHealth.errors}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium">System Alerts</span>
                  <span className="text-sm font-bold text-yellow-600">{systemHealth.alerts}</span>
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
              <CardDescription>Critical issues, compliance reminders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-3 border rounded-lg ${getPriorityColor(notification.priority)} ${notification.resolved ? 'opacity-50' : ''}`}>
                    <div className="flex items-start space-x-2">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.message}</p>
                        <p className="text-xs opacity-75">{notification.time}</p>
                        {notification.resolved && (
                          <Badge className="text-xs bg-green-100 text-green-800 mt-1">Resolved</Badge>
                        )}
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
              <CardDescription>Platform management tasks</CardDescription>
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