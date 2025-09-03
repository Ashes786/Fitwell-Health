'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Monitor, 
  Users, 
  Stethoscope, 
  AlertTriangle, 
  Bell, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  Plus,
  UserCheck,
  Building,
  Ambulance,
  Phone,
  MapPin,
  Heart,
  Settings,
  LogOut,
  User,
  Calendar,
  Clipboard,
  Wrench,
  Truck,
  Zap,
  Activity,
  BarChart3
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { BarChart } from '@/components/ui/bar-chart'
import { LineChart } from '@/components/ui/line-chart'

interface ControlRoomDashboardProps {
  userName: string
  userImage?: string
}

interface Consultation {
  id: string
  patientName: string
  doctorName: string
  type: 'GP' | 'Specialist'
  status: 'ongoing' | 'waiting' | 'completed'
  duration: string
  room: string
}

interface AppointmentRequest {
  id: string
  patientName: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
  requestTime: string
  estimatedWait: string
  symptoms: string
}

interface Doctor {
  id: string
  name: string
  specialization: string
  status: 'free' | 'busy' | 'offline'
  currentPatients: number
  maxPatients: number
}

interface QueueStatus {
  totalWaiting: number
  averageWaitTime: string
  criticalCases: number
  availableRooms: number
}

interface Notification {
  id: string
  type: 'technical' | 'escalation' | 'emergency' | 'system'
  message: string
  time: string
  priority: 'high' | 'medium' | 'low'
  resolved: boolean
}

interface Stats {
  activeConsultations: number
  pendingRequests: number
  availableGPs: number
  totalPatients: number
  bedOccupancy: number
  emergencyCases: number
}

interface ConsultationTrend {
  time: string
  active: number
  waiting: number
  completed: number
}

interface ResourceUtilization {
  resource: string
  used: number
  total: number
  percentage: number
}

