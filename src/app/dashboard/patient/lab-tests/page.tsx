'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Download,
  Share,
  Plus,
  Filter,
  FlaskConical,
  Activity,
  TrendingUp,
  MapPin,
  Phone,
  Star,
  User,
  ArrowRight,
  Eye,
  Bell
} from "lucide-react"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { UserRole } from "@prisma/client"

interface LabTest {
  id: string
  testName: string
  description: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  orderedDate: string
  completedDate?: string
  results?: string
  normalRange?: string
  isAbnormal: boolean
  doctor: string
  labPartner: string
  category: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  cost: number
  discount?: number
  reportUrl?: string
}

interface TestCategory {
  name: string
  count: number
  icon: any
  color: string
}

interface UpcomingTest {
  id: string
  testName: string
  scheduledDate: string
  time: string
  location: string
  instructions: string
  status: 'SCHEDULED' | 'CONFIRMED' | 'READY'
}

export default function PatientLabTests() {
  const { isAuthorized, isUnauthorized, isLoading } = useRoleAuthorization({
    requiredRole: UserRole.PATIENT,
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()
  const [labTests, setLabTests] = useState<LabTest[]>([])
  const [testCategories, setTestCategories] = useState<TestCategory[]>([])
  const [upcomingTests, setUpcomingTests] = useState<UpcomingTest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthorized) {
      fetchLabTestData()
    }
  }, [isAuthorized])

  const fetchLabTestData = async () => {
    setLoading(true)
    try {
      // Mock lab tests data
      const mockLabTests: LabTest[] = [
        {
          id: "1",
          testName: "Complete Blood Count (CBC)",
          description: "Comprehensive blood analysis including red and white blood cells, hemoglobin, and platelets",
          status: "COMPLETED",
          orderedDate: "2024-01-05",
          completedDate: "2024-01-06",
          results: "All parameters within normal range. WBC: 6.8 x 10³/µL, RBC: 4.7 x 10⁶/µL, Hgb: 14.2 g/dL, Platelets: 250 x 10³/µL",
          normalRange: "WBC: 4.0-11.0 x 10³/µL, RBC: 4.2-5.4 x 10⁶/µL, Hgb: 13.5-17.5 g/dL",
          isAbnormal: false,
          doctor: "Dr. Sarah Johnson",
          labPartner: "City Lab Services",
          category: "Hematology",
          priority: "MEDIUM",
          cost: 45,
          discount: 15,
          reportUrl: "/reports/cbc-123.pdf"
        },
        {
          id: "2",
          testName: "Lipid Panel",
          description: "Cholesterol and triglyceride levels assessment",
          status: "COMPLETED",
          orderedDate: "2024-01-05",
          completedDate: "2024-01-07",
          results: "Total Cholesterol: 195 mg/dL, LDL: 120 mg/dL, HDL: 55 mg/dL, Triglycerides: 100 mg/dL",
          normalRange: "Total: <200 mg/dL, LDL: <100 mg/dL, HDL: >40 mg/dL, Triglycerides: <150 mg/dL",
          isAbnormal: false,
          doctor: "Dr. Sarah Johnson",
          labPartner: "City Lab Services",
          category: "Cardiology",
          priority: "HIGH",
          cost: 65,
          discount: 10,
          reportUrl: "/reports/lipid-456.pdf"
        },
        {
          id: "3",
          testName: "Vitamin D Test",
          description: "Measurement of vitamin D levels in blood",
          status: "IN_PROGRESS",
          orderedDate: "2024-01-10",
          doctor: "Dr. Michael Chen",
          labPartner: "Metro Lab",
          category: "Endocrinology",
          priority: "MEDIUM",
          cost: 35,
          discount: 10
        },
        {
          id: "4",
          testName: "Thyroid Function Test",
          description: "TSH, T3, and T4 levels assessment",
          status: "PENDING",
          orderedDate: "2024-01-12",
          doctor: "Dr. Emily Rodriguez",
          labPartner: "HealthPlus Diagnostics",
          category: "Endocrinology",
          priority: "MEDIUM",
          cost: 80
        },
        {
          id: "5",
          testName: "HbA1c",
          description: "Glycated hemoglobin test for diabetes monitoring",
          status: "COMPLETED",
          orderedDate: "2024-01-01",
          completedDate: "2024-01-03",
          results: "HbA1c: 5.8%",
          normalRange: "<5.7%",
          isAbnormal: true,
          doctor: "Dr. Sarah Johnson",
          labPartner: "City Lab Services",
          category: "Diabetes",
          priority: "HIGH",
          cost: 40,
          reportUrl: "/reports/hba1c-789.pdf"
        }
      ]

      const mockTestCategories: TestCategory[] = [
        { name: "Hematology", count: 1, icon: FlaskConical, color: "bg-red-500" },
        { name: "Cardiology", count: 1, icon: Activity, color: "bg-blue-500" },
        { name: "Endocrinology", count: 2, icon: TrendingUp, color: "bg-green-500" },
        { name: "Diabetes", count: 1, icon: Activity, color: "bg-purple-500" }
      ]

      const mockUpcomingTests: UpcomingTest[] = [
        {
          id: "1",
          testName: "Vitamin D Test",
          scheduledDate: "2024-01-15",
          time: "9:00 AM",
          location: "Metro Lab - Downtown Branch",
          instructions: "Fasting required for 8 hours prior to test. Bring previous test reports.",
          status: "CONFIRMED"
        },
        {
          id: "2",
          testName: "Thyroid Function Test",
          scheduledDate: "2024-01-18",
          time: "10:30 AM",
          location: "HealthPlus Diagnostics - Medical District",
          instructions: "No special preparation required. Avoid thyroid medication for 24 hours if possible.",
          status: "SCHEDULED"
        }
      ]

      setLabTests(mockLabTests)
      setTestCategories(mockTestCategories)
      setUpcomingTests(mockUpcomingTests)
    } catch (error) {
      console.error('Error fetching lab test data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-800"
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800"
      case "PENDING": return "bg-yellow-100 text-yellow-800"
      case "CANCELLED": return "bg-red-100 text-red-800"
      case "SCHEDULED": return "bg-yellow-100 text-yellow-800"
      case "CONFIRMED": return "bg-blue-100 text-blue-800"
      case "READY": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-100 text-red-800"
      case "MEDIUM": return "bg-yellow-100 text-yellow-800"
      case "LOW": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTests = labTests.filter(test =>
    test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const completedTests = labTests.filter(test => test.status === 'COMPLETED')
  const pendingTests = labTests.filter(test => test.status === 'PENDING' || test.status === 'IN_PROGRESS')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laboratory Tests</h1>
          <p className="text-gray-600 mt-2">Manage your lab tests and view results</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            onClick={() => router.push('/dashboard/patient/subscription')}
          >
            <Star className="mr-2 h-4 w-4" />
            View Benefits
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            Book New Test
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tests</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{labTests.length}</p>
                <p className="text-xs text-gray-400 mt-2">All time</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FlaskConical className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{completedTests.length}</p>
                <p className="text-xs text-gray-400 mt-2">With results</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{pendingTests.length}</p>
                <p className="text-xs text-gray-400 mt-2">Awaiting results</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{upcomingTests.length}</p>
                <p className="text-xs text-gray-400 mt-2">Scheduled tests</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search lab tests by name, category, or doctor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="all" className="data-[state=active]:bg-white">
            All Tests
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-white">
            Completed
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-white">
            Pending
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-white">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-white">
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <FlaskConical className="mr-2 h-5 w-5 text-blue-600" />
                All Laboratory Tests
              </CardTitle>
              <CardDescription>Your complete lab test history and current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTests.map((test) => (
                  <Card key={test.id} className="border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FlaskConical className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{test.testName}</h3>
                            <p className="text-sm text-gray-600">{test.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(test.status)}>
                            {test.status.replace('_', ' ')}
                          </Badge>
                          {test.priority === 'HIGH' && (
                            <Badge className="bg-red-100 text-red-800">
                              High Priority
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Ordered Date</p>
                          <p className="font-medium">{new Date(test.orderedDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Doctor</p>
                          <p className="font-medium">{test.doctor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Lab Partner</p>
                          <p className="font-medium">{test.labPartner}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Cost</p>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">${test.cost}</span>
                            {test.discount && (
                              <Badge className="bg-green-100 text-green-800">
                                {test.discount}% OFF
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {test.status === 'COMPLETED' && test.results && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">Test Results</h4>
                            <div className="flex items-center space-x-2">
                              {test.isAbnormal && (
                                <Badge className="bg-red-100 text-red-800">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Abnormal
                                </Badge>
                              )}
                              <Badge className="bg-green-100 text-green-800">
                                {test.completedDate && new Date(test.completedDate).toLocaleDateString()}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{test.results}</p>
                          <p className="text-xs text-gray-600">Normal Range: {test.normalRange}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <Badge className="bg-gray-100 text-gray-800">
                          {test.category}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          {test.status === 'COMPLETED' && test.reportUrl && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(test.reportUrl, '_blank')}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Report
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(test.reportUrl, '_blank')}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </>
                          )}
                          {test.status === 'PENDING' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => router.push('/dashboard/patient/book-appointment')}
                            >
                              <Calendar className="h-4 w-4 mr-1" />
                              Schedule
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4">
            {completedTests.map((test) => (
              <Card key={test.id} className="border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{test.testName}</h3>
                        <p className="text-sm text-gray-600">{test.category}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Completed Date</p>
                      <p className="font-medium">{test.completedDate && new Date(test.completedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Lab Partner</p>
                      <p className="font-medium">{test.labPartner}</p>
                    </div>
                  </div>

                  {test.results && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Results Summary</h4>
                      <p className="text-sm text-gray-700">{test.results}</p>
                      {test.isAbnormal && (
                        <div className="flex items-center space-x-2 mt-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-600">Some results are outside normal range</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      {test.reportUrl && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(test.reportUrl, '_blank')}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Report
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(test.reportUrl, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push('/dashboard/patient/book-appointment')}
                    >
                      <Share className="h-4 w-4 mr-1" />
                      Share with Doctor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4">
            {pendingTests.map((test) => (
              <Card key={test.id} className="border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{test.testName}</h3>
                        <p className="text-sm text-gray-600">{test.category}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(test.status)}>
                      {test.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Ordered Date</p>
                      <p className="font-medium">{new Date(test.orderedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Lab Partner</p>
                      <p className="font-medium">{test.labPartner}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-gray-100 text-gray-800">
                        {test.priority} Priority
                      </Badge>
                      <span className="text-sm text-gray-600">Cost: ${test.cost}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push('/dashboard/patient/book-appointment')}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule Test
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push('/dashboard/patient/subscription')}
                      >
                        <Bell className="h-4 w-4 mr-1" />
                        Set Reminder
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4">
            {upcomingTests.map((test) => (
              <Card key={test.id} className="border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{test.testName}</h3>
                        <p className="text-sm text-gray-600">{test.location}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(test.status)}>
                      {test.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="font-medium">{new Date(test.scheduledDate).toLocaleDateString()} at {test.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium">{test.status}</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
                    <p className="text-sm text-gray-700">{test.instructions}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push('/dashboard/patient/book-appointment')}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      Get Directions
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push('/dashboard/patient/book-appointment')}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Contact Lab
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push('/dashboard/patient/book-appointment')}
                      >
                        <Bell className="h-4 w-4 mr-1" />
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testCategories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.name} className="border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.count} tests</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setSearchTerm(category.name)}
                    >
                      View Tests
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}