'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Globe,
  Users,
  Star
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'

interface Partner {
  id: string
  name: string
  description: string
  email: string
  phone: string
  website?: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  category: 'HOSPITAL' | 'CLINIC' | 'LABORATORY' | 'PHARMACY' | 'INSURANCE' | 'TECHNOLOGY' | 'OTHER'
  partnershipLevel: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
  contactPerson: string
  contactTitle: string
  isActive: boolean
  rating: number
  totalReferrals: number
  commissionRate: number
  contractStartDate: string
  contractEndDate?: string
  services: string[]
  specialties: string[]
  createdAt: string
  updatedAt: string
}

export default function PartnersPage() {
  const { isAuthorized, isUnauthorized, isLoading, userSession } = useRoleAuthorization({
    requiredRole: "SUPER_ADMIN",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()
  const [partners, setPartners] = useState<Partner[]>([])
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    category: 'HOSPITAL' as 'HOSPITAL' | 'CLINIC' | 'LABORATORY' | 'PHARMACY' | 'INSURANCE' | 'TECHNOLOGY' | 'OTHER',
    partnershipLevel: 'BRONZE' as 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM',
    contactPerson: '',
    contactTitle: '',
    isActive: true,
    rating: 0,
    commissionRate: 0,
    contractStartDate: '',
    contractEndDate: '',
    services: '',
    specialties: ''
  })

  const fetchPartners = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/super-admin/partners', {
        signal: AbortSignal.timeout(10000)
      })
      
      if (response.ok) {
        const data = await response.json()
        setPartners(data)
        setFilteredPartners(data)
      } else {
        setError('Failed to fetch partners')
        toast({
        title: "Error",
        description: 'Failed to fetch partners'
      })
      }
    } catch (error) {
      console.error('Error fetching partners:', error)
      setError('Failed to fetch partners')
      toast({
        title: "Error",
        description: 'Failed to fetch partners'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoading) return
    if (!session) return

    fetchPartners()
  }, [session, isLoading])

  useEffect(() => {
    let filtered = partners

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(partner =>
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(partner => partner.category === categoryFilter)
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(partner => 
        statusFilter === 'active' ? partner.isActive : !partner.isActive
      )
    }

    setFilteredPartners(filtered)
  }, [partners, searchTerm, categoryFilter, statusFilter])

  const handleCreatePartner = async () => {
    try {
      const response = await fetch('/api/super-admin/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          services: formData.services.split(',').map(s => s.trim()).filter(s => s),
          specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s)
        }),
      })

      if (response.ok) {
        toast({
        title: "Success",
        description: 'Partner created successfully'
      })
        setIsCreateDialogOpen(false)
        resetForm()
        fetchPartners()
      } else {
        const errorData = await response.json()
        toast({
        title: "Error",
        description: errorData.error || 'Failed to create partner'
      })
      }
    } catch (error) {
      console.error('Error creating partner:', error)
      toast({
        title: "Error",
        description: 'Failed to create partner'
      })
    }
  }

  const handleUpdatePartner = async () => {
    if (!editingPartner) return

    try {
      const response = await fetch(`/api/super-admin/partners/${editingPartner.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          services: formData.services.split(',').map(s => s.trim()).filter(s => s),
          specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s)
        }),
      })

      if (response.ok) {
        toast({
        title: "Success",
        description: 'Partner updated successfully'
      })
        setEditingPartner(null)
        resetForm()
        fetchPartners()
      } else {
        const errorData = await response.json()
        toast({
        title: "Error",
        description: errorData.error || 'Failed to update partner'
      })
      }
    } catch (error) {
      console.error('Error updating partner:', error)
      toast({
        title: "Error",
        description: 'Failed to update partner'
      })
    }
  }

  const handleDeletePartner = async (partnerId: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return

    try {
      const response = await fetch(`/api/super-admin/partners/${partnerId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
        title: "Success",
        description: 'Partner deleted successfully'
      })
        fetchPartners()
      } else {
        const errorData = await response.json()
        toast({
        title: "Error",
        description: errorData.error || 'Failed to delete partner'
      })
      }
    } catch (error) {
      console.error('Error deleting partner:', error)
      toast({
        title: "Error",
        description: 'Failed to delete partner'
      })
    }
  }

  const handleToggleStatus = async (partnerId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/super-admin/partners/${partnerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        toast({
        title: "Success",
        description: `Partner ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      })
        fetchPartners()
      } else {
        const errorData = await response.json()
        toast({
        title: "Error",
        description: errorData.error || 'Failed to update partner status'
      })
      }
    } catch (error) {
      console.error('Error updating partner status:', error)
      toast({
        title: "Error",
        description: 'Failed to update partner status'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      category: 'HOSPITAL',
      partnershipLevel: 'BRONZE',
      contactPerson: '',
      contactTitle: '',
      isActive: true,
      rating: 0,
      commissionRate: 0,
      contractStartDate: '',
      contractEndDate: '',
      services: '',
      specialties: ''
    })
  }

  const startEdit = (partner: Partner) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name,
      description: partner.description,
      email: partner.email,
      phone: partner.phone,
      website: partner.website || '',
      address: partner.address,
      city: partner.city,
      state: partner.state,
      country: partner.country,
      postalCode: partner.postalCode,
      category: partner.category,
      partnershipLevel: partner.partnershipLevel,
      contactPerson: partner.contactPerson,
      contactTitle: partner.contactTitle,
      isActive: partner.isActive,
      rating: partner.rating,
      commissionRate: partner.commissionRate,
      contractStartDate: partner.contractStartDate,
      contractEndDate: partner.contractEndDate || '',
      services: partner.services.join(', '),
      specialties: partner.specialties.join(', ')
    })
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-500 text-white">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    )
  }

  const getCategoryBadge = (category: string) => {
    const variants = {
      'HOSPITAL': 'bg-red-100 text-red-800',
      'CLINIC': 'bg-blue-100 text-blue-800',
      'LABORATORY': 'bg-purple-100 text-purple-800',
      'PHARMACY': 'bg-green-100 text-green-800',
      'INSURANCE': 'bg-orange-100 text-orange-800',
      'TECHNOLOGY': 'bg-cyan-100 text-cyan-800',
      'OTHER': 'bg-gray-100 text-gray-800'
    }
    
    return (
      <Badge variant="secondary" className={variants[category as keyof typeof variants] || ''}>
        {category}
      </Badge>
    )
  }

  const getPartnershipBadge = (level: string) => {
    const variants = {
      'BRONZE': 'bg-amber-100 text-amber-800',
      'SILVER': 'bg-gray-100 text-gray-800',
      'GOLD': 'bg-yellow-100 text-yellow-800',
      'PLATINUM': 'bg-indigo-100 text-indigo-800'
    }
    
    return (
      <Badge variant="secondary" className={variants[level as keyof typeof variants] || ''}>
        {level}
      </Badge>
    )
  }

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
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
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partners</h1>
          <p className="text-gray-600 mt-2">Manage healthcare partners and service providers.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => fetchPartners()}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isCreateDialogOpen || !!editingPartner} onOpenChange={(open) => {
            if (!open) {
              setIsCreateDialogOpen(false)
              setEditingPartner(null)
              resetForm()
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPartner ? 'Edit Partner' : 'Add New Partner'}</DialogTitle>
                <DialogDescription>
                  {editingPartner ? 'Update the partner information below.' : 'Create a new partner for your healthcare network.'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Partner Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., General Hospital"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HOSPITAL">Hospital</SelectItem>
                        <SelectItem value="CLINIC">Clinic</SelectItem>
                        <SelectItem value="LABORATORY">Laboratory</SelectItem>
                        <SelectItem value="PHARMACY">Pharmacy</SelectItem>
                        <SelectItem value="INSURANCE">Insurance</SelectItem>
                        <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the partner organization..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="partnershipLevel">Partnership Level</Label>
                    <Select value={formData.partnershipLevel} onValueChange={(value) => setFormData({...formData, partnershipLevel: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRONZE">Bronze</SelectItem>
                        <SelectItem value="SILVER">Silver</SelectItem>
                        <SelectItem value="GOLD">Gold</SelectItem>
                        <SelectItem value="PLATINUM">Platinum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                    <Input
                      id="commissionRate"
                      type="number"
                      value={formData.commissionRate}
                      onChange={(e) => setFormData({...formData, commissionRate: parseFloat(e.target.value) || 0})}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactTitle">Contact Title</Label>
                    <Input
                      id="contactTitle"
                      value={formData.contactTitle}
                      onChange={(e) => setFormData({...formData, contactTitle: e.target.value})}
                      placeholder="Job title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="partner@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value) || 0})}
                      min="1"
                      max="5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      placeholder="State"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      placeholder="Country"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contractStartDate">Contract Start Date</Label>
                    <Input
                      id="contractStartDate"
                      type="date"
                      value={formData.contractStartDate}
                      onChange={(e) => setFormData({...formData, contractStartDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractEndDate">Contract End Date</Label>
                    <Input
                      id="contractEndDate"
                      type="date"
                      value={formData.contractEndDate}
                      onChange={(e) => setFormData({...formData, contractEndDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Street address"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                    placeholder="Postal code"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="services">Services (comma-separated)</Label>
                    <Textarea
                      id="services"
                      value={formData.services}
                      onChange={(e) => setFormData({...formData, services: e.target.value})}
                      placeholder="e.g., emergency-care, surgery, diagnostics"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                    <Textarea
                      id="specialties"
                      value={formData.specialties}
                      onChange={(e) => setFormData({...formData, specialties: e.target.value})}
                      placeholder="e.g., cardiology, orthopedics, pediatrics"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsCreateDialogOpen(false)
                  setEditingPartner(null)
                  resetForm()
                }}>
                  Cancel
                </Button>
                <Button onClick={editingPartner ? handleUpdatePartner : handleCreatePartner}>
                  {editingPartner ? 'Update Partner' : 'Add Partner'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="HOSPITAL">Hospitals</SelectItem>
                  <SelectItem value="CLINIC">Clinics</SelectItem>
                  <SelectItem value="LABORATORY">Laboratories</SelectItem>
                  <SelectItem value="PHARMACY">Pharmacies</SelectItem>
                  <SelectItem value="INSURANCE">Insurance</SelectItem>
                  <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Healthcare Partners</CardTitle>
          <CardDescription>Manage all partner organizations in your healthcare network</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchPartners}>Retry</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-gray-500">No partners found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{partner.name}</div>
                          <div className="text-sm text-gray-500">{partner.description}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{partner.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryBadge(partner.category)}</TableCell>
                      <TableCell>{getPartnershipBadge(partner.partnershipLevel)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{partner.contactPerson}</div>
                          <div className="text-xs text-gray-500">{partner.contactTitle}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{partner.city}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getRatingStars(partner.rating)}</TableCell>
                      <TableCell>{getStatusBadge(partner.isActive)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(partner.id, partner.isActive)}
                          >
                            {partner.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(partner)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePartner(partner.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}