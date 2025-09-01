'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCustomSession } from '@/hooks/use-custom-session'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  HeartPulse, 
  Users, 
  Stethoscope, 
  Shield, 
  Activity,
  Calendar,
  FileText,
  Database,
  Settings,
  Bell,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Building,
  RefreshCw,
  Clock,
  DollarSign,
  Video,
  MessageSquare,
  Pill,
  FlaskConical,
  ShoppingCart,
  CreditCard,
  Phone,
  Truck,
  Wrench,
  Monitor,
  User,
  LogOut,
  Menu,
  X,
  HelpCircle,
  ChartBar,
  LayoutDashboard,
  Server,
  Lock,
  Users2,
  Clipboard,
  Package,
  CheckCircle,
  Plus,
  Star,
  Zap,
  Target,
  Award,
  Gift,
  BookOpen,
  VideoCamera,
  Stethoscope as StethoscopeIcon,
  UserCircle,
  CalendarDays,
  ClipboardList,
  Heart,
  Pulse,
  Activity as ActivityIcon
} from 'lucide-react'
import { toast } from 'sonner'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Link from 'next/link'

interface DashboardStats {
  totalPatients?: number
  totalAppointments?: number
  totalDoctors?: number
  pendingRequests?: number
  revenue?: number
  upcomingAppointments?: number
  alertCount?: number
  bedOccupancy?: number
  activeStaff?: number
  systemHealth?: string
  completedAppointments?: number
  cancellationRate?: number
  patientSatisfaction?: number
  monthlyRevenue?: number
  weeklyAppointments?: number
  availableBeds?: number
  emergencyCases?: number
}

interface QuickAction {
  name: string
  description: string
  icon: any
  color: string
  bgColor: string
  hoverColor: string
  route: string
}

interface ChartData {
  name: string
  value: number
  color?: string
}

interface AppointmentData {
  date: string
  appointments: number
}

interface RevenueData {
  month: string
  revenue: number
}