export function ControlRoomDashboard({ userName, userImage }: ControlRoomDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Mock data for control room dashboard
  const [consultations, setConsultations] = useState<Consultation[]>([
    { id: '1', patientName: 'John Smith', doctorName: 'Dr. Sarah Johnson', type: 'GP', status: 'ongoing', duration: '15 min', room: 'Room 101' },
    { id: '2', patientName: 'Emily Davis', doctorName: 'Dr. Michael Chen', type: 'Specialist', status: 'ongoing', duration: '25 min', room: 'Room 102' },
    { id: '3', patientName: 'Robert Wilson', doctorName: 'Dr. Emily Davis', type: 'GP', status: 'waiting', duration: '0 min', room: 'Waiting Area' },
    { id: '4', patientName: 'Lisa Anderson', doctorName: 'Dr. James Wilson', type: 'GP', status: 'completed', duration: '30 min', room: 'Room 103' }
  ])

  const [appointmentRequests, setAppointmentRequests] = useState<AppointmentRequest[]>([
    { id: '1', patientName: 'David Brown', urgency: 'high', requestTime: '10:30 AM', estimatedWait: '15 min', symptoms: 'Chest pain, difficulty breathing' },
    { id: '2', patientName: 'Maria Garcia', urgency: 'medium', requestTime: '10:45 AM', estimatedWait: '30 min', symptoms: 'Fever, headache' },
    { id: '3', patientName: 'James Taylor', urgency: 'critical', requestTime: '11:00 AM', estimatedWait: '5 min', symptoms: 'Severe abdominal pain' },
    { id: '4', patientName: 'Jennifer White', urgency: 'low', requestTime: '11:15 AM', estimatedWait: '45 min', symptoms: 'Routine checkup' }
  ])

  const [doctors, setDoctors] = useState<Doctor[]>([
    { id: '1', name: 'Dr. Sarah Johnson', specialization: 'General Practitioner', status: 'busy', currentPatients: 3, maxPatients: 5 },
    { id: '2', name: 'Dr. Michael Chen', specialization: 'Cardiologist', status: 'busy', currentPatients: 2, maxPatients: 4 },
    { id: '3', name: 'Dr. Emily Davis', specialization: 'General Practitioner', status: 'free', currentPatients: 1, maxPatients: 5 },
    { id: '4', name: 'Dr. James Wilson', specialization: 'General Practitioner', status: 'free', currentPatients: 0, maxPatients: 5 },
    { id: '5', name: 'Dr. Lisa Brown', specialization: 'Pediatrician', status: 'offline', currentPatients: 0, maxPatients: 4 }
  ])

  const [queueStatus, setQueueStatus] = useState<QueueStatus>({
    totalWaiting: 12,
    averageWaitTime: '25 min',
    criticalCases: 2,
    availableRooms: 8
  })

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'technical', message: 'MRI Machine #2 needs maintenance', time: '5 min ago', priority: 'medium', resolved: false },
    { id: '2', type: 'escalation', message: 'Patient complaint about wait time', time: '15 min ago', priority: 'high', resolved: false },
    { id: '3', type: 'emergency', message: 'Code Blue in Room 205', time: '30 min ago', priority: 'high', resolved: true },
    { id: '4', type: 'system', message: 'Backup system completed successfully', time: '1 hour ago', priority: 'low', resolved: true }
  ])

  const [stats, setStats] = useState<Stats>({
    activeConsultations: 8,
    pendingRequests: 12,
    availableGPs: 3,
    totalPatients: 45,
    bedOccupancy: 78,
    emergencyCases: 3
  })

  const [consultationTrend, setConsultationTrend] = useState<ConsultationTrend[]>([
    { time: '9:00', active: 3, waiting: 5, completed: 2 },
    { time: '10:00', active: 5, waiting: 8, completed: 4 },
    { time: '11:00', active: 8, waiting: 12, completed: 6 },
    { time: '12:00', active: 6, waiting: 10, completed: 8 },
    { time: '13:00', active: 4, waiting: 7, completed: 5 },
    { time: '14:00', active: 7, waiting: 9, completed: 7 },
    { time: '15:00', active: 8, waiting: 11, completed: 9 }
  ])

  const [resourceUtilization, setResourceUtilization] = useState<ResourceUtilization[]>([
    { resource: 'Consultation Rooms', used: 12, total: 15, percentage: 80 },
    { resource: 'Available GPs', used: 5, total: 8, percentage: 63 },
    { resource: 'Emergency Bays', used: 3, total: 5, percentage: 60 },
    { resource: 'Waiting Area', used: 18, total: 25, percentage: 72 }
  ])

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
      name: 'Assign Doctor', 
      icon: UserCheck, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      route: '/dashboard/doctor-assignment',
      description: 'Assign doctors to patients'
    },
    { 
      name: 'Emergency Alert', 
      icon: AlertTriangle, 
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      route: '/dashboard/emergency-alerts',
      description: 'Manage emergency cases'
    },
    { 
      name: 'Bed Management', 
      icon: Building, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      route: '/dashboard/bed-management',
      description: 'Manage bed occupancy'
    },
    { 
      name: 'Staff Coordination', 
      icon: Users, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      route: '/dashboard/staff-coordination',
      description: 'Coordinate staff activities'
    },
    { 
      name: 'Equipment Status', 
      icon: Wrench, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      route: '/dashboard/equipment-status',
      description: 'Monitor equipment'
    },
    { 
      name: 'Ambulance Tracking', 
      icon: Truck, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      route: '/dashboard/ambulance-tracking',
      description: 'Track ambulance fleet'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-blue-100 text-blue-800'
      case 'waiting': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'free': return 'bg-green-100 text-green-800'
      case 'busy': return 'bg-red-100 text-red-800'
      case 'offline': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-50 text-red-600 border-red-200'
      case 'high': return 'bg-orange-50 text-orange-600 border-orange-200'
      case 'medium': return 'bg-yellow-50 text-yellow-600 border-yellow-200'
      default: return 'bg-blue-50 text-blue-600 border-blue-200'
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
      case 'technical': return <Wrench className="h-4 w-4" />
      case 'escalation': return <AlertTriangle className="h-4 w-4" />
      case 'emergency': return <Heart className="h-4 w-4" />
      case 'system': return <Settings className="h-4 w-4" />
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
      <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-white">
                <AvatarImage src={userImage} />
                <AvatarFallback className="bg-white text-red-600 text-xl">
                  {userName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Control Room - {userName}</h1>
                <p className="text-red-100">Real-time Monitoring & Coordination</p>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge className="bg-white/20 text-white border-white/30">
                    <div className="w-2 h-2 rounded-full mr-2 bg-green-400"></div>
                    System Active
                  </Badge>
                  <span className="text-red-100 text-sm">
                    Last updated: {lastRefresh.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-red-100">Active Cases</div>
              <div className="text-lg font-semibold">{stats.activeConsultations} consultations</div>
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
                <p className="text-sm text-gray-600">Active Consultations</p>
                <p className="text-2xl font-bold text-blue-600">{stats.activeConsultations}</p>
              </div>
              <Monitor className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available GPs</p>
                <p className="text-2xl font-bold text-green-600">{stats.availableGPs}</p>
              </div>
              <Stethoscope className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emergency Cases</p>
                <p className="text-2xl font-bold text-red-600">{stats.emergencyCases}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <span>Control Room Quick Actions</span>
          </CardTitle>
          <CardDescription>Critical operations and monitoring tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link key={index} href={action.route}>
                  <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {action.name}
                        </h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Monitoring Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consultation Trends */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span>Real-time Consultation Trends</span>
            </CardTitle>
            <CardDescription>Live consultation status throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <LineChart 
                data={consultationTrend}
                categories={['active', 'waiting', 'completed']}
                colors={['#3B82F6', '#F59E0B', '#10B981']}
                valueFormatter={(value) => value.toString()}
              />
            </div>
          </CardContent>
        </Card>

        {/* Resource Utilization */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span>Resource Utilization</span>
            </CardTitle>
            <CardDescription>Current resource allocation and usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <BarChart 
                data={resourceUtilization.map(r => ({ resource: r.resource, percentage: r.percentage }))}
                categories={['percentage']}
                index="resource"
                colors={['#8B5CF6']}
                valueFormatter={(value) => `${value}%`}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active GP Consultations */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Monitor className="h-5 w-5 text-blue-600" />
                <span>Active GP Consultations</span>
              </CardTitle>
              <CardDescription>Real-time status: ongoing, waiting, completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {consultations.map((consultation) => (
                  <div key={consultation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${consultation.status === 'ongoing' ? 'bg-blue-50' : consultation.status === 'waiting' ? 'bg-yellow-50' : 'bg-green-50'}`}>
                        <Monitor className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{consultation.patientName}</p>
                        <p className="text-sm text-gray-600">{consultation.doctorName} • {consultation.type} • {consultation.room}</p>
                        <p className="text-xs text-gray-500">Duration: {consultation.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(consultation.status)}>
                        {consultation.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <User className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Appointment Requests */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span>Pending Appointment Requests</span>
              </CardTitle>
              <CardDescription>Queue of patients needing GP</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointmentRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${getUrgencyColor(request.urgency)}`}>
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{request.patientName}</p>
                        <p className="text-sm text-gray-600">{request.symptoms}</p>
                        <p className="text-xs text-gray-500">Requested: {request.requestTime} • Est. wait: {request.estimatedWait}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getUrgencyColor(request.urgency).replace('border-', 'text-').replace('bg-', 'bg-').replace('50', '100')}>
                        {request.urgency}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Assign
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Available GPs */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Stethoscope className="h-5 w-5 text-green-600" />
                <span>Available GPs</span>
              </CardTitle>
              <CardDescription>With status: free/busy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={`text-xs ${doctor.status === 'free' ? 'bg-green-100 text-green-600' : doctor.status === 'busy' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                          {doctor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{doctor.name}</p>
                        <p className="text-xs text-gray-600">{doctor.specialization}</p>
                        <p className="text-xs text-gray-500">{doctor.currentPatients}/{doctor.maxPatients} patients</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(doctor.status)}>
                      {doctor.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Patient Queue Status */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>Patient Queue Status</span>
              </CardTitle>
              <CardDescription>How many waiting, average wait time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{queueStatus.totalWaiting}</div>
                  <div className="text-sm text-gray-600">Total Waiting</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{queueStatus.averageWaitTime}</div>
                  <div className="text-sm text-gray-600">Avg Wait Time</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{queueStatus.criticalCases}</div>
                  <div className="text-sm text-gray-600">Critical Cases</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{queueStatus.availableRooms}</div>
                  <div className="text-sm text-gray-600">Available Rooms</div>
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
              <CardDescription>Technical issues, escalations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-48 overflow-y-auto">
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
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <div key={index} className="p-3 rounded-lg border-2 border-transparent bg-gray-50 hover:border-blue-300 cursor-pointer transition-all duration-300"
                      onClick={action.route ? () => {} : action.action}>
                      <Icon className={`h-5 w-5 ${action.color} mb-2`} />
                      <p className="text-xs font-medium text-gray-900">{action.name}</p>
                    </div>
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