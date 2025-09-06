'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Settings, Plus, X, Save } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Admin {
  id: string
  user: {
    id: string
    name: string
    email: string
  }
  networkName: string
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
  adminId: string
  featureId: string
  assignedAt: string
  expiresAt?: string
  feature: Feature
}

export default function ManageFeatures() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const adminId = searchParams.get('adminId')
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [features, setFeatures] = useState<Feature[]>([])
  const [adminFeatures, setAdminFeatures] = useState<AdminFeature[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [expiryDate, setExpiryDate] = useState('')

  useEffect(() => {
    if (adminId) {
      fetchData()
    }
  }, [adminId])

  const fetchData = async () => {
    try {
      const [adminRes, featuresRes] = await Promise.all([
        fetch(`/api/super-admin/admins/${adminId}`),
        fetch('/api/super-admin/features')
      ])

      if (adminRes.ok) {
        const adminData = await adminRes.json()
        setAdmin(adminData)
        if (adminData.adminFeatures) {
          setAdminFeatures(adminData.adminFeatures)
          setSelectedFeatures(adminData.adminFeatures.map((af: AdminFeature) => af.featureId))
        }
      }

      if (featuresRes.ok) {
        const featuresData = await featuresRes.json()
        setFeatures(featuresData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/super-admin/admins/${adminId}/features`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          features: selectedFeatures,
          expiresAt: expiryDate || null
        }),
      })

      if (response.ok) {
        toast({
        title: "Success",
        description: 'Features updated successfully'
      })
        router.push('/dashboard/super-admin')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to update features')
      }
    } catch (error) {
      console.error('Error updating features:', error)
      setError('An error occurred while updating features')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!admin) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>Admin not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Manage Features</h1>
          <p className="text-muted-foreground">
            Manage features for {admin.user.name} - {admin.networkName}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Features</CardTitle>
              <CardDescription>Select which features this admin can access</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-3">
                {features.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No features available</p>
                ) : (
                  features.map((feature) => (
                    <div
                      key={feature.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedFeatures.includes(feature.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => toggleFeature(feature.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-sm">{feature.name}</h4>
                            <Badge variant={feature.isActive ? 'default' : 'secondary'} className="text-xs">
                              {feature.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{feature.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Category: {feature.category}
                          </p>
                        </div>
                        {selectedFeatures.includes(feature.id) && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-muted-foreground">
                    If set, features will expire on this date
                  </p>
                </div>

                <Button onClick={handleSave} className="w-full bg-[#2ba664] hover:bg-[#238a52] text-white" disabled={saving}>
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Features
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Current Features</CardTitle>
              <CardDescription>Currently assigned features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {adminFeatures.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No features assigned</p>
                ) : (
                  adminFeatures.map((adminFeature) => (
                    <div key={adminFeature.id} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{adminFeature.feature.name}</h4>
                          <p className="text-xs text-muted-foreground">{adminFeature.feature.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {adminFeature.feature.category}
                            </Badge>
                            {adminFeature.expiresAt && (
                              <Badge variant="secondary" className="text-xs">
                                Expires: {new Date(adminFeature.expiresAt).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {selectedFeatures.length > 0 && (
                <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Selected ({selectedFeatures.length})</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedFeatures([])}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {selectedFeatures.map((featureId) => {
                      const feature = features.find(f => f.id === featureId)
                      return feature ? (
                        <div key={featureId} className="text-xs text-muted-foreground">
                          • {feature.name}
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}