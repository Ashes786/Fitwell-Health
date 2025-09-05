'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
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
  ChartBar as ChartBarIcon,
  Clock,
  Star,
  Target,
  Zap,
  Award,
  BarChart3,
  PieChart as PieChartIcon,
  UserPlus,
  UserRound,
  UserRoundPlus,
  UserRoundCheck,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Server,
  Database,
  Network,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Cpu,
  HardDrive,
  MemoryStick
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { BarChart } from '@/components/ui/bar-chart'
import { LineChart } from '@/components/ui/line-chart'

interface AdminDashboardProps {
  userName: string
  userImage?: string
}

interface Stats {
  totalPatients: number
  totalDoctors: number
  totalAttendants: number
  totalPartners: number
  activeSubscriptions: number
  todayAppointments: number
  weeklyRevenue: number
  monthlyRevenue: number
  systemHealth: string
  systemUptime: number
  activeUsers: number
  pendingApprovals: number
  systemLoad: number
}

interface SystemMetric {
  name: string
  value: number
  unit: string
  status: 'good' | 'warning' | 'critical'
  icon: any
  trend: 'up' | 'down' | 'stable'
}

interface UserActivity {
  date: string
  patients: number
  doctors: number
  attendants: number
  appointments: number
}

interface RevenueData {
  month: string
  subscriptions: number
  consultations: number
  procedures: number
  total: number
}

interface DepartmentStats {
  name: string
  staff: number
  patients: number
  revenue: number
  satisfaction: number
  utilization: number
}

interface Alert {
  id: string
  type: 'system' | 'security' | 'performance' | 'compliance'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  time: string
  source: string
  actionRequired: boolean
}

