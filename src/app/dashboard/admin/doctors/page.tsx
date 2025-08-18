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
  Stethoscope, 
  Search, 
  Plus, 
  UserCheck, 
  Calendar, 
  Star, 
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Eye,
  MoreHorizontal,
  Filter
} from "lucide-react"
import { UserRole } from "@prisma/client"

interface Doctor {
  id: string
  userId: string
  user: {
    name: string
    email: string
    phone?: string
    isActive: boolean
  }
  licenseNumber: string
  specialization: string
  experience: number
  rating: number
  consultationFee: number
  isAvailable: boolean
  bio?: string
  city: string
  totalAppointments: number
  completedAppointments: number
  monthlyRevenue: number
  createdAt: string
  lastActive?: string
}

export default function AdminDoctors() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [searchTerm, setSearchTerm] = useState("")

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

    // Mock data - in real app, this would come from API
    const mockDoctors: Doctor[] = [
      {
        id: "1",
        userId: "1",
        user: {
          name: "Dr. Sarah Johnson",
          email: "sarah.johnson@healthpay.com",
          phone: "+1-555-0123",
          isActive: true
        },
        licenseNumber: "MD-12345",
        specialization: "General Practitioner",
        experience: 8,
        rating: 4.8,
        consultationFee: 150,
        isAvailable: true,
        bio: "Experienced general practitioner with focus on preventive care and chronic disease management.",
        city: "New York",
        totalAppointments: 1250,
        completedAppointments: 1180,
        monthlyRevenue: 8500,
        createdAt: "2023-06-15T10:00:00Z",
        lastActive: "2024-01-12T14:30:00Z"
      },
      {
        id: "2",
        userId: "4",
        user: {
          name: "Dr. Michael Chen",
          email: "michael.chen@healthpay.com",
          phone: "+1-555-0126",
          isActive: true
        },
        licenseNumber: "MD-67890",
        specialization: "Cardiologist",
        experience: 12,
        rating: 4.9,
        consultationFee: 250,
        isAvailable: true,
        bio: "Board-certified cardiologist specializing in interventional cardiology and heart disease prevention.",
        city: "New York",
        totalAppointments: 980,
        completedAppointments: 920,
        monthlyRevenue: 12500,
        createdAt: "2023-07-05T11:00:00Z",
        lastActive: "2024-01-09T13:20:00Z"
      },
      {
        id: "3",
        userId: "6",
        user: {
          name: "Dr. Emily Rodriguez",
          email: "emily.rodriguez@healthpay.com",
          phone: "+1-555-0128",
          isActive: true
        },
        licenseNumber: "MD-54321",
        specialization: "Pediatrician",
        experience: 6,
        rating: 4.7,
        consultationFee: 120,
        isAvailable: false,
        bio: "Pediatrician dedicated to providing comprehensive care for children from infancy through adolescence.",
        city: "New York",
        totalAppointments: 750,
        completedAppointments: 710,
        monthlyRevenue: 6200,
        createdAt: "2023-08-20T14:30:00Z",
        lastActive: "2024-01-08T16:45:00Z"
      },
      {
        id: "4",
        userId: "8",
        user: {
          name: "Dr. James Wilson",
          email: "james.wilson@healthpay.com",
          phone: "+1-555-0130",
          isActive: false
        },
        licenseNumber: "MD-98765",
        specialization: "Dermatologist",
        experience: 10,
        rating: 4.6,
        consultationFee: 180,
        isAvailable: false,
        bio: "Dermatologist specializing in medical and cosmetic dermatology with expertise in skin cancer treatment.",
        city: "New York",
        totalAppointments: 620,
        completedAppointments: 590,
        monthlyRevenue: 0,
        createdAt: "2023-09-10T09:00:00Z",
        lastActive: "2023-12-15T10:00:00Z"
      }
    ]

    setDoctors(mockDoctors)
    setIsLoading(false)
  }, [session, status, router])

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

  const filteredDoctors = doctors.filter(doctor =>
    doctor.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const availableDoctors = filteredDoctors.filter(d => d.isAvailable && d.user.isActive)
  const unavailableDoctors = filteredDoctors.filter(d => !d.isAvailable || !d.user.isActive)
  const topRatedDoctors = filteredDoctors.filter(d => d.rating >= 4.7)

  const getSpecializationColor = (specialization: string) => {
    const colors: { [key: string]: string } = {
      "General Practitioner": "bg-blue-100 text-blue-800",
      "Cardiologist": "bg-red-100 text-red-800",
      "Pediatrician": "bg-purple-100 text-purple-800",
      "Dermatologist": "bg-green-100 text-green-800",
      "Neurologist": "bg-yellow-100 text-yellow-800",
      "Orthopedic": "bg-orange-100 text-orange-800"
    }
    return colors[specialization] || "bg-gray-100 text-gray-800"
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) 
            ? "text-yellow-400 fill-current" 
            : "text-gray-300"
        }`}
      />
    ))
  }

  const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
    const completionRate = doctor.totalAppointments > 0 
      ? Math.round((doctor.completedAppointments / doctor.totalAppointments) * 100) 
      : 0

    return (
      <Card className="border-emerald-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{doctor.user.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getSpecializationColor(doctor.specialization)}>
                      {doctor.specialization}
                    </Badge>
                    <Badge className={doctor.user.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"}>
                      {doctor.user.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge className={doctor.isAvailable ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {doctor.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">License</p>
                  <p className="text-sm text-gray-900">{doctor.licenseNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Experience</p>
                  <p className="text-sm text-gray-900">{doctor.experience} years</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Consultation Fee</p>
                  <p className="text-sm text-gray-900">${doctor.consultationFee}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="text-sm text-gray-900 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {doctor.city}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Rating & Performance</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {getRatingStars(doctor.rating)}
                    <span className="text-sm text-gray-600 ml-1">
                      {doctor.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{completionRate}%</span> completion rate
                  </div>
                </div>
              </div>

              {doctor.bio && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Bio</p>
                  <p className="text-sm text-gray-600">{doctor.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Total Appointments</p>
                  <p className="font-medium text-gray-900">{doctor.totalAppointments}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Completed</p>
                  <p className="font-medium text-gray-900">{doctor.completedAppointments}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Monthly Revenue</p>
                  <p className="font-medium text-gray-900">${doctor.monthlyRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2 ml-4">
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => router.push(`/dashboard/admin/doctors/${doctor.id}`)}
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
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Schedule
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
            <h1 className="text-3xl font-bold text-gray-900">Doctor Management</h1>
            <p className="text-gray-600 mt-2">
              Manage doctors in your healthcare network
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Doctor
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Doctors
              </CardTitle>
              <Stethoscope className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {doctors.length}
              </div>
              <p className="text-xs text-gray-600">
                In your network
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Available Now
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {availableDoctors.length}
              </div>
              <p className="text-xs text-gray-600">
                Ready for appointments
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {doctors.length > 0 ? (doctors.reduce((sum, d) => sum + d.rating, 0) / doctors.length).toFixed(1) : '0.0'}
              </div>
              <p className="text-xs text-gray-600">
                Across all doctors
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Monthly Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${doctors.reduce((sum, d) => sum + d.monthlyRevenue, 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">
                From all doctors
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="border-emerald-200">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search doctors by name, specialization, or license..."
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
              All ({filteredDoctors.length})
            </TabsTrigger>
            <TabsTrigger 
              value="available" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Available ({availableDoctors.length})
            </TabsTrigger>
            <TabsTrigger 
              value="unavailable" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Unavailable ({unavailableDoctors.length})
            </TabsTrigger>
            <TabsTrigger 
              value="top-rated" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Top Rated ({topRatedDoctors.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredDoctors.length > 0 ? (
              <div className="grid gap-4">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Stethoscope className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No doctors found
                  </h3>
                  <p className="text-gray-600 text-center">
                    {searchTerm ? 'No doctors match your search criteria.' : 'You have no doctors in your network yet.'}
                  </p>
                  <Button 
                    className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Doctor
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="available" className="space-y-4">
            {availableDoctors.length > 0 ? (
              <div className="grid gap-4">
                {availableDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No available doctors
                  </h3>
                  <p className="text-gray-600 text-center">
                    No doctors are currently available for appointments.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="unavailable" className="space-y-4">
            {unavailableDoctors.length > 0 ? (
              <div className="grid gap-4">
                {unavailableDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    All doctors available
                  </h3>
                  <p className="text-gray-600 text-center">
                    All doctors are currently available for appointments.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="top-rated" className="space-y-4">
            {topRatedDoctors.length > 0 ? (
              <div className="grid gap-4">
                {topRatedDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Star className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No top-rated doctors
                  </h3>
                  <p className="text-gray-600 text-center">
                    No doctors have achieved top rating status yet.
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