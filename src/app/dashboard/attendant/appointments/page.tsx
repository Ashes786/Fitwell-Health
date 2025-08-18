"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Search, 
  Plus, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Stethoscope,
  Video,
  Phone,
  MapPin,
  ArrowRight,
  Edit,
  Eye,
  Filter,
  DollarSign,
  TrendingUp
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
    id: string
    name: string
    phone: string
    nhrNumber: string
  }
  doctor?: {
    id: string
    name: string
    specialization: string
  }
  consultationFee?: number
  paymentStatus: string
  videoLink?: string
  location?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function AttendantAppointments() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (session.user?.role !== "ATTENDANT") {
      router.push("/dashboard")
      return
    }

    // Mock data - in real app, this would come from API
    const mockAppointments: Appointment[] = [
      {
        id: "1",
        appointmentNumber: "APT-2024-001",
        type: "GP_CONSULTATION",
        status: "CONFIRMED",
        chiefComplaint: "General checkup and blood pressure monitoring",
        scheduledAt: "2024-01-15T10:00:00Z",
        patient: {
          id: "1",
          name: "John Smith",
          phone: "+1-555-0123",
          nhrNumber: "NHR-2024-001"
        },
        doctor: {
          id: "1",
          name: "Dr. Sarah Johnson",
          specialization: "General Practitioner"
        },
        consultationFee: 100,
        paymentStatus: "PAID",
        location: "Main Clinic - Room 101",
        notes: "Regular checkup patient",
        createdAt: "2024-01-10T09:00:00Z",
        updatedAt: "2024-01-10T09:00:00Z"
      },
      {
        id: "2",
        appointmentNumber: "APT-2024-002",
        type: "VIDEO_CONSULTATION",
        status: "CONFIRMED",
        chiefComplaint: "Follow-up for asthma management",
        scheduledAt: "2024-01-15T11:30:00Z",
        patient: {
          id: "2",
          name: "Sarah Johnson",
          phone: "+1-555-0125",
          nhrNumber: "NHR-2024-002"
        },
        doctor: {
          id: "1",
          name: "Dr. Sarah Johnson",
          specialization: "General Practitioner"
        },
        consultationFee: 150,
        paymentStatus: "PAID",
        videoLink: "https://meet.jit.si/healthpay-002",
        notes: "Video follow-up appointment",
        createdAt: "2024-01-08T14:30:00Z",
        updatedAt: "2024-01-08T14:30:00Z"
      },
      {
        id: "3",
        appointmentNumber: "APT-2024-003",
        type: "SPECIALIST_CONSULTATION",
        status: "PENDING",
        chiefComplaint: "Cardiac consultation for chest pain",
        scheduledAt: "2024-01-16T14:00:00Z",
        patient: {
          id: "3",
          name: "Mike Davis",
          phone: "+1-555-0127",
          nhrNumber: "NHR-2024-003"
        },
        doctor: {
          id: "2",
          name: "Dr. Michael Chen",
          specialization: "Cardiologist"
        },
        consultationFee: 250,
        paymentStatus: "PENDING",
        location: "Cardiology Department - Room 205",
        notes: "Urgent cardiac consultation",
        createdAt: "2024-01-12T16:45:00Z",
        updatedAt: "2024-01-12T16:45:00Z"
      },
      {
        id: "4",
        appointmentNumber: "APT-2024-004",
        type: "PHONE_CONSULTATION",
        status: "COMPLETED",
        chiefComplaint: "Prescription refill consultation",
        scheduledAt: "2024-01-10T15:00:00Z",
        patient: {
          id: "4",
          name: "Emily Brown",
          phone: "+1-555-0129",
          nhrNumber: "NHR-2024-004"
        },
        doctor: {
          id: "1",
          name: "Dr. Sarah Johnson",
          specialization: "General Practitioner"
        },
        consultationFee: 75,
        paymentStatus: "PAID",
        notes: "Phone consultation completed successfully",
        createdAt: "2024-01-09T10:00:00Z",
        updatedAt: "2024-01-10T15:30:00Z"
      },
      {
        id: "5",
        appointmentNumber: "APT-2024-005",
        type: "PHYSICAL_VISIT",
        status: "CANCELLED",
        chiefComplaint: "Skin rash consultation",
        scheduledAt: "2024-01-12T09:00:00Z",
        patient: {
          id: "1",
          name: "John Smith",
          phone: "+1-555-0123",
          nhrNumber: "NHR-2024-001"
        },
        doctor: {
          id: "3",
          name: "Dr. Emily Rodriguez",
          specialization: "Dermatologist"
        },
        consultationFee: 180,
        paymentStatus: "REFUNDED",
        location: "Dermatology Clinic - Room 301",
        notes: "Cancelled by patient",
        createdAt: "2024-01-08T11:00:00Z",
        updatedAt: "2024-01-11T14:20:00Z"
      }
    ]

    setAppointments(mockAppointments)
    setIsLoading(false)
  }, [session, status, router])

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout userRole={UserRole.ATTENDANT}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
  }

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.appointmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.patient.nhrNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const todayAppointments = filteredAppointments.filter(apt => 
    new Date(apt.scheduledAt).toDateString() === new Date().toDateString()
  )
  
  const upcomingAppointments = filteredAppointments.filter(apt => 
    ["CONFIRMED", "PENDING"].includes(apt.status) && 
    new Date(apt.scheduledAt) > new Date()
  )
  
  const pastAppointments = filteredAppointments.filter(apt => 
    ["COMPLETED", "CANCELLED"].includes(apt.status)
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "CANCELLED":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-100 text-emerald-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
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
        return <MapPin className="h-4 w-4" />
      case "GP_CONSULTATION":
        return <Stethoscope className="h-4 w-4" />
      case "SPECIALIST_CONSULTATION":
        return <Stethoscope className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-100 text-emerald-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "REFUNDED":
        return "bg-blue-100 text-blue-800"
      case "FAILED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const AppointmentCard = ({ appointment, showActions = true }: { appointment: Appointment, showActions?: boolean }) => (
    <Card className="border-emerald-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              {getTypeIcon(appointment.type)}
              <div>
                <h3 className="font-semibold text-gray-900">
                  {getTypeDisplay(appointment.type)}
                </h3>
                <p className="text-sm text-gray-600">
                  {appointment.appointmentNumber}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Badge>
                <Badge className={getPaymentStatusColor(appointment.paymentStatus)}>
                  {appointment.paymentStatus}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Patient</p>
                <p className="text-gray-900">{appointment.patient.name}</p>
                <p className="text-sm text-gray-600">
                  {appointment.patient.phone} • NHR: {appointment.patient.nhrNumber}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Schedule</p>
                <p className="text-gray-900">
                  {new Date(appointment.scheduledAt).toLocaleDateString()} at {new Date(appointment.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {appointment.doctor && (
                  <p className="text-sm text-gray-600">
                    Dr. {appointment.doctor.name} - {appointment.doctor.specialization}
                  </p>
                )}
              </div>
            </div>
            
            {appointment.chiefComplaint && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Chief Complaint</p>
                <p className="text-gray-900">{appointment.chiefComplaint}</p>
              </div>
            )}
            
            {appointment.location && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Location</p>
                <p className="text-gray-900 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {appointment.location}
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {appointment.consultationFee && (
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {appointment.consultationFee}
                    </span>
                  </div>
                )}
                {appointment.videoLink && appointment.status === "CONFIRMED" && (
                  <div className="flex items-center space-x-1">
                    <Video className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-600">Video Link Available</span>
                  </div>
                )}
              </div>
              
              {appointment.notes && (
                <p className="text-sm text-gray-600 italic">
                  Note: {appointment.notes}
                </p>
              )}
            </div>
          </div>
          
          {showActions && (
            <div className="flex flex-col space-y-2 ml-4">
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => router.push(`/dashboard/attendant/appointments/${appointment.id}`)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
              
              {appointment.status === "PENDING" && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  onClick={() => router.push(`/dashboard/attendant/appointments/${appointment.id}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
              
              {appointment.videoLink && appointment.status === "CONFIRMED" && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => window.open(appointment.videoLink, '_blank')}
                >
                  <Video className="h-4 w-4 mr-1" />
                  Join Call
                </Button>
              )}
              
              <Button 
                size="sm" 
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                onClick={() => router.push(`/dashboard/attendant/patients/${appointment.patient.id}`)}
              >
                <UserCheck className="h-4 w-4 mr-1" />
                View Patient
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout userRole={UserRole.ATTENDANT}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
            <p className="text-gray-600 mt-2">
              Manage all patient appointments and scheduling
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push("/dashboard/attendant/appointments/new")}>
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-gray-900">{todayAppointments.length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {appointments.filter(apt => apt.status === "CONFIRMED").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {appointments.filter(apt => apt.status === "PENDING").length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="border-emerald-200">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search appointments by patient, doctor, or appointment number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-emerald-200 focus:border-emerald-400"
              />
            </div>
          </CardContent>
        </Card>

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
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              All ({filteredAppointments.length})
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
                    No appointments scheduled for today.
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
                  <Clock className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No upcoming appointments
                  </h3>
                  <p className="text-gray-600 text-center">
                    No upcoming appointments scheduled.
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
                  <CheckCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No past appointments
                  </h3>
                  <p className="text-gray-600 text-center">
                    No past appointments found.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No appointments found
                  </h3>
                  <p className="text-gray-600 text-center">
                    {searchTerm ? 'No appointments match your search criteria.' : 'No appointments have been scheduled yet.'}
                  </p>
                  <Button 
                    className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => router.push("/dashboard/attendant/appointments/new")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule First Appointment
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}