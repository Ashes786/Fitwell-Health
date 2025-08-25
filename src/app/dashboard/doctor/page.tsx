'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
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
  Edit
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function DoctorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingPrescriptions: 0,
    monthlyRevenue: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    averageRating: 0,
    responseTime: 0
  })
  const [todayAppointments, setTodayAppointments] = useState([])
  const [recentPatients, setRecentPatients] = useState([])
  const [pendingPrescriptions, setPendingPrescriptions] = useState([])
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user?.role !== 'DOCTOR') {
      router.push('/dashboard')
      return
    }

    fetchDashboardData()
    
    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchDashboardData()
    }, 30000)
    
    return () => clearInterval(refreshInterval)
  }, [session, status, router])

  const fetchDashboardData = async (manualRefresh = false) => {
    try {
      if (manualRefresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }
      
      // Fetch stats data
      const statsResponse = await fetch('/api/doctor/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(prev => ({ ...prev, ...statsData }))
      }

      // Fetch today's appointments
      const appointmentsResponse = await fetch('/api/doctor/today-appointments')
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json()
        setTodayAppointments(appointmentsData)
      }

      // Fetch recent patients
      const patientsResponse = await fetch('/api/doctor/recent-patients')
      if (patientsResponse.ok) {
        const patientsData = await patientsResponse.json()
        setRecentPatients(patientsData)
      }

      // Fetch pending prescriptions
      const prescriptionsResponse = await fetch('/api/doctor/pending-prescriptions')
      if (prescriptionsResponse.ok) {
        const prescriptionsData = await prescriptionsResponse.json()
        setPendingPrescriptions(prescriptionsData)
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

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
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
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 relative overflow-hidden">
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Welcome back, Dr. {session.user?.name}!</h1>
            <p className="text-white/90">Doctor Dashboard - Manage your practice</p>
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
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">Scheduled</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Prescriptions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingPrescriptions}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-600">Action needed</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Pill className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+18.7%</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/doctor/appointments')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Appointments</h3>
                <p className="text-sm text-gray-500">View all appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/doctor/patients')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">My Patients</h3>
                <p className="text-sm text-gray-500">{stats.totalPatients} patients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/doctor/prescriptions')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Pill className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Prescriptions</h3>
                <p className="text-sm text-gray-500">Manage prescriptions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/doctor/schedule')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 rounded-full">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Schedule</h3>
                <p className="text-sm text-gray-500">Manage availability</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments & Recent Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Today's Appointments</span>
            </CardTitle>
            <CardDescription>Your scheduled appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={appointment.patientAvatar} />
                      <AvatarFallback>{appointment.patientName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{appointment.patientName}</p>
                      <p className="text-xs text-gray-500">{appointment.time} - {appointment.type}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getAppointmentStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      {appointment.priority && (
                        <Badge className={getPriorityColor(appointment.priority)}>
                          {appointment.priority}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No appointments scheduled for today</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Recent Patients</span>
            </CardTitle>
            <CardDescription>Your most recent patient interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.length > 0 ? (
                recentPatients.map((patient, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={patient.avatar} />
                      <AvatarFallback>{patient.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                      <p className="text-xs text-gray-500">Last visit: {patient.lastVisit}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent patients</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Prescriptions */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Pill className="h-5 w-5" />
            <span>Pending Prescriptions</span>
          </CardTitle>
          <CardDescription>Prescriptions requiring your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingPrescriptions.length > 0 ? (
              pendingPrescriptions.map((prescription, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-full">
                    <Pill className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{prescription.patientName}</p>
                    <p className="text-xs text-gray-500">{prescription.medication} - {prescription.dosage}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(prescription.priority)}>
                      {prescription.priority}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No pending prescriptions</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}