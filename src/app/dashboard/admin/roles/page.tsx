"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Shield, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Activity,
  Calendar,
  CheckCircle,
  XCircle,
  Filter,
  Settings,
  UserCheck,
  Key,
  Lock,
  Unlock,
  Crown,
  Star,
  Clock
} from "lucide-react"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"

interface Permission {
  id: string
  name: string
  description: string
  category: string
}

interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  userCount: number
  isActive: boolean
  isSystemRole: boolean
  createdAt: string
  updatedAt: string
}

interface UserAssignment {
  id: string
  userId: string
  roleId: string
  user: {
    id: string
    name: string
    email: string
    role: UserRole
  }
  role: Role
  assignedAt: string
  expiresAt?: string
  isActive: boolean
}

export default function AdminRoles() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [roles, setRoles] = useState<Role[]>([])
  const [userAssignments, setUserAssignments] = useState<UserAssignment[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissionIds: [] as string[],
    isActive: true
  })
  const [newAssignment, setNewAssignment] = useState({
    userId: "",
    roleId: "",
    expiresAt: ""
  })

  const { isAuthorized, isUnauthorized, isLoading, authSession: authSessionVar } = useRoleAuthorization({
    requiredRole: "ADMIN",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  useEffect(() => {
    if (isAuthorized) {
      // Original fetch logic will be handled separately
    }
  }, [isAuthorized])

  const fetchRoles = async () => {
    try {
      // Mock data - in real app, this would come from API
      const mockRoles: Role[] = [
        {
          id: "1",
          name: "Control Room Operator",
          description: "Manages emergency responses and coordinates hospital resources",
          permissions: [
            { id: "1", name: "View Emergency Cases", description: "Access emergency case information", category: "Emergency" },
            { id: "2", name: "Assign Resources", description: "Assign doctors and resources to emergencies", category: "Emergency" },
            { id: "3", name: "Monitor System Status", description: "View system health and performance", category: "System" }
          ],
          userCount: 3,
          isActive: true,
          isSystemRole: false,
          createdAt: "2023-08-20T14:30:00Z",
          updatedAt: "2024-01-10T09:15:00Z"
        },
        {
          id: "2",
          name: "Senior Attendant",
          description: "Experienced attendant with additional permissions for complex cases",
          permissions: [
            { id: "4", name: "Manage Patient Records", description: "Full access to patient management", category: "Patients" },
            { id: "5", name: "Schedule Appointments", description: "Schedule and manage appointments", category: "Appointments" },
            { id: "6", name: "Process Payments", description: "Handle payment processing", category: "Billing" }
          ],
          userCount: 5,
          isActive: true,
          isSystemRole: false,
          createdAt: "2023-09-05T11:00:00Z",
          updatedAt: "2024-01-11T16:45:00Z"
        },
        {
          id: "3",
          name: "Network Coordinator",
          description: "Coordinates between different healthcare providers in the network",
          permissions: [
            { id: "7", name: "Manage Partners", description: "Manage laboratory and pharmacy partners", category: "Partners" },
            { id: "8", name: "View Analytics", description: "Access network analytics and reports", category: "Analytics" },
            { id: "9", name: "Coordinate Care", description: "Coordinate patient care across providers", category: "Care Coordination" }
          ],
          userCount: 2,
          isActive: true,
          isSystemRole: false,
          createdAt: "2023-10-15T15:30:00Z",
          updatedAt: "2023-12-20T10:00:00Z"
        }
      ]

      setRoles(mockRoles)
    } catch (error) {
      console.error('Error fetching roles:', error)
      toast({
        title: "Error",
        description: 'Failed to load roles'
      })
    }
  }

  const fetchUserAssignments = async () => {
    try {
      // Mock data - in real app, this would come from API
      const mockAssignments: UserAssignment[] = [
        {
          id: "1",
          userId: "user1",
          roleId: "1",
          user: {
            id: "user1",
            name: "John Smith",
            email: "john.smith@healthpay.com",
            role: UserRole.CONTROL_ROOM
          },
          role: {
            id: "1",
            name: "Control Room Operator",
            description: "Manages emergency responses and coordinates hospital resources",
            permissions: [],
            userCount: 3,
            isActive: true,
            isSystemRole: false,
            createdAt: "2023-08-20T14:30:00Z",
            updatedAt: "2024-01-10T09:15:00Z"
          },
          assignedAt: "2023-08-20T14:30:00Z",
          isActive: true
        },
        {
          id: "2",
          userId: "user2",
          roleId: "2",
          user: {
            id: "user2",
            name: "Emily Brown",
            email: "emily.brown@healthpay.com",
            role: UserRole.ATTENDANT
          },
          role: {
            id: "2",
            name: "Senior Attendant",
            description: "Experienced attendant with additional permissions for complex cases",
            permissions: [],
            userCount: 5,
            isActive: true,
            isSystemRole: false,
            createdAt: "2023-09-05T11:00:00Z",
            updatedAt: "2024-01-11T16:45:00Z"
          },
          assignedAt: "2023-09-05T11:00:00Z",
          isActive: true
        }
      ]

      setUserAssignments(mockAssignments)
    } catch (error) {
      console.error('Error fetching user assignments:', error)
      toast({
        title: "Error",
        description: 'Failed to load user assignments'
      })
    }
  }

  const fetchPermissions = async () => {
    try {
      // Mock data - in real app, this would come from API
      const mockPermissions: Permission[] = [
        { id: "1", name: "View Emergency Cases", description: "Access emergency case information", category: "Emergency" },
        { id: "2", name: "Assign Resources", description: "Assign doctors and resources to emergencies", category: "Emergency" },
        { id: "3", name: "Monitor System Status", description: "View system health and performance", category: "System" },
        { id: "4", name: "Manage Patient Records", description: "Full access to patient management", category: "Patients" },
        { id: "5", name: "Schedule Appointments", description: "Schedule and manage appointments", category: "Appointments" },
        { id: "6", name: "Process Payments", description: "Handle payment processing", category: "Billing" },
        { id: "7", name: "Manage Partners", description: "Manage laboratory and pharmacy partners", category: "Partners" },
        { id: "8", name: "View Analytics", description: "Access network analytics and reports", category: "Analytics" },
        { id: "9", name: "Coordinate Care", description: "Coordinate patient care across providers", category: "Care Coordination" }
      ]

      setPermissions(mockPermissions)
    } catch (error) {
      console.error('Error fetching permissions:', error)
    }
  }

  const handleAddRole = async () => {
    try {
      // In real app, this would be an API call
      const selectedPermissions = permissions.filter(p => newRole.permissionIds.includes(p.id))
      
      const newRoleData: Role = {
        id: Date.now().toString(),
        name: newRole.name,
        description: newRole.description,
        permissions: selectedPermissions,
        userCount: 0,
        isActive: newRole.isActive,
        isSystemRole: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setRoles([...roles, newRoleData])
      setNewRole({
        name: "",
        description: "",
        permissionIds: [],
        isActive: true
      })
      setIsAddRoleDialogOpen(false)
      toast({
        title: "Success",
        description: 'Role created successfully'
      })
    } catch (error) {
      console.error('Error adding role:', error)
      toast({
        title: "Error",
        description: 'Failed to create role'
      })
    }
  }

  const handleAssignRole = async () => {
    try {
      // In real app, this would be an API call
      const selectedRole = roles.find(r => r.id === newAssignment.roleId)
      if (!selectedRole) {
        toast({
        title: "Error",
        description: 'Please select a role'
      })
        return
      }

      const newAssignmentData: UserAssignment = {
        id: Date.now().toString(),
        userId: newAssignment.userId,
        roleId: newAssignment.roleId,
        user: {
          id: newAssignment.userId,
          name: "New User",
          email: "newuser@example.com",
          role: UserRole.ATTENDANT
        },
        role: selectedRole,
        assignedAt: new Date().toISOString(),
        expiresAt: newAssignment.expiresAt || undefined,
        isActive: true
      }

      setUserAssignments([...userAssignments, newAssignmentData])
      setNewAssignment({
        userId: "",
        roleId: "",
        expiresAt: ""
      })
      setIsAssignDialogOpen(false)
      toast({
        title: "Success",
        description: 'Role assigned successfully'
      })
    } catch (error) {
      console.error('Error assigning role:', error)
      toast({
        title: "Error",
        description: 'Failed to assign role'
      })
    }
  }

  if (isLoading || isDataLoading) {
    return (
      
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      
    )
  }

  if (!session) {
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

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeRoles = filteredRoles.filter(r => r.isActive)
  const inactiveRoles = filteredRoles.filter(r => !r.isActive)
  const customRoles = filteredRoles.filter(r => !r.isSystemRole)

  const RoleCard = ({ role }: { role: Role }) => {
    return (
      <Card className="border-emerald-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{role.name}</h3>
                    <Badge className={role.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"}>
                      {role.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {role.isSystemRole && (
                      <Badge className="bg-blue-100 text-blue-800">
                        System Role
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{role.userCount} users assigned</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{role.description}</p>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Permissions ({role.permissions.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {permission.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-600">
                    Created: {new Date(role.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2 ml-4">
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => router.push(`/dashboard/admin/roles/${role.id}`)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
              {!role.isSystemRole && (
                <>
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
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const AssignmentCard = ({ assignment }: { assignment: UserAssignment }) => {
    return (
      <Card className="border-blue-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{assignment.user.name}</h3>
                    <Badge className={assignment.isActive ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                      {assignment.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{assignment.user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Role</p>
                  <p className="text-sm font-medium text-gray-900">{assignment.role.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Assigned</p>
                  <p className="text-sm text-gray-900">{new Date(assignment.assignedAt).toLocaleDateString()}</p>
                </div>
                {assignment.expiresAt && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Expires</p>
                    <p className="text-sm text-gray-900">{new Date(assignment.expiresAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-2 ml-4">
              <Button 
                size="sm" 
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Assignment
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
            <p className="text-gray-600 mt-2">
              Create custom roles and manage user permissions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Assign Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Role to User</DialogTitle>
                  <DialogDescription>
                    Assign a custom role to a user in your network
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="userId">User</Label>
                    <Select value={newAssignment.userId} onValueChange={(value) => setNewAssignment({...newAssignment, userId: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user1">John Smith (Control Room)</SelectItem>
                        <SelectItem value="user2">Emily Brown (Attendant)</SelectItem>
                        <SelectItem value="user3">Michael Chen (Doctor)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="roleId">Role</Label>
                    <Select value={newAssignment.roleId} onValueChange={(value) => setNewAssignment({...newAssignment, roleId: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {customRoles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                    <Input
                      id="expiresAt"
                      type="date"
                      value={newAssignment.expiresAt}
                      onChange={(e) => setNewAssignment({...newAssignment, expiresAt: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAssignRole} disabled={!newAssignment.userId || !newAssignment.roleId}>
                      Assign Role
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>
                    Create a custom role with specific permissions
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Role Name *</Label>
                      <Input
                        id="name"
                        value={newRole.name}
                        onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                        placeholder="Control Room Operator"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={newRole.isActive}
                        onCheckedChange={(checked) => setNewRole({...newRole, isActive: checked})}
                      />
                      <Label htmlFor="isActive">Active Role</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newRole.description}
                      onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                      placeholder="Manages emergency responses and coordinates hospital resources..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Permissions</Label>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`permission-${permission.id}`}
                            checked={newRole.permissionIds.includes(permission.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewRole({...newRole, permissionIds: [...newRole.permissionIds, permission.id]})
                              } else {
                                setNewRole({...newRole, permissionIds: newRole.permissionIds.filter(id => id !== permission.id)})
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={`permission-${permission.id}`} className="text-sm">
                            {permission.name} - {permission.category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddRole} disabled={!newRole.name || !newRole.description}>
                      Create Role
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Roles</p>
                  <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
                </div>
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Roles</p>
                  <p className="text-2xl font-bold text-gray-900">{activeRoles.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Custom Roles</p>
                  <p className="text-2xl font-bold text-gray-900">{customRoles.length}</p>
                </div>
                <Settings className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                  <p className="text-2xl font-bold text-gray-900">{userAssignments.length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="roles" className="space-y-4">
          <TabsList className="bg-emerald-100">
            <TabsTrigger value="roles" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Roles ({filteredRoles.length})
            </TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              User Assignments ({userAssignments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="space-y-4">
            {/* Search Bar */}
            <Card className="border-emerald-200">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search roles by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-emerald-200 focus:border-emerald-400"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {filteredRoles.map((role) => (
                <RoleCard key={role.id} role={role} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <div className="grid gap-4">
              {userAssignments.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    
  )
}