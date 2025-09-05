'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Star,
  MapPin,
  Phone,
  Download,
  Share,
  Plus,
  Filter,
  Activity,
  Building,
  FlaskConical,
  Pill,
  Heart,
  User,
  ArrowRight,
  Eye,
  Bell,
  RefreshCw,
  Shield,
  Zap,
  Award,
  Gift,
  Percent,
  QrCode,
  Copy
} from "lucide-react"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { UserRole } from "@prisma/client"

interface HealthCard {
  id: string
  cardNumber: string
  issuedAt: string
  expiresAt: string
  discountTier: string
  isActive: boolean
  balance: number
  monthlySpending: number
  yearlySpending: number
  points: number
  tier: 'BASIC' | 'SILVER' | 'GOLD' | 'PLATINUM'
}

interface Discount {
  id: string
  partnerType: string
  partnerName: string
  discount: number
  description: string
  category: string
  isUnlimited: boolean
  usageLimit?: number
  usedCount: number
  validUntil?: string
  location: string
  distance: number
}

interface Transaction {
  id: string
  type: 'PURCHASE' | 'REFUND' | 'REWARD' | 'FEE'
  amount: number
  description: string
  date: string
  merchant: string
  category: string
  status: 'COMPLETED' | 'PENDING' | 'FAILED'
  pointsEarned?: number
}

interface Reward {
  id: string
  title: string
  description: string
  pointsRequired: number
  category: string
  isAvailable: boolean
  validUntil?: string
  image?: string
}

