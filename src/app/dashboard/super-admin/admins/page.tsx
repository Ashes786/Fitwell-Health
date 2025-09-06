'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  UserCheck,
  UserX,
  Edit,
  Trash2
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserRole } from "@prisma/client"

interface Admin {
  id: string
  user: {
    id: string
    name: string
    email: string
    phone?: string
    isActive: boolean
  }
  networkName: string
  isActive: boolean
  createdAt: string
  permissions?: string[]
}

export default function AdminsPage() {
  const { isUnauthorized, isLoading, session } = useRoleAuthorization({
    requiredRole: "SUPER_ADMIN",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: false
  })
  
  const router = useRouter()
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isLoading) return

    if (!session) {
      return
    }

    const fetchAdmins = async () => {
      try {
        const response = await fetch('/api/super-admin/admins')
        if (response.ok) {
          const data = await response.json()
          setAdmins(data)
        } else {
          toast({
        title: "Error",
        description: 'Failed to fetch admins'
      })
        }
      } catch (error) {
        console.error('Error fetching admins:', error)
        toast({
        title: "Error",
        description: 'Failed to fetch admins'
      })
      } finally {
        setLoading(false)
      }
    }

    fetchAdmins()
  }, [session, isLoading])

  // Show unauthorized message if user doesn't have SUPER_ADMIN role
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

  // Show loading state
  if (loading) {
    return (
      
        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Admins</h1>
              <p className="text-gray-600 mt-1">Manage system administrators and their permissions</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-6 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      
    )
  }

  const filteredAdmins = admins.filter(admin =>
    admin.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.networkName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleAdminStatus = async (adminId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/super-admin/admins/${adminId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        toast({
        title: "Success",
        description: `Admin ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      })
        setAdmins(admins.map(admin => 
          admin.id === adminId ? { ...admin, isActive: !currentStatus } : admin
        ))
      } else {
        toast({
        title: "Error",
        description: 'Failed to update admin status'
      })
      }
    } catch (error) {
      console.error('Error updating admin status:', error)
      toast({
        title: "Error",
        description: 'Failed to update admin status'
      })
    }
  }

  const deleteAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/super-admin/admins/${adminId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
        title: "Success",
        description: 'Admin deleted successfully'
      })
        setAdmins(admins.filter(admin => admin.id !== adminId))
      } else {
        toast({
        title: "Error",
        description: 'Failed to delete admin'
      })
      }
    } catch (error) {
      console.error('Error deleting admin:', error)
      toast({
        title: "Error",
        description: 'Failed to delete admin'
      })
    }
  }

  return (
    
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Admins</h1>
          <p className="text-gray-600 mt-1">Manage system administrators and their permissions</p>
        </div>
        <Button onClick={() => router.push('/dashboard/super-admin/create-admin')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Admin
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Admins</p>
                <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Active Admins</p>
                <p className="text-2xl font-bold text-gray-900">{admins.filter(a => a.isActive).length}</p>
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
                <p className="text-sm font-medium text-gray-600">Inactive Admins</p>
                <p className="text-2xl font-bold text-gray-900">{admins.filter(a => !a.isActive).length}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search admins by name, email, or network..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline">
              {filteredAdmins.length} of {admins.length} admins
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Admins Table */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Administrators</CardTitle>
          <CardDescription>List of all system administrators</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAdmins.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" alt={admin.user.name} />
                          <AvatarFallback>
                            {admin.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{admin.user.name}</p>
                          <p className="text-sm text-gray-500">{admin.user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{admin.networkName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={admin.isActive ? "default" : "secondary"}
                          className={admin.isActive ? "bg-green-500 text-white" : ""}
                        >
                          {admin.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {admin.user.isActive && (
                          <Badge variant="outline" className="text-xs">
                            User Active
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(admin.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleAdminStatus(admin.id, admin.isActive)}>
                            {admin.isActive ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/super-admin/admins/${admin.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteAdmin(admin.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No admins found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'No admins match your search criteria.' : 'Get started by creating your first admin.'}
              </p>
              {!searchTerm && (
                <Button onClick={() => router.push('/dashboard/super-admin/create-admin')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Admin
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    
  )
}