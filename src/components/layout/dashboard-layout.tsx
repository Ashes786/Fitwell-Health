'use client'

import { useState } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Server, 
  Database, 
  Lock,
  Shield,
  Bell,
  User,
  LogOut,
  ChartBar,
  Activity,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Stethoscope,
  UserCheck,
  Clipboard,
  Monitor,
  Users2,
  Building,
  HeartPulse,
  Pill,
  FlaskConical,
  Phone,
  Video,
  CreditCard,
  ShoppingCart,
  Truck,
  Package,
  Wrench,
  HelpCircle,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: string
  userName: string
  userImage?: string
}

// Navigation items for different roles
const navigationItems = {
  SUPER_ADMIN: [
    { name: 'Dashboard', href: '/dashboard/super-admin', icon: LayoutDashboard, current: true },
    { name: 'Analytics', href: '/dashboard/super-admin/analytics', icon: ChartBar },
    { name: 'Manage Admins', href: '/dashboard/super-admin/admins', icon: Users },
    { name: 'Partners', href: '/dashboard/super-admin/partners', icon: Building },
    { name: 'Subscription Plans', href: '/dashboard/super-admin/subscription-plans', icon: CreditCard },
    { name: 'Networks', href: '/dashboard/super-admin/networks', icon: Server },
    { name: 'Database', href: '/dashboard/super-admin/database', icon: Database },
    { name: 'System Status', href: '/dashboard/super-admin/system-status', icon: Server },
    { name: 'Security', href: '/dashboard/super-admin/security', icon: Lock },
    { name: 'Settings', href: '/dashboard/super-admin/settings', icon: Settings },
  ],
  ADMIN: [
    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard, current: true },
    { name: 'Patients', href: '/dashboard/admin/patients', icon: UserCheck },
    { name: 'Organizations', href: '/dashboard/admin/organizations', icon: Building },
    { name: 'Control Room', href: '/dashboard/admin/control-room', icon: Monitor },
    { name: 'Attendants', href: '/dashboard/admin/attendants', icon: Users2 },
    { name: 'Doctors', href: '/dashboard/admin/doctors', icon: Stethoscope },
    { name: 'Partners', href: '/dashboard/admin/partners', icon: Building },
    { name: 'Analytics', href: '/dashboard/admin/analytics', icon: ChartBar },
    { name: 'Subscription Requests', href: '/dashboard/admin/subscription-requests', icon: Clipboard },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ],
  DOCTOR: [
    { name: 'Dashboard', href: '/dashboard/doctor', icon: LayoutDashboard, current: true },
    { name: 'Appointments', href: '/dashboard/doctor/appointments', icon: Calendar },
    { name: 'Consultation', href: '/dashboard/doctor/consultation', icon: Video },
    { name: 'Patients', href: '/dashboard/doctor/patients', icon: UserCheck },
    { name: 'Availability', href: '/dashboard/doctor/schedule', icon: Clock },
    { name: 'Prescriptions', href: '/dashboard/doctor/prescriptions', icon: Pill },
    { name: 'Revenue', href: '/dashboard/doctor/revenue', icon: DollarSign },
    { name: 'Messages', href: '/dashboard/doctor/messages', icon: MessageSquare },
    { name: 'Profile', href: '/dashboard/doctor/profile', icon: User },
  ],
  PATIENT: [
    { name: 'Dashboard', href: '/dashboard/patient', icon: LayoutDashboard, current: true },
    { name: 'Subscription', href: '/dashboard/patient/subscription', icon: CreditCard },
    { name: 'Book Consultation', href: '/dashboard/patient/book-appointment', icon: Calendar },
    { name: 'Patient Journey', href: '/dashboard/patient/journey', icon: Activity },
    { name: 'Appointments', href: '/dashboard/patient/appointments', icon: Calendar },
    { name: 'Referrals', href: '/dashboard/patient/referrals', icon: FileText },
    { name: 'Prescriptions', href: '/dashboard/patient/prescriptions', icon: Pill },
    { name: 'Lab Tests', href: '/dashboard/patient/lab-tests', icon: FlaskConical },
    { name: 'Buy Medicine', href: '/dashboard/patient/buy-medicine', icon: Package },
    { name: 'Health Records', href: '/dashboard/patient/health-records', icon: FileText },
    { name: 'HealthPay Card', href: '/dashboard/patient/health-card', icon: CreditCard },
    { name: 'AI Reports', href: '/dashboard/patient/ai-reports', icon: ChartBar },
    { name: 'Healthcare', href: '/dashboard/patient/directory', icon: Building },
    { name: 'Profile', href: '/dashboard/patient/profile', icon: User },
  ],
  ATTENDANT: [
    { name: 'Dashboard', href: '/dashboard/attendant', icon: LayoutDashboard, current: true },
    { name: 'Patient Registration', href: '/dashboard/attendant/patient-registration', icon: UserCheck },
    { name: 'Appointments', href: '/dashboard/attendant/appointments', icon: Calendar },
    { name: 'Admissions', href: '/dashboard/attendant/admissions', icon: Clipboard },
    { name: 'File Verification', href: '/dashboard/attendant/file-verification', icon: FileText },
    { name: 'Patient Coordination', href: '/dashboard/attendant/patient-coordination', icon: Users2 },
    { name: 'Billing', href: '/dashboard/attendant/billing', icon: CreditCard },
    { name: 'Reports', href: '/dashboard/attendant/reports', icon: ChartBar },
    { name: 'Settings', href: '/dashboard/attendant/settings', icon: Settings },
  ],
  CONTROL_ROOM: [
    { name: 'Dashboard', href: '/dashboard/control-room', icon: LayoutDashboard, current: true },
    { name: 'Live Monitoring', href: '/dashboard/control-room/live-monitoring', icon: Monitor },
    { name: 'Doctor Allocation', href: '/dashboard/control-room/doctor-allocation', icon: Stethoscope },
    { name: 'Emergency Cases', href: '/dashboard/control-room/emergency-cases', icon: AlertTriangle },
    { name: 'Bed Management', href: '/dashboard/control-room/bed-management', icon: Building },
    { name: 'Staff Coordination', href: '/dashboard/control-room/staff-coordination', icon: Users2 },
    { name: 'Equipment Status', href: '/dashboard/control-room/equipment', icon: Wrench },
    { name: 'Ambulance Tracking', href: '/dashboard/control-room/ambulance', icon: Truck },
    { name: 'Emergency Alerts', href: '/dashboard/control-room/alerts', icon: Bell },
    { name: 'Reports', href: '/dashboard/control-room/reports', icon: ChartBar },
  ]
}

export function DashboardLayout({ children, userRole, userName, userImage }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/auth/signin')
  }

  const navigation = navigationItems[userRole as keyof typeof navigationItems] || []

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex-shrink-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-health-primary rounded-lg flex items-center justify-center">
                <HeartPulse className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Fitwell</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userImage} />
                <AvatarFallback className="bg-health-primary text-white">{userName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userName}
                </p>
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  {userRole?.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    item.current
                      ? "bg-health-primary text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Sign out button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-4 text-gray-600 hover:text-gray-900"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                {userRole?.replace('_', ' ')} Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {userRole === 'PATIENT' && (
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-health-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
                </Button>
              )}
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}