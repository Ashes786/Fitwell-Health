'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CreditCard, 
  Calendar, 
  Users, 
  Stethoscope, 
  FileText, 
  Activity,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Shield,
  Zap,
  Heart,
  FlaskConical,
  Pill,
  Video,
  Phone,
  MapPin,
  ArrowRight,
  Plus,
  Info,
  X,
  Check
} from 'lucide-react'
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { UserRole } from "@prisma/client"
import { toast } from 'sonner'

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
  isActive: boolean
  admin: {
    user: {
      name: string
      email: string
    }
    networkName: string
  }
}

interface CurrentSubscription {
  id: string
  subscriptionPlan: SubscriptionPlan
  startDate: string
  endDate: string
  isActive: boolean
  consultationsUsed: number
  familyMembersUsed: number
  labTestsUsed: number
  prescriptionsUsed: number
  aiReportsUsed: number
}

export default function SubscriptionUpgrade() {
  const { isAuthorized, isUnauthorized, isLoading } = useRoleAuthorization({
    requiredRole: UserRole.PATIENT,
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [showDetails, setShowDetails] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  useEffect(() => {
    if (isAuthorized) {
      fetchSubscriptionData()
    }
  }, [isAuthorized])

  const fetchSubscriptionData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/patient/subscription?type=PUBLIC')
      if (response.ok) {
        const data = await response.json()
        setPlans(data.plans)
        setCurrentSubscription(data.currentSubscription)
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error)
      toast.error('Failed to fetch subscription plans')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    setShowDetails(plan.id)
  }

  const handleUpgrade = async () => {
    if (!selectedPlan || !acceptedTerms) {
      toast.error('Please accept the terms and conditions')
      return
    }

    setUpgrading(true)
    try {
      const response = await fetch('/api/patient/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionPlanId: selectedPlan.id,
          paymentMethod: 'CREDIT_CARD', // Placeholder
          paymentId: 'payment_' + Date.now() // Placeholder
        }),
      })

      if (response.ok) {
        toast.success('Subscription upgraded successfully!')
        router.push('/dashboard/patient/subscription')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to upgrade subscription')
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error)
      toast.error('Failed to upgrade subscription')
    } finally {
      setUpgrading(false)
    }
  }

  const getCategoryBadge = (category: string) => {
    const variants = {
      'BASIC': 'bg-blue-100 text-blue-800',
      'PREMIUM': 'bg-purple-100 text-purple-800',
      'ENTERPRISE': 'bg-orange-100 text-orange-800',
      'CUSTOM': 'bg-red-100 text-red-800'
    }
    
    return (
      <Badge variant="secondary" className={variants[category as keyof typeof variants] || ''}>
        {category}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upgrade Subscription</h1>
          <p className="text-gray-600 mt-2">Choose a new subscription plan that fits your needs</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard/patient/subscription')}
        >
          <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
          Back to Subscription
        </Button>
      </div>

      {/* Current Subscription */}
      {currentSubscription && (
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Star className="mr-2 h-5 w-5 text-emerald-600" />
              Current Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Plan</span>
                  <span className="text-sm font-medium">{currentSubscription.subscriptionPlan.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className="bg-emerald-100 text-emerald-800">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Days Remaining</span>
                  <span className="text-sm font-medium text-emerald-600">
                    {Math.ceil((new Date(currentSubscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price</span>
                  <span className="text-sm font-medium">${currentSubscription.subscriptionPlan.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="text-sm font-medium">{currentSubscription.subscriptionPlan.duration} {currentSubscription.subscriptionPlan.durationUnit.toLowerCase()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Discount</span>
                  <span className="text-sm font-medium">{currentSubscription.subscriptionPlan.discountPercentage || 0}%</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600">Valid Period</span>
                  <div className="text-sm font-medium mt-1">
                    {new Date(currentSubscription.startDate).toLocaleDateString()} - {new Date(currentSubscription.endDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-emerald-600">Auto-renewal enabled</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`border-2 transition-all duration-300 hover:shadow-lg ${
              selectedPlan?.id === plan.id ? 'border-emerald-500 shadow-lg' : 'border-gray-200'
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {plan.name}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {getCategoryBadge(plan.category)}
                </div>
              </div>
              <CardDescription>{plan.description}</CardDescription>
              <div className="text-right">
                <div className="text-3xl font-bold text-emerald-600">
                  ${plan.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  per {plan.durationUnit.toLowerCase()}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Key Features</h4>
                  <div className="space-y-1">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                    {plan.features.length > 3 && (
                      <div className="text-sm text-gray-500">
                        +{plan.features.length - 3} more features
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Limits</h4>
                  <div className="text-sm text-gray-600">
                    <div>Consultations: {plan.maxConsultations || 'Unlimited'}</div>
                    <div>Family Members: {plan.maxFamilyMembers || 'Unlimited'}</div>
                    <div>Discount: {plan.discountPercentage || 0}%</div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowDetails(showDetails === plan.id ? null : plan.id)}
                    className="flex-1"
                  >
                    <Info className="mr-2 h-4 w-4" />
                    {showDetails === plan.id ? 'Hide' : 'Details'}
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleSelectPlan(plan)}
                    className="flex-1"
                    disabled={currentSubscription?.subscriptionPlan.id === plan.id}
                  >
                    {currentSubscription?.subscriptionPlan.id === plan.id ? 'Current' : 'Select'}
                  </Button>
                </div>

                {/* Detailed View */}
                {showDetails === plan.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Full Details</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div><strong>Duration:</strong> {plan.duration} {plan.durationUnit.toLowerCase()}</div>
                      <div><strong>Category:</strong> {plan.category}</div>
                      {plan.specializations && plan.specializations.length > 0 && (
                        <div>
                          <strong>Specializations:</strong> {plan.specializations.join(', ')}
                        </div>
                      )}
                      <div>
                        <strong>All Features:</strong>
                        <ul className="ml-4 mt-1 space-y-1">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-3 w-3 text-emerald-600" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upgrade Flow */}
      {selectedPlan && (
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-emerald-600" />
              Upgrade to {selectedPlan.name}
            </CardTitle>
            <CardDescription>
              Review your subscription upgrade and complete the payment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Plan Comparison */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Current Plan</h4>
                  {currentSubscription ? (
                    <div className="space-y-1 text-sm">
                      <div><strong>Name:</strong> {currentSubscription.subscriptionPlan.name}</div>
                      <div><strong>Price:</strong> ${currentSubscription.subscriptionPlan.price}</div>
                      <div><strong>Features:</strong> {currentSubscription.subscriptionPlan.features.length}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">No current subscription</div>
                  )}
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">New Plan</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Name:</strong> {selectedPlan.name}</div>
                    <div><strong>Price:</strong> ${selectedPlan.price}</div>
                    <div><strong>Features:</strong> {selectedPlan.features.length}</div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Terms and Conditions</h4>
                <div className="p-4 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>• Your new subscription will start immediately upon payment</p>
                    <p>• You will have access to all features included in the {selectedPlan.name} plan</p>
                    <p>• Your current subscription will be cancelled and replaced with the new one</p>
                    <p>• No refunds will be provided for the remainder of your current subscription</p>
                    <p>• The subscription will auto-renew at the end of the billing period</p>
                    <p>• You can cancel your subscription at any time from your account settings</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I accept the terms and conditions
                  </label>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Payment Summary</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Plan Price:</span>
                      <span>${selectedPlan.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fee:</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>${selectedPlan.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedPlan(null)
                    setShowDetails(null)
                    setAcceptedTerms(false)
                  }}
                  disabled={upgrading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpgrade}
                  disabled={!acceptedTerms || upgrading}
                  className="flex-1"
                >
                  {upgrading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Complete Upgrade</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}