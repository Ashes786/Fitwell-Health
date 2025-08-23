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
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Heart,
  Star,
  MapPin,
  Phone,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Gift,
  Percent,
  ArrowRight,
  Eye,
  Download,
  Share,
  Filter,
  Search,
  Building,
  Stethoscope,
  FlaskConical,
  Pill,
  Activity,
  User,
  Award,
  DollarSign
} from "lucide-react"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { UserRole } from "@prisma/client"

interface CartItem {
  id: string
  name: string
  type: 'SERVICE' | 'PRODUCT' | 'APPOINTMENT' | 'PACKAGE'
  category: string
  description: string
  price: number
  discount?: number
  quantity: number
  provider: string
  location: string
  image?: string
  isAvailable: boolean
  estimatedDelivery?: string
  scheduledDate?: string
  duration?: string
  requirements?: string[]
}

interface CartSummary {
  subtotal: number
  discount: number
  tax: number
  total: number
  items: number
  savings: number
  healthPayDiscount: number
  pointsEarned: number
}

interface SavedItem {
  id: string
  name: string
  type: 'SERVICE' | 'PRODUCT' | 'APPOINTMENT' | 'PACKAGE'
  category: string
  price: number
  discount?: number
  provider: string
  savedDate: string
}

interface RecommendedItem {
  id: string
  name: string
  type: 'SERVICE' | 'PRODUCT' | 'APPOINTMENT' | 'PACKAGE'
  category: string
  description: string
  price: number
  discount?: number
  rating: number
  popularity: number
  provider: string
  reason: string
  isRecommended: boolean
}

