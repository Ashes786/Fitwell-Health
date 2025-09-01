'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

// Navigation items for different roles - updated for unified dashboard
const navigationItems = {
  SUPER_ADMIN: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Analytics', href: '/dashboard', icon: ChartBar },
    { name: 'Manage Admins', href: '/dashboard', icon: Users },
    { name: 'Partners', href: '/dashboard', icon: Building },
    { name: 'Subscription Plans', href: '/dashboard', icon: CreditCard },
    { name: 'Networks', href: '/dashboard', icon: Server },
    { name: 'Database', href: '/dashboard', icon: Database },
    { name: 'System Status', href: '/dashboard', icon: Server },
    { name: 'Security', href: '/dashboard', icon: Lock },
    { name: 'Settings', href: '/dashboard', icon: Settings },
  ],
  ADMIN: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Patients', href: '/dashboard', icon: UserCheck },
    { name: 'Organizations', href: '/dashboard', icon: Building },
    { name: 'Control Room', href: '/dashboard', icon: Monitor },
    { name: 'Attendants', href: '/dashboard', icon: Users2 },
    { name: 'Doctors', href: '/dashboard', icon: Stethoscope },
    { name: 'Partners', href: '/dashboard', icon: Building },
    { name: 'Analytics', href: '/dashboard', icon: ChartBar },
    { name: 'Subscription Requests', href: '/dashboard', icon: Clipboard },
    { name: 'Settings', href: '/dashboard', icon: Settings },
  ],
  DOCTOR: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Appointments', href: '/dashboard', icon: Calendar },
    { name: 'Consultation', href: '/dashboard', icon: Video },
    { name: 'Patients', href: '/dashboard', icon: UserCheck },
    { name: 'Availability', href: '/dashboard', icon: Clock },
    { name: 'Prescriptions', href: '/dashboard', icon: Pill },
    { name: 'Revenue', href: '/dashboard', icon: DollarSign },
    { name: 'Messages', href: '/dashboard', icon: MessageSquare },
    { name: 'Profile', href: '/dashboard', icon: User },
  ],
  PATIENT: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Subscription', href: '/dashboard', icon: CreditCard },
    { name: 'Book Consultation', href: '/dashboard', icon: Calendar },
    { name: 'Patient Journey', href: '/dashboard', icon: Activity },
    { name: 'Appointments', href: '/dashboard', icon: Calendar },
    { name: 'Referrals', href: '/dashboard', icon: FileText },
    { name: 'Prescriptions', href: '/dashboard', icon: Pill },
    { name: 'Lab Tests', href: '/dashboard', icon: FlaskConical },
    { name: 'Buy Medicine', href: '/dashboard', icon: Package },
    { name: 'Health Records', href: '/dashboard', icon: FileText },
    { name: 'HealthPay Card', href: '/dashboard', icon: CreditCard },
    { name: 'AI Reports', href: '/dashboard', icon: ChartBar },
    { name: 'Healthcare', href: '/dashboard', icon: Building },
    { name: 'Profile', href: '/dashboard', icon: User },
  ],
  ATTENDANT: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Patient Registration', href: '/dashboard', icon: UserCheck },
    { name: 'Appointments', href: '/dashboard', icon: Calendar },
    { name: 'Admissions', href: '/dashboard', icon: Clipboard },
    { name: 'File Verification', href: '/dashboard', icon: FileText },
    { name: 'Patient Coordination', href: '/dashboard', icon: Users2 },
    { name: 'Billing', href: '/dashboard', icon: CreditCard },
    { name: 'Reports', href: '/dashboard', icon: ChartBar },
    { name: 'Settings', href: '/dashboard', icon: Settings },
  ],
  CONTROL_ROOM: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Live Monitoring', href: '/dashboard', icon: Monitor },
    { name: 'Doctor Allocation', href: '/dashboard', icon: Stethoscope },
    { name: 'Emergency Cases', href: '/dashboard', icon: AlertTriangle },
    { name: 'Bed Management', href: '/dashboard', icon: Building },
    { name: 'Staff Coordination', href: '/dashboard', icon: Users2 },
    { name: 'Equipment Status', href: '/dashboard', icon: Wrench },
    { name: 'Ambulance Tracking', href: '/dashboard', icon: Truck },
    { name: 'Emergency Alerts', href: '/dashboard', icon: Bell },
    { name: 'Reports', href: '/dashboard', icon: ChartBar },
  ]
}

export function DashboardLayout({ children, userRole, userName, userImage }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { signOut } = useCustomSignOut()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
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