'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Video, 
  Phone, 
  Calendar, 
  Clock, 
  UserCheck, 
  FileText, 
  Pill,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  MessageSquare,
  Send,
  Download,
  Upload,
  HeartPulse,
  Thermometer,
  Activity,
  Weight,
  Ruler
} from 'lucide-react'
import { toast } from 'sonner'

interface Appointment {
  id: string
  patientName: string
  patientId: string
  type: 'video' | 'phone' | 'in-person'
  scheduledTime: string
  duration: number
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  chiefComplaint: string
  joinUrl?: string
}

interface ConsultationData {
  patientId: string
  appointmentId: string
  symptoms: string[]
  diagnosis: string[]
  prescriptions: Array<{
    medication: string
    dosage: string
    frequency: string
    duration: string
    instructions: string
  }>
  referrals: Array<{
    type: 'lab_test' | 'specialist' | 'hospital'
    name: string
    reason: string
    urgent: boolean
  }>
  vitalSigns: {
    bloodPressure: string
    heartRate: number
    temperature: number
    oxygenSaturation: number
    weight: number
    height: number
  }
  notes: string
}

export default function DoctorConsultation() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null)
  const [consultationData, setConsultationData] = useState<ConsultationData | null>(null)
  const [isConsultationActive, setIsConsultationActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isReferralDialogOpen, setIsReferralDialogOpen] = useState(false)
  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false)

  // Form states
  const [vitalSigns, setVitalSigns] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    oxygenSaturation: '',
    weight: '',
    height: ''
  })
  const [diagnosis, setDiagnosis] = useState('')
  const [notes, setNotes] = useState('')
  const [newReferral, setNewReferral] = useState({
    type: 'lab_test' as 'lab_test' | 'specialist' | 'hospital',
    name: '',
    reason: '',
    urgent: false
  })
  const [newPrescription, setNewPrescription] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  })

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user?.role !== 'DOCTOR') {
      router.push('/dashboard')
      return
    }

    fetchAppointments()
  }, [session, status, router])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isConsultationActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
    } else if (timeRemaining === 0 && isConsultationActive) {
      endConsultation()
    }
    return () => clearInterval(timer)
  }, [isConsultationActive, timeRemaining])

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      
      // Mock data for demonstration
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          patientName: 'Emily Johnson',
          patientId: 'P001',
          type: 'video',
          scheduledTime: new Date(Date.now() + 5 * 60000).toISOString(), // 5 minutes from now
          duration: 30,
          status: 'scheduled',
          chiefComplaint: 'Fever and sore throat for 3 days',
          joinUrl: 'https://meet.jit.si/doctor-consultation-123'
        },
        {
          id: '2',
          patientName: 'Michael Chen',
          patientId: 'P002',
          type: 'phone',
          scheduledTime: new Date(Date.now() + 45 * 60000).toISOString(), // 45 minutes from now
          duration: 20,
          status: 'scheduled',
          chiefComplaint: 'Follow-up for hypertension medication'
        },
        {
          id: '3',
          patientName: 'Sarah Williams',
          patientId: 'P003',
          type: 'video',
          scheduledTime: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
          duration: 30,
          status: 'in_progress',
          chiefComplaint: 'Annual checkup and prescription renewal',
          joinUrl: 'https://meet.jit.si/doctor-consultation-456'
        }
      ]

      setAppointments(mockAppointments)
      
      // Set current appointment (in progress or next scheduled)
      const inProgress = mockAppointments.find(apt => apt.status === 'in_progress')
      const nextScheduled = mockAppointments.find(apt => apt.status === 'scheduled')
      setCurrentAppointment(inProgress || nextScheduled || null)
      
      if (inProgress) {
        startConsultation(inProgress)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Failed to load appointments')
    } finally {
      setIsLoading(false)
    }
  }

  const startConsultation = (appointment: Appointment) => {
    setCurrentAppointment(appointment)
    setIsConsultationActive(true)
    setTimeRemaining(appointment.duration * 60) // Convert minutes to seconds
    
    // Initialize consultation data
    setConsultationData({
      patientId: appointment.patientId,
      appointmentId: appointment.id,
      symptoms: [],
      diagnosis: [],
      prescriptions: [],
      referrals: [],
      vitalSigns: {
        bloodPressure: '',
        heartRate: 0,
        temperature: 0,
        oxygenSaturation: 0,
        weight: 0,
        height: 0
      },
      notes: ''
    })
  }

  const joinVideoConsultation = () => {
    if (currentAppointment?.joinUrl) {
      window.open(currentAppointment.joinUrl, '_blank')
      toast.success('Opening video consultation...')
    }
  }

  const endConsultation = async () => {
    try {
      // Save consultation data
      if (consultationData) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        toast.success('Consultation completed and saved')
      }
      
      setIsConsultationActive(false)
      setCurrentAppointment(null)
      setConsultationData(null)
      fetchAppointments()
    } catch (error) {
      toast.error('Failed to save consultation data')
    }
  }

  const addDiagnosis = () => {
    if (diagnosis.trim() && consultationData) {
      setConsultationData({
        ...consultationData,
        diagnosis: [...consultationData.diagnosis, diagnosis.trim()]
      })
      setDiagnosis('')
    }
  }

  const removeDiagnosis = (index: number) => {
    if (consultationData) {
      setConsultationData({
        ...consultationData,
        diagnosis: consultationData.diagnosis.filter((_, i) => i !== index)
      })
    }
  }

  const updateVitalSigns = () => {
    if (consultationData) {
      setConsultationData({
        ...consultationData,
        vitalSigns: {
          bloodPressure: vitalSigns.bloodPressure,
          heartRate: parseFloat(vitalSigns.heartRate) || 0,
          temperature: parseFloat(vitalSigns.temperature) || 0,
          oxygenSaturation: parseFloat(vitalSigns.oxygenSaturation) || 0,
          weight: parseFloat(vitalSigns.weight) || 0,
          height: parseFloat(vitalSigns.height) || 0
        }
      })
      toast.success('Vital signs updated')
    }
  }

  const addReferral = () => {
    if (newReferral.name.trim() && newReferral.reason.trim() && consultationData) {
      setConsultationData({
        ...consultationData,
        referrals: [...consultationData.referrals, {
          type: newReferral.type,
          name: newReferral.name.trim(),
          reason: newReferral.reason.trim(),
          urgent: newReferral.urgent
        }]
      })
      setNewReferral({
        type: 'lab_test',
        name: '',
        reason: '',
        urgent: false
      })
      setIsReferralDialogOpen(false)
      toast.success('Referral added')
    }
  }

  const addPrescription = () => {
    if (newPrescription.medication.trim() && newPrescription.dosage.trim() && consultationData) {
      setConsultationData({
        ...consultationData,
        prescriptions: [...consultationData.prescriptions, {
          medication: newPrescription.medication.trim(),
          dosage: newPrescription.dosage.trim(),
          frequency: newPrescription.frequency.trim(),
          duration: newPrescription.duration.trim(),
          instructions: newPrescription.instructions.trim()
        }]
      })
      setNewPrescription({
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      })
      setIsPrescriptionDialogOpen(false)
      toast.success('Prescription added')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading consultation data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Consultation Room</h1>
          <p className="text-gray-600 mt-2">Manage patient consultations and provide care</p>
        </div>
      </div>

      {/* Current Consultation */}
      {currentAppointment && (
        <Card className="border-2 border-health-primary">
          <CardHeader className="bg-health-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  {currentAppointment.type === 'video' ? <Video className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
                  <span>Current Consultation</span>
                  <Badge className={getAppointmentStatusColor(currentAppointment.status)}>
                    {currentAppointment.status.replace('_', ' ')}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Patient: {currentAppointment.patientName} | {formatDateTime(currentAppointment.scheduledTime)}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-3">
                {isConsultationActive && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Time Remaining</p>
                    <p className="text-2xl font-bold text-red-600">{formatTime(timeRemaining)}</p>
                  </div>
                )}
                {currentAppointment.status === 'scheduled' && (
                  <Button onClick={() => startConsultation(currentAppointment)} className="bg-health-primary">
                    Start Consultation
                  </Button>
                )}
                {currentAppointment.status === 'in_progress' && currentAppointment.type === 'video' && (
                  <Button onClick={joinVideoConsultation} className="bg-green-600 hover:bg-green-700">
                    <Video className="mr-2 h-4 w-4" />
                    Join Video
                  </Button>
                )}
                {currentAppointment.status === 'in_progress' && (
                  <Button onClick={endConsultation} variant="outline">
                    End Consultation
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4">
              <p className="font-medium text-gray-900">Chief Complaint:</p>
              <p className="text-gray-600">{currentAppointment.chiefComplaint}</p>
            </div>

            {isConsultationActive && consultationData && (
              <Tabs defaultValue="vitals" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
                  <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
                  <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                  <TabsTrigger value="referrals">Referrals</TabsTrigger>
                </TabsList>

                <TabsContent value="vitals" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center space-x-2">
                        <HeartPulse className="h-4 w-4" />
                        <span>Blood Pressure</span>
                      </Label>
                      <Input
                        placeholder="120/80"
                        value={vitalSigns.bloodPressure}
                        onChange={(e) => setVitalSigns({...vitalSigns, bloodPressure: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center space-x-2">
                        <Activity className="h-4 w-4" />
                        <span>Heart Rate (bpm)</span>
                      </Label>
                      <Input
                        type="number"
                        placeholder="72"
                        value={vitalSigns.heartRate}
                        onChange={(e) => setVitalSigns({...vitalSigns, heartRate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center space-x-2">
                        <Thermometer className="h-4 w-4" />
                        <span>Temperature (°F)</span>
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="98.6"
                        value={vitalSigns.temperature}
                        onChange={(e) => setVitalSigns({...vitalSigns, temperature: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center space-x-2">
                        <Activity className="h-4 w-4" />
                        <span>Oxygen Saturation (%)</span>
                      </Label>
                      <Input
                        type="number"
                        placeholder="98"
                        value={vitalSigns.oxygenSaturation}
                        onChange={(e) => setVitalSigns({...vitalSigns, oxygenSaturation: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center space-x-2">
                        <Weight className="h-4 w-4" />
                        <span>Weight (lbs)</span>
                      </Label>
                      <Input
                        type="number"
                        placeholder="150"
                        value={vitalSigns.weight}
                        onChange={(e) => setVitalSigns({...vitalSigns, weight: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center space-x-2">
                        <Ruler className="h-4 w-4" />
                        <span>Height (in)</span>
                      </Label>
                      <Input
                        type="number"
                        placeholder="68"
                        value={vitalSigns.height}
                        onChange={(e) => setVitalSigns({...vitalSigns, height: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button onClick={updateVitalSigns} className="w-full">
                    Update Vital Signs
                  </Button>
                </TabsContent>

                <TabsContent value="diagnosis" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Add Diagnosis</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter diagnosis..."
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDiagnosis())}
                        className="flex-1"
                      />
                      <Button onClick={addDiagnosis}>Add</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Current Diagnoses</Label>
                    <div className="space-y-2">
                      {consultationData.diagnosis.map((diag, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>{diag}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDiagnosis(index)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {consultationData.diagnosis.length === 0 && (
                        <p className="text-gray-500 text-sm">No diagnoses added yet</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      placeholder="Add consultation notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="prescriptions" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Prescriptions</Label>
                    <Dialog open={isPrescriptionDialogOpen} onOpenChange={setIsPrescriptionDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Pill className="mr-2 h-4 w-4" />
                          Add Prescription
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Prescription</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="medication" className="text-right">Medication</Label>
                            <Input
                              id="medication"
                              value={newPrescription.medication}
                              onChange={(e) => setNewPrescription({...newPrescription, medication: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dosage" className="text-right">Dosage</Label>
                            <Input
                              id="dosage"
                              value={newPrescription.dosage}
                              onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="frequency" className="text-right">Frequency</Label>
                            <Input
                              id="frequency"
                              value={newPrescription.frequency}
                              onChange={(e) => setNewPrescription({...newPrescription, frequency: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="duration" className="text-right">Duration</Label>
                            <Input
                              id="duration"
                              value={newPrescription.duration}
                              onChange={(e) => setNewPrescription({...newPrescription, duration: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="instructions" className="text-right">Instructions</Label>
                            <Textarea
                              id="instructions"
                              value={newPrescription.instructions}
                              onChange={(e) => setNewPrescription({...newPrescription, instructions: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={addPrescription}>Add Prescription</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-2">
                    {consultationData.prescriptions.map((prescription, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{prescription.medication}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updated = consultationData.prescriptions.filter((_, i) => i !== index)
                              setConsultationData({...consultationData, prescriptions: updated})
                            }}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Dosage:</strong> {prescription.dosage}</p>
                          <p><strong>Frequency:</strong> {prescription.frequency}</p>
                          <p><strong>Duration:</strong> {prescription.duration}</p>
                          <p><strong>Instructions:</strong> {prescription.instructions}</p>
                        </div>
                      </div>
                    ))}
                    {consultationData.prescriptions.length === 0 && (
                      <p className="text-gray-500 text-sm">No prescriptions added yet</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="referrals" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Referrals</Label>
                    <Dialog open={isReferralDialogOpen} onOpenChange={setIsReferralDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          Add Referral
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Referral</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">Type</Label>
                            <Select
                              value={newReferral.type}
                              onValueChange={(value: 'lab_test' | 'specialist' | 'hospital') => 
                                setNewReferral({...newReferral, type: value})
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="lab_test">Lab Test</SelectItem>
                                <SelectItem value="specialist">Specialist</SelectItem>
                                <SelectItem value="hospital">Hospital</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input
                              id="name"
                              value={newReferral.name}
                              onChange={(e) => setNewReferral({...newReferral, name: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="reason" className="text-right">Reason</Label>
                            <Textarea
                              id="reason"
                              value={newReferral.reason}
                              onChange={(e) => setNewReferral({...newReferral, reason: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="urgent" className="text-right">Urgent</Label>
                            <div className="col-span-3">
                              <input
                                type="checkbox"
                                id="urgent"
                                checked={newReferral.urgent}
                                onChange={(e) => setNewReferral({...newReferral, urgent: e.target.checked})}
                                className="mr-2"
                              />
                              <Label htmlFor="urgent">Mark as urgent</Label>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={addReferral}>Add Referral</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-2">
                    {consultationData.referrals.map((referral, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{referral.name}</h4>
                            <Badge variant={referral.urgent ? "destructive" : "outline"}>
                              {referral.type.replace('_', ' ')}
                            </Badge>
                            {referral.urgent && <AlertTriangle className="h-4 w-4 text-red-600" />}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updated = consultationData.referrals.filter((_, i) => i !== index)
                              setConsultationData({...consultationData, referrals: updated})
                            }}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600"><strong>Reason:</strong> {referral.reason}</p>
                      </div>
                    ))}
                    {consultationData.referrals.length === 0 && (
                      <p className="text-gray-500 text-sm">No referrals added yet</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Upcoming Appointments</span>
          </CardTitle>
          <CardDescription>Your scheduled consultations for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments
              .filter(apt => apt.status === 'scheduled' || apt.status === 'in_progress')
              .map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-health-primary/10 rounded-full flex items-center justify-center">
                      {appointment.type === 'video' ? (
                        <Video className="h-6 w-6 text-health-primary" />
                      ) : (
                        <Phone className="h-6 w-6 text-health-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                      <p className="text-sm text-gray-600">{appointment.chiefComplaint}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{formatDateTime(appointment.scheduledTime)}</span>
                        <Badge className={getAppointmentStatusColor(appointment.status)}>
                          {appointment.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {appointment.status === 'scheduled' && (
                      <Button onClick={() => startConsultation(appointment)} className="bg-health-primary">
                        Start
                      </Button>
                    )}
                    {appointment.status === 'in_progress' && appointment.type === 'video' && (
                      <Button onClick={joinVideoConsultation} className="bg-green-600 hover:bg-green-700">
                        Join Video
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            {appointments.filter(apt => apt.status === 'scheduled' || apt.status === 'in_progress').length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No upcoming appointments scheduled
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}