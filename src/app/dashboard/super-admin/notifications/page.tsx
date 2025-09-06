'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Bell, 
  Shield, 
  Key, 
  CreditCard, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Download,
  Trash2,
  CheckCheck,
  Eye,
  Mail,
  Phone,
  Calendar,
  Users,
  Database,
  Server
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NotificationDetailModal } from '@/components/ui/notification-detail-modal'
import { UserRole } from "@prisma/client"

interface SuperAdminNotification {
  id: string
  type: 'PASSWORD_CHANGE' | 'SECURITY_ALERT' | 'SUBSCRIPTION_REQUEST' | 'ADMIN_ACTION' | 'SYSTEM_STATUS' | 'LOGIN_ATTEMPT' | 'BACKUP_COMPLETE' | 'DATABASE_ALERT'
  title: string
  message: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'UNREAD' | 'READ' | 'ARCHIVED'
  targetUser?: string
  targetRole?: string
  ipAddress?: string
  location?: string
  createdAt: string
  readAt?: string
  actionUrl?: string
  metadata?: Record<string, any>
}

export default function SuperAdminNotificationsPage() {
  const { isUnauthorized, isLoading, session } = useRoleAuthorization({
    requiredRole: "SUPER_ADMIN",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: false
  })
  
  const router = useRouter()
  const [notifications, setNotifications] = useState<SuperAdminNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedNotification, setSelectedNotification] = useState<SuperAdminNotification | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (isLoading) return

    if (!session) {
      return
    }

    fetchNotifications()
  }, [session, isLoading])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/super-admin/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      } else {
        toast({
        title: "Error",
        description: 'Failed to fetch notifications'
      })
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast({
        title: "Error",
        description: 'Failed to fetch notifications'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchNotifications()
    setRefreshing(false)
  }

  const unreadCount = notifications.filter(n => n.status === 'UNREAD').length

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.targetUser?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === 'all' || notification.type === typeFilter
    const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter

    return matchesSearch && matchesType && matchesPriority && matchesStatus
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'PASSWORD_CHANGE':
        return <Key className="h-4 w-4 text-blue-600" />
      case 'SECURITY_ALERT':
        return <Shield className="h-4 w-4 text-red-600" />
      case 'SUBSCRIPTION_REQUEST':
        return <CreditCard className="h-4 w-4 text-green-600" />
      case 'ADMIN_ACTION':
        return <Users className="h-4 w-4 text-purple-600" />
      case 'SYSTEM_STATUS':
        return <Server className="h-4 w-4 text-gray-600" />
      case 'LOGIN_ATTEMPT':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'BACKUP_COMPLETE':
        return <Database className="h-4 w-4 text-green-600" />
      case 'DATABASE_ALERT':
        return <Database className="h-4 w-4 text-red-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return <Badge variant="destructive">Critical</Badge>
      case 'HIGH':
        return <Badge variant="destructive" className="bg-orange-500">High</Badge>
      case 'MEDIUM':
        return <Badge variant="secondary">Medium</Badge>
      case 'LOW':
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UNREAD':
        return <Badge variant="default" className="bg-blue-500">Unread</Badge>
      case 'READ':
        return <Badge variant="secondary">Read</Badge>
      case 'ARCHIVED':
        return <Badge variant="outline">Archived</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleViewNotification = (notification: SuperAdminNotification) => {
    setSelectedNotification(notification)
    setIsModalOpen(true)
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/super-admin/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'READ' }),
      })

      if (response.ok) {
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, status: 'READ' as const } : n
        ))
        toast({
        title: "Success",
        description: 'Notification marked as read'
      })
      } else {
        toast({
        title: "Error",
        description: 'Failed to mark notification as read'
      })
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast({
        title: "Error",
        description: 'Failed to mark notification as read'
      })
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/super-admin/notifications/mark-all-read', {
        method: 'POST',
      })

      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, status: 'READ' as const })))
        toast({
        title: "Success",
        description: 'All notifications marked as read'
      })
      } else {
        toast({
        title: "Error",
        description: 'Failed to mark all notifications as read'
      })
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast({
        title: "Error",
        description: 'Failed to mark all notifications as read'
      })
    }
  }

  const archiveNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/super-admin/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'ARCHIVED' }),
      })

      if (response.ok) {
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, status: 'ARCHIVED' as const } : n
        ))
        toast({
        title: "Success",
        description: 'Notification archived'
      })
      } else {
        toast({
        title: "Error",
        description: 'Failed to archive notification'
      })
      }
    } catch (error) {
      console.error('Error archiving notification:', error)
      toast({
        title: "Error",
        description: 'Failed to archive notification'
      })
    }
  }

  const deleteNotification = async (notificationId: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) {
      return
    }

    try {
      const response = await fetch(`/api/super-admin/notifications/${notificationId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setNotifications(notifications.filter(n => n.id !== notificationId))
        toast({
        title: "Success",
        description: 'Notification deleted'
      })
      } else {
        toast({
        title: "Error",
        description: 'Failed to delete notification'
      })
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast({
        title: "Error",
        description: 'Failed to delete notification'
      })
    }
  }

  const exportNotifications = async () => {
    try {
      const response = await fetch('/api/super-admin/notifications/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `notifications-export-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast({
        title: "Success",
        description: 'Notifications exported successfully'
      })
      } else {
        toast({
        title: "Error",
        description: 'Failed to export notifications'
      })
      }
    } catch (error) {
      console.error('Error exporting notifications:', error)
      toast({
        title: "Error",
        description: 'Failed to export notifications'
      })
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedNotification(null)
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
                <h1 className="text-3xl font-bold text-gray-900">Super Admin Notifications</h1>
                <p className="text-gray-600 mt-1">Monitor system-wide notifications, security alerts, and admin activities</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-8 w-20 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">Super Admin Notifications</h1>
              <p className="text-gray-600 mt-1">
                Monitor system-wide notifications, security alerts, and admin activities
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={exportNotifications} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                  <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {notifications.filter(n => n.priority === 'CRITICAL').length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Security Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {notifications.filter(n => n.type === 'SECURITY_ALERT').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Shield className="h-6 w-6 text-yellow-600" />
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
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="PASSWORD_CHANGE">Password Changes</option>
                  <option value="SECURITY_ALERT">Security Alerts</option>
                  <option value="SUBSCRIPTION_REQUEST">Subscription Requests</option>
                  <option value="ADMIN_ACTION">Admin Actions</option>
                  <option value="SYSTEM_STATUS">System Status</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Priorities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="UNREAD">Unread</option>
                  <option value="READ">Read</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              <Badge variant="outline">
                {filteredNotifications.length} of {notifications.length} notifications
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Table */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">All Notifications</CardTitle>
            <CardDescription>
              System-wide notifications and alerts for super administrators
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredNotifications.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Target User</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.map((notification) => (
                    <TableRow key={notification.id} className={
                      notification.status === 'UNREAD' ? 'bg-blue-50/50' : ''
                    }>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getNotificationIcon(notification.type)}
                          <span className="text-sm font-medium">
                            {notification.type.replace('_', ' ')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{notification.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {notification.message}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {notification.targetUser || 'System'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(notification.priority)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(notification.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewNotification(notification)}
                            className="h-8 w-8 p-0"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            title="Delete notification"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || typeFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all'
                    ? 'No notifications match your search criteria.'
                    : 'No notifications available at this time.'
                  }
                </p>
                <Button onClick={handleRefresh}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <NotificationDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          notification={selectedNotification}
          onMarkAsRead={markAsRead}
          onArchive={archiveNotification}
          onDelete={deleteNotification}
        />
      )}
    </div>
    
  )
}