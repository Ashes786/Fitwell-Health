"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Users, 
  FileText, 
  Activity, 
  DollarSign, 
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Stethoscope,
  UserCheck,
  Pill,
  Clipboard,
  Heart
} from "lucide-react"
import { UserRole } from "@prisma/client"

interface Appointment {
  id: string
  appointmentNumber: string
  type: string
  status: string
  chiefComplaint?: string
  scheduledAt: string
  patient: {
    name: string
  }
  consultationFee?: number
}

interface RecentPatient {
  id: string
  name: string
  lastVisit: string
  condition: string
}

export default function DoctorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (session.user?.role !== "DOCTOR") {
      router.push("/dashboard")
      return
    }

    setIsLoading(false)
  }, [session, status, router])

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout userRole={UserRole.DOCTOR}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
  }

  // Mock data for demonstration
  const todayAppointments: Appointment[] = [
    {
      id: "1",
      appointmentNumber: "APT-2024-001",
      type: "Video Consultation",
      status: "CONFIRMED",
      chiefComplaint: "Follow-up for blood pressure",
      scheduledAt: "2024-01-15T10:00:00Z",
      patient: {
        name: "John Smith"
      },
      consultationFee: 150
    },
    {
      id: "2",
      appointmentNumber: "APT-2024-002",
      type: "Specialist Consultation",
      status: "CONFIRMED",
      chiefComplaint: "Skin rash consultation",
      scheduledAt: "2024-01-15T11:30:00Z",
      patient: {
        name: "Sarah Johnson"
      },
      consultationFee: 200
    },
    {
      id: "3",
      appointmentNumber: "APT-2024-003",
      type: "Physical Visit",
      status: "PENDING",
      chiefComplaint: "General checkup",
      scheduledAt: "2024-01-15T14:00:00Z",
      patient: {
        name: "Mike Davis"
      },
      consultationFee: 120
    }
  ]

  const recentPatients: RecentPatient[] = [
    {
      id: "1",
      name: "John Smith",
      lastVisit: "2024-01-10",
      condition: "Hypertension"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      lastVisit: "2024-01-08",
      condition: "Dermatitis"
    },
    {
      id: "3",
      name: "Emily Brown",
      lastVisit: "2024-01-05",
      condition: "Diabetes Type 2"
    },
    {
      id: "4",
      name: "Robert Wilson",
      lastVisit: "2024-01-03",
      condition: "Asthma"
    }
  ]

  const doctorStats = {
    todayAppointments: todayAppointments.length,
    totalPatients: 156,
    pendingPrescriptions: 5,
    monthlyEarnings: 8500
  }

  return (
    <DashboardLayout userRole={UserRole.DOCTOR}>
      <div className="flex h-screen bg-white">
        {/* Sidebar Menu */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">Navigation</h2>
              <nav className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-900 bg-gray-100 hover:bg-gray-200"
                >
                  <Stethoscope className="h-4 w-4 mr-3" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => router.push("/dashboard/doctor/appointments")}
                >
                  <Calendar className="h-4 w-4 mr-3" />
                  Appointments
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => router.push("/dashboard/doctor/patients")}
                >
                  <Users className="h-4 w-4 mr-3" />
                  Patients
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => router.push("/dashboard/doctor/prescriptions")}
                >
                  <Pill className="h-4 w-4 mr-3" />
                  Prescriptions
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => router.push("/dashboard/doctor/messages")}
                >
                  <MessageSquare className="h-4 w-4 mr-3" />
                  Messages
                </Button>
              </nav>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-200 text-gray-600 hover:bg-gray-100"
                  onClick={() => router.push("/dashboard/doctor/appointments")}
                >
                  <Calendar className="h-4 w-4 mr-3" />
                  View Schedule
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-200 text-gray-600 hover:bg-gray-100"
                  onClick={() => router.push("/dashboard/doctor/prescriptions")}
                >
                  <Pill className="h-4 w-4 mr-3" />
                  New Prescription
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Practice Overview</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Today's Appointments</span>
                    <span className="text-sm font-medium text-gray-900">
                      {doctorStats.todayAppointments}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(doctorStats.todayAppointments / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Patients</span>
                    <span className="font-medium text-gray-900">{doctorStats.totalPatients}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Pending Prescriptions</span>
                    <span className="font-medium text-gray-900">{doctorStats.pendingPrescriptions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Monthly Earnings</span>
                    <span className="font-medium text-gray-900">${doctorStats.monthlyEarnings.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-light text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back, Dr. {session.user?.name?.split(' ')[1] || session.user?.name || 'Doctor'}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-green-100 text-green-800">
                  Available
                </Badge>
                <Button 
                  onClick={() => router.push("/dashboard/doctor/appointments")}
                  className="bg-gray-900 text-white hover:bg-gray-800"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedule
                </Button>
              </div>
            </div>

            {/* Doctor Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border border-gray-200 shadow-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Today's Appointments</p>
                      <p className="text-2xl font-semibold text-gray-900 mt-1">{doctorStats.todayAppointments}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {todayAppointments.filter(apt => apt.status === "CONFIRMED").length} confirmed
                      </p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Patients</p>
                      <p className="text-2xl font-semibold text-gray-900 mt-1">{doctorStats.totalPatients}</p>
                      <p className="text-xs text-gray-400 mt-2">Active patients</p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Users className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Pending Prescriptions</p>
                      <p className="text-2xl font-semibold text-gray-900 mt-1">{doctorStats.pendingPrescriptions}</p>
                      <p className="text-xs text-gray-400 mt-2">Require attention</p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Pill className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Monthly Earnings</p>
                      <p className="text-2xl font-semibold text-gray-900 mt-1">${doctorStats.monthlyEarnings.toLocaleString()}</p>
                      <p className="text-xs text-green-600 mt-2 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12% from last month
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Earnings Trend Chart */}
              <Card className="border border-gray-200 shadow-none">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-medium text-gray-900">Earnings Trend</CardTitle>
                      <CardDescription className="text-gray-500">Monthly earnings overview</CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      +12% growth
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64 relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="border-t border-gray-100"></div>
                      ))}
                    </div>
                    
                    {/* Earnings bars with trend */}
                    <div className="h-full flex items-end justify-between space-x-3 relative">
                      {[
                        { month: 'Jan', earnings: doctorStats.monthlyEarnings * 0.7, growth: 8, consultations: 35 },
                        { month: 'Feb', earnings: doctorStats.monthlyEarnings * 0.8, growth: 10, consultations: 42 },
                        { month: 'Mar', earnings: doctorStats.monthlyEarnings * 0.85, growth: 12, consultations: 45 },
                        { month: 'Apr', earnings: doctorStats.monthlyEarnings * 0.9, growth: 9, consultations: 48 },
                        { month: 'May', earnings: doctorStats.monthlyEarnings * 0.95, growth: 15, consultations: 55 },
                        { month: 'Jun', earnings: doctorStats.monthlyEarnings, growth: 18, consultations: 62 }
                      ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center flex-1 relative">
                          {/* Earnings bar */}
                          <div
                            className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all duration-500 hover:from-green-700 hover:to-green-500 shadow-sm"
                            style={{
                              height: `${(item.earnings / doctorStats.monthlyEarnings) * 85}%`,
                              minHeight: '8px'
                            }}
                          />
                          {/* Growth indicator */}
                          <div className="flex items-center space-x-1 mt-1">
                            {item.growth > 12 ? (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : (
                              <TrendingUp className="h-3 w-3 text-yellow-600" />
                            )}
                            <span className={`text-xs font-medium ${item.growth > 12 ? 'text-green-600' : 'text-yellow-600'}`}>
                              +{item.growth}%
                            </span>
                          </div>
                          {/* Value label */}
                          <div className="text-xs font-medium text-gray-700 mt-1">
                            ${(item.earnings / 1000).toFixed(0)}k
                          </div>
                          <span className="text-xs text-gray-500 mt-1">{item.month}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Trend line overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polyline
                          points="10,45 30,40 50,35 70,38 90,25"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          opacity="0.6"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Appointments Trend Chart */}
              <Card className="border border-gray-200 shadow-none">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-medium text-gray-900">Appointments Trend</CardTitle>
                      <CardDescription className="text-gray-500">Monthly appointment statistics</CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      +24% growth
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64 relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="border-t border-gray-100"></div>
                      ))}
                    </div>
                    
                    {/* Combined appointments chart */}
                    <div className="h-full flex items-end justify-between space-x-3 relative">
                      {[
                        { month: 'Jan', completed: 35, cancelled: 5, pending: 5 },
                        { month: 'Feb', completed: 42, cancelled: 4, pending: 6 },
                        { month: 'Mar', completed: 45, cancelled: 3, pending: 7 },
                        { month: 'Apr', completed: 48, cancelled: 6, pending: 4 },
                        { month: 'May', completed: 55, cancelled: 4, pending: 6 },
                        { month: 'Jun', completed: 62, cancelled: 5, pending: 8 }
                      ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center flex-1 relative">
                          <div className="flex items-end space-x-1 w-full justify-center">
                            {/* Completed appointments bar */}
                            <div
                              className="w-3/5 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-500 hover:from-blue-700 hover:to-blue-500 shadow-sm"
                              style={{
                                height: `${(item.completed / 62) * 75}%`,
                                minHeight: '8px'
                              }}
                            />
                            {/* Cancelled + pending appointments bar */}
                            <div
                              className="w-2/5 bg-gradient-to-t from-red-500 to-red-300 rounded-t transition-all duration-500 hover:from-red-600 hover:to-red-400 shadow-sm"
                              style={{
                                height: `${((item.cancelled + item.pending) / 13) * 60}%`,
                                minHeight: '4px'
                              }}
                            />
                          </div>
                          {/* Total appointments label */}
                          <div className="text-xs font-medium text-gray-700 mt-2">
                            {item.completed + item.cancelled + item.pending}
                          </div>
                          <span className="text-xs text-gray-500 mt-1">{item.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-center space-x-6 mt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                      <span className="text-xs text-gray-600">Completed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-sm"></div>
                      <span className="text-xs text-gray-600">Cancelled/Pending</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Patient Satisfaction */}
              <Card className="border border-gray-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900">Patient Satisfaction</CardTitle>
                  <CardDescription>Recent feedback overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Overall Rating</span>
                      <span className="text-sm font-medium text-green-600">4.8/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: '96%' }} />
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-600">Bedside Manner</span>
                      <span className="text-sm font-medium text-blue-600">4.9/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: '98%' }} />
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-600">Wait Time</span>
                      <span className="text-sm font-medium text-purple-600">4.6/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: '92%' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Appointment Types */}
              <Card className="border border-gray-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900">Appointment Types</CardTitle>
                  <CardDescription>This month's distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { type: 'Video Consultation', count: 35, percentage: 56, color: 'bg-blue-500' },
                      { type: 'Physical Visit', count: 20, percentage: 32, color: 'bg-green-500' },
                      { type: 'Follow-up', count: 7, percentage: 12, color: 'bg-purple-500' }
                    ].map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700">{item.type}</span>
                          <span className="text-xs text-gray-500">{item.count} ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${item.color}`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border border-gray-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900">Practice Stats</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Completion Rate</p>
                          <p className="text-xs text-gray-500">This month</p>
                        </div>
                      </div>
                      <span className="text-lg font-semibold text-green-600">89%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Avg. Consult</p>
                          <p className="text-xs text-gray-500">Duration</p>
                        </div>
                      </div>
                      <span className="text-lg font-semibold text-blue-600">25m</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Revenue Growth</p>
                          <p className="text-xs text-gray-500">vs last month</p>
                        </div>
                      </div>
                      <span className="text-lg font-semibold text-purple-600">+12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Today's Appointments */}
              <Card className="border border-gray-200 shadow-none">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-medium text-gray-900">Today's Schedule</CardTitle>
                      <CardDescription className="text-gray-500">Your appointments for today</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-gray-200 text-gray-600 hover:bg-gray-50"
                      onClick={() => router.push("/dashboard/doctor/appointments")}
                    >
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {todayAppointments.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No appointments scheduled for today</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {todayAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <Calendar className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{appointment.patient.name}</p>
                              <p className="text-sm text-gray-500">{appointment.chiefComplaint}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(appointment.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge 
                              variant={appointment.status === "CONFIRMED" ? "default" : "secondary"}
                              className={appointment.status === "CONFIRMED" 
                                ? "bg-green-600 text-white" 
                                : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {appointment.status === "CONFIRMED" ? "Confirmed" : "Pending"}
                            </Badge>
                            <span className="text-xs text-gray-600">
                              ${appointment.consultationFee}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Patients */}
              <Card className="border border-gray-200 shadow-none">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-medium text-gray-900">Recent Patients</CardTitle>
                      <CardDescription className="text-gray-500">Your latest patient visits</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-gray-200 text-gray-600 hover:bg-gray-50"
                      onClick={() => router.push("/dashboard/doctor/patients")}
                    >
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentPatients.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No recent patients</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentPatients.map((patient) => (
                        <div key={patient.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <UserCheck className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{patient.name}</p>
                              <p className="text-sm text-gray-500">{patient.condition}</p>
                              <p className="text-xs text-gray-400">Last visit: {patient.lastVisit}</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-gray-200 text-gray-600 hover:bg-gray-50"
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border border-gray-200 shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium text-gray-900">Quick Actions</CardTitle>
                <CardDescription className="text-gray-500">Common tasks you might want to perform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 h-24 flex-col space-y-2"
                    onClick={() => router.push("/dashboard/doctor/appointments")}
                  >
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium">Appointments</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 h-24 flex-col space-y-2"
                    onClick={() => router.push("/dashboard/doctor/prescriptions")}
                  >
                    <Pill className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium">Prescriptions</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 h-24 flex-col space-y-2"
                    onClick={() => router.push("/dashboard/doctor/patients")}
                  >
                    <Users className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium">Patients</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 h-24 flex-col space-y-2"
                    onClick={() => router.push("/dashboard/doctor/messages")}
                  >
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium">Messages</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}