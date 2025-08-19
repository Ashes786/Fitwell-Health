"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  FileText, 
  Heart, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  Bell,
  Users,
  Activity,
  Building2,
  Shield,
  Stethoscope,
  UserCheck,
  Monitor,
  Mail,
  Phone,
  MapPin,
  Clock,
  BadgeCheck,
  BarChart3,
  CreditCard
} from "lucide-react"
import { UserRole } from "@prisma/client"
import { hasPermission } from "@/lib/rbac"
import { NotificationSystem } from "@/components/notifications/notification-system"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: UserRole
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/auth/signin" })
    } catch (error) {
      console.error('Error signing out:', error)
      // Fallback: force redirect to signin page
      router.push('/auth/signin')
    }
  }

  const getNavigationItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        href: `/dashboard/${userRole.toLowerCase()}`,
        icon: LayoutDashboard,
        permission: "view_dashboard"
      }
    ]

    const roleSpecificItems: Array<{ title: string; href: string; icon: any; permission: string }> = []

    switch (userRole) {
      case "PATIENT":
        roleSpecificItems.push(
          {
            title: "Appointments",
            href: "/dashboard/patient/appointments",
            icon: Calendar,
            permission: "view_own_appointments"
          },
          {
            title: "Health Records",
            href: "/dashboard/patient/health-records",
            icon: FileText,
            permission: "view_own_health_records"
          },
          {
            title: "Billing",
            href: "/dashboard/patient/billing",
            icon: CreditCard,
            permission: "view_own_billing"
          }
        )
        break
      case "DOCTOR":
        roleSpecificItems.push(
          {
            title: "Appointments",
            href: "/dashboard/doctor/appointments",
            icon: Calendar,
            permission: "view_appointments"
          },
          {
            title: "Patients",
            href: "/dashboard/doctor/patients",
            icon: Users,
            permission: "view_patients"
          },
          {
            title: "Schedule",
            href: "/dashboard/doctor/schedule",
            icon: Clock,
            permission: "manage_schedule"
          }
        )
        break
      case "ATTENDANT":
        roleSpecificItems.push(
          {
            title: "Appointments",
            href: "/dashboard/attendant/appointments",
            icon: Calendar,
            permission: "view_appointments"
          },
          {
            title: "Patients",
            href: "/dashboard/attendant/patients",
            icon: Users,
            permission: "view_patients"
          },
          {
            title: "Registration",
            href: "/dashboard/attendant/registration",
            icon: UserCheck,
            permission: "register_patients"
          }
        )
        break
      case "CONTROL_ROOM":
        roleSpecificItems.push(
          {
            title: "Live Appointments",
            href: "/dashboard/control-room/live-appointments",
            icon: Monitor,
            permission: "monitor_appointments"
          },
          {
            title: "All Appointments",
            href: "/dashboard/control-room/all-appointments",
            icon: Calendar,
            permission: "view_all_appointments"
          },
          {
            title: "Analytics",
            href: "/dashboard/control-room/analytics",
            icon: BarChart3,
            permission: "view_analytics"
          }
        )
        break
      case "ADMIN":
        // For admin, show only network-relevant features
        roleSpecificItems.push(
          {
            title: "Patients",
            href: "/dashboard/admin/patients",
            icon: Users,
            permission: "manage_patients"
          },
          {
            title: "Users",
            href: "/dashboard/admin/users",
            icon: Users,
            permission: "manage_users"
          },
          {
            title: "Analytics",
            href: "/dashboard/admin/analytics",
            icon: BarChart3,
            permission: "view_analytics"
          },
          {
            title: "Partners",
            href: "/dashboard/admin/partners",
            icon: Building2,
            permission: "manage_partners"
          },
          {
            title: "Subscriptions",
            href: "/dashboard/admin/subscription-plans",
            icon: Activity,
            permission: "manage_subscriptions"
          },
          {
            title: "Organizations",
            href: "/dashboard/admin/organizations",
            icon: Building2,
            permission: "manage_organizations"
          },
          {
            title: "Network",
            href: "/dashboard/admin/network",
            icon: Users,
            permission: "manage_users"
          },
          {
            title: "Audit Logs",
            href: "/dashboard/admin/audit-logs",
            icon: Activity,
            permission: "manage_users"
          },
          {
            title: "Notifications",
            href: "/dashboard/admin/notifications",
            icon: Bell,
            permission: "manage_users"
          }
        )
        break
    }

    // Always add settings for all roles
    roleSpecificItems.push(
      {
        title: "Settings",
        href: `/dashboard/${userRole.toLowerCase()}/settings`,
        icon: Settings,
        permission: "view_own_profile"
      }
    )

    return [...baseItems, ...roleSpecificItems].filter(item => 
      hasPermission(userRole, item.permission)
    )
  }

  const navigationItems = getNavigationItems()
  const userInitials = session?.user?.name 
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : session?.user?.email?.[0]?.toUpperCase() || 'U'

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case "PATIENT": return "Patient"
      case "DOCTOR": return "Doctor"
      case "ATTENDANT": return "Attendant"
      case "CONTROL_ROOM": return "Control Room"
      case "ADMIN": return "Administrator"
      default: return role
    }
  }

  const Navigation = ({ mobile = false }) => (
    <nav className={`space-y-1 ${mobile ? 'mt-6' : ''}`}>
      {navigationItems.map((item, index) => {
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${mobile
              ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            } hover:scale-105 hover:shadow-md`}
            onClick={() => mobile && setIsMobileMenuOpen(false)}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden text-health-primary hover:bg-health-light/20">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 bg-gradient-to-b from-white to-health-light/10">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-8 h-8 gradient-health rounded-lg flex items-center justify-center">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold gradient-health bg-clip-text text-transparent">Fitwell</span>
                  </div>
                  <Navigation mobile />
                </SheetContent>
              </Sheet>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 gradient-health rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold gradient-health bg-clip-text text-transparent">Fitwell</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <NotificationSystem />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-health-primary/20 hover:border-health-primary/40 transition-all duration-200">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={session?.user?.image || ''} />
                      <AvatarFallback className="bg-health-primary text-white text-sm font-medium">{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 backdrop-blur-sm bg-white/95 border border-health-primary/20 shadow-health-lg" align="end">
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={session?.user?.image || ''} />
                        <AvatarFallback className="bg-health-primary text-white text-lg font-medium">{userInitials}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold text-health-dark">{session?.user?.name || 'User'}</p>
                        <p className="text-xs text-health-primary">{session?.user?.email}</p>
                        <Badge variant="secondary" className="w-fit bg-health-light text-health-dark border-health-primary/30">
                          {getRoleDisplayName(userRole)}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Additional Profile Details */}
                    <div className="mt-4 pt-4 border-t border-health-primary/10 space-y-2">
                      <div className="flex items-center space-x-2 text-xs text-health-muted">
                        <Mail className="h-3 w-3" />
                        <span>{session?.user?.email || 'No email provided'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-health-muted">
                        <Clock className="h-3 w-3" />
                        <span>Last login: {new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-health-muted">
                        <BadgeCheck className="h-3 w-3 text-health-primary" />
                        <span>Verified account</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-health-primary/10" />
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/${userRole.toLowerCase()}/settings`)} className="text-health-dark hover:bg-health-light/20 hover:text-health-primary">
                    <User className="mr-2 h-4 w-4" />
                    <div>
                      <p className="font-medium">Profile Settings</p>
                      <p className="text-xs text-health-muted">Manage your profile information</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/${userRole.toLowerCase()}/settings`)} className="text-health-dark hover:bg-health-light/20 hover:text-health-primary">
                    <Settings className="mr-2 h-4 w-4" />
                    <div>
                      <p className="font-medium">Account Settings</p>
                      <p className="text-xs text-health-muted">Preferences and privacy</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/${userRole.toLowerCase()}/notifications`)} className="text-health-dark hover:bg-health-light/20 hover:text-health-primary">
                    <Bell className="mr-2 h-4 w-4" />
                    <div>
                      <p className="font-medium">Notification Settings</p>
                      <p className="text-xs text-health-muted">Manage notification preferences</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-health-primary/10" />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                    <LogOut className="mr-2 h-4 w-4" />
                    <div>
                      <p className="font-medium">Sign out</p>
                      <p className="text-xs text-red-500">You'll need to sign in again</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-gradient-to-b from-white to-health-light/5 shadow-xl border-r border-health-primary/10 min-h-screen">
          <div className="p-6">
            <Navigation />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-health border border-health-primary/10 p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}