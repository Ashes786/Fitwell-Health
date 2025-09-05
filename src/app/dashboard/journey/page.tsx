'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Heart, 
  FileText, 
  Activity, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  TrendingUp,
  Stethoscope,
  Pill,
  FlaskConical,
  Video,
  Phone,
  MapPin,
  User,
  ArrowRight,
  Star,
  Award,
  Target,
  Route,
  History
} from "lucide-react"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { UserRole } from "@prisma/client"

interface JourneyEvent {
  id: string
  type: 'APPOINTMENT' | 'PRESCRIPTION' | 'LAB_TEST' | 'HEALTH_RECORD' | 'MILESTONE' | 'GOAL'
  title: string
  description: string
  date: string
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'CANCELLED'
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  category: string
  icon: any
  color: string
  details?: any
}

interface HealthGoal {
  id: string
  title: string
  description: string
  targetValue: number
  currentValue: number
  unit: string
  deadline: string
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED'
  category: string
}

interface Milestone {
  id: string
  title: string
  description: string
  achievedDate?: string
  targetDate: string
  status: 'ACHIEVED' | 'IN_PROGRESS' | 'PENDING'
  icon: any
  color: string
}

export default function PatientJourney() {
  const { isAuthorized, isUnauthorized, isLoading } = useRoleAuthorization({
    requiredRole: UserRole.PATIENT,
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()
  const [journeyEvents, setJourneyEvents] = useState<JourneyEvent[]>([])
  const [healthGoals, setHealthGoals] = useState<HealthGoal[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthorized) {
      fetchJourneyData()
    }
  }, [isAuthorized])

  const fetchJourneyData = async () => {
    setLoading(true)
    try {
      // Mock journey events data
      const mockJourneyEvents: JourneyEvent[] = [
        {
          id: "1",
          type: "APPOINTMENT",
          title: "Initial Consultation",
          description: "First consultation with Dr. Sarah Johnson",
          date: "2024-01-01",
          status: "COMPLETED",
          priority: "HIGH",
          category: "Consultation",
          icon: Stethoscope,
          color: "bg-blue-500",
          details: {
            doctor: "Dr. Sarah Johnson",
            duration: "30 minutes",
            notes: "General health assessment completed"
          }
        },
        {
          id: "2",
          type: "LAB_TEST",
          title: "Blood Work Analysis",
          description: "Complete blood count and metabolic panel",
          date: "2024-01-05",
          status: "COMPLETED",
          priority: "HIGH",
          category: "Diagnostics",
          icon: FlaskConical,
          color: "bg-green-500",
          details: {
            testType: "CBC & Metabolic Panel",
            results: "Normal ranges",
            labPartner: "City Lab Services"
          }
        },
        {
          id: "3",
          type: "PRESCRIPTION",
          title: "Medication Started",
          description: "Prescribed Vitamin D supplements",
          date: "2024-01-08",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          category: "Treatment",
          icon: Pill,
          color: "bg-orange-500",
          details: {
            medication: "Vitamin D3",
            dosage: "1000 IU daily",
            duration: "3 months"
          }
        },
        {
          id: "4",
          type: "GOAL",
          title: "Weight Management",
          description: "Achieve target weight of 70kg",
          date: "2024-01-10",
          status: "IN_PROGRESS",
          priority: "HIGH",
          category: "Fitness",
          icon: Target,
          color: "bg-purple-500",
          details: {
            targetWeight: 70,
            currentWeight: 75,
            deadline: "2024-06-01"
          }
        },
        {
          id: "5",
          type: "APPOINTMENT",
          title: "Follow-up Consultation",
          description: "Follow-up with Dr. Sarah Johnson",
          date: "2024-01-15",
          status: "PENDING",
          priority: "MEDIUM",
          category: "Consultation",
          icon: Stethoscope,
          color: "bg-blue-500",
          details: {
            doctor: "Dr. Sarah Johnson",
            duration: "20 minutes",
            purpose: "Review progress and adjust treatment"
          }
        },
        {
          id: "6",
          type: "MILESTONE",
          title: "First Month Progress",
          description: "Complete first month of health journey",
          date: "2024-01-31",
          status: "PENDING",
          priority: "LOW",
          category: "Achievement",
          icon: Award,
          color: "bg-yellow-500",
          details: {
            requirements: ["Complete all appointments", "Follow medication plan", "Track vitals regularly"]
          }
        }
      ]

      const mockHealthGoals: HealthGoal[] = [
        {
          id: "1",
          title: "Blood Pressure Control",
          description: "Maintain blood pressure within normal range",
          targetValue: 120,
          currentValue: 125,
          unit: "mmHg",
          deadline: "2024-03-01",
          status: "ACTIVE",
          category: "Cardiovascular"
        },
        {
          id: "2",
          title: "Weight Management",
          description: "Reach target weight through diet and exercise",
          targetValue: 70,
          currentValue: 75,
          unit: "kg",
          deadline: "2024-06-01",
          status: "ACTIVE",
          category: "Fitness"
        },
        {
          id: "3",
          title: "Daily Steps",
          description: "Achieve 10,000 steps daily",
          targetValue: 10000,
          currentValue: 7500,
          unit: "steps",
          deadline: "2024-02-01",
          status: "ACTIVE",
          category: "Activity"
        }
      ]

      const mockMilestones: Milestone[] = [
        {
          id: "1",
          title: "Initial Assessment",
          description: "Complete initial health assessment",
          achievedDate: "2024-01-01",
          targetDate: "2024-01-05",
          status: "ACHIEVED",
          icon: CheckCircle,
          color: "bg-green-500"
        },
        {
          id: "2",
          title: "First Lab Results",
          description: "Receive and review first lab test results",
          achievedDate: "2024-01-08",
          targetDate: "2024-01-10",
          status: "ACHIEVED",
          icon: FlaskConical,
          color: "bg-blue-500"
        },
        {
          id: "3",
          title: "Two Week Progress",
          description: "Complete two weeks of medication adherence",
          targetDate: "2024-01-22",
          status: "IN_PROGRESS",
          icon: Clock,
          color: "bg-orange-500"
        },
        {
          id: "4",
          title: "One Month Review",
          description: "Complete one month health journey review",
          targetDate: "2024-01-31",
          status: "PENDING",
          icon: Calendar,
          color: "bg-purple-500"
        }
      ]

      setJourneyEvents(mockJourneyEvents)
      setHealthGoals(mockHealthGoals)
      setMilestones(mockMilestones)
    } catch (error) {
      console.error('Error fetching journey data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-800"
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800"
      case "PENDING": return "bg-yellow-100 text-yellow-800"
      case "CANCELLED": return "bg-red-100 text-red-800"
      case "ACHIEVED": return "bg-green-100 text-green-800"
      case "ACTIVE": return "bg-blue-100 text-blue-800"
      case "PAUSED": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-100 text-red-800"
      case "MEDIUM": return "bg-yellow-100 text-yellow-800"
      case "LOW": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getGoalProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100)
  }

  const sortedEvents = [...journeyEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Health Journey</h1>
          <p className="text-gray-600 mt-2">Track your healthcare journey and progress</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            onClick={() => router.push('/dashboard/patient/health-records')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Health Records
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Target className="mr-2 h-4 w-4" />
            Set New Goal
          </Button>
        </div>
      </div>

      {/* Journey Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Events</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{journeyEvents.length}</p>
                <p className="text-xs text-gray-400 mt-2">In your journey</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <History className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {journeyEvents.filter(e => e.status === 'COMPLETED').length}
                </p>
                <p className="text-xs text-gray-400 mt-2">Events done</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {journeyEvents.filter(e => e.status === 'IN_PROGRESS').length}
                </p>
                <p className="text-xs text-gray-400 mt-2">Active events</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Goals Active</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {healthGoals.filter(g => g.status === 'ACTIVE').length}
                </p>
                <p className="text-xs text-gray-400 mt-2">Health goals</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="timeline" className="data-[state=active]:bg-white">
            <History className="mr-2 h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="goals" className="data-[state=active]:bg-white">
            <Target className="mr-2 h-4 w-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="milestones" className="data-[state=active]:bg-white">
            <Award className="mr-2 h-4 w-4" />
            Milestones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <History className="mr-2 h-5 w-5 text-blue-600" />
                Health Journey Timeline
              </CardTitle>
              <CardDescription>Your healthcare journey events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {sortedEvents.map((event, index) => {
                  const Icon = event.icon
                  return (
                    <div key={event.id} className="flex items-start space-x-4">
                      <div className={`w-10 h-10 ${event.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(event.status)}>
                              {event.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(event.priority)}>
                              {event.priority}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{event.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          <span className="bg-gray-100 px-2 py-1 rounded">{event.category}</span>
                        </div>
                        {event.details && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              {Object.entries(event.details).map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium text-gray-700">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                                  <span className="text-gray-600 ml-2">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {healthGoals.map((goal) => (
              <Card key={goal.id} className="border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium text-gray-900">{goal.title}</CardTitle>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status}
                    </Badge>
                  </div>
                  <CardDescription>{goal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium text-gray-900">
                          {goal.currentValue} / {goal.targetValue} {goal.unit}
                        </span>
                      </div>
                      <Progress 
                        value={getGoalProgress(goal.currentValue, goal.targetValue)} 
                        className="h-2"
                      />
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <span>{getGoalProgress(goal.currentValue, goal.targetValue)}% complete</span>
                        <span>Target: {new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium text-gray-900">{goal.category}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push('/dashboard/patient/vitals')}
                    >
                      Update Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Award className="mr-2 h-5 w-5 text-yellow-600" />
                Health Milestones
              </CardTitle>
              <CardDescription>Track your achievements and upcoming milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {milestones.map((milestone) => {
                  const Icon = milestone.icon
                  return (
                    <Card key={milestone.id} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`w-10 h-10 ${milestone.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                            <p className="text-sm text-gray-600">{milestone.description}</p>
                          </div>
                          <Badge className={getStatusColor(milestone.status)}>
                            {milestone.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Target Date:</span>
                            <span className="font-medium">{new Date(milestone.targetDate).toLocaleDateString()}</span>
                          </div>
                          {milestone.achievedDate && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Achieved:</span>
                              <span className="font-medium text-green-600">{new Date(milestone.achievedDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}