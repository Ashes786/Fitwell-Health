'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  Calendar, 
  UserCheck, 
  Clipboard, 
  Bell, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  FileText,
  Phone,
  MapPin,
  Mail,
  Stethoscope,
  Building,
  User,
  Settings,
  LogOut,
  Heart,
  Monitor,
  DollarSign,
  Zap,
  PieChart
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'
import { BarChart } from '@/components/ui/bar-chart'
import { LineChart } from '@/components/ui/line-chart'

interface AttendantDashboardProps {
  userName: string
  userImage?: string
}

interface Patient {
  id: string
  name: string
  age: number
  registrationDate: string
  status: 'active' | 'pending' | 'discharged'
  assignedDoctor?: string
}

interface Appointment {
  id: string
  patientName: string
  doctorName: string
  time: string
  type: 'consultation' | 'follow-up' | 'emergency'
  status: 'confirmed' | 'pending' | 'completed'
}

interface Task {
  id: string
  type: 'registration' | 'payment' | 'follow-up' | 'documentation'
  title: string
  patientName?: string
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed'
}

interface Notification {
  id: string
  type: 'doctor' | 'control-room' | 'admin' | 'system'
  message: string
  time: string
  priority: 'high' | 'medium' | 'low'
}

interface Stats {
  totalPatients: number
  recentRegistrations: number
  todayAppointments: number
  pendingTasks: number
}

interface RegistrationData {
  date: string
  registrations: number
  appointments: number
}

interface TaskDistribution {
  type: string
  count: number
  color: string
}

