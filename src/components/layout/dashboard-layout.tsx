'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useCustomSignOut } from '@/hooks/use-custom-signout'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

// Unified navigation items for all roles - simplified structure
const navigationItems = {
  SUPER_ADMIN: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBar },
    { name: 'Manage Admins', href: '/dashboard/admins', icon: Users },
    { name: 'Partners', href: '/dashboard/partners', icon: Building },
    { name: 'Subscription Plans', href: '/dashboard/subscription-plans', icon: CreditCard },
    { name: 'Networks', href: '/dashboard/network', icon: Server },
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
    { name: 'Hospital Treatments', href: '/dashboard/hospital-treatments', icon: HeartPulse },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Roles', href: '/dashboard/roles', icon: Shield },
    { name: 'Network', href: '/dashboard/network', icon: Server },
    { name: 'Audit Logs', href: '/dashboard/audit-logs', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ],
  DOCTOR: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Appointments', href: '/dashboard/appointments-doctor', icon: Calendar },
    { name: 'Consultation', href: '/dashboard/consultation', icon: Video },
    { name: 'Patients', href: '/dashboard/patients-doctor', icon: UserCheck },
    { name: 'Schedule', href: '/dashboard/schedule', icon: Clock },
    { name: 'Prescriptions', href: '/dashboard/prescriptions-doctor', icon: Pill },
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
    { name: 'Vitals', href: '/dashboard/vitals', icon: HeartPulse },
    { name: 'Recommendations', href: '/dashboard/recommendations', icon: TrendingUp },
    { name: 'Billing', href: '/dashboard/billing', icon: DollarSign },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ],
  ATTENDANT: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Patient Registration', href: '/dashboard/register-patient', icon: UserCheck },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'Patients', href: '/dashboard/attendants', icon: Users2 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ],
  CONTROL_ROOM: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Live Monitoring', href: '/dashboard/monitoring', icon: Monitor },
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
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 relative p-2">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </Button>
              
              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={userImage} alt={userName} />
                      <AvatarFallback className="bg-health-primary text-white text-sm">{userName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userRole?.replace('_', ' ')}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/billing" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/help" className="flex items-center">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help & Support</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Cart for patients */}
              {userRole === 'PATIENT' && (
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 relative p-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-health-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={cn(
          "flex-1 p-2 sm:p-4 bg-gray-50 overflow-auto transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-0"
        )}>
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}