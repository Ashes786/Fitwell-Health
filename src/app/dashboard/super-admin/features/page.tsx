'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Settings, Check, X } from 'lucide-react'
import { toast } from 'sonner'

interface Admin {
  id: string
  user: {
    id: string
    name: string
    email: string
  }
  networkName: string
  isActive: boolean
}

interface Feature {
  id: string
  name: string
  description: string
  category: string
  isActive: boolean
}

interface AdminFeature {
  id: string
  admin: Admin
  feature: Feature
  isActive: boolean
  grantedAt: string
  expiresAt?: string
}

export default function FeatureManagement() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [adminFeatures, setAdminFeatures] = useState<AdminFeature[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<string>('')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [expiresAt, setExpiresAt] = useState<string>('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [adminsRes, featuresRes, adminFeaturesRes] = await Promise.all([
        fetch('/api/super-admin/admins'),
        fetch('/api/super-admin/features'),
        fetch('/api/super-admin/admin-features')
      ])

      if (adminsRes.ok) {
        const adminsData = await adminsRes.json()
        setAdmins(adminsData)
      }

      if (featuresRes.ok) {
        const featuresData = await featuresRes.json()
        setFeatures(featuresData)
      }

      if (adminFeaturesRes.ok) {
        const adminFeaturesData = await adminFeaturesRes.json()
        setAdminFeatures(adminFeaturesData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load feature management data')
    } finally {
      setLoading(false)
    }
  }

  const handleAssignFeatures = async () => {
    if (!selectedAdmin || selectedFeatures.length === 0) {
      toast.error('Please select an admin and at least one feature')
      return
    }

    try {
      const response = await fetch('/api/super-admin/admin-features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: selectedAdmin,
          featureIds: selectedFeatures,
          expiresAt: expiresAt || null
        }),
      })

      if (response.ok) {
        toast.success('Features assigned successfully')
        setIsDialogOpen(false)
        setSelectedAdmin('')
        setSelectedFeatures([])
        setExpiresAt('')
        fetchData()
      } else {
        toast.error('Failed to assign features')
      }
    } catch (error) {
      console.error('Error assigning features:', error)
      toast.error('An error occurred while assigning features')
    }
  }

  const handleToggleFeature = async (adminFeatureId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/super-admin/admin-features/${adminFeatureId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      })

      if (response.ok) {
        toast.success(`Feature ${isActive ? 'activated' : 'deactivated'} successfully`)
        fetchData()
      } else {
        toast.error('Failed to update feature status')
      }
    } catch (error) {
      console.error('Error updating feature status:', error)
      toast.error('An error occurred while updating feature status')
    }
  }

  const handleDeleteFeature = async (adminFeatureId: string) => {
    if (!confirm('Are you sure you want to remove this feature assignment?')) {
      return
    }

    try {
      const response = await fetch(`/api/super-admin/admin-features/${adminFeatureId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Feature assignment removed successfully')
        fetchData()
      } else {
        toast.error('Failed to remove feature assignment')
      }
    } catch (error) {
      console.error('Error removing feature assignment:', error)
      toast.error('An error occurred while removing feature assignment')
    }
  }

  const availableFeatures = features.filter(feature => feature.isActive)
  const categories = [...new Set(availableFeatures.map(f => f.category))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feature Management</h1>
          <p className="text-muted-foreground">Assign and manage features for admin accounts</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Assign Features
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Assign Features to Admin</DialogTitle>
              <DialogDescription>
                Select an admin and choose which features they should have access to.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="admin">Admin</Label>
                <Select value={selectedAdmin} onValueChange={setSelectedAdmin}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an admin" />
                  </SelectTrigger>
                  <SelectContent>
                    {admins.map((admin) => (
                      <SelectItem key={admin.id} value={admin.id}>
                        {admin.user.name} - {admin.networkName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Features</Label>
                <div className="space-y-2 mt-2">
                  {categories.map((category) => (
                    <div key={category}>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">{category}</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {availableFeatures
                          .filter(f => f.category === category)
                          .map((feature) => (
                            <div key={feature.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={feature.id}
                                checked={selectedFeatures.includes(feature.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedFeatures([...selectedFeatures, feature.id])
                                  } else {
                                    setSelectedFeatures(selectedFeatures.filter(id => id !== feature.id))
                                  }
                                }}
                                className="rounded"
                              />
                              <label htmlFor={feature.id} className="text-sm">
                                {feature.name}
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignFeatures}>
                Assign Features
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins.length}</div>
            <p className="text-xs text-muted-foreground">
              {admins.filter(a => a.isActive).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Features</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableFeatures.length}</div>
            <p className="text-xs text-muted-foreground">
              Ready for assignment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminFeatures.filter(af => af.isActive).length}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Assignments</CardTitle>
          <CardDescription>View and manage feature assignments for each admin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adminFeatures.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No feature assignments found</p>
            ) : (
              adminFeatures.map((adminFeature) => (
                <Card key={adminFeature.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{adminFeature.feature.name}</h3>
                          <Badge variant={adminFeature.isActive ? 'default' : 'secondary'}>
                            {adminFeature.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {adminFeature.admin.user.name} - {adminFeature.admin.networkName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {adminFeature.feature.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>Category: {adminFeature.feature.category}</span>
                          <span>Granted: {new Date(adminFeature.grantedAt).toLocaleDateString()}</span>
                          {adminFeature.expiresAt && (
                            <span>Expires: {new Date(adminFeature.expiresAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleFeature(adminFeature.id, !adminFeature.isActive)}
                        >
                          {adminFeature.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          {adminFeature.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteFeature(adminFeature.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}