"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Video, 
  Phone, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Stethoscope,
  UserCheck,
  Filter,
  ArrowRight,
  MessageSquare
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
    id: string
  }
  consultationFee?: number
  paymentStatus: string
  videoLink?: string
}

export default function DoctorAppointments() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const { isAuthorized, isUnauthorized, isLoading: authLoading, authSession } = useRoleAuthorization({
    requiredRole: "DOCTOR",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })

  useEffect(() => {
    if (isAuthorized) {
      // Original fetch logic will be handled separately
    }
  }, [isAuthorized])

  if (authLoading) {
    return (
      
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      
    )
  }

  if (!authSession) {
    return null
  }

  // Show unauthorized message if user doesn't have DOCTOR role
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "IN_PROGRESS":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-100 text-emerald-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO_CONSULTATION":
        return <Video className="h-4 w-4" />
      case "PHONE_CONSULTATION":
        return <Phone className="h-4 w-4" />
      case "PHYSICAL_VISIT":
        return <Stethoscope className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getTypeDisplay = (type: string) => {
    switch (type) {
      case "VIDEO_CONSULTATION":
        return "Video Consultation"
      case "PHONE_CONSULTATION":
        return "Phone Consultation"
      case "PHYSICAL_VISIT":
        return "Physical Visit"
      case "GP_CONSULTATION":
        return "GP Consultation"
      case "SPECIALIST_CONSULTATION":
        return "Specialist Consultation"
      default:
        return type
    }
  }

  const todayAppointments = appointments.filter(apt => 
    new Date(apt.scheduledAt).toDateString() === new Date().toDateString()
  )
  
  const upcomingAppointments = appointments.filter(apt => 
    ["CONFIRMED", "PENDING"].includes(apt.status) && 
    new Date(apt.scheduledAt) > new Date()
  )
  
  const pastAppointments = appointments.filter(apt => 
    ["COMPLETED", "CANCELLED"].includes(apt.status)
  )

  const AppointmentCard = ({ appointment, showActions = true }: { appointment: Appointment, showActions?: boolean }) => (
    <Card className="border-emerald-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getTypeIcon(appointment.type)}
              <span className="font-medium text-gray-900">
                {getTypeDisplay(appointment.type)}
              </span>
              <Badge className={getStatusColor(appointment.status)}>
                {appointment.status}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Patient: {appointment.patient.name}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {new Date(appointment.scheduledAt).toLocaleDateString()} at {new Date(appointment.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              {appointment.chiefComplaint && (
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Chief Complaint:</span> {appointment.chiefComplaint}
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Fee: ${appointment.consultationFee}
                </span>
                <Badge 
                  variant={appointment.paymentStatus === "PAID" ? "default" : "secondary"}
                  className={appointment.paymentStatus === "PAID" 
                    ? "bg-emerald-100 text-emerald-800" 
                    : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {appointment.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>
          
          {showActions && (
            <div className="flex flex-col space-y-2 ml-4">
              {appointment.videoLink && appointment.status === "CONFIRMED" && (
                <Button 
                  size="sm" 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => window.open(appointment.videoLink, '_blank')}
                >
                  Join Call
                </Button>
              )}
              
              {appointment.status === "CONFIRMED" && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  onClick={() => router.push(`/dashboard/doctor/patients/${appointment.patient.id}`)}
                >
                  View Patient
                </Button>
              )}
              
              {appointment.status === "IN_PROGRESS" && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  onClick={() => {
                    // Mark as completed
                    const updatedAppointments = appointments.map(apt => 
                      apt.id === appointment.id 
                        ? { ...apt, status: "COMPLETED" as const }
                        : apt
                    )
                    setAppointments(updatedAppointments)
                  }}
                >
                  Complete
                </Button>
              )}
              
              {appointment.status === "PENDING" && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  onClick={() => {
                    // Accept appointment
                    const updatedAppointments = appointments.map(apt => 
                      apt.id === appointment.id 
                        ? { ...apt, status: "CONFIRMED" as const }
                        : apt
                    )
                    setAppointments(updatedAppointments)
                  }}
                >
                  Accept
                </Button>
              )}
              
              <Button 
                size="sm" 
                variant="ghost"
                className="text-emerald-600 hover:bg-emerald-50"
                onClick={() => router.push(`/dashboard/doctor/messages?patient=${appointment.patient.id}`)}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-2">
              Manage your patient appointments and schedule
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Calendar className="mr-2 h-4 w-4" />
              Set Availability
            </Button>
          </div>
        </div>

        <Tabs defaultValue="today" className="space-y-4">
          <TabsList className="bg-emerald-100">
            <TabsTrigger 
              value="today" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Today ({todayAppointments.length})
            </TabsTrigger>
            <TabsTrigger 
              value="upcoming" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger 
              value="past" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Past ({pastAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No appointments today
                  </h3>
                  <p className="text-gray-600 text-center">
                    You have no appointments scheduled for today.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No upcoming appointments
                  </h3>
                  <p className="text-gray-600 text-center">
                    You have no upcoming appointments scheduled.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastAppointments.length > 0 ? (
              pastAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} showActions={false} />
              ))
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No past appointments
                  </h3>
                  <p className="text-gray-600 text-center">
                    Your appointment history will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    
  )
}