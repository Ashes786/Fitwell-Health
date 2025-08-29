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
  UserPlus,
  UserMinus,
  CalendarCheck,
  CalendarX,
  ClipboardList,
  UserCircle,
  BadgeCheck,
  Clock3
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function AttendantDashboard() {
  const { user, loading } = useCustomSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayRegistrations: 0,
    pendingAppointments: 0,
    completedRegistrations: 0,
    activePatients: 0,
    checkInToday: 0,
    pendingVerifications: 0,
    averageProcessingTime: 0
  })
  const [recentRegistrations, setRecentRegistrations] = useState([])
  const [todayAppointments, setTodayAppointments] = useState([])
  const [pendingVerifications, setPendingVerifications] = useState([])

  useEffect(() => {
    if (loading) return
    
    if (!user) {
      router.push('/auth/signin')
      return
    }

    if (user.role !== 'ATTENDANT') {
      router.push('/dashboard')
      return
    }

    fetchDashboardData()
  }, [user, loading, router])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch stats data
      const statsResponse = await fetch('/api/attendant/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(prev => ({ ...prev, ...statsData }))
      }

      // Fetch recent registrations
      const registrationsResponse = await fetch('/api/attendant/recent-registrations')
      if (registrationsResponse.ok) {
        const registrationsData = await registrationsResponse.json()
        setRecentRegistrations(registrationsData)
      }

      // Fetch today's appointments
      const appointmentsResponse = await fetch('/api/attendant/today-appointments')
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json()
        setTodayAppointments(appointmentsData)
      }

      // Fetch pending verifications
      const verificationsResponse = await fetch('/api/attendant/pending-verifications')
      if (verificationsResponse.ok) {
        const verificationsData = await verificationsResponse.json()
        setPendingVerifications(verificationsData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const getRegistrationStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'checked-in': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getVerificationPriorityColor = (priority: string) => {
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
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 relative overflow-hidden">
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Welcome back, {user?.name}!</h1>
            <p className="text-white/90">Attendant Dashboard - Patient registration & management</p>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <UserCircle className="h-8 w-8 text-white" />
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
                  <span className="text-sm text-green-600">+15.2%</span>
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
                <p className="text-sm font-medium text-gray-600">Today's Registrations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayRegistrations}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <UserPlus className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">New patients</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <UserPlus className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingAppointments}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Clock3 className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-600">Awaiting check-in</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Check-ins Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.checkInToday}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <CalendarCheck className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">Processed</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BadgeCheck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/attendant/register-patient')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Register Patient</h3>
                <p className="text-sm text-gray-500">New patient registration</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/attendant/patients')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Patients</h3>
                <p className="text-sm text-gray-500">{stats.totalPatients} patients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/attendant/appointments')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Appointments</h3>
                <p className="text-sm text-gray-500">Manage appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/attendant/verifications')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <ClipboardList className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Verifications</h3>
                <p className="text-sm text-gray-500">{stats.pendingVerifications} pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Registrations & Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Recent Registrations</span>
            </CardTitle>
            <CardDescription>Newly registered patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRegistrations.length > 0 ? (
                recentRegistrations.map((registration, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={registration.avatar} />
                      <AvatarFallback>{registration.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{registration.name}</p>
                      <p className="text-xs text-gray-500">{registration.email}</p>
                    </div>
                    <Badge className={getRegistrationStatusColor(registration.status)}>
                      {registration.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent registrations</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Today's Appointments</span>
            </CardTitle>
            <CardDescription>Appointments scheduled for today</CardDescription>
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
                      <p className="text-xs text-gray-500">{appointment.time} - Dr. {appointment.doctorName}</p>
                    </div>
                    <Badge className={getAppointmentStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No appointments scheduled for today</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Verifications */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ClipboardList className="h-5 w-5" />
            <span>Pending Verifications</span>
          </CardTitle>
          <CardDescription>Patient documents requiring verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingVerifications.length > 0 ? (
              pendingVerifications.map((verification, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-full">
                    <FileText className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{verification.patientName}</p>
                    <p className="text-xs text-gray-500">{verification.documentType} - Submitted {verification.submittedAt}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getVerificationPriorityColor(verification.priority)}>
                      {verification.priority}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No pending verifications</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}