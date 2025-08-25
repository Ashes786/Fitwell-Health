'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  CreditCard,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as PieChartComponent, Pie, Cell, Legend } from 'recharts'

interface RevenueData {
  period: string
  revenue: number
  consultations: number
  patients: number
}

interface Transaction {
  id: string
  date: string
  patientName: string
  type: 'consultation' | 'prescription' | 'follow_up' | 'other'
  amount: number
  status: 'completed' | 'pending' | 'failed'
  consultationType: 'video' | 'phone' | 'in_person'
}

interface RevenueSummary {
  totalRevenue: number
  totalConsultations: number
  totalPatients: number
  averageRevenuePerConsultation: number
  monthlyGrowth: number
  pendingPayments: number
  completedPayments: number
  failedPayments: number
}

export default function DoctorRevenue() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [revenueSummary, setRevenueSummary] = useState<RevenueSummary | null>(null)
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [timeRange, setTimeRange] = useState('6months')
  const [consultationTypeData, setConsultationTypeData] = useState([])

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user?.role !== 'DOCTOR') {
      router.push('/dashboard')
      return
    }

    fetchRevenueData()
  }, [session, status, router, timeRange])

  const fetchRevenueData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch real data from API
      const [revenueResponse, transactionsResponse] = await Promise.all([
        fetch('/api/doctor/revenue'),
        fetch('/api/doctor/transactions')
      ])

      if (!revenueResponse.ok) {
        throw new Error('Failed to fetch revenue data')
      }

      const revenueData = await revenueResponse.json()
      
      // Fetch transactions
      const transactions = transactionsResponse.ok ? await transactionsResponse.json() : []
      
      // Generate consultation type distribution from transactions
      const consultationTypeMap = new Map()
      transactions.forEach((transaction: Transaction) => {
        const type = transaction.consultationType
        consultationTypeMap.set(type, (consultationTypeMap.get(type) || 0) + 1)
      })
      
      const totalTransactions = transactions.length
      const consultationTypeData = Array.from(consultationTypeMap.entries()).map(([type, count]) => {
        const percentage = Math.round((count / totalTransactions) * 100)
        let color = '#2ba664'
        let name = type
        
        switch (type) {
          case 'video':
            color = '#2ba664'
            name = 'Video Consultations'
            break
          case 'phone':
            color = '#3b82f6'
            name = 'Phone Consultations'
            break
          case 'in_person':
            color = '#f59e0b'
            name = 'In-Person Visits'
            break
          default:
            color = '#6b7280'
            name = 'Other'
        }
        
        return { name, value: percentage, color }
      })

      setRevenueSummary(revenueData.summary || {})
      setRevenueData(revenueData.revenueTrend || [])
      setTransactions(transactions)
      setConsultationTypeData(consultationTypeData)
    } catch (error) {
      console.error('Error fetching revenue data:', error)
      toast.error('Failed to load revenue data')
      
      // Fallback to empty data
      setRevenueSummary({
        totalRevenue: 0,
        totalConsultations: 0,
        totalPatients: 0,
        averageRevenuePerConsultation: 0,
        monthlyGrowth: 0,
        pendingPayments: 0,
        completedPayments: 0,
        failedPayments: 0
      })
      setRevenueData([])
      setTransactions([])
      setConsultationTypeData([])
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
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'failed':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getConsultationTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '📹'
      case 'phone':
        return '📞'
      case 'in_person':
        return '🏥'
      default:
        return '💼'
    }
  }

  const downloadReport = () => {
    // Generate CSV report
    const csvContent = [
      ['Date', 'Patient', 'Type', 'Consultation Type', 'Amount', 'Status'],
      ...transactions.map(t => [
        t.date,
        t.patientName,
        t.type,
        t.consultationType,
        t.amount.toString(),
        t.status
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `revenue-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success('Revenue report downloaded successfully')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading revenue analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
          <p className="text-gray-600 mt-2">Track your earnings and financial performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={downloadReport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Revenue Summary Cards */}
      {revenueSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueSummary.totalRevenue)}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {revenueSummary.monthlyGrowth >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${revenueSummary.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {revenueSummary.monthlyGrowth >= 0 ? '+' : ''}{revenueSummary.monthlyGrowth}% from last month
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Consultations</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(revenueSummary.totalConsultations)}</p>
                  <p className="text-sm text-gray-600 mt-1">{formatNumber(revenueSummary.totalPatients)} unique patients</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. per Consultation</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueSummary.averageRevenuePerConsultation)}</p>
                  <p className="text-sm text-gray-600 mt-1">Across all consultation types</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueSummary.pendingPayments)}</p>
                  <p className="text-sm text-yellow-600 mt-1">Awaiting processing</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Revenue Trend</span>
            </CardTitle>
            <CardDescription>Monthly revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area type="monotone" dataKey="revenue" stroke="#2ba664" fill="#2ba664" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Consultation Type Distribution */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Consultation Types</span>
            </CardTitle>
            <CardDescription>Revenue distribution by consultation type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChartComponent>
                <Pie
                  data={consultationTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {consultationTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChartComponent>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Consultations vs Revenue Chart */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Consultations vs Revenue</span>
          </CardTitle>
          <CardDescription>Relationship between consultation volume and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="consultations" fill="#3b82f6" name="Consultations" />
              <Bar yAxisId="right" dataKey="revenue" fill="#2ba664" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Recent Transactions</span>
          </CardTitle>
          <CardDescription>Latest payment activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                    {getConsultationTypeIcon(transaction.consultationType)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{transaction.patientName}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600">{transaction.date}</span>
                      <Badge variant="outline" className="text-xs">
                        {transaction.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(transaction.amount)}</p>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(transaction.status)}
                      <span className={`text-xs ${getStatusColor(transaction.status).replace('bg-', 'text-').replace('-100', '-600').replace('-800', '-600')}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No transactions found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Status Summary */}
      {revenueSummary && (
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Payment Status Summary</span>
            </CardTitle>
            <CardDescription>Overview of payment processing status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(revenueSummary.completedPayments)}</p>
                <p className="text-sm text-green-700">Completed Payments</p>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(revenueSummary.pendingPayments)}</p>
                <p className="text-sm text-yellow-700">Pending Payments</p>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(revenueSummary.failedPayments)}</p>
                <p className="text-sm text-red-700">Failed Payments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}