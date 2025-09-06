"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Activity, 
  Search, 
  Filter, 
  Download,
  Calendar,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Settings,
  Database
} from "lucide-react"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"

interface AuditLog {
  id: string
  action: string
  user: string
  userRole: string
  timestamp: string
  ipAddress: string
  status: "SUCCESS" | "FAILED" | "WARNING"
  details: string
  category: "AUTHENTICATION" | "DATA_ACCESS" | "DATA_MODIFICATION" | "SYSTEM" | "SECURITY"
}

export default function AdminAuditLogsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL")

  const { isAuthorized, isUnauthorized, isLoading, authSession: authSessionVar } = useRoleAuthorization({
    requiredRole: "ADMIN",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  useEffect(() => {
    if (isAuthorized) {
      // Original fetch logic will be handled separately
    }
  }, [isAuthorized])

  const fetchAuditLogs = async () => {
    try {
      // Mock data for demonstration
      const mockAuditLogs: AuditLog[] = [
        {
          id: "1",
          action: "User Login",
          user: "John Doe",
          userRole: "PATIENT",
          timestamp: "2024-01-15 10:30:45",
          ipAddress: "192.168.1.100",
          status: "SUCCESS",
          details: "Successful login from web browser",
          category: "AUTHENTICATION"
        },
        {
          id: "2",
          action: "Access Health Record",
          user: "Dr. Sarah Johnson",
          userRole: "DOCTOR",
          timestamp: "2024-01-15 10:25:12",
          ipAddress: "192.168.1.101",
          status: "SUCCESS",
          details: "Accessed patient record for John Doe",
          category: "DATA_ACCESS"
        },
        {
          id: "3",
          action: "Failed Login Attempt",
          user: "Unknown",
          userRole: "UNKNOWN",
          timestamp: "2024-01-15 10:20:33",
          ipAddress: "192.168.1.150",
          status: "FAILED",
          details: "Failed login attempt for user admin",
          category: "SECURITY"
        },
        {
          id: "4",
          action: "Update User Profile",
          user: "Jane Smith",
          userRole: "PATIENT",
          timestamp: "2024-01-15 09:45:22",
          ipAddress: "192.168.1.102",
          status: "SUCCESS",
          details: "Updated contact information",
          category: "DATA_MODIFICATION"
        },
        {
          id: "5",
          action: "System Configuration Change",
          user: "Admin User",
          userRole: "ADMIN",
          timestamp: "2024-01-15 09:30:15",
          ipAddress: "192.168.1.50",
          status: "WARNING",
          details: "Modified system security settings",
          category: "SYSTEM"
        },
        {
          id: "6",
          action: "Delete Appointment",
          user: "Dr. Michael Chen",
          userRole: "DOCTOR",
          timestamp: "2024-01-15 09:15:44",
          ipAddress: "192.168.1.103",
          status: "SUCCESS",
          details: "Cancelled appointment with patient Robert Johnson",
          category: "DATA_MODIFICATION"
        },
        {
          id: "7",
          action: "Export Data",
          user: "Admin User",
          userRole: "ADMIN",
          timestamp: "2024-01-15 08:45:30",
          ipAddress: "192.168.1.50",
          status: "SUCCESS",
          details: "Exported patient data for backup",
          category: "DATA_ACCESS"
        },
        {
          id: "8",
          action: "Unauthorized Access Attempt",
          user: "Unknown",
          userRole: "UNKNOWN",
          timestamp: "2024-01-15 08:30:12",
          ipAddress: "192.168.1.200",
          status: "FAILED",
          details: "Attempted access to restricted area",
          category: "SECURITY"
        }
      ]
      
      setAuditLogs(mockAuditLogs)
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      toast({
        title: "Error",
        description: 'Failed to load audit logs'
      })
    } finally {
      setIsDataLoading(false)
    }
  }

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "ALL" || log.status === statusFilter
    const matchesCategory = categoryFilter === "ALL" || log.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SUCCESS: { variant: "default" as const, className: "bg-green-100 text-green-800", icon: CheckCircle },
      FAILED: { variant: "default" as const, className: "bg-red-100 text-red-800", icon: AlertTriangle },
      WARNING: { variant: "default" as const, className: "bg-yellow-100 text-yellow-800", icon: AlertTriangle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.SUCCESS
    const Icon = config.icon
    
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      AUTHENTICATION: { className: "bg-blue-100 text-blue-800", icon: Shield },
      DATA_ACCESS: { className: "bg-purple-100 text-purple-800", icon: FileText },
      DATA_MODIFICATION: { className: "bg-orange-100 text-orange-800", icon: Database },
      SYSTEM: { className: "bg-gray-100 text-gray-800", icon: Settings },
      SECURITY: { className: "bg-red-100 text-red-800", icon: AlertTriangle }
    }
    
    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.SYSTEM
    const Icon = config.icon
    
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {category}
      </Badge>
    )
  }

  const handleExportLogs = () => {
    toast({
        title: "Info",
        description: "Exporting audit logs..."
      })
  }

  const categories = Array.from(new Set(auditLogs.map(log => log.category)))

  if (isLoading || isDataLoading) {
    return (
      
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      
    )
  }

  if (!session) {
    return null
  }

  // Show unauthorized message if user doesn't have ADMIN role
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-gray-600 mt-1">Monitor and track all system activities and security events</p>
          </div>
          <Button onClick={handleExportLogs} className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">{auditLogs.length}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Successful</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {auditLogs.filter(l => l.status === "SUCCESS").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed/Warnings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {auditLogs.filter(l => l.status === "FAILED" || l.status === "WARNING").length}
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
                  <p className="text-sm font-medium text-gray-600">Security Events</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {auditLogs.filter(l => l.category === "SECURITY").length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-purple-600" />
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
                    placeholder="Search audit logs..."
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
                  <option value="SUCCESS">Success</option>
                  <option value="FAILED">Failed</option>
                  <option value="WARNING">Warning</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
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

        {/* Audit Logs Table */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>
              Comprehensive log of all system activities and security events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Timestamp</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">IP Address</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{log.timestamp}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{log.user}</p>
                            <p className="text-xs text-gray-500">{log.userRole}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{log.action}</p>
                      </td>
                      <td className="py-3 px-4">
                        {getCategoryBadge(log.category)}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(log.status)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700 font-mono">{log.ipAddress}</span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-700 max-w-xs truncate">{log.details}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredAuditLogs.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No audit logs found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Security Events */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Recent Security Events</CardTitle>
            <CardDescription className="text-red-700">
              Security-related events that require attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditLogs
                .filter(log => log.category === "SECURITY" || log.status === "FAILED")
                .slice(0, 5)
                .map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-red-200">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{log.action}</p>
                        {getStatusBadge(log.status)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                      <p className="text-xs text-gray-500 mt-1">{log.timestamp} • {log.ipAddress}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    
  )
}