export default function Dashboard() {
  const { user, loading } = useCustomSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({})
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      loadDashboardData()
    }
  }, [user, loading])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Enhanced mock data with more realistic statistics
      const mockStats: Record<string, DashboardStats> = {
        'SUPER_ADMIN': {
          totalPatients: 1250,
          totalDoctors: 45,
          pendingRequests: 12,
          revenue: 450000,
          systemHealth: 'Healthy',
          activeStaff: 156,
          monthlyRevenue: 450000,
          weeklyAppointments: 320,
          patientSatisfaction: 94
        },
        'ADMIN': {
          totalPatients: 850,
          totalDoctors: 25,
          pendingRequests: 8,
          revenue: 280000,
          systemHealth: 'Healthy',
          activeStaff: 89,
          monthlyRevenue: 280000,
          weeklyAppointments: 210,
          patientSatisfaction: 92
        },
        'DOCTOR': {
          totalPatients: 45,
          upcomingAppointments: 8,
          totalAppointments: 120,
          revenue: 15000,
          systemHealth: 'Healthy',
          completedAppointments: 112,
          cancellationRate: 6.7,
          patientSatisfaction: 96,
          weeklyAppointments: 28
        },
        'PATIENT': {
          upcomingAppointments: 2,
          totalAppointments: 15,
          systemHealth: 'Healthy',
          completedAppointments: 13,
          patientSatisfaction: 98
        },
        'ATTENDANT': {
          totalPatients: 120,
          pendingRequests: 5,
          systemHealth: 'Healthy',
          weeklyAppointments: 85,
          availableBeds: 24,
          emergencyCases: 3
        },
        'CONTROL_ROOM': {
          totalPatients: 350,
          totalDoctors: 15,
          alertCount: 3,
          bedOccupancy: 85,
          systemHealth: 'Warning',
          availableBeds: 52,
          emergencyCases: 7,
          activeStaff: 28
        }
      }

      setStats(mockStats[user?.role] || {})
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const getQuickActions = (): QuickAction[] => {
    const actions: Record<string, QuickAction[]> = {
      'SUPER_ADMIN': [
        { 
          name: 'Manage Admins', 
          description: 'Add, edit, or remove admin users', 
          icon: Users, 
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          hoverColor: 'hover:bg-blue-100',
          route: '/dashboard/admins'
        },
        { 
          name: 'System Analytics', 
          description: 'View comprehensive analytics', 
          icon: ChartBar, 
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          hoverColor: 'hover:bg-purple-100',
          route: '/dashboard/analytics'
        },
        { 
          name: 'Security Settings', 
          description: 'Configure security protocols', 
          icon: Shield, 
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          hoverColor: 'hover:bg-green-100',
          route: '/dashboard/security'
        },
        { 
          name: 'System Health', 
          description: 'Monitor system performance', 
          icon: ActivityIcon, 
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          hoverColor: 'hover:bg-orange-100',
          route: '/dashboard/system-status'
        }
      ],
      'ADMIN': [
        { 
          name: 'Patient Management', 
          description: 'Manage patient records', 
          icon: UserCircle, 
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          hoverColor: 'hover:bg-blue-100',
          route: '/dashboard/patients'
        },
        { 
          name: 'Staff Scheduling', 
          description: 'Manage staff schedules', 
          icon: CalendarDays, 
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          hoverColor: 'hover:bg-purple-100',
          route: '/dashboard/organizations'
        },
        { 
          name: 'Revenue Reports', 
          description: 'View financial reports', 
          icon: DollarSign, 
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          hoverColor: 'hover:bg-green-100',
          route: '/dashboard/analytics'
        },
        { 
          name: 'Resource Planning', 
          description: 'Plan hospital resources', 
          icon: Building, 
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          hoverColor: 'hover:bg-orange-100',
          route: '/dashboard/control-room'
        }
      ],
      'DOCTOR': [
        { 
          name: 'Patient Appointments', 
          description: 'Manage your appointments', 
          icon: Calendar, 
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          hoverColor: 'hover:bg-blue-100',
          route: '/dashboard/appointments'
        },
        { 
          name: 'Patient Records', 
          description: 'Access patient records', 
          icon: FileText, 
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          hoverColor: 'hover:bg-purple-100',
          route: '/dashboard/patients'
        },
        { 
          name: 'Prescriptions', 
          description: 'Manage prescriptions', 
          icon: Pill, 
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          hoverColor: 'hover:bg-green-100',
          route: '/dashboard/prescriptions'
        },
        { 
          name: 'Telemedicine', 
          description: 'Start video consultation', 
          icon: VideoCamera, 
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          hoverColor: 'hover:bg-orange-100',
          route: '/dashboard/consultation'
        }
      ],
      'PATIENT': [
        { 
          name: 'Book Appointment', 
          description: 'Schedule new appointment', 
          icon: Calendar, 
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          hoverColor: 'hover:bg-blue-100',
          route: '/dashboard/book-appointment'
        },
        { 
          name: 'Health Records', 
          description: 'View your health records', 
          icon: FileText, 
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          hoverColor: 'hover:bg-purple-100',
          route: '/dashboard/health-records'
        },
        { 
          name: 'Health Vitals', 
          description: 'Track your health metrics', 
          icon: Heart, 
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          hoverColor: 'hover:bg-green-100',
          route: '/dashboard/vitals'
        },
        { 
          name: 'Medications', 
          description: 'Manage your medications', 
          icon: Pill, 
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          hoverColor: 'hover:bg-orange-100',
          route: '/dashboard/prescriptions'
        }
      ],
      'ATTENDANT': [
        { 
          name: 'Patient Registration', 
          description: 'Register new patients', 
          icon: UserCheck, 
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          hoverColor: 'hover:bg-blue-100',
          route: '/dashboard/register-patient'
        },
        { 
          name: 'Appointment Scheduling', 
          description: 'Schedule appointments', 
          icon: Calendar, 
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          hoverColor: 'hover:bg-purple-100',
          route: '/dashboard/appointments'
        },
        { 
          name: 'Patient Care', 
          description: 'Coordinate patient care', 
          icon: HeartPulse, 
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          hoverColor: 'hover:bg-green-100',
          route: '/dashboard/patients'
        },
        { 
          name: 'Documentation', 
          description: 'Manage patient documents', 
          icon: ClipboardList, 
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          hoverColor: 'hover:bg-orange-100',
          route: '/dashboard/reports'
        }
      ],
      'CONTROL_ROOM': [
        { 
          name: 'Emergency Alerts', 
          description: 'Monitor emergency cases', 
          icon: AlertTriangle, 
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          hoverColor: 'hover:bg-red-100',
          route: '/dashboard/emergency-alerts'
        },
        { 
          name: 'Bed Management', 
          description: 'Manage bed occupancy', 
          icon: Building, 
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          hoverColor: 'hover:bg-blue-100',
          route: '/dashboard/bed-management'
        },
        { 
          name: 'Staff Coordination', 
          description: 'Coordinate medical staff', 
          icon: Users2, 
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          hoverColor: 'hover:bg-purple-100',
          route: '/dashboard/staff-coordination'
        },
        { 
          name: 'Equipment Status', 
          description: 'Monitor equipment', 
          icon: Wrench, 
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          hoverColor: 'hover:bg-orange-100',
          route: '/dashboard/equipment-status'
        }
      ]
    }

    return actions[user?.role] || []
  }

  const getStatsCards = () => {
    const cards: Record<string, Array<{title: string, value: string, change: string, icon: any, color: string, trend: 'up' | 'down' | 'neutral'}>> = {
      'SUPER_ADMIN': [
        { title: 'Total Patients', value: stats.totalPatients?.toLocaleString() || '0', change: '+12%', icon: Users, color: 'text-blue-600', trend: 'up' },
        { title: 'Total Doctors', value: stats.totalDoctors?.toLocaleString() || '0', change: '+3', icon: StethoscopeIcon, color: 'text-green-600', trend: 'up' },
        { title: 'Monthly Revenue', value: `$${(stats.revenue || 0).toLocaleString()}`, change: '+18%', icon: DollarSign, color: 'text-purple-600', trend: 'up' },
        { title: 'System Health', value: stats.systemHealth || 'Unknown', change: 'Optimal', icon: ActivityIcon, color: 'text-emerald-600', trend: 'neutral' }
      ],
      'ADMIN': [
        { title: 'Total Patients', value: stats.totalPatients?.toLocaleString() || '0', change: '+8%', icon: Users, color: 'text-blue-600', trend: 'up' },
        { title: 'Active Staff', value: stats.activeStaff?.toLocaleString() || '0', change: '+2', icon: Users2, color: 'text-green-600', trend: 'up' },
        { title: 'Monthly Revenue', value: `$${(stats.revenue || 0).toLocaleString()}`, change: '+15%', icon: DollarSign, color: 'text-purple-600', trend: 'up' },
        { title: 'Pending Requests', value: stats.pendingRequests?.toLocaleString() || '0', change: '-2', icon: AlertTriangle, color: 'text-orange-600', trend: 'down' }
      ],
      'DOCTOR': [
        { title: 'Total Patients', value: stats.totalPatients?.toLocaleString() || '0', change: '+5', icon: Users, color: 'text-blue-600', trend: 'up' },
        { title: 'Appointments', value: stats.totalAppointments?.toLocaleString() || '0', change: '+12%', icon: Calendar, color: 'text-green-600', trend: 'up' },
        { title: 'Completed', value: stats.completedAppointments?.toLocaleString() || '0', change: '94%', icon: CheckCircle, color: 'text-emerald-600', trend: 'up' },
        { title: 'Satisfaction', value: `${stats.patientSatisfaction || 0}%`, change: '+2%', icon: Star, color: 'text-purple-600', trend: 'up' }
      ],
      'PATIENT': [
        { title: 'Upcoming', value: stats.upcomingAppointments?.toLocaleString() || '0', change: 'Scheduled', icon: Calendar, color: 'text-blue-600', trend: 'neutral' },
        { title: 'Completed', value: stats.completedAppointments?.toLocaleString() || '0', change: 'Healthy', icon: CheckCircle, color: 'text-green-600', trend: 'up' },
        { title: 'Satisfaction', value: `${stats.patientSatisfaction || 0}%`, change: 'Excellent', icon: Star, color: 'text-purple-600', trend: 'up' },
        { title: 'Health Score', value: '85%', change: 'Good', icon: Heart, color: 'text-emerald-600', trend: 'neutral' }
      ],
      'ATTENDANT': [
        { title: 'Total Patients', value: stats.totalPatients?.toLocaleString() || '0', change: '+15', icon: Users, color: 'text-blue-600', trend: 'up' },
        { title: 'Weekly Appointments', value: stats.weeklyAppointments?.toLocaleString() || '0', change: '+8%', icon: Calendar, color: 'text-green-600', trend: 'up' },
        { title: 'Available Beds', value: stats.availableBeds?.toLocaleString() || '0', change: 'Ready', icon: Building, color: 'text-purple-600', trend: 'neutral' },
        { title: 'Emergency Cases', value: stats.emergencyCases?.toLocaleString() || '0', change: 'Active', icon: AlertTriangle, color: 'text-orange-600', trend: 'neutral' }
      ],
      'CONTROL_ROOM': [
        { title: 'Total Patients', value: stats.totalPatients?.toLocaleString() || '0', change: 'Admitted', icon: Users, color: 'text-blue-600', trend: 'neutral' },
        { title: 'Bed Occupancy', value: `${stats.bedOccupancy}%`, change: 'Monitoring', icon: Building, color: 'text-orange-600', trend: 'up' },
        { title: 'Available Beds', value: stats.availableBeds?.toLocaleString() || '0', change: 'Available', icon: Building, color: 'text-green-600', trend: 'neutral' },
        { title: 'Emergency Cases', value: stats.emergencyCases?.toLocaleString() || '0', change: 'Critical', icon: AlertTriangle, color: 'text-red-600', trend: 'up' }
      ]
    }

    return cards[user?.role] || []
  }

  const getAppointmentChartData = (): AppointmentData[] => {
    const data: Record<string, AppointmentData[]> = {
      'SUPER_ADMIN': [
        { date: 'Mon', appointments: 45 },
        { date: 'Tue', appointments: 52 },
        { date: 'Wed', appointments: 48 },
        { date: 'Thu', appointments: 58 },
        { date: 'Fri', appointments: 65 },
        { date: 'Sat', appointments: 35 },
        { date: 'Sun', appointments: 28 }
      ],
      'ADMIN': [
        { date: 'Mon', appointments: 32 },
        { date: 'Tue', appointments: 38 },
        { date: 'Wed', appointments: 35 },
        { date: 'Thu', appointments: 42 },
        { date: 'Fri', appointments: 48 },
        { date: 'Sat', appointments: 25 },
        { date: 'Sun', appointments: 20 }
      ],
      'DOCTOR': [
        { date: 'Mon', appointments: 8 },
        { date: 'Tue', appointments: 12 },
        { date: 'Wed', appointments: 10 },
        { date: 'Thu', appointments: 14 },
        { date: 'Fri', appointments: 16 },
        { date: 'Sat', appointments: 6 },
        { date: 'Sun', appointments: 4 }
      ],
      'PATIENT': [
        { date: 'Mon', appointments: 1 },
        { date: 'Tue', appointments: 2 },
        { date: 'Wed', appointments: 0 },
        { date: 'Thu', appointments: 1 },
        { date: 'Fri', appointments: 2 },
        { date: 'Sat', appointments: 0 },
        { date: 'Sun', appointments: 0 }
      ],
      'ATTENDANT': [
        { date: 'Mon', appointments: 15 },
        { date: 'Tue', appointments: 18 },
        { date: 'Wed', appointments: 16 },
        { date: 'Thu', appointments: 20 },
        { date: 'Fri', appointments: 22 },
        { date: 'Sat', appointments: 12 },
        { date: 'Sun', appointments: 8 }
      ],
      'CONTROL_ROOM': [
        { date: 'Mon', appointments: 25 },
        { date: 'Tue', appointments: 30 },
        { date: 'Wed', appointments: 28 },
        { date: 'Thu', appointments: 35 },
        { date: 'Fri', appointments: 40 },
        { date: 'Sat', appointments: 20 },
        { date: 'Sun', dates: 15 }
      ]
    }

    return data[user?.role] || []
  }

  const getRevenueChartData = (): RevenueData[] => {
    return [
      { month: 'Jan', revenue: 40000 },
      { month: 'Feb', revenue: 42000 },
      { month: 'Mar', revenue: 45000 },
      { month: 'Apr', revenue: 48000 },
      { month: 'May', revenue: 52000 },
      { month: 'Jun', revenue: 55000 }
    ]
  }

  const getRoleDashboardContent = () => {
    if (!user) return null

    const statsCards = getStatsCards()
    const quickActions = getQuickActions()
    const appointmentData = getAppointmentChartData()
    const revenueData = getRevenueChartData()

    return (
      <div className="space-y-4">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.name?.split(' ')[0] || user.email}!
              </h1>
              <p className="text-blue-100 text-base">
                {user.role?.replace('_', ' ')} Dashboard • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <Badge className="bg-white/20 text-white border-white/30">
                  {stats.systemHealth && (
                    <span className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${stats.systemHealth === 'Healthy' ? 'bg-green-400' : stats.systemHealth === 'Warning' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                      System: {stats.systemHealth}
                    </span>
                  )}
                </Badge>
                <span className="text-blue-100 text-sm">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => {
                  setIsRefreshing(true)
                  loadDashboardData()
                  setTimeout(() => setIsRefreshing(false), 1000)
                }}
                disabled={isRefreshing}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              >
                {isRefreshing ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <HeartPulse className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon
            const TrendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : ActivityIcon
            const trendColor = stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
            
            return (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl ${stat.color.replace('text-', 'bg-').replace('600', '100')} bg-opacity-50`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendIcon className={`h-3 w-3 ${trendColor}`} />
                      <span className={`text-xs font-medium ${trendColor}`}>{stat.change}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-medium mb-1">{stat.title}</p>
                    <p className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-0 shadow-lg h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span>Quick Actions</span>
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  Most frequently used features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-xl border-2 border-transparent ${action.bgColor} ${action.hoverColor} cursor-pointer transition-all duration-300 group hover:shadow-md`}
                      onClick={() => {
                        router.push(action.route)
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`h-5 w-5 ${action.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors text-sm">
                            {action.name}
                          </p>
                          <p className="text-xs text-gray-600 group-hover:text-gray-500 transition-colors">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* System Status Card */}
            <Card className="bg-white border-0 shadow-lg mt-4 h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <ActivityIcon className="h-4 w-4 text-orange-600" />
                  <span>System Status</span>
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  Current system overview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-900">Database</span>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-900">API Services</span>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Operational</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-900">Security</span>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">Secured</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="lg:col-span-2 space-y-4">
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Appointments Chart */}
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-gray-900 flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>Weekly Appointments</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Appointment trends over the past week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={appointmentData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="appointments" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Chart */}
              {(user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'DOCTOR') && (
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold text-gray-900 flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>Revenue Trend</span>
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm">
                      Monthly revenue performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="month" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              borderRadius: '12px',
                              border: '1px solid #e5e7eb',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Bar 
                            dataKey="revenue" 
                            fill="#10b981" 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Additional Chart or Content */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <span>Activity Overview</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Recent system activity and user engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {stats.totalPatients || stats.weeklyAppointments || '24'}
                    </div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {stats.patientSatisfaction || '96'}%
                    </div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {stats.completedAppointments || '18'}
                    </div>
                    <div className="text-sm text-gray-600">Today's Tasks</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to access the dashboard.</p>
          <Button 
            className="mt-4" 
            onClick={() => router.push('/auth/signin')}
          >
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout 
      userRole={user.role} 
      userName={user.name || user.email} 
      userImage={user.avatar}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        getRoleDashboardContent()
      )}
    </DashboardLayout>
  )
}