export function AdminDashboard({ userName, userImage }: AdminDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [selectedTimeRange, setSelectedTimeRange] = useState('week')

  const [stats, setStats] = useState<Stats>({
    totalPatients: 0,
    totalDoctors: 0,
    totalAttendants: 0,
    totalPartners: 0,
    activeSubscriptions: 0,
    todayAppointments: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    systemHealth: 'Healthy',
    systemUptime: 99.9,
    activeUsers: 0,
    pendingApprovals: 0,
    systemLoad: 65
  })

  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    { name: 'CPU Usage', value: 45, unit: '%', status: 'good', icon: Cpu, trend: 'stable' },
    { name: 'Memory', value: 68, unit: '%', status: 'good', icon: MemoryStick, trend: 'up' },
    { name: 'Storage', value: 82, unit: '%', status: 'warning', icon: HardDrive, trend: 'up' },
    { name: 'Network', value: 12, unit: 'ms', status: 'good', icon: Network, trend: 'stable' },
    { name: 'Database', value: 95, unit: '%', status: 'critical', icon: Database, trend: 'up' },
    { name: 'API Response', value: 180, unit: 'ms', status: 'good', icon: Server, trend: 'down' }
  ])

  const [userActivity, setUserActivity] = useState<UserActivity[]>([
    { date: '2024-01-08', patients: 45, doctors: 12, attendants: 8, appointments: 65 },
    { date: '2024-01-09', patients: 52, doctors: 15, attendants: 9, appointments: 78 },
    { date: '2024-01-10', patients: 48, doctors: 14, attendants: 7, appointments: 71 },
    { date: '2024-01-11', patients: 61, doctors: 16, attendants: 10, appointments: 89 },
    { date: '2024-01-12', patients: 55, doctors: 13, attendants: 8, appointments: 82 },
    { date: '2024-01-13', patients: 67, doctors: 18, attendants: 12, appointments: 95 },
    { date: '2024-01-14', patients: 58, doctors: 15, attendants: 9, appointments: 86 }
  ])

  const [revenueData, setRevenueData] = useState<RevenueData[]>([
    { month: 'Jan', subscriptions: 45000, consultations: 28000, procedures: 15000, total: 88000 },
    { month: 'Feb', subscriptions: 48000, consultations: 32000, procedures: 18000, total: 98000 },
    { month: 'Mar', subscriptions: 52000, consultations: 35000, procedures: 22000, total: 109000 },
    { month: 'Apr', subscriptions: 49000, consultations: 31000, procedures: 19000, total: 99000 },
    { month: 'May', subscriptions: 55000, consultations: 38000, procedures: 25000, total: 118000 },
    { month: 'Jun', subscriptions: 58000, consultations: 41000, procedures: 28000, total: 127000 }
  ])

  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([
    { name: 'Cardiology', staff: 8, patients: 156, revenue: 125000, satisfaction: 4.7, utilization: 85 },
    { name: 'Neurology', staff: 6, patients: 98, revenue: 98000, satisfaction: 4.8, utilization: 78 },
    { name: 'Orthopedics', staff: 10, patients: 189, revenue: 156000, satisfaction: 4.6, utilization: 92 },
    { name: 'Pediatrics', staff: 12, patients: 267, revenue: 134000, satisfaction: 4.9, utilization: 88 },
    { name: 'Emergency', staff: 15, patients: 445, revenue: 189000, satisfaction: 4.4, utilization: 95 }
  ])

  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', type: 'system', severity: 'high', message: 'Database storage approaching capacity', time: '2 hours ago', source: 'Database Server', actionRequired: true },
    { id: '2', type: 'security', severity: 'medium', message: 'Unusual login activity detected', time: '4 hours ago', source: 'Security System', actionRequired: true },
    { id: '3', type: 'performance', severity: 'low', message: 'API response time increased', time: '6 hours ago', source: 'Load Balancer', actionRequired: false },
    { id: '4', type: 'compliance', severity: 'high', message: 'HIPAA compliance audit due', time: '1 day ago', source: 'Compliance Team', actionRequired: true }
  ])

  const enhancedQuickActions = [
    { 
      name: 'Add Patient', 
      icon: UserRoundPlus, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      route: '/dashboard/admin/patients',
      description: 'Register new patient'
    },
    { 
      name: 'Add Doctor', 
      icon: UserRoundPlus, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      route: '/dashboard/admin/doctors',
      description: 'Onboard new doctor'
    },
    { 
      name: 'Add Staff', 
      icon: UserRoundPlus, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      route: '/dashboard/admin/attendants',
      description: 'Hire new staff'
    },
    { 
      name: 'Manage Partners', 
      icon: Building, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      route: '/dashboard/admin/partners',
      description: 'Partner management'
    },
    { 
      name: 'Subscriptions', 
      icon: CreditCard, 
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      route: '/dashboard/admin/subscription-plans',
      description: 'Manage plans'
    },
    { 
      name: 'Control Room', 
      icon: Monitor, 
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      route: '/dashboard/admin/control-room',
      description: 'Operations center'
    },
    { 
      name: 'Analytics', 
      icon: BarChart3, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      route: '/dashboard/admin/analytics',
      description: 'View reports'
    },
    { 
      name: 'System Settings', 
      icon: Settings, 
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      route: '/dashboard/admin/settings',
      description: 'Configure system'
    }
  ]

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      const [patientsRes, doctorsRes, partnersRes, subscriptionsRes, appointmentsRes] = await Promise.all([
        fetch('/api/admin/patients'),
        fetch('/api/admin/doctors'),
        fetch('/api/admin/partners'),
        fetch('/api/admin/subscription-plans'),
        fetch('/api/appointments')
      ])

      const data = {
        totalPatients: 1250,
        totalDoctors: 45,
        totalAttendants: 28,
        totalPartners: 12,
        activeSubscriptions: 890,
        todayAppointments: 156,
        weeklyRevenue: 125000,
        monthlyRevenue: 485000,
        systemHealth: 'Healthy',
        systemUptime: 99.9,
        activeUsers: 342,
        pendingApprovals: 8,
        systemLoad: 65
      }

      if (patientsRes.ok) {
        const patientsData = await patientsRes.json()
        data.totalPatients = patientsData.organizationStats?.totalPatients || 1250
      }

      if (doctorsRes.ok) {
        const doctorsData = await doctorsRes.json()
        data.totalDoctors = doctorsData.staffStats?.totalDoctors || 45
      }

      if (partnersRes.ok) {
        const partnersData = await partnersRes.json()
        data.totalPartners = partnersData.partners?.length || 12
      }

      if (subscriptionsRes.ok) {
        const subscriptionsData = await subscriptionsRes.json()
        data.activeSubscriptions = subscriptionsData.subscriptionStats?.activeSubscriptions || 890
        data.weeklyRevenue = subscriptionsData.subscriptionStats?.revenueSnapshot || 125000
      }

      if (appointmentsRes.ok) {
        const appointmentsData = await appointmentsRes.json()
        const appointmentSummary = appointmentsData.appointmentSummary || {}
        data.todayAppointments = (appointmentSummary.todayGP || 0) + (appointmentSummary.todaySpecialist || 0)
      }

      setStats(data)
      setLastRefresh(new Date())
    } catch (error) {
      toast.error('Failed to load dashboard data')
      console.error('Dashboard data loading error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getMetricBg = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-50'
      case 'warning': return 'bg-yellow-50'
      case 'critical': return 'bg-red-50'
      default: return 'bg-gray-50'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 text-red-600 border-red-200'
      case 'high': return 'bg-orange-50 text-orange-600 border-orange-200'
      case 'medium': return 'bg-yellow-50 text-yellow-600 border-yellow-200'
      default: return 'bg-blue-50 text-blue-600 border-blue-200'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-red-500" />
      case 'down': return <TrendingDown className="h-3 w-3 text-green-500" />
      default: return <Activity className="h-3 w-3 text-gray-500" />
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
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin Access
                </Badge>
                <span className="text-sm text-gray-500">
                  Updated {lastRefresh.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Quick Add
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{(stats.totalPatients + stats.totalDoctors + stats.totalAttendants).toLocaleString()}</p>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <span className="text-blue-600 font-medium">{stats.totalPatients} patients</span>
                <span className="text-green-600 font-medium">{stats.totalDoctors} doctors</span>
                <span className="text-purple-600 font-medium">{stats.totalAttendants} staff</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">${(stats.monthlyRevenue / 1000).toFixed(0)}K</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-600 font-medium">{stats.activeSubscriptions} active subs</span>
                <span className="text-gray-500">+12% growth</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Partners</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalPartners}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-600 font-medium">Network orgs</span>
                <span className="text-gray-500">95% satisfaction</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">System Health</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.systemHealth}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-orange-600 font-medium">{stats.todayAppointments} appointments</span>
                <span className="text-gray-500">{stats.systemUptime}% uptime</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Activity Chart */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  User Activity Overview
                </CardTitle>
                <Tabs value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <LineChart
                  data={userActivity.map(item => ({ label: item.date, value: item.patients }))}
                  lineColor="#3B82F6"
                  title="Daily Patient Activity"
                />
              </div>
            </CardContent>
          </Card>

          {/* Revenue Analytics */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-green-600" />
                Revenue Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <BarChart
                  data={revenueData.map(item => ({ label: item.month, value: item.total }))}
                  barColor="#10B981"
                  title="Monthly Revenue Trend"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
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
                {enhancedQuickActions.slice(0, 4).map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link key={index} href={action.route}>
                      <div className="p-3 rounded-xl border-2 border-transparent bg-gray-50 hover:border-blue-300 cursor-pointer transition-all duration-300 hover:shadow-md h-full flex flex-col items-center justify-center">
                        <Icon className={`h-5 w-5 ${action.color} mb-1`} />
                        <p className="text-xs font-medium text-gray-900 text-center">{action.name}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {enhancedQuickActions.slice(4, 8).map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link key={index} href={action.route}>
                      <div className="p-3 rounded-xl border-2 border-transparent bg-gray-50 hover:border-blue-300 cursor-pointer transition-all duration-300 hover:shadow-md h-full flex flex-col items-center justify-center">
                        <Icon className={`h-5 w-5 ${action.color} mb-1`} />
                        <p className="text-xs font-medium text-gray-900 text-center">{action.name}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 overflow-y-auto">
              <div className="space-y-3">
                {alerts.slice(0, 4).map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{alert.message}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-600">{alert.time}</p>
                          <Badge variant="outline" className="text-xs">
                            {alert.source}
                          </Badge>
                        </div>
                        {alert.actionRequired && (
                          <Button size="sm" variant="outline" className="mt-2 text-xs">
                            Action Required
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section - System Metrics & Department Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* System Metrics */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Server className="h-5 w-5 text-purple-600" />
              System Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {systemMetrics.map((metric) => (
                <div key={metric.name} className={`p-3 rounded-lg ${getMetricBg(metric.status)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <metric.icon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                    </div>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="text-lg font-bold text-gray-900">{metric.value}{metric.unit}</div>
                  <div className="text-xs text-gray-500">
                    Status: <span className={getMetricColor(metric.status)}>{metric.status}</span>
                  </div>
                  <Progress value={metric.value} className="h-2 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Hospital className="h-5 w-5 text-blue-600" />
              Department Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.map((dept) => (
                <div key={dept.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{dept.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {dept.staff} staff
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{dept.patients} patients</span>
                      <span>${dept.revenue.toLocaleString()}</span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {dept.satisfaction}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{dept.utilization}%</div>
                    <div className="text-xs text-gray-500">utilization</div>
                    <Progress value={dept.utilization} className="w-16 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Users Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-blue-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            Active Users Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{stats.activeUsers}</div>
              <p className="text-sm text-gray-600 font-medium">Currently Active</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+8% from yesterday</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{stats.totalPatients}</div>
              <p className="text-sm text-gray-600 font-medium">Total Patients</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+12% this month</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">{stats.totalDoctors}</div>
              <p className="text-sm text-gray-600 font-medium">Total Doctors</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+3 new this week</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">{stats.pendingApprovals}</div>
              <p className="text-sm text-gray-600 font-medium">Pending Approvals</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <Clock className="h-3 w-3 text-orange-500" />
                <span className="text-xs text-orange-600">Requires attention</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}