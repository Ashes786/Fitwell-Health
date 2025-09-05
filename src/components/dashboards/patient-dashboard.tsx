'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
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
  Thermometer,
  Droplets,
  Ambulance,
  HeartPulse,
  Scale,
  Bone,
  Eye,
  Tooth,
  Brain,
  Dumbbell,
  Apple,
  Moon,
  Sun,
  Wifi,
  Monitor,
  MessageCircle,
  Map,
  Car,
  Building2,
  Users,
  HeartHandshake,
  ShieldCheck,
  ScanLine,
  Microscope,
  TestTube,
  Bandage,
  Pill as Capsule,
  Hospital,
  ClipboardList,
  CalendarDays,
  BarChart3,
  PieChart,
  Wind
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { LineChart } from '@/components/ui/line-chart'
import { BarChart } from '@/components/ui/bar-chart'

interface PatientDashboardProps {
  userName: string
  userImage?: string
  userEmail?: string
  userPhone?: string
}

interface Appointment {
  id: string
  type: 'GP' | 'Specialist' | 'Emergency' | 'Follow-up'
  doctor: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  duration: string
  location?: string
  isTelehealth?: boolean
}

interface Vital {
  type: string
  value: string
  unit: string
  trend: 'up' | 'down' | 'normal'
  date: string
  icon: any
  category: 'cardiovascular' | 'metabolic' | 'vital' | 'other'
}

interface Prescription {
  id: string
  name: string
  dosage: string
  frequency: string
  refills: number
  status: 'active' | 'completed' | 'expired'
  adherence: number
  nextDose?: string
  instructions?: string
}

interface HealthRecord {
  id: string
  type: string
  date: string
  doctor: string
  status: 'completed' | 'pending' | 'reviewed'
  results?: string
  category: 'lab' | 'imaging' | 'consultation' | 'procedure'
}

interface Notification {
  id: string
  type: 'pill' | 'hydration' | 'lab' | 'appointment' | 'exercise' | 'nutrition'
  message: string
  time: string
  priority: 'high' | 'medium' | 'low'
  actionRequired?: boolean
}

interface HealthMetric {
  name: string
  value: number
  target: number
  unit: string
  trend: 'improving' | 'stable' | 'declining'
  icon: any
  color: string
}

interface ActivityData {
  date: string
  steps: number
  exercise: number
  sleep: number
  calories: number
}

