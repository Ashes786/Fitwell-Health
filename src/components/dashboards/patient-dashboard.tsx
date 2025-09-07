'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { 
  Heart, 
  Calendar,  
  FileText, 
  Bell, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Stethoscope,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  CreditCard,
  FlaskConical,
  Star,
  Phone,
  Video,
  ShoppingCart,
  User,
  MapPin,
  Mail,
  PhoneCall,
  Zap,
  Target,
  Award,
  Timer,
  ChevronRight,
  Shield,
  Thermometer,
  Droplets,
  Ambulance,
  HeartPulse,
  Scale,
  Bone,
  Eye,
  Brain,
  Dumbbell,
  Apple,
  Moon,
  Sun,
  Wifi,
  Monitor,
  MessageCircle,
  Map,
  Car,
  Building2,
  Users,
  HeartHandshake,
  ShieldCheck,
  ScanLine,
  Microscope,
  TestTube,
  Bandage,
  Pill,
  Hospital,
  ClipboardList,
  CalendarDays,
  BarChart3,
  PieChart,
  Wind
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface PatientDashboardProps {
  userName: string
  userImage?: string
  userEmail?: string
  userPhone?: string
}

interface Appointment {
  id: string
  type: 'GP' | 'Specialist' | 'Emergency' | 'Follow-up'
  doctor: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  duration: string
  location?: string
  isTelehealth?: boolean
}

interface Vital {
  type: string
  value: string
  unit: string
  trend: 'up' | 'down' | 'normal'
  date: string
  icon: any
  category: 'cardiovascular' | 'metabolic' | 'vital' | 'other'
}

interface Prescription {
  id: string
  name: string
  dosage: string
  frequency: string
  refills: number
  status: 'active' | 'completed' | 'expired'
  adherence: number
  nextDose?: string
  instructions?: string
}

interface HealthRecord {
  id: string
  type: string
  date: string
  doctor: string
  status: 'completed' | 'pending' | 'reviewed'
  results?: string
  category: 'lab' | 'imaging' | 'consultation' | 'procedure'
}

interface Notification {
  id: string
  type: 'pill' | 'hydration' | 'lab' | 'appointment' | 'exercise' | 'nutrition'
  message: string
  time: string
  priority: 'high' | 'medium' | 'low'
  actionRequired?: boolean
}

interface HealthMetric {
  name: string
  value: number
  target: number
  unit: string
  trend: 'improving' | 'stable' | 'declining'
  icon: any
  color: string
}

interface ActivityData {
  date: string
  steps: number
  exercise: number
  sleep: number
  calories: number
}

interface HealthStats {
  score: number
  message: string
  recommendations: string[]
  riskFactors: string[]
  strengths: string[]
}

