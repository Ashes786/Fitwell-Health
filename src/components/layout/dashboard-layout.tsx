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

// Navigation items for different roles - updated with correct unified routes
const navigationItems = {
  SUPER_ADMIN: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBar },
    { name: 'Manage Admins', href: '/dashboard/admins', icon: Users },
    { name: 'Partners', href: '/dashboard/partners', icon: Building },
    { name: 'Subscription Plans', href: '/dashboard/subscription-plans', icon: CreditCard },
    { name: 'Networks', href: '/dashboard/networks', icon: Server },
    { name: 'Database', href: '/dashboard/database', icon: Database },
    { name: 'System Status', href: '/dashboard/system-status', icon: Server },
    { name: 'Security', href: '/dashboard/security', icon: Lock },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ],
  ADMIN: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Patients', href: '/dashboard/patients', icon: UserCheck },
    { name: 'Organizations', href: '/dashboard/organizations', icon: Building },
    { name: 'Control Room', href: '/dashboard/control-room', icon: Monitor },
    { name: 'Attendants', href: '/dashboard/attendants', icon: Users2 },
    { name: 'Doctors', href: '/dashboard/doctors', icon: Stethoscope },
    { name: 'Partners', href: '/dashboard/partners', icon: Building },
    { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBar },
    { name: 'Subscription Requests', href: '/dashboard/subscription-requests', icon: Clipboard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ],
  DOCTOR: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'Consultation', href: '/dashboard/consultation', icon: Video },
    { name: 'Patients', href: '/dashboard/patients', icon: UserCheck },
    { name: 'Schedule', href: '/dashboard/schedule', icon: Clock },
    { name: 'Prescriptions', href: '/dashboard/prescriptions', icon: Pill },
    { name: 'Revenue', href: '/dashboard/revenue', icon: DollarSign },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ],
  PATIENT: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Subscription', href: '/dashboard/subscription', icon: CreditCard },
    { name: 'Book Consultation', href: '/dashboard/book-appointment', icon: Calendar },
    { name: 'Patient Journey', href: '/dashboard/journey', icon: Activity },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'Health Records', href: '/dashboard/health-records', icon: FileText },
    { name: 'Prescriptions', href: '/dashboard/prescriptions', icon: Pill },
    { name: 'Lab Tests', href: '/dashboard/lab-tests', icon: FlaskConical },
    { name: 'Buy Medicine', href: '/dashboard/cart', icon: Package },
    { name: 'HealthPay Card', href: '/dashboard/health-card', icon: CreditCard },
    { name: 'AI Reports', href: '/dashboard/ai-reports', icon: ChartBar },
    { name: 'Healthcare', href: '/dashboard/directory', icon: Building },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ],
  ATTENDANT: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Patient Registration', href: '/dashboard/register-patient', icon: UserCheck },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'Patients', href: '/dashboard/patients', icon: Users2 },
    { name: 'Reports', href: '/dashboard/reports', icon: ChartBar },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ],
  CONTROL_ROOM: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Live Monitoring', href: '/dashboard/control-room', icon: Monitor },
    { name: 'Doctor Assignment', href: '/dashboard/doctor-assignment', icon: Stethoscope },
    { name: 'Emergency Cases', href: '/dashboard/emergency-cases', icon: AlertTriangle },
    { name: 'Bed Management', href: '/dashboard/bed-management', icon: Building },
    { name: 'Staff Coordination', href: '/dashboard/staff-coordination', icon: Users2 },
    { name: 'Equipment Status', href: '/dashboard/equipment-status', icon: Wrench },
    { name: 'Ambulance Tracking', href: '/dashboard/ambulance-tracking', icon: Truck },
    { name: 'Emergency Alerts', href: '/dashboard/emergency-alerts', icon: Bell },
    { name: 'Reports', href: '/dashboard/reports', icon: ChartBar },
  ]
}

export function DashboardLayout({ children, userRole, userName, userImage }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true) // Start with sidebar open
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
                  onClick={(e) => {
                    // Only close sidebar on mobile
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false)
                    }
                  }}
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
                className="mr-4 text-gray-600 hover:text-gray-900"
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
        <main className={cn(
          "flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-auto transition-all duration-300",
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
        )}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}