export default function PatientCart() {
  const { isAuthorized, isUnauthorized, isLoading } = useRoleAuthorization({
    requiredRole: UserRole.PATIENT,
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [recommendedItems, setRecommendedItems] = useState<RecommendedItem[]>([])
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthorized) {
      fetchCartData()
    }
  }, [isAuthorized])

  const fetchCartData = async () => {
    setLoading(true)
    try {
      // Mock cart items data
      const mockCartItems: CartItem[] = [
        {
          id: "1",
          name: "Complete Blood Count (CBC)",
          type: "SERVICE",
          category: "Laboratory Test",
          description: "Comprehensive blood analysis including red and white blood cells, hemoglobin, and platelets",
          price: 45,
          discount: 15,
          quantity: 1,
          provider: "City Lab Services",
          location: "Downtown",
          isAvailable: true,
          estimatedDelivery: "2-3 business days",
          requirements: ["Fasting required for 8 hours"]
        },
        {
          id: "2",
          name: "Vitamin D3 Supplements",
          type: "PRODUCT",
          category: "Supplements",
          description: "High-quality Vitamin D3 supplements for immune support and bone health",
          price: 25,
          discount: 10,
          quantity: 2,
          provider: "MedPlus Pharmacy",
          location: "Midtown",
          isAvailable: true,
          estimatedDelivery: "1-2 business days"
        },
        {
          id: "3",
          name: "Cardiology Consultation",
          type: "APPOINTMENT",
          category: "Specialist Visit",
          description: "Comprehensive heart health consultation with Dr. Sarah Johnson",
          price: 150,
          discount: 20,
          quantity: 1,
          provider: "Dr. Sarah Johnson",
          location: "Heart Care Specialists",
          isAvailable: true,
          scheduledDate: "2024-01-20",
          duration: "30 minutes",
          requirements: ["Previous test reports", "Insurance information"]
        },
        {
          id: "4",
          name: "Annual Health Checkup Package",
          type: "PACKAGE",
          category: "Health Package",
          description: "Complete annual health assessment including physical examination and basic lab tests",
          price: 200,
          discount: 25,
          quantity: 1,
          provider: "City General Hospital",
          location: "Downtown",
          isAvailable: true,
          requirements: ["Fasting required", "Bring previous medical records"]
        }
      ]

      const mockSavedItems: SavedItem[] = [
        {
          id: "5",
          name: "Thyroid Function Test",
          type: "SERVICE",
          category: "Laboratory Test",
          price: 35,
          discount: 10,
          provider: "Metro Lab",
          savedDate: "2024-01-10"
        },
        {
          id: "6",
          name: "Blood Pressure Monitor",
          type: "PRODUCT",
          category: "Medical Device",
          price: 80,
          discount: 15,
          provider: "HealthCare Supplies",
          savedDate: "2024-01-08"
        }
      ]

      const mockRecommendedItems: RecommendedItem[] = [
        {
          id: "7",
          name: "Lipid Panel",
          type: "SERVICE",
          category: "Laboratory Test",
          description: "Cholesterol and triglyceride levels assessment",
          price: 65,
          discount: 15,
          rating: 4.7,
          popularity: 85,
          provider: "City Lab Services",
          reason: "Recommended based on your age and health profile",
          isRecommended: true
        },
        {
          id: "8",
          name: "Nutrition Consultation",
          type: "SERVICE",
          category: "Specialist Service",
          description: "Personalized nutrition assessment and dietary planning",
          price: 80,
          rating: 4.6,
          popularity: 73,
          provider: "Wellness Center",
          reason: "Popular service in your area",
          isRecommended: false
        },
        {
          id: "9",
          name: "First Aid Kit",
          type: "PRODUCT",
          category: "Medical Supplies",
          description: "Comprehensive first aid kit for home and travel",
          price: 30,
          discount: 20,
          rating: 4.5,
          popularity: 90,
          provider: "HealthCare Supplies",
          reason: "Essential for every household",
          isRecommended: true
        }
      ]

      // Calculate cart summary
      const subtotal = mockCartItems.reduce((sum, item) => {
        const itemPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price
        return sum + (itemPrice * item.quantity)
      }, 0)

      const totalDiscount = mockCartItems.reduce((sum, item) => {
        if (item.discount) {
          return sum + (item.price * item.discount / 100 * item.quantity)
        }
        return sum
      }, 0)

      const healthPayDiscount = subtotal * 0.05 // 5% HealthPay discount
      const tax = (subtotal - totalDiscount) * 0.08 // 8% tax
      const total = subtotal - totalDiscount - healthPayDiscount + tax
      const pointsEarned = Math.floor(total / 10) // 1 point per $10 spent

      const mockCartSummary: CartSummary = {
        subtotal,
        discount: totalDiscount,
        tax,
        total,
        items: mockCartItems.length,
        savings: totalDiscount + healthPayDiscount,
        healthPayDiscount,
        pointsEarned
      }

      setCartItems(mockCartItems)
      setSavedItems(mockSavedItems)
      setRecommendedItems(mockRecommendedItems)
      setCartSummary(mockCartSummary)
    } catch (error) {
      console.error('Error fetching cart data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ))
  }

  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  const moveToSaved = (itemId: string) => {
    const item = cartItems.find(item => item.id === itemId)
    if (item) {
      const savedItem: SavedItem = {
        id: item.id,
        name: item.name,
        type: item.type,
        category: item.category,
        price: item.price,
        discount: item.discount,
        provider: item.provider,
        savedDate: new Date().toISOString()
      }
      setSavedItems(prev => [...prev, savedItem])
      removeItem(itemId)
    }
  }

  const moveToCart = (itemId: string) => {
    const savedItem = savedItems.find(item => item.id === itemId)
    if (savedItem) {
      const cartItem: CartItem = {
        id: savedItem.id,
        name: savedItem.name,
        type: savedItem.type,
        category: savedItem.category,
        description: "",
        price: savedItem.price,
        discount: savedItem.discount,
        quantity: 1,
        provider: savedItem.provider,
        location: "",
        isAvailable: true
      }
      setCartItems(prev => [...prev, cartItem])
      setSavedItems(prev => prev.filter(item => item.id !== itemId))
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SERVICE": return Stethoscope
      case "PRODUCT": return Pill
      case "APPOINTMENT": return Calendar
      case "PACKAGE": return Gift
      default: return ShoppingCart
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "SERVICE": return "bg-blue-100 text-blue-800"
      case "PRODUCT": return "bg-green-100 text-green-800"
      case "APPOINTMENT": return "bg-purple-100 text-purple-800"
      case "PACKAGE": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">Manage your healthcare services and products</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            onClick={() => router.push('/dashboard/patient/health-card')}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            HealthPay Benefits
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <ArrowRight className="mr-2 h-4 w-4" />
            Checkout
          </Button>
        </div>
      </div>

      {/* Cart Summary */}
      {cartSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Items</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{cartSummary.items}</p>
                  <p className="text-xs text-gray-400 mt-2">In cart</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">${cartSummary.subtotal.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-2">Before discounts</p>
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
                  <p className="text-sm text-gray-500">Savings</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">${cartSummary.savings.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-2">Total saved</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Percent className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Points Earned</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{cartSummary.pointsEarned}</p>
                  <p className="text-xs text-gray-400 mt-2">With this purchase</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="cart" className="space-y-4">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="cart" className="data-[state=active]:bg-white">
                Shopping Cart ({cartItems.length})
              </TabsTrigger>
              <TabsTrigger value="saved" className="data-[state=active]:bg-white">
                Saved for Later ({savedItems.length})
              </TabsTrigger>
              <TabsTrigger value="recommended" className="data-[state=active]:bg-white">
                Recommended ({recommendedItems.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cart" className="space-y-4">
              {cartItems.length === 0 ? (
                <Card className="border-gray-200">
                  <CardContent className="p-12 text-center">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-600 mb-4">Add healthcare services or products to get started</p>
                    <Button 
                      onClick={() => router.push('/dashboard/patient/directory')}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Browse Healthcare Directory
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const TypeIcon = getTypeIcon(item.type)
                    const discountedPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price
                    const totalPrice = discountedPrice * item.quantity
                    
                    return (
                      <Card key={item.id} className="border-gray-200">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Item Info */}
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-10 h-10 ${getTypeColor(item.type).split(' ')[0]} rounded-lg flex items-center justify-center`}>
                                    <TypeIcon className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                    <p className="text-sm text-gray-600">{item.category}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge className={getTypeColor(item.type)}>
                                    {item.type}
                                  </Badge>
                                  {item.discount && (
                                    <Badge className="bg-red-100 text-red-800">
                                      {item.discount}% OFF
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <p className="text-sm text-gray-700">{item.description}</p>

                              <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">Provider:</span>
                                  <span className="font-medium">{item.provider}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">Location:</span>
                                  <span className="font-medium">{item.location}</span>
                                </div>
                                {item.scheduledDate && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Scheduled:</span>
                                    <span className="font-medium">{new Date(item.scheduledDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                                {item.estimatedDelivery && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Delivery:</span>
                                    <span className="font-medium">{item.estimatedDelivery}</span>
                                  </div>
                                )}
                              </div>

                              {item.requirements && item.requirements.length > 0 && (
                                <div className="p-3 bg-yellow-50 rounded-lg">
                                  <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    {item.requirements.map((req, index) => (
                                      <li key={index} className="flex items-center space-x-2">
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                        <span>{req}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* Actions and Pricing */}
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">Price:</span>
                                  <div className="text-right">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-lg font-bold text-gray-900">
                                        ${discountedPrice.toFixed(2)}
                                      </span>
                                      {item.discount && (
                                        <span className="text-sm text-gray-500 line-through">
                                          ${item.price.toFixed(2)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">Quantity:</span>
                                  <div className="flex items-center space-x-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      disabled={item.quantity <= 1}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">Total:</span>
                                  <span className="text-lg font-bold text-gray-900">
                                    ${totalPrice.toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => moveToSaved(item.id)}
                                >
                                  <Heart className="h-4 w-4 mr-2" />
                                  Save for Later
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="w-full text-red-600 border-red-300 hover:bg-red-50"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="saved" className="space-y-4">
              {savedItems.length === 0 ? (
                <Card className="border-gray-200">
                  <CardContent className="p-12 text-center">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No saved items</h3>
                    <p className="text-gray-600 mb-4">Save items for later purchase</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {savedItems.map((item) => {
                    const TypeIcon = getTypeIcon(item.type)
                    const discountedPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price
                    
                    return (
                      <Card key={item.id} className="border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 ${getTypeColor(item.type).split(' ')[0]} rounded-lg flex items-center justify-center`}>
                                <TypeIcon className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                <p className="text-sm text-gray-600">{item.category} • {item.provider}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-gray-900">
                                    ${discountedPrice.toFixed(2)}
                                  </span>
                                  {item.discount && (
                                    <span className="text-sm text-gray-500 line-through">
                                      ${item.price.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">
                                  Saved {new Date(item.savedDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => moveToCart(item.id)}
                                >
                                  Move to Cart
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSavedItems(prev => prev.filter(i => i.id !== item.id))}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recommended" className="space-y-4">
              <div className="grid gap-4">
                {recommendedItems.map((item) => {
                  const TypeIcon = getTypeIcon(item.type)
                  const discountedPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price
                  
                  return (
                    <Card key={item.id} className="border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${getTypeColor(item.type).split(' ')[0]} rounded-lg flex items-center justify-center`}>
                              <TypeIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                {item.isRecommended && (
                                  <Badge className="bg-blue-100 text-blue-800">
                                    Recommended
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{item.category} • {item.provider}</p>
                              <p className="text-sm text-gray-700 mt-1">{item.description}</p>
                              {item.isRecommended && (
                                <p className="text-xs text-blue-600 mt-1">{item.reason}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-gray-900">
                                  ${discountedPrice.toFixed(2)}
                                </span>
                                {item.discount && (
                                  <span className="text-sm text-gray-500 line-through">
                                    ${item.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-gray-600">{item.rating}</span>
                              </div>
                            </div>
                            <Button 
                              className="bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => {
                                const cartItem: CartItem = {
                                  id: item.id,
                                  name: item.name,
                                  type: item.type,
                                  category: item.category,
                                  description: item.description,
                                  price: item.price,
                                  discount: item.discount,
                                  quantity: 1,
                                  provider: item.provider,
                                  location: "",
                                  isAvailable: true
                                }
                                setCartItems(prev => [...prev, cartItem])
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="border-gray-200 sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {cartSummary && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${cartSummary.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Item Discounts</span>
                      <span className="font-medium text-green-600">-${cartSummary.discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">HealthPay Discount</span>
                      <span className="font-medium text-green-600">-${cartSummary.healthPayDiscount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${cartSummary.tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-gray-900">${cartSummary.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">
                        You're saving ${cartSummary.savings.toFixed(2)} on this order!
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-800">
                        Earn {cartSummary.pointsEarned} HealthPay points
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => router.push('/dashboard/patient/checkout')}
                    >
                      Proceed to Checkout
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push('/dashboard/patient/health-card')}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Use HealthPay Card
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Secure checkout powered by HealthPay
                    </p>
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