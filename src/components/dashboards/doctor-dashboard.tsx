'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Stethoscope, 
  Calendar, 
  Users, 
  DollarSign, 
  Bell, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  Video,
  MessageSquare,
  Pill,
  FlaskConical,
  FileText,
  User,
  Phone,
  Star,
  Heart,
  Monitor,
  Settings,
  LogOut,
  Zap,
  Target,
  Award,
  Timer,
  ChevronRight,
  MapPin,
  Mail
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface DoctorDashboardProps {
  userName: string
  userImage?: string
  specialization?: string
}

interface Appointment {
  id: string
  patientName: string
  time: string
  type: 'consultation' | 'follow-up' | 'emergency'
  status: 'confirmed' | 'waiting' | 'in-progress' | 'completed'
  duration: string
}

interface Patient {
  id: string
  name: string
  age: number
  lastVisit: string
  condition: string
}

interface Financial {
  weeklyRevenue: number
  monthlyRevenue: number
  pendingPayouts: number
  consultations: number
}

interface PendingItem {
  id: string
  type: 'prescription' | 'lab-order'
  patientName: string
  details: string
  priority: 'high' | 'medium' | 'low'
  time: string
}

interface Notification {
  id: string
  type: 'system' | 'patient' | 'emergency'
  message: string
  time: string
  priority: 'high' | 'medium' | 'low'
}

export function DoctorDashboard({ userName, userImage, specialization = 'General Practitioner' }: DoctorDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAvailable, setIsAvailable] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Mock data for doctor dashboard
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', patientName: 'John Smith', time: '9:00 AM', type: 'consultation', status: 'confirmed', duration: '30 min' },
    { id: '2', patientName: 'Sarah Johnson', time: '9:30 AM', type: 'follow-up', status: 'confirmed', duration: '20 min' },
    { id: '3', patientName: 'Mike Davis', time: '10:00 AM', type: 'consultation', status: 'waiting', duration: '30 min' },
    { id: '4', patientName: 'Emily Brown', time: '10:30 AM', type: 'emergency', status: 'confirmed', duration: '45 min' },
    { id: '5', patientName: 'David Wilson', time: '11:00 AM', type: 'consultation', status: 'confirmed', duration: '30 min' }
  ])

  const [recentPatients, setRecentPatients] = useState<Patient[]>([
    { id: '1', name: 'Alice Cooper', age: 34, lastVisit: '2024-01-10', condition: 'Hypertension' },
    { id: '2', name: 'Bob Johnson', age: 45, lastVisit: '2024-01-09', condition: 'Diabetes' },
    { id: '3', name: 'Carol White', age: 28, lastVisit: '2024-01-08', condition: 'Asthma' },
    { id: '4', name: 'David Lee', age: 52, lastVisit: '2024-01-07', condition: 'Arthritis' },
    { id: '5', name: 'Eva Martinez', age: 39, lastVisit: '2024-01-06', condition: 'Migraine' }
  ])

  const [financials, setFinancials] = useState<Financial>({
    weeklyRevenue: 2500,
    monthlyRevenue: 10000,
    pendingPayouts: 750,
    consultations: 45
  })

  const [pendingItems, setPendingItems] = useState<PendingItem[]>([
    { id: '1', type: 'prescription', patientName: 'John Smith', details: 'Antibiotics for infection', priority: 'high', time: '2 hours ago' },
    { id: '2', type: 'lab-order', patientName: 'Sarah Johnson', details: 'Blood work required', priority: 'medium', time: '3 hours ago' },
    { id: '3', type: 'prescription', patientName: 'Mike Davis', details: 'Pain management refill', priority: 'low', time: '1 day ago' }
  ])

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'system', message: 'System maintenance scheduled for tonight', time: '10 min ago', priority: 'low' },
    { id: '2', type: 'patient', message: 'New message from John Smith', time: '30 min ago', priority: 'medium' },
    { id: '3', type: 'emergency', message: 'Emergency case incoming - ETA 15 minutes', time: '1 hour ago', priority: 'high' }
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
      name: 'Update Availability', 
      icon: Settings, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => setIsAvailable(!isAvailable)
    },
    { 
      name: 'Add Prescription', 
      icon: Pill, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      route: '/dashboard/prescriptions'
    },
    { 
      name: 'Assign Lab Test', 
      icon: FlaskConical, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      route: '/dashboard/patients'
    },
    { 
      name: 'Chat with Patient', 
      icon: MessageSquare, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      route: '/dashboard/messages'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'waiting': return 'bg-yellow-100 text-yellow-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
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
                <AvatarFallback className="bg-gradient-to-br from-green-600 to-teal-600 text-white text-xl font-bold">
                  {userName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dr. {userName}</h1>
              <p className="text-gray-600 mt-1">{specialization}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="secondary" className={`${isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {isAvailable ? 'Available' : 'Busy'}
                </Badge>
                <span className="text-sm text-gray-500">
                  Updated {lastRefresh.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
          <Button 
            variant={isAvailable ? "destructive" : "default"}
            className="gap-2"
            onClick={() => setIsAvailable(!isAvailable)}
          >
            {isAvailable ? <LogOut className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            {isAvailable ? 'Go Busy' : 'Go Available'}
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Today's Schedule</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{appointments.length}</p>
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-blue-600">Appointments</span>
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
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Weekly Revenue</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">${financials.weeklyRevenue.toLocaleString()}</p>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+12% from last week</span>
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
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Pending Items</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{pendingItems.length}</p>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-orange-600">Require attention</span>
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
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">4.8</p>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-purple-600">Patient rating</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Today's Appointments */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Today's Appointments
                </CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${getTypeColor(appointment.type)}`}>
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">{appointment.patientName}</p>
                          <Badge variant="outline" className="text-xs">
                            {appointment.type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            {appointment.time}
                          </span>
                          <span>{appointment.duration}</span>
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

          {/* Recent Patients */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Recent Patients
                </CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Users className="h-4 w-4" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-purple-100 text-purple-600 font-bold">
                          {patient.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{patient.age} years</span>
                          <span>•</span>
                          <span>{patient.condition}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Last visit: {patient.lastVisit}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="hover:bg-gray-200">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Earnings & Finances */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Earnings Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-1">${financials.monthlyRevenue.toLocaleString()}</div>
                <div className="text-sm text-green-700 font-medium">Monthly Revenue</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-left">
                    <p className="text-sm text-gray-600">This Week</p>
                    <p className="text-lg font-semibold text-gray-900">${financials.weeklyRevenue.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-left">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-lg font-semibold text-gray-900">${financials.pendingPayouts.toLocaleString()}</p>
                  </div>
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Items */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Pending Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {pendingItems.map((item) => (
                  <div key={item.id} className={`p-3 rounded-lg border ${getPriorityColor(item.priority)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {item.type === 'prescription' ? <Pill className="h-4 w-4" /> : <FlaskConical className="h-4 w-4" />}
                          <p className="font-medium text-sm">{item.patientName}</p>
                        </div>
                        <p className="text-xs text-gray-600">{item.details}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-red-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-lg border ${getPriorityColor(notification.priority)}`}>
                    <div className="flex items-start space-x-3">
                      <Bell className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{notification.message}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <div key={index} className="p-4 rounded-xl border-2 border-transparent bg-gray-50 hover:border-blue-300 cursor-pointer transition-all duration-300 hover:shadow-md"
                      onClick={action.route ? () => {} : action.action}>
                      <Icon className={`h-6 w-6 ${action.color} mb-2`} />
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