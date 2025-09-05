"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Users, Building2, Plus, Search, UserPlus, Building } from 'lucide-react'
import { UserRole, PartnerType } from '@prisma/client'

interface NetworkUser {
  id: string
  adminId: string
  userId: string
  userType: UserRole
  joinedAt: string
  user: {
    id: string
    name: string
    email: string
    role: UserRole
    createdAt: string
  }
}

interface NetworkPartner {
  id: string
  adminId: string
  partnerType: PartnerType
  partnerId: string
  addedAt: string
  labPartner?: {
    id: string
    name: string
    isActive: boolean
  } | null
  pharmacyPartner?: {
    id: string
    name: string
    isActive: boolean
  } | null
  hospitalPartner?: {
    id: string
    name: string
    isActive: boolean
  } | null
}

interface NetworkData {
  users: NetworkUser[]
  partners: NetworkPartner[]
}

export default function NetworkManagementPage() {
  const [networkData, setNetworkData] = useState<NetworkData>({ users: [], partners: [] })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [addType, setAddType] = useState<'user' | 'partner'>('user')
  const [availableUsers, setAvailableUsers] = useState<any[]>([])
  const [availablePartners, setAvailablePartners] = useState<any[]>([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedPartner, setSelectedPartner] = useState({ id: '', type: '' as PartnerType })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    fetchNetworkData()
  }, [])

  const fetchNetworkData = async () => {
    try {
      const response = await fetch('/api/admin/network')
      if (response.ok) {
        const data = await response.json()
        setNetworkData(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch network data",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch network data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const users = await response.json()
        // Filter out users already in network
        const networkUserIds = networkData.users.map(nu => nu.userId)
        const availableUsers = users.filter((user: any) => !networkUserIds.includes(user.id))
        setAvailableUsers(availableUsers)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchAvailablePartners = async () => {
    try {
      const response = await fetch('/api/admin/partners')
      if (response.ok) {
        const partners = await response.json()
        // Filter out partners already in network
        const networkPartnerIds = networkData.partners.map(np => np.partnerId)
        const availablePartners: Array<{ id: string; type: PartnerType; [key: string]: any }> = []
        
        // Add lab partners
        if (partners.labPartners) {
          partners.labPartners.forEach((lab: any) => {
            if (!networkPartnerIds.includes(lab.id)) {
              availablePartners.push({ ...lab, type: 'LAB' as PartnerType })
            }
          })
        }
        
        // Add pharmacy partners
        if (partners.pharmacyPartners) {
          partners.pharmacyPartners.forEach((pharmacy: any) => {
            if (!networkPartnerIds.includes(pharmacy.id)) {
              availablePartners.push({ ...pharmacy, type: 'PHARMACY' as PartnerType })
            }
          })
        }
        
        // Add hospital partners
        if (partners.hospitalPartners) {
          partners.hospitalPartners.forEach((hospital: any) => {
            if (!networkPartnerIds.includes(hospital.id)) {
              availablePartners.push({ ...hospital, type: 'HOSPITAL' as PartnerType })
            }
          })
        }
        
        setAvailablePartners(availablePartners)
      }
    } catch (error) {
      console.error('Error fetching partners:', error)
    }
  }

  const handleAddToNetwork = async () => {
    setIsSubmitting(true)
    try {
      const payload = addType === 'user' 
        ? { type: 'user', userId: selectedUserId }
        : { type: 'partner', partnerId: selectedPartner.id, partnerType: selectedPartner.type }

      const response = await fetch('/api/admin/network', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `${addType === 'user' ? 'User' : 'Partner'} added to network successfully`
        })
        setIsDialogOpen(false)
        resetForm()
        fetchNetworkData()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || `Failed to add ${addType} to network`,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add ${addType} to network`,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeFromNetwork = async (type: 'user' | 'partner', id: string) => {
    if (!confirm(`Are you sure you want to remove this ${type} from your network?`)) {
      return
    }

    try {
      // Note: You'll need to create DELETE endpoints for network users and partners
      toast({
        title: "Info",
        description: "Remove functionality needs to be implemented"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to remove ${type} from network`,
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setSelectedUserId('')
    setSelectedPartner({ id: '', type: '' as PartnerType })
    setAvailableUsers([])
    setAvailablePartners([])
  }

  const handleDialogOpen = (open: boolean) => {
    if (open) {
      setAddType('user')
      fetchAvailableUsers()
      fetchAvailablePartners()
    } else {
      resetForm()
    }
    setIsDialogOpen(open)
  }

  const filteredUsers = networkData.users.filter(nu =>
    nu.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nu.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredPartners = networkData.partners.filter(np => {
    const partner = np.labPartner || np.pharmacyPartner || np.hospitalPartner
    return partner?.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const getRoleColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      PATIENT: 'bg-blue-100 text-blue-800',
      DOCTOR: 'bg-green-100 text-green-800',
      ATTENDANT: 'bg-yellow-100 text-yellow-800',
      CONTROL_ROOM: 'bg-purple-100 text-purple-800',
      ADMIN: 'bg-red-100 text-red-800',
      SUPER_ADMIN: 'bg-gray-100 text-gray-800'
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  const getPartnerTypeColor = (type: PartnerType) => {
    const colors: Record<PartnerType, string> = {
      LAB: 'bg-blue-100 text-blue-800',
      PHARMACY: 'bg-green-100 text-green-800',
      HOSPITAL: 'bg-red-100 text-red-800',
      SPECIALIST: 'bg-purple-100 text-purple-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Network Management</h1>
          <p className="text-muted-foreground">
            Manage users and partners in your healthcare network
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add to Network
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add to Network</DialogTitle>
              <DialogDescription>
                Add users or partners to your healthcare network.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Type</Label>
                <Tabs value={addType} onValueChange={(value) => setAddType(value as 'user' | 'partner')}>
                  <TabsList className="col-span-3">
                    <TabsTrigger value="user">User</TabsTrigger>
                    <TabsTrigger value="partner">Partner</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              {addType === 'user' ? (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="user" className="text-right">
                    User
                  </Label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="partner" className="text-right">
                    Partner
                  </Label>
                  <Select 
                    value={selectedPartner.id} 
                    onValueChange={(value) => {
                      const partner = availablePartners.find(p => p.id === value)
                      if (partner) {
                        setSelectedPartner({ id: partner.id, type: partner.type })
                      }
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a partner" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePartners.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.name} ({partner.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                onClick={handleAddToNetwork}
                disabled={isSubmitting || (addType === 'user' ? !selectedUserId : !selectedPartner.id)}
              >
                {isSubmitting ? 'Adding...' : 'Add to Network'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search network..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users ({networkData.users.length})
          </TabsTrigger>
          <TabsTrigger value="partners" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Partners ({networkData.partners.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Network Users
              </CardTitle>
              <CardDescription>
                Users who are part of your healthcare network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((networkUser) => (
                    <TableRow key={networkUser.id}>
                      <TableCell className="font-medium">{networkUser.user.name}</TableCell>
                      <TableCell>{networkUser.user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(networkUser.userType)}>
                          {networkUser.userType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(networkUser.joinedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromNetwork('user', networkUser.id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No users found in network
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partners">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Network Partners
              </CardTitle>
              <CardDescription>
                Healthcare partners in your network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartners.map((networkPartner) => {
                    const partner = networkPartner.labPartner || networkPartner.pharmacyPartner || networkPartner.hospitalPartner
                    return (
                      <TableRow key={networkPartner.id}>
                        <TableCell className="font-medium">{partner?.name}</TableCell>
                        <TableCell>
                          <Badge className={getPartnerTypeColor(networkPartner.partnerType)}>
                            {networkPartner.partnerType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={partner?.isActive ? "default" : "secondary"}>
                            {partner?.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(networkPartner.addedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromNetwork('partner', networkPartner.id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              {filteredPartners.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No partners found in network
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}