export function PatientDashboard({ userName, userImage, userEmail, userPhone }: PatientDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [selectedTimeRange, setSelectedTimeRange] = useState('week')
  const [selectedVitalType, setSelectedVitalType] = useState('')

  // Dynamic state for all data
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [vitals, setVitals] = useState<Vital[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([])
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [healthStats, setHealthStats] = useState<HealthStats | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Auto-refresh functionality
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadDashboardData()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(intervalId) // Cleanup on component unmount
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Fetch data from multiple API endpoints in parallel
      const [
        appointmentsRes, 
        vitalsRes, 
        healthStatsRes, 
        upcomingAppointmentsRes,
        recommendationsRes,
        labTestsRes,
        aiReportsRes
      ] = await Promise.all([
        fetch('/api/patient/appointments'),
        fetch('/api/patient/vitals'),
        fetch('/api/patient/health-stats'),
        fetch('/api/patient/upcoming-appointments'),
        fetch('/api/patient/recommendations'),
        fetch('/api/patient/recent-lab-tests'),
        fetch('/api/patient/ai-reports')
      ])

      // Process appointments data
      if (appointmentsRes.ok) {
        const appointmentsData = await appointmentsRes.json()
        setAppointments(appointmentsData.appointments || [])
      }

      // Process vitals data
      if (vitalsRes.ok) {
        const vitalsData = await vitalsRes.json()
        setVitals(vitalsData.vitals || [])
      }

      // Process health stats data
      if (healthStatsRes.ok) {
        const healthStatsData = await healthStatsRes.json()
        console.log('Health Stats Data:', healthStatsData) // Debug log
        
        // Use the actual API data without any mock values
        const transformedHealthStats = {
          ...healthStatsData,
          message: 'Your health is being monitored closely',
          trend: 'Stable',
          ranking: 'Active Patient',
          status: 'Health Monitoring',
          patientId: patient?.nhrNumber || 'N/A'
        }
        
        setHealthStats(transformedHealthStats)
      } else {
        console.log('Health Stats Response not OK:', healthStatsRes.status, healthStatsRes.statusText) // Debug log
        
        // Set minimal health stats if API fails - no mock scores
        setHealthStats({
          totalAppointments: 0,
          activePrescriptions: 0,
          recentLabTests: 0,
          latestVitals: [],
          upcomingAppointments: 0,
          completedAppointments: 0,
          message: 'Health data unavailable',
          trend: 'Unknown',
          ranking: 'Unknown',
          status: 'Data Error',
          patientId: 'N/A'
        })
      }

      // Process upcoming appointments
      if (upcomingAppointmentsRes.ok) {
        const upcomingData = await upcomingAppointmentsRes.json()
        if (upcomingData.appointments && upcomingData.appointments.length > 0) {
          setAppointments(prev => [...prev, ...upcomingData.appointments])
        }
      }

      // Process recommendations
      if (recommendationsRes.ok) {
        const recommendationsData = await recommendationsRes.json()
        // Use recommendations to generate notifications
        const recommendationNotifications = (recommendationsData.recommendations || []).slice(0, 2).map((rec: any, index: number) => ({
          id: `rec-${index}`,
          type: 'exercise' as const,
          message: rec,
          time: 'Now',
          priority: 'medium' as const,
          actionRequired: true
        }))
        
        setNotifications(prev => [...recommendationNotifications, ...prev.slice(0, 2)])
      }

      // Process lab tests
      if (labTestsRes.ok) {
        const labTestsData = await labTestsRes.json()
        const labRecords = (labTestsData.labTests || []).map((test: any) => ({
          id: test.id,
          type: test.name,
          date: test.date,
          doctor: test.doctor || 'Lab Corp',
          status: test.status,
          results: test.results,
          category: 'lab' as const
        }))
        setHealthRecords(prev => [...labRecords, ...prev.slice(0, 1)])
      }

      // Process AI reports
      if (aiReportsRes.ok) {
        const aiReportsData = await aiReportsRes.json()
        if (aiReportsData.insights) {
          // Update health stats with AI insights
          setHealthStats(prev => prev ? {
            ...prev,
            message: aiReportsData.insights.message || prev.message,
            recommendations: aiReportsData.insights.recommendations || prev.recommendations,
            riskFactors: aiReportsData.insights.riskFactors || prev.riskFactors,
            strengths: aiReportsData.insights.strengths || prev.strengths
          } : null)
        }
      }

      // Generate dynamic prescriptions based on health data
      const dynamicPrescriptions = healthStats?.medications?.map((med: any, index: number) => ({
        id: med.id || `med-${index}`,
        name: med.name || 'Medication',
        dosage: med.dosage || 'N/A',
        frequency: med.frequency || 'N/A',
        refills: med.refills || 0,
        status: med.status || 'active',
        adherence: med.adherence || 0,
        nextDose: med.nextDose || 'N/A',
        instructions: med.instructions || ''
      })) || []
      setPrescriptions(dynamicPrescriptions)

      // Generate dynamic health metrics based on health stats
      const dynamicHealthMetrics = healthStats?.metrics?.map((metric: any) => ({
        name: metric.name || 'Metric',
        value: metric.value || 0,
        target: metric.target || 0,
        unit: metric.unit || '',
        trend: metric.trend || 'stable',
        icon: metric.icon || Activity,
        color: metric.color || 'gray'
      })) || []
      setHealthMetrics(dynamicHealthMetrics)

      // Generate activity data based on health stats
      const dynamicActivityData = healthStats?.activity?.history?.map((day: any) => ({
        date: day.date || new Date().toISOString().split('T')[0],
        steps: day.steps || 0,
        exercise: day.exercise || 0,
        sleep: day.sleep || 0,
        calories: day.calories || 0
      })) || []
      setActivityData(dynamicActivityData)

      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  // Function to transform vitals data for chart
  const getVitalChartData = () => {
    if (!selectedVitalType || vitals.length === 0) return []
    
    const filteredVitals = vitals
      .filter(vital => vital.type === selectedVitalType)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7) // Show last 7 readings
    
    return filteredVitals.map((vital, index) => ({
      label: new Date(vital.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      value: parseFloat(vital.value) || 0
    }))
  }

  // Set default selected vital type when vitals are loaded
  useEffect(() => {
    if (vitals.length > 0 && !selectedVitalType) {
      const vitalTypes = Array.from(new Set(vitals.map(v => v.type)))
      setSelectedVitalType(vitalTypes[0] || '')
    }
  }, [vitals, selectedVitalType])

  const enhancedQuickActions = [
    { 
      name: 'Book Appointment', 
      icon: Stethoscope, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      route: '/dashboard/patient/book-appointment',
      description: 'Schedule appointment'
    },
    { 
      name: 'Book Lab Test', 
      icon: TestTube, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      route: '/dashboard/patient/lab-tests',
      description: 'Schedule lab test'
    },
    { 
      name: 'Buy Medicine', 
      icon: Pill, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      route: '/dashboard/patient/prescriptions',
      description: 'Order medications'
    },
    { 
      name: 'EMR', 
      icon: FileText, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      route: '/dashboard/patient/health-records',
      description: 'Medical records'
    }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': case 'declining': return <TrendingUp className="h-3 w-3 text-red-500" />
      case 'down': case 'improving': return <TrendingDown className="h-3 w-3 text-green-500" />
      default: return <Activity className="h-3 w-3 text-gray-500" />
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'pill': return <Pill className="h-4 w-4" />
      case 'hydration': return <Droplets className="h-4 w-4" />
      case 'lab': return <TestTube className="h-4 w-4" />
      case 'appointment': return <Calendar className="h-4 w-4" />
      case 'exercise': return <Dumbbell className="h-4 w-4" />
      case 'nutrition': return <Apple className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-600 border-red-200'
      case 'medium': return 'bg-yellow-50 text-yellow-600 border-yellow-200'
      default: return 'bg-blue-50 text-blue-600 border-blue-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': case 'completed': case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': case 'expired': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}</h1>
            <div className="flex items-center space-x-4 mt-2 text-gray-600">
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{userEmail}</span>
              </div>
              <div className="flex items-center space-x-1">
                <PhoneCall className="h-4 w-4" />
                <span className="text-sm">{userPhone}</span>
              </div>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Shield className="h-3 w-3 mr-1" />
                NHR: {healthStats?.patientId || 'N/A'}
              </Badge>
              <Badge variant="outline" className="border-green-200 text-green-700">
                <HeartPulse className="h-3 w-3 mr-1" />
                {healthStats?.status || 'Active Patient'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="gap-2">
              <CreditCard className="h-4 w-4" />
              HealthPay Card
            </Button>
            <Button className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact Doctor
            </Button>
          </div>
        </div>
      </div>

      {/* Health Score Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 text-gray-800 mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Your Health Score</h2>
                <p className="text-gray-700">{healthStats?.message || 'Your overall health is being tracked'}</p>
                <div className="flex items-center space-x-4 mt-2">
                  {healthStats?.trend && (
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{healthStats.trend}</span>
                    </div>
                  )}
                  {healthStats?.ranking && (
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-gray-700">{healthStats.ranking}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-6xl font-bold mb-2">{healthStats?.healthScore || 0}</div>
              <div className="flex items-center justify-end space-x-2 text-blue-600">
                <Heart className="h-4 w-4" />
                <span className="text-sm font-medium">Health Score</span>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {healthStats?.status || 'Calculating...'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length}</p>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-blue-600">
                    Next: {appointments.length > 0 ? appointments[0].date : 'N/A'}
                  </span>
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
                    <Pill className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Active Prescriptions</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{prescriptions.filter(p => p.status === 'active').length}</p>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    {prescriptions.length > 0 ? Math.round(prescriptions.filter(p => p.status === 'active').reduce((acc, p) => acc + p.adherence, 0) / prescriptions.filter(p => p.status === 'active').length) : 0}% Adherence
                  </span>
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
                    <Bell className="h-5 w-5 text-orange-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Action Required</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{notifications.filter(n => n.actionRequired).length}</p>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-orange-600">Reminders</span>
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
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Health Records</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{healthRecords.length}</p>
                <div className="flex items-center space-x-2">
                  <ClipboardList className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-purple-600">Recent updates</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Left Column - Appointments */}
        {appointments.length > 0 && (
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-white h-full mb-6">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Upcoming Appointments
                  </CardTitle>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Book New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-64 overflow-y-auto">
                <div className="space-y-4">
                  {appointments.slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${appointment.type === 'GP' ? 'bg-blue-50' : appointment.type === 'Specialist' ? 'bg-purple-50' : appointment.type === 'Emergency' ? 'bg-red-50' : 'bg-green-50'}`}>
                          <Stethoscope className={`h-5 w-5 ${appointment.type === 'GP' ? 'text-blue-600' : appointment.type === 'Specialist' ? 'text-purple-600' : appointment.type === 'Emergency' ? 'text-red-600' : 'text-green-600'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-medium text-gray-900">{appointment.doctor}</p>
                            <Badge variant="outline" className="text-xs">
                              {appointment.type}
                            </Badge>
                            {appointment.isTelehealth && (
                              <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                                <Video className="h-2 w-2 mr-1" />
                                Telehealth
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {appointment.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {appointment.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {appointment.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status.replace('-', ' ')}
                        </Badge>
                        <Button variant="ghost" size="sm" className="hover:bg-gray-200">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {enhancedQuickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link key={index} href={action.route}>
                      <div className={`p-3 rounded-xl border-2 border-transparent ${action.bgColor} hover:border-blue-300 cursor-pointer transition-all duration-300 hover:shadow-md h-full flex flex-col items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${action.color} mb-1`} />
                        <p className="text-xs font-medium text-gray-900 text-center">{action.name}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Health Reminders */}
          {notifications.length > 0 && (
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Health Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64 overflow-y-auto">
                <div className="space-y-3">
                  {notifications.slice(0, 4).map((notification) => (
                    <div key={notification.id} className={`p-3 rounded-lg border ${getNotificationColor(notification.priority)}`}>
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{notification.message}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.time}</p>
                          {notification.actionRequired && (
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
          )}
        </div>
      </div>

      {/* Vitals Trends Chart */}
      {vitals.length > 0 && (
        <Card className="border-0 shadow-lg bg-white mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Vitals Trends
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1">
                  Track your vital signs over time
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <select 
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white"
                  value={selectedVitalType}
                  onChange={(e) => setSelectedVitalType(e.target.value)}
                >
                  {Array.from(new Set(vitals.map(v => v.type))).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {getVitalChartData().length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getVitalChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => (
                      <div className="bg-white p-2 border border-gray-200 rounded shadow">
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-gray-600">{payload?.[0]?.value} {selectedVitalType}</p>
                      </div>
                    )}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>Need more data to display chart</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Section - Vitals & Medication */}
      {(vitals.length > 0 || prescriptions.length > 0) && (
        <div className={`grid grid-cols-1 ${(vitals.length > 0 && prescriptions.length > 0) ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-6 mb-8 relative z-10`}>
          {/* Vitals Monitoring */}
          {vitals.length > 0 && (
            <Card className="border-0 shadow-lg bg-white relative z-20">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Vitals Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {vitals.slice(0, 4).map((vital) => (
                    <div key={vital.type} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <vital.icon className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">{vital.type}</span>
                        </div>
                        {getTrendIcon(vital.trend)}
                      </div>
                      <div className="text-lg font-bold text-gray-900">{vital.value}</div>
                      <div className="text-xs text-gray-500">{vital.unit}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medication Adherence */}
          {prescriptions.length > 0 && (
            <Card className="border-0 shadow-lg bg-white relative z-20">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Medication Adherence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prescriptions.slice(0, 3).map((prescription) => (
                    <div key={prescription.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-gray-900">{prescription.name}</p>
                          <Badge variant="outline" className="text-xs">{prescription.dosage}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{prescription.frequency}</p>
                        <p className="text-xs text-gray-500 mt-1">Next dose: {prescription.nextDose}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{prescription.adherence}%</div>
                        <Progress value={prescription.adherence} className="w-16 mt-1" />
                        <div className="text-xs text-gray-500 mt-1">{prescription.refills} refills</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Health Metrics Section */}
      {healthMetrics.length > 0 && (
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Health Metrics */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Health Metrics
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
              <div className="grid grid-cols-2 gap-4">
                {healthMetrics.map((metric) => (
                  <div key={metric.name} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <metric.icon className={`h-4 w-4 text-${metric.color}-600`} />
                        <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                      </div>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="text-lg font-bold text-gray-900">{metric.value}{metric.unit}</div>
                    <div className="text-xs text-gray-500">Target: {metric.target}{metric.unit}</div>
                    <Progress value={(metric.value / metric.target) * 100} className="w-full mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

  

      {/* No Data Message */}
      {!isLoading && 
       appointments.length === 0 && 
       vitals.length === 0 && 
       prescriptions.length === 0 && 
       notifications.length === 0 && 
       healthMetrics.length === 0 && 
       !healthStats && (
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <Activity className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Health Data Available</h3>
                <p className="text-gray-600 mb-4">
                  It looks like there's no health data available for your account yet. 
                  This could be because you're a new user or your data is still being processed.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Here are some things you can do:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Book your first appointment with a healthcare provider</li>
                    <li>• Complete your health profile information</li>
                    <li>• Contact support if you believe this is an error</li>
                  </ul>
                </div>
                <div className="flex space-x-4 mt-6">
                  <Button className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Book Appointment
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500 mt-8">
        Last updated: {lastRefresh.toLocaleString()}
      </div>
    </div>
  )
}