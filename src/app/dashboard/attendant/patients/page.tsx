"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { 
  Users, 
  Search, 
  Plus, 
  UserCheck, 
  Calendar, 
  Activity, 
  Heart,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Edit,
  Eye,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle
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
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  emergencyContact?: string
  nhrNumber: string
  status: "ACTIVE" | "INACTIVE" | "NEW"
  lastVisit?: string
  nextAppointment?: string
  chronicConditions: string[]
  allergies?: string[]
  currentMedications?: string[]
  registeredAt: string
  registeredBy: {
    name: string
  }
}

export default function AttendantPatients() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const { isAuthorized, isUnauthorized, isLoading, session: authSession } = useRoleAuthorization({
    requiredRole: "ATTENDANT",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  useEffect(() => {
    if (isAuthorized) {
      // Original fetch logic will be handled separately
    }
  }, [isAuthorized])

  if (isLoading || isDataLoading) {
    return (
      
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      
    )
  }

  if (!session) {
    return null
  }

  // Show unauthorized message if user doesn't have ATTENDANT role
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
    patient.phone.includes(searchTerm) ||
    patient.nhrNumber.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getRiskLevel = (patient: Patient) => {
    if (patient.chronicConditions.length > 2) return "HIGH"
    if (patient.chronicConditions.length > 0 || patient.allergies?.length) return "MEDIUM"
    return "LOW"
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
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

  const PatientCard = ({ patient }: { patient: Patient }) => {
    const riskLevel = getRiskLevel(patient)
    
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
                  <p className="text-xs text-emerald-600 font-medium">
                    NHR: {patient.nhrNumber}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(patient.status)}>
                    {patient.status}
                  </Badge>
                  <Badge className={getRiskColor(riskLevel)}>
                    {riskLevel} RISK
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Contact</p>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {patient.phone}
                  </p>
                  {patient.email && (
                    <p className="text-sm text-gray-600 flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {patient.email}
                    </p>
                  )}
                  {patient.emergencyContact && (
                    <p className="text-sm text-orange-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Emergency: {patient.emergencyContact}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Address</p>
                  <p className="text-sm text-gray-900 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {patient.address}, {patient.city}
                  </p>
                  <p className="text-xs text-gray-600">
                    {patient.city}, {patient.state} {patient.postalCode}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Medical Info</p>
                  <p className="text-sm text-gray-900">Blood: {patient.bloodGroup || 'Unknown'}</p>
                  {patient.chronicConditions.length > 0 && (
                    <p className="text-xs text-gray-600">
                      Conditions: {patient.chronicConditions.join(', ')}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Visit History</p>
                  {patient.lastVisit && (
                    <p className="text-sm text-gray-900">
                      Last: {new Date(patient.lastVisit).toLocaleDateString()}
                    </p>
                  )}
                  {patient.nextAppointment && (
                    <p className="text-sm text-emerald-600">
                      Next: {new Date(patient.nextAppointment).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Registration</p>
                  <p className="text-sm text-gray-900">
                    {new Date(patient.registeredAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-600">
                    By: {patient.registeredBy.name}
                  </p>
                </div>
              </div>

              {(patient.allergies?.length || patient.currentMedications?.length) && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Medical Alerts</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies?.map((allergy, index) => (
                      <Badge key={index} className="bg-red-100 text-red-800 text-xs">
                        Allergy: {allergy}
                      </Badge>
                    ))}
                    {patient.currentMedications?.map((medication, index) => (
                      <Badge key={index} className="bg-blue-100 text-blue-800 text-xs">
                        Med: {medication}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2 ml-4">
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => router.push(`/dashboard/attendant/patients/${patient.id}`)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                onClick={() => router.push(`/dashboard/attendant/register-patient?edit=${patient.id}`)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                onClick={() => router.push(`/dashboard/attendant/appointments?patient=${patient.id}`)}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Appointments
              </Button>
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
            <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-gray-600 mt-2">
              Manage all patients registered in the system
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push("/dashboard/attendant/register-patient")}>
              <Plus className="mr-2 h-4 w-4" />
              Register Patient
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                </div>
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{activePatients.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{newPatients.length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Risk</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {patients.filter(p => getRiskLevel(p) === "HIGH").length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
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
                placeholder="Search patients by name, email, phone, or NHR number..."
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
              All ({filteredPatients.length})
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
            <TabsTrigger 
              value="high-risk" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              High Risk ({patients.filter(p => getRiskLevel(p) === "HIGH").length})
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
                    {searchTerm ? 'No patients match your search criteria.' : 'No patients have been registered yet.'}
                  </p>
                  <Button 
                    className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => router.push("/dashboard/attendant/register-patient")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Register First Patient
                  </Button>
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
                  <CheckCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No active patients
                  </h3>
                  <p className="text-gray-600 text-center">
                    No active patients found in the system.
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
                    No new patients registered this month.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="high-risk" className="space-y-4">
            {patients.filter(p => getRiskLevel(p) === "HIGH").length > 0 ? (
              <div className="grid gap-4">
                {patients
                  .filter(p => getRiskLevel(p) === "HIGH")
                  .map((patient) => (
                    <PatientCard key={patient.id} patient={patient} />
                  ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No high-risk patients
                  </h3>
                  <p className="text-gray-600 text-center">
                    No patients are currently classified as high-risk.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    
  )
}