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
  FileText, 
  Search, 
  Plus, 
  UserCheck, 
  Calendar, 
  Pill, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Download,
  Printer,
  Eye,
  Edit
} from "lucide-react"
import { UserRole } from "@prisma/client"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"

interface Prescription {
  id: string
  prescriptionNumber: string
  patient: {
    id: string
    name: string
    age: number
    gender: string
  }
  medications: Medication[]
  diagnosis: string
  notes?: string
  prescribedAt: string
  expiresAt: string
  status: "ACTIVE" | "COMPLETED" | "EXPIRED" | "CANCELLED"
  followUpDate?: string
}

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  quantity: number
  refills?: number
}

export default function DoctorPrescriptions() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const { isAuthorized, isUnauthorized, isLoading: authLoading, userSession } = useRoleAuthorization({
    requiredRole: "DOCTOR",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })

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

  if (!session) {
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

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activePrescriptions = filteredPrescriptions.filter(p => p.status === "ACTIVE")
  const completedPrescriptions = filteredPrescriptions.filter(p => p.status === "COMPLETED")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-100 text-emerald-800"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800"
      case "EXPIRED":
        return "bg-red-100 text-red-800"
      case "CANCELLED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isExpiringSoon = (expiresAt: string) => {
    const expiryDate = new Date(expiresAt)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  }

  const PrescriptionCard = ({ prescription }: { prescription: Prescription }) => {
    const expiringSoon = isExpiringSoon(prescription.expiresAt)
    
    return (
      <Card className="border-emerald-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold text-gray-900">
                  {prescription.prescriptionNumber}
                </h3>
                <Badge className={getStatusColor(prescription.status)}>
                  {prescription.status}
                </Badge>
                {expiringSoon && (
                  <Badge className="bg-orange-100 text-orange-800">
                    Expiring Soon
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <UserCheck className="h-4 w-4" />
                  <span>{prescription.patient.name}, {prescription.patient.age}y {prescription.patient.gender}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Prescribed: {new Date(prescription.prescribedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                onClick={() => router.push(`/dashboard/doctor/patients/${prescription.patient.id}`)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Patient
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Diagnosis:</p>
            <p className="text-gray-900">{prescription.diagnosis}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Medications:</p>
            <div className="space-y-2">
              {prescription.medications.map((medication, index) => (
                <div key={medication.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Pill className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{medication.name}</p>
                      <span className="text-sm text-gray-600">{medication.quantity} units</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {medication.dosage} - {medication.frequency} for {medication.duration}
                    </p>
                    <p className="text-xs text-gray-500">{medication.instructions}</p>
                    {medication.refills !== undefined && (
                      <p className="text-xs text-emerald-600">
                        Refills: {medication.refills}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {prescription.notes && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
              <p className="text-sm text-gray-600">{prescription.notes}</p>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-gray-500">Expires:</span>
                <span className={`ml-1 ${expiringSoon ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>
                  {new Date(prescription.expiresAt).toLocaleDateString()}
                </span>
              </div>
              {prescription.followUpDate && (
                <div>
                  <span className="text-gray-500">Follow-up:</span>
                  <span className="ml-1 text-emerald-600">
                    {new Date(prescription.followUpDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <Printer className="h-4 w-4 mr-1" />
                Print
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
            <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
            <p className="text-gray-600 mt-2">
              Manage patient prescriptions and medications
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => router.push("/dashboard/doctor/prescriptions/new")}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Prescription
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="border-emerald-200">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search prescriptions by patient, number, or diagnosis..."
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
              All ({filteredPrescriptions.length})
            </TabsTrigger>
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Active ({activePrescriptions.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Completed ({completedPrescriptions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredPrescriptions.length > 0 ? (
              <div className="grid gap-4">
                {filteredPrescriptions.map((prescription) => (
                  <PrescriptionCard key={prescription.id} prescription={prescription} />
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No prescriptions found
                  </h3>
                  <p className="text-gray-600 text-center">
                    {searchTerm ? 'No prescriptions match your search criteria.' : 'You have no prescriptions yet.'}
                  </p>
                  <Button 
                    className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => router.push("/dashboard/doctor/prescriptions/new")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Prescription
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activePrescriptions.length > 0 ? (
              <div className="grid gap-4">
                {activePrescriptions.map((prescription) => (
                  <PrescriptionCard key={prescription.id} prescription={prescription} />
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No active prescriptions
                  </h3>
                  <p className="text-gray-600 text-center">
                    You have no active prescriptions at the moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedPrescriptions.length > 0 ? (
              <div className="grid gap-4">
                {completedPrescriptions.map((prescription) => (
                  <PrescriptionCard key={prescription.id} prescription={prescription} />
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No completed prescriptions
                  </h3>
                  <p className="text-gray-600 text-center">
                    You have no completed prescriptions yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    
  )
}