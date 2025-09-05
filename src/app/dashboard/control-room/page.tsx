'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Monitor, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Users, 
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'
import { toast } from 'sonner'

interface ControlRoomUser {
  id: string
  name: string
  email: string
  phone: string
  location: string
  status: 'active' | 'inactive' | 'on_duty' | 'off_duty'
  lastActive: string
  totalCases: number
  activeCases: number
  department: string
  shift: 'day' | 'night' | 'rotating'
}

export default function AdminControlRoom() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [controlRoomUsers, setControlRoomUsers] = useState<ControlRoomUser[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<ControlRoomUser | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    department: '',
    shift: 'day' as 'day' | 'night' | 'rotating',
    status: 'active' as 'active' | 'inactive'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    fetchControlRoomUsers()
  }, [session, status, router])

  const fetchControlRoomUsers = async () => {
    try {
      setIsLoading(true)
      
      // Mock data for demonstration
      const mockUsers: ControlRoomUser[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@controlroom.com',
          phone: '+1-555-0123',
          location: 'New York, NY',
          status: 'on_duty',
          lastActive: '2 minutes ago',
          totalCases: 245,
          activeCases: 3,
          department: 'Emergency Coordination',
          shift: 'day'
        },
        {
          id: '2',
          name: 'Michael Chen',
          email: 'michael.chen@controlroom.com',
          phone: '+1-555-0124',
          location: 'Los Angeles, CA',
          status: 'off_duty',
          lastActive: '1 hour ago',
          totalCases: 189,
          activeCases: 0,
          department: 'Patient Allocation',
          shift: 'night'
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@controlroom.com',
          phone: '+1-555-0125',
          location: 'Chicago, IL',
          status: 'on_duty',
          lastActive: '5 minutes ago',
          totalCases: 312,
          activeCases: 5,
          department: 'Emergency Response',
          shift: 'rotating'
        },
        {
          id: '4',
          name: 'David Wilson',
          email: 'david.wilson@controlroom.com',
          phone: '+1-555-0126',
          location: 'Houston, TX',
          status: 'active',
          lastActive: '30 minutes ago',
          totalCases: 156,
          activeCases: 0,
          department: 'Resource Management',
          shift: 'day'
        }
      ]

      setControlRoomUsers(mockUsers)
    } catch (error) {
      console.error('Error fetching control room users:', error)
      toast.error('Failed to load control room users')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Success",
        description: editingUser 
          ? "Control room user updated successfully"
          : "Control room user created successfully"
      })
      
      setIsDialogOpen(false)
      resetForm()
      fetchControlRoomUsers()
    } catch (error) {
      toast.error('Failed to save control room user')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (user: ControlRoomUser) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      department: user.department,
      shift: user.shift,
      status: user.status === 'on_duty' || user.status === 'off_duty' ? 'active' : user.status
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this control room user?')) {
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "Success",
        description: "Control room user deleted successfully"
      })
      
      fetchControlRoomUsers()
    } catch (error) {
      toast.error('Failed to delete control room user')
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'on_duty' ? 'off_duty' : 'on_duty'
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "Success",
        description: `User status changed to ${newStatus.replace('_', ' ')}`
      })
      
      fetchControlRoomUsers()
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const resetForm = () => {
    setEditingUser(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      department: '',
      shift: 'day',
      status: 'active'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'on_duty':
        return 'bg-blue-100 text-blue-800'
      case 'off_duty':
        return 'bg-gray-100 text-gray-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />
      case 'on_duty':
        return <Activity className="h-4 w-4" />
      case 'off_duty':
        return <XCircle className="h-4 w-4" />
      case 'inactive':
        return <XCircle className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const filteredUsers = controlRoomUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading control room users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Control Room Management</h1>
          <p className="text-gray-600 mt-2">Manage control room staff and their assignments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Control Room User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? 'Edit Control Room User' : 'Add New Control Room User'}
                </DialogTitle>
                <DialogDescription>
                  Create or update control room user information
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Department *
                  </Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shift" className="text-right">
                    Shift *
                  </Label>
                  <Select
                    value={formData.shift}
                    onValueChange={(value: 'day' | 'night' | 'rotating') => 
                      setFormData({ ...formData, shift: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day Shift</SelectItem>
                      <SelectItem value="night">Night Shift</SelectItem>
                      <SelectItem value="rotating">Rotating Shift</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status *
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'inactive') => 
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (editingUser ? 'Update' : 'Create')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{controlRoomUsers.length}</p>
                <p className="text-sm text-gray-600 mt-1">Control room operators</p>
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
                <p className="text-sm font-medium text-gray-600">On Duty</p>
                <p className="text-2xl font-bold text-gray-900">
                  {controlRoomUsers.filter(u => u.status === 'on_duty').length}
                </p>
                <p className="text-sm text-green-600 mt-1">Currently active</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Cases</p>
                <p className="text-2xl font-bold text-gray-900">
                  {controlRoomUsers.reduce((sum, u) => sum + u.activeCases, 0)}
                </p>
                <p className="text-sm text-orange-600 mt-1">Being handled</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cases</p>
                <p className="text-2xl font-bold text-gray-900">
                  {controlRoomUsers.reduce((sum, u) => sum + u.totalCases, 0)}
                </p>
                <p className="text-sm text-blue-600 mt-1">All time</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>Control Room Staff</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name, email, or location..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-health-primary focus:border-transparent w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_duty">On Duty</SelectItem>
                <SelectItem value="off_duty">Off Duty</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-health-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.department}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Shift: {user.shift}</span>
                      <span className="text-gray-600">Last active: {user.lastActive}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{user.totalCases}</p>
                        <p className="text-xs text-gray-600">Total Cases</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{user.activeCases}</p>
                        <p className="text-xs text-gray-600">Active Cases</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        disabled={user.status === 'inactive'}
                        className="flex-1"
                      >
                        {user.status === 'on_duty' ? 'End Shift' : 'Start Shift'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No control room staff found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}