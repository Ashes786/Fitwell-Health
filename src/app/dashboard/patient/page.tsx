"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { 
  Calendar, 
  Heart, 
  FileText, 
  Activity, 
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  Stethoscope,
  Pill,
  Clipboard,
  FlaskConical,
  Building,
  PlusCircle,
  Thermometer
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
    <DashboardLayout userRole={UserRole.PATIENT}>
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

        {/* Quick Actions */}
        <Card className="border border-gray-200 shadow-none">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">Quick Actions</CardTitle>
            <CardDescription className="text-gray-500">Common tasks you can perform quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto p-6 flex flex-col items-center space-y-3 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => router.push("/dashboard/patient/book-appointment")}
              >
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <h3 className="font-medium">Book Appointment</h3>
                  <p className="text-sm text-gray-500">Schedule with your doctor</p>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-6 flex flex-col items-center space-y-3 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => router.push("/dashboard/patient/vitals")}
              >
                <div className="p-3 bg-green-100 rounded-full">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-center">
                  <h3 className="font-medium">Record Vitals</h3>
                  <p className="text-sm text-gray-500">Track your health metrics</p>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-6 flex flex-col items-center space-y-3 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => router.push("/dashboard/patient/directory")}
              >
                <div className="p-3 bg-purple-100 rounded-full">
                  <Building className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-center">
                  <h3 className="font-medium">Find Providers</h3>
                  <p className="text-sm text-gray-500">Search healthcare providers</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

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
                <div className="h-full flex items-end justify-between space-x-3">
                  {[
                    { month: 'Jan', score: 78 },
                    { month: 'Feb', score: 80 },
                    { month: 'Mar', score: 82 },
                    { month: 'Apr', score: 83 },
                    { month: 'May', score: 84 },
                    { month: 'Jun', score: healthStats.healthScore }
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-full rounded-t-lg ${
                          item.score >= 85 ? 'bg-green-500' : 
                          item.score >= 75 ? 'bg-blue-500' : 
                          'bg-yellow-500'
                        }`}
                        style={{ height: `${(item.score / 100) * 100}%` }}
                      ></div>
                      <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Vitals */}
          <Card className="border border-gray-200 shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium text-gray-900">Recent Vitals</CardTitle>
                  <CardDescription className="text-gray-500">Your latest health measurements</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push("/dashboard/patient/vitals")}
                  className="text-gray-600 border-gray-200 hover:bg-gray-100"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentVitals.map((vital, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        vital.type === 'Blood Pressure' ? 'bg-blue-100' :
                        vital.type === 'Heart Rate' ? 'bg-red-100' :
                        'bg-green-100'
                      }`}>
                        {vital.type === 'Blood Pressure' ? (
                          <Activity className="h-4 w-4 text-blue-600" />
                        ) : vital.type === 'Heart Rate' ? (
                          <Heart className="h-4 w-4 text-red-600" />
                        ) : (
                          <Thermometer className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{vital.type}</p>
                        <p className="text-sm text-gray-500">{vital.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {vital.value} <span className="text-sm text-gray-500">{vital.unit}</span>
                      </p>
                      <Badge 
                        variant={vital.status === 'normal' ? 'default' : 'destructive'}
                        className={`text-xs ${
                          vital.status === 'normal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {vital.status === 'normal' ? 'Normal' : 'Attention'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <Card className="border border-gray-200 shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-medium text-gray-900">Upcoming Appointments</CardTitle>
                <CardDescription className="text-gray-500">Your scheduled appointments</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push("/dashboard/patient/appointments")}
                className="text-gray-600 border-gray-200 hover:bg-gray-100"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.type}</p>
                      <p className="text-sm text-gray-600">{appointment.doctor}</p>
                      <p className="text-xs text-gray-500">{appointment.date} at {appointment.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                      className={`${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-gray-600 border-gray-200 hover:bg-gray-100"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}