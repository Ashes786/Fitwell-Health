'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  DollarSign, 
  TrendingUp,
  Network,
  MapPin,
  Calendar,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface NetworkData {
  id: string
  name: string
  admin: string
  location: string
  totalUsers: number
  totalDoctors: number
  totalPatients: number
  totalRevenue: number
  monthlyGrowth: number
  consultations: number
  status: 'active' | 'inactive' | 'warning'
  lastActive: string
}

export default function SuperAdminNetworks() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [networks, setNetworks] = useState<NetworkData[]>([])
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkData | null>(null)
  const [revenueData, setRevenueData] = useState([])
  const [consultationData, setConsultationData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user?.role !== 'SUPER_ADMIN') {
      router.push('/dashboard')
      return
    }

    fetchNetworksData()
  }, [session, status, router])

  const fetchNetworksData = async () => {
    try {
      setIsLoading(true)
      
      // Mock data for demonstration
      const mockNetworks: NetworkData[] = [
        {
          id: '1',
          name: 'New York Metropolitan Network',
          admin: 'John Smith',
          location: 'New York, NY',
          totalUsers: 3250,
          totalDoctors: 85,
          totalPatients: 2850,
          totalRevenue: 850000,
          monthlyGrowth: 12.5,
          consultations: 1250,
          status: 'active',
          lastActive: '2 hours ago'
        },
        {
          id: '2',
          name: 'Los Angeles Healthcare Network',
          admin: 'Sarah Johnson',
          location: 'Los Angeles, CA',
          totalUsers: 2800,
          totalDoctors: 72,
          totalPatients: 2450,
          totalRevenue: 720000,
          monthlyGrowth: 8.3,
          consultations: 980,
          status: 'active',
          lastActive: '1 hour ago'
        },
        {
          id: '3',
          name: 'Chicago Medical Network',
          admin: 'Michael Brown',
          location: 'Chicago, IL',
          totalUsers: 1950,
          totalDoctors: 48,
          totalPatients: 1680,
          totalRevenue: 485000,
          monthlyGrowth: -2.1,
          consultations: 650,
          status: 'warning',
          lastActive: '5 hours ago'
        },
        {
          id: '4',
          name: 'Texas Health Network',
          admin: 'Emily Davis',
          location: 'Houston, TX',
          totalUsers: 2200,
          totalDoctors: 55,
          totalPatients: 1920,
          totalRevenue: 580000,
          monthlyGrowth: 15.8,
          consultations: 820,
          status: 'active',
          lastActive: '30 minutes ago'
        }
      ]
      
      const mockRevenueData = [
        { month: 'Jan', revenue: 1200000 },
        { month: 'Feb', revenue: 1350000 },
        { month: 'Mar', revenue: 1280000 },
        { month: 'Apr', revenue: 1450000 },
        { month: 'May', revenue: 1580000 },
        { month: 'Jun', revenue: 1650000 }
      ]
      
      const mockConsultationData = [
        { name: 'NY Network', consultations: 1250, color: '#2ba664' },
        { name: 'LA Network', consultations: 980, color: '#3b82f6' },
        { name: 'Chicago Network', consultations: 650, color: '#f59e0b' },
        { name: 'Texas Network', consultations: 820, color: '#ef4444' }
      ]

      setNetworks(mockNetworks)
      setSelectedNetwork(mockNetworks[0])
      setRevenueData(mockRevenueData)
      setConsultationData(mockConsultationData)
    } catch (error) {
      console.error('Error fetching networks data:', error)
      toast({
        title: "Error",
        description: 'Failed to load networks data'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredNetworks = networks.filter(network =>
    network.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    network.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    network.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading networks data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Network Overview</h1>
          <p className="text-gray-600 mt-2">Monitor and analyze all healthcare networks</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search networks..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-health-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Networks</p>
                <p className="text-2xl font-bold text-gray-900">{networks.length}</p>
                <p className="text-sm text-green-600 mt-1">+2 this month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Network className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(networks.reduce((sum, net) => sum + net.totalUsers, 0))}</p>
                <p className="text-sm text-green-600 mt-1">+8.5% growth</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(networks.reduce((sum, net) => sum + net.totalRevenue, 0))}</p>
                <p className="text-sm text-green-600 mt-1">+12.3% growth</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Consultations</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(networks.reduce((sum, net) => sum + net.consultations, 0))}</p>
                <p className="text-sm text-green-600 mt-1">+15.2% growth</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Networks List */}
        <div className="lg:col-span-2">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Network className="h-5 w-5" />
                <span>Healthcare Networks</span>
              </CardTitle>
              <CardDescription>Overview of all active healthcare networks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNetworks.map((network) => (
                  <div
                    key={network.id}
                    className={`p-4 border border-gray-200 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedNetwork?.id === network.id ? 'ring-2 ring-health-primary' : ''
                    }`}
                    onClick={() => setSelectedNetwork(network)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-gray-900">{network.name}</h3>
                          <Badge className={getStatusColor(network.status)}>
                            {network.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{network.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{network.admin}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{network.lastActive}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          {network.monthlyGrowth >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`text-sm font-medium ${network.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {network.monthlyGrowth >= 0 ? '+' : ''}{network.monthlyGrowth}%
                          </span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(network.totalRevenue)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Network Details */}
        <div className="space-y-6">
          {selectedNetwork && (
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle>Network Details</CardTitle>
                <CardDescription>{selectedNetwork.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Users</span>
                    <span className="font-semibold">{formatNumber(selectedNetwork.totalUsers)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Doctors</span>
                    <span className="font-semibold">{formatNumber(selectedNetwork.totalDoctors)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Patients</span>
                    <span className="font-semibold">{formatNumber(selectedNetwork.totalPatients)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Consultations</span>
                    <span className="font-semibold">{formatNumber(selectedNetwork.consultations)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="font-semibold">{formatCurrency(selectedNetwork.totalRevenue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Monthly Growth</span>
                    <span className={`font-semibold ${selectedNetwork.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedNetwork.monthlyGrowth >= 0 ? '+' : ''}{selectedNetwork.monthlyGrowth}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Consultation Distribution */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle>Consultation Distribution</CardTitle>
              <CardDescription>Consultations by network</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={consultationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="consultations"
                    label={({ name, consultations }) => `${name}: ${consultations}`}
                  >
                    {consultationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue across all networks</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Line type="monotone" dataKey="revenue" stroke="#2ba664" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}