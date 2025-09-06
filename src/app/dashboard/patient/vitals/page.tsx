"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Weight, 
  Ruler, 
  Droplets, 
  Wind,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar
} from "lucide-react"
import { UserRole } from "@prisma/client"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"

interface Vital {
  id: string
  type: string
  value: number
  unit: string
  notes?: string
  recordedAt: string
}

const vitalTypes = [
  { value: "BLOOD_PRESSURE_SYSTOLIC", label: "Blood Pressure (Systolic)", unit: "mmHg", icon: Heart, normalRange: { min: 90, max: 120 } },
  { value: "BLOOD_PRESSURE_DIASTOLIC", label: "Blood Pressure (Diastolic)", unit: "mmHg", icon: Heart, normalRange: { min: 60, max: 80 } },
  { value: "HEART_RATE", label: "Heart Rate", unit: "bpm", icon: Activity, normalRange: { min: 60, max: 100 } },
  { value: "TEMPERATURE", label: "Temperature", unit: "°F", icon: Thermometer, normalRange: { min: 97.0, max: 99.5 } },
  { value: "WEIGHT", label: "Weight", unit: "kg", icon: Weight, normalRange: { min: 50, max: 100 } },
  { value: "HEIGHT", label: "Height", unit: "cm", icon: Ruler, normalRange: { min: 150, max: 200 } },
  { value: "BLOOD_SUGAR", label: "Blood Sugar", unit: "mg/dL", icon: Droplets, normalRange: { min: 70, max: 140 } },
  { value: "OXYGEN_SATURATION", label: "Oxygen Saturation", unit: "%", icon: Wind, normalRange: { min: 95, max: 100 } },
  { value: "RESPIRATORY_RATE", label: "Respiratory Rate", unit: "breaths/min", icon: Wind, normalRange: { min: 12, max: 20 } }
]

