"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Search, 
  Plus, 
  UserCheck, 
  Stethoscope, 
  Activity, 
  Calendar,
  Shield,
  Mail,
  Phone,
  MapPin,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter
} from "lucide-react"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  isActive: boolean
  createdAt: string
  lastLogin?: string
  profile?: {
    specialization?: string
    experience?: number
    licenseNumber?: string
    dateOfBirth?: string
    gender?: string
    bloodGroup?: string
    address?: string
    city?: string
  }
}

export default function AdminUsers() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (session.user?.role !== "ADMIN") {
      router.push("/dashboard")
      return
    }

    fetchUsers()
  }, [session, status, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        const formattedUsers = data.users.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          profile: user.profile ? {
            specialization: user.doctor?.specialization,
            experience: user.doctor?.experience,
            licenseNumber: user.doctor?.licenseNumber,
            dateOfBirth: user.profile.dateOfBirth,
            gender: user.profile.gender,
            bloodGroup: user.profile.bloodGroup,
            address: user.profile.address,
            city: user.profile.city
          } : undefined
        }))
        setUsers(formattedUsers)
      } else {
        toast.error('Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout userRole={UserRole.ADMIN}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  )

  const doctors = filteredUsers.filter(u => u.role === UserRole.DOCTOR)
  const patients = filteredUsers.filter(u => u.role === UserRole.PATIENT)
  const attendants = filteredUsers.filter(u => u.role === UserRole.ATTENDANT)
  const activeUsers = filteredUsers.filter(u => u.isActive)
  const inactiveUsers = filteredUsers.filter(u => !u.isActive)

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.DOCTOR:
        return "bg-blue-100 text-blue-800"
      case UserRole.PATIENT:
        return "bg-emerald-100 text-emerald-800"
      case UserRole.ATTENDANT:
        return "bg-purple-100 text-purple-800"
      case UserRole.ADMIN:
        return "bg-orange-100 text-orange-800"
      case UserRole.SUPER_ADMIN:
        return "bg-red-100 text-red-800"
      case UserRole.CONTROL_ROOM:
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.DOCTOR:
        return <Stethoscope className="h-4 w-4" />
      case UserRole.PATIENT:
        return <UserCheck className="h-4 w-4" />
      case UserRole.ATTENDANT:
        return <Activity className="h-4 w-4" />
      case UserRole.ADMIN:
        return <Shield className="h-4 w-4" />
      case UserRole.SUPER_ADMIN:
        return <Shield className="h-4 w-4" />
      case UserRole.CONTROL_ROOM:
        return <Calendar className="h-4 w-4" />
      default:
        return <UserCheck className="h-4 w-4" />
    }
  }

  const getRoleDisplay = (role: UserRole) => {
    switch (role) {
      case UserRole.DOCTOR:
        return "Doctor"
      case UserRole.PATIENT:
        return "Patient"
      case UserRole.ATTENDANT:
        return "Attendant"
      case UserRole.ADMIN:
        return "Admin"
      case UserRole.SUPER_ADMIN:
        return "Super Admin"
      case UserRole.CONTROL_ROOM:
        return "Control Room"
      default:
        return role
    }
  }

  const UserCard = ({ user }: { user: User }) => {
    return (
      <Card className="border-emerald-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.phone && (
                    <p className="text-sm text-gray-600">{user.phone}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getRoleColor(user.role)}>
                    <div className="flex items-center space-x-1">
                      {getRoleIcon(user.role)}
                      <span>{getRoleDisplay(user.role)}</span>
                    </div>
                  </Badge>
                  <Badge className={user.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              {user.profile && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {user.role === UserRole.DOCTOR && (
                    <>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Specialization</p>
                        <p className="text-sm text-gray-900">{user.profile.specialization}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Experience</p>
                        <p className="text-sm text-gray-900">{user.profile.experience} years</p>
                      </div>
                    </>
                  )}
                  {user.profile.dateOfBirth && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                      <p className="text-sm text-gray-900">{user.profile.dateOfBirth}</p>
                    </div>
                  )}
                  {user.profile.gender && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Gender</p>
                      <p className="text-sm text-gray-900">{user.profile.gender}</p>
                    </div>
                  )}
                  {user.profile.city && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Location</p>
                      <p className="text-sm text-gray-900 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {user.profile.city}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-600">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  {user.lastLogin && (
                    <p className="text-gray-600">
                      Last login: {new Date(user.lastLogin).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2 ml-4">
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => router.push(`/dashboard/admin/users/${user.id}`)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <DashboardLayout userRole={UserRole.ADMIN}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">
              Manage all users in your healthcare network
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Doctors</p>
                  <p className="text-2xl font-bold text-gray-900">{doctors.length}</p>
                </div>
                <Stethoscope className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Patients</p>
                  <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Attendants</p>
                  <p className="text-2xl font-bold text-gray-900">{attendants.length}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{activeUsers.length}</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="border-emerald-200">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-emerald-200 focus:border-emerald-400"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-emerald-100">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              All ({filteredUsers.length})
            </TabsTrigger>
            <TabsTrigger 
              value="doctors" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Doctors ({doctors.length})
            </TabsTrigger>
            <TabsTrigger 
              value="patients" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Patients ({patients.length})
            </TabsTrigger>
            <TabsTrigger 
              value="attendants" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Attendants ({attendants.length})
            </TabsTrigger>
            <TabsTrigger 
              value="inactive" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Inactive ({inactiveUsers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredUsers.length > 0 ? (
              <div className="grid gap-4">
                {filteredUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No users found
                  </h3>
                  <p className="text-gray-600 text-center">
                    {searchTerm ? 'No users match your search criteria.' : 'You have no users in your network yet.'}
                  </p>
                  <Button 
                    className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add First User
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="doctors" className="space-y-4">
            {doctors.length > 0 ? (
              <div className="grid gap-4">
                {doctors.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Stethoscope className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No doctors found
                  </h3>
                  <p className="text-gray-600 text-center">
                    You have no doctors in your network yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            {patients.length > 0 ? (
              <div className="grid gap-4">
                {patients.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <UserCheck className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No patients found
                  </h3>
                  <p className="text-gray-600 text-center">
                    You have no patients in your network yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="attendants" className="space-y-4">
            {attendants.length > 0 ? (
              <div className="grid gap-4">
                {attendants.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Activity className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No attendants found
                  </h3>
                  <p className="text-gray-600 text-center">
                    You have no attendants in your network yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            {inactiveUsers.length > 0 ? (
              <div className="grid gap-4">
                {inactiveUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Shield className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No inactive users
                  </h3>
                  <p className="text-gray-600 text-center">
                    All users are currently active.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}