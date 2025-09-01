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
  LogOut
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
      <Card className="bg-gradient-to-r from-green-600 to-teal-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-white">
                <AvatarImage src={userImage} />
                <AvatarFallback className="bg-white text-green-600 text-xl">
                  {userName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Dr. {userName}</h1>
                <p className="text-green-100">{specialization}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge className={`bg-white/20 text-white border-white/30 ${isAvailable ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${isAvailable ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    {isAvailable ? 'Available' : 'Busy'}
                  </Badge>
                  <span className="text-green-100 text-sm">
                    Last updated: {lastRefresh.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Button 
                variant="secondary" 
                className={`mb-2 ${isAvailable ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                onClick={() => setIsAvailable(!isAvailable)}
              >
                {isAvailable ? 'Go Busy' : 'Go Available'}
              </Button>
              <div className="text-sm text-green-100">
                {appointments.filter(a => a.status === 'confirmed' || a.status === 'in-progress').length} appointments today
              </div>
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
                <p className="text-sm text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-blue-600">{appointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weekly Revenue</p>
                <p className="text-2xl font-bold text-green-600">${financials.weeklyRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Items</p>
                <p className="text-2xl font-bold text-orange-600">{pendingItems.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Patient Satisfaction</p>
                <p className="text-2xl font-bold text-purple-600">4.8</p>
              </div>
              <Star className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Today's Appointments */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Today's Appointments</span>
              </CardTitle>
              <CardDescription>Timeline view with patient names</CardDescription>
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
                        <p className="text-sm text-gray-600">{appointment.time} • {appointment.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.replace('-', ' ')}
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

          {/* Recent Patients */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>Recent Patients</span>
              </CardTitle>
              <CardDescription>Last 5 patients with quick access to records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {patient.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-600">{patient.age} years • {patient.condition}</p>
                        <p className="text-xs text-gray-500">Last visit: {patient.lastVisit}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
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
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>Earnings & Finances</span>
              </CardTitle>
              <CardDescription>Current week/month overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">This Week</p>
                    <p className="text-lg font-bold text-green-600">${financials.weeklyRevenue.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-lg font-bold text-blue-600">${financials.monthlyRevenue.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Pending Payouts</p>
                    <p className="text-lg font-bold text-orange-600">${financials.pendingPayouts.toLocaleString()}</p>
                  </div>
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Items */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span>Pending Items</span>
              </CardTitle>
              <CardDescription>Prescriptions and lab orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {pendingItems.map((item) => (
                  <div key={item.id} className={`p-3 border rounded-lg ${getPriorityColor(item.priority)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {item.type === 'prescription' ? <Pill className="h-4 w-4" /> : <FlaskConical className="h-4 w-4" />}
                          <p className="font-medium text-sm">{item.patientName}</p>
                        </div>
                        <p className="text-xs opacity-75">{item.details}</p>
                        <p className="text-xs opacity-60 mt-1">{item.time}</p>
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
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>System updates and messages</CardDescription>
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