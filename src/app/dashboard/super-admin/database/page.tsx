'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Database, 
  Users, 
  FileText, 
  Activity,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Search,
  Filter,
  Calendar,
  HardDrive,
  Server,
  BarChart3,
  Table,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'

interface DatabaseStats {
  totalRecords: number
  totalSize: string
  totalTables: number
  lastBackup: string
  backupSize: string
  activeConnections: number
  queryPerformance: number
  indexHealth: number
}

interface BackupRecord {
  id: string
  date: string
  size: string
  type: 'full' | 'incremental'
  status: 'completed' | 'failed' | 'in_progress'
  duration: string
}

interface TableInfo {
  name: string
  records: number
  size: string
  lastModified: string
  health: 'excellent' | 'good' | 'warning' | 'critical'
}

export default function SuperAdminDatabase() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null)
  const [backups, setBackups] = useState<BackupRecord[]>([])
  const [tables, setTables] = useState<TableInfo[]>([])
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user?.role !== 'SUPER_ADMIN') {
      router.push('/dashboard')
      return
    }

    fetchDatabaseData()
  }, [session, status, router])

  const fetchDatabaseData = async () => {
    try {
      setIsLoading(true)
      
      // Mock data for demonstration
      const mockDbStats: DatabaseStats = {
        totalRecords: 2847392,
        totalSize: '2.8 GB',
        totalTables: 24,
        lastBackup: '2024-01-15 02:00:00',
        backupSize: '1.2 GB',
        activeConnections: 45,
        queryPerformance: 94,
        indexHealth: 98
      }
      
      const mockBackups: BackupRecord[] = [
        {
          id: '1',
          date: '2024-01-15 02:00:00',
          size: '1.2 GB',
          type: 'full',
          status: 'completed',
          duration: '15m 32s'
        },
        {
          id: '2',
          date: '2024-01-14 02:00:00',
          size: '245 MB',
          type: 'incremental',
          status: 'completed',
          duration: '3m 45s'
        },
        {
          id: '3',
          date: '2024-01-13 02:00:00',
          size: '1.1 GB',
          type: 'full',
          status: 'completed',
          duration: '14m 28s'
        },
        {
          id: '4',
          date: '2024-01-12 02:00:00',
          size: '198 MB',
          type: 'incremental',
          status: 'failed',
          duration: '8m 12s'
        }
      ]
      
      const mockTables: TableInfo[] = [
        {
          name: 'users',
          records: 12450,
          size: '245 MB',
          lastModified: '2024-01-15 10:30:00',
          health: 'excellent'
        },
        {
          name: 'patients',
          records: 9850,
          size: '189 MB',
          lastModified: '2024-01-15 09:45:00',
          health: 'excellent'
        },
        {
          name: 'doctors',
          records: 280,
          size: '12 MB',
          lastModified: '2024-01-15 08:20:00',
          health: 'good'
        },
        {
          name: 'appointments',
          records: 45620,
          size: '367 MB',
          lastModified: '2024-01-15 11:15:00',
          health: 'good'
        },
        {
          name: 'prescriptions',
          records: 28940,
          size: '156 MB',
          lastModified: '2024-01-15 10:00:00',
          health: 'excellent'
        },
        {
          name: 'health_records',
          records: 189450,
          size: '892 MB',
          lastModified: '2024-01-15 09:30:00',
          health: 'warning'
        },
        {
          name: 'payments',
          records: 67890,
          size: '234 MB',
          lastModified: '2024-01-15 11:00:00',
          health: 'good'
        },
        {
          name: 'subscriptions',
          records: 8450,
          size: '67 MB',
          lastModified: '2024-01-15 08:45:00',
          health: 'excellent'
        }
      ]

      setDbStats(mockDbStats)
      setBackups(mockBackups)
      setTables(mockTables)
      setSelectedTable(mockTables[0])
    } catch (error) {
      console.error('Error fetching database data:', error)
      toast.error('Failed to load database data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBackup = async () => {
    try {
      toast.info('Creating backup...')
      // Simulate backup creation
      setTimeout(() => {
        toast.success('Backup created successfully')
        fetchDatabaseData()
      }, 3000)
    } catch (error) {
      toast.error('Failed to create backup')
    }
  }

  const handleOptimizeDatabase = async () => {
    try {
      toast.info('Optimizing database...')
      // Simulate optimization
      setTimeout(() => {
        toast.success('Database optimized successfully')
        fetchDatabaseData()
      }, 5000)
    } catch (error) {
      toast.error('Failed to optimize database')
    }
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'bg-green-100 text-green-800'
      case 'good':
        return 'bg-blue-100 text-blue-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'critical':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading database information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Database Management</h1>
          <p className="text-gray-600 mt-2">Monitor and manage database performance and backups</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleCreateBackup} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Create Backup</span>
          </Button>
          <Button onClick={handleOptimizeDatabase} variant="outline" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Optimize</span>
          </Button>
        </div>
      </div>

      {/* Database Stats */}
      {dbStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(dbStats.totalRecords)}</p>
                  <p className="text-sm text-green-600 mt-1">+2.5% this week</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Database Size</p>
                  <p className="text-2xl font-bold text-gray-900">{dbStats.totalSize}</p>
                  <p className="text-sm text-gray-600 mt-1">Last backup: {dbStats.backupSize}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <HardDrive className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Performance</p>
                  <p className="text-2xl font-bold text-gray-900">{dbStats.queryPerformance}%</p>
                  <p className="text-sm text-green-600 mt-1">Excellent</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Connections</p>
                  <p className="text-2xl font-bold text-gray-900">{dbStats.activeConnections}</p>
                  <p className="text-sm text-gray-600 mt-1">Peak: 67</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Server className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Tables */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Table className="h-5 w-5" />
              <span>Database Tables</span>
            </CardTitle>
            <CardDescription>Overview of all database tables</CardDescription>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search tables..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-health-primary focus:border-transparent w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTables.map((table) => (
                <div
                  key={table.name}
                  className={`p-3 border border-gray-200 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedTable?.name === table.name ? 'ring-2 ring-health-primary' : ''
                  }`}
                  onClick={() => setSelectedTable(table)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">{table.name}</h3>
                      <Badge className={getHealthColor(table.health)}>
                        {table.health}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatNumber(table.records)} records</p>
                      <p className="text-xs text-gray-600">{table.size}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Last modified: {table.lastModified}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Backup History */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Backup History</span>
            </CardTitle>
            <CardDescription>Recent database backups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {backups.map((backup) => (
                <div key={backup.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{backup.date}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{backup.type}</Badge>
                          <Badge className={getStatusColor(backup.status)}>
                            {backup.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{backup.size}</p>
                      <p className="text-xs text-gray-600">{backup.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Table Details */}
      {selectedTable && (
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle>Table Details: {selectedTable.name}</CardTitle>
            <CardDescription>Detailed information about the selected table</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(selectedTable.records)}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Table Size</p>
                <p className="text-2xl font-bold text-gray-900">{selectedTable.size}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Health Status</p>
                <Badge className={getHealthColor(selectedTable.health)}>
                  {selectedTable.health}
                </Badge>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Last Modified</p>
                <p className="text-sm font-medium text-gray-900">{selectedTable.lastModified}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}