"use client"

import { useCustomSession } from "@/hooks/use-custom-session"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Users, 
  Search, 
  Plus, 
  UserCheck, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Edit,
  Trash2,
  Eye,
  Filter
} from "lucide-react"
import { toast } from "sonner"

interface Patient {
  id: string
  name: string
  email: string
  phone?: string
  isActive: boolean
  createdAt: string
  lastLogin?: string
  profile?: {
    dateOfBirth?: string
    gender?: string
    bloodGroup?: string
    address?: string
    city?: string
    emergencyContact?: string
    medicalHistory?: string
  }
  subscription?: {
    id: string
    plan: string
    status: string
    expiresAt: string
  }
}

export default function UnifiedPatients() {
  const { user, loading } = useCustomSession()
  const router = useRouter()
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Role-based API endpoint and permissions
  const getApiEndpoint = () => {
    if (!user) return null
    switch (user.role) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return '/api/admin/patients'
      case 'DOCTOR':
        return '/api/doctor/patients'
      case 'ATTENDANT':
        return '/api/attendant/patients'
      default:
        return null
    }
  }

  const getPermissions = () => {
    if (!user) return { canAdd: false, canEdit: false, canDelete: false }
    switch (user.role) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return { canAdd: true, canEdit: true, canDelete: true }
      case 'DOCTOR':
        return { canAdd: false, canEdit: false, canDelete: false }
      case 'ATTENDANT':
        return { canAdd: true, canEdit: true, canDelete: false }
      default:
        return { canAdd: false, canEdit: false, canDelete: false }
    }
  }

  const permissions = getPermissions()

  useEffect(() => {
    if (user && !loading) {
      fetchPatients()
    }
  }, [user, loading])

  const fetchPatients = async () => {
    const apiEndpoint = getApiEndpoint()
    if (!apiEndpoint) return

    try {
      const response = await fetch(apiEndpoint)
      if (response.ok) {
        const data = await response.json()
        // Handle different response formats based on role
        let patientList = []
        if (data.patients) {
          patientList = data.patients
        } else if (data.doctorPatients) {
          patientList = data.doctorPatients
        } else if (data.attendantPatients) {
          patientList = data.attendantPatients
        }

        const formattedPatients = patientList.map((patient: any) => ({
          id: patient.id,
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          isActive: patient.isActive ?? true,
          createdAt: patient.createdAt,
          lastLogin: patient.lastLogin,
          profile: patient.profile ? {
            dateOfBirth: patient.profile.dateOfBirth,
            gender: patient.profile.gender,
            bloodGroup: patient.profile.bloodGroup,
            address: patient.profile.address,
            city: patient.profile.city,
            emergencyContact: patient.profile.emergencyContact,
            medicalHistory: patient.profile.medicalHistory
          } : undefined,
          subscription: patient.subscription ? {
            id: patient.subscription.id,
            plan: patient.subscription.plan?.name || 'Unknown',
            status: patient.subscription.status,
            expiresAt: patient.subscription.expiresAt
          } : undefined
        }))
        setPatients(formattedPatients)
      } else {
        toast.error('Failed to fetch patients')
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
      toast.error('Failed to load patients')
    } finally {
      setIsDataLoading(false)
    }
  }

  const handleAddPatient = () => {
    if (permissions.canAdd) {
      router.push('/dashboard/register-patient')
    } else {
      toast.error('You do not have permission to add patients')
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

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.includes(searchTerm)
  )

  const activePatients = filteredPatients.filter(p => p.isActive)
  const inactivePatients = filteredPatients.filter(p => !p.isActive)

  const PatientCard = ({ patient }: { patient: Patient }) => {
    return (
      <Card className="border-blue-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-600">{patient.email}</p>
                  {patient.phone && (
                    <p className="text-sm text-gray-600">{patient.phone}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={patient.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {patient.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {patient.subscription && (
                    <Badge className="bg-purple-100 text-purple-800">
                      {patient.subscription.plan}
                    </Badge>
                  )}
                </div>
              </div>

              {patient.profile && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {patient.profile.dateOfBirth && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                      <p className="text-sm text-gray-900">{patient.profile.dateOfBirth}</p>
                    </div>
                  )}
                  {patient.profile.gender && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Gender</p>
                      <p className="text-sm text-gray-900">{patient.profile.gender}</p>
                    </div>
                  )}
                  {patient.profile.bloodGroup && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Blood Group</p>
                      <p className="text-sm text-gray-900">{patient.profile.bloodGroup}</p>
                    </div>
                  )}
                  {patient.profile.city && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Location</p>
                      <p className="text-sm text-gray-900 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {patient.profile.city}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-600">
                    Joined: {new Date(patient.createdAt).toLocaleDateString()}
                  </p>
                  {patient.lastLogin && (
                    <p className="text-gray-600">
                      Last login: {new Date(patient.lastLogin).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2 ml-4">
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push(`/dashboard/patients/${patient.id}`)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
              {permissions.canEdit && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
              {permissions.canDelete && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
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
          <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600 mt-2">
            View and manage patients {user.role && `as ${user.role.replace('_', ' ')}`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {permissions.canAdd && (
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAddPatient}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Patients</p>
                <p className="text-2xl font-bold text-green-600">{activePatients.length}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Patients</p>
                <p className="text-2xl font-bold text-gray-600">{inactivePatients.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-gray-600" />
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
                placeholder="Search patients by name, email, or phone..."
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

      {/* Patient List */}
      <div className="space-y-4">
        {filteredPatients.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No patients match your search criteria.' : 'No patients have been added yet.'}
              </p>
              {permissions.canAdd && !searchTerm && (
                <Button onClick={handleAddPatient}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Patient
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))
        )}
      </div>
    </div>
  )
}