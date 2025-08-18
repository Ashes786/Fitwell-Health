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
import { useToast } from '@/hooks/use-toast'
import { Building2, Plus, Edit, Trash2, Search } from 'lucide-react'
import { Organization, OrganizationType } from '@prisma/client'

interface OrganizationFormData {
  name: string
  type: OrganizationType
  address?: string
  phone?: string
  email?: string
  website?: string
  isActive: boolean
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null)
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: '',
    type: 'COMPANY',
    address: '',
    phone: '',
    email: '',
    website: '',
    isActive: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleEdit = (organization: Organization) => {
    setEditingOrganization(organization)
    setFormData({
      name: organization.name,
      type: organization.type,
      address: organization.address || '',
      phone: organization.phone || '',
      email: organization.email || '',
      website: organization.website || '',
      isActive: organization.isActive
    })
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
      isActive: true
    })
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
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
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrganizations.map((organization) => (
                <TableRow key={organization.id}>
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