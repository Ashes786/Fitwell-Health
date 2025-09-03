'use client'

import { useState, useEffect } from 'react'
import { useCustomSession } from '@/hooks/use-custom-session'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Activity, Server, Database, Cpu, HardDrive, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface SystemHealth {
  uptime: string
  errors: number
  alerts: number
  status: 'healthy' | 'warning' | 'critical'
  lastChecked: string
}

interface SystemMetrics {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  activeConnections: number
  responseTime: number
}

export default function SystemStatusPage() {
  const { user, loading } = useCustomSession()
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    uptime: '99.9%',
    errors: 0,
    alerts: 0,
    status: 'healthy',
    lastChecked: new Date().toISOString()
  })
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    activeConnections: 0,
    responseTime: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN') {
      loadSystemStatus()
    }
  }, [user])

  const loadSystemStatus = async () => {
    setIsLoading(true)
    try {
      const [healthRes, metricsRes] = await Promise.all([
        fetch('/api/system/monitor'),
        fetch('/api/super-admin/system-status')
      ])

      if (healthRes.ok) {
        const healthData = await healthRes.json()
        setSystemHealth(healthData.systemHealth || {
          uptime: '99.9%',
          errors: 0,
          alerts: 0,
          status: 'healthy',
          lastChecked: new Date().toISOString()
        })
      }

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json()
        setMetrics(metricsData.metrics || {
          cpuUsage: 0,
          memoryUsage: 0,
          diskUsage: 0,
          activeConnections: 0,
          responseTime: 0
        })
      }
    } catch (error) {
      toast.error('Failed to load system status')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMetricColor = (value: number) => {
    if (value < 50) return 'text-green-600'
    if (value < 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading || isLoading) {
    return (
      <DashboardLayout userRole={user?.role || ''} userName={user?.name || ''} userImage={user?.avatar}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user || user.role !== 'SUPER_ADMIN') {
    return (
      <DashboardLayout userRole={user?.role || ''} userName={user?.name || ''} userImage={user?.avatar}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole={user.role} userName={user.name || ''} userImage={user.avatar}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
            <p className="text-gray-600 mt-2">Monitor system health and performance metrics</p>
          </div>
          <Button onClick={loadSystemStatus} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Status</p>
                  <p className="text-2xl font-bold text-gray-900">{systemHealth.status}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Uptime</p>
                  <p className="text-2xl font-bold text-green-600">{systemHealth.uptime}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Errors</p>
                  <p className="text-2xl font-bold text-red-600">{systemHealth.errors}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Alerts</p>
                  <p className="text-2xl font-bold text-yellow-600">{systemHealth.alerts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-600" />
                CPU Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getMetricColor(metrics.cpuUsage)}`}>
                  {metrics.cpuUsage}%
                </div>
                <div className="mt-4 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      metrics.cpuUsage < 50 ? 'bg-green-500' : 
                      metrics.cpuUsage < 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${metrics.cpuUsage}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-600" />
                Memory Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getMetricColor(metrics.memoryUsage)}`}>
                  {metrics.memoryUsage}%
                </div>
                <div className="mt-4 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      metrics.memoryUsage < 50 ? 'bg-green-500' : 
                      metrics.memoryUsage < 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${metrics.memoryUsage}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-orange-600" />
                Disk Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getMetricColor(metrics.diskUsage)}`}>
                  {metrics.diskUsage}%
                </div>
                <div className="mt-4 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      metrics.diskUsage < 50 ? 'bg-green-500' : 
                      metrics.diskUsage < 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${metrics.diskUsage}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-green-600" />
                Active Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">
                  {metrics.activeConnections}
                </div>
                <p className="text-sm text-gray-600 mt-2">Concurrent users</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {metrics.responseTime}ms
                </div>
                <p className="text-sm text-gray-600 mt-2">Average response time</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Last Updated */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Last updated:</span>
              <span>{new Date(systemHealth.lastChecked).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}