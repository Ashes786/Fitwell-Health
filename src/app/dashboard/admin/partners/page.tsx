"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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
  Building, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Phone,
  Mail,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  FlaskConical,
  Pill,
  Hospital,
  Users,
  Activity,
  Calendar
} from "lucide-react"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"

interface Partner {
  id: string
  name: string
  type: 'LABORATORY' | 'PHARMACY' | 'HOSPITAL'
  description: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  website?: string
  isActive: boolean
  rating: number
  specialties: string[]
  services: string[]
  operatingHours: {
    [key: string]: string
  }
  contactPerson: {
    name: string
    email: string
    phone: string
  }
  createdAt: string
  updatedAt: string
  partnershipLevel: 'BASIC' | 'PREMIUM' | 'ELITE'
}

export default function AdminPartners() {
  const { isAuthorized, isUnauthorized, isLoading: authLoading, session } = useRoleAuthorization({
    requiredRole: "ADMIN",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [partners, setPartners] = useState<Partner[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPartner, setNewPartner] = useState({
    name: "",
    type: 'LABORATORY' as 'LABORATORY' | 'PHARMACY' | 'HOSPITAL',
    description: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    website: "",
    isActive: true,
    rating: 5,
    specialties: [] as string[],
    services: [] as string[],
    contactPerson: {
      name: "",
      email: "",
      phone: ""
    },
    partnershipLevel: 'BASIC' as 'BASIC' | 'PREMIUM' | 'ELITE'
  })

  useEffect(() => {
    if (isAuthorized) {
      // Original fetch logic will be handled separately
    }
  }, [isAuthorized])

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/admin/partners')
      if (response.ok) {
        const data = await response.json()
        const formattedPartners = data.partners.map((partner: any) => ({
          id: partner.id,
          name: partner.name,
          type: partner.type,
          description: partner.description,
          email: partner.email,
          phone: partner.phone,
          address: partner.address,
          city: partner.city,
          state: partner.state,
          zipCode: partner.zipCode,
          country: partner.country,
          website: partner.website,
          isActive: partner.isActive,
          rating: partner.rating,
          specialties: partner.specialties || [],
          services: partner.services || [],
          operatingHours: partner.operatingHours || {},
          contactPerson: partner.contactPerson || {},
          createdAt: partner.createdAt,
          updatedAt: partner.updatedAt,
          partnershipLevel: partner.partnershipLevel
        }))
        setPartners(formattedPartners)
      } else {
        toast.error('Failed to fetch partners')
      }
    } catch (error) {
      console.error('Error fetching partners:', error)
      toast.error('Failed to load partners')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPartner = async () => {
    try {
      const response = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPartner)
      })

      if (response.ok) {
        const data = await response.json()
        const formattedPartner = {
          id: data.partner.id,
          name: data.partner.name,
          type: data.partner.type,
          description: data.partner.description,
          email: data.partner.email,
          phone: data.partner.phone,
          address: data.partner.address,
          city: data.partner.city,
          state: data.partner.state,
          zipCode: data.partner.zipCode,
          country: data.partner.country,
          website: data.partner.website,
          isActive: data.partner.isActive,
          rating: data.partner.rating,
          specialties: data.partner.specialties || [],
          services: data.partner.services || [],
          operatingHours: data.partner.operatingHours || {},
          contactPerson: data.partner.contactPerson || {},
          createdAt: data.partner.createdAt,
          updatedAt: data.partner.updatedAt,
          partnershipLevel: data.partner.partnershipLevel
        }
        
        setPartners([...partners, formattedPartner])
        setNewPartner({
          name: "",
          type: 'LABORATORY',
          description: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          website: "",
          isActive: true,
          rating: 5,
          specialties: [],
          services: [],
          contactPerson: {
            name: "",
            email: "",
            phone: ""
          },
          partnershipLevel: 'BASIC'
        })
        setIsAddDialogOpen(false)
        toast.success('Partner added successfully')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to add partner')
      }
    } catch (error) {
      console.error('Error adding partner:', error)
      toast.error('Failed to add partner')
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'LABORATORY':
        return <FlaskConical className="h-5 w-5 text-blue-600" />
      case 'PHARMACY':
        return <Pill className="h-5 w-5 text-green-600" />
      case 'HOSPITAL':
        return <Hospital className="h-5 w-5 text-red-600" />
      default:
        return <Building className="h-5 w-5 text-gray-600" />
    }
  }

  const getPartnershipBadgeColor = (level: string) => {
    switch (level) {
      case 'BASIC':
        return "bg-gray-100 text-gray-800"
      case 'PREMIUM':
        return "bg-blue-100 text-blue-800"
      case 'ELITE':
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      
    )
  }

  if (!session) {
    return null
  }

  // Show unauthorized message if user doesn't have ADMIN role
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

  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activePartners = filteredPartners.filter(p => p.isActive)
  const inactivePartners = filteredPartners.filter(p => !p.isActive)
  const laboratories = filteredPartners.filter(p => p.type === 'LABORATORY')
  const pharmacies = filteredPartners.filter(p => p.type === 'PHARMACY')
  const hospitals = filteredPartners.filter(p => p.type === 'HOSPITAL')

  const PartnerCard = ({ partner }: { partner: Partner }) => {
    return (
      <Card className="border-emerald-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  {getTypeIcon(partner.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{partner.name}</h3>
                    <Badge className={partner.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"}>
                      {partner.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge className={getPartnershipBadgeColor(partner.partnershipLevel)}>
                      {partner.partnershipLevel}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{partner.type}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{partner.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </p>
                  <p className="text-sm text-gray-900">{partner.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    Phone
                  </p>
                  <p className="text-sm text-gray-900">{partner.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    Location
                  </p>
                  <p className="text-sm text-gray-900">{partner.city}, {partner.state}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    Rating
                  </p>
                  <p className="text-sm text-gray-900">{partner.rating}/5.0</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Specialties</p>
                  <div className="flex flex-wrap gap-1">
                    {partner.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Services</p>
                  <div className="flex flex-wrap gap-1">
                    {partner.services.map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-600">
                    Contact: {partner.contactPerson.name}
                  </p>
                  <p className="text-gray-600">
                    Partner since: {new Date(partner.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2 ml-4">
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => router.push(`/dashboard/admin/partners/${partner.id}`)}
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
    
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Partners Management</h1>
            <p className="text-gray-600 mt-2">
              Manage laboratories, pharmacies, and hospitals in your network
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Partner
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Partner</DialogTitle>
                  <DialogDescription>
                    Add a new laboratory, pharmacy, or hospital to your network
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Partner Name *</Label>
                      <Input
                        id="name"
                        value={newPartner.name}
                        onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                        placeholder="City Medical Laboratory"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Partner Type *</Label>
                      <Select value={newPartner.type} onValueChange={(value: 'LABORATORY' | 'PHARMACY' | 'HOSPITAL') => setNewPartner({...newPartner, type: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LABORATORY">Laboratory</SelectItem>
                          <SelectItem value="PHARMACY">Pharmacy</SelectItem>
                          <SelectItem value="HOSPITAL">Hospital</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newPartner.description}
                      onChange={(e) => setNewPartner({...newPartner, description: e.target.value})}
                      placeholder="Comprehensive diagnostic laboratory with advanced testing capabilities..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newPartner.email}
                        onChange={(e) => setNewPartner({...newPartner, email: e.target.value})}
                        placeholder="info@partner.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={newPartner.phone}
                        onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})}
                        placeholder="+1-555-0123"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={newPartner.address}
                        onChange={(e) => setNewPartner({...newPartner, address: e.target.value})}
                        placeholder="123 Main St"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={newPartner.city}
                        onChange={(e) => setNewPartner({...newPartner, city: e.target.value})}
                        placeholder="New York"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={newPartner.state}
                        onChange={(e) => setNewPartner({...newPartner, state: e.target.value})}
                        placeholder="NY"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip Code *</Label>
                      <Input
                        id="zipCode"
                        value={newPartner.zipCode}
                        onChange={(e) => setNewPartner({...newPartner, zipCode: e.target.value})}
                        placeholder="10001"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        value={newPartner.country}
                        onChange={(e) => setNewPartner({...newPartner, country: e.target.value})}
                        placeholder="USA"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={newPartner.website}
                        onChange={(e) => setNewPartner({...newPartner, website: e.target.value})}
                        placeholder="https://partner.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="partnershipLevel">Partnership Level</Label>
                      <Select value={newPartner.partnershipLevel} onValueChange={(value: 'BASIC' | 'PREMIUM' | 'ELITE') => setNewPartner({...newPartner, partnershipLevel: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BASIC">Basic</SelectItem>
                          <SelectItem value="PREMIUM">Premium</SelectItem>
                          <SelectItem value="ELITE">Elite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactName">Contact Person Name *</Label>
                      <Input
                        id="contactName"
                        value={newPartner.contactPerson.name}
                        onChange={(e) => setNewPartner({...newPartner, contactPerson: {...newPartner.contactPerson, name: e.target.value}})}
                        placeholder="John Doe"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail">Contact Person Email *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={newPartner.contactPerson.email}
                        onChange={(e) => setNewPartner({...newPartner, contactPerson: {...newPartner.contactPerson, email: e.target.value}})}
                        placeholder="john.doe@partner.com"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contactPhone">Contact Person Phone *</Label>
                    <Input
                      id="contactPhone"
                      value={newPartner.contactPerson.phone}
                      onChange={(e) => setNewPartner({...newPartner, contactPerson: {...newPartner.contactPerson, phone: e.target.value}})}
                      placeholder="+1-555-0987"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddPartner} disabled={!newPartner.name || !newPartner.email || !newPartner.phone}>
                      Add Partner
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
                  <p className="text-sm font-medium text-gray-600">Total Partners</p>
                  <p className="text-2xl font-bold text-gray-900">{partners.length}</p>
                </div>
                <Building className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Laboratories</p>
                  <p className="text-2xl font-bold text-gray-900">{laboratories.length}</p>
                </div>
                <FlaskConical className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pharmacies</p>
                  <p className="text-2xl font-bold text-gray-900">{pharmacies.length}</p>
                </div>
                <Pill className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hospitals</p>
                  <p className="text-2xl font-bold text-gray-900">{hospitals.length}</p>
                </div>
                <Hospital className="h-8 w-8 text-red-600" />
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
                placeholder="Search partners by name, description, or city..."
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
              All Partners ({filteredPartners.length})
            </TabsTrigger>
            <TabsTrigger value="laboratories" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Laboratories ({laboratories.length})
            </TabsTrigger>
            <TabsTrigger value="pharmacies" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Pharmacies ({pharmacies.length})
            </TabsTrigger>
            <TabsTrigger value="hospitals" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Hospitals ({hospitals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {filteredPartners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="laboratories" className="space-y-4">
            <div className="grid gap-4">
              {laboratories.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pharmacies" className="space-y-4">
            <div className="grid gap-4">
              {pharmacies.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hospitals" className="space-y-4">
            <div className="grid gap-4">
              {hospitals.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    
  )
}