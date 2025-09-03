"use client"

import { useCustomSession } from "@/hooks/use-custom-session"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Search, 
  Plus, 
  Clock, 
  UserCheck,
  Video,
  Phone,
  MapPin,
  Filter,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react"
import { toast } from "sonner"

interface Appointment {
  id: string
  patientName: string
  patientEmail: string
  doctorName?: string
  type: 'consultation' | 'follow-up' | 'emergency' | 'routine'
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  date: string
  time: string
  duration: number
  location?: string
  notes?: string
  createdAt: string
}

export default function UnifiedAppointments() {
  const { user, loading } = useCustomSession()
  const router = useRouter()
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Role-based API endpoint and permissions
  const getApiEndpoint = () => {
    if (!user) return null
    switch (user.role) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return '/api/appointments'
      case 'DOCTOR':
        return '/api/doctor/today-appointments'
      case 'ATTENDANT':
        return '/api/attendant/today-appointments'
      case 'PATIENT':
        return '/api/patient/appointments'
      default:
        return null
    }
  }

  const getPermissions = () => {
    if (!user) return { canAdd: false, canEdit: false, canDelete: false, canConfirm: false }
    switch (user.role) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return { canAdd: true, canEdit: true, canDelete: true, canConfirm: true }
      case 'DOCTOR':
        return { canAdd: false, canEdit: true, canDelete: false, canConfirm: true }
      case 'ATTENDANT':
        return { canAdd: true, canEdit: true, canDelete: false, canConfirm: true }
      case 'PATIENT':
        return { canAdd: true, canEdit: false, canDelete: false, canConfirm: false }
      default:
        return { canAdd: false, canEdit: false, canDelete: false, canConfirm: false }
    }
  }

  const permissions = getPermissions()

  useEffect(() => {
    if (user && !loading) {
      fetchAppointments()
    }
  }, [user, loading])

  const fetchAppointments = async () => {
    const apiEndpoint = getApiEndpoint()
    if (!apiEndpoint) return

    try {
      const response = await fetch(apiEndpoint)
      if (response.ok) {
        const data = await response.json()
        // Handle different response formats based on role
        let appointmentList = []
        if (data.appointments) {
          appointmentList = data.appointments
        } else if (data.todayAppointments) {
          appointmentList = data.todayAppointments
        } else if (data.patientAppointments) {
          appointmentList = data.patientAppointments
        }

        const formattedAppointments = appointmentList.map((apt: any) => ({
          id: apt.id,
          patientName: apt.patient?.name || apt.patientName || 'Unknown',
          patientEmail: apt.patient?.email || apt.patientEmail || '',
          doctorName: apt.doctor?.name || apt.doctorName,
          type: apt.type || 'consultation',
          status: apt.status || 'scheduled',
          date: apt.date || apt.appointmentDate,
          time: apt.time || apt.appointmentTime,
          duration: apt.duration || 30,
          location: apt.location,
          notes: apt.notes,
          createdAt: apt.createdAt
        }))
        setAppointments(formattedAppointments)
      } else {
        toast.error('Failed to fetch appointments')
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Failed to load appointments')
    } finally {
      setIsDataLoading(false)
    }
  }

  const handleBookAppointment = () => {
    if (permissions.canAdd) {
      router.push('/dashboard/book-appointment')
    } else {
      toast.error('You do not have permission to book appointments')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <Stethoscope className="h-4 w-4" />
      case 'follow-up': return <Clock className="h-4 w-4" />
      case 'emergency': return <AlertTriangle className="h-4 w-4" />
      case 'routine': return <CheckCircle className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-50 text-red-600 border-red-200'
      case 'consultation': return 'bg-blue-50 text-blue-600 border-blue-200'
      case 'follow-up': return 'bg-purple-50 text-purple-600 border-purple-200'
      case 'routine': return 'bg-green-50 text-green-600 border-green-200'
      default: return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  if (loading || isDataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to access this page.</p>
          <Button onClick={() => router.push('/auth/signin')} variant="outline">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  const filteredAppointments = appointments.filter(apt =>
    apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const todayAppointments = filteredAppointments.filter(apt => {
    const aptDate = new Date(apt.date).toDateString()
    const today = new Date().toDateString()
    return aptDate === today
  })

  const upcomingAppointments = filteredAppointments.filter(apt => {
    const aptDate = new Date(apt.date)
    const today = new Date()
    return aptDate > today && apt.status !== 'completed' && apt.status !== 'cancelled'
  })

  const completedAppointments = filteredAppointments.filter(apt => apt.status === 'completed')

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    return (
      <Card className="border-blue-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className={`p-3 rounded-lg ${getTypeColor(appointment.type)}`}>
                {getTypeIcon(appointment.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status.replace('-', ' ')}
                  </Badge>
                </div>
                
                {appointment.doctorName && (
                  <p className="text-sm text-gray-600 mb-1">Doctor: {appointment.doctorName}</p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(appointment.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {appointment.time}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {appointment.duration} min
                  </div>
                </div>

                {appointment.location && (
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {appointment.location}
                  </div>
                )}

                {appointment.notes && (
                  <p className="text-sm text-gray-500 mt-2">{appointment.notes}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-2 ml-4">
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push(`/dashboard/appointments/${appointment.id}`)}
              >
                View Details
              </Button>
              {permissions.canEdit && appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Edit
                </Button>
              )}
              {permissions.canConfirm && appointment.status === 'scheduled' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  Confirm
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
          <p className="text-gray-600 mt-2">
            Manage appointments {user.role && `as ${user.role.replace('_', ' ')}`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {permissions.canAdd && (
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleBookAppointment}
            >
              <Plus className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-blue-600">{appointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-orange-600">{todayAppointments.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-purple-600">{upcomingAppointments.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedAppointments.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search appointments by patient or doctor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({filteredAppointments.length})</TabsTrigger>
          <TabsTrigger value="today">Today ({todayAppointments.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedAppointments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'No appointments match your search criteria.' : 'No appointments have been scheduled yet.'}
                </p>
                {permissions.canAdd && !searchTerm && (
                  <Button onClick={handleBookAppointment}>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule First Appointment
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          {todayAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments today</h3>
                <p className="text-gray-600">You have no appointments scheduled for today.</p>
              </CardContent>
            </Card>
          ) : (
            todayAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming appointments</h3>
                <p className="text-gray-600">You have no upcoming appointments scheduled.</p>
              </CardContent>
            </Card>
          ) : (
            upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed appointments</h3>
                <p className="text-gray-600">You have no completed appointments yet.</p>
              </CardContent>
            </Card>
          ) : (
            completedAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}