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
import { Switch } from "@/components/ui/switch"
import { 
  CreditCard, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  DollarSign,
  Activity,
  Heart,
  Building,
  Briefcase,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Filter
} from "lucide-react"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  duration: number
  durationUnit: 'MONTH' | 'YEAR'
  category: string
  maxConsultations: number
  maxFamilyMembers: number
  discountPercentage: number
  isActive: boolean
  features: string[]
  specializations: string[]
  createdAt: string
  updatedAt: string
  subscribersCount: number
}

export default function AdminSubscriptionPlans() {
  const { isAuthorized, isUnauthorized, isLoading: authLoading, userSession } = useRoleAuthorization({
    requiredRole: "ADMIN",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    price: 0,
    duration: 1,
    durationUnit: 'MONTH' as 'MONTH' | 'YEAR',
    category: "",
    maxConsultations: 0,
    maxFamilyMembers: 1,
    discountPercentage: 0,
    isActive: true,
    features: [] as string[],
    specializations: [] as string[]
  })

  useEffect(() => {
    if (isAuthorized) {
      // Original fetch logic will be handled separately
    }
  }, [isAuthorized])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/admin/subscription-plans')
      if (response.ok) {
        const data = await response.json()
        const formattedPlans = data.plans.map((plan: any) => ({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          price: plan.price,
          duration: plan.duration,
          durationUnit: plan.durationUnit,
          category: plan.category,
          maxConsultations: plan.maxConsultations,
          maxFamilyMembers: plan.maxFamilyMembers,
          discountPercentage: plan.discountPercentage,
          isActive: plan.isActive,
          features: plan.features || [],
          specializations: plan.specializations || [],
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
          subscribersCount: plan._count?.subscriptions || 0
        }))
        setPlans(formattedPlans)
      } else {
        toast({
        title: "Error",
        description: 'Failed to fetch subscription plans'
      })
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
      toast({
        title: "Error",
        description: 'Failed to load subscription plans'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPlan = async () => {
    try {
      const response = await fetch('/api/admin/subscription-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPlan)
      })

      if (response.ok) {
        const data = await response.json()
        const formattedPlan = {
          id: data.plan.id,
          name: data.plan.name,
          description: data.plan.description,
          price: data.plan.price,
          duration: data.plan.duration,
          durationUnit: data.plan.durationUnit,
          category: data.plan.category,
          maxConsultations: data.plan.maxConsultations,
          maxFamilyMembers: data.plan.maxFamilyMembers,
          discountPercentage: data.plan.discountPercentage,
          isActive: data.plan.isActive,
          features: data.plan.features || [],
          specializations: data.plan.specializations || [],
          createdAt: data.plan.createdAt,
          updatedAt: data.plan.updatedAt,
          subscribersCount: 0
        }
        
        setPlans([...plans, formattedPlan])
        setNewPlan({
          name: "",
          description: "",
          price: 0,
          duration: 1,
          durationUnit: 'MONTH',
          category: "",
          maxConsultations: 0,
          maxFamilyMembers: 1,
          discountPercentage: 0,
          isActive: true,
          features: [],
          specializations: []
        })
        setIsAddDialogOpen(false)
        toast({
        title: "Success",
        description: 'Subscription plan created successfully'
      })
      } else {
        const errorData = await response.json()
        toast({
        title: "Error",
        description: errorData.error || 'Failed to create subscription plan'
      })
      }
    } catch (error) {
      console.error('Error adding plan:', error)
      toast({
        title: "Error",
        description: 'Failed to create subscription plan'
      })
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'diabetes':
        return <Activity className="h-5 w-5 text-red-600" />
      case 'cardiac':
        return <Heart className="h-5 w-5 text-red-600" />
      case 'gynecology':
        return <Users className="h-5 w-5 text-pink-600" />
      case 'corporate':
        return <Building className="h-5 w-5 text-blue-600" />
      case 'family':
        return <Briefcase className="h-5 w-5 text-green-600" />
      default:
        return <CreditCard className="h-5 w-5 text-gray-600" />
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

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activePlans = filteredPlans.filter(p => p.isActive)
  const inactivePlans = filteredPlans.filter(p => !p.isActive)
  const categories = [...new Set(plans.map(p => p.category))]

  const PlanCard = ({ plan }: { plan: SubscriptionPlan }) => {
    return (
      <Card className="border-emerald-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  {getCategoryIcon(plan.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                    <Badge className={plan.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"}>
                      {plan.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{plan.category}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{plan.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Price</p>
                  <p className="text-lg font-bold text-gray-900">${plan.price}</p>
                  <p className="text-xs text-gray-600">per {plan.durationUnit.toLowerCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Consultations</p>
                  <p className="text-lg font-bold text-gray-900">{plan.maxConsultations}</p>
                  <p className="text-xs text-gray-600">max per period</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Family Members</p>
                  <p className="text-lg font-bold text-gray-900">{plan.maxFamilyMembers}</p>
                  <p className="text-xs text-gray-600">max covered</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Discount</p>
                  <p className="text-lg font-bold text-gray-900">{plan.discountPercentage}%</p>
                  <p className="text-xs text-gray-600">subscriber discount</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Features</p>
                  <div className="flex flex-wrap gap-1">
                    {plan.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Specializations</p>
                  <div className="flex flex-wrap gap-1">
                    {plan.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-600">
                    Subscribers: <span className="font-medium">{plan.subscribersCount}</span>
                  </p>
                  <p className="text-gray-600">
                    Created: {new Date(plan.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2 ml-4">
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => router.push(`/dashboard/admin/subscription-plans/${plan.id}`)}
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
            <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
            <p className="text-gray-600 mt-2">
              Create and manage specialized subscription plans for your network
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Subscription Plan</DialogTitle>
                  <DialogDescription>
                    Configure a new subscription plan with specific features and pricing
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Plan Name *</Label>
                      <Input
                        id="name"
                        value={newPlan.name}
                        onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                        placeholder="Diabetes Care Plan"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={newPlan.category} onValueChange={(value) => setNewPlan({...newPlan, category: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Diabetes">Diabetes</SelectItem>
                          <SelectItem value="Cardiac">Cardiac</SelectItem>
                          <SelectItem value="Gynecology">Gynecology</SelectItem>
                          <SelectItem value="Corporate">Corporate</SelectItem>
                          <SelectItem value="Family">Family</SelectItem>
                          <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newPlan.description}
                      onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                      placeholder="Comprehensive diabetes management with regular monitoring..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newPlan.price}
                        onChange={(e) => setNewPlan({...newPlan, price: parseFloat(e.target.value) || 0})}
                        placeholder="99.99"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration *</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={newPlan.duration}
                        onChange={(e) => setNewPlan({...newPlan, duration: parseInt(e.target.value) || 1})}
                        placeholder="1"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="durationUnit">Duration Unit *</Label>
                      <Select value={newPlan.durationUnit} onValueChange={(value: 'MONTH' | 'YEAR') => setNewPlan({...newPlan, durationUnit: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MONTH">Month</SelectItem>
                          <SelectItem value="YEAR">Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="maxConsultations">Max Consultations *</Label>
                      <Input
                        id="maxConsultations"
                        type="number"
                        value={newPlan.maxConsultations}
                        onChange={(e) => setNewPlan({...newPlan, maxConsultations: parseInt(e.target.value) || 0})}
                        placeholder="12"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxFamilyMembers">Max Family Members *</Label>
                      <Input
                        id="maxFamilyMembers"
                        type="number"
                        value={newPlan.maxFamilyMembers}
                        onChange={(e) => setNewPlan({...newPlan, maxFamilyMembers: parseInt(e.target.value) || 1})}
                        placeholder="1"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discountPercentage">Discount (%)</Label>
                      <Input
                        id="discountPercentage"
                        type="number"
                        value={newPlan.discountPercentage}
                        onChange={(e) => setNewPlan({...newPlan, discountPercentage: parseInt(e.target.value) || 0})}
                        placeholder="15"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={newPlan.isActive}
                      onCheckedChange={(checked) => setNewPlan({...newPlan, isActive: checked})}
                    />
                    <Label htmlFor="isActive">Active Plan</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddPlan} disabled={!newPlan.name || !newPlan.description || !newPlan.category}>
                      Create Plan
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
                  <p className="text-sm font-medium text-gray-600">Total Plans</p>
                  <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
                </div>
                <CreditCard className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Plans</p>
                  <p className="text-2xl font-bold text-gray-900">{activePlans.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">{plans.reduce((sum, plan) => sum + plan.subscribersCount, 0)}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                </div>
                <Filter className="h-8 w-8 text-purple-600" />
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
                placeholder="Search plans by name, description, or category..."
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
              All Plans ({filteredPlans.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Active ({activePlans.length})
            </TabsTrigger>
            <TabsTrigger value="inactive" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Inactive ({inactivePlans.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {filteredPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4">
              {activePlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            <div className="grid gap-4">
              {inactivePlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    
  )
}