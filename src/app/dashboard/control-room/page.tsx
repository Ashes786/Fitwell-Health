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
  Clock3,
  MonitorSpeaker,
  MapPin,
  PhoneCall,
  VideoCamera,
  AlertCircle,
  CheckCircle2,
  Timer,
  UsersRound,
  Hospital,
  Ambulance,
  HeartHandshake
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function ControlRoomDashboard() {
  const { user, loading } = useCustomSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    activeDoctors: 0,
    availableBeds: 0,
    emergencyCases: 0,
    totalPatients: 0,
    waitingQueue: 0,
    averageResponseTime: 0,
    criticalCases: 0,
    staffOnDuty: 0
  })
  const [doctorAssignments, setDoctorAssignments] = useState([])
  const [emergencyAlerts, setEmergencyAlerts] = useState([])
  const [bedOccupancy, setBedOccupancy] = useState([])
  const [staffStatus, setStaffStatus] = useState([])

  useEffect(() => {
    if (loading) return
    
    if (!user) {
      router.push('/auth/signin')
      return
    }

    // Redirect to unified dashboard - it handles role-specific content
    router.push('/dashboard')
    return
  }, [user, loading, router])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch stats data
      const statsResponse = await fetch('/api/control-room/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(prev => ({ ...prev, ...statsData }))
      }

      // Fetch doctor assignments
      const assignmentsResponse = await fetch('/api/control-room/doctor-assignments')
      if (assignmentsResponse.ok) {
        const assignmentsData = await assignmentsResponse.json()
        setDoctorAssignments(assignmentsData)
      }

      // Fetch emergency alerts
      const alertsResponse = await fetch('/api/control-room/emergency-alerts')
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json()
        setEmergencyAlerts(alertsData)
      }

      // Fetch bed occupancy
      const occupancyResponse = await fetch('/api/control-room/bed-occupancy')
      if (occupancyResponse.ok) {
        const occupancyData = await occupancyResponse.json()
        setBedOccupancy(occupancyData)
      }

      // Fetch staff status
      const staffResponse = await fetch('/api/control-room/staff-status')
      if (staffResponse.ok) {
        const staffData = await staffResponse.json()
        setStaffStatus(staffData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const getDoctorStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'busy': return 'bg-yellow-100 text-yellow-800'
      case 'unavailable': return 'bg-red-100 text-red-800'
      case 'on-break': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEmergencySeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getBedStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'occupied': return 'bg-red-100 text-red-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'reserved': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStaffStatusColor = (status: string) => {
    switch (status) {
      case 'on-duty': return 'bg-green-100 text-green-800'
      case 'off-duty': return 'bg-gray-100 text-gray-800'
      case 'on-break': return 'bg-yellow-100 text-yellow-800'
      case 'emergency': return 'bg-red-100 text-red-800'
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
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-lg p-6 relative overflow-hidden">
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Welcome back, {user?.name}!</h1>
            <p className="text-white/90">Control Room Dashboard - Real-time monitoring & coordination</p>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <MonitorSpeaker className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Emergency Alert Banner */}
      {stats.emergencyCases > 0 && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">Emergency Alert</h3>
                <p className="text-sm text-red-700">{stats.emergencyCases} active emergency cases requiring immediate attention</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/dashboard/control-room/emergency')}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeDoctors}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Stethoscope className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">On duty</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Stethoscope className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Beds</p>
                <p className="text-2xl font-bold text-gray-900">{stats.availableBeds}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Hospital className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">Ready for patients</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Hospital className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Emergency Cases</p>
                <p className="text-2xl font-bold text-gray-900">{stats.emergencyCases}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Ambulance className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">Active</span>
                </div>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Ambulance className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Waiting Queue</p>
                <p className="text-2xl font-bold text-gray-900">{stats.waitingQueue}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Timer className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-600">Patients waiting</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Timer className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/control-room/doctor-assignment')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Doctor Assignment</h3>
                <p className="text-sm text-gray-500">Assign doctors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/control-room/emergency')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Ambulance className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Emergency Cases</h3>
                <p className="text-sm text-gray-500">{stats.emergencyCases} active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/control-room/bed-management')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Hospital className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Bed Management</h3>
                <p className="text-sm text-gray-500">{stats.availableBeds} available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/control-room/staff')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <UsersRound className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Staff Status</h3>
                <p className="text-sm text-gray-500">{stats.staffOnDuty} on duty</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctor Assignments & Emergency Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Stethoscope className="h-5 w-5" />
              <span>Doctor Assignments</span>
            </CardTitle>
            <CardDescription>Current doctor status and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctorAssignments.length > 0 ? (
                doctorAssignments.map((assignment, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={assignment.doctorAvatar} />
                      <AvatarFallback>{assignment.doctorName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Dr. {assignment.doctorName}</p>
                      <p className="text-xs text-gray-500">{assignment.department} - {assignment.currentAssignment}</p>
                    </div>
                    <Badge className={getDoctorStatusColor(assignment.status)}>
                      {assignment.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No doctor assignments</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Emergency Alerts</span>
            </CardTitle>
            <CardDescription>Active emergency cases requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emergencyAlerts.length > 0 ? (
                emergencyAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-white rounded-full">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{alert.patientName}</p>
                      <p className="text-xs text-gray-500">{alert.location} - {alert.time}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getEmergencySeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <PhoneCall className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No active emergency alerts</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bed Occupancy & Staff Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Hospital className="h-5 w-5" />
              <span>Bed Occupancy</span>
            </CardTitle>
            <CardDescription>Current bed status and availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bedOccupancy.length > 0 ? (
                bedOccupancy.map((bed, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-white rounded-full">
                      <Hospital className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{bed.ward} - Bed {bed.number}</p>
                      <p className="text-xs text-gray-500">{bed.type} - {bed.patient ? `Occupied by ${bed.patient}` : 'Available'}</p>
                    </div>
                    <Badge className={getBedStatusColor(bed.status)}>
                      {bed.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No bed occupancy data</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UsersRound className="h-5 w-5" />
              <span>Staff Status</span>
            </CardTitle>
            <CardDescription>Current staff availability and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {staffStatus.length > 0 ? (
                staffStatus.map((staff, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={staff.avatar} />
                      <AvatarFallback>{staff.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                      <p className="text-xs text-gray-500">{staff.role} - {staff.department}</p>
                    </div>
                    <Badge className={getStaffStatusColor(staff.status)}>
                      {staff.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No staff status data</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}