export function PatientDashboard({ userName, userImage, userEmail, userPhone }: PatientDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [selectedTimeRange, setSelectedTimeRange] = useState('week')

  // Enhanced mock data for patient dashboard
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', type: 'GP', doctor: 'Dr. Sarah Johnson', date: '2024-01-15', time: '10:00 AM', status: 'confirmed', duration: '30 min', location: 'Main Clinic', isTelehealth: false },
    { id: '2', type: 'Specialist', doctor: 'Dr. Michael Chen', date: '2024-01-18', time: '2:30 PM', status: 'confirmed', duration: '45 min', location: 'Cardiology Dept', isTelehealth: true },
    { id: '3', type: 'Follow-up', doctor: 'Dr. Emily Davis', date: '2024-01-22', time: '11:00 AM', status: 'pending', duration: '20 min', location: 'Telehealth', isTelehealth: true }
  ])

  const [vitals, setVitals] = useState<Vital[]>([
    { type: 'Blood Pressure', value: '120/80', unit: 'mmHg', trend: 'normal', date: '2024-01-10', icon: Activity, category: 'cardiovascular' },
    { type: 'Heart Rate', value: '72', unit: 'bpm', trend: 'normal', date: '2024-01-10', icon: Heart, category: 'cardiovascular' },
    { type: 'Temperature', value: '98.6', unit: '°F', trend: 'normal', date: '2024-01-10', icon: Thermometer, category: 'vital' },
    { type: 'Blood Sugar', value: '95', unit: 'mg/dL', trend: 'down', date: '2024-01-10', icon: Droplets, category: 'metabolic' },
    { type: 'Oxygen Saturation', value: '98', unit: '%', trend: 'normal', date: '2024-01-10', icon: Wind, category: 'vital' },
    { type: 'Weight', value: '165', unit: 'lbs', trend: 'down', date: '2024-01-10', icon: Scale, category: 'other' }
  ])

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { id: '1', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', refills: 2, status: 'active', adherence: 95, nextDose: '8:00 PM', instructions: 'Take with food' },
    { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', refills: 1, status: 'active', adherence: 88, nextDose: '9:00 AM', instructions: 'Take with meals' },
    { id: '3', name: 'Vitamin D', dosage: '1000 IU', frequency: 'Once daily', refills: 0, status: 'active', adherence: 92, nextDose: '12:00 PM', instructions: 'Take with lunch' },
    { id: '4', name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', refills: 3, status: 'active', adherence: 100, nextDose: '8:00 PM', instructions: 'Take before bed' }
  ])

  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([
    { id: '1', type: 'Complete Blood Count', date: '2024-01-10', doctor: 'Lab Corp', status: 'completed', results: 'Normal', category: 'lab' },
    { id: '2', type: 'Chest X-Ray', date: '2024-01-08', doctor: 'Radiology Dept', status: 'reviewed', results: 'Clear', category: 'imaging' },
    { id: '3', type: 'Cardiology Consultation', date: '2024-01-05', doctor: 'Dr. Michael Chen', status: 'completed', category: 'consultation' },
    { id: '4', type: 'Lipid Panel', date: '2024-01-03', doctor: 'Lab Corp', status: 'pending', category: 'lab' }
  ])

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'pill', message: 'Take Lisinopril - 10mg', time: '8:00 PM', priority: 'high', actionRequired: true },
    { id: '2', type: 'hydration', message: 'Drink 8oz of water', time: '10:00 AM', priority: 'medium', actionRequired: false },
    { id: '3', type: 'lab', message: 'Fasting required for tomorrow\'s blood test', time: '2:00 PM', priority: 'high', actionRequired: true },
    { id: '4', type: 'appointment', message: 'Telehealth appointment with Dr. Chen', time: '2:30 PM', priority: 'medium', actionRequired: true },
    { id: '5', type: 'exercise', message: '30-minute walk recommended', time: '6:00 PM', priority: 'low', actionRequired: false }
  ])

  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    { name: 'Daily Steps', value: 8500, target: 10000, unit: 'steps', trend: 'improving', icon: Dumbbell, color: 'blue' },
    { name: 'Sleep Hours', value: 7.5, target: 8, unit: 'hours', trend: 'stable', icon: Moon, color: 'purple' },
    { name: 'Water Intake', value: 6, target: 8, unit: 'glasses', trend: 'declining', icon: Droplets, color: 'cyan' },
    { name: 'Exercise Minutes', value: 45, target: 60, unit: 'min', trend: 'improving', icon: Dumbbell, color: 'green' }
  ])

  const [activityData, setActivityData] = useState<ActivityData[]>([
    { date: '2024-01-08', steps: 7200, exercise: 30, sleep: 7.2, calories: 2100 },
    { date: '2024-01-09', steps: 8500, exercise: 45, sleep: 6.8, calories: 2300 },
    { date: '2024-01-10', steps: 9200, exercise: 60, sleep: 7.5, calories: 2450 },
    { date: '2024-01-11', steps: 6800, exercise: 20, sleep: 8.1, calories: 1950 },
    { date: '2024-01-12', steps: 10500, exercise: 75, sleep: 7.0, calories: 2600 },
    { date: '2024-01-13', steps: 8900, exercise: 50, sleep: 7.8, calories: 2250 },
    { date: '2024-01-14', steps: 7600, exercise: 35, sleep: 6.5, calories: 2000 }
  ])

  const [aiInsight, setAiInsight] = useState({
    score: 85,
    message: 'Your overall health is good. Keep up with your medication schedule and stay hydrated.',
    recommendations: ['Continue current medications', 'Increase water intake', 'Schedule next checkup', 'Add 15 minutes to daily exercise'],
    riskFactors: ['Mild dehydration', 'Occasional sleep disruption'],
    strengths: ['Excellent medication adherence', 'Consistent exercise routine', 'Good vital signs']
  })

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
      name: 'Book GP', 
      icon: Stethoscope, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      route: '/dashboard/patient/book-appointment',
      description: 'Schedule general practitioner'
    },
    { 
      name: 'Book Specialist', 
      icon: User, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      route: '/dashboard/patient/book-appointment',
      description: 'See a specialist doctor'
    },
    { 
      name: 'Telehealth', 
      icon: Video, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      route: '/dashboard/patient/book-appointment',
      description: 'Virtual consultation'
    },
    { 
      name: 'Emergency', 
      icon: Ambulance, 
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      route: '/dashboard/patient/book-appointment',
      description: 'Urgent care needed'
    },
    { 
      name: 'Upload Record', 
      icon: FileText, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      route: '/dashboard/patient/health-records',
      description: 'Add medical documents'
    },
    { 
      name: 'Order Meds', 
      icon: Capsule, 
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      route: '/dashboard/patient/prescriptions',
      description: 'Refill prescriptions'
    },
    { 
      name: 'HealthPay', 
      icon: CreditCard, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      route: '/dashboard/patient/health-card',
      description: 'Manage health card'
    },
    { 
      name: 'AI Reports', 
      icon: Brain, 
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      route: '/dashboard/patient/ai-reports',
      description: 'AI health analysis'
    }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': case 'declining': return <TrendingUp className="h-3 w-3 text-red-500" />
      case 'down': case 'improving': return <TrendingDown className="h-3 w-3 text-green-500" />
      default: return <Activity className="h-3 w-3 text-gray-500" />
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'pill': return <Capsule className="h-4 w-4" />
      case 'hydration': return <Droplets className="h-4 w-4" />
      case 'lab': return <TestTube className="h-4 w-4" />
      case 'appointment': return <Calendar className="h-4 w-4" />
      case 'exercise': return <Dumbbell className="h-4 w-4" />
      case 'nutrition': return <Apple className="h-4 w-4" />
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': case 'completed': case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': case 'expired': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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
              <div className="mt-2 flex items-center space-x-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Shield className="h-3 w-3 mr-1" />
                  NHR: NHS-123456789
                </Badge>
                <Badge variant="outline" className="border-green-200 text-green-700">
                  <HeartPulse className="h-3 w-3 mr-1" />
                  Active Patient
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="gap-2">
              <CreditCard className="h-4 w-4" />
              HealthPay Card
            </Button>
            <Button className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact Doctor
            </Button>
          </div>
        </div>
      </div>

      {/* Health Score Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                <Heart className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Your Health Score</h2>
                <p className="text-blue-100">{aiInsight.message}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">+5% from last month</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4" />
                    <span className="text-sm">Top 15% of patients</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-6xl font-bold mb-2">{aiInsight.score}%</div>
              <div className="flex items-center justify-end space-x-2 text-blue-100">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">Excellent Health</span>
              </div>
              <Progress value={aiInsight.score} className="w-32 mt-2 bg-white/20" />
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
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Capsule className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{prescriptions.filter(p => p.status === 'active').length}</p>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-purple-600">Prescriptions</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Pill className="h-6 w-6 text-purple-600" />
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
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-green-600" />
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
                  <p className="text-sm font-medium text-gray-600">Action Required</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{notifications.filter(n => n.actionRequired).length}</p>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-orange-600">Reminders</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Bell className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Appointments & Vitals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointments */}
          <Card className="border-0 shadow-lg bg-white h-full">
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
            <CardContent className="h-64 overflow-y-auto">
              <div className="space-y-4">
                {appointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${appointment.type === 'GP' ? 'bg-blue-50' : appointment.type === 'Specialist' ? 'bg-purple-50' : appointment.type === 'Emergency' ? 'bg-red-50' : 'bg-green-50'}`}>
                        <Stethoscope className={`h-5 w-5 ${appointment.type === 'GP' ? 'text-blue-600' : appointment.type === 'Specialist' ? 'text-purple-600' : appointment.type === 'Emergency' ? 'text-red-600' : 'text-green-600'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-gray-900">{appointment.doctor}</p>
                          <Badge variant="outline" className="text-xs">
                            {appointment.type}
                          </Badge>
                          {appointment.isTelehealth && (
                            <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                              <Video className="h-2 w-2 mr-1" />
                              Telehealth
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {appointment.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {appointment.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {appointment.location}
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

          {/* Health Metrics Chart */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Health Metrics
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
                <LineChart
                  data={activityData.map(item => ({ label: item.date, value: item.steps }))}
                  lineColor="#3B82F6"
                  title="Daily Steps"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions & Notifications */}
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
                    <Link key={index} href={action.route}>
                      <div className={`p-3 rounded-xl border-2 border-transparent ${action.bgColor} hover:border-blue-300 cursor-pointer transition-all duration-300 hover:shadow-md h-full flex flex-col items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${action.color} mb-1`} />
                        <p className="text-xs font-medium text-gray-900 text-center">{action.name}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {enhancedQuickActions.slice(4, 8).map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link key={index} href={action.route}>
                      <div className={`p-3 rounded-xl border-2 border-transparent ${action.bgColor} hover:border-blue-300 cursor-pointer transition-all duration-300 hover:shadow-md h-full flex flex-col items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${action.color} mb-1`} />
                        <p className="text-xs font-medium text-gray-900 text-center">{action.name}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Health Reminders */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-red-600" />
                Health Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 overflow-y-auto">
              <div className="space-y-3">
                {notifications.slice(0, 4).map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-lg border ${getNotificationColor(notification.priority)}`}>
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{notification.message}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.time}</p>
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

      {/* Bottom Section - Vitals & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Vitals Monitoring */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-red-600" />
              Vitals Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {vitals.slice(0, 4).map((vital) => (
                <div key={vital.type} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <vital.icon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{vital.type}</span>
                    </div>
                    {getTrendIcon(vital.trend)}
                  </div>
                  <div className="text-lg font-bold text-gray-900">{vital.value}</div>
                  <div className="text-xs text-gray-500">{vital.unit}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Medication Adherence */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Capsule className="h-5 w-5 text-purple-600" />
              Medication Adherence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prescriptions.slice(0, 3).map((prescription) => (
                <div key={prescription.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-gray-900">{prescription.name}</p>
                      <Badge variant="outline" className="text-xs">{prescription.dosage}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{prescription.frequency}</p>
                    <p className="text-xs text-gray-500 mt-1">Next dose: {prescription.nextDose}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{prescription.adherence}%</div>
                    <Progress value={prescription.adherence} className="w-16 mt-1" />
                    <div className="text-xs text-gray-500 mt-1">{prescription.refills} refills</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Health Insights */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Health Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{aiInsight.score}%</div>
              <p className="text-sm text-gray-600 font-medium">Health Score</p>
              <Progress value={aiInsight.score} className="w-full mt-2" />
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-900 mb-4 text-base">{aiInsight.message}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Recommendations:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {aiInsight.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Strengths:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {aiInsight.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Star className="h-3 w-3 text-yellow-600" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}