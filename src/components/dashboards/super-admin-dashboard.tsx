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
  HardDrive,
  Zap,
  Target,
  Clock,
  BarChart3,
  PieChart,
  UserPlus,
  UserRound,
  UserRoundPlus,
  UserRoundCheck,
  ShieldCheck,
  ShieldAlert,
  Globe2,
  Map,
  MapPin,
  Navigation,
  Compass,
  Satellite,
  SatelliteDish,
  Radio,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Power,
  PowerOff,
  Zap as ZapIcon
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { BarChart } from '@/components/ui/bar-chart'
import { LineChart } from '@/components/ui/line-chart'

interface SuperAdminDashboardProps {
  userName: string
  userImage?: string
}

interface GlobalStats {
  totalUsers: number
  totalOrganizations: number
  totalRevenue: number
  totalPartners: number
  systemHealth: string
  activeConsultations: number
  systemUptime: string
  monthlyGrowth: number
  globalActiveUsers: number
  totalDataProcessed: number
  apiCallsToday: number
  systemLoad: number
  securityEvents: number
}

interface GlobalMetric {
  name: string
  value: number
  unit: string
  status: 'excellent' | 'good' | 'warning' | 'critical'
  icon: any
  trend: 'up' | 'down' | 'stable'
}

interface GlobalActivity {
  date: string
  users: number
  organizations: number
  revenue: number
  apiCalls: number
  dataProcessed: number
}

interface RegionalStats {
  region: string
  users: number
  organizations: number
  revenue: number
  growth: number
  uptime: number
}

interface SystemAlert {
  id: string
  type: 'security' | 'performance' | 'compliance' | 'system' | 'network'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  time: string
  affectedSystems: string[]
  globalImpact: boolean
  actionRequired: boolean
}

interface OrganizationType {
  type: string
  count: number
  users: number
  revenue: number
  growth: number
}

