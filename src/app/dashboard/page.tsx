'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useUserPermissions } from '@/hooks/use-user-permissions'
import { DashboardLayout } from "@/components/layout/dashboard-layout"

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
  MessageSquare,
  Clock
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { UserRole } from "@prisma/client"

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
        
        {/* Added subscription management for Super Admin */}
        {permissions.hasFeature('manage_subscriptions') && (
          <Link href="/dashboard/super-admin/subscription-plans">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Subscription Plans</h3>
                    <p className="text-sm text-gray-500">Manage subscription plans</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
        
        {/* Added partner management for Super Admin */}
        {permissions.hasFeature('manage_partners') && (
          <Link href="/dashboard/super-admin/partners">
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Building className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Partners</h3>
                    <p className="text-sm text-gray-500">Manage partners</p>
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
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
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
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
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
                    <p className="text-sm text-gray-500">View schedule</p>
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
                    <p className="text-sm text-gray-500">Patient records</p>
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
                    <p className="text-sm text-gray-500">Manage prescriptions</p>
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
                  <div className="p-3 bg-orange-100 rounded-full">
                    <MessageSquare className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Messages</h3>
                    <p className="text-sm text-gray-500">Chat with patients</p>
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
    totalAppointments: 12,
    healthRecords: 8,
    lastVitalCheck: '2 days ago'
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
                <p className="text-sm font-medium text-gray-600">Health Records</p>
                <p className="text-2xl font-bold text-gray-900">{stats.healthRecords}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Vital Check</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lastVitalCheck}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <HeartPulse className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
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
                  <div className="p-3 bg-orange-100 rounded-full">
                    <FileText className="h-6 w-6 text-orange-600" />
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
    todayRegistrations: 5,
    totalPatients: 89,
    pendingAppointments: 3,
    activePatients: 67
  })

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user?.name}!</h1>
            <p className="text-orange-100">Attendant Dashboard - Patient services</p>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <Users className="h-8 w-8" />
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
                <Plus className="h-6 w-6 text-blue-600" />
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
                <p className="text-sm font-medium text-gray-600">Active Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activePatients}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <UserCheck className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
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
                    <h3 className="font-semibold text-gray-900">Patients</h3>
                    <p className="text-sm text-gray-500">Manage patients</p>
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
                    <p className="text-sm text-gray-500">View schedule</p>
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
    activeDoctors: 12,
    pendingAssignments: 3,
    escalationRate: 2.5,
    systemUptime: 99.9
  })

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-6 text-white">
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
                <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingAssignments}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clipboard className="h-6 w-6 text-yellow-600" />
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
              <div className="p-3 bg-orange-100 rounded-full">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{stats.systemUptime}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Server className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
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

export default function Dashboard() {
  const { data: session, status } = useSession()
  const { permissions, loading } = useUserPermissions()

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  const userRole = session.user?.role

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

  return (
    <DashboardLayout userRole={userRole}>
      {renderDashboard()}
    </DashboardLayout>
  )
}