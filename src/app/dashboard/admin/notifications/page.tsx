"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Bell, 
  Search, 
  Filter, 
  Plus,
  Send,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Mail,
  Calendar,
  User,
  Settings
} from "lucide-react"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"

interface Notification {
  id: string
  title: string
  message: string
  type: "INFO" | "WARNING" | "ERROR" | "SUCCESS"
  recipient: string
  recipientType: "USER" | "ROLE" | "ALL"
  status: "SENT" | "PENDING" | "FAILED"
  timestamp: string
  readAt?: string
  priority: "LOW" | "MEDIUM" | "HIGH"
  channel: "EMAIL" | "SMS" | "IN_APP" | "PUSH"
}

export default function AdminNotificationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [typeFilter, setTypeFilter] = useState<string>("ALL")

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (session.user?.role !== "ADMIN") {
      router.push("/dashboard")
      return
    }

    fetchNotifications()
  }, [session, status, router])

  const fetchNotifications = async () => {
    try {
      // Mock data for demonstration
      const mockNotifications: Notification[] = [
        {
          id: "1",
          title: "System Maintenance Scheduled",
          message: "Scheduled maintenance will occur on January 20, 2024 from 2:00 AM to 4:00 AM EST",
          type: "INFO",
          recipient: "All Users",
          recipientType: "ALL",
          status: "SENT",
          timestamp: "2024-01-15 10:00:00",
          priority: "MEDIUM",
          channel: "EMAIL"
        },
        {
          id: "2",
          title: "New Feature Available",
          message: "The new telemedicine feature is now available for all doctors",
          type: "SUCCESS",
          recipient: "Doctors",
          recipientType: "ROLE",
          status: "SENT",
          timestamp: "2024-01-14 15:30:00",
          priority: "LOW",
          channel: "IN_APP"
        },
        {
          id: "3",
          title: "Security Alert",
          message: "Multiple failed login attempts detected from IP address 192.168.1.100",
          type: "WARNING",
          recipient: "Admin Users",
          recipientType: "ROLE",
          status: "SENT",
          timestamp: "2024-01-14 09:15:00",
          priority: "HIGH",
          channel: "EMAIL"
        },
        {
          id: "4",
          title: "Appointment Reminder",
          message: "Reminder: You have 3 appointments scheduled for today",
          recipient: "Dr. Sarah Johnson",
          recipientType: "USER",
          status: "SENT",
          timestamp: "2024-01-13 08:00:00",
          readAt: "2024-01-13 08:05:00",
          priority: "MEDIUM",
          channel: "SMS"
        },
        {
          id: "5",
          title: "Payment Failed",
          message: "Payment processing failed for invoice INV-2024-003",
          type: "ERROR",
          recipient: "John Doe",
          recipientType: "USER",
          status: "FAILED",
          timestamp: "2024-01-12 14:20:00",
          priority: "HIGH",
          channel: "EMAIL"
        },
        {
          id: "6",
          title: "Welcome to Fitwell",
          message: "Welcome! Your account has been successfully created",
          type: "SUCCESS",
          recipient: "New Patients",
          recipientType: "ROLE",
          status: "PENDING",
          timestamp: "2024-01-11 16:45:00",
          priority: "LOW",
          channel: "EMAIL"
        },
        {
          id: "7",
          title: "Policy Update",
          message: "Important updates to our privacy policy and terms of service",
          type: "INFO",
          recipient: "All Users",
          recipientType: "ALL",
          status: "SENT",
          timestamp: "2024-01-10 11:00:00",
          priority: "MEDIUM",
          channel: "EMAIL"
        },
        {
          id: "8",
          title: "System Update Complete",
          message: "System update has been completed successfully",
          type: "SUCCESS",
          recipient: "Admin Users",
          recipientType: "ROLE",
          status: "SENT",
          timestamp: "2024-01-09 18:30:00",
          priority: "LOW",
          channel: "IN_APP"
        }
      ]
      
      setNotifications(mockNotifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.recipient.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "ALL" || notification.status === statusFilter
    const matchesType = typeFilter === "ALL" || notification.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      INFO: { variant: "default" as const, className: "bg-blue-100 text-blue-800", icon: Mail },
      WARNING: { variant: "default" as const, className: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
      ERROR: { variant: "default" as const, className: "bg-red-100 text-red-800", icon: AlertTriangle },
      SUCCESS: { variant: "default" as const, className: "bg-green-100 text-green-800", icon: CheckCircle }
    }
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.INFO
    const Icon = config.icon
    
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {type}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SENT: { variant: "default" as const, className: "bg-green-100 text-green-800", icon: CheckCircle },
      PENDING: { variant: "default" as const, className: "bg-yellow-100 text-yellow-800", icon: Clock },
      FAILED: { variant: "default" as const, className: "bg-red-100 text-red-800", icon: AlertTriangle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.SENT
    const Icon = config.icon
    
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      LOW: { className: "bg-gray-100 text-gray-800" },
      MEDIUM: { className: "bg-yellow-100 text-yellow-800" },
      HIGH: { className: "bg-red-100 text-red-800" }
    }
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.LOW
    
    return (
      <Badge className={config.className}>
        {priority}
      </Badge>
    )
  }

  const getChannelIcon = (channel: string) => {
    const channelIcons = {
      EMAIL: Mail,
      SMS: Mail,
      IN_APP: Bell,
      PUSH: Bell
    }
    
    const Icon = channelIcons[channel as keyof typeof channelIcons] || Mail
    return <Icon className="h-4 w-4" />
  }

  const handleSendNotification = () => {
    toast.info("Opening notification composer...")
  }

  const handleViewNotification = (id: string) => {
    toast.info(`Viewing notification ${id}`)
  }

  const handleDeleteNotification = (id: string) => {
    toast.info(`Deleting notification ${id}`)
  }

  const notificationTypes = Array.from(new Set(notifications.map(n => n.type)))

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout userRole={UserRole.ADMIN}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
  }

  return (
    <DashboardLayout userRole={UserRole.ADMIN}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">Manage and send notifications across your healthcare network</p>
          </div>
          <Button onClick={handleSendNotification} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Send Notification
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {notifications.filter(n => n.status === "SENT").length}
                  </p>
                </div>
                <Send className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {notifications.filter(n => n.status === "PENDING").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {notifications.filter(n => n.status === "FAILED").length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {notifications.filter(n => n.priority === "HIGH").length}
                  </p>
                </div>
                <Bell className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="SENT">Sent</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ALL">All Types</option>
                  {notificationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Table */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              View and manage all notifications sent through the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Timestamp</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Recipient</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Priority</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Channel</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotifications.map((notification) => (
                    <tr key={notification.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{notification.timestamp}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-500 max-w-xs truncate">{notification.message}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{notification.recipient}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getTypeBadge(notification.type)}
                      </td>
                      <td className="py-3 px-4">
                        {getPriorityBadge(notification.priority)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getChannelIcon(notification.channel)}
                          <span className="text-sm text-gray-700">{notification.channel}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(notification.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewNotification(notification.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredNotifications.length === 0 && (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No notifications found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common notification management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Mail className="h-6 w-6 mb-2" />
                <span>Send Bulk Email</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Bell className="h-6 w-6 mb-2" />
                <span>System Announcements</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Settings className="h-6 w-6 mb-2" />
                <span>Notification Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}