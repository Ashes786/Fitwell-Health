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
  Plus,
  Filter
} from "lucide-react"
import { UserRole } from "@prisma/client"

interface Appointment {
  id: string
  appointmentNumber: string
  type: string
  status: string
  chiefComplaint?: string
  scheduledAt: string
  doctor?: {
    name: string
    specialization: string
  }
  videoLink?: string
  consultationFee?: number
  paymentStatus: string
}

export default function PatientAppointments() {
  const { isAuthorized, isUnauthorized, isLoading: authLoading, authSession } = useRoleAuthorization({
    requiredRole: "PATIENT",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [appointments, setAppointments] = useState<Appointment[]>([])

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

  // Show unauthorized message if user doesn't have PATIENT role
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
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
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
      case "COMPLETED":
        return "bg-blue-100 text-blue-800"
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
      case "GP_CONSULTATION":
        return "GP Consultation"
      case "SPECIALIST_CONSULTATION":
        return "Specialist Consultation"
      default:
        return type
    }
  }

  const upcomingAppointments = appointments.filter(apt => 
    ["CONFIRMED", "PENDING"].includes(apt.status)
  )
  
  const pastAppointments = appointments.filter(apt => 
    ["COMPLETED", "CANCELLED"].includes(apt.status)
  )

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="border-health-primary/20 bg-gradient-to-br from-white to-health-light/5 shadow-health hover:shadow-health-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-health-primary/20 rounded-lg flex items-center justify-center">
                {getTypeIcon(appointment.type)}
              </div>
              <div className="flex-1">
                <span className="font-semibold text-health-dark">
                  {getTypeDisplay(appointment.type)}
                </span>
                <Badge className={`ml-2 ${getStatusColor(appointment.status)} shadow-health`}>
                  {appointment.status}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3 ml-11">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-health-primary" />
                <span className="text-sm text-health-dark font-medium">
                  {new Date(appointment.scheduledAt).toLocaleDateString()} at {new Date(appointment.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              {appointment.doctor && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-health-blue" />
                  <span className="text-sm text-health-blue font-medium">
                    {appointment.doctor.name} - {appointment.doctor.specialization}
                  </span>
                </div>
              )}
              
              {appointment.chiefComplaint && (
                <div className="text-sm text-health-dark bg-health-light/30 p-2 rounded-lg">
                  <span className="font-semibold text-health-primary">Chief Complaint:</span> {appointment.chiefComplaint}
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-health-dark font-medium">
                  Fee: <span className="text-health-primary">${appointment.consultationFee}</span>
                </span>
                <Badge 
                  variant={appointment.paymentStatus === "PAID" ? "default" : "secondary"}
                  className={appointment.paymentStatus === "PAID" 
                    ? "bg-health-primary text-white shadow-health" 
                    : "bg-health-orange text-white shadow-health"
                  }
                >
                  {appointment.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 ml-4">
            {appointment.videoLink && appointment.status === "CONFIRMED" && (
              <Button 
                size="sm" 
                className="gradient-health hover:shadow-health-lg transition-all duration-300"
                onClick={() => window.open(appointment.videoLink, '_blank')}
              >
                <Video className="mr-2 h-4 w-4" />
                Join Call
              </Button>
            )}
            {appointment.status === "PENDING" && (
              <Button 
                size="sm" 
                variant="outline"
                className="border-health-primary text-health-primary hover:bg-health-light/20"
              >
                View Details
              </Button>
            )}
            {appointment.status === "COMPLETED" && (
              <Button 
                size="sm" 
                variant="outline"
                className="border-health-blue text-health-blue hover:bg-health-blue/10"
              >
                View Report
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 gradient-health rounded-2xl flex items-center justify-center shadow-health">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold gradient-health bg-clip-text text-transparent">Appointments</h1>
                <p className="text-health-dark mt-2 text-lg">
                  Manage your upcoming and past appointments
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="gradient-health hover:shadow-health-lg transition-all duration-300"
              onClick={() => router.push("/dashboard/patient/book-appointment")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
            <Button variant="outline" className="border-health-primary/30 text-health-primary hover:bg-health-light/20">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="bg-gradient-to-r from-health-light/30 to-health-primary/20 p-1 rounded-xl shadow-health">
            <TabsTrigger 
              value="upcoming" 
              className="data-[state=active]:gradient-health data-[state=active]:text-white data-[state=active]:shadow-health transition-all duration-300 rounded-lg"
            >
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger 
              value="past" 
              className="data-[state=active]:gradient-health data-[state=active]:text-white data-[state=active]:shadow-health transition-all duration-300 rounded-lg"
            >
              Past ({pastAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <Card className="border-health-primary/20 bg-gradient-to-br from-white to-health-light/5 shadow-health">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-health-primary/20 rounded-2xl flex items-center justify-center mb-6">
                    <Calendar className="h-8 w-8 text-health-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-health-dark mb-3">
                    No upcoming appointments
                  </h3>
                  <p className="text-health-secondary mb-6 text-center max-w-md">
                    You don't have any upcoming appointments. Book one to get started with your healthcare journey.
                  </p>
                  <Button 
                    className="gradient-health hover:shadow-health-lg transition-all duration-300"
                    onClick={() => router.push("/dashboard/patient/book-appointment")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {pastAppointments.length > 0 ? (
              pastAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <Card className="border-health-primary/20 bg-gradient-to-br from-white to-health-light/5 shadow-health">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-health-secondary/20 rounded-2xl flex items-center justify-center mb-6">
                    <Calendar className="h-8 w-8 text-health-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-health-dark mb-3">
                    No past appointments
                  </h3>
                  <p className="text-health-secondary text-center max-w-md">
                    Your appointment history will appear here once you have completed or cancelled appointments.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    
  )
}