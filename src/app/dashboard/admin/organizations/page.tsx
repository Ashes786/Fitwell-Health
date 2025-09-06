"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Upload, 
  Download, 
  Users, 
  Image as ImageIcon,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { Organization, OrganizationType } from '@prisma/client'

interface OrganizationFormData {
  name: string
  type: OrganizationType
  address?: string
  phone?: string
  email?: string
  website?: string
  isActive: boolean
  logo?: string
}

interface BulkPatientData {
  organizationId: string
  patients: Array<{
    name: string
    email: string
    phone: string
    dateOfBirth: string
    gender: string
    address?: string
  }>
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false)
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null)
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: '',
    type: 'COMPANY',
    address: '',
    phone: '',
    email: '',
    website: '',
    isActive: true,
    logo: ''
  })
  const [bulkPatientData, setBulkPatientData] = useState<BulkPatientData>({
    organizationId: '',
    patients: []
  })
  const [csvData, setCsvData] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [selectedOrgForBulk, setSelectedOrgForBulk] = useState<string>('')

  const { toast } = useToast()

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/admin/organizations')
      if (response.ok) {
        const data = await response.json()
        setOrganizations(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch organizations",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch organizations",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "Logo file size must be less than 5MB",
          variant: "destructive"
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        setFormData({ ...formData, logo: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingOrganization 
        ? `/api/admin/organizations/${editingOrganization.id}`
        : '/api/admin/organizations'
      
      const method = editingOrganization ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: editingOrganization 
            ? "Organization updated successfully"
            : "Organization created successfully"
        })
        setIsDialogOpen(false)
        resetForm()
        fetchOrganizations()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save organization",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save organization",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBulkPatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrgForBulk || !csvData.trim()) {
      toast({
        title: "Error",
        description: "Please select an organization and provide CSV data",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Parse CSV data
      const lines = csvData.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.trim())
      
      const patients = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, '
      })
        
        if (values.length < headers.length) {
          throw new Error(`Invalid data at line ${index + 2}`)
        }

        return {
          name: values[headers.indexOf('name')] || '',
          email: values[headers.indexOf('email')] || '',
          phone: values[headers.indexOf('phone')] || '',
          dateOfBirth: values[headers.indexOf('dateOfBirth')] || '',
          gender: values[headers.indexOf('gender')] || '',
          address: values[headers.indexOf('address')] || undefined
        }
      })

      const response = await fetch('/api/admin/organizations/bulk-patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          organizationId: selectedOrgForBulk,
          patients
        })
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success",
          description: `Successfully added ${result.addedCount} patients to organization`
        })
        setIsBulkDialogOpen(false)
        setCsvData('')
        setSelectedOrgForBulk('')
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to add patients",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add patients",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const downloadCSVTemplate = () => {
    const template = `name,email,phone,dateOfBirth,gender,address
John Doe,john@example.com,+1234567890,1990-01-01,Male,123 Main St
Jane Smith,jane@example.com,+1234567891,1992-05-15,Female,456 Oak Ave`
    
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'patient_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleEdit = (organization: Organization) => {
    setEditingOrganization(organization)
    setFormData({
      name: organization.name,
      type: organization.type,
      address: organization.address || '',
      phone: organization.phone || '',
      email: organization.email || '',
      website: organization.website || '',
      isActive: organization.isActive,
      logo: organization.logo || ''
    })
    setLogoPreview(organization.logo || null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this organization?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/organizations/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Organization deleted successfully"
        })
        fetchOrganizations()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete organization",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete organization",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setEditingOrganization(null)
    setFormData({
      name: '',
      type: 'COMPANY',
      address: '',
      phone: '',
      email: '',
      website: '',
      isActive: true,
      logo: ''
    })
    setLogoPreview(null)
  }

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTypeColor = (type: OrganizationType) => {
    const colors: Record<OrganizationType, string> = {
      COMPANY: 'bg-blue-100 text-blue-800',
      SCHOOL: 'bg-green-100 text-green-800',
      HOSPITAL: 'bg-red-100 text-red-800',
      GOVERNMENT: 'bg-purple-100 text-purple-800',
      INSURANCE: 'bg-yellow-100 text-yellow-800',
      OTHER: 'bg-gray-100 text-gray-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization Management</h1>
          <p className="text-muted-foreground">
            Manage organizations for bulk onboarding and network management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Bulk Add Patients
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleBulkPatientSubmit}>
                <DialogHeader>
                  <DialogTitle>Bulk Add Patients</DialogTitle>
                  <DialogDescription>
                    Add multiple patients to an organization using CSV format
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="organization" className="text-right">
                      Organization *
                    </Label>
                    <Select
                      value={selectedOrgForBulk}
                      onValueChange={setSelectedOrgForBulk}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>CSV Data *</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={downloadCSVTemplate}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Template
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Paste CSV data here..."
                      value={csvData}
                      onChange={(e) => setCsvData(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Required columns: name, email, phone, dateOfBirth, gender. Optional: address
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding Patients...' : 'Add Patients'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Organization
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingOrganization ? 'Edit Organization' : 'Add New Organization'}
                  </DialogTitle>
                  <DialogDescription>
                    Create or update organization information for bulk onboarding.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
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
                    <Label htmlFor="type" className="text-right">
                      Type *
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: OrganizationType) => 
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COMPANY">Company</SelectItem>
                        <SelectItem value="SCHOOL">School</SelectItem>
                        <SelectItem value="HOSPITAL">Hospital</SelectItem>
                        <SelectItem value="GOVERNMENT">Government</SelectItem>
                        <SelectItem value="INSURANCE">Insurance</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="logo" className="text-right">
                      Logo
                    </Label>
                    <div className="col-span-3">
                      <div className="flex items-center space-x-3">
                        {logoPreview && (
                          <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden">
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <Input
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-health-primary file:text-white hover:file:bg-health-dark"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Max file size: 5MB. Supported formats: JPG, PNG, GIF
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="website" className="text-right">
                      Website
                    </Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="isActive" className="text-right">
                      Active
                    </Label>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (editingOrganization ? 'Update' : 'Create')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organizations
          </CardTitle>
          <CardDescription>
            Manage organizations that can be used for bulk user onboarding
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Patients</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrganizations.map((organization) => (
                <TableRow key={organization.id}>
                  <TableCell>
                    {organization.logo ? (
                      <div className="w-10 h-10 rounded-lg border border-gray-200 overflow-hidden">
                        <img
                          src={organization.logo}
                          alt={`${organization.name} logo`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{organization.name}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(organization.type)}>
                      {organization.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {organization.email && (
                        <div>{organization.email}</div>
                      )}
                      {organization.phone && (
                        <div className="text-muted-foreground">{organization.phone}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={organization.isActive ? "default" : "secondary"}>
                      {organization.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {Math.floor(Math.random() * 500) + 50} {/* Mock patient count */}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(organization.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(organization)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(organization.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredOrganizations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No organizations found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}