'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCustomSession } from '@/hooks/use-custom-session'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Server, 
  Database, 
  Lock,
  Shield,
  Bell,
  User,
  LogOut,
  ChartBar,
  Activity,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  Stethoscope,
  UserCheck,
  Clipboard,
  Monitor,
  Users2,
  Building,
  HeartPulse,
  FileText,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Video,
  Phone,
  Mail,
  Pill,
  FlaskConical,
  Eye,
  Edit,
  CreditCard,
  Heart,
  Thermometer,
  Droplets,
  Activity as ActivityIcon,
  Scale,
  Bone
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function PatientDashboard() {
  const { user, loading } = useCustomSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [healthStats, setHealthStats] = useState({
    upcomingAppointments: 0,
    activePrescriptions: 0,
    pendingLabTests: 0,
    healthScore: 0,
    lastCheckup: '',
    nextAppointment: '',
    subscriptionStatus: 'active',
    unreadMessages: 0
  })
  const [vitals, setVitals] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [recentLabTests, setRecentLabTests] = useState([])
  const [healthRecommendations, setHealthRecommendations] = useState([])
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    console.log('Patient dashboard - User:', user, 'Loading:', loading)
    
    if (loading) return
    
    if (!user) {
      console.log('No user found, redirecting to signin')
      router.push('/auth/signin')
      return
    }

    // Redirect to unified dashboard - it handles role-specific content
    console.log('Redirecting to unified dashboard')
    router.push('/dashboard')
    return
  }, [user, loading, router])

  const fetchDashboardData = async (manualRefresh = false) => {
    try {
      if (manualRefresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }
      
      // Fetch health stats
      const statsResponse = await fetch('/api/patient/health-stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setHealthStats(prev => ({ ...prev, ...statsData }))
      }

      // Fetch vitals
      const vitalsResponse = await fetch('/api/patient/vitals')
      if (vitalsResponse.ok) {
        const vitalsData = await vitalsResponse.json()
        setVitals(vitalsData)
      }

      // Fetch upcoming appointments
      const appointmentsResponse = await fetch('/api/patient/upcoming-appointments')
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json()
        setUpcomingAppointments(appointmentsData)
      }

      // Fetch recent lab tests
      const labTestsResponse = await fetch('/api/patient/recent-lab-tests')
      if (labTestsResponse.ok) {
        const labTestsData = await labTestsResponse.json()
        setRecentLabTests(labTestsData)
      }

      // Fetch health recommendations
      const recommendationsResponse = await fetch('/api/patient/recommendations')
      if (recommendationsResponse.ok) {
        const recommendationsData = await recommendationsResponse.json()
        setHealthRecommendations(recommendationsData)
      }
      
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const getVitalStatus = (vital: any) => {
    const { value, normalRange } = vital
    const [min, max] = normalRange.split('-').map(Number)
    
    if (value >= min && value <= max) {
      return { color: 'text-green-600', bg: 'bg-green-100', text: 'Normal' }
    } else if (value < min) {
      return { color: 'text-blue-600', bg: 'bg-blue-100', text: 'Low' }
    } else {
      return { color: 'text-red-600', bg: 'bg-red-100', text: 'High' }
    }
  }

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-100 text-blue-800'
      case 'in-person': return 'bg-green-100 text-green-800'
      case 'phone': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLabTestStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'blood_pressure': return <Heart className="h-5 w-5" />
      case 'heart_rate': return <ActivityIcon className="h-5 w-5" />
      case 'temperature': return <Thermometer className="h-5 w-5" />
      case 'weight': return <Scale className="h-5 w-5" />
      case 'oxygen_saturation': return <Droplets className="h-5 w-5" />
      default: return <Monitor className="h-5 w-5" />
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 relative overflow-hidden">
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Welcome back, {user?.name}!</h1>
            <p className="text-white/90">Patient Dashboard - Your health journey</p>
            <p className="text-white/70 text-sm mt-1">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => fetchDashboardData(true)}
              disabled={isRefreshing}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Refresh</span>
            </Button>
            <div className="p-3 bg-white/20 rounded-full">
              <HeartPulse className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Health Score Card */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Health Score</p>
              <p className="text-3xl font-bold text-gray-900">{healthStats.healthScore}/100</p>
              <p className="text-sm text-gray-500 mt-1">Overall wellness rating</p>
            </div>
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-8 border-gray-200"></div>
              <div 
                className="absolute top-0 left-0 w-20 h-20 rounded-full border-8 border-green-500 border-t-transparent border-r-transparent transform rotate-45"
                style={{ transform: `rotate(${45 + (healthStats.healthScore * 3.6)}deg)` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-green-600">{healthStats.healthScore}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{healthStats.upcomingAppointments}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">Scheduled</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Prescriptions</p>
                <p className="text-2xl font-bold text-gray-900">{healthStats.activePrescriptions}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Pill className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-purple-600">Current</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Pill className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Lab Tests</p>
                <p className="text-2xl font-bold text-gray-900">{healthStats.pendingLabTests}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <FlaskConical className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-600">Action needed</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FlaskConical className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Subscription</p>
                <p className="text-2xl font-bold text-gray-900">{healthStats.subscriptionStatus}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/patient/book-appointment')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Book Appointment</h3>
                <p className="text-sm text-gray-500">Schedule new visit</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/patient/appointments')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">My Appointments</h3>
                <p className="text-sm text-gray-500">View all appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/patient/health-records')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Health Records</h3>
                <p className="text-sm text-gray-500">Medical history</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/patient/vitals')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 rounded-full">
                <Heart className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Vitals</h3>
                <p className="text-sm text-gray-500">Track health metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vitals & Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Latest Vitals</span>
            </CardTitle>
            <CardDescription>Your most recent health measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vitals.length > 0 ? (
                vitals.map((vital, index) => {
                  const status = getVitalStatus(vital)
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-white rounded-full">
                        {getVitalIcon(vital.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{vital.name}</p>
                        <p className="text-xs text-gray-500">{vital.value} {vital.unit}</p>
                      </div>
                      <Badge className={`${status.bg} ${status.color}`}>
                        {status.text}
                      </Badge>
                    </div>
                  )
                })
              ) : (
                <p className="text-gray-500 text-center py-4">No vitals recorded</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Appointments</span>
            </CardTitle>
            <CardDescription>Your scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={appointment.doctorAvatar} />
                      <AvatarFallback>{appointment.doctorName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Dr. {appointment.doctorName}</p>
                      <p className="text-xs text-gray-500">{appointment.date} at {appointment.time}</p>
                    </div>
                    <Badge className={getAppointmentTypeColor(appointment.type)}>
                      {appointment.type}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Lab Tests & Health Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FlaskConical className="h-5 w-5" />
              <span>Recent Lab Tests</span>
            </CardTitle>
            <CardDescription>Your latest laboratory results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLabTests.length > 0 ? (
                recentLabTests.map((test, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-white rounded-full">
                      <FlaskConical className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{test.name}</p>
                      <p className="text-xs text-gray-500">{test.date}</p>
                    </div>
                    <Badge className={getLabTestStatusColor(test.status)}>
                      {test.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent lab tests</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ActivityIcon className="h-5 w-5" />
              <span>Health Recommendations</span>
            </CardTitle>
            <CardDescription>Personalized health tips for you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthRecommendations.length > 0 ? (
                healthRecommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-white rounded-full mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{recommendation.title}</p>
                      <p className="text-xs text-gray-500">{recommendation.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recommendations at this time</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}