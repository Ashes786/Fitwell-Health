"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle,
  XCircle,
  User,
  MapPin,
  Video,
  Phone,
  AlertCircle,
  Settings,
  RefreshCw
} from "lucide-react"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"

interface AvailabilitySlot {
  id: string
  dayOfWeek: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

interface Appointment {
  id: string
  appointmentNumber: string
  type: string
  status: string
  scheduledAt: string
  patientName: string
  patientEmail?: string
  patientPhone?: string
  consultationFee: number
  notes?: string
}

export default function DoctorSchedule() {
  const { isAuthorized, isUnauthorized, isLoading: authLoading, authSession } = useRoleAuthorization({
    requiredRole: "DOCTOR",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (isAuthorized) {
      // Original fetch logic will be handled separately
    }
  }, [isAuthorized])

  const fetchScheduleData = async () => {
    try {
      // Mock availability data
      const mockAvailability: AvailabilitySlot[] = [
        {
          id: "1",
          dayOfWeek: "Monday",
          startTime: "09:00",
          endTime: "17:00",
          isAvailable: true
        },
        {
          id: "2",
          dayOfWeek: "Tuesday",
          startTime: "09:00",
          endTime: "17:00",
          isAvailable: true
        },
        {
          id: "3",
          dayOfWeek: "Wednesday",
          startTime: "09:00",
          endTime: "13:00",
          isAvailable: true
        },
        {
          id: "4",
          dayOfWeek: "Thursday",
          startTime: "09:00",
          endTime: "17:00",
          isAvailable: true
        },
        {
          id: "5",
          dayOfWeek: "Friday",
          startTime: "09:00",
          endTime: "17:00",
          isAvailable: true
        }
      ]

      // Mock appointments data
      const mockAppointments: Appointment[] = [
        {
          id: "1",
          appointmentNumber: "APT-2024-001",
          type: "VIDEO_CONSULTATION",
          status: "CONFIRMED",
          scheduledAt: "2024-01-15T10:00:00Z",
          patientName: "John Doe",
          patientEmail: "john@example.com",
          patientPhone: "+1-555-0123",
          consultationFee: 150.00,
          notes: "Routine follow-up consultation"
        },
        {
          id: "2",
          appointmentNumber: "APT-2024-002",
          type: "IN_PERSON",
          status: "PENDING",
          scheduledAt: "2024-01-15T14:00:00Z",
          patientName: "Jane Smith",
          patientEmail: "jane@example.com",
          consultationFee: 150.00,
          notes: "Initial consultation"
        },
        {
          id: "3",
          appointmentNumber: "APT-2024-003",
          type: "PHONE_CONSULTATION",
          status: "COMPLETED",
          scheduledAt: "2024-01-14T11:00:00Z",
          patientName: "Bob Johnson",
          patientEmail: "bob@example.com",
          consultationFee: 120.00,
          notes: "Prescription refill consultation"
        }
      ]

      setAvailability(mockAvailability)
      setAppointments(mockAppointments)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching schedule data:', error)
      toast.error('Failed to load schedule information')
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800"
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

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO_CONSULTATION":
        return <Video className="h-4 w-4" />
      case "PHONE_CONSULTATION":
        return <Phone className="h-4 w-4" />
      case "IN_PERSON":
        return <MapPin className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getAppointmentTypeDisplay = (type: string) => {
    switch (type) {
      case "VIDEO_CONSULTATION":
        return "Video Consultation"
      case "PHONE_CONSULTATION":
        return "Phone Consultation"
      case "IN_PERSON":
        return "In-Person Visit"
      default:
        return type
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getDayAppointments = (date: string) => {
    return appointments.filter(apt => 
      apt.scheduledAt.startsWith(date)
    )
  }

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

  const totalAvailability = availability.filter(slot => slot.isAvailable).length
  const totalAppointments = appointments.length
  const confirmedAppointments = appointments.filter(apt => apt.status === "CONFIRMED").length
  const completedAppointments = appointments.filter(apt => apt.status === "COMPLETED").length

  const AvailabilityCard = ({ slot }: { slot: AvailabilitySlot }) => (
    <Card className="border-emerald-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{slot.dayOfWeek}</h3>
              <p className="text-sm text-gray-600">
                {slot.startTime} - {slot.endTime}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={slot.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {slot.isAvailable ? "Available" : "Unavailable"}
            </Badge>
            <Button 
              size="sm" 
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {getAppointmentTypeIcon(appointment.type)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(appointment.scheduledAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(appointment.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center space-x-1">
                <span>{getAppointmentTypeDisplay(appointment.type)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>{appointment.appointmentNumber}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>{formatCurrency(appointment.consultationFee)}</span>
              </div>
            </div>

            {appointment.patientEmail && (
              <div className="text-sm text-gray-500 mb-1">
                Email: {appointment.patientEmail}
              </div>
            )}

            {appointment.patientPhone && (
              <div className="text-sm text-gray-500 mb-1">
                Phone: {appointment.patientPhone}
              </div>
            )}

            {appointment.notes && (
              <div className="text-sm text-gray-600">
                Notes: {appointment.notes}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2 ml-4">
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <User className="h-4 w-4 mr-1" />
              View Patient
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Edit className="h-4 w-4 mr-1" />
              Manage
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule & Availability</h1>
            <p className="text-gray-600 mt-2">
              Manage your availability and view upcoming appointments
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Calendar
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Availability
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Hours</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {totalAvailability * 8}h
              </div>
              <p className="text-xs text-green-600">
                {totalAvailability} days available
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {totalAppointments}
              </div>
              <p className="text-xs text-blue-600">
                Scheduled appointments
              </p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {confirmedAppointments}
              </div>
              <p className="text-xs text-yellow-600">
                Upcoming appointments
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {completedAppointments}
              </div>
              <p className="text-xs text-purple-600">
                Finished appointments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Tabs */}
        <Tabs defaultValue="availability" className="space-y-4">
          <TabsList className="bg-emerald-100">
            <TabsTrigger value="availability" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Availability
            </TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Appointments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="availability" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availability.map((slot) => (
                <AvailabilityCard key={slot.id} slot={slot} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-fit border-emerald-200 focus:border-emerald-500"
              />
              <div className="text-sm text-gray-600">
                {getDayAppointments(selectedDate).length} appointments on {new Date(selectedDate).toLocaleDateString()}
              </div>
            </div>

            <div className="space-y-4">
              {getDayAppointments(selectedDate).length > 0 ? (
                getDayAppointments(selectedDate).map((appointment) => (
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
                      No appointments scheduled for {new Date(selectedDate).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    
  )
}