export function AttendantDashboard({ userName, userImage }: AttendantDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Mock data for attendant dashboard
  const [patients, setPatients] = useState<Patient[]>([
    { id: '1', name: 'John Smith', age: 45, registrationDate: '2024-01-15', status: 'active', assignedDoctor: 'Dr. Sarah Johnson' },
    { id: '2', name: 'Emily Davis', age: 32, registrationDate: '2024-01-14', status: 'active', assignedDoctor: 'Dr. Michael Chen' },
    { id: '3', name: 'Robert Wilson', age: 58, registrationDate: '2024-01-13', status: 'pending', assignedDoctor: 'Dr. Emily Davis' },
    { id: '4', name: 'Lisa Anderson', age: 29, registrationDate: '2024-01-12', status: 'active', assignedDoctor: 'Dr. Sarah Johnson' },
    { id: '5', name: 'David Brown', age: 41, registrationDate: '2024-01-11', status: 'discharged', assignedDoctor: 'Dr. Michael Chen' }
  ])

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', patientName: 'John Smith', doctorName: 'Dr. Sarah Johnson', time: '9:00 AM', type: 'consultation', status: 'confirmed' },
    { id: '2', patientName: 'Emily Davis', doctorName: 'Dr. Michael Chen', time: '9:30 AM', type: 'follow-up', status: 'confirmed' },
    { id: '3', patientName: 'Robert Wilson', doctorName: 'Dr. Emily Davis', time: '10:00 AM', type: 'consultation', status: 'pending' },
    { id: '4', patientName: 'Lisa Anderson', doctorName: 'Dr. Sarah Johnson', time: '10:30 AM', type: 'emergency', status: 'confirmed' }
  ])

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', type: 'registration', title: 'Complete patient registration', patientName: 'Robert Wilson', priority: 'high', dueDate: '2024-01-15', status: 'pending' },
    { id: '2', type: 'payment', title: 'Process payment for consultation', patientName: 'Emily Davis', priority: 'medium', dueDate: '2024-01-15', status: 'pending' },
    { id: '3', type: 'follow-up', title: 'Schedule follow-up appointment', patientName: 'John Smith', priority: 'medium', dueDate: '2024-01-16', status: 'in-progress' },
    { id: '4', type: 'documentation', title: 'Update patient records', patientName: 'Lisa Anderson', priority: 'low', dueDate: '2024-01-17', status: 'pending' }
  ])

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'doctor', message: 'Dr. Sarah Johnson requested patient records', time: '10 min ago', priority: 'medium' },
    { id: '2', type: 'control-room', message: 'New emergency case incoming - prepare room', time: '30 min ago', priority: 'high' },
    { id: '3', type: 'admin', message: 'Staff meeting scheduled for 3 PM', time: '1 hour ago', priority: 'low' },
    { id: '4', type: 'system', message: 'System maintenance tonight 10 PM - 2 AM', time: '2 hours ago', priority: 'low' }
  ])

  const [stats, setStats] = useState<Stats>({
    totalPatients: 156,
    recentRegistrations: 12,
    todayAppointments: 8,
    pendingTasks: 4
  })

  const [registrationData, setRegistrationData] = useState<RegistrationData[]>([
    { date: 'Mon', registrations: 8, appointments: 12 },
    { date: 'Tue', registrations: 12, appointments: 15 },
    { date: 'Wed', registrations: 6, appointments: 18 },
    { date: 'Thu', registrations: 15, appointments: 22 },
    { date: 'Fri', registrations: 10, appointments: 16 },
    { date: 'Sat', registrations: 4, appointments: 8 },
    { date: 'Sun', registrations: 2, appointments: 5 }
  ])

  const [taskDistribution, setTaskDistribution] = useState<TaskDistribution[]>([
    { type: 'Registration', count: 8, color: '#3B82F6' },
    { type: 'Payment', count: 5, color: '#10B981' },
    { type: 'Follow-up', count: 12, color: '#F59E0B' },
    { type: 'Documentation', count: 6, color: '#EF4444' }
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
      toast({
        title: "Error",
        description: 'Failed to load dashboard data'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    { 
      name: 'Register New Patient', 
      icon: UserCheck, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      route: '/dashboard/register-patient',
      description: 'Quick patient registration'
    },
    { 
      name: 'Schedule Appointment', 
      icon: Calendar, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      route: '/dashboard/appointments',
      description: 'Book new appointments'
    },
    { 
      name: 'Patient Records', 
      icon: FileText, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      route: '/dashboard/patients',
      description: 'View patient history'
    },
    { 
      name: 'Process Payment', 
      icon: DollarSign, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      route: '/dashboard/payments',
      description: 'Handle transactions'
    },
    { 
      name: 'Task Management', 
      icon: Clipboard, 
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      route: '/dashboard/tasks',
      description: 'Manage daily tasks'
    },
    { 
      name: 'Reports', 
      icon: TrendingUp, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      route: '/dashboard/reports',
      description: 'View analytics'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'discharged': return 'bg-gray-100 text-gray-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-50 text-red-600 border-red-200'
      case 'consultation': return 'bg-blue-50 text-blue-600 border-blue-200'
      case 'follow-up': return 'bg-purple-50 text-purple-600 border-purple-200'
      default: return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-600 border-red-200'
      case 'medium': return 'bg-yellow-50 text-yellow-600 border-yellow-200'
      default: return 'bg-blue-50 text-blue-600 border-blue-200'
    }
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'registration': return <UserCheck className="h-4 w-4" />
      case 'payment': return <DollarSign className="h-4 w-4" />
      case 'follow-up': return <Phone className="h-4 w-4" />
      case 'documentation': return <FileText className="h-4 w-4" />
      default: return <Clipboard className="h-4 w-4" />
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
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-white">
                <AvatarImage src={userImage} />
                <AvatarFallback className="bg-white text-purple-600 text-xl">
                  {userName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {userName}!</h1>
                <p className="text-purple-100">Patient Attendant</p>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge className="bg-white/20 text-white border-white/30">
                    <div className="w-2 h-2 rounded-full mr-2 bg-green-400"></div>
                    Active
                  </Badge>
                  <span className="text-purple-100 text-sm">
                    Last updated: {lastRefresh.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-100">Today's Schedule</div>
              <div className="text-lg font-semibold">{appointments.filter(a => a.status === 'confirmed').length} appointments</div>
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
                <p className="text-sm text-gray-600">Registered Patients</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalPatients}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recent Registrations</p>
                <p className="text-2xl font-bold text-green-600">{stats.recentRegistrations}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-purple-600">{stats.todayAppointments}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingTasks}</p>
              </div>
              <Clipboard className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>Frequently used tasks and features</CardDescription>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Registration Chart */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Weekly Registration Trend</span>
            </CardTitle>
            <CardDescription>Patient registrations and appointments over the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <LineChart 
                data={registrationData}
                categories={['registrations', 'appointments']}
                colors={['#3B82F6', '#10B981']}
                valueFormatter={(value) => value.toString()}
              />
            </div>
          </CardContent>
        </Card>

        {/* Task Distribution Chart */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              <span>Task Distribution</span>
            </CardTitle>
            <CardDescription>Current task breakdown by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <BarChart 
                data={taskDistribution}
                categories={['count']}
                index="type"
                colors={taskDistribution.map(t => t.color)}
                valueFormatter={(value) => value.toString()}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Registered Patients Overview */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Registered Patients</span>
              </CardTitle>
              <CardDescription>Recent patient registrations with count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patients.slice(0, 4).map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {patient.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-600">{patient.age} years • {patient.assignedDoctor}</p>
                        <p className="text-xs text-gray-500">Registered: {patient.registrationDate}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" className="w-full">
                  View All Patients ({stats.totalPatients})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span>Today's Appointments</span>
              </CardTitle>
              <CardDescription>Patients booked by attendant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${getTypeColor(appointment.type)}`}>
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patientName}</p>
                        <p className="text-sm text-gray-600">{appointment.doctorName} • {appointment.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
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
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Assigned Patients Overview */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-green-600" />
                <span>Assigned Patients</span>
              </CardTitle>
              <CardDescription>Quick access to EHR</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {patients.filter(p => p.status === 'active').slice(0, 5).map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                          {patient.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{patient.name}</p>
                        <p className="text-xs text-gray-600">{patient.assignedDoctor}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Clipboard className="h-5 w-5 text-orange-600" />
                <span>Pending Tasks</span>
              </CardTitle>
              <CardDescription>Registrations, payments, follow-ups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {tasks.map((task) => (
                  <div key={task.id} className={`p-3 border rounded-lg ${getPriorityColor(task.priority)}`}>
                    <div className="flex items-start space-x-2">
                      {getTaskIcon(task.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{task.title}</p>
                        {task.patientName && (
                          <p className="text-xs opacity-75">Patient: {task.patientName}</p>
                        )}
                        <p className="text-xs opacity-60">Due: {task.dueDate}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>Messages from staff</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-3 border rounded-lg ${getPriorityColor(notification.priority)}`}>
                    <div className="flex items-start space-x-2">
                      <Bell className="h-4 w-4 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.message}</p>
                        <p className="text-xs opacity-75">{notification.time}</p>
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
                    <Link key={index} href={action.route}>
                      <div className={`p-3 rounded-lg border-2 border-transparent ${action.bgColor} hover:border-blue-300 cursor-pointer transition-all duration-300`}>
                        <Icon className={`h-5 w-5 ${action.color} mb-2`} />
                        <p className="text-xs font-medium text-gray-900">{action.name}</p>
                      </div>
                    </Link>
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