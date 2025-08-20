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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  Users, 
  Search, 
  Plus, 
  UserCheck, 
  Upload, 
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Edit,
  Trash2,
  Eye,
  Filter,
  FileText,
  X
} from "lucide-react"
import { UserRole } from "@prisma/client"
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

export default function AdminPatients() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false)
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    address: "",
    city: "",
    emergencyContact: "",
    medicalHistory: ""
  })

  const { isAuthorized, isUnauthorized, isLoading, session } = useRoleAuthorization({
    requiredRole: "ADMIN",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()

  useEffect(() => {
    if (isAuthorized) {
      // Original fetch logic will be handled separately
    }
  }, [isAuthorized])

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/admin/patients')
      if (response.ok) {
        const data = await response.json()
        const formattedPatients = data.patients.map((patient: any) => ({
          id: patient.id,
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          isActive: patient.isActive,
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
      setIsLoading(false)
    }
  }

  const handleAddPatient = async () => {
    try {
      const response = await fetch('/api/admin/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPatient)
      })

      if (response.ok) {
        const data = await response.json()
        const formattedPatient = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          isActive: data.user.isActive,
          createdAt: data.user.createdAt,
          profile: data.user.profile
        }
        
        setPatients([...patients, formattedPatient])
        setNewPatient({
          name: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          gender: "",
          bloodGroup: "",
          address: "",
          city: "",
          emergencyContact: "",
          medicalHistory: ""
        })
        setIsAddDialogOpen(false)
        toast.success('Patient added successfully')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to add patient')
      }
    } catch (error) {
      console.error('Error adding patient:', error)
      toast.error('Failed to add patient')
    }
  }

  const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In real app, this would handle CSV/Excel file upload
      toast.success('Bulk upload functionality would process the file')
      setIsBulkDialogOpen(false)
    }
  }

  const downloadTemplate = () => {
    // In real app, this would download a CSV template
    toast.success('Template download started')
  }

  if (isLoading) {
    return (
      <DashboardLayout userRole={UserRole.ADMIN}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
  }

  // Show unauthorized message if user doesn't have ADMIN role
  if (isUnauthorized) {
    return (
      <DashboardLayout userRole={UserRole.ADMIN}>
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

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.includes(searchTerm)
  )

  const activePatients = filteredPatients.filter(p => p.isActive)
  const inactivePatients = filteredPatients.filter(p => !p.isActive)

  const PatientCard = ({ patient }: { patient: Patient }) => {
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
                  <p className="text-sm text-gray-600">{patient.email}</p>
                  {patient.phone && (
                    <p className="text-sm text-gray-600">{patient.phone}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={patient.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"}>
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
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => router.push(`/dashboard/admin/patients/${patient.id}`)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <DashboardLayout userRole={UserRole.ADMIN}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-gray-600 mt-2">
              Add and manage patients in your healthcare network
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              onClick={downloadTemplate}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
            <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Upload className="mr-2 h-4 w-4" />
                  Bulk Upload
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Upload Patients</DialogTitle>
                  <DialogDescription>
                    Upload a CSV or Excel file with patient data
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file-upload">Select File</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleBulkUpload}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsBulkDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsBulkDialogOpen(false)}>
                      Upload
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Patient</DialogTitle>
                  <DialogDescription>
                    Enter patient information to add them to your network
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={newPatient.name}
                        onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                        placeholder="John Doe"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newPatient.email}
                        onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                        placeholder="john@example.com"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newPatient.phone}
                        onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                        placeholder="+1-555-0123"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={newPatient.dateOfBirth}
                        onChange={(e) => setNewPatient({...newPatient, dateOfBirth: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={newPatient.gender} onValueChange={(value) => setNewPatient({...newPatient, gender: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select value={newPatient.bloodGroup} onValueChange={(value) => setNewPatient({...newPatient, bloodGroup: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={newPatient.address}
                        onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                        placeholder="123 Main St"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={newPatient.city}
                        onChange={(e) => setNewPatient({...newPatient, city: e.target.value})}
                        placeholder="New York"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={newPatient.emergencyContact}
                      onChange={(e) => setNewPatient({...newPatient, emergencyContact: e.target.value})}
                      placeholder="+1-555-0987"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Textarea
                      id="medicalHistory"
                      value={newPatient.medicalHistory}
                      onChange={(e) => setNewPatient({...newPatient, medicalHistory: e.target.value})}
                      placeholder="Any known medical conditions, allergies, etc."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddPatient} disabled={!newPatient.name || !newPatient.email}>
                      Add Patient
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <p className="text-sm font-medium text-gray-600">Active Patients</p>
                  <p className="text-2xl font-bold text-gray-900">{activePatients.length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive Patients</p>
                  <p className="text-2xl font-bold text-gray-900">{inactivePatients.length}</p>
                </div>
                <Activity className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Subscribed</p>
                  <p className="text-2xl font-bold text-gray-900">{patients.filter(p => p.subscription).length}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
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
            <TabsTrigger value="all" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              All Patients ({filteredPatients.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Active ({activePatients.length})
            </TabsTrigger>
            <TabsTrigger value="inactive" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Inactive ({inactivePatients.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {filteredPatients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4">
              {activePatients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            <div className="grid gap-4">
              {inactivePatients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}