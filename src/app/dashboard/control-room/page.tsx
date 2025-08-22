"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { 
  Monitor, 
  Calendar, 
  Stethoscope, 
  Users, 
  AlertCircle, 
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Phone,
  Video,
  UserCheck,
  ArrowRight,
  RefreshCw
} from "lucide-react"
import { UserRole } from "@prisma/client"

interface GPAppointment {
  id: string
  appointmentNumber: string
  status: string
  chiefComplaint: string
  scheduledAt: string
  patient: {
    name: string
    phone: string
  }
  estimatedDuration: number
  priority: string
}

interface Doctor {
  id: string
  name: string
  specialization: string
  status: string
  currentLoad: number
  maxLoad: number
}

export default function ControlRoomDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const { isUnauthorized, isLoading } = useRoleAuthorization({
    requiredRole: UserRole.CONTROL_ROOM,
    showUnauthorizedMessage: false
  })
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const refreshData = () => {
    setLastRefresh(new Date())
  }

  if (isLoading) {
    return (
      
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      
    )
  }

  if (isUnauthorized) {
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
  const pendingGPAppointments: GPAppointment[] = [
    {
      id: "1",
      appointmentNumber: "APT-2024-001",
      status: "PENDING",
      chiefComplaint: "Fever and headache for 2 days",
      scheduledAt: "2024-01-15T10:00:00Z",
      patient: {
        name: "John Smith",
        phone: "+1-555-0123"
      },
      estimatedDuration: 15,
      priority: "MEDIUM"
    },
    {
      id: "2",
      appointmentNumber: "APT-2024-002",
      status: "PENDING",
      chiefComplaint: "Chest pain and shortness of breath",
      scheduledAt: "2024-01-15T10:15:00Z",
      patient: {
        name: "Sarah Johnson",
        phone: "+1-555-0124"
      },
      estimatedDuration: 20,
      priority: "HIGH"
    },
    {
      id: "3",
      appointmentNumber: "APT-2024-003",
      status: "PENDING",
      chiefComplaint: "Skin rash and itching",
      scheduledAt: "2024-01-15T10:30:00Z",
      patient: {
        name: "Mike Davis",
        phone: "+1-555-0125"
      },
      estimatedDuration: 15,
      priority: "LOW"
    }
  ]

  const availableDoctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. Emily Chen",
      specialization: "General Practitioner",
      status: "AVAILABLE",
      currentLoad: 2,
      maxLoad: 8
    },
    {
      id: "2",
      name: "Dr. Robert Wilson",
      specialization: "General Practitioner",
      status: "AVAILABLE",
      currentLoad: 1,
      maxLoad: 8
    },
    {
      id: "3",
      name: "Dr. Lisa Anderson",
      specialization: "General Practitioner",
      status: "BUSY",
      currentLoad: 6,
      maxLoad: 8
    },
    {
      id: "4",
      name: "Dr. James Brown",
      specialization: "General Practitioner",
      status: "AVAILABLE",
      currentLoad: 3,
      maxLoad: 8
    }
  ]

  const controlRoomStats = {
    pendingAppointments: pendingGPAppointments.length,
    availableDoctors: availableDoctors.filter(d => d.status === "AVAILABLE").length,
    highPriorityCases: pendingGPAppointments.filter(a => a.priority === "HIGH").length,
    avgWaitTime: 8
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800"
      case "LOW":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDoctorStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-100 text-emerald-800"
      case "BUSY":
        return "bg-yellow-100 text-yellow-800"
      case "OFFLINE":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDoctorLoadPercentage = (doctor: Doctor) => {
    return Math.round((doctor.currentLoad / doctor.maxLoad) * 100)
  }

  const assignDoctor = (appointmentId: string, doctorId: string) => {
    // In a real app, this would call an API
    console.log(`Assigning doctor ${doctorId} to appointment ${appointmentId}`)
    refreshData()
  }

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Control Room</h1>
            <p className="text-gray-600 mt-2">
              Monitor and manage GP appointments in real-time
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
            <Button 
              variant="outline" 
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              onClick={refreshData}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Appointments
              </CardTitle>
              <Clock className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {controlRoomStats.pendingAppointments}
              </div>
              <p className="text-xs text-gray-600">
                Waiting for assignment
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Available Doctors
              </CardTitle>
              <Stethoscope className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {controlRoomStats.availableDoctors}
              </div>
              <p className="text-xs text-gray-600">
                Ready for assignment
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                High Priority Cases
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {controlRoomStats.highPriorityCases}
              </div>
              <p className="text-xs text-gray-600">
                Require immediate attention
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Wait Time
              </CardTitle>
              <Activity className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {controlRoomStats.avgWaitTime} min
              </div>
              <p className="text-xs text-gray-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-emerald-600" />
                Within target
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending GP Appointments */}
          <Card className="border-emerald-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Pending GP Appointments
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  onClick={() => router.push("/dashboard/control-room/gp-appointments")}
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingGPAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">{appointment.patient.name}</span>
                      <Badge className={getPriorityColor(appointment.priority)}>
                        {appointment.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{appointment.chiefComplaint}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>📞 {appointment.patient.phone}</span>
                      <span>⏱️ {appointment.estimatedDuration} min</span>
                      <span>🕐 {new Date(appointment.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button 
                      size="sm" 
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => router.push(`/dashboard/control-room/doctor-assignment?appointment=${appointment.id}`)}
                    >
                      Assign Doctor
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                  </div>
                </div>
              ))}
              {pendingGPAppointments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-emerald-600" />
                  <p>All appointments assigned!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Doctors */}
          <Card className="border-emerald-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Available Doctors
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  onClick={() => router.push("/dashboard/control-room/doctor-assignment")}
                >
                  Manage
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableDoctors.map((doctor) => {
                const loadPercentage = getDoctorLoadPercentage(doctor)
                return (
                  <div key={doctor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">{doctor.name}</span>
                        <Badge className={getDoctorStatusColor(doctor.status)}>
                          {doctor.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Current Load</span>
                          <span>{doctor.currentLoad}/{doctor.maxLoad}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              loadPercentage > 80 ? 'bg-red-500' : 
                              loadPercentage > 60 ? 'bg-yellow-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${loadPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      {doctor.status === "AVAILABLE" && (
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => router.push(`/dashboard/control-room/doctor-assignment?doctor=${doctor.id}`)}
                        >
                          Assign
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Video
                      </Button>
                    </div>
                  </div>
                )
              })}
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
              Common control room tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 h-20 flex-col"
                onClick={() => router.push("/dashboard/control-room/gp-appointments")}
              >
                <Calendar className="h-6 w-6 mb-2" />
                GP Appointments
              </Button>
              <Button 
                variant="outline" 
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 h-20 flex-col"
                onClick={() => router.push("/dashboard/control-room/doctor-assignment")}
              >
                <Stethoscope className="h-6 w-6 mb-2" />
                Assign Doctors
              </Button>
              <Button 
                variant="outline" 
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 h-20 flex-col"
                onClick={() => router.push("/dashboard/control-room/monitor")}
              >
                <Monitor className="h-6 w-6 mb-2" />
                Monitor
              </Button>
              <Button 
                variant="outline" 
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 h-20 flex-col"
                onClick={() => router.push("/dashboard/control-room/monitor")}
              >
                <AlertCircle className="h-6 w-6 mb-2" />
                Escalations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    
  )
}