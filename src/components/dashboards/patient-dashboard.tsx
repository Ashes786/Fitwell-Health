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
  PhoneCall,
  Zap,
  Target,
  Award,
  Timer,
  ChevronRight,
  Shield,
  Pulse,
  Thermometer,
  Droplets
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
  icon: any
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
    { type: 'Blood Pressure', value: '120', unit: '/80 mmHg', trend: 'normal', date: '2024-01-10', icon: Activity },
    { type: 'Heart Rate', value: '72', unit: 'bpm', trend: 'normal', date: '2024-01-10', icon: Heart },
    { type: 'Temperature', value: '98.6', unit: '°F', trend: 'normal', date: '2024-01-10', icon: Thermometer },
    { type: 'Blood Sugar', value: '95', unit: 'mg/dL', trend: 'down', date: '2024-01-10', icon: Droplets }
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
      name: 'Book GP', 
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
      name: 'HealthPay Card', 
      icon: CreditCard, 
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
      case 'hydration': return <Droplets className="h-4 w-4" />
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
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xl font-bold">
                  {userName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
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
              <div className="mt-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Shield className="h-3 w-3 mr-1" />
                  NHR: NHS-123456789
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <CreditCard className="h-4 w-4" />
            HealthPay Card
          </Button>
        </div>
      </div>

      {/* Health Score Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                <Heart className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Your Health Score</h2>
                <p className="text-blue-100">{aiInsight.message}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold mb-2">{aiInsight.score}%</div>
              <div className="flex items-center space-x-2 text-blue-100">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Excellent</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{appointments.filter(a => a.status === 'confirmed').length}</p>
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
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Pill className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{prescriptions.filter(p => p.status === 'active').length}</p>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-purple-600">Prescriptions</span>
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
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{healthRecords.filter(h => h.status === 'pending').length}</p>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Results</span>
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
                  <p className="text-sm font-medium text-gray-600">Reminders</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{notifications.length}</p>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-orange-600">Active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Appointments & Vitals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointments */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Upcoming Appointments
                </CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Book New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${appointment.type === 'GP' ? 'bg-blue-50' : 'bg-purple-50'}`}>
                        <Stethoscope className={`h-5 w-5 ${appointment.type === 'GP' ? 'text-blue-600' : 'text-purple-600'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-gray-900">{appointment.doctor}</p>
                          <Badge variant="outline" className="text-xs">
                            {appointment.type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {appointment.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            {appointment.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                        className={appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      >
                        {appointment.status}
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

          {/* Health Vitals */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Health Vitals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vitals.map((vital, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <vital.icon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{vital.type}</p>
                        <p className="text-sm text-gray-600">{vital.value} {vital.unit}</p>
                        <p className="text-xs text-gray-500">{vital.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
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
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Pill className="h-5 w-5 text-purple-600" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescriptions.filter(p => p.status === 'active').map((prescription) => (
                  <div key={prescription.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Pill className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{prescription.name}</p>
                        <p className="text-sm text-gray-600">{prescription.dosage} • {prescription.frequency}</p>
                      </div>
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
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-red-600" />
                Health Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-lg border ${getNotificationColor(notification.priority)}`}>
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
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
                    <Link key={index} href={action.route}>
                      <div className={`p-4 rounded-xl border-2 border-transparent ${action.bgColor} hover:border-blue-300 cursor-pointer transition-all duration-300 hover:shadow-md`}>
                        <Icon className={`h-6 w-6 ${action.color} mb-2`} />
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

      {/* AI Health Insights */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50 mt-8">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            AI Health Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{aiInsight.score}%</div>
              <p className="text-sm text-gray-600 font-medium">Health Score</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-900 mb-4 text-base">{aiInsight.message}</p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  {aiInsight.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
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