"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Activity,
  Stethoscope,
  UserCheck,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Heart,
  Pill,
  FlaskConical
} from "lucide-react"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  isActive: boolean
  createdAt: string
  lastLogin?: string
  profile?: {
    dateOfBirth?: string
    gender?: string
    bloodGroup?: string
    address?: string
    city?: string
    state?: string
    country?: string
    postalCode?: string
  }
  doctor?: {
    licenseNumber: string
    specialization: string
    experience: number
    consultationFee: number
    isAvailable: boolean
    bio?: string
    address?: string
    city?: string
    state?: string
    country?: string
    postalCode?: string
  }
  patient?: {
    nhrNumber?: string
    dateOfBirth?: string
    gender?: string
    bloodGroup?: string
    emergencyContact?: string
    address?: string
    city?: string
    state?: string
    country?: string
    postalCode?: string
  }
  attendant?: {
    employeeId: string
    department?: string
  }
  controlRoom?: {
    employeeId: string
  }
}

interface UserActivity {
  id: string
  type: string
  description: string
  timestamp: string
  status?: string
}

export default function UserDetailPage() {
  const { isAuthorized, isUnauthorized, isLoading, userSession } = useRoleAuthorization({
    requiredRole: "ADMIN",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('id')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [activities, setActivities] = useState<UserActivity[]>([])

  useEffect(() => {
    if (isAuthorized && userId) {
      fetchUserDetails()
    }
  }, [isAuthorized, userId])

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        
        // Mock activities
        setActivities([
          {
            id: "1",
            type: "LOGIN",
            description: "User logged in to the system",
            timestamp: new Date().toISOString(),
            status: "completed"
          },
          {
            id: "2",
            type: "PROFILE_UPDATE",
            description: "User updated profile information",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            status: "completed"
          },
          {
            id: "3",
            type: "APPOINTMENT_BOOKED",
            description: "Booked appointment with Dr. Sarah Johnson",
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            status: "confirmed"
          }
        ])
      } else {
        toast({
        title: "Error",
        description: 'Failed to fetch user details'
      })
        router.push('/dashboard/admin/users')
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
      toast({
        title: "Error",
        description: 'Failed to load user details'
      })
      router.push('/dashboard/admin/users')
    }
  }

  const handleDeleteUser = async () => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
        title: "Success",
        description: 'User deleted successfully'
      })
        router.push('/dashboard/admin/users')
      } else {
        toast({
        title: "Error",
        description: 'Failed to delete user'
      })
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: "Error",
        description: 'Failed to delete user'
      })
    }
  }

  const handleToggleStatus = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !user?.isActive })
      })

      if (response.ok) {
        toast({
        title: "Success",
        description: `User ${user?.isActive ? 'deactivated' : 'activated'} successfully`
      })
        fetchUserDetails()
      } else {
        toast({
        title: "Error",
        description: 'Failed to update user status'
      })
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      toast({
        title: "Error",
        description: 'Failed to update user status'
      })
    }
  }

  if (isLoading) {
    return (
      
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      
    )
  }

  if (!session || !user) {
    return null
  }

  // Show unauthorized message if user doesn't have ADMIN role
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
        return <Clock className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "LOGIN":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "PROFILE_UPDATE":
        return <Edit className="h-4 w-4 text-blue-600" />
      case "APPOINTMENT_BOOKED":
        return <Calendar className="h-4 w-4 text-purple-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard/admin/users')}
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
              <p className="text-gray-600 mt-2">
                View and manage user information
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              onClick={handleToggleStatus}
              className={`${user.isActive ? 'border-red-600 text-red-600 hover:bg-red-50' : 'border-emerald-600 text-emerald-600 hover:bg-emerald-50'}`}
            >
              {user.isActive ? (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Deactivate
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Activate
                </>
              )}
            </Button>
            <Button 
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline"
              onClick={handleDeleteUser}
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* User Overview */}
        <Card className="border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {user.lastLogin && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Last login: {new Date(user.lastLogin).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="bg-emerald-100">
            <TabsTrigger value="profile" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Profile
            </TabsTrigger>
            <TabsTrigger value="role-specific" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              {getRoleDisplay(user.role)} Info
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Activity
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Profile Information</CardTitle>
                <CardDescription>Basic user information and contact details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-sm text-gray-900">{user.email}</p>
                        </div>
                      </div>
                      {user.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-sm text-gray-900">{user.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Location</h4>
                    <div className="space-y-3">
                      {user.profile?.address && (
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="text-sm text-gray-900">{user.profile.address}</p>
                          </div>
                        </div>
                      )}
                      {user.profile?.city && (
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">City</p>
                            <p className="text-sm text-gray-900">{user.profile.city}</p>
                          </div>
                        </div>
                      )}
                      {user.profile?.state && (
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">State</p>
                            <p className="text-sm text-gray-900">{user.profile.state}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="role-specific" className="space-y-4">
            {user.role === UserRole.DOCTOR && user.doctor && (
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Stethoscope className="h-5 w-5 text-blue-600" />
                    <span>Doctor Information</span>
                  </CardTitle>
                  <CardDescription>Professional details and medical practice information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Professional Details</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">License Number</p>
                          <p className="text-sm text-gray-900">{user.doctor.licenseNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Specialization</p>
                          <p className="text-sm text-gray-900">{user.doctor.specialization}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Experience</p>
                          <p className="text-sm text-gray-900">{user.doctor.experience} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Consultation Fee</p>
                          <p className="text-sm text-gray-900">${user.doctor.consultationFee}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Practice Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${user.doctor.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                          <p className="text-sm text-gray-900">
                            {user.doctor.isAvailable ? 'Available' : 'Not Available'}
                          </p>
                        </div>
                        {user.doctor.bio && (
                          <div>
                            <p className="text-sm text-gray-500">Bio</p>
                            <p className="text-sm text-gray-900">{user.doctor.bio}</p>
                          </div>
                        )}
                        {user.doctor.city && (
                          <div>
                            <p className="text-sm text-gray-500">Practice Location</p>
                            <p className="text-sm text-gray-900">{user.doctor.city}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {user.role === UserRole.PATIENT && user.patient && (
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <UserCheck className="h-5 w-5 text-emerald-600" />
                    <span>Patient Information</span>
                  </CardTitle>
                  <CardDescription>Medical and personal health information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
                      <div className="space-y-3">
                        {user.patient.nhrNumber && (
                          <div>
                            <p className="text-sm text-gray-500">NHR Number</p>
                            <p className="text-sm text-gray-900">{user.patient.nhrNumber}</p>
                          </div>
                        )}
                        {user.patient.dateOfBirth && (
                          <div>
                            <p className="text-sm text-gray-500">Date of Birth</p>
                            <p className="text-sm text-gray-900">{new Date(user.patient.dateOfBirth).toLocaleDateString()}</p>
                          </div>
                        )}
                        {user.patient.gender && (
                          <div>
                            <p className="text-sm text-gray-500">Gender</p>
                            <p className="text-sm text-gray-900">{user.patient.gender}</p>
                          </div>
                        )}
                        {user.patient.bloodGroup && (
                          <div>
                            <p className="text-sm text-gray-500">Blood Group</p>
                            <p className="text-sm text-gray-900">{user.patient.bloodGroup}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Emergency Contact</h4>
                      <div className="space-y-3">
                        {user.patient.emergencyContact && (
                          <div>
                            <p className="text-sm text-gray-500">Emergency Contact</p>
                            <p className="text-sm text-gray-900">{user.patient.emergencyContact}</p>
                          </div>
                        )}
                        {user.patient.address && (
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="text-sm text-gray-900">{user.patient.address}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {user.role === UserRole.ATTENDANT && user.attendant && (
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    <span>Attendant Information</span>
                  </CardTitle>
                  <CardDescription>Employee and department information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Employee ID</p>
                      <p className="text-sm text-gray-900">{user.attendant.employeeId}</p>
                    </div>
                    {user.attendant.department && (
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="text-sm text-gray-900">{user.attendant.department}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {user.role === UserRole.CONTROL_ROOM && user.controlRoom && (
              <Card className="border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <span>Control Room Information</span>
                  </CardTitle>
                  <CardDescription>Control room staff information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Employee ID</p>
                      <p className="text-sm text-gray-900">{user.controlRoom.employeeId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
                <CardDescription>User's recent activities and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {activity.status && (
                        <Badge className={
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          activity.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }>
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Security Information</CardTitle>
                <CardDescription>Account security and access details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Account Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Account Status</p>
                          <Badge className={user.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Member Since</p>
                          <p className="text-sm text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Login Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Last Login</p>
                          <p className="text-sm text-gray-900">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never logged in'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    
  )
}