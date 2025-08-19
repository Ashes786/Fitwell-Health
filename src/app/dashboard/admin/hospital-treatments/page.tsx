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
  Hospital, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  DollarSign,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Stethoscope,
  Heart,
  Bone,
  Brain,
  Baby,
  Eye as EyeIcon,
  UserCheck,
  Calendar,
  MapPin,
  Star
} from "lucide-react"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"

interface Hospital {
  id: string
  name: string
  city: string
  state: string
}

interface HospitalTreatment {
  id: string
  name: string
  description: string
  category: string
  hospitalId: string
  hospital: Hospital
  basePrice: number
  duration: number
  durationUnit: 'HOURS' | 'DAYS' | 'WEEKS'
  requirements: string[]
  preparation: string[]
  recovery: string
  risks: string[]
  successRate: number
  isActive: boolean
  isPopular: boolean
  insuranceCoverage: string[]
  specializations: string[]
  createdAt: string
  updatedAt: string
  bookingCount: number
}

export default function AdminHospitalTreatments() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [treatments, setTreatments] = useState<HospitalTreatment[]>([])
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTreatment, setNewTreatment] = useState({
    name: "",
    description: "",
    category: "",
    hospitalId: "",
    basePrice: 0,
    duration: 1,
    durationUnit: 'DAYS' as 'HOURS' | 'DAYS' | 'WEEKS',
    requirements: [] as string[],
    preparation: [] as string[],
    recovery: "",
    risks: [] as string[],
    successRate: 95,
    isActive: true,
    isPopular: false,
    insuranceCoverage: [] as string[],
    specializations: [] as string[]
  })

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (session.user?.role !== "ADMIN") {
      router.push("/dashboard")
      return
    }

    fetchTreatments()
    fetchHospitals()
  }, [session, status, router])

  const fetchTreatments = async () => {
    try {
      // Mock data - in real app, this would come from API
      const mockTreatments: HospitalTreatment[] = [
        {
          id: "1",
          name: "Cardiac Bypass Surgery",
          description: "Open-heart surgery to bypass blocked coronary arteries and improve blood flow to the heart",
          category: "Cardiology",
          hospitalId: "3",
          hospital: {
            id: "3",
            name: "General Hospital Center",
            city: "New York",
            state: "NY"
          },
          basePrice: 25000,
          duration: 7,
          durationUnit: 'DAYS',
          requirements: ['Medical clearance', 'Blood tests', 'Cardiac evaluation', 'Chest X-ray'],
          preparation: ['Fasting 8 hours before surgery', 'Stop blood thinners', 'Arrange post-op care'],
          recovery: "4-6 weeks recovery period with limited physical activity",
          risks: ['Infection', 'Bleeding', 'Blood clots', 'Stroke'],
          successRate: 95,
          isActive: true,
          isPopular: true,
          insuranceCoverage: ['Most major insurance', 'Medicare', 'Medicaid'],
          specializations: ['Cardiology', 'Cardiothoracic Surgery'],
          createdAt: "2023-08-20T14:30:00Z",
          updatedAt: "2024-01-10T09:15:00Z",
          bookingCount: 45
        },
        {
          id: "2",
          name: "Knee Replacement Surgery",
          description: "Surgical procedure to replace damaged knee joint with artificial implant",
          category: "Orthopedics",
          hospitalId: "3",
          hospital: {
            id: "3",
            name: "General Hospital Center",
            city: "New York",
            state: "NY"
          },
          basePrice: 18000,
          duration: 3,
          durationUnit: 'DAYS',
          requirements: ['X-rays', 'MRI', 'Physical therapy evaluation', 'Medical clearance'],
          preparation: ['Pre-operative physical therapy', 'Medication review', 'Home preparation'],
          recovery: "6-8 weeks recovery with physical therapy",
          risks: ['Infection', 'Blood clots', 'Implant failure', 'Nerve damage'],
          successRate: 90,
          isActive: true,
          isPopular: false,
          insuranceCoverage: ['Most major insurance', 'Medicare'],
          specializations: ['Orthopedics', 'Physical Therapy'],
          createdAt: "2023-09-05T11:00:00Z",
          updatedAt: "2024-01-11T16:45:00Z",
          bookingCount: 32
        },
        {
          id: "3",
          name: "Childbirth Delivery",
          description: "Comprehensive childbirth services including natural delivery and C-section",
          category: "Obstetrics",
          hospitalId: "3",
          hospital: {
            id: "3",
            name: "General Hospital Center",
            city: "New York",
            state: "NY"
          },
          basePrice: 8000,
          duration: 2,
          durationUnit: 'DAYS',
          requirements: ['Prenatal care records', 'Blood tests', 'Ultrasound', 'Birth plan'],
          preparation: ['Hospital bag preparation', 'Transportation arranged', 'Support person identified'],
          recovery: "6-8 weeks postpartum recovery",
          risks: ['Infection', 'Hemorrhage', 'Pre-eclampsia', 'Birth complications'],
          successRate: 98,
          isActive: true,
          isPopular: true,
          insuranceCoverage: ['All major insurance', 'Medicaid', 'Private plans'],
          specializations: ['Obstetrics', 'Pediatrics'],
          createdAt: "2023-10-15T15:30:00Z",
          updatedAt: "2023-12-20T10:00:00Z",
          bookingCount: 78
        }
      ]

      setTreatments(mockTreatments)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching treatments:', error)
      toast.error('Failed to load hospital treatments')
      setIsLoading(false)
    }
  }

  const fetchHospitals = async () => {
    try {
      // Mock data - in real app, this would come from API
      const mockHospitals: Hospital[] = [
        {
          id: "3",
          name: "General Hospital Center",
          city: "New York",
          state: "NY"
        }
      ]

      setHospitals(mockHospitals)
    } catch (error) {
      console.error('Error fetching hospitals:', error)
    }
  }

  const handleAddTreatment = async () => {
    try {
      // In real app, this would be an API call
      const selectedHospital = hospitals.find(h => h.id === newTreatment.hospitalId)
      if (!selectedHospital) {
        toast.error('Please select a hospital')
        return
      }

      const newTreatmentData: HospitalTreatment = {
        id: Date.now().toString(),
        name: newTreatment.name,
        description: newTreatment.description,
        category: newTreatment.category,
        hospitalId: newTreatment.hospitalId,
        hospital: selectedHospital,
        basePrice: newTreatment.basePrice,
        duration: newTreatment.duration,
        durationUnit: newTreatment.durationUnit,
        requirements: newTreatment.requirements,
        preparation: newTreatment.preparation,
        recovery: newTreatment.recovery,
        risks: newTreatment.risks,
        successRate: newTreatment.successRate,
        isActive: newTreatment.isActive,
        isPopular: newTreatment.isPopular,
        insuranceCoverage: newTreatment.insuranceCoverage,
        specializations: newTreatment.specializations,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        bookingCount: 0
      }

      setTreatments([...treatments, newTreatmentData])
      setNewTreatment({
        name: "",
        description: "",
        category: "",
        hospitalId: "",
        basePrice: 0,
        duration: 1,
        durationUnit: 'DAYS',
        requirements: [],
        preparation: [],
        recovery: "",
        risks: [],
        successRate: 95,
        isActive: true,
        isPopular: false,
        insuranceCoverage: [],
        specializations: []
      })
      setIsAddDialogOpen(false)
      toast.success('Hospital treatment added successfully')
    } catch (error) {
      console.error('Error adding treatment:', error)
      toast.error('Failed to add hospital treatment')
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cardiology':
        return <Heart className="h-5 w-5 text-red-600" />
      case 'orthopedics':
        return <Bone className="h-5 w-5 text-blue-600" />
      case 'obstetrics':
        return <Baby className="h-5 w-5 text-pink-600" />
      case 'neurology':
        return <Brain className="h-5 w-5 text-purple-600" />
      case 'ophthalmology':
        return <EyeIcon className="h-5 w-5 text-green-600" />
      case 'dentistry':
        return <Stethoscope className="h-5 w-5 text-yellow-600" />
      default:
        return <Stethoscope className="h-5 w-5 text-gray-600" />
    }
  }

  if (status === "loading" || isLoading) {
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

  const filteredTreatments = treatments.filter(treatment =>
    treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeTreatments = filteredTreatments.filter(t => t.isActive)
  const inactiveTreatments = filteredTreatments.filter(t => !t.isActive)
  const popularTreatments = filteredTreatments.filter(t => t.isPopular)
  const categories = [...new Set(treatments.map(t => t.category))]

  const TreatmentCard = ({ treatment }: { treatment: HospitalTreatment }) => {
    return (
      <Card className="border-emerald-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  {getCategoryIcon(treatment.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{treatment.name}</h3>
                    <Badge className={treatment.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"}>
                      {treatment.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {treatment.isPopular && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{treatment.category} • {treatment.hospital.name}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{treatment.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Base Price</p>
                  <p className="text-lg font-bold text-gray-900">${treatment.basePrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="text-lg font-bold text-gray-900">{treatment.duration} {treatment.durationUnit.toLowerCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Success Rate</p>
                  <p className="text-lg font-bold text-gray-900">{treatment.successRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Bookings</p>
                  <p className="text-lg font-bold text-gray-900">{treatment.bookingCount}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Specializations</p>
                  <div className="flex flex-wrap gap-1">
                    {treatment.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Insurance Coverage</p>
                  <div className="flex flex-wrap gap-1">
                    {treatment.insuranceCoverage.map((insurance, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {insurance}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {treatment.hospital.city}, {treatment.hospital.state}
                  </p>
                  <p className="text-gray-600">
                    Added: {new Date(treatment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2 ml-4">
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => router.push(`/dashboard/admin/hospital-treatments/${treatment.id}`)}
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
            <h1 className="text-3xl font-bold text-gray-900">Hospital Treatments</h1>
            <p className="text-gray-600 mt-2">
              Manage hospital treatments and procedures with pricing information
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Treatment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Hospital Treatment</DialogTitle>
                  <DialogDescription>
                    Add a new treatment or procedure to a hospital in your network
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Treatment Name *</Label>
                      <Input
                        id="name"
                        value={newTreatment.name}
                        onChange={(e) => setNewTreatment({...newTreatment, name: e.target.value})}
                        placeholder="Cardiac Bypass Surgery"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={newTreatment.category} onValueChange={(value) => setNewTreatment({...newTreatment, category: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="Obstetrics">Obstetrics</SelectItem>
                          <SelectItem value="Neurology">Neurology</SelectItem>
                          <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                          <SelectItem value="Dentistry">Dentistry</SelectItem>
                          <SelectItem value="General Surgery">General Surgery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newTreatment.description}
                      onChange={(e) => setNewTreatment({...newTreatment, description: e.target.value})}
                      placeholder="Open-heart surgery to bypass blocked coronary arteries..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="hospitalId">Hospital *</Label>
                    <Select value={newTreatment.hospitalId} onValueChange={(value) => setNewTreatment({...newTreatment, hospitalId: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select hospital" />
                      </SelectTrigger>
                      <SelectContent>
                        {hospitals.map((hospital) => (
                          <SelectItem key={hospital.id} value={hospital.id}>
                            {hospital.name} - {hospital.city}, {hospital.state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="basePrice">Base Price ($) *</Label>
                      <Input
                        id="basePrice"
                        type="number"
                        value={newTreatment.basePrice}
                        onChange={(e) => setNewTreatment({...newTreatment, basePrice: parseFloat(e.target.value) || 0})}
                        placeholder="25000"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration *</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={newTreatment.duration}
                        onChange={(e) => setNewTreatment({...newTreatment, duration: parseInt(e.target.value) || 1})}
                        placeholder="7"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="durationUnit">Duration Unit *</Label>
                      <Select value={newTreatment.durationUnit} onValueChange={(value: 'HOURS' | 'DAYS' | 'WEEKS') => setNewTreatment({...newTreatment, durationUnit: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HOURS">Hours</SelectItem>
                          <SelectItem value="DAYS">Days</SelectItem>
                          <SelectItem value="WEEKS">Weeks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="successRate">Success Rate (%)</Label>
                      <Input
                        id="successRate"
                        type="number"
                        value={newTreatment.successRate}
                        onChange={(e) => setNewTreatment({...newTreatment, successRate: parseInt(e.target.value) || 95})}
                        placeholder="95"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="recovery">Recovery Period</Label>
                      <Input
                        id="recovery"
                        value={newTreatment.recovery}
                        onChange={(e) => setNewTreatment({...newTreatment, recovery: e.target.value})}
                        placeholder="4-6 weeks"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddTreatment} disabled={!newTreatment.name || !newTreatment.description || !newTreatment.hospitalId}>
                      Add Treatment
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
                  <p className="text-sm font-medium text-gray-600">Total Treatments</p>
                  <p className="text-2xl font-bold text-gray-900">{treatments.length}</p>
                </div>
                <Hospital className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Treatments</p>
                  <p className="text-2xl font-bold text-gray-900">{activeTreatments.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Popular Treatments</p>
                  <p className="text-2xl font-bold text-gray-900">{popularTreatments.length}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                </div>
                <Filter className="h-8 w-8 text-purple-600" />
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
                placeholder="Search treatments by name, description, category, or hospital..."
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
              All Treatments ({filteredTreatments.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Active ({activeTreatments.length})
            </TabsTrigger>
            <TabsTrigger value="popular" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Popular ({popularTreatments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {filteredTreatments.map((treatment) => (
                <TreatmentCard key={treatment.id} treatment={treatment} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4">
              {activeTreatments.map((treatment) => (
                <TreatmentCard key={treatment.id} treatment={treatment} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-4">
            <div className="grid gap-4">
              {popularTreatments.map((treatment) => (
                <TreatmentCard key={treatment.id} treatment={treatment} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}