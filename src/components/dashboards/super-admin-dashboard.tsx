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
  HardDrive,
  Zap,
  Target,
  Clock,
  BarChart3,
  PieChart
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface SuperAdminDashboardProps {
  userName: string
  userImage?: string
}

interface Stats {
  totalUsers: number
  totalRevenue: number
  totalPartners: number
  systemHealth: string
  activeConsultations: number
  systemUptime: string
  monthlyGrowth: number
}

interface QuickAction {
  name: string
  icon: any
  color: string
  bgColor: string
  route: string
}

export function SuperAdminDashboard({ userName, userImage }: SuperAdminDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalRevenue: 0,
    totalPartners: 0,
    systemHealth: 'Healthy',
    activeConsultations: 0,
    systemUptime: '99.9%',
    monthlyGrowth: 0
  })

  const quickActions: QuickAction[] = [
    { 
      name: 'Manage Admins', 
      icon: Users2, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      route: '/dashboard/admins'
    },
    { 
      name: 'Subscription Plans', 
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
      name: 'System Status', 
      icon: Monitor, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      route: '/dashboard/system-status'
    }
  ]

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Fetch data from API endpoints
      const [usersRes, revenueRes, partnersRes, systemRes, kpisRes] = await Promise.all([
        fetch('/api/super-admin/analytics'),
        fetch('/api/super-admin/subscription-plans'),
        fetch('/api/super-admin/partners'),
        fetch('/api/system/monitor'),
        fetch('/api/super-admin/system-status')
      ])

      const data = {
        totalUsers: 0,
        totalRevenue: 0,
        totalPartners: 0,
        systemHealth: 'Healthy',
        activeConsultations: 0,
        systemUptime: '99.9%',
        monthlyGrowth: 0
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
        data.systemHealth = systemHealth.status === 'healthy' ? 'Healthy' : systemHealth.status === 'warning' ? 'Warning' : 'Critical'
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
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

      {/* Key Metrics Grid - 4 essential stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalUsers.toLocaleString()}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-600 font-medium">All roles</span>
                <span className="text-gray-500">combined</span>
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
              <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
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
              <p className="text-sm font-medium text-gray-600 mb-1">Marketplace</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalPartners}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-600 font-medium">Partners</span>
                <span className="text-gray-500">onboarded</span>
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
                <span className="text-gray-500">uptime</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid - Charts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Growth Chart */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Platform Growth Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <p className="text-blue-700 font-medium">User Growth Trends</p>
                  <p className="text-blue-600 text-sm">Platform-wide analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Distribution Chart */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-green-600" />
                Revenue Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <p className="text-green-700 font-medium">Revenue Analytics</p>
                  <p className="text-green-600 text-sm">Subscription breakdown</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section - 1/3 width */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.route}>
                  <Button variant="outline" className="w-full justify-start gap-3 h-auto p-3">
                    <div className={`p-2 rounded-lg ${action.bgColor}`}>
                      <action.icon className={`h-4 w-4 ${action.color}`} />
                    </div>
                    <span className="font-medium">{action.name}</span>
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}