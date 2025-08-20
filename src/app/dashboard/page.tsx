'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useUserPermissions } from '@/hooks/use-user-permissions'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Server, 
  Database, 
  Lock,
  Shield,
  Menu,
  X,
  Bell,
  User,
  LogOut,
  ChartBar,
  Activity,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  Stethoscope,
  UserCheck,
  Clipboard,
  Monitor,
  Users2,
  Building,
  HeartPulse,
  FileText,
  MessageSquare
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Role-specific dashboard components with feature-based access control
function SuperAdminDashboard({ session, permissions }: { session: any, permissions: any }) {
  const [analytics, setAnalytics] = useState({
    totalUsers: 1247,
    totalDoctors: 45,
    totalPatients: 892,
    totalAdmins: 12,
    totalAppointments: 1567,
    totalRevenue: 125000,
    systemUptime: 99.9,
    activeUsers: 342,
    pendingRequests: 5
  })

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user?.name}!</h1>
            <p className="text-blue-100">Super Admin Dashboard - Complete system overview</p>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <Shield className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers.toLocaleString()}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {getGrowthIcon(8.3)}
                  <span className="text-sm text-green-600">+8.3%</span>
                </div>
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
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${analytics.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {getGrowthIcon(22.1)}
                  <span className="text-sm text-green-600">+22.1%</span>
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
                <p className="text-sm font-medium text-gray-600">Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalAppointments.toLocaleString()}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {getGrowthIcon(15.7)}
                  <span className="text-sm text-green-600">+15.7%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.systemUptime}%</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Excellent</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Show only based on user's assigned features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {permissions.hasFeature('manage_admins') && (
          <Link href="/dashboard/super-admin/admins">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Manage Admins</h3>
                    <p className="text-sm text-gray-500">{analytics.totalAdmins} admins</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
        
        {permissions.hasFeature('approve_subscription_requests') && (
          <Link href="/dashboard/super-admin/subscription-requests">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Clipboard className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Subscription Requests</h3>
                    <p className="text-sm text-gray-500">{analytics.pendingRequests} pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
        
        {permissions.hasFeature('view_global_analytics') && (
          <Link href="/dashboard/super-admin/analytics">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <ChartBar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Analytics</h3>
                    <p className="text-sm text-gray-500">View reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
        
        {permissions.hasFeature('manage_system_status') && (
          <Link href="/dashboard/super-admin/system-status">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Server className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">System Status</h3>
                    <p className="text-sm text-gray-500">All systems operational</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </div>
  )
}

function AdminDashboard({ session, permissions }: { session: any, permissions: any }) {
  const [stats, setStats] = useState({
    totalUsers: 847,
    totalDoctors: 32,
    totalPatients: 612,
    totalAppointments: 924,
    monthlyRevenue: 45000
  })

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user?.name}!</h1>
            <p className="text-blue-100">Admin Dashboard - Manage your network</p>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <Building className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
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
                <p className="text-sm font-medium text-gray-600">Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDoctors}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Stethoscope className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Show only based on user's assigned features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {permissions.hasPermission('manage_users') && (
          <Link href="/dashboard/admin/users">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Manage Users</h3>
                    <p className="text-sm text-gray-500">View all users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
        
        {permissions.hasPermission('manage_doctors') && (
          <Link href="/dashboard/admin/doctors">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Stethoscope className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Manage Doctors</h3>
                    <p className="text-sm text-gray-500">Doctor management</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
        
        {permissions.hasPermission('view_analytics') && (
          <Link href="/dashboard/admin/analytics">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <ChartBar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Analytics</h3>
                    <p className="text-sm text-gray-500">View reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </div>
  )
}

function DoctorDashboard({ session, permissions }: { session: any, permissions: any }) {
  const [stats, setStats] = useState({
    todayAppointments: 8,
    totalPatients: 156,
    monthlyEarnings: 12000,
    upcomingAppointments: 3
  })

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Dr. {session.user?.name}!</h1>
            <p className="text-green-100">Doctor Dashboard - Your practice overview</p>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <Stethoscope className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${stats.monthlyEarnings.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Show only based on user's assigned features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {permissions.hasPermission('view_appointments') && (
          <Link href="/dashboard/doctor/appointments">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Appointments</h3>
                    <p className="text-sm text-gray-500">Manage schedule</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {permissions.hasPermission('view_patient_records') && (
          <Link href="/dashboard/doctor/patients">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Patients</h3>
                    <p className="text-sm text-gray-500">View patients</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {permissions.hasPermission('create_prescriptions') && (
          <Link href="/dashboard/doctor/prescriptions">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Prescriptions</h3>
                    <p className="text-sm text-gray-500">Manage scripts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {permissions.hasPermission('chat_with_patient') && (
          <Link href="/dashboard/doctor/messages">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <MessageSquare className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Messages</h3>
                    <p className="text-sm text-gray-500">Patient chats</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </div>
  )
}

function PatientDashboard({ session, permissions }: { session: any, permissions: any }) {
  const [stats, setStats] = useState({
    upcomingAppointments: 2,
    totalAppointments: 24,
    healthScore: 85,
    unreadMessages: 1
  })

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user?.name}!</h1>
            <p className="text-purple-100">Patient Dashboard - Your health overview</p>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <HeartPulse className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Clipboard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Health Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.healthScore}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <HeartPulse className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unreadMessages}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Show only based on user's assigned features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {permissions.hasPermission('book_appointment') && (
          <Link href="/dashboard/patient/book-appointment">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Book Appointment</h3>
                    <p className="text-sm text-gray-500">Schedule visit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {permissions.hasPermission('view_own_appointments') && (
          <Link href="/dashboard/patient/appointments">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">My Appointments</h3>
                    <p className="text-sm text-gray-500">View history</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {permissions.hasPermission('record_vitals') && (
          <Link href="/dashboard/patient/vitals">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <HeartPulse className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Health Vitals</h3>
                    <p className="text-sm text-gray-500">Track health</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {permissions.hasPermission('view_ai_reports') && (
          <Link href="/dashboard/patient/ai-reports">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <FileText className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Reports</h3>
                    <p className="text-sm text-gray-500">Health insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </div>
  )
}

function AttendantDashboard({ session, permissions }: { session: any, permissions: any }) {
  const [stats, setStats] = useState({
    todayRegistrations: 12,
    totalPatients: 89,
    pendingAppointments: 5,
    activePatients: 34
  })

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user?.name}!</h1>
            <p className="text-yellow-100">Attendant Dashboard - Patient management</p>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <Users2 className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Registrations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayRegistrations}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
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
                <p className="text-sm font-medium text-gray-600">Pending Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingAppointments}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activePatients}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Show only based on user's assigned features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {permissions.hasPermission('register_patients') && (
          <Link href="/dashboard/attendant/register-patient">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Register Patient</h3>
                    <p className="text-sm text-gray-500">New registration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {permissions.hasPermission('manage_patients') && (
          <Link href="/dashboard/attendant/patients">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Manage Patients</h3>
                    <p className="text-sm text-gray-500">View all patients</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {permissions.hasPermission('view_appointments') && (
          <Link href="/dashboard/attendant/appointments">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Appointments</h3>
                    <p className="text-sm text-gray-500">Schedule management</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </div>
  )
}

function ControlRoomDashboard({ session, permissions }: { session: any, permissions: any }) {
  const [stats, setStats] = useState({
    pendingAssignments: 8,
    totalAppointments: 45,
    activeDoctors: 12,
    escalationRate: 2.5
  })

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user?.name}!</h1>
            <p className="text-red-100">Control Room Dashboard - Operations overview</p>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <Monitor className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingAssignments}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Clipboard className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeDoctors}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Stethoscope className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Escalation Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.escalationRate}%</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Show only based on user's assigned features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {permissions.hasPermission('assign_doctors') && (
          <Link href="/dashboard/control-room/doctor-assignment">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <Clipboard className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Doctor Assignment</h3>
                    <p className="text-sm text-gray-500">Assign doctors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {permissions.hasPermission('monitor_appointments') && (
          <Link href="/dashboard/control-room/appointments">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Appointments</h3>
                    <p className="text-sm text-gray-500">Monitor schedule</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {permissions.hasPermission('handle_escalations') && (
          <Link href="/dashboard/control-room/escalations">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Activity className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Escalations</h3>
                    <p className="text-sm text-gray-500">Handle issues</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </div>
  )
}

// Navigation configuration for each role based on permissions
const getNavigationConfig = (role: string, permissions: any) => {
  // Default to empty current path during SSR
  const currentPath = ''
  
  switch (role) {
    case 'SUPER_ADMIN':
      const superAdminNav = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: false, permission: null },
      ]
      
      if (permissions.hasFeature('manage_admins')) {
        superAdminNav.push({ name: 'Admins', href: '/dashboard/super-admin/admins', icon: Users, current: false, permission: 'manage_admins' })
      }
      
      if (permissions.hasFeature('view_global_analytics')) {
        superAdminNav.push({ name: 'Analytics', href: '/dashboard/super-admin/analytics', icon: ChartBar, current: false, permission: 'view_global_analytics' })
      }
      
      superAdminNav.push({ name: 'Settings', href: '/dashboard/super-admin/settings', icon: Settings, current: false, permission: null })
      
      return superAdminNav
      
    case 'ADMIN':
      const adminNav = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: false, permission: null },
      ]
      
      if (permissions.hasPermission('manage_users')) {
        adminNav.push({ name: 'Users', href: '/dashboard/admin/users', icon: Users, current: false, permission: 'manage_users' })
      }
      
      if (permissions.hasPermission('manage_doctors')) {
        adminNav.push({ name: 'Doctors', href: '/dashboard/admin/doctors', icon: Stethoscope, current: false, permission: 'manage_doctors' })
      }
      
      if (permissions.hasPermission('view_analytics')) {
        adminNav.push({ name: 'Analytics', href: '/dashboard/admin/analytics', icon: ChartBar, current: false, permission: 'view_analytics' })
      }
      
      adminNav.push({ name: 'Settings', href: '/dashboard/admin/settings', icon: Settings, current: false, permission: null })
      
      return adminNav
      
    case 'DOCTOR':
      const doctorNav = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: false, permission: null },
      ]
      
      if (permissions.hasPermission('view_appointments')) {
        doctorNav.push({ name: 'Appointments', href: '/dashboard/doctor/appointments', icon: Calendar, current: false, permission: 'view_appointments' })
      }
      
      if (permissions.hasPermission('view_patient_records')) {
        doctorNav.push({ name: 'Patients', href: '/dashboard/doctor/patients', icon: UserCheck, current: false, permission: 'view_patient_records' })
      }
      
      if (permissions.hasPermission('create_prescriptions')) {
        doctorNav.push({ name: 'Prescriptions', href: '/dashboard/doctor/prescriptions', icon: FileText, current: false, permission: 'create_prescriptions' })
      }
      
      if (permissions.hasPermission('chat_with_patient')) {
        doctorNav.push({ name: 'Messages', href: '/dashboard/doctor/messages', icon: MessageSquare, current: false, permission: 'chat_with_patient' })
      }
      
      return doctorNav
      
    case 'PATIENT':
      const patientNav = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: false, permission: null },
      ]
      
      if (permissions.hasPermission('book_appointment')) {
        patientNav.push({ name: 'Book Appointment', href: '/dashboard/patient/book-appointment', icon: Plus, current: false, permission: 'book_appointment' })
      }
      
      if (permissions.hasPermission('view_own_appointments')) {
        patientNav.push({ name: 'My Appointments', href: '/dashboard/patient/appointments', icon: Calendar, current: false, permission: 'view_own_appointments' })
      }
      
      if (permissions.hasPermission('record_vitals')) {
        patientNav.push({ name: 'Health Vitals', href: '/dashboard/patient/vitals', icon: HeartPulse, current: false, permission: 'record_vitals' })
      }
      
      if (permissions.hasPermission('view_ai_reports')) {
        patientNav.push({ name: 'AI Reports', href: '/dashboard/patient/ai-reports', icon: FileText, current: false, permission: 'view_ai_reports' })
      }
      
      return patientNav
      
    case 'ATTENDANT':
      const attendantNav = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: false, permission: null },
      ]
      
      if (permissions.hasPermission('register_patients')) {
        attendantNav.push({ name: 'Register Patient', href: '/dashboard/attendant/register-patient', icon: Plus, current: false, permission: 'register_patients' })
      }
      
      if (permissions.hasPermission('manage_patients')) {
        attendantNav.push({ name: 'Patients', href: '/dashboard/attendant/patients', icon: Users, current: false, permission: 'manage_patients' })
      }
      
      if (permissions.hasPermission('view_appointments')) {
        attendantNav.push({ name: 'Appointments', href: '/dashboard/attendant/appointments', icon: Calendar, current: false, permission: 'view_appointments' })
      }
      
      return attendantNav
      
    case 'CONTROL_ROOM':
      const controlRoomNav = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: false, permission: null },
      ]
      
      if (permissions.hasPermission('assign_doctors')) {
        controlRoomNav.push({ name: 'Doctor Assignment', href: '/dashboard/control-room/doctor-assignment', icon: Clipboard, current: false, permission: 'assign_doctors' })
      }
      
      if (permissions.hasPermission('monitor_appointments')) {
        controlRoomNav.push({ name: 'Appointments', href: '/dashboard/control-room/appointments', icon: Calendar, current: false, permission: 'monitor_appointments' })
      }
      
      if (permissions.hasPermission('handle_escalations')) {
        controlRoomNav.push({ name: 'Escalations', href: '/dashboard/control-room/escalations', icon: Activity, current: false, permission: 'handle_escalations' })
      }
      
      return controlRoomNav
      
    default:
      return []
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { permissions, loading } = useUserPermissions()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'System Update',
      message: 'System maintenance scheduled for tonight',
      type: 'system',
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'New Message',
      message: 'You have a new message from your doctor',
      type: 'message',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ])

  const [navigation, setNavigation] = useState([])
  const [currentPath, setCurrentPath] = useState('')

  // Update navigation when session or permissions change
  useEffect(() => {
    if (session?.user?.role && permissions) {
      setNavigation(getNavigationConfig(session.user.role, permissions))
    }
  }, [session, permissions])

  // Update current page based on pathname - only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname)
    }
  }, [])

  // Update navigation when current path changes
  useEffect(() => {
    if (currentPath) {
      setNavigation(prev => 
        prev.map(item => ({
          ...item,
          current: item.href === currentPath
        }))
      )
    }
  }, [currentPath])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (!session) {
    // Let middleware handle authentication redirects
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  const userRole = session.user?.role
  const userInitials = session?.user?.name 
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : session?.user?.email?.[0]?.toUpperCase() || 'U'

  // Render role-specific dashboard with permissions
  const renderDashboard = () => {
    switch (userRole) {
      case 'SUPER_ADMIN':
        return <SuperAdminDashboard session={session} permissions={permissions} />
      case 'ADMIN':
        return <AdminDashboard session={session} permissions={permissions} />
      case 'DOCTOR':
        return <DoctorDashboard session={session} permissions={permissions} />
      case 'PATIENT':
        return <PatientDashboard session={session} permissions={permissions} />
      case 'ATTENDANT':
        return <AttendantDashboard session={session} permissions={permissions} />
      case 'CONTROL_ROOM':
        return <ControlRoomDashboard session={session} permissions={permissions} />
      default:
        return <div>Invalid role</div>
    }
  }

  // Notification helper functions
  const unreadCount = notifications.filter(n => !n.isRead).length
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className={`w-8 h-8 bg-gradient-to-r rounded-lg flex items-center justify-center ${
              userRole === 'SUPER_ADMIN' ? 'from-blue-600 to-purple-600' :
              userRole === 'ADMIN' ? 'from-blue-600 to-blue-700' :
              userRole === 'DOCTOR' ? 'from-green-600 to-teal-600' :
              userRole === 'PATIENT' ? 'from-purple-600 to-pink-600' :
              userRole === 'ATTENDANT' ? 'from-yellow-600 to-orange-600' :
              'from-red-600 to-pink-600'
            }`}>
              {userRole === 'SUPER_ADMIN' && <Shield className="h-5 w-5 text-white" />}
              {userRole === 'ADMIN' && <Building className="h-5 w-5 text-white" />}
              {userRole === 'DOCTOR' && <Stethoscope className="h-5 w-5 text-white" />}
              {userRole === 'PATIENT' && <HeartPulse className="h-5 w-5 text-white" />}
              {userRole === 'ATTENDANT' && <Users2 className="h-5 w-5 text-white" />}
              {userRole === 'CONTROL_ROOM' && <Monitor className="h-5 w-5 text-white" />}
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">
              {userRole === 'SUPER_ADMIN' ? 'SuperAdmin' :
               userRole === 'ADMIN' ? 'Admin' :
               userRole === 'DOCTOR' ? 'Doctor' :
               userRole === 'PATIENT' ? 'Patient' :
               userRole === 'ATTENDANT' ? 'Attendant' :
               userRole === 'CONTROL_ROOM' ? 'Control Room' : 'Dashboard'}
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  item.current
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="mt-8">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">System</h3>
            <div className="mt-2 space-y-2">
              <Link
                href="/dashboard/profile"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setSidebarOpen(false)}
              >
                <User className="mr-3 h-5 w-5" />
                Profile
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setSidebarOpen(false)}
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="text-lg font-semibold text-gray-900">
                {userRole === 'SUPER_ADMIN' ? 'Super Admin Panel' :
                 userRole === 'ADMIN' ? 'Admin Panel' :
                 userRole === 'DOCTOR' ? 'Doctor Dashboard' :
                 userRole === 'PATIENT' ? 'Patient Dashboard' :
                 userRole === 'ATTENDANT' ? 'Attendant Dashboard' :
                 userRole === 'CONTROL_ROOM' ? 'Control Room' : 'Dashboard'}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notification Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs min-w-5"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <DropdownMenuLabel className="text-base font-semibold">Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={markAllAsRead}
                        className="text-xs"
                      >
                        Mark all as read
                      </Button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <DropdownMenuItem
                          key={notification.id}
                          className="p-4 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                              notification.isRead ? 'bg-gray-300' : 'bg-blue-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatTime(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center justify-center text-blue-600 font-medium">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback>
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border border-gray-200 rounded-lg shadow-lg" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                      <p className="text-xs text-gray-500">{session.user?.email}</p>
                      <Badge variant="outline" className="w-fit mt-1">
                        {userRole}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-6">
            {renderDashboard()}
          </div>
        </main>
      </div>
    </div>
  )
}