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
  FileText, 
  Search, 
  Plus, 
  Download, 
  Upload,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Activity,
  Heart,
  Scale,
  Thermometer,
  Droplet
} from "lucide-react"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"

interface HealthRecord {
  id: string
  type: string
  title: string
  description: string
  fileUrl?: string
  fileName?: string
  fileSize?: number
  fileType?: string
  createdAt: string
  appointmentDate?: string
  doctorName?: string
}

export default function PatientHealthRecords() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (session.user?.role !== "PATIENT") {
      router.push("/dashboard")
      return
    }

    fetchHealthRecords()
  }, [session, status, router])

  const fetchHealthRecords = async () => {
    try {
      // Mock data - in real app, this would come from API
      const mockRecords: HealthRecord[] = [
        {
          id: "1",
          type: "CONSULTATION",
          title: "General Consultation",
          description: "Routine checkup with Dr. Smith. Patient reports good health overall.",
          createdAt: "2024-01-15T10:00:00Z",
          appointmentDate: "2024-01-15T10:00:00Z",
          doctorName: "Dr. John Smith"
        },
        {
          id: "2",
          type: "LAB_TEST",
          title: "Blood Test Results",
          description: "Complete blood count showing normal levels. Cholesterol levels slightly elevated.",
          fileUrl: "/files/blood-test.pdf",
          fileName: "blood-test-results.pdf",
          fileSize: 2048000,
          fileType: "application/pdf",
          createdAt: "2024-01-10T14:30:00Z",
          appointmentDate: "2024-01-10T14:30:00Z",
          doctorName: "Dr. Sarah Johnson"
        },
        {
          id: "3",
          type: "PRESCRIPTION",
          title: "Medication Prescription",
          description: "Prescribed Lisinopril 10mg for hypertension. Take one tablet daily.",
          createdAt: "2024-01-08T09:15:00Z",
          appointmentDate: "2024-01-08T09:15:00Z",
          doctorName: "Dr. Michael Brown"
        },
        {
          id: "4",
          type: "IMAGING",
          title: "Chest X-Ray",
          description: "Chest X-ray shows clear lungs with no abnormalities.",
          fileUrl: "/files/chest-xray.jpg",
          fileName: "chest-xray.jpg",
          fileSize: 1024000,
          fileType: "image/jpeg",
          createdAt: "2024-01-05T11:00:00Z",
          appointmentDate: "2024-01-05T11:00:00Z",
          doctorName: "Dr. Emily Davis"
        },
        {
          id: "5",
          type: "VACCINATION",
          title: "COVID-19 Vaccination",
          description: "Received first dose of COVID-19 vaccine (Pfizer-BioNTech).",
          createdAt: "2024-01-01T13:45:00Z",
          appointmentDate: "2024-01-01T13:45:00Z",
          doctorName: "Dr. Robert Wilson"
        }
      ]

      setRecords(mockRecords)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching health records:', error)
      toast.error('Failed to load health records')
      setIsLoading(false)
    }
  }

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "CONSULTATION":
        return <User className="h-5 w-5" />
      case "LAB_TEST":
        return <Activity className="h-5 w-5" />
      case "PRESCRIPTION":
        return <Heart className="h-5 w-5" />
      case "IMAGING":
        return <Eye className="h-5 w-5" />
      case "VACCINATION":
        return <Scale className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getRecordTypeDisplay = (type: string) => {
    switch (type) {
      case "CONSULTATION":
        return "Consultation"
      case "LAB_TEST":
        return "Lab Test"
      case "PRESCRIPTION":
        return "Prescription"
      case "IMAGING":
        return "Imaging"
      case "VACCINATION":
        return "Vaccination"
      default:
        return type
    }
  }

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case "CONSULTATION":
        return "bg-blue-100 text-blue-800"
      case "LAB_TEST":
        return "bg-green-100 text-green-800"
      case "PRESCRIPTION":
        return "bg-purple-100 text-purple-800"
      case "IMAGING":
        return "bg-orange-100 text-orange-800"
      case "VACCINATION":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout userRole={UserRole.PATIENT}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
  }

  const filteredRecords = records.filter(record =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const recordsByType = filteredRecords.reduce((acc, record) => {
    if (!acc[record.type]) {
      acc[record.type] = []
    }
    acc[record.type].push(record)
    return acc
  }, {} as Record<string, HealthRecord[]>)

  const RecordCard = ({ record }: { record: HealthRecord }) => (
    <Card className="border-emerald-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                {getRecordIcon(record.type)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{record.title}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getRecordTypeColor(record.type)}>
                    {getRecordTypeDisplay(record.type)}
                  </Badge>
                  {record.appointmentDate && (
                    <span className="text-sm text-gray-500">
                      {new Date(record.appointmentDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{record.description}</p>

            {record.doctorName && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <User className="h-4 w-4" />
                <span>Dr. {record.doctorName}</span>
              </div>
            )}

            {record.fileName && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FileText className="h-4 w-4" />
                <span>{record.fileName}</span>
                {record.fileSize && (
                  <span>({formatFileSize(record.fileSize)})</span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2 ml-4">
            <Button 
              size="sm" 
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {record.fileUrl && (
              <Button 
                size="sm" 
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout userRole={UserRole.PATIENT}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
            <p className="text-gray-600 mt-2">
              View and manage your medical history and health documents
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Records
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Request Records
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search health records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-emerald-200 focus:border-emerald-500"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{records.length}</div>
              <p className="text-xs text-blue-600">
                Complete medical history
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lab Tests</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {records.filter(r => r.type === "LAB_TEST").length}
              </div>
              <p className="text-xs text-green-600">
                Test results available
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
              <Heart className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {records.filter(r => r.type === "PRESCRIPTION").length}
              </div>
              <p className="text-xs text-purple-600">
                Current medications
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Imaging</CardTitle>
              <Eye className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {records.filter(r => r.type === "IMAGING").length}
              </div>
              <p className="text-xs text-orange-600">
                Scans and X-rays
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Records by Type */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-emerald-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              All Records
            </TabsTrigger>
            {Object.keys(recordsByType).map(type => (
              <TabsTrigger 
                key={type} 
                value={type} 
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                {getRecordTypeDisplay(type)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredRecords.length > 0 ? (
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <RecordCard key={record.id} record={record} />
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No health records found
                  </h3>
                  <p className="text-gray-600 text-center">
                    {searchTerm 
                      ? "No records match your search. Try different keywords."
                      : "You don't have any health records yet. Your records will appear here after appointments."
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {Object.keys(recordsByType).map(type => (
            <TabsContent key={type} value={type} className="space-y-4">
              {recordsByType[type].length > 0 ? (
                <div className="space-y-4">
                  {recordsByType[type].map((record) => (
                    <RecordCard key={record.id} record={record} />
                  ))}
                </div>
              ) : (
                <Card className="border-emerald-200">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No {getRecordTypeDisplay(type).toLowerCase()} records found
                    </h3>
                    <p className="text-gray-600 text-center">
                      Your {getRecordTypeDisplay(type).toLowerCase()} records will appear here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}