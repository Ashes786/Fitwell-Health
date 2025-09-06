'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  UserCheck,
  Calendar,
  Activity,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  MapPin,
  Phone,
  Mail,
  Building,
  Star
} from 'lucide-react'
import { toast } from 'sonner'

interface AttendantUser {
  id: string
  name: string
  email: string
  phone: string
  location: string
  status: 'active' | 'inactive'
  department: string
  organization?: string
  totalPatients: number
  activePatients: number
  joinDate: string
  rating: number
  certifications: string[]
}

export default function AdminAttendants() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [attendants, setAttendants] = useState<AttendantUser[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAttendant, setEditingAttendant] = useState<AttendantUser | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    department: '',
    organization: '',
    certifications: [] as string[]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newCertification, setNewCertification] = useState('')

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    fetchAttendants()
  }, [session, status, router])

  const fetchAttendants = async () => {
    try {
      setIsLoading(true)
      
      // Mock data for demonstration
      const mockAttendants: AttendantUser[] = [
        {
          id: '1',
          name: 'Jennifer Martinez',
          email: 'jennifer.martinez@hospital.com',
          phone: '+1-555-0134',
          location: 'New York, NY',
          status: 'active',
          department: 'Patient Registration',
          organization: 'NY General Hospital',
          totalPatients: 342,
          activePatients: 28,
          joinDate: '2023-01-15',
          rating: 4.8,
          certifications: ['CPR Certified', 'Patient Care Technician', 'Medical Terminology']
        },
        {
          id: '2',
          name: 'Robert Taylor',
          email: 'robert.taylor@hospital.com',
          phone: '+1-555-0135',
          location: 'Los Angeles, CA',
          status: 'active',
          department: 'Admissions',
          organization: 'LA Medical Center',
          totalPatients: 289,
          activePatients: 15,
          joinDate: '2023-03-20',
          rating: 4.6,
          certifications: ['First Aid', 'Hospital Administration', 'Customer Service']
        },
        {
          id: '3',
          name: 'Lisa Anderson',
          email: 'lisa.anderson@hospital.com',
          phone: '+1-555-0136',
          location: 'Chicago, IL',
          status: 'inactive',
          department: 'Patient Coordination',
          organization: 'Chicago Medical Hospital',
          totalPatients: 156,
          activePatients: 0,
          joinDate: '2022-11-10',
          rating: 4.4,
          certifications: ['Medical Assistant', 'Phlebotomy', 'EKG Technician']
        },
        {
          id: '4',
          name: 'David Brown',
          email: 'david.brown@hospital.com',
          phone: '+1-555-0137',
          location: 'Houston, TX',
          status: 'active',
          department: 'Emergency Admissions',
          organization: 'Texas Health Center',
          totalPatients: 445,
          activePatients: 32,
          joinDate: '2022-08-05',
          rating: 4.9,
          certifications: ['Emergency Medical Technician', 'Advanced Cardiac Life Support', 'Trauma Nursing']
        }
      ]

      setAttendants(mockAttendants)
    } catch (error) {
      console.error('Error fetching attendants:', error)
      toast.error('Failed to load attendants')
    } finally {
      setIsLoading(false)
    }
  }

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, newCertification.trim()]
      })
      setNewCertification('')
    }
  }

  const removeCertification = (certification: string) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter(cert => cert !== certification)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Success",
        description: editingAttendant 
          ? "Attendant updated successfully"
          : "Attendant created successfully"
      })
      
      setIsDialogOpen(false)
      resetForm()
      fetchAttendants()
    } catch (error) {
      toast.error('Failed to save attendant')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (attendant: AttendantUser) => {
    setEditingAttendant(attendant)
    setFormData({
      name: attendant.name,
      email: attendant.email,
      phone: attendant.phone,
      location: attendant.location,
      department: attendant.department,
      organization: attendant.organization || '',
      certifications: attendant.certifications
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this attendant?')) {
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "Success",
        description: "Attendant deleted successfully"
      })
      
      fetchAttendants()
    } catch (error) {
      toast.error('Failed to delete attendant')
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "Success",
        description: `Attendant status changed to ${newStatus}`
      })
      
      fetchAttendants()
    } catch (error) {
      toast.error('Failed to update attendant status')
    }
  }

  const resetForm = () => {
    setEditingAttendant(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      department: '',
      organization: '',
      certifications: []
    })
    setNewCertification('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredAttendants = attendants.filter(attendant => {
    const matchesSearch = attendant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attendant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attendant.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (attendant.organization && attendant.organization.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || attendant.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading attendants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendant Management</h1>
          <p className="text-gray-600 mt-2">Manage patient attendants and their assignments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Attendant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingAttendant ? 'Edit Attendant' : 'Add New Attendant'}
                </DialogTitle>
                <DialogDescription>
                  Create or update attendant information
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Department *
                  </Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="organization" className="text-right">
                    Organization
                  </Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Certifications</Label>
                  <div className="col-span-3 space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add certification..."
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                        className="flex-1"
                      />
                      <Button type="button" onClick={addCertification} size="sm">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeCertification(cert)}>
                          {cert} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (editingAttendant ? 'Update' : 'Create')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Attendants</p>
                <p className="text-2xl font-bold text-gray-900">{attendants.length}</p>
                <p className="text-sm text-gray-600 mt-1">Patient care staff</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Attendants</p>
                <p className="text-2xl font-bold text-gray-900">
                  {attendants.filter(a => a.status === 'active').length}
                </p>
                <p className="text-sm text-green-600 mt-1">Currently working</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Patients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {attendants.reduce((sum, a) => sum + a.activePatients, 0)}
                </p>
                <p className="text-sm text-orange-600 mt-1">Under care</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(attendants.reduce((sum, a) => sum + a.rating, 0) / attendants.length).toFixed(1)}
                </p>
                <p className="text-sm text-blue-600 mt-1">Out of 5.0</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5" />
            <span>Attendants</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name, email, location, or organization..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-health-primary focus:border-transparent w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAttendants.map((attendant) => (
              <Card key={attendant.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-health-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {attendant.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{attendant.name}</h3>
                        <p className="text-sm text-gray-600">{attendant.department}</p>
                        {attendant.organization && (
                          <p className="text-xs text-gray-500 flex items-center">
                            <Building className="h-3 w-3 mr-1" />
                            {attendant.organization}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(attendant.status)}>
                      {attendant.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{attendant.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{attendant.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{attendant.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-gray-600">{attendant.rating}</span>
                      </div>
                      <span className="text-gray-600">Joined: {new Date(attendant.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{attendant.totalPatients}</p>
                        <p className="text-xs text-gray-600">Total Patients</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{attendant.activePatients}</p>
                        <p className="text-xs text-gray-600">Active Patients</p>
                      </div>
                    </div>
                    
                    {attendant.certifications.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-600 mb-1">Certifications:</p>
                        <div className="flex flex-wrap gap-1">
                          {attendant.certifications.slice(0, 2).map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                          {attendant.certifications.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{attendant.certifications.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(attendant.id, attendant.status)}
                        className="flex-1"
                      >
                        {attendant.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(attendant)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(attendant.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredAttendants.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No attendants found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}