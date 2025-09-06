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
  Settings, 
  DollarSign, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  duration: number
  durationUnit: 'DAYS' | 'MONTHS' | 'YEARS'
  category: 'BASIC' | 'PREMIUM' | 'ENTERPRISE'
  maxConsultations?: number
  maxFamilyMembers?: number
  discountPercentage?: number
  features: string[]
  specializations?: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  admin: {
    user: {
      name: string
      email: string
    }
    networkName: string
  }
}

export default function SubscriptionPlansPage() {
  const { isAuthorized, isUnauthorized, isLoading, session } = useRoleAuthorization({
    requiredRole: "SUPER_ADMIN",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [filteredPlans, setFilteredPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 30,
    durationUnit: 'DAYS' as 'DAYS' | 'MONTHS' | 'YEARS',
    category: 'BASIC' as 'BASIC' | 'PREMIUM' | 'ENTERPRISE',
    maxConsultations: '',
    maxFamilyMembers: '',
    discountPercentage: '',
    features: '',
    specializations: '',
    isActive: true
  })

  const fetchPlans = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/super-admin/subscription-plans', {
        signal: AbortSignal.timeout(10000)
      })
      
      if (response.ok) {
        const data = await response.json()
        setPlans(data)
        setFilteredPlans(data)
      } else {
        setError('Failed to fetch subscription plans')
        toast({
        title: "Error",
        description: 'Failed to fetch subscription plans'
      })
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
      setError('Failed to fetch subscription plans')
      toast({
        title: "Error",
        description: 'Failed to fetch subscription plans'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoading) return
    if (!session) return

    fetchPlans()
  }, [session, isLoading])

  useEffect(() => {
    let filtered = plans

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(plan =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(plan => 
        statusFilter === 'active' ? plan.isActive : !plan.isActive
      )
    }

    setFilteredPlans(filtered)
  }, [plans, searchTerm, statusFilter])

  const handleCreatePlan = async () => {
    try {
      const response = await fetch('/api/super-admin/subscription-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          maxConsultations: formData.maxConsultations ? parseInt(formData.maxConsultations) : null,
          maxFamilyMembers: formData.maxFamilyMembers ? parseInt(formData.maxFamilyMembers) : null,
          discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : null,
          features: formData.features.split(',').map(f => f.trim()).filter(f => f),
          specializations: formData.specializations.split(',').map(s => s.trim()).filter(s => s)
        }),
      })

      if (response.ok) {
        toast({
        title: "Success",
        description: 'Subscription plan created successfully'
      })
        setIsCreateDialogOpen(false)
        resetForm()
        fetchPlans()
      } else {
        const errorData = await response.json()
        toast({
        title: "Error",
        description: errorData.error || 'Failed to create subscription plan'
      })
      }
    } catch (error) {
      console.error('Error creating plan:', error)
      toast({
        title: "Error",
        description: 'Failed to create subscription plan'
      })
    }
  }

  const handleUpdatePlan = async () => {
    if (!editingPlan) return

    try {
      const response = await fetch(`/api/super-admin/subscription-plans/${editingPlan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          maxConsultations: formData.maxConsultations ? parseInt(formData.maxConsultations) : null,
          maxFamilyMembers: formData.maxFamilyMembers ? parseInt(formData.maxFamilyMembers) : null,
          discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : null,
          features: formData.features.split(',').map(f => f.trim()).filter(f => f),
          specializations: formData.specializations.split(',').map(s => s.trim()).filter(s => s)
        }),
      })

      if (response.ok) {
        toast({
        title: "Success",
        description: 'Subscription plan updated successfully'
      })
        setEditingPlan(null)
        resetForm()
        fetchPlans()
      } else {
        const errorData = await response.json()
        toast({
        title: "Error",
        description: errorData.error || 'Failed to update subscription plan'
      })
      }
    } catch (error) {
      console.error('Error updating plan:', error)
      toast({
        title: "Error",
        description: 'Failed to update subscription plan'
      })
    }
  }

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this subscription plan?')) return

    try {
      const response = await fetch(`/api/super-admin/subscription-plans/${planId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
        title: "Success",
        description: 'Subscription plan deleted successfully'
      })
        fetchPlans()
      } else {
        const errorData = await response.json()
        toast({
        title: "Error",
        description: errorData.error || 'Failed to delete subscription plan'
      })
      }
    } catch (error) {
      console.error('Error deleting plan:', error)
      toast({
        title: "Error",
        description: 'Failed to delete subscription plan'
      })
    }
  }

  const handleToggleStatus = async (planId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/super-admin/subscription-plans/${planId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        toast({
        title: "Success",
        description: `Subscription plan ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      })
        fetchPlans()
      } else {
        const errorData = await response.json()
        toast({
        title: "Error",
        description: errorData.error || 'Failed to update plan status'
      })
      }
    } catch (error) {
      console.error('Error updating plan status:', error)
      toast({
        title: "Error",
        description: 'Failed to update plan status'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: 30,
      durationUnit: 'DAYS',
      category: 'BASIC',
      maxConsultations: '',
      maxFamilyMembers: '',
      discountPercentage: '',
      features: '',
      specializations: '',
      isActive: true
    })
  }

  const startEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
      durationUnit: plan.durationUnit,
      category: plan.category,
      maxConsultations: plan.maxConsultations?.toString() || '',
      maxFamilyMembers: plan.maxFamilyMembers?.toString() || '',
      discountPercentage: plan.discountPercentage?.toString() || '',
      features: plan.features.join(', '),
      specializations: plan.specializations?.join(', ') || '',
      isActive: plan.isActive
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
      'BASIC': 'bg-blue-100 text-blue-800',
      'PREMIUM': 'bg-purple-100 text-purple-800',
      'ENTERPRISE': 'bg-orange-100 text-orange-800'
    }
    
    return (
      <Badge variant="secondary" className={variants[category as keyof typeof variants] || ''}>
        {category}
      </Badge>
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
          <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
          <p className="text-gray-600 mt-2">Manage subscription plans and pricing for your platform.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => fetchPlans()}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isCreateDialogOpen || !!editingPlan} onOpenChange={(open) => {
            if (!open) {
              setIsCreateDialogOpen(false)
              setEditingPlan(null)
              resetForm()
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPlan ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}</DialogTitle>
                <DialogDescription>
                  {editingPlan ? 'Update the subscription plan details below.' : 'Create a new subscription plan for your platform.'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Plan Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Premium Health Plan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BASIC">Basic</SelectItem>
                        <SelectItem value="PREMIUM">Premium</SelectItem>
                        <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
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
                    placeholder="Describe the subscription plan..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 0})}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="durationUnit">Duration Unit</Label>
                    <Select value={formData.durationUnit} onValueChange={(value) => setFormData({...formData, durationUnit: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DAYS">Days</SelectItem>
                        <SelectItem value="MONTHS">Months</SelectItem>
                        <SelectItem value="YEARS">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxConsultations">Max Consultations</Label>
                    <Input
                      id="maxConsultations"
                      type="number"
                      value={formData.maxConsultations}
                      onChange={(e) => setFormData({...formData, maxConsultations: e.target.value})}
                      placeholder="Unlimited"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxFamilyMembers">Max Family Members</Label>
                    <Input
                      id="maxFamilyMembers"
                      type="number"
                      value={formData.maxFamilyMembers}
                      onChange={(e) => setFormData({...formData, maxFamilyMembers: e.target.value})}
                      placeholder="Unlimited"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountPercentage">Discount (%)</Label>
                    <Input
                      id="discountPercentage"
                      type="number"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                      placeholder="0"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Features (comma-separated)</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                    placeholder="e.g., user-management, analytics-reports, priority-support"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specializations">Specializations (comma-separated)</Label>
                  <Textarea
                    id="specializations"
                    value={formData.specializations}
                    onChange={(e) => setFormData({...formData, specializations: e.target.value})}
                    placeholder="e.g., cardiology, dermatology, pediatrics"
                    rows={2}
                  />
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
                  setEditingPlan(null)
                  resetForm()
                }}>
                  Cancel
                </Button>
                <Button onClick={editingPlan ? handleUpdatePlan : handleCreatePlan}>
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
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
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>Manage all subscription plans available on your platform</CardDescription>
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
              <Button onClick={fetchPlans}>Retry</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-gray-500">No subscription plans found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-sm text-gray-500">{plan.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryBadge(plan.category)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span>{plan.price}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{plan.duration} {plan.durationUnit.toLowerCase()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {plan.features.slice(0, 2).join(', ')}
                          {plan.features.length > 2 && ` +${plan.features.length - 2} more`}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(plan.isActive)}</TableCell>
                      <TableCell>{format(new Date(plan.createdAt), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(plan.id, plan.isActive)}
                          >
                            {plan.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(plan)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePlan(plan.id)}
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