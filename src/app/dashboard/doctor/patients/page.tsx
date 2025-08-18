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
  Filter, 
  UserCheck, 
  Calendar, 
  FileText, 
  Activity,
  Heart,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  MessageSquare,
  Phone,
  Video
} from "lucide-react"
import { UserRole } from "@prisma/client"

interface Patient {
  id: string
  name: string
  dateOfBirth: string
  gender: string
  bloodGroup?: string
  phone: string
  email?: string
  lastVisit?: string
  nextAppointment?: string
  chronicConditions: string[]
  status: "ACTIVE" | "INACTIVE" | "NEW"
  vitalSigns?: {
    bloodPressure?: string
    heartRate?: number
    temperature?: number
    lastUpdated: string
  }
}

interface Appointment {
  id: string
  scheduledAt: string
  type: string
  status: string
  chiefComplaint?: string
}

export default function DoctorPatients() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (session.user?.role !== "DOCTOR") {
      router.push("/dashboard")
      return
    }

    // Mock data - in real app, this would come from API
    const mockPatients: Patient[] = [
      {
        id: "1",
        name: "John Smith",
        dateOfBirth: "1985-03-15",
        gender: "MALE",
        bloodGroup: "O+",
        phone: "+1-555-0123",
        email: "john.smith@email.com",
        lastVisit: "2024-01-10",
        nextAppointment: "2024-01-20",
        chronicConditions: ["Hypertension", "Diabetes Type 2"],
        status: "ACTIVE",
        vitalSigns: {
          bloodPressure: "120/80",
          heartRate: 72,
          temperature: 98.6,
          lastUpdated: "2024-01-10"
        }
      },
      {
        id: "2",
        name: "Sarah Johnson",
        dateOfBirth: "1990-07-22",
        gender: "FEMALE",
        bloodGroup: "A+",
        phone: "+1-555-0124",
        email: "sarah.johnson@email.com",
        lastVisit: "2024-01-08",
        nextAppointment: "2024-01-15",
        chronicConditions: ["Asthma"],
        status: "ACTIVE",
        vitalSigns: {
          bloodPressure: "110/70",
          heartRate: 68,
          temperature: 98.4,
          lastUpdated: "2024-01-08"
        }
      },
      {
        id: "3",
        name: "Mike Davis",
        dateOfBirth: "1978-11-30",
        gender: "MALE",
        bloodGroup: "B+",
        phone: "+1-555-0125",
        email: "mike.davis@email.com",
        lastVisit: "2024-01-05",
        chronicConditions: [],
        status: "ACTIVE",
        vitalSigns: {
          bloodPressure: "130/85",
          heartRate: 75,
          temperature: 98.8,
          lastUpdated: "2024-01-05"
        }
      },
      {
        id: "4",
        name: "Emily Brown",
        dateOfBirth: "1995-04-18",
        gender: "FEMALE",
        bloodGroup: "AB+",
        phone: "+1-555-0126",
        email: "emily.brown@email.com",
        chronicConditions: ["Migraine"],
        status: "NEW",
        vitalSigns: {
          bloodPressure: "115/75",
          heartRate: 70,
          temperature: 98.2,
          lastUpdated: "2024-01-12"
        }
      }
    ]

    setPatients(mockPatients)
    setIsLoading(false)
  }, [session, status, router])

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout userRole={UserRole.DOCTOR}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
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

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  )

  const activePatients = filteredPatients.filter(p => p.status === "ACTIVE")
  const newPatients = filteredPatients.filter(p => p.status === "NEW")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-100 text-emerald-800"
      case "INACTIVE":
        return "bg-gray-100 text-gray-800"
      case "NEW":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getVitalStatus = (vitalSigns?: Patient['vitalSigns']) => {
    if (!vitalSigns) return "UNKNOWN"
    
    const { bloodPressure, heartRate, temperature } = vitalSigns
    const bp = bloodPressure?.split('/').map(Number)
    
    if (bp && (bp[0] > 140 || bp[1] > 90)) return "HIGH"
    if (bp && (bp[0] < 90 || bp[1] < 60)) return "LOW"
    if (heartRate && (heartRate > 100 || heartRate < 60)) return "ABNORMAL"
    if (temperature && (temperature > 99.5 || temperature < 97.5)) return "FEVER"
    
    return "NORMAL"
  }

  const getVitalStatusColor = (status: string) => {
    switch (status) {
      case "NORMAL":
        return "bg-emerald-100 text-emerald-800"
      case "HIGH":
        return "bg-red-100 text-red-800"
      case "LOW":
        return "bg-yellow-100 text-yellow-800"
      case "ABNORMAL":
        return "bg-orange-100 text-orange-800"
      case "FEVER":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const PatientCard = ({ patient }: { patient: Patient }) => {
    const vitalStatus = getVitalStatus(patient.vitalSigns)
    
    return (
      <Card className="border-emerald-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-600">
                    {getAge(patient.dateOfBirth)} years, {patient.gender}
                  </p>
                </div>
                <Badge className={getStatusColor(patient.status)}>
                  {patient.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Contact</p>
                  <p className="text-sm text-gray-900">{patient.phone}</p>
                  {patient.email && (
                    <p className="text-sm text-gray-600">{patient.email}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Medical Info</p>
                  <p className="text-sm text-gray-900">Blood: {patient.bloodGroup || 'Unknown'}</p>
                  {patient.chronicConditions.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {patient.chronicConditions.join(', ')}
                    </p>
                  )}
                </div>
              </div>

              {patient.vitalSigns && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Latest Vitals</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-gray-900">
                        {patient.vitalSigns.bloodPressure} mmHg
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-900">
                        {patient.vitalSigns.heartRate} bpm
                      </span>
                    </div>
                    <Badge className={getVitalStatusColor(vitalStatus)}>
                      {vitalStatus}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <div>
                  {patient.lastVisit && (
                    <p className="text-gray-600">
                      Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                    </p>
                  )}
                  {patient.nextAppointment && (
                    <p className="text-emerald-600 font-medium">
                      Next: {new Date(patient.nextAppointment).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2 ml-4">
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => router.push(`/dashboard/doctor/patients/${patient.id}`)}
              >
                View Details
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                onClick={() => router.push(`/dashboard/doctor/appointments?patient=${patient.id}`)}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Appointments
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                onClick={() => router.push(`/dashboard/doctor/messages?patient=${patient.id}`)}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <DashboardLayout userRole={UserRole.DOCTOR}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-gray-600 mt-2">
              Manage your patients and their medical records
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Users className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="border-emerald-200">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patients by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-emerald-200 focus:border-emerald-400"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-emerald-100">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              All Patients ({filteredPatients.length})
            </TabsTrigger>
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Active ({activePatients.length})
            </TabsTrigger>
            <TabsTrigger 
              value="new" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              New ({newPatients.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredPatients.length > 0 ? (
              <div className="grid gap-4">
                {filteredPatients.map((patient) => (
                  <PatientCard key={patient.id} patient={patient} />
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No patients found
                  </h3>
                  <p className="text-gray-600 text-center">
                    {searchTerm ? 'No patients match your search criteria.' : 'You have no patients assigned yet.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activePatients.length > 0 ? (
              <div className="grid gap-4">
                {activePatients.map((patient) => (
                  <PatientCard key={patient.id} patient={patient} />
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <UserCheck className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No active patients
                  </h3>
                  <p className="text-gray-600 text-center">
                    You have no active patients at the moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            {newPatients.length > 0 ? (
              <div className="grid gap-4">
                {newPatients.map((patient) => (
                  <PatientCard key={patient.id} patient={patient} />
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No new patients
                  </h3>
                  <p className="text-gray-600 text-center">
                    You have no new patients to review.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}