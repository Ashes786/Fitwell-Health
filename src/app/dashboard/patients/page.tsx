'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCustomSession } from '@/hooks/use-custom-session'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  Mail,
  Phone,
  Calendar,
  Heart,
  Activity
} from 'lucide-react'
import { toast } from 'sonner'

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  age: number
  gender: string
  lastVisit: string
  status: 'active' | 'inactive'
  healthScore: number
}

export default function PatientsPage() {
  const { user, loading } = useCustomSession()
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/auth/signin')
      return
    }

    fetchPatients()
  }, [user, loading, router])

  const fetchPatients = async () => {
    try {
      setIsLoading(true)
      
      // Fetch patients based on user role
      let endpoint = ''
      switch (user?.role) {
        case 'DOCTOR':
          endpoint = '/api/doctor/patients'
          break
        case 'ATTENDANT':
          endpoint = '/api/attendant/patients'
          break
        case 'ADMIN':
          endpoint = '/api/admin/patients'
          break
        default:
          endpoint = '/api/patients'
      }

      const response = await fetch(endpoint)
      if (response.ok) {
        const data = await response.json()
        setPatients(data)
      } else {
        // Fallback to mock data
        setPatients(getMockPatients(user?.role))
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
      toast.error('Failed to load patients')
      setPatients(getMockPatients(user?.role))
    } finally {
      setIsLoading(false)
    }
  }

  const getMockPatients = (role: string) => {
    return [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        age: 45,
        gender: 'Male',
        lastVisit: '2024-01-10',
        status: 'active',
        healthScore: 85
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 234-5678',
        age: 32,
        gender: 'Female',
        lastVisit: '2024-01-12',
        status: 'active',
        healthScore: 92
      },
      {
        id: '3',
        name: 'Michael Brown',
        email: 'michael.brown@email.com',
        phone: '+1 (555) 345-6789',
        age: 28,
        gender: 'Male',
        lastVisit: '2024-01-08',
        status: 'inactive',
        healthScore: 78
      },
      {
        id: '4',
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        phone: '+1 (555) 456-7890',
        age: 67,
        gender: 'Female',
        lastVisit: '2024-01-15',
        status: 'active',
        healthScore: 88
      }
    ]
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getPageTitle = () => {
    switch (user?.role) {
      case 'DOCTOR': return 'My Patients'
      case 'ATTENDANT': return 'Registered Patients'
      case 'ADMIN': return 'All Patients'
      default: return 'Patients'
    }
  }

  const getPageDescription = () => {
    switch (user?.role) {
      case 'DOCTOR': return 'View and manage your patient list'
      case 'ATTENDANT': return 'View and manage registered patients'
      case 'ADMIN': return 'View all patients in the system'
      default: return 'Manage patients'
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patients...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center">
        <p className="text-gray-600">Please sign in to view patients.</p>
        <Button onClick={() => router.push('/auth/signin')} className="mt-4">
          Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-gray-600 mt-1">{getPageDescription()}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          {(user.role === 'DOCTOR' || user.role === 'ATTENDANT') && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          )}
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`/api/placeholder/avatar/${patient.id}`} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{patient.name}</h3>
                    <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                      {patient.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Last visit: {patient.lastVisit}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {patient.age} years, {patient.gender}
                      </span>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getHealthScoreColor(patient.healthScore)}`}>
                        <Heart className="h-3 w-3" />
                        <span>{patient.healthScore}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Activity className="h-3 w-3" />
                  <span>Active care</span>
                </div>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {patients.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-600 mb-4">No patients are currently available.</p>
            {(user.role === 'DOCTOR' || user.role === 'ATTENDANT') && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add First Patient
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}