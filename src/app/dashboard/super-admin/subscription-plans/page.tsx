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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
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
  Filter,
  Building2,
  Stethoscope,
  FlaskConical,
  Pill,
  ChevronDown,
  Info
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  duration: number
  durationUnit: 'DAYS' | 'MONTHS' | 'YEARS'
  category: 'BASIC' | 'PREMIUM' | 'ENTERPRISE' | 'CUSTOM'
  maxConsultations?: number
  maxFamilyMembers?: number
  discountPercentage?: number
  features: string[]
  specializations?: string[]
  consultations?: Array<{
    id: string
    specialty: string
    number: string
    price: number
    priceBeyondLimit: number
    isUnlimited: boolean
  }>
  labTests?: Array<{
    id: string
    test: string
    discountPercentage: number
  }>
  medicines?: Array<{
    id: string
    provider: string
    category: string
    discountPercentage: number
    isUpTo: boolean
  }>
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
    duration: 30 as number | string,
    durationUnit: 'DAYS' as 'DAYS' | 'MONTHS' | 'YEARS',
    category: 'BASIC' as 'BASIC' | 'PREMIUM' | 'ENTERPRISE' | 'CUSTOM',
    maxConsultations: '',
    maxFamilyMembers: '',
    discountPercentage: '',
    features: '',
    specializations: '',
    consultations: [],
    labTests: [],
    medicines: [],
    isActive: true,
    adminId: ''
  })

  const [admins, setAdmins] = useState<Array<{id: string, networkName: string, user: {name: string, email: string}}>>([])
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false)
  
  // State for CRUD operations
  const [consultations, setConsultations] = useState<Array<{
    id: string
    specialty: string
    number: string
    price: number
    priceBeyondLimit: number
    isUnlimited: boolean
  }>>([])
  const [labTests, setLabTests] = useState<Array<{
    id: string
    test: string
    discountPercentage: number
  }>>([])
  const [medicines, setMedicines] = useState<Array<{
    id: string
    provider: string
    category: string
    discountPercentage: number
    isUpTo: boolean
  }>>([])
  
  // Form states for new entries
  const [newConsultation, setNewConsultation] = useState({
    specialty: '',
    number: '',
    price: 0,
    priceBeyondLimit: 0,
    isUnlimited: false
  })
  const [newLabTest, setNewLabTest] = useState({
    test: '',
    discountPercentage: 0
  })
  const [newMedicine, setNewMedicine] = useState({
    provider: '',
    category: '',
    discountPercentage: 0,
    isUpTo: true
  })

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/super-admin/admins')
      if (response.ok) {
        const data = await response.json()
        setAdmins(data.admins || [])
      }
    } catch (error) {
      console.error('Error fetching admins:', error)
    }
  }

  const fetchPlans = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/super-admin/subscription-plans', {
        signal: AbortSignal.timeout(10000)
      })
      
      if (response.ok) {
        const data = await response.json()
        setPlans(data.plans || data)
        setFilteredPlans(data.plans || data)
      } else {
        setError('Failed to fetch subscription plans')
        toast.error('Failed to fetch subscription plans')
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
      setError('Failed to fetch subscription plans')
      toast.error('Failed to fetch subscription plans')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoading) return
    if (!session) return

    fetchPlans()
    fetchAdmins()
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
    if (!formData.adminId) {
      toast.error('Please select an admin for this subscription plan')
      return
    }

    try {
      const payload = {
        ...formData,
        adminId: formData.adminId,
        duration: formData.duration === 'unlimited' ? 365 : parseInt(formData.duration as string) || 30,
        maxConsultations: formData.maxConsultations === 'unlimited' ? null : parseInt(formData.maxConsultations) || null,
        maxFamilyMembers: formData.maxFamilyMembers === 'unlimited' ? null : parseInt(formData.maxFamilyMembers) || null,
        discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : null,
        features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : [],
        specializations: formData.specializations ? formData.specializations.split(',').map(s => s.trim()).filter(s => s) : [],
        consultations: consultations,
        labTests: labTests,
        medicines: medicines
      }
      
      console.log('Creating plan with payload:', payload)
      
      const response = await fetch('/api/super-admin/subscription-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success('Subscription plan created successfully')
        setIsCreateDialogOpen(false)
        resetForm()
        fetchPlans()
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        toast.error(errorData.error || 'Failed to create subscription plan')
      }
    } catch (error) {
      console.error('Error creating plan:', error)
      toast.error('Failed to create subscription plan')
    }
  }

  const handleUpdatePlan = async () => {
    if (!editingPlan) return

    try {
      const payload = {
        ...formData,
        duration: formData.duration === 'unlimited' ? 365 : parseInt(formData.duration as string) || 30,
        maxConsultations: formData.maxConsultations === 'unlimited' ? null : parseInt(formData.maxConsultations) || null,
        maxFamilyMembers: formData.maxFamilyMembers === 'unlimited' ? null : parseInt(formData.maxFamilyMembers) || null,
        discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : null,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        specializations: formData.specializations.split(',').map(s => s.trim()).filter(s => s),
        consultations: consultations,
        labTests: labTests,
        medicines: medicines
      }
      
      console.log('Updating plan with payload:', payload)
      
      const response = await fetch(`/api/super-admin/subscription-plans/${editingPlan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success('Subscription plan updated successfully')
        setEditingPlan(null)
        resetForm()
        fetchPlans()
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        toast.error(errorData.error || 'Failed to update subscription plan')
      }
    } catch (error) {
      console.error('Error updating plan:', error)
      toast.error('Failed to update subscription plan')
    }
  }

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this subscription plan?')) return

    try {
      const response = await fetch(`/api/super-admin/subscription-plans/${planId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Subscription plan deleted successfully')
        fetchPlans()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to delete subscription plan')
      }
    } catch (error) {
      console.error('Error deleting plan:', error)
      toast.error('Failed to delete subscription plan')
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
        toast.success(`Subscription plan ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
        fetchPlans()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update plan status')
      }
    } catch (error) {
      console.error('Error updating plan status:', error)
      toast.error('Failed to update plan status')
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
      consultations: [],
      labTests: [],
      medicines: [],
      isActive: true,
      adminId: ''
    })
    
    // Reset CRUD state
    setConsultations([])
    setLabTests([])
    setMedicines([])
    setNewConsultation({
      specialty: '',
      number: '',
      price: 0,
      priceBeyondLimit: 0,
      isUnlimited: false
    })
    setNewLabTest({
      test: '',
      discountPercentage: 0
    })
    setNewMedicine({
      provider: '',
      category: '',
      discountPercentage: 0,
      isUpTo: true
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
    
    // Load existing CRUD data
    setConsultations(plan.consultations || [])
    setLabTests(plan.labTests || [])
    setMedicines(plan.medicines || [])
  }
  
  // CRUD functions for consultations
  const addConsultation = () => {
    if (!newConsultation.specialty) return
    
    const consultation = {
      id: Date.now().toString(),
      specialty: newConsultation.specialty,
      number: newConsultation.isUnlimited ? 'unlimited' : newConsultation.number,
      price: newConsultation.price,
      priceBeyondLimit: newConsultation.priceBeyondLimit,
      isUnlimited: newConsultation.isUnlimited
    }
    
    setConsultations([...consultations, consultation])
    setNewConsultation({
      specialty: '',
      number: '',
      price: 0,
      priceBeyondLimit: 0,
      isUnlimited: false
    })
  }
  
  const removeConsultation = (id: string) => {
    setConsultations(consultations.filter(c => c.id !== id))
  }
  
  // CRUD functions for lab tests
  const addLabTest = () => {
    if (!newLabTest.test) return
    
    const labTest = {
      id: Date.now().toString(),
      test: newLabTest.test,
      discountPercentage: newLabTest.discountPercentage
    }
    
    setLabTests([...labTests, labTest])
    setNewLabTest({
      test: '',
      discountPercentage: 0
    })
  }
  
  const removeLabTest = (id: string) => {
    setLabTests(labTests.filter(lt => lt.id !== id))
  }
  
  // CRUD functions for medicines
  const addMedicine = () => {
    if (!newMedicine.provider || !newMedicine.category) return
    
    const medicine = {
      id: Date.now().toString(),
      provider: newMedicine.provider,
      category: newMedicine.category,
      discountPercentage: newMedicine.discountPercentage,
      isUpTo: newMedicine.isUpTo
    }
    
    setMedicines([...medicines, medicine])
    setNewMedicine({
      provider: '',
      category: '',
      discountPercentage: 0,
      isUpTo: true
    })
  }
  
  const removeMedicine = (id: string) => {
    setMedicines(medicines.filter(m => m.id !== id))
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
                    <Label htmlFor="admin">Admin Network</Label>
                    <Select value={formData.adminId} onValueChange={(value) => setFormData({...formData, adminId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an admin" />
                      </SelectTrigger>
                      <SelectContent>
                        {admins.map((admin) => (
                          <SelectItem key={admin.id} value={admin.id}>
                            {admin.networkName} ({admin.user.name})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="CUSTOM">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
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

                <div className="grid grid-cols-2 gap-4">
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
                    <Select value={formData.duration === 'unlimited' ? 'unlimited' : formData.duration.toString()} onValueChange={(value) => setFormData({...formData, duration: value === 'unlimited' ? 'unlimited' : parseInt(value) || 30})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="CUSTOM">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Advanced Features */}
                <Collapsible open={showAdvancedFeatures} onOpenChange={setShowAdvancedFeatures}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" type="button" className="w-full justify-between">
                      <span className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Advanced Features
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedFeatures ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-6 mt-4">
                    {/* Consultations Section */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          <Stethoscope className="mr-2 h-4 w-4" />
                          Specialist Consultations
                        </h4>
                        <Button size="sm" onClick={addConsultation}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Select value={newConsultation.specialty} onValueChange={(value) => setNewConsultation({...newConsultation, specialty: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gp">General Practice (GP)</SelectItem>
                            <SelectItem value="cardiology">Cardiology</SelectItem>
                            <SelectItem value="dermatology">Dermatology</SelectItem>
                            <SelectItem value="pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="orthopedics">Orthopedics</SelectItem>
                            <SelectItem value="neurology">Neurology</SelectItem>
                            <SelectItem value="psychiatry">Psychiatry</SelectItem>
                            <SelectItem value="gynecology">Gynecology</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={newConsultation.isUnlimited}
                            onCheckedChange={(checked) => setNewConsultation({...newConsultation, isUnlimited: checked})}
                          />
                          <Label className="text-sm">Unlimited consultations</Label>
                        </div>
                        
                        {!newConsultation.isUnlimited && (
                          <Input
                            placeholder="Number of consultations"
                            type="number"
                            value={newConsultation.number}
                            onChange={(e) => setNewConsultation({...newConsultation, number: e.target.value})}
                            min="1"
                            className="col-span-2"
                          />
                        )}
                        
                        <Input
                          placeholder="Price per consultation"
                          type="number"
                          value={newConsultation.price}
                          onChange={(e) => setNewConsultation({...newConsultation, price: parseFloat(e.target.value) || 0})}
                          min="0"
                          step="0.01"
                        />
                        
                        <Input
                          placeholder="Price beyond limit"
                          type="number"
                          value={newConsultation.priceBeyondLimit}
                          onChange={(e) => setNewConsultation({...newConsultation, priceBeyondLimit: parseFloat(e.target.value) || 0})}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      
                      {/* Consultations List */}
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {consultations.map((consultation) => (
                          <div key={consultation.id} className="flex items-center justify-between p-3 bg-white rounded border">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{consultation.specialty}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {consultation.isUnlimited ? (
                                  <span className="text-green-600">Unlimited consultations</span>
                                ) : (
                                  <span>{consultation.number} consultations included</span>
                                )}
                                <span className="mx-2">•</span>
                                <span>Price: ${consultation.price}</span>
                                {consultation.priceBeyondLimit > 0 && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <span>Beyond limit: ${consultation.priceBeyondLimit}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeConsultation(consultation.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        {consultations.length === 0 && (
                          <div className="text-center text-gray-500 py-4 text-sm">
                            No consultations added yet
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Lab Tests Section */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          <FlaskConical className="mr-2 h-4 w-4" />
                          Lab Test Discounts
                        </h4>
                        <Button size="sm" onClick={addLabTest}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <Select value={newLabTest.test} onValueChange={(value) => setNewLabTest({...newLabTest, test: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select test" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blood_test">Blood Test</SelectItem>
                            <SelectItem value="xray">X-Ray</SelectItem>
                            <SelectItem value="mri">MRI</SelectItem>
                            <SelectItem value="ct_scan">CT Scan</SelectItem>
                            <SelectItem value="ultrasound">Ultrasound</SelectItem>
                            <SelectItem value="ecg">ECG</SelectItem>
                            <SelectItem value="urine_test">Urine Test</SelectItem>
                            <SelectItem value="all">All Tests</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <div className="flex items-center space-x-2">
                          <Label className="text-sm whitespace-nowrap">Discount Percentage:</Label>
                          <Input
                            placeholder="e.g., 15"
                            type="number"
                            value={newLabTest.discountPercentage}
                            onChange={(e) => setNewLabTest({...newLabTest, discountPercentage: parseFloat(e.target.value) || 0})}
                            min="0"
                            max="100"
                            step="0.1"
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-500">%</span>
                        </div>
                      </div>
                      
                      {/* Lab Tests List */}
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {labTests.map((labTest) => (
                          <div key={labTest.id} className="flex items-center justify-between p-2 bg-white rounded border">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{labTest.test}</div>
                              <div className="text-xs text-gray-500">
                                Discount: {labTest.discountPercentage}%
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeLabTest(labTest.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        {labTests.length === 0 && (
                          <div className="text-center text-gray-500 py-4 text-sm">
                            No lab tests added yet
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Medicines Section */}
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          <Pill className="mr-2 h-4 w-4" />
                          Pharmacy Medicine Discounts
                        </h4>
                        <Button size="sm" onClick={addMedicine}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                        <Select value={newMedicine.provider} onValueChange={(value) => setNewMedicine({...newMedicine, provider: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apollo">Apollo Pharmacy</SelectItem>
                            <SelectItem value="fortis">Fortis Health</SelectItem>
                            <SelectItem value="max">Max Healthcare</SelectItem>
                            <SelectItem value="cvs">CVS Pharmacy</SelectItem>
                            <SelectItem value="walgreens">Walgreens</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select value={newMedicine.category} onValueChange={(value) => setNewMedicine({...newMedicine, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="generic">Generic Medicines</SelectItem>
                            <SelectItem value="branded">Branded Medicines</SelectItem>
                            <SelectItem value="chronic">Chronic Conditions</SelectItem>
                            <SelectItem value="acute">Acute Conditions</SelectItem>
                            <SelectItem value="vitamins">Vitamins & Supplements</SelectItem>
                            <SelectItem value="all">All Categories</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <div className="flex items-center space-x-2">
                          <Label className="text-sm whitespace-nowrap">Discount Percentage:</Label>
                          <Input
                            placeholder="e.g., 20"
                            type="number"
                            value={newMedicine.discountPercentage}
                            onChange={(e) => setNewMedicine({...newMedicine, discountPercentage: parseFloat(e.target.value) || 0})}
                            min="0"
                            max="100"
                            step="0.1"
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-500">%</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={newMedicine.isUpTo}
                            onCheckedChange={(checked) => setNewMedicine({...newMedicine, isUpTo: checked})}
                          />
                          <Label className="text-sm">Up to</Label>
                        </div>
                      </div>
                      
                      {/* Medicines List */}
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {medicines.map((medicine) => (
                          <div key={medicine.id} className="flex items-center justify-between p-2 bg-white rounded border">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{medicine.provider} - {medicine.category}</div>
                              <div className="text-xs text-gray-500">
                                Discount: {medicine.discountPercentage}% {medicine.isUpTo ? '(up to)' : ''}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeMedicine(medicine.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        {medicines.length === 0 && (
                          <div className="text-center text-gray-500 py-4 text-sm">
                            No medicines added yet
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

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