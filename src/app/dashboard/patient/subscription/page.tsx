'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Info
} from "lucide-react"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { UserRole } from "@prisma/client"

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  duration: number
  durationUnit: string
  category: string
  maxConsultations?: number
  maxFamilyMembers?: number
  discountPercentage?: number
  features: string[]
  specializations?: string[]
  isActive: boolean
  startDate: string
  endDate: string
}

interface ServiceUsage {
  type: string
  used: number
  total: number
  icon: any
  color: string
  description: string
}

interface Transaction {
  id: string
  type: 'PAYMENT' | 'REFUND' | 'ADJUSTMENT'
  amount: number
  description: string
  date: string
  status: 'COMPLETED' | 'PENDING' | 'FAILED'
}

export default function PatientSubscription() {
  const { isAuthorized, isUnauthorized, isLoading } = useRoleAuthorization({
    requiredRole: UserRole.PATIENT,
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()
  const [subscription, setSubscription] = useState<SubscriptionPlan | null>(null)
  const [serviceUsage, setServiceUsage] = useState<ServiceUsage[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthorized) {
      fetchSubscriptionData()
    }
  }, [isAuthorized])

  const fetchSubscriptionData = async () => {
    setLoading(true)
    try {
      // Mock subscription data
      const mockSubscription: SubscriptionPlan = {
        id: "1",
        name: "Premium Health Plan",
        description: "Comprehensive healthcare coverage with unlimited consultations and family members",
        price: 299.99,
        duration: 30,
        durationUnit: "DAYS",
        category: "PREMIUM",
        maxConsultations: 20,
        maxFamilyMembers: 5,
        discountPercentage: 15,
        features: [
          "Unlimited GP consultations",
          "Specialist consultations",
          "Lab test discounts",
          "Pharmacy discounts",
          "Health card benefits",
          "AI health reports",
          "Priority appointments",
          "24/7 support"
        ],
        specializations: ["General Practice", "Cardiology", "Dermatology", "Pediatrics"],
        isActive: true,
        startDate: "2024-01-01",
        endDate: "2024-01-31"
      }

      const mockServiceUsage: ServiceUsage[] = [
        {
          type: "GP Consultations",
          used: 8,
          total: 15,
          icon: Stethoscope,
          color: "bg-blue-500",
          description: "General practitioner visits"
        },
        {
          type: "Specialist Consultations",
          used: 3,
          total: 10,
          icon: Users,
          color: "bg-purple-500",
          description: "Specialist doctor visits"
        },
        {
          type: "Lab Tests",
          used: 5,
          total: 12,
          icon: FlaskConical,
          color: "bg-green-500",
          description: "Laboratory tests and diagnostics"
        },
        {
          type: "Prescriptions",
          used: 12,
          total: 20,
          icon: Pill,
          color: "bg-orange-500",
          description: "Prescription medications"
        },
        {
          type: "Family Members",
          used: 2,
          total: 5,
          icon: Users,
          color: "bg-pink-500",
          description: "Family member coverage"
        },
        {
          type: "AI Reports",
          used: 4,
          total: 8,
          icon: Activity,
          color: "bg-cyan-500",
          description: "AI-generated health reports"
        }
      ]

      const mockTransactions: Transaction[] = [
        {
          id: "1",
          type: "PAYMENT",
          amount: 299.99,
          description: "Premium Health Plan - Monthly",
          date: "2024-01-01",
          status: "COMPLETED"
        },
        {
          id: "2",
          type: "ADJUSTMENT",
          amount: -45.00,
          description: "Lab test discount applied",
          date: "2024-01-05",
          status: "COMPLETED"
        },
        {
          id: "3",
          type: "PAYMENT",
          amount: 25.00,
          description: "Specialist consultation copay",
          date: "2024-01-08",
          status: "COMPLETED"
        },
        {
          id: "4",
          type: "REFUND",
          amount: -15.00,
          description: "Cancelled appointment refund",
          date: "2024-01-10",
          status: "COMPLETED"
        }
      ]

      setSubscription(mockSubscription)
      setServiceUsage(mockServiceUsage)
      setTransactions(mockTransactions)
    } catch (error) {
      console.error('Error fetching subscription data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUsagePercentage = (used: number, total: number) => {
    return total > 0 ? Math.round((used / total) * 100) : 0
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-green-600"
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "PAYMENT": return <ArrowRight className="h-4 w-4" />
      case "REFUND": return <RefreshCw className="h-4 w-4" />
      case "ADJUSTMENT": return <Info className="h-4 w-4" />
      default: return <CreditCard className="h-4 w-4" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "PAYMENT": return "text-red-600"
      case "REFUND": return "text-green-600"
      case "ADJUSTMENT": return "text-blue-600"
      default: return "text-gray-600"
    }
  }

  const daysRemaining = subscription ? 
    Math.ceil((new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0

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
          <h1 className="text-3xl font-bold text-gray-900">My Subscription</h1>
          <p className="text-gray-600 mt-2">Manage your healthcare plan and track usage</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            onClick={() => router.push('/dashboard/patient/health-card')}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Health Card
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            Upgrade Plan
          </Button>
        </div>
      </div>

      {/* Subscription Overview */}
      {subscription && (
        <Card className="border-emerald-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <Star className="mr-2 h-5 w-5 text-emerald-600" />
                  {subscription.name}
                </CardTitle>
                <CardDescription className="mt-2">{subscription.description}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-emerald-600">
                  ${subscription.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  per {subscription.durationUnit.toLowerCase()}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className="bg-emerald-100 text-emerald-800">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="text-sm font-medium">{subscription.duration} {subscription.durationUnit.toLowerCase()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Days Remaining</span>
                  <span className={`text-sm font-medium ${daysRemaining < 7 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {daysRemaining} days
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Max Consultations</span>
                  <span className="text-sm font-medium">{subscription.maxConsultations || 'Unlimited'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Family Members</span>
                  <span className="text-sm font-medium">{subscription.maxFamilyMembers || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Discount</span>
                  <span className="text-sm font-medium">{subscription.discountPercentage || 0}%</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600">Valid Period</span>
                  <div className="text-sm font-medium mt-1">
                    {new Date(subscription.startDate).toLocaleDateString()} - {new Date(subscription.endDate).toLocaleDateString()}
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

      {/* Service Usage */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="mr-2 h-5 w-5 text-blue-600" />
            Service Usage
          </CardTitle>
          <CardDescription>Track your utilization of subscription benefits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {serviceUsage.map((service) => {
              const percentage = getUsagePercentage(service.used, service.total)
              const Icon = service.icon
              
              return (
                <Card key={service.type} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 ${service.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{service.type}</h3>
                        <p className="text-xs text-gray-600">{service.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Usage</span>
                        <span className={`font-medium ${getUsageColor(percentage)}`}>
                          {service.used}/{service.total}
                        </span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2"
                      />
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{percentage}% used</span>
                        <span>{service.total - service.used} remaining</span>
                      </div>
                    </div>

                    {percentage >= 80 && (
                      <div className="flex items-center space-x-2 mt-3 p-2 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-xs text-yellow-800">Running low on this service</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="features" className="space-y-4">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="features" className="data-[state=active]:bg-white">
            <CheckCircle className="mr-2 h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-white">
            <CreditCard className="mr-2 h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="benefits" className="data-[state=active]:bg-white">
            <Star className="mr-2 h-4 w-4" />
            Benefits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Subscription Features</CardTitle>
              <CardDescription>All the benefits included in your current plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {subscription?.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-gray-900">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Transaction History</CardTitle>
              <CardDescription>Your recent payment and adjustment history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'PAYMENT' ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <Badge 
                        variant={transaction.status === 'COMPLETED' ? 'default' : 'secondary'}
                        className={transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Additional Benefits</CardTitle>
              <CardDescription>Exclusive benefits and discounts available with your plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Video className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Priority Video Consultations</h3>
                    <p className="text-sm text-gray-600">Skip the queue with priority access</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <Phone className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">24/7 Phone Support</h3>
                    <p className="text-sm text-gray-600">Round-the-clock medical assistance</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                  <MapPin className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Home Visit Options</h3>
                    <p className="text-sm text-gray-600">Doctor visits at your convenience</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
                  <Heart className="h-8 w-8 text-orange-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Health Monitoring</h3>
                    <p className="text-sm text-gray-600">Continuous health tracking</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}