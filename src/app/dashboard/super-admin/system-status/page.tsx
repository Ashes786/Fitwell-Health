'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Server, 
  Database, 
  Globe, 
  Activity, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Zap,
  Shield,
  Cpu,
  HardDrive,
  Wifi,
  Cloud,
  Mail,
  CreditCard
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { UserRole } from "@prisma/client"

interface SystemStatus {
  id: string
  serviceName: string
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'MAINTENANCE'
  responseTime?: number
  lastChecked: string
  message?: string
}

interface SystemMetrics {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  uptime: string
  activeConnections: number
  lastBackup: string
}

export default function SystemStatusPage() {
  const { isUnauthorized, isLoading, session } = useRoleAuthorization({
    requiredRole: "SUPER_ADMIN",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: false
  })
  
  const router = useRouter()
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([])
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkingAll, setCheckingAll] = useState(false)

  useEffect(() => {
    if (isLoading) return

    if (!session) {
      return
    }

    fetchSystemData()
  }, [session, isLoading])

  const fetchSystemData = async () => {
    setLoading(true)
    try {
      const [statusRes, metricsRes] = await Promise.all([
        fetch('/api/super-admin/system-status'),
        fetch('/api/super-admin/system-metrics')
      ])

      if (statusRes.ok) {
        const statusData = await statusRes.json()
        setSystemStatus(statusData)
      }

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json()
        setMetrics(metricsData)
      }
    } catch (error) {
      console.error('Error fetching system data:', error)
      toast({
        title: "Error",
        description: 'Failed to fetch system data'
      })
    } finally {
      setLoading(false)
    }
  }

  const checkAllServices = async () => {
    setCheckingAll(true)
    try {
      const response = await fetch('/api/super-admin/system-status/check-all', {
        method: 'POST'
      })

      if (response.ok) {
        const statusData = await response.json()
        setSystemStatus(statusData)
        toast({
        title: "Success",
        description: 'All services checked successfully'
      })
      } else {
        toast({
        title: "Error",
        description: 'Failed to check all services'
      })
      }
    } catch (error) {
      console.error('Error checking all services:', error)
      toast({
        title: "Error",
        description: 'Failed to check all services'
      })
    } finally {
      setCheckingAll(false)
    }
  }

  const checkService = async (serviceName: string) => {
    try {
      const response = await fetch(`/api/super-admin/system-status/${serviceName}`, {
        method: 'POST'
      })

      if (response.ok) {
        const serviceData = await response.json()
        setSystemStatus(prev => 
          prev.map(s => s.serviceName === serviceName ? serviceData : s)
        )
        toast({
        title: "Success",
        description: `${serviceName} checked successfully`
      })
      } else {
        toast({
        title: "Error",
        description: `Failed to check ${serviceName}`
      })
      }
    } catch (error) {
      console.error('Error checking service:', error)
      toast({
        title: "Error",
        description: `Failed to check ${serviceName}`
      })
    }
  }

  const getServiceIcon = (serviceName: string) => {
    switch (serviceName) {
      case 'API Server':
        return <Server className="h-5 w-5 text-blue-600" />
      case 'Database':
        return <Database className="h-5 w-5 text-green-600" />
      case 'Web Server':
        return <Globe className="h-5 w-5 text-purple-600" />
      case 'Cache':
        return <Zap className="h-5 w-5 text-yellow-600" />
      case 'Email Service':
        return <Mail className="h-5 w-5 text-red-600" />
      case 'Payment Gateway':
        return <CreditCard className="h-5 w-5 text-indigo-600" />
      case 'File Storage':
        return <Cloud className="h-5 w-5 text-cyan-600" />
      default:
        return <Activity className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return <Badge variant="default" className="bg-green-500">Online</Badge>
      case 'OFFLINE':
        return <Badge variant="destructive">Offline</Badge>
      case 'DEGRADED':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Degraded</Badge>
      case 'MAINTENANCE':
        return <Badge variant="outline">Maintenance</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'OFFLINE':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'DEGRADED':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'MAINTENANCE':
        return <Clock className="h-5 w-5 text-blue-600" />
      default:
        return <Activity className="h-5 w-5 text-gray-600" />
    }
  }

  const getHealthColor = (value: number) => {
    if (value < 50) return 'text-green-600'
    if (value < 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getHealthBg = (value: number) => {
    if (value < 50) return 'bg-green-500'
    if (value < 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const onlineServices = systemStatus.filter(s => s.status === 'ONLINE').length
  const totalServices = systemStatus.length
  const systemHealth = totalServices > 0 ? (onlineServices / totalServices) * 100 : 0

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
                <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
                <p className="text-gray-600 mt-1">Monitor system health and service status</p>
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
              <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
              <p className="text-gray-600 mt-1">Monitor system health and service status</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={checkAllServices} disabled={checkingAll}>
              <RefreshCw className={`mr-2 h-4 w-4 ${checkingAll ? 'animate-spin' : ''}`} />
              {checkingAll ? 'Checking...' : 'Check All Services'}
            </Button>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Health</p>
                  <p className="text-2xl font-bold text-gray-900">{systemHealth.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Online Services</p>
                  <p className="text-2xl font-bold text-gray-900">{onlineServices}/{totalServices}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Uptime</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics?.uptime || 'N/A'}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Connections</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics?.activeConnections || 'N/A'}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Wifi className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Metrics */}
        {metrics && (
          <Card className="bg-white border border-gray-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cpu className="h-5 w-5" />
                <span>System Metrics</span>
              </CardTitle>
              <CardDescription>Real-time system performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">CPU Usage</span>
                    <span className={`text-sm font-medium ${getHealthColor(metrics.cpuUsage)}`}>
                      {metrics.cpuUsage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getHealthBg(metrics.cpuUsage)}`}
                      style={{ width: `${metrics.cpuUsage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Memory Usage</span>
                    <span className={`text-sm font-medium ${getHealthColor(metrics.memoryUsage)}`}>
                      {metrics.memoryUsage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getHealthBg(metrics.memoryUsage)}`}
                      style={{ width: `${metrics.memoryUsage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Disk Usage</span>
                    <span className={`text-sm font-medium ${getHealthColor(metrics.diskUsage)}`}>
                      {metrics.diskUsage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getHealthBg(metrics.diskUsage)}`}
                      style={{ width: `${metrics.diskUsage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Last Backup</span>
                  <span className="text-sm text-gray-900">{metrics.lastBackup}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Service Status */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Service Status</span>
            </CardTitle>
            <CardDescription>Status of all system services and components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemStatus.map((service) => (
                <div key={service.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        service.status === 'ONLINE' ? 'bg-green-100' :
                        service.status === 'OFFLINE' ? 'bg-red-100' :
                        service.status === 'DEGRADED' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        {getServiceIcon(service.serviceName)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{service.serviceName}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusBadge(service.status)}
                          {service.responseTime && (
                            <span className="text-xs text-gray-500">
                              {service.responseTime}ms
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {getStatusIcon(service.status)}
                  </div>

                  {service.message && (
                    <p className="text-sm text-gray-600 mb-4">{service.message}</p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Last checked:</span>
                    <span>{format(new Date(service.lastChecked), 'MMM dd, HH:mm')}</span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => checkService(service.serviceName)}
                    >
                      <RefreshCw className="mr-2 h-3 w-3" />
                      Check Service
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    
  )
}