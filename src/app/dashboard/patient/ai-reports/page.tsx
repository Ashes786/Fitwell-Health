"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRoleAuthorization } from "@/hooks/use-role-authorization"
import { 
  Brain, 
  Activity, 
  Apple, 
  Pill, 
  Droplets, 
  Dumbbell,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  RefreshCw,
  FileText,
  Download
} from "lucide-react"
import { UserRole } from "@prisma/client"

interface AIReport {
  id: string
  reportType: string
  title: string
  content: string
  generatedAt: string
  isLatest: boolean
}

interface VitalsData {
  bloodPressure: { systolic: number; diastolic: number }
  heartRate: number
  temperature: number
  weight: number
  bloodSugar: number
  oxygenSaturation: number
}

export default function PatientAIReports() {
  const { isAuthorized, isUnauthorized, isLoading: authLoading, authSession } = useRoleAuthorization({
    requiredRole: "PATIENT",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [reports, setReports] = useState<AIReport[]>([])
  const [vitalsData, setVitalsData] = useState<VitalsData | null>(null)

  useEffect(() => {
    if (isAuthorized) {
      // Original fetch logic will be handled separately
    }
  }, [isAuthorized])

  if (authLoading) {
    return (
      
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      
    )
  }

  if (!authSession) {
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

  const generateReport = async (reportType: string) => {
    setIsGenerating(true)
    
    try {
      // Simulate API call to generate AI report
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const newReport: AIReport = {
        id: Date.now().toString(),
        reportType,
        title: getReportTitle(reportType),
        content: getReportContent(reportType),
        generatedAt: new Date().toISOString(),
        isLatest: true
      }

      // Mark previous reports as not latest
      const updatedReports = reports.map(report => ({
        ...report,
        isLatest: false
      }))

      setReports([newReport, ...updatedReports])
    } catch (error) {
      console.error("Failed to generate report:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getReportTitle = (type: string) => {
    switch (type) {
      case "GENERAL_HEALTH":
        return "General Health Assessment"
      case "NUTRITION":
        return "Nutrition Analysis"
      case "SUPPLEMENTS":
        return "Supplement Recommendations"
      case "MEDICATION_REMINDERS":
        return "Medication Adherence Report"
      case "HYDRATION_REMINDERS":
        return "Hydration Analysis"
      case "EXERCISE_RECOMMENDATIONS":
        return "Exercise Recommendations"
      default:
        return "Health Report"
    }
  }

  const getReportContent = (type: string) => {
    switch (type) {
      case "GENERAL_HEALTH":
        return "Based on your recent vital signs and health data, your overall health status is good. Your blood pressure and heart rate are within normal ranges. Continue maintaining your current lifestyle habits. Regular check-ups are recommended to monitor your health progress."
      case "NUTRITION":
        return "Your current diet shows good balance of macronutrients. Consider increasing your intake of leafy greens and reducing processed foods. Your vitamin D levels could be improved with more sunlight exposure or supplements."
      case "SUPPLEMENTS":
        return "Based on your health profile, consider adding Vitamin D and Omega-3 supplements to your daily routine. These may help improve your overall health and support your immune system. Always consult with your doctor before starting new supplements."
      case "MEDICATION_REMINDERS":
        return "Your medication adherence is excellent at 95%. Keep up the good work! Remember to take your blood pressure medication at the same time each day for optimal effectiveness. Set up reminders if needed."
      case "HYDRATION_REMINDERS":
        return "Your hydration levels are good. Continue drinking 8-10 glasses of water daily. Consider increasing water intake during exercise and hot weather. Proper hydration is essential for optimal body function."
      case "EXERCISE_RECOMMENDATIONS":
        return "Based on your health data, recommend 150 minutes of moderate exercise per week. Include both cardiovascular exercises and strength training. Start with 30-minute walks and gradually increase intensity."
      default:
        return "Your health report has been generated successfully."
    }
  }

  const getReportIcon = (type: string) => {
    switch (type) {
      case "GENERAL_HEALTH":
        return <Activity className="h-5 w-5" />
      case "NUTRITION":
        return <Apple className="h-5 w-5" />
      case "SUPPLEMENTS":
        return <Pill className="h-5 w-5" />
      case "MEDICATION_REMINDERS":
        return <Clock className="h-5 w-5" />
      case "HYDRATION_REMINDERS":
        return <Droplets className="h-5 w-5" />
      case "EXERCISE_RECOMMENDATIONS":
        return <Dumbbell className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getReportTypeDisplay = (type: string) => {
    switch (type) {
      case "GENERAL_HEALTH":
        return "General Health"
      case "NUTRITION":
        return "Nutrition"
      case "SUPPLEMENTS":
        return "Supplements"
      case "MEDICATION_REMINDERS":
        return "Medication Reminders"
      case "HYDRATION_REMINDERS":
        return "Hydration"
      case "EXERCISE_RECOMMENDATIONS":
        return "Exercise"
      default:
        return type
    }
  }

  const reportTypes = [
    { value: "GENERAL_HEALTH", label: "General Health Assessment", description: "Overall health analysis and recommendations" },
    { value: "NUTRITION", label: "Nutrition Analysis", description: "Diet assessment and nutritional advice" },
    { value: "SUPPLEMENTS", label: "Supplement Recommendations", description: "Personalized supplement suggestions" },
    { value: "MEDICATION_REMINDERS", label: "Medication Reminders", description: "Adherence tracking and reminders" },
    { value: "HYDRATION_REMINDERS", label: "Hydration Analysis", description: "Hydration status and recommendations" },
    { value: "EXERCISE_REMINDERS", label: "Exercise Recommendations", description: "Personalized exercise suggestions" }
  ]

  const getHealthStatus = () => {
    if (!vitalsData) return "unknown"
    
    const { bloodPressure, heartRate, temperature, bloodSugar } = vitalsData
    
    // Simple health status calculation
    let score = 0
    if (bloodPressure.systolic >= 90 && bloodPressure.systolic <= 120) score++
    if (bloodPressure.diastolic >= 60 && bloodPressure.diastolic <= 80) score++
    if (heartRate >= 60 && heartRate <= 100) score++
    if (temperature >= 97.0 && temperature <= 99.5) score++
    if (bloodSugar >= 70 && bloodSugar <= 140) score++
    
    if (score >= 4) return "excellent"
    if (score >= 3) return "good"
    if (score >= 2) return "fair"
    return "needs_attention"
  }

  const healthStatus = getHealthStatus()
  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-emerald-100 text-emerald-800"
      case "good":
        return "bg-green-100 text-green-800"
      case "fair":
        return "bg-yellow-100 text-yellow-800"
      case "needs_attention":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Health Reports</h1>
            <p className="text-gray-600 mt-2">
              Personalized health insights powered by artificial intelligence
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(healthStatus)}>
              {healthStatus === "excellent" ? "Excellent Health" : 
               healthStatus === "good" ? "Good Health" :
               healthStatus === "fair" ? "Fair Health" : "Needs Attention"}
            </Badge>
          </div>
        </div>

        {/* Health Overview */}
        {vitalsData && (
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Current Health Overview</span>
              </CardTitle>
              <CardDescription>
                Based on your latest vital signs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {vitalsData.bloodPressure.systolic}/{vitalsData.bloodPressure.diastolic}
                  </div>
                  <div className="text-sm text-gray-600">Blood Pressure</div>
                  <div className="text-xs text-emerald-600">Normal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {vitalsData.heartRate}
                  </div>
                  <div className="text-sm text-gray-600">Heart Rate</div>
                  <div className="text-xs text-emerald-600">Normal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {vitalsData.temperature}°F
                  </div>
                  <div className="text-sm text-gray-600">Temperature</div>
                  <div className="text-xs text-emerald-600">Normal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {vitalsData.weight}kg
                  </div>
                  <div className="text-sm text-gray-600">Weight</div>
                  <div className="text-xs text-emerald-600">Stable</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {vitalsData.bloodSugar}
                  </div>
                  <div className="text-sm text-gray-600">Blood Sugar</div>
                  <div className="text-xs text-emerald-600">Normal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {vitalsData.oxygenSaturation}%
                  </div>
                  <div className="text-sm text-gray-600">Oxygen Sat</div>
                  <div className="text-xs text-emerald-600">Normal</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="reports" className="space-y-4">
          <TabsList className="bg-emerald-100">
            <TabsTrigger 
              value="reports" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              My Reports
            </TabsTrigger>
            <TabsTrigger 
              value="generate" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Generate New
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4">
            {reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((report) => (
                  <Card key={report.id} className="border-emerald-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Brain className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                              {report.title}
                            </CardTitle>
                            <CardDescription className="flex items-center space-x-2 mt-1">
                              <span>{getReportTypeDisplay(report.reportType)}</span>
                              {report.isLatest && (
                                <Badge className="bg-emerald-100 text-emerald-800">
                                  Latest
                                </Badge>
                              )}
                              <span>•</span>
                              <span>{new Date(report.generatedAt).toLocaleDateString()}</span>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700">{report.content}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Brain className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No AI Reports Yet
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    Generate your first AI-powered health report to get personalized insights.
                  </p>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      const generateTab = document.querySelector('[value="generate"]') as HTMLElement
                      if (generateTab) generateTab.click()
                    }}
                  >
                    Generate Your First Report
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="generate" className="space-y-4">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Generate New AI Health Report</span>
                </CardTitle>
                <CardDescription>
                  Choose a report type to generate personalized health insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportTypes.map((type) => (
                    <Card key={type.value} className="border-emerald-100 hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {getReportIcon(type.value)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{type.label}</h3>
                            <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                            <Button 
                              size="sm" 
                              className="bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => generateReport(type.value)}
                              disabled={isGenerating}
                            >
                              {isGenerating ? (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  Generate Report
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {isGenerating && (
              <Card className="border-emerald-200">
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
                    <p className="text-gray-600">Generating your AI health report...</p>
                    <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    
  )
}