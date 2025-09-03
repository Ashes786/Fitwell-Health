'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCustomSession } from '@/hooks/use-custom-session'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  User, 
  MapPin,
  Plus,
  Filter,
  Search
} from 'lucide-react'
import { toast } from 'sonner'

interface Appointment {
  id: string
  type: 'GP' | 'Specialist' | 'Emergency'
  doctor: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  location: string
  consultationType: 'in-person' | 'video' | 'phone'
}

export default function AppointmentsPage() {
  const { user, loading } = useCustomSession()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/auth/signin')
      return
    }

    fetchAppointments()
  }, [user, loading, router])

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      
      // Fetch appointments based on user role
      let endpoint = ''
      switch (user?.role) {
        case 'PATIENT':
          endpoint = '/api/patient/upcoming-appointments'
          break
        case 'DOCTOR':
          endpoint = '/api/doctor/today-appointments'
          break
        case 'ATTENDANT':
          endpoint = '/api/attendant/today-appointments'
          break
        default:
          endpoint = '/api/appointments'
      }

      const response = await fetch(endpoint)
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      } else {
        // Fallback to mock data
        setAppointments(getMockAppointments(user?.role))
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Failed to load appointments')
      setAppointments(getMockAppointments(user?.role))
    } finally {
      setIsLoading(false)
    }
  }

  const getMockAppointments = (role: string) => {
    const baseAppointments: Appointment[] = [
      {
        id: '1',
        type: 'GP',
        doctor: 'Dr. Sarah Johnson',
        date: '2024-01-15',
        time: '10:00 AM',
        status: 'confirmed',
        location: 'Main Clinic',
        consultationType: 'in-person'
      },
      {
        id: '2',
        type: 'Specialist',
        doctor: 'Dr. Michael Chen',
        date: '2024-01-18',
        time: '2:30 PM',
        status: 'confirmed',
        location: 'Specialist Center',
        consultationType: 'video'
      },
      {
        id: '3',
        type: 'GP',
        doctor: 'Dr. Emily Davis',
        date: '2024-01-22',
        time: '11:00 AM',
        status: 'pending',
        location: 'Main Clinic',
        consultationType: 'phone'
      }
    ]

    if (role === 'DOCTOR') {
      return baseAppointments.map((apt, index) => ({
        ...apt,
        doctor: 'Patient ' + (index + 1),
        type: index % 2 === 0 ? 'GP' : 'Specialist'
      }))
    }

    return baseAppointments
  }

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'GP': return 'bg-blue-100 text-blue-800'
      case 'Specialist': return 'bg-purple-100 text-purple-800'
      case 'Emergency': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getConsultationIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />
      case 'phone': return <Phone className="h-4 w-4" />
      case 'in-person': return <User className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  const getPageTitle = () => {
    switch (user?.role) {
      case 'PATIENT': return 'My Appointments'
      case 'DOCTOR': return 'Patient Appointments'
      case 'ATTENDANT': return 'Today\'s Appointments'
      default: return 'Appointments'
    }
  }

  const getPageDescription = () => {
    switch (user?.role) {
      case 'PATIENT': return 'View and manage your upcoming appointments'
      case 'DOCTOR': return 'View your scheduled patient appointments'
      case 'ATTENDANT': return 'View today\'s appointment schedule'
      default: return 'Manage appointments'
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center">
        <p className="text-gray-600">Please sign in to view appointments.</p>
        <Button onClick={() => router.push('/auth/signin')} className="mt-4">
          Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-gray-600 mt-1">{getPageDescription()}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          {user.role === 'PATIENT' && (
            <Button onClick={() => router.push('/dashboard/book-appointment')}>
              <Plus className="h-4 w-4 mr-2" />
              Book New
            </Button>
          )}
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${getAppointmentTypeColor(appointment.type)}`}>
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {user.role === 'DOCTOR' ? appointment.doctor : 'Appointment with ' + appointment.doctor}
                        </h3>
                        <Badge variant="outline" className={getAppointmentTypeColor(appointment.type)}>
                          {appointment.type}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {appointment.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {appointment.location}
                        </span>
                        <span className="flex items-center gap-1">
                          {getConsultationIcon(appointment.consultationType)}
                          {appointment.consultationType.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {appointment.status === 'confirmed' && (
                    <Button variant="outline" size="sm">
                      Join
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {appointments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-4">You don't have any appointments scheduled.</p>
            {user.role === 'PATIENT' && (
              <Button onClick={() => router.push('/dashboard/book-appointment')}>
                <Plus className="h-4 w-4 mr-2" />
                Book Your First Appointment
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}