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
  MapPin, 
  Phone, 
  Star, 
  Filter,
  Building,
  Stethoscope,
  FlaskConical,
  Pill,
  Activity,
  User,
  Heart,
  Clock,
  DollarSign,
  Video,
  Navigation,
  Calendar,
  Mail,
  Globe,
  Award,
  CheckCircle,
  ArrowRight,
  Eye,
  PhoneCall,
  MessageSquare
} from "lucide-react"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { UserRole } from "@prisma/client"

interface HealthcareProvider {
  id: string
  name: string
  type: 'HOSPITAL' | 'CLINIC' | 'LABORATORY' | 'PHARMACY' | 'SPECIALIST' | 'DIAGNOSTIC_CENTER'
  category: string
  description: string
  address: string
  city: string
  state: string
  postalCode: string
  phone: string
  email?: string
  website?: string
  rating: number
  reviews: number
  distance: number
  isAvailable: boolean
  isOpen: boolean
  services: string[]
  specialties?: string[]
  doctors?: number
  establishedYear?: number
  accreditation?: string[]
  insuranceAccepted: string[]
  paymentMethods: string[]
  operatingHours: {
    [key: string]: {
      open: string
      close: string
      isClosed: boolean
    }
  }
  emergencyServices: boolean
  telemedicineAvailable: boolean
  homeDelivery: boolean
  parkingAvailable: boolean
  wheelchairAccessible: boolean
  languages: string[]
  images?: string[]
  featured: boolean
  discount?: number
}

interface FilterOptions {
  type: string[]
  distance: number
  rating: number
  services: string[]
  availability: boolean
  emergency: boolean
  telemedicine: boolean
  insurance: string[]
}