export function SuperAdminDashboard({ userName, userImage }: SuperAdminDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [selectedTimeRange, setSelectedTimeRange] = useState('week')

  const [stats, setStats] = useState<GlobalStats>({
    totalUsers: 0,
    totalOrganizations: 0,
    totalRevenue: 0,
    totalPartners: 0,
    systemHealth: 'Healthy',
    activeConsultations: 0,
    systemUptime: '99.9%',
    monthlyGrowth: 0,
    globalActiveUsers: 0,
    totalDataProcessed: 0,
    apiCallsToday: 0,
    systemLoad: 0,
    securityEvents: 0
  })

  const [globalMetrics, setGlobalMetrics] = useState<GlobalMetric[]>([
    { name: 'Global System Load', value: 67, unit: '%', status: 'good', icon: Cpu, trend: 'stable' },
    { name: 'API Response Time', value: 145, unit: 'ms', status: 'excellent', icon: ZapIcon, trend: 'down' },
    { name: 'Data Processing', value: 89, unit: '%', status: 'good', icon: Database, trend: 'up' },
    { name: 'Network Latency', value: 23, unit: 'ms', status: 'excellent', icon: Network, trend: 'stable' },
    { name: 'Security Score', value: 94, unit: '%', status: 'excellent', icon: ShieldCheck, trend: 'up' },
    { name: 'Compliance Status', value: 98, unit: '%', status: 'excellent', icon: Shield, trend: 'stable' }
  ])

  const [globalActivity, setGlobalActivity] = useState<GlobalActivity[]>([
    { date: '2024-01-08', users: 15420, organizations: 89, revenue: 485000, apiCalls: 2450000, dataProcessed: 1240 },
    { date: '2024-01-09', users: 15890, organizations: 91, revenue: 512000, apiCalls: 2680000, dataProcessed: 1380 },
    { date: '2024-01-10', users: 16250, organizations: 92, revenue: 528000, apiCalls: 2890000, dataProcessed: 1450 },
    { date: '2024-01-11', users: 16780, organizations: 94, revenue: 545000, apiCalls: 3120000, dataProcessed: 1520 },
    { date: '2024-01-12', users: 17120, organizations: 96, revenue: 568000, apiCalls: 3340000, dataProcessed: 1680 },
    { date: '2024-01-13', users: 17560, organizations: 98, revenue: 589000, apiCalls: 3560000, dataProcessed: 1740 },
    { date: '2024-01-14', users: 17980, organizations: 101, revenue: 612000, apiCalls: 3780000, dataProcessed: 1820 }
  ])

  const [regionalStats, setRegionalStats] = useState<RegionalStats[]>([
    { region: 'North America', users: 8920, organizations: 45, revenue: 285000, growth: 12.5, uptime: 99.8 },
    { region: 'Europe', users: 6780, organizations: 32, revenue: 198000, growth: 8.3, uptime: 99.9 },
    { region: 'Asia Pacific', users: 12340, organizations: 18, revenue: 89000, growth: 18.7, uptime: 99.6 },
    { region: 'Latin America', users: 3450, organizations: 4, revenue: 32000, growth: 15.2, uptime: 99.4 },
    { region: 'Africa', users: 2180, organizations: 2, revenue: 18000, growth: 22.1, uptime: 98.9 }
  ])

  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([
    { id: '1', type: 'security', severity: 'high', message: 'Global DDoS attack mitigation in progress', time: '15 min ago', affectedSystems: ['API Gateway', 'CDN'], globalImpact: true, actionRequired: true },
    { id: '2', type: 'performance', severity: 'medium', message: 'Database cluster performance degradation', time: '1 hour ago', affectedSystems: ['Primary DB', 'Replica DB'], globalImpact: true, actionRequired: true },
    { id: '3', type: 'compliance', severity: 'high', message: 'GDPR compliance audit scheduled', time: '2 hours ago', affectedSystems: ['All Regions'], globalImpact: true, actionRequired: true },
    { id: '4', type: 'system', severity: 'low', message: 'Scheduled maintenance for backup systems', time: '4 hours ago', affectedSystems: ['Backup Servers'], globalImpact: false, actionRequired: false }
  ])

  const [organizationTypes, setOrganizationTypes] = useState<OrganizationType[]>([
    { type: 'Hospitals', count: 156, users: 45890, revenue: 2450000, growth: 15.2 },
    { type: 'Clinics', count: 289, users: 34560, revenue: 1250000, growth: 12.8 },
    { type: 'Laboratories', count: 78, users: 12450, revenue: 680000, growth: 18.5 },
    { type: 'Pharmacies', count: 234, users: 28900, revenue: 890000, growth: 9.7 },
    { type: 'Insurance', count: 45, users: 15670, revenue: 2100000, growth: 11.3 }
  ])

  const enhancedQuickActions = [
    { 
      name: 'Create Admin', 
      icon: UserRoundPlus, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      route: '/dashboard/super-admin/create-admin',
      description: 'Add new admin'
    },
    { 
      name: 'Manage Admins', 
      icon: Users2, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      route: '/dashboard/super-admin/admins',
      description: 'Admin management'
    },
    { 
      name: 'Subscription Plans', 
      icon: CreditCard, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      route: '/dashboard/super-admin/subscription-plans',
      description: 'Manage plans'
    },
    { 
      name: 'Global Features', 
      icon: Zap, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      route: '/dashboard/super-admin/features',
      description: 'Feature control'
    },
    { 
      name: 'System Status', 
      icon: Monitor, 
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      route: '/dashboard/super-admin/system-status',
      description: 'Global monitoring'
    },
    { 
      name: 'Security Center', 
      icon: ShieldCheck, 
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      route: '/dashboard/super-admin/security',
      description: 'Security hub'
    },
    { 
      name: 'Network Status', 
      icon: Network, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      route: '/dashboard/super-admin/networks',
      description: 'Network health'
    },
    { 
      name: 'Database Admin', 
      icon: Database, 
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      route: '/dashboard/super-admin/database',
      description: 'DB management'
    }
  ]

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      const [usersRes, revenueRes, partnersRes, systemRes, kpisRes] = await Promise.all([
        fetch('/api/super-admin/analytics'),
        fetch('/api/super-admin/subscription-plans'),
        fetch('/api/super-admin/partners'),
        fetch('/api/system/monitor'),
        fetch('/api/super-admin/system-status')
      ])

      const data = {
        totalUsers: 54250,
        totalOrganizations: 802,
        totalRevenue: 28500000,
        totalPartners: 567,
        systemHealth: 'Excellent',
        activeConsultations: 1245,
        systemUptime: '99.9%',
        monthlyGrowth: 15.8,
        globalActiveUsers: 17980,
        totalDataProcessed: 1820,
        apiCallsToday: 3780000,
        systemLoad: 67,
        securityEvents: 3
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        const userStats = usersData.userStats || {}
        data.totalUsers = (userStats.totalPatients || 0) + (userStats.totalDoctors || 0) + (userStats.totalAttendants || 0) + (userStats.totalOrganizations || 0)
      }

      if (revenueRes.ok) {
        const revenueData = await revenueRes.json()
        const revenueStats = revenueData.revenueStats || {}
        data.totalRevenue = revenueStats.totalRevenue || 0
        data.monthlyGrowth = revenueStats.monthlyGrowth || 0
      }

      if (partnersRes.ok) {
        const partnersData = await partnersRes.json()
        const marketplaceStats = partnersData.marketplaceStats || {}
        data.totalPartners = (marketplaceStats.totalLabs || 0) + (marketplaceStats.totalPharmacies || 0) + (marketplaceStats.totalHospitals || 0)
      }

      if (systemRes.ok) {
        const systemData = await systemRes.json()
        const systemHealth = systemData.systemHealth || {}
        data.systemHealth = systemHealth.status === 'healthy' ? 'Excellent' : systemHealth.status === 'warning' ? 'Good' : 'Critical'
        data.systemUptime = systemHealth.uptime || '99.9%'
      }

      if (kpisRes.ok) {
        const kpisData = await kpisRes.json()
        const platformKPIs = kpisData.platformKPIs || {}
        data.activeConsultations = platformKPIs.activeConsultations || 0
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
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getMetricBg = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-50'
      case 'good': return 'bg-blue-50'
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
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xl font-bold">
                  {userName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}</h1>
              <p className="text-gray-600 mt-1">Super Administrator</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <div className="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
                  System Operational
                </Badge>
                <Badge variant="outline" className="border-purple-200 text-purple-700">
                  <Shield className="h-3 w-3 mr-1" />
                  Super Admin Access
                </Badge>
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  <Globe className="h-3 w-3 mr-1" />
                  Global Scope
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
              Global Settings
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Global Action
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
              <p className="text-sm font-medium text-gray-600 mb-1">Global Users</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalUsers.toLocaleString()}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-600 font-medium">{stats.globalActiveUsers} active</span>
                <span className="text-gray-500">+{stats.monthlyGrowth}% growth</span>
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
              <p className="text-sm font-medium text-gray-600 mb-1">Global Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">${(stats.totalRevenue / 1000000).toFixed(1)}M</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600 font-medium">+{stats.monthlyGrowth}%</span>
                <span className="text-gray-500">monthly growth</span>
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
              <p className="text-sm font-medium text-gray-600 mb-1">Organizations</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalOrganizations}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-600 font-medium">{stats.totalPartners} partners</span>
                <span className="text-gray-500">global network</span>
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
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-600 font-medium">{stats.systemUptime}</span>
                <span className="text-gray-500">{stats.activeConsultations} active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Global Activity Chart */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Global Platform Activity
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
                  data={globalActivity}
                  xAxis="date"
                  yAxis="users"
                  color="#3B82F6"
                  title="Global User Activity Trends"
                />
              </div>
            </CardContent>
          </Card>

          {/* Regional Performance */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                Regional Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <BarChart
                  data={regionalStats}
                  xAxis="region"
                  yAxis="revenue"
                  color="#10B981"
                  title="Revenue by Region"
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
                Global Quick Actions
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

          {/* Global System Alerts */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Global System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 overflow-y-auto">
              <div className="space-y-3">
                {systemAlerts.slice(0, 4).map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{alert.message}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-600">{alert.time}</p>
                          {alert.globalImpact && (
                            <Badge variant="outline" className="text-xs border-red-200 text-red-700">
                              Global Impact
                            </Badge>
                          )}
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

      {/* Bottom Section - Global Metrics & Organization Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Global System Metrics */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Server className="h-5 w-5 text-purple-600" />
              Global System Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {globalMetrics.map((metric) => (
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

        {/* Organization Types */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Organization Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {organizationTypes.map((org) => (
                <div key={org.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{org.type}</span>
                      <Badge variant="outline" className="text-xs">
                        {org.count} organizations
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{org.users.toLocaleString()} users</span>
                      <span>${org.revenue.toLocaleString()}</span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        {org.growth}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global System Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-purple-600" />
            Global System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{stats.apiCallsToday.toLocaleString()}</div>
              <p className="text-sm text-gray-600 font-medium">API Calls Today</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+15% from yesterday</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{stats.totalDataProcessed}TB</div>
              <p className="text-sm text-gray-600 font-medium">Data Processed</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+8% this week</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">{stats.securityEvents}</div>
              <p className="text-sm text-gray-600 font-medium">Security Events</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <TrendingDown className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">-25% improvement</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">{stats.systemLoad}%</div>
              <p className="text-sm text-gray-600 font-medium">System Load</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <Activity className="h-3 w-3 text-orange-500" />
                <span className="text-xs text-orange-600">Optimal range</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}