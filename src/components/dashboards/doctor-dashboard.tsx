'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
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
  Mail,
  BarChart3,
  LineChart,
  PieChart,
  UserPlus,
  UserCheck,
  CalendarDays,
  Clock1,
  VideoCamera,
  PhoneCall,
  MessageCircle,
  Clipboard,
  HeartPulse,
  Brain,
  Eye,
  Ear,
  Tooth,
  Bone,
  Baby,
  Syringe,
  Microscope,
  TestTube,
  Bandage,
  Hospital,
  Ambulance,
  Shield,
  FileChart,
  Report,
  Analytics,
  Wallet,
  CreditCard,
  Banknote,
  Building2,
  Wifi,
  Laptop,
  Mobile,
  Tablet,
  Watch,
  Headphones,
  CalendarClock,
  UserRound,
  UsersRound,
  StethoscopeIcon,
  Thermometer,
  Scale,
  Dumbbell,
  Apple,
  Moon,
  Sun,
  Droplets,
  Wind,
  ZapIcon
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { BarChart } from '@/components/ui/bar-chart'
import { LineChart } from '@/components/ui/line-chart'

interface DoctorDashboardProps {
  userName: string
  userImage?: string
  specialization?: string
}

interface Appointment {
  id: string
  patientName: string
  time: string
  type: 'consultation' | 'follow-up' | 'emergency' | 'surgery' | 'checkup'
  status: 'confirmed' | 'waiting' | 'in-progress' | 'completed' | 'cancelled'
  duration: string
  isTelehealth?: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
  patientAge?: number
  patientGender?: 'M' | 'F' | 'Other'
}

interface Patient {
  id: string
  name: string
  age: number
  lastVisit: string
  condition: string
  status: 'active' | 'inactive' | 'new'
  nextAppointment?: string
  riskLevel: 'low' | 'medium' | 'high'
}

interface Financial {
  weeklyRevenue: number
  monthlyRevenue: number
  pendingPayouts: number
  consultations: number
  procedures: number
  telehealthSessions: number
  averageConsultationFee: number
}

interface PendingItem {
  id: string
  type: 'prescription' | 'lab-order' | 'referral' | 'surgery-schedule' | 'follow-up'
  patientName: string
  details: string
  priority: 'high' | 'medium' | 'low'
  time: string
  dueDate?: string
}

interface Notification {
  id: string
  type: 'system' | 'patient' | 'emergency' | 'admin' | 'pharmacy' | 'lab'
  message: string
  time: string
  priority: 'high' | 'medium' | 'low'
  actionRequired?: boolean
  patientName?: string
}

interface PerformanceMetric {
  name: string
  value: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  icon: any
  color: string
}

interface AppointmentData {
  date: string
  appointments: number
  completed: number
  cancelled: number
  revenue: number
}

interface PatientDemographics {
  ageGroup: string
  count: number
  percentage: number
}

