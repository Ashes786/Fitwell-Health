'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useCustomSignOut } from '@/hooks/use-custom-signout'
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

// Navigation items for different roles - updated with correct routes
const navigationItems = {
  SUPER_ADMIN: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
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
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
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
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Appointments', href: '/dashboard/doctor/appointments', icon: Calendar },
    { name: 'Consultation', href: '/dashboard/doctor/consultation', icon: Video },
    { name: 'Patients', href: '/dashboard/doctor/patients', icon: UserCheck },
    { name: 'Schedule', href: '/dashboard/doctor/schedule', icon: Clock },
    { name: 'Prescriptions', href: '/dashboard/doctor/prescriptions', icon: Pill },
    { name: 'Revenue', href: '/dashboard/doctor/revenue', icon: DollarSign },
    { name: 'Messages', href: '/dashboard/doctor/messages', icon: MessageSquare },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ],
  PATIENT: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Subscription', href: '/dashboard/patient/subscription', icon: CreditCard },
    { name: 'Book Consultation', href: '/dashboard/patient/book-appointment', icon: Calendar },
    { name: 'Patient Journey', href: '/dashboard/patient/journey', icon: Activity },
    { name: 'Appointments', href: '/dashboard/patient/appointments', icon: Calendar },
    { name: 'Health Records', href: '/dashboard/patient/health-records', icon: FileText },
    { name: 'Prescriptions', href: '/dashboard/patient/prescriptions', icon: Pill },
    { name: 'Lab Tests', href: '/dashboard/patient/lab-tests', icon: FlaskConical },
    { name: 'Buy Medicine', href: '/dashboard/patient/cart', icon: Package },
    { name: 'HealthPay Card', href: '/dashboard/patient/health-card', icon: CreditCard },
    { name: 'AI Reports', href: '/dashboard/patient/ai-reports', icon: ChartBar },
    { name: 'Healthcare', href: '/dashboard/patient/directory', icon: Building },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ],
  ATTENDANT: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Patient Registration', href: '/dashboard/attendant/register-patient', icon: UserCheck },
    { name: 'Appointments', href: '/dashboard/attendant/appointments', icon: Calendar },
    { name: 'Patients', href: '/dashboard/attendant/patients', icon: Users2 },
    { name: 'Reports', href: '/dashboard/attendant/reports', icon: ChartBar },
    { name: 'Settings', href: '/dashboard/attendant/settings', icon: Settings },
  ],
  CONTROL_ROOM: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Live Monitoring', href: '/dashboard/control-room', icon: Monitor },
    { name: 'Doctor Assignment', href: '/dashboard/control-room/doctor-assignment', icon: Stethoscope },
    { name: 'Emergency Cases', href: '/dashboard/control-room/emergency-cases', icon: AlertTriangle },
    { name: 'Bed Management', href: '/dashboard/control-room/bed-management', icon: Building },
    { name: 'Staff Coordination', href: '/dashboard/control-room/staff-coordination', icon: Users2 },
    { name: 'Equipment Status', href: '/dashboard/control-room/equipment-status', icon: Wrench },
    { name: 'Ambulance Tracking', href: '/dashboard/control-room/ambulance-tracking', icon: Truck },
    { name: 'Emergency Alerts', href: '/dashboard/control-room/emergency-alerts', icon: Bell },
    { name: 'Reports', href: '/dashboard/control-room/reports', icon: ChartBar },
  ]
}

export function DashboardLayout({ children, userRole, userName, userImage }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { signOut } = useCustomSignOut()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
  }

  // Update navigation items with current page detection
  const navigation = navigationItems[userRole as keyof typeof navigationItems]?.map(item => ({
    ...item,
    current: pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
  })) || []

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
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out flex-shrink-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-health-primary rounded-lg flex items-center justify-center">
                <HeartPulse className="h-5 w-5 text-white" />
              </div>
              {sidebarOpen && <span className="text-lg font-bold text-gray-900">Fitwell</span>}
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

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                    item.current
                      ? "bg-health-primary text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={(e) => {
                    // Only close sidebar on mobile
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false)
                    }
                  }}
                  title={!sidebarOpen ? item.name : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Sign out button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100 group"
              onClick={handleSignOut}
              title={!sidebarOpen ? "Sign Out" : undefined}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span className="ml-3">Sign Out</span>}
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
              {/* HAMBURGER MENU - ALWAYS VISIBLE */}
              <Button
                variant="ghost"
                size="sm"
                className="mr-4 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                {userRole?.replace('_', ' ')} Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* User info moved to header */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userImage} />
                  <AvatarFallback className="bg-health-primary text-white">{userName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                    {userRole?.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
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
        <main className={cn(
          "flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-auto transition-all duration-300",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        )}>
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}