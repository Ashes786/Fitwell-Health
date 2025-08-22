"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { 
  Calendar, 
  Heart, 
  FileText, 
  Activity, 
  Shield, 
  MessageSquare,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  User,
  Stethoscope,
  Pill,
  Clipboard
} from "lucide-react"
import { UserRole } from "@prisma/client"

export default function PatientDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { isUnauthorized, isLoading } = useRoleAuthorization({
    requiredRole: UserRole.PATIENT,
    showUnauthorizedMessage: false
  })

  // Show loading state while checking authorization or session
  if (isLoading || status === "loading") {
    return (
      
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      
    )
  }

  // Check if user is unauthorized or session is not available
  if (isUnauthorized || !session) {
    return (
      
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unauthorized Access</h2>
            <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
            <Button onClick={() => router.push('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>
      
    )
  }

  // Mock data for demonstration
  const upcomingAppointments = [
    {
      id: "1",
      type: "General Consultation",
      doctor: "Dr. Sarah Johnson",
      date: "2024-01-15",
      time: "10:00 AM",
      status: "confirmed"
    },
    {
      id: "2",
      type: "Follow-up",
      doctor: "Dr. Michael Chen",
      date: "2024-01-18",
      time: "2:30 PM",
      status: "pending"
    }
  ]

  const recentVitals = [
    { type: "Blood Pressure", value: "120/80", unit: "mmHg", date: "2024-01-10", status: "normal" },
    { type: "Heart Rate", value: "72", unit: "bpm", date: "2024-01-10", status: "normal" },
    { type: "Temperature", value: "98.6", unit: "°F", date: "2024-01-09", status: "normal" }
  ]

  const healthStats = {
    appointmentsThisMonth: 3,
    prescriptionsActive: 2,
    labTestsPending: 1,
    healthScore: 85
  }

  return (
    
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
                  onClick={() => router.push("/dashboard/patient/appointments")}
                >
                  <Calendar className="h-4 w-4 mr-3" />
                  Appointments
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => router.push("/dashboard/patient/vitals")}
                >
                  <Heart className="h-4 w-4 mr-3" />
                  Vitals
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => router.push("/dashboard/patient/prescriptions")}
                >
                  <Pill className="h-4 w-4 mr-3" />
                  Prescriptions
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => router.push("/dashboard/patient/health-records")}
                >
                  <Clipboard className="h-4 w-4 mr-3" />
                  Health Records
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => router.push("/dashboard/patient/messages")}
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
                  onClick={() => router.push("/dashboard/patient/book-appointment")}
                >
                  <Calendar className="h-4 w-4 mr-3" />
                  Book Appointment
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-200 text-gray-600 hover:bg-gray-100"
                  onClick={() => router.push("/dashboard/patient/vitals")}
                >
                  <Heart className="h-4 w-4 mr-3" />
                  Record Vitals
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Health Overview</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Health Score</span>
                    <span className="text-sm font-medium text-gray-900">
                      {healthStats.healthScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${healthStats.healthScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Appointments</span>
                    <span className="font-medium text-gray-900">{healthStats.appointmentsThisMonth}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Active Prescriptions</span>
                    <span className="font-medium text-gray-900">{healthStats.prescriptionsActive}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Pending Tests</span>
                    <span className="font-medium text-gray-900">{healthStats.labTestsPending}</span>
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
                <p className="text-gray-500 mt-1">Welcome back, {session?.user?.name?.split(' ')[0] || session?.user?.email?.split('@')[0] || 'Patient'}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  onClick={() => router.push("/dashboard/patient/book-appointment")}
                  className="bg-gray-900 text-white hover:bg-gray-800"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </div>
            </div>

            {/* Health Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border border-gray-200 shadow-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Appointments</p>
                      <p className="text-2xl font-semibold text-gray-900 mt-1">{healthStats.appointmentsThisMonth}</p>
                      <p className="text-xs text-gray-400 mt-2">This month</p>
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
                      <p className="text-sm text-gray-500">Prescriptions</p>
                      <p className="text-2xl font-semibold text-gray-900 mt-1">{healthStats.prescriptionsActive}</p>
                      <p className="text-xs text-gray-400 mt-2">Active</p>
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
                      <p className="text-sm text-gray-500">Lab Tests</p>
                      <p className="text-2xl font-semibold text-gray-900 mt-1">{healthStats.labTestsPending}</p>
                      <p className="text-xs text-gray-400 mt-2">Pending</p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Activity className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Health Score</p>
                      <p className="text-2xl font-semibold text-gray-900 mt-1">{healthStats.healthScore}</p>
                      <p className="text-xs text-green-600 mt-2">Good</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Heart className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Health Score Trend Chart */}
              <Card className="border border-gray-200 shadow-none">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-medium text-gray-900">Health Score Trend</CardTitle>
                      <CardDescription className="text-gray-500">Your health score over time</CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Excellent
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
                    
                    {/* Health score bars with trend */}
                    <div className="h-full flex items-end justify-between space-x-3 relative">
                      {[
                        { month: 'Jan', score: 78, change: '+2', vitals: ['Blood Pressure', 'Heart Rate'] },
                        { month: 'Feb', score: 80, change: '+3', vitals: ['Temperature', 'Weight'] },
                        { month: 'Mar', score: 82, change: '+1', vitals: ['Blood Sugar'] },
                        { month: 'Apr', score: 83, change: '+2', vitals: ['Cholesterol'] },
                        { month: 'May', score: 84, change: '+1', vitals: ['Blood Pressure'] },
                        { month: 'Jun', score: healthStats.healthScore, change: '+1', vitals: ['Heart Rate'] }
                      ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center flex-1 relative">
                          {/* Health score bar */}
                          <div
                            className={`w-full rounded-t transition-all duration-500 hover:shadow-sm ${
                              item.score >= 85 ? 'bg-gradient-to-t from-green-600 to-green-400 hover:from-green-700 hover:to-green-500' :
                              item.score >= 75 ? 'bg-gradient-to-t from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500' :
                              'bg-gradient-to-t from-yellow-600 to-yellow-400 hover:from-yellow-700 hover:to-yellow-500'
                            }`}
                            style={{
                              height: `${(item.score / 100) * 85}%`,
                              minHeight: '8px'
                            }}
                          />
                          {/* Change indicator */}
                          <div className="flex items-center space-x-1 mt-1">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span className="text-xs font-medium text-green-600">
                              {item.change}
                            </span>
                          </div>
                          {/* Score label */}
                          <div className="text-xs font-medium text-gray-700 mt-1">
                            {item.score}
                          </div>
                          <span className="text-xs text-gray-500 mt-1">{item.month}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Trend line overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polyline
                          points="10,35 30,32 50,28 70,25 90,22"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          opacity="0.6"
                        />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Health status indicator */}
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800 font-medium">
                        Your health is improving! Keep up the good work.
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Appointments Trend Chart */}
              <Card className="border border-gray-200 shadow-none">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-medium text-gray-900">Appointment Activity</CardTitle>
                      <CardDescription className="text-gray-500">Your appointment history</CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      Regular Care
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
                        { month: 'Jan', completed: 2, cancelled: 0, upcoming: 0 },
                        { month: 'Feb', completed: 2, cancelled: 1, upcoming: 0 },
                        { month: 'Mar', completed: 1, cancelled: 0, upcoming: 0 },
                        { month: 'Apr', completed: 3, cancelled: 1, upcoming: 0 },
                        { month: 'May', completed: 2, cancelled: 0, upcoming: 0 },
                        { month: 'Jun', completed: 1, cancelled: 0, upcoming: healthStats.appointmentsThisMonth - 1 }
                      ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center flex-1 relative">
                          <div className="flex items-end space-x-1 w-full justify-center">
                            {/* Completed appointments bar */}
                            <div
                              className="w-3/5 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-500 hover:from-blue-700 hover:to-blue-500 shadow-sm"
                              style={{
                                height: `${(item.completed / 3) * 75}%`,
                                minHeight: '8px'
                              }}
                            />
                            {/* Cancelled appointments bar */}
                            <div
                              className="w-1/5 bg-gradient-to-t from-red-500 to-red-300 rounded-t transition-all duration-500 hover:from-red-600 hover:to-red-400 shadow-sm"
                              style={{
                                height: `${(item.cancelled / 1) * 60}%`,
                                minHeight: '4px'
                              }}
                            />
                            {/* Upcoming appointments bar */}
                            <div
                              className="w-1/5 bg-gradient-to-t from-purple-500 to-purple-300 rounded-t transition-all duration-500 hover:from-purple-600 hover:to-purple-400 shadow-sm"
                              style={{
                                height: `${(item.upcoming / 2) * 50}%`,
                                minHeight: '4px'
                              }}
                            />
                          </div>
                          {/* Total appointments label */}
                          <div className="text-xs font-medium text-gray-700 mt-2">
                            {item.completed + item.cancelled + item.upcoming}
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
                      <span className="text-xs text-gray-600">Cancelled</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-sm"></div>
                      <span className="text-xs text-gray-600">Upcoming</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Vitals Tracking */}
              <Card className="border border-gray-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900">Vitals Tracking</CardTitle>
                  <CardDescription>Recent measurements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentVitals.map((vital, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            vital.status === 'normal' ? 'bg-green-100' : 'bg-yellow-100'
                          }`}>
                            <Heart className="h-4 w-4 ${
                              vital.status === 'normal' ? 'text-green-600' : 'text-yellow-600'
                            }" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{vital.type}</p>
                            <p className="text-xs text-gray-500">{vital.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{vital.value}</p>
                          <p className="text-xs text-gray-500">{vital.unit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Medication Adherence */}
              <Card className="border border-gray-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900">Medication Adherence</CardTitle>
                  <CardDescription>This month's progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Overall Adherence</span>
                      <span className="text-sm font-medium text-green-600">94%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: '94%' }} />
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-600">Morning Doses</span>
                      <span className="text-sm font-medium text-blue-600">98%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: '98%' }} />
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-600">Evening Doses</span>
                      <span className="text-sm font-medium text-purple-600">90%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: '90%' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Goals */}
              <Card className="border border-gray-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900">Health Goals</CardTitle>
                  <CardDescription>Progress tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Exercise Goal</p>
                          <p className="text-xs text-gray-500">30 min/day</p>
                        </div>
                      </div>
                      <span className="text-lg font-semibold text-green-600">85%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Water Intake</p>
                          <p className="text-xs text-gray-500">8 glasses/day</p>
                        </div>
                      </div>
                      <span className="text-lg font-semibold text-blue-600">92%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Sleep Quality</p>
                          <p className="text-xs text-gray-500">8 hours/night</p>
                        </div>
                      </div>
                      <span className="text-lg font-semibold text-purple-600">78%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upcoming Appointments */}
              <Card className="border border-gray-200 shadow-none">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-medium text-gray-900">Upcoming Appointments</CardTitle>
                      <CardDescription className="text-gray-500">Your scheduled appointments</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-gray-200 text-gray-600 hover:bg-gray-50"
                      onClick={() => router.push("/dashboard/patient/appointments")}
                    >
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No upcoming appointments</p>
                      <Button 
                        className="mt-4 bg-gray-900 text-white hover:bg-gray-800"
                        onClick={() => router.push("/dashboard/patient/book-appointment")}
                      >
                        Book Appointment
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <Calendar className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{appointment.type}</p>
                              <p className="text-sm text-gray-500">{appointment.doctor}</p>
                              <p className="text-xs text-gray-400">{appointment.date} at {appointment.time}</p>
                            </div>
                          </div>
                          <Badge 
                            variant={appointment.status === "confirmed" ? "default" : "secondary"}
                            className={appointment.status === "confirmed" 
                              ? "bg-green-600 text-white" 
                              : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {appointment.status === "confirmed" ? "Confirmed" : "Pending"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Vitals */}
              <Card className="border border-gray-200 shadow-none">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-medium text-gray-900">Recent Vitals</CardTitle>
                      <CardDescription className="text-gray-500">Latest health measurements</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-gray-200 text-gray-600 hover:bg-gray-50"
                      onClick={() => router.push("/dashboard/patient/vitals")}
                    >
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentVitals.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No vitals recorded</p>
                      <Button 
                        className="mt-4 bg-gray-900 text-white hover:bg-gray-800"
                        onClick={() => router.push("/dashboard/patient/vitals")}
                      >
                        Record Vitals
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentVitals.map((vital, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <Heart className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{vital.type}</p>
                              <p className="text-sm text-gray-500">{vital.value} {vital.unit}</p>
                              <p className="text-xs text-gray-400">{vital.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {vital.status === "normal" ? (
                              <div className="p-1 bg-green-100 rounded-full">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </div>
                            ) : (
                              <div className="p-1 bg-yellow-100 rounded-full">
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                              </div>
                            )}
                            <span className={`text-sm font-medium ${
                              vital.status === "normal" ? "text-green-600" : "text-yellow-600"
                            }`}>
                              {vital.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      <Button 
                        className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50"
                        onClick={() => router.push("/dashboard/patient/vitals")}
                      >
                        Record New Vitals
                      </Button>
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
                    onClick={() => router.push("/dashboard/patient/book-appointment")}
                  >
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium">Book Appointment</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 h-24 flex-col space-y-2"
                    onClick={() => router.push("/dashboard/patient/vitals")}
                  >
                    <Heart className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium">Record Vitals</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 h-24 flex-col space-y-2"
                    onClick={() => router.push("/dashboard/patient/prescriptions")}
                  >
                    <Pill className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium">Prescriptions</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 h-24 flex-col space-y-2"
                    onClick={() => router.push("/dashboard/patient/messages")}
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
    
  )
}