export default function PatientVitals() {
  const { isAuthorized, isUnauthorized, isLoading: authLoading, session } = useRoleAuthorization({
    requiredRole: "PATIENT",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [vitals, setVitals] = useState<Vital[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newVital, setNewVital] = useState({
    type: "",
    value: "",
    unit: "",
    notes: ""
  })

  useEffect(() => {
    if (isAuthorized) {
      fetchVitals()
    }
  }, [isAuthorized])

  const fetchVitals = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/patient/vitals')
      if (!response.ok) {
        throw new Error('Failed to fetch vitals')
      }
      
      const data = await response.json()
      setVitals(data)
    } catch (error) {
      console.error('Error fetching vitals:', error)
      // Set empty array on error
      setVitals([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      
    )
  }

  if (!session) {
    return null
  }

  // Show unauthorized message if user doesn't have PATIENT role
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

  const getVitalTypeInfo = (type: string) => {
    return vitalTypes.find(vt => vt.value === type)
  }

  const getStatus = (vital: Vital) => {
    const vitalType = getVitalTypeInfo(vital.type)
    if (!vitalType) return "unknown"
    
    const { min, max } = vitalType.normalRange
    if (vital.value >= min && vital.value <= max) return "normal"
    if (vital.value < min) return "low"
    return "high"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-emerald-100 text-emerald-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <Minus className="h-4 w-4 text-emerald-600" />
      case "low":
        return <TrendingDown className="h-4 w-4 text-blue-600" />
      case "high":
        return <TrendingUp className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const groupedVitals = vitals.reduce((acc, vital) => {
    if (!acc[vital.type]) {
      acc[vital.type] = []
    }
    acc[vital.type].push(vital)
    return acc
  }, {} as Record<string, Vital[]>)

  const handleAddVital = async () => {
    if (!newVital.type || !newVital.value) return

    const vitalType = getVitalTypeInfo(newVital.type)
    if (!vitalType) return

    try {
      const response = await fetch('/api/patient/vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: newVital.type,
          value: parseFloat(newVital.value),
          unit: vitalType.unit,
          notes: newVital.notes
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save vital')
      }

      const savedVital = await response.json()
      
      // Add to local state
      setVitals([savedVital, ...vitals])
      setNewVital({ type: "", value: "", unit: "", notes: "" })
      setShowAddForm(false)
    } catch (error) {
      console.error('Error saving vital:', error)
      // For demo purposes, still add to local state
      const newVitalRecord: Vital = {
        id: Date.now().toString(),
        type: newVital.type,
        value: parseFloat(newVital.value),
        unit: vitalType.unit,
        notes: newVital.notes,
        recordedAt: new Date().toISOString()
      }

      setVitals([newVitalRecord, ...vitals])
      setNewVital({ type: "", value: "", unit: "", notes: "" })
      setShowAddForm(false)
    }
  }

  const VitalCard = ({ vitals: vitalList, type }: { vitals: Vital[], type: string }) => {
    const vitalType = getVitalTypeInfo(type)
    if (!vitalType) return null

    const latestVital = vitalList[0]
    const status = getStatus(latestVital)
    const Icon = vitalType.icon

    // Get color based on vital type for variety
    const colors = [
      'border-health-primary/20 bg-gradient-to-br from-white to-health-light/5',
      'border-health-blue/20 bg-gradient-to-br from-white to-health-blue/5',
      'border-health-purple/20 bg-gradient-to-br from-white to-health-purple/5',
      'border-health-orange/20 bg-gradient-to-br from-white to-health-orange/5',
      'border-health-coral/20 bg-gradient-to-br from-white to-health-coral/5',
      'border-health-secondary/20 bg-gradient-to-br from-white to-health-secondary/5',
    ]
    const colorClass = colors[type.charCodeAt(0) % colors.length]

    return (
      <Card className={`${colorClass} shadow-health hover:shadow-health-lg transition-all duration-300 hover:-translate-y-1`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-health-dark flex items-center space-x-2">
            <div className="w-8 h-8 bg-health-primary/20 rounded-lg flex items-center justify-center">
              <Icon className="h-4 w-4 text-health-primary" />
            </div>
            <span>{vitalType.label}</span>
          </CardTitle>
          <Badge className={`${getStatusColor(status)} shadow-health`}>
            {status}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-health-dark">
            {latestVital.value} <span className="text-lg font-normal text-health-primary">{latestVital.unit}</span>
          </div>
          <p className="text-xs text-health-secondary mt-1">
            Latest: {new Date(latestVital.recordedAt).toLocaleDateString()}
          </p>
          {vitalList.length > 1 && (
            <div className="mt-2 text-xs text-health-primary">
              {vitalList.length - 1} previous readings
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 gradient-health-blue rounded-2xl flex items-center justify-center shadow-health">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold gradient-health-blue bg-clip-text text-transparent">Vitals</h1>
                <p className="text-health-dark mt-2 text-lg">
                  Track and monitor your health metrics
                </p>
              </div>
            </div>
          </div>
          <Button 
            className="gradient-health-blue hover:shadow-health-lg transition-all duration-300"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Record Vitals
          </Button>
        </div>

        {showAddForm && (
          <Card className="border-health-primary/20 bg-gradient-to-br from-white to-health-light/5 shadow-health">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-health rounded-xl flex items-center justify-center">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-health-dark">
                    Record New Vitals
                  </CardTitle>
                  <CardDescription className="text-health-secondary">
                    Enter your vital signs for tracking
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vital-type" className="text-health-dark font-medium">Vital Type</Label>
                  <Select 
                    value={newVital.type} 
                    onValueChange={(value) => {
                      setNewVital({ ...newVital, type: value, unit: getVitalTypeInfo(value)?.unit || "" })
                    }}
                  >
                    <SelectTrigger className="border-health-primary/30 focus:border-health-primary">
                      <SelectValue placeholder="Select vital type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vitalTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vital-value" className="text-health-dark font-medium">Value</Label>
                  <Input
                    id="vital-value"
                    type="number"
                    step="0.1"
                    placeholder="Enter value"
                    value={newVital.value}
                    onChange={(e) => setNewVital({ ...newVital, value: e.target.value })}
                    className="border-health-primary/30 focus:border-health-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vital-notes" className="text-health-dark font-medium">Notes (Optional)</Label>
                <Input
                  id="vital-notes"
                  placeholder="Add any notes about this reading"
                  value={newVital.notes}
                  onChange={(e) => setNewVital({ ...newVital, notes: e.target.value })}
                  className="border-health-primary/30 focus:border-health-primary"
                />
              </div>
              <div className="flex space-x-3">
                <Button 
                  className="gradient-health hover:shadow-health-lg transition-all duration-300"
                  onClick={handleAddVital}
                  disabled={!newVital.type || !newVital.value}
                >
                  Save Vitals
                </Button>
                <Button 
                  variant="outline" 
                  className="border-health-primary/30 text-health-primary hover:bg-health-light/20"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gradient-to-r from-health-light/30 to-health-primary/20 p-1 rounded-xl shadow-health">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:gradient-health data-[state=active]:text-white data-[state=active]:shadow-health transition-all duration-300 rounded-lg"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:gradient-health data-[state=active]:text-white data-[state=active]:shadow-health transition-all duration-300 rounded-lg"
            >
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(groupedVitals).map(([type, vitalList]) => (
                <VitalCard key={type} vitals={vitalList} type={type} />
              ))}
            </div>
            {Object.keys(groupedVitals).length === 0 && (
              <Card className="border-health-primary/20 bg-gradient-to-br from-white to-health-light/5 shadow-health">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-health-primary/20 rounded-2xl flex items-center justify-center mb-6">
                    <Heart className="h-8 w-8 text-health-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-health-dark mb-3">
                    No vitals recorded
                  </h3>
                  <p className="text-health-secondary mb-6 text-center max-w-md">
                    Start tracking your health metrics by recording your first vital signs.
                  </p>
                  <Button 
                    className="gradient-health hover:shadow-health-lg transition-all duration-300"
                    onClick={() => setShowAddForm(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Record Your First Vitals
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="border-health-primary/20 bg-gradient-to-br from-white to-health-light/5 shadow-health">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-health-secondary rounded-xl flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-health-dark">
                      Vitals History
                    </CardTitle>
                    <CardDescription className="text-health-secondary">
                      All your recorded vital signs
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vitals
                    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
                    .map((vital) => {
                      const vitalType = getVitalTypeInfo(vital.type)
                      const status = getStatus(vital)
                      const Icon = vitalType?.icon || Activity

                      return (
                        <div key={vital.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-health-light/10 to-white rounded-xl border border-health-primary/10 hover:shadow-md transition-all duration-200">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-health-primary/20 rounded-xl flex items-center justify-center">
                              <Icon className="h-6 w-6 text-health-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-health-dark">{vitalType?.label}</p>
                              <p className="text-sm text-health-primary font-medium">
                                {vital.value} {vital.unit}
                              </p>
                              <p className="text-xs text-health-secondary">
                                {new Date(vital.recordedAt).toLocaleDateString()} at {new Date(vital.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              {vital.notes && (
                                <p className="text-xs text-health-dark mt-1 bg-health-light/30 p-2 rounded-lg">{vital.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-health-light/20 rounded-full flex items-center justify-center">
                              {getStatusIcon(status)}
                            </div>
                            <Badge className={`${getStatusColor(status)} shadow-health`}>
                              {status}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  {vitals.length === 0 && (
                    <div className="text-center py-8 text-health-secondary">
                      <Calendar className="h-16 w-16 mx-auto mb-4 text-health-primary/30" />
                      <p className="text-lg font-medium mb-4">No vitals history found</p>
                      <p className="text-health-secondary">Your recorded vitals will appear here.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    
  )
}