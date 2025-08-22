'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Star, 
  MapPin, 
  Phone, 
  Video, 
  Clock, 
  DollarSign,
  Heart,
  Award,
  TrendingUp,
  Filter,
  User,
  Stethoscope,
  Building,
  FlaskConical,
  Pill,
  Activity,
  Calendar,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { UserRole } from "@prisma/client"

interface DoctorRecommendation {
  id: string
  name: string
  specialization: string
  rating: number
  experience: number
  consultationFee: number
  availability: string
  distance: number
  matchScore: number
  isAvailable: boolean
  nextAvailable: string
  hospital?: string
  profileImage?: string
  bio: string
  services: string[]
  languages: string[]
}

interface ServiceRecommendation {
  id: string
  name: string
  category: string
  description: string
  price: number
  discount?: number
  rating: number
  popularity: number
  provider: string
  location: string
  isRecommended: boolean
  reason: string
  icon: any
  color: string
}

interface HealthTip {
  id: string
  title: string
  description: string
  category: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  source: string
  relevanceScore: number
}

export default function PatientRecommendations() {
  const { isAuthorized, isUnauthorized, isLoading } = useRoleAuthorization({
    requiredRole: UserRole.PATIENT,
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()
  const [doctorRecommendations, setDoctorRecommendations] = useState<DoctorRecommendation[]>([])
  const [serviceRecommendations, setServiceRecommendations] = useState<ServiceRecommendation[]>([])
  const [healthTips, setHealthTips] = useState<HealthTip[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthorized) {
      fetchRecommendations()
    }
  }, [isAuthorized])

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      // Mock doctor recommendations
      const mockDoctorRecommendations: DoctorRecommendation[] = [
        {
          id: "1",
          name: "Dr. Sarah Johnson",
          specialization: "Cardiology",
          rating: 4.8,
          experience: 12,
          consultationFee: 150,
          availability: "Mon, Wed, Fri",
          distance: 2.5,
          matchScore: 95,
          isAvailable: true,
          nextAvailable: "2024-01-15 10:00 AM",
          hospital: "City General Hospital",
          bio: "Experienced cardiologist specializing in preventive heart care and cardiovascular diseases.",
          services: ["Heart Checkup", "ECG", "Stress Test", "Cardiac Consultation"],
          languages: ["English", "Spanish"]
        },
        {
          id: "2",
          name: "Dr. Michael Chen",
          specialization: "Dermatology",
          rating: 4.6,
          experience: 8,
          consultationFee: 120,
          availability: "Tue, Thu, Sat",
          distance: 3.2,
          matchScore: 88,
          isAvailable: true,
          nextAvailable: "2024-01-16 2:00 PM",
          hospital: "Skin Care Center",
          bio: "Specialized in dermatology with focus on skin cancer prevention and cosmetic dermatology.",
          services: ["Skin Consultation", "Acne Treatment", "Skin Cancer Screening", "Cosmetic Procedures"],
          languages: ["English", "Mandarin"]
        },
        {
          id: "3",
          name: "Dr. Emily Rodriguez",
          specialization: "Pediatrics",
          rating: 4.9,
          experience: 15,
          consultationFee: 100,
          availability: "Mon-Fri",
          distance: 1.8,
          matchScore: 92,
          isAvailable: false,
          nextAvailable: "2024-01-17 9:00 AM",
          hospital: "Children's Medical Center",
          bio: "Compassionate pediatrician dedicated to providing comprehensive care for children of all ages.",
          services: ["Child Checkup", "Vaccination", "Pediatric Consultation", "Developmental Screening"],
          languages: ["English", "Spanish"]
        }
      ]

      // Mock service recommendations
      const mockServiceRecommendations: ServiceRecommendation[] = [
        {
          id: "1",
          name: "Complete Blood Count",
          category: "Lab Test",
          description: "Comprehensive blood analysis including red and white blood cells, platelets, and hemoglobin",
          price: 45,
          discount: 15,
          rating: 4.7,
          popularity: 85,
          provider: "City Lab Services",
          location: "Downtown",
          isRecommended: true,
          reason: "Based on your age and health profile",
          icon: FlaskConical,
          color: "bg-green-500"
        },
        {
          id: "2",
          name: "Annual Health Checkup",
          category: "Health Package",
          description: "Complete annual health assessment including physical examination and basic lab tests",
          price: 200,
          discount: 25,
          rating: 4.8,
          popularity: 92,
          provider: "HealthPlus Diagnostics",
          location: "Medical District",
          isRecommended: true,
          reason: "Recommended for your age group",
          icon: Activity,
          color: "bg-blue-500"
        },
        {
          id: "3",
          name: "Vitamin D Test",
          category: "Lab Test",
          description: "Measure vitamin D levels in your blood to assess deficiency or toxicity",
          price: 35,
          discount: 10,
          rating: 4.5,
          popularity: 78,
          provider: "Metro Lab",
          location: "Uptown",
          isRecommended: true,
          reason: "Based on your recent symptoms",
          icon: FlaskConical,
          color: "bg-purple-500"
        },
        {
          id: "4",
          name: "Nutrition Consultation",
          category: "Specialist Service",
          description: "Personalized nutrition assessment and dietary planning with certified nutritionist",
          price: 80,
          rating: 4.6,
          popularity: 73,
          provider: "Wellness Center",
          location: "Midtown",
          isRecommended: false,
          reason: "Popular service in your area",
          icon: Heart,
          color: "bg-orange-500"
        }
      ]

      // Mock health tips
      const mockHealthTips: HealthTip[] = [
        {
          id: "1",
          title: "Stay Hydrated",
          description: "Drink at least 8 glasses of water daily to maintain optimal body function and skin health.",
          category: "General Health",
          priority: "HIGH",
          source: "WHO Guidelines",
          relevanceScore: 95
        },
        {
          id: "2",
          title: "Regular Exercise",
          description: "Aim for 30 minutes of moderate exercise most days of the week for cardiovascular health.",
          category: "Fitness",
          priority: "HIGH",
          source: "American Heart Association",
          relevanceScore: 90
        },
        {
          id: "3",
          title: "Sleep Hygiene",
          description: "Maintain 7-9 hours of quality sleep each night for optimal physical and mental health.",
          category: "Mental Health",
          priority: "MEDIUM",
          source: "Sleep Foundation",
          relevanceScore: 85
        }
      ]

      setDoctorRecommendations(mockDoctorRecommendations)
      setServiceRecommendations(mockServiceRecommendations)
      setHealthTips(mockHealthTips)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800"
    if (score >= 80) return "bg-blue-100 text-blue-800"
    if (score >= 70) return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-100 text-red-800"
      case "MEDIUM": return "bg-yellow-100 text-yellow-800"
      case "LOW": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const filteredDoctors = doctorRecommendations.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredServices = serviceRecommendations.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-3xl font-bold text-gray-900">Recommendations</h1>
          <p className="text-gray-600 mt-2">Personalized healthcare recommendations based on your profile</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            onClick={() => router.push('/dashboard/patient/book-appointment')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search doctors, services, or specialties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="doctors" className="space-y-4">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="doctors" className="data-[state=active]:bg-white">
            <Stethoscope className="mr-2 h-4 w-4" />
            Doctors
          </TabsTrigger>
          <TabsTrigger value="services" className="data-[state=active]:bg-white">
            <Activity className="mr-2 h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="tips" className="data-[state=active]:bg-white">
            <Heart className="mr-2 h-4 w-4" />
            Health Tips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="doctors" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-medium text-gray-900">{doctor.name}</CardTitle>
                        <CardDescription>{doctor.specialization}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getMatchScoreColor(doctor.matchScore)}>
                      {doctor.matchScore}% match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{doctor.rating}</span>
                      </div>
                      <span className="text-gray-600">{doctor.experience} years exp.</span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Consultation Fee:</span>
                        <span className="font-medium">${doctor.consultationFee}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Distance:</span>
                        <span className="font-medium">{doctor.distance} km</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Availability:</span>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${doctor.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="font-medium">{doctor.isAvailable ? 'Available' : 'Busy'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {doctor.services.slice(0, 3).map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {doctor.services.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{doctor.services.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <Button 
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => router.push('/dashboard/patient/book-appointment')}
                      >
                        Book Appointment
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => router.push('/dashboard/patient/vitals')}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => {
              const Icon = service.icon
              const discountedPrice = service.discount ? service.price * (1 - service.discount / 100) : service.price
              
              return (
                <Card key={service.id} className="border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${service.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-medium text-gray-900">{service.name}</CardTitle>
                          <CardDescription>{service.category}</CardDescription>
                        </div>
                      </div>
                      {service.isRecommended && (
                        <Badge className="bg-blue-100 text-blue-800">
                          Recommended
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">{service.description}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Provider:</span>
                          <span className="font-medium">{service.provider}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{service.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Rating:</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{service.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-gray-900">
                              ${discountedPrice.toFixed(2)}
                            </span>
                            {service.discount && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ${service.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          {service.discount && (
                            <Badge className="bg-red-100 text-red-800">
                              {service.discount}% OFF
                            </Badge>
                          )}
                        </div>
                        {service.isRecommended && (
                          <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {service.reason}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 space-y-2">
                        <Button 
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => router.push('/dashboard/patient/book-appointment')}
                        >
                          Book Service
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => router.push('/dashboard/patient/subscription')}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {healthTips.map((tip) => (
              <Card key={tip.id} className="border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium text-gray-900">{tip.title}</CardTitle>
                    <Badge className={getPriorityColor(tip.priority)}>
                      {tip.priority}
                    </Badge>
                  </div>
                  <CardDescription>{tip.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">{tip.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Source:</span>
                        <span className="font-medium">{tip.source}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Relevance:</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${tip.relevanceScore}%` }}
                            ></div>
                          </div>
                          <span className="font-medium text-green-600">{tip.relevanceScore}%</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push('/dashboard/patient/vitals')}
                    >
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}