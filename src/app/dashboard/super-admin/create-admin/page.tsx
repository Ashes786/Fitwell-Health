'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { 
  ArrowLeft, 
  Users, 
  Shield, 
  Mail, 
  Phone, 
  MapPin, 
  Key,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react'
import { toast } from 'sonner'
import { UserRole } from "@prisma/client"

interface Permission {
  id: string
  name: string
  description: string
  category: string
}

const availablePermissions: Permission[] = [
  { id: 'manage_users', name: 'Manage Users', description: 'Create, edit, and delete users', category: 'User Management' },
  { id: 'manage_doctors', name: 'Manage Doctors', description: 'Create, edit, and delete doctors', category: 'User Management' },
  { id: 'manage_patients', name: 'Manage Patients', description: 'Create, edit, and delete patients', category: 'User Management' },
  { id: 'manage_appointments', name: 'Manage Appointments', description: 'Create, edit, and delete appointments', category: 'Appointments' },
  { id: 'view_analytics', name: 'View Analytics', description: 'Access to system analytics and reports', category: 'Analytics' },
  { id: 'manage_billing', name: 'Manage Billing', description: 'Handle billing and payments', category: 'Billing' },
  { id: 'system_settings', name: 'System Settings', description: 'Access to system configuration', category: 'System' },
  { id: 'manage_admins', name: 'Manage Admins', description: 'Create and manage other admins', category: 'Admin Management' },
]

export default function CreateAdminPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    networkName: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  })

  const { isUnauthorized, isLoading } = useRoleAuthorization({
    requiredRole: UserRole.SUPER_ADMIN,
    showUnauthorizedMessage: false
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/super-admin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          permissions: selectedPermissions,
        }),
      })

      if (response.ok) {
        toast.success('Admin created successfully')
        router.push('/dashboard/super-admin/admins')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to create admin')
      }
    } catch (error) {
      console.error('Error creating admin:', error)
      toast.error('An error occurred while creating admin')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Show unauthorized message if user doesn't have SUPER_ADMIN role
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

  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Admin</h1>
            <p className="text-gray-600 mt-1">Add a new system administrator with specific permissions</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>Basic information about the administrator</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Network Information */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Network Information</span>
              </CardTitle>
              <CardDescription>Network and location details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="networkName">Network Name *</Label>
                <Input
                  id="networkName"
                  value={formData.networkName}
                  onChange={(e) => handleInputChange('networkName', e.target.value)}
                  placeholder="Healthcare Network Inc."
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Main St"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="NY"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    placeholder="10001"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="United States"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Permissions</span>
              </CardTitle>
              <CardDescription>Select the permissions this admin should have</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category}>
                    <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <Checkbox
                            id={permission.id}
                            checked={selectedPermissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <div className="flex-1">
                            <Label htmlFor={permission.id} className="font-medium text-gray-900">
                              {permission.name}
                            </Label>
                            <p className="text-sm text-gray-500 mt-1">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900">
                      {selectedPermissions.length} permissions selected
                    </p>
                    <p className="text-sm text-blue-700">
                      Choose the appropriate permissions for this admin role
                    </p>
                  </div>
                  {selectedPermissions.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPermissions([])}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={loading || selectedPermissions.length === 0}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Creating...' : 'Create Admin'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}