export default function PatientDirectory() {
  const { isAuthorized, isUnauthorized, isLoading } = useRoleAuthorization({
    requiredRole: UserRole.PATIENT,
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()
  const [providers, setProviders] = useState<HealthcareProvider[]>([])
  const [filteredProviders, setFilteredProviders] = useState<HealthcareProvider[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    type: [],
    distance: 10,
    rating: 0,
    services: [],
    availability: false,
    emergency: false,
    telemedicine: false,
    insurance: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthorized) {
      fetchDirectoryData()
    }
  }, [isAuthorized])

  useEffect(() => {
    filterProviders()
  }, [providers, searchTerm, filters])

  const fetchDirectoryData = async () => {
    setLoading(true)
    try {
      // Mock healthcare providers data
      const mockProviders: HealthcareProvider[] = [
        {
          id: "1",
          name: "City General Hospital",
          type: "HOSPITAL",
          category: "General Hospital",
          description: "Comprehensive healthcare facility with 24/7 emergency services and advanced medical technology",
          address: "123 Medical Center Blvd",
          city: "Downtown",
          state: "CA",
          postalCode: "90210",
          phone: "(555) 123-4567",
          email: "info@citygeneral.com",
          website: "www.citygeneral.com",
          rating: 4.5,
          reviews: 1247,
          distance: 2.5,
          isAvailable: true,
          isOpen: true,
          services: ["Emergency Care", "Surgery", "Cardiology", "Maternity", "Pediatrics", "Radiology"],
          specialties: ["Cardiology", "Neurology", "Orthopedics", "Oncology"],
          doctors: 150,
          establishedYear: 1985,
          accreditation: ["JCI", "ISO 9001"],
          insuranceAccepted: ["Aetna", "Blue Cross", "Cigna", "Medicare"],
          paymentMethods: ["Credit Card", "Insurance", "Cash"],
          operatingHours: {
            monday: { open: "00:00", close: "23:59", isClosed: false },
            tuesday: { open: "00:00", close: "23:59", isClosed: false },
            wednesday: { open: "00:00", close: "23:59", isClosed: false },
            thursday: { open: "00:00", close: "23:59", isClosed: false },
            friday: { open: "00:00", close: "23:59", isClosed: false },
            saturday: { open: "00:00", close: "23:59", isClosed: false },
            sunday: { open: "00:00", close: "23:59", isClosed: false }
          },
          emergencyServices: true,
          telemedicineAvailable: true,
          homeDelivery: false,
          parkingAvailable: true,
          wheelchairAccessible: true,
          languages: ["English", "Spanish", "Mandarin"],
          featured: true
        },
        {
          id: "2",
          name: "MedPlus Laboratory",
          type: "LABORATORY",
          category: "Diagnostic Laboratory",
          description: "State-of-the-art diagnostic laboratory offering comprehensive testing services with quick results",
          address: "456 Science Park Dr",
          city: "Midtown",
          state: "CA",
          postalCode: "90211",
          phone: "(555) 234-5678",
          email: "lab@medplus.com",
          website: "www.medpluslab.com",
          rating: 4.7,
          reviews: 892,
          distance: 3.2,
          isAvailable: true,
          isOpen: true,
          services: ["Blood Tests", "DNA Testing", "Pathology", "Radiology", "Health Screening"],
          insuranceAccepted: ["Aetna", "Blue Cross", "Cigna", "UnitedHealth"],
          paymentMethods: ["Credit Card", "Insurance", "HealthPay"],
          operatingHours: {
            monday: { open: "06:00", close: "20:00", isClosed: false },
            tuesday: { open: "06:00", close: "20:00", isClosed: false },
            wednesday: { open: "06:00", close: "20:00", isClosed: false },
            thursday: { open: "06:00", close: "20:00", isClosed: false },
            friday: { open: "06:00", close: "20:00", isClosed: false },
            saturday: { open: "07:00", close: "18:00", isClosed: false },
            sunday: { open: "08:00", close: "16:00", isClosed: false }
          },
          emergencyServices: false,
          telemedicineAvailable: false,
          homeDelivery: true,
          parkingAvailable: true,
          wheelchairAccessible: true,
          languages: ["English", "Spanish"],
          discount: 15
        },
        {
          id: "3",
          name: "Heart Care Specialists",
          type: "SPECIALIST",
          category: "Cardiology Clinic",
          description: "Leading cardiology practice with expert cardiologists and advanced heart care treatments",
          address: "789 Cardiology Way",
          city: "Medical District",
          state: "CA",
          postalCode: "90212",
          phone: "(555) 345-6789",
          email: "appointments@heartcare.com",
          website: "www.heartcare.com",
          rating: 4.8,
          reviews: 634,
          distance: 4.1,
          isAvailable: true,
          isOpen: true,
          services: ["Cardiac Consultation", "ECG", "Echocardiogram", "Stress Test", "Cardiac Catheterization"],
          specialties: ["Interventional Cardiology", "Electrophysiology", "Heart Failure"],
          doctors: 8,
          establishedYear: 2005,
          accreditation: ["ACC"],
          insuranceAccepted: ["Aetna", "Blue Cross", "Cigna", "Medicare"],
          paymentMethods: ["Credit Card", "Insurance"],
          operatingHours: {
            monday: { open: "08:00", close: "17:00", isClosed: false },
            tuesday: { open: "08:00", close: "17:00", isClosed: false },
            wednesday: { open: "08:00", close: "17:00", isClosed: false },
            thursday: { open: "08:00", close: "17:00", isClosed: false },
            friday: { open: "08:00", close: "17:00", isClosed: false },
            saturday: { open: "09:00", close: "13:00", isClosed: false },
            sunday: { open: "00:00", close: "00:00", isClosed: true }
          },
          emergencyServices: false,
          telemedicineAvailable: true,
          homeDelivery: false,
          parkingAvailable: true,
          wheelchairAccessible: true,
          languages: ["English", "Spanish"],
          featured: true
        },
        {
          id: "4",
          name: "QuickCare Pharmacy",
          type: "PHARMACY",
          category: "Community Pharmacy",
          description: "Full-service pharmacy with prescription medications, over-the-counter drugs, and health consultations",
          address: "321 Health St",
          city: "Uptown",
          state: "CA",
          postalCode: "90213",
          phone: "(555) 456-7890",
          email: "info@quickcarepharmacy.com",
          website: "www.quickcarepharmacy.com",
          rating: 4.3,
          reviews: 445,
          distance: 1.8,
          isAvailable: true,
          isOpen: true,
          services: ["Prescription Filling", "Health Consultations", "Vaccinations", "Health Products"],
          insuranceAccepted: ["Aetna", "Blue Cross", "Cigna", "Medicare"],
          paymentMethods: ["Credit Card", "Insurance", "Cash", "HealthPay"],
          operatingHours: {
            monday: { open: "08:00", close: "21:00", isClosed: false },
            tuesday: { open: "08:00", close: "21:00", isClosed: false },
            wednesday: { open: "08:00", close: "21:00", isClosed: false },
            thursday: { open: "08:00", close: "21:00", isClosed: false },
            friday: { open: "08:00", close: "21:00", isClosed: false },
            saturday: { open: "09:00", close: "19:00", isClosed: false },
            sunday: { open: "10:00", close: "17:00", isClosed: false }
          },
          emergencyServices: false,
          telemedicineAvailable: false,
          homeDelivery: true,
          parkingAvailable: true,
          wheelchairAccessible: true,
          languages: ["English", "Spanish"],
          discount: 20
        },
        {
          id: "5",
          name: "Family Health Clinic",
          type: "CLINIC",
          category: "Primary Care",
          description: "Comprehensive family healthcare with experienced physicians and personalized care",
          address: "555 Family Care Ave",
          city: "Suburbia",
          state: "CA",
          postalCode: "90214",
          phone: "(555) 567-8901",
          email: "contact@familyhealth.com",
          website: "www.familyhealth.com",
          rating: 4.6,
          reviews: 723,
          distance: 5.2,
          isAvailable: true,
          isOpen: true,
          services: ["General Consultation", "Vaccinations", "Health Screening", "Chronic Disease Management"],
          specialties: ["Family Medicine", "Internal Medicine", "Pediatrics"],
          doctors: 12,
          establishedYear: 1998,
          insuranceAccepted: ["Aetna", "Blue Cross", "Cigna", "Medicare"],
          paymentMethods: ["Credit Card", "Insurance", "Cash"],
          operatingHours: {
            monday: { open: "07:00", close: "19:00", isClosed: false },
            tuesday: { open: "07:00", close: "19:00", isClosed: false },
            wednesday: { open: "07:00", close: "19:00", isClosed: false },
            thursday: { open: "07:00", close: "19:00", isClosed: false },
            friday: { open: "07:00", close: "19:00", isClosed: false },
            saturday: { open: "08:00", close: "15:00", isClosed: false },
            sunday: { open: "00:00", close: "00:00", isClosed: true }
          },
          emergencyServices: false,
          telemedicineAvailable: true,
          homeDelivery: false,
          parkingAvailable: true,
          wheelchairAccessible: true,
          languages: ["English", "Spanish", "French"]
        },
        {
          id: "6",
          name: "Advanced Imaging Center",
          type: "DIAGNOSTIC_CENTER",
          category: "Medical Imaging",
          description: "Advanced diagnostic imaging services including MRI, CT, X-ray, and ultrasound",
          address: "777 Imaging Blvd",
          city: "Tech Park",
          state: "CA",
          postalCode: "90215",
          phone: "(555) 678-9012",
          email: "info@advancedimaging.com",
          website: "www.advancedimaging.com",
          rating: 4.4,
          reviews: 356,
          distance: 6.7,
          isAvailable: true,
          isOpen: true,
          services: ["MRI", "CT Scan", "X-Ray", "Ultrasound", "Mammography"],
          insuranceAccepted: ["Aetna", "Blue Cross", "Cigna", "Medicare"],
          paymentMethods: ["Credit Card", "Insurance"],
          operatingHours: {
            monday: { open: "07:00", close: "20:00", isClosed: false },
            tuesday: { open: "07:00", close: "20:00", isClosed: false },
            wednesday: { open: "07:00", close: "20:00", isClosed: false },
            thursday: { open: "07:00", close: "20:00", isClosed: false },
            friday: { open: "07:00", close: "20:00", isClosed: false },
            saturday: { open: "08:00", close: "16:00", isClosed: false },
            sunday: { open: "00:00", close: "00:00", isClosed: true }
          },
          emergencyServices: false,
          telemedicineAvailable: false,
          homeDelivery: false,
          parkingAvailable: true,
          wheelchairAccessible: true,
          languages: ["English"]
        }
      ]

      setProviders(mockProviders)
      setFilteredProviders(mockProviders)
    } catch (error) {
      console.error('Error fetching directory data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterProviders = () => {
    let filtered = providers

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Type filter
    if (filters.type.length > 0) {
      filtered = filtered.filter(provider => filters.type.includes(provider.type))
    }

    // Distance filter
    filtered = filtered.filter(provider => provider.distance <= filters.distance)

    // Rating filter
    filtered = filtered.filter(provider => provider.rating >= filters.rating)

    // Services filter
    if (filters.services.length > 0) {
      filtered = filtered.filter(provider =>
        filters.services.some(service => provider.services.includes(service))
      )
    }

    // Availability filter
    if (filters.availability) {
      filtered = filtered.filter(provider => provider.isAvailable && provider.isOpen)
    }

    // Emergency filter
    if (filters.emergency) {
      filtered = filtered.filter(provider => provider.emergencyServices)
    }

    // Telemedicine filter
    if (filters.telemedicine) {
      filtered = filtered.filter(provider => provider.telemedicineAvailable)
    }

    // Insurance filter
    if (filters.insurance.length > 0) {
      filtered = filtered.filter(provider =>
        filters.insurance.some(insurance => provider.insuranceAccepted.includes(insurance))
      )
    }

    setFilteredProviders(filtered)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "HOSPITAL": return Building
      case "CLINIC": return Stethoscope
      case "LABORATORY": return FlaskConical
      case "PHARMACY": return Pill
      case "SPECIALIST": return User
      case "DIAGNOSTIC_CENTER": return Activity
      default: return Building
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "HOSPITAL": return "bg-red-100 text-red-800"
      case "CLINIC": return "bg-blue-100 text-blue-800"
      case "LABORATORY": return "bg-green-100 text-green-800"
      case "PHARMACY": return "bg-purple-100 text-purple-800"
      case "SPECIALIST": return "bg-orange-100 text-orange-800"
      case "DIAGNOSTIC_CENTER": return "bg-cyan-100 text-cyan-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Healthcare Directory</h1>
          <p className="text-gray-600 mt-2">Find and connect with healthcare providers near you</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            onClick={() => router.push('/dashboard/patient/health-card')}
          >
            <Star className="mr-2 h-4 w-4" />
            View Benefits
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <MapPin className="mr-2 h-4 w-4" />
            Use My Location
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search Bar */}
        <div className="lg:col-span-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search hospitals, clinics, pharmacies, or services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        {/* Filter Button */}
        <div>
          <Button variant="outline" className="w-full">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className={filters.type.includes("HOSPITAL") ? "bg-blue-100 border-blue-300" : ""}
          onClick={() => {
            const newTypes = filters.type.includes("HOSPITAL") 
              ? filters.type.filter(t => t !== "HOSPITAL")
              : [...filters.type, "HOSPITAL"]
            setFilters({...filters, type: newTypes})
          }}
        >
          <Building className="h-4 w-4 mr-1" />
          Hospitals
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={filters.type.includes("CLINIC") ? "bg-blue-100 border-blue-300" : ""}
          onClick={() => {
            const newTypes = filters.type.includes("CLINIC") 
              ? filters.type.filter(t => t !== "CLINIC")
              : [...filters.type, "CLINIC"]
            setFilters({...filters, type: newTypes})
          }}
        >
          <Stethoscope className="h-4 w-4 mr-1" />
          Clinics
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={filters.type.includes("LABORATORY") ? "bg-blue-100 border-blue-300" : ""}
          onClick={() => {
            const newTypes = filters.type.includes("LABORATORY") 
              ? filters.type.filter(t => t !== "LABORATORY")
              : [...filters.type, "LABORATORY"]
            setFilters({...filters, type: newTypes})
          }}
        >
          <FlaskConical className="h-4 w-4 mr-1" />
          Laboratories
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={filters.type.includes("PHARMACY") ? "bg-blue-100 border-blue-300" : ""}
          onClick={() => {
            const newTypes = filters.type.includes("PHARMACY") 
              ? filters.type.filter(t => t !== "PHARMACY")
              : [...filters.type, "PHARMACY"]
            setFilters({...filters, type: newTypes})
          }}
        >
          <Pill className="h-4 w-4 mr-1" />
          Pharmacies
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={filters.emergency ? "bg-red-100 border-red-300" : ""}
          onClick={() => setFilters({...filters, emergency: !filters.emergency})}
        >
          <Clock className="h-4 w-4 mr-1" />
          Emergency
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={filters.telemedicine ? "bg-blue-100 border-blue-300" : ""}
          onClick={() => setFilters({...filters, telemedicine: !filters.telemedicine})}
        >
          <Video className="h-4 w-4 mr-1" />
          Telemedicine
        </Button>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Found {filteredProviders.length} healthcare providers near you
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select className="text-sm border border-gray-300 rounded px-2 py-1">
            <option>Distance</option>
            <option>Rating</option>
            <option>Name</option>
          </select>
        </div>
      </div>

      {/* Provider Listings */}
      <div className="grid gap-6">
        {filteredProviders.map((provider) => {
          const TypeIcon = getTypeIcon(provider.type)
          return (
            <Card key={provider.id} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Provider Info */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${getTypeColor(provider.type).split(' ')[0]} rounded-lg flex items-center justify-center`}>
                          <TypeIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-xl font-semibold text-gray-900">{provider.name}</h3>
                            {provider.featured && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600">{provider.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{provider.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({provider.reviews} reviews)</span>
                      </div>
                    </div>

                    <p className="text-gray-700">{provider.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{provider.address}, {provider.city}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{provider.phone}</span>
                        </div>
                        {provider.distance > 0 && (
                          <div className="flex items-center space-x-2">
                            <Navigation className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{provider.distance} km away</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {provider.isOpen ? (
                              <span className="text-green-600">Open now</span>
                            ) : (
                              <span className="text-red-600">Closed</span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {provider.isAvailable ? "Available" : "Not available"}
                          </span>
                        </div>
                        {provider.discount && (
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-green-600">{provider.discount}% HealthPay discount</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {provider.services.slice(0, 5).map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {provider.services.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{provider.services.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {provider.emergencyServices && (
                        <Badge className="bg-red-100 text-red-800">
                          Emergency Services
                        </Badge>
                      )}
                      {provider.telemedicineAvailable && (
                        <Badge className="bg-blue-100 text-blue-800">
                          Telemedicine
                        </Badge>
                      )}
                      {provider.homeDelivery && (
                        <Badge className="bg-green-100 text-green-800">
                          Home Delivery
                        </Badge>
                      )}
                      {provider.parkingAvailable && (
                        <Badge className="bg-gray-100 text-gray-800">
                          Parking
                        </Badge>
                      )}
                      {provider.wheelchairAccessible && (
                        <Badge className="bg-purple-100 text-purple-800">
                          Wheelchair Accessible
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => router.push('/dashboard/patient/book-appointment')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => router.push('/dashboard/patient/book-appointment')}
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        Directions
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => router.push('/dashboard/patient/book-appointment')}
                      >
                        <PhoneCall className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => router.push('/dashboard/patient/book-appointment')}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => router.push('/dashboard/patient/book-appointment')}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Book Appointment
                    </Button>
                    {provider.telemedicineAvailable && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => router.push('/dashboard/patient/book-appointment')}
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Telemedicine
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("")
              setFilters({
                type: [],
                distance: 10,
                rating: 0,
                services: [],
                availability: false,
                emergency: false,
                telemedicine: false,
                insurance: []
              })
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}