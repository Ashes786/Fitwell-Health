"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CreditCard, 
  Search, 
  Download, 
  Upload,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Plus
} from "lucide-react"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"

interface Payment {
  id: string
  amount: number
  status: string
  paymentMethod: string
  transactionId?: string
  description: string
  createdAt: string
  appointment?: {
    id: string
    appointmentNumber: string
    scheduledAt: string
    doctorName?: string
  }
}

interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  status: string
  dueDate: string
  createdAt: string
  description: string
  items: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
}

export default function PatientBilling() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [payments, setPayments] = useState<Payment[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (session.user?.role !== "PATIENT") {
      router.push("/dashboard")
      return
    }

    fetchBillingData()
  }, [session, status, router])

  const fetchBillingData = async () => {
    try {
      // Mock payments data
      const mockPayments: Payment[] = [
        {
          id: "1",
          amount: 150.00,
          status: "COMPLETED",
          paymentMethod: "CREDIT_CARD",
          transactionId: "TXN_123456789",
          description: "Consultation fee - Dr. John Smith",
          createdAt: "2024-01-15T10:00:00Z",
          appointment: {
            id: "apt1",
            appointmentNumber: "APT-2024-001",
            scheduledAt: "2024-01-15T10:00:00Z",
            doctorName: "Dr. John Smith"
          }
        },
        {
          id: "2",
          amount: 75.00,
          status: "COMPLETED",
          paymentMethod: "HEALTH_CARD",
          description: "Lab test fee - Blood work",
          createdAt: "2024-01-10T14:30:00Z",
          appointment: {
            id: "apt2",
            appointmentNumber: "APT-2024-002",
            scheduledAt: "2024-01-10T14:30:00Z",
            doctorName: "Dr. Sarah Johnson"
          }
        },
        {
          id: "3",
          amount: 200.00,
          status: "PENDING",
          paymentMethod: "INSURANCE",
          description: "Specialist consultation - Cardiologist",
          createdAt: "2024-01-08T09:15:00Z",
          appointment: {
            id: "apt3",
            appointmentNumber: "APT-2024-003",
            scheduledAt: "2024-01-08T09:15:00Z",
            doctorName: "Dr. Michael Brown"
          }
        }
      ]

      // Mock invoices data
      const mockInvoices: Invoice[] = [
        {
          id: "inv1",
          invoiceNumber: "INV-2024-001",
          amount: 325.00,
          status: "PAID",
          dueDate: "2024-01-20T00:00:00Z",
          createdAt: "2024-01-15T10:00:00Z",
          description: "January healthcare services",
          items: [
            {
              description: "General consultation",
              quantity: 1,
              unitPrice: 150.00,
              total: 150.00
            },
            {
              description: "Blood test panel",
              quantity: 1,
              unitPrice: 75.00,
              total: 75.00
            },
            {
              description: "Prescription fee",
              quantity: 1,
              unitPrice: 100.00,
              total: 100.00
            }
          ]
        },
        {
          id: "inv2",
          invoiceNumber: "INV-2024-002",
          amount: 450.00,
          status: "PENDING",
          dueDate: "2024-02-01T00:00:00Z",
          createdAt: "2024-01-20T14:30:00Z",
          description: "Specialist consultation and imaging",
          items: [
            {
              description: "Cardiologist consultation",
              quantity: 1,
              unitPrice: 250.00,
              total: 250.00
            },
            {
              description: "Chest X-ray",
              quantity: 1,
              unitPrice: 200.00,
              total: 200.00
            }
          ]
        }
      ]

      setPayments(mockPayments)
      setInvoices(mockInvoices)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching billing data:', error)
      toast.error('Failed to load billing information')
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "PAID":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "FAILED":
      case "OVERDUE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "PAID":
        return <CheckCircle className="h-4 w-4" />
      case "PENDING":
        return <Clock className="h-4 w-4" />
      case "FAILED":
      case "OVERDUE":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout userRole={UserRole.PATIENT}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
  }

  const totalPaid = payments
    .filter(p => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0)

  const totalPending = payments
    .filter(p => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0)

  const totalInvoicesPaid = invoices
    .filter(i => i.status === "PAID")
    .reduce((sum, i) => sum + i.amount, 0)

  const totalInvoicesPending = invoices
    .filter(i => i.status === "PENDING")
    .reduce((sum, i) => sum + i.amount, 0)

  const PaymentCard = ({ payment }: { payment: Payment }) => (
    <Card className="border-emerald-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{payment.description}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getStatusColor(payment.status)}>
                    {getStatusIcon(payment.status)}
                    <span className="ml-1">{payment.status}</span>
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {payment.appointment && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <Calendar className="h-4 w-4" />
                <span>Appointment: {payment.appointment.appointmentNumber}</span>
                <span>•</span>
                <span>Dr. {payment.appointment.doctorName}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-emerald-600">
                {formatCurrency(payment.amount)}
              </div>
              <div className="text-sm text-gray-500">
                {payment.paymentMethod.replace('_', ' ')}
              </div>
            </div>

            {payment.transactionId && (
              <div className="text-sm text-gray-500 mt-1">
                Transaction ID: {payment.transactionId}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2 ml-4">
            <Button 
              size="sm" 
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <Download className="h-4 w-4 mr-1" />
              Download Receipt
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const InvoiceCard = ({ invoice }: { invoice: Invoice }) => (
    <Card className="border-blue-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{invoice.description}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getStatusColor(invoice.status)}>
                    {getStatusIcon(invoice.status)}
                    <span className="ml-1">{invoice.status}</span>
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {invoice.invoiceNumber}
                  </span>
                  <span className="text-sm text-gray-500">
                    Due: {new Date(invoice.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {invoice.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.description} x {item.quantity}</span>
                  <span>{formatCurrency(item.total)}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t pt-2">
              <div className="text-lg font-semibold text-blue-600">
                {formatCurrency(invoice.amount)}
              </div>
              <div className="text-sm text-gray-500">
                Created: {new Date(invoice.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2 ml-4">
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Invoice
            </Button>
            {invoice.status === "PENDING" && (
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <CreditCard className="h-4 w-4 mr-1" />
                Pay Now
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout userRole={UserRole.PATIENT}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
            <p className="text-gray-600 mt-2">
              Manage your healthcare payments, view invoices, and track expenses
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Receipt
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Make Payment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalPaid)}
              </div>
              <p className="text-xs text-green-600">
                Completed payments
              </p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(totalPending)}
              </div>
              <p className="text-xs text-yellow-600">
                Awaiting payment
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Invoices Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalInvoicesPaid)}
              </div>
              <p className="text-xs text-blue-600">
                Settled invoices
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Invoices Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalInvoicesPending)}
              </div>
              <p className="text-xs text-red-600">
                Payment due
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search payments and invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-emerald-200 focus:border-emerald-500"
          />
        </div>

        {/* Billing Tabs */}
        <Tabs defaultValue="payments" className="space-y-4">
          <TabsList className="bg-emerald-100">
            <TabsTrigger value="payments" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Payments
            </TabsTrigger>
            <TabsTrigger value="invoices" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Invoices
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="space-y-4">
            {payments.length > 0 ? (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <PaymentCard key={payment.id} payment={payment} />
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CreditCard className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No payments found
                  </h3>
                  <p className="text-gray-600 text-center">
                    Your payment history will appear here after appointments.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            {invoices.length > 0 ? (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <InvoiceCard key={invoice.id} invoice={invoice} />
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No invoices found
                  </h3>
                  <p className="text-gray-600 text-center">
                    Your invoices will appear here as services are rendered.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}