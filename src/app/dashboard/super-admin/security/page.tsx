'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft, 
  Shield, 
  Lock, 
  Key, 
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Activity,
  RefreshCw,
  Download,
  Settings,
  Fingerprint,
  Smartphone,
  Mail,
  Bell,
  Database,
  Network,
  Server
} from 'lucide-react'
import { toast } from 'sonner'
import { UserRole } from "@prisma/client"

interface SecurityLog {
  id: string
  type: 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN' | 'PASSWORD_CHANGE' | 'TWO_FACTOR_ENABLED' | 'SECURITY_ALERT'
  user: string
  description: string
  timestamp: string
  ipAddress: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

interface SecurityMetric {
  name: string
  value: number
  status: 'GOOD' | 'WARNING' | 'CRITICAL'
  description: string
}

export default function SecurityPage() {
  const { isUnauthorized, isLoading, session } = useRoleAuthorization({
    requiredRole: "SUPER_ADMIN",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: false
  })
  
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([])
  const [metrics, setMetrics] = useState<SecurityMetric[]>([])
  const [settings, setSettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    ipWhitelist: '',
    auditLogging: true,
    emailNotifications: true
  })

  useEffect(() => {
    if (isLoading) return

    if (!session) {
      return
    }

    fetchSecurityData()
  }, [session, isLoading])

  const fetchSecurityData = async () => {
    setLoading(true)
    try {
      const [logsRes, metricsRes] = await Promise.all([
        fetch('/api/super-admin/security/logs'),
        fetch('/api/super-admin/security/metrics')
      ])

      if (logsRes.ok) {
        const logsData = await logsRes.json()
        setSecurityLogs(logsData)
      }

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json()
        setMetrics(metricsData)
      }
    } catch (error) {
      console.error('Error fetching security data:', error)
      toast.error('Failed to fetch security data')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchSecurityData()
    setRefreshing(false)
  }

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/super-admin/security/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast.success('Security settings saved successfully')
      } else {
        toast.error('Failed to save security settings')
      }
    } catch (error) {
      console.error('Error saving security settings:', error)
      toast.error('Failed to save security settings')
    }
  }

  const handleGenerateReport = async () => {
    try {
      const response = await fetch('/api/super-admin/security/report')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `security-report-${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Security report generated successfully')
      } else {
        toast.error('Failed to generate security report')
      }
    } catch (error) {
      console.error('Error generating security report:', error)
      toast.error('Failed to generate security report')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'GOOD':
        return 'text-green-600'
      case 'WARNING':
        return 'text-yellow-600'
      case 'CRITICAL':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'LOGIN':
        return <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
      case 'LOGOUT':
        return <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
      case 'FAILED_LOGIN':
        return <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
      case 'PASSWORD_CHANGE':
        return <Key className="h-4 w-4 text-yellow-600 mt-0.5" />
      case 'TWO_FACTOR_ENABLED':
        return <Shield className="h-4 w-4 text-purple-600 mt-0.5" />
      case 'SECURITY_ALERT':
        return <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
      default:
        return <Activity className="h-4 w-4 text-gray-600 mt-0.5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW':
        return 'bg-green-100 text-green-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800'
      case 'CRITICAL':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
                <h1 className="text-3xl font-bold text-gray-900">Security Center</h1>
                <p className="text-gray-600 mt-1">Monitor and manage system security settings and logs</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <h1 className="text-3xl font-bold text-gray-900">Security Center</h1>
              <p className="text-gray-600 mt-1">Monitor and manage system security settings and logs</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button onClick={handleGenerateReport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                    <p className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                      {metric.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    metric.status === 'GOOD' ? 'bg-green-100' :
                    metric.status === 'WARNING' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <Shield className={`h-6 w-6 ${
                      metric.status === 'GOOD' ? 'text-green-600' :
                      metric.status === 'WARNING' ? 'text-yellow-600' : 'text-red-600'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Security Logs */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Security Logs</span>
              </CardTitle>
              <CardDescription>Latest security events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {securityLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getLogIcon(log.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{log.user}</p>
                        <Badge className={getSeverityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{log.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400 mt-2">
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                        <span>IP: {log.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>Configure security policies and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Two-Factor Authentication</Label>
                    <p className="text-xs text-gray-500">Require 2FA for all admin users</p>
                  </div>
                  <Button
                    variant={settings.twoFactorEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
                  >
                    {settings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div>
                  <Label htmlFor="sessionTimeout" className="text-sm font-medium text-gray-700">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="passwordExpiry" className="text-sm font-medium text-gray-700">
                    Password Expiry (days)
                  </Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={settings.passwordExpiry}
                    onChange={(e) => setSettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="maxLoginAttempts" className="text-sm font-medium text-gray-700">
                    Max Login Attempts
                  </Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="ipWhitelist" className="text-sm font-medium text-gray-700">
                    IP Whitelist (comma-separated)
                  </Label>
                  <Textarea
                    id="ipWhitelist"
                    value={settings.ipWhitelist}
                    onChange={(e) => setSettings(prev => ({ ...prev, ipWhitelist: e.target.value }))}
                    className="mt-1"
                    rows={3}
                    placeholder="192.168.1.0/24, 10.0.0.0/8"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Audit Logging</Label>
                    <p className="text-xs text-gray-500">Log all security events</p>
                  </div>
                  <Button
                    variant={settings.auditLogging ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSettings(prev => ({ ...prev, auditLogging: !prev.auditLogging }))}
                  >
                    {settings.auditLogging ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Email Notifications</Label>
                    <p className="text-xs text-gray-500">Send alerts for security events</p>
                  </div>
                  <Button
                    variant={settings.emailNotifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                  >
                    {settings.emailNotifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <Button onClick={handleSaveSettings} className="w-full">
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    
  )
}