export function DoctorDashboard({ userName, userImage, specialization = 'General Practitioner' }: DoctorDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAvailable, setIsAvailable] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [selectedTimeRange, setSelectedTimeRange] = useState('week')

  // Enhanced mock data for doctor dashboard
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', patientName: 'John Smith', time: '9:00 AM', type: 'consultation', status: 'confirmed', duration: '30 min', isTelehealth: false, priority: 'medium', patientAge: 34, patientGender: 'M' },
    { id: '2', patientName: 'Sarah Johnson', time: '9:30 AM', type: 'follow-up', status: 'confirmed', duration: '20 min', isTelehealth: true, priority: 'low', patientAge: 45, patientGender: 'F' },
    { id: '3', patientName: 'Mike Davis', time: '10:00 AM', type: 'consultation', status: 'waiting', duration: '30 min', isTelehealth: false, priority: 'medium', patientAge: 28, patientGender: 'M' },
    { id: '4', patientName: 'Emily Brown', time: '10:30 AM', type: 'emergency', status: 'confirmed', duration: '45 min', isTelehealth: false, priority: 'critical', patientAge: 52, patientGender: 'F' },
    { id: '5', patientName: 'David Wilson', time: '11:00 AM', type: 'checkup', status: 'confirmed', duration: '30 min', isTelehealth: false, priority: 'low', patientAge: 39, patientGender: 'M' },
    { id: '6', patientName: 'Lisa Garcia', time: '11:30 AM', type: 'consultation', status: 'confirmed', duration: '30 min', isTelehealth: true, priority: 'medium', patientAge: 31, patientGender: 'F' }
  ])

  const [recentPatients, setRecentPatients] = useState<Patient[]>([
    { id: '1', name: 'Alice Cooper', age: 34, lastVisit: '2024-01-10', condition: 'Hypertension', status: 'active', nextAppointment: '2024-01-17', riskLevel: 'medium' },
    { id: '2', name: 'Bob Johnson', age: 45, lastVisit: '2024-01-09', condition: 'Diabetes', status: 'active', nextAppointment: '2024-01-16', riskLevel: 'high' },
    { id: '3', name: 'Carol White', age: 28, lastVisit: '2024-01-08', condition: 'Asthma', status: 'active', nextAppointment: '2024-01-15', riskLevel: 'low' },
    { id: '4', name: 'David Lee', age: 52, lastVisit: '2024-01-07', condition: 'Arthritis', status: 'active', nextAppointment: '2024-01-14', riskLevel: 'medium' },
    { id: '5', name: 'Eva Martinez', age: 39, lastVisit: '2024-01-06', condition: 'Migraine', status: 'inactive', nextAppointment: undefined, riskLevel: 'low' }
  ])

  const [financials, setFinancials] = useState<Financial>({
    weeklyRevenue: 2500,
    monthlyRevenue: 10000,
    pendingPayouts: 750,
    consultations: 45,
    procedures: 8,
    telehealthSessions: 12,
    averageConsultationFee: 85
  })

  const [pendingItems, setPendingItems] = useState<PendingItem[]>([
    { id: '1', type: 'prescription', patientName: 'John Smith', details: 'Antibiotics for infection', priority: 'high', time: '2 hours ago', dueDate: '2024-01-12' },
    { id: '2', type: 'lab-order', patientName: 'Sarah Johnson', details: 'Blood work required', priority: 'medium', time: '3 hours ago', dueDate: '2024-01-13' },
    { id: '3', type: 'referral', patientName: 'Mike Davis', details: 'Refer to cardiologist', priority: 'high', time: '1 day ago', dueDate: '2024-01-14' },
    { id: '4', type: 'surgery-schedule', patientName: 'Emily Brown', details: 'Schedule appendectomy', priority: 'critical', time: '2 days ago', dueDate: '2024-01-15' },
    { id: '5', type: 'follow-up', patientName: 'David Wilson', details: 'Post-op follow up', priority: 'medium', time: '3 days ago', dueDate: '2024-01-16' }
  ])

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'system', message: 'System maintenance scheduled for tonight', time: '10 min ago', priority: 'low', actionRequired: false },
    { id: '2', type: 'patient', message: 'New message from John Smith', time: '30 min ago', priority: 'medium', actionRequired: true, patientName: 'John Smith' },
    { id: '3', type: 'emergency', message: 'Emergency case incoming - ETA 15 minutes', time: '1 hour ago', priority: 'high', actionRequired: true, patientName: 'Emily Brown' },
    { id: '4', type: 'pharmacy', message: 'Prescription ready for pickup', time: '2 hours ago', priority: 'medium', actionRequired: false, patientName: 'Sarah Johnson' },
    { id: '5', type: 'lab', message: 'Lab results available for review', time: '3 hours ago', priority: 'medium', actionRequired: true, patientName: 'Mike Davis' }
  ])

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([
    { name: 'Patient Satisfaction', value: 4.8, target: 4.5, unit: '/5.0', trend: 'up', icon: Star, color: 'yellow' },
    { name: 'Appointment Completion', value: 92, target: 90, unit: '%', trend: 'up', icon: CheckCircle, color: 'green' },
    { name: 'Average Wait Time', value: 12, target: 15, unit: 'min', trend: 'down', icon: Clock, color: 'blue' },
    { name: 'Prescription Accuracy', value: 98, target: 95, unit: '%', trend: 'stable', icon: Pill, color: 'purple' }
  ])

  const [appointmentData, setAppointmentData] = useState<AppointmentData[]>([
    { date: '2024-01-08', appointments: 8, completed: 7, cancelled: 1, revenue: 680 },
    { date: '2024-01-09', appointments: 10, completed: 9, cancelled: 1, revenue: 850 },
    { date: '2024-01-10', appointments: 12, completed: 11, cancelled: 1, revenue: 1020 },
    { date: '2024-01-11', appointments: 9, completed: 8, cancelled: 1, revenue: 765 },
    { date: '2024-01-12', appointments: 11, completed: 10, cancelled: 1, revenue: 935 },
    { date: '2024-01-13', appointments: 13, completed: 12, cancelled: 1, revenue: 1105 },
    { date: '2024-01-14', appointments: 14, completed: 13, cancelled: 1, revenue: 1190 }
  ])

  const [patientDemographics, setPatientDemographics] = useState<PatientDemographics[]>([
    { ageGroup: '0-18', count: 45, percentage: 15 },
    { ageGroup: '19-35', count: 89, percentage: 30 },
    { ageGroup: '36-50', count: 78, percentage: 26 },
    { ageGroup: '51-65', count: 62, percentage: 21 },
    { ageGroup: '65+', count: 26, percentage: 8 }
  ])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastRefresh(new Date())
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const enhancedQuickActions = [
    { 
      name: 'Start Consultation', 
      icon: VideoCamera, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      route: '/dashboard/doctor/consultation',
      description: 'Begin patient session'
    },
    { 
      name: 'Prescribe Meds', 
      icon: Pill, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      route: '/dashboard/doctor/prescriptions',
      description: 'Write prescriptions'
    },
    { 
      name: 'Order Labs', 
      icon: FlaskConical, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      route: '/dashboard/doctor/patients',
      description: 'Request lab tests'
    },
    { 
      name: 'Schedule Surgery', 
      icon: CalendarDays, 
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      route: '/dashboard/doctor/schedule',
      description: 'Book procedures'
    },
    { 
      name: 'View Schedule', 
      icon: CalendarClock, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      route: '/dashboard/doctor/schedule',
      description: 'Manage calendar'
    },
    { 
      name: 'Patient Messages', 
      icon: MessageCircle, 
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      route: '/dashboard/doctor/messages',
      description: 'Check messages'
    },
    { 
      name: 'Update Availability', 
      icon: Settings, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      action: () => setIsAvailable(!isAvailable),
      description: 'Change status'
    },
    { 
      name: 'Generate Reports', 
      icon: FileChart, 
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      route: '/dashboard/doctor/revenue',
      description: 'View analytics'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': case 'completed': case 'active': return 'bg-green-100 text-green-800'
      case 'waiting': case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'cancelled': case 'inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-50 text-red-600 border-red-200'
      case 'consultation': return 'bg-blue-50 text-blue-600 border-blue-200'
      case 'follow-up': return 'bg-purple-50 text-purple-600 border-purple-200'
      case 'surgery': return 'bg-orange-50 text-orange-600 border-orange-200'
      case 'checkup': return 'bg-green-50 text-green-600 border-green-200'
      default: return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': case 'critical': return 'bg-red-50 text-red-600 border-red-200'
      case 'medium': return 'bg-yellow-50 text-yellow-600 border-yellow-200'
      default: return 'bg-blue-50 text-blue-600 border-blue-200'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />
      case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />
      default: return <Activity className="h-3 w-3 text-gray-500" />
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
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  <Stethoscope className="h-3 w-3 mr-1" />
                  {specialization}
                </Badge>
                <span className="text-sm text-gray-500">
                  Updated {lastRefresh.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant={isAvailable ? "destructive" : "default"}
              className="gap-2"
              onClick={() => setIsAvailable(!isAvailable)}
            >
              {isAvailable ? <LogOut className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              {isAvailable ? 'Go Busy' : 'Go Available'}
            </Button>
            <Button variant="outline" className="gap-2">
              <PhoneCall className="h-4 w-4" />
              Emergency
            </Button>
          </div>
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
                <div className="mt-2">
                  <Progress value={(appointments.filter(a => a.status === 'completed').length / appointments.length) * 100} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">{appointments.filter(a => a.status === 'completed').length} completed</p>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-blue-600" />
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
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Wallet className="h-6 w-6 text-green-600" />
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
                  <span className="text-sm text-orange-600">{pendingItems.filter(p => p.priority === 'high').length} urgent</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clipboard className="h-6 w-6 text-orange-600" />
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
              <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Today's Appointments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Appointments */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Today's Appointments
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add New
                  </Button>
                  <Badge variant="outline" className="text-xs">
                    {appointments.filter(a => a.status === 'completed').length}/{appointments.length} Completed
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${getTypeColor(appointment.type)}`}>
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-gray-900">{appointment.patientName}</p>
                          <Badge variant="outline" className="text-xs">
                            {appointment.type}
                          </Badge>
                          {appointment.isTelehealth && (
                            <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                              <Video className="h-2 w-2 mr-1" />
                              Telehealth
                            </Badge>
                          )}
                          <Badge className={getPriorityColor(appointment.priority)}>
                            {appointment.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            {appointment.time}
                          </span>
                          <span>{appointment.duration}</span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {appointment.patientAge}{appointment.patientGender}
                          </span>
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

          {/* Performance Analytics */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Performance Analytics
                </CardTitle>
                <Tabs value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <BarChart
                  data={appointmentData}
                  xAxis="date"
                  yAxis="appointments"
                  color="#3B82F6"
                  title="Daily Appointments"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions & Alerts */}
        <div className="space-y-6">
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
                {enhancedQuickActions.slice(0, 4).map((action, index) => {
                  const Icon = action.icon
                  return (
                    <div key={index} className="p-3 rounded-xl border-2 border-transparent bg-gray-50 hover:border-blue-300 cursor-pointer transition-all duration-300 hover:shadow-md h-full flex flex-col items-center justify-center"
                      onClick={action.route ? () => {} : action.action}>
                      <Icon className={`h-5 w-5 ${action.color} mb-1`} />
                      <p className="text-xs font-medium text-gray-900 text-center">{action.name}</p>
                    </div>
                  )
                })}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {enhancedQuickActions.slice(4, 8).map((action, index) => {
                  const Icon = action.icon
                  return (
                    <div key={index} className="p-3 rounded-xl border-2 border-transparent bg-gray-50 hover:border-blue-300 cursor-pointer transition-all duration-300 hover:shadow-md h-full flex flex-col items-center justify-center"
                      onClick={action.route ? () => {} : action.action}>
                      <Icon className={`h-5 w-5 ${action.color} mb-1`} />
                      <p className="text-xs font-medium text-gray-900 text-center">{action.name}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Critical Alerts */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 overflow-y-auto">
              <div className="space-y-3">
                {notifications.filter(n => n.priority === 'high' || n.priority === 'critical').slice(0, 3).map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-lg border ${getPriorityColor(notification.priority)}`}>
                    <div className="flex items-start space-x-3">
                      <Bell className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{notification.message}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-600">{notification.time}</p>
                          {notification.patientName && (
                            <Badge variant="outline" className="text-xs">
                              {notification.patientName}
                            </Badge>
                          )}
                        </div>
                        {notification.actionRequired && (
                          <Button size="sm" variant="outline" className="mt-2 text-xs">
                            Action Required
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section - Performance Metrics & Patient Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Metrics */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Analytics className="h-5 w-5 text-purple-600" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {performanceMetrics.map((metric) => (
                <div key={metric.name} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <metric.icon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                    </div>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="text-lg font-bold text-gray-900">{metric.value}{metric.unit}</div>
                  <div className="text-xs text-gray-500">Target: {metric.target}{metric.unit}</div>
                  <Progress value={(metric.value / metric.target) * 100} className="h-2 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Patient Demographics */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-blue-600" />
              Patient Demographics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patientDemographics.map((demo) => (
                <div key={demo.ageGroup} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 w-16">{demo.ageGroup}</span>
                    <div className="flex-1">
                      <Progress value={demo.percentage} className="h-2" />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">{demo.count}</span>
                    <span className="text-xs text-gray-500 ml-1">({demo.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Banknote className="h-5 w-5 text-green-600" />
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">${financials.weeklyRevenue.toLocaleString()}</div>
              <p className="text-sm text-gray-600 font-medium">Weekly Revenue</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+12%</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">${financials.monthlyRevenue.toLocaleString()}</div>
              <p className="text-sm text-gray-600 font-medium">Monthly Revenue</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <TrendingUp className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-blue-600">+8%</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">${financials.pendingPayouts.toLocaleString()}</div>
              <p className="text-sm text-gray-600 font-medium">Pending Payouts</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <Clock className="h-3 w-3 text-orange-500" />
                <span className="text-xs text-orange-600">Expected in 3 days</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">${financials.averageConsultationFee}</div>
              <p className="text-sm text-gray-600 font-medium">Avg Consultation Fee</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <TrendingUp className="h-3 w-3 text-purple-500" />
                <span className="text-xs text-purple-600">+5%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}