export default function PatientHealthCard() {
  const { isAuthorized, isUnauthorized, isLoading } = useRoleAuthorization({
    requiredRole: UserRole.PATIENT,
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()
  const [healthCard, setHealthCard] = useState<HealthCard | null>(null)
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthorized) {
      fetchHealthCardData()
    }
  }, [isAuthorized])

  const fetchHealthCardData = async () => {
    setLoading(true)
    try {
      // Mock health card data
      const mockHealthCard: HealthCard = {
        id: "1",
        cardNumber: "**** **** **** 1234",
        issuedAt: "2024-01-01",
        expiresAt: "2025-01-01",
        discountTier: "PREMIUM",
        isActive: true,
        balance: 250.00,
        monthlySpending: 450.00,
        yearlySpending: 3200.00,
        points: 1250,
        tier: "GOLD"
      }

      const mockDiscounts: Discount[] = [
        {
          id: "1",
          partnerType: "LAB",
          partnerName: "City Lab Services",
          discount: 15,
          description: "15% off all lab tests and diagnostic services",
          category: "Diagnostics",
          isUnlimited: true,
          usedCount: 3,
          location: "Downtown",
          distance: 1.2
        },
        {
          id: "2",
          partnerType: "PHARMACY",
          partnerName: "MedPlus Pharmacy",
          discount: 20,
          description: "20% off prescription medications and over-the-counter drugs",
          category: "Pharmacy",
          isUnlimited: false,
          usageLimit: 10,
          usedCount: 4,
          validUntil: "2024-12-31",
          location: "Midtown",
          distance: 2.5
        },
        {
          id: "3",
          partnerType: "HOSPITAL",
          partnerName: "General Hospital",
          discount: 10,
          description: "10% off hospital services and treatments",
          category: "Hospital",
          isUnlimited: true,
          usedCount: 1,
          location: "Medical District",
          distance: 3.8
        },
        {
          id: "4",
          partnerType: "PHARMACY",
          partnerName: "QuickCare Pharmacy",
          discount: 25,
          description: "25% off first purchase, 15% on subsequent purchases",
          category: "Pharmacy",
          isUnlimited: false,
          usageLimit: 5,
          usedCount: 2,
          validUntil: "2024-06-30",
          location: "Uptown",
          distance: 4.2
        }
      ]

      const mockTransactions: Transaction[] = [
        {
          id: "1",
          type: "PURCHASE",
          amount: -45.00,
          description: "Lab Test - Complete Blood Count",
          date: "2024-01-10",
          merchant: "City Lab Services",
          category: "Diagnostics",
          status: "COMPLETED",
          pointsEarned: 45
        },
        {
          id: "2",
          type: "PURCHASE",
          amount: -25.00,
          description: "Prescription - Vitamin D3",
          date: "2024-01-08",
          merchant: "MedPlus Pharmacy",
          category: "Pharmacy",
          status: "COMPLETED",
          pointsEarned: 25
        },
        {
          id: "3",
          type: "REWARD",
          amount: 10.00,
          description: "Monthly Reward Bonus",
          date: "2024-01-01",
          merchant: "HealthPay Rewards",
          category: "Rewards",
          status: "COMPLETED"
        },
        {
          id: "4",
          type: "PURCHASE",
          amount: -80.00,
          description: "Specialist Consultation",
          date: "2023-12-28",
          merchant: "Dr. Sarah Johnson",
          category: "Consultation",
          status: "COMPLETED",
          pointsEarned: 80
        }
      ]

      const mockRewards: Reward[] = [
        {
          id: "1",
          title: "Free Health Checkup",
          description: "Comprehensive annual health checkup worth $200",
          pointsRequired: 1000,
          category: "Health Services",
          isAvailable: true
        },
        {
          id: "2",
          title: "Pharmacy Credit",
          description: "$50 credit at any partner pharmacy",
          pointsRequired: 500,
          category: "Pharmacy",
          isAvailable: true
        },
        {
          id: "3",
          title: "Fitness Tracker",
          description: "Premium fitness tracking device",
          pointsRequired: 2000,
          category: "Wellness",
          isAvailable: true,
          validUntil: "2024-12-31"
        },
        {
          id: "4",
          title: "Telemedicine Session",
          description: "Free video consultation with specialist",
          pointsRequired: 750,
          category: "Telemedicine",
          isAvailable: false,
          validUntil: "2024-03-31"
        }
      ]

      setHealthCard(mockHealthCard)
      setDiscounts(mockDiscounts)
      setTransactions(mockTransactions)
      setRewards(mockRewards)
    } catch (error) {
      console.error('Error fetching health card data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "BASIC": return "bg-gray-100 text-gray-800"
      case "SILVER": return "bg-gray-200 text-gray-800"
      case "GOLD": return "bg-yellow-100 text-yellow-800"
      case "PLATINUM": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "BASIC": return Star
      case "SILVER": return Star
      case "GOLD": return Award
      case "PLATINUM": return Shield
      default: return Star
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "PURCHASE": return "text-red-600"
      case "REFUND": return "text-green-600"
      case "REWARD": return "text-blue-600"
      case "FEE": return "text-orange-600"
      default: return "text-gray-600"
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "PURCHASE": return CreditCard
      case "REFUND": return RefreshCw
      case "REWARD": return Gift
      case "FEE": return DollarSign
      default: return CreditCard
    }
  }

  const getDiscountUsage = (used: number, limit?: number) => {
    if (limit) {
      return Math.round((used / limit) * 100)
    }
    return 0
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
          <h1 className="text-3xl font-bold text-gray-900">HealthPay Card</h1>
          <p className="text-gray-600 mt-2">Manage your health benefits and discounts</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            onClick={() => router.push('/dashboard/patient/subscription')}
          >
            <Star className="mr-2 h-4 w-4" />
            View Benefits
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Funds
          </Button>
        </div>
      </div>

      {/* Health Card Overview */}
      {healthCard && (
        <Card className="border-gradient-to-r from-emerald-400 to-blue-500">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">HealthPay Card</h2>
                    <p className="text-emerald-100">Your digital health benefits card</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-white/20 text-white border-white/30">
                      <Shield className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                    <Badge className={getTierColor(healthCard.tier)}>
                      {healthCard.tier} Tier
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-100">Card Number</span>
                    <span className="text-white font-mono">{healthCard.cardNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-100">Balance</span>
                    <span className="text-2xl font-bold text-white">${healthCard.balance.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-100">Points</span>
                    <span className="text-xl font-semibold text-white">{healthCard.points.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <QrCode className="h-4 w-4 mr-2" />
                    Show QR Code
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Number
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-emerald-100 text-sm">Monthly Spending</p>
                    <p className="text-xl font-bold text-white">${healthCard.monthlySpending.toFixed(2)}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-emerald-100 text-sm">Yearly Spending</p>
                    <p className="text-xl font-bold text-white">${healthCard.yearlySpending.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-100">Valid Until</span>
                    <span className="text-white">{new Date(healthCard.expiresAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-100">Discount Tier</span>
                    <span className="text-white">{healthCard.discountTier}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white text-sm">Tap to pay at partner locations</span>
                  </div>
                  <div className="w-12 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Discounts</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{discounts.length}</p>
                <p className="text-xs text-gray-400 mt-2">Partner benefits</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Percent className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Monthly Savings</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">$127.50</p>
                <p className="text-xs text-gray-400 mt-2">This month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Available Rewards</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{rewards.filter(r => r.isAvailable).length}</p>
                <p className="text-xs text-gray-400 mt-2">Redeem now</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Gift className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Points to Next Tier</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">750</p>
                <p className="text-xs text-gray-400 mt-2">Platinum tier</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="discounts" className="space-y-4">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="discounts" className="data-[state=active]:bg-white">
            <Percent className="mr-2 h-4 w-4" />
            Discounts
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-white">
            <CreditCard className="mr-2 h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="rewards" className="data-[state=active]:bg-white">
            <Gift className="mr-2 h-4 w-4" />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="partners" className="data-[state=active]:bg-white">
            <Building className="mr-2 h-4 w-4" />
            Partners
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discounts" className="space-y-4">
          <div className="grid gap-4">
            {discounts.map((discount) => (
              <Card key={discount.id} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Percent className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{discount.partnerName}</h3>
                        <p className="text-sm text-gray-600">{discount.category} • {discount.distance} km</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">
                        {discount.discount}% OFF
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800">
                        {discount.partnerType}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4">{discount.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{discount.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Usage</p>
                      <div className="flex items-center space-x-2">
                        {discount.usageLimit ? (
                          <>
                            <Progress 
                              value={getDiscountUsage(discount.usedCount, discount.usageLimit)} 
                              className="flex-1 h-2"
                            />
                            <span className="text-sm font-medium">
                              {discount.usedCount}/{discount.usageLimit}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-medium">Unlimited</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {discount.validUntil && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Valid until {new Date(discount.validUntil).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push('/dashboard/patient/book-appointment')}
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          Directions
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push('/dashboard/patient/book-appointment')}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                Transaction History
              </CardTitle>
              <CardDescription>Your recent card transactions and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => {
                  const Icon = getTransactionIcon(transaction.type)
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                          <p className="text-sm text-gray-600">{transaction.merchant} • {transaction.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${getTransactionColor(transaction.type)}`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                        {transaction.pointsEarned && (
                          <p className="text-xs text-green-600">
                            +{transaction.pointsEarned} points
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rewards.map((reward) => (
              <Card key={reward.id} className="border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Gift className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-medium text-gray-900">{reward.title}</CardTitle>
                        <CardDescription>{reward.category}</CardDescription>
                      </div>
                    </div>
                    <Badge className={reward.isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {reward.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">{reward.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Points Required</span>
                      <span className="font-medium">{reward.pointsRequired.toLocaleString()}</span>
                    </div>

                    {reward.validUntil && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Valid until {new Date(reward.validUntil).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className="pt-2">
                      <Button 
                        className={`w-full ${reward.isAvailable ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'}`}
                        disabled={!reward.isAvailable}
                        onClick={() => router.push('/dashboard/patient/book-appointment')}
                      >
                        {reward.isAvailable ? 'Redeem Reward' : 'Not Available'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="partners" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {discounts.map((discount) => (
              <Card key={discount.id} className="border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-medium text-gray-900">{discount.partnerName}</CardTitle>
                        <CardDescription>{discount.partnerType}</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {discount.discount}% OFF
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{discount.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Distance:</span>
                        <span className="font-medium">{discount.distance} km</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{discount.category}</span>
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <Button 
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => router.push('/dashboard/patient/book-appointment')}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Get Directions
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => router.push('/dashboard/patient/book-appointment')}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Contact Partner
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}