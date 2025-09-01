'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Heart, 
  Calendar, 
  Pill, 
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
  PhoneCall
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
  type: 'GP' | 'Specialist'
  doctor: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'completed'
}

interface Vital {
  type: string
  value: string
  unit: string
  trend: 'up' | 'down' | 'normal'
  date: string
}

interface Prescription {
  id: string
  name: string
  dosage: string
  frequency: string
  refills: number
  status: 'active' | 'completed'
}

interface HealthRecord {
  id: string
  type: string
  date: string
  doctor: string
  status: 'completed' | 'pending'
}

interface Notification {
  id: string
  type: 'pill' | 'hydration' | 'lab' | 'appointment'
  message: string
  time: string
  priority: 'low' | 'medium' | 'high'
}

export function PatientDashboard({ userName, userImage, userEmail, userPhone }: PatientDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Mock data for patient dashboard
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', type: 'GP', doctor: 'Dr. Sarah Johnson', date: '2024-01-15', time: '10:00 AM', status: 'confirmed' },
    { id: '2', type: 'Specialist', doctor: 'Dr. Michael Chen', date: '2024-01-18', time: '2:30 PM', status: 'confirmed' },
    { id: '3', type: 'GP', doctor: 'Dr. Emily Davis', date: '2024-01-22', time: '11:00 AM', status: 'pending' }
  ])

  const [vitals, setVitals] = useState<Vital[]>([
    { type: 'Blood Pressure', value: '120', unit: '/80 mmHg', trend: 'normal', date: '2024-01-10' },
    { type: 'Heart Rate', value: '72', unit: 'bpm', trend: 'normal', date: '2024-01-10' },
    { type: 'Temperature', value: '98.6', unit: '°F', trend: 'normal', date: '2024-01-10' },
    { type: 'Blood Sugar', value: '95', unit: 'mg/dL', trend: 'down', date: '2024-01-10' }
  ])

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { id: '1', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', refills: 2, status: 'active' },
    { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', refills: 1, status: 'active' },
    { id: '3', name: 'Vitamin D', dosage: '1000 IU', frequency: 'Once daily', refills: 0, status: 'completed' }
  ])

  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([
    { id: '1', type: 'Consultation', date: '2024-01-10', doctor: 'Dr. Sarah Johnson', status: 'completed' },
    { id: '2', type: 'Lab Report', date: '2024-01-08', doctor: 'Lab Corp', status: 'completed' },
    { id: '3', type: 'Hospital Report', date: '2024-01-05', doctor: 'City Hospital', status: 'pending' }
  ])

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'pill', message: 'Take Lisinopril - 10mg', time: '8:00 AM', priority: 'high' },
    { id: '2', type: 'hydration', message: 'Drink 8oz of water', time: '10:00 AM', priority: 'medium' },
    { id: '3', type: 'lab', message: 'Blood test results pending', time: '2:00 PM', priority: 'low' }
  ])

  const [aiInsight, setAiInsight] = useState({
    score: 85,
    message: 'Your overall health is good. Keep up with your medication schedule and stay hydrated.',
    recommendations: ['Continue current medications', 'Increase water intake', 'Schedule next checkup']
  })

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
      name: 'Book GP Appointment', 
      icon: Stethoscope, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      route: '/dashboard/book-appointment'
    },
    { 
      name: 'Book Specialist', 
      icon: User, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      route: '/dashboard/book-appointment'
    },
    { 
      name: 'Upload Record', 
      icon: FileText, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      route: '/dashboard/health-records'
    },
    { 
      name: 'View Discounts', 
      icon: ShoppingCart, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      route: '/dashboard/cart'
    }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-red-500" />
      case 'down': return <TrendingDown className="h-3 w-3 text-green-500" />
      default: return <Activity className="h-3 w-3 text-gray-500" />
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'pill': return <Pill className="h-4 w-4" />
      case 'hydration': return <Heart className="h-4 w-4" />
      case 'lab': return <FlaskConical className="h-4 w-4" />
      case 'appointment': return <Calendar className="h-4 w-4" />
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
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-white">
                <AvatarImage src={userImage} />
                <AvatarFallback className="bg-white text-blue-600 text-xl">
                  {userName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {userName}!</h1>
                <div className="flex items-center space-x-4 mt-2 text-blue-100">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{userEmail}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <PhoneCall className="h-4 w-4" />
                    <span className="text-sm">{userPhone}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <Badge className="bg-white/20 text-white border-white/30">
                    NHR: NHS-123456789
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">HealthPay Card</div>
              <Button variant="secondary" className="mt-2 bg-white/20 hover:bg-white/30 text-white">
                <CreditCard className="h-4 w-4 mr-2" />
                View Card
              </Button>
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
                <p className="text-sm text-gray-600">Health Score</p>
                <p className="text-2xl font-bold text-green-600">{aiInsight.score}%</p>
              </div>
              <Heart className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Appointments</p>
                <p className="text-2xl font-bold text-blue-600">{appointments.filter(a => a.status === 'confirmed').length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Prescriptions</p>
                <p className="text-2xl font-bold text-purple-600">{prescriptions.filter(p => p.status === 'active').length}</p>
              </div>
              <Pill className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Results</p>
                <p className="text-2xl font-bold text-orange-600">{healthRecords.filter(h => h.status === 'pending').length}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointments */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Upcoming Appointments</span>
              </CardTitle>
              <CardDescription>Your next 3 appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${appointment.type === 'GP' ? 'bg-blue-50' : 'bg-purple-50'}`}>
                        <Stethoscope className={`h-4 w-4 ${appointment.type === 'GP' ? 'text-blue-600' : 'text-purple-600'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.doctor}</p>
                        <p className="text-sm text-gray-600">{appointment.type} • {appointment.date} at {appointment.time}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                      className={appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Health Vitals Snapshot */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span>Health Vitals Snapshot</span>
              </CardTitle>
              <CardDescription>Last logged vitals with trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vitals.map((vital, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{vital.type}</p>
                      <p className="text-sm text-gray-600">{vital.value} {vital.unit}</p>
                      <p className="text-xs text-gray-500">{vital.date}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(vital.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Ongoing Treatments */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Pill className="h-5 w-5 text-purple-600" />
                <span>Ongoing Treatments</span>
              </CardTitle>
              <CardDescription>Active medications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prescriptions.filter(p => p.status === 'active').map((prescription) => (
                  <div key={prescription.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{prescription.name}</p>
                      <p className="text-sm text-gray-600">{prescription.dosage} • {prescription.frequency}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{prescription.refills} refills</p>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
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
                <Bell className="h-5 w-5 text-orange-600" />
                <span>Notifications & Reminders</span>
              </CardTitle>
              <CardDescription>Pending reminders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-3 border rounded-lg ${getNotificationColor(notification.priority)}`}>
                    <div className="flex items-start space-x-2">
                      {getNotificationIcon(notification.type)}
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

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-600" />
            <span>AI Health Insights</span>
          </CardTitle>
          <CardDescription>Your health at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{aiInsight.score}%</div>
              <p className="text-sm text-gray-600">Health Score</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-900 mb-3">{aiInsight.message}</p>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {aiInsight.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}