'use client'

import { useState, useEffect } from 'react'
import { useCustomSession } from '@/hooks/use-custom-session'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Building, Plus, Edit, Trash2, MapPin, Phone, Mail, Calendar, Hospital, FlaskConical, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

interface Partner {
  id: string
  name: string
  type: 'hospital' | 'lab' | 'pharmacy'
  email: string
  phone: string
  address: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
  avatar?: string
}

export default function PartnersPage() {
  const { user, loading } = useCustomSession()
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user && (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN')) {
      loadPartners()
    }
  }, [user])

  const loadPartners = async () => {
    try {
      const response = await fetch('/api/super-admin/partners')
      if (response.ok) {
        const data = await response.json()
        setPartners(data.partners || [])
      }
    } catch (error) {
      toast.error('Failed to load partners')
    } finally {
      setIsLoading(false)
    }
  }

  const getPartnerIcon = (type: string) => {
    switch (type) {
      case 'hospital': return <Hospital className="h-4 w-4" />
      case 'lab': return <FlaskConical className="h-4 w-4" />
      case 'pharmacy': return <ShoppingCart className="h-4 w-4" />
      default: return <Building className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading || isLoading) {
    return (
      <DashboardLayout userRole={user?.role || ''} userName={user?.name || ''} userImage={user?.avatar}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    return (
      <DashboardLayout userRole={user?.role || ''} userName={user?.name || ''} userImage={user?.avatar}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole={user.role} userName={user.name || ''} userImage={user.avatar}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Partners</h1>
            <p className="text-gray-600 mt-2">Manage hospitals, labs, and pharmacy partners</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Partner
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Partners</p>
                  <p className="text-2xl font-bold text-gray-900">{partners.length}</p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hospitals</p>
                  <p className="text-2xl font-bold text-green-600">{partners.filter(p => p.type === 'hospital').length}</p>
                </div>
                <Hospital className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Labs</p>
                  <p className="text-2xl font-bold text-purple-600">{partners.filter(p => p.type === 'lab').length}</p>
                </div>
                <FlaskConical className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pharmacies</p>
                  <p className="text-2xl font-bold text-orange-600">{partners.filter(p => p.type === 'pharmacy').length}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Partners List */}
        <Card>
          <CardHeader>
            <CardTitle>Partner Organizations</CardTitle>
            <CardDescription>View and manage all partner organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {partners.map((partner) => (
                <div key={partner.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={partner.avatar} />
                      <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{partner.name}</h3>
                        {getPartnerIcon(partner.type)}
                        <Badge className={getStatusColor(partner.status)}>
                          {partner.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {partner.email}
                        </span>
                        <span className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {partner.phone}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {partner.address}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}