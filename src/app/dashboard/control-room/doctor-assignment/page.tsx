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
  Users, 
  Search, 
  Stethoscope, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Activity,
  UserCheck,
  Calendar,
  Phone,
  Video,
  MapPin,
  ArrowRight,
  Filter,
  RefreshCw,
  Plus
} from "lucide-react"
import { UserRole } from "@prisma/client"

interface Doctor {
  id: string
  name: string
  specialization: string
  status: "AVAILABLE" | "BUSY" | "OFFLINE"
  currentLoad: number
  maxLoad: number
  experience: number
  rating: number
  consultationFee: number
  lastActive: string
}

interface Appointment {
  id: string
  appointmentNumber: string
  type: string
  status: "PENDING" | "ASSIGNED" | "IN_PROGRESS"
  chiefComplaint: string
  scheduledAt: string
  estimatedDuration: number
  priority: "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY"
  patient: {
    id: string
    name: string
    phone: string
    age: number
    gender: string
  }
  assignedDoctor?: {
    id: string
    name: string
  }
  createdAt: string
}

export default function DoctorAssignment() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [assignmentNotes, setAssignmentNotes] = useState("")

  const { isAuthorized, isUnauthorized, isLoading, session } = useRoleAuthorization({
    requiredRole: "CONTROL_ROOM",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()

  useEffect(() => {
    if (isAuthorized) {
      // Original fetch logic will be handled separately
    }
  }, [isAuthorized])

  if (isLoading) {
    return (
      <DashboardLayout userRole={UserRole.CONTROL_ROOM}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
  }

  // Show unauthorized message if user doesn't have CONTROL_ROOM role
  if (isUnauthorized) {
    return (
      <DashboardLayout userRole={UserRole.CONTROLROOM}>
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

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pendingAppointments = appointments.filter(apt => apt.status === "PENDING")
  const availableDoctors = filteredDoctors.filter(d => d.status === "AVAILABLE")

  const getDoctorLoadPercentage = (doctor: Doctor) => {
    return Math.round((doctor.currentLoad / doctor.maxLoad) * 100)
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "EMERGENCY":
        return "bg-red-100 text-red-800"
      case "HIGH":
        return "bg-orange-100 text-orange-800"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800"
      case "LOW":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const assignDoctor = async (appointmentId: string, doctorId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedAppointments = appointments.map(apt => 
        apt.id === appointmentId 
          ? { 
              ...apt, 
              status: "ASSIGNED" as const,
              assignedDoctor: doctors.find(d => d.id === doctorId)
            }
          : apt
      )
      
      const updatedDoctors = doctors.map(doc => 
        doc.id === doctorId 
          ? { ...doc, currentLoad: doc.currentLoad + 1 }
          : doc
      )
      
      setAppointments(updatedAppointments)
      setDoctors(updatedDoctors)
      setSelectedAppointment(null)
      setSelectedDoctor(null)
      setAssignmentNotes("")
      
      alert("Doctor assigned successfully!")
    } catch (error) {
      alert("Failed to assign doctor. Please try again.")
    }
  }

  const DoctorCard = ({ doctor, onSelect }: { doctor: Doctor, onSelect: (doctor: Doctor) => void }) => {
    const loadPercentage = getDoctorLoadPercentage(doctor)
    const isSelected = selectedDoctor?.id === doctor.id
    
    return (
      <Card 
        className={`border-emerald-200 cursor-pointer transition-all duration-200 hover:shadow-md ${
          isSelected ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''
        }`}
        onClick={() => onSelect(doctor)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                <Badge className={getDoctorStatusColor(doctor.status)}>
                  {doctor.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{doctor.specialization}</p>
              
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Current Load</span>
                  <span className="font-medium">{doctor.currentLoad}/{doctor.maxLoad}</span>
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
              
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div>
                  <span className="text-gray-500">Experience:</span>
                  <span className="ml-1 font-medium">{doctor.experience} years</span>
                </div>
                <div>
                  <span className="text-gray-500">Rating:</span>
                  <span className="ml-1 font-medium">{doctor.rating.toFixed(1)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Fee:</span>
                  <span className="ml-1 font-medium">${doctor.consultationFee}</span>
                </div>
                <div>
                  <span className="text-gray-500">Last Active:</span>
                  <span className="ml-1 font-medium">
                    {new Date(doctor.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
            
            {doctor.status === "AVAILABLE" && (
              <div className="ml-4">
                <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const AppointmentCard = ({ appointment, onSelect }: { appointment: Appointment, onSelect: (appointment: Appointment) => void }) => {
    const isSelected = selectedAppointment?.id === appointment.id
    
    return (
      <Card 
        className={`border-emerald-200 cursor-pointer transition-all duration-200 hover:shadow-md ${
          isSelected ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''
        }`}
        onClick={() => onSelect(appointment)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-gray-900">{appointment.patient.name}</h3>
                <Badge className={getPriorityColor(appointment.priority)}>
                  {appointment.priority}
                </Badge>
                <Badge className={appointment.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : "bg-emerald-100 text-emerald-800"}>
                  {appointment.status}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{appointment.chiefComplaint}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Age/Gender:</span>
                  <span className="ml-1 font-medium">{appointment.patient.age}y {appointment.patient.gender}</span>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <span className="ml-1 font-medium">{appointment.patient.phone}</span>
                </div>
                <div>
                  <span className="text-gray-500">Scheduled:</span>
                  <span className="ml-1 font-medium">
                    {new Date(appointment.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <span className="ml-1 font-medium">{appointment.estimatedDuration} min</span>
                </div>
              </div>
              
              {appointment.assignedDoctor && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-500">Assigned to:</span>
                  <span className="ml-1 font-medium text-emerald-600">
                    Dr. {appointment.assignedDoctor.name}
                  </span>
                </div>
              )}
            </div>
            
            <div className="ml-4 flex flex-col space-y-2">
              <Button 
                size="sm" 
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                onClick={(e) => {
                  e.stopPropagation()
                  if (typeof window !== 'undefined') {
                    window.open(`tel:${appointment.patient.phone}`, '_self')
                  }
                }}
              >
                <Phone className="h-4 w-4" />
              </Button>
              {appointment.status === "PENDING" && (
                <Button 
                  size="sm" 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/dashboard/control-room/doctor-assignment?appointment=${appointment.id}`)
                  }}
                >
                  <Stethoscope className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <DashboardLayout userRole={UserRole.CONTROL_ROOM}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Assignment</h1>
            <p className="text-gray-600 mt-2">
              Assign doctors to pending GP appointments
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingAppointments.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Doctors</p>
                  <p className="text-2xl font-bold text-gray-900">{availableDoctors.length}</p>
                </div>
                <Stethoscope className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingAppointments.filter(apt => apt.priority === "HIGH" || apt.priority === "EMERGENCY").length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Wait Time</p>
                  <p className="text-2xl font-bold text-gray-900">8 min</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Appointments */}
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Pending Appointments</span>
                <Badge className="bg-yellow-100 text-yellow-800">
                  {pendingAppointments.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                Select an appointment to assign a doctor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {pendingAppointments.length > 0 ? (
                pendingAppointments.map((appointment) => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment}
                    onSelect={setSelectedAppointment}
                  />
                ))
              ) : (
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
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Stethoscope className="h-5 w-5" />
                <span>Available Doctors</span>
                <Badge className="bg-emerald-100 text-emerald-800">
                  {availableDoctors.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                Select a doctor for assignment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-emerald-200 focus:border-emerald-400"
                />
              </div>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {availableDoctors.length > 0 ? (
                  availableDoctors.map((doctor) => (
                    <DoctorCard 
                      key={doctor.id} 
                      doctor={doctor}
                      onSelect={setSelectedDoctor}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-2 text-yellow-600" />
                    <p>No doctors available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignment Panel */}
        {(selectedAppointment || selectedDoctor) && (
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Assignment Details
              </CardTitle>
              <CardDescription>
                Review and confirm the doctor assignment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedAppointment && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Selected Appointment</h4>
                    <p className="text-sm text-gray-900">{selectedAppointment.patient.name}</p>
                    <p className="text-sm text-gray-600">{selectedAppointment.chiefComplaint}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedAppointment.scheduledAt).toLocaleString()}
                    </p>
                    <Badge className={getPriorityColor(selectedAppointment.priority)}>
                      {selectedAppointment.priority} PRIORITY
                    </Badge>
                  </div>
                )}
                
                {selectedDoctor && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Selected Doctor</h4>
                    <p className="text-sm text-gray-900">{selectedDoctor.name}</p>
                    <p className="text-sm text-gray-600">{selectedDoctor.specialization}</p>
                    <p className="text-sm text-gray-600">
                      Load: {selectedDoctor.currentLoad}/{selectedDoctor.maxLoad}
                    </p>
                    <Badge className={getDoctorStatusColor(selectedDoctor.status)}>
                      {selectedDoctor.status}
                    </Badge>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Assignment Notes (Optional)
                </label>
                <textarea
                  className="w-full p-3 border border-emerald-200 rounded-lg focus:border-emerald-400 focus:outline-none"
                  rows={3}
                  placeholder="Add any special instructions or notes for this assignment..."
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-end space-x-4">
                <Button 
                  variant="outline" 
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  onClick={() => {
                    setSelectedAppointment(null)
                    setSelectedDoctor(null)
                    setAssignmentNotes("")
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={!selectedAppointment || !selectedDoctor}
                  onClick={() => {
                    if (selectedAppointment && selectedDoctor) {
                      assignDoctor(selectedAppointment.id, selectedDoctor.id)
                    }
                  }}
                >
                  Assign Doctor
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}