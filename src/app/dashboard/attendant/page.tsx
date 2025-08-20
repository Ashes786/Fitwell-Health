"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { 
  Users, 
  Calendar, 
  UserCheck, 
  Activity, 
  TrendingUp, 
  Plus,
  ArrowRight,
  Clock,
  CheckCircle
} from "lucide-react"
import { UserRole } from "@prisma/client"

interface Patient {
  id: string
  name: string
  dateOfBirth: string
  gender: string
  lastVisit?: string
  status: string
}

interface Appointment {
  id: string
  appointmentNumber: string
  type: string
  status: string
  scheduledAt: string
  patient: {
    name: string
  }
  consultationFee?: number
}

export default function AttendantDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const { isUnauthorized, isLoading } = useRoleAuthorization({
    requiredRole: UserRole.ATTENDANT,
    showUnauthorizedMessage: false
  })

  if (isLoading) {
    return (
      <DashboardLayout userRole={UserRole.ATTENDANT}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (isUnauthorized) {
    return (
      <DashboardLayout userRole={UserRole.ATTENDANT}>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unauthorized Access</h2>
            <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
            <Button onClick={() => router.push('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Mock data for demonstration
  const recentPatients: Patient[] = [
    {
      id: "1",
      name: "John Smith",
      dateOfBirth: "1985-03-15",
      gender: "MALE",
      lastVisit: "2024-01-10",
      status: "ACTIVE"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      dateOfBirth: "1990-07-22",
      gender: "FEMALE",
      lastVisit: "2024-01-08",
      status: "ACTIVE"
    },
    {
      id: "3",
      name: "Mike Davis",
      dateOfBirth: "1978-11-30",
      gender: "MALE",
      lastVisit: "2024-01-05",
      status: "ACTIVE"
    },
    {
      id: "4",
      name: "Emily Brown",
      dateOfBirth: "1995-04-18",
      gender: "FEMALE",
      status: "NEW"
    }
  ]

  const todayAppointments: Appointment[] = [
    {
      id: "1",
      appointmentNumber: "APT-2024-001",
      type: "GP_CONSULTATION",
      status: "CONFIRMED",
      scheduledAt: "2024-01-15T10:00:00Z",
      patient: {
        name: "John Smith"
      },
      consultationFee: 100
    },
    {
      id: "2",
      appointmentNumber: "APT-2024-002",
      type: "SPECIALIST_CONSULTATION",
      status: "PENDING",
      scheduledAt: "2024-01-15T11:30:00Z",
      patient: {
        name: "Sarah Johnson"
      },
      consultationFee: 200
    },
    {
      id: "3",
      appointmentNumber: "APT-2024-003",
      type: "VIDEO_CONSULTATION",
      status: "CONFIRMED",
      scheduledAt: "2024-01-15T14:00:00Z",
      patient: {
        name: "Mike Davis"
      },
      consultationFee: 150
    }
  ]

  const attendantStats = {
    totalPatients: 248,
    todayAppointments: todayAppointments.length,
    newPatientsThisMonth: 15,
    pendingRegistrations: 3
  }

  const getAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <DashboardLayout userRole={UserRole.ATTENDANT}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session.user?.name?.split(' ')[0] || 'Attendant'}!
            </h1>
            <p className="text-gray-600 mt-2">
              Manage patients and appointments efficiently
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-emerald-100 text-emerald-800">
              On Duty
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Patients
              </CardTitle>
              <Users className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {attendantStats.totalPatients}
              </div>
              <p className="text-xs text-gray-600">
                Active patients
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Today's Appointments
              </CardTitle>
              <Calendar className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {attendantStats.todayAppointments}
              </div>
              <p className="text-xs text-gray-600">
                {todayAppointments.filter(apt => apt.status === "CONFIRMED").length} confirmed
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                New Patients This Month
              </CardTitle>
              <UserCheck className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {attendantStats.newPatientsThisMonth}
              </div>
              <p className="text-xs text-gray-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-emerald-600" />
                +20% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Registrations
              </CardTitle>
              <Activity className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {attendantStats.pendingRegistrations}
              </div>
              <p className="text-xs text-gray-600">
                Require attention
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Patients */}
          <Card className="border-emerald-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Recent Patients
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  onClick={() => router.push("/dashboard/attendant/patients")}
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <UserCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-600">
                        {getAge(patient.dateOfBirth)} years, {patient.gender}
                      </p>
                      {patient.lastVisit && (
                        <p className="text-xs text-gray-500">Last visit: {patient.lastVisit}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge 
                      variant={patient.status === "ACTIVE" ? "default" : "secondary"}
                      className={patient.status === "ACTIVE" 
                        ? "bg-emerald-100 text-emerald-800" 
                        : "bg-blue-100 text-blue-800"
                      }
                    >
                      {patient.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      onClick={() => router.push(`/dashboard/attendant/patients/${patient.id}`)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card className="border-emerald-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Today's Appointments
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  onClick={() => router.push("/dashboard/attendant/appointments")}
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.patient.name}</p>
                      <p className="text-sm text-gray-600">{appointment.type}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(appointment.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge 
                      variant={appointment.status === "CONFIRMED" ? "default" : "secondary"}
                      className={appointment.status === "CONFIRMED" 
                        ? "bg-emerald-100 text-emerald-800" 
                        : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {appointment.status}
                    </Badge>
                    <span className="text-xs text-gray-600">
                      ${appointment.consultationFee}
                    </span>
                  </div>
                </div>
              ))}
              {todayAppointments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No appointments scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks you might want to perform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 h-20 flex-col"
                onClick={() => router.push("/dashboard/attendant/register-patient")}
              >
                <Plus className="h-6 w-6 mb-2" />
                Register Patient
              </Button>
              <Button 
                variant="outline" 
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 h-20 flex-col"
                onClick={() => router.push("/dashboard/attendant/patients")}
              >
                <Users className="h-6 w-6 mb-2" />
                Manage Patients
              </Button>
              <Button 
                variant="outline" 
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 h-20 flex-col"
                onClick={() => router.push("/dashboard/attendant/appointments")}
              >
                <Calendar className="h-6 w-6 mb-2" />
                Appointments
              </Button>
              <Button 
                variant="outline" 
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 h-20 flex-col"
                onClick={() => router.push("/dashboard/attendant/patients")}
              >
                <Activity className="h-6 w-6 mb-2" />
                Patient Records
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}