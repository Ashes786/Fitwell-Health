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
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  DollarSign,
  Calendar,
  Users,
  CreditCard,
  Filter,
  Eye,
  Mail,
  Phone,
  MapPin,
  Star
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserRole } from "@prisma/client"

interface SubscriptionRequest {
  id: string
  admin: {
    user: {
      name: string
      email: string
      phone?: string
    }
    networkName: string
  }
  planName: string
  description: string
  features: string[]
  price: number
  duration: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  createdAt: string
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
  notes?: string
}

export default function SubscriptionRequestsPage() {
  const { isUnauthorized, isLoading, session } = useRoleAuthorization({
    requiredRole: "SUPER_ADMIN",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: false
  })
  
  const router = useRouter()
  const [requests, setRequests] = useState<SubscriptionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'>('all')
  const [selectedRequest, setSelectedRequest] = useState<SubscriptionRequest | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    if (isLoading) return

    if (!session) {
      return
    }

    fetchRequests()
  }, [session, isLoading])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/super-admin/subscription-requests')
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      } else {
        toast.error('Failed to fetch subscription requests')
      }
    } catch (error) {
      console.error('Error fetching subscription requests:', error)
      toast.error('Failed to fetch subscription requests')
    } finally {
      setLoading(false)
    }
  }

  const pendingCount = requests.filter(r => r.status === 'PENDING').length
  const approvedCount = requests.filter(r => r.status === 'APPROVED').length
  const rejectedCount = requests.filter(r => r.status === 'REJECTED').length

  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchTerm === '' || 
      request.admin.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.admin.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.admin.networkName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.planName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'APPROVED':
        return <Badge variant="default" className="bg-green-500">Approved</Badge>
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>
      case 'CANCELLED':
        return <Badge variant="outline">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleRequestAction = async (requestId: string, action: 'approve' | 'reject', reason?: string) => {
    setProcessingId(requestId)
    try {
      const response = await fetch(`/api/super-admin/subscription-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, reason }),
      })

      if (response.ok) {
        toast.success(`Subscription request ${action}d successfully`)
        fetchRequests()
        setRejectionReason('')
      } else {
        toast.error(`Failed to ${action} subscription request`)
      }
    } catch (error) {
      console.error('Error handling subscription request:', error)
      toast.error('An error occurred while processing the request')
    } finally {
      setProcessingId(null)
    }
  }

  // Show unauthorized message if user doesn't have SUPER_ADMIN role
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

  // Show loading state
  if (loading) {
    return (
      
        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => router.back()} className="mr-4">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Subscription Requests</h1>
                <p className="text-gray-600 mt-1">Manage admin subscription and feature requests</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-6 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      
    )
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Subscription Requests</h1>
              <p className="text-gray-600 mt-1">Manage admin subscription and feature requests</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white border border-gray-200 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search requests by name, email, network, or plan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <Badge variant="outline">
                {filteredRequests.length} of {requests.length} requests
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Subscription Requests</CardTitle>
            <CardDescription>List of all admin subscription requests</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredRequests.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>Plan Details</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {request.admin.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{request.admin.user.name}</p>
                            <p className="text-sm text-gray-500">{request.admin.user.email}</p>
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                              <MapPin className="h-3 w-3" />
                              <span>{request.admin.networkName}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{request.planName}</p>
                          <p className="text-sm text-gray-500">{request.duration} days</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Array.isArray(request.features) && request.features.slice(0, 2).map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {Array.isArray(request.features) && request.features.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{request.features.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">${request.price}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(request.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {request.status === 'PENDING' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRequestAction(request.id, 'approve')}
                                disabled={processingId === request.id}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={processingId === request.id}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Reject Subscription Request</DialogTitle>
                                    <DialogDescription>
                                      Please provide a reason for rejecting this subscription request.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="reason">Rejection Reason</Label>
                                      <Textarea
                                        id="reason"
                                        placeholder="Enter the reason for rejection..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setRejectionReason('')}>
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleRequestAction(request.id, 'reject', rejectionReason)}
                                      disabled={!rejectionReason.trim() || processingId === request.id}
                                    >
                                      Reject Request
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No subscription requests found</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No requests match your search criteria.' 
                    : 'No subscription requests available.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Request Details Dialog */}
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Subscription Request Details</DialogTitle>
              <DialogDescription>
                Complete information about this subscription request
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-6">
                {/* Admin Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Admin Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {selectedRequest.admin.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{selectedRequest.admin.user.name}</p>
                        <p className="text-sm text-gray-500">{selectedRequest.admin.user.email}</p>
                        {selectedRequest.admin.user.phone && (
                          <p className="text-sm text-gray-500">{selectedRequest.admin.user.phone}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedRequest.admin.networkName}</span>
                    </div>
                  </div>
                </div>

                {/* Plan Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Plan Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Plan Name</span>
                      <span className="text-sm font-medium text-gray-900">{selectedRequest.planName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Duration</span>
                      <span className="text-sm font-medium text-gray-900">{selectedRequest.duration} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Price</span>
                      <span className="text-sm font-medium text-gray-900">${selectedRequest.price}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Features</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Array.isArray(selectedRequest.features) && selectedRequest.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedRequest.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Description</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                      {selectedRequest.description}
                    </p>
                  </div>
                )}

                {/* Status Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Status Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Current Status</span>
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Submitted</span>
                      <span className="text-sm text-gray-900">
                        {format(new Date(selectedRequest.createdAt), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                    {selectedRequest.approvedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Approved</span>
                        <span className="text-sm text-gray-900">
                          {format(new Date(selectedRequest.approvedAt), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                    )}
                    {selectedRequest.rejectedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Rejected</span>
                        <span className="text-sm text-gray-900">
                          {format(new Date(selectedRequest.rejectedAt), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                    )}
                    {selectedRequest.rejectionReason && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Rejection Reason</span>
                        <p className="text-sm text-red-600 mt-1">{selectedRequest.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {selectedRequest.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                      {selectedRequest.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    
  )
}